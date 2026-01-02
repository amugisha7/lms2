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
import { createOtherIncome } from "../graphql/mutations";
const client = generateClient();
export default function OtherIncomeCreateForm(props) {
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
    amount: "",
    incomeDate: "",
    incomeType: "",
    status: "",
    customOtherIncomeDetails: "",
  };
  const [name, setName] = React.useState(initialValues.name);
  const [description, setDescription] = React.useState(
    initialValues.description
  );
  const [amount, setAmount] = React.useState(initialValues.amount);
  const [incomeDate, setIncomeDate] = React.useState(initialValues.incomeDate);
  const [incomeType, setIncomeType] = React.useState(initialValues.incomeType);
  const [status, setStatus] = React.useState(initialValues.status);
  const [customOtherIncomeDetails, setCustomOtherIncomeDetails] =
    React.useState(initialValues.customOtherIncomeDetails);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setName(initialValues.name);
    setDescription(initialValues.description);
    setAmount(initialValues.amount);
    setIncomeDate(initialValues.incomeDate);
    setIncomeType(initialValues.incomeType);
    setStatus(initialValues.status);
    setCustomOtherIncomeDetails(initialValues.customOtherIncomeDetails);
    setErrors({});
  };
  const validations = {
    name: [],
    description: [],
    amount: [],
    incomeDate: [],
    incomeType: [],
    status: [],
    customOtherIncomeDetails: [{ type: "JSON" }],
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
          amount,
          incomeDate,
          incomeType,
          status,
          customOtherIncomeDetails,
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
            query: createOtherIncome.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "OtherIncomeCreateForm")}
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
              amount,
              incomeDate,
              incomeType,
              status,
              customOtherIncomeDetails,
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
              amount,
              incomeDate,
              incomeType,
              status,
              customOtherIncomeDetails,
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
        label="Amount"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={amount}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              description,
              amount: value,
              incomeDate,
              incomeType,
              status,
              customOtherIncomeDetails,
            };
            const result = onChange(modelFields);
            value = result?.amount ?? value;
          }
          if (errors.amount?.hasError) {
            runValidationTasks("amount", value);
          }
          setAmount(value);
        }}
        onBlur={() => runValidationTasks("amount", amount)}
        errorMessage={errors.amount?.errorMessage}
        hasError={errors.amount?.hasError}
        {...getOverrideProps(overrides, "amount")}
      ></TextField>
      <TextField
        label="Income date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={incomeDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description,
              amount,
              incomeDate: value,
              incomeType,
              status,
              customOtherIncomeDetails,
            };
            const result = onChange(modelFields);
            value = result?.incomeDate ?? value;
          }
          if (errors.incomeDate?.hasError) {
            runValidationTasks("incomeDate", value);
          }
          setIncomeDate(value);
        }}
        onBlur={() => runValidationTasks("incomeDate", incomeDate)}
        errorMessage={errors.incomeDate?.errorMessage}
        hasError={errors.incomeDate?.hasError}
        {...getOverrideProps(overrides, "incomeDate")}
      ></TextField>
      <TextField
        label="Income type"
        isRequired={false}
        isReadOnly={false}
        value={incomeType}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description,
              amount,
              incomeDate,
              incomeType: value,
              status,
              customOtherIncomeDetails,
            };
            const result = onChange(modelFields);
            value = result?.incomeType ?? value;
          }
          if (errors.incomeType?.hasError) {
            runValidationTasks("incomeType", value);
          }
          setIncomeType(value);
        }}
        onBlur={() => runValidationTasks("incomeType", incomeType)}
        errorMessage={errors.incomeType?.errorMessage}
        hasError={errors.incomeType?.hasError}
        {...getOverrideProps(overrides, "incomeType")}
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
              amount,
              incomeDate,
              incomeType,
              status: value,
              customOtherIncomeDetails,
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
        label="Custom other income details"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description,
              amount,
              incomeDate,
              incomeType,
              status,
              customOtherIncomeDetails: value,
            };
            const result = onChange(modelFields);
            value = result?.customOtherIncomeDetails ?? value;
          }
          if (errors.customOtherIncomeDetails?.hasError) {
            runValidationTasks("customOtherIncomeDetails", value);
          }
          setCustomOtherIncomeDetails(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "customOtherIncomeDetails",
            customOtherIncomeDetails
          )
        }
        errorMessage={errors.customOtherIncomeDetails?.errorMessage}
        hasError={errors.customOtherIncomeDetails?.hasError}
        {...getOverrideProps(overrides, "customOtherIncomeDetails")}
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
