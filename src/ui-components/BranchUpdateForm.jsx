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
import { getBranch } from "../graphql/queries";
import { updateBranch } from "../graphql/mutations";
const client = generateClient();
export default function BranchUpdateForm(props) {
  const {
    id: idProp,
    branch: branchModelProp,
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
    branchCode: "",
    address: "",
    status: "",
    customBranchDetails: "",
  };
  const [name, setName] = React.useState(initialValues.name);
  const [branchCode, setBranchCode] = React.useState(initialValues.branchCode);
  const [address, setAddress] = React.useState(initialValues.address);
  const [status, setStatus] = React.useState(initialValues.status);
  const [customBranchDetails, setCustomBranchDetails] = React.useState(
    initialValues.customBranchDetails
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = branchRecord
      ? { ...initialValues, ...branchRecord }
      : initialValues;
    setName(cleanValues.name);
    setBranchCode(cleanValues.branchCode);
    setAddress(cleanValues.address);
    setStatus(cleanValues.status);
    setCustomBranchDetails(
      typeof cleanValues.customBranchDetails === "string" ||
        cleanValues.customBranchDetails === null
        ? cleanValues.customBranchDetails
        : JSON.stringify(cleanValues.customBranchDetails)
    );
    setErrors({});
  };
  const [branchRecord, setBranchRecord] = React.useState(branchModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getBranch.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getBranch
        : branchModelProp;
      setBranchRecord(record);
    };
    queryData();
  }, [idProp, branchModelProp]);
  React.useEffect(resetStateValues, [branchRecord]);
  const validations = {
    name: [],
    branchCode: [],
    address: [],
    status: [],
    customBranchDetails: [{ type: "JSON" }],
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
          branchCode: branchCode ?? null,
          address: address ?? null,
          status: status ?? null,
          customBranchDetails: customBranchDetails ?? null,
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
            query: updateBranch.replaceAll("__typename", ""),
            variables: {
              input: {
                id: branchRecord.id,
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
      {...getOverrideProps(overrides, "BranchUpdateForm")}
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
              branchCode,
              address,
              status,
              customBranchDetails,
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
        label="Branch code"
        isRequired={false}
        isReadOnly={false}
        value={branchCode}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              branchCode: value,
              address,
              status,
              customBranchDetails,
            };
            const result = onChange(modelFields);
            value = result?.branchCode ?? value;
          }
          if (errors.branchCode?.hasError) {
            runValidationTasks("branchCode", value);
          }
          setBranchCode(value);
        }}
        onBlur={() => runValidationTasks("branchCode", branchCode)}
        errorMessage={errors.branchCode?.errorMessage}
        hasError={errors.branchCode?.hasError}
        {...getOverrideProps(overrides, "branchCode")}
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
              branchCode,
              address: value,
              status,
              customBranchDetails,
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
        label="Status"
        isRequired={false}
        isReadOnly={false}
        value={status}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              branchCode,
              address,
              status: value,
              customBranchDetails,
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
      <TextAreaField
        label="Custom branch details"
        isRequired={false}
        isReadOnly={false}
        value={customBranchDetails}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              branchCode,
              address,
              status,
              customBranchDetails: value,
            };
            const result = onChange(modelFields);
            value = result?.customBranchDetails ?? value;
          }
          if (errors.customBranchDetails?.hasError) {
            runValidationTasks("customBranchDetails", value);
          }
          setCustomBranchDetails(value);
        }}
        onBlur={() =>
          runValidationTasks("customBranchDetails", customBranchDetails)
        }
        errorMessage={errors.customBranchDetails?.errorMessage}
        hasError={errors.customBranchDetails?.hasError}
        {...getOverrideProps(overrides, "customBranchDetails")}
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
          isDisabled={!(idProp || branchModelProp)}
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
              !(idProp || branchModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
