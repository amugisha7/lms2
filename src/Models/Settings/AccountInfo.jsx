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
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  phoneNumber1: Yup.string(),
  dateOfBirth: Yup.string(),
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
    email: user?.signInDetails?.loginId || "N/A",
    userType: userDetails?.userType || "N/A",
    firstName: userDetails?.firstName || "N/A",
    lastName: userDetails?.lastName || "N/A",
    phoneNumber1: userDetails?.phoneNumber1 || "N/A",
    dateOfBirth: userDetails?.dateOfBirth || "N/A",
    nationalID: userDetails?.nationalID || "N/A",
    institutionName: userDetails?.institution?.name || "N/A",
    institutionUsersId: userDetails?.institutionUsersId || "N/A",
    branchName: userDetails?.branch?.name || "N/A",
    branchUsersId: userDetails?.branchUsersId || "N/A",
    id: userDetails?.id || "N/A",
    status: userDetails?.status || "N/A",
    createdAt: userDetails?.createdAt
      ? new Date(userDetails.createdAt).toLocaleDateString()
      : "N/A",
    updatedAt: userDetails?.updatedAt
      ? new Date(userDetails.updatedAt).toLocaleDateString()
      : "N/A",
    subscriptionTier: userDetails?.institution?.subscriptionTier || "N/A",
    subscriptionStatus: userDetails?.institution?.subscriptionStatus || "N/A",
    trialEndDate: userDetails?.institution?.trialEndDate
      ? new Date(userDetails.institution.trialEndDate).toLocaleDateString()
      : "N/A",
    nextBillingDate: userDetails?.institution?.nextBillingDate
      ? new Date(userDetails.institution.nextBillingDate).toLocaleDateString()
      : "N/A",
    saccoFeaturesEnabled: userDetails?.institution?.saccoFeaturesEnabled
      ? "Yes"
      : "No",
    staffManagementEnabled: userDetails?.institution?.staffManagementEnabled
      ? "Yes"
      : "No",
    payrollEnabled: userDetails?.institution?.payrollEnabled ? "Yes" : "No",
    collectionsModuleEnabled: userDetails?.institution?.collectionsModuleEnabled
      ? "Yes"
      : "No",
    customWorkflowsEnabled: userDetails?.institution?.customWorkflowsEnabled
      ? "Yes"
      : "No",
    advancedReportingEnabled: userDetails?.institution?.advancedReportingEnabled
      ? "Yes"
      : "No",
    maxUsers: userDetails?.institution?.maxUsers || "N/A",
    maxBranches: userDetails?.institution?.maxBranches || "N/A",
    maxStaffPerBranch: userDetails?.institution?.maxStaffPerBranch || "N/A",
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

      // Update the user context with the new user data
      setUserDetails({
        ...userDetails,
        ...updatedUser,
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
        mb: 4,
        mt: 2,
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
                      <TextInput
                        {...field}
                        disabled={!isEditMode || field.disabled}
                      />
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
