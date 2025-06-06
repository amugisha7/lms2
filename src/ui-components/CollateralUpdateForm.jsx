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
import { getCollateral } from "../graphql/queries";
import { updateCollateral } from "../graphql/mutations";
const client = generateClient();
export default function CollateralUpdateForm(props) {
  const {
    id: idProp,
    collateral: collateralModelProp,
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
    type: "",
    description: "",
    location: "",
    value: "",
    serialNumber: "",
    registrationNumber: "",
    insuranceDetails: "",
    insuranceExpiryDate: "",
    insuranceCompany: "",
    storedAt: "",
    customFieldsData: "",
  };
  const [name, setName] = React.useState(initialValues.name);
  const [type, setType] = React.useState(initialValues.type);
  const [description, setDescription] = React.useState(
    initialValues.description
  );
  const [location, setLocation] = React.useState(initialValues.location);
  const [value, setValue] = React.useState(initialValues.value);
  const [serialNumber, setSerialNumber] = React.useState(
    initialValues.serialNumber
  );
  const [registrationNumber, setRegistrationNumber] = React.useState(
    initialValues.registrationNumber
  );
  const [insuranceDetails, setInsuranceDetails] = React.useState(
    initialValues.insuranceDetails
  );
  const [insuranceExpiryDate, setInsuranceExpiryDate] = React.useState(
    initialValues.insuranceExpiryDate
  );
  const [insuranceCompany, setInsuranceCompany] = React.useState(
    initialValues.insuranceCompany
  );
  const [storedAt, setStoredAt] = React.useState(initialValues.storedAt);
  const [customFieldsData, setCustomFieldsData] = React.useState(
    initialValues.customFieldsData
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = collateralRecord
      ? { ...initialValues, ...collateralRecord }
      : initialValues;
    setName(cleanValues.name);
    setType(cleanValues.type);
    setDescription(cleanValues.description);
    setLocation(cleanValues.location);
    setValue(cleanValues.value);
    setSerialNumber(cleanValues.serialNumber);
    setRegistrationNumber(cleanValues.registrationNumber);
    setInsuranceDetails(cleanValues.insuranceDetails);
    setInsuranceExpiryDate(cleanValues.insuranceExpiryDate);
    setInsuranceCompany(cleanValues.insuranceCompany);
    setStoredAt(cleanValues.storedAt);
    setCustomFieldsData(
      typeof cleanValues.customFieldsData === "string" ||
        cleanValues.customFieldsData === null
        ? cleanValues.customFieldsData
        : JSON.stringify(cleanValues.customFieldsData)
    );
    setErrors({});
  };
  const [collateralRecord, setCollateralRecord] =
    React.useState(collateralModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getCollateral.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getCollateral
        : collateralModelProp;
      setCollateralRecord(record);
    };
    queryData();
  }, [idProp, collateralModelProp]);
  React.useEffect(resetStateValues, [collateralRecord]);
  const validations = {
    name: [],
    type: [],
    description: [],
    location: [],
    value: [],
    serialNumber: [],
    registrationNumber: [],
    insuranceDetails: [],
    insuranceExpiryDate: [],
    insuranceCompany: [],
    storedAt: [],
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
          type: type ?? null,
          description: description ?? null,
          location: location ?? null,
          value: value ?? null,
          serialNumber: serialNumber ?? null,
          registrationNumber: registrationNumber ?? null,
          insuranceDetails: insuranceDetails ?? null,
          insuranceExpiryDate: insuranceExpiryDate ?? null,
          insuranceCompany: insuranceCompany ?? null,
          storedAt: storedAt ?? null,
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
            query: updateCollateral.replaceAll("__typename", ""),
            variables: {
              input: {
                id: collateralRecord.id,
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
      {...getOverrideProps(overrides, "CollateralUpdateForm")}
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
              type,
              description,
              location,
              value,
              serialNumber,
              registrationNumber,
              insuranceDetails,
              insuranceExpiryDate,
              insuranceCompany,
              storedAt,
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
        label="Type"
        isRequired={false}
        isReadOnly={false}
        value={type}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              type: value,
              description,
              location,
              value,
              serialNumber,
              registrationNumber,
              insuranceDetails,
              insuranceExpiryDate,
              insuranceCompany,
              storedAt,
              customFieldsData,
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
        label="Description"
        isRequired={false}
        isReadOnly={false}
        value={description}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              type,
              description: value,
              location,
              value,
              serialNumber,
              registrationNumber,
              insuranceDetails,
              insuranceExpiryDate,
              insuranceCompany,
              storedAt,
              customFieldsData,
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
        label="Location"
        isRequired={false}
        isReadOnly={false}
        value={location}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              type,
              description,
              location: value,
              value,
              serialNumber,
              registrationNumber,
              insuranceDetails,
              insuranceExpiryDate,
              insuranceCompany,
              storedAt,
              customFieldsData,
            };
            const result = onChange(modelFields);
            value = result?.location ?? value;
          }
          if (errors.location?.hasError) {
            runValidationTasks("location", value);
          }
          setLocation(value);
        }}
        onBlur={() => runValidationTasks("location", location)}
        errorMessage={errors.location?.errorMessage}
        hasError={errors.location?.hasError}
        {...getOverrideProps(overrides, "location")}
      ></TextField>
      <TextField
        label="Value"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={value}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              type,
              description,
              location,
              value: value,
              serialNumber,
              registrationNumber,
              insuranceDetails,
              insuranceExpiryDate,
              insuranceCompany,
              storedAt,
              customFieldsData,
            };
            const result = onChange(modelFields);
            value = result?.value ?? value;
          }
          if (errors.value?.hasError) {
            runValidationTasks("value", value);
          }
          setValue(value);
        }}
        onBlur={() => runValidationTasks("value", value)}
        errorMessage={errors.value?.errorMessage}
        hasError={errors.value?.hasError}
        {...getOverrideProps(overrides, "value")}
      ></TextField>
      <TextField
        label="Serial number"
        isRequired={false}
        isReadOnly={false}
        value={serialNumber}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              type,
              description,
              location,
              value,
              serialNumber: value,
              registrationNumber,
              insuranceDetails,
              insuranceExpiryDate,
              insuranceCompany,
              storedAt,
              customFieldsData,
            };
            const result = onChange(modelFields);
            value = result?.serialNumber ?? value;
          }
          if (errors.serialNumber?.hasError) {
            runValidationTasks("serialNumber", value);
          }
          setSerialNumber(value);
        }}
        onBlur={() => runValidationTasks("serialNumber", serialNumber)}
        errorMessage={errors.serialNumber?.errorMessage}
        hasError={errors.serialNumber?.hasError}
        {...getOverrideProps(overrides, "serialNumber")}
      ></TextField>
      <TextField
        label="Registration number"
        isRequired={false}
        isReadOnly={false}
        value={registrationNumber}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              type,
              description,
              location,
              value,
              serialNumber,
              registrationNumber: value,
              insuranceDetails,
              insuranceExpiryDate,
              insuranceCompany,
              storedAt,
              customFieldsData,
            };
            const result = onChange(modelFields);
            value = result?.registrationNumber ?? value;
          }
          if (errors.registrationNumber?.hasError) {
            runValidationTasks("registrationNumber", value);
          }
          setRegistrationNumber(value);
        }}
        onBlur={() =>
          runValidationTasks("registrationNumber", registrationNumber)
        }
        errorMessage={errors.registrationNumber?.errorMessage}
        hasError={errors.registrationNumber?.hasError}
        {...getOverrideProps(overrides, "registrationNumber")}
      ></TextField>
      <TextField
        label="Insurance details"
        isRequired={false}
        isReadOnly={false}
        value={insuranceDetails}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              type,
              description,
              location,
              value,
              serialNumber,
              registrationNumber,
              insuranceDetails: value,
              insuranceExpiryDate,
              insuranceCompany,
              storedAt,
              customFieldsData,
            };
            const result = onChange(modelFields);
            value = result?.insuranceDetails ?? value;
          }
          if (errors.insuranceDetails?.hasError) {
            runValidationTasks("insuranceDetails", value);
          }
          setInsuranceDetails(value);
        }}
        onBlur={() => runValidationTasks("insuranceDetails", insuranceDetails)}
        errorMessage={errors.insuranceDetails?.errorMessage}
        hasError={errors.insuranceDetails?.hasError}
        {...getOverrideProps(overrides, "insuranceDetails")}
      ></TextField>
      <TextField
        label="Insurance expiry date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={insuranceExpiryDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              type,
              description,
              location,
              value,
              serialNumber,
              registrationNumber,
              insuranceDetails,
              insuranceExpiryDate: value,
              insuranceCompany,
              storedAt,
              customFieldsData,
            };
            const result = onChange(modelFields);
            value = result?.insuranceExpiryDate ?? value;
          }
          if (errors.insuranceExpiryDate?.hasError) {
            runValidationTasks("insuranceExpiryDate", value);
          }
          setInsuranceExpiryDate(value);
        }}
        onBlur={() =>
          runValidationTasks("insuranceExpiryDate", insuranceExpiryDate)
        }
        errorMessage={errors.insuranceExpiryDate?.errorMessage}
        hasError={errors.insuranceExpiryDate?.hasError}
        {...getOverrideProps(overrides, "insuranceExpiryDate")}
      ></TextField>
      <TextField
        label="Insurance company"
        isRequired={false}
        isReadOnly={false}
        value={insuranceCompany}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              type,
              description,
              location,
              value,
              serialNumber,
              registrationNumber,
              insuranceDetails,
              insuranceExpiryDate,
              insuranceCompany: value,
              storedAt,
              customFieldsData,
            };
            const result = onChange(modelFields);
            value = result?.insuranceCompany ?? value;
          }
          if (errors.insuranceCompany?.hasError) {
            runValidationTasks("insuranceCompany", value);
          }
          setInsuranceCompany(value);
        }}
        onBlur={() => runValidationTasks("insuranceCompany", insuranceCompany)}
        errorMessage={errors.insuranceCompany?.errorMessage}
        hasError={errors.insuranceCompany?.hasError}
        {...getOverrideProps(overrides, "insuranceCompany")}
      ></TextField>
      <TextField
        label="Stored at"
        isRequired={false}
        isReadOnly={false}
        value={storedAt}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              type,
              description,
              location,
              value,
              serialNumber,
              registrationNumber,
              insuranceDetails,
              insuranceExpiryDate,
              insuranceCompany,
              storedAt: value,
              customFieldsData,
            };
            const result = onChange(modelFields);
            value = result?.storedAt ?? value;
          }
          if (errors.storedAt?.hasError) {
            runValidationTasks("storedAt", value);
          }
          setStoredAt(value);
        }}
        onBlur={() => runValidationTasks("storedAt", storedAt)}
        errorMessage={errors.storedAt?.errorMessage}
        hasError={errors.storedAt?.hasError}
        {...getOverrideProps(overrides, "storedAt")}
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
              type,
              description,
              location,
              value,
              serialNumber,
              registrationNumber,
              insuranceDetails,
              insuranceExpiryDate,
              insuranceCompany,
              storedAt,
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
          isDisabled={!(idProp || collateralModelProp)}
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
              !(idProp || collateralModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
