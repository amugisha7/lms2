import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Box, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material";
import { FormikProvider } from "formik";
import CustomEditFormButtons from "../../../ModelAssets/CustomEditFormButtons";
import CustomUserFields from "./CustomUserFields";

// Import form components
import TextInput from "../../../Resources/FormComponents/TextInput";
import NumberInput from "../../../Resources/FormComponents/NumberInput";
import Dropdown from "../../../Resources/FormComponents/Dropdown";
import DateInput from "../../../Resources/FormComponents/DateInput";
import TextArea from "../../../Resources/FormComponents/TextArea";

const FormGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.up("md")]: {
    paddingRight: "20px",
  },
}));

const EditableCustomUserFields = ({
  customFields = [],
  initialValues = {},
  onUpdateSuccess,
  onUpdateCustomFieldsAPI,
  onCancel,
  setNotification,
}) => {
  const theme = useTheme();
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  // Create form initial values from custom fields
  const createFormInitialValues = () => {
    const values = {};
    customFields.forEach((field) => {
      values[field.fieldName] = initialValues[field.fieldName] || "";
    });
    return values;
  };

  // Create validation schema from custom fields
  const createValidationSchema = () => {
    return Yup.object().shape(
      CustomUserFields.createValidationSchema(customFields),
    );
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitError("");
    setSubmitSuccess("");
    setSubmitting(true);

    console.log("EditableCustomUserFields Form Values:", values); // <-- Add this log

    try {
      if (onUpdateCustomFieldsAPI) {
        const result = await onUpdateCustomFieldsAPI(values);
        setSubmitSuccess("Custom fields updated successfully!");

        if (setNotification) {
          setNotification({
            message: "Custom fields updated successfully!",
            color: "green",
          });
        }

        setTimeout(() => {
          setSubmitSuccess("");
          if (onUpdateSuccess) {
            onUpdateSuccess(result);
          }
        }, 1000);
      } else {
        setSubmitError("Update function not available. Please try again.");
      }
    } catch (err) {
      console.error("Error updating custom fields:", err);
      const errorMessage =
        err.message || "Failed to update custom fields. Please try again.";
      setSubmitError(errorMessage);

      if (setNotification) {
        setNotification({
          message: errorMessage,
          color: "red",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (customFields.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            fontStyle: "italic",
          }}
        >
          No custom fields available for this user.
        </Typography>
      </Box>
    );
  }

  return (
    <Formik
      initialValues={createFormInitialValues()}
      validationSchema={createValidationSchema()}
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
            <CustomEditFormButtons
              formik={formik}
              setEditMode={() => {}} // Not used in popup context
              setSubmitError={setSubmitError}
              setSubmitSuccess={setSubmitSuccess}
              onCancel={onCancel}
            />

            {/* Render custom fields without action buttons */}
            <Grid container spacing={1}>
              {customFields.map((field) => {
                const fieldName = field.fieldName;

                const commonProps = {
                  name: fieldName,
                  label: field.label,
                  required: field.required,
                  editing: true,
                };

                let fieldComponent;
                switch (field.fieldType) {
                  case "select":
                    fieldComponent = (
                      <Dropdown
                        {...commonProps}
                        options={
                          field.options?.map((option) => ({
                            value: option,
                            label: option,
                          })) || []
                        }
                      />
                    );
                    break;
                  case "number":
                    fieldComponent = <NumberInput {...commonProps} />;
                    break;
                  case "textarea":
                    fieldComponent = <TextArea {...commonProps} rows={3} />;
                    break;
                  case "date":
                    fieldComponent = <DateInput {...commonProps} />;
                    break;
                  case "text":
                  default:
                    fieldComponent = <TextInput {...commonProps} />;
                    break;
                }

                return (
                  <FormGrid key={field.id} size={{ xs: 12, md: 6 }}>
                    {fieldComponent}
                  </FormGrid>
                );
              })}
            </Grid>

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
};

export default EditableCustomUserFields;
