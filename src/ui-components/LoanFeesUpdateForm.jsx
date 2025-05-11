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
import { getLoanFees } from "../graphql/queries";
import { updateLoanFees } from "../graphql/mutations";
const client = generateClient();
export default function LoanFeesUpdateForm(props) {
  const {
    id: idProp,
    loanFees: loanFeesModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    amount: "",
    loanFeesName: "",
    loanFeesCategory: "",
    loanFeesCalculationMethod: "",
    loanFeesRate: "",
    loanFeesDate: "",
    loanFeesStatus: "",
    notes: "",
    loanFeesType: "",
    loanFeesDescription: "",
    loanFeesAttribute1: "",
    loanFeesAttribute2: "",
  };
  const [amount, setAmount] = React.useState(initialValues.amount);
  const [loanFeesName, setLoanFeesName] = React.useState(
    initialValues.loanFeesName
  );
  const [loanFeesCategory, setLoanFeesCategory] = React.useState(
    initialValues.loanFeesCategory
  );
  const [loanFeesCalculationMethod, setLoanFeesCalculationMethod] =
    React.useState(initialValues.loanFeesCalculationMethod);
  const [loanFeesRate, setLoanFeesRate] = React.useState(
    initialValues.loanFeesRate
  );
  const [loanFeesDate, setLoanFeesDate] = React.useState(
    initialValues.loanFeesDate
  );
  const [loanFeesStatus, setLoanFeesStatus] = React.useState(
    initialValues.loanFeesStatus
  );
  const [notes, setNotes] = React.useState(initialValues.notes);
  const [loanFeesType, setLoanFeesType] = React.useState(
    initialValues.loanFeesType
  );
  const [loanFeesDescription, setLoanFeesDescription] = React.useState(
    initialValues.loanFeesDescription
  );
  const [loanFeesAttribute1, setLoanFeesAttribute1] = React.useState(
    initialValues.loanFeesAttribute1
  );
  const [loanFeesAttribute2, setLoanFeesAttribute2] = React.useState(
    initialValues.loanFeesAttribute2
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = loanFeesRecord
      ? { ...initialValues, ...loanFeesRecord }
      : initialValues;
    setAmount(cleanValues.amount);
    setLoanFeesName(cleanValues.loanFeesName);
    setLoanFeesCategory(cleanValues.loanFeesCategory);
    setLoanFeesCalculationMethod(cleanValues.loanFeesCalculationMethod);
    setLoanFeesRate(cleanValues.loanFeesRate);
    setLoanFeesDate(cleanValues.loanFeesDate);
    setLoanFeesStatus(cleanValues.loanFeesStatus);
    setNotes(cleanValues.notes);
    setLoanFeesType(cleanValues.loanFeesType);
    setLoanFeesDescription(cleanValues.loanFeesDescription);
    setLoanFeesAttribute1(cleanValues.loanFeesAttribute1);
    setLoanFeesAttribute2(cleanValues.loanFeesAttribute2);
    setErrors({});
  };
  const [loanFeesRecord, setLoanFeesRecord] = React.useState(loanFeesModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getLoanFees.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getLoanFees
        : loanFeesModelProp;
      setLoanFeesRecord(record);
    };
    queryData();
  }, [idProp, loanFeesModelProp]);
  React.useEffect(resetStateValues, [loanFeesRecord]);
  const validations = {
    amount: [],
    loanFeesName: [],
    loanFeesCategory: [],
    loanFeesCalculationMethod: [],
    loanFeesRate: [],
    loanFeesDate: [],
    loanFeesStatus: [],
    notes: [],
    loanFeesType: [],
    loanFeesDescription: [],
    loanFeesAttribute1: [],
    loanFeesAttribute2: [],
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
          amount: amount ?? null,
          loanFeesName: loanFeesName ?? null,
          loanFeesCategory: loanFeesCategory ?? null,
          loanFeesCalculationMethod: loanFeesCalculationMethod ?? null,
          loanFeesRate: loanFeesRate ?? null,
          loanFeesDate: loanFeesDate ?? null,
          loanFeesStatus: loanFeesStatus ?? null,
          notes: notes ?? null,
          loanFeesType: loanFeesType ?? null,
          loanFeesDescription: loanFeesDescription ?? null,
          loanFeesAttribute1: loanFeesAttribute1 ?? null,
          loanFeesAttribute2: loanFeesAttribute2 ?? null,
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
            query: updateLoanFees.replaceAll("__typename", ""),
            variables: {
              input: {
                id: loanFeesRecord.id,
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
      {...getOverrideProps(overrides, "LoanFeesUpdateForm")}
      {...rest}
    >
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
              amount: value,
              loanFeesName,
              loanFeesCategory,
              loanFeesCalculationMethod,
              loanFeesRate,
              loanFeesDate,
              loanFeesStatus,
              notes,
              loanFeesType,
              loanFeesDescription,
              loanFeesAttribute1,
              loanFeesAttribute2,
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
        label="Loan fees name"
        isRequired={false}
        isReadOnly={false}
        value={loanFeesName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              amount,
              loanFeesName: value,
              loanFeesCategory,
              loanFeesCalculationMethod,
              loanFeesRate,
              loanFeesDate,
              loanFeesStatus,
              notes,
              loanFeesType,
              loanFeesDescription,
              loanFeesAttribute1,
              loanFeesAttribute2,
            };
            const result = onChange(modelFields);
            value = result?.loanFeesName ?? value;
          }
          if (errors.loanFeesName?.hasError) {
            runValidationTasks("loanFeesName", value);
          }
          setLoanFeesName(value);
        }}
        onBlur={() => runValidationTasks("loanFeesName", loanFeesName)}
        errorMessage={errors.loanFeesName?.errorMessage}
        hasError={errors.loanFeesName?.hasError}
        {...getOverrideProps(overrides, "loanFeesName")}
      ></TextField>
      <TextField
        label="Loan fees category"
        isRequired={false}
        isReadOnly={false}
        value={loanFeesCategory}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              amount,
              loanFeesName,
              loanFeesCategory: value,
              loanFeesCalculationMethod,
              loanFeesRate,
              loanFeesDate,
              loanFeesStatus,
              notes,
              loanFeesType,
              loanFeesDescription,
              loanFeesAttribute1,
              loanFeesAttribute2,
            };
            const result = onChange(modelFields);
            value = result?.loanFeesCategory ?? value;
          }
          if (errors.loanFeesCategory?.hasError) {
            runValidationTasks("loanFeesCategory", value);
          }
          setLoanFeesCategory(value);
        }}
        onBlur={() => runValidationTasks("loanFeesCategory", loanFeesCategory)}
        errorMessage={errors.loanFeesCategory?.errorMessage}
        hasError={errors.loanFeesCategory?.hasError}
        {...getOverrideProps(overrides, "loanFeesCategory")}
      ></TextField>
      <TextField
        label="Loan fees calculation method"
        isRequired={false}
        isReadOnly={false}
        value={loanFeesCalculationMethod}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              amount,
              loanFeesName,
              loanFeesCategory,
              loanFeesCalculationMethod: value,
              loanFeesRate,
              loanFeesDate,
              loanFeesStatus,
              notes,
              loanFeesType,
              loanFeesDescription,
              loanFeesAttribute1,
              loanFeesAttribute2,
            };
            const result = onChange(modelFields);
            value = result?.loanFeesCalculationMethod ?? value;
          }
          if (errors.loanFeesCalculationMethod?.hasError) {
            runValidationTasks("loanFeesCalculationMethod", value);
          }
          setLoanFeesCalculationMethod(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "loanFeesCalculationMethod",
            loanFeesCalculationMethod
          )
        }
        errorMessage={errors.loanFeesCalculationMethod?.errorMessage}
        hasError={errors.loanFeesCalculationMethod?.hasError}
        {...getOverrideProps(overrides, "loanFeesCalculationMethod")}
      ></TextField>
      <TextField
        label="Loan fees rate"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={loanFeesRate}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              amount,
              loanFeesName,
              loanFeesCategory,
              loanFeesCalculationMethod,
              loanFeesRate: value,
              loanFeesDate,
              loanFeesStatus,
              notes,
              loanFeesType,
              loanFeesDescription,
              loanFeesAttribute1,
              loanFeesAttribute2,
            };
            const result = onChange(modelFields);
            value = result?.loanFeesRate ?? value;
          }
          if (errors.loanFeesRate?.hasError) {
            runValidationTasks("loanFeesRate", value);
          }
          setLoanFeesRate(value);
        }}
        onBlur={() => runValidationTasks("loanFeesRate", loanFeesRate)}
        errorMessage={errors.loanFeesRate?.errorMessage}
        hasError={errors.loanFeesRate?.hasError}
        {...getOverrideProps(overrides, "loanFeesRate")}
      ></TextField>
      <TextField
        label="Loan fees date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={loanFeesDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              amount,
              loanFeesName,
              loanFeesCategory,
              loanFeesCalculationMethod,
              loanFeesRate,
              loanFeesDate: value,
              loanFeesStatus,
              notes,
              loanFeesType,
              loanFeesDescription,
              loanFeesAttribute1,
              loanFeesAttribute2,
            };
            const result = onChange(modelFields);
            value = result?.loanFeesDate ?? value;
          }
          if (errors.loanFeesDate?.hasError) {
            runValidationTasks("loanFeesDate", value);
          }
          setLoanFeesDate(value);
        }}
        onBlur={() => runValidationTasks("loanFeesDate", loanFeesDate)}
        errorMessage={errors.loanFeesDate?.errorMessage}
        hasError={errors.loanFeesDate?.hasError}
        {...getOverrideProps(overrides, "loanFeesDate")}
      ></TextField>
      <TextField
        label="Loan fees status"
        isRequired={false}
        isReadOnly={false}
        value={loanFeesStatus}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              amount,
              loanFeesName,
              loanFeesCategory,
              loanFeesCalculationMethod,
              loanFeesRate,
              loanFeesDate,
              loanFeesStatus: value,
              notes,
              loanFeesType,
              loanFeesDescription,
              loanFeesAttribute1,
              loanFeesAttribute2,
            };
            const result = onChange(modelFields);
            value = result?.loanFeesStatus ?? value;
          }
          if (errors.loanFeesStatus?.hasError) {
            runValidationTasks("loanFeesStatus", value);
          }
          setLoanFeesStatus(value);
        }}
        onBlur={() => runValidationTasks("loanFeesStatus", loanFeesStatus)}
        errorMessage={errors.loanFeesStatus?.errorMessage}
        hasError={errors.loanFeesStatus?.hasError}
        {...getOverrideProps(overrides, "loanFeesStatus")}
      ></TextField>
      <TextField
        label="Notes"
        isRequired={false}
        isReadOnly={false}
        value={notes}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              amount,
              loanFeesName,
              loanFeesCategory,
              loanFeesCalculationMethod,
              loanFeesRate,
              loanFeesDate,
              loanFeesStatus,
              notes: value,
              loanFeesType,
              loanFeesDescription,
              loanFeesAttribute1,
              loanFeesAttribute2,
            };
            const result = onChange(modelFields);
            value = result?.notes ?? value;
          }
          if (errors.notes?.hasError) {
            runValidationTasks("notes", value);
          }
          setNotes(value);
        }}
        onBlur={() => runValidationTasks("notes", notes)}
        errorMessage={errors.notes?.errorMessage}
        hasError={errors.notes?.hasError}
        {...getOverrideProps(overrides, "notes")}
      ></TextField>
      <TextField
        label="Loan fees type"
        isRequired={false}
        isReadOnly={false}
        value={loanFeesType}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              amount,
              loanFeesName,
              loanFeesCategory,
              loanFeesCalculationMethod,
              loanFeesRate,
              loanFeesDate,
              loanFeesStatus,
              notes,
              loanFeesType: value,
              loanFeesDescription,
              loanFeesAttribute1,
              loanFeesAttribute2,
            };
            const result = onChange(modelFields);
            value = result?.loanFeesType ?? value;
          }
          if (errors.loanFeesType?.hasError) {
            runValidationTasks("loanFeesType", value);
          }
          setLoanFeesType(value);
        }}
        onBlur={() => runValidationTasks("loanFeesType", loanFeesType)}
        errorMessage={errors.loanFeesType?.errorMessage}
        hasError={errors.loanFeesType?.hasError}
        {...getOverrideProps(overrides, "loanFeesType")}
      ></TextField>
      <TextField
        label="Loan fees description"
        isRequired={false}
        isReadOnly={false}
        value={loanFeesDescription}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              amount,
              loanFeesName,
              loanFeesCategory,
              loanFeesCalculationMethod,
              loanFeesRate,
              loanFeesDate,
              loanFeesStatus,
              notes,
              loanFeesType,
              loanFeesDescription: value,
              loanFeesAttribute1,
              loanFeesAttribute2,
            };
            const result = onChange(modelFields);
            value = result?.loanFeesDescription ?? value;
          }
          if (errors.loanFeesDescription?.hasError) {
            runValidationTasks("loanFeesDescription", value);
          }
          setLoanFeesDescription(value);
        }}
        onBlur={() =>
          runValidationTasks("loanFeesDescription", loanFeesDescription)
        }
        errorMessage={errors.loanFeesDescription?.errorMessage}
        hasError={errors.loanFeesDescription?.hasError}
        {...getOverrideProps(overrides, "loanFeesDescription")}
      ></TextField>
      <TextField
        label="Loan fees attribute1"
        isRequired={false}
        isReadOnly={false}
        value={loanFeesAttribute1}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              amount,
              loanFeesName,
              loanFeesCategory,
              loanFeesCalculationMethod,
              loanFeesRate,
              loanFeesDate,
              loanFeesStatus,
              notes,
              loanFeesType,
              loanFeesDescription,
              loanFeesAttribute1: value,
              loanFeesAttribute2,
            };
            const result = onChange(modelFields);
            value = result?.loanFeesAttribute1 ?? value;
          }
          if (errors.loanFeesAttribute1?.hasError) {
            runValidationTasks("loanFeesAttribute1", value);
          }
          setLoanFeesAttribute1(value);
        }}
        onBlur={() =>
          runValidationTasks("loanFeesAttribute1", loanFeesAttribute1)
        }
        errorMessage={errors.loanFeesAttribute1?.errorMessage}
        hasError={errors.loanFeesAttribute1?.hasError}
        {...getOverrideProps(overrides, "loanFeesAttribute1")}
      ></TextField>
      <TextField
        label="Loan fees attribute2"
        isRequired={false}
        isReadOnly={false}
        value={loanFeesAttribute2}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              amount,
              loanFeesName,
              loanFeesCategory,
              loanFeesCalculationMethod,
              loanFeesRate,
              loanFeesDate,
              loanFeesStatus,
              notes,
              loanFeesType,
              loanFeesDescription,
              loanFeesAttribute1,
              loanFeesAttribute2: value,
            };
            const result = onChange(modelFields);
            value = result?.loanFeesAttribute2 ?? value;
          }
          if (errors.loanFeesAttribute2?.hasError) {
            runValidationTasks("loanFeesAttribute2", value);
          }
          setLoanFeesAttribute2(value);
        }}
        onBlur={() =>
          runValidationTasks("loanFeesAttribute2", loanFeesAttribute2)
        }
        errorMessage={errors.loanFeesAttribute2?.errorMessage}
        hasError={errors.loanFeesAttribute2?.hasError}
        {...getOverrideProps(overrides, "loanFeesAttribute2")}
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
          isDisabled={!(idProp || loanFeesModelProp)}
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
              !(idProp || loanFeesModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
