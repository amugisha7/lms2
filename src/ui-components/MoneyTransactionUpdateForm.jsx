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
import { getMoneyTransaction } from "../graphql/queries";
import { updateMoneyTransaction } from "../graphql/mutations";
const client = generateClient();
export default function MoneyTransactionUpdateForm(props) {
  const {
    id: idProp,
    moneyTransaction: moneyTransactionModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    transactionType: "",
    transactionDate: "",
    amount: "",
    description: "",
    referenceNumber: "",
    relatedEntityType: "",
    approvalStatus: "",
    approvedDate: "",
    category: "",
    notes: "",
    paymentMethod: "",
    deviceInfo: "",
  };
  const [transactionType, setTransactionType] = React.useState(
    initialValues.transactionType
  );
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
  const [relatedEntityType, setRelatedEntityType] = React.useState(
    initialValues.relatedEntityType
  );
  const [approvalStatus, setApprovalStatus] = React.useState(
    initialValues.approvalStatus
  );
  const [approvedDate, setApprovedDate] = React.useState(
    initialValues.approvedDate
  );
  const [category, setCategory] = React.useState(initialValues.category);
  const [notes, setNotes] = React.useState(initialValues.notes);
  const [paymentMethod, setPaymentMethod] = React.useState(
    initialValues.paymentMethod
  );
  const [deviceInfo, setDeviceInfo] = React.useState(initialValues.deviceInfo);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = moneyTransactionRecord
      ? { ...initialValues, ...moneyTransactionRecord }
      : initialValues;
    setTransactionType(cleanValues.transactionType);
    setTransactionDate(cleanValues.transactionDate);
    setAmount(cleanValues.amount);
    setDescription(cleanValues.description);
    setReferenceNumber(cleanValues.referenceNumber);
    setRelatedEntityType(cleanValues.relatedEntityType);
    setApprovalStatus(cleanValues.approvalStatus);
    setApprovedDate(cleanValues.approvedDate);
    setCategory(cleanValues.category);
    setNotes(cleanValues.notes);
    setPaymentMethod(cleanValues.paymentMethod);
    setDeviceInfo(cleanValues.deviceInfo);
    setErrors({});
  };
  const [moneyTransactionRecord, setMoneyTransactionRecord] = React.useState(
    moneyTransactionModelProp
  );
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getMoneyTransaction.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getMoneyTransaction
        : moneyTransactionModelProp;
      setMoneyTransactionRecord(record);
    };
    queryData();
  }, [idProp, moneyTransactionModelProp]);
  React.useEffect(resetStateValues, [moneyTransactionRecord]);
  const validations = {
    transactionType: [],
    transactionDate: [],
    amount: [{ type: "Required" }],
    description: [],
    referenceNumber: [],
    relatedEntityType: [],
    approvalStatus: [],
    approvedDate: [],
    category: [],
    notes: [],
    paymentMethod: [],
    deviceInfo: [],
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
          transactionType: transactionType ?? null,
          transactionDate: transactionDate ?? null,
          amount,
          description: description ?? null,
          referenceNumber: referenceNumber ?? null,
          relatedEntityType: relatedEntityType ?? null,
          approvalStatus: approvalStatus ?? null,
          approvedDate: approvedDate ?? null,
          category: category ?? null,
          notes: notes ?? null,
          paymentMethod: paymentMethod ?? null,
          deviceInfo: deviceInfo ?? null,
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
            query: updateMoneyTransaction.replaceAll("__typename", ""),
            variables: {
              input: {
                id: moneyTransactionRecord.id,
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
      {...getOverrideProps(overrides, "MoneyTransactionUpdateForm")}
      {...rest}
    >
      <TextField
        label="Transaction type"
        isRequired={false}
        isReadOnly={false}
        value={transactionType}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              transactionType: value,
              transactionDate,
              amount,
              description,
              referenceNumber,
              relatedEntityType,
              approvalStatus,
              approvedDate,
              category,
              notes,
              paymentMethod,
              deviceInfo,
            };
            const result = onChange(modelFields);
            value = result?.transactionType ?? value;
          }
          if (errors.transactionType?.hasError) {
            runValidationTasks("transactionType", value);
          }
          setTransactionType(value);
        }}
        onBlur={() => runValidationTasks("transactionType", transactionType)}
        errorMessage={errors.transactionType?.errorMessage}
        hasError={errors.transactionType?.hasError}
        {...getOverrideProps(overrides, "transactionType")}
      ></TextField>
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
              transactionType,
              transactionDate: value,
              amount,
              description,
              referenceNumber,
              relatedEntityType,
              approvalStatus,
              approvedDate,
              category,
              notes,
              paymentMethod,
              deviceInfo,
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
              transactionType,
              transactionDate,
              amount: value,
              description,
              referenceNumber,
              relatedEntityType,
              approvalStatus,
              approvedDate,
              category,
              notes,
              paymentMethod,
              deviceInfo,
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
              transactionType,
              transactionDate,
              amount,
              description: value,
              referenceNumber,
              relatedEntityType,
              approvalStatus,
              approvedDate,
              category,
              notes,
              paymentMethod,
              deviceInfo,
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
              transactionType,
              transactionDate,
              amount,
              description,
              referenceNumber: value,
              relatedEntityType,
              approvalStatus,
              approvedDate,
              category,
              notes,
              paymentMethod,
              deviceInfo,
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
        label="Related entity type"
        isRequired={false}
        isReadOnly={false}
        value={relatedEntityType}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              transactionType,
              transactionDate,
              amount,
              description,
              referenceNumber,
              relatedEntityType: value,
              approvalStatus,
              approvedDate,
              category,
              notes,
              paymentMethod,
              deviceInfo,
            };
            const result = onChange(modelFields);
            value = result?.relatedEntityType ?? value;
          }
          if (errors.relatedEntityType?.hasError) {
            runValidationTasks("relatedEntityType", value);
          }
          setRelatedEntityType(value);
        }}
        onBlur={() =>
          runValidationTasks("relatedEntityType", relatedEntityType)
        }
        errorMessage={errors.relatedEntityType?.errorMessage}
        hasError={errors.relatedEntityType?.hasError}
        {...getOverrideProps(overrides, "relatedEntityType")}
      ></TextField>
      <TextField
        label="Approval status"
        isRequired={false}
        isReadOnly={false}
        value={approvalStatus}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              transactionType,
              transactionDate,
              amount,
              description,
              referenceNumber,
              relatedEntityType,
              approvalStatus: value,
              approvedDate,
              category,
              notes,
              paymentMethod,
              deviceInfo,
            };
            const result = onChange(modelFields);
            value = result?.approvalStatus ?? value;
          }
          if (errors.approvalStatus?.hasError) {
            runValidationTasks("approvalStatus", value);
          }
          setApprovalStatus(value);
        }}
        onBlur={() => runValidationTasks("approvalStatus", approvalStatus)}
        errorMessage={errors.approvalStatus?.errorMessage}
        hasError={errors.approvalStatus?.hasError}
        {...getOverrideProps(overrides, "approvalStatus")}
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
              transactionType,
              transactionDate,
              amount,
              description,
              referenceNumber,
              relatedEntityType,
              approvalStatus,
              approvedDate: value,
              category,
              notes,
              paymentMethod,
              deviceInfo,
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
        label="Category"
        isRequired={false}
        isReadOnly={false}
        value={category}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              transactionType,
              transactionDate,
              amount,
              description,
              referenceNumber,
              relatedEntityType,
              approvalStatus,
              approvedDate,
              category: value,
              notes,
              paymentMethod,
              deviceInfo,
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
      <TextField
        label="Notes"
        isRequired={false}
        isReadOnly={false}
        value={notes}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              transactionType,
              transactionDate,
              amount,
              description,
              referenceNumber,
              relatedEntityType,
              approvalStatus,
              approvedDate,
              category,
              notes: value,
              paymentMethod,
              deviceInfo,
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
        label="Payment method"
        isRequired={false}
        isReadOnly={false}
        value={paymentMethod}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              transactionType,
              transactionDate,
              amount,
              description,
              referenceNumber,
              relatedEntityType,
              approvalStatus,
              approvedDate,
              category,
              notes,
              paymentMethod: value,
              deviceInfo,
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
        label="Device info"
        isRequired={false}
        isReadOnly={false}
        value={deviceInfo}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              transactionType,
              transactionDate,
              amount,
              description,
              referenceNumber,
              relatedEntityType,
              approvalStatus,
              approvedDate,
              category,
              notes,
              paymentMethod,
              deviceInfo: value,
            };
            const result = onChange(modelFields);
            value = result?.deviceInfo ?? value;
          }
          if (errors.deviceInfo?.hasError) {
            runValidationTasks("deviceInfo", value);
          }
          setDeviceInfo(value);
        }}
        onBlur={() => runValidationTasks("deviceInfo", deviceInfo)}
        errorMessage={errors.deviceInfo?.errorMessage}
        hasError={errors.deviceInfo?.hasError}
        {...getOverrideProps(overrides, "deviceInfo")}
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
          isDisabled={!(idProp || moneyTransactionModelProp)}
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
              !(idProp || moneyTransactionModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
