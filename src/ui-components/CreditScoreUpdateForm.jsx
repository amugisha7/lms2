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
import { getCreditScore } from "../graphql/queries";
import { updateCreditScore } from "../graphql/mutations";
const client = generateClient();
export default function CreditScoreUpdateForm(props) {
  const {
    id: idProp,
    creditScore: creditScoreModelProp,
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
    score: "",
    scoreDate: "",
    scoreSource: "",
    scoreStatus: "",
    status: "",
  };
  const [name, setName] = React.useState(initialValues.name);
  const [description, setDescription] = React.useState(
    initialValues.description
  );
  const [score, setScore] = React.useState(initialValues.score);
  const [scoreDate, setScoreDate] = React.useState(initialValues.scoreDate);
  const [scoreSource, setScoreSource] = React.useState(
    initialValues.scoreSource
  );
  const [scoreStatus, setScoreStatus] = React.useState(
    initialValues.scoreStatus
  );
  const [status, setStatus] = React.useState(initialValues.status);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = creditScoreRecord
      ? { ...initialValues, ...creditScoreRecord }
      : initialValues;
    setName(cleanValues.name);
    setDescription(cleanValues.description);
    setScore(cleanValues.score);
    setScoreDate(cleanValues.scoreDate);
    setScoreSource(cleanValues.scoreSource);
    setScoreStatus(cleanValues.scoreStatus);
    setStatus(cleanValues.status);
    setErrors({});
  };
  const [creditScoreRecord, setCreditScoreRecord] =
    React.useState(creditScoreModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getCreditScore.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getCreditScore
        : creditScoreModelProp;
      setCreditScoreRecord(record);
    };
    queryData();
  }, [idProp, creditScoreModelProp]);
  React.useEffect(resetStateValues, [creditScoreRecord]);
  const validations = {
    name: [],
    description: [],
    score: [],
    scoreDate: [],
    scoreSource: [],
    scoreStatus: [],
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
          description: description ?? null,
          score: score ?? null,
          scoreDate: scoreDate ?? null,
          scoreSource: scoreSource ?? null,
          scoreStatus: scoreStatus ?? null,
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
            query: updateCreditScore.replaceAll("__typename", ""),
            variables: {
              input: {
                id: creditScoreRecord.id,
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
      {...getOverrideProps(overrides, "CreditScoreUpdateForm")}
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
              score,
              scoreDate,
              scoreSource,
              scoreStatus,
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
              score,
              scoreDate,
              scoreSource,
              scoreStatus,
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
        label="Score"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={score}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              description,
              score: value,
              scoreDate,
              scoreSource,
              scoreStatus,
              status,
            };
            const result = onChange(modelFields);
            value = result?.score ?? value;
          }
          if (errors.score?.hasError) {
            runValidationTasks("score", value);
          }
          setScore(value);
        }}
        onBlur={() => runValidationTasks("score", score)}
        errorMessage={errors.score?.errorMessage}
        hasError={errors.score?.hasError}
        {...getOverrideProps(overrides, "score")}
      ></TextField>
      <TextField
        label="Score date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={scoreDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description,
              score,
              scoreDate: value,
              scoreSource,
              scoreStatus,
              status,
            };
            const result = onChange(modelFields);
            value = result?.scoreDate ?? value;
          }
          if (errors.scoreDate?.hasError) {
            runValidationTasks("scoreDate", value);
          }
          setScoreDate(value);
        }}
        onBlur={() => runValidationTasks("scoreDate", scoreDate)}
        errorMessage={errors.scoreDate?.errorMessage}
        hasError={errors.scoreDate?.hasError}
        {...getOverrideProps(overrides, "scoreDate")}
      ></TextField>
      <TextField
        label="Score source"
        isRequired={false}
        isReadOnly={false}
        value={scoreSource}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description,
              score,
              scoreDate,
              scoreSource: value,
              scoreStatus,
              status,
            };
            const result = onChange(modelFields);
            value = result?.scoreSource ?? value;
          }
          if (errors.scoreSource?.hasError) {
            runValidationTasks("scoreSource", value);
          }
          setScoreSource(value);
        }}
        onBlur={() => runValidationTasks("scoreSource", scoreSource)}
        errorMessage={errors.scoreSource?.errorMessage}
        hasError={errors.scoreSource?.hasError}
        {...getOverrideProps(overrides, "scoreSource")}
      ></TextField>
      <TextField
        label="Score status"
        isRequired={false}
        isReadOnly={false}
        value={scoreStatus}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description,
              score,
              scoreDate,
              scoreSource,
              scoreStatus: value,
              status,
            };
            const result = onChange(modelFields);
            value = result?.scoreStatus ?? value;
          }
          if (errors.scoreStatus?.hasError) {
            runValidationTasks("scoreStatus", value);
          }
          setScoreStatus(value);
        }}
        onBlur={() => runValidationTasks("scoreStatus", scoreStatus)}
        errorMessage={errors.scoreStatus?.errorMessage}
        hasError={errors.scoreStatus?.hasError}
        {...getOverrideProps(overrides, "scoreStatus")}
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
              score,
              scoreDate,
              scoreSource,
              scoreStatus,
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
          isDisabled={!(idProp || creditScoreModelProp)}
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
              !(idProp || creditScoreModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
