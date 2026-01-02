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
import { createGroup } from "../graphql/mutations";
const client = generateClient();
export default function GroupCreateForm(props) {
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
    groupNumber: "",
    formationDate: "",
    meetingDay: "",
    meetingFrequency: "",
    chairpersonID: "",
    secretaryID: "",
    viceChairpersonID: "",
    treasurerID: "",
    status: "",
    customGroupDetails: "",
  };
  const [name, setName] = React.useState(initialValues.name);
  const [groupNumber, setGroupNumber] = React.useState(
    initialValues.groupNumber
  );
  const [formationDate, setFormationDate] = React.useState(
    initialValues.formationDate
  );
  const [meetingDay, setMeetingDay] = React.useState(initialValues.meetingDay);
  const [meetingFrequency, setMeetingFrequency] = React.useState(
    initialValues.meetingFrequency
  );
  const [chairpersonID, setChairpersonID] = React.useState(
    initialValues.chairpersonID
  );
  const [secretaryID, setSecretaryID] = React.useState(
    initialValues.secretaryID
  );
  const [viceChairpersonID, setViceChairpersonID] = React.useState(
    initialValues.viceChairpersonID
  );
  const [treasurerID, setTreasurerID] = React.useState(
    initialValues.treasurerID
  );
  const [status, setStatus] = React.useState(initialValues.status);
  const [customGroupDetails, setCustomGroupDetails] = React.useState(
    initialValues.customGroupDetails
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setName(initialValues.name);
    setGroupNumber(initialValues.groupNumber);
    setFormationDate(initialValues.formationDate);
    setMeetingDay(initialValues.meetingDay);
    setMeetingFrequency(initialValues.meetingFrequency);
    setChairpersonID(initialValues.chairpersonID);
    setSecretaryID(initialValues.secretaryID);
    setViceChairpersonID(initialValues.viceChairpersonID);
    setTreasurerID(initialValues.treasurerID);
    setStatus(initialValues.status);
    setCustomGroupDetails(initialValues.customGroupDetails);
    setErrors({});
  };
  const validations = {
    name: [],
    groupNumber: [],
    formationDate: [],
    meetingDay: [],
    meetingFrequency: [],
    chairpersonID: [],
    secretaryID: [],
    viceChairpersonID: [],
    treasurerID: [],
    status: [],
    customGroupDetails: [{ type: "JSON" }],
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
          groupNumber,
          formationDate,
          meetingDay,
          meetingFrequency,
          chairpersonID,
          secretaryID,
          viceChairpersonID,
          treasurerID,
          status,
          customGroupDetails,
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
            query: createGroup.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "GroupCreateForm")}
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
              groupNumber,
              formationDate,
              meetingDay,
              meetingFrequency,
              chairpersonID,
              secretaryID,
              viceChairpersonID,
              treasurerID,
              status,
              customGroupDetails,
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
        label="Group number"
        isRequired={false}
        isReadOnly={false}
        value={groupNumber}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              groupNumber: value,
              formationDate,
              meetingDay,
              meetingFrequency,
              chairpersonID,
              secretaryID,
              viceChairpersonID,
              treasurerID,
              status,
              customGroupDetails,
            };
            const result = onChange(modelFields);
            value = result?.groupNumber ?? value;
          }
          if (errors.groupNumber?.hasError) {
            runValidationTasks("groupNumber", value);
          }
          setGroupNumber(value);
        }}
        onBlur={() => runValidationTasks("groupNumber", groupNumber)}
        errorMessage={errors.groupNumber?.errorMessage}
        hasError={errors.groupNumber?.hasError}
        {...getOverrideProps(overrides, "groupNumber")}
      ></TextField>
      <TextField
        label="Formation date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={formationDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              groupNumber,
              formationDate: value,
              meetingDay,
              meetingFrequency,
              chairpersonID,
              secretaryID,
              viceChairpersonID,
              treasurerID,
              status,
              customGroupDetails,
            };
            const result = onChange(modelFields);
            value = result?.formationDate ?? value;
          }
          if (errors.formationDate?.hasError) {
            runValidationTasks("formationDate", value);
          }
          setFormationDate(value);
        }}
        onBlur={() => runValidationTasks("formationDate", formationDate)}
        errorMessage={errors.formationDate?.errorMessage}
        hasError={errors.formationDate?.hasError}
        {...getOverrideProps(overrides, "formationDate")}
      ></TextField>
      <TextField
        label="Meeting day"
        isRequired={false}
        isReadOnly={false}
        value={meetingDay}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              groupNumber,
              formationDate,
              meetingDay: value,
              meetingFrequency,
              chairpersonID,
              secretaryID,
              viceChairpersonID,
              treasurerID,
              status,
              customGroupDetails,
            };
            const result = onChange(modelFields);
            value = result?.meetingDay ?? value;
          }
          if (errors.meetingDay?.hasError) {
            runValidationTasks("meetingDay", value);
          }
          setMeetingDay(value);
        }}
        onBlur={() => runValidationTasks("meetingDay", meetingDay)}
        errorMessage={errors.meetingDay?.errorMessage}
        hasError={errors.meetingDay?.hasError}
        {...getOverrideProps(overrides, "meetingDay")}
      ></TextField>
      <TextField
        label="Meeting frequency"
        isRequired={false}
        isReadOnly={false}
        value={meetingFrequency}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              groupNumber,
              formationDate,
              meetingDay,
              meetingFrequency: value,
              chairpersonID,
              secretaryID,
              viceChairpersonID,
              treasurerID,
              status,
              customGroupDetails,
            };
            const result = onChange(modelFields);
            value = result?.meetingFrequency ?? value;
          }
          if (errors.meetingFrequency?.hasError) {
            runValidationTasks("meetingFrequency", value);
          }
          setMeetingFrequency(value);
        }}
        onBlur={() => runValidationTasks("meetingFrequency", meetingFrequency)}
        errorMessage={errors.meetingFrequency?.errorMessage}
        hasError={errors.meetingFrequency?.hasError}
        {...getOverrideProps(overrides, "meetingFrequency")}
      ></TextField>
      <TextField
        label="Chairperson id"
        isRequired={false}
        isReadOnly={false}
        value={chairpersonID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              groupNumber,
              formationDate,
              meetingDay,
              meetingFrequency,
              chairpersonID: value,
              secretaryID,
              viceChairpersonID,
              treasurerID,
              status,
              customGroupDetails,
            };
            const result = onChange(modelFields);
            value = result?.chairpersonID ?? value;
          }
          if (errors.chairpersonID?.hasError) {
            runValidationTasks("chairpersonID", value);
          }
          setChairpersonID(value);
        }}
        onBlur={() => runValidationTasks("chairpersonID", chairpersonID)}
        errorMessage={errors.chairpersonID?.errorMessage}
        hasError={errors.chairpersonID?.hasError}
        {...getOverrideProps(overrides, "chairpersonID")}
      ></TextField>
      <TextField
        label="Secretary id"
        isRequired={false}
        isReadOnly={false}
        value={secretaryID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              groupNumber,
              formationDate,
              meetingDay,
              meetingFrequency,
              chairpersonID,
              secretaryID: value,
              viceChairpersonID,
              treasurerID,
              status,
              customGroupDetails,
            };
            const result = onChange(modelFields);
            value = result?.secretaryID ?? value;
          }
          if (errors.secretaryID?.hasError) {
            runValidationTasks("secretaryID", value);
          }
          setSecretaryID(value);
        }}
        onBlur={() => runValidationTasks("secretaryID", secretaryID)}
        errorMessage={errors.secretaryID?.errorMessage}
        hasError={errors.secretaryID?.hasError}
        {...getOverrideProps(overrides, "secretaryID")}
      ></TextField>
      <TextField
        label="Vice chairperson id"
        isRequired={false}
        isReadOnly={false}
        value={viceChairpersonID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              groupNumber,
              formationDate,
              meetingDay,
              meetingFrequency,
              chairpersonID,
              secretaryID,
              viceChairpersonID: value,
              treasurerID,
              status,
              customGroupDetails,
            };
            const result = onChange(modelFields);
            value = result?.viceChairpersonID ?? value;
          }
          if (errors.viceChairpersonID?.hasError) {
            runValidationTasks("viceChairpersonID", value);
          }
          setViceChairpersonID(value);
        }}
        onBlur={() =>
          runValidationTasks("viceChairpersonID", viceChairpersonID)
        }
        errorMessage={errors.viceChairpersonID?.errorMessage}
        hasError={errors.viceChairpersonID?.hasError}
        {...getOverrideProps(overrides, "viceChairpersonID")}
      ></TextField>
      <TextField
        label="Treasurer id"
        isRequired={false}
        isReadOnly={false}
        value={treasurerID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              groupNumber,
              formationDate,
              meetingDay,
              meetingFrequency,
              chairpersonID,
              secretaryID,
              viceChairpersonID,
              treasurerID: value,
              status,
              customGroupDetails,
            };
            const result = onChange(modelFields);
            value = result?.treasurerID ?? value;
          }
          if (errors.treasurerID?.hasError) {
            runValidationTasks("treasurerID", value);
          }
          setTreasurerID(value);
        }}
        onBlur={() => runValidationTasks("treasurerID", treasurerID)}
        errorMessage={errors.treasurerID?.errorMessage}
        hasError={errors.treasurerID?.hasError}
        {...getOverrideProps(overrides, "treasurerID")}
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
              groupNumber,
              formationDate,
              meetingDay,
              meetingFrequency,
              chairpersonID,
              secretaryID,
              viceChairpersonID,
              treasurerID,
              status: value,
              customGroupDetails,
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
        label="Custom group details"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              groupNumber,
              formationDate,
              meetingDay,
              meetingFrequency,
              chairpersonID,
              secretaryID,
              viceChairpersonID,
              treasurerID,
              status,
              customGroupDetails: value,
            };
            const result = onChange(modelFields);
            value = result?.customGroupDetails ?? value;
          }
          if (errors.customGroupDetails?.hasError) {
            runValidationTasks("customGroupDetails", value);
          }
          setCustomGroupDetails(value);
        }}
        onBlur={() =>
          runValidationTasks("customGroupDetails", customGroupDetails)
        }
        errorMessage={errors.customGroupDetails?.errorMessage}
        hasError={errors.customGroupDetails?.hasError}
        {...getOverrideProps(overrides, "customGroupDetails")}
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
