import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useContext,
} from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Box, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Link from "@mui/material/Link";
import { generateClient } from "aws-amplify/api";

import createBorrowerForm from "./createBorrowerForm";
import TextInput from "../../../Resources/FormComponents/TextInput";
import Dropdown from "../../../Resources/FormComponents/Dropdown";
import DateInput from "../../../Resources/FormComponents/DateInput";
import CreateFormButtons from "../../../ComponentAssets/CreateFormButtons";
import CustomEditFormButtons from "../../../ComponentAssets/CustomEditFormButtons";
import CustomFields from "../../AdminScreens/CustomFields/CustomFields";
import { UserContext } from "../../../App";
import { EditClickedContext } from "../../../ComponentAssets/CollectionsTemplate"; // <-- import context

// Styled FormGrid component for consistent layout
const FormGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.up("md")]: {
    paddingRight: "20px",
  },
}));

// Build initialValues dynamically from createBorrowerForm
const baseInitialValues = createBorrowerForm.reduce((acc, field) => {
  acc[field.name] = "";
  return acc;
}, {});

// Build validation schema dynamically using field validation properties
const validationShape = {};
createBorrowerForm.forEach((field) => {
  let validator = Yup.string().nullable();

  // Apply validation based on validationType
  if (field.validationType === "email") {
    validator = Yup.string()
      .nullable()
      .email(field.validationMessage || "Invalid email");
  } else if (field.validationType === "date") {
    validator = Yup.date().nullable();
  } else if (field.validationType === "string") {
    validator = Yup.string().nullable();

    // Apply pattern validation if specified
    if (field.validationPattern) {
      validator = validator.test(
        "pattern-validation",
        field.validationMessage,
        function (value) {
          if (!value || value.trim() === "") return true; // Allow empty values
          return field.validationPattern.test(value);
        }
      );
    }

    // Apply min/max length if specified
    if (field.minLength) {
      validator = validator.test("min-length", "Too short", function (value) {
        if (!value || value.trim() === "") return true; // Allow empty values
        return value.length >= field.minLength;
      });
    }
    if (field.maxLength) {
      validator = validator.test("max-length", "Too long", function (value) {
        if (!value || value.trim() === "") return true; // Allow empty values
        return value.length <= field.maxLength;
      });
    }
  }

  // Apply required validation (except for firstname and businessName which have custom logic)
  if (
    field.required &&
    field.name !== "firstname" &&
    field.name !== "businessName"
  ) {
    validator = validator.required(`${field.label} is required`);
  }

  validationShape[field.name] = validator;
});

// Add custom validation for firstname and businessName
validationShape.firstname = validationShape.firstname.test(
  "firstname-or-business-required",
  "Either First Name or Business Name is required",
  function (value) {
    const { businessName } = this.parent;
    return !!(value?.trim() || businessName?.trim());
  }
);

validationShape.businessName = validationShape.businessName.test(
  "business-or-firstname-required",
  "Either Business Name or First Name is required",
  function (value) {
    const { firstname } = this.parent;
    return !!(value?.trim() || firstname?.trim());
  }
);

const baseValidationSchema = Yup.object().shape(validationShape);

const renderFormField = (field) => {
  switch (field.type) {
    case "text":
    case "email":
      return <TextInput {...field} />;
    case "tel":
      // inputProps flows via {...field} and is merged into slotProps.input in TextInput
      return <TextInput {...field} />;
    case "select":
      return <Dropdown {...field} />;
    case "date":
      return <DateInput {...field} />;
    default:
      return <TextInput {...field} />;
  }
};

