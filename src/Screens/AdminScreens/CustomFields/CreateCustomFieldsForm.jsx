import * as React from 'react';
import AppTheme from '../../../muiTemplates/shared-theme/AppTheme';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { generateClient } from 'aws-amplify/api';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useContext, useEffect } from 'react'; // Import useEffect
import { UserContext } from '../../../App';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

const StyledOutlinedInput = styled(OutlinedInput)(({ error }) => ({
  border: error ? '1.5px solid #d32f2f' : '1px solid #708090',
  fontSize: '1rem',
}));

const StyledSelect = styled(Select)(({ error }) => ({
  border: error ? '1.5px solid #d32f2f' : '1px solid #708090',
  fontSize: '1rem',
}));

// Update the validation schema to include fieldType validation
const validationSchema = Yup.object().shape({
  formKey: Yup.string().required('Form key is required'),
  label: Yup.string()
    .matches(/^[^,"'!{}]+$/, 'Invalid characters found. Cannot use , " \' ! { }')
    .required('Label is required'),
  fieldType: Yup.string().required('Field type is required'),
  // Remove options from Yup schema as we'll handle it in validate function
});

const fieldTypeDescriptions = {
  text: 'This will allow you to type text into a field',
  number: 'If you want to restrict numbers only in a field',
  select: 'This will allow you to select options from a dropdown box',
  date: 'This will allow you to select a date from the calendar',
  textarea: 'This will create a multi-line text input field'
};

export default function CreateCustomFieldsForm(props) {
  const { userDetails } = useContext(UserContext);
  const navigate = useNavigate();
  const [submitError, setSubmitError] = React.useState('');
  const [submitSuccess, setSubmitSuccess] = React.useState('');
  const [currentOption, setCurrentOption] = React.useState('');
  const [optionsList, setOptionsList] = React.useState([]);

  const client = generateClient();
  const branchId = userDetails?.branchUsersId;

  const formik = useFormik({
    initialValues: {
      formKey: 'CreateBorrowerForm',
      label: '',
      fieldType: 'text',
      options: '',
      required: false,
    },
    validationSchema,
    validate: (values) => {
      const errors = {};
      // This validation now correctly uses the current `optionsList` state
      // because formik.validateForm() is triggered after state updates.
      if (values.fieldType === 'select' && optionsList.length === 0) {
        errors.options = 'At least one option is required for dropdown fields';
        errors.fieldType = 'Please add at least one option'; // Add error for fieldType
      }
      return errors;
    },
    validateOnChange: true, // Ensure validation runs on change
    validateOnBlur: true,   // Ensure validation runs on blur
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitError('');
      setSubmitSuccess('');
      setSubmitting(true);

      try {
        const input = {
          formKey: values.formKey,
          label: values.label.trim(),
          fieldType: values.fieldType,
          options: values.fieldType === 'select' ? 
            JSON.stringify(optionsList) : null, 
          required: values.required,
          branchCustomFormFieldsId: branchId,
          institutionCustomFormFieldsId: userDetails?.institutionUsersId || null,
        };
        // console.log("input::: ", input);

        await client.graphql({
          query: `
            mutation CreateCustomFormField($input: CreateCustomFormFieldInput!) {
              createCustomFormField(input: $input) {
                formKey
                label
                fieldType
                options
                required
              }
            }
          `,
          variables: { input }
        });

        setSubmitSuccess('Custom field created successfully!');
        setSubmitting(false);
        resetForm();

        // Reset optionsList and currentOption on successful submission
        setOptionsList([]);
        setCurrentOption('');

        setTimeout(() => {
          if (values.formKey === 'CreateBorrowerForm') {
            navigate('/addBorrower');
          } else if (values.formKey === 'CreateLoanForm') {
            navigate('/addLoan');
          } else if (values.formKey === 'CreateCollateralForm') {
            navigate('/addCollateral');
          }
        }, 1500); 

      } catch (err) {
        console.error("Error creating custom field:", err);
        setSubmitError('Failed to create custom field. Please try again.');
        setSubmitting(false);
      }
    },
  });

  // NEW: useEffect to trigger validation when optionsList or fieldType changes
  useEffect(() => {
    // Only re-validate if the field type is 'select'.
    // This ensures the `validate` function sees the most up-to-date optionsList.
    if (formik.values.fieldType === 'select') {
      formik.validateForm();
    }
  }, [optionsList, formik.values.fieldType, formik.validateForm]); 

  const handleAddOption = () => {
    const trimmedOption = currentOption.trim();
    
    // Check for invalid characters
    const invalidCharsRegex = /[,"'!{}]/;
    if (invalidCharsRegex.test(trimmedOption)) {
      formik.setFieldError('options', 'Invalid characters found. Cannot use , " \' ! { }');
      return;
    }

    if (trimmedOption) {
      const isDuplicate = optionsList.some(
        option => option.toLowerCase() === trimmedOption.toLowerCase()
      );
      
      if (isDuplicate) {
        formik.setFieldError('options', 'This option already exists');
        return;
      }

      setOptionsList([...optionsList, trimmedOption]);
      setCurrentOption('');

      if (formik.errors.options) {
        formik.setFieldError('options', undefined); // Clear any existing errors
      }
    }
  };

  return (
    <AppTheme {...props}>
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{
          mx: { xs: 0, sm: 'auto' },
          mt: { xs: 0, sm: 0 },
          p: { xs: 0, sm: 0 },
          borderRadius: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h6" sx={{ mb: 3 }}>
          Add a custom field to a form
        </Typography>

        <Grid container spacing={3}>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="formKey">Form</FormLabel>
            <StyledSelect
              id="formKey"
              name="formKey"
              value={formik.values.formKey}
              onChange={formik.handleChange}
              error={formik.touched.formKey && Boolean(formik.errors.formKey)}
              size="small"
            >
              <MenuItem value="CreateBorrowerForm">Borrower Form</MenuItem>
              <MenuItem value="CreateLoanForm">Loan Form</MenuItem>
              <MenuItem value="CreateCollateralForm">Collateral Form</MenuItem>
            </StyledSelect>
            {formik.touched.formKey && formik.errors.formKey && (
              <Typography color="error" variant="caption">{formik.errors.formKey}</Typography>
            )}
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="label">Field Label</FormLabel>
            <StyledOutlinedInput
              id="label"
              name="label"
              placeholder="Enter Field Label"
              size="small"
              value={formik.values.label}
              onChange={formik.handleChange}
              error={formik.touched.label && Boolean(formik.errors.label)}
            />
            {formik.touched.label && formik.errors.label && (
              <Typography color="error" variant="caption">{formik.errors.label}</Typography>
            )}
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
              <FormLabel htmlFor="fieldType">Field Type</FormLabel>
              <StyledSelect
                id="fieldType"
                name="fieldType"
                value={formik.values.fieldType}
                onChange={formik.handleChange}
                error={formik.touched.fieldType && Boolean(formik.errors.fieldType)}
                size="small"
                fullWidth
              >
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="number">Number</MenuItem>
                <MenuItem value="select">Dropdown</MenuItem>
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="textarea">Textarea</MenuItem>
              </StyledSelect>
              {formik.touched.fieldType && formik.errors.fieldType && (
                <Typography color="error" variant="caption">{formik.errors.fieldType}</Typography>
              )}
          </FormGrid>
          <FormGrid size={{ xs: 12, md: 6 }}>
              <Typography 
                variant="body2" 
                color="textSecondary"
                sx={{ 
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    minHeight: '56px' // This matches the height of the select input
                }}
              >
                {fieldTypeDescriptions[formik.values.fieldType]}
              </Typography>
          </FormGrid>

          {formik.values.fieldType === 'select' && (<>
          <FormGrid size={{ xs: 12, md: 6 }}>
              <Box sx={{ mb: 2 }}>
                <FormLabel>Add dropdown options</FormLabel>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <StyledOutlinedInput
                    id="currentOption"
                    placeholder="Enter an option"
                    size="small"
                    value={currentOption}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Clear previous errors
                      if (formik.errors.options) {
                        formik.setFieldError('options', undefined);
                      }
                      // Check for invalid characters as user types
                      if (/[,"'!{}]/.test(value)) {
                        formik.setFieldError('options', 'Invalid characters found. Cannot use , " \' ! { }');
                      }
                      setCurrentOption(value);
                    }}
                    error={Boolean(formik.errors.options)}
                    sx={{ flex: 1 }}
                  />
                  <Button 
                    variant="outlined" 
                    onClick={handleAddOption}
                    disabled={!currentOption.trim()}
                    size="small"
                  >
                    Add Option
                  </Button>
                </Box>
              </Box>
            

            </FormGrid>
          <FormGrid size={{ xs: 12, md: 6 }}>
              {optionsList.length > 0 && (
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 1, 
                  // mt: 2 
                }}>
                  {optionsList.map((option, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        // bgcolor: '#f5f5f5',
                        borderRadius: 1,
                        px: 1,
                        py: 0.5,
                      }}
                    >
                      <Typography variant="body2">{option}</Typography>
                      <IconButton
                        size="small"
                        onClick={() => {
                          const newOptions = [...optionsList];
                          newOptions.splice(index, 1);
                          setOptionsList(newOptions);
                          // The useEffect will handle re-validating the list length
                        }}
                        sx={{ 
                          ml: 1, 
                          p: 0.2,
                          color: '#d32f2f',
                          // '&:hover': {
                          //   bgcolor: 'rgba(211, 47, 47, 0.04)'
                          // }
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
              
              {/* Show error for options, either from duplicate check or length check */}
              {formik.touched.options && formik.errors.options && (
                <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                  {formik.errors.options}
                </Typography>
              )}
          </FormGrid>
          </>)}

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.required}
                  onChange={formik.handleChange}
                  name="required"
                />
              }
              label="Set this as a Required Field"
            />
          </FormGrid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          {submitError && (
            <Typography color="error" sx={{ mb: 1 }}>
              {submitError}
            </Typography>
          )}
          {submitSuccess && (
            <Typography color="primary" sx={{ mb: 1 }}>
              {submitSuccess}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            disabled={!formik.isValid || formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Creating...' : 'Create Custom Field'}
          </Button>
        </Box>
      </Box>
    </AppTheme>
  );
}