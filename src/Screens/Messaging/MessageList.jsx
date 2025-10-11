import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Badge,
  Typography,
  CircularProgress,
  TextField,
  InputAdornment,
  Divider,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { generateClient } from "aws-amplify/api";
import { UserContext } from "../../App";
import {
  LIST_MESSAGES_QUERY,
  SUBSCRIBE_TO_NEW_MESSAGES,
} from "./messagingQueries";
import {
  getUserDisplayName,
  formatMessageDate,
  getMessagePreview,
  groupMessagesByConversation,
  searchMessages,
} from "./messageUtils";

const client = generateClient();

const MessageList = ({ onSelectConversation, selectedUserId }) => {
  const { userDetails } = useContext(UserContext);
  const [conversations, setConversations] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();

    // Subscribe to new messages
    const subscription = client
      .graphql({
        query: SUBSCRIBE_TO_NEW_MESSAGES,
        variables: { filter: { recipientUserId: { eq: userDetails.id } } },
      })
      .subscribe({
        next: ({ data }) => {
          const newMessage = data.onCreateMessage;
          setAllMessages((prev) => [newMessage, ...prev]);
        },
        error: (error) => {
          console.error("Subscription error:", error);
        },
      });

    return () => subscription.unsubscribe();
  }, [userDetails?.id]);

  useEffect(() => {
    // Group messages into conversations whenever messages change
    if (allMessages.length > 0) {
      const filteredMessages = searchTerm
        ? searchMessages(allMessages, searchTerm)
        : allMessages;
      const grouped = groupMessagesByConversation(
        filteredMessages,
        userDetails.id
      );
      setConversations(grouped);
    } else {
      setConversations([]);
    }
  }, [allMessages, searchTerm, userDetails?.id]);

  const fetchMessages = async () => {
    if (!userDetails?.id) return;

    try {
      setLoading(true);

      // Fetch messages where user is sender
      const sentResponse = await client.graphql({
        query: LIST_MESSAGES_QUERY,
        variables: {
          filter: { senderUserId: { eq: userDetails.id } },
          limit: 100,
        },
      });

      // Fetch messages where user is recipient
      const receivedResponse = await client.graphql({
        query: LIST_MESSAGES_QUERY,
        variables: {
          filter: { recipientUserId: { eq: userDetails.id } },
          limit: 100,
        },
      });

      const sent = sentResponse.data.listMessages.items || [];
      const received = receivedResponse.data.listMessages.items || [];

      // Combine and deduplicate
      const allMsgs = [...sent, ...received];
      const uniqueMessages = Array.from(
        new Map(allMsgs.map((msg) => [msg.id, msg])).values()
      );

      setAllMessages(uniqueMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Messages
        </Typography>
        <TextField
          fullWidth
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Divider />
      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        {conversations.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography color="text.secondary">
              {searchTerm ? "No conversations found" : "No messages yet"}
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {conversations.map((conversation) => {
              const lastMessage = conversation.lastMessage;
              const isUnread = conversation.unreadCount > 0;
              const isSent = lastMessage.senderUserId === userDetails.id;

              return (
                <React.Fragment key={conversation.userId}>
                  <ListItem disablePadding>
                    <ListItemButton
                      selected={selectedUserId === conversation.userId}
                      onClick={() => onSelectConversation(conversation)}
                    >
                      <ListItemAvatar>
                        <Badge
                          badgeContent={conversation.unreadCount}
                          color="error"
                        >
                          <Avatar sx={{ bgcolor: "primary.main" }}>
                            {getUserInitials(conversation.user)}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: isUnread ? 600 : 400 }}
                            >
                              {getUserDisplayName(conversation.user)}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {formatMessageDate(lastMessage.createdAt)}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                fontWeight: isUnread ? 600 : 400,
                                flexGrow: 1,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {isSent && "You: "}
                              {lastMessage.subject
                                ? `${lastMessage.subject} - `
                                : ""}
                              {getMessagePreview(lastMessage.body, 40)}
                            </Typography>
                            {lastMessage.messageType === "system_message" && (
                              <Chip
                                label="System"
                                size="small"
                                color="info"
                                sx={{ ml: 1 }}
                              />
                            )}
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              );
            })}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default MessageList;
