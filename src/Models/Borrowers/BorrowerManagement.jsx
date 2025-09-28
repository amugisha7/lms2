import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTheme } from "@mui/material/styles";
import { generateClient } from "aws-amplify/api";
import { UserContext } from "../../App";
import CreateBorrower from "./CreateBorrower/CreateBorrower";
import NotificationBar from "../../ComponentAssets/NotificationBar";
import ClickableText from "../../ComponentAssets/ClickableText";
import EditContentPopup from "../../ModelAssets/EditContentPopup";

const GET_BORROWER_QUERY = `
  query GetBorrower($id: ID!) {
    getBorrower(id: $id) {
      id
      firstname
      othername
      businessName
      typeOfBusiness
      uniqueIdNumber
      phoneNumber
      otherPhoneNumber
      email
      gender
      dateOfBirth
      nationality
      address
      city
      state
      title
      zipcode
      employmentStatus
      employerName
      creditScore
      customFieldsData
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_BORROWER_MUTATION = `
  mutation UpdateBorrower($input: UpdateBorrowerInput!) {
    updateBorrower(input: $input) {
      id
      firstname
      othername
      businessName
      typeOfBusiness
      uniqueIdNumber
      phoneNumber
      otherPhoneNumber
      email
      gender
      dateOfBirth
      nationality
      address
      city
      state
      title
      zipcode
      employmentStatus
      employerName
      creditScore
      customFieldsData
      createdAt
      updatedAt
    }
  }
`;

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
  const client = React.useMemo(() => generateClient(), []);

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
        const result = await client.graphql({
          query: GET_BORROWER_QUERY,
          variables: { id: borrowerId },
        });

        if (result.data.getBorrower) {
          setBorrower(result.data.getBorrower);
        } else {
          setError("Borrower not found");
        }
      } catch (err) {
        console.error("Error fetching borrower:", err);
        setError("Failed to load borrower details");
      } finally {
        setLoading(false);
      }
    };

    fetchBorrower();
  }, [borrowerId, client]);

  // API handler for updating borrower
  const handleUpdateBorrowerAPI = async (values, initialValues) => {
    console.log("UpdateBorrower Form Values:", values); // <-- Add this log

    const input = {
      id: initialValues.id,
      firstname: values.firstname?.trim() || null,
      othername: values.othername?.trim() || null,
      businessName: values.businessName?.trim() || null,
      typeOfBusiness: values.typeOfBusiness?.trim() || null,
      uniqueIdNumber: values.uniqueIdNumber?.trim() || null,
      phoneNumber: values.phoneNumber?.trim() || null,
      otherPhoneNumber: values.otherPhoneNumber?.trim() || null,
      email: values.email?.trim() || null,
      gender: values.gender || null,
      dateOfBirth: values.dateOfBirth || null,
      nationality: values.nationality || null,
      address: values.address?.trim() || null,
      city: values.city?.trim() || null,
      state: values.state?.trim() || null,
      title: values.title || null,
      zipcode: values.zipcode?.trim() || null,
      employmentStatus: values.employmentStatus || null,
      employerName: values.employerName?.trim() || null,
      creditScore: values.creditScore?.trim() || null,
    };

    const customFieldsData = {};
    Object.keys(values).forEach((key) => {
      if (key.startsWith("custom_")) {
        const fieldId = key.replace("custom_", "");
        customFieldsData[fieldId] = {
          fieldId,
          value:
            typeof values[key] === "string"
              ? values[key].trim() || null
              : values[key] || null,
        };
      }
    });
    if (Object.keys(customFieldsData).length > 0) {
      input.customFieldsData = JSON.stringify(customFieldsData);
    }

    const result = await client.graphql({
      query: UPDATE_BORROWER_MUTATION,
      variables: { input },
    });

    return result.data.updateBorrower;
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

      <Box sx={{ width: "100%" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 3,
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
                  backgroundColor: theme.palette.action.hover,
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
            <ClickableText
              onClick={handleEdit}
              sx={{
                color: theme.palette.blueText.main,
                // fontWeight: 500,
                fontSize: "0.9rem",
              }}
            >
              Edit
            </ClickableText>
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
              <Tab label="Loans" id="borrower-tab-1" />
              <Tab label="Documents" id="borrower-tab-2" />
            </Tabs>
          </Box>

          {/* Tab Panels */}
          <TabPanel value={tabValue} index={0}>
            <CreateBorrower
              initialValues={borrower}
              isEditMode={true}
              forceEditMode={false}
              onEditSuccess={handleEditSuccess}
              onUpdateBorrowerAPI={handleUpdateBorrowerAPI}
              setNotification={setNotification}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: theme.palette.text.primary,
                fontFamily: theme.typography.h6.fontFamily,
              }}
            >
              Loan History
            </Typography>
            <Typography
              color="text.secondary"
              sx={{
                fontStyle: "italic",
                fontSize: "0.875rem",
              }}
            >
              Loan management features coming soon...
            </Typography>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: theme.palette.text.primary,
                fontFamily: theme.typography.h6.fontFamily,
              }}
            >
              Documents
            </Typography>
            <Typography
              color="text.secondary"
              sx={{
                fontStyle: "italic",
                fontSize: "0.875rem",
              }}
            >
              Document management features coming soon...
            </Typography>
          </TabPanel>
        </Box>
      </Box>
    </>
  );
}
