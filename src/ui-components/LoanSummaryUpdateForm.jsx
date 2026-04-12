/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Button,
  Flex,
  Grid,
  SelectField,
  TextField,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getLoanSummary } from "../graphql/queries";
import { updateLoanSummary } from "../graphql/mutations";
const client = generateClient();
export default function LoanSummaryUpdateForm(props) {
  const {
    id: idProp,
    loanSummary: loanSummaryModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    loanID: "",
    refreshScope: "",
    institutionID: "",
    branchID: "",
    borrowerID: "",
    borrowerDisplayName: "",
    borrowerDisplayNameNormalized: "",
    borrowerPhone: "",
    loanNumber: "",
    loanOfficerID: "",
    loanOfficerDisplayName: "",
    loanProductID: "",
    loanProductName: "",
    principalAmount: "",
    totalPaidAmount: "",
    amountDueAmount: "",
    loanBalanceAmount: "",
    arrearsAmount: "",
    missedInstallmentCount: "",
    nextDueDate: "",
    lastPaymentDate: "",
    startDate: "",
    maturityDateEffective: "",
    lifecycleStatus: "",
    displayStatus: "",
    displayStatusRank: "",
    displayStatusComputedAt: "",
    nextStatusTransitionAt: "",
    currencyCode: "",
  };
  const [loanID, setLoanID] = React.useState(initialValues.loanID);
  const [refreshScope, setRefreshScope] = React.useState(
    initialValues.refreshScope
  );
  const [institutionID, setInstitutionID] = React.useState(
    initialValues.institutionID
  );
  const [branchID, setBranchID] = React.useState(initialValues.branchID);
  const [borrowerID, setBorrowerID] = React.useState(initialValues.borrowerID);
  const [borrowerDisplayName, setBorrowerDisplayName] = React.useState(
    initialValues.borrowerDisplayName
  );
  const [borrowerDisplayNameNormalized, setBorrowerDisplayNameNormalized] =
    React.useState(initialValues.borrowerDisplayNameNormalized);
  const [borrowerPhone, setBorrowerPhone] = React.useState(
    initialValues.borrowerPhone
  );
  const [loanNumber, setLoanNumber] = React.useState(initialValues.loanNumber);
  const [loanOfficerID, setLoanOfficerID] = React.useState(
    initialValues.loanOfficerID
  );
  const [loanOfficerDisplayName, setLoanOfficerDisplayName] = React.useState(
    initialValues.loanOfficerDisplayName
  );
  const [loanProductID, setLoanProductID] = React.useState(
    initialValues.loanProductID
  );
  const [loanProductName, setLoanProductName] = React.useState(
    initialValues.loanProductName
  );
  const [principalAmount, setPrincipalAmount] = React.useState(
    initialValues.principalAmount
  );
  const [totalPaidAmount, setTotalPaidAmount] = React.useState(
    initialValues.totalPaidAmount
  );
  const [amountDueAmount, setAmountDueAmount] = React.useState(
    initialValues.amountDueAmount
  );
  const [loanBalanceAmount, setLoanBalanceAmount] = React.useState(
    initialValues.loanBalanceAmount
  );
  const [arrearsAmount, setArrearsAmount] = React.useState(
    initialValues.arrearsAmount
  );
  const [missedInstallmentCount, setMissedInstallmentCount] = React.useState(
    initialValues.missedInstallmentCount
  );
  const [nextDueDate, setNextDueDate] = React.useState(
    initialValues.nextDueDate
  );
  const [lastPaymentDate, setLastPaymentDate] = React.useState(
    initialValues.lastPaymentDate
  );
  const [startDate, setStartDate] = React.useState(initialValues.startDate);
  const [maturityDateEffective, setMaturityDateEffective] = React.useState(
    initialValues.maturityDateEffective
  );
  const [lifecycleStatus, setLifecycleStatus] = React.useState(
    initialValues.lifecycleStatus
  );
  const [displayStatus, setDisplayStatus] = React.useState(
    initialValues.displayStatus
  );
  const [displayStatusRank, setDisplayStatusRank] = React.useState(
    initialValues.displayStatusRank
  );
  const [displayStatusComputedAt, setDisplayStatusComputedAt] = React.useState(
    initialValues.displayStatusComputedAt
  );
  const [nextStatusTransitionAt, setNextStatusTransitionAt] = React.useState(
    initialValues.nextStatusTransitionAt
  );
  const [currencyCode, setCurrencyCode] = React.useState(
    initialValues.currencyCode
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = loanSummaryRecord
      ? { ...initialValues, ...loanSummaryRecord }
      : initialValues;
    setLoanID(cleanValues.loanID);
    setRefreshScope(cleanValues.refreshScope);
    setInstitutionID(cleanValues.institutionID);
    setBranchID(cleanValues.branchID);
    setBorrowerID(cleanValues.borrowerID);
    setBorrowerDisplayName(cleanValues.borrowerDisplayName);
    setBorrowerDisplayNameNormalized(cleanValues.borrowerDisplayNameNormalized);
    setBorrowerPhone(cleanValues.borrowerPhone);
    setLoanNumber(cleanValues.loanNumber);
    setLoanOfficerID(cleanValues.loanOfficerID);
    setLoanOfficerDisplayName(cleanValues.loanOfficerDisplayName);
    setLoanProductID(cleanValues.loanProductID);
    setLoanProductName(cleanValues.loanProductName);
    setPrincipalAmount(cleanValues.principalAmount);
    setTotalPaidAmount(cleanValues.totalPaidAmount);
    setAmountDueAmount(cleanValues.amountDueAmount);
    setLoanBalanceAmount(cleanValues.loanBalanceAmount);
    setArrearsAmount(cleanValues.arrearsAmount);
    setMissedInstallmentCount(cleanValues.missedInstallmentCount);
    setNextDueDate(cleanValues.nextDueDate);
    setLastPaymentDate(cleanValues.lastPaymentDate);
    setStartDate(cleanValues.startDate);
    setMaturityDateEffective(cleanValues.maturityDateEffective);
    setLifecycleStatus(cleanValues.lifecycleStatus);
    setDisplayStatus(cleanValues.displayStatus);
    setDisplayStatusRank(cleanValues.displayStatusRank);
    setDisplayStatusComputedAt(cleanValues.displayStatusComputedAt);
    setNextStatusTransitionAt(cleanValues.nextStatusTransitionAt);
    setCurrencyCode(cleanValues.currencyCode);
    setErrors({});
  };
  const [loanSummaryRecord, setLoanSummaryRecord] =
    React.useState(loanSummaryModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getLoanSummary.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getLoanSummary
        : loanSummaryModelProp;
      setLoanSummaryRecord(record);
    };
    queryData();
  }, [idProp, loanSummaryModelProp]);
  React.useEffect(resetStateValues, [loanSummaryRecord]);
  const validations = {
    loanID: [{ type: "Required" }],
    refreshScope: [],
    institutionID: [],
    branchID: [],
    borrowerID: [],
    borrowerDisplayName: [],
    borrowerDisplayNameNormalized: [],
    borrowerPhone: [],
    loanNumber: [],
    loanOfficerID: [],
    loanOfficerDisplayName: [],
    loanProductID: [],
    loanProductName: [],
    principalAmount: [],
    totalPaidAmount: [],
    amountDueAmount: [],
    loanBalanceAmount: [],
    arrearsAmount: [],
    missedInstallmentCount: [],
    nextDueDate: [],
    lastPaymentDate: [],
    startDate: [],
    maturityDateEffective: [],
    lifecycleStatus: [],
    displayStatus: [],
    displayStatusRank: [],
    displayStatusComputedAt: [],
    nextStatusTransitionAt: [],
    currencyCode: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  const convertToLocal = (date) => {
    const df = new Intl.DateTimeFormat("default", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      calendar: "iso8601",
      numberingSystem: "latn",
      hourCycle: "h23",
    });
    const parts = df.formatToParts(date).reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});
    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          loanID,
          refreshScope: refreshScope ?? null,
          institutionID: institutionID ?? null,
          branchID: branchID ?? null,
          borrowerID: borrowerID ?? null,
          borrowerDisplayName: borrowerDisplayName ?? null,
          borrowerDisplayNameNormalized: borrowerDisplayNameNormalized ?? null,
          borrowerPhone: borrowerPhone ?? null,
          loanNumber: loanNumber ?? null,
          loanOfficerID: loanOfficerID ?? null,
          loanOfficerDisplayName: loanOfficerDisplayName ?? null,
          loanProductID: loanProductID ?? null,
          loanProductName: loanProductName ?? null,
          principalAmount: principalAmount ?? null,
          totalPaidAmount: totalPaidAmount ?? null,
          amountDueAmount: amountDueAmount ?? null,
          loanBalanceAmount: loanBalanceAmount ?? null,
          arrearsAmount: arrearsAmount ?? null,
          missedInstallmentCount: missedInstallmentCount ?? null,
          nextDueDate: nextDueDate ?? null,
          lastPaymentDate: lastPaymentDate ?? null,
          startDate: startDate ?? null,
          maturityDateEffective: maturityDateEffective ?? null,
          lifecycleStatus: lifecycleStatus ?? null,
          displayStatus: displayStatus ?? null,
          displayStatusRank: displayStatusRank ?? null,
          displayStatusComputedAt: displayStatusComputedAt ?? null,
          nextStatusTransitionAt: nextStatusTransitionAt ?? null,
          currencyCode: currencyCode ?? null,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: updateLoanSummary.replaceAll("__typename", ""),
            variables: {
              input: {
                id: loanSummaryRecord.id,
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "LoanSummaryUpdateForm")}
      {...rest}
    >
      <TextField
        label="Loan id"
        isRequired={true}
        isReadOnly={false}
        value={loanID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanID: value,
              refreshScope,
              institutionID,
              branchID,
              borrowerID,
              borrowerDisplayName,
              borrowerDisplayNameNormalized,
              borrowerPhone,
              loanNumber,
              loanOfficerID,
              loanOfficerDisplayName,
              loanProductID,
              loanProductName,
              principalAmount,
              totalPaidAmount,
              amountDueAmount,
              loanBalanceAmount,
              arrearsAmount,
              missedInstallmentCount,
              nextDueDate,
              lastPaymentDate,
              startDate,
              maturityDateEffective,
              lifecycleStatus,
              displayStatus,
              displayStatusRank,
              displayStatusComputedAt,
              nextStatusTransitionAt,
              currencyCode,
            };
            const result = onChange(modelFields);
            value = result?.loanID ?? value;
          }
          if (errors.loanID?.hasError) {
            runValidationTasks("loanID", value);
          }
          setLoanID(value);
        }}
        onBlur={() => runValidationTasks("loanID", loanID)}
        errorMessage={errors.loanID?.errorMessage}
        hasError={errors.loanID?.hasError}
        {...getOverrideProps(overrides, "loanID")}
      ></TextField>
      <TextField
        label="Refresh scope"
        isRequired={false}
        isReadOnly={false}
        value={refreshScope}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanID,
              refreshScope: value,
              institutionID,
              branchID,
              borrowerID,
              borrowerDisplayName,
              borrowerDisplayNameNormalized,
              borrowerPhone,
              loanNumber,
              loanOfficerID,
              loanOfficerDisplayName,
              loanProductID,
              loanProductName,
              principalAmount,
              totalPaidAmount,
              amountDueAmount,
              loanBalanceAmount,
              arrearsAmount,
              missedInstallmentCount,
              nextDueDate,
              lastPaymentDate,
              startDate,
              maturityDateEffective,
              lifecycleStatus,
              displayStatus,
              displayStatusRank,
              displayStatusComputedAt,
              nextStatusTransitionAt,
              currencyCode,
            };
            const result = onChange(modelFields);
            value = result?.refreshScope ?? value;
          }
          if (errors.refreshScope?.hasError) {
            runValidationTasks("refreshScope", value);
          }
          setRefreshScope(value);
        }}
        onBlur={() => runValidationTasks("refreshScope", refreshScope)}
        errorMessage={errors.refreshScope?.errorMessage}
        hasError={errors.refreshScope?.hasError}
        {...getOverrideProps(overrides, "refreshScope")}
      ></TextField>
      <TextField
        label="Institution id"
        isRequired={false}
        isReadOnly={false}
        value={institutionID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanID,
              refreshScope,
              institutionID: value,
              branchID,
              borrowerID,
              borrowerDisplayName,
              borrowerDisplayNameNormalized,
              borrowerPhone,
              loanNumber,
              loanOfficerID,
              loanOfficerDisplayName,
              loanProductID,
              loanProductName,
              principalAmount,
              totalPaidAmount,
              amountDueAmount,
              loanBalanceAmount,
              arrearsAmount,
              missedInstallmentCount,
              nextDueDate,
              lastPaymentDate,
              startDate,
              maturityDateEffective,
              lifecycleStatus,
              displayStatus,
              displayStatusRank,
              displayStatusComputedAt,
              nextStatusTransitionAt,
              currencyCode,
            };
            const result = onChange(modelFields);
            value = result?.institutionID ?? value;
          }
          if (errors.institutionID?.hasError) {
            runValidationTasks("institutionID", value);
          }
          setInstitutionID(value);
        }}
        onBlur={() => runValidationTasks("institutionID", institutionID)}
        errorMessage={errors.institutionID?.errorMessage}
        hasError={errors.institutionID?.hasError}
        {...getOverrideProps(overrides, "institutionID")}
      ></TextField>
      <TextField
        label="Branch id"
        isRequired={false}
        isReadOnly={false}
        value={branchID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanID,
              refreshScope,
              institutionID,
              branchID: value,
              borrowerID,
              borrowerDisplayName,
              borrowerDisplayNameNormalized,
              borrowerPhone,
              loanNumber,
              loanOfficerID,
              loanOfficerDisplayName,
              loanProductID,
              loanProductName,
              principalAmount,
              totalPaidAmount,
              amountDueAmount,
              loanBalanceAmount,
              arrearsAmount,
              missedInstallmentCount,
              nextDueDate,
              lastPaymentDate,
              startDate,
              maturityDateEffective,
              lifecycleStatus,
              displayStatus,
              displayStatusRank,
              displayStatusComputedAt,
              nextStatusTransitionAt,
              currencyCode,
            };
            const result = onChange(modelFields);
            value = result?.branchID ?? value;
          }
          if (errors.branchID?.hasError) {
            runValidationTasks("branchID", value);
          }
          setBranchID(value);
        }}
        onBlur={() => runValidationTasks("branchID", branchID)}
        errorMessage={errors.branchID?.errorMessage}
        hasError={errors.branchID?.hasError}
        {...getOverrideProps(overrides, "branchID")}
      ></TextField>
      <TextField
        label="Borrower id"
        isRequired={false}
        isReadOnly={false}
        value={borrowerID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanID,
              refreshScope,
              institutionID,
              branchID,
              borrowerID: value,
              borrowerDisplayName,
              borrowerDisplayNameNormalized,
              borrowerPhone,
              loanNumber,
              loanOfficerID,
              loanOfficerDisplayName,
              loanProductID,
              loanProductName,
              principalAmount,
              totalPaidAmount,
              amountDueAmount,
              loanBalanceAmount,
              arrearsAmount,
              missedInstallmentCount,
              nextDueDate,
              lastPaymentDate,
              startDate,
              maturityDateEffective,
              lifecycleStatus,
              displayStatus,
              displayStatusRank,
              displayStatusComputedAt,
              nextStatusTransitionAt,
              currencyCode,
            };
            const result = onChange(modelFields);
            value = result?.borrowerID ?? value;
          }
          if (errors.borrowerID?.hasError) {
            runValidationTasks("borrowerID", value);
          }
          setBorrowerID(value);
        }}
        onBlur={() => runValidationTasks("borrowerID", borrowerID)}
        errorMessage={errors.borrowerID?.errorMessage}
        hasError={errors.borrowerID?.hasError}
        {...getOverrideProps(overrides, "borrowerID")}
      ></TextField>
      <TextField
        label="Borrower display name"
        isRequired={false}
        isReadOnly={false}
        value={borrowerDisplayName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanID,
              refreshScope,
              institutionID,
              branchID,
              borrowerID,
              borrowerDisplayName: value,
              borrowerDisplayNameNormalized,
              borrowerPhone,
              loanNumber,
              loanOfficerID,
              loanOfficerDisplayName,
              loanProductID,
              loanProductName,
              principalAmount,
              totalPaidAmount,
              amountDueAmount,
              loanBalanceAmount,
              arrearsAmount,
              missedInstallmentCount,
              nextDueDate,
              lastPaymentDate,
              startDate,
              maturityDateEffective,
              lifecycleStatus,
              displayStatus,
              displayStatusRank,
              displayStatusComputedAt,
              nextStatusTransitionAt,
              currencyCode,
            };
            const result = onChange(modelFields);
            value = result?.borrowerDisplayName ?? value;
          }
          if (errors.borrowerDisplayName?.hasError) {
            runValidationTasks("borrowerDisplayName", value);
          }
          setBorrowerDisplayName(value);
        }}
        onBlur={() =>
          runValidationTasks("borrowerDisplayName", borrowerDisplayName)
        }
        errorMessage={errors.borrowerDisplayName?.errorMessage}
        hasError={errors.borrowerDisplayName?.hasError}
        {...getOverrideProps(overrides, "borrowerDisplayName")}
      ></TextField>
      <TextField
        label="Borrower display name normalized"
        isRequired={false}
        isReadOnly={false}
        value={borrowerDisplayNameNormalized}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanID,
              refreshScope,
              institutionID,
              branchID,
              borrowerID,
              borrowerDisplayName,
              borrowerDisplayNameNormalized: value,
              borrowerPhone,
              loanNumber,
              loanOfficerID,
              loanOfficerDisplayName,
              loanProductID,
              loanProductName,
              principalAmount,
              totalPaidAmount,
              amountDueAmount,
              loanBalanceAmount,
              arrearsAmount,
              missedInstallmentCount,
              nextDueDate,
              lastPaymentDate,
              startDate,
              maturityDateEffective,
              lifecycleStatus,
              displayStatus,
              displayStatusRank,
              displayStatusComputedAt,
              nextStatusTransitionAt,
              currencyCode,
            };
            const result = onChange(modelFields);
            value = result?.borrowerDisplayNameNormalized ?? value;
          }
          if (errors.borrowerDisplayNameNormalized?.hasError) {
            runValidationTasks("borrowerDisplayNameNormalized", value);
          }
          setBorrowerDisplayNameNormalized(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "borrowerDisplayNameNormalized",
            borrowerDisplayNameNormalized
          )
        }
        errorMessage={errors.borrowerDisplayNameNormalized?.errorMessage}
        hasError={errors.borrowerDisplayNameNormalized?.hasError}
        {...getOverrideProps(overrides, "borrowerDisplayNameNormalized")}
      ></TextField>
      <TextField
        label="Borrower phone"
        isRequired={false}
        isReadOnly={false}
        value={borrowerPhone}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanID,
              refreshScope,
              institutionID,
              branchID,
              borrowerID,
              borrowerDisplayName,
              borrowerDisplayNameNormalized,
              borrowerPhone: value,
              loanNumber,
              loanOfficerID,
              loanOfficerDisplayName,
              loanProductID,
              loanProductName,
              principalAmount,
              totalPaidAmount,
              amountDueAmount,
              loanBalanceAmount,
              arrearsAmount,
              missedInstallmentCount,
              nextDueDate,
              lastPaymentDate,
              startDate,
              maturityDateEffective,
              lifecycleStatus,
              displayStatus,
              displayStatusRank,
              displayStatusComputedAt,
              nextStatusTransitionAt,
              currencyCode,
            };
            const result = onChange(modelFields);
            value = result?.borrowerPhone ?? value;
          }
          if (errors.borrowerPhone?.hasError) {
            runValidationTasks("borrowerPhone", value);
          }
          setBorrowerPhone(value);
        }}
        onBlur={() => runValidationTasks("borrowerPhone", borrowerPhone)}
        errorMessage={errors.borrowerPhone?.errorMessage}
        hasError={errors.borrowerPhone?.hasError}
        {...getOverrideProps(overrides, "borrowerPhone")}
      ></TextField>
      <TextField
        label="Loan number"
        isRequired={false}
        isReadOnly={false}
        value={loanNumber}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanID,
              refreshScope,
              institutionID,
              branchID,
              borrowerID,
              borrowerDisplayName,
              borrowerDisplayNameNormalized,
              borrowerPhone,
              loanNumber: value,
              loanOfficerID,
              loanOfficerDisplayName,
              loanProductID,
              loanProductName,
              principalAmount,
              totalPaidAmount,
              amountDueAmount,
              loanBalanceAmount,
              arrearsAmount,
              missedInstallmentCount,
              nextDueDate,
              lastPaymentDate,
              startDate,
              maturityDateEffective,
              lifecycleStatus,
              displayStatus,
              displayStatusRank,
              displayStatusComputedAt,
              nextStatusTransitionAt,
              currencyCode,
            };
            const result = onChange(modelFields);
            value = result?.loanNumber ?? value;
          }
          if (errors.loanNumber?.hasError) {
            runValidationTasks("loanNumber", value);
          }
          setLoanNumber(value);
        }}
        onBlur={() => runValidationTasks("loanNumber", loanNumber)}
        errorMessage={errors.loanNumber?.errorMessage}
        hasError={errors.loanNumber?.hasError}
        {...getOverrideProps(overrides, "loanNumber")}
      ></TextField>
      <TextField
        label="Loan officer id"
        isRequired={false}
        isReadOnly={false}
        value={loanOfficerID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanID,
              refreshScope,
              institutionID,
              branchID,
              borrowerID,
              borrowerDisplayName,
              borrowerDisplayNameNormalized,
              borrowerPhone,
              loanNumber,
              loanOfficerID: value,
              loanOfficerDisplayName,
              loanProductID,
              loanProductName,
              principalAmount,
              totalPaidAmount,
              amountDueAmount,
              loanBalanceAmount,
              arrearsAmount,
              missedInstallmentCount,
              nextDueDate,
              lastPaymentDate,
              startDate,
              maturityDateEffective,
              lifecycleStatus,
              displayStatus,
              displayStatusRank,
              displayStatusComputedAt,
              nextStatusTransitionAt,
              currencyCode,
            };
            const result = onChange(modelFields);
            value = result?.loanOfficerID ?? value;
          }
          if (errors.loanOfficerID?.hasError) {
            runValidationTasks("loanOfficerID", value);
          }
          setLoanOfficerID(value);
        }}
        onBlur={() => runValidationTasks("loanOfficerID", loanOfficerID)}
        errorMessage={errors.loanOfficerID?.errorMessage}
        hasError={errors.loanOfficerID?.hasError}
        {...getOverrideProps(overrides, "loanOfficerID")}
      ></TextField>
      <TextField
        label="Loan officer display name"
        isRequired={false}
        isReadOnly={false}
        value={loanOfficerDisplayName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanID,
              refreshScope,
              institutionID,
              branchID,
              borrowerID,
              borrowerDisplayName,
              borrowerDisplayNameNormalized,
              borrowerPhone,
              loanNumber,
              loanOfficerID,
              loanOfficerDisplayName: value,
              loanProductID,
              loanProductName,
              principalAmount,
              totalPaidAmount,
              amountDueAmount,
              loanBalanceAmount,
              arrearsAmount,
              missedInstallmentCount,
              nextDueDate,
              lastPaymentDate,
              startDate,
              maturityDateEffective,
              lifecycleStatus,
              displayStatus,
              displayStatusRank,
              displayStatusComputedAt,
              nextStatusTransitionAt,
              currencyCode,
            };
            const result = onChange(modelFields);
            value = result?.loanOfficerDisplayName ?? value;
          }
          if (errors.loanOfficerDisplayName?.hasError) {
            runValidationTasks("loanOfficerDisplayName", value);
          }
          setLoanOfficerDisplayName(value);
        }}
        onBlur={() =>
          runValidationTasks("loanOfficerDisplayName", loanOfficerDisplayName)
        }
        errorMessage={errors.loanOfficerDisplayName?.errorMessage}
        hasError={errors.loanOfficerDisplayName?.hasError}
        {...getOverrideProps(overrides, "loanOfficerDisplayName")}
      ></TextField>
      <TextField
        label="Loan product id"
        isRequired={false}
        isReadOnly={false}
        value={loanProductID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanID,
              refreshScope,
              institutionID,
              branchID,
              borrowerID,
              borrowerDisplayName,
              borrowerDisplayNameNormalized,
              borrowerPhone,
              loanNumber,
              loanOfficerID,
              loanOfficerDisplayName,
              loanProductID: value,
              loanProductName,
              principalAmount,
              totalPaidAmount,
              amountDueAmount,
              loanBalanceAmount,
              arrearsAmount,
              missedInstallmentCount,
              nextDueDate,
              lastPaymentDate,
              startDate,
              maturityDateEffective,
              lifecycleStatus,
              displayStatus,
              displayStatusRank,
              displayStatusComputedAt,
              nextStatusTransitionAt,
              currencyCode,
            };
            const result = onChange(modelFields);
            value = result?.loanProductID ?? value;
          }
          if (errors.loanProductID?.hasError) {
            runValidationTasks("loanProductID", value);
          }
          setLoanProductID(value);
        }}
        onBlur={() => runValidationTasks("loanProductID", loanProductID)}
        errorMessage={errors.loanProductID?.errorMessage}
        hasError={errors.loanProductID?.hasError}
        {...getOverrideProps(overrides, "loanProductID")}
      ></TextField>
      <TextField
        label="Loan product name"
        isRequired={false}
        isReadOnly={false}
        value={loanProductName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanID,
              refreshScope,
              institutionID,
              branchID,
              borrowerID,
              borrowerDisplayName,
              borrowerDisplayNameNormalized,
              borrowerPhone,
              loanNumber,
              loanOfficerID,
              loanOfficerDisplayName,
              loanProductID,
              loanProductName: value,
              principalAmount,
              totalPaidAmount,
              amountDueAmount,
              loanBalanceAmount,
              arrearsAmount,
              missedInstallmentCount,
              nextDueDate,
              lastPaymentDate,
              startDate,
              maturityDateEffective,
              lifecycleStatus,
              displayStatus,
              displayStatusRank,
              displayStatusComputedAt,
              nextStatusTransitionAt,
              currencyCode,
            };
            const result = onChange(modelFields);
            value = result?.loanProductName ?? value;
          }
          if (errors.loanProductName?.hasError) {
            runValidationTasks("loanProductName", value);
          }
          setLoanProductName(value);
        }}
        onBlur={() => runValidationTasks("loanProductName", loanProductName)}
        errorMessage={errors.loanProductName?.errorMessage}
        hasError={errors.loanProductName?.hasError}
        {...getOverrideProps(overrides, "loanProductName")}
      ></TextField>
      <TextField
        label="Principal amount"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={principalAmount}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              loanID,
              refreshScope,
              institutionID,
              branchID,
              borrowerID,
              borrowerDisplayName,
              borrowerDisplayNameNormalized,
              borrowerPhone,
              loanNumber,
              loanOfficerID,
              loanOfficerDisplayName,
              loanProductID,
              loanProductName,
              principalAmount: value,
              totalPaidAmount,
              amountDueAmount,
              loanBalanceAmount,
              arrearsAmount,
              missedInstallmentCount,
              nextDueDate,
              lastPaymentDate,
              startDate,
              maturityDateEffective,
              lifecycleStatus,
              displayStatus,
              displayStatusRank,
              displayStatusComputedAt,
              nextStatusTransitionAt,
              currencyCode,
            };
            const result = onChange(modelFields);
            value = result?.principalAmount ?? value;
          }
          if (errors.principalAmount?.hasError) {
            runValidationTasks("principalAmount", value);
          }
          setPrincipalAmount(value);
        }}
        onBlur={() => runValidationTasks("principalAmount", principalAmount)}
        errorMessage={errors.principalAmount?.errorMessage}
        hasError={errors.principalAmount?.hasError}
        {...getOverrideProps(overrides, "principalAmount")}
      ></TextField>
      <TextField
        label="Total paid amount"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={totalPaidAmount}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              loanID,
              refreshScope,
              institutionID,
              branchID,
              borrowerID,
              borrowerDisplayName,
              borrowerDisplayNameNormalized,
              borrowerPhone,
              loanNumber,
              loanOfficerID,
              loanOfficerDisplayName,
              loanProductID,
              loanProductName,
              principalAmount,
              totalPaidAmount: value,
              amountDueAmount,
              loanBalanceAmount,
              arrearsAmount,
              missedInstallmentCount,
              nextDueDate,
              lastPaymentDate,
              startDate,
              maturityDateEffective,
              lifecycleStatus,
              displayStatus,
              displayStatusRank,
              displayStatusComputedAt,
              nextStatusTransitionAt,
              currencyCode,
            };
            const result = onChange(modelFields);
            value = result?.totalPaidAmount ?? value;
          }
          if (errors.totalPaidAmount?.hasError) {
            runValidationTasks("totalPaidAmount", value);
          }
          setTotalPaidAmount(value);
        }}
        onBlur={() => runValidationTasks("totalPaidAmount", totalPaidAmount)}
        errorMessage={errors.totalPaidAmount?.errorMessage}
        hasError={errors.totalPaidAmount?.hasError}
        {...getOverrideProps(overrides, "totalPaidAmount")}
      ></TextField>
      <TextField
        label="Amount due amount"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={amountDueAmount}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              loanID,
              refreshScope,
              institutionID,
              branchID,
              borrowerID,
              borrowerDisplayName,
              borrowerDisplayNameNormalized,
              borrowerPhone,
              loanNumber,
              loanOfficerID,
              loanOfficerDisplayName,
              loanProductID,
              loanProductName,
              principalAmount,
              totalPaidAmount,
              amountDueAmount: value,
              loanBalanceAmount,
              arrearsAmount,
              missedInstallmentCount,
              nextDueDate,
              lastPaymentDate,
              startDate,
              maturityDateEffective,
              lifecycleStatus,
              displayStatus,
              displayStatusRank,
              displayStatusComputedAt,
              nextStatusTransitionAt,
              currencyCode,
            };
            const result = onChange(modelFields);
            value = result?.amountDueAmount ?? value;
          }
          if (errors.amountDueAmount?.hasError) {
            runValidationTasks("amountDueAmount", value);
          }
          setAmountDueAmount(value);
        }}
        onBlur={() => runValidationTasks("amountDueAmount", amountDueAmount)}
        errorMessage={errors.amountDueAmount?.errorMessage}
        hasError={errors.amountDueAmount?.hasError}
        {...getOverrideProps(overrides, "amountDueAmount")}
      ></TextField>
      <TextField
        label="Loan balance amount"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={loanBalanceAmount}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              loanID,
              refreshScope,
              institutionID,
              branchID,
              borrowerID,
              borrowerDisplayName,
              borrowerDisplayNameNormalized,
              borrowerPhone,
              loanNumber,
              loanOfficerID,
              loanOfficerDisplayName,
              loanProductID,
              loanProductName,
              principalAmount,
              totalPaidAmount,
              amountDueAmount,
              loanBalanceAmount: value,
              arrearsAmount,
              missedInstallmentCount,
              nextDueDate,
              lastPaymentDate,
              startDate,
              maturityDateEffective,
              lifecycleStatus,
              displayStatus,
              displayStatusRank,
              displayStatusComputedAt,
              nextStatusTransitionAt,
              currencyCode,
            };
            const result = onChange(modelFields);
            value = result?.loanBalanceAmount ?? value;
          }
          if (errors.loanBalanceAmount?.hasError) {
            runValidationTasks("loanBalanceAmount", value);
          }
          setLoanBalanceAmount(value);
        }}
        onBlur={() =>
          runValidationTasks("loanBalanceAmount", loanBalanceAmount)
        }
        errorMessage={errors.loanBalanceAmount?.errorMessage}
        hasError={errors.loanBalanceAmount?.hasError}
        {...getOverrideProps(overrides, "loanBalanceAmount")}
      ></TextField>
      <TextField
        label="Arrears amount"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={arrearsAmount}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              loanID,
              refreshScope,
              institutionID,
              branchID,
              borrowerID,
              borrowerDisplayName,
              borrowerDisplayNameNormalized,
              borrowerPhone,
              loanNumber,
              loanOfficerID,
              loanOfficerDisplayName,
              loanProductID,
              loanProductName,
              principalAmount,
              totalPaidAmount,
              amountDueAmount,
              loanBalanceAmount,
              arrearsAmount: value,
              missedInstallmentCount,
              nextDueDate,
              lastPaymentDate,
              startDate,
              maturityDateEffective,
              lifecycleStatus,
              displayStatus,
              displayStatusRank,
              displayStatusComputedAt,
              nextStatusTransitionAt,
              currencyCode,
            };
            const result = onChange(modelFields);
            value = result?.arrearsAmount ?? value;
          }
          if (errors.arrearsAmount?.hasError) {
            runValidationTasks("arrearsAmount", value);
          }
          setArrearsAmount(value);
        }}
        onBlur={() => runValidationTasks("arrearsAmount", arrearsAmount)}
        errorMessage={errors.arrearsAmount?.errorMessage}
        hasError={errors.arrearsAmount?.hasError}
        {...getOverrideProps(overrides, "arrearsAmount")}
      ></TextField>
      <TextField
        label="Missed installment count"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={missedInstallmentCount}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              loanID,
              refreshScope,
              institutionID,
              branchID,
              borrowerID,
              borrowerDisplayName,
              borrowerDisplayNameNormalized,
              borrowerPhone,
              loanNumber,
              loanOfficerID,
              loanOfficerDisplayName,
              loanProductID,
              loanProductName,
              principalAmount,
              totalPaidAmount,
              amountDueAmount,
              loanBalanceAmount,
              arrearsAmount,
              missedInstallmentCount: value,
              nextDueDate,
              lastPaymentDate,
              startDate,
              maturityDateEffective,
              lifecycleStatus,
              displayStatus,
              displayStatusRank,
              displayStatusComputedAt,
              nextStatusTransitionAt,
              currencyCode,
            };
            const result = onChange(modelFields);
            value = result?.missedInstallmentCount ?? value;
          }
          if (errors.missedInstallmentCount?.hasError) {
            runValidationTasks("missedInstallmentCount", value);
          }
          setMissedInstallmentCount(value);
        }}
        onBlur={() =>
          runValidationTasks("missedInstallmentCount", missedInstallmentCount)
        }
        errorMessage={errors.missedInstallmentCount?.errorMessage}
        hasError={errors.missedInstallmentCount?.hasError}
        {...getOverrideProps(overrides, "missedInstallmentCount")}
      ></TextField>
      <TextField
        label="Next due date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={nextDueDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanID,
              refreshScope,
              institutionID,
              branchID,
              borrowerID,
              borrowerDisplayName,
              borrowerDisplayNameNormalized,
              borrowerPhone,
              loanNumber,
              loanOfficerID,
              loanOfficerDisplayName,
              loanProductID,
              loanProductName,
              principalAmount,
              totalPaidAmount,
              amountDueAmount,
              loanBalanceAmount,
              arrearsAmount,
              missedInstallmentCount,
              nextDueDate: value,
              lastPaymentDate,
              startDate,
              maturityDateEffective,
              lifecycleStatus,
              displayStatus,
              displayStatusRank,
              displayStatusComputedAt,
              nextStatusTransitionAt,
              currencyCode,
            };
            const result = onChange(modelFields);
            value = result?.nextDueDate ?? value;
          }
          if (errors.nextDueDate?.hasError) {
            runValidationTasks("nextDueDate", value);
          }
          setNextDueDate(value);
        }}
        onBlur={() => runValidationTasks("nextDueDate", nextDueDate)}
        errorMessage={errors.nextDueDate?.errorMessage}
        hasError={errors.nextDueDate?.hasError}
        {...getOverrideProps(overrides, "nextDueDate")}
      ></TextField>
      <TextField
        label="Last payment date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={lastPaymentDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanID,
              refreshScope,
              institutionID,
              branchID,
              borrowerID,
              borrowerDisplayName,
              borrowerDisplayNameNormalized,
              borrowerPhone,
              loanNumber,
              loanOfficerID,
              loanOfficerDisplayName,
              loanProductID,
              loanProductName,
              principalAmount,
              totalPaidAmount,
              amountDueAmount,
              loanBalanceAmount,
              arrearsAmount,
              missedInstallmentCount,
              nextDueDate,
              lastPaymentDate: value,
              startDate,
              maturityDateEffective,
              lifecycleStatus,
              displayStatus,
              displayStatusRank,
              displayStatusComputedAt,
              nextStatusTransitionAt,
              currencyCode,
            };
            const result = onChange(modelFields);
            value = result?.lastPaymentDate ?? value;
          }
          if (errors.lastPaymentDate?.hasError) {
            runValidationTasks("lastPaymentDate", value);
          }
          setLastPaymentDate(value);
        }}
        onBlur={() => runValidationTasks("lastPaymentDate", lastPaymentDate)}
        errorMessage={errors.lastPaymentDate?.errorMessage}
        hasError={errors.lastPaymentDate?.hasError}
        {...getOverrideProps(overrides, "lastPaymentDate")}
      ></TextField>
      <TextField
        label="Start date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={startDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanID,
              refreshScope,
              institutionID,
              branchID,
              borrowerID,
              borrowerDisplayName,
              borrowerDisplayNameNormalized,
              borrowerPhone,
              loanNumber,
              loanOfficerID,
              loanOfficerDisplayName,
              loanProductID,
              loanProductName,
              principalAmount,
              totalPaidAmount,
              amountDueAmount,
              loanBalanceAmount,
              arrearsAmount,
              missedInstallmentCount,
              nextDueDate,
              lastPaymentDate,
              startDate: value,
              maturityDateEffective,
              lifecycleStatus,
              displayStatus,
              displayStatusRank,
              displayStatusComputedAt,
              nextStatusTransitionAt,
              currencyCode,
            };
            const result = onChange(modelFields);
            value = result?.startDate ?? value;
          }
          if (errors.startDate?.hasError) {
            runValidationTasks("startDate", value);
          }
          setStartDate(value);
        }}
        onBlur={() => runValidationTasks("startDate", startDate)}
        errorMessage={errors.startDate?.errorMessage}
        hasError={errors.startDate?.hasError}
        {...getOverrideProps(overrides, "startDate")}
      ></TextField>
      <TextField
        label="Maturity date effective"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={maturityDateEffective}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanID,
              refreshScope,
              institutionID,
              branchID,
              borrowerID,
              borrowerDisplayName,
              borrowerDisplayNameNormalized,
              borrowerPhone,
              loanNumber,
              loanOfficerID,
              loanOfficerDisplayName,
              loanProductID,
              loanProductName,
              principalAmount,
              totalPaidAmount,
              amountDueAmount,
              loanBalanceAmount,
              arrearsAmount,
              missedInstallmentCount,
              nextDueDate,
              lastPaymentDate,
              startDate,
              maturityDateEffective: value,
              lifecycleStatus,
              displayStatus,
              displayStatusRank,
              displayStatusComputedAt,
              nextStatusTransitionAt,
              currencyCode,
            };
            const result = onChange(modelFields);
            value = result?.maturityDateEffective ?? value;
          }
          if (errors.maturityDateEffective?.hasError) {
            runValidationTasks("maturityDateEffective", value);
          }
          setMaturityDateEffective(value);
        }}
        onBlur={() =>
          runValidationTasks("maturityDateEffective", maturityDateEffective)
        }
        errorMessage={errors.maturityDateEffective?.errorMessage}
        hasError={errors.maturityDateEffective?.hasError}
        {...getOverrideProps(overrides, "maturityDateEffective")}
      ></TextField>
      <TextField
        label="Lifecycle status"
        isRequired={false}
        isReadOnly={false}
        value={lifecycleStatus}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanID,
              refreshScope,
              institutionID,
              branchID,
              borrowerID,
              borrowerDisplayName,
              borrowerDisplayNameNormalized,
              borrowerPhone,
              loanNumber,
              loanOfficerID,
              loanOfficerDisplayName,
              loanProductID,
              loanProductName,
              principalAmount,
              totalPaidAmount,
              amountDueAmount,
              loanBalanceAmount,
              arrearsAmount,
              missedInstallmentCount,
              nextDueDate,
              lastPaymentDate,
              startDate,
              maturityDateEffective,
              lifecycleStatus: value,
              displayStatus,
              displayStatusRank,
              displayStatusComputedAt,
              nextStatusTransitionAt,
              currencyCode,
            };
            const result = onChange(modelFields);
            value = result?.lifecycleStatus ?? value;
          }
          if (errors.lifecycleStatus?.hasError) {
            runValidationTasks("lifecycleStatus", value);
          }
          setLifecycleStatus(value);
        }}
        onBlur={() => runValidationTasks("lifecycleStatus", lifecycleStatus)}
        errorMessage={errors.lifecycleStatus?.errorMessage}
        hasError={errors.lifecycleStatus?.hasError}
        {...getOverrideProps(overrides, "lifecycleStatus")}
      ></TextField>
      <SelectField
        label="Display status"
        placeholder="Please select an option"
        isDisabled={false}
        value={displayStatus}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanID,
              refreshScope,
              institutionID,
              branchID,
              borrowerID,
              borrowerDisplayName,
              borrowerDisplayNameNormalized,
              borrowerPhone,
              loanNumber,
              loanOfficerID,
              loanOfficerDisplayName,
              loanProductID,
              loanProductName,
              principalAmount,
              totalPaidAmount,
              amountDueAmount,
              loanBalanceAmount,
              arrearsAmount,
              missedInstallmentCount,
              nextDueDate,
              lastPaymentDate,
              startDate,
              maturityDateEffective,
              lifecycleStatus,
              displayStatus: value,
              displayStatusRank,
              displayStatusComputedAt,
              nextStatusTransitionAt,
              currencyCode,
            };
            const result = onChange(modelFields);
            value = result?.displayStatus ?? value;
          }
          if (errors.displayStatus?.hasError) {
            runValidationTasks("displayStatus", value);
          }
          setDisplayStatus(value);
        }}
        onBlur={() => runValidationTasks("displayStatus", displayStatus)}
        errorMessage={errors.displayStatus?.errorMessage}
        hasError={errors.displayStatus?.hasError}
        {...getOverrideProps(overrides, "displayStatus")}
      >
        <option
          children="Current"
          value="CURRENT"
          {...getOverrideProps(overrides, "displayStatusoption0")}
        ></option>
        <option
          children="Current with missed payment"
          value="CURRENT_WITH_MISSED_PAYMENT"
          {...getOverrideProps(overrides, "displayStatusoption1")}
        ></option>
        <option
          children="Overdue"
          value="OVERDUE"
          {...getOverrideProps(overrides, "displayStatusoption2")}
        ></option>
        <option
          children="Closed"
          value="CLOSED"
          {...getOverrideProps(overrides, "displayStatusoption3")}
        ></option>
        <option
          children="Written off"
          value="WRITTEN_OFF"
          {...getOverrideProps(overrides, "displayStatusoption4")}
        ></option>
        <option
          children="Voided"
          value="VOIDED"
          {...getOverrideProps(overrides, "displayStatusoption5")}
        ></option>
      </SelectField>
      <TextField
        label="Display status rank"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={displayStatusRank}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              loanID,
              refreshScope,
              institutionID,
              branchID,
              borrowerID,
              borrowerDisplayName,
              borrowerDisplayNameNormalized,
              borrowerPhone,
              loanNumber,
              loanOfficerID,
              loanOfficerDisplayName,
              loanProductID,
              loanProductName,
              principalAmount,
              totalPaidAmount,
              amountDueAmount,
              loanBalanceAmount,
              arrearsAmount,
              missedInstallmentCount,
              nextDueDate,
              lastPaymentDate,
              startDate,
              maturityDateEffective,
              lifecycleStatus,
              displayStatus,
              displayStatusRank: value,
              displayStatusComputedAt,
              nextStatusTransitionAt,
              currencyCode,
            };
            const result = onChange(modelFields);
            value = result?.displayStatusRank ?? value;
          }
          if (errors.displayStatusRank?.hasError) {
            runValidationTasks("displayStatusRank", value);
          }
          setDisplayStatusRank(value);
        }}
        onBlur={() =>
          runValidationTasks("displayStatusRank", displayStatusRank)
        }
        errorMessage={errors.displayStatusRank?.errorMessage}
        hasError={errors.displayStatusRank?.hasError}
        {...getOverrideProps(overrides, "displayStatusRank")}
      ></TextField>
      <TextField
        label="Display status computed at"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={
          displayStatusComputedAt &&
          convertToLocal(new Date(displayStatusComputedAt))
        }
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              loanID,
              refreshScope,
              institutionID,
              branchID,
              borrowerID,
              borrowerDisplayName,
              borrowerDisplayNameNormalized,
              borrowerPhone,
              loanNumber,
              loanOfficerID,
              loanOfficerDisplayName,
              loanProductID,
              loanProductName,
              principalAmount,
              totalPaidAmount,
              amountDueAmount,
              loanBalanceAmount,
              arrearsAmount,
              missedInstallmentCount,
              nextDueDate,
              lastPaymentDate,
              startDate,
              maturityDateEffective,
              lifecycleStatus,
              displayStatus,
              displayStatusRank,
              displayStatusComputedAt: value,
              nextStatusTransitionAt,
              currencyCode,
            };
            const result = onChange(modelFields);
            value = result?.displayStatusComputedAt ?? value;
          }
          if (errors.displayStatusComputedAt?.hasError) {
            runValidationTasks("displayStatusComputedAt", value);
          }
          setDisplayStatusComputedAt(value);
        }}
        onBlur={() =>
          runValidationTasks("displayStatusComputedAt", displayStatusComputedAt)
        }
        errorMessage={errors.displayStatusComputedAt?.errorMessage}
        hasError={errors.displayStatusComputedAt?.hasError}
        {...getOverrideProps(overrides, "displayStatusComputedAt")}
      ></TextField>
      <TextField
        label="Next status transition at"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={
          nextStatusTransitionAt &&
          convertToLocal(new Date(nextStatusTransitionAt))
        }
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              loanID,
              refreshScope,
              institutionID,
              branchID,
              borrowerID,
              borrowerDisplayName,
              borrowerDisplayNameNormalized,
              borrowerPhone,
              loanNumber,
              loanOfficerID,
              loanOfficerDisplayName,
              loanProductID,
              loanProductName,
              principalAmount,
              totalPaidAmount,
              amountDueAmount,
              loanBalanceAmount,
              arrearsAmount,
              missedInstallmentCount,
              nextDueDate,
              lastPaymentDate,
              startDate,
              maturityDateEffective,
              lifecycleStatus,
              displayStatus,
              displayStatusRank,
              displayStatusComputedAt,
              nextStatusTransitionAt: value,
              currencyCode,
            };
            const result = onChange(modelFields);
            value = result?.nextStatusTransitionAt ?? value;
          }
          if (errors.nextStatusTransitionAt?.hasError) {
            runValidationTasks("nextStatusTransitionAt", value);
          }
          setNextStatusTransitionAt(value);
        }}
        onBlur={() =>
          runValidationTasks("nextStatusTransitionAt", nextStatusTransitionAt)
        }
        errorMessage={errors.nextStatusTransitionAt?.errorMessage}
        hasError={errors.nextStatusTransitionAt?.hasError}
        {...getOverrideProps(overrides, "nextStatusTransitionAt")}
      ></TextField>
      <TextField
        label="Currency code"
        isRequired={false}
        isReadOnly={false}
        value={currencyCode}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanID,
              refreshScope,
              institutionID,
              branchID,
              borrowerID,
              borrowerDisplayName,
              borrowerDisplayNameNormalized,
              borrowerPhone,
              loanNumber,
              loanOfficerID,
              loanOfficerDisplayName,
              loanProductID,
              loanProductName,
              principalAmount,
              totalPaidAmount,
              amountDueAmount,
              loanBalanceAmount,
              arrearsAmount,
              missedInstallmentCount,
              nextDueDate,
              lastPaymentDate,
              startDate,
              maturityDateEffective,
              lifecycleStatus,
              displayStatus,
              displayStatusRank,
              displayStatusComputedAt,
              nextStatusTransitionAt,
              currencyCode: value,
            };
            const result = onChange(modelFields);
            value = result?.currencyCode ?? value;
          }
          if (errors.currencyCode?.hasError) {
            runValidationTasks("currencyCode", value);
          }
          setCurrencyCode(value);
        }}
        onBlur={() => runValidationTasks("currencyCode", currencyCode)}
        errorMessage={errors.currencyCode?.errorMessage}
        hasError={errors.currencyCode?.hasError}
        {...getOverrideProps(overrides, "currencyCode")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || loanSummaryModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || loanSummaryModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
