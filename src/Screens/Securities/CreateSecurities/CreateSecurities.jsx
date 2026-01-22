import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Box, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { generateClient } from "aws-amplify/api";

import createSecuritiesForm from "./createSecuritiesForm";
import TextInput from "../../../Resources/FormComponents/TextInput";
import TextArea from "../../../Resources/FormComponents/TextArea";
import RadioGroup from "../../../Resources/FormComponents/RadioGroup";
import CreateFormButtons from "../../../ModelAssets/CreateFormButtons";
import CustomEditFormButtons from "../../../ModelAssets/CustomEditFormButtons";
import { UserContext } from "../../../App";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

// Build initialValues dynamically from createSecuritiesForm
const initialValues = createSecuritiesForm.reduce((acc, field) => {
  acc[field.name] = "";
  return acc;
}, {});

// Add status field
initialValues.status = "active";

// Build validation schema dynamically
const validationShape = {};
createSecuritiesForm.forEach((field) => {
  let validator = Yup.string();

  if (field.validationType === "string") {
    if (field.validationPattern) {
      validator = validator.matches(
        field.validationPattern,
        field.validationMessage,
      );
    }
    if (field.maxLength) {
      validator = validator.max(field.maxLength, `${field.label} too long`);
    }
  }

  if (field.required) {
    validator = validator.required(`${field.label} is required`);
  }

  validationShape[field.name] = validator;
});

// Add status validation
validationShape.status = Yup.string();

const validationSchema = Yup.object().shape(validationShape);

const renderFormField = (field) => {
  switch (field.type) {
    case "textarea":
      return <TextArea {...field} />;
    case "radio":
      return <RadioGroup {...field} />;
    case "text":
    default:
      return <TextInput {...field} />;
  }
};

const CreateSecuritiesForm = forwardRef(
  (
    {
      onClose,
      onCreateSuccess,
      onEditSuccess,
      initialValues: propInitialValues,
      isEditMode = false,
      hideCancel,
    },
    ref,
  ) => {
    const client = generateClient();
    const { userDetails } = React.useContext(UserContext);
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState("");
    const [editMode, setEditMode] = useState(!isEditMode);

    // Use prop initialValues if provided, otherwise use default
    const formInitialValues = propInitialValues
      ? {
          name: propInitialValues.name || "",
          type: propInitialValues.type || "",
          description: propInitialValues.description || "",
          value: propInitialValues.value || "",
          status: propInitialValues.status || "active",
        }
      : initialValues;

    useImperativeHandle(ref, () => ({
      toggleEdit: () => {
        setEditMode(!editMode);
      },
      getEditMode: () => editMode,
    }));

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
      setSubmitError("");
      setSubmitSuccess("");
      setSubmitting(true);

      if (!userDetails || !userDetails.borrowerId) {
        setSubmitError("ERROR. Please reload the page or contact support.");
        setSubmitting(false);
        return;
      }

      try {
        if (isEditMode && propInitialValues) {
          // Update existing security
          const result = await client.graphql({
            query: `
            mutation UpdateSecurity($input: UpdateSecurityInput!) {
              updateSecurity(input: $input) {
                id
                name
                type
                description
                value
                status
              }
            }
          `,
            variables: {
              input: {
                id: propInitialValues.id,
                name: values.name.trim(),
                type: values.type.trim(),
                description: values.description?.trim() || null,
                value: parseFloat(values.value),
                status: values.status,
              },
            },
          });

          setSubmitSuccess("Security updated!");
          setEditMode(false);
          if (onEditSuccess) {
            onEditSuccess(result.data.updateSecurity);
          }
        } else {
          // Create new security
          const result = await client.graphql({
            query: `
            mutation CreateSecurity($input: CreateSecurityInput!) {
              createSecurity(input: $input) {
                id
                name
                type
                description
                value
                status
              }
            }
          `,
            variables: {
              input: {
                name: values.name.trim(),
                type: values.type.trim(),
                description: values.description?.trim() || null,
                value: parseFloat(values.value),
                status: values.status,
                borrowerSecuritiesId: userDetails.borrowerId,
              },
            },
          });

          setSubmitSuccess("Security created!");
          resetForm();
          if (onCreateSuccess) {
            onCreateSuccess(result.data.createSecurity);
          }
        }
      } catch (err) {
        console.log("err::: ", err);
        setSubmitError(
          `Failed to ${
            isEditMode ? "update" : "create"
          } security. Please try again.`,
        );
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <Formik
        initialValues={formInitialValues}
        validationSchema={validationSchema}
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

              <Grid container spacing={3}>
                {createSecuritiesForm
                  .filter((field) => {
                    // Show field if it doesn't have showOnlyInEditMode OR if we're in edit mode
                    return !field.showOnlyInEditMode || isEditMode;
                  })
                  .map((field) => (
                    <FormGrid
                      size={{ xs: 12, md: field.span }}
                      key={field.name}
                    >
                      {renderFormField({ ...field, editing: editMode })}
                    </FormGrid>
                  ))}
              </Grid>

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
            </Box>
          </Form>
        )}
      </Formik>
    );
  },
);

CreateSecuritiesForm.displayName = "CreateSecuritiesForm";

export default CreateSecuritiesForm;
