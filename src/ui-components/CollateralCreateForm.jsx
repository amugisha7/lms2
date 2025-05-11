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
import { createCollateral } from "../graphql/mutations";
const client = generateClient();
export default function CollateralCreateForm(props) {
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
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setName(initialValues.name);
    setType(initialValues.type);
    setDescription(initialValues.description);
    setLocation(initialValues.location);
    setValue(initialValues.value);
    setSerialNumber(initialValues.serialNumber);
    setRegistrationNumber(initialValues.registrationNumber);
    setInsuranceDetails(initialValues.insuranceDetails);
    setInsuranceExpiryDate(initialValues.insuranceExpiryDate);
    setInsuranceCompany(initialValues.insuranceCompany);
    setStoredAt(initialValues.storedAt);
    setErrors({});
  };
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
            query: createCollateral.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "CollateralCreateForm")}
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
