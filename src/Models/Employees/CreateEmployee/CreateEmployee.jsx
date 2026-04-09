import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Box, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { generateClient } from "aws-amplify/api";

import { UserContext } from "../../../App";
import employeeForm from "../employeeForm";
import TextInput from "../../../Resources/FormComponents/TextInput";
import Dropdown from "../../../Resources/FormComponents/Dropdown";
import DateInput from "../../../Resources/FormComponents/DateInput";
import FormLabel from "../../../Resources/FormComponents/FormLabel";
import FormNotice from "../../../Resources/FormComponents/FormNotice";
import CreateFormButtons from "../../../ModelAssets/CreateFormButtons";
import CustomEditFormButtons from "../../../ModelAssets/CustomEditFormButtons";
import WorkingOverlay from "../../../ModelAssets/WorkingOverlay";
import { listBranches } from "../../../graphql/queries";

const FormGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.up("md")]: {
    paddingRight: "20px",
  },
}));

const baseInitialValues = employeeForm.reduce((acc, field) => {
  if (field.name) {
    acc[field.name] = "";
  }
  return acc;
}, {});

const validationShape = {};
employeeForm.forEach((field) => {
  if (!field.name) return;

  let validator;

  if (field.validationType === "email") {
    validator = Yup.string()
      .nullable()
      .email(field.validationMessage || "Invalid email address");
  } else if (field.validationType === "number") {
    validator = Yup.number().nullable().typeError("Must be a valid number");
  } else if (field.validationType === "date") {
    validator = Yup.date().nullable();
  } else {
    validator = Yup.string().nullable();
    if (field.validationPattern) {
      validator = validator.matches(
        field.validationPattern,
        field.validationMessage || "Invalid value",
      );
    }
    if (field.minLength) {
      validator = validator.min(
        field.minLength,
        `Must be at least ${field.minLength} characters`,
      );
    }
    if (field.maxLength) {
      validator = validator.max(
        field.maxLength,
        `Cannot exceed ${field.maxLength} characters`,
      );
    }
  }

  if (field.required) {
    validator = validator.required(`${field.label} is required`);
  }

  validationShape[field.name] = validator;
});

const validationSchema = Yup.object().shape(validationShape);

const renderField = (field) => {
  switch (field.type) {
    case "select":
      return <Dropdown {...field} />;
    case "date":
      return <DateInput {...field} />;
    case "label":
      return <FormLabel {...field} />;
    case "notice":
      return <FormNotice {...field} />;
    default:
      return <TextInput {...field} />;
  }
};

