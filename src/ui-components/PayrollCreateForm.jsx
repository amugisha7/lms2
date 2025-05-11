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
import { createPayroll } from "../graphql/mutations";
const client = generateClient();
export default function PayrollCreateForm(props) {
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
    periodStartDate: "",
    periodEndDate: "",
    payDate: "",
    status: "",
    processedByUserID: "",
    totalGrossPay: "",
    totalLoanDeductions: "",
    totalSavingsDeductions: "",
    totalShareDeductions: "",
    totalNetPay: "",
    details: "",
  };
  const [periodStartDate, setPeriodStartDate] = React.useState(
    initialValues.periodStartDate
  );
  const [periodEndDate, setPeriodEndDate] = React.useState(
    initialValues.periodEndDate
  );
  const [payDate, setPayDate] = React.useState(initialValues.payDate);
  const [status, setStatus] = React.useState(initialValues.status);
  const [processedByUserID, setProcessedByUserID] = React.useState(
    initialValues.processedByUserID
  );
  const [totalGrossPay, setTotalGrossPay] = React.useState(
    initialValues.totalGrossPay
  );
  const [totalLoanDeductions, setTotalLoanDeductions] = React.useState(
    initialValues.totalLoanDeductions
  );
  const [totalSavingsDeductions, setTotalSavingsDeductions] = React.useState(
    initialValues.totalSavingsDeductions
  );
  const [totalShareDeductions, setTotalShareDeductions] = React.useState(
    initialValues.totalShareDeductions
  );
  const [totalNetPay, setTotalNetPay] = React.useState(
    initialValues.totalNetPay
  );
  const [details, setDetails] = React.useState(initialValues.details);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setPeriodStartDate(initialValues.periodStartDate);
    setPeriodEndDate(initialValues.periodEndDate);
    setPayDate(initialValues.payDate);
    setStatus(initialValues.status);
    setProcessedByUserID(initialValues.processedByUserID);
    setTotalGrossPay(initialValues.totalGrossPay);
    setTotalLoanDeductions(initialValues.totalLoanDeductions);
    setTotalSavingsDeductions(initialValues.totalSavingsDeductions);
    setTotalShareDeductions(initialValues.totalShareDeductions);
    setTotalNetPay(initialValues.totalNetPay);
    setDetails(initialValues.details);
    setErrors({});
  };
  const validations = {
    periodStartDate: [],
    periodEndDate: [],
    payDate: [],
    status: [],
    processedByUserID: [],
    totalGrossPay: [],
    totalLoanDeductions: [],
    totalSavingsDeductions: [],
    totalShareDeductions: [],
    totalNetPay: [],
    details: [],
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
          periodStartDate,
          periodEndDate,
          payDate,
          status,
          processedByUserID,
          totalGrossPay,
          totalLoanDeductions,
          totalSavingsDeductions,
          totalShareDeductions,
          totalNetPay,
          details,
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
            query: createPayroll.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "PayrollCreateForm")}
      {...rest}
    >
      <TextField
        label="Period start date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={periodStartDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              periodStartDate: value,
              periodEndDate,
              payDate,
              status,
              processedByUserID,
              totalGrossPay,
              totalLoanDeductions,
              totalSavingsDeductions,
              totalShareDeductions,
              totalNetPay,
              details,
            };
            const result = onChange(modelFields);
            value = result?.periodStartDate ?? value;
          }
          if (errors.periodStartDate?.hasError) {
            runValidationTasks("periodStartDate", value);
          }
          setPeriodStartDate(value);
        }}
        onBlur={() => runValidationTasks("periodStartDate", periodStartDate)}
        errorMessage={errors.periodStartDate?.errorMessage}
        hasError={errors.periodStartDate?.hasError}
        {...getOverrideProps(overrides, "periodStartDate")}
      ></TextField>
      <TextField
        label="Period end date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={periodEndDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              periodStartDate,
              periodEndDate: value,
              payDate,
              status,
              processedByUserID,
              totalGrossPay,
              totalLoanDeductions,
              totalSavingsDeductions,
              totalShareDeductions,
              totalNetPay,
              details,
            };
            const result = onChange(modelFields);
            value = result?.periodEndDate ?? value;
          }
          if (errors.periodEndDate?.hasError) {
            runValidationTasks("periodEndDate", value);
          }
          setPeriodEndDate(value);
        }}
        onBlur={() => runValidationTasks("periodEndDate", periodEndDate)}
        errorMessage={errors.periodEndDate?.errorMessage}
        hasError={errors.periodEndDate?.hasError}
        {...getOverrideProps(overrides, "periodEndDate")}
      ></TextField>
      <TextField
        label="Pay date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={payDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              periodStartDate,
              periodEndDate,
              payDate: value,
              status,
              processedByUserID,
              totalGrossPay,
              totalLoanDeductions,
              totalSavingsDeductions,
              totalShareDeductions,
              totalNetPay,
              details,
            };
            const result = onChange(modelFields);
            value = result?.payDate ?? value;
          }
          if (errors.payDate?.hasError) {
            runValidationTasks("payDate", value);
          }
          setPayDate(value);
        }}
        onBlur={() => runValidationTasks("payDate", payDate)}
        errorMessage={errors.payDate?.errorMessage}
        hasError={errors.payDate?.hasError}
        {...getOverrideProps(overrides, "payDate")}
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
              periodStartDate,
              periodEndDate,
              payDate,
              status: value,
              processedByUserID,
              totalGrossPay,
              totalLoanDeductions,
              totalSavingsDeductions,
              totalShareDeductions,
              totalNetPay,
              details,
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
        label="Processed by user id"
        isRequired={false}
        isReadOnly={false}
        value={processedByUserID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              periodStartDate,
              periodEndDate,
              payDate,
              status,
              processedByUserID: value,
              totalGrossPay,
              totalLoanDeductions,
              totalSavingsDeductions,
              totalShareDeductions,
              totalNetPay,
              details,
            };
            const result = onChange(modelFields);
            value = result?.processedByUserID ?? value;
          }
          if (errors.processedByUserID?.hasError) {
            runValidationTasks("processedByUserID", value);
          }
          setProcessedByUserID(value);
        }}
        onBlur={() =>
          runValidationTasks("processedByUserID", processedByUserID)
        }
        errorMessage={errors.processedByUserID?.errorMessage}
        hasError={errors.processedByUserID?.hasError}
        {...getOverrideProps(overrides, "processedByUserID")}
      ></TextField>
      <TextField
        label="Total gross pay"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={totalGrossPay}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              periodStartDate,
              periodEndDate,
              payDate,
              status,
              processedByUserID,
              totalGrossPay: value,
              totalLoanDeductions,
              totalSavingsDeductions,
              totalShareDeductions,
              totalNetPay,
              details,
            };
            const result = onChange(modelFields);
            value = result?.totalGrossPay ?? value;
          }
          if (errors.totalGrossPay?.hasError) {
            runValidationTasks("totalGrossPay", value);
          }
          setTotalGrossPay(value);
        }}
        onBlur={() => runValidationTasks("totalGrossPay", totalGrossPay)}
        errorMessage={errors.totalGrossPay?.errorMessage}
        hasError={errors.totalGrossPay?.hasError}
        {...getOverrideProps(overrides, "totalGrossPay")}
      ></TextField>
      <TextField
        label="Total loan deductions"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={totalLoanDeductions}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              periodStartDate,
              periodEndDate,
              payDate,
              status,
              processedByUserID,
              totalGrossPay,
              totalLoanDeductions: value,
              totalSavingsDeductions,
              totalShareDeductions,
              totalNetPay,
              details,
            };
            const result = onChange(modelFields);
            value = result?.totalLoanDeductions ?? value;
          }
          if (errors.totalLoanDeductions?.hasError) {
            runValidationTasks("totalLoanDeductions", value);
          }
          setTotalLoanDeductions(value);
        }}
        onBlur={() =>
          runValidationTasks("totalLoanDeductions", totalLoanDeductions)
        }
        errorMessage={errors.totalLoanDeductions?.errorMessage}
        hasError={errors.totalLoanDeductions?.hasError}
        {...getOverrideProps(overrides, "totalLoanDeductions")}
      ></TextField>
      <TextField
        label="Total savings deductions"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={totalSavingsDeductions}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              periodStartDate,
              periodEndDate,
              payDate,
              status,
              processedByUserID,
              totalGrossPay,
              totalLoanDeductions,
              totalSavingsDeductions: value,
              totalShareDeductions,
              totalNetPay,
              details,
            };
            const result = onChange(modelFields);
            value = result?.totalSavingsDeductions ?? value;
          }
          if (errors.totalSavingsDeductions?.hasError) {
            runValidationTasks("totalSavingsDeductions", value);
          }
          setTotalSavingsDeductions(value);
        }}
        onBlur={() =>
          runValidationTasks("totalSavingsDeductions", totalSavingsDeductions)
        }
        errorMessage={errors.totalSavingsDeductions?.errorMessage}
        hasError={errors.totalSavingsDeductions?.hasError}
        {...getOverrideProps(overrides, "totalSavingsDeductions")}
      ></TextField>
      <TextField
        label="Total share deductions"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={totalShareDeductions}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              periodStartDate,
              periodEndDate,
              payDate,
              status,
              processedByUserID,
              totalGrossPay,
              totalLoanDeductions,
              totalSavingsDeductions,
              totalShareDeductions: value,
              totalNetPay,
              details,
            };
            const result = onChange(modelFields);
            value = result?.totalShareDeductions ?? value;
          }
          if (errors.totalShareDeductions?.hasError) {
            runValidationTasks("totalShareDeductions", value);
          }
          setTotalShareDeductions(value);
        }}
        onBlur={() =>
          runValidationTasks("totalShareDeductions", totalShareDeductions)
        }
        errorMessage={errors.totalShareDeductions?.errorMessage}
        hasError={errors.totalShareDeductions?.hasError}
        {...getOverrideProps(overrides, "totalShareDeductions")}
      ></TextField>
      <TextField
        label="Total net pay"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={totalNetPay}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              periodStartDate,
              periodEndDate,
              payDate,
              status,
              processedByUserID,
              totalGrossPay,
              totalLoanDeductions,
              totalSavingsDeductions,
              totalShareDeductions,
              totalNetPay: value,
              details,
            };
            const result = onChange(modelFields);
            value = result?.totalNetPay ?? value;
          }
          if (errors.totalNetPay?.hasError) {
            runValidationTasks("totalNetPay", value);
          }
          setTotalNetPay(value);
        }}
        onBlur={() => runValidationTasks("totalNetPay", totalNetPay)}
        errorMessage={errors.totalNetPay?.errorMessage}
        hasError={errors.totalNetPay?.hasError}
        {...getOverrideProps(overrides, "totalNetPay")}
      ></TextField>
      <TextField
        label="Details"
        isRequired={false}
        isReadOnly={false}
        value={details}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              periodStartDate,
              periodEndDate,
              payDate,
              status,
              processedByUserID,
              totalGrossPay,
              totalLoanDeductions,
              totalSavingsDeductions,
              totalShareDeductions,
              totalNetPay,
              details: value,
            };
            const result = onChange(modelFields);
            value = result?.details ?? value;
          }
          if (errors.details?.hasError) {
            runValidationTasks("details", value);
          }
          setDetails(value);
        }}
        onBlur={() => runValidationTasks("details", details)}
        errorMessage={errors.details?.errorMessage}
        hasError={errors.details?.hasError}
        {...getOverrideProps(overrides, "details")}
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
