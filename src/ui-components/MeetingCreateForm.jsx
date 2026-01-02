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
import { createMeeting } from "../graphql/mutations";
const client = generateClient();
export default function MeetingCreateForm(props) {
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
    title: "",
    date: "",
    type: "",
    status: "",
    minutes: "",
    attendanceRecord: "",
    resolutionsRecord: "",
    customMeetingDetails: "",
  };
  const [title, setTitle] = React.useState(initialValues.title);
  const [date, setDate] = React.useState(initialValues.date);
  const [type, setType] = React.useState(initialValues.type);
  const [status, setStatus] = React.useState(initialValues.status);
  const [minutes, setMinutes] = React.useState(initialValues.minutes);
  const [attendanceRecord, setAttendanceRecord] = React.useState(
    initialValues.attendanceRecord
  );
  const [resolutionsRecord, setResolutionsRecord] = React.useState(
    initialValues.resolutionsRecord
  );
  const [customMeetingDetails, setCustomMeetingDetails] = React.useState(
    initialValues.customMeetingDetails
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setTitle(initialValues.title);
    setDate(initialValues.date);
    setType(initialValues.type);
    setStatus(initialValues.status);
    setMinutes(initialValues.minutes);
    setAttendanceRecord(initialValues.attendanceRecord);
    setResolutionsRecord(initialValues.resolutionsRecord);
    setCustomMeetingDetails(initialValues.customMeetingDetails);
    setErrors({});
  };
  const validations = {
    title: [],
    date: [],
    type: [],
    status: [],
    minutes: [],
    attendanceRecord: [{ type: "JSON" }],
    resolutionsRecord: [{ type: "JSON" }],
    customMeetingDetails: [{ type: "JSON" }],
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
          title,
          date,
          type,
          status,
          minutes,
          attendanceRecord,
          resolutionsRecord,
          customMeetingDetails,
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
            query: createMeeting.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "MeetingCreateForm")}
      {...rest}
    >
      <TextField
        label="Title"
        isRequired={false}
        isReadOnly={false}
        value={title}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title: value,
              date,
              type,
              status,
              minutes,
              attendanceRecord,
              resolutionsRecord,
              customMeetingDetails,
            };
            const result = onChange(modelFields);
            value = result?.title ?? value;
          }
          if (errors.title?.hasError) {
            runValidationTasks("title", value);
          }
          setTitle(value);
        }}
        onBlur={() => runValidationTasks("title", title)}
        errorMessage={errors.title?.errorMessage}
        hasError={errors.title?.hasError}
        {...getOverrideProps(overrides, "title")}
      ></TextField>
      <TextField
        label="Date"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={date && convertToLocal(new Date(date))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              title,
              date: value,
              type,
              status,
              minutes,
              attendanceRecord,
              resolutionsRecord,
              customMeetingDetails,
            };
            const result = onChange(modelFields);
            value = result?.date ?? value;
          }
          if (errors.date?.hasError) {
            runValidationTasks("date", value);
          }
          setDate(value);
        }}
        onBlur={() => runValidationTasks("date", date)}
        errorMessage={errors.date?.errorMessage}
        hasError={errors.date?.hasError}
        {...getOverrideProps(overrides, "date")}
      ></TextField>
      <TextField
        label="Type"
        isRequired={false}
        isReadOnly={false}
        value={type}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title,
              date,
              type: value,
              status,
              minutes,
              attendanceRecord,
              resolutionsRecord,
              customMeetingDetails,
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
        label="Status"
        isRequired={false}
        isReadOnly={false}
        value={status}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title,
              date,
              type,
              status: value,
              minutes,
              attendanceRecord,
              resolutionsRecord,
              customMeetingDetails,
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
      <TextField
        label="Minutes"
        isRequired={false}
        isReadOnly={false}
        value={minutes}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title,
              date,
              type,
              status,
              minutes: value,
              attendanceRecord,
              resolutionsRecord,
              customMeetingDetails,
            };
            const result = onChange(modelFields);
            value = result?.minutes ?? value;
          }
          if (errors.minutes?.hasError) {
            runValidationTasks("minutes", value);
          }
          setMinutes(value);
        }}
        onBlur={() => runValidationTasks("minutes", minutes)}
        errorMessage={errors.minutes?.errorMessage}
        hasError={errors.minutes?.hasError}
        {...getOverrideProps(overrides, "minutes")}
      ></TextField>
      <TextAreaField
        label="Attendance record"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title,
              date,
              type,
              status,
              minutes,
              attendanceRecord: value,
              resolutionsRecord,
              customMeetingDetails,
            };
            const result = onChange(modelFields);
            value = result?.attendanceRecord ?? value;
          }
          if (errors.attendanceRecord?.hasError) {
            runValidationTasks("attendanceRecord", value);
          }
          setAttendanceRecord(value);
        }}
        onBlur={() => runValidationTasks("attendanceRecord", attendanceRecord)}
        errorMessage={errors.attendanceRecord?.errorMessage}
        hasError={errors.attendanceRecord?.hasError}
        {...getOverrideProps(overrides, "attendanceRecord")}
      ></TextAreaField>
      <TextAreaField
        label="Resolutions record"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title,
              date,
              type,
              status,
              minutes,
              attendanceRecord,
              resolutionsRecord: value,
              customMeetingDetails,
            };
            const result = onChange(modelFields);
            value = result?.resolutionsRecord ?? value;
          }
          if (errors.resolutionsRecord?.hasError) {
            runValidationTasks("resolutionsRecord", value);
          }
          setResolutionsRecord(value);
        }}
        onBlur={() =>
          runValidationTasks("resolutionsRecord", resolutionsRecord)
        }
        errorMessage={errors.resolutionsRecord?.errorMessage}
        hasError={errors.resolutionsRecord?.hasError}
        {...getOverrideProps(overrides, "resolutionsRecord")}
      ></TextAreaField>
      <TextAreaField
        label="Custom meeting details"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title,
              date,
              type,
              status,
              minutes,
              attendanceRecord,
              resolutionsRecord,
              customMeetingDetails: value,
            };
            const result = onChange(modelFields);
            value = result?.customMeetingDetails ?? value;
          }
          if (errors.customMeetingDetails?.hasError) {
            runValidationTasks("customMeetingDetails", value);
          }
          setCustomMeetingDetails(value);
        }}
        onBlur={() =>
          runValidationTasks("customMeetingDetails", customMeetingDetails)
        }
        errorMessage={errors.customMeetingDetails?.errorMessage}
        hasError={errors.customMeetingDetails?.hasError}
        {...getOverrideProps(overrides, "customMeetingDetails")}
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
