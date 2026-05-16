import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { generateClient } from "aws-amplify/api";
import { UserContext } from "../../App";

// Reusable components
import CustomDataGrid from "../../ModelAssets/CustomDataGrid";
import CustomSlider from "../../ModelAssets/CustomSlider";
import DeleteDialog from "../../ModelAssets/DeleteDialog";
import NotificationBar from "../../ModelAssets/NotificationBar";
import ClickableText from "../../ModelAssets/ClickableText";
import PlusButtonMain from "../../ModelAssets/PlusButtonMain";
import PlusButtonSmall from "../../ModelAssets/PlusButtonSmall";
import WorkingOverlay from "../../ModelAssets/WorkingOverlay";

// Model-specific components
import CreateBorrower from "./CreateBorrower/CreateBorrower";
import { fetchBorrowerById } from "./CreateBorrower/createBorrowerHelpers";
import {
  resolveEmployeeIdForUser,
  syncBorrowerEmployeeAssignment,
} from "../Employees/employeeHelpers";

// GraphQL queries
import {
  GET_BRANCH_BORROWERS_QUERY,
  LIST_BORROWERS_QUERY,
  CREATE_BORROWER_MUTATION,
  UPDATE_BORROWER_MUTATION,
  DELETE_BORROWER_MUTATION,
} from "./borrowerQueries";

import { useHasPermission } from "../../ModelAssets/Permissions/permissions";

