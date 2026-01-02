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
import { createDividendDeclaration } from "../graphql/mutations";
const client = generateClient();
export default function DividendDeclarationCreateForm(props) {
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
    fiscalYear: "",
    distributableSurplus: "",
    dividendRate: "",
    interestRebateRate: "",
    status: "",
    customDividendDeclarationDetails: "",
  };
  const [fiscalYear, setFiscalYear] = React.useState(initialValues.fiscalYear);
  const [distributableSurplus, setDistributableSurplus] = React.useState(
    initialValues.distributableSurplus
  );
  const [dividendRate, setDividendRate] = React.useState(
    initialValues.dividendRate
  );
  const [interestRebateRate, setInterestRebateRate] = React.useState(
    initialValues.interestRebateRate
  );
  const [status, setStatus] = React.useState(initialValues.status);
  const [
    customDividendDeclarationDetails,
    setCustomDividendDeclarationDetails,
  ] = React.useState(initialValues.customDividendDeclarationDetails);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setFiscalYear(initialValues.fiscalYear);
    setDistributableSurplus(initialValues.distributableSurplus);
    setDividendRate(initialValues.dividendRate);
    setInterestRebateRate(initialValues.interestRebateRate);
    setStatus(initialValues.status);
    setCustomDividendDeclarationDetails(
      initialValues.customDividendDeclarationDetails
    );
    setErrors({});
  };
  const validations = {
    fiscalYear: [],
    distributableSurplus: [],
    dividendRate: [],
    interestRebateRate: [],
    status: [],
    customDividendDeclarationDetails: [{ type: "JSON" }],
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
          fiscalYear,
          distributableSurplus,
          dividendRate,
          interestRebateRate,
          status,
          customDividendDeclarationDetails,
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
            query: createDividendDeclaration.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "DividendDeclarationCreateForm")}
      {...rest}
    >
      <TextField
        label="Fiscal year"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={fiscalYear}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              fiscalYear: value,
              distributableSurplus,
              dividendRate,
              interestRebateRate,
              status,
              customDividendDeclarationDetails,
            };
            const result = onChange(modelFields);
            value = result?.fiscalYear ?? value;
          }
          if (errors.fiscalYear?.hasError) {
            runValidationTasks("fiscalYear", value);
          }
          setFiscalYear(value);
        }}
        onBlur={() => runValidationTasks("fiscalYear", fiscalYear)}
        errorMessage={errors.fiscalYear?.errorMessage}
        hasError={errors.fiscalYear?.hasError}
        {...getOverrideProps(overrides, "fiscalYear")}
      ></TextField>
      <TextField
        label="Distributable surplus"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={distributableSurplus}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              fiscalYear,
              distributableSurplus: value,
              dividendRate,
              interestRebateRate,
              status,
              customDividendDeclarationDetails,
            };
            const result = onChange(modelFields);
            value = result?.distributableSurplus ?? value;
          }
          if (errors.distributableSurplus?.hasError) {
            runValidationTasks("distributableSurplus", value);
          }
          setDistributableSurplus(value);
        }}
        onBlur={() =>
          runValidationTasks("distributableSurplus", distributableSurplus)
        }
        errorMessage={errors.distributableSurplus?.errorMessage}
        hasError={errors.distributableSurplus?.hasError}
        {...getOverrideProps(overrides, "distributableSurplus")}
      ></TextField>
      <TextField
        label="Dividend rate"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={dividendRate}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              fiscalYear,
              distributableSurplus,
              dividendRate: value,
              interestRebateRate,
              status,
              customDividendDeclarationDetails,
            };
            const result = onChange(modelFields);
            value = result?.dividendRate ?? value;
          }
          if (errors.dividendRate?.hasError) {
            runValidationTasks("dividendRate", value);
          }
          setDividendRate(value);
        }}
        onBlur={() => runValidationTasks("dividendRate", dividendRate)}
        errorMessage={errors.dividendRate?.errorMessage}
        hasError={errors.dividendRate?.hasError}
        {...getOverrideProps(overrides, "dividendRate")}
      ></TextField>
      <TextField
        label="Interest rebate rate"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={interestRebateRate}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              fiscalYear,
              distributableSurplus,
              dividendRate,
              interestRebateRate: value,
              status,
              customDividendDeclarationDetails,
            };
            const result = onChange(modelFields);
            value = result?.interestRebateRate ?? value;
          }
          if (errors.interestRebateRate?.hasError) {
            runValidationTasks("interestRebateRate", value);
          }
          setInterestRebateRate(value);
        }}
        onBlur={() =>
          runValidationTasks("interestRebateRate", interestRebateRate)
        }
        errorMessage={errors.interestRebateRate?.errorMessage}
        hasError={errors.interestRebateRate?.hasError}
        {...getOverrideProps(overrides, "interestRebateRate")}
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
              fiscalYear,
              distributableSurplus,
              dividendRate,
              interestRebateRate,
              status: value,
              customDividendDeclarationDetails,
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
        label="Custom dividend declaration details"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              fiscalYear,
              distributableSurplus,
              dividendRate,
              interestRebateRate,
              status,
              customDividendDeclarationDetails: value,
            };
            const result = onChange(modelFields);
            value = result?.customDividendDeclarationDetails ?? value;
          }
          if (errors.customDividendDeclarationDetails?.hasError) {
            runValidationTasks("customDividendDeclarationDetails", value);
          }
          setCustomDividendDeclarationDetails(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "customDividendDeclarationDetails",
            customDividendDeclarationDetails
          )
        }
        errorMessage={errors.customDividendDeclarationDetails?.errorMessage}
        hasError={errors.customDividendDeclarationDetails?.hasError}
        {...getOverrideProps(overrides, "customDividendDeclarationDetails")}
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
