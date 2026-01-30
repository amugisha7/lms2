import React, { useContext, useMemo } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Box, Grid, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";

import { CustomerContext } from "../../CustomerApp";
import TextInput from "../../Resources/FormComponents/TextInput";
import Dropdown from "../../Resources/FormComponents/Dropdown";
import FormLabel from "../../Resources/FormComponents/FormLabel";
import RadioGroup from "../../Resources/FormComponents/RadioGroup";
import RadioGroupNoLabel from "../../Resources/FormComponents/RadioGroupNoLabel";
import TextAndDropdown from "../../Resources/FormComponents/TextAndDropdown";
import MultipleDropDown from "../../Resources/FormComponents/MultipleDropDown";

import PlusButtonMain from "../../ModelAssets/PlusButtonMain";
import CustomPopUp from "../../ModelAssets/CustomPopUp";

import CustomerLoanCalculatorSchedule from "./CustomerLoanCalculatorSchedule";

const FormGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.up("md")]: {
    paddingRight: "20px",
  },
  "& .MuiInputBase-root": {
    width: "100%",
  },
}));

// Form configuration for customer loan calculator
const customerLoanCalculatorForm = [
  {
    label: "Principal Amount",
    name: "principalAmount",
    type: "number",
    required: true,
    span: 12,
    helperText: "Enter the loan amount you want to calculate.",
  },
  {
    label: "Interest Settings",
    type: "label",
    span: 12,
  },
  {
    label: "Interest Method",
    name: "interestMethod",
    type: "select",
    span: 12,
    required: true,
    defaultValue: "reducing_balance_equal_installments",
    options: [
      { value: "flat", label: "Flat Rate" },
      {
        value: "reducing_balance_equal_installments",
        label: "Reducing Balance - Equal Installments",
      },
      {
        value: "reducing_balance_equal_principal",
        label: "Reducing Balance - Equal Principal",
      },
    ],
    dynamicHelperText: {
      flat: "Interest is calculated on the original principal amount throughout the loan term.",
      reducing_balance_equal_installments:
        "Interest is calculated on the remaining balance. Your payments will be the same each month.",
      reducing_balance_equal_principal:
        "Interest is calculated on the remaining balance. Principal payments are fixed, so total payments decrease over time.",
    },
  },
  {
    label: "Interest Type",
    name: "interestType",
    type: "radio",
    span: 6,
    required: true,
    defaultValue: "percentage",
    options: [
      { value: "percentage", label: "Percentage" },
      { value: "fixed", label: "Fixed Amount" },
    ],
  },
  {
    type: "textAndDropdown",
    span: 6,
    textLabel: "Interest Rate",
    textName: "interestRate",
    textType: "number",
    textRequired: true,
    textDefaultValue: "",
    dynamicLabelMap: {
      percentage: "Interest Rate",
      fixed: "Interest Amount",
    },
    dependsOn: "interestType",
    dropdownLabel: "",
    dropdownName: "interestPeriod",
    dropdownRequired: true,
    dropdownDefaultValue: "per_month",
    dropdownOptions: [
      { value: "per_month", label: "Per Month" },
      { value: "per_year", label: "Per Year" },
      { value: "per_loan", label: "Per Loan" },
    ],
  },
  {
    label: "Duration Settings",
    type: "label",
    span: 12,
  },
  {
    label: "Loan Start Date",
    name: "loanStartDate",
    type: "date",
    required: true,
    span: 6,
  },
  {
    type: "textAndDropdown",
    span: 6,
    textLabel: "Loan Duration",
    textName: "loanDuration",
    textType: "number",
    textRequired: true,
    textDefaultValue: "",
    textInputProps: { min: 1 },
    dropdownLabel: "",
    dropdownName: "durationPeriod",
    dropdownRequired: true,
    dropdownDefaultValue: "months",
    dropdownOptions: [
      { value: "weeks", label: "Weeks" },
      { value: "months", label: "Months" },
      { value: "years", label: "Years" },
    ],
  },
  {
    label: "Repayment Settings",
    type: "label",
    span: 12,
  },
  {
    label: "Repayment Frequency",
    name: "repaymentFrequency",
    type: "select",
    span: 6,
    defaultValue: "monthly",
    options: [
      { value: "weekly", label: "Weekly" },
      { value: "biweekly", label: "Every 2 weeks" },
      { value: "monthly", label: "Monthly" },
      { value: "quarterly", label: "Quarterly" },
      { value: "semi_annual", label: "Semi-annual" },
      { value: "yearly", label: "Yearly" },
      { value: "lump_sum", label: "Lump Sum (One Payment)" },
    ],
    helperText: "How often will payments be made?",
  },
];

// Build initial values from form config
const baseInitialValues = customerLoanCalculatorForm.reduce((acc, field) => {
  if (field.type === "label") return acc;

  if (field.type === "textAndDropdown") {
    acc[field.textName] =
      field.textDefaultValue !== undefined ? field.textDefaultValue : "";
    acc[field.dropdownName] =
      field.dropdownDefaultValue !== undefined
        ? field.dropdownDefaultValue
        : "";
    return acc;
  }

  if (field.name) {
    acc[field.name] =
      field.defaultValue !== undefined ? field.defaultValue : "";
  }
  return acc;
}, {});

// Add repaymentFrequencyType for compatibility with schedule generation
baseInitialValues.repaymentFrequencyType = "interval";

