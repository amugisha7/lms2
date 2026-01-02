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
  SwitchField,
  TextAreaField,
  TextField,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { createGuarantor } from "../graphql/mutations";
const client = generateClient();
export default function GuarantorCreateForm(props) {
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
    relationship: "",
    phoneNumber: "",
    email: "",
    address: "",
    customFieldsData: "",
    status: "",
    isExistingMember: false,
    memberID: "",
    lockedSavingsAmount: "",
    customGuarantorDetails: "",
  };
  const [name, setName] = React.useState(initialValues.name);
  const [relationship, setRelationship] = React.useState(
    initialValues.relationship
  );
  const [phoneNumber, setPhoneNumber] = React.useState(
    initialValues.phoneNumber
  );
  const [email, setEmail] = React.useState(initialValues.email);
  const [address, setAddress] = React.useState(initialValues.address);
  const [customFieldsData, setCustomFieldsData] = React.useState(
    initialValues.customFieldsData
  );
  const [status, setStatus] = React.useState(initialValues.status);
  const [isExistingMember, setIsExistingMember] = React.useState(
    initialValues.isExistingMember
  );
  const [memberID, setMemberID] = React.useState(initialValues.memberID);
  const [lockedSavingsAmount, setLockedSavingsAmount] = React.useState(
    initialValues.lockedSavingsAmount
  );
  const [customGuarantorDetails, setCustomGuarantorDetails] = React.useState(
    initialValues.customGuarantorDetails
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setName(initialValues.name);
    setRelationship(initialValues.relationship);
    setPhoneNumber(initialValues.phoneNumber);
    setEmail(initialValues.email);
    setAddress(initialValues.address);
    setCustomFieldsData(initialValues.customFieldsData);
    setStatus(initialValues.status);
    setIsExistingMember(initialValues.isExistingMember);
    setMemberID(initialValues.memberID);
    setLockedSavingsAmount(initialValues.lockedSavingsAmount);
    setCustomGuarantorDetails(initialValues.customGuarantorDetails);
    setErrors({});
  };
  const validations = {
    name: [],
    relationship: [],
    phoneNumber: [],
    email: [],
    address: [],
    customFieldsData: [{ type: "JSON" }],
    status: [],
    isExistingMember: [],
    memberID: [],
    lockedSavingsAmount: [],
    customGuarantorDetails: [{ type: "JSON" }],
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
          relationship,
          phoneNumber,
          email,
          address,
          customFieldsData,
          status,
          isExistingMember,
          memberID,
          lockedSavingsAmount,
          customGuarantorDetails,
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
            query: createGuarantor.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "GuarantorCreateForm")}
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
              relationship,
              phoneNumber,
              email,
              address,
              customFieldsData,
              status,
              isExistingMember,
              memberID,
              lockedSavingsAmount,
              customGuarantorDetails,
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
        label="Relationship"
        isRequired={false}
        isReadOnly={false}
        value={relationship}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              relationship: value,
              phoneNumber,
              email,
              address,
              customFieldsData,
              status,
              isExistingMember,
              memberID,
              lockedSavingsAmount,
              customGuarantorDetails,
            };
            const result = onChange(modelFields);
            value = result?.relationship ?? value;
          }
          if (errors.relationship?.hasError) {
            runValidationTasks("relationship", value);
          }
          setRelationship(value);
        }}
        onBlur={() => runValidationTasks("relationship", relationship)}
        errorMessage={errors.relationship?.errorMessage}
        hasError={errors.relationship?.hasError}
        {...getOverrideProps(overrides, "relationship")}
      ></TextField>
      <TextField
        label="Phone number"
        isRequired={false}
        isReadOnly={false}
        value={phoneNumber}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              relationship,
              phoneNumber: value,
              email,
              address,
              customFieldsData,
              status,
              isExistingMember,
              memberID,
              lockedSavingsAmount,
              customGuarantorDetails,
            };
            const result = onChange(modelFields);
            value = result?.phoneNumber ?? value;
          }
          if (errors.phoneNumber?.hasError) {
            runValidationTasks("phoneNumber", value);
          }
          setPhoneNumber(value);
        }}
        onBlur={() => runValidationTasks("phoneNumber", phoneNumber)}
        errorMessage={errors.phoneNumber?.errorMessage}
        hasError={errors.phoneNumber?.hasError}
        {...getOverrideProps(overrides, "phoneNumber")}
      ></TextField>
      <TextField
        label="Email"
        isRequired={false}
        isReadOnly={false}
        value={email}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              relationship,
              phoneNumber,
              email: value,
              address,
              customFieldsData,
              status,
              isExistingMember,
              memberID,
              lockedSavingsAmount,
              customGuarantorDetails,
            };
            const result = onChange(modelFields);
            value = result?.email ?? value;
          }
          if (errors.email?.hasError) {
            runValidationTasks("email", value);
          }
          setEmail(value);
        }}
        onBlur={() => runValidationTasks("email", email)}
        errorMessage={errors.email?.errorMessage}
        hasError={errors.email?.hasError}
        {...getOverrideProps(overrides, "email")}
      ></TextField>
      <TextField
        label="Address"
        isRequired={false}
        isReadOnly={false}
        value={address}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              relationship,
              phoneNumber,
              email,
              address: value,
              customFieldsData,
              status,
              isExistingMember,
              memberID,
              lockedSavingsAmount,
              customGuarantorDetails,
            };
            const result = onChange(modelFields);
            value = result?.address ?? value;
          }
          if (errors.address?.hasError) {
            runValidationTasks("address", value);
          }
          setAddress(value);
        }}
        onBlur={() => runValidationTasks("address", address)}
        errorMessage={errors.address?.errorMessage}
        hasError={errors.address?.hasError}
        {...getOverrideProps(overrides, "address")}
      ></TextField>
      <TextAreaField
        label="Custom fields data"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              relationship,
              phoneNumber,
              email,
              address,
              customFieldsData: value,
              status,
              isExistingMember,
              memberID,
              lockedSavingsAmount,
              customGuarantorDetails,
            };
            const result = onChange(modelFields);
            value = result?.customFieldsData ?? value;
          }
          if (errors.customFieldsData?.hasError) {
            runValidationTasks("customFieldsData", value);
          }
          setCustomFieldsData(value);
        }}
        onBlur={() => runValidationTasks("customFieldsData", customFieldsData)}
        errorMessage={errors.customFieldsData?.errorMessage}
        hasError={errors.customFieldsData?.hasError}
        {...getOverrideProps(overrides, "customFieldsData")}
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
              name,
              relationship,
              phoneNumber,
              email,
              address,
              customFieldsData,
              status: value,
              isExistingMember,
              memberID,
              lockedSavingsAmount,
              customGuarantorDetails,
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
      <SwitchField
        label="Is existing member"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isExistingMember}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              name,
              relationship,
              phoneNumber,
              email,
              address,
              customFieldsData,
              status,
              isExistingMember: value,
              memberID,
              lockedSavingsAmount,
              customGuarantorDetails,
            };
            const result = onChange(modelFields);
            value = result?.isExistingMember ?? value;
          }
          if (errors.isExistingMember?.hasError) {
            runValidationTasks("isExistingMember", value);
          }
          setIsExistingMember(value);
        }}
        onBlur={() => runValidationTasks("isExistingMember", isExistingMember)}
        errorMessage={errors.isExistingMember?.errorMessage}
        hasError={errors.isExistingMember?.hasError}
        {...getOverrideProps(overrides, "isExistingMember")}
      ></SwitchField>
      <TextField
        label="Member id"
        isRequired={false}
        isReadOnly={false}
        value={memberID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              relationship,
              phoneNumber,
              email,
              address,
              customFieldsData,
              status,
              isExistingMember,
              memberID: value,
              lockedSavingsAmount,
              customGuarantorDetails,
            };
            const result = onChange(modelFields);
            value = result?.memberID ?? value;
          }
          if (errors.memberID?.hasError) {
            runValidationTasks("memberID", value);
          }
          setMemberID(value);
        }}
        onBlur={() => runValidationTasks("memberID", memberID)}
        errorMessage={errors.memberID?.errorMessage}
        hasError={errors.memberID?.hasError}
        {...getOverrideProps(overrides, "memberID")}
      ></TextField>
      <TextField
        label="Locked savings amount"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={lockedSavingsAmount}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              relationship,
              phoneNumber,
              email,
              address,
              customFieldsData,
              status,
              isExistingMember,
              memberID,
              lockedSavingsAmount: value,
              customGuarantorDetails,
            };
            const result = onChange(modelFields);
            value = result?.lockedSavingsAmount ?? value;
          }
          if (errors.lockedSavingsAmount?.hasError) {
            runValidationTasks("lockedSavingsAmount", value);
          }
          setLockedSavingsAmount(value);
        }}
        onBlur={() =>
          runValidationTasks("lockedSavingsAmount", lockedSavingsAmount)
        }
        errorMessage={errors.lockedSavingsAmount?.errorMessage}
        hasError={errors.lockedSavingsAmount?.hasError}
        {...getOverrideProps(overrides, "lockedSavingsAmount")}
      ></TextField>
      <TextAreaField
        label="Custom guarantor details"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              relationship,
              phoneNumber,
              email,
              address,
              customFieldsData,
              status,
              isExistingMember,
              memberID,
              lockedSavingsAmount,
              customGuarantorDetails: value,
            };
            const result = onChange(modelFields);
            value = result?.customGuarantorDetails ?? value;
          }
          if (errors.customGuarantorDetails?.hasError) {
            runValidationTasks("customGuarantorDetails", value);
          }
          setCustomGuarantorDetails(value);
        }}
        onBlur={() =>
          runValidationTasks("customGuarantorDetails", customGuarantorDetails)
        }
        errorMessage={errors.customGuarantorDetails?.errorMessage}
        hasError={errors.customGuarantorDetails?.hasError}
        {...getOverrideProps(overrides, "customGuarantorDetails")}
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
