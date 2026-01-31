import React, { useContext } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { CustomerContext } from "../../CustomerApp";
import CustomerLoanProductForm from "./CustomerLoanProductForm";

/**
 * Customer Loan Application
 *
 * Enterprise-grade loan application flow:
 * - Customers apply for loans exclusively through pre-configured loan products
 * - Loan products define all terms (interest rates, duration limits, fees)
 * - This ensures consistency, compliance, and reduces application errors
 * - For loan estimates without applying, customers can use the Loan Calculator
 */
export default function CustomerLoanApplication() {
  const { borrower } = useContext(CustomerContext);

  if (!borrower) {
    return (
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
          Apply for Loan
        </Typography>
        <Paper sx={{ p: 3, bgcolor: "warning.light" }}>
          <Typography>
            Please complete your profile to apply for a loan.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", pb: 8 }}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
        Apply for Loan
      </Typography>
      <CustomerLoanProductForm />
    </Box>
  );
}
