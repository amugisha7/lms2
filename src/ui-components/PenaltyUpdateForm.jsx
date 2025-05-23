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
import { getPenalty } from "../graphql/queries";
import { updatePenalty } from "../graphql/mutations";
const client = generateClient();
export default function PenaltyUpdateForm(props) {
  const {
    id: idProp,
    penalty: penaltyModelProp,
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
    penaltyName: "",
    penaltyCategory: "",
    penaltyCalculationMethod: "",
    penaltyRate: "",
    penaltyDate: "",
    penaltyStatus: "",
    notes: "",
    penaltyType: "",
    penaltyDescription: "",
    penaltyAttribute1: "",
    penaltyAttribute2: "",
  };
  const [amount, setAmount] = React.useState(initialValues.amount);
  const [penaltyName, setPenaltyName] = React.useState(
    initialValues.penaltyName
  );
  const [penaltyCategory, setPenaltyCategory] = React.useState(
    initialValues.penaltyCategory
  );
  const [penaltyCalculationMethod, setPenaltyCalculationMethod] =
    React.useState(initialValues.penaltyCalculationMethod);
  const [penaltyRate, setPenaltyRate] = React.useState(
    initialValues.penaltyRate
  );
  const [penaltyDate, setPenaltyDate] = React.useState(
    initialValues.penaltyDate
  );
  const [penaltyStatus, setPenaltyStatus] = React.useState(
    initialValues.penaltyStatus
  );
  const [notes, setNotes] = React.useState(initialValues.notes);
  const [penaltyType, setPenaltyType] = React.useState(
    initialValues.penaltyType
  );
  const [penaltyDescription, setPenaltyDescription] = React.useState(
    initialValues.penaltyDescription
  );
  const [penaltyAttribute1, setPenaltyAttribute1] = React.useState(
    initialValues.penaltyAttribute1
  );
  const [penaltyAttribute2, setPenaltyAttribute2] = React.useState(
    initialValues.penaltyAttribute2
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = penaltyRecord
      ? { ...initialValues, ...penaltyRecord }
      : initialValues;
    setAmount(cleanValues.amount);
    setPenaltyName(cleanValues.penaltyName);
    setPenaltyCategory(cleanValues.penaltyCategory);
    setPenaltyCalculationMethod(cleanValues.penaltyCalculationMethod);
    setPenaltyRate(cleanValues.penaltyRate);
    setPenaltyDate(cleanValues.penaltyDate);
    setPenaltyStatus(cleanValues.penaltyStatus);
    setNotes(cleanValues.notes);
    setPenaltyType(cleanValues.penaltyType);
    setPenaltyDescription(cleanValues.penaltyDescription);
    setPenaltyAttribute1(cleanValues.penaltyAttribute1);
    setPenaltyAttribute2(cleanValues.penaltyAttribute2);
    setErrors({});
  };
  const [penaltyRecord, setPenaltyRecord] = React.useState(penaltyModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getPenalty.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getPenalty
        : penaltyModelProp;
      setPenaltyRecord(record);
    };
    queryData();
  }, [idProp, penaltyModelProp]);
  React.useEffect(resetStateValues, [penaltyRecord]);
  const validations = {
    amount: [],
    penaltyName: [],
    penaltyCategory: [],
    penaltyCalculationMethod: [],
    penaltyRate: [],
    penaltyDate: [],
    penaltyStatus: [],
    notes: [],
    penaltyType: [],
    penaltyDescription: [],
    penaltyAttribute1: [],
    penaltyAttribute2: [],
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
          penaltyName: penaltyName ?? null,
          penaltyCategory: penaltyCategory ?? null,
          penaltyCalculationMethod: penaltyCalculationMethod ?? null,
          penaltyRate: penaltyRate ?? null,
          penaltyDate: penaltyDate ?? null,
          penaltyStatus: penaltyStatus ?? null,
          notes: notes ?? null,
          penaltyType: penaltyType ?? null,
          penaltyDescription: penaltyDescription ?? null,
          penaltyAttribute1: penaltyAttribute1 ?? null,
          penaltyAttribute2: penaltyAttribute2 ?? null,
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
            query: updatePenalty.replaceAll("__typename", ""),
            variables: {
              input: {
                id: penaltyRecord.id,
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
      {...getOverrideProps(overrides, "PenaltyUpdateForm")}
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
              penaltyName,
              penaltyCategory,
              penaltyCalculationMethod,
              penaltyRate,
              penaltyDate,
              penaltyStatus,
              notes,
              penaltyType,
              penaltyDescription,
              penaltyAttribute1,
              penaltyAttribute2,
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
        label="Penalty name"
        isRequired={false}
        isReadOnly={false}
        value={penaltyName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              amount,
              penaltyName: value,
              penaltyCategory,
              penaltyCalculationMethod,
              penaltyRate,
              penaltyDate,
              penaltyStatus,
              notes,
              penaltyType,
              penaltyDescription,
              penaltyAttribute1,
              penaltyAttribute2,
            };
            const result = onChange(modelFields);
            value = result?.penaltyName ?? value;
          }
          if (errors.penaltyName?.hasError) {
            runValidationTasks("penaltyName", value);
          }
          setPenaltyName(value);
        }}
        onBlur={() => runValidationTasks("penaltyName", penaltyName)}
        errorMessage={errors.penaltyName?.errorMessage}
        hasError={errors.penaltyName?.hasError}
        {...getOverrideProps(overrides, "penaltyName")}
      ></TextField>
      <TextField
        label="Penalty category"
        isRequired={false}
        isReadOnly={false}
        value={penaltyCategory}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              amount,
              penaltyName,
              penaltyCategory: value,
              penaltyCalculationMethod,
              penaltyRate,
              penaltyDate,
              penaltyStatus,
              notes,
              penaltyType,
              penaltyDescription,
              penaltyAttribute1,
              penaltyAttribute2,
            };
            const result = onChange(modelFields);
            value = result?.penaltyCategory ?? value;
          }
          if (errors.penaltyCategory?.hasError) {
            runValidationTasks("penaltyCategory", value);
          }
          setPenaltyCategory(value);
        }}
        onBlur={() => runValidationTasks("penaltyCategory", penaltyCategory)}
        errorMessage={errors.penaltyCategory?.errorMessage}
        hasError={errors.penaltyCategory?.hasError}
        {...getOverrideProps(overrides, "penaltyCategory")}
      ></TextField>
      <TextField
        label="Penalty calculation method"
        isRequired={false}
        isReadOnly={false}
        value={penaltyCalculationMethod}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              amount,
              penaltyName,
              penaltyCategory,
              penaltyCalculationMethod: value,
              penaltyRate,
              penaltyDate,
              penaltyStatus,
              notes,
              penaltyType,
              penaltyDescription,
              penaltyAttribute1,
              penaltyAttribute2,
            };
            const result = onChange(modelFields);
            value = result?.penaltyCalculationMethod ?? value;
          }
          if (errors.penaltyCalculationMethod?.hasError) {
            runValidationTasks("penaltyCalculationMethod", value);
          }
          setPenaltyCalculationMethod(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "penaltyCalculationMethod",
            penaltyCalculationMethod
          )
        }
        errorMessage={errors.penaltyCalculationMethod?.errorMessage}
        hasError={errors.penaltyCalculationMethod?.hasError}
        {...getOverrideProps(overrides, "penaltyCalculationMethod")}
      ></TextField>
      <TextField
        label="Penalty rate"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={penaltyRate}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              amount,
              penaltyName,
              penaltyCategory,
              penaltyCalculationMethod,
              penaltyRate: value,
              penaltyDate,
              penaltyStatus,
              notes,
              penaltyType,
              penaltyDescription,
              penaltyAttribute1,
              penaltyAttribute2,
            };
            const result = onChange(modelFields);
            value = result?.penaltyRate ?? value;
          }
          if (errors.penaltyRate?.hasError) {
            runValidationTasks("penaltyRate", value);
          }
          setPenaltyRate(value);
        }}
        onBlur={() => runValidationTasks("penaltyRate", penaltyRate)}
        errorMessage={errors.penaltyRate?.errorMessage}
        hasError={errors.penaltyRate?.hasError}
        {...getOverrideProps(overrides, "penaltyRate")}
      ></TextField>
      <TextField
        label="Penalty date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={penaltyDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              amount,
              penaltyName,
              penaltyCategory,
              penaltyCalculationMethod,
              penaltyRate,
              penaltyDate: value,
              penaltyStatus,
              notes,
              penaltyType,
              penaltyDescription,
              penaltyAttribute1,
              penaltyAttribute2,
            };
            const result = onChange(modelFields);
            value = result?.penaltyDate ?? value;
          }
          if (errors.penaltyDate?.hasError) {
            runValidationTasks("penaltyDate", value);
          }
          setPenaltyDate(value);
        }}
        onBlur={() => runValidationTasks("penaltyDate", penaltyDate)}
        errorMessage={errors.penaltyDate?.errorMessage}
        hasError={errors.penaltyDate?.hasError}
        {...getOverrideProps(overrides, "penaltyDate")}
      ></TextField>
      <TextField
        label="Penalty status"
        isRequired={false}
        isReadOnly={false}
        value={penaltyStatus}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              amount,
              penaltyName,
              penaltyCategory,
              penaltyCalculationMethod,
              penaltyRate,
              penaltyDate,
              penaltyStatus: value,
              notes,
              penaltyType,
              penaltyDescription,
              penaltyAttribute1,
              penaltyAttribute2,
            };
            const result = onChange(modelFields);
            value = result?.penaltyStatus ?? value;
          }
          if (errors.penaltyStatus?.hasError) {
            runValidationTasks("penaltyStatus", value);
          }
          setPenaltyStatus(value);
        }}
        onBlur={() => runValidationTasks("penaltyStatus", penaltyStatus)}
        errorMessage={errors.penaltyStatus?.errorMessage}
        hasError={errors.penaltyStatus?.hasError}
        {...getOverrideProps(overrides, "penaltyStatus")}
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
              penaltyName,
              penaltyCategory,
              penaltyCalculationMethod,
              penaltyRate,
              penaltyDate,
              penaltyStatus,
              notes: value,
              penaltyType,
              penaltyDescription,
              penaltyAttribute1,
              penaltyAttribute2,
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
        label="Penalty type"
        isRequired={false}
        isReadOnly={false}
        value={penaltyType}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              amount,
              penaltyName,
              penaltyCategory,
              penaltyCalculationMethod,
              penaltyRate,
              penaltyDate,
              penaltyStatus,
              notes,
              penaltyType: value,
              penaltyDescription,
              penaltyAttribute1,
              penaltyAttribute2,
            };
            const result = onChange(modelFields);
            value = result?.penaltyType ?? value;
          }
          if (errors.penaltyType?.hasError) {
            runValidationTasks("penaltyType", value);
          }
          setPenaltyType(value);
        }}
        onBlur={() => runValidationTasks("penaltyType", penaltyType)}
        errorMessage={errors.penaltyType?.errorMessage}
        hasError={errors.penaltyType?.hasError}
        {...getOverrideProps(overrides, "penaltyType")}
      ></TextField>
      <TextField
        label="Penalty description"
        isRequired={false}
        isReadOnly={false}
        value={penaltyDescription}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              amount,
              penaltyName,
              penaltyCategory,
              penaltyCalculationMethod,
              penaltyRate,
              penaltyDate,
              penaltyStatus,
              notes,
              penaltyType,
              penaltyDescription: value,
              penaltyAttribute1,
              penaltyAttribute2,
            };
            const result = onChange(modelFields);
            value = result?.penaltyDescription ?? value;
          }
          if (errors.penaltyDescription?.hasError) {
            runValidationTasks("penaltyDescription", value);
          }
          setPenaltyDescription(value);
        }}
        onBlur={() =>
          runValidationTasks("penaltyDescription", penaltyDescription)
        }
        errorMessage={errors.penaltyDescription?.errorMessage}
        hasError={errors.penaltyDescription?.hasError}
        {...getOverrideProps(overrides, "penaltyDescription")}
      ></TextField>
      <TextField
        label="Penalty attribute1"
        isRequired={false}
        isReadOnly={false}
        value={penaltyAttribute1}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              amount,
              penaltyName,
              penaltyCategory,
              penaltyCalculationMethod,
              penaltyRate,
              penaltyDate,
              penaltyStatus,
              notes,
              penaltyType,
              penaltyDescription,
              penaltyAttribute1: value,
              penaltyAttribute2,
            };
            const result = onChange(modelFields);
            value = result?.penaltyAttribute1 ?? value;
          }
          if (errors.penaltyAttribute1?.hasError) {
            runValidationTasks("penaltyAttribute1", value);
          }
          setPenaltyAttribute1(value);
        }}
        onBlur={() =>
          runValidationTasks("penaltyAttribute1", penaltyAttribute1)
        }
        errorMessage={errors.penaltyAttribute1?.errorMessage}
        hasError={errors.penaltyAttribute1?.hasError}
        {...getOverrideProps(overrides, "penaltyAttribute1")}
      ></TextField>
      <TextField
        label="Penalty attribute2"
        isRequired={false}
        isReadOnly={false}
        value={penaltyAttribute2}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              amount,
              penaltyName,
              penaltyCategory,
              penaltyCalculationMethod,
              penaltyRate,
              penaltyDate,
              penaltyStatus,
              notes,
              penaltyType,
              penaltyDescription,
              penaltyAttribute1,
              penaltyAttribute2: value,
            };
            const result = onChange(modelFields);
            value = result?.penaltyAttribute2 ?? value;
          }
          if (errors.penaltyAttribute2?.hasError) {
            runValidationTasks("penaltyAttribute2", value);
          }
          setPenaltyAttribute2(value);
        }}
        onBlur={() =>
          runValidationTasks("penaltyAttribute2", penaltyAttribute2)
        }
        errorMessage={errors.penaltyAttribute2?.errorMessage}
        hasError={errors.penaltyAttribute2?.hasError}
        {...getOverrideProps(overrides, "penaltyAttribute2")}
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
          isDisabled={!(idProp || penaltyModelProp)}
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
              !(idProp || penaltyModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
