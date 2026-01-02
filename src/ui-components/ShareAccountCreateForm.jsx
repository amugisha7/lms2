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
import { createShareAccount } from "../graphql/mutations";
const client = generateClient();
export default function ShareAccountCreateForm(props) {
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
    numberOfShares: "",
    shareValue: "",
    totalValue: "",
    customShareAccountDetails: "",
  };
  const [numberOfShares, setNumberOfShares] = React.useState(
    initialValues.numberOfShares
  );
  const [shareValue, setShareValue] = React.useState(initialValues.shareValue);
  const [totalValue, setTotalValue] = React.useState(initialValues.totalValue);
  const [customShareAccountDetails, setCustomShareAccountDetails] =
    React.useState(initialValues.customShareAccountDetails);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setNumberOfShares(initialValues.numberOfShares);
    setShareValue(initialValues.shareValue);
    setTotalValue(initialValues.totalValue);
    setCustomShareAccountDetails(initialValues.customShareAccountDetails);
    setErrors({});
  };
  const validations = {
    numberOfShares: [],
    shareValue: [],
    totalValue: [],
    customShareAccountDetails: [{ type: "JSON" }],
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
          numberOfShares,
          shareValue,
          totalValue,
          customShareAccountDetails,
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
            query: createShareAccount.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "ShareAccountCreateForm")}
      {...rest}
    >
      <TextField
        label="Number of shares"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={numberOfShares}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              numberOfShares: value,
              shareValue,
              totalValue,
              customShareAccountDetails,
            };
            const result = onChange(modelFields);
            value = result?.numberOfShares ?? value;
          }
          if (errors.numberOfShares?.hasError) {
            runValidationTasks("numberOfShares", value);
          }
          setNumberOfShares(value);
        }}
        onBlur={() => runValidationTasks("numberOfShares", numberOfShares)}
        errorMessage={errors.numberOfShares?.errorMessage}
        hasError={errors.numberOfShares?.hasError}
        {...getOverrideProps(overrides, "numberOfShares")}
      ></TextField>
      <TextField
        label="Share value"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={shareValue}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              numberOfShares,
              shareValue: value,
              totalValue,
              customShareAccountDetails,
            };
            const result = onChange(modelFields);
            value = result?.shareValue ?? value;
          }
          if (errors.shareValue?.hasError) {
            runValidationTasks("shareValue", value);
          }
          setShareValue(value);
        }}
        onBlur={() => runValidationTasks("shareValue", shareValue)}
        errorMessage={errors.shareValue?.errorMessage}
        hasError={errors.shareValue?.hasError}
        {...getOverrideProps(overrides, "shareValue")}
      ></TextField>
      <TextField
        label="Total value"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={totalValue}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              numberOfShares,
              shareValue,
              totalValue: value,
              customShareAccountDetails,
            };
            const result = onChange(modelFields);
            value = result?.totalValue ?? value;
          }
          if (errors.totalValue?.hasError) {
            runValidationTasks("totalValue", value);
          }
          setTotalValue(value);
        }}
        onBlur={() => runValidationTasks("totalValue", totalValue)}
        errorMessage={errors.totalValue?.errorMessage}
        hasError={errors.totalValue?.hasError}
        {...getOverrideProps(overrides, "totalValue")}
      ></TextField>
      <TextAreaField
        label="Custom share account details"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              numberOfShares,
              shareValue,
              totalValue,
              customShareAccountDetails: value,
            };
            const result = onChange(modelFields);
            value = result?.customShareAccountDetails ?? value;
          }
          if (errors.customShareAccountDetails?.hasError) {
            runValidationTasks("customShareAccountDetails", value);
          }
          setCustomShareAccountDetails(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "customShareAccountDetails",
            customShareAccountDetails
          )
        }
        errorMessage={errors.customShareAccountDetails?.errorMessage}
        hasError={errors.customShareAccountDetails?.hasError}
        {...getOverrideProps(overrides, "customShareAccountDetails")}
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
