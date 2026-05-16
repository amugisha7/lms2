import React from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { BuildCircleOutlined, Logout } from "@mui/icons-material";
import { UserContext } from "../../App";
import { useNotification } from "../../ModelAssets/NotificationContext";

export default function AdminDefaultsRecovery() {
  const {
    signOut,
    adminDefaultsRecovery,
    repairAdminDefaults,
    refreshAdminDefaultsRecovery,
  } = React.useContext(UserContext);
  const { showNotification } = useNotification();
  const [repairing, setRepairing] = React.useState(false);

  const missingDefaults = adminDefaultsRecovery?.missingDefaults || [];
  const errorMessage = adminDefaultsRecovery?.errorMessage || null;

  const handleRepair = async () => {
    setRepairing(true);
    try {
      console.log("[admin-defaults-recovery] Repair button clicked", {
        missingDefaults,
      });
      const result = await repairAdminDefaults();
      await refreshAdminDefaultsRecovery();
      showNotification(
        result?.actions?.length
          ? result.actions.join(" ")
          : "Admin defaults repaired successfully.",
        "green",
      );
    } catch (error) {
      console.error("[admin-defaults-recovery] Screen-level repair failure", {
        message: error?.message,
        error,
        graphqlErrors: error?.errors,
        data: error?.data,
        missingDefaults,
      });
      showNotification(
        error.message || "Failed to repair admin defaults.",
        "red",
      );
    } finally {
      setRepairing(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
        backgroundColor: "#f6f8fb",
      }}
    >
      <Paper sx={{ maxWidth: 640, width: "100%", p: 4 }} elevation={4}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1.5 }}>
          Automatic Setup Could Not Finish
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          The app tried to repair missing admin defaults in the background, but
          it could not finish cleanly.
        </Typography>

        {errorMessage && (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Typography>
        )}

        {missingDefaults.length > 0 && (
          <List sx={{ mb: 3 }}>
            {missingDefaults.map((item) => (
              <ListItem key={item.key} disableGutters>
                <ListItemText
                  primary={item.title}
                  secondary={item.description}
                />
              </ListItem>
            ))}
          </List>
        )}

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            onClick={handleRepair}
            disabled={repairing}
            startIcon={
              repairing ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <BuildCircleOutlined />
              )
            }
          >
            {repairing ? "Retrying..." : "Retry Automatic Repair"}
          </Button>
          <Button
            variant="outlined"
            onClick={refreshAdminDefaultsRecovery}
            disabled={repairing}
          >
            Reload Workspace
          </Button>
          <Button
            variant="text"
            color="secondary"
            onClick={signOut}
            disabled={repairing}
            startIcon={<Logout />}
          >
            Sign Out
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
