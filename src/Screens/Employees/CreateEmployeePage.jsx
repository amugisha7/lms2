import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Button } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import CreateEmployee from "./CreateEmployee";

const CreateEmployeePage = () => {
  const navigate = useNavigate();

  const handleSuccess = (newEmployee) => {
    // Navigate back to employees list after successful creation
    navigate("/employees", {
      state: {
        message: `Employee ${newEmployee.firstName} ${newEmployee.lastName} created successfully!`,
      },
    });
  };

  const handleCancel = () => {
    navigate("/employees");
  };

  return (
    <Box sx={{ p: 3, maxWidth: "1200px", mx: "auto" }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/employees")}
            sx={{ mr: 2 }}
          >
            Back to Employees
          </Button>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Create New Employee
          </Typography>
        </Box>

        <CreateEmployee onSuccess={handleSuccess} onCancel={handleCancel} />
      </Paper>
    </Box>
  );
};

export default CreateEmployeePage;
