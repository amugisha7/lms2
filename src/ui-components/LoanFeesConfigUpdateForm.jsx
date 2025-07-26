/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getLoanFeesConfig } from "../graphql/queries";
import { updateLoanFeesConfig } from "../graphql/mutations";
const client = generateClient();
export default function LoanFeesConfigUpdateForm(props) {
  const {
    id: idProp,
    loanFeesConfig: loanFeesConfigModelProp,
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
    category: "",
    calculationMethod: "",
    description: "",
    percentageBase: "",
    rate: "",
    status: "",
  };
  const [name, setName] = React.useState(initialValues.name);
  const [category, setCategory] = React.useState(initialValues.category);
  const [calculationMethod, setCalculationMethod] = React.useState(
    initialValues.calculationMethod
  );
  const [description, setDescription] = React.useState(
    initialValues.description
  );
  const [percentageBase, setPercentageBase] = React.useState(
    initialValues.percentageBase
  );
  const [rate, setRate] = React.useState(initialValues.rate);
  const [status, setStatus] = React.useState(initialValues.status);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = loanFeesConfigRecord
      ? { ...initialValues, ...loanFeesConfigRecord }
      : initialValues;
    setName(cleanValues.name);
    setCategory(cleanValues.category);
    setCalculationMethod(cleanValues.calculationMethod);
    setDescription(cleanValues.description);
    setPercentageBase(cleanValues.percentageBase);
    setRate(cleanValues.rate);
    setStatus(cleanValues.status);
    setErrors({});
  };
  const [loanFeesConfigRecord, setLoanFeesConfigRecord] = React.useState(
    loanFeesConfigModelProp
  );
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getLoanFeesConfig.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getLoanFeesConfig
        : loanFeesConfigModelProp;
      setLoanFeesConfigRecord(record);
    };
    queryData();
  }, [idProp, loanFeesConfigModelProp]);
  React.useEffect(resetStateValues, [loanFeesConfigRecord]);
  const validations = {
    name: [],
    category: [],
    calculationMethod: [],
    description: [],
    percentageBase: [],
    rate: [],
    status: [],
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
          name: name ?? null,
          category: category ?? null,
          calculationMethod: calculationMethod ?? null,
          description: description ?? null,
          percentageBase: percentageBase ?? null,
          rate: rate ?? null,
          status: status ?? null,
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
            query: updateLoanFeesConfig.replaceAll("__typename", ""),
            variables: {
              input: {
                id: loanFeesConfigRecord.id,
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "LoanFeesConfigUpdateForm")}
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
              category,
              calculationMethod,
              description,
              percentageBase,
              rate,
              status,
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
        label="Category"
        isRequired={false}
        isReadOnly={false}
        value={category}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              category: value,
              calculationMethod,
              description,
              percentageBase,
              rate,
              status,
            };
            const result = onChange(modelFields);
            value = result?.category ?? value;
          }
          if (errors.category?.hasError) {
            runValidationTasks("category", value);
          }
          setCategory(value);
        }}
        onBlur={() => runValidationTasks("category", category)}
        errorMessage={errors.category?.errorMessage}
        hasError={errors.category?.hasError}
        {...getOverrideProps(overrides, "category")}
      ></TextField>
      <TextField
        label="Calculation method"
        isRequired={false}
        isReadOnly={false}
        value={calculationMethod}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              category,
              calculationMethod: value,
              description,
              percentageBase,
              rate,
              status,
            };
            const result = onChange(modelFields);
            value = result?.calculationMethod ?? value;
          }
          if (errors.calculationMethod?.hasError) {
            runValidationTasks("calculationMethod", value);
          }
          setCalculationMethod(value);
        }}
        onBlur={() =>
          runValidationTasks("calculationMethod", calculationMethod)
        }
        errorMessage={errors.calculationMethod?.errorMessage}
        hasError={errors.calculationMethod?.hasError}
        {...getOverrideProps(overrides, "calculationMethod")}
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
              category,
              calculationMethod,
              description: value,
              percentageBase,
              rate,
              status,
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
        label="Percentage base"
        isRequired={false}
        isReadOnly={false}
        value={percentageBase}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              category,
              calculationMethod,
              description,
              percentageBase: value,
              rate,
              status,
            };
            const result = onChange(modelFields);
            value = result?.percentageBase ?? value;
          }
          if (errors.percentageBase?.hasError) {
            runValidationTasks("percentageBase", value);
          }
          setPercentageBase(value);
        }}
        onBlur={() => runValidationTasks("percentageBase", percentageBase)}
        errorMessage={errors.percentageBase?.errorMessage}
        hasError={errors.percentageBase?.hasError}
        {...getOverrideProps(overrides, "percentageBase")}
      ></TextField>
      <TextField
        label="Rate"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={rate}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              category,
              calculationMethod,
              description,
              percentageBase,
              rate: value,
              status,
            };
            const result = onChange(modelFields);
            value = result?.rate ?? value;
          }
          if (errors.rate?.hasError) {
            runValidationTasks("rate", value);
          }
          setRate(value);
        }}
        onBlur={() => runValidationTasks("rate", rate)}
        errorMessage={errors.rate?.errorMessage}
        hasError={errors.rate?.hasError}
        {...getOverrideProps(overrides, "rate")}
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
              category,
              calculationMethod,
              description,
              percentageBase,
              rate,
              status: value,
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
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || loanFeesConfigModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || loanFeesConfigModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
