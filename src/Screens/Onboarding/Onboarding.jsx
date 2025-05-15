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
import {countries } from '../../Resources/listOfCountries';
import {getGMTOffset, timezonesList} from '../../Resources/timezones';

const currencies = Object.keys(currenciesObj)

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

  React.useEffect(() => {
    setDecimalPoints(currenciesObj[formData.currency]?.decimal_digits || 0);
  }, [formData.currency]);


  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent page reload
    console.log("formData::: ", formData);
    console.log('Decimal digits:', decimalPoints);
    console.log("getGMTOffset::: ", getGMTOffset(formData.timezone));
    };


  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: 'auto',
        my: 5,
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
        Account Settings
      </Typography>

      <TextField
        fullWidth
        required
        label="Business Name"
        placeholder="Business Name"
        value={formData.businessName}
        onChange={handleChange('businessName')}
        error={!formData.businessName.trim()}
        helperText={!formData.businessName.trim() ? 'Business name is required' : ''}
      />

      <FormControl fullWidth>
        <InputLabel>Country</InputLabel>
        <Select
          value={formData.country}
          label="Country"
          onChange={handleChange('country')}
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

      <Button fullWidth variant="contained" color="primary" 
        disabled={!formData.businessName.trim()} 
        onClick={handleSubmit}>
        Submit
      </Button>

    </Box>
  );
};

export default AccountSettingsForm;