const CreateEmployee = forwardRef(
  (
    {
      onClose,
      onCreateSuccess,
      onEditSuccess,
      onCreateEmployeeAPI,
      onUpdateEmployeeAPI,
      initialValues: propInitialValues,
      isEditMode = false,
      forceEditMode = false,
      hideCancel = false,
      onCancel,
    },
    ref,
  ) => {
    const { userDetails } = useContext(UserContext);
    const [editMode, setEditMode] = useState(forceEditMode || !isEditMode);
    const [branches, setBranches] = useState([]);
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState("");
    const [workingOverlayOpen, setWorkingOverlayOpen] = useState(false);
    const [workingOverlayMessage, setWorkingOverlayMessage] =
      useState("Working...");

    useImperativeHandle(ref, () => ({
      toggleEdit: () => setEditMode((previous) => !previous),
      getEditMode: () => editMode,
    }));

    useEffect(() => {
      setEditMode(forceEditMode || !isEditMode);
    }, [forceEditMode, isEditMode]);

    useEffect(() => {
      let cancelled = false;

      const fetchBranches = async () => {
        if (String(userDetails?.userType || "").toLowerCase() !== "admin") {
          return;
        }

        const institutionId =
          userDetails?.institutionUsersId || userDetails?.institution?.id;
        if (!institutionId) {
          return;
        }

        try {
          const client = generateClient();
          const response = await client.graphql({
            query: listBranches,
            variables: {
              filter: {
                institutionBranchesId: { eq: institutionId },
              },
              limit: 100,
            },
          });

          if (cancelled) {
            return;
          }

          const items = response?.data?.listBranches?.items || [];
          setBranches(
            items.map((branch) => ({ value: branch.id, label: branch.name })),
          );
        } catch (error) {
          console.error("Error fetching branches for employee form:", error);
        }
      };

      fetchBranches();

      return () => {
        cancelled = true;
      };
    }, [userDetails]);

    const formInitialValues = {
      ...baseInitialValues,
      ...propInitialValues,
      branchEmployeesId:
        propInitialValues?.branchEmployeesId ||
        userDetails?.branchUsersId ||
        userDetails?.branch?.id ||
        "",
      status: propInitialValues?.status || "active",
      employmentStatus: propInitialValues?.employmentStatus || "active",
    };

    const normalizedUserType = String(
      userDetails?.userType || "",
    ).toLowerCase();
    const enrichedFields = employeeForm
      .filter((field) => {
        if (field.adminOnly && normalizedUserType !== "admin") {
          return false;
        }
        if (field.onlyVisibleInEdit && !isEditMode) {
          return false;
        }
        return true;
      })
      .map((field) => {
        if (field.name === "branchEmployeesId") {
          return {
            ...field,
            options: branches,
            helperText:
              normalizedUserType === "admin"
                ? "Select the branch that this employee belongs to."
                : undefined,
          };
        }

        return field;
      });

    const handleSubmit = async (values, { setSubmitting }) => {
      setSubmitError("");
      setSubmitSuccess("");
      setSubmitting(true);
      setWorkingOverlayOpen(true);
      setWorkingOverlayMessage(
        isEditMode ? "Updating Employee..." : "Creating Employee...",
      );

      const payload = {
        ...values,
        branchEmployeesId:
          normalizedUserType === "admin"
            ? values.branchEmployeesId
            : userDetails?.branchUsersId || userDetails?.branch?.id || null,
      };

      try {
        if (isEditMode && onUpdateEmployeeAPI && propInitialValues?.id) {
          const updated = await onUpdateEmployeeAPI({
            id: propInitialValues.id,
            ...payload,
          });
          setSubmitSuccess("Employee updated successfully.");
          setEditMode(false);
          onEditSuccess?.(updated);
        } else if (!isEditMode && onCreateEmployeeAPI) {
          const created = await onCreateEmployeeAPI(payload);
          setSubmitSuccess("Employee created successfully.");
          onCreateSuccess?.(created);
        }
      } catch (error) {
        console.error("Error saving employee:", error);
        setSubmitError(error?.message || "Failed to save employee.");
      } finally {
        setSubmitting(false);
        setWorkingOverlayOpen(false);
      }
    };

    return (
      <>
        <Formik
          initialValues={formInitialValues}
          validationSchema={validationSchema}
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
                {isEditMode && editMode ? (
                  <CustomEditFormButtons
                    formik={formik}
                    setEditMode={setEditMode}
                    setSubmitError={setSubmitError}
                    setSubmitSuccess={setSubmitSuccess}
                    onCancel={onCancel || onClose}
                  />
                ) : null}

                <Grid container spacing={2}>
                  {enrichedFields.map((field) => (
                    <FormGrid
                      size={{ xs: 12, md: field.span || 12 }}
                      key={field.name || `${field.type}-${field.label}`}
                    >
                      {renderField({
                        ...field,
                        editing: editMode,
                        disabled:
                          field.name === "branchEmployeesId" &&
                          normalizedUserType !== "admin",
                      })}
                    </FormGrid>
                  ))}
                </Grid>

                {submitError ? (
                  <Typography color="error" sx={{ mt: 2 }}>
                    {submitError}
                  </Typography>
                ) : null}
                {submitSuccess ? (
                  <Typography color="success.main" sx={{ mt: 2 }}>
                    {submitSuccess}
                  </Typography>
                ) : null}

                {isEditMode && !editMode ? (
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}
                  >
                    <Typography variant="body2" sx={{ opacity: 0.75 }}>
                      Use the edit action on this page to update employee
                      details.
                    </Typography>
                  </Box>
                ) : null}

                {!isEditMode ? (
                  <CreateFormButtons
                    formik={formik}
                    setEditMode={setEditMode}
                    setSubmitError={setSubmitError}
                    setSubmitSuccess={setSubmitSuccess}
                    onClose={onClose}
                    hideCancel={hideCancel}
                    submitLabel="SAVE EMPLOYEE"
                  />
                ) : null}
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

export default CreateEmployee;
