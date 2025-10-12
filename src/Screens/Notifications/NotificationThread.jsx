import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Stack,
  Button,
  Divider,
  Chip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import loggedClient from "../../loggedClient";
import { UserContext } from "../../App";
import {
  UPDATE_NOTIFICATION_MUTATION,
  CREATE_NOTIFICATION_MUTATION,
  UPDATE_USER_MUTATION,
} from "./notificationQueries";
import { getUserDisplayName, formatFullDate } from "./notificationUtils";
import { useSnackbar } from "../../ComponentAssets/SnackbarContext";

const client = loggedClient;

const NotificationThread = ({ notification, onBack, onNotificationAction }) => {
  const { user } = useContext(UserContext);
  const { showSnackbar } = useSnackbar();
  const [isProcessing, setIsProcessing] = useState(false);

  const markNotificationAsRead = useCallback(async () => {
    try {
      await client.graphql({
        query: UPDATE_NOTIFICATION_MUTATION,
        variables: {
          input: {
            id: notification.id,
            status: "read",
          },
        },
      });
      // Optionally, trigger a refresh in the parent component
      if (onNotificationAction) {
        onNotificationAction();
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }, [notification, onNotificationAction]);

  useEffect(() => {
    if (notification && notification.status === "unread") {
      markNotificationAsRead();
    }
  }, [notification, markNotificationAsRead]);

  const handleApproval = async (action) => {
    if (!notification || !user) return;

    setIsProcessing(true);
    const { id, referenceId, senderUserId } = notification;
    const newStatus = action === "approve" ? "APPROVED" : "REJECTED";

    try {
      // 1. Update the current notification's approval status
      await client.graphql({
        query: UPDATE_NOTIFICATION_MUTATION,
        variables: {
          input: {
            id: id,
            approvalStatus: newStatus,
          },
        },
      });

      // 2. Update the user's status from 'pending' to 'active'
      // This assumes `referenceId` is the user ID to be updated
      if (notification.notificationType === "USER_JOIN_REQUEST") {
        await client.graphql({
          query: UPDATE_USER_MUTATION,
          variables: {
            input: {
              id: referenceId,
              status: action === "approve" ? "active" : "inactive", // or 'rejected'
            },
          },
        });
      }

      // 3. Send a feedback notification to the original sender
      const feedbackSubject = `Request ${newStatus}`;
      const feedbackBody = `Your request to join the institution has been ${newStatus.toLowerCase()}.`;

      await client.graphql({
        query: CREATE_NOTIFICATION_MUTATION,
        variables: {
          input: {
            subject: feedbackSubject,
            body: feedbackBody,
            notificationType: "USER_JOIN_FEEDBACK",
            approvalStatus: "NONE",
            status: "unread",
            senderUserId: user.userId, // The admin is the sender
            recipientUserId: senderUserId, // The original user is the recipient
            institutionMessagesId: user.institutionUsersId,
          },
        },
      });

      showSnackbar(
        `User request has been ${newStatus.toLowerCase()}.`,
        "success"
      );
      if (onNotificationAction) {
        onNotificationAction();
      }
    } catch (error) {
      console.error(`Error processing ${action}:`, error);
      showSnackbar(`Failed to process the request.`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const getUserInitials = (sender) => {
    if (!sender) return "S";
    if (sender.firstName && sender.lastName) {
      return `${sender.firstName[0]}${sender.lastName[0]}`.toUpperCase();
    }
    if (sender.email) {
      return sender.email[0].toUpperCase();
    }
    return "U";
  };

  if (!notification) {
    return (
      <></>
      // <Box
      //   sx={{
      //     display: "flex",
      //     justifyContent: "center",
      //     alignItems: "center",
      //     height: "100%",
      //     p: 2,
      //   }}
      // >
      //   <Typography color="text.secondary">
      //     Select a notification to view details
      //   </Typography>
      // </Box>
    );
  }

  const { sender, subject, body, createdAt, notificationType, approvalStatus } =
    notification;

  const isActionable =
    notificationType === "USER_JOIN_REQUEST" && approvalStatus === "PENDING";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton onClick={onBack} sx={{ display: { md: "none" } }}>
          <ArrowBackIcon />
        </IconButton>

        <Chip label={notificationType.replace(/_/g, " ")} variant="outlined" />
        <Typography variant="caption" color="text.secondary">
          {formatFullDate(createdAt)}
        </Typography>
      </Box>

      {/* Notification Body */}
      <Box sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
        <Stack spacing={2}>
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
            {body}
          </Typography>
        </Stack>
      </Box>

      <Divider />

      {/* Action Area */}
      {isActionable && (
        <Box sx={{ p: 2, bgcolor: "background.paper" }}>
          <Typography variant="subtitle1" sx={{ mb: 2, textAlign: "center" }}>
            Respond to this request:
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              color="success"
              onClick={() => handleApproval("approve")}
              disabled={isProcessing}
              startIcon={isProcessing && <CircularProgress size={20} />}
            >
              Approve
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleApproval("reject")}
              disabled={isProcessing}
            >
              Reject
            </Button>
          </Stack>
        </Box>
      )}

      {approvalStatus !== "PENDING" && (
        <Box sx={{ p: 2, bgcolor: "background.paper", textAlign: "center" }}>
          <Chip
            label={`Status: ${approvalStatus}`}
            color={
              approvalStatus === "APPROVED"
                ? "success"
                : approvalStatus === "REJECTED"
                ? "error"
                : "default"
            }
          />
        </Box>
      )}
    </Box>
  );
};

export default NotificationThread;
