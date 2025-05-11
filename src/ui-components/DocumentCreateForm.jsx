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
import { createDocument } from "../graphql/mutations";
const client = generateClient();
export default function DocumentCreateForm(props) {
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
    documentType: "",
    documentName: "",
    documentDescription: "",
    serialNumber: "",
    documentDate: "",
    s3Key: "",
    fileName: "",
    contentType: "",
  };
  const [documentType, setDocumentType] = React.useState(
    initialValues.documentType
  );
  const [documentName, setDocumentName] = React.useState(
    initialValues.documentName
  );
  const [documentDescription, setDocumentDescription] = React.useState(
    initialValues.documentDescription
  );
  const [serialNumber, setSerialNumber] = React.useState(
    initialValues.serialNumber
  );
  const [documentDate, setDocumentDate] = React.useState(
    initialValues.documentDate
  );
  const [s3Key, setS3Key] = React.useState(initialValues.s3Key);
  const [fileName, setFileName] = React.useState(initialValues.fileName);
  const [contentType, setContentType] = React.useState(
    initialValues.contentType
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setDocumentType(initialValues.documentType);
    setDocumentName(initialValues.documentName);
    setDocumentDescription(initialValues.documentDescription);
    setSerialNumber(initialValues.serialNumber);
    setDocumentDate(initialValues.documentDate);
    setS3Key(initialValues.s3Key);
    setFileName(initialValues.fileName);
    setContentType(initialValues.contentType);
    setErrors({});
  };
  const validations = {
    documentType: [],
    documentName: [],
    documentDescription: [],
    serialNumber: [],
    documentDate: [],
    s3Key: [],
    fileName: [],
    contentType: [],
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
          documentType,
          documentName,
          documentDescription,
          serialNumber,
          documentDate,
          s3Key,
          fileName,
          contentType,
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
            query: createDocument.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "DocumentCreateForm")}
      {...rest}
    >
      <TextField
        label="Document type"
        isRequired={false}
        isReadOnly={false}
        value={documentType}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              documentType: value,
              documentName,
              documentDescription,
              serialNumber,
              documentDate,
              s3Key,
              fileName,
              contentType,
            };
            const result = onChange(modelFields);
            value = result?.documentType ?? value;
          }
          if (errors.documentType?.hasError) {
            runValidationTasks("documentType", value);
          }
          setDocumentType(value);
        }}
        onBlur={() => runValidationTasks("documentType", documentType)}
        errorMessage={errors.documentType?.errorMessage}
        hasError={errors.documentType?.hasError}
        {...getOverrideProps(overrides, "documentType")}
      ></TextField>
      <TextField
        label="Document name"
        isRequired={false}
        isReadOnly={false}
        value={documentName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              documentType,
              documentName: value,
              documentDescription,
              serialNumber,
              documentDate,
              s3Key,
              fileName,
              contentType,
            };
            const result = onChange(modelFields);
            value = result?.documentName ?? value;
          }
          if (errors.documentName?.hasError) {
            runValidationTasks("documentName", value);
          }
          setDocumentName(value);
        }}
        onBlur={() => runValidationTasks("documentName", documentName)}
        errorMessage={errors.documentName?.errorMessage}
        hasError={errors.documentName?.hasError}
        {...getOverrideProps(overrides, "documentName")}
      ></TextField>
      <TextField
        label="Document description"
        isRequired={false}
        isReadOnly={false}
        value={documentDescription}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              documentType,
              documentName,
              documentDescription: value,
              serialNumber,
              documentDate,
              s3Key,
              fileName,
              contentType,
            };
            const result = onChange(modelFields);
            value = result?.documentDescription ?? value;
          }
          if (errors.documentDescription?.hasError) {
            runValidationTasks("documentDescription", value);
          }
          setDocumentDescription(value);
        }}
        onBlur={() =>
          runValidationTasks("documentDescription", documentDescription)
        }
        errorMessage={errors.documentDescription?.errorMessage}
        hasError={errors.documentDescription?.hasError}
        {...getOverrideProps(overrides, "documentDescription")}
      ></TextField>
      <TextField
        label="Serial number"
        isRequired={false}
        isReadOnly={false}
        value={serialNumber}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              documentType,
              documentName,
              documentDescription,
              serialNumber: value,
              documentDate,
              s3Key,
              fileName,
              contentType,
            };
            const result = onChange(modelFields);
            value = result?.serialNumber ?? value;
          }
          if (errors.serialNumber?.hasError) {
            runValidationTasks("serialNumber", value);
          }
          setSerialNumber(value);
        }}
        onBlur={() => runValidationTasks("serialNumber", serialNumber)}
        errorMessage={errors.serialNumber?.errorMessage}
        hasError={errors.serialNumber?.hasError}
        {...getOverrideProps(overrides, "serialNumber")}
      ></TextField>
      <TextField
        label="Document date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={documentDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              documentType,
              documentName,
              documentDescription,
              serialNumber,
              documentDate: value,
              s3Key,
              fileName,
              contentType,
            };
            const result = onChange(modelFields);
            value = result?.documentDate ?? value;
          }
          if (errors.documentDate?.hasError) {
            runValidationTasks("documentDate", value);
          }
          setDocumentDate(value);
        }}
        onBlur={() => runValidationTasks("documentDate", documentDate)}
        errorMessage={errors.documentDate?.errorMessage}
        hasError={errors.documentDate?.hasError}
        {...getOverrideProps(overrides, "documentDate")}
      ></TextField>
      <TextField
        label="S3 key"
        isRequired={false}
        isReadOnly={false}
        value={s3Key}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              documentType,
              documentName,
              documentDescription,
              serialNumber,
              documentDate,
              s3Key: value,
              fileName,
              contentType,
            };
            const result = onChange(modelFields);
            value = result?.s3Key ?? value;
          }
          if (errors.s3Key?.hasError) {
            runValidationTasks("s3Key", value);
          }
          setS3Key(value);
        }}
        onBlur={() => runValidationTasks("s3Key", s3Key)}
        errorMessage={errors.s3Key?.errorMessage}
        hasError={errors.s3Key?.hasError}
        {...getOverrideProps(overrides, "s3Key")}
      ></TextField>
      <TextField
        label="File name"
        isRequired={false}
        isReadOnly={false}
        value={fileName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              documentType,
              documentName,
              documentDescription,
              serialNumber,
              documentDate,
              s3Key,
              fileName: value,
              contentType,
            };
            const result = onChange(modelFields);
            value = result?.fileName ?? value;
          }
          if (errors.fileName?.hasError) {
            runValidationTasks("fileName", value);
          }
          setFileName(value);
        }}
        onBlur={() => runValidationTasks("fileName", fileName)}
        errorMessage={errors.fileName?.errorMessage}
        hasError={errors.fileName?.hasError}
        {...getOverrideProps(overrides, "fileName")}
      ></TextField>
      <TextField
        label="Content type"
        isRequired={false}
        isReadOnly={false}
        value={contentType}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              documentType,
              documentName,
              documentDescription,
              serialNumber,
              documentDate,
              s3Key,
              fileName,
              contentType: value,
            };
            const result = onChange(modelFields);
            value = result?.contentType ?? value;
          }
          if (errors.contentType?.hasError) {
            runValidationTasks("contentType", value);
          }
          setContentType(value);
        }}
        onBlur={() => runValidationTasks("contentType", contentType)}
        errorMessage={errors.contentType?.errorMessage}
        hasError={errors.contentType?.hasError}
        {...getOverrideProps(overrides, "contentType")}
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