export default function Borrowers() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { userDetails } = useContext(UserContext);
  const client = React.useMemo(() => generateClient(), []);
  const activeBranchId = userDetails?.branchID || userDetails?.branch?.id || "";

  // State management
  const [borrowers, setBorrowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    message: "",
    color: "green",
  });
  const [workingOverlayOpen, setWorkingOverlayOpen] = useState(false);
  const [workingOverlayMessage, setWorkingOverlayMessage] =
    useState("Working...");

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Selected items
  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const [borrowerToDelete, setBorrowerToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);

  // Tab state for filtering borrowers
  const [selectedTab, setSelectedTab] = useState("all");

  // Selection for applicant approval
  const [selectedApprovalIds, setSelectedApprovalIds] = useState([]);

  // Ref to track fetched branch ID
  const hasFetchedRef = React.useRef();

  // Fetch borrowers
  const fetchBorrowers = async () => {
    if (!activeBranchId) {
      setBorrowers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setWorkingOverlayOpen(true);
    setWorkingOverlayMessage("Loading Borrowers...");
    try {
      let allBorrowers = [];
      let nextToken = null;

      do {
        console.log("API Call: Fetching borrowers"); // <-- Added
        const result = await client.graphql({
          query: GET_BRANCH_BORROWERS_QUERY,
          variables: {
            id: activeBranchId,
            limit: 100,
            ...(nextToken && { nextToken }),
          },
        });

        const batch = result?.data?.getBranch?.borrowers?.items || [];
        allBorrowers.push(...batch);
        nextToken = result?.data?.getBranch?.borrowers?.nextToken;
      } while (nextToken);

      let processed = allBorrowers.map((borrower) => ({
        ...borrower,
        displayName: getBorrowerDisplayName(borrower),
      }));

      setBorrowers(processed);
    } catch (error) {
      console.error("Error fetching borrowers:", error);
      setNotification({ message: "Error loading borrowers", color: "red" });
    } finally {
      setLoading(false);
      setWorkingOverlayOpen(false);
    }
  };

  // Helper function
  const getBorrowerDisplayName = (borrower) => {
    const fullName = [borrower.firstname, borrower.othername]
      .filter(Boolean)
      .join(" ");
    return fullName
      ? `${fullName}${
          borrower.businessName ? ` (${borrower.businessName})` : ""
        }`
      : borrower.businessName || "Unnamed Borrower";
  };

  // Valid borrower fields for GraphQL input
  const validBorrowerFields = [
    "firstname",
    "othername",
    "businessName",
    "typeOfBusiness",
    "uniqueIdNumber",
    "phoneNumber",
    "otherPhoneNumber",
    "email",
    "gender",
    "dateOfBirth",
    "nationality",
    "address",
    "city",
    "state",
    "title",
    "zipcode",
    "employmentStatus",
    "employerName",
    "creditScore",
    "customFieldsData",
    "status",
    "nationalIdPicture",
    "passportPicture",
    "points",
    "borrowerOpeningBalance",
    "borrowerClosingBalance",
    "borrowerInterestRate",
    "additionalNote1",
    "additionalNote2",
    "borrowerDocuments",
    "branchID",
    "branchBorrowersId",
  ];

  // CRUD operations
  const handleCreate = async (formData) => {
    try {
      const { employeeId, ...borrowerFormData } = formData;

      // Filter to only include valid GraphQL fields
      const filteredData = Object.keys(borrowerFormData)
        .filter((key) => validBorrowerFields.includes(key))
        .reduce((obj, key) => {
          if (
            borrowerFormData[key] !== "" &&
            borrowerFormData[key] !== null &&
            borrowerFormData[key] !== undefined
          ) {
            obj[key] = borrowerFormData[key];
          }
          return obj;
        }, {});

      const input = {
        ...filteredData,
      };

      if (input.branchBorrowersId && !input.branchID) {
        input.branchID = input.branchBorrowersId;
      }

      if (!input.branchID) {
        input.branchID = activeBranchId;
      }

      delete input.branchBorrowersId;

      console.log("API Call: Creating borrower"); // <-- Added

      const result = await client.graphql({
        query: CREATE_BORROWER_MUTATION,
        variables: { input },
      });

      const newBorrower = {
        ...result.data.createBorrower,
        displayName: getBorrowerDisplayName(result.data.createBorrower),
      };

      const resolvedEmployeeId = await resolveEmployeeIdForUser({
        userDetails,
        preferredEmployeeId: employeeId,
        branchId: input.branchID,
      });
      await syncBorrowerEmployeeAssignment({
        borrowerId: newBorrower.id,
        employeeId: resolvedEmployeeId,
      });
      newBorrower.employeeId = resolvedEmployeeId;

      setBorrowers((prev) => [...prev, newBorrower]);
      setNotification({
        message: `${newBorrower.displayName} created successfully!`,
        color: "green",
      });
    } catch (error) {
      console.error("Error creating borrower:", error);
      setNotification({ message: "Error creating borrower", color: "red" });
    }
  };

  const handleUpdate = async (formData) => {
    try {
      const { employeeId, ...borrowerFormData } = formData;

      // Filter to only include valid GraphQL fields
      const filteredData = Object.keys(borrowerFormData)
        .filter((key) => validBorrowerFields.includes(key))
        .reduce((obj, key) => {
          if (
            borrowerFormData[key] !== "" &&
            borrowerFormData[key] !== null &&
            borrowerFormData[key] !== undefined
          ) {
            obj[key] = borrowerFormData[key];
          }
          return obj;
        }, {});

      const input = {
        id: selectedBorrower.id,
        ...filteredData,
      };

      // Ensure specific fields are included if stripped by filter but present in formData
      if (borrowerFormData.branchBorrowersId && !input.branchID) {
        input.branchID = borrowerFormData.branchBorrowersId;
      }

      if (!input.branchID) {
        input.branchID = activeBranchId;
      }

      delete input.branchBorrowersId;

      console.log("API Call: Updating borrower"); // <-- Added
      const result = await client.graphql({
        query: UPDATE_BORROWER_MUTATION,
        variables: { input },
      });

      const updatedBorrower = {
        ...result.data.updateBorrower,
        displayName: getBorrowerDisplayName(result.data.updateBorrower),
      };

      const resolvedEmployeeId = await resolveEmployeeIdForUser({
        userDetails,
        preferredEmployeeId: employeeId,
        branchId: input.branchID,
      });
      await syncBorrowerEmployeeAssignment({
        borrowerId: updatedBorrower.id,
        employeeId: resolvedEmployeeId,
      });
      updatedBorrower.employeeId = resolvedEmployeeId;

      setBorrowers((prev) =>
        prev.map((b) => (b.id === updatedBorrower.id ? updatedBorrower : b)),
      );
      setNotification({
        message: `${updatedBorrower.displayName} updated successfully!`,
        color: "green",
      });
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating borrower:", error);
      setNotification({ message: "Error updating borrower", color: "red" });
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    setWorkingOverlayOpen(true);
    setWorkingOverlayMessage("Deleting Borrower...");
    try {
      console.log("API Call: Deleting borrower"); // <-- Added
      await client.graphql({
        query: DELETE_BORROWER_MUTATION,
        variables: { input: { id: borrowerToDelete.id } },
      });

      setBorrowers((prev) => prev.filter((b) => b.id !== borrowerToDelete.id));
      setNotification({
        message: `${borrowerToDelete.displayName} deleted successfully!`,
        color: "green",
      });
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting borrower:", error);
      setNotification({ message: "Error deleting borrower", color: "red" });
    } finally {
      setDeleteLoading(false);
      setWorkingOverlayOpen(false);
    }
  };

  // Event handlers
  const openEditDialog = async (borrower) => {
    try {
      const fullBorrower = await fetchBorrowerById(borrower.id);
      setSelectedBorrower(fullBorrower);
      setEditDialogOpen(true);
    } catch (error) {
      console.error("Error loading borrower for edit:", error);
      setNotification({ message: "Error loading borrower", color: "red" });
    }
  };

  const openDeleteDialog = (borrower) => {
    setBorrowerToDelete(borrower);
    setDeleteDialogOpen(true);
  };

  // Data grid configuration
  const columns = [
    {
      field: "displayName",
      headerName: "Full Name / Business Name",
      width: 280,
      renderCell: (params) => (
        <ClickableText
          onClick={() => navigate(`/borrowers/id/${params.row.id}/view`)}
        >
          {params.value}
        </ClickableText>
      ),
    },
    {
      field: "phoneNumber",
      headerName: "Phone No.",
      width: 140,
    },
    {
      field: "otherPhoneNumber",
      headerName: "Alt. Phone No.",
      width: 140,
    },
    {
      field: "email",
      headerName: "Email",
      width: 240,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        const status = params.value || "active";
        const statusColor =
          status === "pending"
            ? "warning.main"
            : status === "suspended" ||
                status === "rejected" ||
                status === "blacklisted"
              ? "error.main"
              : "success.main";
        return (
          <Typography
            variant="body2"
            sx={{
              color: statusColor,
              fontWeight: 500,
              textTransform: "capitalize",
            }}
          >
            {status}
          </Typography>
        );
      },
    },
  ];

  // Effects - fetch data once, filter client-side
  useEffect(() => {
    if (!activeBranchId) {
      setBorrowers([]);
      setLoading(false);
      hasFetchedRef.current = null;
      return;
    }

    if (activeBranchId !== hasFetchedRef.current) {
      fetchBorrowers();
      hasFetchedRef.current = activeBranchId;
    }
  }, [activeBranchId]);

  const canCreateBorrower = useHasPermission("create", "borrower");
  const shouldShowBorrowersView = Boolean(activeBranchId);

  // Tab change handler
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setSelectedApprovalIds([]);
  };

  const isApprovedBorrower = (borrower) => {
    const status = borrower.status;
    return status === "approved" || status === "active" || !status;
  };

  // Filter borrowers based on selected tab and branch filter (client-side)
  // "pending" tab shows borrowers with status "pending" (applicant approval)
  // "all" tab shows borrowers with status "active" or no status (approved + internally created)
  const filteredBorrowers = React.useMemo(() => {
    let filtered = borrowers;

    // Apply tab filter
    if (selectedTab === "pending") {
      return filtered.filter((b) => b.status === "pending");
    }
    if (selectedTab === "approved") {
      return filtered.filter((b) => isApprovedBorrower(b));
    }
    // "all" tab shows all borrowers in scope
    return filtered;
  }, [borrowers, selectedTab]);

  // Count pending borrowers for tab badge
  const pendingCount = React.useMemo(() => {
    return borrowers.filter((b) => b.status === "pending").length;
  }, [borrowers]);

  const approvedCount = React.useMemo(() => {
    return borrowers.filter((b) => isApprovedBorrower(b)).length;
  }, [borrowers]);

  const approvalSelectionModel = React.useMemo(
    () => ({ type: "include", ids: new Set(selectedApprovalIds) }),
    [selectedApprovalIds],
  );

  const handleApproveSelected = async () => {
    if (!selectedApprovalIds.length) return;

    setApproveLoading(true);
    setWorkingOverlayOpen(true);
    setWorkingOverlayMessage(
      `Approving Borrower${selectedApprovalIds.length > 1 ? "s" : ""}...`,
    );
    try {
      await Promise.all(
        selectedApprovalIds.map((id) =>
          client.graphql({
            query: UPDATE_BORROWER_MUTATION,
            variables: {
              input: {
                id,
                status: "approved",
              },
            },
          }),
        ),
      );

      setBorrowers((prev) =>
        prev.map((b) =>
          selectedApprovalIds.includes(b.id) ? { ...b, status: "approved" } : b,
        ),
      );
      setSelectedApprovalIds([]);
      setNotification({
        message: "Selected borrowers approved successfully!",
        color: "green",
      });
    } catch (error) {
      console.error("Error approving borrowers:", error);
      setNotification({ message: "Error approving borrowers", color: "red" });
    } finally {
      setApproveLoading(false);
      setWorkingOverlayOpen(false);
    }
  };

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
            Borrowers
          </Typography>
          {canCreateBorrower && (
            <PlusButtonMain
              onClick={() => navigate("/addBorrower")}
              buttonText="CREATE BORROWER"
            />
          )}
        </Box>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Click on a Borrower to view or edit their details, add files and
          custom fields.
        </Typography>

        {!shouldShowBorrowersView && (
          <Box sx={{ p: 2, mb: 2, bgcolor: "info.light" }}>
            <Typography variant="body2">
              No active branch is loaded. Use Change Branch from the top bar.
            </Typography>
          </Box>
        )}

        {shouldShowBorrowersView && (
          <>
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
                  aria-label="borrower filter tabs"
                  variant="scrollable"
                  scrollButtons
                  allowScrollButtonsMobile
                  sx={{
                    "& .MuiTabs-indicator": {
                      backgroundColor: theme.palette.blueText.main,
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
                        color: theme.palette.blueText.main,
                      },
                      "&.Mui-selected": {
                        color: theme.palette.blueText.main,
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
                  <Tab label="All Borrowers" value="all" />
                  <Tab
                    label={`Approved Borrowers${approvedCount > 0 ? ` (${approvedCount})` : ""}`}
                    value="approved"
                  />
                  <Tab
                    label={`Pending Approval${pendingCount > 0 ? ` (${pendingCount})` : ""}`}
                    value="pending"
                  />
                </Tabs>
              </Box>
            </Box>

            {selectedTab === "pending" && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mb: 1,
                }}
              >
                <PlusButtonSmall
                  label="APPROVE SELECTED"
                  disabled={selectedApprovalIds.length === 0 || approveLoading}
                  onClick={handleApproveSelected}
                />
              </Box>
            )}

            <CustomDataGrid
              rows={filteredBorrowers}
              columns={columns}
              loading={loading}
              getRowId={(row) => row.id}
              pageSize={25}
              pageSizeOptions={[25, 50, 100]}
              checkboxSelection={selectedTab === "pending"}
              rowSelectionModel={
                selectedTab === "pending" ? approvalSelectionModel : undefined
              }
              onRowSelectionModelChange={
                selectedTab === "pending"
                  ? (newSelection) =>
                      setSelectedApprovalIds(
                        Array.from(newSelection?.ids || []),
                      )
                  : undefined
              }
            />

            <CustomSlider
              open={editDialogOpen}
              onClose={() => setEditDialogOpen(false)}
              title={selectedBorrower?.displayName || "Edit Borrower"}
              showEdit={false}
              showDelete={false}
            >
              <CreateBorrower
                initialValues={selectedBorrower}
                onUpdateBorrowerAPI={handleUpdate}
                onClose={() => setEditDialogOpen(false)}
                isEditMode={true}
                forceEditMode={true}
              />
            </CustomSlider>

            <DeleteDialog
              open={deleteDialogOpen}
              onClose={() => setDeleteDialogOpen(false)}
              onConfirm={handleDelete}
              loading={deleteLoading}
              name={borrowerToDelete?.displayName}
            />
          </>
        )}
      </Box>
    </>
  );
}
