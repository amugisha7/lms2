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
import MultipleDropDownSearchable from "../../../Resources/FormComponents/MultipleDropDownSearchable";
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

// Add status and branches fields
baseInitialValues.status = "active";
baseInitialValues.branches = [];

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
validationShape.branches = Yup.array().nullable();

const baseValidationSchema = Yup.object().shape(validationShape);

const renderFormField = (field, formik) => {
  switch (field.type) {
    case "textarea":
      return <TextArea {...field} />;
    case "radio":
      return <RadioGroup {...field} />;
    case "select":
      return <Dropdown {...field} />;
    case "multipleDropDownSearchable":
      return <MultipleDropDownSearchable {...field} />;
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
    const [branches, setBranches] = useState([]);
    const [branchesLoading, setBranchesLoading] = useState(false);
    const client = React.useMemo(() => generateClient(), []);

    // Fetch branches - for admin: all active branches; for non-admin in edit mode: need branch names for display
    useEffect(() => {
      const fetchBranches = async () => {
        if (!userDetails?.institutionUsersId) {
          return;
        }

        // Only admins can select branches, but we need branch names for display in all cases
        const isAdmin = userDetails?.userType === "Admin";

        // For non-admins in edit mode or view mode, we need to fetch branches to display their names
        // For admins, we always fetch all active branches for selection
        if (!isAdmin && !isEditMode) {
          // Non-admin creating a new account - no need to fetch branches
          return;
        }

        // If we have initial branch data from the account, use it first to avoid flicker
        if (propInitialValues?.branches?.items) {
          const existingBranches = propInitialValues.branches.items
            .filter((item) => item.branch)
            .map((item) => ({
              value: item.branch.id,
              label: item.branch.name,
            }));
          setBranches(existingBranches);
        }

        setBranchesLoading(true);
        try {
          let allBranches = [];
          let nextToken = null;

          while (true) {
            const result = await client.graphql({
              query: `
                query ListBranches($institutionId: ID!, $nextToken: String) {
                  listBranches(
                    filter: { institutionBranchesId: { eq: $institutionId } }
                    limit: 100
                    nextToken: $nextToken
                  ) {
                    items {
                      id
                      name
                      status
                    }
                    nextToken
                  }
                }
              `,
              variables: {
                institutionId: userDetails.institutionUsersId,
                nextToken,
              },
            });

            const listResult = result?.data?.listBranches || {};
            const batchItems = Array.isArray(listResult.items)
              ? listResult.items
              : [];
            allBranches.push(...batchItems);

            nextToken = listResult.nextToken;
            if (!nextToken) break;
          }

          // For admin: filter active branches; for non-admin: include all to show names
          const branchOptions = (
            isAdmin
              ? allBranches.filter((b) => b.status === "active")
              : allBranches
          ).map((b) => ({ value: b.id, label: b.name }));

          setBranches(branchOptions);
        } catch (err) {
        } finally {
          setBranchesLoading(false);
        }
      };

      fetchBranches();
    }, [userDetails, client, isEditMode, propInitialValues]);

    // Use the form fields directly
    const accountForm = createAccountForm;

    // Map database field names to form field names
    const mapDbFieldsToFormFields = (dbData) => {
      if (!dbData) {
        return {};
      }

      // Extract branch IDs from the branches relationship
      const branchIds =
        dbData.branches?.items
          ?.map((item) => item.branch?.id)
          .filter(Boolean) || [];

      const mappedData = {
        name: dbData.name || "",
        openingBalance: dbData.openingBalance || 0,
        description: dbData.description || "",
        status: dbData.status || "active",
        branches: branchIds,
      };

      return mappedData;
    };

    // Use prop initialValues if provided, otherwise use default
    let formInitialValues = propInitialValues
      ? {
          ...baseInitialValues,
          ...mapDbFieldsToFormFields(propInitialValues),
        }
      : baseInitialValues;

    // If user is not admin and not editing, automatically set their branch
    if (
      !isEditMode &&
      userDetails?.userType !== "Admin" &&
      userDetails?.branchUsersId
    ) {
      formInitialValues.branches = [userDetails.branchUsersId];
    }

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
          console.log("Account update result:", result);
          setSubmitSuccess("Account updated!");
          setEditMode(false);
          setTimeout(() => setSubmitSuccess(""), 2000);
          if (onEditSuccess) {
            onEditSuccess(result);
          }
        } else if (!isEditMode && onCreateAccountAPI) {
          // Create new account using parent-provided API function
          const result = await onCreateAccountAPI(values);
          console.log("Account creation result:", result);
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
                      if (field.showOnlyInEditMode && !isEditMode) return false;

                      // For branches field: show to admin always, show to non-admin only in view mode (isEditMode && !editMode)
                      if (field.showOnlyForAdmin) {
                        const isAdmin = userDetails?.userType === "Admin";
                        // Admin can always see it
                        if (isAdmin) return true;
                        // Non-admin can see it only when viewing account details (isEditMode context, but editMode=false means viewing)
                        if (isEditMode && !editMode) return true;
                        // Otherwise hide it (e.g., when creating new account as non-admin)
                        return false;
                      }

                      return true;
                    })
                    .map((field) => {
                      // Add branches options to the branches field
                      const fieldProps = { ...field, editing: editMode };
                      if (field.name === "branches") {
                        fieldProps.options = branches;
                        // Non-admins should always have this field as readOnly
                        if (userDetails?.userType !== "Admin") {
                          fieldProps.readOnly = true;
                        }
                      }

                      return (
                        <FormGrid
                          item
                          size={{ xs: 12, md: field.span }}
                          key={field.name}
                        >
                          {renderFormField(fieldProps, formik)}
                        </FormGrid>
                      );
                    })}

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
