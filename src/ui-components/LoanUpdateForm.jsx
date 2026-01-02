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
import { getLoan } from "../graphql/queries";
import { updateLoan } from "../graphql/mutations";
const client = generateClient();
export default function LoanUpdateForm(props) {
  const {
    id: idProp,
    loan: loanModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    loanNumber: "",
    approvalStatus: "",
    approvalStatusEnum: "",
    approvedDate: "",
    principal: "",
    fees: "",
    interestRate: "",
    startDate: "",
    maturityDate: "",
    stopDate: "",
    extensionPeriod: "",
    duration: "",
    durationInterval: "",
    loanType: "",
    rateInterval: "",
    loanStatus: "",
    loanStatusEnum: "",
    loanCurrency: "",
    loanPurpose: "",
    loanComputationRecord: "",
    loanAttribute1: "",
    loanAttribute2: "",
    numberOfPayments: "",
    paymentFrequency: "",
    customFieldsData: "",
    status: "",
    customLoanDetails: "",
  };
  const [loanNumber, setLoanNumber] = React.useState(initialValues.loanNumber);
  const [approvalStatus, setApprovalStatus] = React.useState(
    initialValues.approvalStatus
  );
  const [approvalStatusEnum, setApprovalStatusEnum] = React.useState(
    initialValues.approvalStatusEnum
  );
  const [approvedDate, setApprovedDate] = React.useState(
    initialValues.approvedDate
  );
  const [principal, setPrincipal] = React.useState(initialValues.principal);
  const [fees, setFees] = React.useState(initialValues.fees);
  const [interestRate, setInterestRate] = React.useState(
    initialValues.interestRate
  );
  const [startDate, setStartDate] = React.useState(initialValues.startDate);
  const [maturityDate, setMaturityDate] = React.useState(
    initialValues.maturityDate
  );
  const [stopDate, setStopDate] = React.useState(initialValues.stopDate);
  const [extensionPeriod, setExtensionPeriod] = React.useState(
    initialValues.extensionPeriod
  );
  const [duration, setDuration] = React.useState(initialValues.duration);
  const [durationInterval, setDurationInterval] = React.useState(
    initialValues.durationInterval
  );
  const [loanType, setLoanType] = React.useState(initialValues.loanType);
  const [rateInterval, setRateInterval] = React.useState(
    initialValues.rateInterval
  );
  const [loanStatus, setLoanStatus] = React.useState(initialValues.loanStatus);
  const [loanStatusEnum, setLoanStatusEnum] = React.useState(
    initialValues.loanStatusEnum
  );
  const [loanCurrency, setLoanCurrency] = React.useState(
    initialValues.loanCurrency
  );
  const [loanPurpose, setLoanPurpose] = React.useState(
    initialValues.loanPurpose
  );
  const [loanComputationRecord, setLoanComputationRecord] = React.useState(
    initialValues.loanComputationRecord
  );
  const [loanAttribute1, setLoanAttribute1] = React.useState(
    initialValues.loanAttribute1
  );
  const [loanAttribute2, setLoanAttribute2] = React.useState(
    initialValues.loanAttribute2
  );
  const [numberOfPayments, setNumberOfPayments] = React.useState(
    initialValues.numberOfPayments
  );
  const [paymentFrequency, setPaymentFrequency] = React.useState(
    initialValues.paymentFrequency
  );
  const [customFieldsData, setCustomFieldsData] = React.useState(
    initialValues.customFieldsData
  );
  const [status, setStatus] = React.useState(initialValues.status);
  const [customLoanDetails, setCustomLoanDetails] = React.useState(
    initialValues.customLoanDetails
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = loanRecord
      ? { ...initialValues, ...loanRecord }
      : initialValues;
    setLoanNumber(cleanValues.loanNumber);
    setApprovalStatus(cleanValues.approvalStatus);
    setApprovalStatusEnum(cleanValues.approvalStatusEnum);
    setApprovedDate(cleanValues.approvedDate);
    setPrincipal(cleanValues.principal);
    setFees(cleanValues.fees);
    setInterestRate(cleanValues.interestRate);
    setStartDate(cleanValues.startDate);
    setMaturityDate(cleanValues.maturityDate);
    setStopDate(cleanValues.stopDate);
    setExtensionPeriod(cleanValues.extensionPeriod);
    setDuration(cleanValues.duration);
    setDurationInterval(cleanValues.durationInterval);
    setLoanType(cleanValues.loanType);
    setRateInterval(cleanValues.rateInterval);
    setLoanStatus(cleanValues.loanStatus);
    setLoanStatusEnum(cleanValues.loanStatusEnum);
    setLoanCurrency(cleanValues.loanCurrency);
    setLoanPurpose(cleanValues.loanPurpose);
    setLoanComputationRecord(
      typeof cleanValues.loanComputationRecord === "string" ||
        cleanValues.loanComputationRecord === null
        ? cleanValues.loanComputationRecord
        : JSON.stringify(cleanValues.loanComputationRecord)
    );
    setLoanAttribute1(cleanValues.loanAttribute1);
    setLoanAttribute2(cleanValues.loanAttribute2);
    setNumberOfPayments(cleanValues.numberOfPayments);
    setPaymentFrequency(cleanValues.paymentFrequency);
    setCustomFieldsData(
      typeof cleanValues.customFieldsData === "string" ||
        cleanValues.customFieldsData === null
        ? cleanValues.customFieldsData
        : JSON.stringify(cleanValues.customFieldsData)
    );
    setStatus(cleanValues.status);
    setCustomLoanDetails(
      typeof cleanValues.customLoanDetails === "string" ||
        cleanValues.customLoanDetails === null
        ? cleanValues.customLoanDetails
        : JSON.stringify(cleanValues.customLoanDetails)
    );
    setErrors({});
  };
  const [loanRecord, setLoanRecord] = React.useState(loanModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getLoan.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getLoan
        : loanModelProp;
      setLoanRecord(record);
    };
    queryData();
  }, [idProp, loanModelProp]);
  React.useEffect(resetStateValues, [loanRecord]);
  const validations = {
    loanNumber: [],
    approvalStatus: [],
    approvalStatusEnum: [],
    approvedDate: [],
    principal: [],
    fees: [],
    interestRate: [],
    startDate: [],
    maturityDate: [],
    stopDate: [],
    extensionPeriod: [],
    duration: [],
    durationInterval: [],
    loanType: [],
    rateInterval: [],
    loanStatus: [],
    loanStatusEnum: [],
    loanCurrency: [],
    loanPurpose: [],
    loanComputationRecord: [{ type: "JSON" }],
    loanAttribute1: [],
    loanAttribute2: [],
    numberOfPayments: [],
    paymentFrequency: [],
    customFieldsData: [{ type: "JSON" }],
    status: [],
    customLoanDetails: [{ type: "JSON" }],
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
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          loanNumber: loanNumber ?? null,
          approvalStatus: approvalStatus ?? null,
          approvalStatusEnum: approvalStatusEnum ?? null,
          approvedDate: approvedDate ?? null,
          principal: principal ?? null,
          fees: fees ?? null,
          interestRate: interestRate ?? null,
          startDate: startDate ?? null,
          maturityDate: maturityDate ?? null,
          stopDate: stopDate ?? null,
          extensionPeriod: extensionPeriod ?? null,
          duration: duration ?? null,
          durationInterval: durationInterval ?? null,
          loanType: loanType ?? null,
          rateInterval: rateInterval ?? null,
          loanStatus: loanStatus ?? null,
          loanStatusEnum: loanStatusEnum ?? null,
          loanCurrency: loanCurrency ?? null,
          loanPurpose: loanPurpose ?? null,
          loanComputationRecord: loanComputationRecord ?? null,
          loanAttribute1: loanAttribute1 ?? null,
          loanAttribute2: loanAttribute2 ?? null,
          numberOfPayments: numberOfPayments ?? null,
          paymentFrequency: paymentFrequency ?? null,
          customFieldsData: customFieldsData ?? null,
          status: status ?? null,
          customLoanDetails: customLoanDetails ?? null,
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
            query: updateLoan.replaceAll("__typename", ""),
            variables: {
              input: {
                id: loanRecord.id,
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
      {...getOverrideProps(overrides, "LoanUpdateForm")}
      {...rest}
    >
      <TextField
        label="Loan number"
        isRequired={false}
        isReadOnly={false}
        value={loanNumber}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanNumber: value,
              approvalStatus,
              approvalStatusEnum,
              approvedDate,
              principal,
              fees,
              interestRate,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval,
              loanType,
              rateInterval,
              loanStatus,
              loanStatusEnum,
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
              status,
              customLoanDetails,
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
        label="Approval status"
        isRequired={false}
        isReadOnly={false}
        value={approvalStatus}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanNumber,
              approvalStatus: value,
              approvalStatusEnum,
              approvedDate,
              principal,
              fees,
              interestRate,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval,
              loanType,
              rateInterval,
              loanStatus,
              loanStatusEnum,
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
              status,
              customLoanDetails,
            };
            const result = onChange(modelFields);
            value = result?.approvalStatus ?? value;
          }
          if (errors.approvalStatus?.hasError) {
            runValidationTasks("approvalStatus", value);
          }
          setApprovalStatus(value);
        }}
        onBlur={() => runValidationTasks("approvalStatus", approvalStatus)}
        errorMessage={errors.approvalStatus?.errorMessage}
        hasError={errors.approvalStatus?.hasError}
        {...getOverrideProps(overrides, "approvalStatus")}
      ></TextField>
      <SelectField
        label="Approval status enum"
        placeholder="Please select an option"
        isDisabled={false}
        value={approvalStatusEnum}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanNumber,
              approvalStatus,
              approvalStatusEnum: value,
              approvedDate,
              principal,
              fees,
              interestRate,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval,
              loanType,
              rateInterval,
              loanStatus,
              loanStatusEnum,
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
              status,
              customLoanDetails,
            };
            const result = onChange(modelFields);
            value = result?.approvalStatusEnum ?? value;
          }
          if (errors.approvalStatusEnum?.hasError) {
            runValidationTasks("approvalStatusEnum", value);
          }
          setApprovalStatusEnum(value);
        }}
        onBlur={() =>
          runValidationTasks("approvalStatusEnum", approvalStatusEnum)
        }
        errorMessage={errors.approvalStatusEnum?.errorMessage}
        hasError={errors.approvalStatusEnum?.hasError}
        {...getOverrideProps(overrides, "approvalStatusEnum")}
      >
        <option
          children="Pending"
          value="PENDING"
          {...getOverrideProps(overrides, "approvalStatusEnumoption0")}
        ></option>
        <option
          children="Approved"
          value="APPROVED"
          {...getOverrideProps(overrides, "approvalStatusEnumoption1")}
        ></option>
        <option
          children="Rejected"
          value="REJECTED"
          {...getOverrideProps(overrides, "approvalStatusEnumoption2")}
        ></option>
      </SelectField>
      <TextField
        label="Approved date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={approvedDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanNumber,
              approvalStatus,
              approvalStatusEnum,
              approvedDate: value,
              principal,
              fees,
              interestRate,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval,
              loanType,
              rateInterval,
              loanStatus,
              loanStatusEnum,
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
              status,
              customLoanDetails,
            };
            const result = onChange(modelFields);
            value = result?.approvedDate ?? value;
          }
          if (errors.approvedDate?.hasError) {
            runValidationTasks("approvedDate", value);
          }
          setApprovedDate(value);
        }}
        onBlur={() => runValidationTasks("approvedDate", approvedDate)}
        errorMessage={errors.approvedDate?.errorMessage}
        hasError={errors.approvedDate?.hasError}
        {...getOverrideProps(overrides, "approvedDate")}
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
              loanNumber,
              approvalStatus,
              approvalStatusEnum,
              approvedDate,
              principal: value,
              fees,
              interestRate,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval,
              loanType,
              rateInterval,
              loanStatus,
              loanStatusEnum,
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
              status,
              customLoanDetails,
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
        label="Fees"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={fees}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              loanNumber,
              approvalStatus,
              approvalStatusEnum,
              approvedDate,
              principal,
              fees: value,
              interestRate,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval,
              loanType,
              rateInterval,
              loanStatus,
              loanStatusEnum,
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
              status,
              customLoanDetails,
            };
            const result = onChange(modelFields);
            value = result?.fees ?? value;
          }
          if (errors.fees?.hasError) {
            runValidationTasks("fees", value);
          }
          setFees(value);
        }}
        onBlur={() => runValidationTasks("fees", fees)}
        errorMessage={errors.fees?.errorMessage}
        hasError={errors.fees?.hasError}
        {...getOverrideProps(overrides, "fees")}
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
              loanNumber,
              approvalStatus,
              approvalStatusEnum,
              approvedDate,
              principal,
              fees,
              interestRate: value,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval,
              loanType,
              rateInterval,
              loanStatus,
              loanStatusEnum,
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
              status,
              customLoanDetails,
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
              loanNumber,
              approvalStatus,
              approvalStatusEnum,
              approvedDate,
              principal,
              fees,
              interestRate,
              startDate: value,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval,
              loanType,
              rateInterval,
              loanStatus,
              loanStatusEnum,
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
              status,
              customLoanDetails,
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
              loanNumber,
              approvalStatus,
              approvalStatusEnum,
              approvedDate,
              principal,
              fees,
              interestRate,
              startDate,
              maturityDate: value,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval,
              loanType,
              rateInterval,
              loanStatus,
              loanStatusEnum,
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
              status,
              customLoanDetails,
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
        label="Stop date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={stopDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanNumber,
              approvalStatus,
              approvalStatusEnum,
              approvedDate,
              principal,
              fees,
              interestRate,
              startDate,
              maturityDate,
              stopDate: value,
              extensionPeriod,
              duration,
              durationInterval,
              loanType,
              rateInterval,
              loanStatus,
              loanStatusEnum,
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
              status,
              customLoanDetails,
            };
            const result = onChange(modelFields);
            value = result?.stopDate ?? value;
          }
          if (errors.stopDate?.hasError) {
            runValidationTasks("stopDate", value);
          }
          setStopDate(value);
        }}
        onBlur={() => runValidationTasks("stopDate", stopDate)}
        errorMessage={errors.stopDate?.errorMessage}
        hasError={errors.stopDate?.hasError}
        {...getOverrideProps(overrides, "stopDate")}
      ></TextField>
      <TextField
        label="Extension period"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={extensionPeriod}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              loanNumber,
              approvalStatus,
              approvalStatusEnum,
              approvedDate,
              principal,
              fees,
              interestRate,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod: value,
              duration,
              durationInterval,
              loanType,
              rateInterval,
              loanStatus,
              loanStatusEnum,
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
              status,
              customLoanDetails,
            };
            const result = onChange(modelFields);
            value = result?.extensionPeriod ?? value;
          }
          if (errors.extensionPeriod?.hasError) {
            runValidationTasks("extensionPeriod", value);
          }
          setExtensionPeriod(value);
        }}
        onBlur={() => runValidationTasks("extensionPeriod", extensionPeriod)}
        errorMessage={errors.extensionPeriod?.errorMessage}
        hasError={errors.extensionPeriod?.hasError}
        {...getOverrideProps(overrides, "extensionPeriod")}
      ></TextField>
      <TextField
        label="Duration"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={duration}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              loanNumber,
              approvalStatus,
              approvalStatusEnum,
              approvedDate,
              principal,
              fees,
              interestRate,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration: value,
              durationInterval,
              loanType,
              rateInterval,
              loanStatus,
              loanStatusEnum,
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
              status,
              customLoanDetails,
            };
            const result = onChange(modelFields);
            value = result?.duration ?? value;
          }
          if (errors.duration?.hasError) {
            runValidationTasks("duration", value);
          }
          setDuration(value);
        }}
        onBlur={() => runValidationTasks("duration", duration)}
        errorMessage={errors.duration?.errorMessage}
        hasError={errors.duration?.hasError}
        {...getOverrideProps(overrides, "duration")}
      ></TextField>
      <TextField
        label="Duration interval"
        isRequired={false}
        isReadOnly={false}
        value={durationInterval}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanNumber,
              approvalStatus,
              approvalStatusEnum,
              approvedDate,
              principal,
              fees,
              interestRate,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval: value,
              loanType,
              rateInterval,
              loanStatus,
              loanStatusEnum,
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
              status,
              customLoanDetails,
            };
            const result = onChange(modelFields);
            value = result?.durationInterval ?? value;
          }
          if (errors.durationInterval?.hasError) {
            runValidationTasks("durationInterval", value);
          }
          setDurationInterval(value);
        }}
        onBlur={() => runValidationTasks("durationInterval", durationInterval)}
        errorMessage={errors.durationInterval?.errorMessage}
        hasError={errors.durationInterval?.hasError}
        {...getOverrideProps(overrides, "durationInterval")}
      ></TextField>
      <TextField
        label="Loan type"
        isRequired={false}
        isReadOnly={false}
        value={loanType}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanNumber,
              approvalStatus,
              approvalStatusEnum,
              approvedDate,
              principal,
              fees,
              interestRate,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval,
              loanType: value,
              rateInterval,
              loanStatus,
              loanStatusEnum,
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
              status,
              customLoanDetails,
            };
            const result = onChange(modelFields);
            value = result?.loanType ?? value;
          }
          if (errors.loanType?.hasError) {
            runValidationTasks("loanType", value);
          }
          setLoanType(value);
        }}
        onBlur={() => runValidationTasks("loanType", loanType)}
        errorMessage={errors.loanType?.errorMessage}
        hasError={errors.loanType?.hasError}
        {...getOverrideProps(overrides, "loanType")}
      ></TextField>
      <TextField
        label="Rate interval"
        isRequired={false}
        isReadOnly={false}
        value={rateInterval}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanNumber,
              approvalStatus,
              approvalStatusEnum,
              approvedDate,
              principal,
              fees,
              interestRate,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval,
              loanType,
              rateInterval: value,
              loanStatus,
              loanStatusEnum,
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
              status,
              customLoanDetails,
            };
            const result = onChange(modelFields);
            value = result?.rateInterval ?? value;
          }
          if (errors.rateInterval?.hasError) {
            runValidationTasks("rateInterval", value);
          }
          setRateInterval(value);
        }}
        onBlur={() => runValidationTasks("rateInterval", rateInterval)}
        errorMessage={errors.rateInterval?.errorMessage}
        hasError={errors.rateInterval?.hasError}
        {...getOverrideProps(overrides, "rateInterval")}
      ></TextField>
      <TextField
        label="Loan status"
        isRequired={false}
        isReadOnly={false}
        value={loanStatus}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanNumber,
              approvalStatus,
              approvalStatusEnum,
              approvedDate,
              principal,
              fees,
              interestRate,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval,
              loanType,
              rateInterval,
              loanStatus: value,
              loanStatusEnum,
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
              status,
              customLoanDetails,
            };
            const result = onChange(modelFields);
            value = result?.loanStatus ?? value;
          }
          if (errors.loanStatus?.hasError) {
            runValidationTasks("loanStatus", value);
          }
          setLoanStatus(value);
        }}
        onBlur={() => runValidationTasks("loanStatus", loanStatus)}
        errorMessage={errors.loanStatus?.errorMessage}
        hasError={errors.loanStatus?.hasError}
        {...getOverrideProps(overrides, "loanStatus")}
      ></TextField>
      <SelectField
        label="Loan status enum"
        placeholder="Please select an option"
        isDisabled={false}
        value={loanStatusEnum}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanNumber,
              approvalStatus,
              approvalStatusEnum,
              approvedDate,
              principal,
              fees,
              interestRate,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval,
              loanType,
              rateInterval,
              loanStatus,
              loanStatusEnum: value,
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
              status,
              customLoanDetails,
            };
            const result = onChange(modelFields);
            value = result?.loanStatusEnum ?? value;
          }
          if (errors.loanStatusEnum?.hasError) {
            runValidationTasks("loanStatusEnum", value);
          }
          setLoanStatusEnum(value);
        }}
        onBlur={() => runValidationTasks("loanStatusEnum", loanStatusEnum)}
        errorMessage={errors.loanStatusEnum?.errorMessage}
        hasError={errors.loanStatusEnum?.hasError}
        {...getOverrideProps(overrides, "loanStatusEnum")}
      >
        <option
          children="Draft"
          value="DRAFT"
          {...getOverrideProps(overrides, "loanStatusEnumoption0")}
        ></option>
        <option
          children="Approved"
          value="APPROVED"
          {...getOverrideProps(overrides, "loanStatusEnumoption1")}
        ></option>
        <option
          children="Active"
          value="ACTIVE"
          {...getOverrideProps(overrides, "loanStatusEnumoption2")}
        ></option>
        <option
          children="Closed"
          value="CLOSED"
          {...getOverrideProps(overrides, "loanStatusEnumoption3")}
        ></option>
        <option
          children="Written off"
          value="WRITTEN_OFF"
          {...getOverrideProps(overrides, "loanStatusEnumoption4")}
        ></option>
        <option
          children="Voided"
          value="VOIDED"
          {...getOverrideProps(overrides, "loanStatusEnumoption5")}
        ></option>
      </SelectField>
      <TextField
        label="Loan currency"
        isRequired={false}
        isReadOnly={false}
        value={loanCurrency}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanNumber,
              approvalStatus,
              approvalStatusEnum,
              approvedDate,
              principal,
              fees,
              interestRate,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval,
              loanType,
              rateInterval,
              loanStatus,
              loanStatusEnum,
              loanCurrency: value,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
              status,
              customLoanDetails,
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
        label="Loan purpose"
        isRequired={false}
        isReadOnly={false}
        value={loanPurpose}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanNumber,
              approvalStatus,
              approvalStatusEnum,
              approvedDate,
              principal,
              fees,
              interestRate,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval,
              loanType,
              rateInterval,
              loanStatus,
              loanStatusEnum,
              loanCurrency,
              loanPurpose: value,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
              status,
              customLoanDetails,
            };
            const result = onChange(modelFields);
            value = result?.loanPurpose ?? value;
          }
          if (errors.loanPurpose?.hasError) {
            runValidationTasks("loanPurpose", value);
          }
          setLoanPurpose(value);
        }}
        onBlur={() => runValidationTasks("loanPurpose", loanPurpose)}
        errorMessage={errors.loanPurpose?.errorMessage}
        hasError={errors.loanPurpose?.hasError}
        {...getOverrideProps(overrides, "loanPurpose")}
      ></TextField>
      <TextAreaField
        label="Loan computation record"
        isRequired={false}
        isReadOnly={false}
        value={loanComputationRecord}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanNumber,
              approvalStatus,
              approvalStatusEnum,
              approvedDate,
              principal,
              fees,
              interestRate,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval,
              loanType,
              rateInterval,
              loanStatus,
              loanStatusEnum,
              loanCurrency,
              loanPurpose,
              loanComputationRecord: value,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
              status,
              customLoanDetails,
            };
            const result = onChange(modelFields);
            value = result?.loanComputationRecord ?? value;
          }
          if (errors.loanComputationRecord?.hasError) {
            runValidationTasks("loanComputationRecord", value);
          }
          setLoanComputationRecord(value);
        }}
        onBlur={() =>
          runValidationTasks("loanComputationRecord", loanComputationRecord)
        }
        errorMessage={errors.loanComputationRecord?.errorMessage}
        hasError={errors.loanComputationRecord?.hasError}
        {...getOverrideProps(overrides, "loanComputationRecord")}
      ></TextAreaField>
      <TextField
        label="Loan attribute1"
        isRequired={false}
        isReadOnly={false}
        value={loanAttribute1}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanNumber,
              approvalStatus,
              approvalStatusEnum,
              approvedDate,
              principal,
              fees,
              interestRate,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval,
              loanType,
              rateInterval,
              loanStatus,
              loanStatusEnum,
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1: value,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
              status,
              customLoanDetails,
            };
            const result = onChange(modelFields);
            value = result?.loanAttribute1 ?? value;
          }
          if (errors.loanAttribute1?.hasError) {
            runValidationTasks("loanAttribute1", value);
          }
          setLoanAttribute1(value);
        }}
        onBlur={() => runValidationTasks("loanAttribute1", loanAttribute1)}
        errorMessage={errors.loanAttribute1?.errorMessage}
        hasError={errors.loanAttribute1?.hasError}
        {...getOverrideProps(overrides, "loanAttribute1")}
      ></TextField>
      <TextField
        label="Loan attribute2"
        isRequired={false}
        isReadOnly={false}
        value={loanAttribute2}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanNumber,
              approvalStatus,
              approvalStatusEnum,
              approvedDate,
              principal,
              fees,
              interestRate,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval,
              loanType,
              rateInterval,
              loanStatus,
              loanStatusEnum,
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2: value,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
              status,
              customLoanDetails,
            };
            const result = onChange(modelFields);
            value = result?.loanAttribute2 ?? value;
          }
          if (errors.loanAttribute2?.hasError) {
            runValidationTasks("loanAttribute2", value);
          }
          setLoanAttribute2(value);
        }}
        onBlur={() => runValidationTasks("loanAttribute2", loanAttribute2)}
        errorMessage={errors.loanAttribute2?.errorMessage}
        hasError={errors.loanAttribute2?.hasError}
        {...getOverrideProps(overrides, "loanAttribute2")}
      ></TextField>
      <TextField
        label="Number of payments"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={numberOfPayments}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              loanNumber,
              approvalStatus,
              approvalStatusEnum,
              approvedDate,
              principal,
              fees,
              interestRate,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval,
              loanType,
              rateInterval,
              loanStatus,
              loanStatusEnum,
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments: value,
              paymentFrequency,
              customFieldsData,
              status,
              customLoanDetails,
            };
            const result = onChange(modelFields);
            value = result?.numberOfPayments ?? value;
          }
          if (errors.numberOfPayments?.hasError) {
            runValidationTasks("numberOfPayments", value);
          }
          setNumberOfPayments(value);
        }}
        onBlur={() => runValidationTasks("numberOfPayments", numberOfPayments)}
        errorMessage={errors.numberOfPayments?.errorMessage}
        hasError={errors.numberOfPayments?.hasError}
        {...getOverrideProps(overrides, "numberOfPayments")}
      ></TextField>
      <TextField
        label="Payment frequency"
        isRequired={false}
        isReadOnly={false}
        value={paymentFrequency}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanNumber,
              approvalStatus,
              approvalStatusEnum,
              approvedDate,
              principal,
              fees,
              interestRate,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval,
              loanType,
              rateInterval,
              loanStatus,
              loanStatusEnum,
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency: value,
              customFieldsData,
              status,
              customLoanDetails,
            };
            const result = onChange(modelFields);
            value = result?.paymentFrequency ?? value;
          }
          if (errors.paymentFrequency?.hasError) {
            runValidationTasks("paymentFrequency", value);
          }
          setPaymentFrequency(value);
        }}
        onBlur={() => runValidationTasks("paymentFrequency", paymentFrequency)}
        errorMessage={errors.paymentFrequency?.errorMessage}
        hasError={errors.paymentFrequency?.hasError}
        {...getOverrideProps(overrides, "paymentFrequency")}
      ></TextField>
      <TextAreaField
        label="Custom fields data"
        isRequired={false}
        isReadOnly={false}
        value={customFieldsData}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanNumber,
              approvalStatus,
              approvalStatusEnum,
              approvedDate,
              principal,
              fees,
              interestRate,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval,
              loanType,
              rateInterval,
              loanStatus,
              loanStatusEnum,
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData: value,
              status,
              customLoanDetails,
            };
            const result = onChange(modelFields);
            value = result?.customFieldsData ?? value;
          }
          if (errors.customFieldsData?.hasError) {
            runValidationTasks("customFieldsData", value);
          }
          setCustomFieldsData(value);
        }}
        onBlur={() => runValidationTasks("customFieldsData", customFieldsData)}
        errorMessage={errors.customFieldsData?.errorMessage}
        hasError={errors.customFieldsData?.hasError}
        {...getOverrideProps(overrides, "customFieldsData")}
      ></TextAreaField>
      <TextField
        label="Status"
        isRequired={false}
        isReadOnly={false}
        value={status}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanNumber,
              approvalStatus,
              approvalStatusEnum,
              approvedDate,
              principal,
              fees,
              interestRate,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval,
              loanType,
              rateInterval,
              loanStatus,
              loanStatusEnum,
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
              status: value,
              customLoanDetails,
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
      ></TextField>
      <TextAreaField
        label="Custom loan details"
        isRequired={false}
        isReadOnly={false}
        value={customLoanDetails}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanNumber,
              approvalStatus,
              approvalStatusEnum,
              approvedDate,
              principal,
              fees,
              interestRate,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval,
              loanType,
              rateInterval,
              loanStatus,
              loanStatusEnum,
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
              status,
              customLoanDetails: value,
            };
            const result = onChange(modelFields);
            value = result?.customLoanDetails ?? value;
          }
          if (errors.customLoanDetails?.hasError) {
            runValidationTasks("customLoanDetails", value);
          }
          setCustomLoanDetails(value);
        }}
        onBlur={() =>
          runValidationTasks("customLoanDetails", customLoanDetails)
        }
        errorMessage={errors.customLoanDetails?.errorMessage}
        hasError={errors.customLoanDetails?.hasError}
        {...getOverrideProps(overrides, "customLoanDetails")}
      ></TextAreaField>
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
          isDisabled={!(idProp || loanModelProp)}
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
              !(idProp || loanModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
