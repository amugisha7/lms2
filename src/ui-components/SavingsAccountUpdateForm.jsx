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
import { getSavingsAccount } from "../graphql/queries";
import { updateSavingsAccount } from "../graphql/mutations";
const client = generateClient();
export default function SavingsAccountUpdateForm(props) {
  const {
    id: idProp,
    savingsAccount: savingsAccountModelProp,
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
    const cleanValues = savingsAccountRecord
      ? { ...initialValues, ...savingsAccountRecord }
      : initialValues;
    setAccountNumber(cleanValues.accountNumber);
    setBalance(cleanValues.balance);
    setStatus(cleanValues.status);
    setLockedAmount(cleanValues.lockedAmount);
    setLockedForLoanID(cleanValues.lockedForLoanID);
    setCustomSavingsAccountDetails(
      typeof cleanValues.customSavingsAccountDetails === "string" ||
        cleanValues.customSavingsAccountDetails === null
        ? cleanValues.customSavingsAccountDetails
        : JSON.stringify(cleanValues.customSavingsAccountDetails)
    );
    setErrors({});
  };
  const [savingsAccountRecord, setSavingsAccountRecord] = React.useState(
    savingsAccountModelProp
  );
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getSavingsAccount.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getSavingsAccount
        : savingsAccountModelProp;
      setSavingsAccountRecord(record);
    };
    queryData();
  }, [idProp, savingsAccountModelProp]);
  React.useEffect(resetStateValues, [savingsAccountRecord]);
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
          accountNumber: accountNumber ?? null,
          balance: balance ?? null,
          status: status ?? null,
          lockedAmount: lockedAmount ?? null,
          lockedForLoanID: lockedForLoanID ?? null,
          customSavingsAccountDetails: customSavingsAccountDetails ?? null,
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
            query: updateSavingsAccount.replaceAll("__typename", ""),
            variables: {
              input: {
                id: savingsAccountRecord.id,
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
      {...getOverrideProps(overrides, "SavingsAccountUpdateForm")}
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
        value={customSavingsAccountDetails}
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
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || savingsAccountModelProp)}
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
              !(idProp || savingsAccountModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
