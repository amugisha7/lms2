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
import { createInvestment } from "../graphql/mutations";
const client = generateClient();
export default function InvestmentCreateForm(props) {
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
    principal: "",
    description: "",
    fees: "",
    interestRate: "",
    startDate: "",
    maturityDate: "",
    stopDate: "",
    extensionPeriod: "",
    duration: "",
    durationInterval: "",
    type: "",
    rateInterval: "",
    investmentStatus: "",
    investmentAttribute1: "",
    investmentAttribute2: "",
    numberOfPayments: "",
    paymentFrequency: "",
    status: "",
    customInvestmentDetails: "",
  };
  const [principal, setPrincipal] = React.useState(initialValues.principal);
  const [description, setDescription] = React.useState(
    initialValues.description
  );
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
  const [type, setType] = React.useState(initialValues.type);
  const [rateInterval, setRateInterval] = React.useState(
    initialValues.rateInterval
  );
  const [investmentStatus, setInvestmentStatus] = React.useState(
    initialValues.investmentStatus
  );
  const [investmentAttribute1, setInvestmentAttribute1] = React.useState(
    initialValues.investmentAttribute1
  );
  const [investmentAttribute2, setInvestmentAttribute2] = React.useState(
    initialValues.investmentAttribute2
  );
  const [numberOfPayments, setNumberOfPayments] = React.useState(
    initialValues.numberOfPayments
  );
  const [paymentFrequency, setPaymentFrequency] = React.useState(
    initialValues.paymentFrequency
  );
  const [status, setStatus] = React.useState(initialValues.status);
  const [customInvestmentDetails, setCustomInvestmentDetails] = React.useState(
    initialValues.customInvestmentDetails
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setPrincipal(initialValues.principal);
    setDescription(initialValues.description);
    setFees(initialValues.fees);
    setInterestRate(initialValues.interestRate);
    setStartDate(initialValues.startDate);
    setMaturityDate(initialValues.maturityDate);
    setStopDate(initialValues.stopDate);
    setExtensionPeriod(initialValues.extensionPeriod);
    setDuration(initialValues.duration);
    setDurationInterval(initialValues.durationInterval);
    setType(initialValues.type);
    setRateInterval(initialValues.rateInterval);
    setInvestmentStatus(initialValues.investmentStatus);
    setInvestmentAttribute1(initialValues.investmentAttribute1);
    setInvestmentAttribute2(initialValues.investmentAttribute2);
    setNumberOfPayments(initialValues.numberOfPayments);
    setPaymentFrequency(initialValues.paymentFrequency);
    setStatus(initialValues.status);
    setCustomInvestmentDetails(initialValues.customInvestmentDetails);
    setErrors({});
  };
  const validations = {
    principal: [],
    description: [],
    fees: [],
    interestRate: [],
    startDate: [],
    maturityDate: [],
    stopDate: [],
    extensionPeriod: [],
    duration: [],
    durationInterval: [],
    type: [],
    rateInterval: [],
    investmentStatus: [],
    investmentAttribute1: [],
    investmentAttribute2: [],
    numberOfPayments: [],
    paymentFrequency: [],
    status: [],
    customInvestmentDetails: [{ type: "JSON" }],
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
          principal,
          description,
          fees,
          interestRate,
          startDate,
          maturityDate,
          stopDate,
          extensionPeriod,
          duration,
          durationInterval,
          type,
          rateInterval,
          investmentStatus,
          investmentAttribute1,
          investmentAttribute2,
          numberOfPayments,
          paymentFrequency,
          status,
          customInvestmentDetails,
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
            query: createInvestment.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "InvestmentCreateForm")}
      {...rest}
    >
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
              principal: value,
              description,
              fees,
              interestRate,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval,
              type,
              rateInterval,
              investmentStatus,
              investmentAttribute1,
              investmentAttribute2,
              numberOfPayments,
              paymentFrequency,
              status,
              customInvestmentDetails,
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
        label="Description"
        isRequired={false}
        isReadOnly={false}
        value={description}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              principal,
              description: value,
              fees,
              interestRate,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval,
              type,
              rateInterval,
              investmentStatus,
              investmentAttribute1,
              investmentAttribute2,
              numberOfPayments,
              paymentFrequency,
              status,
              customInvestmentDetails,
            };
            const result = onChange(modelFields);
            value = result?.description ?? value;
          }
          if (errors.description?.hasError) {
            runValidationTasks("description", value);
          }
          setDescription(value);
        }}
        onBlur={() => runValidationTasks("description", description)}
        errorMessage={errors.description?.errorMessage}
        hasError={errors.description?.hasError}
        {...getOverrideProps(overrides, "description")}
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
              principal,
              description,
              fees: value,
              interestRate,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval,
              type,
              rateInterval,
              investmentStatus,
              investmentAttribute1,
              investmentAttribute2,
              numberOfPayments,
              paymentFrequency,
              status,
              customInvestmentDetails,
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
              principal,
              description,
              fees,
              interestRate: value,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval,
              type,
              rateInterval,
              investmentStatus,
              investmentAttribute1,
              investmentAttribute2,
              numberOfPayments,
              paymentFrequency,
              status,
              customInvestmentDetails,
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
              principal,
              description,
              fees,
              interestRate,
              startDate: value,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval,
              type,
              rateInterval,
              investmentStatus,
              investmentAttribute1,
              investmentAttribute2,
              numberOfPayments,
              paymentFrequency,
              status,
              customInvestmentDetails,
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
              principal,
              description,
              fees,
              interestRate,
              startDate,
              maturityDate: value,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval,
              type,
              rateInterval,
              investmentStatus,
              investmentAttribute1,
              investmentAttribute2,
              numberOfPayments,
              paymentFrequency,
              status,
              customInvestmentDetails,
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
              principal,
              description,
              fees,
              interestRate,
              startDate,
              maturityDate,
              stopDate: value,
              extensionPeriod,
              duration,
              durationInterval,
              type,
              rateInterval,
              investmentStatus,
              investmentAttribute1,
              investmentAttribute2,
              numberOfPayments,
              paymentFrequency,
              status,
              customInvestmentDetails,
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
              principal,
              description,
              fees,
              interestRate,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod: value,
              duration,
              durationInterval,
              type,
              rateInterval,
              investmentStatus,
              investmentAttribute1,
              investmentAttribute2,
              numberOfPayments,
              paymentFrequency,
              status,
              customInvestmentDetails,
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
              principal,
              description,
              fees,
              interestRate,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration: value,
              durationInterval,
              type,
              rateInterval,
              investmentStatus,
              investmentAttribute1,
              investmentAttribute2,
              numberOfPayments,
              paymentFrequency,
              status,
              customInvestmentDetails,
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
              principal,
              description,
              fees,
              interestRate,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval: value,
              type,
              rateInterval,
              investmentStatus,
              investmentAttribute1,
              investmentAttribute2,
              numberOfPayments,
              paymentFrequency,
              status,
              customInvestmentDetails,
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
        label="Type"
        isRequired={false}
        isReadOnly={false}
        value={type}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              principal,
              description,
              fees,
              interestRate,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval,
              type: value,
              rateInterval,
              investmentStatus,
              investmentAttribute1,
              investmentAttribute2,
              numberOfPayments,
              paymentFrequency,
              status,
              customInvestmentDetails,
            };
            const result = onChange(modelFields);
            value = result?.type ?? value;
          }
          if (errors.type?.hasError) {
            runValidationTasks("type", value);
          }
          setType(value);
        }}
        onBlur={() => runValidationTasks("type", type)}
        errorMessage={errors.type?.errorMessage}
        hasError={errors.type?.hasError}
        {...getOverrideProps(overrides, "type")}
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
              principal,
              description,
              fees,
              interestRate,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval,
              type,
              rateInterval: value,
              investmentStatus,
              investmentAttribute1,
              investmentAttribute2,
              numberOfPayments,
              paymentFrequency,
              status,
              customInvestmentDetails,
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
        label="Investment status"
        isRequired={false}
        isReadOnly={false}
        value={investmentStatus}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              principal,
              description,
              fees,
              interestRate,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval,
              type,
              rateInterval,
              investmentStatus: value,
              investmentAttribute1,
              investmentAttribute2,
              numberOfPayments,
              paymentFrequency,
              status,
              customInvestmentDetails,
            };
            const result = onChange(modelFields);
            value = result?.investmentStatus ?? value;
          }
          if (errors.investmentStatus?.hasError) {
            runValidationTasks("investmentStatus", value);
          }
          setInvestmentStatus(value);
        }}
        onBlur={() => runValidationTasks("investmentStatus", investmentStatus)}
        errorMessage={errors.investmentStatus?.errorMessage}
        hasError={errors.investmentStatus?.hasError}
        {...getOverrideProps(overrides, "investmentStatus")}
      ></TextField>
      <TextField
        label="Investment attribute1"
        isRequired={false}
        isReadOnly={false}
        value={investmentAttribute1}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              principal,
              description,
              fees,
              interestRate,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval,
              type,
              rateInterval,
              investmentStatus,
              investmentAttribute1: value,
              investmentAttribute2,
              numberOfPayments,
              paymentFrequency,
              status,
              customInvestmentDetails,
            };
            const result = onChange(modelFields);
            value = result?.investmentAttribute1 ?? value;
          }
          if (errors.investmentAttribute1?.hasError) {
            runValidationTasks("investmentAttribute1", value);
          }
          setInvestmentAttribute1(value);
        }}
        onBlur={() =>
          runValidationTasks("investmentAttribute1", investmentAttribute1)
        }
        errorMessage={errors.investmentAttribute1?.errorMessage}
        hasError={errors.investmentAttribute1?.hasError}
        {...getOverrideProps(overrides, "investmentAttribute1")}
      ></TextField>
      <TextField
        label="Investment attribute2"
        isRequired={false}
        isReadOnly={false}
        value={investmentAttribute2}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              principal,
              description,
              fees,
              interestRate,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval,
              type,
              rateInterval,
              investmentStatus,
              investmentAttribute1,
              investmentAttribute2: value,
              numberOfPayments,
              paymentFrequency,
              status,
              customInvestmentDetails,
            };
            const result = onChange(modelFields);
            value = result?.investmentAttribute2 ?? value;
          }
          if (errors.investmentAttribute2?.hasError) {
            runValidationTasks("investmentAttribute2", value);
          }
          setInvestmentAttribute2(value);
        }}
        onBlur={() =>
          runValidationTasks("investmentAttribute2", investmentAttribute2)
        }
        errorMessage={errors.investmentAttribute2?.errorMessage}
        hasError={errors.investmentAttribute2?.hasError}
        {...getOverrideProps(overrides, "investmentAttribute2")}
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
              principal,
              description,
              fees,
              interestRate,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval,
              type,
              rateInterval,
              investmentStatus,
              investmentAttribute1,
              investmentAttribute2,
              numberOfPayments: value,
              paymentFrequency,
              status,
              customInvestmentDetails,
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
        type="number"
        step="any"
        value={paymentFrequency}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              principal,
              description,
              fees,
              interestRate,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval,
              type,
              rateInterval,
              investmentStatus,
              investmentAttribute1,
              investmentAttribute2,
              numberOfPayments,
              paymentFrequency: value,
              status,
              customInvestmentDetails,
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
      <TextField
        label="Status"
        isRequired={false}
        isReadOnly={false}
        value={status}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              principal,
              description,
              fees,
              interestRate,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval,
              type,
              rateInterval,
              investmentStatus,
              investmentAttribute1,
              investmentAttribute2,
              numberOfPayments,
              paymentFrequency,
              status: value,
              customInvestmentDetails,
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
        label="Custom investment details"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              principal,
              description,
              fees,
              interestRate,
              startDate,
              maturityDate,
              stopDate,
              extensionPeriod,
              duration,
              durationInterval,
              type,
              rateInterval,
              investmentStatus,
              investmentAttribute1,
              investmentAttribute2,
              numberOfPayments,
              paymentFrequency,
              status,
              customInvestmentDetails: value,
            };
            const result = onChange(modelFields);
            value = result?.customInvestmentDetails ?? value;
          }
          if (errors.customInvestmentDetails?.hasError) {
            runValidationTasks("customInvestmentDetails", value);
          }
          setCustomInvestmentDetails(value);
        }}
        onBlur={() =>
          runValidationTasks("customInvestmentDetails", customInvestmentDetails)
        }
        errorMessage={errors.customInvestmentDetails?.errorMessage}
        hasError={errors.customInvestmentDetails?.hasError}
        {...getOverrideProps(overrides, "customInvestmentDetails")}
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
