import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import NotificationBar from "../../ModelAssets/NotificationBar";
import CreateLoanFeesForm from "./CreateLoanFeesForm";

export default function CreateLoanFeesPage() {
  const navigate = useNavigate();
  const [notification, setNotification] = React.useState({
    message: "",
    color: "green",
  });

  const handleSuccess = (createdLoanFeeConfig) => {
    setNotification({
      message: "Loan fee created successfully.",
      color: "green",
    });

    return createdLoanFeeConfig;
  };

  return (
    <>
      <NotificationBar
        message={notification.message}
        color={notification.color}
      />
      <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 0, sm: 3 } }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
          Create New Loan Fee
        </Typography>

        <Paper elevation={2} sx={{ p: 3, backgroundColor: "background.paper" }}>
          <CreateLoanFeesForm
            onSuccess={handleSuccess}
            onClose={() => navigate("/admin/loan-fees")}
          />
        </Paper>
      </Box>
    </>
  );
}
