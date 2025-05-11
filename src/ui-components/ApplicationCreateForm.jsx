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
import { createApplication } from "../graphql/mutations";
const client = generateClient();
export default function ApplicationCreateForm(props) {
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
    name: "",
    description: "",
    applicationNumber: "",
    requestedPrincipalAmount: "",
    requestedTermMonths: "",
    requestedFrequency: "",
    applicationDate: "",
    status: "",
    applicationRecord: "",
  };
  const [name, setName] = React.useState(initialValues.name);
  const [description, setDescription] = React.useState(
    initialValues.description
  );
  const [applicationNumber, setApplicationNumber] = React.useState(
    initialValues.applicationNumber
  );
  const [requestedPrincipalAmount, setRequestedPrincipalAmount] =
    React.useState(initialValues.requestedPrincipalAmount);
  const [requestedTermMonths, setRequestedTermMonths] = React.useState(
    initialValues.requestedTermMonths
  );
  const [requestedFrequency, setRequestedFrequency] = React.useState(
    initialValues.requestedFrequency
  );
  const [applicationDate, setApplicationDate] = React.useState(
    initialValues.applicationDate
  );
  const [status, setStatus] = React.useState(initialValues.status);
  const [applicationRecord, setApplicationRecord] = React.useState(
    initialValues.applicationRecord
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setName(initialValues.name);
    setDescription(initialValues.description);
    setApplicationNumber(initialValues.applicationNumber);
    setRequestedPrincipalAmount(initialValues.requestedPrincipalAmount);
    setRequestedTermMonths(initialValues.requestedTermMonths);
    setRequestedFrequency(initialValues.requestedFrequency);
    setApplicationDate(initialValues.applicationDate);
    setStatus(initialValues.status);
    setApplicationRecord(initialValues.applicationRecord);
    setErrors({});
  };
  const validations = {
    name: [],
    description: [],
    applicationNumber: [],
    requestedPrincipalAmount: [],
    requestedTermMonths: [],
    requestedFrequency: [],
    applicationDate: [],
    status: [],
    applicationRecord: [{ type: "JSON" }],
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
          name,
          description,
          applicationNumber,
          requestedPrincipalAmount,
          requestedTermMonths,
          requestedFrequency,
          applicationDate,
          status,
          applicationRecord,
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
            query: createApplication.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "ApplicationCreateForm")}
      {...rest}
    >
      <TextField
        label="Name"
        isRequired={false}
        isReadOnly={false}
        value={name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name: value,
              description,
              applicationNumber,
              requestedPrincipalAmount,
              requestedTermMonths,
              requestedFrequency,
              applicationDate,
              status,
              applicationRecord,
            };
            const result = onChange(modelFields);
            value = result?.name ?? value;
          }
          if (errors.name?.hasError) {
            runValidationTasks("name", value);
          }
          setName(value);
        }}
        onBlur={() => runValidationTasks("name", name)}
        errorMessage={errors.name?.errorMessage}
        hasError={errors.name?.hasError}
        {...getOverrideProps(overrides, "name")}
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
              name,
              description: value,
              applicationNumber,
              requestedPrincipalAmount,
              requestedTermMonths,
              requestedFrequency,
              applicationDate,
              status,
              applicationRecord,
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
        label="Application number"
        isRequired={false}
        isReadOnly={false}
        value={applicationNumber}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description,
              applicationNumber: value,
              requestedPrincipalAmount,
              requestedTermMonths,
              requestedFrequency,
              applicationDate,
              status,
              applicationRecord,
            };
            const result = onChange(modelFields);
            value = result?.applicationNumber ?? value;
          }
          if (errors.applicationNumber?.hasError) {
            runValidationTasks("applicationNumber", value);
          }
          setApplicationNumber(value);
        }}
        onBlur={() =>
          runValidationTasks("applicationNumber", applicationNumber)
        }
        errorMessage={errors.applicationNumber?.errorMessage}
        hasError={errors.applicationNumber?.hasError}
        {...getOverrideProps(overrides, "applicationNumber")}
      ></TextField>
      <TextField
        label="Requested principal amount"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={requestedPrincipalAmount}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              description,
              applicationNumber,
              requestedPrincipalAmount: value,
              requestedTermMonths,
              requestedFrequency,
              applicationDate,
              status,
              applicationRecord,
            };
            const result = onChange(modelFields);
            value = result?.requestedPrincipalAmount ?? value;
          }
          if (errors.requestedPrincipalAmount?.hasError) {
            runValidationTasks("requestedPrincipalAmount", value);
          }
          setRequestedPrincipalAmount(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "requestedPrincipalAmount",
            requestedPrincipalAmount
          )
        }
        errorMessage={errors.requestedPrincipalAmount?.errorMessage}
        hasError={errors.requestedPrincipalAmount?.hasError}
        {...getOverrideProps(overrides, "requestedPrincipalAmount")}
      ></TextField>
      <TextField
        label="Requested term months"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={requestedTermMonths}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              description,
              applicationNumber,
              requestedPrincipalAmount,
              requestedTermMonths: value,
              requestedFrequency,
              applicationDate,
              status,
              applicationRecord,
            };
            const result = onChange(modelFields);
            value = result?.requestedTermMonths ?? value;
          }
          if (errors.requestedTermMonths?.hasError) {
            runValidationTasks("requestedTermMonths", value);
          }
          setRequestedTermMonths(value);
        }}
        onBlur={() =>
          runValidationTasks("requestedTermMonths", requestedTermMonths)
        }
        errorMessage={errors.requestedTermMonths?.errorMessage}
        hasError={errors.requestedTermMonths?.hasError}
        {...getOverrideProps(overrides, "requestedTermMonths")}
      ></TextField>
      <SelectField
        label="Requested frequency"
        placeholder="Please select an option"
        isDisabled={false}
        value={requestedFrequency}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description,
              applicationNumber,
              requestedPrincipalAmount,
              requestedTermMonths,
              requestedFrequency: value,
              applicationDate,
              status,
              applicationRecord,
            };
            const result = onChange(modelFields);
            value = result?.requestedFrequency ?? value;
          }
          if (errors.requestedFrequency?.hasError) {
            runValidationTasks("requestedFrequency", value);
          }
          setRequestedFrequency(value);
        }}
        onBlur={() =>
          runValidationTasks("requestedFrequency", requestedFrequency)
        }
        errorMessage={errors.requestedFrequency?.errorMessage}
        hasError={errors.requestedFrequency?.hasError}
        {...getOverrideProps(overrides, "requestedFrequency")}
      >
        <option
          children="Daily"
          value="DAILY"
          {...getOverrideProps(overrides, "requestedFrequencyoption0")}
        ></option>
        <option
          children="Weekly"
          value="WEEKLY"
          {...getOverrideProps(overrides, "requestedFrequencyoption1")}
        ></option>
        <option
          children="Biweekly"
          value="BIWEEKLY"
          {...getOverrideProps(overrides, "requestedFrequencyoption2")}
        ></option>
        <option
          children="Monthly"
          value="MONTHLY"
          {...getOverrideProps(overrides, "requestedFrequencyoption3")}
        ></option>
        <option
          children="Quarterly"
          value="QUARTERLY"
          {...getOverrideProps(overrides, "requestedFrequencyoption4")}
        ></option>
        <option
          children="Semiannually"
          value="SEMIANNUALLY"
          {...getOverrideProps(overrides, "requestedFrequencyoption5")}
        ></option>
        <option
          children="Annually"
          value="ANNUALLY"
          {...getOverrideProps(overrides, "requestedFrequencyoption6")}
        ></option>
      </SelectField>
      <TextField
        label="Application date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={applicationDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description,
              applicationNumber,
              requestedPrincipalAmount,
              requestedTermMonths,
              requestedFrequency,
              applicationDate: value,
              status,
              applicationRecord,
            };
            const result = onChange(modelFields);
            value = result?.applicationDate ?? value;
          }
          if (errors.applicationDate?.hasError) {
            runValidationTasks("applicationDate", value);
          }
          setApplicationDate(value);
        }}
        onBlur={() => runValidationTasks("applicationDate", applicationDate)}
        errorMessage={errors.applicationDate?.errorMessage}
        hasError={errors.applicationDate?.hasError}
        {...getOverrideProps(overrides, "applicationDate")}
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
              name,
              description,
              applicationNumber,
              requestedPrincipalAmount,
              requestedTermMonths,
              requestedFrequency,
              applicationDate,
              status: value,
              applicationRecord,
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
        label="Application record"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description,
              applicationNumber,
              requestedPrincipalAmount,
              requestedTermMonths,
              requestedFrequency,
              applicationDate,
              status,
              applicationRecord: value,
            };
            const result = onChange(modelFields);
            value = result?.applicationRecord ?? value;
          }
          if (errors.applicationRecord?.hasError) {
            runValidationTasks("applicationRecord", value);
          }
          setApplicationRecord(value);
        }}
        onBlur={() =>
          runValidationTasks("applicationRecord", applicationRecord)
        }
        errorMessage={errors.applicationRecord?.errorMessage}
        hasError={errors.applicationRecord?.hasError}
        {...getOverrideProps(overrides, "applicationRecord")}
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
