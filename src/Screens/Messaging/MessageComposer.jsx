import React, { useState, useContext } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { generateClient } from "aws-amplify/api";
import { UserContext } from "../../App";
import { CREATE_MESSAGE_MUTATION } from "./messagingQueries";
import { getUserDisplayName } from "./messageUtils";

const client = generateClient();

const MessageComposer = ({ recipient, onClose, onMessageSent }) => {
  const { userDetails } = useContext(UserContext);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!body.trim() || !recipient) return;

    try {
      setSending(true);

      console.log("API Call: CREATE_MESSAGE_MUTATION send message", {
        senderUserId: userDetails.id,
        recipientUserId: recipient.id,
      });
      await client.graphql({
        query: CREATE_MESSAGE_MUTATION,
        variables: {
          input: {
            subject: subject.trim() || null,
            body: body.trim(),
            messageType: "user_message",
            status: "unread",
            senderUserId: userDetails.id,
            recipientUserId: recipient.id,
            institutionMessagesId: userDetails.institutionUsersId,
          },
        },
      });

      // Reset form
      setSubject("");
      setBody("");

      // Notify parent
      if (onMessageSent) {
        onMessageSent();
      }

      // Close composer
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6">New Message</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Paper>

      {/* Form */}
      <Box sx={{ flexGrow: 1, p: 2, overflow: "auto" }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            To:
          </Typography>
          <Typography variant="body1">
            {recipient
              ? getUserDisplayName(recipient)
              : "No recipient selected"}
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Subject (optional)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={sending}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          multiline
          rows={10}
          label="Message"
          placeholder="Type your message here..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={sending}
          required
        />
      </Box>

      {/* Actions */}
      <Paper elevation={1} sx={{ p: 2, display: "flex", gap: 2 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={sending}
          sx={{ flexGrow: 1 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<SendIcon />}
          onClick={handleSend}
          disabled={!body.trim() || !recipient || sending}
          sx={{ flexGrow: 1 }}
        >
          {sending ? "Sending..." : "Send"}
        </Button>
      </Paper>
    </Box>
  );
};

export default MessageComposer;
