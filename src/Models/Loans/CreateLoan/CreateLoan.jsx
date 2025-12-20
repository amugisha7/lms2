import React, {
  useState,
  forwardRef,
  useEffect,
  useContext,
  useRef,
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
import {
  createLoan,
  buildLoanInput,
  fetchAccounts,
  fetchLoanFeesConfig,
} from "./createLoanHelpers";
import FormLabel from "../../../Resources/FormComponents/FormLabel";
import FormLinkText from "../../../Resources/FormComponents/FormLinkText";
import RadioGroup from "../../../Resources/FormComponents/RadioGroup";
import RadioGroupNoLabel from "../../../Resources/FormComponents/RadioGroupNoLabel";
import TextAndRadio from "../../../Resources/FormComponents/TextAndRadio";
import TextAndDropdown from "../../../Resources/FormComponents/TextAndDropdown";
import MultipleDropDown from "../../../Resources/FormComponents/MultipleDropDown";

const FormGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.up("md")]: {
    paddingRight: "20px",
  },
}));

const baseInitialValues = createLoanForm.reduce((acc, field) => {
  // Skip label and formLink fields as they don't need values
  if (field.type === "label" || field.type === "formLink") return acc;

  // Handle textAndDropdown fields with separate defaults
  if (field.type === "textAndDropdown") {
    acc[field.textName] =
      field.textDefaultValue !== undefined ? field.textDefaultValue : "";
    acc[field.dropdownName] =
      field.dropdownDefaultValue !== undefined
        ? field.dropdownDefaultValue
        : "";
  } else if (field.type === "textAndRadio") {
    acc[field.textName] =
      field.textDefaultValue !== undefined ? field.textDefaultValue : "";
    acc[field.radioName] =
      field.radioDefaultValue !== undefined ? field.radioDefaultValue : "";
  } else {
    acc[field.name] =
      field.defaultValue !== undefined ? field.defaultValue : "";
  }
  return acc;
}, {});

// Initialize loanFeesType separately if not in baseInitialValues
if (!baseInitialValues.loanFeesType) {
  baseInitialValues.loanFeesType = "template";
}

const buildValidationSchema = () => {
  const validationShape = {
    borrower: Yup.string().required("Borrower is required"),
    accountLoansId: Yup.string().required("Source Account is required"),
    principalAmount: Yup.number()
      .required("Principal Amount is required")
      .min(0, "Principal Amount must be at least 0"),
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
      .required("Repayment Frequency Type is required"),
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
  };

  return Yup.object().shape(validationShape);
};

const baseValidationSchema = buildValidationSchema();

