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
import CreateUser from "./CreateUser/CreateUser";

// GraphQL queries
import {
  LIST_USERS_QUERY,
  CREATE_USER_MUTATION,
  UPDATE_USER_MUTATION,
  DELETE_USER_MUTATION,
} from "./userQueries";

import { useHasPermission } from "../../ModelAssets/Permissions/permissions";

export default function Users() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { userDetails } = useContext(UserContext);
  const client = React.useMemo(() => generateClient(), []);

  // State management
  const [users, setUsers] = useState([]);
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
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Ref to track fetched branch ID
  const hasFetchedRef = React.useRef();

  // Fetch users
  const fetchUsers = async () => {
    if (!userDetails?.branchUsersId) return;

    setLoading(true);
    try {
      let allUsers = [];
      let nextToken = null;

      do {
        console.log("API Call: Fetching users"); // <-- Added
        const result = await client.graphql({
          query: LIST_USERS_QUERY,
          variables: {
            branchId: userDetails.branchUsersId,
            ...(nextToken && { nextToken }),
          },
        });

        const batch = result?.data?.listUsers?.items || [];
        allUsers.push(...batch);
        nextToken = result?.data?.listUsers?.nextToken;
      } while (nextToken);

      // Process users
      const processed = allUsers.map((user) => ({
        ...user,
        displayName: getUserDisplayName(user),
      }));

      setUsers(processed);
    } catch (error) {
      console.error("Error fetching users:", error);
      setNotification({ message: "Error loading users", color: "red" });
    } finally {
      setLoading(false);
    }
  };

  // Helper function
  const getUserDisplayName = (user) => {
    const fullName = [user.firstName, user.middleName, user.lastName]
      .filter(Boolean)
      .join(" ");
    return fullName || user.email || "Unnamed User";
  };

  // CRUD operations
  const handleCreate = async (formData) => {
    try {
      const input = {
        ...formData,
        branchUsersId: userDetails.branchUsersId,
      };

      console.log("API Call: Creating user"); // <-- Added

      const result = await client.graphql({
        query: CREATE_USER_MUTATION,
        variables: { input },
      });

      const newUser = {
        ...result.data.createUser,
        displayName: getUserDisplayName(result.data.createUser),
      };

      setUsers((prev) => [...prev, newUser]);
      setNotification({
        message: `${newUser.displayName} created successfully!`,
        color: "green",
      });
      setCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating user:", error);
      setNotification({ message: "Error creating user", color: "red" });
    }
  };

  const handleUpdate = async (formData) => {
    try {
      const input = {
        id: selectedUser.id,
        ...formData,
      };

      console.log("API Call: Updating user"); // <-- Added
      const result = await client.graphql({
        query: UPDATE_USER_MUTATION,
        variables: { input },
      });

      const updatedUser = {
        ...result.data.updateUser,
        displayName: getUserDisplayName(result.data.updateUser),
      };

      setUsers((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );
      setNotification({
        message: `${updatedUser.displayName} updated successfully!`,
        color: "green",
      });
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
      setNotification({ message: "Error updating user", color: "red" });
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      console.log("API Call: Deleting user"); // <-- Added
      await client.graphql({
        query: DELETE_USER_MUTATION,
        variables: { input: { id: userToDelete.id } },
      });

      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setNotification({
        message: `${userToDelete.displayName} deleted successfully!`,
        color: "green",
      });
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      setNotification({ message: "Error deleting user", color: "red" });
    } finally {
      setDeleteLoading(false);
    }
  };

  // Event handlers
  const openEditDialog = (user) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  // Data grid configuration
  const columns = [
    {
      field: "displayName",
      headerName: "Full Name",
      width: 280,
      renderCell: (params) => (
        <ClickableText
          onClick={() => navigate(`/users/id/${params.row.id}/view`)}
        >
          {params.value}
        </ClickableText>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 240,
    },
    {
      field: "phoneNumber1",
      headerName: "Phone No.",
      width: 140,
    },
    {
      field: "userType",
      headerName: "User Type",
      width: 140,
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
    },
  ];

  // Effects
  useEffect(() => {
    if (
      userDetails?.branchUsersId &&
      userDetails.branchUsersId !== hasFetchedRef.current
    ) {
      fetchUsers();
      hasFetchedRef.current = userDetails.branchUsersId;
    }
  }, [userDetails?.branchUsersId]);

  const canCreateUser = useHasPermission("create", "user");

  return (
    <>
      <NotificationBar
        open={!!notification.message}
        onClose={() => setNotification({ message: "", color: "green" })}
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
            Users
          </Typography>
          {canCreateUser && (
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
              Create User
            </Button>
          )}
        </Box>

        {/* Data Grid */}
        <CustomDataGrid
          rows={users}
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
          title="Create User"
          showEdit={false}
          showDelete={false}
        >
          <CreateUser
            onCreateUserAPI={handleCreate}
            onClose={() => setCreateDialogOpen(false)}
            isEditMode={false}
          />
        </CustomSlider>

        {/* Edit Dialog */}
        <CustomSlider
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          title={selectedUser?.displayName || "Edit User"}
          showEdit={false}
          showDelete={false}
        >
          <CreateUser
            initialValues={selectedUser}
            onUpdateUserAPI={handleUpdate}
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
          name={userToDelete?.displayName}
        />
      </Box>
    </>
  );
}
