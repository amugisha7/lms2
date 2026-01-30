import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { generateClient } from "aws-amplify/api";
import { UserContext } from "../../App";
import EditLoanProduct from "./EditLoanProduct/EditLoanProduct";
import DeleteDialog from "../../ModelAssets/DeleteDialog";
import NotificationBar from "../../ModelAssets/NotificationBar";

const GET_LOAN_PRODUCT_QUERY = `
  query GetLoanProduct($id: ID!) {
    getLoanProduct(id: $id) {
      calculateInterestOn
      description
      durationPeriod
      extendLoanAfterMaturity
      id
      institutionLoanProductsId
      interestCalculationMethod
      interestPeriod
      interestRateDefault
      interestRateMax
      interestRateMin
      interestType
      interestTypeMaturity
      loanInterestRateAfterMaturity
      name
      status
      principalAmountDefault
      principalAmountMax
      principalAmountMin
      recurringPeriodAfterMaturityUnit
      repaymentFrequency
      repaymentOrder
      termDurationDefault
      termDurationMax
      termDurationMin
      customLoanProductDetails
      branches {
        items {
          branch {
            id
            name
          }
        }
      }
      loanFeesConfigs {
        items {
          loanFeesConfig {
            id
            name
          }
        }
      }
    }
  }
`;

const LIST_LOAN_PRODUCT_LOAN_FEES_CONFIGS_QUERY = `
  query ListLoanProductLoanFeesConfigs($filter: ModelLoanProductLoanFeesConfigFilterInput) {
    listLoanProductLoanFeesConfigs(filter: $filter) {
      items {
        id
      }
    }
  }
`;

const DELETE_LOAN_PRODUCT_LOAN_FEES_CONFIG_MUTATION = `
  mutation DeleteLoanProductLoanFeesConfig($input: DeleteLoanProductLoanFeesConfigInput!) {
    deleteLoanProductLoanFeesConfig(input: $input) {
      id
    }
  }
`;

const LIST_BRANCH_LOAN_PRODUCTS_QUERY = `
  query ListBranchLoanProducts($filter: ModelBranchLoanProductFilterInput) {
    listBranchLoanProducts(filter: $filter) {
      items {
        id
      }
    }
  }
`;

const DELETE_BRANCH_LOAN_PRODUCT_MUTATION = `
  mutation DeleteBranchLoanProduct($input: DeleteBranchLoanProductInput!) {
    deleteBranchLoanProduct(input: $input) {
      id
    }
  }
`;

const DELETE_LOAN_PRODUCT_MUTATION = `
  mutation DeleteLoanProduct($input: DeleteLoanProductInput!) {
    deleteLoanProduct(input: $input) {
      id
    }
  }
`;

export default function LoanProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userDetails } = useContext(UserContext);
  const formRef = React.useRef();

  const [loading, setLoading] = useState(true);
  const [loanProduct, setLoanProduct] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [notification, setNotification] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const client = React.useMemo(() => generateClient(), []);

  const loadLoanProduct = useCallback(async () => {
    if (!id) return;
    setLoading(true);

    try {
      const result = await client.graphql({
        query: GET_LOAN_PRODUCT_QUERY,
        variables: { id },
      });

      const data = result?.data?.getLoanProduct;
      if (data) {
        setLoanProduct(data);
      } else {
        setNotification({
          type: "error",
          message: "Loan product not found",
        });
      }
    } catch (err) {
      console.error("Failed to load loan product:", err);
      setNotification({
        type: "error",
        message: err?.message || "Failed to load loan product",
      });
    } finally {
      setLoading(false);
    }
  }, [id, client]);

  useEffect(() => {
    loadLoanProduct();
  }, [loadLoanProduct]);

  const handleEditSuccess = (updatedProduct) => {
    setLoanProduct(updatedProduct);
    setEditMode(false);
    setNotification({
      type: "success",
      message: "Loan product updated successfully",
    });
  };

  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true);
    setDeleteError("");
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setDeleteError("");
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    setDeleteError("");
    try {
      // Clear relationships with loan fees configs
      const loanFeesConfigsResult = await client.graphql({
        query: LIST_LOAN_PRODUCT_LOAN_FEES_CONFIGS_QUERY,
        variables: { filter: { loanProductId: { eq: id } } },
      });
      const feeItems =
        loanFeesConfigsResult.data.listLoanProductLoanFeesConfigs.items;
      for (const item of feeItems) {
        await client.graphql({
          query: DELETE_LOAN_PRODUCT_LOAN_FEES_CONFIG_MUTATION,
          variables: { input: { id: item.id } },
        });
      }

      // Clear relationships with branches
      const branchLoanProductsResult = await client.graphql({
        query: LIST_BRANCH_LOAN_PRODUCTS_QUERY,
        variables: { filter: { loanProductId: { eq: id } } },
      });
      const branchItems =
        branchLoanProductsResult.data.listBranchLoanProducts.items;
      for (const item of branchItems) {
        await client.graphql({
          query: DELETE_BRANCH_LOAN_PRODUCT_MUTATION,
          variables: { input: { id: item.id } },
        });
      }

      // Delete the loan product
      await client.graphql({
        query: DELETE_LOAN_PRODUCT_MUTATION,
        variables: { input: { id } },
      });

      handleDeleteDialogClose();
      navigate("/admin/loan-products");
    } catch (err) {
      console.error("Error deleting loan product:", err);
      setDeleteError("Failed to delete. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!loanProduct) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Loan product not found</Typography>
        <Button
          sx={{ mt: 2 }}
          variant="outlined"
          onClick={() => navigate("/admin/loan-products")}
        >
          Back to Loan Products
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        mx: { xs: 0, sm: "auto" },
        mt: { xs: 0, sm: 0 },
        p: { xs: 2, sm: 2 },
        borderRadius: 1,
        display: "flex",
        flexDirection: "column",
        maxWidth: { xs: "100%", md: 1000 },
        width: "100%",
        flex: 1,
        mb: 6,
      }}
    >
      {notification && (
        <NotificationBar
          notification={notification}
          clearNotification={() => setNotification(null)}
        />
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={() => navigate("/admin/loan-products")}
            sx={{ mr: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {loanProduct.name}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Status: {loanProduct.status || "Active"}
              {loanProduct.branches?.items?.length > 0 &&
                ` • Branches: ${loanProduct.branches.items
                  .map((b) => b.branch?.name)
                  .filter(Boolean)
                  .join(", ")}`}
            </Typography>
          </Box>
        </Box>
        {!editMode && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleEditClick}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteDialogOpen}
            >
              Delete
            </Button>
          </Box>
        )}
      </Box>

      <Box sx={{ mt: 2 }}>
        <EditLoanProduct
          ref={formRef}
          initialValues={loanProduct}
          onEditSuccess={handleEditSuccess}
          isEditMode={editMode}
          onCancel={handleCancelEdit}
        />
      </Box>

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        error={deleteError}
        name={loanProduct?.name}
      />
    </Box>
  );
}