const CreateBorrower = forwardRef(
  (
    {
      onClose,
      onCreateSuccess,
      onEditSuccess,
      initialValues: propInitialValues,
      isEditMode = false,
      hideCancel,
    },
    ref
  ) => {
    const [initialValues, setInitialValues] = useState(baseInitialValues);
    const [dynamicValidationSchema, setDynamicValidationSchema] =
      useState(baseValidationSchema);
    const client = generateClient();
    const navigate = useNavigate();
    const { userDetails } = React.useContext(UserContext);
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState("");
    const [editMode, setEditMode] = useState(!isEditMode);
    const editClickedContext = useContext(EditClickedContext); // <-- get context

    // Use prop initialValues if provided, otherwise use default
    const formInitialValues = propInitialValues
      ? {
          ...baseInitialValues,
          ...propInitialValues,
        }
      : initialValues;

    useImperativeHandle(ref, () => ({
      toggleEdit: () => {
        setEditMode((prev) => !prev);
      },
      getEditMode: () => editMode,
    }));

    // Add effect to respond to editClicked from context (like CreateBranches)
    useEffect(() => {
      if (editClickedContext?.editClicked && isEditMode && !editMode) {
        setEditMode(true);
      }
    }, [editClickedContext?.editClicked, isEditMode, editMode]);

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
      setSubmitError("");
      setSubmitSuccess("");
      setSubmitting(true);
      try {
        if (!userDetails?.branchUsersId) {
          setSubmitError("Error: Please try refreshing the page.");
          setSubmitting(false);
          return;
        }
        if (isEditMode && propInitialValues) {
          // Update existing borrower
          const input = {
            id: propInitialValues.id,
            firstname: values.firstname?.trim() || null,
            othername: values.othername?.trim() || null,
            typeOfBusiness: values.typeOfBusiness?.trim() || null,
            uniqueIdNumber: values.uniqueNumber?.trim() || null,
            phoneNumber: values.mobile?.trim() || null,
            otherPhoneNumber: values.altPhone?.trim() || null,
            gender: values.gender || null,
            dateOfBirth: values.dob || null,
            nationality: values.country || null,
            address: values.address?.trim() || null,
            city: values.city?.trim() || null,
            state: values.province?.trim() || null,
            zipcode: values.zipcode?.trim() || null,
            employmentStatus: values.workingStatus || null,
            employerName: values.employerName?.trim() || null,
            creditScore: values.creditScore?.trim() || null,
            branchBorrowersId: userDetails.branchUsersId,
          };
          // Only add businessName if present
          if (values.businessName && values.businessName.trim() !== "") {
            input.businessName = values.businessName.trim();
          }
          // Only add email if present
          if (values.email && values.email.trim() !== "") {
            input.email = values.email.trim();
          }

          // Extract custom fields data
          const customFieldsData = {};
          Object.keys(values).forEach((key) => {
            if (key.startsWith("custom_")) {
              const fieldId = key.replace("custom_", "");
              customFieldsData[fieldId] = {
                fieldId: fieldId,
                value:
                  typeof values[key] === "string"
                    ? values[key].trim() || null
                    : values[key] || null,
              };
            }
          });

          // Add custom fields data to input if any exist
          if (Object.keys(customFieldsData).length > 0) {
            input.customFieldsData = JSON.stringify(customFieldsData);
          }

          const result = await client.graphql({
            query: `
              mutation UpdateBorrower($input: UpdateBorrowerInput!) {
                updateBorrower(input: $input) {
                  id
                  firstname
                  businessName
                  phoneNumber
                  email
                  customFieldsData
                  branchBorrowersId
                  createdAt
                  updatedAt
                }
              }
            `,
            variables: { input },
          });
          setSubmitSuccess("Borrower updated!");
          setEditMode(false);
          setTimeout(() => setSubmitSuccess(""), 2000); // Optional: clear success after a short delay
          if (onEditSuccess) {
            onEditSuccess(result.data.updateBorrower);
          }
        } else {
          // Create new borrower
          const input = {
            firstname: values.firstname?.trim() || null,
            othername: values.othername?.trim() || null,
            typeOfBusiness: values.typeOfBusiness?.trim() || null,
            uniqueIdNumber: values.uniqueNumber?.trim() || null,
            phoneNumber: values.mobile?.trim() || null,
            otherPhoneNumber: values.altPhone?.trim() || null,
            gender: values.gender || null,
            dateOfBirth: values.dob || null,
            nationality: values.country || null,
            address: values.address?.trim() || null,
            city: values.city?.trim() || null,
            state: values.province?.trim() || null,
            zipcode: values.zipcode?.trim() || null,
            employmentStatus: values.workingStatus || null,
            employerName: values.employerName?.trim() || null,
            creditScore: values.creditScore?.trim() || null,
          };
          // Only add businessName if present
          if (values.businessName && values.businessName.trim() !== "") {
            input.businessName = values.businessName.trim();
          }
          // Only add email if present
          if (values.email && values.email.trim() !== "") {
            input.email = values.email.trim();
          }
          const customFieldsData = {};
          Object.keys(values).forEach((key) => {
            if (key.startsWith("custom_")) {
              const fieldId = key.replace("custom_", "");
              customFieldsData[fieldId] = {
                fieldId: fieldId,
                value:
                  typeof values[key] === "string"
                    ? values[key].trim() || null
                    : values[key] || null,
              };
            }
          });
          if (Object.keys(customFieldsData).length > 0) {
            input.customFieldsData = JSON.stringify(customFieldsData);
          }
          const result = await client.graphql({
            query: `
              mutation CreateBorrower($input: CreateBorrowerInput!) {
                createBorrower(input: $input) {
                  id
                  firstname
                  businessName
                  phoneNumber
                  email
                  customFieldsData
                  branchBorrowersId
                  createdAt
                  updatedAt
                }
              }
            `,
            variables: {
              input: {
                ...input,
                branchBorrowersId: userDetails.branchUsersId,
              },
            },
          });
          setSubmitSuccess("Borrower created!");
          resetForm();
          if (onCreateSuccess) {
            onCreateSuccess(result.data.createBorrower);
          }
        }
      } catch (err) {
        console.error("Error creating/updating borrower:", err);
        setSubmitError(
          `Failed to ${
            isEditMode ? "update" : "create"
          } borrower. Please try again.`
        );
      } finally {
        setSubmitting(false);
      }
    };

    // Handle custom fields loading
    const handleCustomFieldsLoaded = (customFieldsInitialValues) => {
      const newInitialValues = {
        ...baseInitialValues,
        ...customFieldsInitialValues,
      };
      setInitialValues(newInitialValues);
    };

    // Handle validation schema changes from custom fields
    const handleValidationSchemaChange = (customFieldsValidation) => {
      const newValidationSchema = baseValidationSchema.shape(
        customFieldsValidation
      );
      setDynamicValidationSchema(newValidationSchema);
    };

    return (
      <>
        <Formik
          initialValues={formInitialValues}
          validationSchema={dynamicValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {(formik) => (
            <Form>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  flex: 1,
                }}
              >
                {isEditMode && editMode ? (
                  <CustomEditFormButtons
                    formik={formik}
                    setEditMode={setEditMode}
                    setSubmitError={setSubmitError}
                    setSubmitSuccess={setSubmitSuccess}
                  />
                ) : null}
                <Grid container spacing={1}>
                  {createBorrowerForm.map((field) => (
                    <FormGrid
                      item
                      size={{ xs: 12, md: field.span }}
                      key={field.name}
                    >
                      {renderFormField({ ...field, editing: editMode })}
                    </FormGrid>
                  ))}

                  {/* Custom Fields Component */}
                  <Box sx={{ display: "flex" }}>
                    {/* <CustomFields
                      formKey="CreateBorrowerForm"
                      formik={formik}
                      onFieldsLoaded={handleCustomFieldsLoaded}
                      onValidationSchemaChange={handleValidationSchemaChange}
                    /> */}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      pr: 2,
                      justifyContent: { xs: "center", md: "flex-end" },
                      width: "100%",
                    }}
                  >
                    {!isEditMode ? (
                      <CreateFormButtons
                        formik={formik}
                        setEditMode={setEditMode}
                        setSubmitError={setSubmitError}
                        setSubmitSuccess={setSubmitSuccess}
                        onClose={onClose}
                        hideCancel={hideCancel}
                      />
                    ) : null}
                  </Box>
                  {submitError && (
                    <Typography color="error" sx={{ mt: 2 }}>
                      {submitError}
                    </Typography>
                  )}
                  {submitSuccess && (
                    <Typography color="primary" sx={{ mt: 2 }}>
                      {submitSuccess}
                    </Typography>
                  )}
                </Grid>
              </Box>
            </Form>
          )}
        </Formik>
        <Link
          component={RouterLink}
          to="/customFields"
          sx={{ display: "block", textAlign: "center", pb: "60px" }}
        >
          Need to add custom fields? <b>Click here to manage custom fields</b>
        </Link>
      </>
    );
  }
);

CreateBorrower.displayName = "CreateBorrower";

export default CreateBorrower;
