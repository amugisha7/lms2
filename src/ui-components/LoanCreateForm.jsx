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
  TextAreaField,
  TextField,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { createLoan } from "../graphql/mutations";
const client = generateClient();
export default function LoanCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    approvalStatus: "",
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
    loanCurrency: "",
    loanPurpose: "",
    loanComputationRecord: "",
    loanAttribute1: "",
    loanAttribute2: "",
    numberOfPayments: "",
    paymentFrequency: "",
    customFieldsData: "",
  };
  const [approvalStatus, setApprovalStatus] = React.useState(
    initialValues.approvalStatus
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
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setApprovalStatus(initialValues.approvalStatus);
    setApprovedDate(initialValues.approvedDate);
    setPrincipal(initialValues.principal);
    setFees(initialValues.fees);
    setInterestRate(initialValues.interestRate);
    setStartDate(initialValues.startDate);
    setMaturityDate(initialValues.maturityDate);
    setStopDate(initialValues.stopDate);
    setExtensionPeriod(initialValues.extensionPeriod);
    setDuration(initialValues.duration);
    setDurationInterval(initialValues.durationInterval);
    setLoanType(initialValues.loanType);
    setRateInterval(initialValues.rateInterval);
    setLoanStatus(initialValues.loanStatus);
    setLoanCurrency(initialValues.loanCurrency);
    setLoanPurpose(initialValues.loanPurpose);
    setLoanComputationRecord(initialValues.loanComputationRecord);
    setLoanAttribute1(initialValues.loanAttribute1);
    setLoanAttribute2(initialValues.loanAttribute2);
    setNumberOfPayments(initialValues.numberOfPayments);
    setPaymentFrequency(initialValues.paymentFrequency);
    setCustomFieldsData(initialValues.customFieldsData);
    setErrors({});
  };
  const validations = {
    approvalStatus: [],
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
    loanCurrency: [],
    loanPurpose: [],
    loanComputationRecord: [{ type: "JSON" }],
    loanAttribute1: [],
    loanAttribute2: [],
    numberOfPayments: [],
    paymentFrequency: [],
    customFieldsData: [{ type: "JSON" }],
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
          approvalStatus,
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
          loanCurrency,
          loanPurpose,
          loanComputationRecord,
          loanAttribute1,
          loanAttribute2,
          numberOfPayments,
          paymentFrequency,
          customFieldsData,
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
            query: createLoan.replaceAll("__typename", ""),
            variables: {
              input: {
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "LoanCreateForm")}
      {...rest}
    >
      <TextField
        label="Approval status"
        isRequired={false}
        isReadOnly={false}
        value={approvalStatus}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              approvalStatus: value,
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
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
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
              approvalStatus,
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
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
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
              approvalStatus,
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
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
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
              approvalStatus,
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
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
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
              approvalStatus,
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
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
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
              approvalStatus,
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
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
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
              approvalStatus,
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
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
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
              approvalStatus,
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
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
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
              approvalStatus,
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
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
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
              approvalStatus,
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
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
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
              approvalStatus,
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
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
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
              approvalStatus,
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
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
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
              approvalStatus,
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
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
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
              approvalStatus,
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
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
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
      <TextField
        label="Loan currency"
        isRequired={false}
        isReadOnly={false}
        value={loanCurrency}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              approvalStatus,
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
              loanCurrency: value,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
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
              approvalStatus,
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
              loanCurrency,
              loanPurpose: value,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
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
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              approvalStatus,
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
              loanCurrency,
              loanPurpose,
              loanComputationRecord: value,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
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
              approvalStatus,
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
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1: value,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
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
              approvalStatus,
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
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2: value,
              numberOfPayments,
              paymentFrequency,
              customFieldsData,
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
              approvalStatus,
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
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments: value,
              paymentFrequency,
              customFieldsData,
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
              approvalStatus,
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
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency: value,
              customFieldsData,
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
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              approvalStatus,
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
              loanCurrency,
              loanPurpose,
              loanComputationRecord,
              loanAttribute1,
              loanAttribute2,
              numberOfPayments,
              paymentFrequency,
              customFieldsData: value,
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
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
