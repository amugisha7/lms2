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
import { getGuarantor } from "../graphql/queries";
import { updateGuarantor } from "../graphql/mutations";
const client = generateClient();
export default function GuarantorUpdateForm(props) {
  const {
    id: idProp,
    guarantor: guarantorModelProp,
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
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = guarantorRecord
      ? { ...initialValues, ...guarantorRecord }
      : initialValues;
    setName(cleanValues.name);
    setRelationship(cleanValues.relationship);
    setPhoneNumber(cleanValues.phoneNumber);
    setEmail(cleanValues.email);
    setAddress(cleanValues.address);
    setCustomFieldsData(
      typeof cleanValues.customFieldsData === "string" ||
        cleanValues.customFieldsData === null
        ? cleanValues.customFieldsData
        : JSON.stringify(cleanValues.customFieldsData)
    );
    setErrors({});
  };
  const [guarantorRecord, setGuarantorRecord] =
    React.useState(guarantorModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getGuarantor.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getGuarantor
        : guarantorModelProp;
      setGuarantorRecord(record);
    };
    queryData();
  }, [idProp, guarantorModelProp]);
  React.useEffect(resetStateValues, [guarantorRecord]);
  const validations = {
    name: [],
    relationship: [],
    phoneNumber: [],
    email: [],
    address: [],
    customFieldsData: [{ type: "JSON" }],
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
          name: name ?? null,
          relationship: relationship ?? null,
          phoneNumber: phoneNumber ?? null,
          email: email ?? null,
          address: address ?? null,
          customFieldsData: customFieldsData ?? null,
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
            query: updateGuarantor.replaceAll("__typename", ""),
            variables: {
              input: {
                id: guarantorRecord.id,
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
      {...getOverrideProps(overrides, "GuarantorUpdateForm")}
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
        value={customFieldsData}
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
          isDisabled={!(idProp || guarantorModelProp)}
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
              !(idProp || guarantorModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