const renderFormField = (field, formikValues) => {
  const { dynamicHelperText, dynamicLabelMap, ...fieldProps } = field;

  // Handle dynamic labels
  let displayLabel = field.label;
  if (field.dynamicLabel) {
    if (field.name === "calculateInterestOn") {
      displayLabel =
        formikValues.interestTypeMaturity === "fixed"
          ? "Calculate Interest if there is"
          : "Calculate Interest on";
    } else if (field.name === "loanInterestRateAfterMaturity") {
      displayLabel =
        formikValues.interestTypeMaturity === "fixed"
          ? "Interest Amount After Maturity"
          : "Interest Rate After Maturity";
    } else if (field.name === "interestRate") {
      displayLabel =
        formikValues.interestType === "fixed"
          ? "Interest Amount"
          : "Interest Rate";
    }
  }

  // Handle dynamic label mapping for textAndDropdown fields
  let displayTextLabel = field.textLabel;
  if (field.dynamicLabelMap && field.dependsOn) {
    const dependencyValue = formikValues[field.dependsOn];
    if (dependencyValue && field.dynamicLabelMap[dependencyValue]) {
      displayTextLabel = field.dynamicLabelMap[dependencyValue];
    }
  }

  switch (field.type) {
    case "text":
    case "number":
      return <TextInput {...fieldProps} label={displayLabel} />;
    case "select":
      // Use DropDownSearchable for borrower field
      if (field.name === "borrower") {
        return <DropDownSearchable {...fieldProps} label={displayLabel} />;
      }
      return <Dropdown {...fieldProps} label={displayLabel} />;
    case "selectMultiple":
      return <MultipleDropDown {...fieldProps} label={displayLabel} />;
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
    case "formLink":
      return (
        <FormLinkText
          linkText={field.linkText}
          linkUrl={field.linkUrl}
          icon={field.icon}
        />
      );
    case "radio":
      return <RadioGroup {...fieldProps} />;
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
      return <TextInput {...fieldProps} />;
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
    const [accounts, setAccounts] = useState([]);
    const [accountsLoading, setAccountsLoading] = useState(false);
    const accountsFetchedRef = useRef(false);
    const accountsInstitutionIdRef = useRef(null);
    const [loanFeesConfigs, setLoanFeesConfigs] = useState([]);
    const [loanFeesLoading, setLoanFeesLoading] = useState(false);
    const loanFeesFetchedRef = useRef(false);
    const loanFeesInstitutionIdRef = useRef(null);
    const client = React.useMemo(() => generateClient(), []);

    // Helper function to format loan fee amount display
    const formatLoanFeeAmount = (loanFee, currency = "$") => {
      const value =
        loanFee.rate !== undefined && loanFee.rate !== null
          ? Number(loanFee.rate).toLocaleString()
          : "-";

      if (loanFee.calculationMethod === "percentage") {
        const percentageBaseLabels = {
          principal: "Principal",
          interest: "Interest",
          principal_interest: "(Principal + Interest)",
        };
        const base =
          percentageBaseLabels[loanFee.percentageBase] ||
          loanFee.percentageBase ||
          "";
        return value !== "-" ? `${value}% of ${base}` : "-";
      }
      if (loanFee.calculationMethod === "fixed") {
        return value !== "-" ? `${currency} ${value} (fixed)` : "-";
      }
      return "-";
    };

    // Scroll to top on component mount
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    useEffect(() => {
      const currentInstitutionId = userDetails?.institutionUsersId;
      if (
        currentInstitutionId &&
        currentInstitutionId !== accountsInstitutionIdRef.current
      ) {
        accountsFetchedRef.current = false;
        accountsInstitutionIdRef.current = currentInstitutionId;
      }
      if (!accountsFetchedRef.current && currentInstitutionId) {
        setAccountsLoading(true);
        fetchAccounts(currentInstitutionId)
          .then((data) => {
            // Locally filter to only include active accounts
            const activeAccounts = Array.isArray(data)
              ? data.filter((a) => a && a.status === "active")
              : [];
            setAccounts(activeAccounts);
            accountsFetchedRef.current = true;
          })
          .catch((err) => {
            console.error("Error fetching accounts:", err);
          })
          .finally(() => {
            setAccountsLoading(false);
          });
      }
    }, [userDetails?.institutionUsersId]);

    useEffect(() => {
      const currentInstitutionId = userDetails?.institutionUsersId;
      if (
        currentInstitutionId &&
        currentInstitutionId !== loanFeesInstitutionIdRef.current
      ) {
        loanFeesFetchedRef.current = false;
        loanFeesInstitutionIdRef.current = currentInstitutionId;
      }
      if (!loanFeesFetchedRef.current && currentInstitutionId) {
        setLoanFeesLoading(true);
        fetchLoanFeesConfig(currentInstitutionId)
          .then((data) => {
            setLoanFeesConfigs(data);
            loanFeesFetchedRef.current = true;
          })
          .catch((err) => {
            console.error("Error fetching loan fees configs:", err);
          })
          .finally(() => {
            setLoanFeesLoading(false);
          });
      }
    }, [userDetails?.institutionUsersId]);

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

      // Set the first account as default Source Account
      if (accounts.length > 0 && !base.accountLoansId) {
        base.accountLoansId = accounts[0].id;
      }

      // Set the first account as default Loan Fees Account
      if (accounts.length > 0 && !base.loanFeesAccountId) {
        base.loanFeesAccountId = accounts[0].id;
      }

      return base;
    }, [propInitialValues, propBorrower, accounts]);

    const updatedCreateLoanForm = React.useMemo(() => {
      const formFields = [];
      const currency = userDetails?.institution?.currencyCode || "$";

      // Map through the original form fields
      createLoanForm.forEach((field) => {
        if (field.name === "loanProduct") {
          // Skip loan product field
        } else if (field.name === "accountLoansId") {
          formFields.push({
            ...field,
            options: accounts.map((account) => ({
              value: account.id,
              label: account.name,
            })),
          });
        } else if (field.name === "loanFees") {
          formFields.push({
            ...field,
            options: loanFeesConfigs.map((loanFee) => ({
              value: loanFee.id,
              label: `${loanFee.name} - ${formatLoanFeeAmount(
                loanFee,
                currency
              )}`,
            })),
          });
        } else if (field.name === "loanFeesAccountId") {
          formFields.push({
            ...field,
            options: accounts.map((account) => ({
              value: account.id,
              label: account.name,
            })),
          });
        } else {
          formFields.push(field);
        }
      });

      return formFields;
    }, [
      borrowers,
      propBorrower,
      accounts,
      loanFeesConfigs,
      userDetails,
      formatLoanFeeAmount,
    ]);

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
          // const input = buildLoanInput(values, userDetails); // Deprecated
          console.log("API Call: createLoan", { values });
          const result = await createLoan(values, userDetails);

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

                    let helperText = field.helperText;
                    if (field.dynamicHelperText) {
                      const currentValue = formik.values[field.name];
                      if (
                        currentValue &&
                        field.dynamicHelperText[currentValue]
                      ) {
                        helperText = field.dynamicHelperText[currentValue];
                      }
                    }

                    return (
                      <FormGrid
                        size={{ xs: 12, md: field.span }}
                        key={`${field.name}-${index}`}
                      >
                        {renderFormField(
                          { ...field, formik, editing: true, helperText },
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
