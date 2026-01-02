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
import { createSavingsProduct } from "../graphql/mutations";
const client = generateClient();
export default function SavingsProductCreateForm(props) {
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
    type: "",
    interestRate: "",
    interestPostingFrequency: "",
    minBalance: "",
    customSavingsProductDetails: "",
  };
  const [name, setName] = React.useState(initialValues.name);
  const [type, setType] = React.useState(initialValues.type);
  const [interestRate, setInterestRate] = React.useState(
    initialValues.interestRate
  );
  const [interestPostingFrequency, setInterestPostingFrequency] =
    React.useState(initialValues.interestPostingFrequency);
  const [minBalance, setMinBalance] = React.useState(initialValues.minBalance);
  const [customSavingsProductDetails, setCustomSavingsProductDetails] =
    React.useState(initialValues.customSavingsProductDetails);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setName(initialValues.name);
    setType(initialValues.type);
    setInterestRate(initialValues.interestRate);
    setInterestPostingFrequency(initialValues.interestPostingFrequency);
    setMinBalance(initialValues.minBalance);
    setCustomSavingsProductDetails(initialValues.customSavingsProductDetails);
    setErrors({});
  };
  const validations = {
    name: [],
    type: [],
    interestRate: [],
    interestPostingFrequency: [],
    minBalance: [],
    customSavingsProductDetails: [{ type: "JSON" }],
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
          type,
          interestRate,
          interestPostingFrequency,
          minBalance,
          customSavingsProductDetails,
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
            query: createSavingsProduct.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "SavingsProductCreateForm")}
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
              type,
              interestRate,
              interestPostingFrequency,
              minBalance,
              customSavingsProductDetails,
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
        label="Type"
        isRequired={false}
        isReadOnly={false}
        value={type}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              type: value,
              interestRate,
              interestPostingFrequency,
              minBalance,
              customSavingsProductDetails,
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
              name,
              type,
              interestRate: value,
              interestPostingFrequency,
              minBalance,
              customSavingsProductDetails,
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
        label="Interest posting frequency"
        isRequired={false}
        isReadOnly={false}
        value={interestPostingFrequency}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              type,
              interestRate,
              interestPostingFrequency: value,
              minBalance,
              customSavingsProductDetails,
            };
            const result = onChange(modelFields);
            value = result?.interestPostingFrequency ?? value;
          }
          if (errors.interestPostingFrequency?.hasError) {
            runValidationTasks("interestPostingFrequency", value);
          }
          setInterestPostingFrequency(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "interestPostingFrequency",
            interestPostingFrequency
          )
        }
        errorMessage={errors.interestPostingFrequency?.errorMessage}
        hasError={errors.interestPostingFrequency?.hasError}
        {...getOverrideProps(overrides, "interestPostingFrequency")}
      ></TextField>
      <TextField
        label="Min balance"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={minBalance}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              type,
              interestRate,
              interestPostingFrequency,
              minBalance: value,
              customSavingsProductDetails,
            };
            const result = onChange(modelFields);
            value = result?.minBalance ?? value;
          }
          if (errors.minBalance?.hasError) {
            runValidationTasks("minBalance", value);
          }
          setMinBalance(value);
        }}
        onBlur={() => runValidationTasks("minBalance", minBalance)}
        errorMessage={errors.minBalance?.errorMessage}
        hasError={errors.minBalance?.hasError}
        {...getOverrideProps(overrides, "minBalance")}
      ></TextField>
      <TextAreaField
        label="Custom savings product details"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              type,
              interestRate,
              interestPostingFrequency,
              minBalance,
              customSavingsProductDetails: value,
            };
            const result = onChange(modelFields);
            value = result?.customSavingsProductDetails ?? value;
          }
          if (errors.customSavingsProductDetails?.hasError) {
            runValidationTasks("customSavingsProductDetails", value);
          }
          setCustomSavingsProductDetails(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "customSavingsProductDetails",
            customSavingsProductDetails
          )
        }
        errorMessage={errors.customSavingsProductDetails?.errorMessage}
        hasError={errors.customSavingsProductDetails?.hasError}
        {...getOverrideProps(overrides, "customSavingsProductDetails")}
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
