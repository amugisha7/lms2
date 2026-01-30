import React, { useContext, useEffect } from "react";
import { UserContext } from "../../App";
import {
  Box,
  Button,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Paper,
  Divider,
  Avatar,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Business,
  LocationOn,
  Schedule,
  AttachMoney,
  GroupAdd,
  Logout,
} from "@mui/icons-material";
import * as Yup from "yup";

import { currenciesObj } from "../../Resources/currenciesObj";
import { countries } from "../../Resources/listOfCountries";
import { getGMTOffset, timezonesList } from "../../Resources/timezones";
import TwoRadialButtons from "../../ModelAssets/TwoRadialButtons";
import myLogo from "../../Resources/loantabs_logo.png";
import { generateClient } from "aws-amplify/api";
import { useNotification } from "../../ModelAssets/NotificationContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useSnackbar } from "../../ModelAssets/SnackbarContext";
import {
  CREATE_INSTITUTION_MUTATION,
  CREATE_BRANCH_MUTATION,
  CREATE_USER_MUTATION,
  CREATE_ACCOUNT_MUTATION,
  GET_INSTITUTION_QUERY,
  LIST_USERS_QUERY,
  CREATE_LOAN_PRODUCT_MUTATION,
  CREATE_BRANCH_LOAN_PRODUCT_MUTATION,
} from "./onboardingQueries";
import { CREATE_NOTIFICATION_MUTATION } from "../Notifications/notificationQueries";

const client = generateClient();

const currencies = Object.keys(currenciesObj);

