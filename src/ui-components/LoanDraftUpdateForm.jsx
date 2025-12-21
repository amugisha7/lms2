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
  TextAreaField,
  TextField,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getLoanDraft } from "../graphql/queries";
import { updateLoanDraft } from "../graphql/mutations";
const client = generateClient();
export default function LoanDraftUpdateForm(props) {
  const {
    id: idProp,
    loanDraft: loanDraftModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    status: "",
    source: "",
    draftNumber: "",
    institutionID: "",
    branchID: "",
    borrowerID: "",
    loanProductID: "",
    createdByEmployeeID: "",
    assignedToEmployeeID: "",
    submittedAt: "",
    approvedAt: "",
    rejectedAt: "",
    rejectionReason: "",
    convertedAt: "",
    draftRecord: "",
    termsSnapshot: "",
    schedulePreview: "",
    scheduleHash: "",
    editVersion: "",
    lastEditedByEmployeeID: "",
    lastEditedAt: "",
    principal: "",
    interestRate: "",
    interestCalculationMethod: "",
    startDate: "",
    maturityDate: "",
    loanCurrency: "",
    createdAt: "",
    updatedAt: "",
  };
  const [status, setStatus] = React.useState(initialValues.status);
  const [source, setSource] = React.useState(initialValues.source);
  const [draftNumber, setDraftNumber] = React.useState(
    initialValues.draftNumber
  );
  const [institutionID, setInstitutionID] = React.useState(
    initialValues.institutionID
  );
  const [branchID, setBranchID] = React.useState(initialValues.branchID);
  const [borrowerID, setBorrowerID] = React.useState(initialValues.borrowerID);
  const [loanProductID, setLoanProductID] = React.useState(
    initialValues.loanProductID
  );
  const [createdByEmployeeID, setCreatedByEmployeeID] = React.useState(
    initialValues.createdByEmployeeID
  );
  const [assignedToEmployeeID, setAssignedToEmployeeID] = React.useState(
    initialValues.assignedToEmployeeID
  );
  const [submittedAt, setSubmittedAt] = React.useState(
    initialValues.submittedAt
  );
  const [approvedAt, setApprovedAt] = React.useState(initialValues.approvedAt);
  const [rejectedAt, setRejectedAt] = React.useState(initialValues.rejectedAt);
  const [rejectionReason, setRejectionReason] = React.useState(
    initialValues.rejectionReason
  );
  const [convertedAt, setConvertedAt] = React.useState(
    initialValues.convertedAt
  );
  const [draftRecord, setDraftRecord] = React.useState(
    initialValues.draftRecord
  );
  const [termsSnapshot, setTermsSnapshot] = React.useState(
    initialValues.termsSnapshot
  );
  const [schedulePreview, setSchedulePreview] = React.useState(
    initialValues.schedulePreview
  );
  const [scheduleHash, setScheduleHash] = React.useState(
    initialValues.scheduleHash
  );
  const [editVersion, setEditVersion] = React.useState(
    initialValues.editVersion
  );
  const [lastEditedByEmployeeID, setLastEditedByEmployeeID] = React.useState(
    initialValues.lastEditedByEmployeeID
  );
  const [lastEditedAt, setLastEditedAt] = React.useState(
    initialValues.lastEditedAt
  );
  const [principal, setPrincipal] = React.useState(initialValues.principal);
  const [interestRate, setInterestRate] = React.useState(
    initialValues.interestRate
  );
  const [interestCalculationMethod, setInterestCalculationMethod] =
    React.useState(initialValues.interestCalculationMethod);
  const [startDate, setStartDate] = React.useState(initialValues.startDate);
  const [maturityDate, setMaturityDate] = React.useState(
    initialValues.maturityDate
  );
  const [loanCurrency, setLoanCurrency] = React.useState(
    initialValues.loanCurrency
  );
  const [createdAt, setCreatedAt] = React.useState(initialValues.createdAt);
  const [updatedAt, setUpdatedAt] = React.useState(initialValues.updatedAt);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = loanDraftRecord
      ? { ...initialValues, ...loanDraftRecord }
      : initialValues;
    setStatus(cleanValues.status);
    setSource(cleanValues.source);
    setDraftNumber(cleanValues.draftNumber);
    setInstitutionID(cleanValues.institutionID);
    setBranchID(cleanValues.branchID);
    setBorrowerID(cleanValues.borrowerID);
    setLoanProductID(cleanValues.loanProductID);
    setCreatedByEmployeeID(cleanValues.createdByEmployeeID);
    setAssignedToEmployeeID(cleanValues.assignedToEmployeeID);
    setSubmittedAt(cleanValues.submittedAt);
    setApprovedAt(cleanValues.approvedAt);
    setRejectedAt(cleanValues.rejectedAt);
    setRejectionReason(cleanValues.rejectionReason);
    setConvertedAt(cleanValues.convertedAt);
    setDraftRecord(
      typeof cleanValues.draftRecord === "string" ||
        cleanValues.draftRecord === null
        ? cleanValues.draftRecord
        : JSON.stringify(cleanValues.draftRecord)
    );
    setTermsSnapshot(
      typeof cleanValues.termsSnapshot === "string" ||
        cleanValues.termsSnapshot === null
        ? cleanValues.termsSnapshot
        : JSON.stringify(cleanValues.termsSnapshot)
    );
    setSchedulePreview(
      typeof cleanValues.schedulePreview === "string" ||
        cleanValues.schedulePreview === null
        ? cleanValues.schedulePreview
        : JSON.stringify(cleanValues.schedulePreview)
    );
    setScheduleHash(cleanValues.scheduleHash);
    setEditVersion(cleanValues.editVersion);
    setLastEditedByEmployeeID(cleanValues.lastEditedByEmployeeID);
    setLastEditedAt(cleanValues.lastEditedAt);
    setPrincipal(cleanValues.principal);
    setInterestRate(cleanValues.interestRate);
    setInterestCalculationMethod(cleanValues.interestCalculationMethod);
    setStartDate(cleanValues.startDate);
    setMaturityDate(cleanValues.maturityDate);
    setLoanCurrency(cleanValues.loanCurrency);
    setCreatedAt(cleanValues.createdAt);
    setUpdatedAt(cleanValues.updatedAt);
    setErrors({});
  };
  const [loanDraftRecord, setLoanDraftRecord] =
    React.useState(loanDraftModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getLoanDraft.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getLoanDraft
        : loanDraftModelProp;
      setLoanDraftRecord(record);
    };
    queryData();
  }, [idProp, loanDraftModelProp]);
  React.useEffect(resetStateValues, [loanDraftRecord]);
  const validations = {
    status: [{ type: "Required" }],
    source: [],
    draftNumber: [],
    institutionID: [],
    branchID: [],
    borrowerID: [],
    loanProductID: [],
    createdByEmployeeID: [],
    assignedToEmployeeID: [],
    submittedAt: [],
    approvedAt: [],
    rejectedAt: [],
    rejectionReason: [],
    convertedAt: [],
    draftRecord: [{ type: "Required" }, { type: "JSON" }],
    termsSnapshot: [{ type: "JSON" }],
    schedulePreview: [{ type: "JSON" }],
    scheduleHash: [],
    editVersion: [{ type: "Required" }],
    lastEditedByEmployeeID: [],
    lastEditedAt: [],
    principal: [],
    interestRate: [],
    interestCalculationMethod: [],
    startDate: [],
    maturityDate: [],
    loanCurrency: [],
    createdAt: [],
    updatedAt: [],
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
          status,
          source: source ?? null,
          draftNumber: draftNumber ?? null,
          institutionID: institutionID ?? null,
          branchID: branchID ?? null,
          borrowerID: borrowerID ?? null,
          loanProductID: loanProductID ?? null,
          createdByEmployeeID: createdByEmployeeID ?? null,
          assignedToEmployeeID: assignedToEmployeeID ?? null,
          submittedAt: submittedAt ?? null,
          approvedAt: approvedAt ?? null,
          rejectedAt: rejectedAt ?? null,
          rejectionReason: rejectionReason ?? null,
          convertedAt: convertedAt ?? null,
          draftRecord,
          termsSnapshot: termsSnapshot ?? null,
          schedulePreview: schedulePreview ?? null,
          scheduleHash: scheduleHash ?? null,
          editVersion,
          lastEditedByEmployeeID: lastEditedByEmployeeID ?? null,
          lastEditedAt: lastEditedAt ?? null,
          principal: principal ?? null,
          interestRate: interestRate ?? null,
          interestCalculationMethod: interestCalculationMethod ?? null,
          startDate: startDate ?? null,
          maturityDate: maturityDate ?? null,
          loanCurrency: loanCurrency ?? null,
          createdAt: createdAt ?? null,
          updatedAt: updatedAt ?? null,
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
            query: updateLoanDraft.replaceAll("__typename", ""),
            variables: {
              input: {
                id: loanDraftRecord.id,
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
      {...getOverrideProps(overrides, "LoanDraftUpdateForm")}
      {...rest}
    >
      <SelectField
        label="Status"
        placeholder="Please select an option"
        isDisabled={false}
        value={status}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              status: value,
              source,
              draftNumber,
              institutionID,
              branchID,
              borrowerID,
              loanProductID,
              createdByEmployeeID,
              assignedToEmployeeID,
              submittedAt,
              approvedAt,
              rejectedAt,
              rejectionReason,
              convertedAt,
              draftRecord,
              termsSnapshot,
              schedulePreview,
              scheduleHash,
              editVersion,
              lastEditedByEmployeeID,
              lastEditedAt,
              principal,
              interestRate,
              interestCalculationMethod,
              startDate,
              maturityDate,
              loanCurrency,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.status ?? value;
          }
          if (errors.status?.hasError) {
            runValidationTasks("status", value);
          }
          setStatus(value);
        }}
        onBlur={() => runValidationTasks("status", status)}
        errorMessage={errors.status?.errorMessage}
        hasError={errors.status?.hasError}
        {...getOverrideProps(overrides, "status")}
      >
        <option
          children="Draft"
          value="DRAFT"
          {...getOverrideProps(overrides, "statusoption0")}
        ></option>
        <option
          children="Sent for approval"
          value="SENT_FOR_APPROVAL"
          {...getOverrideProps(overrides, "statusoption1")}
        ></option>
        <option
          children="Approved"
          value="APPROVED"
          {...getOverrideProps(overrides, "statusoption2")}
        ></option>
        <option
          children="Rejected"
          value="REJECTED"
          {...getOverrideProps(overrides, "statusoption3")}
        ></option>
        <option
          children="Converted"
          value="CONVERTED"
          {...getOverrideProps(overrides, "statusoption4")}
        ></option>
        <option
          children="Archived"
          value="ARCHIVED"
          {...getOverrideProps(overrides, "statusoption5")}
        ></option>
      </SelectField>
      <SelectField
        label="Source"
        placeholder="Please select an option"
        isDisabled={false}
        value={source}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              status,
              source: value,
              draftNumber,
              institutionID,
              branchID,
              borrowerID,
              loanProductID,
              createdByEmployeeID,
              assignedToEmployeeID,
              submittedAt,
              approvedAt,
              rejectedAt,
              rejectionReason,
              convertedAt,
              draftRecord,
              termsSnapshot,
              schedulePreview,
              scheduleHash,
              editVersion,
              lastEditedByEmployeeID,
              lastEditedAt,
              principal,
              interestRate,
              interestCalculationMethod,
              startDate,
              maturityDate,
              loanCurrency,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.source ?? value;
          }
          if (errors.source?.hasError) {
            runValidationTasks("source", value);
          }
          setSource(value);
        }}
        onBlur={() => runValidationTasks("source", source)}
        errorMessage={errors.source?.errorMessage}
        hasError={errors.source?.hasError}
        {...getOverrideProps(overrides, "source")}
      >
        <option
          children="Blank"
          value="BLANK"
          {...getOverrideProps(overrides, "sourceoption0")}
        ></option>
        <option
          children="Template"
          value="TEMPLATE"
          {...getOverrideProps(overrides, "sourceoption1")}
        ></option>
        <option
          children="Copy"
          value="COPY"
          {...getOverrideProps(overrides, "sourceoption2")}
        ></option>
      </SelectField>
      <TextField
        label="Draft number"
        isRequired={false}
        isReadOnly={false}
        value={draftNumber}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              status,
              source,
              draftNumber: value,
              institutionID,
              branchID,
              borrowerID,
              loanProductID,
              createdByEmployeeID,
              assignedToEmployeeID,
              submittedAt,
              approvedAt,
              rejectedAt,
              rejectionReason,
              convertedAt,
              draftRecord,
              termsSnapshot,
              schedulePreview,
              scheduleHash,
              editVersion,
              lastEditedByEmployeeID,
              lastEditedAt,
              principal,
              interestRate,
              interestCalculationMethod,
              startDate,
              maturityDate,
              loanCurrency,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.draftNumber ?? value;
          }
          if (errors.draftNumber?.hasError) {
            runValidationTasks("draftNumber", value);
          }
          setDraftNumber(value);
        }}
        onBlur={() => runValidationTasks("draftNumber", draftNumber)}
        errorMessage={errors.draftNumber?.errorMessage}
        hasError={errors.draftNumber?.hasError}
        {...getOverrideProps(overrides, "draftNumber")}
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
              status,
              source,
              draftNumber,
              institutionID: value,
              branchID,
              borrowerID,
              loanProductID,
              createdByEmployeeID,
              assignedToEmployeeID,
              submittedAt,
              approvedAt,
              rejectedAt,
              rejectionReason,
              convertedAt,
              draftRecord,
              termsSnapshot,
              schedulePreview,
              scheduleHash,
              editVersion,
              lastEditedByEmployeeID,
              lastEditedAt,
              principal,
              interestRate,
              interestCalculationMethod,
              startDate,
              maturityDate,
              loanCurrency,
              createdAt,
              updatedAt,
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
              status,
              source,
              draftNumber,
              institutionID,
              branchID: value,
              borrowerID,
              loanProductID,
              createdByEmployeeID,
              assignedToEmployeeID,
              submittedAt,
              approvedAt,
              rejectedAt,
              rejectionReason,
              convertedAt,
              draftRecord,
              termsSnapshot,
              schedulePreview,
              scheduleHash,
              editVersion,
              lastEditedByEmployeeID,
              lastEditedAt,
              principal,
              interestRate,
              interestCalculationMethod,
              startDate,
              maturityDate,
              loanCurrency,
              createdAt,
              updatedAt,
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
              status,
              source,
              draftNumber,
              institutionID,
              branchID,
              borrowerID: value,
              loanProductID,
              createdByEmployeeID,
              assignedToEmployeeID,
              submittedAt,
              approvedAt,
              rejectedAt,
              rejectionReason,
              convertedAt,
              draftRecord,
              termsSnapshot,
              schedulePreview,
              scheduleHash,
              editVersion,
              lastEditedByEmployeeID,
              lastEditedAt,
              principal,
              interestRate,
              interestCalculationMethod,
              startDate,
              maturityDate,
              loanCurrency,
              createdAt,
              updatedAt,
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
        label="Loan product id"
        isRequired={false}
        isReadOnly={false}
        value={loanProductID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              status,
              source,
              draftNumber,
              institutionID,
              branchID,
              borrowerID,
              loanProductID: value,
              createdByEmployeeID,
              assignedToEmployeeID,
              submittedAt,
              approvedAt,
              rejectedAt,
              rejectionReason,
              convertedAt,
              draftRecord,
              termsSnapshot,
              schedulePreview,
              scheduleHash,
              editVersion,
              lastEditedByEmployeeID,
              lastEditedAt,
              principal,
              interestRate,
              interestCalculationMethod,
              startDate,
              maturityDate,
              loanCurrency,
              createdAt,
              updatedAt,
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
        label="Created by employee id"
        isRequired={false}
        isReadOnly={false}
        value={createdByEmployeeID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              status,
              source,
              draftNumber,
              institutionID,
              branchID,
              borrowerID,
              loanProductID,
              createdByEmployeeID: value,
              assignedToEmployeeID,
              submittedAt,
              approvedAt,
              rejectedAt,
              rejectionReason,
              convertedAt,
              draftRecord,
              termsSnapshot,
              schedulePreview,
              scheduleHash,
              editVersion,
              lastEditedByEmployeeID,
              lastEditedAt,
              principal,
              interestRate,
              interestCalculationMethod,
              startDate,
              maturityDate,
              loanCurrency,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.createdByEmployeeID ?? value;
          }
          if (errors.createdByEmployeeID?.hasError) {
            runValidationTasks("createdByEmployeeID", value);
          }
          setCreatedByEmployeeID(value);
        }}
        onBlur={() =>
          runValidationTasks("createdByEmployeeID", createdByEmployeeID)
        }
        errorMessage={errors.createdByEmployeeID?.errorMessage}
        hasError={errors.createdByEmployeeID?.hasError}
        {...getOverrideProps(overrides, "createdByEmployeeID")}
      ></TextField>
      <TextField
        label="Assigned to employee id"
        isRequired={false}
        isReadOnly={false}
        value={assignedToEmployeeID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              status,
              source,
              draftNumber,
              institutionID,
              branchID,
              borrowerID,
              loanProductID,
              createdByEmployeeID,
              assignedToEmployeeID: value,
              submittedAt,
              approvedAt,
              rejectedAt,
              rejectionReason,
              convertedAt,
              draftRecord,
              termsSnapshot,
              schedulePreview,
              scheduleHash,
              editVersion,
              lastEditedByEmployeeID,
              lastEditedAt,
              principal,
              interestRate,
              interestCalculationMethod,
              startDate,
              maturityDate,
              loanCurrency,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.assignedToEmployeeID ?? value;
          }
          if (errors.assignedToEmployeeID?.hasError) {
            runValidationTasks("assignedToEmployeeID", value);
          }
          setAssignedToEmployeeID(value);
        }}
        onBlur={() =>
          runValidationTasks("assignedToEmployeeID", assignedToEmployeeID)
        }
        errorMessage={errors.assignedToEmployeeID?.errorMessage}
        hasError={errors.assignedToEmployeeID?.hasError}
        {...getOverrideProps(overrides, "assignedToEmployeeID")}
      ></TextField>
      <TextField
        label="Submitted at"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={submittedAt && convertToLocal(new Date(submittedAt))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              status,
              source,
              draftNumber,
              institutionID,
              branchID,
              borrowerID,
              loanProductID,
              createdByEmployeeID,
              assignedToEmployeeID,
              submittedAt: value,
              approvedAt,
              rejectedAt,
              rejectionReason,
              convertedAt,
              draftRecord,
              termsSnapshot,
              schedulePreview,
              scheduleHash,
              editVersion,
              lastEditedByEmployeeID,
              lastEditedAt,
              principal,
              interestRate,
              interestCalculationMethod,
              startDate,
              maturityDate,
              loanCurrency,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.submittedAt ?? value;
          }
          if (errors.submittedAt?.hasError) {
            runValidationTasks("submittedAt", value);
          }
          setSubmittedAt(value);
        }}
        onBlur={() => runValidationTasks("submittedAt", submittedAt)}
        errorMessage={errors.submittedAt?.errorMessage}
        hasError={errors.submittedAt?.hasError}
        {...getOverrideProps(overrides, "submittedAt")}
      ></TextField>
      <TextField
        label="Approved at"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={approvedAt && convertToLocal(new Date(approvedAt))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              status,
              source,
              draftNumber,
              institutionID,
              branchID,
              borrowerID,
              loanProductID,
              createdByEmployeeID,
              assignedToEmployeeID,
              submittedAt,
              approvedAt: value,
              rejectedAt,
              rejectionReason,
              convertedAt,
              draftRecord,
              termsSnapshot,
              schedulePreview,
              scheduleHash,
              editVersion,
              lastEditedByEmployeeID,
              lastEditedAt,
              principal,
              interestRate,
              interestCalculationMethod,
              startDate,
              maturityDate,
              loanCurrency,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.approvedAt ?? value;
          }
          if (errors.approvedAt?.hasError) {
            runValidationTasks("approvedAt", value);
          }
          setApprovedAt(value);
        }}
        onBlur={() => runValidationTasks("approvedAt", approvedAt)}
        errorMessage={errors.approvedAt?.errorMessage}
        hasError={errors.approvedAt?.hasError}
        {...getOverrideProps(overrides, "approvedAt")}
      ></TextField>
      <TextField
        label="Rejected at"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={rejectedAt && convertToLocal(new Date(rejectedAt))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              status,
              source,
              draftNumber,
              institutionID,
              branchID,
              borrowerID,
              loanProductID,
              createdByEmployeeID,
              assignedToEmployeeID,
              submittedAt,
              approvedAt,
              rejectedAt: value,
              rejectionReason,
              convertedAt,
              draftRecord,
              termsSnapshot,
              schedulePreview,
              scheduleHash,
              editVersion,
              lastEditedByEmployeeID,
              lastEditedAt,
              principal,
              interestRate,
              interestCalculationMethod,
              startDate,
              maturityDate,
              loanCurrency,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.rejectedAt ?? value;
          }
          if (errors.rejectedAt?.hasError) {
            runValidationTasks("rejectedAt", value);
          }
          setRejectedAt(value);
        }}
        onBlur={() => runValidationTasks("rejectedAt", rejectedAt)}
        errorMessage={errors.rejectedAt?.errorMessage}
        hasError={errors.rejectedAt?.hasError}
        {...getOverrideProps(overrides, "rejectedAt")}
      ></TextField>
      <TextField
        label="Rejection reason"
        isRequired={false}
        isReadOnly={false}
        value={rejectionReason}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              status,
              source,
              draftNumber,
              institutionID,
              branchID,
              borrowerID,
              loanProductID,
              createdByEmployeeID,
              assignedToEmployeeID,
              submittedAt,
              approvedAt,
              rejectedAt,
              rejectionReason: value,
              convertedAt,
              draftRecord,
              termsSnapshot,
              schedulePreview,
              scheduleHash,
              editVersion,
              lastEditedByEmployeeID,
              lastEditedAt,
              principal,
              interestRate,
              interestCalculationMethod,
              startDate,
              maturityDate,
              loanCurrency,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.rejectionReason ?? value;
          }
          if (errors.rejectionReason?.hasError) {
            runValidationTasks("rejectionReason", value);
          }
          setRejectionReason(value);
        }}
        onBlur={() => runValidationTasks("rejectionReason", rejectionReason)}
        errorMessage={errors.rejectionReason?.errorMessage}
        hasError={errors.rejectionReason?.hasError}
        {...getOverrideProps(overrides, "rejectionReason")}
      ></TextField>
      <TextField
        label="Converted at"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={convertedAt && convertToLocal(new Date(convertedAt))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              status,
              source,
              draftNumber,
              institutionID,
              branchID,
              borrowerID,
              loanProductID,
              createdByEmployeeID,
              assignedToEmployeeID,
              submittedAt,
              approvedAt,
              rejectedAt,
              rejectionReason,
              convertedAt: value,
              draftRecord,
              termsSnapshot,
              schedulePreview,
              scheduleHash,
              editVersion,
              lastEditedByEmployeeID,
              lastEditedAt,
              principal,
              interestRate,
              interestCalculationMethod,
              startDate,
              maturityDate,
              loanCurrency,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.convertedAt ?? value;
          }
          if (errors.convertedAt?.hasError) {
            runValidationTasks("convertedAt", value);
          }
          setConvertedAt(value);
        }}
        onBlur={() => runValidationTasks("convertedAt", convertedAt)}
        errorMessage={errors.convertedAt?.errorMessage}
        hasError={errors.convertedAt?.hasError}
        {...getOverrideProps(overrides, "convertedAt")}
      ></TextField>
      <TextAreaField
        label="Draft record"
        isRequired={true}
        isReadOnly={false}
        value={draftRecord}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              status,
              source,
              draftNumber,
              institutionID,
              branchID,
              borrowerID,
              loanProductID,
              createdByEmployeeID,
              assignedToEmployeeID,
              submittedAt,
              approvedAt,
              rejectedAt,
              rejectionReason,
              convertedAt,
              draftRecord: value,
              termsSnapshot,
              schedulePreview,
              scheduleHash,
              editVersion,
              lastEditedByEmployeeID,
              lastEditedAt,
              principal,
              interestRate,
              interestCalculationMethod,
              startDate,
              maturityDate,
              loanCurrency,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.draftRecord ?? value;
          }
          if (errors.draftRecord?.hasError) {
            runValidationTasks("draftRecord", value);
          }
          setDraftRecord(value);
        }}
        onBlur={() => runValidationTasks("draftRecord", draftRecord)}
        errorMessage={errors.draftRecord?.errorMessage}
        hasError={errors.draftRecord?.hasError}
        {...getOverrideProps(overrides, "draftRecord")}
      ></TextAreaField>
      <TextAreaField
        label="Terms snapshot"
        isRequired={false}
        isReadOnly={false}
        value={termsSnapshot}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              status,
              source,
              draftNumber,
              institutionID,
              branchID,
              borrowerID,
              loanProductID,
              createdByEmployeeID,
              assignedToEmployeeID,
              submittedAt,
              approvedAt,
              rejectedAt,
              rejectionReason,
              convertedAt,
              draftRecord,
              termsSnapshot: value,
              schedulePreview,
              scheduleHash,
              editVersion,
              lastEditedByEmployeeID,
              lastEditedAt,
              principal,
              interestRate,
              interestCalculationMethod,
              startDate,
              maturityDate,
              loanCurrency,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.termsSnapshot ?? value;
          }
          if (errors.termsSnapshot?.hasError) {
            runValidationTasks("termsSnapshot", value);
          }
          setTermsSnapshot(value);
        }}
        onBlur={() => runValidationTasks("termsSnapshot", termsSnapshot)}
        errorMessage={errors.termsSnapshot?.errorMessage}
        hasError={errors.termsSnapshot?.hasError}
        {...getOverrideProps(overrides, "termsSnapshot")}
      ></TextAreaField>
      <TextAreaField
        label="Schedule preview"
        isRequired={false}
        isReadOnly={false}
        value={schedulePreview}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              status,
              source,
              draftNumber,
              institutionID,
              branchID,
              borrowerID,
              loanProductID,
              createdByEmployeeID,
              assignedToEmployeeID,
              submittedAt,
              approvedAt,
              rejectedAt,
              rejectionReason,
              convertedAt,
              draftRecord,
              termsSnapshot,
              schedulePreview: value,
              scheduleHash,
              editVersion,
              lastEditedByEmployeeID,
              lastEditedAt,
              principal,
              interestRate,
              interestCalculationMethod,
              startDate,
              maturityDate,
              loanCurrency,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.schedulePreview ?? value;
          }
          if (errors.schedulePreview?.hasError) {
            runValidationTasks("schedulePreview", value);
          }
          setSchedulePreview(value);
        }}
        onBlur={() => runValidationTasks("schedulePreview", schedulePreview)}
        errorMessage={errors.schedulePreview?.errorMessage}
        hasError={errors.schedulePreview?.hasError}
        {...getOverrideProps(overrides, "schedulePreview")}
      ></TextAreaField>
      <TextField
        label="Schedule hash"
        isRequired={false}
        isReadOnly={false}
        value={scheduleHash}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              status,
              source,
              draftNumber,
              institutionID,
              branchID,
              borrowerID,
              loanProductID,
              createdByEmployeeID,
              assignedToEmployeeID,
              submittedAt,
              approvedAt,
              rejectedAt,
              rejectionReason,
              convertedAt,
              draftRecord,
              termsSnapshot,
              schedulePreview,
              scheduleHash: value,
              editVersion,
              lastEditedByEmployeeID,
              lastEditedAt,
              principal,
              interestRate,
              interestCalculationMethod,
              startDate,
              maturityDate,
              loanCurrency,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.scheduleHash ?? value;
          }
          if (errors.scheduleHash?.hasError) {
            runValidationTasks("scheduleHash", value);
          }
          setScheduleHash(value);
        }}
        onBlur={() => runValidationTasks("scheduleHash", scheduleHash)}
        errorMessage={errors.scheduleHash?.errorMessage}
        hasError={errors.scheduleHash?.hasError}
        {...getOverrideProps(overrides, "scheduleHash")}
      ></TextField>
      <TextField
        label="Edit version"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={editVersion}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              status,
              source,
              draftNumber,
              institutionID,
              branchID,
              borrowerID,
              loanProductID,
              createdByEmployeeID,
              assignedToEmployeeID,
              submittedAt,
              approvedAt,
              rejectedAt,
              rejectionReason,
              convertedAt,
              draftRecord,
              termsSnapshot,
              schedulePreview,
              scheduleHash,
              editVersion: value,
              lastEditedByEmployeeID,
              lastEditedAt,
              principal,
              interestRate,
              interestCalculationMethod,
              startDate,
              maturityDate,
              loanCurrency,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.editVersion ?? value;
          }
          if (errors.editVersion?.hasError) {
            runValidationTasks("editVersion", value);
          }
          setEditVersion(value);
        }}
        onBlur={() => runValidationTasks("editVersion", editVersion)}
        errorMessage={errors.editVersion?.errorMessage}
        hasError={errors.editVersion?.hasError}
        {...getOverrideProps(overrides, "editVersion")}
      ></TextField>
      <TextField
        label="Last edited by employee id"
        isRequired={false}
        isReadOnly={false}
        value={lastEditedByEmployeeID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              status,
              source,
              draftNumber,
              institutionID,
              branchID,
              borrowerID,
              loanProductID,
              createdByEmployeeID,
              assignedToEmployeeID,
              submittedAt,
              approvedAt,
              rejectedAt,
              rejectionReason,
              convertedAt,
              draftRecord,
              termsSnapshot,
              schedulePreview,
              scheduleHash,
              editVersion,
              lastEditedByEmployeeID: value,
              lastEditedAt,
              principal,
              interestRate,
              interestCalculationMethod,
              startDate,
              maturityDate,
              loanCurrency,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.lastEditedByEmployeeID ?? value;
          }
          if (errors.lastEditedByEmployeeID?.hasError) {
            runValidationTasks("lastEditedByEmployeeID", value);
          }
          setLastEditedByEmployeeID(value);
        }}
        onBlur={() =>
          runValidationTasks("lastEditedByEmployeeID", lastEditedByEmployeeID)
        }
        errorMessage={errors.lastEditedByEmployeeID?.errorMessage}
        hasError={errors.lastEditedByEmployeeID?.hasError}
        {...getOverrideProps(overrides, "lastEditedByEmployeeID")}
      ></TextField>
      <TextField
        label="Last edited at"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={lastEditedAt && convertToLocal(new Date(lastEditedAt))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              status,
              source,
              draftNumber,
              institutionID,
              branchID,
              borrowerID,
              loanProductID,
              createdByEmployeeID,
              assignedToEmployeeID,
              submittedAt,
              approvedAt,
              rejectedAt,
              rejectionReason,
              convertedAt,
              draftRecord,
              termsSnapshot,
              schedulePreview,
              scheduleHash,
              editVersion,
              lastEditedByEmployeeID,
              lastEditedAt: value,
              principal,
              interestRate,
              interestCalculationMethod,
              startDate,
              maturityDate,
              loanCurrency,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.lastEditedAt ?? value;
          }
          if (errors.lastEditedAt?.hasError) {
            runValidationTasks("lastEditedAt", value);
          }
          setLastEditedAt(value);
        }}
        onBlur={() => runValidationTasks("lastEditedAt", lastEditedAt)}
        errorMessage={errors.lastEditedAt?.errorMessage}
        hasError={errors.lastEditedAt?.hasError}
        {...getOverrideProps(overrides, "lastEditedAt")}
      ></TextField>
      <TextField
        label="Principal"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={principal}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              status,
              source,
              draftNumber,
              institutionID,
              branchID,
              borrowerID,
              loanProductID,
              createdByEmployeeID,
              assignedToEmployeeID,
              submittedAt,
              approvedAt,
              rejectedAt,
              rejectionReason,
              convertedAt,
              draftRecord,
              termsSnapshot,
              schedulePreview,
              scheduleHash,
              editVersion,
              lastEditedByEmployeeID,
              lastEditedAt,
              principal: value,
              interestRate,
              interestCalculationMethod,
              startDate,
              maturityDate,
              loanCurrency,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.principal ?? value;
          }
          if (errors.principal?.hasError) {
            runValidationTasks("principal", value);
          }
          setPrincipal(value);
        }}
        onBlur={() => runValidationTasks("principal", principal)}
        errorMessage={errors.principal?.errorMessage}
        hasError={errors.principal?.hasError}
        {...getOverrideProps(overrides, "principal")}
      ></TextField>
      <TextField
        label="Interest rate"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={interestRate}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              status,
              source,
              draftNumber,
              institutionID,
              branchID,
              borrowerID,
              loanProductID,
              createdByEmployeeID,
              assignedToEmployeeID,
              submittedAt,
              approvedAt,
              rejectedAt,
              rejectionReason,
              convertedAt,
              draftRecord,
              termsSnapshot,
              schedulePreview,
              scheduleHash,
              editVersion,
              lastEditedByEmployeeID,
              lastEditedAt,
              principal,
              interestRate: value,
              interestCalculationMethod,
              startDate,
              maturityDate,
              loanCurrency,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.interestRate ?? value;
          }
          if (errors.interestRate?.hasError) {
            runValidationTasks("interestRate", value);
          }
          setInterestRate(value);
        }}
        onBlur={() => runValidationTasks("interestRate", interestRate)}
        errorMessage={errors.interestRate?.errorMessage}
        hasError={errors.interestRate?.hasError}
        {...getOverrideProps(overrides, "interestRate")}
      ></TextField>
      <SelectField
        label="Interest calculation method"
        placeholder="Please select an option"
        isDisabled={false}
        value={interestCalculationMethod}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              status,
              source,
              draftNumber,
              institutionID,
              branchID,
              borrowerID,
              loanProductID,
              createdByEmployeeID,
              assignedToEmployeeID,
              submittedAt,
              approvedAt,
              rejectedAt,
              rejectionReason,
              convertedAt,
              draftRecord,
              termsSnapshot,
              schedulePreview,
              scheduleHash,
              editVersion,
              lastEditedByEmployeeID,
              lastEditedAt,
              principal,
              interestRate,
              interestCalculationMethod: value,
              startDate,
              maturityDate,
              loanCurrency,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.interestCalculationMethod ?? value;
          }
          if (errors.interestCalculationMethod?.hasError) {
            runValidationTasks("interestCalculationMethod", value);
          }
          setInterestCalculationMethod(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "interestCalculationMethod",
            interestCalculationMethod
          )
        }
        errorMessage={errors.interestCalculationMethod?.errorMessage}
        hasError={errors.interestCalculationMethod?.hasError}
        {...getOverrideProps(overrides, "interestCalculationMethod")}
      >
        <option
          children="Simple"
          value="SIMPLE"
          {...getOverrideProps(overrides, "interestCalculationMethodoption0")}
        ></option>
        <option
          children="Compound"
          value="COMPOUND"
          {...getOverrideProps(overrides, "interestCalculationMethodoption1")}
        ></option>
        <option
          children="Flat"
          value="FLAT"
          {...getOverrideProps(overrides, "interestCalculationMethodoption2")}
        ></option>
      </SelectField>
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
              status,
              source,
              draftNumber,
              institutionID,
              branchID,
              borrowerID,
              loanProductID,
              createdByEmployeeID,
              assignedToEmployeeID,
              submittedAt,
              approvedAt,
              rejectedAt,
              rejectionReason,
              convertedAt,
              draftRecord,
              termsSnapshot,
              schedulePreview,
              scheduleHash,
              editVersion,
              lastEditedByEmployeeID,
              lastEditedAt,
              principal,
              interestRate,
              interestCalculationMethod,
              startDate: value,
              maturityDate,
              loanCurrency,
              createdAt,
              updatedAt,
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
        label="Maturity date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={maturityDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              status,
              source,
              draftNumber,
              institutionID,
              branchID,
              borrowerID,
              loanProductID,
              createdByEmployeeID,
              assignedToEmployeeID,
              submittedAt,
              approvedAt,
              rejectedAt,
              rejectionReason,
              convertedAt,
              draftRecord,
              termsSnapshot,
              schedulePreview,
              scheduleHash,
              editVersion,
              lastEditedByEmployeeID,
              lastEditedAt,
              principal,
              interestRate,
              interestCalculationMethod,
              startDate,
              maturityDate: value,
              loanCurrency,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.maturityDate ?? value;
          }
          if (errors.maturityDate?.hasError) {
            runValidationTasks("maturityDate", value);
          }
          setMaturityDate(value);
        }}
        onBlur={() => runValidationTasks("maturityDate", maturityDate)}
        errorMessage={errors.maturityDate?.errorMessage}
        hasError={errors.maturityDate?.hasError}
        {...getOverrideProps(overrides, "maturityDate")}
      ></TextField>
      <TextField
        label="Loan currency"
        isRequired={false}
        isReadOnly={false}
        value={loanCurrency}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              status,
              source,
              draftNumber,
              institutionID,
              branchID,
              borrowerID,
              loanProductID,
              createdByEmployeeID,
              assignedToEmployeeID,
              submittedAt,
              approvedAt,
              rejectedAt,
              rejectionReason,
              convertedAt,
              draftRecord,
              termsSnapshot,
              schedulePreview,
              scheduleHash,
              editVersion,
              lastEditedByEmployeeID,
              lastEditedAt,
              principal,
              interestRate,
              interestCalculationMethod,
              startDate,
              maturityDate,
              loanCurrency: value,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.loanCurrency ?? value;
          }
          if (errors.loanCurrency?.hasError) {
            runValidationTasks("loanCurrency", value);
          }
          setLoanCurrency(value);
        }}
        onBlur={() => runValidationTasks("loanCurrency", loanCurrency)}
        errorMessage={errors.loanCurrency?.errorMessage}
        hasError={errors.loanCurrency?.hasError}
        {...getOverrideProps(overrides, "loanCurrency")}
      ></TextField>
      <TextField
        label="Created at"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={createdAt && convertToLocal(new Date(createdAt))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              status,
              source,
              draftNumber,
              institutionID,
              branchID,
              borrowerID,
              loanProductID,
              createdByEmployeeID,
              assignedToEmployeeID,
              submittedAt,
              approvedAt,
              rejectedAt,
              rejectionReason,
              convertedAt,
              draftRecord,
              termsSnapshot,
              schedulePreview,
              scheduleHash,
              editVersion,
              lastEditedByEmployeeID,
              lastEditedAt,
              principal,
              interestRate,
              interestCalculationMethod,
              startDate,
              maturityDate,
              loanCurrency,
              createdAt: value,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.createdAt ?? value;
          }
          if (errors.createdAt?.hasError) {
            runValidationTasks("createdAt", value);
          }
          setCreatedAt(value);
        }}
        onBlur={() => runValidationTasks("createdAt", createdAt)}
        errorMessage={errors.createdAt?.errorMessage}
        hasError={errors.createdAt?.hasError}
        {...getOverrideProps(overrides, "createdAt")}
      ></TextField>
      <TextField
        label="Updated at"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={updatedAt && convertToLocal(new Date(updatedAt))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              status,
              source,
              draftNumber,
              institutionID,
              branchID,
              borrowerID,
              loanProductID,
              createdByEmployeeID,
              assignedToEmployeeID,
              submittedAt,
              approvedAt,
              rejectedAt,
              rejectionReason,
              convertedAt,
              draftRecord,
              termsSnapshot,
              schedulePreview,
              scheduleHash,
              editVersion,
              lastEditedByEmployeeID,
              lastEditedAt,
              principal,
              interestRate,
              interestCalculationMethod,
              startDate,
              maturityDate,
              loanCurrency,
              createdAt,
              updatedAt: value,
            };
            const result = onChange(modelFields);
            value = result?.updatedAt ?? value;
          }
          if (errors.updatedAt?.hasError) {
            runValidationTasks("updatedAt", value);
          }
          setUpdatedAt(value);
        }}
        onBlur={() => runValidationTasks("updatedAt", updatedAt)}
        errorMessage={errors.updatedAt?.errorMessage}
        hasError={errors.updatedAt?.hasError}
        {...getOverrideProps(overrides, "updatedAt")}
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
          isDisabled={!(idProp || loanDraftModelProp)}
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
              !(idProp || loanDraftModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
