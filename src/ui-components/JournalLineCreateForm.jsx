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
import { createJournalLine } from "../graphql/mutations";
const client = generateClient();
export default function JournalLineCreateForm(props) {
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
    debit: "",
    credit: "",
    description: "",
    customJournalLineDetails: "",
  };
  const [debit, setDebit] = React.useState(initialValues.debit);
  const [credit, setCredit] = React.useState(initialValues.credit);
  const [description, setDescription] = React.useState(
    initialValues.description
  );
  const [customJournalLineDetails, setCustomJournalLineDetails] =
    React.useState(initialValues.customJournalLineDetails);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setDebit(initialValues.debit);
    setCredit(initialValues.credit);
    setDescription(initialValues.description);
    setCustomJournalLineDetails(initialValues.customJournalLineDetails);
    setErrors({});
  };
  const validations = {
    debit: [],
    credit: [],
    description: [],
    customJournalLineDetails: [{ type: "JSON" }],
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
          debit,
          credit,
          description,
          customJournalLineDetails,
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
            query: createJournalLine.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "JournalLineCreateForm")}
      {...rest}
    >
      <TextField
        label="Debit"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={debit}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              debit: value,
              credit,
              description,
              customJournalLineDetails,
            };
            const result = onChange(modelFields);
            value = result?.debit ?? value;
          }
          if (errors.debit?.hasError) {
            runValidationTasks("debit", value);
          }
          setDebit(value);
        }}
        onBlur={() => runValidationTasks("debit", debit)}
        errorMessage={errors.debit?.errorMessage}
        hasError={errors.debit?.hasError}
        {...getOverrideProps(overrides, "debit")}
      ></TextField>
      <TextField
        label="Credit"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={credit}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              debit,
              credit: value,
              description,
              customJournalLineDetails,
            };
            const result = onChange(modelFields);
            value = result?.credit ?? value;
          }
          if (errors.credit?.hasError) {
            runValidationTasks("credit", value);
          }
          setCredit(value);
        }}
        onBlur={() => runValidationTasks("credit", credit)}
        errorMessage={errors.credit?.errorMessage}
        hasError={errors.credit?.hasError}
        {...getOverrideProps(overrides, "credit")}
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
              debit,
              credit,
              description: value,
              customJournalLineDetails,
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
      <TextAreaField
        label="Custom journal line details"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              debit,
              credit,
              description,
              customJournalLineDetails: value,
            };
            const result = onChange(modelFields);
            value = result?.customJournalLineDetails ?? value;
          }
          if (errors.customJournalLineDetails?.hasError) {
            runValidationTasks("customJournalLineDetails", value);
          }
          setCustomJournalLineDetails(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "customJournalLineDetails",
            customJournalLineDetails
          )
        }
        errorMessage={errors.customJournalLineDetails?.errorMessage}
        hasError={errors.customJournalLineDetails?.hasError}
        {...getOverrideProps(overrides, "customJournalLineDetails")}
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
