import React, { useContext, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import AppTheme from '../../../muiTemplates/shared-theme/AppTheme';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';
import { countries } from '../../../Resources/listOfCountries';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import { generateClient } from 'aws-amplify/api';
import DropDownInputs from '../../../ComponentAssets/DropDownInputs';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { UserContext } from '../../../App';
import CustomFields from '../../AdminScreens/CustomFields/CustomFields';
import { useColorScheme } from '@mui/material/styles';
import SnackbarNotification from '../../../ComponentAssets/SnackbarNotification';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import { tokens } from '../../../theme';


const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

const titles = [
  '', 'Mr.', 'Mrs.', 'Ms.', 'Miss', 'Dr.', 'Prof.', 'Rev.', 'Hon.', 'Eng.'
];

const workingStatuses = [
  '', 'Employed', 'Self-Employed', 'Unemployed', 'Student', 'Retired', 'Homemaker', 'Part-time', 'Contract', 'Other'
];

const today = dayjs();
const defaultDob = today.subtract(20, 'year').format('YYYY-MM-DD');
const maxDob = today.subtract(1, 'day').format('YYYY-MM-DD');

// Base validation schema for static fields
const baseValidationSchema = Yup.object().shape({
  firstname: Yup.string()
    .matches(/^[^,"'!{}]+$/, 'Invalid characters found. Cannot use , " \' ! { }'),
  businessName: Yup.string()
    .matches(/^[^,"'!{}]+$/, 'Invalid characters found. Cannot use , " \' ! { }'),
  othername: Yup.string()
    .matches(/^[^,"'!{}]+$/, 'Invalid characters found. Cannot use , " \' ! { }'),
  typeOfBusiness: Yup.string()
    .matches(/^[^,"'!{}]+$/, 'Invalid characters found. Cannot use , " \' ! { }'),
  uniqueNumber: Yup.string()
    .matches(/^[^,"'!{}]+$/, 'Invalid characters found. Cannot use , " \' ! { }'),
  mobile: Yup.string()
    .matches(/^\d*$/, 'Mobile must contain numbers only')
    .max(20, 'Too long'),
  altPhone: Yup.string()
    .matches(/^\d*$/, 'Alternative Phone must contain numbers only')
    .max(20, 'Too long'),
  email: Yup.string()
    .email('Invalid email address'),
  address: Yup.string()
    .matches(/^[^,"'!{}]+$/, 'Invalid characters found. Cannot use , " \' ! { }'),
  city: Yup.string()
    .matches(/^[^,"'!{}]+$/, 'Invalid characters found. Cannot use , " \' ! { }'),
  province: Yup.string()
    .matches(/^[^,"'!{}]+$/, 'Invalid characters found. Cannot use , " \' ! { }'),
  zipcode: Yup.string()
    .matches(/^[^,"'!{}]+$/, 'Invalid characters found. Cannot use , " \' ! { }'),
  employerName: Yup.string()
    .matches(/^[^,"'!{}]+$/, 'Invalid characters found. Cannot use , " \' ! { }'),
  creditScore: Yup.string()
    .matches(/^[^,"'!{}]+$/, 'Invalid characters found. Cannot use , " \' ! { }'),
});

const StyledOutlinedInput = styled(OutlinedInput)(({ error, theme, disabled }) => {
  const colors = tokens(theme.palette.mode);
  return {
    border: error ? '1.5px solid #d32f2f' : '1px solid #708090',
    fontSize: '1rem',
    // '& .MuiOutlinedInput-input': {
    //   color: colors.blueAccent[300],
    // },
  };
});

export default function ViewBorrowerForm({ borrower, editing, setEditing, formSubmitRef, ...props }) {
  const { userDetails } = useContext(UserContext);
  const [showDobInput, setShowDobInput] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [dynamicValidationSchema, setDynamicValidationSchema] = useState(baseValidationSchema);

  const { mode, systemMode } = useColorScheme();
  const resolvedMode = systemMode || mode;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Helper to flatten customFieldsData for Formik
  function flattenCustomFieldsData(customFieldsData) {
    if (!customFieldsData) return {};
    let parsed;
    try {
      parsed = typeof customFieldsData === 'string'
        ? JSON.parse(customFieldsData)
        : customFieldsData;
    } catch {
      return {};
    }
    const flat = {};
    Object.entries(parsed).forEach(([fieldId, fieldObj]) => {
      flat[`custom_${fieldId}`] = fieldObj?.value ?? '';
    });
    return flat;
  }

  // Base initial values for the form
  const memoizedBaseInitialValues = useMemo(() => ({
    firstname: borrower?.firstname || '',
    othername: borrower?.othername || '',
    businessName: borrower?.businessName || '',
    typeOfBusiness: borrower?.typeOfBusiness || '',
    uniqueNumber: borrower?.uniqueIdNumber || '',
    mobile: borrower?.phoneNumber || '',
    altPhone: borrower?.otherPhoneNumber || '',
    email: borrower?.email || '',
    gender: borrower?.gender || '',
    title: borrower?.title || '',
    country: borrower?.nationality || '',
    workingStatus: borrower?.employmentStatus || '',
    creditScore: borrower?.creditScore || '',
    dob: borrower?.dateOfBirth || '',
    address: borrower?.address || '',
    city: borrower?.city || '',
    province: borrower?.state || '',
    zipcode: borrower?.zipcode || '',
    employerName: borrower?.employerName || '',
    // Add any custom fields from customFieldsData
    ...flattenCustomFieldsData(borrower?.customFieldsData)
  }), [borrower]);

    // Use a ref to track if custom field initial values have been applied for the current borrower
  const customFieldsAppliedRef = useRef(false);

  // 1. Define the initial values for Formik as a state.
  // This state will be updated when the borrower changes or when custom fields load their initial defaults.
  const [formikInitialValues, setFormikInitialValues] = useState(() => {
    // Initial computation (runs once on mount)
    // Combine base borrower data with existing custom fields from the borrower.
    return {
      firstname: borrower?.firstname || '',
      othername: borrower?.othername || '',
      businessName: borrower?.businessName || '',
      typeOfBusiness: borrower?.typeOfBusiness || '',
      uniqueNumber: borrower?.uniqueIdNumber || '',
      mobile: borrower?.phoneNumber || '',
      altPhone: borrower?.otherPhoneNumber || '',
      email: borrower?.email || '',
      gender: borrower?.gender || '',
      title: borrower?.title || '',
      country: borrower?.nationality || '',
      workingStatus: borrower?.employmentStatus || '',
      creditScore: borrower?.creditScore || '',
      dob: borrower?.dateOfBirth || '',
      address: borrower?.address || '',
      city: borrower?.city || '',
      province: borrower?.state || '',
      zipcode: borrower?.zipcode || '',
      employerName: borrower?.employerName || '',
      // Existing custom fields from borrower, overriding any potential defaults
      ...flattenCustomFieldsData(borrower?.customFieldsData)
    };
  });

    // 2. Effect to update `formikInitialValues` when the `borrower` prop changes.
  // This ensures that when a different borrower is viewed/edited, the form resets.
  useEffect(() => {
    setFormikInitialValues({
      firstname: borrower?.firstname || '',
      othername: borrower?.othername || '',
      businessName: borrower?.businessName || '',
      typeOfBusiness: borrower?.typeOfBusiness || '',
      uniqueNumber: borrower?.uniqueIdNumber || '',
      mobile: borrower?.phoneNumber || '',
      altPhone: borrower?.otherPhoneNumber || '',
      email: borrower?.email || '',
      gender: borrower?.gender || '',
      title: borrower?.title || '',
      country: borrower?.nationality || '',
      workingStatus: borrower?.employmentStatus || '',
      creditScore: borrower?.creditScore || '',
      dob: borrower?.dateOfBirth || '',
      address: borrower?.address || '',
      city: borrower?.city || '',
      province: borrower?.state || '',
      zipcode: borrower?.zipcode || '',
      employerName: borrower?.employerName || '',
      // Existing custom fields from borrower, overriding any potential defaults
      ...flattenCustomFieldsData(borrower?.customFieldsData)
    });
    // Reset the ref flag so custom fields defaults can be applied again for the new borrower
    customFieldsAppliedRef.current = false;
  }, [borrower]); // Dependency on borrower prop

  const client = generateClient();

  const formik = useFormik({
    initialValues: formikInitialValues,
    validationSchema: dynamicValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitError('');
      setSubmitSuccess('');
      setSubmitting(true);
      try {
        if (!userDetails?.branchUsersId) {
          setSubmitError('Error: Please try refreshing the page.');
          return;
        }

        // Create the base input object with standard fields
        const input = {
          id: borrower.id, // Include the ID for update
          firstname: values.firstname.trim() || null,
          othername: values.othername.trim() || null,
          businessName: values.businessName.trim() || null,
          typeOfBusiness: values.typeOfBusiness.trim() || null,
          uniqueIdNumber: values.uniqueNumber.trim() || null,
          phoneNumber: values.mobile.trim() || null,
          otherPhoneNumber: values.altPhone.trim() || null,
          email: values.email.trim() || null,
          gender: values.gender || null,
          dateOfBirth: values.dob || null,
          nationality: values.country || null,
          address: values.address.trim() || null,
          city: values.city.trim() || null,
          state: values.province.trim() || null,
          zipcode: values.zipcode.trim() || null,
          employmentStatus: values.workingStatus || null,
          employerName: values.employerName.trim() || null,
          creditScore: values.creditScore.trim() || null,
        };

        // Extract custom fields data
        const customFieldsData = {};
        Object.keys(values).forEach(key => {
          if (key.startsWith('custom_')) {
            const fieldId = key.replace('custom_', '');
            customFieldsData[fieldId] = {
              fieldId: fieldId,
              value: typeof values[key] === 'string' ? values[key].trim() || null : values[key] || null
            };
          }
        });

        // Add custom fields data to input if any exist
        if (Object.keys(customFieldsData).length > 0) {
          input.customFieldsData = JSON.stringify(customFieldsData);
        }

        await client.graphql({
          query: `
            mutation UpdateBorrower($input: UpdateBorrowerInput!) {
              updateBorrower(input: $input) {
                id
                firstname
                businessName
                phoneNumber
                email
                customFieldsData
                updatedAt
              }
            }
          `,
          variables: { input }
        });

        setSubmitSuccess('Borrower updated successfully!');
      } catch (err) {
        console.error("Error updating borrower:", err);
        setSubmitError('Failed to update borrower. Please try again.');
      } finally {
        setSubmitting(false);
        setEditing(false); // Exit editing mode after submission
      }
    }
  });

  // Expose submit function to parent via ref
  useEffect(() => {
    if (formSubmitRef) {
      formSubmitRef.current = formik.submitForm;
    }
  }, [formSubmitRef, formik]);

  // Handle custom fields loading
    // 3. Callback for when CustomFields loads its configuration (including default values).
  // This should only run once for a given borrower, after the initial load.
  const handleCustomFieldsLoaded = useCallback((customFieldsDefaults) => {
    if (!customFieldsAppliedRef.current) {
        setFormikInitialValues(prev => {
            const newInitialValues = { ...prev };
            let changed = false;

            // Iterate through the defaults provided by CustomFields
            Object.keys(customFieldsDefaults).forEach(key => {
                // Apply the default if the field is not already present in prev (from borrower data)
                // or if it's explicitly an empty string, and the default is not empty.
                // This ensures existing borrower data is prioritized over CustomField defaults.
                if (newInitialValues[key] === undefined || newInitialValues[key] === '') {
                    if (newInitialValues[key] !== customFieldsDefaults[key]) { // Only update if value is different
                        newInitialValues[key] = customFieldsDefaults[key];
                        changed = true;
                    }
                }
            });

            if (changed) {
                return newInitialValues; // Return a new object reference to trigger Formik re-initialization
            }
            return prev; // Return the same object reference if no changes, to prevent unnecessary re-renders
        });
        customFieldsAppliedRef.current = true; // Mark custom fields as applied for this borrower
    }
  }, []); // No dependencies that change often; relies on `customFieldsAppliedRef` and state updater form.

  // Handle validation schema changes from custom fields
  const handleValidationSchemaChange = useCallback((customFieldsValidation) => {
     const newValidationSchema = baseValidationSchema.shape(customFieldsValidation);
     setDynamicValidationSchema(newValidationSchema);
  }, []);

  // Dropdown configurations
  const genderDropdownConfig = {
    label: 'Gender',
    id: 'gender',
    value: formik.values.gender,
    onChange: e => formik.setFieldValue('gender', e.target.value),
    options: [
      { value: 'Male', label: 'Male' },
      { value: 'Female', label: 'Female' },
      { value: 'Decline to State', label: 'Decline to State' },
    ],
    placeholder: 'Select Gender',
    gridSize: { xs: 12, md: 6 },
  };

  const titleDropdownConfig = {
    label: 'Title',
    id: 'title',
    value: formik.values.title,
    onChange: e => formik.setFieldValue('title', e.target.value),
    options: titles.filter(t => t).map(t => ({ value: t, label: t })),
    placeholder: 'Select Title',
    gridSize: { xs: 12, md: 6 },
  };

  const countryDropdownConfig = {
    label: 'Country',
    id: 'country',
    value: formik.values.country,
    onChange: e => formik.setFieldValue('country', e.target.value),
    options: countries.map(c => ({ value: c, label: c })),
    placeholder: 'Select Country',
    gridSize: { xs: 12, md: 6 },
  };

  const workingStatusDropdownConfig = {
    label: 'Working Status',
    id: 'workingStatus',
    value: formik.values.workingStatus,
    onChange: e => formik.setFieldValue('workingStatus', e.target.value),
    options: workingStatuses.filter(s => s).map(s => ({ value: s, label: s })),
    placeholder: 'Select Working Status',
    gridSize: { xs: 12, md: 6 },
  };

  return (
    <>
      <SnackbarNotification
        message={submitSuccess}
        color="green"
      />
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
          backgroundColor: editing ? theme.palette.primary.topbar : 'transparent',
        }}
      >
        <Grid container spacing={3}>
          {/* Standard Form Fields */}
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="first-name">First Name</FormLabel>
            <StyledOutlinedInput
              id="first-name"
              name="firstname"
              disabled={!editing}
              required={formik.values.businessName.trim() === ''}
              autoComplete="given-name"
              size="small"
              value={formik.values.firstname}
              onChange={formik.handleChange}
              error={formik.touched.firstname && Boolean(formik.errors.firstname)}
              onBlur={formik.handleBlur}
              sx={{
                "& .MuiOutlinedInput-input.Mui-disabled": {
                  color: "#196496",
                  WebkitTextFillColor: "#196496", // For Safari support
                }
              }}
            />
            {formik.touched.firstname && formik.errors.firstname && (
              <Typography color="error" variant="caption">{formik.errors.firstname}</Typography>
            )}
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="middle-last-name">Middle / Last Name</FormLabel>
            <StyledOutlinedInput
              id="middle-last-name"
              name="othername"
              disabled={!editing}
              autoComplete="family-name"
              size="small"
              value={formik.values.othername}
              onChange={formik.handleChange}
              error={formik.touched.othername && Boolean(formik.errors.othername)}
              onBlur={formik.handleBlur}
              sx={{
                "& .MuiOutlinedInput-input.Mui-disabled": {
                  color: "#196496",
                  WebkitTextFillColor: "#196496", // For Safari support
                }
              }}
            />
            {formik.touched.othername && formik.errors.othername && (
              <Typography color="error" variant="caption">{formik.errors.othername}</Typography>
            )}
          </FormGrid>

          <FormGrid size={{ xs: 12 }}>
            <FormLabel htmlFor="business-name">Business Name</FormLabel>
            <StyledOutlinedInput
              id="business-name"
              name="businessName"
              disabled={!editing}
              required={formik.values.firstname.trim() === ''}
              autoComplete="organization"
              size="small"
              value={formik.values.businessName}
              onChange={formik.handleChange}
              error={formik.touched.businessName && Boolean(formik.errors.businessName)}
              onBlur={formik.handleBlur}
              sx={{
                "& .MuiOutlinedInput-input.Mui-disabled": {
                  color: "#196496",
                  WebkitTextFillColor: "#196496", // For Safari support
                }
              }}
            />
            {formik.touched.businessName && formik.errors.businessName && (
              <Typography color="error" variant="caption">{formik.errors.businessName}</Typography>
            )}
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="mobile">Mobile Number</FormLabel>
            <StyledOutlinedInput
              id="mobile"
              name="mobile"
              disabled={!editing}
              size="small"
              value={formik.values.mobile}
              onChange={e => {
                const val = e.target.value.replace(/\D/g, '');
                formik.setFieldValue('mobile', val);
              }}
              error={formik.touched.mobile && Boolean(formik.errors.mobile)}
              onBlur={formik.handleBlur}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              sx={{
                "& .MuiOutlinedInput-input.Mui-disabled": {
                  color: "#196496",
                  WebkitTextFillColor: "#196496", // For Safari support
                }
              }}
            />
            {formik.touched.mobile && formik.errors.mobile && (
              <Typography color="error" variant="caption">{formik.errors.mobile}</Typography>
            )}
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="alternative-phone">Alternative Phone Number</FormLabel>
            <StyledOutlinedInput
              id="alternative-phone"
              name="altPhone"
              disabled={!editing}
              size="small"
              value={formik.values.altPhone}
              onChange={e => {
                const val = e.target.value.replace(/\D/g, '');
                formik.setFieldValue('altPhone', val);
              }}
              error={formik.touched.altPhone && Boolean(formik.errors.altPhone)}
              onBlur={formik.handleBlur}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              sx={{
                "& .MuiOutlinedInput-input.Mui-disabled": {
                  color: "#196496",
                  WebkitTextFillColor: "#196496", // For Safari support
                }
              }}
            />
            {formik.touched.altPhone && formik.errors.altPhone && (
              <Typography color="error" variant="caption">{formik.errors.altPhone}</Typography>
            )}
          </FormGrid>

          <Typography variant="caption" sx={{ mt: -1, px: 2 }}>
            Do not put country code, spaces, or characters in the mobile field otherwise you won't be able to send SMS to the mobile.
          </Typography>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="unique-number">Unique Identification Number</FormLabel>
            <StyledOutlinedInput
              id="unique-number"
              name="uniqueNumber"
              disabled={!editing}
              size="small"
              value={formik.values.uniqueNumber}
              onChange={formik.handleChange}
              error={formik.touched.uniqueNumber && Boolean(formik.errors.uniqueNumber)}
              onBlur={formik.handleBlur}
              sx={{
                "& .MuiOutlinedInput-input.Mui-disabled": {
                  color: "#196496",
                  WebkitTextFillColor: "#196496", // For Safari support
                }
              }}
            />
            <Typography variant="caption" sx={{ mt: 1 }}>
              Enter a unique identifier for the borrower (e.g National ID, Social Security ID, License No., Registration No.)
            </Typography>
            {formik.touched.uniqueNumber && formik.errors.uniqueNumber && (
              <Typography color="error" variant="caption">{formik.errors.uniqueNumber}</Typography>
            )}
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <StyledOutlinedInput
              id="email"
              name="email"
              disabled={!editing}
              autoComplete="email"
              size="small"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              onBlur={formik.handleBlur}
              type="email"
              sx={{
                "& .MuiOutlinedInput-input.Mui-disabled": {
                  color: "#196496",
                  WebkitTextFillColor: "#196496", // For Safari support
                }
              }}
            />
            {formik.touched.email && formik.errors.email && (
              <Typography color="error" variant="caption">{formik.errors.email}</Typography>
            )}
          </FormGrid>

          {/* Dropdown fields */}
          <DropDownInputs dropdowns={[genderDropdownConfig]} editing={editing} />
          <DropDownInputs dropdowns={[titleDropdownConfig]} editing={editing} />
          <DropDownInputs dropdowns={[countryDropdownConfig]} editing={editing} />

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="address">Address</FormLabel>
            <StyledOutlinedInput
              id="address"
              name="address"
              disabled={!editing}
              size="small"
              value={formik.values.address}
              onChange={formik.handleChange}
              error={formik.touched.address && Boolean(formik.errors.address)}
              onBlur={formik.handleBlur}
              sx={{
                "& .MuiOutlinedInput-input.Mui-disabled": {
                  color: "#196496",
                  WebkitTextFillColor: "#196496", // For Safari support
                }
              }}
            />
            {formik.touched.address && formik.errors.address && (
              <Typography color="error" variant="caption">{formik.errors.address}</Typography>
            )}
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="city">City</FormLabel>
            <StyledOutlinedInput
              id="city"
              name="city"
              disabled={!editing}
              size="small"
              value={formik.values.city}
              onChange={formik.handleChange}
              error={formik.touched.city && Boolean(formik.errors.city)}
              onBlur={formik.handleBlur}
              sx={{
                "& .MuiOutlinedInput-input.Mui-disabled": {
                  color: "#196496",
                  WebkitTextFillColor: "#196496", // For Safari support
                }
              }}
            />
            {formik.touched.city && formik.errors.city && (
              <Typography color="error" variant="caption">{formik.errors.city}</Typography>
            )}
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="province">Province / State</FormLabel>
            <StyledOutlinedInput
              id="province"
              name="province"
              disabled={!editing}
              size="small"
              value={formik.values.province}
              onChange={formik.handleChange}
              error={formik.touched.province && Boolean(formik.errors.province)}
              onBlur={formik.handleBlur}
              sx={{
                "& .MuiOutlinedInput-input.Mui-disabled": {
                  color: "#196496",
                  WebkitTextFillColor: "#196496", // For Safari support
                }
              }}
            />
            {formik.touched.province && formik.errors.province && (
              <Typography color="error" variant="caption">{formik.errors.province}</Typography>
            )}
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="zipcode">Zipcode</FormLabel>
            <StyledOutlinedInput
              id="zipcode"
              name="zipcode"
              disabled={!editing}
              size="small"
              value={formik.values.zipcode}
              onChange={formik.handleChange}
              error={formik.touched.zipcode && Boolean(formik.errors.zipcode)}
              onBlur={formik.handleBlur}
              sx={{
                "& .MuiOutlinedInput-input.Mui-disabled": {
                  color: "#196496",
                  WebkitTextFillColor: "#196496", // For Safari support
                }
              }}
            />
            {formik.touched.zipcode && formik.errors.zipcode && (
              <Typography color="error" variant="caption">{formik.errors.zipcode}</Typography>
            )}
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="dob">Date of Birth</FormLabel>
            {(!showDobInput && !editing) ? (
              <Button
                variant="outlined"
                onClick={() => editing && setShowDobInput(true)}
                sx={{
                  justifyContent: 'flex-start',
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
              >
                {formik.values.dob ? formik.values.dob : 'Select date of birth'}
              </Button>
            ) : (
              <StyledOutlinedInput 
                id="dob"
                name="dob"
                type="date"
                value={formik.values.dob || defaultDob}
                onChange={formik.handleChange}
                inputProps={{ max: maxDob }}
                size="small"
                onBlur={() => { if (!formik.values.dob) setShowDobInput(false); }}
                error={formik.touched.dob && Boolean(formik.errors.dob)}
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
            {formik.touched.dob && formik.errors.dob && (
              <Typography color="error" variant="caption">{formik.errors.dob}</Typography>
            )}
          </FormGrid>

          <DropDownInputs dropdowns={[workingStatusDropdownConfig]} editing={editing} />

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="employer-name">Employer Name</FormLabel>
            <StyledOutlinedInput
              id="employer-name"
              name="employerName"
              disabled={!editing}
              size="small"
              value={formik.values.employerName}
              onChange={formik.handleChange}
              error={formik.touched.employerName && Boolean(formik.errors.employerName)}
              onBlur={formik.handleBlur}
              sx={{
                "& .MuiOutlinedInput-input.Mui-disabled": {
                  color: "#196496",
                  WebkitTextFillColor: "#196496", // For Safari support
                }
              }}
            />
            {formik.touched.employerName && formik.errors.employerName && (
              <Typography color="error" variant="caption">{formik.errors.employerName}</Typography>
            )}
          </FormGrid>

          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="credit-score">Credit Score</FormLabel>
            <StyledOutlinedInput
              id="credit-score"
              name="creditScore"
              disabled={!editing}
              size="small"
              value={formik.values.creditScore}
              onChange={formik.handleChange}
              error={formik.touched.creditScore && Boolean(formik.errors.creditScore)}
              onBlur={formik.handleBlur}
              sx={{
                "& .MuiOutlinedInput-input.Mui-disabled": {
                  color: "#196496",
                  WebkitTextFillColor: "#196496", // For Safari support
                }
              }}
            />
            {formik.touched.creditScore && formik.errors.creditScore && (
              <Typography color="error" variant="caption">{formik.errors.creditScore}</Typography>
            )}
          </FormGrid>

          {/* Custom Fields Component */}
          <FormGrid size={{ xs: 12 }}>
            <CustomFields
              formKey="CreateBorrowerForm"
              formik={formik}
              onFieldsLoaded={handleCustomFieldsLoaded}
              onValidationSchemaChange={handleValidationSchemaChange}
              editing={editing}
            />
          </FormGrid>
        </Grid>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 4, mt:4 }}>
            <Link
              component={RouterLink}
              to="/customFields"
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              <Typography variant="body2"
                sx={{ color: colors.blueAccent[300] }}
              >
                Click here to manage Custom Fields
              </Typography>
            </Link>
          </Box>
      </Box>
    </>
  );}