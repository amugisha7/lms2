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
import { getLoanDraftEvent } from "../graphql/queries";
import { updateLoanDraftEvent } from "../graphql/mutations";
const client = generateClient();
export default function LoanDraftEventUpdateForm(props) {
  const {
    id: idProp,
    loanDraftEvent: loanDraftEventModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    loanDraftID: "",
    eventAt: "",
    eventType: "",
    actorEmployeeID: "",
    summary: "",
    payload: "",
  };
  const [loanDraftID, setLoanDraftID] = React.useState(
    initialValues.loanDraftID
  );
  const [eventAt, setEventAt] = React.useState(initialValues.eventAt);
  const [eventType, setEventType] = React.useState(initialValues.eventType);
  const [actorEmployeeID, setActorEmployeeID] = React.useState(
    initialValues.actorEmployeeID
  );
  const [summary, setSummary] = React.useState(initialValues.summary);
  const [payload, setPayload] = React.useState(initialValues.payload);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = loanDraftEventRecord
      ? { ...initialValues, ...loanDraftEventRecord }
      : initialValues;
    setLoanDraftID(cleanValues.loanDraftID);
    setEventAt(cleanValues.eventAt);
    setEventType(cleanValues.eventType);
    setActorEmployeeID(cleanValues.actorEmployeeID);
    setSummary(cleanValues.summary);
    setPayload(
      typeof cleanValues.payload === "string" || cleanValues.payload === null
        ? cleanValues.payload
        : JSON.stringify(cleanValues.payload)
    );
    setErrors({});
  };
  const [loanDraftEventRecord, setLoanDraftEventRecord] = React.useState(
    loanDraftEventModelProp
  );
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getLoanDraftEvent.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getLoanDraftEvent
        : loanDraftEventModelProp;
      setLoanDraftEventRecord(record);
    };
    queryData();
  }, [idProp, loanDraftEventModelProp]);
  React.useEffect(resetStateValues, [loanDraftEventRecord]);
  const validations = {
    loanDraftID: [{ type: "Required" }],
    eventAt: [{ type: "Required" }],
    eventType: [{ type: "Required" }],
    actorEmployeeID: [],
    summary: [],
    payload: [{ type: "JSON" }],
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
  const convertToLocal = (date) => {
    const df = new Intl.DateTimeFormat("default", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      calendar: "iso8601",
      numberingSystem: "latn",
      hourCycle: "h23",
    });
    const parts = df.formatToParts(date).reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});
    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
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
          loanDraftID,
          eventAt,
          eventType,
          actorEmployeeID: actorEmployeeID ?? null,
          summary: summary ?? null,
          payload: payload ?? null,
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
            query: updateLoanDraftEvent.replaceAll("__typename", ""),
            variables: {
              input: {
                id: loanDraftEventRecord.id,
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
      {...getOverrideProps(overrides, "LoanDraftEventUpdateForm")}
      {...rest}
    >
      <TextField
        label="Loan draft id"
        isRequired={true}
        isReadOnly={false}
        value={loanDraftID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanDraftID: value,
              eventAt,
              eventType,
              actorEmployeeID,
              summary,
              payload,
            };
            const result = onChange(modelFields);
            value = result?.loanDraftID ?? value;
          }
          if (errors.loanDraftID?.hasError) {
            runValidationTasks("loanDraftID", value);
          }
          setLoanDraftID(value);
        }}
        onBlur={() => runValidationTasks("loanDraftID", loanDraftID)}
        errorMessage={errors.loanDraftID?.errorMessage}
        hasError={errors.loanDraftID?.hasError}
        {...getOverrideProps(overrides, "loanDraftID")}
      ></TextField>
      <TextField
        label="Event at"
        isRequired={true}
        isReadOnly={false}
        type="datetime-local"
        value={eventAt && convertToLocal(new Date(eventAt))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              loanDraftID,
              eventAt: value,
              eventType,
              actorEmployeeID,
              summary,
              payload,
            };
            const result = onChange(modelFields);
            value = result?.eventAt ?? value;
          }
          if (errors.eventAt?.hasError) {
            runValidationTasks("eventAt", value);
          }
          setEventAt(value);
        }}
        onBlur={() => runValidationTasks("eventAt", eventAt)}
        errorMessage={errors.eventAt?.errorMessage}
        hasError={errors.eventAt?.hasError}
        {...getOverrideProps(overrides, "eventAt")}
      ></TextField>
      <TextField
        label="Event type"
        isRequired={true}
        isReadOnly={false}
        value={eventType}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanDraftID,
              eventAt,
              eventType: value,
              actorEmployeeID,
              summary,
              payload,
            };
            const result = onChange(modelFields);
            value = result?.eventType ?? value;
          }
          if (errors.eventType?.hasError) {
            runValidationTasks("eventType", value);
          }
          setEventType(value);
        }}
        onBlur={() => runValidationTasks("eventType", eventType)}
        errorMessage={errors.eventType?.errorMessage}
        hasError={errors.eventType?.hasError}
        {...getOverrideProps(overrides, "eventType")}
      ></TextField>
      <TextField
        label="Actor employee id"
        isRequired={false}
        isReadOnly={false}
        value={actorEmployeeID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanDraftID,
              eventAt,
              eventType,
              actorEmployeeID: value,
              summary,
              payload,
            };
            const result = onChange(modelFields);
            value = result?.actorEmployeeID ?? value;
          }
          if (errors.actorEmployeeID?.hasError) {
            runValidationTasks("actorEmployeeID", value);
          }
          setActorEmployeeID(value);
        }}
        onBlur={() => runValidationTasks("actorEmployeeID", actorEmployeeID)}
        errorMessage={errors.actorEmployeeID?.errorMessage}
        hasError={errors.actorEmployeeID?.hasError}
        {...getOverrideProps(overrides, "actorEmployeeID")}
      ></TextField>
      <TextField
        label="Summary"
        isRequired={false}
        isReadOnly={false}
        value={summary}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanDraftID,
              eventAt,
              eventType,
              actorEmployeeID,
              summary: value,
              payload,
            };
            const result = onChange(modelFields);
            value = result?.summary ?? value;
          }
          if (errors.summary?.hasError) {
            runValidationTasks("summary", value);
          }
          setSummary(value);
        }}
        onBlur={() => runValidationTasks("summary", summary)}
        errorMessage={errors.summary?.errorMessage}
        hasError={errors.summary?.hasError}
        {...getOverrideProps(overrides, "summary")}
      ></TextField>
      <TextAreaField
        label="Payload"
        isRequired={false}
        isReadOnly={false}
        value={payload}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              loanDraftID,
              eventAt,
              eventType,
              actorEmployeeID,
              summary,
              payload: value,
            };
            const result = onChange(modelFields);
            value = result?.payload ?? value;
          }
          if (errors.payload?.hasError) {
            runValidationTasks("payload", value);
          }
          setPayload(value);
        }}
        onBlur={() => runValidationTasks("payload", payload)}
        errorMessage={errors.payload?.errorMessage}
        hasError={errors.payload?.hasError}
        {...getOverrideProps(overrides, "payload")}
      ></TextAreaField>
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
          isDisabled={!(idProp || loanDraftEventModelProp)}
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
              !(idProp || loanDraftEventModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
