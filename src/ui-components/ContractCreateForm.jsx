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
import { createContract } from "../graphql/mutations";
const client = generateClient();
export default function ContractCreateForm(props) {
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
    contractNumber: "",
    contractType: "",
    contractDate: "",
    contractStatus: "",
    contractRecord: "",
    status: "",
    customContractDetails: "",
  };
  const [contractNumber, setContractNumber] = React.useState(
    initialValues.contractNumber
  );
  const [contractType, setContractType] = React.useState(
    initialValues.contractType
  );
  const [contractDate, setContractDate] = React.useState(
    initialValues.contractDate
  );
  const [contractStatus, setContractStatus] = React.useState(
    initialValues.contractStatus
  );
  const [contractRecord, setContractRecord] = React.useState(
    initialValues.contractRecord
  );
  const [status, setStatus] = React.useState(initialValues.status);
  const [customContractDetails, setCustomContractDetails] = React.useState(
    initialValues.customContractDetails
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setContractNumber(initialValues.contractNumber);
    setContractType(initialValues.contractType);
    setContractDate(initialValues.contractDate);
    setContractStatus(initialValues.contractStatus);
    setContractRecord(initialValues.contractRecord);
    setStatus(initialValues.status);
    setCustomContractDetails(initialValues.customContractDetails);
    setErrors({});
  };
  const validations = {
    contractNumber: [],
    contractType: [],
    contractDate: [],
    contractStatus: [],
    contractRecord: [{ type: "JSON" }],
    status: [],
    customContractDetails: [{ type: "JSON" }],
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
          contractNumber,
          contractType,
          contractDate,
          contractStatus,
          contractRecord,
          status,
          customContractDetails,
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
            query: createContract.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "ContractCreateForm")}
      {...rest}
    >
      <TextField
        label="Contract number"
        isRequired={false}
        isReadOnly={false}
        value={contractNumber}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              contractNumber: value,
              contractType,
              contractDate,
              contractStatus,
              contractRecord,
              status,
              customContractDetails,
            };
            const result = onChange(modelFields);
            value = result?.contractNumber ?? value;
          }
          if (errors.contractNumber?.hasError) {
            runValidationTasks("contractNumber", value);
          }
          setContractNumber(value);
        }}
        onBlur={() => runValidationTasks("contractNumber", contractNumber)}
        errorMessage={errors.contractNumber?.errorMessage}
        hasError={errors.contractNumber?.hasError}
        {...getOverrideProps(overrides, "contractNumber")}
      ></TextField>
      <TextField
        label="Contract type"
        isRequired={false}
        isReadOnly={false}
        value={contractType}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              contractNumber,
              contractType: value,
              contractDate,
              contractStatus,
              contractRecord,
              status,
              customContractDetails,
            };
            const result = onChange(modelFields);
            value = result?.contractType ?? value;
          }
          if (errors.contractType?.hasError) {
            runValidationTasks("contractType", value);
          }
          setContractType(value);
        }}
        onBlur={() => runValidationTasks("contractType", contractType)}
        errorMessage={errors.contractType?.errorMessage}
        hasError={errors.contractType?.hasError}
        {...getOverrideProps(overrides, "contractType")}
      ></TextField>
      <TextField
        label="Contract date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={contractDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              contractNumber,
              contractType,
              contractDate: value,
              contractStatus,
              contractRecord,
              status,
              customContractDetails,
            };
            const result = onChange(modelFields);
            value = result?.contractDate ?? value;
          }
          if (errors.contractDate?.hasError) {
            runValidationTasks("contractDate", value);
          }
          setContractDate(value);
        }}
        onBlur={() => runValidationTasks("contractDate", contractDate)}
        errorMessage={errors.contractDate?.errorMessage}
        hasError={errors.contractDate?.hasError}
        {...getOverrideProps(overrides, "contractDate")}
      ></TextField>
      <TextField
        label="Contract status"
        isRequired={false}
        isReadOnly={false}
        value={contractStatus}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              contractNumber,
              contractType,
              contractDate,
              contractStatus: value,
              contractRecord,
              status,
              customContractDetails,
            };
            const result = onChange(modelFields);
            value = result?.contractStatus ?? value;
          }
          if (errors.contractStatus?.hasError) {
            runValidationTasks("contractStatus", value);
          }
          setContractStatus(value);
        }}
        onBlur={() => runValidationTasks("contractStatus", contractStatus)}
        errorMessage={errors.contractStatus?.errorMessage}
        hasError={errors.contractStatus?.hasError}
        {...getOverrideProps(overrides, "contractStatus")}
      ></TextField>
      <TextAreaField
        label="Contract record"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              contractNumber,
              contractType,
              contractDate,
              contractStatus,
              contractRecord: value,
              status,
              customContractDetails,
            };
            const result = onChange(modelFields);
            value = result?.contractRecord ?? value;
          }
          if (errors.contractRecord?.hasError) {
            runValidationTasks("contractRecord", value);
          }
          setContractRecord(value);
        }}
        onBlur={() => runValidationTasks("contractRecord", contractRecord)}
        errorMessage={errors.contractRecord?.errorMessage}
        hasError={errors.contractRecord?.hasError}
        {...getOverrideProps(overrides, "contractRecord")}
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
              contractNumber,
              contractType,
              contractDate,
              contractStatus,
              contractRecord,
              status: value,
              customContractDetails,
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
        label="Custom contract details"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              contractNumber,
              contractType,
              contractDate,
              contractStatus,
              contractRecord,
              status,
              customContractDetails: value,
            };
            const result = onChange(modelFields);
            value = result?.customContractDetails ?? value;
          }
          if (errors.customContractDetails?.hasError) {
            runValidationTasks("customContractDetails", value);
          }
          setCustomContractDetails(value);
        }}
        onBlur={() =>
          runValidationTasks("customContractDetails", customContractDetails)
        }
        errorMessage={errors.customContractDetails?.errorMessage}
        hasError={errors.customContractDetails?.hasError}
        {...getOverrideProps(overrides, "customContractDetails")}
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
