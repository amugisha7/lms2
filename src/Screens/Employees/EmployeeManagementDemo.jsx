import React from "react";
import { Box, Typography, Container } from "@mui/material";
import EmployeeDataGrid from "./EmployeeDataGrid";

/**
 * Demo component showing how to use the Employee Management System
 *
 * This is the main entry point for the employee management functionality.
 * Simply import and use this component in your application.
 */
const EmployeeManagementDemo = () => {
  return (
    <Container maxWidth={false} sx={{ py: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Employee Management System
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Enterprise-grade employee management with Salesforce-like
          functionality
        </Typography>
      </Box>

      {/* Main Employee DataGrid Component */}
      <EmployeeDataGrid />
    </Container>
  );
};

export default EmployeeManagementDemo;
