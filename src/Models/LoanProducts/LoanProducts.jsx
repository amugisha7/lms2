import React from "react";
import { generateClient } from "aws-amplify/api";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { UserContext } from "../../App";
import CustomDataGrid from "../../ComponentAssets/CustomDataGrid";
import CustomSlider from "../../ComponentAssets/CustomSlider";
import DeleteDialog from "../../ComponentAssets/DeleteDialog";
import { useTheme } from "@mui/material/styles";
import ClickableText from "../../ComponentAssets/ClickableText";
import EditLoanProduct from "./EditLoanProduct/EditLoanProduct";
import CreateLoanProduct from "./CreateLoanProduct/CreateLoanProduct";

export default function LoanProducts() {
  const [loanProducts, setLoanProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [search] = React.useState("");
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editDialogRow, setEditDialogRow] = React.useState(null);
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleteDialogRow, setDeleteDialogRow] = React.useState(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState("");
  const [editMode, setEditMode] = React.useState(false);
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [viewDialogRow, setViewDialogRow] = React.useState(null);
  const formRef = React.useRef();
  const { userDetails } = React.useContext(UserContext);
  const theme = useTheme();

  React.useEffect(() => {
    const fetchLoanProducts = async () => {
      setLoading(true);
      try {
        const client = generateClient();
        if (!userDetails?.institutionUsersId) {
          setLoanProducts([]);
          setLoading(false);
          return;
        }

        let allLoanProducts = [];
        let nextToken = null;

        do {
          const result = await client.graphql({
            query: `
              query ListLoanProducts($institutionId: ID!, $nextToken: String) {
                listLoanProducts(
                  filter: { institutionLoanProductsId: { eq: $institutionId } }
                  limit: 100
                  nextToken: $nextToken
                ) {
                  nextToken
                  items {
                    calculateInterestOn
                    durationPeriod
                    extendLoanAfterMaturity
                    id
                    interestCalculationMethod
                    interestPeriod
                    interestRateDefault
                    interestRateMax
                    interestRateMin
                    interestType
                    interestTypeMaturity
                    loanInterestRateAfterMaturity
                    name
                    principalAmountDefault
                    principalAmountMax
                    principalAmountMin
                    recurringPeriodAfterMaturityUnit
                    repaymentFrequency
                    repaymentOrder
                    termDurationDefault
                    termDurationMax
                    termDurationMin
                    branches {
                      items {
                        branch {
                          name
                          id
                        }
                      }
                    }
                    loanFees {
                      items {
                        id
                      }
                    }
                  }
                }
              }
            `,
            variables: {
              institutionId: userDetails.institutionUsersId,
              nextToken: nextToken,
            },
          });

          const items = result.data.listLoanProducts.items || [];
          allLoanProducts = [...allLoanProducts, ...items];
          nextToken = result.data.listLoanProducts.nextToken;
        } while (nextToken);

        setLoanProducts(allLoanProducts);
      } catch (err) {
        console.log("err::: ", err);
        setLoanProducts([]);
      } finally {
        setLoading(false);
      }
    };
    if (userDetails?.institutionUsersId) {
      fetchLoanProducts();
    }
  }, [userDetails?.institutionUsersId]);

  const handleEditDialogOpen = (row) => {
    setEditDialogRow(row);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setEditDialogRow(null);
  };

  const handleEditSuccess = (updatedRow) => {
    setLoanProducts((prev) =>
      prev.map((row) =>
        row.id === updatedRow.id ? { ...row, ...updatedRow } : row
      )
    );
    handleEditDialogClose();
  };

  const handleDeleteDialogOpen = (row) => {
    setDeleteDialogRow(row);
    setDeleteDialogOpen(true);
    setDeleteError("");
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setDeleteDialogRow(null);
    setDeleteError("");
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    setDeleteError("");
    try {
      const client = generateClient();
      // Placeholder mutation for deleting a loan product
      await client.graphql({
        query: `
          mutation DeleteLoanProduct($input: DeleteLoanProductInput!) {
            deleteLoanProduct(input: $input) {
              id
            }
          }
        `,
        variables: {
          input: { id: deleteDialogRow.id },
        },
      });
      setLoanProducts((prev) =>
        prev.filter((row) => row.id !== deleteDialogRow.id)
      );
      handleDeleteDialogClose();
    } catch (err) {
      setDeleteError("Failed to delete. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEditClick = () => {
    if (formRef.current && formRef.current.toggleEdit) {
      formRef.current.toggleEdit();
      setEditMode(formRef.current.getEditMode());
    }
  };

  const handlePopupDeleteClick = () => {
    setEditDialogOpen(false);
    if (editDialogRow) {
      handleDeleteDialogOpen(editDialogRow);
    }
  };

  const handleCreateDialogOpen = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
  };

  const handleCreateSuccess = (newLoanProduct) => {
    setLoanProducts((prev) => [...prev, newLoanProduct]);
    handleCreateDialogClose();
  };

  const handleViewDialogOpen = (row) => {
    setViewDialogRow(row);
    setViewDialogOpen(true);
  };

  const handleViewDialogClose = () => {
    setViewDialogOpen(false);
    setViewDialogRow(null);
  };

  // Updated columns to show only name, branches, and status
  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 250,
      renderCell: (params) => (
        <ClickableText onClick={() => handleViewDialogOpen(params.row)}>
          {params.value}
        </ClickableText>
      ),
    },
    {
      field: "branches",
      headerName: "Branches",
      width: 300,
      renderCell: (params) => {
        const branchNames =
          params.row.branches?.items
            ?.map((item) => item.branch?.name)
            .filter(Boolean) || [];
        return branchNames.length > 0
          ? branchNames.join(", ")
          : "No branches assigned";
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        // Status is "Active" if not set or if explicitly active
        const status = params.row.status || "Active";
        return status;
      },
    },
  ];

  return (
    <Box
      sx={{
        mx: { xs: 0, sm: "auto" },
        mt: { xs: 0, sm: 0 },
        p: { xs: 0, sm: 0 },
        borderRadius: 1,
        display: "flex",
        flexDirection: "column",
        maxWidth: { xs: "100%", md: 1000 },
        width: "100%",
        flex: 1,
        mb: 6,
      }}
    >
      <Box
        sx={{
          mb: 2,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{ mb: 2, fontWeight: 600, my: 2, textTransform: "none" }}
        >
          Loan Products{" "}
          <Typography variant="caption" sx={{ color: "#90a4ae" }}>
            Help
          </Typography>
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleCreateDialogOpen}
          >
            Add Loan Product
          </Button>
        </Box>
      </Box>
      <Box sx={{ width: "100%" }}>
        {/* Show info text if no loan products */}
        {!loading && loanProducts.length === 0 && (
          <Typography
            sx={{ mb: 2, color: theme.palette.blueText?.main || "#1976d2" }}
          >
            No loan products found. Please create a loan product to get started.
          </Typography>
        )}
        {loading ? (
          <Typography sx={{ mt: 4 }}>Loading loan products...</Typography>
        ) : (
          <CustomDataGrid
            rows={
              search
                ? loanProducts.filter((row) =>
                    row.name?.toLowerCase().includes(search.toLowerCase())
                  )
                : loanProducts
            }
            columns={columns}
            getRowId={(row) => row.id}
            pageSize={25}
            pageSizeOptions={[25, 50, 100]}
            loading={loading}
          />
        )}
      </Box>

      <CustomSlider
        open={createDialogOpen}
        onClose={handleCreateDialogClose}
        title="Create Loan Product"
        showEdit={false}
        showDelete={false}
        maxWidth="md"
        fullWidth
      >
        <CreateLoanProduct
          onClose={handleCreateDialogClose}
          onCreateSuccess={handleCreateSuccess}
        />
      </CustomSlider>

      <CustomSlider
        open={viewDialogOpen}
        onClose={handleViewDialogClose}
        title={viewDialogRow ? `${viewDialogRow.name}` : "Loan Product Details"}
        showEdit={true}
        showDelete={true}
        onEdit={() => handleEditDialogOpen(viewDialogRow)}
        onDelete={() => {
          setViewDialogOpen(false);
          handleDeleteDialogOpen(viewDialogRow);
        }}
        maxWidth="md"
        fullWidth
      >
        {viewDialogRow && (
          <EditLoanProduct
            initialValues={viewDialogRow}
            onClose={handleViewDialogClose}
            isEditMode={false}
          />
        )}
      </CustomSlider>

      <CustomSlider
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        title={editDialogRow ? `${editDialogRow.name}` : "Loan Product Details"}
        onEdit={handleEditClick}
        onDelete={handlePopupDeleteClick}
        maxWidth="md"
        fullWidth
        editMode={editMode}
      >
        {editDialogRow && (
          <EditLoanProduct
            ref={formRef}
            initialValues={editDialogRow}
            onClose={handleEditDialogClose}
            onEditSuccess={handleEditSuccess}
            isEditMode={true}
          />
        )}
      </CustomSlider>

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        error={deleteError}
        name={deleteDialogRow?.name}
      />
    </Box>
  );
}
