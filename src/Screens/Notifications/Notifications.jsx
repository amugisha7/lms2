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
      <Grid container spacing={2} sx={{ height: "100%" }}>
        {/* Notification List */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: "100%", position: "relative" }}>
            <NotificationList
              onSelectNotification={handleSelectNotification}
              selectedNotificationId={selectedNotification?.id}
              key={refreshTrigger}
            />
          </Paper>
        </Grid>

        {/* Notification Thread */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ height: "100%" }}>
            <NotificationThread
              notification={selectedNotification}
              onBack={handleBackToList}
              onNotificationAction={handleNotificationAction}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Notifications;
