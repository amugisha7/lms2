import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTheme } from "@mui/material/styles";
import { Formik } from "formik";
import { UserContext } from "../../App";
import CreateBorrower from "./CreateBorrower/CreateBorrower";
import NotificationBar from "../../ComponentAssets/NotificationBar";
import ClickableText from "../../ComponentAssets/ClickableText";
import EditContentPopup from "../../ModelAssets/EditContentPopup";
import CustomBorrowerFields from "./CustomBorrowerFields/CustomBorrowerFields";
import EditableCustomBorrowerFields from "./CustomBorrowerFields/EditableCustomBorrowerFields";
import {
  fetchCustomFieldsForBorrower,
  mapCustomFieldsToFormValues,
  updateBorrowerCustomFields,
} from "./CustomBorrowerFields/customFieldsHelpers";
import {
  fetchBorrowerById,
  updateBorrowerById,
} from "./CreateBorrower/createBorrowerHelpers";
import BorrowerFiles from "./BorrowerFiles/BorrowerFiles";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`borrower-tabpanel-${index}`}
      aria-labelledby={`borrower-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function BorrowerManagement() {
  const { borrowerId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { userDetails } = useContext(UserContext);
  const [tabValue, setTabValue] = useState(0);
  const [borrower, setBorrower] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState({
    message: "",
    color: "green",
  });
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [customFields, setCustomFields] = useState([]);
  const [customFieldsLoading, setCustomFieldsLoading] = useState(true);
  const [editCustomFieldsPopupOpen, setEditCustomFieldsPopupOpen] =
    useState(false);
  const fetchedBorrowerIdRef = React.useRef();
  const fetchedCustomFieldsRef = React.useRef({
    institutionUsersId: null,
    branchUsersId: null,
  }); // <-- Add ref

  // Fetch borrower data
  useEffect(() => {
    const fetchBorrower = async () => {
      if (!borrowerId) {
        setError("No borrower ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("API Call: Fetching borrower by ID", borrowerId);
        const borrowerData = await fetchBorrowerById(borrowerId); // <-- Use helper
        console.log("API Call: Borrower fetched successfully", borrowerData);
        setBorrower(borrowerData);
      } catch (err) {
        console.error("Error fetching borrower:", err);
        setError(err.message || "Failed to load borrower details");
      } finally {
        setLoading(false);
      }
    };

    if (borrowerId && borrowerId !== fetchedBorrowerIdRef.current) {
      fetchBorrower();
      fetchedBorrowerIdRef.current = borrowerId;
    }
  }, [borrowerId]);

  // Fetch custom fields
  useEffect(() => {
    const fetchCustomFields = async () => {
      if (!userDetails?.institutionUsersId || !userDetails?.branchUsersId) {
        setCustomFieldsLoading(false);
        return;
      }

      try {
        setCustomFieldsLoading(true);
        console.log("API Call: Fetching custom fields for borrower", {
          institutionUsersId: userDetails.institutionUsersId,
          branchUsersId: userDetails.branchUsersId,
        });
        const fields = await fetchCustomFieldsForBorrower(
          userDetails.institutionUsersId,
          userDetails.branchUsersId
        );
        console.log("API Call: Custom fields fetched successfully", fields);
        setCustomFields(fields);
      } catch (error) {
        console.error("Error fetching custom fields:", error);
      } finally {
        setCustomFieldsLoading(false);
      }
    };

    // Only fetch if institutionUsersId or branchUsersId changed
    if (
      userDetails?.institutionUsersId &&
      userDetails?.branchUsersId &&
      (fetchedCustomFieldsRef.current.institutionUsersId !==
        userDetails.institutionUsersId ||
        fetchedCustomFieldsRef.current.branchUsersId !==
          userDetails.branchUsersId)
    ) {
      fetchCustomFields();
      fetchedCustomFieldsRef.current = {
        institutionUsersId: userDetails.institutionUsersId,
        branchUsersId: userDetails.branchUsersId,
      };
    }
  }, [userDetails?.institutionUsersId, userDetails?.branchUsersId]);

  // API handler for updating borrower
  const handleUpdateBorrowerAPI = async (values, initialValues) => {
    console.log("API Call: Updating borrower", { values, initialValues });
    const result = await updateBorrowerById(values, initialValues); // <-- Use helper
    console.log("API Call: Borrower updated successfully", result);
    return result;
  };

  const handleEditSuccess = (updatedBorrower) => {
    setBorrower(updatedBorrower);
    const combinedName =
      updatedBorrower.firstname || updatedBorrower.othername
        ? `${[updatedBorrower.firstname, updatedBorrower.othername]
            .filter(Boolean)
            .join(" ")}${
            updatedBorrower.businessName
              ? ` (${updatedBorrower.businessName})`
              : ""
          }`
        : updatedBorrower.businessName || "";
    setNotification({
      message: `${combinedName} updated successfully!`,
      color: "green",
    });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getBorrowerName = () => {
    if (!borrower) return "Borrower";
    return borrower.firstname || borrower.othername
      ? `${[borrower.firstname, borrower.othername].filter(Boolean).join(" ")}${
          borrower.businessName ? ` (${borrower.businessName})` : ""
        }`
      : borrower.businessName || "Unnamed Borrower";
  };

  // Example handlers (implement as needed)
  const handleEdit = () => {
    setEditPopupOpen(true);
  };
  const handleDelete = () => {
    // Implement delete logic
    setNotification({ message: "Delete action triggered", color: "red" });
  };
  const handlePrint = () => {
    window.print();
  };

  const handleEditPopupClose = () => {
    setEditPopupOpen(false);
  };

  const handleEditPopupSuccess = (updatedBorrower) => {
    setBorrower(updatedBorrower);
    const combinedName =
      updatedBorrower.firstname || updatedBorrower.othername
        ? `${[updatedBorrower.firstname, updatedBorrower.othername]
            .filter(Boolean)
            .join(" ")}${
            updatedBorrower.businessName
              ? ` (${updatedBorrower.businessName})`
              : ""
          }`
        : updatedBorrower.businessName || "";
    setNotification({
      message: `${combinedName} updated successfully!`,
      color: "green",
    });
    setEditPopupOpen(false);
  };

  // Custom fields handlers
  const handleEditCustomFields = () => {
    setEditCustomFieldsPopupOpen(true);
  };

  const handleCustomFieldsPrint = () => {
    window.print();
  };

  const handleEditCustomFieldsPopupClose = () => {
    setEditCustomFieldsPopupOpen(false);
  };

  const handleUpdateCustomFieldsAPI = async (values) => {
    console.log("API Call: Updating borrower custom fields", {
      borrowerId,
      customFields,
      values,
    });
    const result = await updateBorrowerCustomFields(
      borrowerId,
      customFields,
      values
    );
    console.log("API Call: Custom fields updated successfully", result);
    return result;
  };

  const handleCustomFieldsUpdateSuccess = (updatedData) => {
    // Update the borrower state with new custom fields data
    setBorrower((prevBorrower) => ({
      ...prevBorrower,
      customFieldsData: updatedData.customFieldsData,
      updatedAt: updatedData.updatedAt,
    }));
    setEditCustomFieldsPopupOpen(false);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <IconButton onClick={() => navigate("/borrowers")} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">Error</Typography>
        </Box>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <>
      <NotificationBar
        message={notification.message}
        color={notification.color}
      />

      {/* Edit Popup */}
      <EditContentPopup
        open={editPopupOpen}
        onClose={handleEditPopupClose}
        title={`Edit ${getBorrowerName()}`}
        maxWidth="lg"
      >
        <CreateBorrower
          initialValues={borrower}
          isEditMode={true}
          forceEditMode={true}
          onEditSuccess={handleEditPopupSuccess}
          onUpdateBorrowerAPI={handleUpdateBorrowerAPI}
          setNotification={setNotification}
          onCancel={handleEditPopupClose}
        />
      </EditContentPopup>

      {/* Edit Custom Fields Popup */}
      <EditContentPopup
        open={editCustomFieldsPopupOpen}
        onClose={handleEditCustomFieldsPopupClose}
        title={`Edit Custom Fields - ${getBorrowerName()}`}
        maxWidth="lg"
      >
        <EditableCustomBorrowerFields
          customFields={customFields}
          initialValues={mapCustomFieldsToFormValues(borrower, customFields)}
          onUpdateSuccess={handleCustomFieldsUpdateSuccess}
          onUpdateCustomFieldsAPI={handleUpdateCustomFieldsAPI}
          onCancel={handleEditCustomFieldsPopupClose}
          setNotification={setNotification}
        />
      </EditContentPopup>

      <Box sx={{ width: "100%" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 1,
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={() => navigate("/borrowers")}
              sx={{
                mr: 1,
                color: theme.palette.text.primary,
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                fontFamily: theme.typography.h4.fontFamily,
              }}
            >
              {getBorrowerName()}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              mt: { xs: 2, sm: 0 },
              flexShrink: 0,
            }}
          >
            {/* Removed Edit button from header */}
            <ClickableText
              onClick={handleDelete}
              sx={{
                color: theme.palette.error.main,
                // fontWeight: 500,
                fontSize: "0.9rem",
              }}
            >
              Delete
            </ClickableText>
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ width: "100%" }}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: theme.palette.divider,
              backgroundColor: theme.palette.background.paper,
              borderRadius: "8px 8px 0 0",
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="borrower management tabs"
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
                    // backgroundColor: theme.palette.action.hover,
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
              <Tab label="Details" id="borrower-tab-0" />
              <Tab label="Files" id="borrower-tab-2" />
              <Tab label="Custom Fields" id="borrower-tab-1" />
            </Tabs>
          </Box>

          {/* Tab Panels */}
          <TabPanel value={tabValue} index={0}>
            {/* Right-aligned Edit button */}
            <Box
              sx={{
                mb: 1,
                display: "flex",
                justifyContent: "flex-end",
                gap: 3,
              }}
            >
              <ClickableText
                onClick={handleEdit}
                sx={{
                  color: theme.palette.blueText.main,
                  fontSize: "0.9rem",
                }}
              >
                Edit
              </ClickableText>
              <ClickableText
                onClick={handlePrint}
                sx={{
                  color: theme.palette.secondary.main,
                  // fontWeight: 500,
                  fontSize: "0.9rem",
                }}
              >
                Print
              </ClickableText>
            </Box>
            <CreateBorrower
              initialValues={borrower}
              isEditMode={true}
              forceEditMode={false}
              onEditSuccess={handleEditSuccess}
              onUpdateBorrowerAPI={handleUpdateBorrowerAPI}
              setNotification={setNotification}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            {customFieldsLoading ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <CircularProgress size={24} />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Loading custom fields...
                </Typography>
              </Box>
            ) : (
              <Formik
                initialValues={mapCustomFieldsToFormValues(
                  borrower,
                  customFields
                )}
                enableReinitialize
              >
                {(formik) => (
                  <CustomBorrowerFields
                    customFields={customFields}
                    formik={formik}
                    editing={false}
                    onEdit={handleEditCustomFields}
                    onPrint={handleCustomFieldsPrint}
                  />
                )}
              </Formik>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <BorrowerFiles
              borrower={borrower}
              setBorrower={setBorrower}
              setNotification={setNotification}
            />
          </TabPanel>
        </Box>
      </Box>
    </>
  );
}
