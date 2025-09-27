import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Typography,
  Avatar,
  Chip,
  Button,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { generateClient } from "aws-amplify/api";
import { getEmployee } from "../../graphql/queries";
import { updateEmployee } from "../../graphql/mutations";
import EmployeeDetailsTab from "./EmployeeDetailsTab";
import EmployeeCustomFieldsTab from "./EmployeeCustomFieldsTab";
import EmployeeFilesTab from "./EmployeeFilesTab";

const client = generateClient();

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`employee-tabpanel-${index}`}
      aria-labelledby={`employee-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const EmployeeDetails = ({ employee: initialEmployee, onClose, onUpdate }) => {
  const [employee, setEmployee] = useState(initialEmployee);
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch complete employee details when component mounts
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      if (!initialEmployee?.id) return;

      setLoading(true);
      try {
        const result = await client.graphql({
          query: getEmployee,
          variables: { id: initialEmployee.id },
        });

        if (result.data.getEmployee) {
          setEmployee(result.data.getEmployee);
        }
      } catch (err) {
        console.error("Error fetching employee details:", err);
        setError("Failed to load complete employee details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [initialEmployee?.id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
    setSuccess(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError(null);
    setSuccess(false);
    // Reset employee data to original
    setEmployee(initialEmployee);
  };

  const handleSave = async (updatedData) => {
    setLoading(true);
    setError(null);

    try {
      // Prepare update input
      const input = {
        id: employee.id,
        ...updatedData,
      };

      // Remove fields that shouldn't be updated
      delete input.createdAt;
      delete input.updatedAt;
      delete input.__typename;
      delete input.branch;
      delete input.payroll;
      delete input.approvedLoans;
      delete input.approvedExpenses;
      delete input.approvedApplications;
      delete input.approvedCreditScores;
      delete input.approvedMoneyTransactions;
      delete input.approvedPayments;
      delete input.borrowers;
      delete input.supervisor;
      delete input.subordinates;
      delete input.creditScore;
      delete input.applications;
      delete input.documents;
      delete input.expenses;
      delete input.payments;
      delete input.loans;
      delete input.moneyTransactions;
      delete input.accounts;

      const result = await client.graphql({
        query: updateEmployee,
        variables: { input },
      });

      const updatedEmployee = result.data.updateEmployee;
      setEmployee(updatedEmployee);
      setIsEditing(false);
      setSuccess(true);

      // Notify parent component
      onUpdate(updatedEmployee);

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error updating employee:", err);
      setError("Failed to update employee. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusChip = (status) => {
    const statusColors = {
      ACTIVE: "success",
      INACTIVE: "default",
      SUSPENDED: "warning",
      TERMINATED: "error",
    };

    return (
      <Chip
        label={status || "UNKNOWN"}
        color={statusColors[status] || "default"}
        size="small"
      />
    );
  };

  const getEmploymentStatusChip = (employmentStatus) => {
    const statusColors = {
      FULL_TIME: "primary",
      PART_TIME: "secondary",
      CONTRACT: "info",
      INTERN: "warning",
      TERMINATED: "error",
    };

    return (
      <Chip
        label={employmentStatus?.replace("_", " ") || "UNKNOWN"}
        color={statusColors[employmentStatus] || "default"}
        size="small"
        variant="outlined"
      />
    );
  };

  if (loading && !employee.firstName) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Paper sx={{ p: 3, borderRadius: 0 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "primary.main",
                fontSize: "2rem",
              }}
            >
              <PersonIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight={600}>
                {`${employee.firstName || ""} ${employee.middleName || ""} ${
                  employee.lastName || ""
                }`.trim()}
              </Typography>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                {employee.employmentPosition || "No Position"}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {getEmploymentStatusChip(employee.employmentStatus)}
                {getStatusChip(employee.status)}
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            {!isEditing ? (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleEdit}
                disabled={loading}
              >
                Edit
              </Button>
            ) : (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancelEdit}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </Box>
            )}
            <IconButton
              onClick={onClose}
              disabled={loading}
              sx={{ color: "text.secondary" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Employee updated successfully!
          </Alert>
        )}
      </Paper>

      {/* Tabs */}
      <Paper
        sx={{ borderRadius: 0, borderTop: "1px solid", borderColor: "divider" }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="employee details tabs"
          sx={{ px: 3 }}
        >
          <Tab label="Details" />
          <Tab label="Custom Fields" />
          <Tab label="Files" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        <TabPanel value={tabValue} index={0}>
          <EmployeeDetailsTab
            employee={employee}
            isEditing={isEditing}
            onSave={handleSave}
            loading={loading}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <EmployeeCustomFieldsTab
            employee={employee}
            isEditing={isEditing}
            onSave={handleSave}
            loading={loading}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <EmployeeFilesTab
            employee={employee}
            isEditing={isEditing}
            onSave={handleSave}
            loading={loading}
          />
        </TabPanel>
      </Box>
    </Box>
  );
};

export default EmployeeDetails;
