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
    zipcode: "",
    employmentStatus: "",
    employerName: "",
    creditScore: "",
    additionalNote1: "",
    additionalNote2: "",
    borrowerDocument1: "",
    borrowerDocument1URL: "",
    borrowerDocument2: "",
    borrowerDocument2URL: "",
    borrowerDocument3: "",
    borrowerDocument3URL: "",
    borrowerDocument4: "",
    borrowerDocument4URL: "",
    borrowerStatus: "",
    borrowertype: "",
    borrowerAttribute1: "",
    borrowerAttribute2: "",
    customFieldsData: "",
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
  const [borrowerDocument1, setBorrowerDocument1] = React.useState(
    initialValues.borrowerDocument1
  );
  const [borrowerDocument1URL, setBorrowerDocument1URL] = React.useState(
    initialValues.borrowerDocument1URL
  );
  const [borrowerDocument2, setBorrowerDocument2] = React.useState(
    initialValues.borrowerDocument2
  );
  const [borrowerDocument2URL, setBorrowerDocument2URL] = React.useState(
    initialValues.borrowerDocument2URL
  );
  const [borrowerDocument3, setBorrowerDocument3] = React.useState(
    initialValues.borrowerDocument3
  );
  const [borrowerDocument3URL, setBorrowerDocument3URL] = React.useState(
    initialValues.borrowerDocument3URL
  );
  const [borrowerDocument4, setBorrowerDocument4] = React.useState(
    initialValues.borrowerDocument4
  );
  const [borrowerDocument4URL, setBorrowerDocument4URL] = React.useState(
    initialValues.borrowerDocument4URL
  );
  const [borrowerStatus, setBorrowerStatus] = React.useState(
    initialValues.borrowerStatus
  );
  const [borrowertype, setBorrowertype] = React.useState(
    initialValues.borrowertype
  );
  const [borrowerAttribute1, setBorrowerAttribute1] = React.useState(
    initialValues.borrowerAttribute1
  );
  const [borrowerAttribute2, setBorrowerAttribute2] = React.useState(
    initialValues.borrowerAttribute2
  );
  const [customFieldsData, setCustomFieldsData] = React.useState(
    initialValues.customFieldsData
  );
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
    setZipcode(cleanValues.zipcode);
    setEmploymentStatus(cleanValues.employmentStatus);
    setEmployerName(cleanValues.employerName);
    setCreditScore(cleanValues.creditScore);
    setAdditionalNote1(cleanValues.additionalNote1);
    setAdditionalNote2(cleanValues.additionalNote2);
    setBorrowerDocument1(cleanValues.borrowerDocument1);
    setBorrowerDocument1URL(cleanValues.borrowerDocument1URL);
    setBorrowerDocument2(cleanValues.borrowerDocument2);
    setBorrowerDocument2URL(cleanValues.borrowerDocument2URL);
    setBorrowerDocument3(cleanValues.borrowerDocument3);
    setBorrowerDocument3URL(cleanValues.borrowerDocument3URL);
    setBorrowerDocument4(cleanValues.borrowerDocument4);
    setBorrowerDocument4URL(cleanValues.borrowerDocument4URL);
    setBorrowerStatus(cleanValues.borrowerStatus);
    setBorrowertype(cleanValues.borrowertype);
    setBorrowerAttribute1(cleanValues.borrowerAttribute1);
    setBorrowerAttribute2(cleanValues.borrowerAttribute2);
    setCustomFieldsData(
      typeof cleanValues.customFieldsData === "string" ||
        cleanValues.customFieldsData === null
        ? cleanValues.customFieldsData
        : JSON.stringify(cleanValues.customFieldsData)
    );
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
    zipcode: [],
    employmentStatus: [],
    employerName: [],
    creditScore: [],
    additionalNote1: [],
    additionalNote2: [],
    borrowerDocument1: [],
    borrowerDocument1URL: [],
    borrowerDocument2: [],
    borrowerDocument2URL: [],
    borrowerDocument3: [],
    borrowerDocument3URL: [],
    borrowerDocument4: [],
    borrowerDocument4URL: [],
    borrowerStatus: [],
    borrowertype: [],
    borrowerAttribute1: [],
    borrowerAttribute2: [],
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
          zipcode: zipcode ?? null,
          employmentStatus: employmentStatus ?? null,
          employerName: employerName ?? null,
          creditScore: creditScore ?? null,
          additionalNote1: additionalNote1 ?? null,
          additionalNote2: additionalNote2 ?? null,
          borrowerDocument1: borrowerDocument1 ?? null,
          borrowerDocument1URL: borrowerDocument1URL ?? null,
          borrowerDocument2: borrowerDocument2 ?? null,
          borrowerDocument2URL: borrowerDocument2URL ?? null,
          borrowerDocument3: borrowerDocument3 ?? null,
          borrowerDocument3URL: borrowerDocument3URL ?? null,
          borrowerDocument4: borrowerDocument4 ?? null,
          borrowerDocument4URL: borrowerDocument4URL ?? null,
          borrowerStatus: borrowerStatus ?? null,
          borrowertype: borrowertype ?? null,
          borrowerAttribute1: borrowerAttribute1 ?? null,
          borrowerAttribute2: borrowerAttribute2 ?? null,
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
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocument1,
              borrowerDocument1URL,
              borrowerDocument2,
              borrowerDocument2URL,
              borrowerDocument3,
              borrowerDocument3URL,
              borrowerDocument4,
              borrowerDocument4URL,
              borrowerStatus,
              borrowertype,
              borrowerAttribute1,
              borrowerAttribute2,
              customFieldsData,
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
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocument1,
              borrowerDocument1URL,
              borrowerDocument2,
              borrowerDocument2URL,
              borrowerDocument3,
              borrowerDocument3URL,
              borrowerDocument4,
              borrowerDocument4URL,
              borrowerStatus,
              borrowertype,
              borrowerAttribute1,
              borrowerAttribute2,
              customFieldsData,
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
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocument1,
              borrowerDocument1URL,
              borrowerDocument2,
              borrowerDocument2URL,
              borrowerDocument3,
              borrowerDocument3URL,
              borrowerDocument4,
              borrowerDocument4URL,
              borrowerStatus,
              borrowertype,
              borrowerAttribute1,
              borrowerAttribute2,
              customFieldsData,
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
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocument1,
              borrowerDocument1URL,
              borrowerDocument2,
              borrowerDocument2URL,
              borrowerDocument3,
              borrowerDocument3URL,
              borrowerDocument4,
              borrowerDocument4URL,
              borrowerStatus,
              borrowertype,
              borrowerAttribute1,
              borrowerAttribute2,
              customFieldsData,
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
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocument1,
              borrowerDocument1URL,
              borrowerDocument2,
              borrowerDocument2URL,
              borrowerDocument3,
              borrowerDocument3URL,
              borrowerDocument4,
              borrowerDocument4URL,
              borrowerStatus,
              borrowertype,
              borrowerAttribute1,
              borrowerAttribute2,
              customFieldsData,
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
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocument1,
              borrowerDocument1URL,
              borrowerDocument2,
              borrowerDocument2URL,
              borrowerDocument3,
              borrowerDocument3URL,
              borrowerDocument4,
              borrowerDocument4URL,
              borrowerStatus,
              borrowertype,
              borrowerAttribute1,
              borrowerAttribute2,
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
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocument1,
              borrowerDocument1URL,
              borrowerDocument2,
              borrowerDocument2URL,
              borrowerDocument3,
              borrowerDocument3URL,
              borrowerDocument4,
              borrowerDocument4URL,
              borrowerStatus,
              borrowertype,
              borrowerAttribute1,
              borrowerAttribute2,
              customFieldsData,
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
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocument1,
              borrowerDocument1URL,
              borrowerDocument2,
              borrowerDocument2URL,
              borrowerDocument3,
              borrowerDocument3URL,
              borrowerDocument4,
              borrowerDocument4URL,
              borrowerStatus,
              borrowertype,
              borrowerAttribute1,
              borrowerAttribute2,
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
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocument1,
              borrowerDocument1URL,
              borrowerDocument2,
              borrowerDocument2URL,
              borrowerDocument3,
              borrowerDocument3URL,
              borrowerDocument4,
              borrowerDocument4URL,
              borrowerStatus,
              borrowertype,
              borrowerAttribute1,
              borrowerAttribute2,
              customFieldsData,
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
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocument1,
              borrowerDocument1URL,
              borrowerDocument2,
              borrowerDocument2URL,
              borrowerDocument3,
              borrowerDocument3URL,
              borrowerDocument4,
              borrowerDocument4URL,
              borrowerStatus,
              borrowertype,
              borrowerAttribute1,
              borrowerAttribute2,
              customFieldsData,
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
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocument1,
              borrowerDocument1URL,
              borrowerDocument2,
              borrowerDocument2URL,
              borrowerDocument3,
              borrowerDocument3URL,
              borrowerDocument4,
              borrowerDocument4URL,
              borrowerStatus,
              borrowertype,
              borrowerAttribute1,
              borrowerAttribute2,
              customFieldsData,
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
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocument1,
              borrowerDocument1URL,
              borrowerDocument2,
              borrowerDocument2URL,
              borrowerDocument3,
              borrowerDocument3URL,
              borrowerDocument4,
              borrowerDocument4URL,
              borrowerStatus,
              borrowertype,
              borrowerAttribute1,
              borrowerAttribute2,
              customFieldsData,
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
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocument1,
              borrowerDocument1URL,
              borrowerDocument2,
              borrowerDocument2URL,
              borrowerDocument3,
              borrowerDocument3URL,
              borrowerDocument4,
              borrowerDocument4URL,
              borrowerStatus,
              borrowertype,
              borrowerAttribute1,
              borrowerAttribute2,
              customFieldsData,
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
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocument1,
              borrowerDocument1URL,
              borrowerDocument2,
              borrowerDocument2URL,
              borrowerDocument3,
              borrowerDocument3URL,
              borrowerDocument4,
              borrowerDocument4URL,
              borrowerStatus,
              borrowertype,
              borrowerAttribute1,
              borrowerAttribute2,
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
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocument1,
              borrowerDocument1URL,
              borrowerDocument2,
              borrowerDocument2URL,
              borrowerDocument3,
              borrowerDocument3URL,
              borrowerDocument4,
              borrowerDocument4URL,
              borrowerStatus,
              borrowertype,
              borrowerAttribute1,
              borrowerAttribute2,
              customFieldsData,
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
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocument1,
              borrowerDocument1URL,
              borrowerDocument2,
              borrowerDocument2URL,
              borrowerDocument3,
              borrowerDocument3URL,
              borrowerDocument4,
              borrowerDocument4URL,
              borrowerStatus,
              borrowertype,
              borrowerAttribute1,
              borrowerAttribute2,
              customFieldsData,
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
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocument1,
              borrowerDocument1URL,
              borrowerDocument2,
              borrowerDocument2URL,
              borrowerDocument3,
              borrowerDocument3URL,
              borrowerDocument4,
              borrowerDocument4URL,
              borrowerStatus,
              borrowertype,
              borrowerAttribute1,
              borrowerAttribute2,
              customFieldsData,
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
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocument1,
              borrowerDocument1URL,
              borrowerDocument2,
              borrowerDocument2URL,
              borrowerDocument3,
              borrowerDocument3URL,
              borrowerDocument4,
              borrowerDocument4URL,
              borrowerStatus,
              borrowertype,
              borrowerAttribute1,
              borrowerAttribute2,
              customFieldsData,
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
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocument1,
              borrowerDocument1URL,
              borrowerDocument2,
              borrowerDocument2URL,
              borrowerDocument3,
              borrowerDocument3URL,
              borrowerDocument4,
              borrowerDocument4URL,
              borrowerStatus,
              borrowertype,
              borrowerAttribute1,
              borrowerAttribute2,
              customFieldsData,
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
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocument1,
              borrowerDocument1URL,
              borrowerDocument2,
              borrowerDocument2URL,
              borrowerDocument3,
              borrowerDocument3URL,
              borrowerDocument4,
              borrowerDocument4URL,
              borrowerStatus,
              borrowertype,
              borrowerAttribute1,
              borrowerAttribute2,
              customFieldsData,
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
              zipcode: value,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocument1,
              borrowerDocument1URL,
              borrowerDocument2,
              borrowerDocument2URL,
              borrowerDocument3,
              borrowerDocument3URL,
              borrowerDocument4,
              borrowerDocument4URL,
              borrowerStatus,
              borrowertype,
              borrowerAttribute1,
              borrowerAttribute2,
              customFieldsData,
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
              zipcode,
              employmentStatus: value,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocument1,
              borrowerDocument1URL,
              borrowerDocument2,
              borrowerDocument2URL,
              borrowerDocument3,
              borrowerDocument3URL,
              borrowerDocument4,
              borrowerDocument4URL,
              borrowerStatus,
              borrowertype,
              borrowerAttribute1,
              borrowerAttribute2,
              customFieldsData,
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
              zipcode,
              employmentStatus,
              employerName: value,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocument1,
              borrowerDocument1URL,
              borrowerDocument2,
              borrowerDocument2URL,
              borrowerDocument3,
              borrowerDocument3URL,
              borrowerDocument4,
              borrowerDocument4URL,
              borrowerStatus,
              borrowertype,
              borrowerAttribute1,
              borrowerAttribute2,
              customFieldsData,
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
              zipcode,
              employmentStatus,
              employerName,
              creditScore: value,
              additionalNote1,
              additionalNote2,
              borrowerDocument1,
              borrowerDocument1URL,
              borrowerDocument2,
              borrowerDocument2URL,
              borrowerDocument3,
              borrowerDocument3URL,
              borrowerDocument4,
              borrowerDocument4URL,
              borrowerStatus,
              borrowertype,
              borrowerAttribute1,
              borrowerAttribute2,
              customFieldsData,
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
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1: value,
              additionalNote2,
              borrowerDocument1,
              borrowerDocument1URL,
              borrowerDocument2,
              borrowerDocument2URL,
              borrowerDocument3,
              borrowerDocument3URL,
              borrowerDocument4,
              borrowerDocument4URL,
              borrowerStatus,
              borrowertype,
              borrowerAttribute1,
              borrowerAttribute2,
              customFieldsData,
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
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2: value,
              borrowerDocument1,
              borrowerDocument1URL,
              borrowerDocument2,
              borrowerDocument2URL,
              borrowerDocument3,
              borrowerDocument3URL,
              borrowerDocument4,
              borrowerDocument4URL,
              borrowerStatus,
              borrowertype,
              borrowerAttribute1,
              borrowerAttribute2,
              customFieldsData,
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
      <TextField
        label="Borrower document1"
        isRequired={false}
        isReadOnly={false}
        value={borrowerDocument1}
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
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocument1: value,
              borrowerDocument1URL,
              borrowerDocument2,
              borrowerDocument2URL,
              borrowerDocument3,
              borrowerDocument3URL,
              borrowerDocument4,
              borrowerDocument4URL,
              borrowerStatus,
              borrowertype,
              borrowerAttribute1,
              borrowerAttribute2,
              customFieldsData,
            };
            const result = onChange(modelFields);
            value = result?.borrowerDocument1 ?? value;
          }
          if (errors.borrowerDocument1?.hasError) {
            runValidationTasks("borrowerDocument1", value);
          }
          setBorrowerDocument1(value);
        }}
        onBlur={() =>
          runValidationTasks("borrowerDocument1", borrowerDocument1)
        }
        errorMessage={errors.borrowerDocument1?.errorMessage}
        hasError={errors.borrowerDocument1?.hasError}
        {...getOverrideProps(overrides, "borrowerDocument1")}
      ></TextField>
      <TextField
        label="Borrower document1 url"
        isRequired={false}
        isReadOnly={false}
        value={borrowerDocument1URL}
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
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocument1,
              borrowerDocument1URL: value,
              borrowerDocument2,
              borrowerDocument2URL,
              borrowerDocument3,
              borrowerDocument3URL,
              borrowerDocument4,
              borrowerDocument4URL,
              borrowerStatus,
              borrowertype,
              borrowerAttribute1,
              borrowerAttribute2,
              customFieldsData,
            };
            const result = onChange(modelFields);
            value = result?.borrowerDocument1URL ?? value;
          }
          if (errors.borrowerDocument1URL?.hasError) {
            runValidationTasks("borrowerDocument1URL", value);
          }
          setBorrowerDocument1URL(value);
        }}
        onBlur={() =>
          runValidationTasks("borrowerDocument1URL", borrowerDocument1URL)
        }
        errorMessage={errors.borrowerDocument1URL?.errorMessage}
        hasError={errors.borrowerDocument1URL?.hasError}
        {...getOverrideProps(overrides, "borrowerDocument1URL")}
      ></TextField>
      <TextField
        label="Borrower document2"
        isRequired={false}
        isReadOnly={false}
        value={borrowerDocument2}
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
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocument1,
              borrowerDocument1URL,
              borrowerDocument2: value,
              borrowerDocument2URL,
              borrowerDocument3,
              borrowerDocument3URL,
              borrowerDocument4,
              borrowerDocument4URL,
              borrowerStatus,
              borrowertype,
              borrowerAttribute1,
              borrowerAttribute2,
              customFieldsData,
            };
            const result = onChange(modelFields);
            value = result?.borrowerDocument2 ?? value;
          }
          if (errors.borrowerDocument2?.hasError) {
            runValidationTasks("borrowerDocument2", value);
          }
          setBorrowerDocument2(value);
        }}
        onBlur={() =>
          runValidationTasks("borrowerDocument2", borrowerDocument2)
        }
        errorMessage={errors.borrowerDocument2?.errorMessage}
        hasError={errors.borrowerDocument2?.hasError}
        {...getOverrideProps(overrides, "borrowerDocument2")}
      ></TextField>
      <TextField
        label="Borrower document2 url"
        isRequired={false}
        isReadOnly={false}
        value={borrowerDocument2URL}
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
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocument1,
              borrowerDocument1URL,
              borrowerDocument2,
              borrowerDocument2URL: value,
              borrowerDocument3,
              borrowerDocument3URL,
              borrowerDocument4,
              borrowerDocument4URL,
              borrowerStatus,
              borrowertype,
              borrowerAttribute1,
              borrowerAttribute2,
              customFieldsData,
            };
            const result = onChange(modelFields);
            value = result?.borrowerDocument2URL ?? value;
          }
          if (errors.borrowerDocument2URL?.hasError) {
            runValidationTasks("borrowerDocument2URL", value);
          }
          setBorrowerDocument2URL(value);
        }}
        onBlur={() =>
          runValidationTasks("borrowerDocument2URL", borrowerDocument2URL)
        }
        errorMessage={errors.borrowerDocument2URL?.errorMessage}
        hasError={errors.borrowerDocument2URL?.hasError}
        {...getOverrideProps(overrides, "borrowerDocument2URL")}
      ></TextField>
      <TextField
        label="Borrower document3"
        isRequired={false}
        isReadOnly={false}
        value={borrowerDocument3}
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
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocument1,
              borrowerDocument1URL,
              borrowerDocument2,
              borrowerDocument2URL,
              borrowerDocument3: value,
              borrowerDocument3URL,
              borrowerDocument4,
              borrowerDocument4URL,
              borrowerStatus,
              borrowertype,
              borrowerAttribute1,
              borrowerAttribute2,
              customFieldsData,
            };
            const result = onChange(modelFields);
            value = result?.borrowerDocument3 ?? value;
          }
          if (errors.borrowerDocument3?.hasError) {
            runValidationTasks("borrowerDocument3", value);
          }
          setBorrowerDocument3(value);
        }}
        onBlur={() =>
          runValidationTasks("borrowerDocument3", borrowerDocument3)
        }
        errorMessage={errors.borrowerDocument3?.errorMessage}
        hasError={errors.borrowerDocument3?.hasError}
        {...getOverrideProps(overrides, "borrowerDocument3")}
      ></TextField>
      <TextField
        label="Borrower document3 url"
        isRequired={false}
        isReadOnly={false}
        value={borrowerDocument3URL}
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
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocument1,
              borrowerDocument1URL,
              borrowerDocument2,
              borrowerDocument2URL,
              borrowerDocument3,
              borrowerDocument3URL: value,
              borrowerDocument4,
              borrowerDocument4URL,
              borrowerStatus,
              borrowertype,
              borrowerAttribute1,
              borrowerAttribute2,
              customFieldsData,
            };
            const result = onChange(modelFields);
            value = result?.borrowerDocument3URL ?? value;
          }
          if (errors.borrowerDocument3URL?.hasError) {
            runValidationTasks("borrowerDocument3URL", value);
          }
          setBorrowerDocument3URL(value);
        }}
        onBlur={() =>
          runValidationTasks("borrowerDocument3URL", borrowerDocument3URL)
        }
        errorMessage={errors.borrowerDocument3URL?.errorMessage}
        hasError={errors.borrowerDocument3URL?.hasError}
        {...getOverrideProps(overrides, "borrowerDocument3URL")}
      ></TextField>
      <TextField
        label="Borrower document4"
        isRequired={false}
        isReadOnly={false}
        value={borrowerDocument4}
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
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocument1,
              borrowerDocument1URL,
              borrowerDocument2,
              borrowerDocument2URL,
              borrowerDocument3,
              borrowerDocument3URL,
              borrowerDocument4: value,
              borrowerDocument4URL,
              borrowerStatus,
              borrowertype,
              borrowerAttribute1,
              borrowerAttribute2,
              customFieldsData,
            };
            const result = onChange(modelFields);
            value = result?.borrowerDocument4 ?? value;
          }
          if (errors.borrowerDocument4?.hasError) {
            runValidationTasks("borrowerDocument4", value);
          }
          setBorrowerDocument4(value);
        }}
        onBlur={() =>
          runValidationTasks("borrowerDocument4", borrowerDocument4)
        }
        errorMessage={errors.borrowerDocument4?.errorMessage}
        hasError={errors.borrowerDocument4?.hasError}
        {...getOverrideProps(overrides, "borrowerDocument4")}
      ></TextField>
      <TextField
        label="Borrower document4 url"
        isRequired={false}
        isReadOnly={false}
        value={borrowerDocument4URL}
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
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocument1,
              borrowerDocument1URL,
              borrowerDocument2,
              borrowerDocument2URL,
              borrowerDocument3,
              borrowerDocument3URL,
              borrowerDocument4,
              borrowerDocument4URL: value,
              borrowerStatus,
              borrowertype,
              borrowerAttribute1,
              borrowerAttribute2,
              customFieldsData,
            };
            const result = onChange(modelFields);
            value = result?.borrowerDocument4URL ?? value;
          }
          if (errors.borrowerDocument4URL?.hasError) {
            runValidationTasks("borrowerDocument4URL", value);
          }
          setBorrowerDocument4URL(value);
        }}
        onBlur={() =>
          runValidationTasks("borrowerDocument4URL", borrowerDocument4URL)
        }
        errorMessage={errors.borrowerDocument4URL?.errorMessage}
        hasError={errors.borrowerDocument4URL?.hasError}
        {...getOverrideProps(overrides, "borrowerDocument4URL")}
      ></TextField>
      <TextField
        label="Borrower status"
        isRequired={false}
        isReadOnly={false}
        value={borrowerStatus}
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
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocument1,
              borrowerDocument1URL,
              borrowerDocument2,
              borrowerDocument2URL,
              borrowerDocument3,
              borrowerDocument3URL,
              borrowerDocument4,
              borrowerDocument4URL,
              borrowerStatus: value,
              borrowertype,
              borrowerAttribute1,
              borrowerAttribute2,
              customFieldsData,
            };
            const result = onChange(modelFields);
            value = result?.borrowerStatus ?? value;
          }
          if (errors.borrowerStatus?.hasError) {
            runValidationTasks("borrowerStatus", value);
          }
          setBorrowerStatus(value);
        }}
        onBlur={() => runValidationTasks("borrowerStatus", borrowerStatus)}
        errorMessage={errors.borrowerStatus?.errorMessage}
        hasError={errors.borrowerStatus?.hasError}
        {...getOverrideProps(overrides, "borrowerStatus")}
      ></TextField>
      <TextField
        label="Borrowertype"
        isRequired={false}
        isReadOnly={false}
        value={borrowertype}
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
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocument1,
              borrowerDocument1URL,
              borrowerDocument2,
              borrowerDocument2URL,
              borrowerDocument3,
              borrowerDocument3URL,
              borrowerDocument4,
              borrowerDocument4URL,
              borrowerStatus,
              borrowertype: value,
              borrowerAttribute1,
              borrowerAttribute2,
              customFieldsData,
            };
            const result = onChange(modelFields);
            value = result?.borrowertype ?? value;
          }
          if (errors.borrowertype?.hasError) {
            runValidationTasks("borrowertype", value);
          }
          setBorrowertype(value);
        }}
        onBlur={() => runValidationTasks("borrowertype", borrowertype)}
        errorMessage={errors.borrowertype?.errorMessage}
        hasError={errors.borrowertype?.hasError}
        {...getOverrideProps(overrides, "borrowertype")}
      ></TextField>
      <TextField
        label="Borrower attribute1"
        isRequired={false}
        isReadOnly={false}
        value={borrowerAttribute1}
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
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocument1,
              borrowerDocument1URL,
              borrowerDocument2,
              borrowerDocument2URL,
              borrowerDocument3,
              borrowerDocument3URL,
              borrowerDocument4,
              borrowerDocument4URL,
              borrowerStatus,
              borrowertype,
              borrowerAttribute1: value,
              borrowerAttribute2,
              customFieldsData,
            };
            const result = onChange(modelFields);
            value = result?.borrowerAttribute1 ?? value;
          }
          if (errors.borrowerAttribute1?.hasError) {
            runValidationTasks("borrowerAttribute1", value);
          }
          setBorrowerAttribute1(value);
        }}
        onBlur={() =>
          runValidationTasks("borrowerAttribute1", borrowerAttribute1)
        }
        errorMessage={errors.borrowerAttribute1?.errorMessage}
        hasError={errors.borrowerAttribute1?.hasError}
        {...getOverrideProps(overrides, "borrowerAttribute1")}
      ></TextField>
      <TextField
        label="Borrower attribute2"
        isRequired={false}
        isReadOnly={false}
        value={borrowerAttribute2}
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
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocument1,
              borrowerDocument1URL,
              borrowerDocument2,
              borrowerDocument2URL,
              borrowerDocument3,
              borrowerDocument3URL,
              borrowerDocument4,
              borrowerDocument4URL,
              borrowerStatus,
              borrowertype,
              borrowerAttribute1,
              borrowerAttribute2: value,
              customFieldsData,
            };
            const result = onChange(modelFields);
            value = result?.borrowerAttribute2 ?? value;
          }
          if (errors.borrowerAttribute2?.hasError) {
            runValidationTasks("borrowerAttribute2", value);
          }
          setBorrowerAttribute2(value);
        }}
        onBlur={() =>
          runValidationTasks("borrowerAttribute2", borrowerAttribute2)
        }
        errorMessage={errors.borrowerAttribute2?.errorMessage}
        hasError={errors.borrowerAttribute2?.hasError}
        {...getOverrideProps(overrides, "borrowerAttribute2")}
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
              zipcode,
              employmentStatus,
              employerName,
              creditScore,
              additionalNote1,
              additionalNote2,
              borrowerDocument1,
              borrowerDocument1URL,
              borrowerDocument2,
              borrowerDocument2URL,
              borrowerDocument3,
              borrowerDocument3URL,
              borrowerDocument4,
              borrowerDocument4URL,
              borrowerStatus,
              borrowertype,
              borrowerAttribute1,
              borrowerAttribute2,
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
