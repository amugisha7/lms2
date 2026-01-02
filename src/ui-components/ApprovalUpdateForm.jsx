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
  TextAreaField,
  TextField,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getApproval } from "../graphql/queries";
import { updateApproval } from "../graphql/mutations";
const client = generateClient();
export default function ApprovalUpdateForm(props) {
  const {
    id: idProp,
    approval: approvalModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    approvalType: "",
    recordID: "",
    approvalDate: "",
    status: "",
    notes: "",
    customApprovalDetails: "",
  };
  const [approvalType, setApprovalType] = React.useState(
    initialValues.approvalType
  );
  const [recordID, setRecordID] = React.useState(initialValues.recordID);
  const [approvalDate, setApprovalDate] = React.useState(
    initialValues.approvalDate
  );
  const [status, setStatus] = React.useState(initialValues.status);
  const [notes, setNotes] = React.useState(initialValues.notes);
  const [customApprovalDetails, setCustomApprovalDetails] = React.useState(
    initialValues.customApprovalDetails
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = approvalRecord
      ? { ...initialValues, ...approvalRecord }
      : initialValues;
    setApprovalType(cleanValues.approvalType);
    setRecordID(cleanValues.recordID);
    setApprovalDate(cleanValues.approvalDate);
    setStatus(cleanValues.status);
    setNotes(cleanValues.notes);
    setCustomApprovalDetails(
      typeof cleanValues.customApprovalDetails === "string" ||
        cleanValues.customApprovalDetails === null
        ? cleanValues.customApprovalDetails
        : JSON.stringify(cleanValues.customApprovalDetails)
    );
    setErrors({});
  };
  const [approvalRecord, setApprovalRecord] = React.useState(approvalModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getApproval.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getApproval
        : approvalModelProp;
      setApprovalRecord(record);
    };
    queryData();
  }, [idProp, approvalModelProp]);
  React.useEffect(resetStateValues, [approvalRecord]);
  const validations = {
    approvalType: [{ type: "Required" }],
    recordID: [{ type: "Required" }],
    approvalDate: [],
    status: [],
    notes: [],
    customApprovalDetails: [{ type: "JSON" }],
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
          approvalType,
          recordID,
          approvalDate: approvalDate ?? null,
          status: status ?? null,
          notes: notes ?? null,
          customApprovalDetails: customApprovalDetails ?? null,
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
            query: updateApproval.replaceAll("__typename", ""),
            variables: {
              input: {
                id: approvalRecord.id,
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
      {...getOverrideProps(overrides, "ApprovalUpdateForm")}
      {...rest}
    >
      <SelectField
        label="Approval type"
        placeholder="Please select an option"
        isDisabled={false}
        value={approvalType}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              approvalType: value,
              recordID,
              approvalDate,
              status,
              notes,
              customApprovalDetails,
            };
            const result = onChange(modelFields);
            value = result?.approvalType ?? value;
          }
          if (errors.approvalType?.hasError) {
            runValidationTasks("approvalType", value);
          }
          setApprovalType(value);
        }}
        onBlur={() => runValidationTasks("approvalType", approvalType)}
        errorMessage={errors.approvalType?.errorMessage}
        hasError={errors.approvalType?.hasError}
        {...getOverrideProps(overrides, "approvalType")}
      >
        <option
          children="Loan"
          value="LOAN"
          {...getOverrideProps(overrides, "approvalTypeoption0")}
        ></option>
        <option
          children="Expense"
          value="EXPENSE"
          {...getOverrideProps(overrides, "approvalTypeoption1")}
        ></option>
        <option
          children="Application"
          value="APPLICATION"
          {...getOverrideProps(overrides, "approvalTypeoption2")}
        ></option>
        <option
          children="Credit score"
          value="CREDIT_SCORE"
          {...getOverrideProps(overrides, "approvalTypeoption3")}
        ></option>
        <option
          children="Money transaction"
          value="MONEY_TRANSACTION"
          {...getOverrideProps(overrides, "approvalTypeoption4")}
        ></option>
        <option
          children="Payment"
          value="PAYMENT"
          {...getOverrideProps(overrides, "approvalTypeoption5")}
        ></option>
      </SelectField>
      <TextField
        label="Record id"
        isRequired={true}
        isReadOnly={false}
        value={recordID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              approvalType,
              recordID: value,
              approvalDate,
              status,
              notes,
              customApprovalDetails,
            };
            const result = onChange(modelFields);
            value = result?.recordID ?? value;
          }
          if (errors.recordID?.hasError) {
            runValidationTasks("recordID", value);
          }
          setRecordID(value);
        }}
        onBlur={() => runValidationTasks("recordID", recordID)}
        errorMessage={errors.recordID?.errorMessage}
        hasError={errors.recordID?.hasError}
        {...getOverrideProps(overrides, "recordID")}
      ></TextField>
      <TextField
        label="Approval date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={approvalDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              approvalType,
              recordID,
              approvalDate: value,
              status,
              notes,
              customApprovalDetails,
            };
            const result = onChange(modelFields);
            value = result?.approvalDate ?? value;
          }
          if (errors.approvalDate?.hasError) {
            runValidationTasks("approvalDate", value);
          }
          setApprovalDate(value);
        }}
        onBlur={() => runValidationTasks("approvalDate", approvalDate)}
        errorMessage={errors.approvalDate?.errorMessage}
        hasError={errors.approvalDate?.hasError}
        {...getOverrideProps(overrides, "approvalDate")}
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
              approvalType,
              recordID,
              approvalDate,
              status: value,
              notes,
              customApprovalDetails,
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
              approvalType,
              recordID,
              approvalDate,
              status,
              notes: value,
              customApprovalDetails,
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
      <TextAreaField
        label="Custom approval details"
        isRequired={false}
        isReadOnly={false}
        value={customApprovalDetails}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              approvalType,
              recordID,
              approvalDate,
              status,
              notes,
              customApprovalDetails: value,
            };
            const result = onChange(modelFields);
            value = result?.customApprovalDetails ?? value;
          }
          if (errors.customApprovalDetails?.hasError) {
            runValidationTasks("customApprovalDetails", value);
          }
          setCustomApprovalDetails(value);
        }}
        onBlur={() =>
          runValidationTasks("customApprovalDetails", customApprovalDetails)
        }
        errorMessage={errors.customApprovalDetails?.errorMessage}
        hasError={errors.customApprovalDetails?.hasError}
        {...getOverrideProps(overrides, "customApprovalDetails")}
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
          isDisabled={!(idProp || approvalModelProp)}
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
              !(idProp || approvalModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
