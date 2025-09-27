import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { generateClient } from "aws-amplify/api";
import { UserContext } from "../../App";

// Reusable components
import CustomDataGrid from "../../ModelAssets/CustomDataGrid";
import CustomSlider from "../../ModelAssets/CustomSlider";
import DeleteDialog from "../../ModelAssets/DeleteDialog";
import NotificationBar from "../../ModelAssets/NotificationBar";
import ClickableText from "../../ModelAssets/ClickableText";

// Model-specific components
import CreateBorrower from "./CreateBorrower/CreateBorrower";

// GraphQL queries
import {
  LIST_BORROWERS_QUERY,
  CREATE_BORROWER_MUTATION,
  UPDATE_BORROWER_MUTATION,
  DELETE_BORROWER_MUTATION,
} from "./borrowerQueries";

export default function SimplifiedBorrowers() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { userDetails } = useContext(UserContext);
  const client = React.useMemo(() => generateClient(), []);

  // State management
  const [borrowers, setBorrowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    message: "",
    color: "green",
  });

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Selected items
  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const [borrowerToDelete, setBorrowerToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch borrowers
  const fetchBorrowers = async () => {
    if (!userDetails?.branchUsersId) return;

    setLoading(true);
    try {
      let allBorrowers = [];
      let nextToken = null;

      do {
        const result = await client.graphql({
          query: LIST_BORROWERS_QUERY,
          variables: {
            branchId: userDetails.branchUsersId,
            ...(nextToken && { nextToken }),
          },
        });

        const batch = result?.data?.listBorrowers?.items || [];
        allBorrowers.push(...batch);
        nextToken = result?.data?.listBorrowers?.nextToken;
      } while (nextToken);

      // Process borrowers
      const processed = allBorrowers.map((borrower) => ({
        ...borrower,
        displayName: getBorrowerDisplayName(borrower),
      }));

      setBorrowers(processed);
    } catch (error) {
      console.error("Error fetching borrowers:", error);
      setNotification({ message: "Error loading borrowers", color: "red" });
    } finally {
      setLoading(false);
    }
  };

  // Helper function
  const getBorrowerDisplayName = (borrower) => {
    const fullName = [borrower.firstname, borrower.othername]
      .filter(Boolean)
      .join(" ");
    return fullName
      ? `${fullName}${
          borrower.businessName ? ` (${borrower.businessName})` : ""
        }`
      : borrower.businessName || "Unnamed Borrower";
  };

  // CRUD operations
  const handleCreate = async (formData) => {
    try {
      const input = {
        ...formData,
        branchBorrowersId: userDetails.branchUsersId,
      };

      const result = await client.graphql({
        query: CREATE_BORROWER_MUTATION,
        variables: { input },
      });

      const newBorrower = {
        ...result.data.createBorrower,
        displayName: getBorrowerDisplayName(result.data.createBorrower),
      };

      setBorrowers((prev) => [...prev, newBorrower]);
      setNotification({
        message: `${newBorrower.displayName} created successfully!`,
        color: "green",
      });
      setCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating borrower:", error);
      setNotification({ message: "Error creating borrower", color: "red" });
    }
  };

  const handleUpdate = async (formData) => {
    try {
      const input = {
        id: selectedBorrower.id,
        ...formData,
      };

      const result = await client.graphql({
        query: UPDATE_BORROWER_MUTATION,
        variables: { input },
      });

      const updatedBorrower = {
        ...result.data.updateBorrower,
        displayName: getBorrowerDisplayName(result.data.updateBorrower),
      };

      setBorrowers((prev) =>
        prev.map((b) => (b.id === updatedBorrower.id ? updatedBorrower : b))
      );
      setNotification({
        message: `${updatedBorrower.displayName} updated successfully!`,
        color: "green",
      });
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating borrower:", error);
      setNotification({ message: "Error updating borrower", color: "red" });
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await client.graphql({
        query: DELETE_BORROWER_MUTATION,
        variables: { input: { id: borrowerToDelete.id } },
      });

      setBorrowers((prev) => prev.filter((b) => b.id !== borrowerToDelete.id));
      setNotification({
        message: `${borrowerToDelete.displayName} deleted successfully!`,
        color: "green",
      });
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting borrower:", error);
      setNotification({ message: "Error deleting borrower", color: "red" });
    } finally {
      setDeleteLoading(false);
    }
  };

  // Event handlers
  const openEditDialog = (borrower) => {
    setSelectedBorrower(borrower);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (borrower) => {
    setBorrowerToDelete(borrower);
    setDeleteDialogOpen(true);
  };

  // Data grid configuration
  const columns = [
    {
      field: "displayName",
      headerName: "Full Name / Business Name",
      width: 280,
      renderCell: (params) => (
        <ClickableText onClick={() => navigate(`/borrowers/${params.row.id}`)}>
          {params.value}
        </ClickableText>
      ),
    },
    {
      field: "phoneNumber",
      headerName: "Phone No.",
      width: 140,
    },
    {
      field: "otherPhoneNumber",
      headerName: "Alt. Phone No.",
      width: 140,
    },
    {
      field: "email",
      headerName: "Email",
      width: 240,
    },
  ];

  // Effects
  useEffect(() => {
    fetchBorrowers();
  }, [userDetails?.branchUsersId]);

  return (
    <>
      <NotificationBar
        message={notification.message}
        color={notification.color}
      />

      <Box>
        {/* Header */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Borrowers
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setCreateDialogOpen(true)}
            sx={{
              borderColor: theme.palette.blueText.main,
              color: theme.palette.blueText.main,
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: "transparent",
                borderColor: theme.palette.blueText.main,
                borderWidth: "2px",
              },
            }}
          >
            Create Borrower
          </Button>
        </Box>

        {/* Data Grid */}
        <CustomDataGrid
          rows={borrowers}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          pageSize={25}
          pageSizeOptions={[25, 50, 100]}
        />

        {/* Create Dialog */}
        <CustomSlider
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          title="Create Borrower"
          showEdit={false}
          showDelete={false}
        >
          <CreateBorrower
            onCreateBorrowerAPI={handleCreate}
            onClose={() => setCreateDialogOpen(false)}
            isEditMode={false}
          />
        </CustomSlider>

        {/* Edit Dialog */}
        <CustomSlider
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          title={selectedBorrower?.displayName || "Edit Borrower"}
          showEdit={false}
          showDelete={false}
        >
          <CreateBorrower
            initialValues={selectedBorrower}
            onUpdateBorrowerAPI={handleUpdate}
            onClose={() => setEditDialogOpen(false)}
            isEditMode={true}
            forceEditMode={true}
          />
        </CustomSlider>

        {/* Delete Dialog */}
        <DeleteDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          loading={deleteLoading}
          name={borrowerToDelete?.displayName}
        />
      </Box>
    </>
  );
}
