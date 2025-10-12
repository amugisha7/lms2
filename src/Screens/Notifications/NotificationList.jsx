import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  CircularProgress,
  TextField,
  InputAdornment,
  Divider,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { UserContext } from "../../App";
import {
  LIST_NOTIFICATIONS_QUERY,
  SUBSCRIBE_TO_NEW_NOTIFICATIONS,
} from "./notificationQueries";
import {
  getUserDisplayName,
  formatNotificationDate,
  getNotificationPreview,
  searchNotifications,
} from "./notificationUtils";
import { generateClient } from "aws-amplify/api";

const client = generateClient();

const NotificationList = ({ onSelectNotification, selectedNotificationId }) => {
  const { user } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.userId) return;
      setLoading(true);
      try {
        const response = await client.graphql({
          query: LIST_NOTIFICATIONS_QUERY,
          variables: {
            filter: { recipientUserId: { eq: user.userId } },
            limit: 100, // Adjust limit as needed
          },
        });
        const fetchedNotifications = response.data.listNotifications.items.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    const subscription = client
      .graphql({
        query: SUBSCRIBE_TO_NEW_NOTIFICATIONS,
        variables: {
          filter: { recipientUserId: { eq: user.userId } },
        },
      })
      .subscribe({
        next: ({ data }) => {
          const newNotification = data.onCreateNotification;
          setNotifications((prev) => [newNotification, ...prev]);
        },
        error: (error) => console.warn("Subscription error:", error),
      });

    return () => subscription.unsubscribe();
  }, [user?.userId]);

  const filteredNotifications = searchTerm
    ? searchNotifications(notifications, searchTerm)
    : notifications;

  const getUserInitials = (sender) => {
    if (!sender) return "S"; // System
    if (sender.firstName && sender.lastName) {
      return `${sender.firstName[0]}${sender.lastName[0]}`.toUpperCase();
    }
    if (sender.email) {
      return sender.email[0].toUpperCase();
    }
    return "U"; // User
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
          Notifications
        </Typography>
        <TextField
          fullWidth
          placeholder="Search notifications..."
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
        {filteredNotifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography color="text.secondary">
              {searchTerm ? "No notifications found" : "No notifications yet"}
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {filteredNotifications.map((notification) => {
              const isUnread = notification.status === "unread";

              return (
                <React.Fragment key={notification.id}>
                  <ListItem disablePadding>
                    <ListItemButton
                      selected={selectedNotificationId === notification.id}
                      onClick={() => onSelectNotification(notification)}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor:
                              notification.notificationType ===
                              "USER_JOIN_REQUEST"
                                ? "secondary.main"
                                : "primary.main",
                          }}
                        >
                          {getUserInitials(notification.sender)}
                        </Avatar>
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
                              {notification.subject}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {formatNotificationDate(notification.createdAt)}
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
                              {getNotificationPreview(notification.body, 50)}
                            </Typography>
                            {notification.approvalStatus === "PENDING" && (
                              <Chip
                                label="Action Required"
                                size="small"
                                color="warning"
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

export default NotificationList;
