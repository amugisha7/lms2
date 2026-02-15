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
import DropDownSearchable from "../../../Resources/FormComponents/DropDownSearchable";
import OrderedList from "../../../Resources/FormComponents/OrderedList";
import CreateFormButtons from "../../../ModelAssets/CreateFormButtons";
import PlusButtonMain from "../../../ModelAssets/PlusButtonMain";
import { UserContext } from "../../../App";
import {
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
import { Settings } from "@mui/icons-material";

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

baseInitialValues.loanProduct = "";

const buildValidationSchema = () => {
  const validationShape = {
    borrower: Yup.string().required("Borrower is required"),
    loanProduct: Yup.string().required("Loan Product is required"),
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

  // Compute dynamic helper text if provided
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
      if (field.name === "borrower" || field.name === "loanProduct") {
        return (
          <DropDownSearchable
            {...fieldProps}
            label={displayLabel}
            helperText={computedHelperText}
            value={field.formik?.values?.[field.name] || ""}
            onChange={
              fieldProps.onChange
                ? fieldProps.onChange
                : (e) => field.formik?.setFieldValue(field.name, e.target.value)
            }
          />
        );
      }
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

const normalizeEnumKey = (value) => {
  if (value === null || value === undefined) return value;
  const raw = String(value).trim();
  if (!raw) return raw;
  return raw
    .toLowerCase()
    .replace(/\//g, " ")
    .replace(/-/g, "_")
    .replace(/\s+/g, "_");
};

const coerceNumber = (value) => {
  if (value === null || value === undefined || value === "") return value;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : value;
};

const hasNonEmptyString = (value) => {
  if (value === null || value === undefined) return false;
  return String(value).trim().length > 0;
};

const applyLoanProductTemplateToFormik = (loanProduct, formik) => {
  if (!loanProduct || !formik) return;

  const normalizeInterestType = (v) => {
    const key = normalizeEnumKey(v);
    if (!key) return v;
    if (key === "percent" || key === "percentage" || key === "percent_based") {
      return "percentage";
    }
    if (key === "fixed" || key === "fixed_amount") return "fixed";
    return key;
  };

  const normalizeDurationPeriod = (v) => {
    const key = normalizeEnumKey(v);
    if (!key) return v;
    if (["day", "days"].includes(key)) return "days";
    if (["week", "weeks"].includes(key)) return "weeks";
    if (["month", "months"].includes(key)) return "months";
    if (["year", "years"].includes(key)) return "years";
    return key;
  };

  const normalizeRepaymentFrequency = (v) => {
    const key = normalizeEnumKey(v);
    if (!key) return v;
    const map = {
      bi_weekly: "biweekly",
      biweekly: "biweekly",
      bi_monthly: "bimonthly",
      bimonthly: "bimonthly",
      every_4_month: "every_4_months",
      every_4_months: "every_4_months",
      every_9_month: "every_9_months",
      every_9_months: "every_9_months",
      semi_annual: "semi_annual",
      semi_annually: "semi_annual",
      semiannually: "semi_annual",
      one_off: "lump_sum",
      one_off_lump_sum: "lump_sum",
      lump_sum: "lump_sum",
    };
    return map[key] || key;
  };

  const normalizeInterestPeriod = (v) => {
    const key = normalizeEnumKey(v);
    if (!key) return v;
    // LoanProduct uses per_loan_cycle but Loan form expects per_loan
    if (key === "per_loan_cycle") return "per_loan";
    return key;
  };

  const yesNo = (v) => {
    if (v === true) return "yes";
    if (v === false) return "no";
    const key = normalizeEnumKey(v);
    if (key === "yes" || key === "no") return key;
    return v;
  };

  const nextValues = { ...formik.values };

  // Always keep selected product id
  nextValues.loanProduct = loanProduct.id;

  if (
    loanProduct.principalAmountDefault !== null &&
    loanProduct.principalAmountDefault !== undefined
  ) {
    nextValues.principalAmount = coerceNumber(
      loanProduct.principalAmountDefault,
    );
  }
  if (
    loanProduct.interestCalculationMethod !== null &&
    loanProduct.interestCalculationMethod !== undefined
  ) {
    if (hasNonEmptyString(loanProduct.interestCalculationMethod)) {
      nextValues.interestMethod = loanProduct.interestCalculationMethod;
    }
  }
  if (
    loanProduct.interestType !== null &&
    loanProduct.interestType !== undefined
  ) {
    if (hasNonEmptyString(loanProduct.interestType)) {
      nextValues.interestType = normalizeInterestType(loanProduct.interestType);
    }
  }
  if (
    loanProduct.interestRateDefault !== null &&
    loanProduct.interestRateDefault !== undefined
  ) {
    nextValues.interestRate = coerceNumber(loanProduct.interestRateDefault);
  }
  if (
    loanProduct.interestPeriod !== null &&
    loanProduct.interestPeriod !== undefined
  ) {
    if (hasNonEmptyString(loanProduct.interestPeriod)) {
      nextValues.interestPeriod = normalizeInterestPeriod(
        loanProduct.interestPeriod,
      );
    }
  }
  if (
    loanProduct.termDurationDefault !== null &&
    loanProduct.termDurationDefault !== undefined
  ) {
    nextValues.loanDuration = coerceNumber(loanProduct.termDurationDefault);
  }
  if (
    loanProduct.durationPeriod !== null &&
    loanProduct.durationPeriod !== undefined
  ) {
    if (hasNonEmptyString(loanProduct.durationPeriod)) {
      nextValues.durationPeriod = normalizeDurationPeriod(
        loanProduct.durationPeriod,
      );
    }
  }
  if (
    loanProduct.repaymentFrequency !== null &&
    loanProduct.repaymentFrequency !== undefined
  ) {
    if (hasNonEmptyString(loanProduct.repaymentFrequency)) {
      const normalized = normalizeRepaymentFrequency(
        loanProduct.repaymentFrequency,
      );
      if (normalized === "lump_sum") {
        nextValues.repaymentFrequencyType = "lumpSum";
        nextValues.repaymentFrequency = "";
      } else {
        nextValues.repaymentFrequencyType = "interval";
        nextValues.repaymentFrequency = normalized;
      }
      // Clear any custom schedule selections when using interval templates
      nextValues.customPaymentDays = [];
      nextValues.customPaymentDates = [];
    }
  }

  if (
    loanProduct.extendLoanAfterMaturity !== null &&
    loanProduct.extendLoanAfterMaturity !== undefined
  ) {
    nextValues.extendLoanAfterMaturity = yesNo(
      loanProduct.extendLoanAfterMaturity,
    );
  }
  if (
    loanProduct.interestTypeMaturity !== null &&
    loanProduct.interestTypeMaturity !== undefined
  ) {
    if (hasNonEmptyString(loanProduct.interestTypeMaturity)) {
      nextValues.interestTypeMaturity = normalizeInterestType(
        loanProduct.interestTypeMaturity,
      );
    }
  }
  if (
    loanProduct.calculateInterestOn !== null &&
    loanProduct.calculateInterestOn !== undefined
  ) {
    if (hasNonEmptyString(loanProduct.calculateInterestOn)) {
      nextValues.calculateInterestOn = loanProduct.calculateInterestOn;
    }
  }
  if (
    loanProduct.loanInterestRateAfterMaturity !== null &&
    loanProduct.loanInterestRateAfterMaturity !== undefined
  ) {
    nextValues.loanInterestRateAfterMaturity = coerceNumber(
      loanProduct.loanInterestRateAfterMaturity,
    );
  }
  if (
    loanProduct.recurringPeriodAfterMaturityUnit !== null &&
    loanProduct.recurringPeriodAfterMaturityUnit !== undefined
  ) {
    if (hasNonEmptyString(loanProduct.recurringPeriodAfterMaturityUnit)) {
      nextValues.recurringPeriodAfterMaturityUnit =
        loanProduct.recurringPeriodAfterMaturityUnit;
    }
  }

  // Loan Fees Config template
  // LoanProduct -> loanFeesConfigs is an association (LoanProductLoanFeesConfig)
  // We default to the first active associated config.
  const loanFeesConfigItems = Array.isArray(loanProduct?.loanFeesConfigs?.items)
    ? loanProduct.loanFeesConfigs.items
    : Array.isArray(loanProduct?.loanFeesConfigs)
      ? loanProduct.loanFeesConfigs
      : [];

  const firstActiveFeeConfigAssoc =
    loanFeesConfigItems.find(
      (i) => (i?.loanFeesConfig?.status || "").toLowerCase() === "active",
    ) || loanFeesConfigItems[0];

  const loanFeesConfigIdFromProduct =
    firstActiveFeeConfigAssoc?.loanFeesConfigId ||
    firstActiveFeeConfigAssoc?.loanFeesConfig?.id;

  if (loanFeesConfigIdFromProduct) {
    nextValues.loanFeesType = "pre-defined";
    nextValues.loanFees = loanFeesConfigIdFromProduct;
    nextValues.customLoanFeeAmount = "";
  }

  // Repayment order exists on the product but is not a field in the loan create form currently.
  // Keep it on values only if the loan form expects it later.
  // (No-op here by design.)

  formik.setValues(nextValues);
};

const UseLoanProduct = forwardRef(
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
      loanProducts,
      loanProductsLoading,
      readOnly = false,
      draftId,
      onDraftUpdated,
    },
    ref,
  ) => {
    const { userDetails } = useContext(UserContext);
    const navigate = useNavigate();
    const theme = useTheme();
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState("");
    const [loanDraft, setLoanDraft] = useState(null);
    const [termsSnapshot, setTermsSnapshot] = useState(null);

    const [scheduleOpen, setScheduleOpen] = useState(false);
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
          const ts = draft?.termsSnapshot;
          if (ts) {
            try {
              setTermsSnapshot(JSON.parse(ts));
            } catch {
              setTermsSnapshot(null);
            }
          }
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

      if (propBorrower) {
        base.borrower =
          `${propBorrower.firstname || ""} ${propBorrower.othername || ""} ${
            propBorrower.businessName || ""
          }`.trim() || propBorrower.uniqueIdNumber;
      }
      return base;
    }, [propInitialValues, propBorrower]);

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
            ...(termsSnapshot
              ? { termsSnapshot: JSON.stringify(termsSnapshot) }
              : {}),
          },
        });
        if (!suppressSuccessCallback)
          setSubmitSuccess("Draft saved successfully!");
      } else {
        updatedOrCreatedDraft = await createLoanDraft({
          userDetails,
          draftRecord: draftValues,
          source: "TEMPLATE",
          termsSnapshot,
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

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
      setSubmitError("");
      setSubmitSuccess("");
      setSubmitting(true);

      try {
        await saveDraftInternal(values);
      } catch (err) {
        console.error("Error saving draft:", err);
        setSubmitError(
          err.message || "Failed to save draft. Please try again.",
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
            const errors = await formikRef.current.validateForm();
            if (Object.keys(errors).length > 0) {
              formikRef.current.setTouched(errors);
              throw new Error("Please validation errors before submitting.");
            }
            currentDraft = await saveDraftInternal(formikRef.current.values, {
              suppressSuccessCallback: false, // Let navigation happen if successfully created & drafted?
            });
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
        setScheduleOpen(false);
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
        setSubmitSuccess("Draft converted to loan.");
        navigate("/loans");
        return loan;
      } catch (err) {
        console.error(err);
        setSubmitError(err?.message || "Failed to convert to loan.");
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

    if (borrowersLoading || loanProductsLoading) {
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

    // Show loading state if we still need fee configs for dropdown options
    if (loanFeesLoading) {
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
              No borrowers found.
            </Typography>
          </Box>
        )}
        {loanProducts.length === 0 ? (
          <Box
            sx={{
              mb: 3,
              p: 2,
              //   backgroundColor: "#fff3cd",
              border: "1px solid",
              borderRadius: 1,
            }}
          >
            <Typography>No loan products found.</Typography>
            <Box sx={{ mt: 1 }}>
              <FormLinkText
                linkText="Manage Loan Products"
                linkUrl="/admin/loan-products"
                icon={Settings}
              />
            </Box>
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 2 }}>
              <FormLinkText
                linkText="Manage Loan Products"
                linkUrl="/admin/loan-products"
                icon={Settings}
              />
            </Box>
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

                  // Add Loan Product field at the top
                  formFields.push({
                    label: "Loan Product",
                    name: "loanProduct",
                    type: "select",
                    required: true,
                    span: 12,
                    options: (loanProducts || [])
                      .filter(
                        (p) => (p?.status || "").toLowerCase() === "active",
                      )
                      .map((product) => ({
                        value: product.id,
                        label: product.name,
                      })),
                    helperText:
                      "Select a loan product to auto-populate fields.",
                    onChange: (e, formik) => {
                      const selectedProductId = e.target.value;
                      const selectedProduct = loanProducts.find(
                        (p) => p.id === selectedProductId,
                      );
                      if (!selectedProduct) {
                        formik.setFieldValue("loanProduct", selectedProductId);
                        return;
                      }

                      setTermsSnapshot(selectedProduct);

                      applyLoanProductTemplateToFormik(selectedProduct, formik);
                    },
                  });

                  if (formik.values.loanProduct) {
                    createLoanForm.forEach((field) => {
                      if (field.name === "loanProduct") {
                        // Skip original loanProduct field as we added it manually
                        return;
                      }

                      if (field.name === "loanFees") {
                        const currency =
                          userDetails?.institution?.currencyCode || "$";
                        const formatLoanFeeAmount = (loanFee, currencySym) => {
                          const value =
                            loanFee?.rate !== undefined &&
                            loanFee?.rate !== null
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

                      formFields.push(field);
                    });
                  }

                  return formFields;
                })();

                const totalLoanFee = (() => {
                  const values = formik.values;
                  if (values.loanFeesType === "custom") {
                    return parseFloat(values.customLoanFeeAmount) || 0;
                  }
                  if (
                    values.loanFeesType === "pre-defined" &&
                    values.loanFees
                  ) {
                    const config = loanFeesConfigs.find(
                      (c) => c.id === values.loanFees,
                    );
                    if (config) {
                      if (config.calculationMethod === "fixed") {
                        return parseFloat(config.rate) || 0;
                      } else if (config.calculationMethod === "percentage") {
                        const principal =
                          parseFloat(values.principalAmount) || 0;
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

                  if (
                    values.loanFeesType === "pre-defined" &&
                    values.loanFees
                  ) {
                    const config = loanFeesConfigs.find(
                      (c) => c.id === values.loanFees,
                    );
                    return {
                      label: config?.name || "Loan Fee",
                      amount: totalLoanFee || 0,
                      calculationMethod: config?.calculationMethod || null,
                      rate: config?.rate || null,
                    };
                  }

                  if (values.loanFeesType === "pre-defined") {
                    return {
                      label: "Loan Fee",
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
                          isPrivileged
                            ? handleConvertToLoan
                            : handleSendForApproval
                        }
                        createButtonText={
                          isPrivileged ? "CREATE LOAN" : "SUBMIT FOR APPROVAL"
                        }
                        totalLoanFee={totalLoanFee}
                        loanFeeSummary={loanFeeSummary}
                        branchAccounts={
                          propBorrower?.branchBorrowersId &&
                          loanDraft?.borrower?.branch?.accounts?.items
                            ? loanDraft.borrower.branch.accounts.items
                                .map((item) => item.account)
                                .filter(
                                  (account) =>
                                    account?.id &&
                                    account?.name &&
                                    (account.status === "active" ||
                                      account.status === "system"),
                                )
                            : []
                        }
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
                          // Respect field dependencies
                          if (field.dependsOn && field.dependsOnValue) {
                            const dependencyValue =
                              formik.values[field.dependsOn];
                            if (dependencyValue !== field.dependsOnValue) {
                              return null;
                            }
                          }

                          let helperText = field.helperText;
                          if (field.dynamicHelperText && field.name) {
                            const currentValue = formik.values[field.name];
                            if (
                              currentValue &&
                              field.dynamicHelperText[currentValue]
                            ) {
                              helperText =
                                field.dynamicHelperText[currentValue];
                            }
                          }

                          const fieldRenderProps = {
                            ...field,
                            helperText,
                            formik,
                            editing: !readOnly,
                            readOnly,
                            ...(field.onChange
                              ? {
                                  onChange: (e) => field.onChange(e, formik),
                                }
                              : {}),
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
                        {!readOnly && formik.values.loanProduct && (
                          <>
                            <Box
                              sx={{
                                display: "flex",
                                pr: 2,
                                justifyContent: {
                                  xs: "center",
                                  md: "flex-end",
                                },
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
                        {formik.values.loanProduct && submitError && (
                          <Typography color="error" sx={{ mt: 2 }}>
                            {submitError}
                          </Typography>
                        )}
                        {formik.values.loanProduct && submitSuccess && (
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
        )}
      </>
    );
  },
);

UseLoanProduct.displayName = "UseLoanProduct";

export default UseLoanProduct;
