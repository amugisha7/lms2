import * as React from 'react';
import AppTheme from '../shared-theme/AppTheme';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { countries } from '../../Resources/listOfCountries';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

// Define a styled OutlinedInput with default size and border
const StyledOutlinedInput = styled(OutlinedInput)({
  border: '1px solid #708090',
  fontSize: '1rem',
  // Add any other shared styles here
});

const titles = [
  '', // For blank/default
  'Mr.',
  'Mrs.',
  'Ms.',
  'Miss',
  'Dr.',
  'Prof.',
  'Rev.',
  'Hon.',
  'Eng.'
];

const workingStatuses = [
  '', // For blank/default
  'Employed',
  'Self-Employed',
  'Unemployed',
  'Student',
  'Retired',
  'Homemaker',
  'Part-time',
  'Contract',
  'Other'
];

export default function CreateBorrowerForm(props) {
  const [country, setCountry] = React.useState('');
  const [gender, setGender] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [workingStatus, setWorkingStatus] = React.useState('');
  const today = dayjs();
  const defaultDob = today.subtract(20, 'year').format('YYYY-MM-DD');
  const maxDob = today.subtract(1, 'day').format('YYYY-MM-DD');
  const [dob, setDob] = React.useState('');
  const [showDobInput, setShowDobInput] = React.useState(false);

  return (
    <AppTheme {...props}>
      <Box
        sx={{
          maxWidth: 720,
          mx: { xs: 0, sm: 'auto' },
          mt: { xs: 0, sm: 6 },
          p: { xs: 0, sm: 3 },
          borderRadius: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
          Create a new Borrower
        </Typography>
        <Typography variant="caption" sx={{ my: 2 }}>
          All fields are optional but you must provide at least First Name or Business Name.
        </Typography>
        <Grid container spacing={3}>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="first-name">
              First Name
            </FormLabel>
            <StyledOutlinedInput
              id="first-name"
              name="first-name"
              required
              placeholder="Enter First Name Only"
              autoComplete="given-name"
              size="small"
            />
          </FormGrid>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="middle-last-name">
              Middle / Last Name
            </FormLabel>
            <StyledOutlinedInput
              id="middle-last-name"
              name="middle-last-name"
              placeholder="Middle and Last Name"
              autoComplete="family-name"
              size="small"
            />
          </FormGrid>
          <FormGrid size={{ xs: 12 }}>
            <FormLabel htmlFor="business-name">
              Business Name
            </FormLabel>
            <StyledOutlinedInput
              id="business-name"
              name="business-name"
              placeholder="Business Name"
              autoComplete="organization"
              size="small"
            />            
          </FormGrid>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="mobile">
              Mobile Number
            </FormLabel>
            <StyledOutlinedInput
              id="mobile"
              name="mobile"
              placeholder="Numbers Only"
              size="small"
            />
          </FormGrid>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="alternative phone">
              Alternative Phone Number
            </FormLabel>
            <StyledOutlinedInput
              id="alternative phone"
              name="alternative phone"
              placeholder="Numbers Only"
              size="small"
            />
          </FormGrid>
            <Typography variant="caption" sx={{ mt: -1 }}>
              Do not put country code, spaces, or characters in the mobile field otherwise you won't be able to send SMS to the mobile.
            </Typography>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="unique-number">
              Unique Identification Number
            </FormLabel>
            <StyledOutlinedInput
              id="unique-number"
              name="unique-number"
              placeholder="Unique Number"
              size="small"
            />
            
            <Typography variant="caption" sx={{ mt: 1 }}>
              Enter a unique identifier for the borrower (e.g National ID, Social Security ID, License No., Registration No.)
            </Typography>
          </FormGrid>
          {/* Swap: Email first, then Country */}
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="email">
              Email
            </FormLabel>
            <StyledOutlinedInput
              id="email"
              name="email"
              placeholder="Email"
              autoComplete="email"
              size="small"
            />
          </FormGrid>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="gender">
              Gender
            </FormLabel>
            <Select
              id="gender"
              name="gender"
              value={gender}
              onChange={e => setGender(e.target.value)}
              size="small"
              displayEmpty
              input={<StyledOutlinedInput label="Gender" />}
            >
              <MenuItem value="">
                <em>Select Gender</em>
              </MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Decline to State">Decline to State</MenuItem>
            </Select>
          </FormGrid>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="title">
              Title
            </FormLabel>
            <Select
              id="title"
              name="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              size="small"
              displayEmpty
              input={<StyledOutlinedInput label="Title" />}
            >
              <MenuItem value="">
                <em>Select Title</em>
              </MenuItem>
              {titles.filter(t => t).map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </Select>
          </FormGrid>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="credit-score">
              Credit Score
            </FormLabel>
            <StyledOutlinedInput
              id="credit-score"
              name="credit-score"
              placeholder="Credit Score"
              size="small"
            />
          </FormGrid>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="dob">
              Date of Birth
            </FormLabel>
            {!showDobInput ? (
              <Button
                variant="outlined"
                onClick={() => setShowDobInput(true)}
                sx={{
                  justifyContent: 'flex-start',
                  color: dob ? 'inherit' : '#888',
                  border: '1px solid #708090',
                  fontSize: '1rem',
                  textTransform: 'none',
                  height: 40,
                  pl: 2,
                  background: 'white',
                }}
                fullWidth
              >
                {dob ? dob : 'Select date of birth'}
              </Button>
            ) : (
              <StyledOutlinedInput
                id="dob"
                name="dob"
                type="date"
                value={dob || defaultDob}
                onChange={e => setDob(e.target.value)}
                inputProps={{
                  max: maxDob,
                }}
                size="small"
                autoFocus
                onBlur={() => { if (!dob) setShowDobInput(false); }}
              />
            )}
          </FormGrid>
          <FormGrid size={{ xs: 12 }}>
            <FormLabel htmlFor="address">
              Address
            </FormLabel>
            <StyledOutlinedInput
              id="address"
              name="address"
              placeholder="Address"
              size="small"
            />
          </FormGrid>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="city">
              City
            </FormLabel>
            <StyledOutlinedInput
              id="city"
              name="city"
              placeholder="City"
              size="small"
            />
          </FormGrid>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="province">
              Province / State
            </FormLabel>
            <StyledOutlinedInput
              id="province"
              name="province"
              placeholder="Province or State"
              size="small"
            />
          </FormGrid>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="zipcode">
              Zipcode
            </FormLabel>
            <StyledOutlinedInput
              id="zipcode"
              name="zipcode"
              placeholder="Zipcode"
              size="small"
            />
          </FormGrid>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="country">
              Country
            </FormLabel>
            <Select
              id="country"
              name="country"
              value={country}
              onChange={e => setCountry(e.target.value)}
              size="small"
              displayEmpty
              input={<StyledOutlinedInput label="Country" />}
              MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
            >
              <MenuItem value="">
                <em>Select Country</em>
              </MenuItem>
              {countries.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormGrid>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="working-status">
              Working Status
            </FormLabel>
            <Select
              id="working-status"
              name="working-status"
              value={workingStatus}
              onChange={e => setWorkingStatus(e.target.value)}
              size="small"
              displayEmpty
              input={<StyledOutlinedInput label="Working Status" />}
            >
              <MenuItem value="">
                <em>Select Working Status</em>
              </MenuItem>
              {workingStatuses.filter(s => s).map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormGrid>
          {/* Employer Name */}
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="employer-name">
              Employer Name
            </FormLabel>
            <StyledOutlinedInput
              id="employer-name"
              name="employer-name"
              placeholder="Employer Name"
              size="small"
            />
          </FormGrid>
          {/* Type of Business */}
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="type-of-business">
              Type of Business
            </FormLabel>
            <StyledOutlinedInput
              id="type-of-business"
              placeholder="Description"
              multilineer="Type of Business"
              size="small"
            />
          </FormGrid>
          {/* Borrower Files */}
          <FormGrid size={{ xs: 12 }}>
            <FormLabel htmlFor="borrower-files">
              Borrower Files
            </FormLabel>
            <StyledOutlinedInput
              id="borrower-files"
              name="borrower-files"
              type="file"
              inputProps={{ multiple: true }}
              size="medium"
            />
          </FormGrid>
          {/* Loan Officer Access */}
          <FormGrid size={{ xs: 12 }}>
            <FormControlLabel
              control={<Checkbox name="loan-officer-access" />}
              label="Andrew Mugisha - Add/Edit Loan Officers"
            />
          </FormGrid>
        </Grid>
      </Box>
    </AppTheme>
  );
}
