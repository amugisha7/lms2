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
  TextField,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { createLoanProduct } from "../graphql/mutations";
const client = generateClient();
export default function LoanProductCreateForm(props) {
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
    interestRateMin: "",
    interestRateMax: "",
    termMonthsMin: "",
    termMonthsMax: "",
    principalAmountMin: "",
    principalAmountMax: "",
    interestCalculationMethod: "",
    repaymentFrequencies: "",
  };
  const [name, setName] = React.useState(initialValues.name);
  const [description, setDescription] = React.useState(
    initialValues.description
  );
  const [interestRateMin, setInterestRateMin] = React.useState(
    initialValues.interestRateMin
  );
  const [interestRateMax, setInterestRateMax] = React.useState(
    initialValues.interestRateMax
  );
  const [termMonthsMin, setTermMonthsMin] = React.useState(
    initialValues.termMonthsMin
  );
  const [termMonthsMax, setTermMonthsMax] = React.useState(
    initialValues.termMonthsMax
  );
  const [principalAmountMin, setPrincipalAmountMin] = React.useState(
    initialValues.principalAmountMin
  );
  const [principalAmountMax, setPrincipalAmountMax] = React.useState(
    initialValues.principalAmountMax
  );
  const [interestCalculationMethod, setInterestCalculationMethod] =
    React.useState(initialValues.interestCalculationMethod);
  const [repaymentFrequencies, setRepaymentFrequencies] = React.useState(
    initialValues.repaymentFrequencies
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setName(initialValues.name);
    setDescription(initialValues.description);
    setInterestRateMin(initialValues.interestRateMin);
    setInterestRateMax(initialValues.interestRateMax);
    setTermMonthsMin(initialValues.termMonthsMin);
    setTermMonthsMax(initialValues.termMonthsMax);
    setPrincipalAmountMin(initialValues.principalAmountMin);
    setPrincipalAmountMax(initialValues.principalAmountMax);
    setInterestCalculationMethod(initialValues.interestCalculationMethod);
    setRepaymentFrequencies(initialValues.repaymentFrequencies);
    setErrors({});
  };
  const validations = {
    name: [],
    description: [],
    interestRateMin: [],
    interestRateMax: [],
    termMonthsMin: [],
    termMonthsMax: [],
    principalAmountMin: [],
    principalAmountMax: [],
    interestCalculationMethod: [],
    repaymentFrequencies: [],
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
          interestRateMin,
          interestRateMax,
          termMonthsMin,
          termMonthsMax,
          principalAmountMin,
          principalAmountMax,
          interestCalculationMethod,
          repaymentFrequencies,
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
            query: createLoanProduct.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "LoanProductCreateForm")}
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
              interestRateMin,
              interestRateMax,
              termMonthsMin,
              termMonthsMax,
              principalAmountMin,
              principalAmountMax,
              interestCalculationMethod,
              repaymentFrequencies,
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
              interestRateMin,
              interestRateMax,
              termMonthsMin,
              termMonthsMax,
              principalAmountMin,
              principalAmountMax,
              interestCalculationMethod,
              repaymentFrequencies,
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
        label="Interest rate min"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={interestRateMin}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              description,
              interestRateMin: value,
              interestRateMax,
              termMonthsMin,
              termMonthsMax,
              principalAmountMin,
              principalAmountMax,
              interestCalculationMethod,
              repaymentFrequencies,
            };
            const result = onChange(modelFields);
            value = result?.interestRateMin ?? value;
          }
          if (errors.interestRateMin?.hasError) {
            runValidationTasks("interestRateMin", value);
          }
          setInterestRateMin(value);
        }}
        onBlur={() => runValidationTasks("interestRateMin", interestRateMin)}
        errorMessage={errors.interestRateMin?.errorMessage}
        hasError={errors.interestRateMin?.hasError}
        {...getOverrideProps(overrides, "interestRateMin")}
      ></TextField>
      <TextField
        label="Interest rate max"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={interestRateMax}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              description,
              interestRateMin,
              interestRateMax: value,
              termMonthsMin,
              termMonthsMax,
              principalAmountMin,
              principalAmountMax,
              interestCalculationMethod,
              repaymentFrequencies,
            };
            const result = onChange(modelFields);
            value = result?.interestRateMax ?? value;
          }
          if (errors.interestRateMax?.hasError) {
            runValidationTasks("interestRateMax", value);
          }
          setInterestRateMax(value);
        }}
        onBlur={() => runValidationTasks("interestRateMax", interestRateMax)}
        errorMessage={errors.interestRateMax?.errorMessage}
        hasError={errors.interestRateMax?.hasError}
        {...getOverrideProps(overrides, "interestRateMax")}
      ></TextField>
      <TextField
        label="Term months min"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={termMonthsMin}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              description,
              interestRateMin,
              interestRateMax,
              termMonthsMin: value,
              termMonthsMax,
              principalAmountMin,
              principalAmountMax,
              interestCalculationMethod,
              repaymentFrequencies,
            };
            const result = onChange(modelFields);
            value = result?.termMonthsMin ?? value;
          }
          if (errors.termMonthsMin?.hasError) {
            runValidationTasks("termMonthsMin", value);
          }
          setTermMonthsMin(value);
        }}
        onBlur={() => runValidationTasks("termMonthsMin", termMonthsMin)}
        errorMessage={errors.termMonthsMin?.errorMessage}
        hasError={errors.termMonthsMin?.hasError}
        {...getOverrideProps(overrides, "termMonthsMin")}
      ></TextField>
      <TextField
        label="Term months max"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={termMonthsMax}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              description,
              interestRateMin,
              interestRateMax,
              termMonthsMin,
              termMonthsMax: value,
              principalAmountMin,
              principalAmountMax,
              interestCalculationMethod,
              repaymentFrequencies,
            };
            const result = onChange(modelFields);
            value = result?.termMonthsMax ?? value;
          }
          if (errors.termMonthsMax?.hasError) {
            runValidationTasks("termMonthsMax", value);
          }
          setTermMonthsMax(value);
        }}
        onBlur={() => runValidationTasks("termMonthsMax", termMonthsMax)}
        errorMessage={errors.termMonthsMax?.errorMessage}
        hasError={errors.termMonthsMax?.hasError}
        {...getOverrideProps(overrides, "termMonthsMax")}
      ></TextField>
      <TextField
        label="Principal amount min"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={principalAmountMin}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              description,
              interestRateMin,
              interestRateMax,
              termMonthsMin,
              termMonthsMax,
              principalAmountMin: value,
              principalAmountMax,
              interestCalculationMethod,
              repaymentFrequencies,
            };
            const result = onChange(modelFields);
            value = result?.principalAmountMin ?? value;
          }
          if (errors.principalAmountMin?.hasError) {
            runValidationTasks("principalAmountMin", value);
          }
          setPrincipalAmountMin(value);
        }}
        onBlur={() =>
          runValidationTasks("principalAmountMin", principalAmountMin)
        }
        errorMessage={errors.principalAmountMin?.errorMessage}
        hasError={errors.principalAmountMin?.hasError}
        {...getOverrideProps(overrides, "principalAmountMin")}
      ></TextField>
      <TextField
        label="Principal amount max"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={principalAmountMax}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              description,
              interestRateMin,
              interestRateMax,
              termMonthsMin,
              termMonthsMax,
              principalAmountMin,
              principalAmountMax: value,
              interestCalculationMethod,
              repaymentFrequencies,
            };
            const result = onChange(modelFields);
            value = result?.principalAmountMax ?? value;
          }
          if (errors.principalAmountMax?.hasError) {
            runValidationTasks("principalAmountMax", value);
          }
          setPrincipalAmountMax(value);
        }}
        onBlur={() =>
          runValidationTasks("principalAmountMax", principalAmountMax)
        }
        errorMessage={errors.principalAmountMax?.errorMessage}
        hasError={errors.principalAmountMax?.hasError}
        {...getOverrideProps(overrides, "principalAmountMax")}
      ></TextField>
      <SelectField
        label="Interest calculation method"
        placeholder="Please select an option"
        isDisabled={false}
        value={interestCalculationMethod}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description,
              interestRateMin,
              interestRateMax,
              termMonthsMin,
              termMonthsMax,
              principalAmountMin,
              principalAmountMax,
              interestCalculationMethod: value,
              repaymentFrequencies,
            };
            const result = onChange(modelFields);
            value = result?.interestCalculationMethod ?? value;
          }
          if (errors.interestCalculationMethod?.hasError) {
            runValidationTasks("interestCalculationMethod", value);
          }
          setInterestCalculationMethod(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "interestCalculationMethod",
            interestCalculationMethod
          )
        }
        errorMessage={errors.interestCalculationMethod?.errorMessage}
        hasError={errors.interestCalculationMethod?.hasError}
        {...getOverrideProps(overrides, "interestCalculationMethod")}
      >
        <option
          children="Simple"
          value="SIMPLE"
          {...getOverrideProps(overrides, "interestCalculationMethodoption0")}
        ></option>
        <option
          children="Compound"
          value="COMPOUND"
          {...getOverrideProps(overrides, "interestCalculationMethodoption1")}
        ></option>
        <option
          children="Flat"
          value="FLAT"
          {...getOverrideProps(overrides, "interestCalculationMethodoption2")}
        ></option>
      </SelectField>
      <TextField
        label="Repayment frequencies"
        isRequired={false}
        isReadOnly={false}
        value={repaymentFrequencies}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description,
              interestRateMin,
              interestRateMax,
              termMonthsMin,
              termMonthsMax,
              principalAmountMin,
              principalAmountMax,
              interestCalculationMethod,
              repaymentFrequencies: value,
            };
            const result = onChange(modelFields);
            value = result?.repaymentFrequencies ?? value;
          }
          if (errors.repaymentFrequencies?.hasError) {
            runValidationTasks("repaymentFrequencies", value);
          }
          setRepaymentFrequencies(value);
        }}
        onBlur={() =>
          runValidationTasks("repaymentFrequencies", repaymentFrequencies)
        }
        errorMessage={errors.repaymentFrequencies?.errorMessage}
        hasError={errors.repaymentFrequencies?.hasError}
        {...getOverrideProps(overrides, "repaymentFrequencies")}
      ></TextField>
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
