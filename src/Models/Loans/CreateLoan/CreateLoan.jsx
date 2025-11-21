import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useContext,
} from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import { generateClient } from "aws-amplify/api";
import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";

import createLoanForm from "./createLoanForm";
import TextInput from "../../../Resources/FormComponents/TextInput";
import Dropdown from "../../../Resources/FormComponents/Dropdown";
import DropDownSearchable from "../../../Resources/FormComponents/DropDownSearchable";
import OrderedList from "../../../Resources/FormComponents/OrderedList";
import CreateFormButtons from "../../../ModelAssets/CreateFormButtons";
import { UserContext } from "../../../App";
import { createLoan, buildLoanInput } from "./createLoanHelpers";
import FormLabel from "../../../Resources/FormComponents/FormLabel";
import RadioGroup from "../../../Resources/FormComponents/RadioGroup";

const FormGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.up("md")]: {
    paddingRight: "20px",
  },
}));

const baseInitialValues = createLoanForm.reduce((acc, field) => {
  // Skip label fields as they don't need values
  if (field.type === "label") return acc;
  acc[field.name] = field.defaultValue || "";
  return acc;
}, {});

const buildValidationSchema = () => {
  const validationShape = {
    borrower: Yup.string().required("Borrower is required"),
    principalAmount: Yup.number()
      .required("Principal Amount is required")
      .min(0, "Principal Amount must be at least 0"),
    interestRate: Yup.number()
      .required("Interest Rate is required")
      .min(0, "Interest Rate must be at least 0")
      .max(100, "Interest Rate cannot exceed 100%"),
    termDuration: Yup.number()
      .required("Term Duration is required")
      .min(1, "Term Duration must be at least 1"),
    durationPeriod: Yup.string()
      .oneOf(["days", "weeks", "months", "years"])
      .required("Duration Period is required"),
    disbursementDate: Yup.string().required("Disbursement Date is required"),
    maturityDate: Yup.string().required("Maturity Date is required"),
    repaymentFrequency: Yup.string()
      .oneOf([
        "daily",
        "weekly",
        "biweekly",
        "monthly",
        "bimonthly",
        "quarterly",
        "every_4_months",
        "semi_annual",
        "every_9_months",
        "yearly",
        "lump_sum",
      ])
      .required("Repayment Frequency is required"),
    status: Yup.string()
      .oneOf(["Active", "Pending", "Approved", "Rejected", "Closed"])
      .required("Status is required"),
    totalAmountDue: Yup.number()
      .min(0, "Total Amount Due must be at least 0")
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      ),
  };

  return Yup.object().shape(validationShape);
};

const baseValidationSchema = buildValidationSchema();

const renderFormField = (field, formikValues) => {
  switch (field.type) {
    case "text":
    case "number":
      return <TextInput {...field} />;
    case "select":
      // Use DropDownSearchable for borrower field
      if (field.name === "borrower") {
        return <DropDownSearchable {...field} />;
      }
      return <Dropdown {...field} />;
    case "orderedList":
      return (
        <OrderedList
          label={field.label}
          items={field.formik.values[field.name] || field.defaultValue || []}
          onChange={(newOrder) =>
            field.formik.setFieldValue(field.name, newOrder)
          }
          helperText={field.helperText}
          required={field.required}
          editing={field.editing}
        />
      );
    case "label":
      return <FormLabel label={field.label} />;
    case "radio":
      return <RadioGroup {...field} />;
    default:
      return <TextInput {...field} />;
  }
};

