import { useContext, useEffect, useState } from 'react';
import {
  FormControl,
  Select,
  TextField,
  MenuItem,
  FormHelperText,
  FormLabel,
  Grid,
  Typography,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { generateClient } from 'aws-amplify/api';
import { UserContext } from '../../../App'; // adjust path as 
import * as Yup from 'yup';
import { useTheme } from "@mui/material";
import { tokens } from '../../../theme';

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
  marginTop: '1rem',
}));

const StyledTextField = styled(TextField)(({ error }) => ({
  '& .MuiOutlinedInput-root': {
    border: error ? '1.5px solid #d32f2f' : '1px solid #708090',
    fontSize: '1rem',
  },
  "& .MuiOutlinedInput-input.Mui-disabled": {
    color: "#196496",
    WebkitTextFillColor: "#196496", // For Safari support
  },
}));

const CustomFields = ({ 
  formKey, 
  formik,
  onFieldsLoaded, // Callback to update parent validation schema and initial values
  onValidationSchemaChange,
  editing = true
}) => {
  const { userDetails } = useContext(UserContext);
  const institutionId = userDetails?.institutionUsersId;
  const branchId = userDetails?.branchUsersId;
  const [customFields, setCustomFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDateInputs, setShowDateInputs] = useState({});
  const client = generateClient();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchCustomFields = async () => {
      if (!institutionId || !branchId || !formKey) {
        setLoading(false);
        return;
      }

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

        if (res.data.listCustomFormFields.items.length > 0) {
          const sortedFields = res.data.listCustomFormFields.items
            .sort((a, b) => {
              return new Date(a.createdAt) - new Date(b.createdAt);
            });

          const fieldsWithParsedOptions = sortedFields.map(field => ({
            ...field,
            options: field.options ? JSON.parse(field.options) : null,
            fieldName: `custom_${field.id}` // Use unique field name based on ID
          }));

          setCustomFields(fieldsWithParsedOptions);

          // Build validation schema for custom fields
          const customFieldsValidation = {};
          const customFieldsInitialValues = {};

          fieldsWithParsedOptions.forEach(field => {
            let fieldSchema = Yup.string().nullable();
            
            // Add type-specific validation
            switch (field.fieldType) {
              case 'text':
              case 'textarea':
                fieldSchema = Yup.string()
                  .nullable()
                  .matches(
                    /^[^,"'!{}]+$/, 
                    'Invalid characters found. Cannot use , " \' ! { }'
                  );
                if (field.required) {
                  fieldSchema = fieldSchema.required(`${field.label} is required`);
                }
                break;
              case 'number':
                fieldSchema = Yup.number()
                  .typeError('Must be a number')
                  .nullable();
                if (field.required) {
                  fieldSchema = fieldSchema.required(`${field.label} is required`);
                }
                break;
              case 'date':
                fieldSchema = Yup.string()
                  .nullable()
                  .matches(
                    /^\d{4}-\d{2}-\d{2}$/,
                    'Invalid date format'
                  );
                if (field.required) {
                  fieldSchema = fieldSchema.required(`${field.label} is required`);
                }
                break;
              default:
                if (field.required) {
                  fieldSchema = fieldSchema.required(`${field.label} is required`);
                }
                break;
            }

            customFieldsValidation[field.fieldName] = fieldSchema;
            customFieldsInitialValues[field.fieldName] = '';
          });

          // Notify parent component about the fields and validation schema
          if (onFieldsLoaded) {
            onFieldsLoaded(customFieldsInitialValues);
          }
          
          if (onValidationSchemaChange) {
            onValidationSchemaChange(customFieldsValidation);
          }
        }
      } catch (error) {
        console.error("Error fetching custom fields:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomFields();
  }, [institutionId, branchId, formKey]);

  const toggleDateInput = (fieldName) => {
    setShowDateInputs(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const renderCustomField = (field) => {
    const fieldName = field.fieldName;
    const hasError = formik.touched[fieldName] && Boolean(formik.errors[fieldName]);
    const errorMessage = formik.touched[fieldName] && formik.errors[fieldName];

    // Remove helperText from commonProps
    const commonProps = {
      id: fieldName,
      name: fieldName,
      value: formik.values[fieldName] || '',
      onChange: formik.handleChange,
      onBlur: formik.handleBlur,
      error: hasError,
      required: field.required,
      fullWidth: true,
      size: "small",
      disabled: !editing
    };

    switch (field.fieldType) {
      case 'select':
        return (
          <FormControl 
            fullWidth 
            error={hasError}
            required={field.required}
            size="small"
            disabled={!editing}
          >
            <Select
              {...commonProps}
              displayEmpty
              sx={{
                border: hasError ? '1.5px solid #d32f2f' : '1px solid #708090',
                fontSize: '1rem',
                "& .MuiOutlinedInput-input.Mui-disabled": {
                  color: "#196496",
                  WebkitTextFillColor: "#196496", // For Safari support
                },

              }}
            >
              <MenuItem value="">
                <em>Select {field.label}</em>
              </MenuItem>
              {field.options?.map((option, index) => (
                <MenuItem key={`${fieldName}-option-${index}`} value={option}
                  sx={{
                    '&:hover': {
                      color: 'white',
                    },
                  }}
                >
                  {option}
                </MenuItem>
              ))}
            </Select>
            {hasError && (
              <FormHelperText error>{errorMessage}</FormHelperText>
            )}
          </FormControl>
        );

      case 'number':
      case 'textarea':
      case 'text':
        return (
          <div>
            <StyledTextField
              {...commonProps}
              type={field.fieldType === 'number' ? 'number' : 'text'}
              multiline={field.fieldType === 'textarea'}
              rows={field.fieldType === 'textarea' ? 3 : undefined}
              sx={{
                '& .MuiInputBase-root': {
                  resize: field.fieldType === 'textarea' ? 'vertical' : 'none',
                  minHeight: field.fieldType === 'textarea' ? '100px' : 'auto',

                }
              }}
            />
            {hasError && (
              <FormHelperText error>{errorMessage}</FormHelperText>
            )}
          </div>
        );

      case 'date':
        return (
          <div>
            {(!showDateInputs[fieldName] && !editing) ? (
              <Button
                variant="outlined"
                onClick={() => editing && toggleDateInput(fieldName)}
                sx={{
                  justifyContent: 'flex-start',
                  border: hasError ? '1.5px solid #d32f2f' : '1px solid #708090',
                  color: colors.grey[200],
                  fontSize: '1rem',
                  textTransform: 'none',
                  height: 40,
                  pl: 2,
                  backgroundColor: 'transparent', // transparent background
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.04)', // subtle hover effect
                  },
                }}
                fullWidth
                // disabled={!editing}
              >
                {formik.values[fieldName] ? formik.values[fieldName] : `Select ${field.label}`}
              </Button>
            ) : (
              <StyledTextField
                {...commonProps}
                type="date"
                onBlur={(e) => {
                  formik.handleBlur(e);
                  if (!formik.values[fieldName]) {
                    toggleDateInput(fieldName);
                  }
                }}
                sx={{
                  '& input[type="date"]::-webkit-calendar-picker-indicator': {
                    ...(theme.palette.mode === 'dark' && {
                      filter: 'invert(1)',
                    }),
                    cursor: 'pointer',
                  },
                  '& input[type="date"]::-webkit-calendar-picker-indicator:hover': {
                    ...(theme.palette.mode === 'dark' && {
                      filter: 'invert(1) brightness(1.2)',
                    }),
                  },
                }}
              />
            )}
            {hasError && (
              <FormHelperText error>{errorMessage}</FormHelperText>
            )}
          </div>
        );

      default:
        return (
          <div>
            <StyledTextField
              {...commonProps}
              type="text"
              placeholder={field.label}
            />
            {hasError && (
              <FormHelperText error>{errorMessage}</FormHelperText>
            )}
          </div>
        );
    }
  };

  if (loading) {
    return (
      <Typography variant="body2" sx={{ textAlign: 'center', py: 2 }}>
        Loading custom fields...
      </Typography>
    );
  }

  if (customFields.length === 0) {
    return null; // Don't render anything if no custom fields
  }

  return (
    <>
      {/* Custom Fields Section Header */}
      <Grid container spacing={2}>
        <FormGrid size={{ xs: 12}}>
        <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
          ADDITONAL INFORMATION (Custom Fields)
        </Typography>
        </FormGrid>
        {/* Render Custom Fields */}
        {customFields.map(field => (
          <FormGrid key={field.id} size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor={field.fieldName} required={field.required}>
              {field.label}
            </FormLabel>
            {renderCustomField(field)}
          </FormGrid>
        ))}
      </Grid>

    </>
  );
};

// Export helper function for getting custom fields data
CustomFields.getCustomFieldsData = (customFields, formValues) => {
  const customFieldsData = {};
  customFields.forEach(field => {
    const value = formValues[field.fieldName];
    customFieldsData[field.id] = {
      fieldId: field.id,
      label: field.label,
      fieldType: field.fieldType,
      value: typeof value === 'string' ? value.trim() || null : value || null
    };
  });
  return customFieldsData;
};

export default CustomFields;