// Validation schema
const validationSchema = Yup.object().shape({
  principalAmount: Yup.number()
    .typeError("Principal Amount is required")
    .required("Principal Amount is required")
    .min(1, "Amount must be greater than 0"),
  interestMethod: Yup.string().required("Interest Method is required"),
  interestType: Yup.string()
    .oneOf(["percentage", "fixed"])
    .required("Interest Type is required"),
  interestRate: Yup.number()
    .typeError("Interest Rate is required")
    .required("Interest Rate is required")
    .min(0, "Interest Rate must be at least 0")
    .when("interestType", {
      is: "percentage",
      then: (schema) => schema.max(100, "Interest Rate cannot exceed 100%"),
      otherwise: (schema) => schema,
    }),
  interestPeriod: Yup.string().required("Interest Period is required"),
  loanStartDate: Yup.string().required("Loan Start Date is required"),
  loanDuration: Yup.number()
    .typeError("Loan Duration is required")
    .required("Loan Duration is required")
    .min(1, "Duration must be at least 1"),
  durationPeriod: Yup.string()
    .oneOf(["days", "weeks", "months", "years"])
    .required("Duration Period is required"),
  repaymentFrequency: Yup.string().required("Repayment Frequency is required"),
});

const renderFormField = (field, formikValues) => {
  const { dynamicHelperText, dynamicLabelMap, ...fieldProps } = field;

  let displayLabel = field.label;
  if (field.dynamicLabel) {
    if (field.name === "interestRate") {
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
    case "date":
      return (
        <TextInput
          {...fieldProps}
          label={displayLabel}
          helperText={computedHelperText}
        />
      );
    case "select":
      return (
        <Dropdown
          {...fieldProps}
          label={displayLabel}
          helperText={computedHelperText}
        />
      );
    case "radio":
      return (
        <RadioGroup
          {...fieldProps}
          label={displayLabel}
          helperText={computedHelperText}
        />
      );
    case "radioNoLabel":
      return <RadioGroupNoLabel {...fieldProps} />;
    case "selectMultiple":
      return (
        <MultipleDropDown
          {...fieldProps}
          label={displayLabel}
          helperText={computedHelperText}
        />
      );
    case "textAndDropdown":
      return (
        <TextAndDropdown
          {...fieldProps}
          textLabel={displayTextLabel}
          editing={field.editing}
          readOnly={field.readOnly}
          disabled={field.disabled}
        />
      );
    default:
      return <TextInput {...fieldProps} label={displayLabel} />;
  }
};

/**
 * CustomerLoanCalculator
 *
 * A simplified loan calculator for customers to:
 * - Explore different loan scenarios
 * - View projected payment schedules
 * - Export schedules as PDF
 * - Make informed decisions before applying for a loan
 *
 * This does NOT create a loan application - for that, use "Apply for Loan"
 */
export default function CustomerLoanCalculator() {
  const theme = useTheme();
  const { institution } = useContext(CustomerContext);
  const [scheduleOpen, setScheduleOpen] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");

  const currency = institution?.currencyCode || "$";
  const currencyCode = institution?.currencyCode;
  const institutionName = institution?.name || "";

  // Prepare userDetails-like object for schedule component compatibility
  const userDetails = useMemo(
    () => ({
      institution: {
        name: institutionName,
        currencyCode: currencyCode,
      },
      branch: {
        name: "Customer Portal",
      },
    }),
    [institutionName, currencyCode],
  );

  return (
    <Formik
      initialValues={baseInitialValues}
      validationSchema={validationSchema}
      onSubmit={() => {
        // Calculator never saves - just displays results
      }}
      enableReinitialize
    >
      {(formik) => (
        <Form>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
            Loan Calculator
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Use this calculator to explore different loan scenarios and view
            estimated payment schedules. When you're ready to apply, go to
            "Apply for Loan" and select a loan product.
          </Typography>

          <CustomPopUp
            open={scheduleOpen}
            onClose={() => setScheduleOpen(false)}
            title="Loan Calculator Results"
            showEdit={false}
            showDelete={false}
            maxWidth="lg"
          >
            <CustomerLoanCalculatorSchedule
              draftValues={formik.values}
              userDetails={userDetails}
              currency={currency}
              onClose={() => setScheduleOpen(false)}
            />
          </CustomPopUp>

          <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <Grid container spacing={1}>
              {customerLoanCalculatorForm.map((field, index) => (
                <FormGrid
                  size={{ xs: 12, md: field.span || 12 }}
                  key={`${field.name || field.label || "field"}-${index}`}
                >
                  {renderFormField(field, formik.values)}
                </FormGrid>
              ))}

              <Box
                sx={{
                  display: "flex",
                  pr: 2,
                  justifyContent: { xs: "center", md: "flex-end" },
                  width: "100%",
                  gap: 1,
                  flexWrap: "wrap",
                  mb: 8,
                  mt: 2,
                }}
              >
                <PlusButtonMain
                  buttonText="CALCULATE LOAN"
                  variant="outlined"
                  startIcon={null}
                  onClick={async () => {
                    setSubmitError("");
                    const errors = await formik.validateForm();
                    if (Object.keys(errors || {}).length > 0) {
                      formik.setTouched(
                        Object.keys(errors).reduce(
                          (acc, k) => ({ ...acc, [k]: true }),
                          {},
                        ),
                      );
                      setSubmitError("Please fill in all required fields.");
                      return;
                    }
                    setScheduleOpen(true);
                  }}
                />
              </Box>

              {submitError && (
                <Typography color="error" sx={{ mt: 2, pl: 1 }}>
                  {submitError}
                </Typography>
              )}
            </Grid>
          </Box>
        </Form>
      )}
    </Formik>
  );
}
