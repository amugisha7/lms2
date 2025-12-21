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
  SelectField,
  TextField,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { createPayment } from "../graphql/mutations";
const client = generateClient();
export default function PaymentCreateForm(props) {
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
    paymentDate: "",
    paymentType: "",
    amount: "",
    description: "",
    referenceNumber: "",
    paymentMethod: "",
    status: "",
    paymentStatusEnum: "",
    notes: "",
  };
  const [paymentDate, setPaymentDate] = React.useState(
    initialValues.paymentDate
  );
  const [paymentType, setPaymentType] = React.useState(
    initialValues.paymentType
  );
  const [amount, setAmount] = React.useState(initialValues.amount);
  const [description, setDescription] = React.useState(
    initialValues.description
  );
  const [referenceNumber, setReferenceNumber] = React.useState(
    initialValues.referenceNumber
  );
  const [paymentMethod, setPaymentMethod] = React.useState(
    initialValues.paymentMethod
  );
  const [status, setStatus] = React.useState(initialValues.status);
  const [paymentStatusEnum, setPaymentStatusEnum] = React.useState(
    initialValues.paymentStatusEnum
  );
  const [notes, setNotes] = React.useState(initialValues.notes);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setPaymentDate(initialValues.paymentDate);
    setPaymentType(initialValues.paymentType);
    setAmount(initialValues.amount);
    setDescription(initialValues.description);
    setReferenceNumber(initialValues.referenceNumber);
    setPaymentMethod(initialValues.paymentMethod);
    setStatus(initialValues.status);
    setPaymentStatusEnum(initialValues.paymentStatusEnum);
    setNotes(initialValues.notes);
    setErrors({});
  };
  const validations = {
    paymentDate: [],
    paymentType: [],
    amount: [{ type: "Required" }],
    description: [],
    referenceNumber: [],
    paymentMethod: [],
    status: [],
    paymentStatusEnum: [],
    notes: [],
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
          paymentDate,
          paymentType,
          amount,
          description,
          referenceNumber,
          paymentMethod,
          status,
          paymentStatusEnum,
          notes,
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
            query: createPayment.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "PaymentCreateForm")}
      {...rest}
    >
      <TextField
        label="Payment date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={paymentDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              paymentDate: value,
              paymentType,
              amount,
              description,
              referenceNumber,
              paymentMethod,
              status,
              paymentStatusEnum,
              notes,
            };
            const result = onChange(modelFields);
            value = result?.paymentDate ?? value;
          }
          if (errors.paymentDate?.hasError) {
            runValidationTasks("paymentDate", value);
          }
          setPaymentDate(value);
        }}
        onBlur={() => runValidationTasks("paymentDate", paymentDate)}
        errorMessage={errors.paymentDate?.errorMessage}
        hasError={errors.paymentDate?.hasError}
        {...getOverrideProps(overrides, "paymentDate")}
      ></TextField>
      <TextField
        label="Payment type"
        isRequired={false}
        isReadOnly={false}
        value={paymentType}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              paymentDate,
              paymentType: value,
              amount,
              description,
              referenceNumber,
              paymentMethod,
              status,
              paymentStatusEnum,
              notes,
            };
            const result = onChange(modelFields);
            value = result?.paymentType ?? value;
          }
          if (errors.paymentType?.hasError) {
            runValidationTasks("paymentType", value);
          }
          setPaymentType(value);
        }}
        onBlur={() => runValidationTasks("paymentType", paymentType)}
        errorMessage={errors.paymentType?.errorMessage}
        hasError={errors.paymentType?.hasError}
        {...getOverrideProps(overrides, "paymentType")}
      ></TextField>
      <TextField
        label="Amount"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={amount}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              paymentDate,
              paymentType,
              amount: value,
              description,
              referenceNumber,
              paymentMethod,
              status,
              paymentStatusEnum,
              notes,
            };
            const result = onChange(modelFields);
            value = result?.amount ?? value;
          }
          if (errors.amount?.hasError) {
            runValidationTasks("amount", value);
          }
          setAmount(value);
        }}
        onBlur={() => runValidationTasks("amount", amount)}
        errorMessage={errors.amount?.errorMessage}
        hasError={errors.amount?.hasError}
        {...getOverrideProps(overrides, "amount")}
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
              paymentDate,
              paymentType,
              amount,
              description: value,
              referenceNumber,
              paymentMethod,
              status,
              paymentStatusEnum,
              notes,
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
        label="Reference number"
        isRequired={false}
        isReadOnly={false}
        value={referenceNumber}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              paymentDate,
              paymentType,
              amount,
              description,
              referenceNumber: value,
              paymentMethod,
              status,
              paymentStatusEnum,
              notes,
            };
            const result = onChange(modelFields);
            value = result?.referenceNumber ?? value;
          }
          if (errors.referenceNumber?.hasError) {
            runValidationTasks("referenceNumber", value);
          }
          setReferenceNumber(value);
        }}
        onBlur={() => runValidationTasks("referenceNumber", referenceNumber)}
        errorMessage={errors.referenceNumber?.errorMessage}
        hasError={errors.referenceNumber?.hasError}
        {...getOverrideProps(overrides, "referenceNumber")}
      ></TextField>
      <TextField
        label="Payment method"
        isRequired={false}
        isReadOnly={false}
        value={paymentMethod}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              paymentDate,
              paymentType,
              amount,
              description,
              referenceNumber,
              paymentMethod: value,
              status,
              paymentStatusEnum,
              notes,
            };
            const result = onChange(modelFields);
            value = result?.paymentMethod ?? value;
          }
          if (errors.paymentMethod?.hasError) {
            runValidationTasks("paymentMethod", value);
          }
          setPaymentMethod(value);
        }}
        onBlur={() => runValidationTasks("paymentMethod", paymentMethod)}
        errorMessage={errors.paymentMethod?.errorMessage}
        hasError={errors.paymentMethod?.hasError}
        {...getOverrideProps(overrides, "paymentMethod")}
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
              paymentDate,
              paymentType,
              amount,
              description,
              referenceNumber,
              paymentMethod,
              status: value,
              paymentStatusEnum,
              notes,
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
      <SelectField
        label="Payment status enum"
        placeholder="Please select an option"
        isDisabled={false}
        value={paymentStatusEnum}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              paymentDate,
              paymentType,
              amount,
              description,
              referenceNumber,
              paymentMethod,
              status,
              paymentStatusEnum: value,
              notes,
            };
            const result = onChange(modelFields);
            value = result?.paymentStatusEnum ?? value;
          }
          if (errors.paymentStatusEnum?.hasError) {
            runValidationTasks("paymentStatusEnum", value);
          }
          setPaymentStatusEnum(value);
        }}
        onBlur={() =>
          runValidationTasks("paymentStatusEnum", paymentStatusEnum)
        }
        errorMessage={errors.paymentStatusEnum?.errorMessage}
        hasError={errors.paymentStatusEnum?.hasError}
        {...getOverrideProps(overrides, "paymentStatusEnum")}
      >
        <option
          children="Pending"
          value="PENDING"
          {...getOverrideProps(overrides, "paymentStatusEnumoption0")}
        ></option>
        <option
          children="Completed"
          value="COMPLETED"
          {...getOverrideProps(overrides, "paymentStatusEnumoption1")}
        ></option>
        <option
          children="Reversed"
          value="REVERSED"
          {...getOverrideProps(overrides, "paymentStatusEnumoption2")}
        ></option>
        <option
          children="Failed"
          value="FAILED"
          {...getOverrideProps(overrides, "paymentStatusEnumoption3")}
        ></option>
      </SelectField>
      <TextField
        label="Notes"
        isRequired={false}
        isReadOnly={false}
        value={notes}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              paymentDate,
              paymentType,
              amount,
              description,
              referenceNumber,
              paymentMethod,
              status,
              paymentStatusEnum,
              notes: value,
            };
            const result = onChange(modelFields);
            value = result?.notes ?? value;
          }
          if (errors.notes?.hasError) {
            runValidationTasks("notes", value);
          }
          setNotes(value);
        }}
        onBlur={() => runValidationTasks("notes", notes)}
        errorMessage={errors.notes?.errorMessage}
        hasError={errors.notes?.hasError}
        {...getOverrideProps(overrides, "notes")}
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
