import * as React from 'react';
import AppTheme from '../../../muiTemplates/shared-theme/AppTheme';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useFormik } from 'formik';
import { useContext, useState, useEffect } from 'react'; // Ensure useState, useEffect are imported if not already
import { generateClient } from 'aws-amplify/api';
import { UserContext } from '../../../App';
import CustomFieldsDataGrid from './CustomFieldsDataGrid';
import { tokens } from '../../../theme';

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

const StyledSelect = styled(Select)(({ error, theme }) => {
  const colors = tokens(theme.palette.mode);
  return {
    border: error ? '1.5px solid #d32f2f' : `1px solid ${colors.grey[200]}`,
    fontSize: '1rem',
  };
});

const StyledOutlinedInput = styled(OutlinedInput)(({ error }) => ({
  border: error ? '1.5px solid #d32f2f' : '1px solid #708090',
  fontSize: '1rem',
}));

const UPDATE_CUSTOM_FORM_FIELD = `
  mutation UpdateCustomFormField(
    $input: UpdateCustomFormFieldInput!
  ) {
    updateCustomFormField(input: $input) {
      id
      formKey
      label
      fieldType
      required
      options
      institutionCustomFormFieldsId
      branchCustomFormFieldsId
    }
  }
`;

const DELETE_CUSTOM_FORM_FIELD = `
  mutation DeleteCustomFormField(
    $input: DeleteCustomFormFieldInput!
  ) {
    deleteCustomFormField(input: $input) {
      id
    }
  }
`;

export default function ModifyCustomFields(props) {
  const { userDetails } = useContext(UserContext);
  const institutionId = userDetails?.institutionUsersId;
  const branchId = userDetails?.branchUsersId;

  // State for form selection and fields
  const [formKey, setFormKey] = React.useState('');
  const [fields, setFields] = React.useState([]);
  const [dropdownFields, setDropdownFields] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [hasFetched, setHasFetched] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false); // For loading state during mutations

  const client = generateClient();

  const handleLoadFields = async (selectedFormKey) => {
    if (!selectedFormKey) return;
    setLoading(true);
    setHasFetched(false); // Reset hasFetched before new load
    try {
      const res = await client.graphql({
        query: `
          query ListCustomFormFields(
            $filter: ModelCustomFormFieldFilterInput
            $limit: Int
            $nextToken: String
          ) {
            listCustomFormFields(filter: $filter, limit: $limit, nextToken: $nextToken) {
              items {
                id
                formKey
                label
                fieldType
                required
                options
                institutionCustomFormFieldsId
                branchCustomFormFieldsId
              }
            }
          }
        `,
        variables: {
          filter: {
            and: [
              { formKey: { eq: selectedFormKey } },
              { institutionCustomFormFieldsId: { eq: institutionId } },
              { branchCustomFormFieldsId: { eq: branchId } }
            ]
          },
          limit: 100 // Adjust limit as needed
        }
      });
      const fieldsWithParsedOptions = res.data.listCustomFormFields.items.map(field => ({
        ...field,
        options: field.options ? JSON.parse(field.options) : null
      }));
      setRows(fieldsWithParsedOptions);
      console.log('Custom fields for', selectedFormKey, fieldsWithParsedOptions);
    } catch (error) {
      console.error("Error fetching custom fields:", error);
      setRows([]); // Clear rows on error
    } finally {
      setLoading(false);
      setHasFetched(true);
    }
  };

  const handleUpdateRow = async (rowData) => {
    if (!branchId || !institutionId) {
        console.error("Branch ID or Institution ID is missing. Cannot update.");
        // Optionally, show a user-facing error
        return;
    }
    setIsSubmitting(true);
    try {
        const input = {
            id: rowData.id,
            label: rowData.label,
            required: rowData.required,
            // These fields are part of the mutation input, ensure they are correct
            // If they are not meant to be updated or are fixed for the row, use original values
            formKey: rowData.formKey, 
            fieldType: rowData.fieldType,
            branchCustomFormFieldsId: rowData.branchCustomFormFieldsId || branchId, // Prefer row data if available, else context
            institutionCustomFormFieldsId: rowData.institutionCustomFormFieldsId || institutionId, // Prefer row data if available
            // options field might need to be stringified if it's part of the input and was parsed
            // options: rowData.options ? JSON.stringify(rowData.options) : null, 
        };
        // Remove undefined fields from input to avoid GraphQL errors if not all fields are always present
        Object.keys(input).forEach(key => input[key] === undefined && delete input[key]);


        const result = await client.graphql({
            query: UPDATE_CUSTOM_FORM_FIELD,
            variables: { input }
        });
        console.log('Update successful:', result);
        // Update the row in the local state
        setRows(prevRows => prevRows.map(row => row.id === result.data.updateCustomFormField.id ? result.data.updateCustomFormField : row));
    } catch (error) {
        console.error("Error updating custom field:", error);
        // Optionally, revert optimistic update or show error to user
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDeleteRow = async (rowId) => {
    setIsSubmitting(true);
    try {
        const input = { id: rowId };
        await client.graphql({
            query: DELETE_CUSTOM_FORM_FIELD,
            variables: { input }
        });
        console.log('Delete successful for ID:', rowId);
        setRows(prevRows => prevRows.filter(row => row.id !== rowId));
    } catch (error) {
        console.error("Error deleting custom field:", error);
    } finally {
        setIsSubmitting(false);
    }
  };
  
  return (
    <Box
      component="form"
      // onSubmit={formik.handleSubmit} // If formik is not used for this specific form, this can be removed
      sx={{
        mx: { xs: 0, sm: 'auto' },
        mt: { xs: 0, sm: 0 },
        p: { xs: 0, sm: 0 },
        borderRadius: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Grid container spacing={3}>
        <FormGrid item xs={12} md={6}> {/* Changed size to item */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Select a form to Modify its Custom Fields
          </Typography>
          <StyledSelect
            id="formKey"
            name="formKey"
            size="small"
            value={formKey}
            onChange={(e) => {
                setFormKey(e.target.value);
                // Optionally, clear rows when formKey changes before loading new ones
                // setRows([]); 
                // setHasFetched(false);
            }}
            fullWidth
          >
            <MenuItem
              value="CreateBorrowerForm"
              sx={{
                '&:hover': {
                  color: 'white',
                },
              }}
            >
              Borrower Form
            </MenuItem>
            <MenuItem
              value="CreateLoanForm"
              sx={{
                '&:hover': {
                  color: 'white',
                },
              }}
            >
              Loan Form
            </MenuItem>
            <MenuItem
              value="CreateCollateralForm"
              sx={{
                '&:hover': {
                  color: 'white',
                },
              }}
            >
              Collateral Form
            </MenuItem>
          </StyledSelect>
        </FormGrid>
        <FormGrid item xs={12} md={6}>
          <Button
            variant="contained"
            color="secondary"
            sx={{ mt: { xs: 0, md: 5 } }}
            disabled={!formKey || loading || isSubmitting}
            onClick={() => handleLoadFields(formKey)}
            fullWidth
          >
            {loading ? "Loading..." : "Load Custom Fields"}
          </Button>
        </FormGrid>
      </Grid>
      <Box sx={{ height: 'auto', width: '100%', mt: 3 }}> {/* Changed height to auto */}
        <CustomFieldsDataGrid
          rows={rows}
          loading={loading || isSubmitting} // Show loading indicator during API calls
          hasFetched={hasFetched}
          onRowUpdate={handleUpdateRow}
          onRowDelete={handleDeleteRow}
        />
      </Box>
    </Box>
  );
}