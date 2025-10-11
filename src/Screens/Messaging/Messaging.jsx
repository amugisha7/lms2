import React, { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Fab,
  useTheme,
  useMediaQuery,
  Drawer,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MessageList from "./MessageList";
import MessageThread from "./MessageThread";
import MessageComposer from "./MessageComposer";
import UserDirectory from "./UserDirectory";

const Messaging = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // State for views
  const [view, setView] = useState("list"); // 'list', 'thread', 'compose'
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [showUserDirectory, setShowUserDirectory] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setView("thread");
  };

  const handleBackToList = () => {
    setView("list");
    setSelectedConversation(null);
  };

  const handleNewMessage = () => {
    setShowUserDirectory(true);
  };

  const handleSelectUser = (user) => {
    setSelectedRecipient(user);
    setShowUserDirectory(false);
    setView("compose");
  };

  const handleCloseComposer = () => {
    setView("list");
    setSelectedRecipient(null);
  };

  const handleMessageSent = () => {
    // Trigger refresh of message list
    setRefreshTrigger((prev) => prev + 1);
  };

  // Mobile view - single panel at a time
  if (isMobile) {
    return (
      <Box sx={{ height: "calc(100vh - 64px)", position: "relative" }}>
        {view === "list" && (
          <>
            <MessageList
              onSelectConversation={handleSelectConversation}
              selectedUserId={selectedConversation?.userId}
              key={refreshTrigger}
            />
            <Fab
              color="primary"
              aria-label="new message"
              sx={{ position: "absolute", bottom: 16, right: 16 }}
              onClick={handleNewMessage}
            >
              <AddIcon />
            </Fab>
          </>
        )}

        {view === "thread" && selectedConversation && (
          <MessageThread
            conversation={selectedConversation}
            onBack={handleBackToList}
            onMessageSent={handleMessageSent}
          />
        )}

        {view === "compose" && (
          <MessageComposer
            recipient={selectedRecipient}
            onClose={handleCloseComposer}
            onMessageSent={handleMessageSent}
          />
        )}

        <Drawer
          anchor="bottom"
          open={showUserDirectory}
          onClose={() => setShowUserDirectory(false)}
          PaperProps={{
            sx: { height: "80vh" },
          }}
        >
          <UserDirectory
            onSelectUser={handleSelectUser}
            selectedUserId={selectedRecipient?.id}
          />
        </Drawer>
      </Box>
    );
  }

  // Desktop view - multi-panel layout
  return (
    <Box sx={{ height: "calc(100vh - 64px)", p: 2 }}>
      <Grid container spacing={2} sx={{ height: "100%" }}>
        {/* Message List */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: "100%", position: "relative" }}>
            <MessageList
              onSelectConversation={handleSelectConversation}
              selectedUserId={selectedConversation?.userId}
              key={refreshTrigger}
            />
            <Fab
              color="primary"
              aria-label="new message"
              size="medium"
              sx={{ position: "absolute", bottom: 16, right: 16 }}
              onClick={handleNewMessage}
            >
              <AddIcon />
            </Fab>
          </Paper>
        </Grid>

        {/* Message Thread or Composer */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ height: "100%" }}>
            {view === "compose" ? (
              <MessageComposer
                recipient={selectedRecipient}
                onClose={handleCloseComposer}
                onMessageSent={handleMessageSent}
              />
            ) : (
              <MessageThread
                conversation={selectedConversation}
                onBack={handleBackToList}
                onMessageSent={handleMessageSent}
              />
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* User Directory Drawer */}
      <Drawer
        anchor="right"
        open={showUserDirectory}
        onClose={() => setShowUserDirectory(false)}
        PaperProps={{
          sx: { width: 400, maxWidth: "100%" },
        }}
      >
        <UserDirectory
          onSelectUser={handleSelectUser}
          selectedUserId={selectedRecipient?.id}
        />
      </Drawer>
    </Box>
  );
};

export default Messaging;
