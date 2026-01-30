import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
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
    <Box
      sx={{
        mx: { xs: 0, sm: "auto" },
        mt: { xs: 0, sm: 0 },
        p: { xs: 2, sm: 2 },
        borderRadius: 1,
        display: "flex",
        flexDirection: "column",
        maxWidth: { xs: "100%", md: 1000 },
        width: "100%",
        flex: 1,
        mb: 6,
      }}
    >
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

      <CreateLoanProduct
        onClose={handleClose}
        onCreateSuccess={handleCreateSuccess}
        hideCancel={false}
      />
    </Box>
  );
}
