import React, { useState } from "react";
import { Box, Grid, Paper, useTheme, useMediaQuery } from "@mui/material";
import NotificationList from "./NotificationList";
import NotificationThread from "./NotificationThread";

const Notifications = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // State for views
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSelectNotification = (notification) => {
    setSelectedNotification(notification);
  };

  const handleBackToList = () => {
    setSelectedNotification(null);
  };

  const handleNotificationAction = () => {
    // Trigger refresh of notification list
    setRefreshTrigger((prev) => prev + 1);
    setSelectedNotification(null); // Go back to list after action
  };

  // Mobile view - single panel at a time
  if (isMobile) {
    return (
      <Box sx={{ height: "calc(100vh - 64px)", position: "relative" }}>
        {!selectedNotification ? (
          <NotificationList
            onSelectNotification={handleSelectNotification}
            key={refreshTrigger}
          />
        ) : (
          <NotificationThread
            notification={selectedNotification}
            onBack={handleBackToList}
            onNotificationAction={handleNotificationAction}
          />
        )}
      </Box>
    );
  }

  // Desktop view - multi-panel layout
  return (
    <Box sx={{ height: "calc(100vh - 64px)", p: 2 }}>
      <Box
        sx={{
          display: { xs: "block", md: "flex" },
          height: "100%",
          width: "100%",
        }}
      >
        {/* Notification List - 30% width */}
        <Box
          sx={{
            width: { xs: "100%", md: "30%" },
            height: "100%",
            minWidth: 0,
            pr: { md: 2 },
          }}
        >
          <Box sx={{ height: "100%", position: "relative" }}>
            <NotificationList
              onSelectNotification={handleSelectNotification}
              selectedNotificationId={selectedNotification?.id}
              key={refreshTrigger}
            />
          </Box>
        </Box>

        {/* Notification Thread - 70% width */}
        <Box
          sx={{
            width: { xs: "100%", md: "70%" },
            height: "100%",
            minWidth: 0,
            pl: { md: 2 },
            display: { xs: "none", md: "block" },
            borderLeft: { md: "1px solid #e0e0e0" },
          }}
        >
          <Paper>
            <NotificationThread
              notification={selectedNotification}
              onBack={handleBackToList}
              onNotificationAction={handleNotificationAction}
            />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Notifications;
