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
import { getUser } from "../graphql/queries";
import { updateUser } from "../graphql/mutations";
const client = generateClient();
export default function UserUpdateForm(props) {
  const {
    id: idProp,
    user: userModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    firstName: "",
    lastName: "",
    middleName: "",
    dateOfBirth: "",
    phoneNumber1: "",
    phoneNumber2: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    stateProvince: "",
    postalCode: "",
    nationalID: "",
    passportNumber: "",
    nationality: "",
    status: "",
    userType: "",
    userPermissions: "",
    description: "",
    customFieldsData: "",
    userDocuments: "",
    customUserDetails: "",
  };
  const [firstName, setFirstName] = React.useState(initialValues.firstName);
  const [lastName, setLastName] = React.useState(initialValues.lastName);
  const [middleName, setMiddleName] = React.useState(initialValues.middleName);
  const [dateOfBirth, setDateOfBirth] = React.useState(
    initialValues.dateOfBirth
  );
  const [phoneNumber1, setPhoneNumber1] = React.useState(
    initialValues.phoneNumber1
  );
  const [phoneNumber2, setPhoneNumber2] = React.useState(
    initialValues.phoneNumber2
  );
  const [email, setEmail] = React.useState(initialValues.email);
  const [addressLine1, setAddressLine1] = React.useState(
    initialValues.addressLine1
  );
  const [addressLine2, setAddressLine2] = React.useState(
    initialValues.addressLine2
  );
  const [city, setCity] = React.useState(initialValues.city);
  const [stateProvince, setStateProvince] = React.useState(
    initialValues.stateProvince
  );
  const [postalCode, setPostalCode] = React.useState(initialValues.postalCode);
  const [nationalID, setNationalID] = React.useState(initialValues.nationalID);
  const [passportNumber, setPassportNumber] = React.useState(
    initialValues.passportNumber
  );
  const [nationality, setNationality] = React.useState(
    initialValues.nationality
  );
  const [status, setStatus] = React.useState(initialValues.status);
  const [userType, setUserType] = React.useState(initialValues.userType);
  const [userPermissions, setUserPermissions] = React.useState(
    initialValues.userPermissions
  );
  const [description, setDescription] = React.useState(
    initialValues.description
  );
  const [customFieldsData, setCustomFieldsData] = React.useState(
    initialValues.customFieldsData
  );
  const [userDocuments, setUserDocuments] = React.useState(
    initialValues.userDocuments
  );
  const [customUserDetails, setCustomUserDetails] = React.useState(
    initialValues.customUserDetails
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = userRecord
      ? { ...initialValues, ...userRecord }
      : initialValues;
    setFirstName(cleanValues.firstName);
    setLastName(cleanValues.lastName);
    setMiddleName(cleanValues.middleName);
    setDateOfBirth(cleanValues.dateOfBirth);
    setPhoneNumber1(cleanValues.phoneNumber1);
    setPhoneNumber2(cleanValues.phoneNumber2);
    setEmail(cleanValues.email);
    setAddressLine1(cleanValues.addressLine1);
    setAddressLine2(cleanValues.addressLine2);
    setCity(cleanValues.city);
    setStateProvince(cleanValues.stateProvince);
    setPostalCode(cleanValues.postalCode);
    setNationalID(cleanValues.nationalID);
    setPassportNumber(cleanValues.passportNumber);
    setNationality(cleanValues.nationality);
    setStatus(cleanValues.status);
    setUserType(cleanValues.userType);
    setUserPermissions(
      typeof cleanValues.userPermissions === "string" ||
        cleanValues.userPermissions === null
        ? cleanValues.userPermissions
        : JSON.stringify(cleanValues.userPermissions)
    );
    setDescription(cleanValues.description);
    setCustomFieldsData(
      typeof cleanValues.customFieldsData === "string" ||
        cleanValues.customFieldsData === null
        ? cleanValues.customFieldsData
        : JSON.stringify(cleanValues.customFieldsData)
    );
    setUserDocuments(
      typeof cleanValues.userDocuments === "string" ||
        cleanValues.userDocuments === null
        ? cleanValues.userDocuments
        : JSON.stringify(cleanValues.userDocuments)
    );
    setCustomUserDetails(
      typeof cleanValues.customUserDetails === "string" ||
        cleanValues.customUserDetails === null
        ? cleanValues.customUserDetails
        : JSON.stringify(cleanValues.customUserDetails)
    );
    setErrors({});
  };
  const [userRecord, setUserRecord] = React.useState(userModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getUser.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getUser
        : userModelProp;
      setUserRecord(record);
    };
    queryData();
  }, [idProp, userModelProp]);
  React.useEffect(resetStateValues, [userRecord]);
  const validations = {
    firstName: [],
    lastName: [],
    middleName: [],
    dateOfBirth: [],
    phoneNumber1: [],
    phoneNumber2: [],
    email: [],
    addressLine1: [],
    addressLine2: [],
    city: [],
    stateProvince: [],
    postalCode: [],
    nationalID: [],
    passportNumber: [],
    nationality: [],
    status: [],
    userType: [],
    userPermissions: [{ type: "JSON" }],
    description: [],
    customFieldsData: [{ type: "JSON" }],
    userDocuments: [{ type: "JSON" }],
    customUserDetails: [{ type: "JSON" }],
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
          firstName: firstName ?? null,
          lastName: lastName ?? null,
          middleName: middleName ?? null,
          dateOfBirth: dateOfBirth ?? null,
          phoneNumber1: phoneNumber1 ?? null,
          phoneNumber2: phoneNumber2 ?? null,
          email: email ?? null,
          addressLine1: addressLine1 ?? null,
          addressLine2: addressLine2 ?? null,
          city: city ?? null,
          stateProvince: stateProvince ?? null,
          postalCode: postalCode ?? null,
          nationalID: nationalID ?? null,
          passportNumber: passportNumber ?? null,
          nationality: nationality ?? null,
          status: status ?? null,
          userType: userType ?? null,
          userPermissions: userPermissions ?? null,
          description: description ?? null,
          customFieldsData: customFieldsData ?? null,
          userDocuments: userDocuments ?? null,
          customUserDetails: customUserDetails ?? null,
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
            query: updateUser.replaceAll("__typename", ""),
            variables: {
              input: {
                id: userRecord.id,
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
      {...getOverrideProps(overrides, "UserUpdateForm")}
      {...rest}
    >
      <TextField
        label="First name"
        isRequired={false}
        isReadOnly={false}
        value={firstName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName: value,
              lastName,
              middleName,
              dateOfBirth,
              phoneNumber1,
              phoneNumber2,
              email,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nationalID,
              passportNumber,
              nationality,
              status,
              userType,
              userPermissions,
              description,
              customFieldsData,
              userDocuments,
              customUserDetails,
            };
            const result = onChange(modelFields);
            value = result?.firstName ?? value;
          }
          if (errors.firstName?.hasError) {
            runValidationTasks("firstName", value);
          }
          setFirstName(value);
        }}
        onBlur={() => runValidationTasks("firstName", firstName)}
        errorMessage={errors.firstName?.errorMessage}
        hasError={errors.firstName?.hasError}
        {...getOverrideProps(overrides, "firstName")}
      ></TextField>
      <TextField
        label="Last name"
        isRequired={false}
        isReadOnly={false}
        value={lastName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName: value,
              middleName,
              dateOfBirth,
              phoneNumber1,
              phoneNumber2,
              email,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nationalID,
              passportNumber,
              nationality,
              status,
              userType,
              userPermissions,
              description,
              customFieldsData,
              userDocuments,
              customUserDetails,
            };
            const result = onChange(modelFields);
            value = result?.lastName ?? value;
          }
          if (errors.lastName?.hasError) {
            runValidationTasks("lastName", value);
          }
          setLastName(value);
        }}
        onBlur={() => runValidationTasks("lastName", lastName)}
        errorMessage={errors.lastName?.errorMessage}
        hasError={errors.lastName?.hasError}
        {...getOverrideProps(overrides, "lastName")}
      ></TextField>
      <TextField
        label="Middle name"
        isRequired={false}
        isReadOnly={false}
        value={middleName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              middleName: value,
              dateOfBirth,
              phoneNumber1,
              phoneNumber2,
              email,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nationalID,
              passportNumber,
              nationality,
              status,
              userType,
              userPermissions,
              description,
              customFieldsData,
              userDocuments,
              customUserDetails,
            };
            const result = onChange(modelFields);
            value = result?.middleName ?? value;
          }
          if (errors.middleName?.hasError) {
            runValidationTasks("middleName", value);
          }
          setMiddleName(value);
        }}
        onBlur={() => runValidationTasks("middleName", middleName)}
        errorMessage={errors.middleName?.errorMessage}
        hasError={errors.middleName?.hasError}
        {...getOverrideProps(overrides, "middleName")}
      ></TextField>
      <TextField
        label="Date of birth"
        isRequired={false}
        isReadOnly={false}
        value={dateOfBirth}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              middleName,
              dateOfBirth: value,
              phoneNumber1,
              phoneNumber2,
              email,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nationalID,
              passportNumber,
              nationality,
              status,
              userType,
              userPermissions,
              description,
              customFieldsData,
              userDocuments,
              customUserDetails,
            };
            const result = onChange(modelFields);
            value = result?.dateOfBirth ?? value;
          }
          if (errors.dateOfBirth?.hasError) {
            runValidationTasks("dateOfBirth", value);
          }
          setDateOfBirth(value);
        }}
        onBlur={() => runValidationTasks("dateOfBirth", dateOfBirth)}
        errorMessage={errors.dateOfBirth?.errorMessage}
        hasError={errors.dateOfBirth?.hasError}
        {...getOverrideProps(overrides, "dateOfBirth")}
      ></TextField>
      <TextField
        label="Phone number1"
        isRequired={false}
        isReadOnly={false}
        value={phoneNumber1}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              middleName,
              dateOfBirth,
              phoneNumber1: value,
              phoneNumber2,
              email,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nationalID,
              passportNumber,
              nationality,
              status,
              userType,
              userPermissions,
              description,
              customFieldsData,
              userDocuments,
              customUserDetails,
            };
            const result = onChange(modelFields);
            value = result?.phoneNumber1 ?? value;
          }
          if (errors.phoneNumber1?.hasError) {
            runValidationTasks("phoneNumber1", value);
          }
          setPhoneNumber1(value);
        }}
        onBlur={() => runValidationTasks("phoneNumber1", phoneNumber1)}
        errorMessage={errors.phoneNumber1?.errorMessage}
        hasError={errors.phoneNumber1?.hasError}
        {...getOverrideProps(overrides, "phoneNumber1")}
      ></TextField>
      <TextField
        label="Phone number2"
        isRequired={false}
        isReadOnly={false}
        value={phoneNumber2}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              middleName,
              dateOfBirth,
              phoneNumber1,
              phoneNumber2: value,
              email,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nationalID,
              passportNumber,
              nationality,
              status,
              userType,
              userPermissions,
              description,
              customFieldsData,
              userDocuments,
              customUserDetails,
            };
            const result = onChange(modelFields);
            value = result?.phoneNumber2 ?? value;
          }
          if (errors.phoneNumber2?.hasError) {
            runValidationTasks("phoneNumber2", value);
          }
          setPhoneNumber2(value);
        }}
        onBlur={() => runValidationTasks("phoneNumber2", phoneNumber2)}
        errorMessage={errors.phoneNumber2?.errorMessage}
        hasError={errors.phoneNumber2?.hasError}
        {...getOverrideProps(overrides, "phoneNumber2")}
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
              firstName,
              lastName,
              middleName,
              dateOfBirth,
              phoneNumber1,
              phoneNumber2,
              email: value,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nationalID,
              passportNumber,
              nationality,
              status,
              userType,
              userPermissions,
              description,
              customFieldsData,
              userDocuments,
              customUserDetails,
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
        label="Address line1"
        isRequired={false}
        isReadOnly={false}
        value={addressLine1}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              middleName,
              dateOfBirth,
              phoneNumber1,
              phoneNumber2,
              email,
              addressLine1: value,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nationalID,
              passportNumber,
              nationality,
              status,
              userType,
              userPermissions,
              description,
              customFieldsData,
              userDocuments,
              customUserDetails,
            };
            const result = onChange(modelFields);
            value = result?.addressLine1 ?? value;
          }
          if (errors.addressLine1?.hasError) {
            runValidationTasks("addressLine1", value);
          }
          setAddressLine1(value);
        }}
        onBlur={() => runValidationTasks("addressLine1", addressLine1)}
        errorMessage={errors.addressLine1?.errorMessage}
        hasError={errors.addressLine1?.hasError}
        {...getOverrideProps(overrides, "addressLine1")}
      ></TextField>
      <TextField
        label="Address line2"
        isRequired={false}
        isReadOnly={false}
        value={addressLine2}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              middleName,
              dateOfBirth,
              phoneNumber1,
              phoneNumber2,
              email,
              addressLine1,
              addressLine2: value,
              city,
              stateProvince,
              postalCode,
              nationalID,
              passportNumber,
              nationality,
              status,
              userType,
              userPermissions,
              description,
              customFieldsData,
              userDocuments,
              customUserDetails,
            };
            const result = onChange(modelFields);
            value = result?.addressLine2 ?? value;
          }
          if (errors.addressLine2?.hasError) {
            runValidationTasks("addressLine2", value);
          }
          setAddressLine2(value);
        }}
        onBlur={() => runValidationTasks("addressLine2", addressLine2)}
        errorMessage={errors.addressLine2?.errorMessage}
        hasError={errors.addressLine2?.hasError}
        {...getOverrideProps(overrides, "addressLine2")}
      ></TextField>
      <TextField
        label="City"
        isRequired={false}
        isReadOnly={false}
        value={city}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              middleName,
              dateOfBirth,
              phoneNumber1,
              phoneNumber2,
              email,
              addressLine1,
              addressLine2,
              city: value,
              stateProvince,
              postalCode,
              nationalID,
              passportNumber,
              nationality,
              status,
              userType,
              userPermissions,
              description,
              customFieldsData,
              userDocuments,
              customUserDetails,
            };
            const result = onChange(modelFields);
            value = result?.city ?? value;
          }
          if (errors.city?.hasError) {
            runValidationTasks("city", value);
          }
          setCity(value);
        }}
        onBlur={() => runValidationTasks("city", city)}
        errorMessage={errors.city?.errorMessage}
        hasError={errors.city?.hasError}
        {...getOverrideProps(overrides, "city")}
      ></TextField>
      <TextField
        label="State province"
        isRequired={false}
        isReadOnly={false}
        value={stateProvince}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              middleName,
              dateOfBirth,
              phoneNumber1,
              phoneNumber2,
              email,
              addressLine1,
              addressLine2,
              city,
              stateProvince: value,
              postalCode,
              nationalID,
              passportNumber,
              nationality,
              status,
              userType,
              userPermissions,
              description,
              customFieldsData,
              userDocuments,
              customUserDetails,
            };
            const result = onChange(modelFields);
            value = result?.stateProvince ?? value;
          }
          if (errors.stateProvince?.hasError) {
            runValidationTasks("stateProvince", value);
          }
          setStateProvince(value);
        }}
        onBlur={() => runValidationTasks("stateProvince", stateProvince)}
        errorMessage={errors.stateProvince?.errorMessage}
        hasError={errors.stateProvince?.hasError}
        {...getOverrideProps(overrides, "stateProvince")}
      ></TextField>
      <TextField
        label="Postal code"
        isRequired={false}
        isReadOnly={false}
        value={postalCode}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              middleName,
              dateOfBirth,
              phoneNumber1,
              phoneNumber2,
              email,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode: value,
              nationalID,
              passportNumber,
              nationality,
              status,
              userType,
              userPermissions,
              description,
              customFieldsData,
              userDocuments,
              customUserDetails,
            };
            const result = onChange(modelFields);
            value = result?.postalCode ?? value;
          }
          if (errors.postalCode?.hasError) {
            runValidationTasks("postalCode", value);
          }
          setPostalCode(value);
        }}
        onBlur={() => runValidationTasks("postalCode", postalCode)}
        errorMessage={errors.postalCode?.errorMessage}
        hasError={errors.postalCode?.hasError}
        {...getOverrideProps(overrides, "postalCode")}
      ></TextField>
      <TextField
        label="National id"
        isRequired={false}
        isReadOnly={false}
        value={nationalID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              middleName,
              dateOfBirth,
              phoneNumber1,
              phoneNumber2,
              email,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nationalID: value,
              passportNumber,
              nationality,
              status,
              userType,
              userPermissions,
              description,
              customFieldsData,
              userDocuments,
              customUserDetails,
            };
            const result = onChange(modelFields);
            value = result?.nationalID ?? value;
          }
          if (errors.nationalID?.hasError) {
            runValidationTasks("nationalID", value);
          }
          setNationalID(value);
        }}
        onBlur={() => runValidationTasks("nationalID", nationalID)}
        errorMessage={errors.nationalID?.errorMessage}
        hasError={errors.nationalID?.hasError}
        {...getOverrideProps(overrides, "nationalID")}
      ></TextField>
      <TextField
        label="Passport number"
        isRequired={false}
        isReadOnly={false}
        value={passportNumber}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              middleName,
              dateOfBirth,
              phoneNumber1,
              phoneNumber2,
              email,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nationalID,
              passportNumber: value,
              nationality,
              status,
              userType,
              userPermissions,
              description,
              customFieldsData,
              userDocuments,
              customUserDetails,
            };
            const result = onChange(modelFields);
            value = result?.passportNumber ?? value;
          }
          if (errors.passportNumber?.hasError) {
            runValidationTasks("passportNumber", value);
          }
          setPassportNumber(value);
        }}
        onBlur={() => runValidationTasks("passportNumber", passportNumber)}
        errorMessage={errors.passportNumber?.errorMessage}
        hasError={errors.passportNumber?.hasError}
        {...getOverrideProps(overrides, "passportNumber")}
      ></TextField>
      <TextField
        label="Nationality"
        isRequired={false}
        isReadOnly={false}
        value={nationality}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              middleName,
              dateOfBirth,
              phoneNumber1,
              phoneNumber2,
              email,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nationalID,
              passportNumber,
              nationality: value,
              status,
              userType,
              userPermissions,
              description,
              customFieldsData,
              userDocuments,
              customUserDetails,
            };
            const result = onChange(modelFields);
            value = result?.nationality ?? value;
          }
          if (errors.nationality?.hasError) {
            runValidationTasks("nationality", value);
          }
          setNationality(value);
        }}
        onBlur={() => runValidationTasks("nationality", nationality)}
        errorMessage={errors.nationality?.errorMessage}
        hasError={errors.nationality?.hasError}
        {...getOverrideProps(overrides, "nationality")}
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
              firstName,
              lastName,
              middleName,
              dateOfBirth,
              phoneNumber1,
              phoneNumber2,
              email,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nationalID,
              passportNumber,
              nationality,
              status: value,
              userType,
              userPermissions,
              description,
              customFieldsData,
              userDocuments,
              customUserDetails,
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
        label="User type"
        isRequired={false}
        isReadOnly={false}
        value={userType}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              middleName,
              dateOfBirth,
              phoneNumber1,
              phoneNumber2,
              email,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nationalID,
              passportNumber,
              nationality,
              status,
              userType: value,
              userPermissions,
              description,
              customFieldsData,
              userDocuments,
              customUserDetails,
            };
            const result = onChange(modelFields);
            value = result?.userType ?? value;
          }
          if (errors.userType?.hasError) {
            runValidationTasks("userType", value);
          }
          setUserType(value);
        }}
        onBlur={() => runValidationTasks("userType", userType)}
        errorMessage={errors.userType?.errorMessage}
        hasError={errors.userType?.hasError}
        {...getOverrideProps(overrides, "userType")}
      ></TextField>
      <TextAreaField
        label="User permissions"
        isRequired={false}
        isReadOnly={false}
        value={userPermissions}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              middleName,
              dateOfBirth,
              phoneNumber1,
              phoneNumber2,
              email,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nationalID,
              passportNumber,
              nationality,
              status,
              userType,
              userPermissions: value,
              description,
              customFieldsData,
              userDocuments,
              customUserDetails,
            };
            const result = onChange(modelFields);
            value = result?.userPermissions ?? value;
          }
          if (errors.userPermissions?.hasError) {
            runValidationTasks("userPermissions", value);
          }
          setUserPermissions(value);
        }}
        onBlur={() => runValidationTasks("userPermissions", userPermissions)}
        errorMessage={errors.userPermissions?.errorMessage}
        hasError={errors.userPermissions?.hasError}
        {...getOverrideProps(overrides, "userPermissions")}
      ></TextAreaField>
      <TextField
        label="Description"
        isRequired={false}
        isReadOnly={false}
        value={description}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              middleName,
              dateOfBirth,
              phoneNumber1,
              phoneNumber2,
              email,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nationalID,
              passportNumber,
              nationality,
              status,
              userType,
              userPermissions,
              description: value,
              customFieldsData,
              userDocuments,
              customUserDetails,
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
      <TextAreaField
        label="Custom fields data"
        isRequired={false}
        isReadOnly={false}
        value={customFieldsData}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              middleName,
              dateOfBirth,
              phoneNumber1,
              phoneNumber2,
              email,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nationalID,
              passportNumber,
              nationality,
              status,
              userType,
              userPermissions,
              description,
              customFieldsData: value,
              userDocuments,
              customUserDetails,
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
      <TextAreaField
        label="User documents"
        isRequired={false}
        isReadOnly={false}
        value={userDocuments}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              middleName,
              dateOfBirth,
              phoneNumber1,
              phoneNumber2,
              email,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nationalID,
              passportNumber,
              nationality,
              status,
              userType,
              userPermissions,
              description,
              customFieldsData,
              userDocuments: value,
              customUserDetails,
            };
            const result = onChange(modelFields);
            value = result?.userDocuments ?? value;
          }
          if (errors.userDocuments?.hasError) {
            runValidationTasks("userDocuments", value);
          }
          setUserDocuments(value);
        }}
        onBlur={() => runValidationTasks("userDocuments", userDocuments)}
        errorMessage={errors.userDocuments?.errorMessage}
        hasError={errors.userDocuments?.hasError}
        {...getOverrideProps(overrides, "userDocuments")}
      ></TextAreaField>
      <TextAreaField
        label="Custom user details"
        isRequired={false}
        isReadOnly={false}
        value={customUserDetails}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              middleName,
              dateOfBirth,
              phoneNumber1,
              phoneNumber2,
              email,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nationalID,
              passportNumber,
              nationality,
              status,
              userType,
              userPermissions,
              description,
              customFieldsData,
              userDocuments,
              customUserDetails: value,
            };
            const result = onChange(modelFields);
            value = result?.customUserDetails ?? value;
          }
          if (errors.customUserDetails?.hasError) {
            runValidationTasks("customUserDetails", value);
          }
          setCustomUserDetails(value);
        }}
        onBlur={() =>
          runValidationTasks("customUserDetails", customUserDetails)
        }
        errorMessage={errors.customUserDetails?.errorMessage}
        hasError={errors.customUserDetails?.hasError}
        {...getOverrideProps(overrides, "customUserDetails")}
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
          isDisabled={!(idProp || userModelProp)}
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
              !(idProp || userModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
