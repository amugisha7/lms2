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
import { getLoanProduct } from "../graphql/queries";
import { updateLoanProduct } from "../graphql/mutations";
const client = generateClient();
export default function LoanProductUpdateForm(props) {
  const {
    id: idProp,
    loanProduct: loanProductModelProp,
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
    description: "",
    principalAmountMin: "",
    principalAmountMax: "",
    principalAmountDefault: "",
    interestRateMin: "",
    interestRateMax: "",
    interestRateDefault: "",
    interestCalculationMethod: "",
    interestType: "",
    interestPeriod: "",
    termDurationMin: "",
    termDurationMax: "",
    termDurationDefault: "",
    durationPeriod: "",
    repaymentFrequency: "",
    repaymentOrder: "",
    extendLoanAfterMaturity: false,
    interestTypeMaturity: "",
    calculateInterestOn: "",
    loanInterestRateAfterMaturity: "",
    recurringPeriodAfterMaturityUnit: "",
    status: "",
  };
  const [name, setName] = React.useState(initialValues.name);
  const [description, setDescription] = React.useState(
    initialValues.description
  );
  const [principalAmountMin, setPrincipalAmountMin] = React.useState(
    initialValues.principalAmountMin
  );
  const [principalAmountMax, setPrincipalAmountMax] = React.useState(
    initialValues.principalAmountMax
  );
  const [principalAmountDefault, setPrincipalAmountDefault] = React.useState(
    initialValues.principalAmountDefault
  );
  const [interestRateMin, setInterestRateMin] = React.useState(
    initialValues.interestRateMin
  );
  const [interestRateMax, setInterestRateMax] = React.useState(
    initialValues.interestRateMax
  );
  const [interestRateDefault, setInterestRateDefault] = React.useState(
    initialValues.interestRateDefault
  );
  const [interestCalculationMethod, setInterestCalculationMethod] =
    React.useState(initialValues.interestCalculationMethod);
  const [interestType, setInterestType] = React.useState(
    initialValues.interestType
  );
  const [interestPeriod, setInterestPeriod] = React.useState(
    initialValues.interestPeriod
  );
  const [termDurationMin, setTermDurationMin] = React.useState(
    initialValues.termDurationMin
  );
  const [termDurationMax, setTermDurationMax] = React.useState(
    initialValues.termDurationMax
  );
  const [termDurationDefault, setTermDurationDefault] = React.useState(
    initialValues.termDurationDefault
  );
  const [durationPeriod, setDurationPeriod] = React.useState(
    initialValues.durationPeriod
  );
  const [repaymentFrequency, setRepaymentFrequency] = React.useState(
    initialValues.repaymentFrequency
  );
  const [repaymentOrder, setRepaymentOrder] = React.useState(
    initialValues.repaymentOrder
  );
  const [extendLoanAfterMaturity, setExtendLoanAfterMaturity] = React.useState(
    initialValues.extendLoanAfterMaturity
  );
  const [interestTypeMaturity, setInterestTypeMaturity] = React.useState(
    initialValues.interestTypeMaturity
  );
  const [calculateInterestOn, setCalculateInterestOn] = React.useState(
    initialValues.calculateInterestOn
  );
  const [loanInterestRateAfterMaturity, setLoanInterestRateAfterMaturity] =
    React.useState(initialValues.loanInterestRateAfterMaturity);
  const [
    recurringPeriodAfterMaturityUnit,
    setRecurringPeriodAfterMaturityUnit,
  ] = React.useState(initialValues.recurringPeriodAfterMaturityUnit);
  const [status, setStatus] = React.useState(initialValues.status);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = loanProductRecord
      ? { ...initialValues, ...loanProductRecord }
      : initialValues;
    setName(cleanValues.name);
    setDescription(cleanValues.description);
    setPrincipalAmountMin(cleanValues.principalAmountMin);
    setPrincipalAmountMax(cleanValues.principalAmountMax);
    setPrincipalAmountDefault(cleanValues.principalAmountDefault);
    setInterestRateMin(cleanValues.interestRateMin);
    setInterestRateMax(cleanValues.interestRateMax);
    setInterestRateDefault(cleanValues.interestRateDefault);
    setInterestCalculationMethod(cleanValues.interestCalculationMethod);
    setInterestType(cleanValues.interestType);
    setInterestPeriod(cleanValues.interestPeriod);
    setTermDurationMin(cleanValues.termDurationMin);
    setTermDurationMax(cleanValues.termDurationMax);
    setTermDurationDefault(cleanValues.termDurationDefault);
    setDurationPeriod(cleanValues.durationPeriod);
    setRepaymentFrequency(cleanValues.repaymentFrequency);
    setRepaymentOrder(
      typeof cleanValues.repaymentOrder === "string" ||
        cleanValues.repaymentOrder === null
        ? cleanValues.repaymentOrder
        : JSON.stringify(cleanValues.repaymentOrder)
    );
    setExtendLoanAfterMaturity(cleanValues.extendLoanAfterMaturity);
    setInterestTypeMaturity(cleanValues.interestTypeMaturity);
    setCalculateInterestOn(cleanValues.calculateInterestOn);
    setLoanInterestRateAfterMaturity(cleanValues.loanInterestRateAfterMaturity);
    setRecurringPeriodAfterMaturityUnit(
      cleanValues.recurringPeriodAfterMaturityUnit
    );
    setStatus(cleanValues.status);
    setErrors({});
  };
  const [loanProductRecord, setLoanProductRecord] =
    React.useState(loanProductModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getLoanProduct.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getLoanProduct
        : loanProductModelProp;
      setLoanProductRecord(record);
    };
    queryData();
  }, [idProp, loanProductModelProp]);
  React.useEffect(resetStateValues, [loanProductRecord]);
  const validations = {
    name: [],
    description: [],
    principalAmountMin: [],
    principalAmountMax: [],
    principalAmountDefault: [],
    interestRateMin: [],
    interestRateMax: [],
    interestRateDefault: [],
    interestCalculationMethod: [],
    interestType: [],
    interestPeriod: [],
    termDurationMin: [],
    termDurationMax: [],
    termDurationDefault: [],
    durationPeriod: [],
    repaymentFrequency: [],
    repaymentOrder: [{ type: "JSON" }],
    extendLoanAfterMaturity: [],
    interestTypeMaturity: [],
    calculateInterestOn: [],
    loanInterestRateAfterMaturity: [],
    recurringPeriodAfterMaturityUnit: [],
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
          name: name ?? null,
          description: description ?? null,
          principalAmountMin: principalAmountMin ?? null,
          principalAmountMax: principalAmountMax ?? null,
          principalAmountDefault: principalAmountDefault ?? null,
          interestRateMin: interestRateMin ?? null,
          interestRateMax: interestRateMax ?? null,
          interestRateDefault: interestRateDefault ?? null,
          interestCalculationMethod: interestCalculationMethod ?? null,
          interestType: interestType ?? null,
          interestPeriod: interestPeriod ?? null,
          termDurationMin: termDurationMin ?? null,
          termDurationMax: termDurationMax ?? null,
          termDurationDefault: termDurationDefault ?? null,
          durationPeriod: durationPeriod ?? null,
          repaymentFrequency: repaymentFrequency ?? null,
          repaymentOrder: repaymentOrder ?? null,
          extendLoanAfterMaturity: extendLoanAfterMaturity ?? null,
          interestTypeMaturity: interestTypeMaturity ?? null,
          calculateInterestOn: calculateInterestOn ?? null,
          loanInterestRateAfterMaturity: loanInterestRateAfterMaturity ?? null,
          recurringPeriodAfterMaturityUnit:
            recurringPeriodAfterMaturityUnit ?? null,
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
            query: updateLoanProduct.replaceAll("__typename", ""),
            variables: {
              input: {
                id: loanProductRecord.id,
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
      {...getOverrideProps(overrides, "LoanProductUpdateForm")}
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
              description,
              principalAmountMin,
              principalAmountMax,
              principalAmountDefault,
              interestRateMin,
              interestRateMax,
              interestRateDefault,
              interestCalculationMethod,
              interestType,
              interestPeriod,
              termDurationMin,
              termDurationMax,
              termDurationDefault,
              durationPeriod,
              repaymentFrequency,
              repaymentOrder,
              extendLoanAfterMaturity,
              interestTypeMaturity,
              calculateInterestOn,
              loanInterestRateAfterMaturity,
              recurringPeriodAfterMaturityUnit,
              status,
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
        label="Description"
        isRequired={false}
        isReadOnly={false}
        value={description}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description: value,
              principalAmountMin,
              principalAmountMax,
              principalAmountDefault,
              interestRateMin,
              interestRateMax,
              interestRateDefault,
              interestCalculationMethod,
              interestType,
              interestPeriod,
              termDurationMin,
              termDurationMax,
              termDurationDefault,
              durationPeriod,
              repaymentFrequency,
              repaymentOrder,
              extendLoanAfterMaturity,
              interestTypeMaturity,
              calculateInterestOn,
              loanInterestRateAfterMaturity,
              recurringPeriodAfterMaturityUnit,
              status,
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
        label="Principal amount min"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={principalAmountMin}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              description,
              principalAmountMin: value,
              principalAmountMax,
              principalAmountDefault,
              interestRateMin,
              interestRateMax,
              interestRateDefault,
              interestCalculationMethod,
              interestType,
              interestPeriod,
              termDurationMin,
              termDurationMax,
              termDurationDefault,
              durationPeriod,
              repaymentFrequency,
              repaymentOrder,
              extendLoanAfterMaturity,
              interestTypeMaturity,
              calculateInterestOn,
              loanInterestRateAfterMaturity,
              recurringPeriodAfterMaturityUnit,
              status,
            };
            const result = onChange(modelFields);
            value = result?.principalAmountMin ?? value;
          }
          if (errors.principalAmountMin?.hasError) {
            runValidationTasks("principalAmountMin", value);
          }
          setPrincipalAmountMin(value);
        }}
        onBlur={() =>
          runValidationTasks("principalAmountMin", principalAmountMin)
        }
        errorMessage={errors.principalAmountMin?.errorMessage}
        hasError={errors.principalAmountMin?.hasError}
        {...getOverrideProps(overrides, "principalAmountMin")}
      ></TextField>
      <TextField
        label="Principal amount max"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={principalAmountMax}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              description,
              principalAmountMin,
              principalAmountMax: value,
              principalAmountDefault,
              interestRateMin,
              interestRateMax,
              interestRateDefault,
              interestCalculationMethod,
              interestType,
              interestPeriod,
              termDurationMin,
              termDurationMax,
              termDurationDefault,
              durationPeriod,
              repaymentFrequency,
              repaymentOrder,
              extendLoanAfterMaturity,
              interestTypeMaturity,
              calculateInterestOn,
              loanInterestRateAfterMaturity,
              recurringPeriodAfterMaturityUnit,
              status,
            };
            const result = onChange(modelFields);
            value = result?.principalAmountMax ?? value;
          }
          if (errors.principalAmountMax?.hasError) {
            runValidationTasks("principalAmountMax", value);
          }
          setPrincipalAmountMax(value);
        }}
        onBlur={() =>
          runValidationTasks("principalAmountMax", principalAmountMax)
        }
        errorMessage={errors.principalAmountMax?.errorMessage}
        hasError={errors.principalAmountMax?.hasError}
        {...getOverrideProps(overrides, "principalAmountMax")}
      ></TextField>
      <TextField
        label="Principal amount default"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={principalAmountDefault}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              description,
              principalAmountMin,
              principalAmountMax,
              principalAmountDefault: value,
              interestRateMin,
              interestRateMax,
              interestRateDefault,
              interestCalculationMethod,
              interestType,
              interestPeriod,
              termDurationMin,
              termDurationMax,
              termDurationDefault,
              durationPeriod,
              repaymentFrequency,
              repaymentOrder,
              extendLoanAfterMaturity,
              interestTypeMaturity,
              calculateInterestOn,
              loanInterestRateAfterMaturity,
              recurringPeriodAfterMaturityUnit,
              status,
            };
            const result = onChange(modelFields);
            value = result?.principalAmountDefault ?? value;
          }
          if (errors.principalAmountDefault?.hasError) {
            runValidationTasks("principalAmountDefault", value);
          }
          setPrincipalAmountDefault(value);
        }}
        onBlur={() =>
          runValidationTasks("principalAmountDefault", principalAmountDefault)
        }
        errorMessage={errors.principalAmountDefault?.errorMessage}
        hasError={errors.principalAmountDefault?.hasError}
        {...getOverrideProps(overrides, "principalAmountDefault")}
      ></TextField>
      <TextField
        label="Interest rate min"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={interestRateMin}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              description,
              principalAmountMin,
              principalAmountMax,
              principalAmountDefault,
              interestRateMin: value,
              interestRateMax,
              interestRateDefault,
              interestCalculationMethod,
              interestType,
              interestPeriod,
              termDurationMin,
              termDurationMax,
              termDurationDefault,
              durationPeriod,
              repaymentFrequency,
              repaymentOrder,
              extendLoanAfterMaturity,
              interestTypeMaturity,
              calculateInterestOn,
              loanInterestRateAfterMaturity,
              recurringPeriodAfterMaturityUnit,
              status,
            };
            const result = onChange(modelFields);
            value = result?.interestRateMin ?? value;
          }
          if (errors.interestRateMin?.hasError) {
            runValidationTasks("interestRateMin", value);
          }
          setInterestRateMin(value);
        }}
        onBlur={() => runValidationTasks("interestRateMin", interestRateMin)}
        errorMessage={errors.interestRateMin?.errorMessage}
        hasError={errors.interestRateMin?.hasError}
        {...getOverrideProps(overrides, "interestRateMin")}
      ></TextField>
      <TextField
        label="Interest rate max"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={interestRateMax}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              description,
              principalAmountMin,
              principalAmountMax,
              principalAmountDefault,
              interestRateMin,
              interestRateMax: value,
              interestRateDefault,
              interestCalculationMethod,
              interestType,
              interestPeriod,
              termDurationMin,
              termDurationMax,
              termDurationDefault,
              durationPeriod,
              repaymentFrequency,
              repaymentOrder,
              extendLoanAfterMaturity,
              interestTypeMaturity,
              calculateInterestOn,
              loanInterestRateAfterMaturity,
              recurringPeriodAfterMaturityUnit,
              status,
            };
            const result = onChange(modelFields);
            value = result?.interestRateMax ?? value;
          }
          if (errors.interestRateMax?.hasError) {
            runValidationTasks("interestRateMax", value);
          }
          setInterestRateMax(value);
        }}
        onBlur={() => runValidationTasks("interestRateMax", interestRateMax)}
        errorMessage={errors.interestRateMax?.errorMessage}
        hasError={errors.interestRateMax?.hasError}
        {...getOverrideProps(overrides, "interestRateMax")}
      ></TextField>
      <TextField
        label="Interest rate default"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={interestRateDefault}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              description,
              principalAmountMin,
              principalAmountMax,
              principalAmountDefault,
              interestRateMin,
              interestRateMax,
              interestRateDefault: value,
              interestCalculationMethod,
              interestType,
              interestPeriod,
              termDurationMin,
              termDurationMax,
              termDurationDefault,
              durationPeriod,
              repaymentFrequency,
              repaymentOrder,
              extendLoanAfterMaturity,
              interestTypeMaturity,
              calculateInterestOn,
              loanInterestRateAfterMaturity,
              recurringPeriodAfterMaturityUnit,
              status,
            };
            const result = onChange(modelFields);
            value = result?.interestRateDefault ?? value;
          }
          if (errors.interestRateDefault?.hasError) {
            runValidationTasks("interestRateDefault", value);
          }
          setInterestRateDefault(value);
        }}
        onBlur={() =>
          runValidationTasks("interestRateDefault", interestRateDefault)
        }
        errorMessage={errors.interestRateDefault?.errorMessage}
        hasError={errors.interestRateDefault?.hasError}
        {...getOverrideProps(overrides, "interestRateDefault")}
      ></TextField>
      <TextField
        label="Interest calculation method"
        isRequired={false}
        isReadOnly={false}
        value={interestCalculationMethod}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description,
              principalAmountMin,
              principalAmountMax,
              principalAmountDefault,
              interestRateMin,
              interestRateMax,
              interestRateDefault,
              interestCalculationMethod: value,
              interestType,
              interestPeriod,
              termDurationMin,
              termDurationMax,
              termDurationDefault,
              durationPeriod,
              repaymentFrequency,
              repaymentOrder,
              extendLoanAfterMaturity,
              interestTypeMaturity,
              calculateInterestOn,
              loanInterestRateAfterMaturity,
              recurringPeriodAfterMaturityUnit,
              status,
            };
            const result = onChange(modelFields);
            value = result?.interestCalculationMethod ?? value;
          }
          if (errors.interestCalculationMethod?.hasError) {
            runValidationTasks("interestCalculationMethod", value);
          }
          setInterestCalculationMethod(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "interestCalculationMethod",
            interestCalculationMethod
          )
        }
        errorMessage={errors.interestCalculationMethod?.errorMessage}
        hasError={errors.interestCalculationMethod?.hasError}
        {...getOverrideProps(overrides, "interestCalculationMethod")}
      ></TextField>
      <TextField
        label="Interest type"
        isRequired={false}
        isReadOnly={false}
        value={interestType}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description,
              principalAmountMin,
              principalAmountMax,
              principalAmountDefault,
              interestRateMin,
              interestRateMax,
              interestRateDefault,
              interestCalculationMethod,
              interestType: value,
              interestPeriod,
              termDurationMin,
              termDurationMax,
              termDurationDefault,
              durationPeriod,
              repaymentFrequency,
              repaymentOrder,
              extendLoanAfterMaturity,
              interestTypeMaturity,
              calculateInterestOn,
              loanInterestRateAfterMaturity,
              recurringPeriodAfterMaturityUnit,
              status,
            };
            const result = onChange(modelFields);
            value = result?.interestType ?? value;
          }
          if (errors.interestType?.hasError) {
            runValidationTasks("interestType", value);
          }
          setInterestType(value);
        }}
        onBlur={() => runValidationTasks("interestType", interestType)}
        errorMessage={errors.interestType?.errorMessage}
        hasError={errors.interestType?.hasError}
        {...getOverrideProps(overrides, "interestType")}
      ></TextField>
      <TextField
        label="Interest period"
        isRequired={false}
        isReadOnly={false}
        value={interestPeriod}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description,
              principalAmountMin,
              principalAmountMax,
              principalAmountDefault,
              interestRateMin,
              interestRateMax,
              interestRateDefault,
              interestCalculationMethod,
              interestType,
              interestPeriod: value,
              termDurationMin,
              termDurationMax,
              termDurationDefault,
              durationPeriod,
              repaymentFrequency,
              repaymentOrder,
              extendLoanAfterMaturity,
              interestTypeMaturity,
              calculateInterestOn,
              loanInterestRateAfterMaturity,
              recurringPeriodAfterMaturityUnit,
              status,
            };
            const result = onChange(modelFields);
            value = result?.interestPeriod ?? value;
          }
          if (errors.interestPeriod?.hasError) {
            runValidationTasks("interestPeriod", value);
          }
          setInterestPeriod(value);
        }}
        onBlur={() => runValidationTasks("interestPeriod", interestPeriod)}
        errorMessage={errors.interestPeriod?.errorMessage}
        hasError={errors.interestPeriod?.hasError}
        {...getOverrideProps(overrides, "interestPeriod")}
      ></TextField>
      <TextField
        label="Term duration min"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={termDurationMin}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              description,
              principalAmountMin,
              principalAmountMax,
              principalAmountDefault,
              interestRateMin,
              interestRateMax,
              interestRateDefault,
              interestCalculationMethod,
              interestType,
              interestPeriod,
              termDurationMin: value,
              termDurationMax,
              termDurationDefault,
              durationPeriod,
              repaymentFrequency,
              repaymentOrder,
              extendLoanAfterMaturity,
              interestTypeMaturity,
              calculateInterestOn,
              loanInterestRateAfterMaturity,
              recurringPeriodAfterMaturityUnit,
              status,
            };
            const result = onChange(modelFields);
            value = result?.termDurationMin ?? value;
          }
          if (errors.termDurationMin?.hasError) {
            runValidationTasks("termDurationMin", value);
          }
          setTermDurationMin(value);
        }}
        onBlur={() => runValidationTasks("termDurationMin", termDurationMin)}
        errorMessage={errors.termDurationMin?.errorMessage}
        hasError={errors.termDurationMin?.hasError}
        {...getOverrideProps(overrides, "termDurationMin")}
      ></TextField>
      <TextField
        label="Term duration max"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={termDurationMax}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              description,
              principalAmountMin,
              principalAmountMax,
              principalAmountDefault,
              interestRateMin,
              interestRateMax,
              interestRateDefault,
              interestCalculationMethod,
              interestType,
              interestPeriod,
              termDurationMin,
              termDurationMax: value,
              termDurationDefault,
              durationPeriod,
              repaymentFrequency,
              repaymentOrder,
              extendLoanAfterMaturity,
              interestTypeMaturity,
              calculateInterestOn,
              loanInterestRateAfterMaturity,
              recurringPeriodAfterMaturityUnit,
              status,
            };
            const result = onChange(modelFields);
            value = result?.termDurationMax ?? value;
          }
          if (errors.termDurationMax?.hasError) {
            runValidationTasks("termDurationMax", value);
          }
          setTermDurationMax(value);
        }}
        onBlur={() => runValidationTasks("termDurationMax", termDurationMax)}
        errorMessage={errors.termDurationMax?.errorMessage}
        hasError={errors.termDurationMax?.hasError}
        {...getOverrideProps(overrides, "termDurationMax")}
      ></TextField>
      <TextField
        label="Term duration default"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={termDurationDefault}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              description,
              principalAmountMin,
              principalAmountMax,
              principalAmountDefault,
              interestRateMin,
              interestRateMax,
              interestRateDefault,
              interestCalculationMethod,
              interestType,
              interestPeriod,
              termDurationMin,
              termDurationMax,
              termDurationDefault: value,
              durationPeriod,
              repaymentFrequency,
              repaymentOrder,
              extendLoanAfterMaturity,
              interestTypeMaturity,
              calculateInterestOn,
              loanInterestRateAfterMaturity,
              recurringPeriodAfterMaturityUnit,
              status,
            };
            const result = onChange(modelFields);
            value = result?.termDurationDefault ?? value;
          }
          if (errors.termDurationDefault?.hasError) {
            runValidationTasks("termDurationDefault", value);
          }
          setTermDurationDefault(value);
        }}
        onBlur={() =>
          runValidationTasks("termDurationDefault", termDurationDefault)
        }
        errorMessage={errors.termDurationDefault?.errorMessage}
        hasError={errors.termDurationDefault?.hasError}
        {...getOverrideProps(overrides, "termDurationDefault")}
      ></TextField>
      <TextField
        label="Duration period"
        isRequired={false}
        isReadOnly={false}
        value={durationPeriod}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description,
              principalAmountMin,
              principalAmountMax,
              principalAmountDefault,
              interestRateMin,
              interestRateMax,
              interestRateDefault,
              interestCalculationMethod,
              interestType,
              interestPeriod,
              termDurationMin,
              termDurationMax,
              termDurationDefault,
              durationPeriod: value,
              repaymentFrequency,
              repaymentOrder,
              extendLoanAfterMaturity,
              interestTypeMaturity,
              calculateInterestOn,
              loanInterestRateAfterMaturity,
              recurringPeriodAfterMaturityUnit,
              status,
            };
            const result = onChange(modelFields);
            value = result?.durationPeriod ?? value;
          }
          if (errors.durationPeriod?.hasError) {
            runValidationTasks("durationPeriod", value);
          }
          setDurationPeriod(value);
        }}
        onBlur={() => runValidationTasks("durationPeriod", durationPeriod)}
        errorMessage={errors.durationPeriod?.errorMessage}
        hasError={errors.durationPeriod?.hasError}
        {...getOverrideProps(overrides, "durationPeriod")}
      ></TextField>
      <TextField
        label="Repayment frequency"
        isRequired={false}
        isReadOnly={false}
        value={repaymentFrequency}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description,
              principalAmountMin,
              principalAmountMax,
              principalAmountDefault,
              interestRateMin,
              interestRateMax,
              interestRateDefault,
              interestCalculationMethod,
              interestType,
              interestPeriod,
              termDurationMin,
              termDurationMax,
              termDurationDefault,
              durationPeriod,
              repaymentFrequency: value,
              repaymentOrder,
              extendLoanAfterMaturity,
              interestTypeMaturity,
              calculateInterestOn,
              loanInterestRateAfterMaturity,
              recurringPeriodAfterMaturityUnit,
              status,
            };
            const result = onChange(modelFields);
            value = result?.repaymentFrequency ?? value;
          }
          if (errors.repaymentFrequency?.hasError) {
            runValidationTasks("repaymentFrequency", value);
          }
          setRepaymentFrequency(value);
        }}
        onBlur={() =>
          runValidationTasks("repaymentFrequency", repaymentFrequency)
        }
        errorMessage={errors.repaymentFrequency?.errorMessage}
        hasError={errors.repaymentFrequency?.hasError}
        {...getOverrideProps(overrides, "repaymentFrequency")}
      ></TextField>
      <TextAreaField
        label="Repayment order"
        isRequired={false}
        isReadOnly={false}
        value={repaymentOrder}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description,
              principalAmountMin,
              principalAmountMax,
              principalAmountDefault,
              interestRateMin,
              interestRateMax,
              interestRateDefault,
              interestCalculationMethod,
              interestType,
              interestPeriod,
              termDurationMin,
              termDurationMax,
              termDurationDefault,
              durationPeriod,
              repaymentFrequency,
              repaymentOrder: value,
              extendLoanAfterMaturity,
              interestTypeMaturity,
              calculateInterestOn,
              loanInterestRateAfterMaturity,
              recurringPeriodAfterMaturityUnit,
              status,
            };
            const result = onChange(modelFields);
            value = result?.repaymentOrder ?? value;
          }
          if (errors.repaymentOrder?.hasError) {
            runValidationTasks("repaymentOrder", value);
          }
          setRepaymentOrder(value);
        }}
        onBlur={() => runValidationTasks("repaymentOrder", repaymentOrder)}
        errorMessage={errors.repaymentOrder?.errorMessage}
        hasError={errors.repaymentOrder?.hasError}
        {...getOverrideProps(overrides, "repaymentOrder")}
      ></TextAreaField>
      <SwitchField
        label="Extend loan after maturity"
        defaultChecked={false}
        isDisabled={false}
        isChecked={extendLoanAfterMaturity}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              name,
              description,
              principalAmountMin,
              principalAmountMax,
              principalAmountDefault,
              interestRateMin,
              interestRateMax,
              interestRateDefault,
              interestCalculationMethod,
              interestType,
              interestPeriod,
              termDurationMin,
              termDurationMax,
              termDurationDefault,
              durationPeriod,
              repaymentFrequency,
              repaymentOrder,
              extendLoanAfterMaturity: value,
              interestTypeMaturity,
              calculateInterestOn,
              loanInterestRateAfterMaturity,
              recurringPeriodAfterMaturityUnit,
              status,
            };
            const result = onChange(modelFields);
            value = result?.extendLoanAfterMaturity ?? value;
          }
          if (errors.extendLoanAfterMaturity?.hasError) {
            runValidationTasks("extendLoanAfterMaturity", value);
          }
          setExtendLoanAfterMaturity(value);
        }}
        onBlur={() =>
          runValidationTasks("extendLoanAfterMaturity", extendLoanAfterMaturity)
        }
        errorMessage={errors.extendLoanAfterMaturity?.errorMessage}
        hasError={errors.extendLoanAfterMaturity?.hasError}
        {...getOverrideProps(overrides, "extendLoanAfterMaturity")}
      ></SwitchField>
      <TextField
        label="Interest type maturity"
        isRequired={false}
        isReadOnly={false}
        value={interestTypeMaturity}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description,
              principalAmountMin,
              principalAmountMax,
              principalAmountDefault,
              interestRateMin,
              interestRateMax,
              interestRateDefault,
              interestCalculationMethod,
              interestType,
              interestPeriod,
              termDurationMin,
              termDurationMax,
              termDurationDefault,
              durationPeriod,
              repaymentFrequency,
              repaymentOrder,
              extendLoanAfterMaturity,
              interestTypeMaturity: value,
              calculateInterestOn,
              loanInterestRateAfterMaturity,
              recurringPeriodAfterMaturityUnit,
              status,
            };
            const result = onChange(modelFields);
            value = result?.interestTypeMaturity ?? value;
          }
          if (errors.interestTypeMaturity?.hasError) {
            runValidationTasks("interestTypeMaturity", value);
          }
          setInterestTypeMaturity(value);
        }}
        onBlur={() =>
          runValidationTasks("interestTypeMaturity", interestTypeMaturity)
        }
        errorMessage={errors.interestTypeMaturity?.errorMessage}
        hasError={errors.interestTypeMaturity?.hasError}
        {...getOverrideProps(overrides, "interestTypeMaturity")}
      ></TextField>
      <TextField
        label="Calculate interest on"
        isRequired={false}
        isReadOnly={false}
        value={calculateInterestOn}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description,
              principalAmountMin,
              principalAmountMax,
              principalAmountDefault,
              interestRateMin,
              interestRateMax,
              interestRateDefault,
              interestCalculationMethod,
              interestType,
              interestPeriod,
              termDurationMin,
              termDurationMax,
              termDurationDefault,
              durationPeriod,
              repaymentFrequency,
              repaymentOrder,
              extendLoanAfterMaturity,
              interestTypeMaturity,
              calculateInterestOn: value,
              loanInterestRateAfterMaturity,
              recurringPeriodAfterMaturityUnit,
              status,
            };
            const result = onChange(modelFields);
            value = result?.calculateInterestOn ?? value;
          }
          if (errors.calculateInterestOn?.hasError) {
            runValidationTasks("calculateInterestOn", value);
          }
          setCalculateInterestOn(value);
        }}
        onBlur={() =>
          runValidationTasks("calculateInterestOn", calculateInterestOn)
        }
        errorMessage={errors.calculateInterestOn?.errorMessage}
        hasError={errors.calculateInterestOn?.hasError}
        {...getOverrideProps(overrides, "calculateInterestOn")}
      ></TextField>
      <TextField
        label="Loan interest rate after maturity"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={loanInterestRateAfterMaturity}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              description,
              principalAmountMin,
              principalAmountMax,
              principalAmountDefault,
              interestRateMin,
              interestRateMax,
              interestRateDefault,
              interestCalculationMethod,
              interestType,
              interestPeriod,
              termDurationMin,
              termDurationMax,
              termDurationDefault,
              durationPeriod,
              repaymentFrequency,
              repaymentOrder,
              extendLoanAfterMaturity,
              interestTypeMaturity,
              calculateInterestOn,
              loanInterestRateAfterMaturity: value,
              recurringPeriodAfterMaturityUnit,
              status,
            };
            const result = onChange(modelFields);
            value = result?.loanInterestRateAfterMaturity ?? value;
          }
          if (errors.loanInterestRateAfterMaturity?.hasError) {
            runValidationTasks("loanInterestRateAfterMaturity", value);
          }
          setLoanInterestRateAfterMaturity(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "loanInterestRateAfterMaturity",
            loanInterestRateAfterMaturity
          )
        }
        errorMessage={errors.loanInterestRateAfterMaturity?.errorMessage}
        hasError={errors.loanInterestRateAfterMaturity?.hasError}
        {...getOverrideProps(overrides, "loanInterestRateAfterMaturity")}
      ></TextField>
      <TextField
        label="Recurring period after maturity unit"
        isRequired={false}
        isReadOnly={false}
        value={recurringPeriodAfterMaturityUnit}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description,
              principalAmountMin,
              principalAmountMax,
              principalAmountDefault,
              interestRateMin,
              interestRateMax,
              interestRateDefault,
              interestCalculationMethod,
              interestType,
              interestPeriod,
              termDurationMin,
              termDurationMax,
              termDurationDefault,
              durationPeriod,
              repaymentFrequency,
              repaymentOrder,
              extendLoanAfterMaturity,
              interestTypeMaturity,
              calculateInterestOn,
              loanInterestRateAfterMaturity,
              recurringPeriodAfterMaturityUnit: value,
              status,
            };
            const result = onChange(modelFields);
            value = result?.recurringPeriodAfterMaturityUnit ?? value;
          }
          if (errors.recurringPeriodAfterMaturityUnit?.hasError) {
            runValidationTasks("recurringPeriodAfterMaturityUnit", value);
          }
          setRecurringPeriodAfterMaturityUnit(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "recurringPeriodAfterMaturityUnit",
            recurringPeriodAfterMaturityUnit
          )
        }
        errorMessage={errors.recurringPeriodAfterMaturityUnit?.errorMessage}
        hasError={errors.recurringPeriodAfterMaturityUnit?.hasError}
        {...getOverrideProps(overrides, "recurringPeriodAfterMaturityUnit")}
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
              description,
              principalAmountMin,
              principalAmountMax,
              principalAmountDefault,
              interestRateMin,
              interestRateMax,
              interestRateDefault,
              interestCalculationMethod,
              interestType,
              interestPeriod,
              termDurationMin,
              termDurationMax,
              termDurationDefault,
              durationPeriod,
              repaymentFrequency,
              repaymentOrder,
              extendLoanAfterMaturity,
              interestTypeMaturity,
              calculateInterestOn,
              loanInterestRateAfterMaturity,
              recurringPeriodAfterMaturityUnit,
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
          isDisabled={!(idProp || loanProductModelProp)}
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
              !(idProp || loanProductModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
