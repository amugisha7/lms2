import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Box, Grid, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";

import TextInput from "../../../Resources/FormComponents/TextInput";
import Dropdown from "../../../Resources/FormComponents/Dropdown";
import FormLabel from "../../../Resources/FormComponents/FormLabel";
import RadioGroup from "../../../Resources/FormComponents/RadioGroup";
import RadioGroupNoLabel from "../../../Resources/FormComponents/RadioGroupNoLabel";
import TextAndDropdown from "../../../Resources/FormComponents/TextAndDropdown";
import TextAndRadio from "../../../Resources/FormComponents/TextAndRadio";
import MultipleDropDown from "../../../Resources/FormComponents/MultipleDropDown";

import PlusButtonMain from "../../../ModelAssets/PlusButtonMain";
import CustomPopUp from "../../../ModelAssets/CustomPopUp";
import { UserContext } from "../../../App";

import loanCalculatorForm from "./loanCalculatorForm";
import LoanCalculatorSchedule from "./LoanCalculatorSchedule";

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

const baseInitialValues = loanCalculatorForm.reduce((acc, field) => {
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

  if (field.type === "textAndRadio") {
    acc[field.textName] =
      field.textDefaultValue !== undefined ? field.textDefaultValue : "";
    acc[field.radioName] =
      field.radioDefaultValue !== undefined ? field.radioDefaultValue : "";
    return acc;
  }

  if (field.type === "selectMultiple") {
    acc[field.name] = Array.isArray(field.defaultValue)
      ? field.defaultValue
      : [];
    return acc;
  }

  if (field.name) {
    acc[field.name] =
      field.defaultValue !== undefined ? field.defaultValue : "";
  }
  return acc;
}, {});

const buildValidationSchema = () =>
  Yup.object().shape({
    principalAmount: Yup.number()
      .typeError("Principal Amount is required")
      .required("Principal Amount is required")
      .min(0, "Principal Amount must be at least 0"),
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
      .min(1, "Loan Duration must be at least 1"),
    durationPeriod: Yup.string()
      .oneOf(["days", "weeks", "months", "years"])
      .required("Duration Period is required"),
    repaymentFrequencyType: Yup.string()
      .oneOf(["interval", "setDays", "setDates"])
      .required("Repayment Frequency is required"),
    repaymentFrequency: Yup.string().when("repaymentFrequencyType", {
      is: "interval",
      then: (schema) =>
        schema
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
          .required("Repayment Interval is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    customPaymentDays: Yup.array().when("repaymentFrequencyType", {
      is: "setDays",
      then: (schema) =>
        schema
          .of(Yup.string())
          .min(1, "Select at least one payment day")
          .required("Payment Days are required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    customPaymentDates: Yup.array().when("repaymentFrequencyType", {
      is: "setDates",
      then: (schema) =>
        schema
          .of(Yup.string())
          .min(1, "Select at least one payment date")
          .required("Payment Dates are required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

const validationSchema = buildValidationSchema();

const shouldRender = (field, values) => {
  if (!field?.dependsOn) return true;
  const current = values?.[field.dependsOn];
  if (field.dependsOnValue === undefined) return Boolean(current);
  return current === field.dependsOnValue;
};

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
    case "selectMultiple":
      return (
        <MultipleDropDown
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
    case "textAndRadio":
      return (
        <TextAndRadio
          {...fieldProps}
          textLabel={displayLabel}
          editing={field.editing}
          readOnly={field.readOnly}
          disabled={field.disabled}
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

export default function LoanCalculator() {
  const theme = useTheme();
  const { userDetails } = React.useContext(UserContext);
  const [scheduleOpen, setScheduleOpen] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");

  const currency = userDetails?.institution?.currencyCode || "$";

  return (
    <Formik
      initialValues={baseInitialValues}
      validationSchema={validationSchema}
      onSubmit={() => {
        // No-op: calculator never saves or calls APIs.
      }}
      enableReinitialize
    >
      {(formik) => {
        const visibleFields = loanCalculatorForm.filter((f) =>
          shouldRender(f, formik.values)
        );

        return (
          <Form>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
              Loan Calculator
            </Typography>

            <CustomPopUp
              open={scheduleOpen}
              onClose={() => setScheduleOpen(false)}
              title="Loan Calculator Results"
              showEdit={false}
              showDelete={false}
              maxWidth="lg"
            >
              <LoanCalculatorSchedule
                draftValues={formik.values}
                userDetails={userDetails}
                currency={currency}
                onClose={() => setScheduleOpen(false)}
              />
            </CustomPopUp>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <Grid container spacing={1}>
                {visibleFields.map((field, index) => (
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
                    buttonText="VIEW LOAN SCHEDULE"
                    variant="outlined"
                    startIcon={null}
                    onClick={async () => {
                      setSubmitError("");
                      const errors = await formik.validateForm();
                      if (Object.keys(errors || {}).length > 0) {
                        formik.setTouched(
                          Object.keys(errors).reduce(
                            (acc, k) => ({ ...acc, [k]: true }),
                            {}
                          )
                        );
                        setSubmitError("Please fix the form errors first.");
                        return;
                      }
                      setScheduleOpen(true);
                    }}
                  />
                </Box>

                {submitError && (
                  <Typography color="error" sx={{ mt: 2 }}>
                    {submitError}
                  </Typography>
                )}

                {/* Spacer to match CreateLoan layout */}
                <Box sx={{ width: "100%", height: 16 }} />
              </Grid>
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
}