const businessNameSchema = Yup.string()
  .required("Business name is required")
  .matches(/^[^,"'!{}]+$/, "Invalid characters found. Cannot use , \" ' ! { }");

const customTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2", // Blue primary
    },
    secondary: {
      main: "#dc004e", // Red secondary
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    text: {
      primary: "#000000", // Black text
      secondary: "#555555",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

const AccountSettingsForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useNotification();
  const { showSnackbar } = useSnackbar();
  const { user, setUserDetails, signOut } = useContext(UserContext); // <-- add signOut here
  const [formData, setFormData] = React.useState({
    businessName: "",
    country: "Kenya",
    timezone: "Africa/Nairobi",
    currency: "KES",
  });
  const [decimalPoints, setDecimalPoints] = React.useState(0);
  const [companyOption, setCompanyOption] = React.useState(
    "Set up a new Business on LoanTabs",
  );
  const [businessID, setBusinessID] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isJoining, setIsJoining] = React.useState(false);

  // State to track touched fields
  const [touchedFields, setTouchedFields] = React.useState({});
  const [businessNameErrorText, setBusinessNameErrorText] = React.useState("");

  React.useEffect(() => {
    setDecimalPoints(currenciesObj[formData.currency]?.decimal_digits || 0);
    console.log("user::: ", user.signInDetails.loginId);
    console.log(
      "new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()::: ",
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    );
  }, [formData.currency]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleBusinessIDChange = (event) => {
    const value = event.target.value;
    setBusinessID(value);
  };

  // Handler for the onBlur event
  const handleBlur = (field) => async () => {
    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }));
    if (field === "businessName") {
      try {
        await businessNameSchema.validate(formData.businessName);
        setBusinessNameErrorText("");
      } catch (err) {
        setBusinessNameErrorText(err.message);
      }
    }
  };

  // Create new Institution, Branch, and User
  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouchedFields((prev) => ({ ...prev, businessName: true }));
    setIsSubmitting(true);

    // Validate business name with Yup
    try {
      await businessNameSchema.validate(formData.businessName);
    } catch (validationError) {
      showNotification(validationError.message, "red");
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Create Institution
      const institutionInput = {
        name: formData.businessName,
        currencyCode: formData.currency,
        // Standardize date display across the app (DD-MMM-YYYY)
        defaultDateFormat: "dd-mmm-yyyy",
        regulatoryRegion: formData.country,
        subscriptionTier: "Free",
        trialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        saccoFeaturesEnabled: false,
        staffManagementEnabled: false,
        payrollEnabled: false,
        collectionsModuleEnabled: false,
        customWorkflowsEnabled: false,
        advancedReportingEnabled: false,
      };

      const institutionRes = await client.graphql({
        query: CREATE_INSTITUTION_MUTATION,
        variables: { input: institutionInput },
      });

      const institutionId = institutionRes.data.createInstitution.id;

      // 2. Create Branch under Institution
      const branchInput = {
        name: "Branch #001",
        status: "system",
        institutionBranchesId: institutionId,
      };

      const branchRes = await client.graphql({
        query: CREATE_BRANCH_MUTATION,
        variables: { input: branchInput },
      });

      const branchId = branchRes.data.createBranch.id;

      // 4. Create default Account for the Branch
      const accountInput = {
        institutionAccountsId: institutionId,
        name: "Cash_System_Default",
        openingBalance: 0,
        status: "active",
        currency: formData.currency,
        accountType: "system",
        description: "Default system account",
      };

      await client.graphql({
        query: CREATE_ACCOUNT_MUTATION,
        variables: { input: accountInput },
      });

      // 5. Create default Loan Product for the Institution
      const loanProductInput = {
        institutionLoanProductsId: institutionId,
        name: "Default Loan Product",
        status: "Active",
        description: "",
        // All configuration fields left as null - no preset configurations
        principalAmountMin: null,
        principalAmountMax: null,
        principalAmountDefault: null,
        interestRateMin: null,
        interestRateMax: null,
        interestRateDefault: null,
        interestCalculationMethod: null,
        interestType: null,
        interestPeriod: null,
        termDurationMin: null,
        termDurationMax: null,
        termDurationDefault: null,
        durationPeriod: null,
        repaymentFrequency: null,
        repaymentOrder: null,
        extendLoanAfterMaturity: null,
        interestTypeMaturity: null,
        calculateInterestOn: null,
        loanInterestRateAfterMaturity: null,
        recurringPeriodAfterMaturityUnit: null,
        // Make visible to customers in the customer portal
        customLoanProductDetails: JSON.stringify({
          customerPortalVisible: true,
        }),
      };

      const loanProductRes = await client.graphql({
        query: CREATE_LOAN_PRODUCT_MUTATION,
        variables: { input: loanProductInput },
      });

      const loanProductId = loanProductRes.data.createLoanProduct.id;

      // 6. Associate the default Loan Product with the default Branch
      await client.graphql({
        query: CREATE_BRANCH_LOAN_PRODUCT_MUTATION,
        variables: {
          input: {
            branchId: branchId,
            loanProductId: loanProductId,
          },
        },
      });

      // 7. Create User with more details
      const userInput = {
        id: user.userId,
        branchUsersId: branchId,
        institutionUsersId: institutionId,
        email: user.signInDetails.loginId,
        userType: "Admin",
        status: "active",
      };

      const userRes = await client.graphql({
        query: CREATE_USER_MUTATION,
        variables: { input: userInput },
      });

      // Update user context with new details
      if (setUserDetails) {
        setUserDetails(userRes.data.createUser);
      }

      // Force reload to trigger App.jsx user check
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error creating institution/branch/user:", error);
      showNotification("Failed to create business.", "red");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Join existing Institution by creating User
  const handleJoinBusiness = async (event) => {
    event.preventDefault();
    setTouchedFields((prev) => ({ ...prev, businessID: true }));
    setIsJoining(true);
    try {
      // 1. Check if Institution exists
      const checkRes = await client.graphql({
        query: GET_INSTITUTION_QUERY,
        variables: { id: businessID },
      });

      if (!checkRes.data.getInstitution) {
        showNotification("Invalid ID. Please contact your Admin", "red");
        return;
      }

      // 2. Create User if Institution exists
      const userInput = {
        id: user.userId,
        institutionUsersId: businessID,
        // userType intentionally left blank - admin must select during review
        email: user.signInDetails.loginId,
        status: "pending",
      };

      const userRes = await client.graphql({
        query: CREATE_USER_MUTATION,
        variables: { input: userInput },
      });

      // Query for admin users in the institution
      const adminsRes = await client.graphql({
        query: LIST_USERS_QUERY,
        variables: {
          filter: {
            institutionUsersId: { eq: businessID },
            userType: { eq: "Admin" },
          },
        },
      });
      const admins = adminsRes.data.listUsers.items;

      if (admins.length === 0) {
        console.warn("No admins found for institution:", businessID);
      }

      // Create notifications for each admin
      for (const admin of admins) {
        try {
          await client.graphql({
            query: CREATE_NOTIFICATION_MUTATION,
            variables: {
              input: {
                subject: "New User Join Request",
                body: `A new user, ${user.signInDetails.loginId}, has requested to join your institution. Please review and approve or reject the request.`,
                notificationType: "USER_JOIN_REQUEST",
                approvalStatus: "PENDING",
                referenceId: userRes.data.createUser.id,
                status: "unread",
                senderUserId: user.userId,
                recipientUserId: admin.id,
                institutionMessagesId: businessID,
              },
            },
          });
        } catch (notifError) {
          console.error(
            "Error creating notification for admin:",
            admin.id,
            notifError,
          );
        }
      }

      // Update user context with new details
      if (setUserDetails) {
        setUserDetails(userRes.data.createUser);
      }

      // Force reload to trigger App.jsx user check
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error joining business:", error);
      showNotification("Failed to join business.", "red");
    } finally {
      setIsJoining(false);
    }
  };

  // Calculate error states based on touched and validation
  const businessNameError =
    touchedFields.businessName && !!businessNameErrorText;
  const businessIDError = touchedFields.businessID && !businessID.trim();

  return (
    <ThemeProvider theme={customTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        {/* Hero Header */}
        <Paper
          elevation={6}
          sx={{
            maxWidth: 500,
            width: "100%",
            p: 4,
            mb: 4,
            textAlign: "center",
            borderRadius: 3,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
          }}
        >
          <Avatar
            src={myLogo}
            sx={{ width: 64, height: 64, mx: "auto", mb: 2 }}
            alt="LoanTabs Logo"
          />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Welcome to LoanTabs
          </Typography>
          <Typography variant="body1">
            Set up your business or join an existing one to get started.
          </Typography>
          <Divider sx={{ my: 3 }} />
          <TwoRadialButtons
            label="How would you like to proceed?"
            options={[
              "Set up a new Business on LoanTabs",
              "Join an existing business as a team member",
            ]}
            value={companyOption}
            onChange={setCompanyOption}
          />
        </Paper>

        {companyOption === "Set up a new Business on LoanTabs" && (
          <Paper
            component="form"
            onSubmit={handleSubmit}
            elevation={6}
            sx={{
              maxWidth: 500,
              width: "100%",
              p: 4,
              borderRadius: 3,
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <Typography variant="h5" align="center" fontWeight="bold">
              <Business sx={{ mr: 1, verticalAlign: "middle" }} />
              Set up your Business Details
            </Typography>
            <TextField
              fullWidth
              required
              label="Business Name"
              placeholder="Enter your business name"
              value={formData.businessName}
              onChange={handleChange("businessName")}
              onBlur={handleBlur("businessName")}
              error={businessNameError}
              helperText={businessNameErrorText}
              InputProps={{
                startAdornment: (
                  <Business sx={{ mr: 1, color: "action.active" }} />
                ),
              }}
            />
            <FormControl fullWidth>
              <InputLabel>Country</InputLabel>
              <Select
                value={formData.country}
                label="Country"
                onChange={handleChange("country")}
                startAdornment={
                  <LocationOn sx={{ mr: 1, color: "action.active" }} />
                }
              >
                {countries.map((item, idx) => (
                  <MenuItem key={idx} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Timezone</InputLabel>
              <Select
                value={formData.timezone}
                label="Timezone"
                onChange={handleChange("timezone")}
                startAdornment={
                  <Schedule sx={{ mr: 1, color: "action.active" }} />
                }
              >
                {timezonesList.map((item, idx) => (
                  <MenuItem key={idx} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Currency</InputLabel>
              <Select
                value={formData.currency}
                label="Currency"
                onChange={handleChange("currency")}
                startAdornment={
                  <AttachMoney sx={{ mr: 1, color: "action.active" }} />
                }
              >
                {currencies.map((item, idx) => (
                  <MenuItem key={idx} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="body2" sx={{ textAlign: "center" }}>
              You can change these settings later in Admin →{" "}
              <strong>Account Settings</strong>.
            </Typography>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              disabled={!formData.businessName.trim() || isSubmitting}
              sx={{ mt: 2, py: 1.5, fontSize: "1.1rem" }}
              startIcon={isSubmitting ? null : <Business />}
            >
              {isSubmitting ? "Setting up..." : "Set Up Business"}
            </Button>
          </Paper>
        )}

        {companyOption === "Join an existing business as a team member" && (
          <Paper
            component="form"
            onSubmit={handleJoinBusiness}
            elevation={6}
            sx={{
              maxWidth: 500,
              width: "100%",
              p: 4,
              borderRadius: 3,
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <Typography variant="h5" align="center" fontWeight="bold">
              <GroupAdd sx={{ mr: 1, verticalAlign: "middle" }} />
              Join an Existing Business
            </Typography>
            <Typography variant="body2" sx={{ textAlign: "center" }}>
              Enter the LoanTabs Business ID provided by your administrator.
            </Typography>
            <TextField
              fullWidth
              required
              label="Business ID"
              placeholder="Enter Business ID"
              value={businessID}
              onChange={handleBusinessIDChange}
              onBlur={handleBlur("businessID")}
              error={businessIDError}
              helperText={businessIDError ? "Business ID is required" : ""}
              InputProps={{
                startAdornment: (
                  <GroupAdd sx={{ mr: 1, color: "action.active" }} />
                ),
              }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              disabled={!businessID.trim() || isJoining}
              sx={{ mt: 2, py: 1.5, fontSize: "1.1rem" }}
              startIcon={isJoining ? null : <GroupAdd />}
            >
              {isJoining ? "Joining..." : "Join Business"}
            </Button>
          </Paper>
        )}

        {/* Footer */}
        <Paper
          elevation={3}
          sx={{
            maxWidth: 500,
            width: "100%",
            p: 3,
            mt: 4,
            textAlign: "center",
            borderRadius: 3,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        >
          <Typography variant="body2" gutterBottom>
            Need to continue later? You can always return to set up your
            business.
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            onClick={signOut}
            startIcon={<Logout />}
            sx={{ mt: 1 }}
          >
            Sign Out
          </Button>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default AccountSettingsForm;
