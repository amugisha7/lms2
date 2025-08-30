import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";

import createBorrowerForm from "./createBorrowerForm";
import TextInput from "../../../Resources/FormComponents/TextInput";
import Dropdown from "../../../Resources/FormComponents/Dropdown";
import DateInput from "../../../Resources/FormComponents/DateInput";
import CreateFormButtons from "../../../ComponentAssets/CreateFormButtons";
import CustomFields from "../../AdminScreens/CustomFields/CustomFields";

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
  let validator = Yup.string();

  // Apply validation based on validationType
  if (field.validationType === "email") {
    validator = Yup.string().email(field.validationMessage || "Invalid email");
  } else if (field.validationType === "date") {
    validator = Yup.date().nullable();
  } else if (field.validationType === "string") {
    validator = Yup.string();

    // Apply pattern validation if specified
    if (field.validationPattern) {
      validator = validator.matches(
        field.validationPattern,
        field.validationMessage
      );
    }

    // Apply min/max length if specified
    if (field.minLength) {
      validator = validator.min(field.minLength, "Too short");
    }
    if (field.maxLength) {
      validator = validator.max(field.maxLength, "Too long");
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
    return !!(value || businessName);
  }
);

validationShape.businessName = validationShape.businessName.test(
  "business-or-firstname-required",
  "Either Business Name or First Name is required",
  function (value) {
    const { firstname } = this.parent;
    return !!(value || firstname);
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

const CreateBorrower = () => {
  const [initialValues, setInitialValues] = useState(baseInitialValues);
  const [dynamicValidationSchema, setDynamicValidationSchema] =
    useState(baseValidationSchema);

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Form values:", values);
    setTimeout(() => {
      setSubmitting(false);
    }, 1000);
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
      <Typography variant="h3" component="h1" align="center" sx={{ mb: 4 }}>
        Create Borrower
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={dynamicValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {(formik) => (
          <Form>
            <Grid container spacing={1}>
              {createBorrowerForm.map((field) => (
                <FormGrid
                  item
                  size={{ xs: 12, md: field.span }}
                  key={field.name}
                >
                  {renderFormField({ ...field, editing: true })}
                </FormGrid>
              ))}

              {/* Custom Fields Component */}
              <FormGrid size={{ xs: 12 }}>
                <CustomFields
                  formKey="CreateBorrowerForm"
                  formik={formik}
                  onFieldsLoaded={handleCustomFieldsLoaded}
                  onValidationSchemaChange={handleValidationSchemaChange}
                />
              </FormGrid>

              <Grid size={{ xs: 12 }}>
                <CreateFormButtons formik={formik} />
              </Grid>
            </Grid>
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
};

export default CreateBorrower;
