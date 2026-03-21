import React, { useState, useEffect, useContext, useMemo } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { generateClient } from "aws-amplify/api";
import { Formik, Form, useField } from "formik";
import { UserContext } from "../../App";
import { listBranches } from "../../graphql/queries";

// Reusable components
import CustomDataGrid from "../../ModelAssets/CustomDataGrid";
import CustomSlider from "../../ModelAssets/CustomSlider";
import DeleteDialog from "../../ModelAssets/DeleteDialog";
import NotificationBar from "../../ModelAssets/NotificationBar";
import ClickableText from "../../ModelAssets/ClickableText";
import WorkingOverlay from "../../ModelAssets/WorkingOverlay";
import PlusButtonMain from "../../ModelAssets/PlusButtonMain";
import MultipleDropDownSearchable from "../../Resources/FormComponents/MultipleDropDownSearchable";

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

// Effect component used inside Formik to sync branch filter values
function FormikEffect({ onChange, fieldName }) {
  const [field] = useField(fieldName);
  const prevValueRef = React.useRef(field.value);

  React.useEffect(() => {
    if (JSON.stringify(field.value) !== JSON.stringify(prevValueRef.current)) {
      prevValueRef.current = field.value;
      onChange(field.value);
    }
  }, [field.value, onChange]);

  return null;
}

// Branch filter dropdown wrapper
function BranchFilterWrapper({ branches, onFilterChange, selectedCount }) {
  return (
    <Box sx={{ mb: 3, width: "100%" }}>
      <Formik initialValues={{ branchFilter: [] }} enableReinitialize>
        <Form>
          <FormikEffect onChange={onFilterChange} fieldName="branchFilter" />
          <MultipleDropDownSearchable
            label="Filter by Branch"
            name="branchFilter"
            options={branches.map((b) => ({ value: b.id, label: b.name }))}
            placeholder={selectedCount === 0 ? "All Branches" : ""}
            editing={true}
            helperText={
              selectedCount === 0
                ? "Showing all branches"
                : `Showing ${selectedCount} branch(es)`
            }
          />
        </Form>
      </Formik>
    </Box>
  );
}

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
  const client = useMemo(() => generateClient(), []);

  // State management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    message: "",
    color: "green",
  });
  const [workingOverlayOpen, setWorkingOverlayOpen] = useState(false);
  const [workingOverlayMessage, setWorkingOverlayMessage] =
    useState("Working...");

  // Branch filter state for Admin users
  const [branches, setBranches] = useState([]);
  const [selectedBranchFilter, setSelectedBranchFilter] = useState([]);

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

  // Fetch branches for Admin users
  useEffect(() => {
    const fetchBranchesForAdmin = async () => {
      if (userDetails?.userType === "Admin" && userDetails?.institution?.id) {
        try {
          const branchData = await client.graphql({
            query: listBranches,
            variables: {
              limit: 1000,
              filter: {
                institutionBranchesId: { eq: userDetails.institution.id },
              },
            },
          });
          const items = branchData.data.listBranches.items || [];
          setBranches(items);
          setSelectedBranchFilter([]);
        } catch (e) {
          console.error("Error fetching branches", e);
        }
      }
    };

    if (userDetails) {
      fetchBranchesForAdmin();
    }
  }, [userDetails, client]);

  // Fetch users
  const fetchUsers = async () => {
    if (!userDetails?.institutionUsersId) return;

    setLoading(true);
    setWorkingOverlayOpen(true);
    setWorkingOverlayMessage("Loading Users...");
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
      setWorkingOverlayOpen(false);
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
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
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

  // Filter users by branch
  const filteredUsers = useMemo(() => {
    if (userDetails?.userType !== "Admin") {
      // Non-admins only see users from their own branch
      const userBranchId =
        userDetails?.branchUsersId || userDetails?.branch?.id;
      if (userBranchId) {
        return users.filter((u) => u.branch?.id === userBranchId);
      }
      return users;
    }
    // Admin: apply multi-branch dropdown filter
    if (selectedBranchFilter.length > 0) {
      return users.filter((user) =>
        selectedBranchFilter.includes(user.branch?.id),
      );
    }
    return users;
  }, [users, selectedBranchFilter, userDetails]);

  return (
    <>
      <NotificationBar
        open={!!notification.message}
        onClose={() => setNotification({ message: "", color: "green" })}
        message={notification.message}
        color={notification.color}
      />
      <WorkingOverlay
        open={workingOverlayOpen}
        message={workingOverlayMessage}
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
            <PlusButtonMain
              onClick={() => setInstructionsDialogOpen(true)}
              buttonText="ADD USER"
            />
          )}
        </Box>

        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Click on a User to view or edit their details, add files and custom
          fields.
        </Typography>

        {/* Branch Filter - Admin Only */}
        {userDetails?.userType === "Admin" && branches.length > 0 && (
          <BranchFilterWrapper
            branches={branches}
            onFilterChange={setSelectedBranchFilter}
            selectedCount={selectedBranchFilter.length}
          />
        )}

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
