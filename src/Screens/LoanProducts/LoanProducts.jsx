import React from "react";
import { generateClient } from "aws-amplify/api";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { UserContext } from "../../App";
import CustomDataGrid from "../../ComponentAssets/CustomDataGrid";
import CustomPopUp from "../../ComponentAssets/CustomPopUp";
import DeleteDialog from "../../ComponentAssets/DeleteDialog";
import { useTheme } from "@mui/material/styles";

// Placeholder for CreateLoanProductForm
function CreateLoanProductForm({ onClose, onCreateSuccess }) {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="body1">
        Create Loan Product Form (placeholder)
      </Typography>
      <Button onClick={onClose} sx={{ mt: 2 }}>
        Close
      </Button>
    </Box>
  );
}

// Placeholder for EditLoanProductForm
const EditLoanProductForm = React.forwardRef(
  ({ initialValues, onClose, onEditSuccess, isEditMode }, ref) => (
    <Box sx={{ p: 2 }}>
      <Typography variant="body1">
        Edit Loan Product Form (placeholder) for: {initialValues?.name}
      </Typography>
      <Button onClick={onClose} sx={{ mt: 2 }}>
        Close
      </Button>
    </Box>
  )
);

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
                        branchId
                        branch {
                          name
                        }
                      }
                    }
                    loanFees {
                      items {
                        id
                        loanFees {
                          loanFeesName
                        }
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

  // Select 5 relevant fields for the datagrid
  const columns = [
    { field: "name", headerName: "Name", width: 200 },
    { field: "description", headerName: "Description", width: 250 },
    { field: "principalAmountMin", headerName: "Min Principal", width: 120 },
    { field: "principalAmountMax", headerName: "Max Principal", width: 120 },
    {
      field: "interestRateDefault",
      headerName: "Default Interest Rate",
      width: 160,
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

      <CustomPopUp
        open={createDialogOpen}
        onClose={handleCreateDialogClose}
        title="Create Loan Product"
        showEdit={false}
        showDelete={false}
        maxWidth="md"
        fullWidth
      >
        <CreateLoanProductForm
          onClose={handleCreateDialogClose}
          onCreateSuccess={handleCreateSuccess}
        />
      </CustomPopUp>

      <CustomPopUp
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
          <EditLoanProductForm
            ref={formRef}
            initialValues={editDialogRow}
            onClose={handleEditDialogClose}
            onEditSuccess={handleEditSuccess}
            isEditMode={false}
          />
        )}
      </CustomPopUp>

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
