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
import { getExpense } from "../graphql/queries";
import { updateExpense } from "../graphql/mutations";
const client = generateClient();
export default function ExpenseUpdateForm(props) {
  const {
    id: idProp,
    expense: expenseModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    transactionDate: "",
    amount: "",
    description: "",
    referenceNumber: "",
    receiptDocumentS3Key: "",
    status: "",
    notes: "",
    payee: "",
    paymentMethod: "",
    checkNumber: "",
    approvedDate: "",
    type: "",
    category: "",
  };
  const [transactionDate, setTransactionDate] = React.useState(
    initialValues.transactionDate
  );
  const [amount, setAmount] = React.useState(initialValues.amount);
  const [description, setDescription] = React.useState(
    initialValues.description
  );
  const [referenceNumber, setReferenceNumber] = React.useState(
    initialValues.referenceNumber
  );
  const [receiptDocumentS3Key, setReceiptDocumentS3Key] = React.useState(
    initialValues.receiptDocumentS3Key
  );
  const [status, setStatus] = React.useState(initialValues.status);
  const [notes, setNotes] = React.useState(initialValues.notes);
  const [payee, setPayee] = React.useState(initialValues.payee);
  const [paymentMethod, setPaymentMethod] = React.useState(
    initialValues.paymentMethod
  );
  const [checkNumber, setCheckNumber] = React.useState(
    initialValues.checkNumber
  );
  const [approvedDate, setApprovedDate] = React.useState(
    initialValues.approvedDate
  );
  const [type, setType] = React.useState(initialValues.type);
  const [category, setCategory] = React.useState(initialValues.category);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = expenseRecord
      ? { ...initialValues, ...expenseRecord }
      : initialValues;
    setTransactionDate(cleanValues.transactionDate);
    setAmount(cleanValues.amount);
    setDescription(cleanValues.description);
    setReferenceNumber(cleanValues.referenceNumber);
    setReceiptDocumentS3Key(cleanValues.receiptDocumentS3Key);
    setStatus(cleanValues.status);
    setNotes(cleanValues.notes);
    setPayee(cleanValues.payee);
    setPaymentMethod(cleanValues.paymentMethod);
    setCheckNumber(cleanValues.checkNumber);
    setApprovedDate(cleanValues.approvedDate);
    setType(cleanValues.type);
    setCategory(cleanValues.category);
    setErrors({});
  };
  const [expenseRecord, setExpenseRecord] = React.useState(expenseModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getExpense.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getExpense
        : expenseModelProp;
      setExpenseRecord(record);
    };
    queryData();
  }, [idProp, expenseModelProp]);
  React.useEffect(resetStateValues, [expenseRecord]);
  const validations = {
    transactionDate: [],
    amount: [{ type: "Required" }],
    description: [],
    referenceNumber: [],
    receiptDocumentS3Key: [],
    status: [],
    notes: [],
    payee: [],
    paymentMethod: [],
    checkNumber: [],
    approvedDate: [],
    type: [],
    category: [],
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
          transactionDate: transactionDate ?? null,
          amount,
          description: description ?? null,
          referenceNumber: referenceNumber ?? null,
          receiptDocumentS3Key: receiptDocumentS3Key ?? null,
          status: status ?? null,
          notes: notes ?? null,
          payee: payee ?? null,
          paymentMethod: paymentMethod ?? null,
          checkNumber: checkNumber ?? null,
          approvedDate: approvedDate ?? null,
          type: type ?? null,
          category: category ?? null,
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
            query: updateExpense.replaceAll("__typename", ""),
            variables: {
              input: {
                id: expenseRecord.id,
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
      {...getOverrideProps(overrides, "ExpenseUpdateForm")}
      {...rest}
    >
      <TextField
        label="Transaction date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={transactionDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              transactionDate: value,
              amount,
              description,
              referenceNumber,
              receiptDocumentS3Key,
              status,
              notes,
              payee,
              paymentMethod,
              checkNumber,
              approvedDate,
              type,
              category,
            };
            const result = onChange(modelFields);
            value = result?.transactionDate ?? value;
          }
          if (errors.transactionDate?.hasError) {
            runValidationTasks("transactionDate", value);
          }
          setTransactionDate(value);
        }}
        onBlur={() => runValidationTasks("transactionDate", transactionDate)}
        errorMessage={errors.transactionDate?.errorMessage}
        hasError={errors.transactionDate?.hasError}
        {...getOverrideProps(overrides, "transactionDate")}
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
              transactionDate,
              amount: value,
              description,
              referenceNumber,
              receiptDocumentS3Key,
              status,
              notes,
              payee,
              paymentMethod,
              checkNumber,
              approvedDate,
              type,
              category,
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
              transactionDate,
              amount,
              description: value,
              referenceNumber,
              receiptDocumentS3Key,
              status,
              notes,
              payee,
              paymentMethod,
              checkNumber,
              approvedDate,
              type,
              category,
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
              transactionDate,
              amount,
              description,
              referenceNumber: value,
              receiptDocumentS3Key,
              status,
              notes,
              payee,
              paymentMethod,
              checkNumber,
              approvedDate,
              type,
              category,
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
        label="Receipt document s3 key"
        isRequired={false}
        isReadOnly={false}
        value={receiptDocumentS3Key}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              transactionDate,
              amount,
              description,
              referenceNumber,
              receiptDocumentS3Key: value,
              status,
              notes,
              payee,
              paymentMethod,
              checkNumber,
              approvedDate,
              type,
              category,
            };
            const result = onChange(modelFields);
            value = result?.receiptDocumentS3Key ?? value;
          }
          if (errors.receiptDocumentS3Key?.hasError) {
            runValidationTasks("receiptDocumentS3Key", value);
          }
          setReceiptDocumentS3Key(value);
        }}
        onBlur={() =>
          runValidationTasks("receiptDocumentS3Key", receiptDocumentS3Key)
        }
        errorMessage={errors.receiptDocumentS3Key?.errorMessage}
        hasError={errors.receiptDocumentS3Key?.hasError}
        {...getOverrideProps(overrides, "receiptDocumentS3Key")}
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
              transactionDate,
              amount,
              description,
              referenceNumber,
              receiptDocumentS3Key,
              status: value,
              notes,
              payee,
              paymentMethod,
              checkNumber,
              approvedDate,
              type,
              category,
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
        label="Notes"
        isRequired={false}
        isReadOnly={false}
        value={notes}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              transactionDate,
              amount,
              description,
              referenceNumber,
              receiptDocumentS3Key,
              status,
              notes: value,
              payee,
              paymentMethod,
              checkNumber,
              approvedDate,
              type,
              category,
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
      <TextField
        label="Payee"
        isRequired={false}
        isReadOnly={false}
        value={payee}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              transactionDate,
              amount,
              description,
              referenceNumber,
              receiptDocumentS3Key,
              status,
              notes,
              payee: value,
              paymentMethod,
              checkNumber,
              approvedDate,
              type,
              category,
            };
            const result = onChange(modelFields);
            value = result?.payee ?? value;
          }
          if (errors.payee?.hasError) {
            runValidationTasks("payee", value);
          }
          setPayee(value);
        }}
        onBlur={() => runValidationTasks("payee", payee)}
        errorMessage={errors.payee?.errorMessage}
        hasError={errors.payee?.hasError}
        {...getOverrideProps(overrides, "payee")}
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
              transactionDate,
              amount,
              description,
              referenceNumber,
              receiptDocumentS3Key,
              status,
              notes,
              payee,
              paymentMethod: value,
              checkNumber,
              approvedDate,
              type,
              category,
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
        label="Check number"
        isRequired={false}
        isReadOnly={false}
        value={checkNumber}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              transactionDate,
              amount,
              description,
              referenceNumber,
              receiptDocumentS3Key,
              status,
              notes,
              payee,
              paymentMethod,
              checkNumber: value,
              approvedDate,
              type,
              category,
            };
            const result = onChange(modelFields);
            value = result?.checkNumber ?? value;
          }
          if (errors.checkNumber?.hasError) {
            runValidationTasks("checkNumber", value);
          }
          setCheckNumber(value);
        }}
        onBlur={() => runValidationTasks("checkNumber", checkNumber)}
        errorMessage={errors.checkNumber?.errorMessage}
        hasError={errors.checkNumber?.hasError}
        {...getOverrideProps(overrides, "checkNumber")}
      ></TextField>
      <TextField
        label="Approved date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={approvedDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              transactionDate,
              amount,
              description,
              referenceNumber,
              receiptDocumentS3Key,
              status,
              notes,
              payee,
              paymentMethod,
              checkNumber,
              approvedDate: value,
              type,
              category,
            };
            const result = onChange(modelFields);
            value = result?.approvedDate ?? value;
          }
          if (errors.approvedDate?.hasError) {
            runValidationTasks("approvedDate", value);
          }
          setApprovedDate(value);
        }}
        onBlur={() => runValidationTasks("approvedDate", approvedDate)}
        errorMessage={errors.approvedDate?.errorMessage}
        hasError={errors.approvedDate?.hasError}
        {...getOverrideProps(overrides, "approvedDate")}
      ></TextField>
      <TextField
        label="Type"
        isRequired={false}
        isReadOnly={false}
        value={type}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              transactionDate,
              amount,
              description,
              referenceNumber,
              receiptDocumentS3Key,
              status,
              notes,
              payee,
              paymentMethod,
              checkNumber,
              approvedDate,
              type: value,
              category,
            };
            const result = onChange(modelFields);
            value = result?.type ?? value;
          }
          if (errors.type?.hasError) {
            runValidationTasks("type", value);
          }
          setType(value);
        }}
        onBlur={() => runValidationTasks("type", type)}
        errorMessage={errors.type?.errorMessage}
        hasError={errors.type?.hasError}
        {...getOverrideProps(overrides, "type")}
      ></TextField>
      <TextField
        label="Category"
        isRequired={false}
        isReadOnly={false}
        value={category}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              transactionDate,
              amount,
              description,
              referenceNumber,
              receiptDocumentS3Key,
              status,
              notes,
              payee,
              paymentMethod,
              checkNumber,
              approvedDate,
              type,
              category: value,
            };
            const result = onChange(modelFields);
            value = result?.category ?? value;
          }
          if (errors.category?.hasError) {
            runValidationTasks("category", value);
          }
          setCategory(value);
        }}
        onBlur={() => runValidationTasks("category", category)}
        errorMessage={errors.category?.errorMessage}
        hasError={errors.category?.hasError}
        {...getOverrideProps(overrides, "category")}
      ></TextField>
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
          isDisabled={!(idProp || expenseModelProp)}
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
              !(idProp || expenseModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
