import React, { useState, useEffect, useContext } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Box, Grid, Typography, Paper, Alert } from "@mui/material";
import { styled } from "@mui/material/styles";
import { generateClient } from "aws-amplify/api";
import { useNavigate } from "react-router-dom";
import { CustomerContext } from "../../CustomerApp";
import blankLoanFormConfig from "./blankLoanFormConfig";
import TextInput from "../../Resources/FormComponents/TextInput";
import Dropdown from "../../Resources/FormComponents/Dropdown";
import DateInput from "../../Resources/FormComponents/DateInput";
import RadioGroup from "../../Resources/FormComponents/RadioGroup";
import TextAndDropdown from "../../Resources/FormComponents/TextAndDropdown";
import FormLabel from "../../Resources/FormComponents/FormLabel";
import PlusButtonMain from "../../ModelAssets/PlusButtonMain";
import { createLoanDraft } from "../../Models/Loans/LoanDrafts/loanDraftHelpers";
import CustomerLoanSchedulePreview from "./CustomerLoanSchedulePreview";

const FormGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.up("md")]: {
    paddingRight: "20px",
  },
}));

// Get today's date in YYYY-MM-DD format
const getTodayDate = () => new Date().toISOString().split("T")[0];

// Build initial values from form config
const buildInitialValues = () => {
  const initialValues = {
    loanStartDate: getTodayDate(),
  };

  blankLoanFormConfig.forEach((field) => {
    if (field.type === "label") return;

    if (field.type === "textAndDropdown") {
      initialValues[field.textName] =
        field.textDefaultValue !== undefined ? field.textDefaultValue : "";
      initialValues[field.dropdownName] =
        field.dropdownDefaultValue !== undefined
          ? field.dropdownDefaultValue
          : "";
    } else if (field.name) {
      initialValues[field.name] =
        field.defaultValue !== undefined ? field.defaultValue : "";
    }
  });

  return initialValues;
};

const baseInitialValues = buildInitialValues();

// Validation schema for blank form
const validationSchema = Yup.object().shape({
  principalAmount: Yup.number()
    .required("Loan amount is required")
    .min(1, "Amount must be greater than 0"),
  interestMethod: Yup.string().required("Interest method is required"),
  interestType: Yup.string()
    .oneOf(["percentage", "fixed"])
    .required("Interest type is required"),
  interestRate: Yup.number()
    .typeError("Interest rate is required")
    .required("Interest rate is required")
    .min(0, "Interest rate must be at least 0")
    .when("interestType", {
      is: "percentage",
      then: (schema) => schema.max(100, "Interest rate cannot exceed 100%"),
      otherwise: (schema) => schema,
    }),
  interestPeriod: Yup.string().required("Interest period is required"),
  loanStartDate: Yup.date()
    .required("Start date is required")
    .min(new Date(getTodayDate()), "Start date cannot be in the past"),
  loanDuration: Yup.number()
    .typeError("Loan duration is required")
    .required("Loan duration is required")
    .min(1, "Duration must be at least 1"),
  durationPeriod: Yup.string()
    .oneOf(["days", "weeks", "months", "years"])
    .required("Duration period is required"),
  repaymentFrequency: Yup.string().required("Repayment frequency is required"),
  loanPurpose: Yup.string(),
});

