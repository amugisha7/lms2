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
import { createFinancialReport } from "../graphql/mutations";
const client = generateClient();
export default function FinancialReportCreateForm(props) {
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
    reportName: "",
    reportType: "",
    reportDate: "",
    startDate: "",
    endDate: "",
    reportData: "",
    status: "",
  };
  const [reportName, setReportName] = React.useState(initialValues.reportName);
  const [reportType, setReportType] = React.useState(initialValues.reportType);
  const [reportDate, setReportDate] = React.useState(initialValues.reportDate);
  const [startDate, setStartDate] = React.useState(initialValues.startDate);
  const [endDate, setEndDate] = React.useState(initialValues.endDate);
  const [reportData, setReportData] = React.useState(initialValues.reportData);
  const [status, setStatus] = React.useState(initialValues.status);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setReportName(initialValues.reportName);
    setReportType(initialValues.reportType);
    setReportDate(initialValues.reportDate);
    setStartDate(initialValues.startDate);
    setEndDate(initialValues.endDate);
    setReportData(initialValues.reportData);
    setStatus(initialValues.status);
    setErrors({});
  };
  const validations = {
    reportName: [],
    reportType: [],
    reportDate: [],
    startDate: [],
    endDate: [],
    reportData: [{ type: "JSON" }],
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
          reportName,
          reportType,
          reportDate,
          startDate,
          endDate,
          reportData,
          status,
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
            query: createFinancialReport.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "FinancialReportCreateForm")}
      {...rest}
    >
      <TextField
        label="Report name"
        isRequired={false}
        isReadOnly={false}
        value={reportName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              reportName: value,
              reportType,
              reportDate,
              startDate,
              endDate,
              reportData,
              status,
            };
            const result = onChange(modelFields);
            value = result?.reportName ?? value;
          }
          if (errors.reportName?.hasError) {
            runValidationTasks("reportName", value);
          }
          setReportName(value);
        }}
        onBlur={() => runValidationTasks("reportName", reportName)}
        errorMessage={errors.reportName?.errorMessage}
        hasError={errors.reportName?.hasError}
        {...getOverrideProps(overrides, "reportName")}
      ></TextField>
      <TextField
        label="Report type"
        isRequired={false}
        isReadOnly={false}
        value={reportType}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              reportName,
              reportType: value,
              reportDate,
              startDate,
              endDate,
              reportData,
              status,
            };
            const result = onChange(modelFields);
            value = result?.reportType ?? value;
          }
          if (errors.reportType?.hasError) {
            runValidationTasks("reportType", value);
          }
          setReportType(value);
        }}
        onBlur={() => runValidationTasks("reportType", reportType)}
        errorMessage={errors.reportType?.errorMessage}
        hasError={errors.reportType?.hasError}
        {...getOverrideProps(overrides, "reportType")}
      ></TextField>
      <TextField
        label="Report date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={reportDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              reportName,
              reportType,
              reportDate: value,
              startDate,
              endDate,
              reportData,
              status,
            };
            const result = onChange(modelFields);
            value = result?.reportDate ?? value;
          }
          if (errors.reportDate?.hasError) {
            runValidationTasks("reportDate", value);
          }
          setReportDate(value);
        }}
        onBlur={() => runValidationTasks("reportDate", reportDate)}
        errorMessage={errors.reportDate?.errorMessage}
        hasError={errors.reportDate?.hasError}
        {...getOverrideProps(overrides, "reportDate")}
      ></TextField>
      <TextField
        label="Start date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={startDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              reportName,
              reportType,
              reportDate,
              startDate: value,
              endDate,
              reportData,
              status,
            };
            const result = onChange(modelFields);
            value = result?.startDate ?? value;
          }
          if (errors.startDate?.hasError) {
            runValidationTasks("startDate", value);
          }
          setStartDate(value);
        }}
        onBlur={() => runValidationTasks("startDate", startDate)}
        errorMessage={errors.startDate?.errorMessage}
        hasError={errors.startDate?.hasError}
        {...getOverrideProps(overrides, "startDate")}
      ></TextField>
      <TextField
        label="End date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={endDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              reportName,
              reportType,
              reportDate,
              startDate,
              endDate: value,
              reportData,
              status,
            };
            const result = onChange(modelFields);
            value = result?.endDate ?? value;
          }
          if (errors.endDate?.hasError) {
            runValidationTasks("endDate", value);
          }
          setEndDate(value);
        }}
        onBlur={() => runValidationTasks("endDate", endDate)}
        errorMessage={errors.endDate?.errorMessage}
        hasError={errors.endDate?.hasError}
        {...getOverrideProps(overrides, "endDate")}
      ></TextField>
      <TextAreaField
        label="Report data"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              reportName,
              reportType,
              reportDate,
              startDate,
              endDate,
              reportData: value,
              status,
            };
            const result = onChange(modelFields);
            value = result?.reportData ?? value;
          }
          if (errors.reportData?.hasError) {
            runValidationTasks("reportData", value);
          }
          setReportData(value);
        }}
        onBlur={() => runValidationTasks("reportData", reportData)}
        errorMessage={errors.reportData?.errorMessage}
        hasError={errors.reportData?.hasError}
        {...getOverrideProps(overrides, "reportData")}
      ></TextAreaField>
      <TextField
        label="Status"
        isRequired={false}
        isReadOnly={false}
        value={status}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              reportName,
              reportType,
              reportDate,
              startDate,
              endDate,
              reportData,
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
