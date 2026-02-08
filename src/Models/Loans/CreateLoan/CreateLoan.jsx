import React, {
  useState,
  forwardRef,
  useEffect,
  useContext,
  useRef,
} from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Box, Grid, Typography, CircularProgress, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import createLoanForm from "./createLoanForm";
import TextInput from "../../../Resources/FormComponents/TextInput";
import Dropdown from "../../../Resources/FormComponents/Dropdown";
import OrderedList from "../../../Resources/FormComponents/OrderedList";
import CreateFormButtons from "../../../ModelAssets/CreateFormButtons";
import PlusButtonMain from "../../../ModelAssets/PlusButtonMain";
import { UserContext } from "../../../App";
import { useNotification } from "../../../ModelAssets/NotificationContext";
import {
  fetchAccounts,
  fetchLoanFeesConfig,
  fetchInstitutionAdmins,
} from "./createLoanHelpers";
import { sendLoanApprovalRequest } from "../../../Screens/Notifications/notificationsAPI";
import {
  createLoanDraft,
  updateLoanDraft,
  transitionLoanDraftStatus,
  convertDraftToLoan,
  getLoanDraftById,
} from "../LoanDrafts/loanDraftHelpers";
import { exportLoanDraftSummaryA4 } from "../LoanDrafts/loanDraftExportHelpers";
import FormLabel from "../../../Resources/FormComponents/FormLabel";
import FormLinkText from "../../../Resources/FormComponents/FormLinkText";
import RadioGroup from "../../../Resources/FormComponents/RadioGroup";
import RadioGroupNoLabel from "../../../Resources/FormComponents/RadioGroupNoLabel";
import TextAndRadio from "../../../Resources/FormComponents/TextAndRadio";
import TextAndDropdown from "../../../Resources/FormComponents/TextAndDropdown";
import MultipleDropDown from "../../../Resources/FormComponents/MultipleDropDown";

import WorkingOverlay from "../../../ModelAssets/WorkingOverlay";
import CustomPopUp from "../../../ModelAssets/CustomPopUp";
import LoanScheduleDraft from "../LoanDrafts/LoanScheduleDraft";

const FormGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.up("md")]: {
    paddingRight: "20px",
  },
}));

const baseInitialValues = createLoanForm.reduce((acc, field) => {
  if (field.type === "label" || field.type === "formLink") return acc;

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
    if (field.name) {
      acc[field.name] =
        field.defaultValue !== undefined ? field.defaultValue : "";
    }
  }
  return acc;
}, {});

// Keep field for compatibility even though Blank flow skips it.
baseInitialValues.loanProduct = "";

