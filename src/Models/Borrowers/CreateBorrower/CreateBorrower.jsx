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
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Link from "@mui/material/Link";

import createBorrowerForm from "./createBorrowerForm";
import TextInput from "../../../Resources/FormComponents/TextInput";
import Dropdown from "../../../Resources/FormComponents/Dropdown";
import DateInput from "../../../Resources/FormComponents/DateInput";
import FormNotice from "../../../Resources/FormComponents/FormNotice";
import FormLabel from "../../../Resources/FormComponents/FormLabel";
import CreateFormButtons from "../../../ModelAssets/CreateFormButtons";
import CustomEditFormButtons from "../../../ModelAssets/CustomEditFormButtons";
// import CustomFields from "../../AdminScreens/CustomFields/CustomFields";
import { UserContext } from "../../../App";
import { EditClickedContext } from "../../../ModelAssets/CollectionsTemplate"; // <-- import context
import WorkingOverlay from "../../../ModelAssets/WorkingOverlay";

import { generateClient } from "aws-amplify/api";
import { listBranches } from "../../../graphql/queries";

// Styled FormGrid component for consistent layout
const FormGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.up("md")]: {
    paddingRight: "20px",
  },
}));

// Build initialValues dynamically from createBorrowerForm
const baseInitialValues = createBorrowerForm.reduce((acc, field) => {
  acc[field.name] = "";
  return acc;
}, {});

// Build validation schema dynamically using field validation properties
const validationShape = {};
createBorrowerForm.forEach((field) => {
  let validator = Yup.string().nullable();

  // Apply validation based on validationType
  if (field.validationType === "email") {
    validator = Yup.string()
      .nullable()
      .email(field.validationMessage || "Invalid email");
  } else if (field.validationType === "date") {
    validator = Yup.date().nullable();
  } else if (field.validationType === "string") {
    validator = Yup.string().nullable();

    // Apply pattern validation if specified
    if (field.validationPattern) {
      validator = validator.test(
        "pattern-validation",
        field.validationMessage,
        function (value) {
          if (!value || value.trim() === "") return true; // Allow empty values
          return field.validationPattern.test(value);
        },
      );
    }

    // Apply min/max length if specified
    if (field.minLength) {
      validator = validator.test("min-length", "Too short", function (value) {
        if (!value || value.trim() === "") return true; // Allow empty values
        return value.length >= field.minLength;
      });
    }
    if (field.maxLength) {
      validator = validator.test("max-length", "Too long", function (value) {
        if (!value || value.trim() === "") return true; // Allow empty values
        return value.length <= field.maxLength;
      });
    }
  }

  // Apply required validation (except for firstname and businessName which have custom logic)
  if (
    field.required &&
    field.name !== "firstname" &&
    field.name !== "businessName"
  ) {
    validator = validator.required(`${field.label} is required`);
  }

  validationShape[field.name] = validator;
});

// Add custom validation for firstname and businessName
validationShape.firstname = validationShape.firstname.test(
  "firstname-or-business-required",
  "Either First Name or Business Name is required",
  function (value) {
    const { businessName } = this.parent;
    return !!(value?.trim() || businessName?.trim());
  },
);

validationShape.businessName = validationShape.businessName.test(
  "business-or-firstname-required",
  "Either Business Name or First Name is required",
  function (value) {
    const { firstname } = this.parent;
    return !!(value?.trim() || firstname?.trim());
  },
);

const baseValidationSchema = Yup.object().shape(validationShape);

const renderFormField = (field) => {
  switch (field.type) {
    case "text":
    case "email":
      return <TextInput {...field} />;
    case "tel":
      // inputProps flows via {...field} and is merged into slotProps.input in TextInput
      return <TextInput {...field} />;
    case "select":
      return <Dropdown {...field} />;
    case "date":
      return <DateInput {...field} />;
    case "notice":
      return <FormNotice {...field} />;
    case "label":
      return <FormLabel {...field} />;
    default:
      return <TextInput {...field} />;
  }
};

