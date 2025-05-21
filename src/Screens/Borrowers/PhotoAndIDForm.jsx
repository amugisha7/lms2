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

export default function PhotoAndIDForm() {
  return (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <FormGrid size={{ xs: 12, md: 6 }}>
          <FormLabel htmlFor="photo">
            Borrower Photo
          </FormLabel>
          <StyledOutlinedInput
            id="photo"
            name="photo"
            type="file"
            inputProps={{ accept: 'image/*' }}
            size="small"
          />
        </FormGrid>
        <FormGrid size={{ xs: 12, md: 6 }}>
          <FormLabel htmlFor="national-id">
            National ID Number
          </FormLabel>
          <StyledOutlinedInput
            id="national-id"
            name="national-id"
            placeholder="National ID Number"
            size="small"
          />
        </FormGrid>
        <FormGrid size={{ xs: 12, md: 6 }}>
          <FormLabel htmlFor="passport-number">
            Passport Number
          </FormLabel>
          <StyledOutlinedInput
            id="passport-number"
            name="passport-number"
            placeholder="Passport Number"
            size="small"
          />
        </FormGrid>
        <FormGrid size={{ xs: 12, md: 6 }}>
          <FormLabel htmlFor="id-upload">
            Upload ID Document
          </FormLabel>
          <StyledOutlinedInput
            id="id-upload"
            name="id-upload"
            type="file"
            inputProps={{ accept: '.pdf,image/*' }}
            size="small"
          />
        </FormGrid>
      </Grid>
    </Box>
  );
}