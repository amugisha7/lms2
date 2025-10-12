import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  useTheme,
  useMediaQuery,
  alpha,
  Card,
  CardContent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

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
            limit: 100,
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
    if (!sender) return "S";
    if (sender.firstName && sender.lastName) {
      return `${sender.firstName[0]}${sender.lastName[0]}`.toUpperCase();
    }
    if (sender.email) {
      return sender.email[0].toUpperCase();
    }
    return "U";
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        // p: { xs: 2, sm: 3 },
      }}
    >
      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            mb: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <NotificationsIcon sx={{ fontSize: "inherit" }} />
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
          sx={{
            "& .MuiOutlinedInput-root": {
              // backgroundColor: theme.palette.background.paper,
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
              },
            },
          }}
        />
      </Box>

      {/* Notifications Grid */}
      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        {filteredNotifications.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "300px",
              textAlign: "center",
            }}
          >
            <NotificationsIcon
              sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary">
              {searchTerm ? "No notifications found" : "No notifications yet"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {searchTerm
                ? "Try adjusting your search terms"
                : "You'll see notifications here when you receive them"}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {filteredNotifications.map((notification) => {
              const isUnread = notification.status === "unread";
              const isSelected = selectedNotificationId === notification.id;
              const isPending = notification.approvalStatus === "PENDING";

              const borderColor = isSelected
                ? theme.palette.mode === "dark"
                  ? "#7CC4FE"
                  : theme.palette.primary.main
                : "transparent";
              const hoverBorderColor = isSelected
                ? theme.palette.mode === "dark"
                  ? "#7CC4FE"
                  : theme.palette.primary.main
                : alpha(theme.palette.primary.main, 0.3);

              return (
                <Card
                  key={notification.id}
                  onClick={() => onSelectNotification(notification)}
                  sx={{
                    cursor: "pointer",
                    width: "100%",
                    position: "relative",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    border: `2px solid ${borderColor}`,
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: theme.shadows[8],
                      borderColor: hoverBorderColor,
                    },
                  }}
                >
                  {/* Unread Indicator */}
                  {isUnread && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: theme.palette.primary.main,
                        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
                      }}
                    />
                  )}

                  <CardContent sx={{ p: 2 }}>
                    {/* Header with Avatar and Date */}
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="flex-start"
                      sx={{ mb: 2 }}
                    >
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            color: "text.secondary",
                            mb: 0.5,
                          }}
                        >
                          {formatNotificationDate(notification.createdAt)}
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: isUnread ? 600 : 500,
                            fontSize: "1rem",
                            lineHeight: 1.3,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {notification.subject}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Footer with Status Chip */}
                    {isPending && (
                      <Chip
                        label="Action Required"
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          p: 2,
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "#4545b6ff"
                              : "#fef5e7",
                          color:
                            theme.palette.mode === "dark" ? "#fff" : "#ED9100",
                        }}
                      />
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
};
export default NotificationList;
