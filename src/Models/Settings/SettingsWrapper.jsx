import React, { useState } from "react";
import { Box, Tabs, Tab, Paper, useTheme, useMediaQuery } from "@mui/material";
import Settings from "./Settings";
import AccountInfo from "./AccountInfo";
import DocumentHeaderSettings from "./DocumentHeaderSettings";

const SettingsWrapper = () => {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ borderRadius: 0 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons={isMobile ? "auto" : false}
          sx={{
            borderBottom: "1px solid",
            borderColor: "divider",
            "& .MuiTabs-indicator": {
              backgroundColor: theme.palette.blueText.main,
              height: 3,
              borderRadius: "1.5px",
            },
            "& .MuiTab-root": {
              fontFamily: theme.typography.fontFamily,
              fontSize: "0.875rem",
              fontWeight: 500,
              textTransform: "none",
              letterSpacing: "0.02em",
              color: theme.palette.text.secondary,
              minHeight: 48,
              padding: "12px 24px",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                color: theme.palette.blueText.main,
              },
              "&.Mui-selected": {
                color: theme.palette.blueText.main,
                fontWeight: 600,
              },
              "&.Mui-focusVisible": {
                backgroundColor: theme.palette.action.focus,
              },
            },
            "& .MuiTabs-flexContainer": {
              gap: 1,
            },
          }}
        >
          <Tab label="Institution Settings" />
          <Tab label="Account Information" />
          <Tab label="Document Header" />
        </Tabs>
      </Paper>

      <Box sx={{ mt: 0 }}>
        {activeTab === 0 && <Settings />}
        {activeTab === 1 && <AccountInfo />}
        {activeTab === 2 && <DocumentHeaderSettings />}
      </Box>
    </Box>
  );
};

export default SettingsWrapper;
