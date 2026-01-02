import React, { useContext, useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Box,
  Grid,
  Button,
  Paper,
  Typography,
  styled,
  useTheme,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { UserContext } from "../../App";
import { settingsForm } from "./settingsForm";
import TextInput from "../../Resources/FormComponents/TextInput";
import Dropdown from "../../Resources/FormComponents/Dropdown";
import DateInput from "../../Resources/FormComponents/DateInput";
import FormLabel from "../../Resources/FormComponents/FormLabel";
import PlusButtonMain from "../../ModelAssets/PlusButtonMain";
import { useSnackbar } from "../../ComponentAssets/SnackbarContext";
import { updateInstitution } from "./helpers/updateInstitution";
import CustomEditFormButtons from "../../ModelAssets/CustomEditFormButtons";

const FormGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.up("md")]: {
    paddingRight: "20px",
  },
}));

const buildValidationSchema = () => {
  const validationShape = {
    name: Yup.string().required("Institution Name is required"),
    currencyCode: Yup.string().required("Currency Code is required"),
    defaultDateFormat: Yup.string().required("Date Format is required"),
  };

  return Yup.object().shape(validationShape);
};

const baseValidationSchema = buildValidationSchema();

const renderFormField = (field, formikValues, readOnly) => {
  const { dynamicHelperText, dynamicLabelMap, options, ...fieldProps } = field;

  let displayLabel = field.label;

  let computedHelperText = field.helperText;
  if (dynamicHelperText && field.name) {
    const currentValue = formikValues[field.name];
    if (currentValue && dynamicHelperText[currentValue]) {
      computedHelperText = dynamicHelperText[currentValue];
    }
  }

  switch (field.type) {
    case "text":
    case "number":
      return (
        <TextInput
          {...fieldProps}
          disabled={readOnly}
          label={displayLabel}
          helperText={computedHelperText}
        />
      );
    case "date":
      return (
        <DateInput
          {...fieldProps}
          disabled={readOnly}
          label={displayLabel}
          helperText={computedHelperText}
        />
      );
    case "select":
      return (
        <Dropdown
          {...fieldProps}
          options={options}
          disabled={readOnly}
          label={displayLabel}
          helperText={computedHelperText}
        />
      );
    case "label":
      return (
        <FormLabel
          label={displayLabel}
          sx={{
            mt: 3,
            mb: 2,
            color: "primary.main",
          }}
        />
      );
    default:
      return (
        <TextInput
          {...fieldProps}
          disabled={readOnly}
          label={displayLabel}
          helperText={computedHelperText}
        />
      );
  }
};

const Settings = () => {
  const { userDetails, setUserDetails } = useContext(UserContext);
  const theme = useTheme();
  const { showSnackbar } = useSnackbar();
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [initialValues, setInitialValues] = useState(null);

  // Check if user is admin
  const isAdmin =
    userDetails?.userPermissions?.includes("admin") ||
    userDetails?.userType?.toLowerCase() === "admin";

  useEffect(() => {
    if (userDetails?.institution) {
      const institution = userDetails.institution;
      setInitialValues({
        name: institution.name || "",
        regulatoryRegion: institution.regulatoryRegion || "",
        currencyCode: institution.currencyCode || "",
        defaultCurrencyFormat: institution.defaultCurrencyFormat || "",
        defaultDateFormat: institution.defaultDateFormat || "dd-mmm-yyyy",
        defaultLanguage: institution.defaultLanguage || "",
        institutionName: institution.name || "",
        institutionUsersId: userDetails.institutionUsersId || "",
        branchName: userDetails.branch?.name || "",
        branchUsersId: userDetails.branchUsersId || "",
      });
    }
  }, [userDetails?.institution, userDetails?.branch]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      // Validate institution ID exists
      if (!userDetails?.institutionUsersId) {
        throw new Error(
          "Institution ID not found. Please refresh the page and try again."
        );
      }

      // Prepare update data with only the required fields
      const updateData = {
        id: userDetails.institutionUsersId,
        name: values.name,
        regulatoryRegion: values.regulatoryRegion,
        currencyCode: values.currencyCode,
        defaultCurrencyFormat: values.defaultCurrencyFormat,
        defaultDateFormat: values.defaultDateFormat,
        defaultLanguage: values.defaultLanguage,
      };

      console.log("Submitting institution update with data:", updateData);

      const updatedInstitution = await updateInstitution(updateData);

      // Update the user context with the new institution data
      setUserDetails({
        ...userDetails,
        institution: updatedInstitution,
      });

      setSubmitSuccess("Settings updated successfully!");
      showSnackbar("Settings updated successfully!", "success");
      setIsEditMode(false);
    } catch (err) {
      console.error("Error updating settings:", err);
      const errorMsg =
        err.message || "Failed to update settings. Please try again.";
      setSubmitError(errorMsg);
      showSnackbar(errorMsg, "error");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  if (!initialValues) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2, mb: 4 }}>
      {!isEditMode && isAdmin && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <PlusButtonMain
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => setIsEditMode(true)}
            buttonText="EDIT"
          />
        </Box>
      )}

      {submitError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {submitError}
        </Alert>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={baseValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {(formik) => (
          <Form>
            {isEditMode && isAdmin && (
              <CustomEditFormButtons
                formik={formik}
                setEditMode={setIsEditMode}
                setSubmitError={setSubmitError}
                setSubmitSuccess={setSubmitSuccess}
              />
            )}
            <Grid container spacing={1}>
              {settingsForm
                .filter((field) => !field.adminOnly || isAdmin)
                .map((field, index) => (
                  <FormGrid key={index} size={{ xs: 12, md: field.span || 4 }}>
                    {field.type === "label" ? (
                      renderFormField(field, formik.values, isEditMode)
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {renderFormField(
                          field,
                          formik.values,
                          !isEditMode || field.readOnly
                        )}
                      </Box>
                    )}
                  </FormGrid>
                ))}
            </Grid>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default Settings;
