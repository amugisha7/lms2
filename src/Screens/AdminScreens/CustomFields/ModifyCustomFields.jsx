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
import { useContext } from 'react';
import { generateClient } from 'aws-amplify/api';
import { UserContext } from '../../../App';

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

const StyledSelect = styled(Select)(({ error }) => ({
  border: error ? '1.5px solid #d32f2f' : '1px solid #708090',
  fontSize: '1rem',
}));

const StyledOutlinedInput = styled(OutlinedInput)(({ error }) => ({
  border: error ? '1.5px solid #d32f2f' : '1px solid #708090',
  fontSize: '1rem',
}));

export default function ModifyCustomFields(props) {
  const { userDetails } = useContext(UserContext);
  const institutionId = userDetails?.institutionUsersId;
  const branchId = userDetails?.branchUsersId;

  // State for form selection and fields
  const [formKey, setFormKey] = React.useState('');
  const [fields, setFields] = React.useState([]);
  const [dropdownFields, setDropdownFields] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  // Dummy data for demonstration
  const demoFields = [
    { id: 1, fieldType: 'text', label: 'First Name', required: true },
    { id: 2, fieldType: 'select', label: 'Country', required: false, options: ['USA', 'Canada', 'UK'] },
  ];

  const formik = useFormik({
    });

  const client = generateClient();

  // Load fields handler (replace with real fetch)
  const handleLoadFields = async (formKey) => {
  setLoading(true); // Disable the button and change text to "Loading..."
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
              options
              required
              createdAt
            }
          }
        }
      `,
      variables: {
        filter: {
          and: [
            { formKey: { eq: formKey } },
            {
              or: [
                { institutionCustomFormFieldsId: { eq: institutionId } },
                { branchCustomFormFieldsId: { eq: branchId } }
              ]
            }
          ]
        }
      }
    });

    const fieldsWithParsedOptions = res.data.listCustomFormFields.items.map(field => ({
      ...field,
      options: field.options ? JSON.parse(field.options) : null
    }));

    console.log('Custom fields for', formKey, fieldsWithParsedOptions);
  } catch (error) {
    console.error("Error fetching custom fields:", error);
  } finally {
    setLoading(false); // Re-enable the button and reset text
  }
};

  // DataGrid columns
  const columns = [
    { field: 'fieldType', headerName: 'Field Type', flex: 1 },
    { field: 'label', headerName: 'Label', flex: 2, editable: true },
    {
      field: 'required',
      headerName: 'Is Required?',
      flex: 1,
      renderCell: (params) => (
        <Checkbox checked={params.value} disabled />
      ),
    },
    {
      field: 'delete',
      headerName: 'Delete',
      flex: 1,
      renderCell: (params) => (
        <IconButton color="error">
          <DeleteIcon />
        </IconButton>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  // Dropdown fields columns
  const dropdownColumns = [
    { field: 'label', headerName: 'Label', flex: 2 },
    {
      field: 'options',
      headerName: 'Options',
      flex: 3,
      renderCell: (params) => (
        <Box>
          {params.value?.map((opt, idx) => (
            <Typography variant="body2" key={idx}>{idx + 1}. {opt}</Typography>
          ))}
        </Box>
      ),
    },
    {
      field: 'required',
      headerName: 'Is Required?',
      flex: 1,
      renderCell: (params) => (
        <Checkbox checked={params.value} disabled />
      ),
    },
    {
      field: 'delete',
      headerName: 'Delete',
      flex: 1,
      renderCell: (params) => (
        <IconButton color="error">
          <DeleteIcon />
        </IconButton>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  return (
    <AppTheme {...props}>
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{
          mx: { xs: 0, sm: 'auto' },
          mt: { xs: 2, sm: 2 },
          p: { xs: 0, sm: 0 },
          borderRadius: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >  

        <Grid container spacing={3}>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="formKey">Select a form to Modify it's Custom Fields</FormLabel>
            <StyledSelect
              id="formKey"
              name="formKey"
              size="small"
              value={formKey}
              onChange={(e) => setFormKey(e.target.value)}
            >
              <MenuItem value="CreateBorrowerForm">Borrower Form</MenuItem>
              <MenuItem value="CreateLoanForm">Loan Form</MenuItem>
              <MenuItem value="CreateCollateralForm">Collateral Form</MenuItem>
            </StyledSelect>
          </FormGrid>

          <FormGrid>
            <Button
                variant="contained"
                color="secondary"
                sx={{ mt: 3 }}
                disabled={!formKey || loading} // Disable when loading or no formKey
                onClick={() => handleLoadFields(formKey)}
            >
                {loading ? "Loading..." : "Load Custom Fields"}
            </Button>
          </FormGrid>

        </Grid>
      </Box>
    </AppTheme>
  );
}