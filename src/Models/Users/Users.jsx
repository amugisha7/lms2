import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, Button, Tabs, Tab } from "@mui/material";
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
import AddUserInstructions from "./AddUserInstructions";

// GraphQL queries
import {
  LIST_USERS_QUERY,
  UPDATE_USER_MUTATION,
  DELETE_USER_MUTATION,
} from "./userQueries";

import { useHasPermission } from "../../ModelAssets/Permissions/permissions";

// User type mapping from values to labels
const USER_TYPE_LABELS = {
  Admin: "Admin",
  loanOfficer: "Loan Officer",
  creditCommittee: "Credit Committee",
  accountant: "Accountant",
  cashier: "Cashier",
  client: "Client",
  branchManager: "Branch Manager",
  auditor: "Auditor",
  collectionsOfficer: "Collections Officer",
  riskAnalyst: "Risk Analyst",
  itSupport: "IT Support",
  Viewer: "Viewer",
};

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
  const [selectedBranchId, setSelectedBranchId] = useState("all");

  // Dialog states
  const [instructionsDialogOpen, setInstructionsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Selected items
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Ref to track fetched institution ID
  const hasFetchedRef = React.useRef();

  // Fetch users
  const fetchUsers = async () => {
    if (!userDetails?.institutionUsersId) return;

    setLoading(true);
    try {
      let allUsers = [];
      let nextToken = null;

      do {
        const result = await client.graphql({
          query: LIST_USERS_QUERY,
          variables: {
            institutionId: userDetails.institutionUsersId,
            ...(nextToken && { nextToken }),
          },
        });

        const batch = result?.data?.listUsers?.items || [];
        allUsers.push(...batch);
        nextToken = result?.data?.listUsers?.nextToken;
      } while (nextToken);

      console.log("API Call: Fetched users", allUsers); // <-- Added

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
      renderCell: (params) => {
        const userType = params.row.userType;
        if (!userType) {
          return (
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate(`/users/id/${params.row.id}/view`)}
              sx={{
                borderColor: theme.palette.blueText.main,
                color: theme.palette.blueText.main,
                backgroundColor: "transparent",
                "&:hover": {
                  backgroundColor: "transparent",
                  borderColor: theme.palette.blueText.main,
                  borderWidth: "2px",
                },
                textTransform: "none",
                fontSize: "0.7rem",
                py: 0.5,
                px: 1.5,
              }}
            >
              Review
            </Button>
          );
        }
        return USER_TYPE_LABELS[userType] || userType;
      },
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
      userDetails?.institutionUsersId &&
      userDetails.institutionUsersId !== hasFetchedRef.current
    ) {
      fetchUsers();
      hasFetchedRef.current = userDetails.institutionUsersId;
    }
  }, [userDetails?.institutionUsersId]);

  const canCreateUser = useHasPermission("create", "user");

  // Extract unique branches from users
  const branches = React.useMemo(() => {
    const branchMap = new Map();
    users.forEach((user) => {
      if (user.branch?.id && user.branch?.name) {
        branchMap.set(user.branch.id, {
          id: user.branch.id,
          name: user.branch.name,
        });
      }
    });
    return Array.from(branchMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [users]);

  // Filter users by selected branch
  const filteredUsers =
    selectedBranchId === "all"
      ? users
      : users.filter((user) => user.branch?.id === selectedBranchId);

  const handleTabChange = (event, newValue) => {
    setSelectedBranchId(newValue);
  };

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
              onClick={() => setInstructionsDialogOpen(true)}
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
              Add User
            </Button>
          )}
        </Box>

        {/* Tabs */}
        <Box sx={{ width: "100%", mb: 2 }}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: theme.palette.divider,
              backgroundColor: theme.palette.background.paper,
              borderRadius: "8px 8px 0 0",
            }}
          >
            <Tabs
              value={selectedBranchId}
              onChange={handleTabChange}
              aria-label="branch filter tabs"
              variant="scrollable"
              scrollButtons
              allowScrollButtonsMobile
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: theme.palette.blueText.main,
                  height: 3,
                  borderRadius: "1.5px",
                },
                "& .MuiTab-root": {
                  fontFamily: theme.typography.fontFamily,
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  textTransform: "none",
                  letterSpacing: "0.02em",
                  color: theme.palette.text.secondary,
                  minHeight: 48,
                  padding: "12px 24px",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    color: theme.palette.blueText.main,
                  },
                  "&.Mui-selected": {
                    color: theme.palette.blueText.main,
                    fontWeight: 600,
                  },
                  "&.Mui-focusVisible": {
                    backgroundColor: theme.palette.action.focus,
                  },
                },
                "& .MuiTabs-flexContainer": {
                  gap: 1,
                },
              }}
            >
              <Tab label="All Branches" value="all" />
              {branches.map((branch) => (
                <Tab key={branch.id} label={branch.name} value={branch.id} />
              ))}
            </Tabs>
          </Box>
        </Box>

        {/* Data Grid */}
        <CustomDataGrid
          rows={filteredUsers}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          pageSize={25}
          pageSizeOptions={[25, 50, 100]}
        />

        {/* Instructions Dialog */}
        <AddUserInstructions
          open={instructionsDialogOpen}
          onClose={() => setInstructionsDialogOpen(false)}
          institutionId={userDetails?.institutionUsersId}
        />

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