const CreateLoan = forwardRef(
  (
    {
      onClose,
      onCreateSuccess,
      onCreateLoanAPI,
      initialValues: propInitialValues,
      borrower: propBorrower,
      isEditMode = false,
      hideCancel,
      onCancel,
      borrowers,
      borrowersLoading,
    },
    ref
  ) => {
    const { userDetails } = useContext(UserContext);
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState("");
    const client = React.useMemo(() => generateClient(), []);

    // Scroll to top on component mount
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    // Use prop initialValues if provided, otherwise use default
    const formInitialValues = React.useMemo(() => {
      const base = propInitialValues
        ? {
            ...baseInitialValues,
            ...propInitialValues,
          }
        : { ...baseInitialValues };

      if (propBorrower) {
        base.borrower =
          `${propBorrower.firstname || ""} ${propBorrower.othername || ""} ${
            propBorrower.businessName || ""
          }`.trim() || propBorrower.uniqueIdNumber;
      }
      return base;
    }, [propInitialValues, propBorrower]);

    const updatedCreateLoanForm = React.useMemo(() => {
      const formFields = [];

      // Map through the original form fields
      createLoanForm.forEach((field) => {
        if (field.name === "loanProduct") {
          // Skip loan product field
        } else {
          formFields.push(field);
        }
      });

      return formFields;
    }, [borrowers, propBorrower]);

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
      setSubmitError("");
      setSubmitSuccess("");
      setSubmitting(true);

      // If borrower is pre-selected, use the ID instead of the display name
      if (propBorrower) {
        values.borrower = propBorrower.id;
      }

      console.log("CreateLoan Form Values:", values);

      try {
        if (onCreateLoanAPI) {
          // Use parent-provided API function
          console.log("API Call: onCreateLoanAPI", { values });
          const result = await onCreateLoanAPI(values);
          setSubmitSuccess("Loan created!");
          resetForm();
          if (onCreateSuccess) {
            onCreateSuccess(result);
          }
        } else {
          // Fallback to direct creation
          const input = buildLoanInput(values, userDetails);
          console.log("API Call: createLoan", { input });
          const result = await createLoan(input);

          if (result?.id) {
            setSubmitSuccess("Loan created successfully!");
            resetForm();
            if (onCreateSuccess) {
              onCreateSuccess(result);
            }
          } else {
            setSubmitSuccess("Loan created successfully!");
            resetForm();
            if (onCreateSuccess) {
              onCreateSuccess(result);
            }
          }
        }
      } catch (err) {
        console.error("Error creating loan:", err);
        setSubmitError(
          err.message || "Failed to create loan. Please try again."
        );
      } finally {
        setSubmitting(false);
      }
    };

    // Show loading state while checking for borrowers
    if (borrowersLoading) {
      return (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "300px",
            }}
          >
            <CircularProgress />
          </Box>
        </>
      );
    }

    return (
      <>
        {!propBorrower && !borrowersLoading && borrowers.length === 0 && (
          <Box
            sx={{
              mb: 3,
              p: 2,
              backgroundColor: "#fff3cd",
              border: "1px solid #ffc107",
              borderRadius: 1,
            }}
          >
            <Typography variant="body1" sx={{ color: "#856404" }}>
              No borrowers found in the system.{" "}
              <Link
                component={RouterLink}
                to="/borrowers"
                sx={{
                  color: "#0056b3",
                  fontWeight: 600,
                  textDecoration: "underline",
                  "&:hover": {
                    color: "#003d82",
                  },
                }}
              >
                Add a borrower
              </Link>{" "}
              before creating a loan.
            </Typography>
          </Box>
        )}
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
                <Grid container spacing={1}>
                  {updatedCreateLoanForm.map((field, index) => {
                    // Check if field should be shown based on dependencies
                    if (field.dependsOn && field.dependsOnValue) {
                      const dependencyValue = formik.values[field.dependsOn];
                      if (dependencyValue !== field.dependsOnValue) {
                        return null; // Don't render if dependency condition not met
                      }
                    }

                    return (
                      <FormGrid
                        size={{ xs: 12, md: field.span }}
                        key={`${field.name}-${index}`}
                      >
                        {renderFormField(
                          { ...field, formik, editing: true },
                          formik.values
                        )}
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
                    <CreateFormButtons
                      formik={formik}
                      setEditMode={() => {}}
                      setSubmitError={setSubmitError}
                      setSubmitSuccess={setSubmitSuccess}
                      onClose={onClose}
                      hideCancel={hideCancel}
                    />
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
      </>
    );
  }
);

CreateLoan.displayName = "CreateLoan";

export default CreateLoan;
