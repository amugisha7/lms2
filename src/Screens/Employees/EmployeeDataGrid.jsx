import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarExport,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { generateClient } from "aws-amplify/api";
import { listEmployees } from "../../graphql/queries";
import { deleteEmployee } from "../../graphql/mutations";
import CreateEmployee from "./CreateEmployee";
import EmployeeDetails from "./EmployeeDetails";

const client = generateClient();

function CustomToolbar({ onCreateClick }) {
  return (
    <GridToolbarContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
          p: 1,
        }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreateClick}
            size="small"
          >
            Add Employee
          </Button>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <GridToolbarQuickFilter size="small" />
          <GridToolbarExport />
        </Box>
      </Box>
    </GridToolbarContainer>
  );
}

const EmployeeDataGrid = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });

  // Fetch all employees with pagination handling
  const fetchAllEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let allEmployees = [];
      let nextToken = null;

      do {
        const variables = {
          limit: 1000, // Max items per request
          ...(nextToken && { nextToken }),
        };

        const result = await client.graphql({
          query: listEmployees,
          variables,
        });

        const { items, nextToken: newNextToken } = result.data.listEmployees;
        allEmployees = [...allEmployees, ...items];
        nextToken = newNextToken;
      } while (nextToken);

      setEmployees(allEmployees);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError("Failed to load employees. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllEmployees();

    // Check for success messages from navigation
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the state to prevent showing the message again
      window.history.replaceState({}, document.title);
    }
  }, [fetchAllEmployees, location.state]);

  const handleCreateEmployee = () => {
    navigate("/employees/create");
  };

  const handleCreateSuccess = (newEmployee) => {
    setEmployees((prev) => [newEmployee, ...prev]);
    setCreateDialogOpen(false);
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setDetailsDialogOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setDetailsDialogOpen(true);
  };

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!employeeToDelete) return;

    setDeleteLoading(true);
    try {
      await client.graphql({
        query: deleteEmployee,
        variables: {
          input: { id: employeeToDelete.id },
        },
      });

      setEmployees((prev) =>
        prev.filter((emp) => emp.id !== employeeToDelete.id)
      );
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    } catch (err) {
      console.error("Error deleting employee:", err);
      setError("Failed to delete employee. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEmployeeUpdate = (updatedEmployee) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
    );
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

  const columns = [
    {
      field: "avatar",
      headerName: "",
      width: 60,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
          <PersonIcon fontSize="small" />
        </Avatar>
      ),
    },
    {
      field: "fullName",
      headerName: "Name",
      width: 200,
      valueGetter: (params) => {
        if (!params || !params.row) return "";
        const { firstName, lastName, middleName } = params.row;
        return `${firstName || ""} ${middleName || ""} ${
          lastName || ""
        }`.trim();
      },
      renderCell: (params) => (
        <Box
          sx={{
            cursor: "pointer",
            "&:hover": { color: "primary.main", textDecoration: "underline" },
            fontWeight: 500,
          }}
          onClick={() => handleViewEmployee(params.row)}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "employmentPosition",
      headerName: "Position",
      width: 150,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "phoneNumber1",
      headerName: "Phone",
      width: 130,
    },
    {
      field: "employmentDepartment",
      headerName: "Department",
      width: 130,
    },
    {
      field: "employmentStatus",
      headerName: "Employment Status",
      width: 150,
      renderCell: (params) => getEmploymentStatusChip(params.value),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => getStatusChip(params.value),
    },
    {
      field: "employmentStartDate",
      headerName: "Start Date",
      width: 120,
      type: "date",
      valueGetter: (params) => {
        if (!params || !params.row || !params.value) return null;
        return new Date(params.value);
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={
            <Tooltip title="View Details">
              <ViewIcon />
            </Tooltip>
          }
          label="View"
          onClick={() => handleViewEmployee(params.row)}
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title="Edit Employee">
              <EditIcon />
            </Tooltip>
          }
          label="Edit"
          onClick={() => handleEditEmployee(params.row)}
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title="Delete Employee">
              <DeleteIcon />
            </Tooltip>
          }
          label="Delete"
          onClick={() => handleDeleteClick(params.row)}
        />,
      ],
    },
  ];

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchAllEmployees}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Employee Management
      </Typography>

      <Paper sx={{ width: "100%", mb: 2 }}>
        <DataGrid
          rows={employees}
          columns={columns}
          loading={loading}
          pageSizeOptions={[25, 50, 100]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          disableRowSelectionOnClick
          slots={{
            toolbar: CustomToolbar,
          }}
          slotProps={{
            toolbar: {
              onCreateClick: handleCreateEmployee,
            },
          }}
          sx={{
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "action.hover",
            },
            height: 600,
          }}
        />
      </Paper>

      {/* Create Employee Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Employee</DialogTitle>
        <DialogContent>
          <CreateEmployee
            onSuccess={handleCreateSuccess}
            onCancel={() => setCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Employee Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { height: "90vh" },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {selectedEmployee && (
            <EmployeeDetails
              employee={selectedEmployee}
              onClose={() => setDetailsDialogOpen(false)}
              onUpdate={handleEmployeeUpdate}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleteLoading && setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete employee{" "}
            <strong>
              {employeeToDelete?.firstName} {employeeToDelete?.lastName}
            </strong>
            ? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Message Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSuccessMessage("")}
          severity="success"
          variant="filled"
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmployeeDataGrid;
