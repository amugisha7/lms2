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
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import editLoanForm from "./editLoanForm";
import TextInput from "../../../Resources/FormComponents/TextInput";
import Dropdown from "../../../Resources/FormComponents/Dropdown";
import OrderedList from "../../../Resources/FormComponents/OrderedList";
import FormLabel from "../../../Resources/FormComponents/FormLabel";
import FormLinkText from "../../../Resources/FormComponents/FormLinkText";
import RadioGroup from "../../../Resources/FormComponents/RadioGroup";
import RadioGroupNoLabel from "../../../Resources/FormComponents/RadioGroupNoLabel";
import TextAndRadio from "../../../Resources/FormComponents/TextAndRadio";
import TextAndDropdown from "../../../Resources/FormComponents/TextAndDropdown";
import MultipleDropDown from "../../../Resources/FormComponents/MultipleDropDown";

import PlusButtonMain from "../../../ModelAssets/PlusButtonMain";
import PlusButtonSmall from "../../../ModelAssets/PlusButtonSmall";
import CustomEditFormButtons from "../../../ModelAssets/CustomEditFormButtons";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WorkingOverlay from "../../../ModelAssets/WorkingOverlay";
import CustomPopUp from "../../../ModelAssets/CustomPopUp";
import LoanScheduleDraft from "../LoanDrafts/LoanScheduleDraft";

import { UserContext } from "../../../App";
import {
  updateLoanDraft,
  transitionLoanDraftStatus,
  convertDraftToLoan,
} from "../LoanDrafts/loanDraftHelpers";
import {
  fetchAccounts,
  fetchLoanFeesConfig,
  fetchInstitutionAdmins,
} from "../CreateLoan/createLoanHelpers";
import { sendLoanApprovalRequest } from "../../../Screens/Notifications/notificationsAPI";

const FormGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.up("md")]: {
    paddingRight: "20px",
  },
}));

const baseInitialValues = editLoanForm.reduce((acc, field) => {
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
  } else if (field.name) {
    acc[field.name] =
      field.defaultValue !== undefined ? field.defaultValue : "";
  }
  return acc;
}, {});

// display-only helpers for drafts
baseInitialValues.borrowerName = "";
baseInitialValues.loanProductName = "";

const buildValidationSchema = () => {
  // Match CreateLoan validation behavior
  return Yup.object().shape({
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
  });
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
          disabled={!field.editing}
        />
      );
    case "select":
      return (
        <Dropdown
          {...fieldProps}
          label={displayLabel}
          helperText={computedHelperText}
          disabled={!field.editing}
        />
      );
    case "selectMultiple":
      return (
        <MultipleDropDown
          {...fieldProps}
          label={displayLabel}
          helperText={computedHelperText}
          disabled={!field.editing}
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
      return (
        <RadioGroup
          {...fieldProps}
          helperText={computedHelperText}
          disabled={!field.editing}
        />
      );
    case "radioNoLabel":
      return <RadioGroupNoLabel {...fieldProps} disabled={!field.editing} />;
    case "textAndRadio":
      return (
        <TextAndRadio
          {...fieldProps}
          textLabel={displayLabel}
          editing={field.editing}
          readOnly={!field.editing}
          disabled={!field.editing}
        />
      );
    case "textAndDropdown":
      return (
        <TextAndDropdown
          {...fieldProps}
          textLabel={displayTextLabel}
          editing={field.editing}
          readOnly={!field.editing}
          disabled={!field.editing}
        />
      );
    default:
      return <TextInput {...fieldProps} disabled={!field.editing} />;
  }
};

