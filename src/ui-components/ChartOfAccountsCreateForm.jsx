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
import { createChartOfAccounts } from "../graphql/mutations";
const client = generateClient();
export default function ChartOfAccountsCreateForm(props) {
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
    code: "",
    name: "",
    type: "",
    subtype: "",
    balance: "",
    customChartOfAccountsDetails: "",
  };
  const [code, setCode] = React.useState(initialValues.code);
  const [name, setName] = React.useState(initialValues.name);
  const [type, setType] = React.useState(initialValues.type);
  const [subtype, setSubtype] = React.useState(initialValues.subtype);
  const [balance, setBalance] = React.useState(initialValues.balance);
  const [customChartOfAccountsDetails, setCustomChartOfAccountsDetails] =
    React.useState(initialValues.customChartOfAccountsDetails);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setCode(initialValues.code);
    setName(initialValues.name);
    setType(initialValues.type);
    setSubtype(initialValues.subtype);
    setBalance(initialValues.balance);
    setCustomChartOfAccountsDetails(initialValues.customChartOfAccountsDetails);
    setErrors({});
  };
  const validations = {
    code: [{ type: "Required" }],
    name: [{ type: "Required" }],
    type: [{ type: "Required" }],
    subtype: [],
    balance: [],
    customChartOfAccountsDetails: [{ type: "JSON" }],
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
          code,
          name,
          type,
          subtype,
          balance,
          customChartOfAccountsDetails,
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
            query: createChartOfAccounts.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "ChartOfAccountsCreateForm")}
      {...rest}
    >
      <TextField
        label="Code"
        isRequired={true}
        isReadOnly={false}
        value={code}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              code: value,
              name,
              type,
              subtype,
              balance,
              customChartOfAccountsDetails,
            };
            const result = onChange(modelFields);
            value = result?.code ?? value;
          }
          if (errors.code?.hasError) {
            runValidationTasks("code", value);
          }
          setCode(value);
        }}
        onBlur={() => runValidationTasks("code", code)}
        errorMessage={errors.code?.errorMessage}
        hasError={errors.code?.hasError}
        {...getOverrideProps(overrides, "code")}
      ></TextField>
      <TextField
        label="Name"
        isRequired={true}
        isReadOnly={false}
        value={name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              code,
              name: value,
              type,
              subtype,
              balance,
              customChartOfAccountsDetails,
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
        isRequired={true}
        isReadOnly={false}
        value={type}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              code,
              name,
              type: value,
              subtype,
              balance,
              customChartOfAccountsDetails,
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
        label="Subtype"
        isRequired={false}
        isReadOnly={false}
        value={subtype}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              code,
              name,
              type,
              subtype: value,
              balance,
              customChartOfAccountsDetails,
            };
            const result = onChange(modelFields);
            value = result?.subtype ?? value;
          }
          if (errors.subtype?.hasError) {
            runValidationTasks("subtype", value);
          }
          setSubtype(value);
        }}
        onBlur={() => runValidationTasks("subtype", subtype)}
        errorMessage={errors.subtype?.errorMessage}
        hasError={errors.subtype?.hasError}
        {...getOverrideProps(overrides, "subtype")}
      ></TextField>
      <TextField
        label="Balance"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={balance}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              code,
              name,
              type,
              subtype,
              balance: value,
              customChartOfAccountsDetails,
            };
            const result = onChange(modelFields);
            value = result?.balance ?? value;
          }
          if (errors.balance?.hasError) {
            runValidationTasks("balance", value);
          }
          setBalance(value);
        }}
        onBlur={() => runValidationTasks("balance", balance)}
        errorMessage={errors.balance?.errorMessage}
        hasError={errors.balance?.hasError}
        {...getOverrideProps(overrides, "balance")}
      ></TextField>
      <TextAreaField
        label="Custom chart of accounts details"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              code,
              name,
              type,
              subtype,
              balance,
              customChartOfAccountsDetails: value,
            };
            const result = onChange(modelFields);
            value = result?.customChartOfAccountsDetails ?? value;
          }
          if (errors.customChartOfAccountsDetails?.hasError) {
            runValidationTasks("customChartOfAccountsDetails", value);
          }
          setCustomChartOfAccountsDetails(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "customChartOfAccountsDetails",
            customChartOfAccountsDetails
          )
        }
        errorMessage={errors.customChartOfAccountsDetails?.errorMessage}
        hasError={errors.customChartOfAccountsDetails?.hasError}
        {...getOverrideProps(overrides, "customChartOfAccountsDetails")}
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
