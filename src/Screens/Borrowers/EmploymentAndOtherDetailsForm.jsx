import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import FormLabel from '@mui/material/FormLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

const StyledOutlinedInput = styled(OutlinedInput)({
  border: '1px solid #708090',
  fontSize: '1rem',
});

export default function EmploymentAndOtherDetailsForm() {
  return (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={3}>
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
        <FormGrid size={{ xs: 12, md: 6 }}>
          <FormLabel htmlFor="job-title">
            Job Title
          </FormLabel>
          <StyledOutlinedInput
            id="job-title"
            name="job-title"
            placeholder="Job Title"
            size="small"
          />
        </FormGrid>
        <FormGrid size={{ xs: 12, md: 6 }}>
          <FormLabel htmlFor="monthly-income">
            Monthly Income
          </FormLabel>
          <StyledOutlinedInput
            id="monthly-income"
            name="monthly-income"
            placeholder="Monthly Income"
            size="small"
          />
        </FormGrid>
        <FormGrid size={{ xs: 12, md: 6 }}>
          <FormLabel htmlFor="other-details">
            Other Details
          </FormLabel>
          <StyledOutlinedInput
            id="other-details"
            name="other-details"
            placeholder="Other Details"
            multiline
            minRows={2}
            size="small"
          />
        </FormGrid>
      </Grid>
    </Box>
  );
}