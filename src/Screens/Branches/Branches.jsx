import React from "react";
import { generateClient } from "aws-amplify/api";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import { UserContext } from "../../App";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import EditBranchesForm from "./EditBranchesForm";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import InputAdornment from "@mui/material/InputAdornment";
import ClearIcon from "@mui/icons-material/Clear";

export default function Branches() {
  const [branches, setBranches] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editDialogRow, setEditDialogRow] = React.useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleteDialogRow, setDeleteDialogRow] = React.useState(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState("");
  const theme = useTheme();
  const { userDetails } = React.useContext(UserContext);

  React.useEffect(() => {
    const fetchBranches = async () => {
      setLoading(true);
      try {
        const client = generateClient();
        if (!userDetails?.institutionUsersId) {
          setBranches([]);
          setLoading(false);
          return;
        }
        const result = await client.graphql({
          query: `
            query ListBranches($institutionId: ID!) {
              listBranches(
                filter: { institutionBranchesId: { eq: $institutionId } }
                limit: 100
              ) {
                items {
                  id
                  name
                  branchCode
                  address
                  status
                }
              }
            }
          `,
          variables: {
            institutionId: userDetails.institutionUsersId,
          },
        });
        setBranches(result.data.listBranches.items || []);
      } catch (err) {
        console.log("err::: ", err);
        setBranches([]);
      } finally {
        setLoading(false);
      }
    };
    if (userDetails?.institutionUsersId) {
      fetchBranches();
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
    setBranches((prev) =>
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
      await client.graphql({
        query: `
          mutation DeleteBranch($input: DeleteBranchInput!) {
            deleteBranch(input: $input) {
              id
            }
          }
        `,
        variables: {
          input: { id: deleteDialogRow.id },
        },
      });
      setBranches((prev) =>
        prev.filter((row) => row.id !== deleteDialogRow.id)
      );
      handleDeleteDialogClose();
    } catch (err) {
      setDeleteError("Failed to delete. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 220,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "branchCode",
      headerName: "Branch Code",
      width: 120,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "address",
      headerName: "Address",
      width: 250,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
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
        Branches{" "}
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
          to="/admin/add-branch"
        >
          Add Branch
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
          <Typography sx={{ mt: 4 }}>Loading branches...</Typography>
        ) : (
          <DataGrid
            rows={
              search
                ? branches.filter((row) =>
                    row.name?.toLowerCase().includes(search.toLowerCase())
                  )
                : branches
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
            }}
          />
        )}
      </Box>
      <Dialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        maxWidth="md"
        fullWidth
      >
        {editDialogRow && (
          <EditBranchesForm
            initialValues={editDialogRow}
            onClose={handleEditDialogClose}
            onEditSuccess={handleEditSuccess}
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
