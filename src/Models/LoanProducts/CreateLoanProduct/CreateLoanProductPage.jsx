import React from "react";
import { Box, Typography, IconButton, Paper } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import CreateLoanProduct from "./CreateLoanProduct";

/**
 * Wrapper component for CreateLoanProduct that provides a standalone page layout
 * with navigation back to the loan products list.
 */
export default function CreateLoanProductPage() {
  const navigate = useNavigate();

  const handleCreateSuccess = (newLoanProduct) => {
    // Navigate to the loan products list after successful creation
    navigate("/admin/loan-products");
  };

  const handleClose = () => {
    navigate("/admin/loan-products");
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 0, sm: 3 } }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 3,
          gap: 1,
        }}
      >
        <IconButton onClick={handleClose} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Create Loan Product
        </Typography>
      </Box>
      <Paper elevation={2} sx={{ p: 3, backgroundColor: "background.paper" }}>
        <CreateLoanProduct
          onClose={handleClose}
          onCreateSuccess={handleCreateSuccess}
          hideCancel={false}
        />
      </Paper>
    </Box>
  );
}
