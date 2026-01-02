import React, { useContext, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  styled,
  useTheme,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { UserContext } from "../../App";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "../../Resources/FormComponents/TextInput";
import DateInput from "../../Resources/FormComponents/DateInput";
import FormLabel from "../../Resources/FormComponents/FormLabel";
import { accountInfoForm } from "./accountInfoForm";
import PlusButtonMain from "../../ModelAssets/PlusButtonMain";
import { useSnackbar } from "../../ComponentAssets/SnackbarContext";
import { updateUser } from "./helpers/updateUser";
import CustomEditFormButtons from "../../ModelAssets/CustomEditFormButtons";

const FormGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.up("md")]: {
    paddingRight: "20px",
  },
}));

// Validation schema for editable fields
const validationSchema = Yup.object().shape({
  firstName: Yup.string(),
  lastName: Yup.string(),
  phoneNumber1: Yup.string(),
  dateOfBirth: Yup.date(),
  nationalID: Yup.string(),
});

const AccountInfo = () => {
  const { user, userDetails, setUserDetails } = useContext(UserContext);
  const { showSnackbar } = useSnackbar();
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const initialValues = {
    email: user?.signInDetails?.loginId || "",
    userType: userDetails?.userType || "",
    firstName: userDetails?.firstName || "",
    lastName: userDetails?.lastName || "",
    phoneNumber1: userDetails?.phoneNumber1 || "",
    dateOfBirth: userDetails?.dateOfBirth || "",
    nationalID: userDetails?.nationalID || "",
    institutionName: userDetails?.institution?.name || "",
    institutionUsersId: userDetails?.institutionUsersId || "",
    branchName: userDetails?.branch?.name || "",
    branchUsersId: userDetails?.branchUsersId || "",
    id: userDetails?.id || "",
    status: userDetails?.status || "",
    createdAt: userDetails?.createdAt
      ? new Date(userDetails.createdAt).toLocaleDateString()
      : "",
    updatedAt: userDetails?.updatedAt
      ? new Date(userDetails.updatedAt).toLocaleDateString()
      : "",
    subscriptionTier: userDetails?.institution?.subscriptionTier || "",
    subscriptionStatus: userDetails?.institution?.subscriptionStatus || "",
    trialEndDate: userDetails?.institution?.trialEndDate
      ? new Date(userDetails.institution.trialEndDate).toLocaleDateString()
      : "",
    nextBillingDate: userDetails?.institution?.nextBillingDate
      ? new Date(userDetails.institution.nextBillingDate).toLocaleDateString()
      : "",
    saccoFeaturesEnabled:
      userDetails?.institution?.saccoFeaturesEnabled == null
        ? ""
        : userDetails.institution.saccoFeaturesEnabled
        ? "Yes"
        : "No",
    staffManagementEnabled:
      userDetails?.institution?.staffManagementEnabled == null
        ? ""
        : userDetails.institution.staffManagementEnabled
        ? "Yes"
        : "No",
    payrollEnabled:
      userDetails?.institution?.payrollEnabled == null
        ? ""
        : userDetails.institution.payrollEnabled
        ? "Yes"
        : "No",
    collectionsModuleEnabled:
      userDetails?.institution?.collectionsModuleEnabled == null
        ? ""
        : userDetails.institution.collectionsModuleEnabled
        ? "Yes"
        : "No",
    customWorkflowsEnabled:
      userDetails?.institution?.customWorkflowsEnabled == null
        ? ""
        : userDetails.institution.customWorkflowsEnabled
        ? "Yes"
        : "No",
    advancedReportingEnabled:
      userDetails?.institution?.advancedReportingEnabled == null
        ? ""
        : userDetails.institution.advancedReportingEnabled
        ? "Yes"
        : "No",
    maxUsers: userDetails?.institution?.maxUsers || "",
    maxBranches: userDetails?.institution?.maxBranches || "",
    maxStaffPerBranch: userDetails?.institution?.maxStaffPerBranch || "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      // Validate user ID exists
      if (!userDetails?.id) {
        throw new Error(
          "User ID not found. Please refresh the page and try again."
        );
      }

      // Prepare update data with only the editable fields
      const updateData = {
        id: userDetails.id,
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber1: values.phoneNumber1,
        dateOfBirth: values.dateOfBirth,
        nationalID: values.nationalID,
      };

      console.log("Submitting user update with data:", updateData);

      const updatedUser = await updateUser(updateData);

      // Update the user context with only the submitted fields
      setUserDetails({
        ...userDetails,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phoneNumber1: updatedUser.phoneNumber1,
        dateOfBirth: updatedUser.dateOfBirth,
        nationalID: updatedUser.nationalID,
      });

      setSubmitSuccess("Account information updated successfully!");
      showSnackbar("Account information updated successfully!", "success");
      setIsEditMode(false);
    } catch (err) {
      console.error("Error updating account info:", err);
      const errorMsg =
        err.message ||
        "Failed to update account information. Please try again.";
      setSubmitError(errorMsg);
      showSnackbar(errorMsg, "error");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        pb: 4,
        pt: 2,
      }}
    >
      {!isEditMode && (
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
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {(formik) => (
          <Form>
            {isEditMode && (
              <CustomEditFormButtons
                formik={formik}
                setEditMode={setIsEditMode}
                setSubmitError={setSubmitError}
                setSubmitSuccess={setSubmitSuccess}
              />
            )}
            <Grid container spacing={1}>
              {accountInfoForm.map((field, index) => (
                <FormGrid key={index} size={{ xs: 12, md: field.span || 4 }}>
                  {field.type === "label" ? (
                    <FormLabel
                      label={field.label}
                      sx={{
                        mt: 3,
                        mb: 2,
                        color: "primary.main",
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {field.type === "date" ? (
                        <DateInput
                          {...field}
                          editing={isEditMode && !field.disabled}
                        />
                      ) : (
                        <TextInput
                          {...field}
                          disabled={!isEditMode || field.disabled}
                        />
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

export default AccountInfo;
