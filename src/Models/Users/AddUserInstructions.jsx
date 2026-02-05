import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Typography,
  Box,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const AddUserInstructions = ({ open, onClose, institutionId }) => {
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  const handleCopyInstitutionId = () => {
    if (institutionId) {
      navigator.clipboard.writeText(institutionId);
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 2000);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          How to Add a New User
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          To add a new user to your institution, follow these steps:
        </Typography>
        <List sx={{ listStyleType: "decimal", pl: 2 }}>
          <ListItem sx={{ display: "list-item", pl: 1 }}>
            <ListItemText
              primary={
                <Typography variant="body1">
                  <strong>User signs up:</strong> The new user should sign up
                  for a LoanTabs account using a unique email address
                </Typography>
              }
            />
          </ListItem>
          <ListItem sx={{ display: "list-item", pl: 1 }}>
            <ListItemText
              primary={
                <Typography variant="body1">
                  <strong>Select "Join existing institution":</strong> During
                  onboarding, the user should choose to join an existing
                  business rather than creating a new one.
                </Typography>
              }
            />
          </ListItem>
          <ListItem sx={{ display: "list-item", pl: 1 }}>
            <ListItemText
              primary={
                <Box>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Provide Institution ID:</strong> The user needs to
                    enter your Institution ID:
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      p: 2,
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.05)"
                          : "grey.100",
                      borderRadius: 1,
                      border: "1px solid",
                      borderColor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.12)"
                          : "grey.300",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "monospace",
                        fontSize: "0.95rem",
                        flexGrow: 1,
                        wordBreak: "break-all",
                        color: (theme) =>
                          theme.palette.mode === "dark"
                            ? "white"
                            : "text.primary",
                      }}
                    >
                      {institutionId || "Loading..."}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={handleCopyInstitutionId}
                      sx={{
                        color: "primary.main",
                        "&:hover": {
                          bgcolor: (theme) =>
                            theme.palette.mode === "dark"
                              ? "rgba(255, 255, 255, 0.08)"
                              : "rgba(0, 0, 0, 0.04)",
                        },
                      }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  {copiedToClipboard && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: "success.main",
                        mt: 0.5,
                        display: "block",
                      }}
                    >
                      Copied to clipboard!
                    </Typography>
                  )}
                </Box>
              }
            />
          </ListItem>
          <ListItem sx={{ display: "list-item", pl: 1 }}>
            <ListItemText
              primary={
                <Typography variant="body1">
                  <strong>Review join request:</strong> Once the user submits
                  their request, you will receive a notification. Go to{" "}
                  <strong>Notifications</strong> to review and approve the join
                  request.
                </Typography>
              }
            />
          </ListItem>
          <ListItem sx={{ display: "list-item", pl: 1 }}>
            <ListItemText
              primary={
                <Typography variant="body1">
                  <strong>Approve and assign role:</strong> When reviewing the
                  request, you can select the appropriate user type (role) and
                  branch to grant them access.
                </Typography>
              }
            />
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Got it
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserInstructions;
