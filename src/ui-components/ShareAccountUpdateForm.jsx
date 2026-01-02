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
import { getShareAccount } from "../graphql/queries";
import { updateShareAccount } from "../graphql/mutations";
const client = generateClient();
export default function ShareAccountUpdateForm(props) {
  const {
    id: idProp,
    shareAccount: shareAccountModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    numberOfShares: "",
    shareValue: "",
    totalValue: "",
    customShareAccountDetails: "",
  };
  const [numberOfShares, setNumberOfShares] = React.useState(
    initialValues.numberOfShares
  );
  const [shareValue, setShareValue] = React.useState(initialValues.shareValue);
  const [totalValue, setTotalValue] = React.useState(initialValues.totalValue);
  const [customShareAccountDetails, setCustomShareAccountDetails] =
    React.useState(initialValues.customShareAccountDetails);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = shareAccountRecord
      ? { ...initialValues, ...shareAccountRecord }
      : initialValues;
    setNumberOfShares(cleanValues.numberOfShares);
    setShareValue(cleanValues.shareValue);
    setTotalValue(cleanValues.totalValue);
    setCustomShareAccountDetails(
      typeof cleanValues.customShareAccountDetails === "string" ||
        cleanValues.customShareAccountDetails === null
        ? cleanValues.customShareAccountDetails
        : JSON.stringify(cleanValues.customShareAccountDetails)
    );
    setErrors({});
  };
  const [shareAccountRecord, setShareAccountRecord] = React.useState(
    shareAccountModelProp
  );
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getShareAccount.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getShareAccount
        : shareAccountModelProp;
      setShareAccountRecord(record);
    };
    queryData();
  }, [idProp, shareAccountModelProp]);
  React.useEffect(resetStateValues, [shareAccountRecord]);
  const validations = {
    numberOfShares: [],
    shareValue: [],
    totalValue: [],
    customShareAccountDetails: [{ type: "JSON" }],
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
          numberOfShares: numberOfShares ?? null,
          shareValue: shareValue ?? null,
          totalValue: totalValue ?? null,
          customShareAccountDetails: customShareAccountDetails ?? null,
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
            query: updateShareAccount.replaceAll("__typename", ""),
            variables: {
              input: {
                id: shareAccountRecord.id,
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
      {...getOverrideProps(overrides, "ShareAccountUpdateForm")}
      {...rest}
    >
      <TextField
        label="Number of shares"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={numberOfShares}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              numberOfShares: value,
              shareValue,
              totalValue,
              customShareAccountDetails,
            };
            const result = onChange(modelFields);
            value = result?.numberOfShares ?? value;
          }
          if (errors.numberOfShares?.hasError) {
            runValidationTasks("numberOfShares", value);
          }
          setNumberOfShares(value);
        }}
        onBlur={() => runValidationTasks("numberOfShares", numberOfShares)}
        errorMessage={errors.numberOfShares?.errorMessage}
        hasError={errors.numberOfShares?.hasError}
        {...getOverrideProps(overrides, "numberOfShares")}
      ></TextField>
      <TextField
        label="Share value"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={shareValue}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              numberOfShares,
              shareValue: value,
              totalValue,
              customShareAccountDetails,
            };
            const result = onChange(modelFields);
            value = result?.shareValue ?? value;
          }
          if (errors.shareValue?.hasError) {
            runValidationTasks("shareValue", value);
          }
          setShareValue(value);
        }}
        onBlur={() => runValidationTasks("shareValue", shareValue)}
        errorMessage={errors.shareValue?.errorMessage}
        hasError={errors.shareValue?.hasError}
        {...getOverrideProps(overrides, "shareValue")}
      ></TextField>
      <TextField
        label="Total value"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={totalValue}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              numberOfShares,
              shareValue,
              totalValue: value,
              customShareAccountDetails,
            };
            const result = onChange(modelFields);
            value = result?.totalValue ?? value;
          }
          if (errors.totalValue?.hasError) {
            runValidationTasks("totalValue", value);
          }
          setTotalValue(value);
        }}
        onBlur={() => runValidationTasks("totalValue", totalValue)}
        errorMessage={errors.totalValue?.errorMessage}
        hasError={errors.totalValue?.hasError}
        {...getOverrideProps(overrides, "totalValue")}
      ></TextField>
      <TextAreaField
        label="Custom share account details"
        isRequired={false}
        isReadOnly={false}
        value={customShareAccountDetails}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              numberOfShares,
              shareValue,
              totalValue,
              customShareAccountDetails: value,
            };
            const result = onChange(modelFields);
            value = result?.customShareAccountDetails ?? value;
          }
          if (errors.customShareAccountDetails?.hasError) {
            runValidationTasks("customShareAccountDetails", value);
          }
          setCustomShareAccountDetails(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "customShareAccountDetails",
            customShareAccountDetails
          )
        }
        errorMessage={errors.customShareAccountDetails?.errorMessage}
        hasError={errors.customShareAccountDetails?.hasError}
        {...getOverrideProps(overrides, "customShareAccountDetails")}
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
          isDisabled={!(idProp || shareAccountModelProp)}
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
              !(idProp || shareAccountModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
