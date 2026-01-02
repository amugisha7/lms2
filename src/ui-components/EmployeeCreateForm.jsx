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
import { createEmployee } from "../graphql/mutations";
const client = generateClient();
export default function EmployeeCreateForm(props) {
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
    firstName: "",
    lastName: "",
    middleName: "",
    dateOfBirth: "",
    phoneNumber1: "",
    phoneNumber2: "",
    email: "",
    title: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    stateProvince: "",
    postalCode: "",
    nextOfKinName: "",
    nextOfKinPhoneNumber: "",
    nextOfKinEmail: "",
    nextOfKinRelationship: "",
    nextOfKinAddress: "",
    nationalID: "",
    passportNumber: "",
    nationality: "",
    status: "",
    employmentType: "",
    employmentStatus: "",
    employmentStartDate: "",
    employmentEndDate: "",
    employmentPosition: "",
    employmentDepartment: "",
    employmentGrade: "",
    employmentLocation: "",
    grossSalary: "",
    bankAccountNumber: "",
    bankName: "",
    bankBranchCode: "",
    socialSecurityNumber: "",
    taxIdentificationNumber: "",
    taxExemptStatus: "",
    customFieldsData: "",
    relatedUserID: "",
    relatedBorrowerID: "",
    customEmployeeDetails: "",
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
  const [title, setTitle] = React.useState(initialValues.title);
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
  const [nextOfKinName, setNextOfKinName] = React.useState(
    initialValues.nextOfKinName
  );
  const [nextOfKinPhoneNumber, setNextOfKinPhoneNumber] = React.useState(
    initialValues.nextOfKinPhoneNumber
  );
  const [nextOfKinEmail, setNextOfKinEmail] = React.useState(
    initialValues.nextOfKinEmail
  );
  const [nextOfKinRelationship, setNextOfKinRelationship] = React.useState(
    initialValues.nextOfKinRelationship
  );
  const [nextOfKinAddress, setNextOfKinAddress] = React.useState(
    initialValues.nextOfKinAddress
  );
  const [nationalID, setNationalID] = React.useState(initialValues.nationalID);
  const [passportNumber, setPassportNumber] = React.useState(
    initialValues.passportNumber
  );
  const [nationality, setNationality] = React.useState(
    initialValues.nationality
  );
  const [status, setStatus] = React.useState(initialValues.status);
  const [employmentType, setEmploymentType] = React.useState(
    initialValues.employmentType
  );
  const [employmentStatus, setEmploymentStatus] = React.useState(
    initialValues.employmentStatus
  );
  const [employmentStartDate, setEmploymentStartDate] = React.useState(
    initialValues.employmentStartDate
  );
  const [employmentEndDate, setEmploymentEndDate] = React.useState(
    initialValues.employmentEndDate
  );
  const [employmentPosition, setEmploymentPosition] = React.useState(
    initialValues.employmentPosition
  );
  const [employmentDepartment, setEmploymentDepartment] = React.useState(
    initialValues.employmentDepartment
  );
  const [employmentGrade, setEmploymentGrade] = React.useState(
    initialValues.employmentGrade
  );
  const [employmentLocation, setEmploymentLocation] = React.useState(
    initialValues.employmentLocation
  );
  const [grossSalary, setGrossSalary] = React.useState(
    initialValues.grossSalary
  );
  const [bankAccountNumber, setBankAccountNumber] = React.useState(
    initialValues.bankAccountNumber
  );
  const [bankName, setBankName] = React.useState(initialValues.bankName);
  const [bankBranchCode, setBankBranchCode] = React.useState(
    initialValues.bankBranchCode
  );
  const [socialSecurityNumber, setSocialSecurityNumber] = React.useState(
    initialValues.socialSecurityNumber
  );
  const [taxIdentificationNumber, setTaxIdentificationNumber] = React.useState(
    initialValues.taxIdentificationNumber
  );
  const [taxExemptStatus, setTaxExemptStatus] = React.useState(
    initialValues.taxExemptStatus
  );
  const [customFieldsData, setCustomFieldsData] = React.useState(
    initialValues.customFieldsData
  );
  const [relatedUserID, setRelatedUserID] = React.useState(
    initialValues.relatedUserID
  );
  const [relatedBorrowerID, setRelatedBorrowerID] = React.useState(
    initialValues.relatedBorrowerID
  );
  const [customEmployeeDetails, setCustomEmployeeDetails] = React.useState(
    initialValues.customEmployeeDetails
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setFirstName(initialValues.firstName);
    setLastName(initialValues.lastName);
    setMiddleName(initialValues.middleName);
    setDateOfBirth(initialValues.dateOfBirth);
    setPhoneNumber1(initialValues.phoneNumber1);
    setPhoneNumber2(initialValues.phoneNumber2);
    setEmail(initialValues.email);
    setTitle(initialValues.title);
    setAddressLine1(initialValues.addressLine1);
    setAddressLine2(initialValues.addressLine2);
    setCity(initialValues.city);
    setStateProvince(initialValues.stateProvince);
    setPostalCode(initialValues.postalCode);
    setNextOfKinName(initialValues.nextOfKinName);
    setNextOfKinPhoneNumber(initialValues.nextOfKinPhoneNumber);
    setNextOfKinEmail(initialValues.nextOfKinEmail);
    setNextOfKinRelationship(initialValues.nextOfKinRelationship);
    setNextOfKinAddress(initialValues.nextOfKinAddress);
    setNationalID(initialValues.nationalID);
    setPassportNumber(initialValues.passportNumber);
    setNationality(initialValues.nationality);
    setStatus(initialValues.status);
    setEmploymentType(initialValues.employmentType);
    setEmploymentStatus(initialValues.employmentStatus);
    setEmploymentStartDate(initialValues.employmentStartDate);
    setEmploymentEndDate(initialValues.employmentEndDate);
    setEmploymentPosition(initialValues.employmentPosition);
    setEmploymentDepartment(initialValues.employmentDepartment);
    setEmploymentGrade(initialValues.employmentGrade);
    setEmploymentLocation(initialValues.employmentLocation);
    setGrossSalary(initialValues.grossSalary);
    setBankAccountNumber(initialValues.bankAccountNumber);
    setBankName(initialValues.bankName);
    setBankBranchCode(initialValues.bankBranchCode);
    setSocialSecurityNumber(initialValues.socialSecurityNumber);
    setTaxIdentificationNumber(initialValues.taxIdentificationNumber);
    setTaxExemptStatus(initialValues.taxExemptStatus);
    setCustomFieldsData(initialValues.customFieldsData);
    setRelatedUserID(initialValues.relatedUserID);
    setRelatedBorrowerID(initialValues.relatedBorrowerID);
    setCustomEmployeeDetails(initialValues.customEmployeeDetails);
    setErrors({});
  };
  const validations = {
    firstName: [],
    lastName: [],
    middleName: [],
    dateOfBirth: [],
    phoneNumber1: [],
    phoneNumber2: [],
    email: [],
    title: [],
    addressLine1: [],
    addressLine2: [],
    city: [],
    stateProvince: [],
    postalCode: [],
    nextOfKinName: [],
    nextOfKinPhoneNumber: [],
    nextOfKinEmail: [],
    nextOfKinRelationship: [],
    nextOfKinAddress: [],
    nationalID: [],
    passportNumber: [],
    nationality: [],
    status: [],
    employmentType: [],
    employmentStatus: [],
    employmentStartDate: [],
    employmentEndDate: [],
    employmentPosition: [],
    employmentDepartment: [],
    employmentGrade: [],
    employmentLocation: [],
    grossSalary: [],
    bankAccountNumber: [],
    bankName: [],
    bankBranchCode: [],
    socialSecurityNumber: [],
    taxIdentificationNumber: [],
    taxExemptStatus: [],
    customFieldsData: [{ type: "JSON" }],
    relatedUserID: [],
    relatedBorrowerID: [],
    customEmployeeDetails: [{ type: "JSON" }],
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
          firstName,
          lastName,
          middleName,
          dateOfBirth,
          phoneNumber1,
          phoneNumber2,
          email,
          title,
          addressLine1,
          addressLine2,
          city,
          stateProvince,
          postalCode,
          nextOfKinName,
          nextOfKinPhoneNumber,
          nextOfKinEmail,
          nextOfKinRelationship,
          nextOfKinAddress,
          nationalID,
          passportNumber,
          nationality,
          status,
          employmentType,
          employmentStatus,
          employmentStartDate,
          employmentEndDate,
          employmentPosition,
          employmentDepartment,
          employmentGrade,
          employmentLocation,
          grossSalary,
          bankAccountNumber,
          bankName,
          bankBranchCode,
          socialSecurityNumber,
          taxIdentificationNumber,
          taxExemptStatus,
          customFieldsData,
          relatedUserID,
          relatedBorrowerID,
          customEmployeeDetails,
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
            query: createEmployee.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "EmployeeCreateForm")}
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
              title,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID,
              passportNumber,
              nationality,
              status,
              employmentType,
              employmentStatus,
              employmentStartDate,
              employmentEndDate,
              employmentPosition,
              employmentDepartment,
              employmentGrade,
              employmentLocation,
              grossSalary,
              bankAccountNumber,
              bankName,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails,
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
              title,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID,
              passportNumber,
              nationality,
              status,
              employmentType,
              employmentStatus,
              employmentStartDate,
              employmentEndDate,
              employmentPosition,
              employmentDepartment,
              employmentGrade,
              employmentLocation,
              grossSalary,
              bankAccountNumber,
              bankName,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails,
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
              title,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID,
              passportNumber,
              nationality,
              status,
              employmentType,
              employmentStatus,
              employmentStartDate,
              employmentEndDate,
              employmentPosition,
              employmentDepartment,
              employmentGrade,
              employmentLocation,
              grossSalary,
              bankAccountNumber,
              bankName,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails,
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
              title,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID,
              passportNumber,
              nationality,
              status,
              employmentType,
              employmentStatus,
              employmentStartDate,
              employmentEndDate,
              employmentPosition,
              employmentDepartment,
              employmentGrade,
              employmentLocation,
              grossSalary,
              bankAccountNumber,
              bankName,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails,
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
              title,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID,
              passportNumber,
              nationality,
              status,
              employmentType,
              employmentStatus,
              employmentStartDate,
              employmentEndDate,
              employmentPosition,
              employmentDepartment,
              employmentGrade,
              employmentLocation,
              grossSalary,
              bankAccountNumber,
              bankName,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails,
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
              title,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID,
              passportNumber,
              nationality,
              status,
              employmentType,
              employmentStatus,
              employmentStartDate,
              employmentEndDate,
              employmentPosition,
              employmentDepartment,
              employmentGrade,
              employmentLocation,
              grossSalary,
              bankAccountNumber,
              bankName,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails,
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
              title,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID,
              passportNumber,
              nationality,
              status,
              employmentType,
              employmentStatus,
              employmentStartDate,
              employmentEndDate,
              employmentPosition,
              employmentDepartment,
              employmentGrade,
              employmentLocation,
              grossSalary,
              bankAccountNumber,
              bankName,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails,
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
        label="Title"
        isRequired={false}
        isReadOnly={false}
        value={title}
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
              title: value,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID,
              passportNumber,
              nationality,
              status,
              employmentType,
              employmentStatus,
              employmentStartDate,
              employmentEndDate,
              employmentPosition,
              employmentDepartment,
              employmentGrade,
              employmentLocation,
              grossSalary,
              bankAccountNumber,
              bankName,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails,
            };
            const result = onChange(modelFields);
            value = result?.title ?? value;
          }
          if (errors.title?.hasError) {
            runValidationTasks("title", value);
          }
          setTitle(value);
        }}
        onBlur={() => runValidationTasks("title", title)}
        errorMessage={errors.title?.errorMessage}
        hasError={errors.title?.hasError}
        {...getOverrideProps(overrides, "title")}
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
              title,
              addressLine1: value,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID,
              passportNumber,
              nationality,
              status,
              employmentType,
              employmentStatus,
              employmentStartDate,
              employmentEndDate,
              employmentPosition,
              employmentDepartment,
              employmentGrade,
              employmentLocation,
              grossSalary,
              bankAccountNumber,
              bankName,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails,
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
              title,
              addressLine1,
              addressLine2: value,
              city,
              stateProvince,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID,
              passportNumber,
              nationality,
              status,
              employmentType,
              employmentStatus,
              employmentStartDate,
              employmentEndDate,
              employmentPosition,
              employmentDepartment,
              employmentGrade,
              employmentLocation,
              grossSalary,
              bankAccountNumber,
              bankName,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails,
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
              title,
              addressLine1,
              addressLine2,
              city: value,
              stateProvince,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID,
              passportNumber,
              nationality,
              status,
              employmentType,
              employmentStatus,
              employmentStartDate,
              employmentEndDate,
              employmentPosition,
              employmentDepartment,
              employmentGrade,
              employmentLocation,
              grossSalary,
              bankAccountNumber,
              bankName,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails,
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
              title,
              addressLine1,
              addressLine2,
              city,
              stateProvince: value,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID,
              passportNumber,
              nationality,
              status,
              employmentType,
              employmentStatus,
              employmentStartDate,
              employmentEndDate,
              employmentPosition,
              employmentDepartment,
              employmentGrade,
              employmentLocation,
              grossSalary,
              bankAccountNumber,
              bankName,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails,
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
              title,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode: value,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID,
              passportNumber,
              nationality,
              status,
              employmentType,
              employmentStatus,
              employmentStartDate,
              employmentEndDate,
              employmentPosition,
              employmentDepartment,
              employmentGrade,
              employmentLocation,
              grossSalary,
              bankAccountNumber,
              bankName,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails,
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
        label="Next of kin name"
        isRequired={false}
        isReadOnly={false}
        value={nextOfKinName}
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
              title,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nextOfKinName: value,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID,
              passportNumber,
              nationality,
              status,
              employmentType,
              employmentStatus,
              employmentStartDate,
              employmentEndDate,
              employmentPosition,
              employmentDepartment,
              employmentGrade,
              employmentLocation,
              grossSalary,
              bankAccountNumber,
              bankName,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails,
            };
            const result = onChange(modelFields);
            value = result?.nextOfKinName ?? value;
          }
          if (errors.nextOfKinName?.hasError) {
            runValidationTasks("nextOfKinName", value);
          }
          setNextOfKinName(value);
        }}
        onBlur={() => runValidationTasks("nextOfKinName", nextOfKinName)}
        errorMessage={errors.nextOfKinName?.errorMessage}
        hasError={errors.nextOfKinName?.hasError}
        {...getOverrideProps(overrides, "nextOfKinName")}
      ></TextField>
      <TextField
        label="Next of kin phone number"
        isRequired={false}
        isReadOnly={false}
        value={nextOfKinPhoneNumber}
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
              title,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber: value,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID,
              passportNumber,
              nationality,
              status,
              employmentType,
              employmentStatus,
              employmentStartDate,
              employmentEndDate,
              employmentPosition,
              employmentDepartment,
              employmentGrade,
              employmentLocation,
              grossSalary,
              bankAccountNumber,
              bankName,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails,
            };
            const result = onChange(modelFields);
            value = result?.nextOfKinPhoneNumber ?? value;
          }
          if (errors.nextOfKinPhoneNumber?.hasError) {
            runValidationTasks("nextOfKinPhoneNumber", value);
          }
          setNextOfKinPhoneNumber(value);
        }}
        onBlur={() =>
          runValidationTasks("nextOfKinPhoneNumber", nextOfKinPhoneNumber)
        }
        errorMessage={errors.nextOfKinPhoneNumber?.errorMessage}
        hasError={errors.nextOfKinPhoneNumber?.hasError}
        {...getOverrideProps(overrides, "nextOfKinPhoneNumber")}
      ></TextField>
      <TextField
        label="Next of kin email"
        isRequired={false}
        isReadOnly={false}
        value={nextOfKinEmail}
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
              title,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail: value,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID,
              passportNumber,
              nationality,
              status,
              employmentType,
              employmentStatus,
              employmentStartDate,
              employmentEndDate,
              employmentPosition,
              employmentDepartment,
              employmentGrade,
              employmentLocation,
              grossSalary,
              bankAccountNumber,
              bankName,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails,
            };
            const result = onChange(modelFields);
            value = result?.nextOfKinEmail ?? value;
          }
          if (errors.nextOfKinEmail?.hasError) {
            runValidationTasks("nextOfKinEmail", value);
          }
          setNextOfKinEmail(value);
        }}
        onBlur={() => runValidationTasks("nextOfKinEmail", nextOfKinEmail)}
        errorMessage={errors.nextOfKinEmail?.errorMessage}
        hasError={errors.nextOfKinEmail?.hasError}
        {...getOverrideProps(overrides, "nextOfKinEmail")}
      ></TextField>
      <TextField
        label="Next of kin relationship"
        isRequired={false}
        isReadOnly={false}
        value={nextOfKinRelationship}
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
              title,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship: value,
              nextOfKinAddress,
              nationalID,
              passportNumber,
              nationality,
              status,
              employmentType,
              employmentStatus,
              employmentStartDate,
              employmentEndDate,
              employmentPosition,
              employmentDepartment,
              employmentGrade,
              employmentLocation,
              grossSalary,
              bankAccountNumber,
              bankName,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails,
            };
            const result = onChange(modelFields);
            value = result?.nextOfKinRelationship ?? value;
          }
          if (errors.nextOfKinRelationship?.hasError) {
            runValidationTasks("nextOfKinRelationship", value);
          }
          setNextOfKinRelationship(value);
        }}
        onBlur={() =>
          runValidationTasks("nextOfKinRelationship", nextOfKinRelationship)
        }
        errorMessage={errors.nextOfKinRelationship?.errorMessage}
        hasError={errors.nextOfKinRelationship?.hasError}
        {...getOverrideProps(overrides, "nextOfKinRelationship")}
      ></TextField>
      <TextField
        label="Next of kin address"
        isRequired={false}
        isReadOnly={false}
        value={nextOfKinAddress}
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
              title,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress: value,
              nationalID,
              passportNumber,
              nationality,
              status,
              employmentType,
              employmentStatus,
              employmentStartDate,
              employmentEndDate,
              employmentPosition,
              employmentDepartment,
              employmentGrade,
              employmentLocation,
              grossSalary,
              bankAccountNumber,
              bankName,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails,
            };
            const result = onChange(modelFields);
            value = result?.nextOfKinAddress ?? value;
          }
          if (errors.nextOfKinAddress?.hasError) {
            runValidationTasks("nextOfKinAddress", value);
          }
          setNextOfKinAddress(value);
        }}
        onBlur={() => runValidationTasks("nextOfKinAddress", nextOfKinAddress)}
        errorMessage={errors.nextOfKinAddress?.errorMessage}
        hasError={errors.nextOfKinAddress?.hasError}
        {...getOverrideProps(overrides, "nextOfKinAddress")}
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
              title,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID: value,
              passportNumber,
              nationality,
              status,
              employmentType,
              employmentStatus,
              employmentStartDate,
              employmentEndDate,
              employmentPosition,
              employmentDepartment,
              employmentGrade,
              employmentLocation,
              grossSalary,
              bankAccountNumber,
              bankName,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails,
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
              title,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID,
              passportNumber: value,
              nationality,
              status,
              employmentType,
              employmentStatus,
              employmentStartDate,
              employmentEndDate,
              employmentPosition,
              employmentDepartment,
              employmentGrade,
              employmentLocation,
              grossSalary,
              bankAccountNumber,
              bankName,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails,
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
              title,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID,
              passportNumber,
              nationality: value,
              status,
              employmentType,
              employmentStatus,
              employmentStartDate,
              employmentEndDate,
              employmentPosition,
              employmentDepartment,
              employmentGrade,
              employmentLocation,
              grossSalary,
              bankAccountNumber,
              bankName,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails,
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
              title,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID,
              passportNumber,
              nationality,
              status: value,
              employmentType,
              employmentStatus,
              employmentStartDate,
              employmentEndDate,
              employmentPosition,
              employmentDepartment,
              employmentGrade,
              employmentLocation,
              grossSalary,
              bankAccountNumber,
              bankName,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails,
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
        label="Employment type"
        isRequired={false}
        isReadOnly={false}
        value={employmentType}
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
              title,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID,
              passportNumber,
              nationality,
              status,
              employmentType: value,
              employmentStatus,
              employmentStartDate,
              employmentEndDate,
              employmentPosition,
              employmentDepartment,
              employmentGrade,
              employmentLocation,
              grossSalary,
              bankAccountNumber,
              bankName,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails,
            };
            const result = onChange(modelFields);
            value = result?.employmentType ?? value;
          }
          if (errors.employmentType?.hasError) {
            runValidationTasks("employmentType", value);
          }
          setEmploymentType(value);
        }}
        onBlur={() => runValidationTasks("employmentType", employmentType)}
        errorMessage={errors.employmentType?.errorMessage}
        hasError={errors.employmentType?.hasError}
        {...getOverrideProps(overrides, "employmentType")}
      ></TextField>
      <TextField
        label="Employment status"
        isRequired={false}
        isReadOnly={false}
        value={employmentStatus}
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
              title,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID,
              passportNumber,
              nationality,
              status,
              employmentType,
              employmentStatus: value,
              employmentStartDate,
              employmentEndDate,
              employmentPosition,
              employmentDepartment,
              employmentGrade,
              employmentLocation,
              grossSalary,
              bankAccountNumber,
              bankName,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails,
            };
            const result = onChange(modelFields);
            value = result?.employmentStatus ?? value;
          }
          if (errors.employmentStatus?.hasError) {
            runValidationTasks("employmentStatus", value);
          }
          setEmploymentStatus(value);
        }}
        onBlur={() => runValidationTasks("employmentStatus", employmentStatus)}
        errorMessage={errors.employmentStatus?.errorMessage}
        hasError={errors.employmentStatus?.hasError}
        {...getOverrideProps(overrides, "employmentStatus")}
      ></TextField>
      <TextField
        label="Employment start date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={employmentStartDate}
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
              title,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID,
              passportNumber,
              nationality,
              status,
              employmentType,
              employmentStatus,
              employmentStartDate: value,
              employmentEndDate,
              employmentPosition,
              employmentDepartment,
              employmentGrade,
              employmentLocation,
              grossSalary,
              bankAccountNumber,
              bankName,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails,
            };
            const result = onChange(modelFields);
            value = result?.employmentStartDate ?? value;
          }
          if (errors.employmentStartDate?.hasError) {
            runValidationTasks("employmentStartDate", value);
          }
          setEmploymentStartDate(value);
        }}
        onBlur={() =>
          runValidationTasks("employmentStartDate", employmentStartDate)
        }
        errorMessage={errors.employmentStartDate?.errorMessage}
        hasError={errors.employmentStartDate?.hasError}
        {...getOverrideProps(overrides, "employmentStartDate")}
      ></TextField>
      <TextField
        label="Employment end date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={employmentEndDate}
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
              title,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID,
              passportNumber,
              nationality,
              status,
              employmentType,
              employmentStatus,
              employmentStartDate,
              employmentEndDate: value,
              employmentPosition,
              employmentDepartment,
              employmentGrade,
              employmentLocation,
              grossSalary,
              bankAccountNumber,
              bankName,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails,
            };
            const result = onChange(modelFields);
            value = result?.employmentEndDate ?? value;
          }
          if (errors.employmentEndDate?.hasError) {
            runValidationTasks("employmentEndDate", value);
          }
          setEmploymentEndDate(value);
        }}
        onBlur={() =>
          runValidationTasks("employmentEndDate", employmentEndDate)
        }
        errorMessage={errors.employmentEndDate?.errorMessage}
        hasError={errors.employmentEndDate?.hasError}
        {...getOverrideProps(overrides, "employmentEndDate")}
      ></TextField>
      <TextField
        label="Employment position"
        isRequired={false}
        isReadOnly={false}
        value={employmentPosition}
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
              title,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID,
              passportNumber,
              nationality,
              status,
              employmentType,
              employmentStatus,
              employmentStartDate,
              employmentEndDate,
              employmentPosition: value,
              employmentDepartment,
              employmentGrade,
              employmentLocation,
              grossSalary,
              bankAccountNumber,
              bankName,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails,
            };
            const result = onChange(modelFields);
            value = result?.employmentPosition ?? value;
          }
          if (errors.employmentPosition?.hasError) {
            runValidationTasks("employmentPosition", value);
          }
          setEmploymentPosition(value);
        }}
        onBlur={() =>
          runValidationTasks("employmentPosition", employmentPosition)
        }
        errorMessage={errors.employmentPosition?.errorMessage}
        hasError={errors.employmentPosition?.hasError}
        {...getOverrideProps(overrides, "employmentPosition")}
      ></TextField>
      <TextField
        label="Employment department"
        isRequired={false}
        isReadOnly={false}
        value={employmentDepartment}
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
              title,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID,
              passportNumber,
              nationality,
              status,
              employmentType,
              employmentStatus,
              employmentStartDate,
              employmentEndDate,
              employmentPosition,
              employmentDepartment: value,
              employmentGrade,
              employmentLocation,
              grossSalary,
              bankAccountNumber,
              bankName,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails,
            };
            const result = onChange(modelFields);
            value = result?.employmentDepartment ?? value;
          }
          if (errors.employmentDepartment?.hasError) {
            runValidationTasks("employmentDepartment", value);
          }
          setEmploymentDepartment(value);
        }}
        onBlur={() =>
          runValidationTasks("employmentDepartment", employmentDepartment)
        }
        errorMessage={errors.employmentDepartment?.errorMessage}
        hasError={errors.employmentDepartment?.hasError}
        {...getOverrideProps(overrides, "employmentDepartment")}
      ></TextField>
      <TextField
        label="Employment grade"
        isRequired={false}
        isReadOnly={false}
        value={employmentGrade}
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
              title,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID,
              passportNumber,
              nationality,
              status,
              employmentType,
              employmentStatus,
              employmentStartDate,
              employmentEndDate,
              employmentPosition,
              employmentDepartment,
              employmentGrade: value,
              employmentLocation,
              grossSalary,
              bankAccountNumber,
              bankName,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails,
            };
            const result = onChange(modelFields);
            value = result?.employmentGrade ?? value;
          }
          if (errors.employmentGrade?.hasError) {
            runValidationTasks("employmentGrade", value);
          }
          setEmploymentGrade(value);
        }}
        onBlur={() => runValidationTasks("employmentGrade", employmentGrade)}
        errorMessage={errors.employmentGrade?.errorMessage}
        hasError={errors.employmentGrade?.hasError}
        {...getOverrideProps(overrides, "employmentGrade")}
      ></TextField>
      <TextField
        label="Employment location"
        isRequired={false}
        isReadOnly={false}
        value={employmentLocation}
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
              title,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID,
              passportNumber,
              nationality,
              status,
              employmentType,
              employmentStatus,
              employmentStartDate,
              employmentEndDate,
              employmentPosition,
              employmentDepartment,
              employmentGrade,
              employmentLocation: value,
              grossSalary,
              bankAccountNumber,
              bankName,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails,
            };
            const result = onChange(modelFields);
            value = result?.employmentLocation ?? value;
          }
          if (errors.employmentLocation?.hasError) {
            runValidationTasks("employmentLocation", value);
          }
          setEmploymentLocation(value);
        }}
        onBlur={() =>
          runValidationTasks("employmentLocation", employmentLocation)
        }
        errorMessage={errors.employmentLocation?.errorMessage}
        hasError={errors.employmentLocation?.hasError}
        {...getOverrideProps(overrides, "employmentLocation")}
      ></TextField>
      <TextField
        label="Gross salary"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={grossSalary}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              middleName,
              dateOfBirth,
              phoneNumber1,
              phoneNumber2,
              email,
              title,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID,
              passportNumber,
              nationality,
              status,
              employmentType,
              employmentStatus,
              employmentStartDate,
              employmentEndDate,
              employmentPosition,
              employmentDepartment,
              employmentGrade,
              employmentLocation,
              grossSalary: value,
              bankAccountNumber,
              bankName,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails,
            };
            const result = onChange(modelFields);
            value = result?.grossSalary ?? value;
          }
          if (errors.grossSalary?.hasError) {
            runValidationTasks("grossSalary", value);
          }
          setGrossSalary(value);
        }}
        onBlur={() => runValidationTasks("grossSalary", grossSalary)}
        errorMessage={errors.grossSalary?.errorMessage}
        hasError={errors.grossSalary?.hasError}
        {...getOverrideProps(overrides, "grossSalary")}
      ></TextField>
      <TextField
        label="Bank account number"
        isRequired={false}
        isReadOnly={false}
        value={bankAccountNumber}
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
              title,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID,
              passportNumber,
              nationality,
              status,
              employmentType,
              employmentStatus,
              employmentStartDate,
              employmentEndDate,
              employmentPosition,
              employmentDepartment,
              employmentGrade,
              employmentLocation,
              grossSalary,
              bankAccountNumber: value,
              bankName,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails,
            };
            const result = onChange(modelFields);
            value = result?.bankAccountNumber ?? value;
          }
          if (errors.bankAccountNumber?.hasError) {
            runValidationTasks("bankAccountNumber", value);
          }
          setBankAccountNumber(value);
        }}
        onBlur={() =>
          runValidationTasks("bankAccountNumber", bankAccountNumber)
        }
        errorMessage={errors.bankAccountNumber?.errorMessage}
        hasError={errors.bankAccountNumber?.hasError}
        {...getOverrideProps(overrides, "bankAccountNumber")}
      ></TextField>
      <TextField
        label="Bank name"
        isRequired={false}
        isReadOnly={false}
        value={bankName}
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
              title,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID,
              passportNumber,
              nationality,
              status,
              employmentType,
              employmentStatus,
              employmentStartDate,
              employmentEndDate,
              employmentPosition,
              employmentDepartment,
              employmentGrade,
              employmentLocation,
              grossSalary,
              bankAccountNumber,
              bankName: value,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails,
            };
            const result = onChange(modelFields);
            value = result?.bankName ?? value;
          }
          if (errors.bankName?.hasError) {
            runValidationTasks("bankName", value);
          }
          setBankName(value);
        }}
        onBlur={() => runValidationTasks("bankName", bankName)}
        errorMessage={errors.bankName?.errorMessage}
        hasError={errors.bankName?.hasError}
        {...getOverrideProps(overrides, "bankName")}
      ></TextField>
      <TextField
        label="Bank branch code"
        isRequired={false}
        isReadOnly={false}
        value={bankBranchCode}
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
              title,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID,
              passportNumber,
              nationality,
              status,
              employmentType,
              employmentStatus,
              employmentStartDate,
              employmentEndDate,
              employmentPosition,
              employmentDepartment,
              employmentGrade,
              employmentLocation,
              grossSalary,
              bankAccountNumber,
              bankName,
              bankBranchCode: value,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails,
            };
            const result = onChange(modelFields);
            value = result?.bankBranchCode ?? value;
          }
          if (errors.bankBranchCode?.hasError) {
            runValidationTasks("bankBranchCode", value);
          }
          setBankBranchCode(value);
        }}
        onBlur={() => runValidationTasks("bankBranchCode", bankBranchCode)}
        errorMessage={errors.bankBranchCode?.errorMessage}
        hasError={errors.bankBranchCode?.hasError}
        {...getOverrideProps(overrides, "bankBranchCode")}
      ></TextField>
      <TextField
        label="Social security number"
        isRequired={false}
        isReadOnly={false}
        value={socialSecurityNumber}
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
              title,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID,
              passportNumber,
              nationality,
              status,
              employmentType,
              employmentStatus,
              employmentStartDate,
              employmentEndDate,
              employmentPosition,
              employmentDepartment,
              employmentGrade,
              employmentLocation,
              grossSalary,
              bankAccountNumber,
              bankName,
              bankBranchCode,
              socialSecurityNumber: value,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails,
            };
            const result = onChange(modelFields);
            value = result?.socialSecurityNumber ?? value;
          }
          if (errors.socialSecurityNumber?.hasError) {
            runValidationTasks("socialSecurityNumber", value);
          }
          setSocialSecurityNumber(value);
        }}
        onBlur={() =>
          runValidationTasks("socialSecurityNumber", socialSecurityNumber)
        }
        errorMessage={errors.socialSecurityNumber?.errorMessage}
        hasError={errors.socialSecurityNumber?.hasError}
        {...getOverrideProps(overrides, "socialSecurityNumber")}
      ></TextField>
      <TextField
        label="Tax identification number"
        isRequired={false}
        isReadOnly={false}
        value={taxIdentificationNumber}
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
              title,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID,
              passportNumber,
              nationality,
              status,
              employmentType,
              employmentStatus,
              employmentStartDate,
              employmentEndDate,
              employmentPosition,
              employmentDepartment,
              employmentGrade,
              employmentLocation,
              grossSalary,
              bankAccountNumber,
              bankName,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber: value,
              taxExemptStatus,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails,
            };
            const result = onChange(modelFields);
            value = result?.taxIdentificationNumber ?? value;
          }
          if (errors.taxIdentificationNumber?.hasError) {
            runValidationTasks("taxIdentificationNumber", value);
          }
          setTaxIdentificationNumber(value);
        }}
        onBlur={() =>
          runValidationTasks("taxIdentificationNumber", taxIdentificationNumber)
        }
        errorMessage={errors.taxIdentificationNumber?.errorMessage}
        hasError={errors.taxIdentificationNumber?.hasError}
        {...getOverrideProps(overrides, "taxIdentificationNumber")}
      ></TextField>
      <TextField
        label="Tax exempt status"
        isRequired={false}
        isReadOnly={false}
        value={taxExemptStatus}
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
              title,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID,
              passportNumber,
              nationality,
              status,
              employmentType,
              employmentStatus,
              employmentStartDate,
              employmentEndDate,
              employmentPosition,
              employmentDepartment,
              employmentGrade,
              employmentLocation,
              grossSalary,
              bankAccountNumber,
              bankName,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus: value,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails,
            };
            const result = onChange(modelFields);
            value = result?.taxExemptStatus ?? value;
          }
          if (errors.taxExemptStatus?.hasError) {
            runValidationTasks("taxExemptStatus", value);
          }
          setTaxExemptStatus(value);
        }}
        onBlur={() => runValidationTasks("taxExemptStatus", taxExemptStatus)}
        errorMessage={errors.taxExemptStatus?.errorMessage}
        hasError={errors.taxExemptStatus?.hasError}
        {...getOverrideProps(overrides, "taxExemptStatus")}
      ></TextField>
      <TextAreaField
        label="Custom fields data"
        isRequired={false}
        isReadOnly={false}
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
              title,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID,
              passportNumber,
              nationality,
              status,
              employmentType,
              employmentStatus,
              employmentStartDate,
              employmentEndDate,
              employmentPosition,
              employmentDepartment,
              employmentGrade,
              employmentLocation,
              grossSalary,
              bankAccountNumber,
              bankName,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData: value,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails,
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
        label="Related user id"
        isRequired={false}
        isReadOnly={false}
        value={relatedUserID}
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
              title,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID,
              passportNumber,
              nationality,
              status,
              employmentType,
              employmentStatus,
              employmentStartDate,
              employmentEndDate,
              employmentPosition,
              employmentDepartment,
              employmentGrade,
              employmentLocation,
              grossSalary,
              bankAccountNumber,
              bankName,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData,
              relatedUserID: value,
              relatedBorrowerID,
              customEmployeeDetails,
            };
            const result = onChange(modelFields);
            value = result?.relatedUserID ?? value;
          }
          if (errors.relatedUserID?.hasError) {
            runValidationTasks("relatedUserID", value);
          }
          setRelatedUserID(value);
        }}
        onBlur={() => runValidationTasks("relatedUserID", relatedUserID)}
        errorMessage={errors.relatedUserID?.errorMessage}
        hasError={errors.relatedUserID?.hasError}
        {...getOverrideProps(overrides, "relatedUserID")}
      ></TextField>
      <TextField
        label="Related borrower id"
        isRequired={false}
        isReadOnly={false}
        value={relatedBorrowerID}
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
              title,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID,
              passportNumber,
              nationality,
              status,
              employmentType,
              employmentStatus,
              employmentStartDate,
              employmentEndDate,
              employmentPosition,
              employmentDepartment,
              employmentGrade,
              employmentLocation,
              grossSalary,
              bankAccountNumber,
              bankName,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID: value,
              customEmployeeDetails,
            };
            const result = onChange(modelFields);
            value = result?.relatedBorrowerID ?? value;
          }
          if (errors.relatedBorrowerID?.hasError) {
            runValidationTasks("relatedBorrowerID", value);
          }
          setRelatedBorrowerID(value);
        }}
        onBlur={() =>
          runValidationTasks("relatedBorrowerID", relatedBorrowerID)
        }
        errorMessage={errors.relatedBorrowerID?.errorMessage}
        hasError={errors.relatedBorrowerID?.hasError}
        {...getOverrideProps(overrides, "relatedBorrowerID")}
      ></TextField>
      <TextAreaField
        label="Custom employee details"
        isRequired={false}
        isReadOnly={false}
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
              title,
              addressLine1,
              addressLine2,
              city,
              stateProvince,
              postalCode,
              nextOfKinName,
              nextOfKinPhoneNumber,
              nextOfKinEmail,
              nextOfKinRelationship,
              nextOfKinAddress,
              nationalID,
              passportNumber,
              nationality,
              status,
              employmentType,
              employmentStatus,
              employmentStartDate,
              employmentEndDate,
              employmentPosition,
              employmentDepartment,
              employmentGrade,
              employmentLocation,
              grossSalary,
              bankAccountNumber,
              bankName,
              bankBranchCode,
              socialSecurityNumber,
              taxIdentificationNumber,
              taxExemptStatus,
              customFieldsData,
              relatedUserID,
              relatedBorrowerID,
              customEmployeeDetails: value,
            };
            const result = onChange(modelFields);
            value = result?.customEmployeeDetails ?? value;
          }
          if (errors.customEmployeeDetails?.hasError) {
            runValidationTasks("customEmployeeDetails", value);
          }
          setCustomEmployeeDetails(value);
        }}
        onBlur={() =>
          runValidationTasks("customEmployeeDetails", customEmployeeDetails)
        }
        errorMessage={errors.customEmployeeDetails?.errorMessage}
        hasError={errors.customEmployeeDetails?.hasError}
        {...getOverrideProps(overrides, "customEmployeeDetails")}
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
