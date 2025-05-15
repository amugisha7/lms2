import React from 'react';
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControl,
  InputLabel,
} from '@mui/material';

import { currenciesObj } from '../../Resources/currenciesObj';
import { countries } from '../../Resources/listOfCountries';
import { getGMTOffset, timezonesList } from '../../Resources/timezones';
import TwoRadialButtons from '../../ComponentAssets/TwoRadialButtons';
import myLogo from '../../Resources/loantabs_logo.png'

const currencies = Object.keys(currenciesObj);
const dateFormats = ['dd-mmm-yyyy', 'mmm-dd-yyyy', 'yyyy-mm-dd'];

const AccountSettingsForm = () => {
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

  // State to track touched fields
  const [touchedFields, setTouchedFields] = React.useState({});

  React.useEffect(() => {
    setDecimalPoints(currenciesObj[formData.currency]?.decimal_digits || 0);
  }, [formData.currency]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    // Optionally, mark as touched on change too, if desired
    // setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleBusinessIDChange = (event) => {
    const value = event.target.value;
    setBusinessID(value);
    // Optionally, mark as touched on change
    // setTouchedFields((prev) => ({ ...prev, businessID: true }));
  };

  // Handler for the onBlur event
  const handleBlur = (field) => () => {
    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent page reload
    // Mark all fields as touched on submit, to show errors if not filled
    const allFormFields = {
      businessName: true,
      // Add other required fields here if needed for this form
    };
    setTouchedFields(prev => ({...prev, ...allFormFields}));

    // Basic validation check before logging
    if (!formData.businessName.trim()) {
      console.log('Business name is required to submit.');
      return; // Prevent submission
    }

    console.log("formData::: ", formData);
    console.log('Decimal digits:', decimalPoints);
    console.log("getGMTOffset::: ", getGMTOffset(formData.timezone));
  };

  const handleJoinBusiness = (event) => {
    event.preventDefault(); // Prevent page reload
    // Mark businessID as touched on attempt to join
    setTouchedFields(prev => ({...prev, businessID: true}));

    if (!businessID.trim()) {
      console.log('Business ID is required to join.');
      return; // Prevent action
    }
    console.log("Join Business ID::: ", businessID);
  };

  // Calculate error states based on touched and validation
  const businessNameError = touchedFields.businessName && !formData.businessName.trim();
  const businessIDError = touchedFields.businessID && !businessID.trim();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
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
            required // HTML5 required, but MUI handles validation display
            label="Business Name"
            placeholder="Business Name"
            value={formData.businessName}
            onChange={handleChange('businessName')}
            onBlur={handleBlur('businessName')} // Add onBlur handler
            error={businessNameError} // Use calculated error state
            helperText={businessNameError ? 'Business name is required' : ''} // Show helper text based on error
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
            disabled={!formData.businessName.trim()} // Keep existing disabled logic
            // onClick={handleSubmit} // No longer needed if type="submit" and Box is a form
          >
            Submit
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
            disabled={!businessID.trim()}
            // onClick={handleJoinBusiness}
          >
            Join Business
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default AccountSettingsForm;