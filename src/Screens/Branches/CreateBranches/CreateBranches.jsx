import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Box, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { generateClient } from "aws-amplify/api";

import createBranchesForm from "./createBranchesForm";
import TextInput from "../../../Resources/FormComponents/TextInput";
import TextArea from "../../../Resources/FormComponents/TextArea";
import RadioGroup from "../../../Resources/FormComponents/RadioGroup";
import CreateFormButtons from "../../../ComponentAssets/CreateFormButtons";
import CustomEditFormButtons from "../../../ComponentAssets/CustomEditFormButtons";
import { UserContext } from "../../../App";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

// Build initialValues dynamically from createBranchesForm
const initialValues = createBranchesForm.reduce((acc, field) => {
  acc[field.name] = "";
  return acc;
}, {});

// Add status field
initialValues.status = "active";

// Build validation schema dynamically
const validationShape = {};
createBranchesForm.forEach((field) => {
  let validator = Yup.string();

  if (field.validationType === "string") {
    if (field.validationPattern) {
      validator = validator.matches(
        field.validationPattern,
        field.validationMessage
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

const CreateBranchesForm = forwardRef(
  (
    {
      onClose,
      onCreateSuccess,
      onEditSuccess,
      initialValues: propInitialValues,
      isEditMode = false,
    },
    ref
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
          branchCode: propInitialValues.branchCode || "",
          address: propInitialValues.address || "",
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

      if (!userDetails || !userDetails.institutionUsersId) {
        setSubmitError("ERROR. Please reload the page or contact support.");
        setSubmitting(false);
        return;
      }

      try {
        if (isEditMode && propInitialValues) {
          // Update existing branch
          const result = await client.graphql({
            query: `
            mutation UpdateBranch($input: UpdateBranchInput!) {
              updateBranch(input: $input) {
                id
                name
                branchCode
                address
                status
              }
            }
          `,
            variables: {
              input: {
                id: propInitialValues.id,
                name: values.name.trim(),
                branchCode: values.branchCode.trim(),
                address: values.address?.trim() || null,
                status: values.status,
              },
            },
          });

          setSubmitSuccess("Branch updated!");
          setEditMode(false);
          if (onEditSuccess) {
            onEditSuccess(result.data.updateBranch);
          }
        } else {
          // Create new branch
          const result = await client.graphql({
            query: `
            mutation CreateBranch($input: CreateBranchInput!) {
              createBranch(input: $input) {
                id
                name
                branchCode
                address
                status
              }
            }
          `,
            variables: {
              input: {
                name: values.name.trim(),
                branchCode: values.branchCode.trim(),
                address: values.address?.trim() || null,
                status: values.status,
                institutionBranchesId: userDetails.institutionUsersId,
              },
            },
          });

          setSubmitSuccess("Branch created!");
          resetForm();
          if (onCreateSuccess) {
            onCreateSuccess(result.data.createBranch);
          }
        }
      } catch (err) {
        console.log("err::: ", err);
        setSubmitError(
          `Failed to ${
            isEditMode ? "update" : "create"
          } branch. Please try again.`
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
                {createBranchesForm
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
  }
);

CreateBranchesForm.displayName = "CreateBranchesForm";

export default CreateBranchesForm;