const renderFormField = (field, formikValues) => {
  const { dynamicHelperText, dynamicLabelMap, ...fieldProps } = field;

  let displayLabel = field.label;
  if (field.dynamicLabel) {
    if (field.name === "interestRate" || field.textName === "interestRate") {
      displayLabel =
        formikValues.interestType === "fixed"
          ? "Interest Amount"
          : "Interest Rate";
    }
  }

  let displayTextLabel = field.textLabel;
  if (field.dynamicLabelMap && field.dependsOn) {
    const dependencyValue = formikValues[field.dependsOn];
    if (dependencyValue && field.dynamicLabelMap[dependencyValue]) {
      displayTextLabel = field.dynamicLabelMap[dependencyValue];
    }
  }

  let computedHelperText = field.helperText;
  if (dynamicHelperText && field.name) {
    const currentValue = formikValues[field.name];
    if (currentValue && dynamicHelperText[currentValue]) {
      computedHelperText = dynamicHelperText[currentValue];
    }
  }

  switch (field.type) {
    case "label":
      return <FormLabel label={field.label} />;
    case "text":
    case "number":
      return (
        <TextInput
          {...fieldProps}
          label={displayLabel}
          helperText={computedHelperText}
          editing={true}
          isEditMode={false}
        />
      );
    case "date":
      return (
        <DateInput
          {...fieldProps}
          label={displayLabel}
          editing={true}
          isEditMode={false}
        />
      );
    case "textarea":
      return (
        <TextInput
          {...fieldProps}
          multiline
          rows={4}
          editing={true}
          isEditMode={false}
        />
      );
    case "select":
      return (
        <Dropdown
          {...fieldProps}
          label={displayLabel}
          helperText={computedHelperText}
          editing={true}
          isEditMode={false}
        />
      );
    case "radio":
      return (
        <RadioGroup
          {...fieldProps}
          label={displayLabel}
          editing={true}
          isEditMode={false}
        />
      );
    case "textAndDropdown":
      return (
        <TextAndDropdown
          {...fieldProps}
          textLabel={displayTextLabel}
          editing={true}
          isEditMode={false}
        />
      );
    default:
      return (
        <TextInput
          {...fieldProps}
          label={displayLabel}
          editing={true}
          isEditMode={false}
        />
      );
  }
};

