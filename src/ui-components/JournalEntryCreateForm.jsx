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
import { createJournalEntry } from "../graphql/mutations";
const client = generateClient();
export default function JournalEntryCreateForm(props) {
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
    date: "",
    description: "",
    reference: "",
    status: "",
    relatedLoanID: "",
    relatedPaymentID: "",
    relatedExpenseID: "",
    customJournalEntryDetails: "",
  };
  const [date, setDate] = React.useState(initialValues.date);
  const [description, setDescription] = React.useState(
    initialValues.description
  );
  const [reference, setReference] = React.useState(initialValues.reference);
  const [status, setStatus] = React.useState(initialValues.status);
  const [relatedLoanID, setRelatedLoanID] = React.useState(
    initialValues.relatedLoanID
  );
  const [relatedPaymentID, setRelatedPaymentID] = React.useState(
    initialValues.relatedPaymentID
  );
  const [relatedExpenseID, setRelatedExpenseID] = React.useState(
    initialValues.relatedExpenseID
  );
  const [customJournalEntryDetails, setCustomJournalEntryDetails] =
    React.useState(initialValues.customJournalEntryDetails);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setDate(initialValues.date);
    setDescription(initialValues.description);
    setReference(initialValues.reference);
    setStatus(initialValues.status);
    setRelatedLoanID(initialValues.relatedLoanID);
    setRelatedPaymentID(initialValues.relatedPaymentID);
    setRelatedExpenseID(initialValues.relatedExpenseID);
    setCustomJournalEntryDetails(initialValues.customJournalEntryDetails);
    setErrors({});
  };
  const validations = {
    date: [],
    description: [],
    reference: [],
    status: [],
    relatedLoanID: [],
    relatedPaymentID: [],
    relatedExpenseID: [],
    customJournalEntryDetails: [{ type: "JSON" }],
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
          date,
          description,
          reference,
          status,
          relatedLoanID,
          relatedPaymentID,
          relatedExpenseID,
          customJournalEntryDetails,
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
            query: createJournalEntry.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "JournalEntryCreateForm")}
      {...rest}
    >
      <TextField
        label="Date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={date}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              date: value,
              description,
              reference,
              status,
              relatedLoanID,
              relatedPaymentID,
              relatedExpenseID,
              customJournalEntryDetails,
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
        label="Description"
        isRequired={false}
        isReadOnly={false}
        value={description}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              date,
              description: value,
              reference,
              status,
              relatedLoanID,
              relatedPaymentID,
              relatedExpenseID,
              customJournalEntryDetails,
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
        label="Reference"
        isRequired={false}
        isReadOnly={false}
        value={reference}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              date,
              description,
              reference: value,
              status,
              relatedLoanID,
              relatedPaymentID,
              relatedExpenseID,
              customJournalEntryDetails,
            };
            const result = onChange(modelFields);
            value = result?.reference ?? value;
          }
          if (errors.reference?.hasError) {
            runValidationTasks("reference", value);
          }
          setReference(value);
        }}
        onBlur={() => runValidationTasks("reference", reference)}
        errorMessage={errors.reference?.errorMessage}
        hasError={errors.reference?.hasError}
        {...getOverrideProps(overrides, "reference")}
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
              date,
              description,
              reference,
              status: value,
              relatedLoanID,
              relatedPaymentID,
              relatedExpenseID,
              customJournalEntryDetails,
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
        label="Related loan id"
        isRequired={false}
        isReadOnly={false}
        value={relatedLoanID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              date,
              description,
              reference,
              status,
              relatedLoanID: value,
              relatedPaymentID,
              relatedExpenseID,
              customJournalEntryDetails,
            };
            const result = onChange(modelFields);
            value = result?.relatedLoanID ?? value;
          }
          if (errors.relatedLoanID?.hasError) {
            runValidationTasks("relatedLoanID", value);
          }
          setRelatedLoanID(value);
        }}
        onBlur={() => runValidationTasks("relatedLoanID", relatedLoanID)}
        errorMessage={errors.relatedLoanID?.errorMessage}
        hasError={errors.relatedLoanID?.hasError}
        {...getOverrideProps(overrides, "relatedLoanID")}
      ></TextField>
      <TextField
        label="Related payment id"
        isRequired={false}
        isReadOnly={false}
        value={relatedPaymentID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              date,
              description,
              reference,
              status,
              relatedLoanID,
              relatedPaymentID: value,
              relatedExpenseID,
              customJournalEntryDetails,
            };
            const result = onChange(modelFields);
            value = result?.relatedPaymentID ?? value;
          }
          if (errors.relatedPaymentID?.hasError) {
            runValidationTasks("relatedPaymentID", value);
          }
          setRelatedPaymentID(value);
        }}
        onBlur={() => runValidationTasks("relatedPaymentID", relatedPaymentID)}
        errorMessage={errors.relatedPaymentID?.errorMessage}
        hasError={errors.relatedPaymentID?.hasError}
        {...getOverrideProps(overrides, "relatedPaymentID")}
      ></TextField>
      <TextField
        label="Related expense id"
        isRequired={false}
        isReadOnly={false}
        value={relatedExpenseID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              date,
              description,
              reference,
              status,
              relatedLoanID,
              relatedPaymentID,
              relatedExpenseID: value,
              customJournalEntryDetails,
            };
            const result = onChange(modelFields);
            value = result?.relatedExpenseID ?? value;
          }
          if (errors.relatedExpenseID?.hasError) {
            runValidationTasks("relatedExpenseID", value);
          }
          setRelatedExpenseID(value);
        }}
        onBlur={() => runValidationTasks("relatedExpenseID", relatedExpenseID)}
        errorMessage={errors.relatedExpenseID?.errorMessage}
        hasError={errors.relatedExpenseID?.hasError}
        {...getOverrideProps(overrides, "relatedExpenseID")}
      ></TextField>
      <TextAreaField
        label="Custom journal entry details"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              date,
              description,
              reference,
              status,
              relatedLoanID,
              relatedPaymentID,
              relatedExpenseID,
              customJournalEntryDetails: value,
            };
            const result = onChange(modelFields);
            value = result?.customJournalEntryDetails ?? value;
          }
          if (errors.customJournalEntryDetails?.hasError) {
            runValidationTasks("customJournalEntryDetails", value);
          }
          setCustomJournalEntryDetails(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "customJournalEntryDetails",
            customJournalEntryDetails
          )
        }
        errorMessage={errors.customJournalEntryDetails?.errorMessage}
        hasError={errors.customJournalEntryDetails?.hasError}
        {...getOverrideProps(overrides, "customJournalEntryDetails")}
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
