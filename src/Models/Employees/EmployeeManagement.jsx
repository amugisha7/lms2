import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import NotificationBar from "../../ModelAssets/NotificationBar";
import CreateEmployee from "./CreateEmployee/CreateEmployee";
import {
  fetchEmployeeById,
  getEmployeeDisplayName,
  updateEmployeeRecord,
} from "./employeeHelpers";

export default function EmployeeManagement() {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [forceEditMode, setForceEditMode] = React.useState(false);
  const [notification, setNotification] = React.useState({
    message: "",
    color: "green",
  });

  const loadEmployee = React.useCallback(async () => {
    if (!employeeId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const record = await fetchEmployeeById(employeeId);
      setEmployee(record);
    } catch (error) {
      console.error("Error loading employee:", error);
      setNotification({
        message: "Failed to load employee.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  React.useEffect(() => {
    loadEmployee();
  }, [loadEmployee]);

  const handleUpdate = async (values) => {
    const updated = await updateEmployeeRecord(values);
    setEmployee(updated);
    setForceEditMode(false);
    setNotification({
      message: "Employee updated successfully.",
      color: "green",
    });
    return updated;
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!employee) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Employee not found</Typography>
        <Button
          sx={{ mt: 2 }}
          variant="outlined"
          onClick={() => navigate("/employees")}
        >
          Back to Employees
        </Button>
      </Box>
    );
  }

  return (
    <>
      <NotificationBar
        message={notification.message}
        color={notification.color}
      />

      <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 0, sm: 3 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {getEmployeeDisplayName(employee)}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
              {employee.branch?.name || "No branch"}
              {employee.email ? ` • ${employee.email}` : ""}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="outlined" onClick={() => navigate("/employees")}>
              Back
            </Button>
            <Button variant="contained" onClick={() => setForceEditMode(true)}>
              Edit Employee
            </Button>
          </Box>
        </Box>

        <Paper elevation={2} sx={{ p: 3 }}>
          <CreateEmployee
            initialValues={employee}
            isEditMode={true}
            forceEditMode={forceEditMode}
            onUpdateEmployeeAPI={handleUpdate}
            onEditSuccess={(updated) => {
              setEmployee(updated);
            }}
            onCancel={() => setForceEditMode(false)}
          />
        </Paper>
      </Box>
    </>
  );
}
