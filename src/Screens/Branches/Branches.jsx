import React from "react";
import { generateClient } from "aws-amplify/api";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { UserContext } from "../../App";
import EditBranchesForm from "./EditBranchesForm";
import ClickableText from "../../ComponentAssets/ClickableText";
import CustomDataGrid from "../../ComponentAssets/CustomDataGrid";
import CustomPopUp from "../../ComponentAssets/CustomPopUp";
import DeleteDialog from "../../ComponentAssets/DeleteDialog";
import CreateBranchesForm from "./CreateBranchesForm";

export default function Branches() {
  const [branches, setBranches] = React.useState([]);
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

  const handleEditClick = () => {
    if (formRef.current) {
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

  const handleCreateSuccess = (newBranch) => {
    setBranches((prev) => [...prev, newBranch]);
    handleCreateDialogClose();
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 220,
      renderCell: (params) => (
        <ClickableText onClick={() => handleEditDialogOpen(params.row)}>
          {params.value}
        </ClickableText>
      ),
    },
    {
      field: "branchCode",
      headerName: "Branch Code",
      width: 180,
    },
    {
      field: "address",
      headerName: "Address",
      width: 250,
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) =>
        params.value
          ? params.value.charAt(0).toUpperCase() + params.value.slice(1)
          : "",
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
          Branches{" "}
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
            Add Branch
          </Button>
        </Box>
      </Box>
      <Box sx={{ width: "100%" }}>
        {loading ? (
          <Typography sx={{ mt: 4 }}>Loading branches...</Typography>
        ) : (
          <CustomDataGrid
            rows={
              search
                ? branches.filter((row) =>
                    row.name?.toLowerCase().includes(search.toLowerCase())
                  )
                : branches
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
        title="Create Branch"
        showEdit={false}
        showDelete={false}
        maxWidth="md"
        fullWidth
      >
        <CreateBranchesForm
          onClose={handleCreateDialogClose}
          onCreateSuccess={handleCreateSuccess}
        />
      </CustomPopUp>

      <CustomPopUp
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        title={editDialogRow ? `${editDialogRow.name}` : "Branch Details"}
        onEdit={handleEditClick}
        onDelete={handlePopupDeleteClick}
        maxWidth="md"
        fullWidth
        editMode={editMode}
      >
        {editDialogRow && (
          <EditBranchesForm
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
