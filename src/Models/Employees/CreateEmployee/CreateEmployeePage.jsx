import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import NotificationBar from "../../../ModelAssets/NotificationBar";
import CreateEmployee from "./CreateEmployee";
import { createEmployeeRecord } from "../employeeHelpers";

export default function CreateEmployeePage() {
  const navigate = useNavigate();
  const [notification, setNotification] = React.useState({
    message: "",
    color: "green",
  });

  const handleCreate = async (values) => {
    const created = await createEmployeeRecord(values);
    setNotification({
      message: "Employee created successfully.",
      color: "green",
    });

    setTimeout(() => {
      navigate(`/employees/id/${created.id}/view`);
    }, 700);

    return created;
  };

  return (
    <>
      <NotificationBar
        message={notification.message}
        color={notification.color}
      />
      <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 0, sm: 3 } }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
          Create New Employee
        </Typography>
        <Paper elevation={2} sx={{ p: 3 }}>
          <CreateEmployee
            onCreateEmployeeAPI={handleCreate}
            onClose={() => navigate("/employees")}
            forceEditMode={true}
          />
        </Paper>
      </Box>
    </>
  );
}
