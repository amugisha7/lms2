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
import { generateClient } from "aws-amplify/api";
import WorkingOverlay from "../../../ModelAssets/WorkingOverlay";

import createAccountForm from "./createAccountForm";
import TextInput from "../../../Resources/FormComponents/TextInput";
import TextArea from "../../../Resources/FormComponents/TextArea";
import RadioGroup from "../../../Resources/FormComponents/RadioGroup";
import Dropdown from "../../../Resources/FormComponents/Dropdown";
import CreateFormButtons from "../../../ModelAssets/CreateFormButtons";
import CustomEditFormButtons from "../../../ModelAssets/CustomEditFormButtons";
import { UserContext } from "../../../App";
import { EditClickedContext } from "../../../ModelAssets/CollectionsTemplate";

const FormGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.up("md")]: {
    paddingRight: "20px",
  },
}));

// Build initialValues dynamically from createAccountForm
const baseInitialValues = createAccountForm.reduce((acc, field) => {
  acc[field.name] = field.defaultValue !== undefined ? field.defaultValue : "";
  return acc;
}, {});

// Add status field
baseInitialValues.status = "active";

// Build validation schema dynamically
const validationShape = {};
createAccountForm.forEach((field) => {
  let validator;
  if (field.validationType === "string") {
    validator = Yup.string().nullable();
    if (field.validationPattern) {
      validator = validator.test(
        "pattern-validation",
        field.validationMessage,
        function (value) {
          if (!value || value.trim() === "") return true;
          return field.validationPattern.test(value);
        },
      );
    }
    if (field.maxLength) {
      validator = validator.test(
        "max-length",
        `${field.label} too long`,
        function (value) {
          if (!value || value.trim() === "") return true;
          return value.length <= field.maxLength;
        },
      );
    }
  } else if (field.validationType === "number") {
    validator = Yup.number()
      .nullable()
      .min(0, `${field.label} cannot be negative`);
    if (field.validationPattern) {
      validator = validator.test(
        "pattern-validation",
        field.validationMessage,
        function (value) {
          if (!value || value.trim() === "") return true;
          return field.validationPattern.test(value);
        },
      );
    }
  }
  if (field.required) {
    validator = validator.required(`${field.label} is required`);
  }
  validationShape[field.name] = validator;
});

// Add status validation
validationShape.status = Yup.string().nullable();

const baseValidationSchema = Yup.object().shape(validationShape);

const renderFormField = (field, formik) => {
  switch (field.type) {
    case "textarea":
      return <TextArea {...field} />;
    case "radio":
      return <RadioGroup {...field} />;
    case "select":
      return <Dropdown {...field} />;
    case "text":
    default:
      return <TextInput {...field} />;
  }
};

const CreateAccountForm = forwardRef(
  (
    {
      onClose,
      onCreateSuccess,
      onEditSuccess,
      onCreateAccountAPI,
      onUpdateAccountAPI,
      initialValues: propInitialValues,
      isEditMode = false,
      hideCancel,
    },
    ref,
  ) => {
    const { userDetails } = React.useContext(UserContext);
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState("");
    const [editMode, setEditMode] = useState(!isEditMode);
    const [workingOverlayOpen, setWorkingOverlayOpen] = useState(false);
    const [workingOverlayMessage, setWorkingOverlayMessage] =
      useState("Working...");
    const editClickedContext = useContext(EditClickedContext);

    // Use the form fields directly
    const accountForm = createAccountForm;

    // Map database field names to form field names
    const mapDbFieldsToFormFields = (dbData) => {
      if (!dbData) return {};

      return {
        name: dbData.name || "",
        openingBalance: dbData.openingBalance || 0,
        description: dbData.description || "",
        status: dbData.status || "active",
      };
    };

    // Use prop initialValues if provided, otherwise use default
    let formInitialValues = propInitialValues
      ? {
          ...baseInitialValues,
          ...mapDbFieldsToFormFields(propInitialValues),
        }
      : baseInitialValues;

    useImperativeHandle(ref, () => ({
      toggleEdit: () => {
        setEditMode((prev) => !prev);
      },
      getEditMode: () => editMode,
    }));

    // Add effect to respond to editClicked from context
    useEffect(() => {
      if (editClickedContext?.editClicked && isEditMode && !editMode) {
        setEditMode(true);
      }
    }, [editClickedContext?.editClicked, isEditMode, editMode]);

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
      setSubmitError("");
      setSubmitSuccess("");
      setSubmitting(true);
      setWorkingOverlayOpen(true);
      setWorkingOverlayMessage(
        isEditMode ? "Updating Account..." : "Saving Account...",
      );

      // Ensure opening balance defaults to 0 if not provided
      values.openingBalance = values.openingBalance || 0;

      try {
        if (isEditMode && propInitialValues && onUpdateAccountAPI) {
          // Update existing account using parent-provided API function
          const result = await onUpdateAccountAPI(values, propInitialValues);
          setSubmitSuccess("Account updated!");
          setEditMode(false);
          setTimeout(() => setSubmitSuccess(""), 2000);
          if (onEditSuccess) {
            onEditSuccess(result);
          }
        } else if (!isEditMode && onCreateAccountAPI) {
          // Create new account using parent-provided API function
          const result = await onCreateAccountAPI(values);
          setSubmitSuccess("Account created!");
          resetForm();
          if (onCreateSuccess) {
            onCreateSuccess(result);
          }
        } else {
          setSubmitError(
            "API handler function not available. Please try again.",
          );
        }
      } catch (err) {
        console.error("Error creating/updating account:", err);
        setSubmitError(
          err.message ||
            `Failed to ${
              isEditMode ? "update" : "create"
            } account. Please try again.`,
        );
      } finally {
        setSubmitting(false);
        setWorkingOverlayOpen(false);
      }
    };

    return (
      <>
        <Formik
          initialValues={formInitialValues}
          validationSchema={baseValidationSchema}
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
                  {accountForm
                    .filter((field) => {
                      // Show field if it doesn't have showOnlyInEditMode OR if we're in edit mode
                      return !field.showOnlyInEditMode || isEditMode;
                    })
                    .map((field) => (
                      <FormGrid
                        item
                        size={{ xs: 12, md: field.span }}
                        key={field.name}
                      >
                        {renderFormField(
                          { ...field, editing: editMode },
                          formik,
                        )}
                      </FormGrid>
                    ))}

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
        <WorkingOverlay
          open={workingOverlayOpen}
          message={workingOverlayMessage}
        />
      </>
    );
  },
);

CreateAccountForm.displayName = "CreateAccountForm";

export default CreateAccountForm;
