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
import { getOtherIncome } from "../graphql/queries";
import { updateOtherIncome } from "../graphql/mutations";
const client = generateClient();
export default function OtherIncomeUpdateForm(props) {
  const {
    id: idProp,
    otherIncome: otherIncomeModelProp,
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
  };
  const [name, setName] = React.useState(initialValues.name);
  const [description, setDescription] = React.useState(
    initialValues.description
  );
  const [amount, setAmount] = React.useState(initialValues.amount);
  const [incomeDate, setIncomeDate] = React.useState(initialValues.incomeDate);
  const [incomeType, setIncomeType] = React.useState(initialValues.incomeType);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = otherIncomeRecord
      ? { ...initialValues, ...otherIncomeRecord }
      : initialValues;
    setName(cleanValues.name);
    setDescription(cleanValues.description);
    setAmount(cleanValues.amount);
    setIncomeDate(cleanValues.incomeDate);
    setIncomeType(cleanValues.incomeType);
    setErrors({});
  };
  const [otherIncomeRecord, setOtherIncomeRecord] =
    React.useState(otherIncomeModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getOtherIncome.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getOtherIncome
        : otherIncomeModelProp;
      setOtherIncomeRecord(record);
    };
    queryData();
  }, [idProp, otherIncomeModelProp]);
  React.useEffect(resetStateValues, [otherIncomeRecord]);
  const validations = {
    name: [],
    description: [],
    amount: [],
    incomeDate: [],
    incomeType: [],
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
          description: description ?? null,
          amount: amount ?? null,
          incomeDate: incomeDate ?? null,
          incomeType: incomeType ?? null,
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
            query: updateOtherIncome.replaceAll("__typename", ""),
            variables: {
              input: {
                id: otherIncomeRecord.id,
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
      {...getOverrideProps(overrides, "OtherIncomeUpdateForm")}
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
          isDisabled={!(idProp || otherIncomeModelProp)}
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
              !(idProp || otherIncomeModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
