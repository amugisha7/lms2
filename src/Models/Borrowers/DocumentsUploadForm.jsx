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

export default function DocumentsUploadForm() {
  return (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <FormGrid size={{ xs: 12 }}>
          <FormLabel htmlFor="supporting-docs">
            Supporting Documents
          </FormLabel>
          <StyledOutlinedInput
            id="supporting-docs"
            name="supporting-docs"
            type="file"
            inputProps={{ multiple: true, accept: '.pdf,.doc,.docx,image/*' }}
            size="medium"
          />
        </FormGrid>
        <FormGrid size={{ xs: 12 }}>
          <FormLabel htmlFor="description">
            Description
          </FormLabel>
          <StyledOutlinedInput
            id="description"
            name="description"
            placeholder="Description of uploaded documents"
            multiline
            minRows={2}
            size="small"
          />
        </FormGrid>
      </Grid>
    </Box>
  );
}