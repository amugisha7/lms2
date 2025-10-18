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
import { getBorrower } from "../graphql/queries";
import { updateBorrower } from "../graphql/mutations";
const client = generateClient();
export default function BorrowerUpdateForm(props) {
  const {
    id: idProp,
    borrower: borrowerModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    firstname: "",
    othername: "",
    businessName: "",
    typeOfBusiness: "",
    uniqueIdNumber: "",
    phoneNumber: "",
    otherPhoneNumber: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    nationality: "",
    nationalIdPicture: "",
    passportPicture: "",
    address: "",
    points: "",
    borrowerOpeningBalance: "",
    borrowerClosingBalance: "",
    borrowerInterestRate: "",
    city: "",
    state: "",
    title: "",
    zipcode: "",
    employmentStatus: "",
    employerName: "",
    creditScore: "",
    additionalNote1: "",
    additionalNote2: "",
    borrowerDocuments: "",
    customFieldsData: "",
    status: "",
  };
  const [firstname, setFirstname] = React.useState(initialValues.firstname);
  const [othername, setOthername] = React.useState(initialValues.othername);
  const [businessName, setBusinessName] = React.useState(
    initialValues.businessName
  );
  const [typeOfBusiness, setTypeOfBusiness] = React.useState(
    initialValues.typeOfBusiness
  );
  const [uniqueIdNumber, setUniqueIdNumber] = React.useState(
    initialValues.uniqueIdNumber
  );
  const [phoneNumber, setPhoneNumber] = React.useState(
    initialValues.phoneNumber
  );
  const [otherPhoneNumber, setOtherPhoneNumber] = React.useState(
    initialValues.otherPhoneNumber
  );
  const [email, setEmail] = React.useState(initialValues.email);
  const [gender, setGender] = React.useState(initialValues.gender);
  const [dateOfBirth, setDateOfBirth] = React.useState(
    initialValues.dateOfBirth
  );
  const [nationality, setNationality] = React.useState(
    initialValues.nationality
  );
  const [nationalIdPicture, setNationalIdPicture] = React.useState(
    initialValues.nationalIdPicture
  );
  const [passportPicture, setPassportPicture] = React.useState(
    initialValues.passportPicture
  );
  const [address, setAddress] = React.useState(initialValues.address);
  const [points, setPoints] = React.useState(initialValues.points);
  const [borrowerOpeningBalance, setBorrowerOpeningBalance] = React.useState(
    initialValues.borrowerOpeningBalance
  );
  const [borrowerClosingBalance, setBorrowerClosingBalance] = React.useState(
    initialValues.borrowerClosingBalance
  );
  const [borrowerInterestRate, setBorrowerInterestRate] = React.useState(
    initialValues.borrowerInterestRate
  );
  const [city, setCity] = React.useState(initialValues.city);
  const [state, setState] = React.useState(initialValues.state);
  const [title, setTitle] = React.useState(initialValues.title);
  const [zipcode, setZipcode] = React.useState(initialValues.zipcode);
  const [employmentStatus, setEmploymentStatus] = React.useState(
    initialValues.employmentStatus
  );
  const [employerName, setEmployerName] = React.useState(
    initialValues.employerName
  );
  const [creditScore, setCreditScore] = React.useState(
    initialValues.creditScore
  );
  const [additionalNote1, setAdditionalNote1] = React.useState(
    initialValues.additionalNote1
  );
  const [additionalNote2, setAdditionalNote2] = React.useState(
    initialValues.additionalNote2
  );
  const [borrowerDocuments, setBorrowerDocuments] = React.useState(
    initialValues.borrowerDocuments
  );
  const [customFieldsData, setCustomFieldsData] = React.useState(
    initialValues.customFieldsData
  );
  const [status, setStatus] = React.useState(initialValues.status);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = borrowerRecord
      ? { ...initialValues, ...borrowerRecord }
      : initialValues;
    setFirstname(cleanValues.firstname);
    setOthername(cleanValues.othername);
    setBusinessName(cleanValues.businessName);
    setTypeOfBusiness(cleanValues.typeOfBusiness);
    setUniqueIdNumber(cleanValues.uniqueIdNumber);
    setPhoneNumber(cleanValues.phoneNumber);
    setOtherPhoneNumber(cleanValues.otherPhoneNumber);
    setEmail(cleanValues.email);
    setGender(cleanValues.gender);
    setDateOfBirth(cleanValues.dateOfBirth);
    setNationality(cleanValues.nationality);
    setNationalIdPicture(cleanValues.nationalIdPicture);
    setPassportPicture(cleanValues.passportPicture);
    setAddress(cleanValues.address);
    setPoints(cleanValues.points);
    setBorrowerOpeningBalance(cleanValues.borrowerOpeningBalance);
    setBorrowerClosingBalance(cleanValues.borrowerClosingBalance);
    setBorrowerInterestRate(cleanValues.borrowerInterestRate);
    setCity(cleanValues.city);
    setState(cleanValues.state);
    setTitle(cleanValues.title);
    setZipcode(cleanValues.zipcode);
    setEmploymentStatus(cleanValues.employmentStatus);
    setEmployerName(cleanValues.employerName);
    setCreditScore(cleanValues.creditScore);
    setAdditionalNote1(cleanValues.additionalNote1);
    setAdditionalNote2(cleanValues.additionalNote2);
    setBorrowerDocuments(
      typeof cleanValues.borrowerDocuments === "string" ||
        cleanValues.borrowerDocuments === null
        ? cleanValues.borrowerDocuments
        : JSON.stringify(cleanValues.borrowerDocuments)
    );
    setCustomFieldsData(
      typeof cleanValues.customFieldsData === "string" ||
        cleanValues.customFieldsData === null
        ? cleanValues.customFieldsData
        : JSON.stringify(cleanValues.customFieldsData)
    );
    setStatus(cleanValues.status);
    setErrors({});
  };
  const [borrowerRecord, setBorrowerRecord] = React.useState(borrowerModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getBorrower.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getBorrower
        : borrowerModelProp;
      setBorrowerRecord(record);
    };
    queryData();
  }, [idProp, borrowerModelProp]);
  React.useEffect(resetStateValues, [borrowerRecord]);
  const validations = {
    firstname: [],
    othername: [],
    businessName: [],
    typeOfBusiness: [],
    uniqueIdNumber: [],
    phoneNumber: [],
    otherPhoneNumber: [],
    email: [],
    gender: [],
    dateOfBirth: [],
    nationality: [],
    nationalIdPicture: [],
    passportPicture: [],
    address: [],
    points: [],
    borrowerOpeningBalance: [],
    borrowerClosingBalance: [],
    borrowerInterestRate: [],
    city: [],
    state: [],
    title: [],
    zipcode: [],
    employmentStatus: [],
    employerName: [],
    creditScore: [],
    additionalNote1: [],
    additionalNote2: [],
    borrowerDocuments: [{ type: "JSON" }],
    customFieldsData: [{ type: "JSON" }],
    status: [],
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
          firstname: firstname ?? null,
          othername: othername ?? null,
          businessName: businessName ?? null,
          typeOfBusiness: typeOfBusiness ?? null,
          uniqueIdNumber: uniqueIdNumber ?? null,
          phoneNumber: phoneNumber ?? null,
          otherPhoneNumber: otherPhoneNumber ?? null,
          email: email ?? null,
          gender: gender ?? null,
          dateOfBirth: dateOfBirth ?? null,
          nationality: nationality ?? null,
          nationalIdPicture: nationalIdPicture ?? null,
          passportPicture: passportPicture ?? null,
          address: address ?? null,
          points: points ?? null,
          borrowerOpeningBalance: borrowerOpeningBalance ?? null,
          borrowerClosingBalance: borrowerClosingBalance ?? null,
          borrowerInterestRate: borrowerInterestRate ?? null,
          city: city ?? null,
          state: state ?? null,
          title: title ?? null,
          zipcode: zipcode ?? null,
          employmentStatus: employmentStatus ?? null,
          employerName: employerName ?? null,
          creditScore: creditScore ?? null,
          additionalNote1: additionalNote1 ?? null,
          additionalNote2: additionalNote2 ?? null,
          borrowerDocuments: borrowerDocuments ?? null,
          customFieldsData: customFieldsData ?? null,
          status: status ?? null,
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
            query: updateBorrower.replaceAll("__typename", ""),
            variables: {
              input: {
                id: borrowerRecord.id,
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
      {...getOverrideProps(overrides, "BorrowerUpdateForm")}
      {...rest}
    >
      <TextField
        label="Firstname"
        isRequired={false}
        isReadOnly={false}
        value={firstname}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstname: value,
              othername,
              businessName,
              typeOfBusiness,
              uniqueIdNumber,
              phoneNumber,
              otherPhoneNumber,
              email,
              gender,
              dateOfBirth,
              nationality,
              nationalIdPicture,
              passportPicture,
              address,
              points,
              borrowerOpeningBalance,
              borrowerClosingBalance,
              borrowerInterestRate,
              city,
              state,
              title,
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocuments,
              customFieldsData,
              status,
            };
            const result = onChange(modelFields);
            value = result?.firstname ?? value;
          }
          if (errors.firstname?.hasError) {
            runValidationTasks("firstname", value);
          }
          setFirstname(value);
        }}
        onBlur={() => runValidationTasks("firstname", firstname)}
        errorMessage={errors.firstname?.errorMessage}
        hasError={errors.firstname?.hasError}
        {...getOverrideProps(overrides, "firstname")}
      ></TextField>
      <TextField
        label="Othername"
        isRequired={false}
        isReadOnly={false}
        value={othername}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstname,
              othername: value,
              businessName,
              typeOfBusiness,
              uniqueIdNumber,
              phoneNumber,
              otherPhoneNumber,
              email,
              gender,
              dateOfBirth,
              nationality,
              nationalIdPicture,
              passportPicture,
              address,
              points,
              borrowerOpeningBalance,
              borrowerClosingBalance,
              borrowerInterestRate,
              city,
              state,
              title,
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocuments,
              customFieldsData,
              status,
            };
            const result = onChange(modelFields);
            value = result?.othername ?? value;
          }
          if (errors.othername?.hasError) {
            runValidationTasks("othername", value);
          }
          setOthername(value);
        }}
        onBlur={() => runValidationTasks("othername", othername)}
        errorMessage={errors.othername?.errorMessage}
        hasError={errors.othername?.hasError}
        {...getOverrideProps(overrides, "othername")}
      ></TextField>
      <TextField
        label="Business name"
        isRequired={false}
        isReadOnly={false}
        value={businessName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstname,
              othername,
              businessName: value,
              typeOfBusiness,
              uniqueIdNumber,
              phoneNumber,
              otherPhoneNumber,
              email,
              gender,
              dateOfBirth,
              nationality,
              nationalIdPicture,
              passportPicture,
              address,
              points,
              borrowerOpeningBalance,
              borrowerClosingBalance,
              borrowerInterestRate,
              city,
              state,
              title,
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocuments,
              customFieldsData,
              status,
            };
            const result = onChange(modelFields);
            value = result?.businessName ?? value;
          }
          if (errors.businessName?.hasError) {
            runValidationTasks("businessName", value);
          }
          setBusinessName(value);
        }}
        onBlur={() => runValidationTasks("businessName", businessName)}
        errorMessage={errors.businessName?.errorMessage}
        hasError={errors.businessName?.hasError}
        {...getOverrideProps(overrides, "businessName")}
      ></TextField>
      <TextField
        label="Type of business"
        isRequired={false}
        isReadOnly={false}
        value={typeOfBusiness}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstname,
              othername,
              businessName,
              typeOfBusiness: value,
              uniqueIdNumber,
              phoneNumber,
              otherPhoneNumber,
              email,
              gender,
              dateOfBirth,
              nationality,
              nationalIdPicture,
              passportPicture,
              address,
              points,
              borrowerOpeningBalance,
              borrowerClosingBalance,
              borrowerInterestRate,
              city,
              state,
              title,
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocuments,
              customFieldsData,
              status,
            };
            const result = onChange(modelFields);
            value = result?.typeOfBusiness ?? value;
          }
          if (errors.typeOfBusiness?.hasError) {
            runValidationTasks("typeOfBusiness", value);
          }
          setTypeOfBusiness(value);
        }}
        onBlur={() => runValidationTasks("typeOfBusiness", typeOfBusiness)}
        errorMessage={errors.typeOfBusiness?.errorMessage}
        hasError={errors.typeOfBusiness?.hasError}
        {...getOverrideProps(overrides, "typeOfBusiness")}
      ></TextField>
      <TextField
        label="Unique id number"
        isRequired={false}
        isReadOnly={false}
        value={uniqueIdNumber}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstname,
              othername,
              businessName,
              typeOfBusiness,
              uniqueIdNumber: value,
              phoneNumber,
              otherPhoneNumber,
              email,
              gender,
              dateOfBirth,
              nationality,
              nationalIdPicture,
              passportPicture,
              address,
              points,
              borrowerOpeningBalance,
              borrowerClosingBalance,
              borrowerInterestRate,
              city,
              state,
              title,
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocuments,
              customFieldsData,
              status,
            };
            const result = onChange(modelFields);
            value = result?.uniqueIdNumber ?? value;
          }
          if (errors.uniqueIdNumber?.hasError) {
            runValidationTasks("uniqueIdNumber", value);
          }
          setUniqueIdNumber(value);
        }}
        onBlur={() => runValidationTasks("uniqueIdNumber", uniqueIdNumber)}
        errorMessage={errors.uniqueIdNumber?.errorMessage}
        hasError={errors.uniqueIdNumber?.hasError}
        {...getOverrideProps(overrides, "uniqueIdNumber")}
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
              firstname,
              othername,
              businessName,
              typeOfBusiness,
              uniqueIdNumber,
              phoneNumber: value,
              otherPhoneNumber,
              email,
              gender,
              dateOfBirth,
              nationality,
              nationalIdPicture,
              passportPicture,
              address,
              points,
              borrowerOpeningBalance,
              borrowerClosingBalance,
              borrowerInterestRate,
              city,
              state,
              title,
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocuments,
              customFieldsData,
              status,
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
        label="Other phone number"
        isRequired={false}
        isReadOnly={false}
        value={otherPhoneNumber}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstname,
              othername,
              businessName,
              typeOfBusiness,
              uniqueIdNumber,
              phoneNumber,
              otherPhoneNumber: value,
              email,
              gender,
              dateOfBirth,
              nationality,
              nationalIdPicture,
              passportPicture,
              address,
              points,
              borrowerOpeningBalance,
              borrowerClosingBalance,
              borrowerInterestRate,
              city,
              state,
              title,
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocuments,
              customFieldsData,
              status,
            };
            const result = onChange(modelFields);
            value = result?.otherPhoneNumber ?? value;
          }
          if (errors.otherPhoneNumber?.hasError) {
            runValidationTasks("otherPhoneNumber", value);
          }
          setOtherPhoneNumber(value);
        }}
        onBlur={() => runValidationTasks("otherPhoneNumber", otherPhoneNumber)}
        errorMessage={errors.otherPhoneNumber?.errorMessage}
        hasError={errors.otherPhoneNumber?.hasError}
        {...getOverrideProps(overrides, "otherPhoneNumber")}
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
              firstname,
              othername,
              businessName,
              typeOfBusiness,
              uniqueIdNumber,
              phoneNumber,
              otherPhoneNumber,
              email: value,
              gender,
              dateOfBirth,
              nationality,
              nationalIdPicture,
              passportPicture,
              address,
              points,
              borrowerOpeningBalance,
              borrowerClosingBalance,
              borrowerInterestRate,
              city,
              state,
              title,
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocuments,
              customFieldsData,
              status,
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
        label="Gender"
        isRequired={false}
        isReadOnly={false}
        value={gender}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstname,
              othername,
              businessName,
              typeOfBusiness,
              uniqueIdNumber,
              phoneNumber,
              otherPhoneNumber,
              email,
              gender: value,
              dateOfBirth,
              nationality,
              nationalIdPicture,
              passportPicture,
              address,
              points,
              borrowerOpeningBalance,
              borrowerClosingBalance,
              borrowerInterestRate,
              city,
              state,
              title,
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocuments,
              customFieldsData,
              status,
            };
            const result = onChange(modelFields);
            value = result?.gender ?? value;
          }
          if (errors.gender?.hasError) {
            runValidationTasks("gender", value);
          }
          setGender(value);
        }}
        onBlur={() => runValidationTasks("gender", gender)}
        errorMessage={errors.gender?.errorMessage}
        hasError={errors.gender?.hasError}
        {...getOverrideProps(overrides, "gender")}
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
              firstname,
              othername,
              businessName,
              typeOfBusiness,
              uniqueIdNumber,
              phoneNumber,
              otherPhoneNumber,
              email,
              gender,
              dateOfBirth: value,
              nationality,
              nationalIdPicture,
              passportPicture,
              address,
              points,
              borrowerOpeningBalance,
              borrowerClosingBalance,
              borrowerInterestRate,
              city,
              state,
              title,
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocuments,
              customFieldsData,
              status,
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
        label="Nationality"
        isRequired={false}
        isReadOnly={false}
        value={nationality}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstname,
              othername,
              businessName,
              typeOfBusiness,
              uniqueIdNumber,
              phoneNumber,
              otherPhoneNumber,
              email,
              gender,
              dateOfBirth,
              nationality: value,
              nationalIdPicture,
              passportPicture,
              address,
              points,
              borrowerOpeningBalance,
              borrowerClosingBalance,
              borrowerInterestRate,
              city,
              state,
              title,
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocuments,
              customFieldsData,
              status,
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
        label="National id picture"
        isRequired={false}
        isReadOnly={false}
        value={nationalIdPicture}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstname,
              othername,
              businessName,
              typeOfBusiness,
              uniqueIdNumber,
              phoneNumber,
              otherPhoneNumber,
              email,
              gender,
              dateOfBirth,
              nationality,
              nationalIdPicture: value,
              passportPicture,
              address,
              points,
              borrowerOpeningBalance,
              borrowerClosingBalance,
              borrowerInterestRate,
              city,
              state,
              title,
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocuments,
              customFieldsData,
              status,
            };
            const result = onChange(modelFields);
            value = result?.nationalIdPicture ?? value;
          }
          if (errors.nationalIdPicture?.hasError) {
            runValidationTasks("nationalIdPicture", value);
          }
          setNationalIdPicture(value);
        }}
        onBlur={() =>
          runValidationTasks("nationalIdPicture", nationalIdPicture)
        }
        errorMessage={errors.nationalIdPicture?.errorMessage}
        hasError={errors.nationalIdPicture?.hasError}
        {...getOverrideProps(overrides, "nationalIdPicture")}
      ></TextField>
      <TextField
        label="Passport picture"
        isRequired={false}
        isReadOnly={false}
        value={passportPicture}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstname,
              othername,
              businessName,
              typeOfBusiness,
              uniqueIdNumber,
              phoneNumber,
              otherPhoneNumber,
              email,
              gender,
              dateOfBirth,
              nationality,
              nationalIdPicture,
              passportPicture: value,
              address,
              points,
              borrowerOpeningBalance,
              borrowerClosingBalance,
              borrowerInterestRate,
              city,
              state,
              title,
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocuments,
              customFieldsData,
              status,
            };
            const result = onChange(modelFields);
            value = result?.passportPicture ?? value;
          }
          if (errors.passportPicture?.hasError) {
            runValidationTasks("passportPicture", value);
          }
          setPassportPicture(value);
        }}
        onBlur={() => runValidationTasks("passportPicture", passportPicture)}
        errorMessage={errors.passportPicture?.errorMessage}
        hasError={errors.passportPicture?.hasError}
        {...getOverrideProps(overrides, "passportPicture")}
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
              firstname,
              othername,
              businessName,
              typeOfBusiness,
              uniqueIdNumber,
              phoneNumber,
              otherPhoneNumber,
              email,
              gender,
              dateOfBirth,
              nationality,
              nationalIdPicture,
              passportPicture,
              address: value,
              points,
              borrowerOpeningBalance,
              borrowerClosingBalance,
              borrowerInterestRate,
              city,
              state,
              title,
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocuments,
              customFieldsData,
              status,
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
      <TextField
        label="Points"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={points}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              firstname,
              othername,
              businessName,
              typeOfBusiness,
              uniqueIdNumber,
              phoneNumber,
              otherPhoneNumber,
              email,
              gender,
              dateOfBirth,
              nationality,
              nationalIdPicture,
              passportPicture,
              address,
              points: value,
              borrowerOpeningBalance,
              borrowerClosingBalance,
              borrowerInterestRate,
              city,
              state,
              title,
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocuments,
              customFieldsData,
              status,
            };
            const result = onChange(modelFields);
            value = result?.points ?? value;
          }
          if (errors.points?.hasError) {
            runValidationTasks("points", value);
          }
          setPoints(value);
        }}
        onBlur={() => runValidationTasks("points", points)}
        errorMessage={errors.points?.errorMessage}
        hasError={errors.points?.hasError}
        {...getOverrideProps(overrides, "points")}
      ></TextField>
      <TextField
        label="Borrower opening balance"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={borrowerOpeningBalance}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              firstname,
              othername,
              businessName,
              typeOfBusiness,
              uniqueIdNumber,
              phoneNumber,
              otherPhoneNumber,
              email,
              gender,
              dateOfBirth,
              nationality,
              nationalIdPicture,
              passportPicture,
              address,
              points,
              borrowerOpeningBalance: value,
              borrowerClosingBalance,
              borrowerInterestRate,
              city,
              state,
              title,
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocuments,
              customFieldsData,
              status,
            };
            const result = onChange(modelFields);
            value = result?.borrowerOpeningBalance ?? value;
          }
          if (errors.borrowerOpeningBalance?.hasError) {
            runValidationTasks("borrowerOpeningBalance", value);
          }
          setBorrowerOpeningBalance(value);
        }}
        onBlur={() =>
          runValidationTasks("borrowerOpeningBalance", borrowerOpeningBalance)
        }
        errorMessage={errors.borrowerOpeningBalance?.errorMessage}
        hasError={errors.borrowerOpeningBalance?.hasError}
        {...getOverrideProps(overrides, "borrowerOpeningBalance")}
      ></TextField>
      <TextField
        label="Borrower closing balance"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={borrowerClosingBalance}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              firstname,
              othername,
              businessName,
              typeOfBusiness,
              uniqueIdNumber,
              phoneNumber,
              otherPhoneNumber,
              email,
              gender,
              dateOfBirth,
              nationality,
              nationalIdPicture,
              passportPicture,
              address,
              points,
              borrowerOpeningBalance,
              borrowerClosingBalance: value,
              borrowerInterestRate,
              city,
              state,
              title,
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocuments,
              customFieldsData,
              status,
            };
            const result = onChange(modelFields);
            value = result?.borrowerClosingBalance ?? value;
          }
          if (errors.borrowerClosingBalance?.hasError) {
            runValidationTasks("borrowerClosingBalance", value);
          }
          setBorrowerClosingBalance(value);
        }}
        onBlur={() =>
          runValidationTasks("borrowerClosingBalance", borrowerClosingBalance)
        }
        errorMessage={errors.borrowerClosingBalance?.errorMessage}
        hasError={errors.borrowerClosingBalance?.hasError}
        {...getOverrideProps(overrides, "borrowerClosingBalance")}
      ></TextField>
      <TextField
        label="Borrower interest rate"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={borrowerInterestRate}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              firstname,
              othername,
              businessName,
              typeOfBusiness,
              uniqueIdNumber,
              phoneNumber,
              otherPhoneNumber,
              email,
              gender,
              dateOfBirth,
              nationality,
              nationalIdPicture,
              passportPicture,
              address,
              points,
              borrowerOpeningBalance,
              borrowerClosingBalance,
              borrowerInterestRate: value,
              city,
              state,
              title,
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocuments,
              customFieldsData,
              status,
            };
            const result = onChange(modelFields);
            value = result?.borrowerInterestRate ?? value;
          }
          if (errors.borrowerInterestRate?.hasError) {
            runValidationTasks("borrowerInterestRate", value);
          }
          setBorrowerInterestRate(value);
        }}
        onBlur={() =>
          runValidationTasks("borrowerInterestRate", borrowerInterestRate)
        }
        errorMessage={errors.borrowerInterestRate?.errorMessage}
        hasError={errors.borrowerInterestRate?.hasError}
        {...getOverrideProps(overrides, "borrowerInterestRate")}
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
              firstname,
              othername,
              businessName,
              typeOfBusiness,
              uniqueIdNumber,
              phoneNumber,
              otherPhoneNumber,
              email,
              gender,
              dateOfBirth,
              nationality,
              nationalIdPicture,
              passportPicture,
              address,
              points,
              borrowerOpeningBalance,
              borrowerClosingBalance,
              borrowerInterestRate,
              city: value,
              state,
              title,
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocuments,
              customFieldsData,
              status,
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
        label="State"
        isRequired={false}
        isReadOnly={false}
        value={state}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstname,
              othername,
              businessName,
              typeOfBusiness,
              uniqueIdNumber,
              phoneNumber,
              otherPhoneNumber,
              email,
              gender,
              dateOfBirth,
              nationality,
              nationalIdPicture,
              passportPicture,
              address,
              points,
              borrowerOpeningBalance,
              borrowerClosingBalance,
              borrowerInterestRate,
              city,
              state: value,
              title,
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocuments,
              customFieldsData,
              status,
            };
            const result = onChange(modelFields);
            value = result?.state ?? value;
          }
          if (errors.state?.hasError) {
            runValidationTasks("state", value);
          }
          setState(value);
        }}
        onBlur={() => runValidationTasks("state", state)}
        errorMessage={errors.state?.errorMessage}
        hasError={errors.state?.hasError}
        {...getOverrideProps(overrides, "state")}
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
              firstname,
              othername,
              businessName,
              typeOfBusiness,
              uniqueIdNumber,
              phoneNumber,
              otherPhoneNumber,
              email,
              gender,
              dateOfBirth,
              nationality,
              nationalIdPicture,
              passportPicture,
              address,
              points,
              borrowerOpeningBalance,
              borrowerClosingBalance,
              borrowerInterestRate,
              city,
              state,
              title: value,
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocuments,
              customFieldsData,
              status,
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
        label="Zipcode"
        isRequired={false}
        isReadOnly={false}
        value={zipcode}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstname,
              othername,
              businessName,
              typeOfBusiness,
              uniqueIdNumber,
              phoneNumber,
              otherPhoneNumber,
              email,
              gender,
              dateOfBirth,
              nationality,
              nationalIdPicture,
              passportPicture,
              address,
              points,
              borrowerOpeningBalance,
              borrowerClosingBalance,
              borrowerInterestRate,
              city,
              state,
              title,
              zipcode: value,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocuments,
              customFieldsData,
              status,
            };
            const result = onChange(modelFields);
            value = result?.zipcode ?? value;
          }
          if (errors.zipcode?.hasError) {
            runValidationTasks("zipcode", value);
          }
          setZipcode(value);
        }}
        onBlur={() => runValidationTasks("zipcode", zipcode)}
        errorMessage={errors.zipcode?.errorMessage}
        hasError={errors.zipcode?.hasError}
        {...getOverrideProps(overrides, "zipcode")}
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
              firstname,
              othername,
              businessName,
              typeOfBusiness,
              uniqueIdNumber,
              phoneNumber,
              otherPhoneNumber,
              email,
              gender,
              dateOfBirth,
              nationality,
              nationalIdPicture,
              passportPicture,
              address,
              points,
              borrowerOpeningBalance,
              borrowerClosingBalance,
              borrowerInterestRate,
              city,
              state,
              title,
              zipcode,
              employmentStatus: value,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocuments,
              customFieldsData,
              status,
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
        label="Employer name"
        isRequired={false}
        isReadOnly={false}
        value={employerName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstname,
              othername,
              businessName,
              typeOfBusiness,
              uniqueIdNumber,
              phoneNumber,
              otherPhoneNumber,
              email,
              gender,
              dateOfBirth,
              nationality,
              nationalIdPicture,
              passportPicture,
              address,
              points,
              borrowerOpeningBalance,
              borrowerClosingBalance,
              borrowerInterestRate,
              city,
              state,
              title,
              zipcode,
              employmentStatus,
              employerName: value,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocuments,
              customFieldsData,
              status,
            };
            const result = onChange(modelFields);
            value = result?.employerName ?? value;
          }
          if (errors.employerName?.hasError) {
            runValidationTasks("employerName", value);
          }
          setEmployerName(value);
        }}
        onBlur={() => runValidationTasks("employerName", employerName)}
        errorMessage={errors.employerName?.errorMessage}
        hasError={errors.employerName?.hasError}
        {...getOverrideProps(overrides, "employerName")}
      ></TextField>
      <TextField
        label="Credit score"
        isRequired={false}
        isReadOnly={false}
        value={creditScore}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstname,
              othername,
              businessName,
              typeOfBusiness,
              uniqueIdNumber,
              phoneNumber,
              otherPhoneNumber,
              email,
              gender,
              dateOfBirth,
              nationality,
              nationalIdPicture,
              passportPicture,
              address,
              points,
              borrowerOpeningBalance,
              borrowerClosingBalance,
              borrowerInterestRate,
              city,
              state,
              title,
              zipcode,
              employmentStatus,
              employerName,
              creditScore: value,
              additionalNote1,
              additionalNote2,
              borrowerDocuments,
              customFieldsData,
              status,
            };
            const result = onChange(modelFields);
            value = result?.creditScore ?? value;
          }
          if (errors.creditScore?.hasError) {
            runValidationTasks("creditScore", value);
          }
          setCreditScore(value);
        }}
        onBlur={() => runValidationTasks("creditScore", creditScore)}
        errorMessage={errors.creditScore?.errorMessage}
        hasError={errors.creditScore?.hasError}
        {...getOverrideProps(overrides, "creditScore")}
      ></TextField>
      <TextField
        label="Additional note1"
        isRequired={false}
        isReadOnly={false}
        value={additionalNote1}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstname,
              othername,
              businessName,
              typeOfBusiness,
              uniqueIdNumber,
              phoneNumber,
              otherPhoneNumber,
              email,
              gender,
              dateOfBirth,
              nationality,
              nationalIdPicture,
              passportPicture,
              address,
              points,
              borrowerOpeningBalance,
              borrowerClosingBalance,
              borrowerInterestRate,
              city,
              state,
              title,
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1: value,
              additionalNote2,
              borrowerDocuments,
              customFieldsData,
              status,
            };
            const result = onChange(modelFields);
            value = result?.additionalNote1 ?? value;
          }
          if (errors.additionalNote1?.hasError) {
            runValidationTasks("additionalNote1", value);
          }
          setAdditionalNote1(value);
        }}
        onBlur={() => runValidationTasks("additionalNote1", additionalNote1)}
        errorMessage={errors.additionalNote1?.errorMessage}
        hasError={errors.additionalNote1?.hasError}
        {...getOverrideProps(overrides, "additionalNote1")}
      ></TextField>
      <TextField
        label="Additional note2"
        isRequired={false}
        isReadOnly={false}
        value={additionalNote2}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstname,
              othername,
              businessName,
              typeOfBusiness,
              uniqueIdNumber,
              phoneNumber,
              otherPhoneNumber,
              email,
              gender,
              dateOfBirth,
              nationality,
              nationalIdPicture,
              passportPicture,
              address,
              points,
              borrowerOpeningBalance,
              borrowerClosingBalance,
              borrowerInterestRate,
              city,
              state,
              title,
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2: value,
              borrowerDocuments,
              customFieldsData,
              status,
            };
            const result = onChange(modelFields);
            value = result?.additionalNote2 ?? value;
          }
          if (errors.additionalNote2?.hasError) {
            runValidationTasks("additionalNote2", value);
          }
          setAdditionalNote2(value);
        }}
        onBlur={() => runValidationTasks("additionalNote2", additionalNote2)}
        errorMessage={errors.additionalNote2?.errorMessage}
        hasError={errors.additionalNote2?.hasError}
        {...getOverrideProps(overrides, "additionalNote2")}
      ></TextField>
      <TextAreaField
        label="Borrower documents"
        isRequired={false}
        isReadOnly={false}
        value={borrowerDocuments}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstname,
              othername,
              businessName,
              typeOfBusiness,
              uniqueIdNumber,
              phoneNumber,
              otherPhoneNumber,
              email,
              gender,
              dateOfBirth,
              nationality,
              nationalIdPicture,
              passportPicture,
              address,
              points,
              borrowerOpeningBalance,
              borrowerClosingBalance,
              borrowerInterestRate,
              city,
              state,
              title,
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocuments: value,
              customFieldsData,
              status,
            };
            const result = onChange(modelFields);
            value = result?.borrowerDocuments ?? value;
          }
          if (errors.borrowerDocuments?.hasError) {
            runValidationTasks("borrowerDocuments", value);
          }
          setBorrowerDocuments(value);
        }}
        onBlur={() =>
          runValidationTasks("borrowerDocuments", borrowerDocuments)
        }
        errorMessage={errors.borrowerDocuments?.errorMessage}
        hasError={errors.borrowerDocuments?.hasError}
        {...getOverrideProps(overrides, "borrowerDocuments")}
      ></TextAreaField>
      <TextAreaField
        label="Custom fields data"
        isRequired={false}
        isReadOnly={false}
        value={customFieldsData}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstname,
              othername,
              businessName,
              typeOfBusiness,
              uniqueIdNumber,
              phoneNumber,
              otherPhoneNumber,
              email,
              gender,
              dateOfBirth,
              nationality,
              nationalIdPicture,
              passportPicture,
              address,
              points,
              borrowerOpeningBalance,
              borrowerClosingBalance,
              borrowerInterestRate,
              city,
              state,
              title,
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocuments,
              customFieldsData: value,
              status,
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
              firstname,
              othername,
              businessName,
              typeOfBusiness,
              uniqueIdNumber,
              phoneNumber,
              otherPhoneNumber,
              email,
              gender,
              dateOfBirth,
              nationality,
              nationalIdPicture,
              passportPicture,
              address,
              points,
              borrowerOpeningBalance,
              borrowerClosingBalance,
              borrowerInterestRate,
              city,
              state,
              title,
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocuments,
              customFieldsData,
              status: value,
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
          isDisabled={!(idProp || borrowerModelProp)}
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
              !(idProp || borrowerModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
