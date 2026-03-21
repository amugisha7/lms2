import React, { useContext, useEffect, useMemo, useState } from "react";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { generateClient } from "aws-amplify/api";
import { Formik, Form, useField } from "formik";

import { UserContext } from "../../App";
import { listBranches } from "../../graphql/queries";
import CustomDataGrid from "../../ModelAssets/CustomDataGrid";
import ClickableText from "../../ModelAssets/ClickableText";
import NotificationBar from "../../ModelAssets/NotificationBar";
import PlusButtonMain from "../../ModelAssets/PlusButtonMain";
import WorkingOverlay from "../../ModelAssets/WorkingOverlay";
import MultipleDropDownSearchable from "../../Resources/FormComponents/MultipleDropDownSearchable";
import {
  getEmployeeDisplayName,
  listEmployeesForUserContext,
} from "./employeeHelpers";
import { useHasPermission } from "../../ModelAssets/Permissions/permissions";

// Effect component used inside Formik to sync branch filter values
function FormikEffect({ onChange, fieldName }) {
  const [field] = useField(fieldName);
  const prevValueRef = React.useRef(field.value);

  React.useEffect(() => {
    if (JSON.stringify(field.value) !== JSON.stringify(prevValueRef.current)) {
      prevValueRef.current = field.value;
      onChange(field.value);
    }
  }, [field.value, onChange]);

  return null;
}

// Branch filter dropdown wrapper — matches Borrowers layout exactly
function BranchFilterWrapper({ branches, onFilterChange, selectedCount }) {
  return (
    <Box sx={{ mb: 3, width: "100%" }}>
      <Formik initialValues={{ branchFilter: [] }} enableReinitialize>
        <Form>
          <FormikEffect onChange={onFilterChange} fieldName="branchFilter" />
          <MultipleDropDownSearchable
            label="Filter by Branch"
            name="branchFilter"
            options={branches.map((b) => ({ value: b.id, label: b.name }))}
            placeholder={selectedCount === 0 ? "All Branches" : ""}
            editing={true}
            helperText={
              selectedCount === 0
                ? "Showing all branches"
                : `Showing ${selectedCount} branch(es)`
            }
          />
        </Form>
      </Formik>
    </Box>
  );
}