const EditLoan = forwardRef(
  (
    {
      onEditSuccess,
      initialValues: propInitialValues,
      isEditMode = true,
      onCancel,
      readOnlyFields = [],
      loanDraft,
    },
    ref,
  ) => {
    const { userDetails } = useContext(UserContext);
    const theme = useTheme();
    const navigate = useNavigate();

    const isPrivileged = React.useMemo(() => {
      const type = userDetails?.userType;
      return type?.toLowerCase() === "admin" || type === "branchManager";
    }, [userDetails]);
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState("");
    const [editMode, setEditMode] = useState(isEditMode);
    const [scheduleOpen, setScheduleOpen] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [accountsLoading, setAccountsLoading] = useState(false);
    const [loanFeesConfigs, setLoanFeesConfigs] = useState([]);
    const [loanFeesLoading, setLoanFeesLoading] = useState(false);
    const [localDraft, setLocalDraft] = useState(loanDraft || null);

    useEffect(() => {
      setLocalDraft(loanDraft || null);
    }, [loanDraft]);

    const normalizedStatus = (() => {
      const raw =
        localDraft?.status ??
        localDraft?.approvalStatusEnum ??
        localDraft?.loanStatusEnum ??
        localDraft?.loanStatus ??
        "";
      return String(raw || "")
        .trim()
        .toUpperCase();
    })();

    const canEditDraft =
      normalizedStatus === "DRAFT" || normalizedStatus === "REJECTED";

    const readOnly = Boolean(localDraft) && !canEditDraft;

    useEffect(() => {
      if (readOnly) setEditMode(false);
    }, [readOnly]);

    useEffect(() => {
      const currentInstitutionId = userDetails?.institutionUsersId;
      if (!currentInstitutionId) return;

      setAccountsLoading(true);
      fetchAccounts(currentInstitutionId)
        .then((data) => {
          const activeAccounts = Array.isArray(data)
            ? data.filter((a) => a && a.status === "active")
            : [];
          setAccounts(activeAccounts);
        })
        .catch((err) => {
          console.error("Error fetching accounts:", err);
        })
        .finally(() => {
          setAccountsLoading(false);
        });
    }, [userDetails?.institutionUsersId]);

    useEffect(() => {
      const currentInstitutionId = userDetails?.institutionUsersId;
      if (!currentInstitutionId) return;

      setLoanFeesLoading(true);
      fetchLoanFeesConfig(currentInstitutionId)
        .then((data) => {
          setLoanFeesConfigs(Array.isArray(data) ? data : []);
        })
        .catch((err) => {
          console.error("Error fetching loan fees configs:", err);
        })
        .finally(() => {
          setLoanFeesLoading(false);
        });
    }, [userDetails?.institutionUsersId]);

    const formInitialValues = propInitialValues
      ? {
          ...baseInitialValues,
          ...propInitialValues,
        }
      : { ...baseInitialValues };

    // Ensure accounts defaults are set (CreateLoan behavior)
    if (accounts.length > 0 && !formInitialValues.accountLoansId) {
      formInitialValues.accountLoansId = accounts[0].id;
    }
    if (accounts.length > 0 && !formInitialValues.loanFeesAccountId) {
      formInitialValues.loanFeesAccountId = accounts[0].id;
    }

    useImperativeHandle(ref, () => ({
      toggleEdit: () => {
        setEditMode((prev) => !prev);
      },
      getEditMode: () => editMode,
    }));

    const updatedEditLoanForm = React.useMemo(() => {
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
          return value !== "-" ? `${currencySym} ${value} (fixed)` : "-";
        }
        return "-";
      };

      return editLoanForm
        .filter((field) => field?.name !== "loanProduct")
        .map((field) => {
          if (field.name === "accountLoansId") {
            return {
              ...field,
              options: (accounts || []).map((account) => ({
                value: account.id,
                label: account.name,
              })),
            };
          }

          if (field.name === "loanFees") {
            return {
              ...field,
              options: (loanFeesConfigs || []).map((loanFee) => ({
                value: loanFee.id,
                label: `${loanFee.name} - ${formatLoanFeeAmount(
                  loanFee,
                  currency,
                )}`,
              })),
            };
          }

          if (field.name === "loanFeesAccountId") {
            return {
              ...field,
              options: (accounts || []).map((account) => ({
                value: account.id,
                label: account.name,
              })),
            };
          }

          return field;
        });
    }, [accounts, loanFeesConfigs, userDetails?.institution]);

    const handleSubmit = async (values, { setSubmitting }) => {
      setSubmitError("");
      setSubmitSuccess("");
      setSubmitting(true);

      try {
        if (!localDraft?.id) throw new Error("Missing draft context");

        const { borrowerName, loanProductName, ...draftRecord } = values;

        const updated = await updateLoanDraft({
          id: localDraft.id,
          expectedEditVersion: localDraft.editVersion,
          userDetails,
          patch: {
            borrowerID: localDraft.borrowerID,
            loanProductID: localDraft.loanProductID || null,
            draftRecord: JSON.stringify(draftRecord),
          },
        });

        setLocalDraft((prev) => ({
          ...updated,
          borrower: prev?.borrower || localDraft?.borrower || null,
          loanProduct: prev?.loanProduct || localDraft?.loanProduct || null,
        }));
        setSubmitSuccess("Draft saved successfully!");
        setEditMode(false);
        if (onEditSuccess) onEditSuccess(updated);
      } catch (err) {
        console.error("Error updating loan:", err);
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
      try {
        if (!localDraft?.id) throw new Error("Save Draft first.");

        // 1. Transition
        const updated = await transitionLoanDraftStatus({
          loanDraft: localDraft,
          userDetails,
          nextStatus: "SENT_FOR_APPROVAL",
        });

        const newLocalDraft = {
          ...updated,
          borrower: localDraft?.borrower || null,
          loanProduct: localDraft?.loanProduct || null,
        };
        setLocalDraft(newLocalDraft);

        // 2. Notify Admins
        if (userDetails?.institutionUsersId) {
          fetchInstitutionAdmins(userDetails.institutionUsersId).then(
            (admins) => {
              let draftValues = {};
              try {
                draftValues =
                  typeof updated.draftRecord === "string"
                    ? JSON.parse(updated.draftRecord)
                    : updated.draftRecord || {};
              } catch (e) {
                console.error("Error parsing draft record for notification", e);
              }

              const borrowerObj = localDraft?.borrower;

              const bName = borrowerObj
                ? `${borrowerObj.firstname || ""} ${
                    borrowerObj.othername || ""
                  } ${borrowerObj.businessName || ""}`.trim()
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

        setSubmitSuccess("Draft sent for approval. Admins notified.");
        setScheduleOpen(false);
      } catch (err) {
        console.error(err);
        setSubmitError(err?.message || "Failed to send for approval.");
      }
    };

    const handleConvertToLoan = async () => {
      setSubmitError("");
      setSubmitSuccess("");
      try {
        if (!localDraft?.id) throw new Error("Save Draft first.");
        await convertDraftToLoan({ loanDraft: localDraft, userDetails });
        setSubmitSuccess("Draft converted to loan.");
        navigate("/loans");
      } catch (err) {
        console.error(err);
        setSubmitError(err?.message || "Failed to convert to loan.");
      }
    };

    const handleOpenSchedule = () => {
      setSubmitError("");
      setScheduleOpen(true);
    };

    if (accountsLoading || loanFeesLoading) {
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
          initialValues={formInitialValues}
          validationSchema={baseValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {(formik) => {
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
                {!editMode && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      mb: 1,
                      gap: 1,
                    }}
                  >
                    <PlusButtonSmall
                      variant="outlined"
                      label="BACK"
                      IconComponent={ArrowBackIcon}
                      onClick={() => {
                        if (onCancel) onCancel();
                        else navigate(-1);
                      }}
                    />
                    {!readOnly && (
                      <PlusButtonSmall
                        variant="outlined"
                        label="EDIT"
                        IconComponent={EditIcon}
                        onClick={() => setEditMode(true)}
                      />
                    )}
                  </Box>
                )}

                {editMode && !readOnly && (
                  <CustomEditFormButtons
                    formik={formik}
                    setEditMode={setEditMode}
                    setSubmitError={setSubmitError}
                    setSubmitSuccess={setSubmitSuccess}
                  />
                )}

                <WorkingOverlay
                  open={formik.isSubmitting}
                  message="Saving draft..."
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
                    loanDraft={localDraft}
                    draftValues={formik.values}
                    borrower={localDraft?.borrower || null}
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
                    isEditDraftFlow={true}
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
                    <FormGrid size={{ xs: 12, md: 12 }}>
                      <TextInput
                        label="Borrower"
                        name="borrowerName"
                        type="text"
                        helperText="Borrower is fixed for a draft."
                        disabled
                      />
                    </FormGrid>
                    <FormGrid size={{ xs: 12, md: 12 }}>
                      <TextInput
                        label="Loan Product"
                        name="loanProductName"
                        type="text"
                        helperText="Loan Product is read-only for a draft."
                        disabled
                      />
                    </FormGrid>

                    {updatedEditLoanForm.map((field, index) => {
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

                      const isFieldReadOnly =
                        readOnly || readOnlyFields.includes(field.name);
                      const fieldEditing = editMode && !isFieldReadOnly;

                      const fieldRenderProps = {
                        ...field,
                        helperText,
                        formik,
                        editing: fieldEditing,
                        readOnly: isFieldReadOnly,
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
                        onClick={handleOpenSchedule}
                        disabled={formik.isSubmitting}
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
            );
          }}
        </Formik>
      </>
    );
  },
);

EditLoan.displayName = "EditLoan";

export default EditLoan;
