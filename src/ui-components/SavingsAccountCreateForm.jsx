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
import { createSavingsAccount } from "../graphql/mutations";
const client = generateClient();
export default function SavingsAccountCreateForm(props) {
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
    accountNumber: "",
    balance: "",
    status: "",
    lockedAmount: "",
    lockedForLoanID: "",
    customSavingsAccountDetails: "",
  };
  const [accountNumber, setAccountNumber] = React.useState(
    initialValues.accountNumber
  );
  const [balance, setBalance] = React.useState(initialValues.balance);
  const [status, setStatus] = React.useState(initialValues.status);
  const [lockedAmount, setLockedAmount] = React.useState(
    initialValues.lockedAmount
  );
  const [lockedForLoanID, setLockedForLoanID] = React.useState(
    initialValues.lockedForLoanID
  );
  const [customSavingsAccountDetails, setCustomSavingsAccountDetails] =
    React.useState(initialValues.customSavingsAccountDetails);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setAccountNumber(initialValues.accountNumber);
    setBalance(initialValues.balance);
    setStatus(initialValues.status);
    setLockedAmount(initialValues.lockedAmount);
    setLockedForLoanID(initialValues.lockedForLoanID);
    setCustomSavingsAccountDetails(initialValues.customSavingsAccountDetails);
    setErrors({});
  };
  const validations = {
    accountNumber: [],
    balance: [],
    status: [],
    lockedAmount: [],
    lockedForLoanID: [],
    customSavingsAccountDetails: [{ type: "JSON" }],
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
          accountNumber,
          balance,
          status,
          lockedAmount,
          lockedForLoanID,
          customSavingsAccountDetails,
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
            query: createSavingsAccount.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "SavingsAccountCreateForm")}
      {...rest}
    >
      <TextField
        label="Account number"
        isRequired={false}
        isReadOnly={false}
        value={accountNumber}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              accountNumber: value,
              balance,
              status,
              lockedAmount,
              lockedForLoanID,
              customSavingsAccountDetails,
            };
            const result = onChange(modelFields);
            value = result?.accountNumber ?? value;
          }
          if (errors.accountNumber?.hasError) {
            runValidationTasks("accountNumber", value);
          }
          setAccountNumber(value);
        }}
        onBlur={() => runValidationTasks("accountNumber", accountNumber)}
        errorMessage={errors.accountNumber?.errorMessage}
        hasError={errors.accountNumber?.hasError}
        {...getOverrideProps(overrides, "accountNumber")}
      ></TextField>
      <TextField
        label="Balance"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={balance}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              accountNumber,
              balance: value,
              status,
              lockedAmount,
              lockedForLoanID,
              customSavingsAccountDetails,
            };
            const result = onChange(modelFields);
            value = result?.balance ?? value;
          }
          if (errors.balance?.hasError) {
            runValidationTasks("balance", value);
          }
          setBalance(value);
        }}
        onBlur={() => runValidationTasks("balance", balance)}
        errorMessage={errors.balance?.errorMessage}
        hasError={errors.balance?.hasError}
        {...getOverrideProps(overrides, "balance")}
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
              accountNumber,
              balance,
              status: value,
              lockedAmount,
              lockedForLoanID,
              customSavingsAccountDetails,
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
        label="Locked amount"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={lockedAmount}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              accountNumber,
              balance,
              status,
              lockedAmount: value,
              lockedForLoanID,
              customSavingsAccountDetails,
            };
            const result = onChange(modelFields);
            value = result?.lockedAmount ?? value;
          }
          if (errors.lockedAmount?.hasError) {
            runValidationTasks("lockedAmount", value);
          }
          setLockedAmount(value);
        }}
        onBlur={() => runValidationTasks("lockedAmount", lockedAmount)}
        errorMessage={errors.lockedAmount?.errorMessage}
        hasError={errors.lockedAmount?.hasError}
        {...getOverrideProps(overrides, "lockedAmount")}
      ></TextField>
      <TextField
        label="Locked for loan id"
        isRequired={false}
        isReadOnly={false}
        value={lockedForLoanID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              accountNumber,
              balance,
              status,
              lockedAmount,
              lockedForLoanID: value,
              customSavingsAccountDetails,
            };
            const result = onChange(modelFields);
            value = result?.lockedForLoanID ?? value;
          }
          if (errors.lockedForLoanID?.hasError) {
            runValidationTasks("lockedForLoanID", value);
          }
          setLockedForLoanID(value);
        }}
        onBlur={() => runValidationTasks("lockedForLoanID", lockedForLoanID)}
        errorMessage={errors.lockedForLoanID?.errorMessage}
        hasError={errors.lockedForLoanID?.hasError}
        {...getOverrideProps(overrides, "lockedForLoanID")}
      ></TextField>
      <TextAreaField
        label="Custom savings account details"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              accountNumber,
              balance,
              status,
              lockedAmount,
              lockedForLoanID,
              customSavingsAccountDetails: value,
            };
            const result = onChange(modelFields);
            value = result?.customSavingsAccountDetails ?? value;
          }
          if (errors.customSavingsAccountDetails?.hasError) {
            runValidationTasks("customSavingsAccountDetails", value);
          }
          setCustomSavingsAccountDetails(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "customSavingsAccountDetails",
            customSavingsAccountDetails
          )
        }
        errorMessage={errors.customSavingsAccountDetails?.errorMessage}
        hasError={errors.customSavingsAccountDetails?.hasError}
        {...getOverrideProps(overrides, "customSavingsAccountDetails")}
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
