import React from "react";
import { generateClient } from "aws-amplify/api";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import { UserContext } from "../../App"; // Add this import
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import EditLoanFeesForm from "./EditLoanFeesForm";
import InfoIcon from "@mui/icons-material/Info";
import Popover from "@mui/material/Popover";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import InputAdornment from "@mui/material/InputAdornment";
import ClearIcon from "@mui/icons-material/Clear";

const CATEGORY_LABELS = {
  non_deductable: "Non-Deductable Fee",
  deductable: "Deductable Fee",
  capitalized: "Capitalized Fee",
};

const CALCULATION_LABELS = {
  fixed: "Fixed",
  percentage: "%",
};

const PERCENTAGE_BASE_LABELS = {
  principal: "Principal",
  interest: "Interest",
  principal_interest: "(Principal + Interest)",
};

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
    deleteLoanProductLoanFeesConfig(input: $input)
  }
`;

export default function LoanFees() {
  const [loanFees, setLoanFees] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editDialogRow, setEditDialogRow] = React.useState(null);
  const [popoverAnchorEl, setPopoverAnchorEl] = React.useState(null);
  const [popoverContent, setPopoverContent] = React.useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleteDialogRow, setDeleteDialogRow] = React.useState(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState("");
  const theme = useTheme();
  const { userDetails } = React.useContext(UserContext); // Get userDetails from context

  React.useEffect(() => {
    const fetchLoanFees = async () => {
      setLoading(true);
      try {
        const client = generateClient();
        if (!userDetails?.institutionUsersId) {
          setLoanFees([]);
          setLoading(false);
          return;
        }
        const result = await client.graphql({
          query: `
            query ListLoanFeesConfigs($institutionId: ID!) {
              listLoanFeesConfigs(
                filter: { institutionLoanFeesConfigsId: { eq: $institutionId } }
                limit: 100
              ) {
                items {
                  id
                  name
                  calculationMethod
                  category
                  status
                  description
                  percentageBase
                  rate
                }
              }
            }
          `,
          variables: {
            institutionId: userDetails.institutionUsersId,
          },
        });
        setLoanFees(result.data.listLoanFeesConfigs.items || []);
      } catch (err) {
        setLoanFees([]);
      } finally {
        setLoading(false);
      }
    };
    if (userDetails?.institutionUsersId) {
      fetchLoanFees();
    }
  }, [userDetails?.institutionUsersId]);

  const handleInfoClick = (event, description) => {
    setPopoverAnchorEl(event.currentTarget);
    setPopoverContent(description);
  };

  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
    setPopoverContent("");
  };

  const handleEditDialogOpen = (row) => {
    setEditDialogRow(row);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setEditDialogRow(null);
  };

  // Add this function to update the row in loanFees state
  const handleEditSuccess = (updatedRow) => {
    setLoanFees((prev) =>
      prev.map((row) =>
        row.id === updatedRow.id ? { ...row, ...updatedRow } : row
      )
    );
    handleEditDialogClose();
  };

  // Delete dialog handlers
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

      // First, clear relationships with loan products
      console.log(
        "Clearing LoanProductLoanFeesConfigs for loan fee:",
        deleteDialogRow.id
      );
      const loanProductFeesResult = await client.graphql({
        query: LIST_LOAN_PRODUCT_LOAN_FEES_CONFIGS_QUERY,
        variables: { filter: { loanFeesConfigId: { eq: deleteDialogRow.id } } },
      });
      const items =
        loanProductFeesResult.data.listLoanProductLoanFeesConfigs.items;
      console.log(`Found ${items.length} LoanProductLoanFeesConfigs to delete`);
      for (const item of items) {
        console.log("Deleting LoanProductLoanFeesConfig:", item.id);
        await client.graphql({
          query: DELETE_LOAN_PRODUCT_LOAN_FEES_CONFIG_MUTATION,
          variables: { input: { id: item.id } },
        });
      }
      console.log("Finished clearing LoanProductLoanFeesConfigs");

      await client.graphql({
        query: `
          mutation DeleteLoanFeesConfig($input: DeleteLoanFeesConfigInput!) {
            deleteLoanFeesConfig(input: $input) {
              id
            }
          }
        `,
        variables: {
          input: { id: deleteDialogRow.id },
        },
      });
      setLoanFees((prev) =>
        prev.filter((row) => row.id !== deleteDialogRow.id)
      );
      handleDeleteDialogClose();
    } catch (err) {
      console.error("Error deleting loan fee:", err);
      setDeleteError("Failed to delete. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 250,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <span
            style={{
              color: theme.palette.blueText?.main || "#1976d2",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            {params.value}
          </span>
          {params.row.description && (
            <IconButton
              size="small"
              onClick={(e) => handleInfoClick(e, params.row.description)}
              sx={{ ml: 1 }}
            >
              <InfoIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      ),
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 220,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const currency = userDetails?.institution?.currencyCode || "$";
        const value =
          params.row.rate !== undefined && params.row.rate !== null
            ? Number(params.row.rate).toLocaleString()
            : "-";
        if (params.row.calculationMethod === "percentage") {
          // Example: "2% of Principal"
          const base =
            PERCENTAGE_BASE_LABELS[params.row.percentageBase] ||
            params.row.percentageBase ||
            "";
          return value !== "-" ? `${value}% of ${base}` : "-";
        }
        if (params.row.calculationMethod === "fixed") {
          // Example: "$ 2,000"
          return value !== "-" ? `${currency} ${value}` : "-";
        }
        return "-";
      },
    },
    {
      field: "calculationMethod",
      headerName: "Type",
      width: 70,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => CALCULATION_LABELS[params.value] || params.value,
    },
    {
      field: "category",
      headerName: "Category",
      width: 160,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => CATEGORY_LABELS[params.value] || params.value,
    },
    {
      field: "status",
      headerName: "Status",
      width: 80,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) =>
        params.value
          ? params.value.charAt(0).toUpperCase() + params.value.slice(1)
          : "",
    },
    {
      field: "actions",
      headerName: "",
      width: 80,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            sx={{ mr: 1 }}
            onClick={() => handleEditDialogOpen(params.row)}
          >
            <EditIcon
              fontSize="small"
              sx={{ color: theme.palette.blueText?.main }}
            />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDeleteDialogOpen(params.row)}
          >
            <DeleteIcon fontSize="small" sx={{ color: "red" }} />
          </IconButton>
        </Box>
      ),
    },
  ];

  const openPopover = Boolean(popoverAnchorEl);
  const popoverId = openPopover ? "description-popover" : undefined;

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
      <Typography
        variant="h4"
        sx={{ mb: 2, fontWeight: 600, my: 2, textTransform: "none" }}
      >
        Loan Fees{" "}
        <Typography variant="caption" sx={{ color: "#90a4ae" }}>
          Help
        </Typography>
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button
          variant="contained"
          color="success"
          sx={{ mb: 2 }}
          component={Link}
          to="/admin/add-loan-fee"
        >
          Add Loan Fee
        </Button>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 220 }}
          InputProps={{
            endAdornment: search && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  aria-label="clear search"
                  onClick={() => setSearch("")}
                  edge="end"
                >
                  <ClearIcon size="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Box sx={{ height: 520, width: "100%" }}>
        {loading ? (
          <Typography sx={{ mt: 4 }}>Loading loan fees...</Typography>
        ) : (
          <DataGrid
            rows={
              search
                ? loanFees.filter((row) =>
                    row.name?.toLowerCase().includes(search.toLowerCase())
                  )
                : loanFees
            }
            columns={columns}
            getRowId={(row) => row.id}
            density="compact"
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 25,
                },
              },
            }}
            pageSizeOptions={[25, 50, 100]}
            disableRowSelectionOnClick
            sx={{
              "& .MuiDataGrid-cell": {
                borderBottom: `1px solid ${
                  theme.palette.primary?.gridBottomBorder || "#e0e0e0"
                }`,
              },
              "& .MuiDataGrid-columnHeaders": {
                // borderBottom: '2px solid #bdbdbd',
              },
            }}
          />
        )}
      </Box>
      <Popover
        id={popoverId}
        open={openPopover}
        anchorEl={popoverAnchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Typography sx={{ p: 2, maxWidth: 350, fontSize: "0.875rem" }}>
          {popoverContent}
        </Typography>
      </Popover>
      <Dialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        maxWidth="md"
        fullWidth
      >
        {editDialogRow && (
          <EditLoanFeesForm
            initialValues={editDialogRow}
            onClose={handleEditDialogClose}
            onEditSuccess={handleEditSuccess} // Pass callback
          />
        )}
      </Dialog>
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Confirm Delete
          </Typography>
          <Typography sx={{ mb: 2 }}>
            Are you sure you want to delete <b>{deleteDialogRow?.name}</b>?
          </Typography>
          {deleteError && (
            <Typography color="error" sx={{ mb: 1 }}>
              {deleteError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteLoading}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