const buildValidationSchema = () => {
  const validationShape = {
    borrower: Yup.string().required("Borrower is required"),
    accountLoansId: Yup.string().required("Source Account is required"),
    principalAmount: Yup.number()
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
      .oneOf(["interval", "setDays", "setDates", "lumpSum"])
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
    case "orderedList":
      return (
        <OrderedList
          label={field.label}
          items={field.formik.values[field.name] || field.defaultValue || []}
          onChange={(newOrder) =>
            field.formik.setFieldValue(field.name, newOrder)
          }
          helperText={computedHelperText}
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
      return <RadioGroup {...fieldProps} helperText={computedHelperText} />;
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
      readOnly = false,
      draftId,
      onDraftUpdated,
    },
    ref,
  ) => {
    const { userDetails } = useContext(UserContext);
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const theme = useTheme();
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState("");
    const [loanDraft, setLoanDraft] = useState(null);

    const [scheduleOpen, setScheduleOpen] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [accountsLoading, setAccountsLoading] = useState(false);
    const accountsFetchedRef = useRef(false);
    const accountsInstitutionIdRef = useRef(null);
    const [loanFeesConfigs, setLoanFeesConfigs] = useState([]);
    const [loanFeesLoading, setLoanFeesLoading] = useState(false);
    const loanFeesFetchedRef = useRef(false);
    const loanFeesInstitutionIdRef = useRef(null);
    const formikRef = useRef(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const isPrivileged = React.useMemo(() => {
      const type = userDetails?.userType;
      return type?.toLowerCase() === "admin" || type === "branchManager";
    }, [userDetails]);

    useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    useEffect(() => {
      let cancelled = false;
      const loadDraft = async () => {
        if (!draftId) return;
        try {
          const draft = await getLoanDraftById(draftId);
          if (cancelled) return;
          setLoanDraft(draft);
        } catch (err) {
          console.error("Failed to load draft:", err);
        }
      };

      loadDraft();
      return () => {
        cancelled = true;
      };
    }, [draftId]);

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
            setLoanFeesConfigs(Array.isArray(data) ? data : []);
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

    const formInitialValues = React.useMemo(() => {
      const base = propInitialValues
        ? {
            ...baseInitialValues,
            ...propInitialValues,
          }
        : { ...baseInitialValues };

      // Load values from draft if editing
      if (loanDraft?.draftRecord) {
        try {
          const draftRecord =
            typeof loanDraft.draftRecord === "string"
              ? JSON.parse(loanDraft.draftRecord)
              : loanDraft.draftRecord;
          Object.assign(base, draftRecord);
        } catch (err) {
          console.error("Failed to parse draft record:", err);
        }
      }

      if (propBorrower) {
        base.borrower =
          `${propBorrower.firstname || ""} ${propBorrower.othername || ""} ${
            propBorrower.businessName || ""
          }`.trim() || propBorrower.uniqueIdNumber;
      }

      if (accounts.length > 0 && !base.accountLoansId) {
        base.accountLoansId = accounts[0].id;
      }
      if (accounts.length > 0 && !base.loanFeesAccountId) {
        base.loanFeesAccountId = accounts[0].id;
      }

      return base;
    }, [propInitialValues, propBorrower, accounts, loanDraft]);

    const saveDraftInternal = async (
      values,
      { suppressSuccessCallback = false } = {},
    ) => {
      let draftValues = { ...values };
      if (propBorrower) {
        draftValues.borrower = propBorrower.id;
      }

      // Find the borrower object from the borrowers list or use propBorrower
      let borrowerToPass = propBorrower;
      if (!borrowerToPass && draftValues.borrower && borrowers) {
        borrowerToPass = borrowers.find((b) => b.id === draftValues.borrower);
      }

      let updatedOrCreatedDraft;
      if (loanDraft?.id) {
        updatedOrCreatedDraft = await updateLoanDraft({
          id: loanDraft.id,
          expectedEditVersion: loanDraft.editVersion,
          userDetails,
          patch: {
            borrowerID: draftValues.borrower,
            loanProductID: draftValues.loanProduct || null,
            draftRecord: JSON.stringify(draftValues),
          },
        });
        if (!suppressSuccessCallback)
          setSubmitSuccess("Draft saved successfully!");
      } else {
        updatedOrCreatedDraft = await createLoanDraft({
          userDetails,
          draftRecord: draftValues,
          source: "BLANK",
          borrower: borrowerToPass,
        });
        if (!suppressSuccessCallback) {
          setSubmitSuccess("Draft created successfully!");
          if (onCreateSuccess) onCreateSuccess(updatedOrCreatedDraft);
        }
      }
      setLoanDraft(updatedOrCreatedDraft);
      if (onDraftUpdated) onDraftUpdated(updatedOrCreatedDraft);
      return updatedOrCreatedDraft;
    };

    const handleSubmit = async (values, { setSubmitting }) => {
      setSubmitError("");
      setSubmitSuccess("");
      setSubmitting(true);

      try {
        await saveDraftInternal(values);
      } catch (err) {
        console.error("Error saving draft:", err);
        setSubmitError(
          err?.message || "Failed to save draft. Please try again.",
        );
      } finally {
        setSubmitting(false);
      }
    };

    const handleSendForApproval = async () => {
      setSubmitError("");
      setSubmitSuccess("");
      setIsProcessing(true);
      try {
        let currentDraft = loanDraft;

        if (!currentDraft?.id) {
          if (formikRef.current) {
            // Validate form first? maybe not strictly needed for draft but good for "sending"
            const errors = await formikRef.current.validateForm();
            if (Object.keys(errors).length > 0) {
              formikRef.current.setTouched(errors); // mark touched to show errors
              throw new Error("Please validation errors before submitting.");
            }
            currentDraft = await saveDraftInternal(formikRef.current.values, {
              suppressSuccessCallback: false, // Let navigation happen if successfully created & drafted? No wait, this sends for approval
            });
            // Actually for "Submit for Approval" we DO want the draft creation/update flow to complete.
            // But we are chaining actions.
          } else {
            throw new Error("Save Draft first.");
          }
        }

        const updated = await transitionLoanDraftStatus({
          loanDraft: currentDraft,
          userDetails,
          nextStatus: "IN_REVIEW",
        });
        setLoanDraft(updated);

        // Notify Admins
        if (userDetails?.institutionUsersId) {
          fetchInstitutionAdmins(userDetails.institutionUsersId).then(
            (admins) => {
              // Parse draft values if needed
              let draftValues = {};
              try {
                draftValues =
                  typeof updated.draftRecord === "string"
                    ? JSON.parse(updated.draftRecord)
                    : updated.draftRecord || {};
              } catch (e) {
                console.error("Error parsing draft record for notification", e);
              }

              const bName = propBorrower
                ? `${propBorrower.firstname || ""} ${
                    propBorrower.othername || ""
                  } ${propBorrower.businessName || ""}`.trim()
                : draftValues.borrower || "Unknown";

              const loanData = {
                borrowerName: bName,
                loanAmount: draftValues.principalAmount || 0,
                loanProduct: draftValues.loanProduct || "Standard Loan",
                applicationDate: new Date().toISOString(),
                loanOfficer: `${userDetails.firstName || ""} ${
                  userDetails.lastName || ""
                }`.trim(),
                loanId: updated.id,
                borrowerId: updated.borrowerID,
              };

              admins.forEach((admin) => {
                sendLoanApprovalRequest(
                  loanData,
                  admin.id,
                  userDetails.institutionUsersId,
                ).catch((err) =>
                  console.error(
                    `Failed to notify admin ${admin.firstName}:`,
                    err,
                  ),
                );
              });
            },
          );
        }

        if (onDraftUpdated) onDraftUpdated(updated);
        setSubmitSuccess("Draft sent for approval. Admins notified.");
        setScheduleOpen(false); // Close the popup
        setIsProcessing(false);
        navigate("/loan-drafts");
      } catch (err) {
        console.error(err);
        setSubmitError(err?.message || "Failed to send for approval.");
        setIsProcessing(false);
      }
    };

    const handleConvertToLoan = async () => {
      setSubmitError("");
      setSubmitSuccess("");
      setIsProcessing(true);
      try {
        let currentDraft = loanDraft;

        if (!currentDraft?.id) {
          if (formikRef.current) {
            // Validate form heavily for Create Loan
            const errors = await formikRef.current.validateForm();
            if (Object.keys(errors).length > 0) {
              formikRef.current.setTouched(errors);
              throw new Error(
                "Please fix validation errors before creating loan.",
              );
            }
            currentDraft = await saveDraftInternal(formikRef.current.values, {
              suppressSuccessCallback: true,
            });
          } else {
            throw new Error("Save Draft first.");
          }
        }

        const loan = await convertDraftToLoan({
          loanDraft: currentDraft,
          userDetails,
        });
        const successMessage = "Loan created successfully.";
        setSubmitSuccess(successMessage);
        showNotification(successMessage, "green");
        navigate("/loans");
        return loan;
      } catch (err) {
        console.error(err);
        const errorMessage = err?.message || "Failed to create loan.";
        setSubmitError(errorMessage);
        showNotification(errorMessage, "red");
        setIsProcessing(false);
      }
    };

    const handleExportSchedule = async () => {
      setSubmitError("");
      setScheduleOpen(true);
    };

    const handleExportSummary = async () => {
      setSubmitError("");
      try {
        if (!loanDraft?.id) throw new Error("Save Draft first.");
        const full = await getLoanDraftById(loanDraft.id);
        exportLoanDraftSummaryA4({
          loanDraft: full,
          borrower: propBorrower || null,
        });
      } catch (err) {
        console.error(err);
        setSubmitError(err?.message || "Failed to export summary.");
      }
    };

    if (borrowersLoading || accountsLoading || loanFeesLoading) {
      return (
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
      );
    }

    return (
      <>
        <Formik
          innerRef={formikRef}
          initialValues={formInitialValues}
          validationSchema={baseValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {(formik) => {
            const updatedCreateLoanForm = (() => {
              const formFields = [];
              const currency = userDetails?.institution?.currencyCode || "$";

              const formatLoanFeeAmount = (loanFee, currencySym) => {
                const value =
                  loanFee?.rate !== undefined && loanFee?.rate !== null
                    ? Number(loanFee.rate).toLocaleString()
                    : "-";

                if (loanFee?.calculationMethod === "percentage") {
                  const percentageBaseLabels = {
                    principal: "Principal",
                    interest: "Interest",
                    principal_interest: "(Principal + Interest)",
                  };
                  const base =
                    percentageBaseLabels[loanFee?.percentageBase] ||
                    loanFee?.percentageBase ||
                    "";
                  return value !== "-" ? `${value}% of ${base}` : "-";
                }
                if (loanFee?.calculationMethod === "fixed") {
                  return value !== "-"
                    ? `${currencySym} ${value} (fixed)`
                    : "-";
                }
                return "-";
              };

              createLoanForm.forEach((field) => {
                if (field.name === "loanProduct") {
                  return;
                }
                if (field.name === "accountLoansId") {
                  formFields.push({
                    ...field,
                    options: (accounts || []).map((account) => ({
                      value: account.id,
                      label: account.name,
                    })),
                  });
                  return;
                }
                if (field.name === "loanFees") {
                  formFields.push({
                    ...field,
                    options: (loanFeesConfigs || []).map((loanFee) => ({
                      value: loanFee.id,
                      label: `${loanFee.name} - ${formatLoanFeeAmount(
                        loanFee,
                        currency,
                      )}`,
                    })),
                  });
                  return;
                }
                if (field.name === "loanFeesAccountId") {
                  formFields.push({
                    ...field,
                    options: (accounts || []).map((account) => ({
                      value: account.id,
                      label: account.name,
                    })),
                  });
                  return;
                }

                formFields.push(field);
              });

              return formFields;
            })();

            const totalLoanFee = (() => {
              const values = formik.values;
              if (values.loanFeesType === "custom") {
                return parseFloat(values.customLoanFeeAmount) || 0;
              }
              if (values.loanFeesType === "pre-defined" && values.loanFees) {
                const config = loanFeesConfigs.find(
                  (c) => c.id === values.loanFees,
                );
                if (config) {
                  if (config.calculationMethod === "fixed") {
                    return parseFloat(config.rate) || 0;
                  } else if (config.calculationMethod === "percentage") {
                    const principal = parseFloat(values.principalAmount) || 0;
                    return (principal * parseFloat(config.rate || 0)) / 100;
                  }
                }
              }
              return 0;
            })();

            const loanFeeSummary = (() => {
              const values = formik.values;
              if (!values?.loanFeesType || values.loanFeesType === "none") {
                return null;
              }

              if (values.loanFeesType === "custom") {
                return {
                  label: null,
                  amount: totalLoanFee || 0,
                  calculationMethod: null,
                  rate: null,
                };
              }

              if (values.loanFeesType === "pre-defined" && values.loanFees) {
                const config = loanFeesConfigs.find(
                  (c) => c.id === values.loanFees,
                );
                return {
                  label: config?.name || "Pre-defined Loan Fee",
                  amount: totalLoanFee || 0,
                  calculationMethod: config?.calculationMethod || null,
                  rate: config?.rate || null,
                };
              }

              if (values.loanFeesType === "pre-defined") {
                return {
                  label: "Pre-defined Loan Fee",
                  amount: totalLoanFee || 0,
                  calculationMethod: null,
                  rate: null,
                };
              }

              return null;
            })();

            return (
              <Form>
                <WorkingOverlay
                  open={formik.isSubmitting || isProcessing}
                  message={
                    isProcessing
                      ? isPrivileged
                        ? "Creating Loan..."
                        : "Submitting..."
                      : "Saving draft..."
                  }
                />

                <CustomPopUp
                  open={scheduleOpen}
                  onClose={() => setScheduleOpen(false)}
                  title="Loan Draft"
                  showEdit={false}
                  showDelete={false}
                  maxWidth="lg"
                >
                  <LoanScheduleDraft
                    loanDraft={loanDraft}
                    draftValues={formik.values}
                    borrower={propBorrower || null}
                    userDetails={userDetails}
                    currency={userDetails?.institution?.currencyCode || "$"}
                    readOnly={readOnly}
                    onEdit={() => setScheduleOpen(false)}
                    onSaveDraft={() => formik.submitForm()}
                    setDraftField={formik.setFieldValue}
                    onSendForApproval={handleSendForApproval}
                    onConfirmCreateLoan={
                      isPrivileged ? handleConvertToLoan : handleSendForApproval
                    }
                    createButtonText={
                      isPrivileged ? "CREATE LOAN" : "SUBMIT FOR APPROVAL"
                    }
                    totalLoanFee={totalLoanFee}
                    loanFeeSummary={loanFeeSummary}
                    isEditDraftFlow={false}
                  />
                </CustomPopUp>

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
                      if (field.dependsOn && field.dependsOnValue) {
                        const dependencyValue = formik.values[field.dependsOn];
                        const allowed = Array.isArray(field.dependsOnValue)
                          ? field.dependsOnValue
                          : [field.dependsOnValue];
                        if (!allowed.includes(dependencyValue)) return null;
                      }

                      let helperText = field.helperText;
                      if (field.dynamicHelperText && field.name) {
                        const currentValue = formik.values[field.name];
                        if (
                          currentValue &&
                          field.dynamicHelperText[currentValue]
                        ) {
                          helperText = field.dynamicHelperText[currentValue];
                        }
                      }

                      const fieldRenderProps = {
                        ...field,
                        helperText,
                        formik,
                        editing: !readOnly,
                        readOnly,
                      };

                      return (
                        <FormGrid
                          size={{ xs: 12, md: field.span }}
                          key={`${field.name}-${index}`}
                        >
                          {renderFormField(fieldRenderProps, formik.values)}
                        </FormGrid>
                      );
                    })}

                    {!readOnly && (
                      <>
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
                          {!hideCancel && (
                            <PlusButtonMain
                              buttonText="CANCEL"
                              variant="outlined"
                              startIcon={null}
                              color={theme.palette.error.main}
                              onClick={() => {
                                formik.resetForm();
                                setSubmitError("");
                                setSubmitSuccess("");
                                if (onClose) onClose();
                              }}
                              disabled={formik.isSubmitting}
                            />
                          )}
                          <PlusButtonMain
                            buttonText="VIEW LOAN SCHEDULE"
                            variant="outlined"
                            startIcon={null}
                            onClick={handleExportSchedule}
                            disabled={formik.isSubmitting}
                          />
                        </Box>
                      </>
                    )}

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
            );
          }}
        </Formik>
      </>
    );
  },
);

CreateLoan.displayName = "CreateLoan";

export default CreateLoan;
