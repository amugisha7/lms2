import React, { useContext, useEffect } from 'react';
import { UserContext } from '../../App'
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
} from '@mui/material';
import * as Yup from 'yup';

import { currenciesObj } from '../../Resources/currenciesObj';
import { countries } from '../../Resources/listOfCountries';
import { getGMTOffset, timezonesList } from '../../Resources/timezones';
import TwoRadialButtons from '../../ComponentAssets/TwoRadialButtons';
import myLogo from '../../Resources/loantabs_logo.png'
import { generateClient } from 'aws-amplify/api';
import { useNotification } from '../../ComponentAssets/NotificationContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSnackbar } from '../../ComponentAssets/SnackbarContext';

const client = generateClient();

const currencies = Object.keys(currenciesObj);
const dateFormats = ['dd-mmm-yyyy', 'mmm-dd-yyyy', 'yyyy-mm-dd'];

const businessNameSchema = Yup.string()
  .required('Business name is required')
  .matches(/^[^,"'!{}]+$/, 'Invalid characters found. Cannot use , " \' ! { }');

const AccountSettingsForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useNotification();
  const { showSnackbar } = useSnackbar();
  const { user, setUserDetails, signOut } = useContext(UserContext); // <-- add signOut here
  const [formData, setFormData] = React.useState({
    businessName: '',
    country: 'Kenya',
    timezone: 'Africa/Nairobi',
    currency: 'KES',
    dateFormat: 'dd-mmm-yyyy',
  });
  const [decimalPoints, setDecimalPoints] = React.useState(0);
  const [companyOption, setCompanyOption] = React.useState('Set up a new Business on LoanTabs');
  const [businessID, setBusinessID] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isJoining, setIsJoining] = React.useState(false);

  // State to track touched fields
  const [touchedFields, setTouchedFields] = React.useState({});
  const [businessNameErrorText, setBusinessNameErrorText] = React.useState('');

  React.useEffect(() => {
    setDecimalPoints(currenciesObj[formData.currency]?.decimal_digits || 0);
    console.log("user::: ", user.signInDetails.loginId);
    console.log("new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()::: ", new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString());
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
    if (field === 'businessName') {
      try {
        await businessNameSchema.validate(formData.businessName);
        setBusinessNameErrorText('');
      } catch (err) {
        setBusinessNameErrorText(err.message);
      }
    }
  };

  // Create new Institution, Branch, and User
  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouchedFields(prev => ({ ...prev, businessName: true }));
    setIsSubmitting(true);

    // Validate business name with Yup
    try {
      await businessNameSchema.validate(formData.businessName);
    } catch (validationError) {
      showNotification(validationError.message, 'red');
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Create Institution
      const institutionInput = {
        name: formData.businessName,
        currencyCode: formData.currency,
        defaultDateFormat: formData.dateFormat,
        regulatoryRegion: formData.country,
        subscriptionTier: 'Free',
        trialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        saccoFeaturesEnabled: false,
        staffManagementEnabled: false,
        payrollEnabled: false,
        collectionsModuleEnabled: false,
        customWorkflowsEnabled: false,
        advancedReportingEnabled: false,
      };

      const institutionRes = await client.graphql({
        query: `mutation CreateInstitution($input: CreateInstitutionInput!) {
          createInstitution(input: $input) { id }
        }`,
        variables: { input: institutionInput }
      });

      const institutionId = institutionRes.data.createInstitution.id;

      // 2. Create Branch under Institution
      const branchInput = {
        name: "Branch #01",
        institutionBranchesId: institutionId,
      };

      const branchRes = await client.graphql({
        query: `mutation CreateBranch($input: CreateBranchInput!) {
          createBranch(input: $input) { id }
        }`,
        variables: { input: branchInput }
      });

      const branchId = branchRes.data.createBranch.id;

      // 3. Create User with more details
      const userInput = {
        id: user.userId,
        branchUsersId: branchId,
        institutionUsersId: institutionId,
        email: user.signInDetails.loginId,
        userType: 'Admin',
        status: 'active',
      };

      const userRes = await client.graphql({
        query: `mutation CreateUser($input: CreateUserInput!) {
          createUser(input: $input) { 
            id
            userType
            status
            institutionUsersId
            branchUsersId
          }
        }`,
        variables: { input: userInput }
      });

      // Update user context with new details
      if (setUserDetails) {
        setUserDetails(userRes.data.createUser);
      }

      // Force reload to trigger App.jsx user check
      window.location.href = '/dashboard';
      
    } catch (error) {
      console.error('Error creating institution/branch/user:', error);
      showNotification('Failed to create business.', 'red');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Join existing Institution by creating User
  const handleJoinBusiness = async (event) => {
    event.preventDefault();
    setTouchedFields(prev => ({ ...prev, businessID: true }));
    setIsJoining(true);
    try {
      // 1. Check if Institution exists
      const checkRes = await client.graphql({
        query: `query GetInstitution($id: ID!) {
          getInstitution(id: $id) { id }
        }`,
        variables: { id: businessID }
      });

      if (!checkRes.data.getInstitution) {
        showNotification('Invalid ID. Please contact your Admin', 'red');
        return;
      }

      // 2. Create User if Institution exists
      const userInput = {
        id: user.userId,
        institutionUsersId: businessID,
        userType: 'User',
        email: user.signInDetails.loginId,
        status: 'pending',
      };

      const userRes = await client.graphql({
        query: `mutation CreateUser($input: CreateUserInput!) {
          createUser(input: $input) { 
            id
            userType
            status
            institutionUsersId
            branchUsersId
          }
        }`,
        variables: { input: userInput }
      });

      // Update user context with new details
      if (setUserDetails) {
        setUserDetails(userRes.data.createUser);
      }

      // Force reload to trigger App.jsx user check
      window.location.href = '/dashboard';

    } catch (error) {
      console.error('Error joining business:', error);
      showNotification('Failed to join business.', 'red');
    } finally {
      setIsJoining(false);
    }
  };


  // Calculate error states based on touched and validation
  const businessNameError = touchedFields.businessName && !!businessNameErrorText;
  const businessIDError = touchedFields.businessID && !businessID.trim();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        minHeight: '100vh', // Ensure full height for sticky footer
      }}
    >
      <Box
        sx={{
          maxWidth: 400,
          mx: 'auto',
          p: 2,
          mt: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            component="img"
            sx={{
              height: 48,
               // Example height
              width: 48,
              mb: 1,
            }}
            alt="LoanTabs Logo"
            src={myLogo}
          />
          <Typography variant="h6" align="center" fontWeight="bold">
            Welcome to LoanTabs
          </Typography>
        </Box>
        <TwoRadialButtons
          label="Create a new Business or Join an existing one"
          options={["Set up a new Business on LoanTabs", "Join an existing Business"]}
          value={companyOption}
          onChange={setCompanyOption}
        />
      </Box>

      {companyOption === "Set up a new Business on LoanTabs" && (
        <Box
          component="form" // Make it a form for semantics, onSubmit could be used too
          onSubmit={handleSubmit}
          sx={{
            maxWidth: 400,
            mx: 'auto',
            my: 2,
            p: 4,
            backgroundColor: '#fff',
            borderRadius: 2,
            boxShadow: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography variant="h6" align="center" fontWeight="bold">
            Set up your Business Details
          </Typography>
          <TextField
            fullWidth
            required
            label="Business Name"
            placeholder="Business Name"
            value={formData.businessName}
            onChange={handleChange('businessName')}
            onBlur={handleBlur('businessName')}
            error={businessNameError}
            helperText={businessNameErrorText}
          />
          {/* ... other form fields ... */}
          <FormControl fullWidth>
            <InputLabel>Country</InputLabel>
            <Select
              value={formData.country}
              label="Country"
              onChange={handleChange('country')}
              // onBlur={handleBlur('country')} // if country needs touched validation
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
              onChange={handleChange('timezone')}
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
              onChange={handleChange('currency')}
            >
              {currencies.map((item, idx) => (
                <MenuItem key={idx} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Date Format</InputLabel>
            <Select
              value={formData.dateFormat}
              label="Date Format"
              onChange={handleChange('dateFormat')}
            >
              {dateFormats.map((item, idx) => (
                <MenuItem key={idx} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="body2" color="text.secondary">
            You can change the above values at Admin (top menu) → <b>Account Settings</b>.
          </Typography>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit" // Make button type submit for the form
            disabled={!formData.businessName.trim() || isSubmitting} // Keep existing disabled logic
            // onClick={handleSubmit} // No longer needed if type="submit" and Box is a form
          >
            {isSubmitting ? "Please wait..." : "Submit"}
          </Button>
        </Box>
      )}

      {companyOption === "Join an existing Business" && (
        <Box
          component="form"
          onSubmit={handleJoinBusiness}
          sx={{
            maxWidth: 400,
            mx: 'auto',
            my: 2,
            p: 4,
            backgroundColor: '#fff',
            borderRadius: 2,
            boxShadow: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography variant="h6" align="center" fontWeight="bold">
            Enter Your LoanTabs Business ID
          </Typography>
          <Typography variant="p" align="center" >
            The LoanTabs Business ID can be found in the Account Settings of the Administrator of the Business you are joining.
          </Typography>
          <TextField
            fullWidth
            required
            label="Business ID"
            placeholder="LoanTabs Business ID"
            value={businessID}
            onChange={handleBusinessIDChange}
            onBlur={handleBlur('businessID')} // Add onBlur handler
            error={businessIDError} // Use calculated error state
            helperText={businessIDError ? 'Business ID is required' : ''} // Show helper text
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            disabled={!businessID.trim() || isJoining}
            // onClick={handleJoinBusiness}
          >
            {isJoining ? "Please wait..." : "Join Business"}
          </Button>
        </Box>
      )}
      
      <Box sx={{ flexGrow: 1 }} /> {/* Pushes the button to the bottom */}

      <Box sx={{ mt: 1, mb: 6, display: 'flex', justifyContent: 'center' , flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
          Continue later? You can always come back to set up your Business. 
        </Typography>
        <Button
          // variant="outlined"
          color="secondary"
          onClick={signOut}
        >
          Sign Out
        </Button>
      </Box>
    </Box>
  );
};

export default AccountSettingsForm;