export default function CustomerBlankLoanForm() {
  const { borrower, institution, customerUser } = useContext(CustomerContext);
  const [branches, setBranches] = useState([]);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState("form"); // "form" or "preview"
  const [formValues, setFormValues] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!institution?.id) {
        setLoading(false);
        return;
      }

      const client = generateClient();

      try {
        // Fetch branches
        const branchResult = await client.graphql({
          query: `query ListBranches($filter: ModelBranchFilterInput) {
            listBranches(filter: $filter) {
              items {
                id
                name
              }
            }
          }`,
          variables: {
            filter: {
              institutionBranchesId: { eq: institution.id },
            },
          },
        });

        setBranches(branchResult?.data?.listBranches?.items || []);
      } catch (err) {
        console.error("Error fetching branches:", err);
        setSubmitError("Failed to load data. Please try again.");
      }

      setLoading(false);
    };

    fetchData();
  }, [institution]);

  // Called when user clicks "View Schedule" on the form - validates and moves to preview
  const handleViewSchedule = async (
    values,
    { setSubmitting: setFormSubmitting },
  ) => {
    setSubmitError("");
    setSubmitSuccess("");
    setFormSubmitting(true);

    try {
      // Build the draft record for preview
      const draftRecord = {
        borrower: borrower.id,
        loanProduct: null, // No product for blank form
        principalAmount: Number(values.principalAmount),
        loanPurpose: values.loanPurpose || null,
        loanDuration: Number(values.loanDuration),
        durationPeriod: values.durationPeriod || "months",
        loanStartDate: values.loanStartDate,
        interestRate: Number(values.interestRate),
        interestMethod: values.interestMethod,
        interestType: values.interestType,
        interestPeriod: values.interestPeriod,
        repaymentFrequency: values.repaymentFrequency,
        repaymentFrequencyType: "interval",
      };

      setFormValues(draftRecord);
      setStep("preview");
    } catch (err) {
      console.error("Error preparing schedule preview:", err);
      setSubmitError("Failed to prepare schedule preview. Please try again.");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Called from the preview screen when user confirms submission
  const handleFinalSubmit = async () => {
    setSubmitError("");
    setSubmitSuccess("");
    setSubmitting(true);

    try {
      const userDetails = {
        id: customerUser.id,
        institutionUsersId: institution.id,
        branchUsersId: branches[0]?.id || null,
      };

      // Create with DRAFT status - customer applications need staff approval
      await createLoanDraft({
        userDetails,
        draftRecord: formValues,
        source: "CUSTOMER_PORTAL",
        status: "DRAFT",
      });

      setSubmitSuccess(
        "Loan application submitted successfully! Your application is now pending review. You'll be notified once it's processed.",
      );

      // Navigate to loans list after a delay
      setTimeout(() => {
        navigate(`/client/${institution.id}/loans`);
      }, 2500);
    } catch (err) {
      console.error("Error submitting loan application:", err);
      setSubmitError("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Go back to form from preview
  const handleBackToForm = () => {
    setStep("form");
    setSubmitError("");
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitError("");
    setSubmitSuccess("");
    setSubmitting(true);

    try {
      // Create draft record with all fields from the form
      const draftRecord = {
        borrower: borrower.id,
        loanProduct: null, // No product for blank form
        principalAmount: Number(values.principalAmount),
        loanPurpose: values.loanPurpose || null,
        loanDuration: Number(values.loanDuration),
        durationPeriod: values.durationPeriod || "months",
        loanStartDate: values.loanStartDate,
        interestRate: Number(values.interestRate),
        interestMethod: values.interestMethod,
        interestType: values.interestType,
        interestPeriod: values.interestPeriod,
        repaymentFrequency: values.repaymentFrequency,
        repaymentFrequencyType: "interval",
      };

      const userDetails = {
        id: customerUser.id,
        institutionUsersId: institution.id,
        branchUsersId: branches[0]?.id || null, // Use first branch
      };

      // Create with DRAFT status - customer applications need staff approval
      await createLoanDraft({
        userDetails,
        draftRecord,
        source: "CUSTOMER_PORTAL",
        status: "DRAFT",
      });

      setSubmitSuccess(
        "Loan application submitted successfully! Your application is now pending review. You'll be notified once it's processed.",
      );
      resetForm();

      // Navigate to loans list after a delay
      setTimeout(() => {
        navigate(`/client/${institution.id}/loans`);
      }, 2500);
    } catch (err) {
      console.error("Error submitting loan application:", err);
      setSubmitError("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!borrower) {
    return (
      <Paper sx={{ p: 3, bgcolor: "warning.light" }}>
        <Typography>
          Please complete your profile before applying for a loan.
        </Typography>
      </Paper>
    );
  }

  // Show schedule preview step
  if (step === "preview" && formValues) {
    return (
      <Box>
        <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
          Please review your loan schedule below. You can export it as a PDF or
          go back to edit your application.
        </Typography>

        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}
        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {submitSuccess}
          </Alert>
        )}

        <Paper sx={{ p: 3 }}>
          <CustomerLoanSchedulePreview
            draftValues={formValues}
            borrower={borrower}
            institution={institution}
            currency={institution?.currencyCode || "$"}
            onBack={handleBackToForm}
            onSubmit={handleFinalSubmit}
            submitLabel="Submit Loan Application"
            submitting={submitting}
          />
        </Paper>
      </Box>
    );
  }

  // Show the form step
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
        Fill in the loan details below. All fields marked with * are required.
      </Typography>

      <Formik
        initialValues={baseInitialValues}
        validationSchema={validationSchema}
        onSubmit={handleViewSchedule}
        enableReinitialize={false}
      >
        {(formik) => (
          <Form>
            <Grid container spacing={2}>
              {blankLoanFormConfig.map((field, index) => {
                // Handle conditional visibility
                if (field.dependsOn && field.dependsOnValue) {
                  const dependencyValue = formik.values[field.dependsOn];
                  if (dependencyValue !== field.dependsOnValue) {
                    return null;
                  }
                }

                return (
                  <FormGrid
                    size={{ xs: 12, md: field.span || 12 }}
                    key={field.name || field.textName || `field-${index}`}
                  >
                    {renderFormField(field, formik.values)}
                  </FormGrid>
                );
              })}

              {/* Error and success messages */}
              {submitError && (
                <Grid size={{ xs: 12 }}>
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {submitError}
                  </Alert>
                </Grid>
              )}
              {submitSuccess && (
                <Grid size={{ xs: 12 }}>
                  <Alert severity="success" sx={{ mt: 1 }}>
                    {submitSuccess}
                  </Alert>
                </Grid>
              )}

              {/* View Schedule button */}
              <Box
                sx={{
                  display: "flex",
                  pr: 2,
                  justifyContent: { xs: "center", md: "flex-end" },
                  width: "100%",
                  mt: 2,
                }}
              >
                <PlusButtonMain
                  buttonText="View Loan Schedule"
                  variant="contained"
                  onClick={formik.handleSubmit}
                  disabled={formik.isSubmitting || !formik.isValid}
                />
              </Box>
            </Grid>
          </Form>
        )}
      </Formik>
    </Paper>
  );
}
