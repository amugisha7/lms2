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
  SwitchField,
  TextAreaField,
  TextField,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { createCustomFormField } from "../graphql/mutations";
const client = generateClient();
export default function CustomFormFieldCreateForm(props) {
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
    formKey: "",
    label: "",
    fieldType: "",
    options: "",
    required: false,
    order: "",
    createdBy: "",
  };
  const [formKey, setFormKey] = React.useState(initialValues.formKey);
  const [label, setLabel] = React.useState(initialValues.label);
  const [fieldType, setFieldType] = React.useState(initialValues.fieldType);
  const [options, setOptions] = React.useState(initialValues.options);
  const [required, setRequired] = React.useState(initialValues.required);
  const [order, setOrder] = React.useState(initialValues.order);
  const [createdBy, setCreatedBy] = React.useState(initialValues.createdBy);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setFormKey(initialValues.formKey);
    setLabel(initialValues.label);
    setFieldType(initialValues.fieldType);
    setOptions(initialValues.options);
    setRequired(initialValues.required);
    setOrder(initialValues.order);
    setCreatedBy(initialValues.createdBy);
    setErrors({});
  };
  const validations = {
    formKey: [],
    label: [],
    fieldType: [],
    options: [{ type: "JSON" }],
    required: [],
    order: [],
    createdBy: [],
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
          formKey,
          label,
          fieldType,
          options,
          required,
          order,
          createdBy,
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
            query: createCustomFormField.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "CustomFormFieldCreateForm")}
      {...rest}
    >
      <TextField
        label="Form key"
        isRequired={false}
        isReadOnly={false}
        value={formKey}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              formKey: value,
              label,
              fieldType,
              options,
              required,
              order,
              createdBy,
            };
            const result = onChange(modelFields);
            value = result?.formKey ?? value;
          }
          if (errors.formKey?.hasError) {
            runValidationTasks("formKey", value);
          }
          setFormKey(value);
        }}
        onBlur={() => runValidationTasks("formKey", formKey)}
        errorMessage={errors.formKey?.errorMessage}
        hasError={errors.formKey?.hasError}
        {...getOverrideProps(overrides, "formKey")}
      ></TextField>
      <TextField
        label="Label"
        isRequired={false}
        isReadOnly={false}
        value={label}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              formKey,
              label: value,
              fieldType,
              options,
              required,
              order,
              createdBy,
            };
            const result = onChange(modelFields);
            value = result?.label ?? value;
          }
          if (errors.label?.hasError) {
            runValidationTasks("label", value);
          }
          setLabel(value);
        }}
        onBlur={() => runValidationTasks("label", label)}
        errorMessage={errors.label?.errorMessage}
        hasError={errors.label?.hasError}
        {...getOverrideProps(overrides, "label")}
      ></TextField>
      <TextField
        label="Field type"
        isRequired={false}
        isReadOnly={false}
        value={fieldType}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              formKey,
              label,
              fieldType: value,
              options,
              required,
              order,
              createdBy,
            };
            const result = onChange(modelFields);
            value = result?.fieldType ?? value;
          }
          if (errors.fieldType?.hasError) {
            runValidationTasks("fieldType", value);
          }
          setFieldType(value);
        }}
        onBlur={() => runValidationTasks("fieldType", fieldType)}
        errorMessage={errors.fieldType?.errorMessage}
        hasError={errors.fieldType?.hasError}
        {...getOverrideProps(overrides, "fieldType")}
      ></TextField>
      <TextAreaField
        label="Options"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              formKey,
              label,
              fieldType,
              options: value,
              required,
              order,
              createdBy,
            };
            const result = onChange(modelFields);
            value = result?.options ?? value;
          }
          if (errors.options?.hasError) {
            runValidationTasks("options", value);
          }
          setOptions(value);
        }}
        onBlur={() => runValidationTasks("options", options)}
        errorMessage={errors.options?.errorMessage}
        hasError={errors.options?.hasError}
        {...getOverrideProps(overrides, "options")}
      ></TextAreaField>
      <SwitchField
        label="Required"
        defaultChecked={false}
        isDisabled={false}
        isChecked={required}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              formKey,
              label,
              fieldType,
              options,
              required: value,
              order,
              createdBy,
            };
            const result = onChange(modelFields);
            value = result?.required ?? value;
          }
          if (errors.required?.hasError) {
            runValidationTasks("required", value);
          }
          setRequired(value);
        }}
        onBlur={() => runValidationTasks("required", required)}
        errorMessage={errors.required?.errorMessage}
        hasError={errors.required?.hasError}
        {...getOverrideProps(overrides, "required")}
      ></SwitchField>
      <TextField
        label="Order"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={order}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              formKey,
              label,
              fieldType,
              options,
              required,
              order: value,
              createdBy,
            };
            const result = onChange(modelFields);
            value = result?.order ?? value;
          }
          if (errors.order?.hasError) {
            runValidationTasks("order", value);
          }
          setOrder(value);
        }}
        onBlur={() => runValidationTasks("order", order)}
        errorMessage={errors.order?.errorMessage}
        hasError={errors.order?.hasError}
        {...getOverrideProps(overrides, "order")}
      ></TextField>
      <TextField
        label="Created by"
        isRequired={false}
        isReadOnly={false}
        value={createdBy}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              formKey,
              label,
              fieldType,
              options,
              required,
              order,
              createdBy: value,
            };
            const result = onChange(modelFields);
            value = result?.createdBy ?? value;
          }
          if (errors.createdBy?.hasError) {
            runValidationTasks("createdBy", value);
          }
          setCreatedBy(value);
        }}
        onBlur={() => runValidationTasks("createdBy", createdBy)}
        errorMessage={errors.createdBy?.errorMessage}
        hasError={errors.createdBy?.hasError}
        {...getOverrideProps(overrides, "createdBy")}
      ></TextField>
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
