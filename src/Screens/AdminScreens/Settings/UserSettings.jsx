import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import { generateClient } from "aws-amplify/api";
import { UserContext } from "../../../App";

const UserSettings = () => {
  const { signOut, user, userDetails } = React.useContext(UserContext);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignOut = () => {
    signOut();
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    setError(null);
    try {
      const client = generateClient();
      await client.graphql({
        query: `mutation DeleteUser($input: DeleteUserInput!) {
          deleteUser(input: $input) {
            id
          }
        }`,
        variables: {
          input: { id: user.userId },
        },
      });
      // After deleting, sign out
      signOut();
    } catch (err) {
      console.error("Error deleting account:", err);
      setError("Failed to delete account. Please try again.");
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        User Settings
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Account Information
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Email:</strong> {user?.signInDetails?.loginId || "N/A"}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>User Type:</strong> {userDetails?.userType || "N/A"}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Institution ID:</strong>{" "}
          {userDetails?.institutionUsersId || "N/A"}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Branch ID:</strong> {userDetails?.branchUsersId || "N/A"}
        </Typography>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          onClick={handleSignOut}
          sx={{ flex: 1 }}
        >
          Sign Out
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => setDeleteDialogOpen(true)}
          sx={{ flex: 1 }}
        >
          Delete Account
        </Button>
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserSettings;