const CreateBorrower = forwardRef(
  (
    {
      onClose,
      onCreateSuccess,
      onEditSuccess,
      onCreateBorrowerAPI,
      onUpdateBorrowerAPI,
      initialValues: propInitialValues,
      isEditMode = false,
      hideCancel,
      onCancel, // Add onCancel prop
      forceEditMode = false, // Add prop to force edit mode
      isCustomerPortal = false, // Customer portal mode
      prefilledEmail = null, // Pre-filled email for customer portal
    },
    ref,
  ) => {
    const [initialValues, setInitialValues] = useState(baseInitialValues);
    const [dynamicValidationSchema, setDynamicValidationSchema] =
      useState(baseValidationSchema);
    const navigate = useNavigate();
    const userContext = React.useContext(UserContext);
    const userDetails = userContext?.userDetails; // Make it optional
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState("");
    // For create mode, start in edit mode (editable). For edit mode, only enable if forceEditMode is true
    const [editMode, setEditMode] = useState(forceEditMode || !isEditMode);
    const editClickedContext = useContext(EditClickedContext); // <-- get context
    const [workingOverlayOpen, setWorkingOverlayOpen] = useState(false);
    const [workingOverlayMessage, setWorkingOverlayMessage] =
      useState("Working...");

    const [branches, setBranches] = useState([]);

    useEffect(() => {
      const fetchBranches = async () => {
        if (userDetails?.userType === "Admin" && userDetails?.institution?.id) {
          try {
            const client = generateClient();
            const branchData = await client.graphql({
              query: listBranches,
              variables: {
                limit: 1000,
                filter: {
                  institutionBranchesId: { eq: userDetails.institution.id },
                },
              },
            });
            const items = branchData.data.listBranches.items;
            setBranches(items.map((b) => ({ value: b.id, label: b.name })));
          } catch (e) {
            console.error("Error fetching branches", e);
          }
        }
      };
      if (userDetails) {
        fetchBranches();
      }
    }, [userDetails]);

    // Update validation schema based on customer portal mode
    useEffect(() => {
      if (isCustomerPortal) {
        // Make phoneNumber required in customer portal
        const customerPortalValidation = baseValidationSchema.shape({
          phoneNumber: Yup.string()
            .required("Phone number is required")
            .matches(/^[0-9]*$/, "Mobile must contain numbers only")
            .min(7, "Phone number must be at least 7 digits")
            .max(20, "Phone number cannot exceed 20 digits"),
        });
        setDynamicValidationSchema(customerPortalValidation);
      }
    }, [isCustomerPortal]);

    // Scroll to top on component mount
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    // Map database field names to form field names
    const mapDbFieldsToFormFields = (dbData) => {
      if (!dbData) return {};

      return {
        firstname: dbData.firstname || "",
        othername: dbData.othername || "",
        branchBorrowersId: dbData.branchBorrowersId || "",
        businessName: dbData.businessName || "",
        typeOfBusiness: dbData.typeOfBusiness || "",
        uniqueIdNumber: dbData.uniqueIdNumber || "",
        phoneNumber: dbData.phoneNumber || "",
        otherPhoneNumber: dbData.otherPhoneNumber || "",
        email: dbData.email || "",
        gender: dbData.gender || "",
        dateOfBirth: dbData.dateOfBirth || "",
        nationality: dbData.nationality || "",
        address: dbData.address || "",
        city: dbData.city || "",
        state: dbData.state || "",
        title: dbData.title || "",
        zipcode: dbData.zipcode || "",
        employmentStatus: dbData.employmentStatus || "",
        employerName: dbData.employerName || "",
        creditScore: dbData.creditScore || "",
        status: dbData.status || "",
        // Handle custom fields if they exist
        ...(dbData.customFieldsData
          ? (() => {
              try {
                const customFields = JSON.parse(dbData.customFieldsData);
                const mappedCustomFields = {};
                Object.keys(customFields).forEach((fieldId) => {
                  mappedCustomFields[`custom_${fieldId}`] =
                    customFields[fieldId].value || "";
                });
                return mappedCustomFields;
              } catch (e) {
                console.warn("Error parsing custom fields data:", e);
                return {};
              }
            })()
          : {}),
      };
    };

    // Use prop initialValues if provided, otherwise use default
    const formInitialValues = propInitialValues
      ? {
          ...baseInitialValues,
          ...mapDbFieldsToFormFields(propInitialValues),
        }
      : {
          ...initialValues,
          // Pre-fill email in customer portal mode
          ...(isCustomerPortal && prefilledEmail
            ? { email: prefilledEmail }
            : {}),
        };

    useImperativeHandle(ref, () => ({
      toggleEdit: () => {
        setEditMode((prev) => !prev);
      },
      getEditMode: () => editMode,
    }));

    // Update editMode when forceEditMode changes
    useEffect(() => {
      if (forceEditMode !== undefined) {
        setEditMode(forceEditMode);
      }
    }, [forceEditMode]);

    // Add effect to respond to editClicked from context (like CreateBranches)
    useEffect(() => {
      // Only allow edit mode changes from context if forceEditMode is true (popup)
      if (editClickedContext?.editClicked && forceEditMode && !editMode) {
        setEditMode(true);
      }
    }, [editClickedContext?.editClicked, forceEditMode, editMode]);

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
      setSubmitError("");
      setSubmitSuccess("");
      setSubmitting(true);
      setWorkingOverlayOpen(true);
      setWorkingOverlayMessage(
        isEditMode ? "Updating Borrower..." : "Saving Borrower...",
      );

      console.log("CreateBorrower Form Values:", values); // <-- Add this log

      const submissionValues = { ...values };
      if (userDetails?.userType !== "Admin") {
        submissionValues.branchBorrowersId =
          userDetails?.branchUsersId || userDetails?.branch?.id;
      }

      try {
        if (isEditMode && propInitialValues && onUpdateBorrowerAPI) {
          // Update existing borrower using parent-provided API function
          const result = await onUpdateBorrowerAPI(
            submissionValues,
            propInitialValues,
          );
          setSubmitSuccess("Borrower updated!");
          setEditMode(false);
          setTimeout(() => setSubmitSuccess(""), 2000);
          if (onEditSuccess) {
            onEditSuccess(result);
          }
        } else if (!isEditMode && onCreateBorrowerAPI) {
          // Create new borrower using parent-provided API function
          const result = await onCreateBorrowerAPI(submissionValues);
          setSubmitSuccess("Borrower created!");
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
        console.error("Error creating/updating borrower:", err);
        setSubmitError(
          err.message ||
            `Failed to ${
              isEditMode ? "update" : "create"
            } borrower. Please try again.`,
        );
      } finally {
        setSubmitting(false);
        setWorkingOverlayOpen(false);
      }
    };

    // Handle custom fields loading
    const handleCustomFieldsLoaded = (customFieldsInitialValues) => {
      const newInitialValues = {
        ...baseInitialValues,
        ...customFieldsInitialValues,
      };
      setInitialValues(newInitialValues);
    };

    // Handle validation schema changes from custom fields
    const handleValidationSchemaChange = (customFieldsValidation) => {
      const newValidationSchema = baseValidationSchema.shape(
        customFieldsValidation,
      );
      setDynamicValidationSchema(newValidationSchema);
    };

    return (
      <>
        <Formik
          initialValues={formInitialValues}
          validationSchema={dynamicValidationSchema}
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
                    onCancel={onCancel}
                  />
                ) : null}
                <Grid container spacing={1}>
                  {createBorrowerForm.map((field, index) => {
                    if (field.onlyVisibleInEdit && !isEditMode) {
                      return null;
                    }

                    // Branch Logic
                    if (
                      field.name === "branchBorrowersId" &&
                      userDetails?.userType !== "Admin"
                    ) {
                      return null;
                    }

                    // Skip "Files & Custom Fields" notice in customer portal
                    if (isCustomerPortal && field.type === "notice") {
                      return <React.Fragment key={`${field.type}-${index}`} />;
                    }

                    // Skip creditScore field in customer portal
                    if (isCustomerPortal && field.name === "creditScore") {
                      return <React.Fragment key={field.name} />;
                    }

                    // Disable email field if pre-filled in customer portal
                    const fieldProps = { ...field };

                    if (field.name === "branchBorrowersId") {
                      fieldProps.options = branches;
                    }

                    if (
                      isCustomerPortal &&
                      field.name === "email" &&
                      prefilledEmail
                    ) {
                      fieldProps.disabled = true;
                      fieldProps.helperText = "Email address from your account";
                    }

                    return (
                      <FormGrid
                        size={{ xs: 12, md: field.span }}
                        key={field.name || `${field.type}-${index}`}
                      >
                        {renderFormField({
                          ...fieldProps,
                          editing: editMode,
                          isEditMode: isEditMode,
                        })}
                      </FormGrid>
                    );
                  })}

                  {/* Custom Fields Component */}
                  <Box sx={{ display: "flex" }}>
                    {/* <CustomFields
                      formKey="CreateBorrowerForm"
                      formik={formik}
                      onFieldsLoaded={handleCustomFieldsLoaded}
                      onValidationSchemaChange={handleValidationSchemaChange}
                    /> */}
                  </Box>
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
                        submitLabel={
                          isCustomerPortal ? "Save My Profile" : "Save"
                        }
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

CreateBorrower.displayName = "CreateBorrower";

export default CreateBorrower;

// All references to phone fields use phoneNumber and otherPhoneNumber.
// No further changes needed for mobile/altPhone.
// No further changes needed for mobile/altPhone.
