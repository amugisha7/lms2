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
import { createAccount } from "../graphql/mutations";
const client = generateClient();
export default function AccountCreateForm(props) {
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
    accountType: "",
    accountNumber: "",
    description: "",
    currency: "",
    currentBalance: "",
    openingBalance: "",
    interestRate: "",
    interestCalculationMethod: "",
    interestPostingFrequency: "",
    interestPostingDate: "",
    interestAccrued: "",
    interestAccruedDate: "",
    accountStatus: "",
  };
  const [name, setName] = React.useState(initialValues.name);
  const [accountType, setAccountType] = React.useState(
    initialValues.accountType
  );
  const [accountNumber, setAccountNumber] = React.useState(
    initialValues.accountNumber
  );
  const [description, setDescription] = React.useState(
    initialValues.description
  );
  const [currency, setCurrency] = React.useState(initialValues.currency);
  const [currentBalance, setCurrentBalance] = React.useState(
    initialValues.currentBalance
  );
  const [openingBalance, setOpeningBalance] = React.useState(
    initialValues.openingBalance
  );
  const [interestRate, setInterestRate] = React.useState(
    initialValues.interestRate
  );
  const [interestCalculationMethod, setInterestCalculationMethod] =
    React.useState(initialValues.interestCalculationMethod);
  const [interestPostingFrequency, setInterestPostingFrequency] =
    React.useState(initialValues.interestPostingFrequency);
  const [interestPostingDate, setInterestPostingDate] = React.useState(
    initialValues.interestPostingDate
  );
  const [interestAccrued, setInterestAccrued] = React.useState(
    initialValues.interestAccrued
  );
  const [interestAccruedDate, setInterestAccruedDate] = React.useState(
    initialValues.interestAccruedDate
  );
  const [accountStatus, setAccountStatus] = React.useState(
    initialValues.accountStatus
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setName(initialValues.name);
    setAccountType(initialValues.accountType);
    setAccountNumber(initialValues.accountNumber);
    setDescription(initialValues.description);
    setCurrency(initialValues.currency);
    setCurrentBalance(initialValues.currentBalance);
    setOpeningBalance(initialValues.openingBalance);
    setInterestRate(initialValues.interestRate);
    setInterestCalculationMethod(initialValues.interestCalculationMethod);
    setInterestPostingFrequency(initialValues.interestPostingFrequency);
    setInterestPostingDate(initialValues.interestPostingDate);
    setInterestAccrued(initialValues.interestAccrued);
    setInterestAccruedDate(initialValues.interestAccruedDate);
    setAccountStatus(initialValues.accountStatus);
    setErrors({});
  };
  const validations = {
    name: [],
    accountType: [],
    accountNumber: [],
    description: [],
    currency: [],
    currentBalance: [],
    openingBalance: [],
    interestRate: [],
    interestCalculationMethod: [],
    interestPostingFrequency: [],
    interestPostingDate: [],
    interestAccrued: [],
    interestAccruedDate: [],
    accountStatus: [],
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
          accountType,
          accountNumber,
          description,
          currency,
          currentBalance,
          openingBalance,
          interestRate,
          interestCalculationMethod,
          interestPostingFrequency,
          interestPostingDate,
          interestAccrued,
          interestAccruedDate,
          accountStatus,
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
            query: createAccount.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "AccountCreateForm")}
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
              accountType,
              accountNumber,
              description,
              currency,
              currentBalance,
              openingBalance,
              interestRate,
              interestCalculationMethod,
              interestPostingFrequency,
              interestPostingDate,
              interestAccrued,
              interestAccruedDate,
              accountStatus,
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
        label="Account type"
        isRequired={false}
        isReadOnly={false}
        value={accountType}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              accountType: value,
              accountNumber,
              description,
              currency,
              currentBalance,
              openingBalance,
              interestRate,
              interestCalculationMethod,
              interestPostingFrequency,
              interestPostingDate,
              interestAccrued,
              interestAccruedDate,
              accountStatus,
            };
            const result = onChange(modelFields);
            value = result?.accountType ?? value;
          }
          if (errors.accountType?.hasError) {
            runValidationTasks("accountType", value);
          }
          setAccountType(value);
        }}
        onBlur={() => runValidationTasks("accountType", accountType)}
        errorMessage={errors.accountType?.errorMessage}
        hasError={errors.accountType?.hasError}
        {...getOverrideProps(overrides, "accountType")}
      ></TextField>
      <TextField
        label="Account number"
        isRequired={false}
        isReadOnly={false}
        value={accountNumber}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              accountType,
              accountNumber: value,
              description,
              currency,
              currentBalance,
              openingBalance,
              interestRate,
              interestCalculationMethod,
              interestPostingFrequency,
              interestPostingDate,
              interestAccrued,
              interestAccruedDate,
              accountStatus,
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
        label="Description"
        isRequired={false}
        isReadOnly={false}
        value={description}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              accountType,
              accountNumber,
              description: value,
              currency,
              currentBalance,
              openingBalance,
              interestRate,
              interestCalculationMethod,
              interestPostingFrequency,
              interestPostingDate,
              interestAccrued,
              interestAccruedDate,
              accountStatus,
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
        label="Currency"
        isRequired={false}
        isReadOnly={false}
        value={currency}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              accountType,
              accountNumber,
              description,
              currency: value,
              currentBalance,
              openingBalance,
              interestRate,
              interestCalculationMethod,
              interestPostingFrequency,
              interestPostingDate,
              interestAccrued,
              interestAccruedDate,
              accountStatus,
            };
            const result = onChange(modelFields);
            value = result?.currency ?? value;
          }
          if (errors.currency?.hasError) {
            runValidationTasks("currency", value);
          }
          setCurrency(value);
        }}
        onBlur={() => runValidationTasks("currency", currency)}
        errorMessage={errors.currency?.errorMessage}
        hasError={errors.currency?.hasError}
        {...getOverrideProps(overrides, "currency")}
      ></TextField>
      <TextField
        label="Current balance"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={currentBalance}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              accountType,
              accountNumber,
              description,
              currency,
              currentBalance: value,
              openingBalance,
              interestRate,
              interestCalculationMethod,
              interestPostingFrequency,
              interestPostingDate,
              interestAccrued,
              interestAccruedDate,
              accountStatus,
            };
            const result = onChange(modelFields);
            value = result?.currentBalance ?? value;
          }
          if (errors.currentBalance?.hasError) {
            runValidationTasks("currentBalance", value);
          }
          setCurrentBalance(value);
        }}
        onBlur={() => runValidationTasks("currentBalance", currentBalance)}
        errorMessage={errors.currentBalance?.errorMessage}
        hasError={errors.currentBalance?.hasError}
        {...getOverrideProps(overrides, "currentBalance")}
      ></TextField>
      <TextField
        label="Opening balance"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={openingBalance}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              accountType,
              accountNumber,
              description,
              currency,
              currentBalance,
              openingBalance: value,
              interestRate,
              interestCalculationMethod,
              interestPostingFrequency,
              interestPostingDate,
              interestAccrued,
              interestAccruedDate,
              accountStatus,
            };
            const result = onChange(modelFields);
            value = result?.openingBalance ?? value;
          }
          if (errors.openingBalance?.hasError) {
            runValidationTasks("openingBalance", value);
          }
          setOpeningBalance(value);
        }}
        onBlur={() => runValidationTasks("openingBalance", openingBalance)}
        errorMessage={errors.openingBalance?.errorMessage}
        hasError={errors.openingBalance?.hasError}
        {...getOverrideProps(overrides, "openingBalance")}
      ></TextField>
      <TextField
        label="Interest rate"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={interestRate}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              accountType,
              accountNumber,
              description,
              currency,
              currentBalance,
              openingBalance,
              interestRate: value,
              interestCalculationMethod,
              interestPostingFrequency,
              interestPostingDate,
              interestAccrued,
              interestAccruedDate,
              accountStatus,
            };
            const result = onChange(modelFields);
            value = result?.interestRate ?? value;
          }
          if (errors.interestRate?.hasError) {
            runValidationTasks("interestRate", value);
          }
          setInterestRate(value);
        }}
        onBlur={() => runValidationTasks("interestRate", interestRate)}
        errorMessage={errors.interestRate?.errorMessage}
        hasError={errors.interestRate?.hasError}
        {...getOverrideProps(overrides, "interestRate")}
      ></TextField>
      <TextField
        label="Interest calculation method"
        isRequired={false}
        isReadOnly={false}
        value={interestCalculationMethod}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              accountType,
              accountNumber,
              description,
              currency,
              currentBalance,
              openingBalance,
              interestRate,
              interestCalculationMethod: value,
              interestPostingFrequency,
              interestPostingDate,
              interestAccrued,
              interestAccruedDate,
              accountStatus,
            };
            const result = onChange(modelFields);
            value = result?.interestCalculationMethod ?? value;
          }
          if (errors.interestCalculationMethod?.hasError) {
            runValidationTasks("interestCalculationMethod", value);
          }
          setInterestCalculationMethod(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "interestCalculationMethod",
            interestCalculationMethod
          )
        }
        errorMessage={errors.interestCalculationMethod?.errorMessage}
        hasError={errors.interestCalculationMethod?.hasError}
        {...getOverrideProps(overrides, "interestCalculationMethod")}
      ></TextField>
      <TextField
        label="Interest posting frequency"
        isRequired={false}
        isReadOnly={false}
        value={interestPostingFrequency}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              accountType,
              accountNumber,
              description,
              currency,
              currentBalance,
              openingBalance,
              interestRate,
              interestCalculationMethod,
              interestPostingFrequency: value,
              interestPostingDate,
              interestAccrued,
              interestAccruedDate,
              accountStatus,
            };
            const result = onChange(modelFields);
            value = result?.interestPostingFrequency ?? value;
          }
          if (errors.interestPostingFrequency?.hasError) {
            runValidationTasks("interestPostingFrequency", value);
          }
          setInterestPostingFrequency(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "interestPostingFrequency",
            interestPostingFrequency
          )
        }
        errorMessage={errors.interestPostingFrequency?.errorMessage}
        hasError={errors.interestPostingFrequency?.hasError}
        {...getOverrideProps(overrides, "interestPostingFrequency")}
      ></TextField>
      <TextField
        label="Interest posting date"
        isRequired={false}
        isReadOnly={false}
        value={interestPostingDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              accountType,
              accountNumber,
              description,
              currency,
              currentBalance,
              openingBalance,
              interestRate,
              interestCalculationMethod,
              interestPostingFrequency,
              interestPostingDate: value,
              interestAccrued,
              interestAccruedDate,
              accountStatus,
            };
            const result = onChange(modelFields);
            value = result?.interestPostingDate ?? value;
          }
          if (errors.interestPostingDate?.hasError) {
            runValidationTasks("interestPostingDate", value);
          }
          setInterestPostingDate(value);
        }}
        onBlur={() =>
          runValidationTasks("interestPostingDate", interestPostingDate)
        }
        errorMessage={errors.interestPostingDate?.errorMessage}
        hasError={errors.interestPostingDate?.hasError}
        {...getOverrideProps(overrides, "interestPostingDate")}
      ></TextField>
      <TextField
        label="Interest accrued"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={interestAccrued}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              accountType,
              accountNumber,
              description,
              currency,
              currentBalance,
              openingBalance,
              interestRate,
              interestCalculationMethod,
              interestPostingFrequency,
              interestPostingDate,
              interestAccrued: value,
              interestAccruedDate,
              accountStatus,
            };
            const result = onChange(modelFields);
            value = result?.interestAccrued ?? value;
          }
          if (errors.interestAccrued?.hasError) {
            runValidationTasks("interestAccrued", value);
          }
          setInterestAccrued(value);
        }}
        onBlur={() => runValidationTasks("interestAccrued", interestAccrued)}
        errorMessage={errors.interestAccrued?.errorMessage}
        hasError={errors.interestAccrued?.hasError}
        {...getOverrideProps(overrides, "interestAccrued")}
      ></TextField>
      <TextField
        label="Interest accrued date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={interestAccruedDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              accountType,
              accountNumber,
              description,
              currency,
              currentBalance,
              openingBalance,
              interestRate,
              interestCalculationMethod,
              interestPostingFrequency,
              interestPostingDate,
              interestAccrued,
              interestAccruedDate: value,
              accountStatus,
            };
            const result = onChange(modelFields);
            value = result?.interestAccruedDate ?? value;
          }
          if (errors.interestAccruedDate?.hasError) {
            runValidationTasks("interestAccruedDate", value);
          }
          setInterestAccruedDate(value);
        }}
        onBlur={() =>
          runValidationTasks("interestAccruedDate", interestAccruedDate)
        }
        errorMessage={errors.interestAccruedDate?.errorMessage}
        hasError={errors.interestAccruedDate?.hasError}
        {...getOverrideProps(overrides, "interestAccruedDate")}
      ></TextField>
      <TextField
        label="Account status"
        isRequired={false}
        isReadOnly={false}
        value={accountStatus}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              accountType,
              accountNumber,
              description,
              currency,
              currentBalance,
              openingBalance,
              interestRate,
              interestCalculationMethod,
              interestPostingFrequency,
              interestPostingDate,
              interestAccrued,
              interestAccruedDate,
              accountStatus: value,
            };
            const result = onChange(modelFields);
            value = result?.accountStatus ?? value;
          }
          if (errors.accountStatus?.hasError) {
            runValidationTasks("accountStatus", value);
          }
          setAccountStatus(value);
        }}
        onBlur={() => runValidationTasks("accountStatus", accountStatus)}
        errorMessage={errors.accountStatus?.errorMessage}
        hasError={errors.accountStatus?.hasError}
        {...getOverrideProps(overrides, "accountStatus")}
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
