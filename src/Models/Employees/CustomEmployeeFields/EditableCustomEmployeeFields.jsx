import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Box, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material";
import CustomEditFormButtons from "../../../ModelAssets/CustomEditFormButtons";
import CustomEmployeeFields from "./CustomEmployeeFields";
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

const EditableCustomEmployeeFields = ({
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

  const createFormInitialValues = () => {
    const vals = {};
    customFields.forEach((field) => {
      vals[field.fieldName] = initialValues[field.fieldName] || "";
    });
    return vals;
  };

  const createValidationSchema = () =>
    Yup.object().shape(
      CustomEmployeeFields.createValidationSchema(customFields),
    );

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitError("");
    setSubmitSuccess("");
    setSubmitting(true);

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
          if (onUpdateSuccess) onUpdateSuccess(result);
        }, 1000);
      } else {
        setSubmitError("Update function not available. Please try again.");
      }
    } catch (err) {
      console.error("Error updating employee custom fields:", err);
      const msg =
        err.message || "Failed to update custom fields. Please try again.";
      setSubmitError(msg);
      if (setNotification) setNotification({ message: msg, color: "red" });
    } finally {
      setSubmitting(false);
    }
  };

  if (customFields.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography
          variant="body1"
          sx={{ color: theme.palette.text.secondary, fontStyle: "italic" }}
        >
          No custom fields available for this employee.
        </Typography>
      </Box>
    );
  }

  return (
    <Formik
      initialValues={createFormInitialValues()}
      validationSchema={createValidationSchema()}
      onSubmit={handleSubmit}
      enableReinitialize
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
              setEditMode={() => {}}
              setSubmitError={setSubmitError}
              setSubmitSuccess={setSubmitSuccess}
              onCancel={onCancel}
            />

            <Grid container spacing={1}>
              {customFields.map((field) => {
                const commonProps = {
                  name: field.fieldName,
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
                          field.options?.map((o) => ({ value: o, label: o })) ||
                          []
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

export default EditableCustomEmployeeFields;