export default function Employees() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { userDetails } = useContext(UserContext);
  const client = useMemo(() => generateClient(), []);
  const canCreateEmployee = useHasPermission("create", "employee");

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    message: "",
    color: "green",
  });
  const [workingOverlayOpen, setWorkingOverlayOpen] = useState(false);
  const [workingOverlayMessage, setWorkingOverlayMessage] =
    useState("Working...");

  // Tab state for status filtering
  const [selectedTab, setSelectedTab] = useState("all");

  // Branch filter state for Admin users
  const [branches, setBranches] = useState([]);
  const [selectedBranchFilter, setSelectedBranchFilter] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const loadEmployees = async () => {
      if (!userDetails) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setWorkingOverlayOpen(true);
        setWorkingOverlayMessage("Loading Employees...");
        const items = await listEmployeesForUserContext(userDetails);
        if (!cancelled) {
          setEmployees(items);
        }
      } catch (error) {
        console.error("Error loading employees:", error);
        if (!cancelled) {
          setNotification({
            message: "Failed to load employees.",
            color: "red",
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setWorkingOverlayOpen(false);
        }
      }
    };

    loadEmployees();

    return () => {
      cancelled = true;
    };
  }, [userDetails]);

  // Fetch branches from GraphQL for Admin users (mirrors Borrowers)
  useEffect(() => {
    const fetchBranchesForAdmin = async () => {
      if (userDetails?.userType === "Admin" && userDetails?.institution?.id) {
        try {
          const branchData = await client.graphql({
            query: listBranches,
            variables: {
              limit: 1000,
              filter: {
                institutionBranchesId: { eq: userDetails.institution.id },
              },
            },
          });
          const items = branchData.data.listBranches.items || [];
          setBranches(items);
          setSelectedBranchFilter([]);
        } catch (e) {
          console.error("Error fetching branches", e);
        }
      }
    };

    if (userDetails) {
      fetchBranchesForAdmin();
    }
  }, [userDetails, client]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const isActiveEmployee = (employee) => {
    const status = (employee.status || "").toLowerCase();
    return status === "active" || status === "";
  };

  const filteredEmployees = useMemo(() => {
    let filtered = employees;

    // Apply branch filter for Admin users (client-side)
    if (userDetails?.userType === "Admin" && selectedBranchFilter.length > 0) {
      filtered = filtered.filter((e) =>
        selectedBranchFilter.includes(e.branch?.id),
      );
    }

    // Apply tab filter
    if (selectedTab === "active") {
      return filtered.filter((e) => isActiveEmployee(e));
    }
    if (selectedTab === "inactive") {
      return filtered.filter(
        (e) => (e.status || "").toLowerCase() === "inactive",
      );
    }
    return filtered;
  }, [employees, selectedTab, selectedBranchFilter, userDetails]);

  const activeCount = useMemo(
    () => employees.filter((e) => isActiveEmployee(e)).length,
    [employees],
  );

  const inactiveCount = useMemo(
    () =>
      employees.filter((e) => (e.status || "").toLowerCase() === "inactive")
        .length,
    [employees],
  );

  const rows = filteredEmployees.map((employee) => ({
    ...employee,
    displayName: getEmployeeDisplayName(employee),
  }));

  const columns = [
    {
      field: "displayName",
      headerName: "Employee",
      minWidth: 260,
      flex: 1.3,
      renderCell: (params) => (
        <ClickableText
          onClick={() => navigate(`/employees/id/${params.row.id}/view`)}
        >
          {params.value}
        </ClickableText>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 220,
      flex: 1,
    },
    {
      field: "phoneNumber1",
      headerName: "Phone",
      minWidth: 140,
      flex: 0.8,
    },
    {
      field: "employmentPosition",
      headerName: "Position",
      minWidth: 180,
      flex: 0.9,
      valueGetter: (value, row) => row.employmentPosition || row.title || "",
    },
    {
      field: "branchName",
      headerName: "Branch",
      minWidth: 160,
      flex: 0.8,
      valueGetter: (value, row) => row.branch?.name || "",
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 120,
      flex: 0.6,
    },
  ];

  return (
    <>
      <NotificationBar
        message={notification.message}
        color={notification.color}
      />
      <WorkingOverlay
        open={workingOverlayOpen}
        message={workingOverlayMessage}
      />

      <Box>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Employees
          </Typography>
          {canCreateEmployee && (
            <PlusButtonMain
              onClick={() => navigate("/employees/create")}
              buttonText="ADD EMPLOYEE"
            />
          )}
        </Box>

        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Click on an Employee to view or edit their details, add files and
          custom fields.
        </Typography>

        {/* Branch Filter - Admin Only */}
        {userDetails?.userType === "Admin" && branches.length > 0 && (
          <BranchFilterWrapper
            branches={branches}
            onFilterChange={setSelectedBranchFilter}
            selectedCount={selectedBranchFilter.length}
          />
        )}

        {/* Tabs */}
        <Box sx={{ width: "100%", mb: 2 }}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: theme.palette.divider,
              backgroundColor: theme.palette.background.paper,
              borderRadius: "8px 8px 0 0",
            }}
          >
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              aria-label="employee filter tabs"
              variant="scrollable"
              scrollButtons
              allowScrollButtonsMobile
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: theme.palette.blueText?.main,
                  height: 3,
                  borderRadius: "1.5px",
                },
                "& .MuiTab-root": {
                  fontFamily: theme.typography.fontFamily,
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  textTransform: "none",
                  letterSpacing: "0.02em",
                  color: theme.palette.text.secondary,
                  minHeight: 48,
                  padding: "12px 24px",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    color: theme.palette.blueText?.main,
                  },
                  "&.Mui-selected": {
                    color: theme.palette.blueText?.main,
                    fontWeight: 600,
                  },
                  "&.Mui-focusVisible": {
                    backgroundColor: theme.palette.action.focus,
                  },
                },
                "& .MuiTabs-flexContainer": {
                  gap: 1,
                },
              }}
            >
              <Tab label="All Employees" value="all" />
              <Tab
                label={`Active${activeCount > 0 ? ` (${activeCount})` : ""}`}
                value="active"
              />
              <Tab
                label={`Inactive${inactiveCount > 0 ? ` (${inactiveCount})` : ""}`}
                value="inactive"
              />
            </Tabs>
          </Box>
        </Box>

        <CustomDataGrid rows={rows} columns={columns} loading={loading} />
      </Box>
    </>
  );
}
