import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Avatar,
  Stack,
  Button,
  Divider,
  Chip,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { generateClient } from "aws-amplify/api";
import { UserContext } from "../../App";
import {
  CREATE_MESSAGE_MUTATION,
  UPDATE_MESSAGE_MUTATION,
} from "./messagingQueries";
import {
  getUserDisplayName,
  formatFullDate,
  sortMessagesByDate,
} from "./messageUtils";

const client = generateClient();

const MessageThread = ({ conversation, onBack, onMessageSent }) => {
  const { userDetails } = useContext(UserContext);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [sortedMessages, setSortedMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (conversation?.messages) {
      const sorted = sortMessagesByDate(conversation.messages, true);
      setSortedMessages(sorted);
      markMessagesAsRead();
    }
  }, [conversation]);

  useEffect(() => {
    scrollToBottom();
  }, [sortedMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const markMessagesAsRead = async () => {
    if (!conversation?.messages) return;

    const unreadMessages = conversation.messages.filter(
      (msg) => msg.recipientUserId === userDetails.id && msg.status === "unread"
    );

    for (const message of unreadMessages) {
      try {
        console.log("API Call: UPDATE_MESSAGE_MUTATION mark as read", {
          id: message.id,
        });
        await client.graphql({
          query: UPDATE_MESSAGE_MUTATION,
          variables: {
            input: {
              id: message.id,
              status: "read",
            },
          },
        });
      } catch (error) {
        console.error("Error marking message as read:", error);
      }
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !conversation) return;

    try {
      setSending(true);

      console.log("API Call: CREATE_MESSAGE_MUTATION send reply", {
        senderUserId: userDetails.id,
        recipientUserId: conversation.userId,
      });
      await client.graphql({
        query: CREATE_MESSAGE_MUTATION,
        variables: {
          input: {
            body: replyText.trim(),
            messageType: "user_message",
            status: "unread",
            senderUserId: userDetails.id,
            recipientUserId: conversation.userId,
            institutionMessagesId: userDetails.institutionUsersId,
          },
        },
      });

      setReplyText("");
      if (onMessageSent) {
        onMessageSent();
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleApproval = async (message, action) => {
    // Handle approval/rejection actions
    console.log(`Action ${action} on message:`, message);

    // Here you would implement the actual approval logic
    // For example, updating a loan status, user status, etc.

    // After processing, mark the message as read
    try {
      console.log(
        "API Call: UPDATE_MESSAGE_MUTATION mark as read after approval",
        { id: message.id }
      );
      await client.graphql({
        query: UPDATE_MESSAGE_MUTATION,
        variables: {
          input: {
            id: message.id,
            status: "read",
          },
        },
      });

      if (onMessageSent) {
        onMessageSent();
      }
    } catch (error) {
      console.error("Error processing approval:", error);
    }
  };

  const getUserInitials = (user) => {
    if (!user) return "?";
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return "?";
  };

  if (!conversation) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Typography color="text.secondary">
          Select a conversation to view messages
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Paper
        elevation={1}
        sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}
      >
        <IconButton onClick={onBack} sx={{ display: { md: "none" } }}>
          <ArrowBackIcon />
        </IconButton>
        <Avatar sx={{ bgcolor: "primary.main" }}>
          {getUserInitials(conversation.user)}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6">
            {getUserDisplayName(conversation.user)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {conversation.user?.email}
          </Typography>
        </Box>
        {conversation.user?.userType && (
          <Chip label={conversation.user.userType} variant="outlined" />
        )}
      </Paper>

      {/* Messages */}
      <Box sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
        <Stack spacing={2}>
          {sortedMessages.map((message) => {
            const isOwnMessage = message.senderUserId === userDetails.id;
            const isSystemMessage = message.messageType === "system_message";
            const hasActions =
              message.systemMessageData?.requiresAction &&
              !isOwnMessage &&
              message.status === "unread";

            return (
              <Box
                key={message.id}
                sx={{
                  display: "flex",
                  justifyContent: isOwnMessage ? "flex-end" : "flex-start",
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    maxWidth: "70%",
                    bgcolor: isOwnMessage
                      ? "primary.main"
                      : isSystemMessage
                      ? "info.light"
                      : "background.paper",
                    color: isOwnMessage
                      ? "primary.contrastText"
                      : "text.primary",
                  }}
                >
                  {message.subject && (
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      {message.subject}
                    </Typography>
                  )}
                  {isSystemMessage && (
                    <Chip
                      label="System Message"
                      size="small"
                      color="info"
                      sx={{ mb: 1 }}
                    />
                  )}
                  <Typography
                    variant="body1"
                    sx={{ whiteSpace: "pre-wrap", mb: 1 }}
                  >
                    {message.body}
                  </Typography>

                  {/* Approval buttons */}
                  {hasActions && (
                    <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                      {message.systemMessageData.actions?.includes(
                        "approve"
                      ) && (
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleApproval(message, "approve")}
                        >
                          Approve
                        </Button>
                      )}
                      {message.systemMessageData.actions?.includes(
                        "reject"
                      ) && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleApproval(message, "reject")}
                        >
                          Reject
                        </Button>
                      )}
                    </Box>
                  )}

                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      mt: 1,
                      opacity: 0.7,
                    }}
                  >
                    {formatFullDate(message.createdAt)}
                  </Typography>
                </Paper>
              </Box>
            );
          })}
          <div ref={messagesEndRef} />
        </Stack>
      </Box>

      <Divider />

      {/* Reply Box */}
      <Box sx={{ p: 2, bgcolor: "background.paper" }}>
        <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Type your message..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendReply();
              }
            }}
            disabled={sending}
          />
          <IconButton
            color="primary"
            onClick={handleSendReply}
            disabled={!replyText.trim() || sending}
            sx={{ mb: 0.5 }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default MessageThread;
