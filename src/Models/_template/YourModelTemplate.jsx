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

// TODO: Replace with your model-specific imports
// import CreateYourModel from "./CreateYourModel/CreateYourModel";
// import { LIST_QUERY, CREATE_MUTATION, UPDATE_MUTATION, DELETE_MUTATION } from "./yourModelQueries";

/**
 * Generic Model Template
 *
 * To create a new model, copy this file and:
 * 1. Replace "YourModel" with your model name (e.g., "Loans", "Branches")
 * 2. Replace GraphQL queries with your model's queries
 * 3. Update the columns configuration
 * 4. Modify the CRUD operations to match your model's fields
 * 5. Update the display name logic
 * 6. Add any model-specific business logic
 */

export default function YourModelTemplate() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { userDetails } = useContext(UserContext);
  const client = React.useMemo(() => generateClient(), []);

  // State management
  const [items, setItems] = useState([]);
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
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // TODO: Replace with your model's fetch logic
  const fetchItems = async () => {
    if (!userDetails?.branchUsersId) return;

    setLoading(true);
    try {
      let allItems = [];
      let nextToken = null;

      do {
        const result = await client.graphql({
          query: "YOUR_LIST_QUERY", // Replace with your LIST_QUERY
          variables: {
            branchId: userDetails.branchUsersId,
            ...(nextToken && { nextToken }),
          },
        });

        const batch = result?.data?.listYourModels?.items || []; // Replace with your query result path
        allItems.push(...batch);
        nextToken = result?.data?.listYourModels?.nextToken; // Replace with your query result path
      } while (nextToken);

      // TODO: Process items if needed (e.g., add display names, calculations)
      const processed = allItems.map((item) => ({
        ...item,
        displayName: getItemDisplayName(item), // Replace with your display logic
      }));

      setItems(processed);
    } catch (error) {
      console.error("Error fetching items:", error);
      setNotification({ message: "Error loading items", color: "red" });
    } finally {
      setLoading(false);
    }
  };

  // TODO: Replace with your model's display name logic
  const getItemDisplayName = (item) => {
    return item.name || item.title || `Item ${item.id}`;
  };

  // CRUD operations
  const handleCreate = async (formData) => {
    try {
      const input = {
        ...formData,
        // TODO: Add any required relationship fields
        branchYourModelsId: userDetails.branchUsersId, // Replace with your branch relationship field
      };

      const result = await client.graphql({
        query: "YOUR_CREATE_MUTATION", // Replace with your CREATE_MUTATION
        variables: { input },
      });

      const newItem = {
        ...result.data.createYourModel, // Replace with your mutation result path
        displayName: getItemDisplayName(result.data.createYourModel),
      };

      setItems((prev) => [...prev, newItem]);
      setNotification({
        message: `${newItem.displayName} created successfully!`,
        color: "green",
      });
      setCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating item:", error);
      setNotification({ message: "Error creating item", color: "red" });
    }
  };

  const handleUpdate = async (formData) => {
    try {
      const input = {
        id: selectedItem.id,
        ...formData,
      };

      const result = await client.graphql({
        query: "YOUR_UPDATE_MUTATION", // Replace with your UPDATE_MUTATION
        variables: { input },
      });

      const updatedItem = {
        ...result.data.updateYourModel, // Replace with your mutation result path
        displayName: getItemDisplayName(result.data.updateYourModel),
      };

      setItems((prev) =>
        prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      );
      setNotification({
        message: `${updatedItem.displayName} updated successfully!`,
        color: "green",
      });
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating item:", error);
      setNotification({ message: "Error updating item", color: "red" });
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await client.graphql({
        query: "YOUR_DELETE_MUTATION", // Replace with your DELETE_MUTATION
        variables: { input: { id: itemToDelete.id } },
      });

      setItems((prev) => prev.filter((item) => item.id !== itemToDelete.id));
      setNotification({
        message: `${itemToDelete.displayName} deleted successfully!`,
        color: "green",
      });
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting item:", error);
      setNotification({ message: "Error deleting item", color: "red" });
    } finally {
      setDeleteLoading(false);
    }
  };

  // Event handlers
  const openEditDialog = (item) => {
    setSelectedItem(item);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  // TODO: Configure your model's data grid columns
  const columns = [
    {
      field: "displayName",
      headerName: "Name", // Replace with appropriate header
      width: 280,
      renderCell: (params) => (
        <ClickableText
          onClick={() => navigate(`/your-models/${params.row.id}`)}
        >
          {params.value}
        </ClickableText>
      ),
    },
    // TODO: Add more columns specific to your model
    {
      field: "email",
      headerName: "Email",
      width: 240,
    },
    {
      field: "createdAt",
      headerName: "Created",
      width: 140,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <ClickableText
            onClick={() => openEditDialog(params.row)}
            sx={{ color: theme.palette.blueText.main }}
          >
            Edit
          </ClickableText>
          <ClickableText
            onClick={() => openDeleteDialog(params.row)}
            sx={{ color: theme.palette.error.main }}
          >
            Delete
          </ClickableText>
        </Box>
      ),
    },
  ];

  // Effects
  useEffect(() => {
    fetchItems();
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
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Your Models {/* Replace with your model's plural name */}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setCreateDialogOpen(true)}
            sx={{
              borderColor: theme.palette.blueText.main,
              color: theme.palette.blueText.main,
              "&:hover": {
                backgroundColor: "transparent",
                borderColor: theme.palette.blueText.main,
                borderWidth: "2px",
              },
            }}
          >
            Create Your Model {/* Replace with appropriate button text */}
          </Button>
        </Box>

        {/* Data Grid */}
        <CustomDataGrid
          rows={items}
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
          title="Create Your Model" /* Replace with appropriate title */
          showEdit={false}
          showDelete={false}
        >
          {/* TODO: Replace with your model's create form component */}
          {/* <CreateYourModel
            onCreateAPI={handleCreate}
            onClose={() => setCreateDialogOpen(false)}
            isEditMode={false}
          /> */}
        </CustomSlider>

        {/* Edit Dialog */}
        <CustomSlider
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          title={selectedItem?.displayName || "Edit Your Model"}
          showEdit={false}
          showDelete={false}
        >
          {/* TODO: Replace with your model's edit form component */}
          {/* <CreateYourModel
            initialValues={selectedItem}
            onUpdateAPI={handleUpdate}
            onClose={() => setEditDialogOpen(false)}
            isEditMode={true}
            forceEditMode={true}
          /> */}
        </CustomSlider>

        {/* Delete Dialog */}
        <DeleteDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          loading={deleteLoading}
          name={itemToDelete?.displayName}
        />
      </Box>
    </>
  );
}
