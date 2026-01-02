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
import { getInstitution } from "../graphql/queries";
import { updateInstitution } from "../graphql/mutations";
const client = generateClient();
export default function InstitutionUpdateForm(props) {
  const {
    id: idProp,
    institution: institutionModelProp,
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
    currencyCode: "",
    subscriptionTier: "",
    subscriptionStatus: "",
    trialEndDate: "",
    nextBillingDate: "",
    stripeCustomerID: "",
    stripeSubscriptionID: "",
    defaultDateFormat: "",
    defaultCurrencyFormat: "",
    defaultLanguage: "",
    regulatoryRegion: "",
    maxUsers: "",
    maxBranches: "",
    maxStaffPerBranch: "",
    saccoFeaturesEnabled: false,
    staffManagementEnabled: false,
    payrollEnabled: false,
    collectionsModuleEnabled: false,
    customWorkflowsEnabled: false,
    advancedReportingEnabled: false,
    apiIntegrationSettings: "",
    status: "",
    customDocumentHeader: "",
    customInstitutionDetails: "",
  };
  const [name, setName] = React.useState(initialValues.name);
  const [currencyCode, setCurrencyCode] = React.useState(
    initialValues.currencyCode
  );
  const [subscriptionTier, setSubscriptionTier] = React.useState(
    initialValues.subscriptionTier
  );
  const [subscriptionStatus, setSubscriptionStatus] = React.useState(
    initialValues.subscriptionStatus
  );
  const [trialEndDate, setTrialEndDate] = React.useState(
    initialValues.trialEndDate
  );
  const [nextBillingDate, setNextBillingDate] = React.useState(
    initialValues.nextBillingDate
  );
  const [stripeCustomerID, setStripeCustomerID] = React.useState(
    initialValues.stripeCustomerID
  );
  const [stripeSubscriptionID, setStripeSubscriptionID] = React.useState(
    initialValues.stripeSubscriptionID
  );
  const [defaultDateFormat, setDefaultDateFormat] = React.useState(
    initialValues.defaultDateFormat
  );
  const [defaultCurrencyFormat, setDefaultCurrencyFormat] = React.useState(
    initialValues.defaultCurrencyFormat
  );
  const [defaultLanguage, setDefaultLanguage] = React.useState(
    initialValues.defaultLanguage
  );
  const [regulatoryRegion, setRegulatoryRegion] = React.useState(
    initialValues.regulatoryRegion
  );
  const [maxUsers, setMaxUsers] = React.useState(initialValues.maxUsers);
  const [maxBranches, setMaxBranches] = React.useState(
    initialValues.maxBranches
  );
  const [maxStaffPerBranch, setMaxStaffPerBranch] = React.useState(
    initialValues.maxStaffPerBranch
  );
  const [saccoFeaturesEnabled, setSaccoFeaturesEnabled] = React.useState(
    initialValues.saccoFeaturesEnabled
  );
  const [staffManagementEnabled, setStaffManagementEnabled] = React.useState(
    initialValues.staffManagementEnabled
  );
  const [payrollEnabled, setPayrollEnabled] = React.useState(
    initialValues.payrollEnabled
  );
  const [collectionsModuleEnabled, setCollectionsModuleEnabled] =
    React.useState(initialValues.collectionsModuleEnabled);
  const [customWorkflowsEnabled, setCustomWorkflowsEnabled] = React.useState(
    initialValues.customWorkflowsEnabled
  );
  const [advancedReportingEnabled, setAdvancedReportingEnabled] =
    React.useState(initialValues.advancedReportingEnabled);
  const [apiIntegrationSettings, setApiIntegrationSettings] = React.useState(
    initialValues.apiIntegrationSettings
  );
  const [status, setStatus] = React.useState(initialValues.status);
  const [customDocumentHeader, setCustomDocumentHeader] = React.useState(
    initialValues.customDocumentHeader
  );
  const [customInstitutionDetails, setCustomInstitutionDetails] =
    React.useState(initialValues.customInstitutionDetails);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = institutionRecord
      ? { ...initialValues, ...institutionRecord }
      : initialValues;
    setName(cleanValues.name);
    setCurrencyCode(cleanValues.currencyCode);
    setSubscriptionTier(cleanValues.subscriptionTier);
    setSubscriptionStatus(cleanValues.subscriptionStatus);
    setTrialEndDate(cleanValues.trialEndDate);
    setNextBillingDate(cleanValues.nextBillingDate);
    setStripeCustomerID(cleanValues.stripeCustomerID);
    setStripeSubscriptionID(cleanValues.stripeSubscriptionID);
    setDefaultDateFormat(cleanValues.defaultDateFormat);
    setDefaultCurrencyFormat(cleanValues.defaultCurrencyFormat);
    setDefaultLanguage(cleanValues.defaultLanguage);
    setRegulatoryRegion(cleanValues.regulatoryRegion);
    setMaxUsers(cleanValues.maxUsers);
    setMaxBranches(cleanValues.maxBranches);
    setMaxStaffPerBranch(cleanValues.maxStaffPerBranch);
    setSaccoFeaturesEnabled(cleanValues.saccoFeaturesEnabled);
    setStaffManagementEnabled(cleanValues.staffManagementEnabled);
    setPayrollEnabled(cleanValues.payrollEnabled);
    setCollectionsModuleEnabled(cleanValues.collectionsModuleEnabled);
    setCustomWorkflowsEnabled(cleanValues.customWorkflowsEnabled);
    setAdvancedReportingEnabled(cleanValues.advancedReportingEnabled);
    setApiIntegrationSettings(
      typeof cleanValues.apiIntegrationSettings === "string" ||
        cleanValues.apiIntegrationSettings === null
        ? cleanValues.apiIntegrationSettings
        : JSON.stringify(cleanValues.apiIntegrationSettings)
    );
    setStatus(cleanValues.status);
    setCustomDocumentHeader(
      typeof cleanValues.customDocumentHeader === "string" ||
        cleanValues.customDocumentHeader === null
        ? cleanValues.customDocumentHeader
        : JSON.stringify(cleanValues.customDocumentHeader)
    );
    setCustomInstitutionDetails(
      typeof cleanValues.customInstitutionDetails === "string" ||
        cleanValues.customInstitutionDetails === null
        ? cleanValues.customInstitutionDetails
        : JSON.stringify(cleanValues.customInstitutionDetails)
    );
    setErrors({});
  };
  const [institutionRecord, setInstitutionRecord] =
    React.useState(institutionModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getInstitution.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getInstitution
        : institutionModelProp;
      setInstitutionRecord(record);
    };
    queryData();
  }, [idProp, institutionModelProp]);
  React.useEffect(resetStateValues, [institutionRecord]);
  const validations = {
    name: [],
    currencyCode: [],
    subscriptionTier: [],
    subscriptionStatus: [],
    trialEndDate: [],
    nextBillingDate: [],
    stripeCustomerID: [],
    stripeSubscriptionID: [],
    defaultDateFormat: [],
    defaultCurrencyFormat: [],
    defaultLanguage: [],
    regulatoryRegion: [],
    maxUsers: [],
    maxBranches: [],
    maxStaffPerBranch: [],
    saccoFeaturesEnabled: [{ type: "Required" }],
    staffManagementEnabled: [{ type: "Required" }],
    payrollEnabled: [{ type: "Required" }],
    collectionsModuleEnabled: [{ type: "Required" }],
    customWorkflowsEnabled: [{ type: "Required" }],
    advancedReportingEnabled: [{ type: "Required" }],
    apiIntegrationSettings: [{ type: "JSON" }],
    status: [],
    customDocumentHeader: [{ type: "JSON" }],
    customInstitutionDetails: [{ type: "JSON" }],
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
          currencyCode: currencyCode ?? null,
          subscriptionTier: subscriptionTier ?? null,
          subscriptionStatus: subscriptionStatus ?? null,
          trialEndDate: trialEndDate ?? null,
          nextBillingDate: nextBillingDate ?? null,
          stripeCustomerID: stripeCustomerID ?? null,
          stripeSubscriptionID: stripeSubscriptionID ?? null,
          defaultDateFormat: defaultDateFormat ?? null,
          defaultCurrencyFormat: defaultCurrencyFormat ?? null,
          defaultLanguage: defaultLanguage ?? null,
          regulatoryRegion: regulatoryRegion ?? null,
          maxUsers: maxUsers ?? null,
          maxBranches: maxBranches ?? null,
          maxStaffPerBranch: maxStaffPerBranch ?? null,
          saccoFeaturesEnabled,
          staffManagementEnabled,
          payrollEnabled,
          collectionsModuleEnabled,
          customWorkflowsEnabled,
          advancedReportingEnabled,
          apiIntegrationSettings: apiIntegrationSettings ?? null,
          status: status ?? null,
          customDocumentHeader: customDocumentHeader ?? null,
          customInstitutionDetails: customInstitutionDetails ?? null,
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
            query: updateInstitution.replaceAll("__typename", ""),
            variables: {
              input: {
                id: institutionRecord.id,
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
      {...getOverrideProps(overrides, "InstitutionUpdateForm")}
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
              currencyCode,
              subscriptionTier,
              subscriptionStatus,
              trialEndDate,
              nextBillingDate,
              stripeCustomerID,
              stripeSubscriptionID,
              defaultDateFormat,
              defaultCurrencyFormat,
              defaultLanguage,
              regulatoryRegion,
              maxUsers,
              maxBranches,
              maxStaffPerBranch,
              saccoFeaturesEnabled,
              staffManagementEnabled,
              payrollEnabled,
              collectionsModuleEnabled,
              customWorkflowsEnabled,
              advancedReportingEnabled,
              apiIntegrationSettings,
              status,
              customDocumentHeader,
              customInstitutionDetails,
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
        label="Currency code"
        isRequired={false}
        isReadOnly={false}
        value={currencyCode}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              currencyCode: value,
              subscriptionTier,
              subscriptionStatus,
              trialEndDate,
              nextBillingDate,
              stripeCustomerID,
              stripeSubscriptionID,
              defaultDateFormat,
              defaultCurrencyFormat,
              defaultLanguage,
              regulatoryRegion,
              maxUsers,
              maxBranches,
              maxStaffPerBranch,
              saccoFeaturesEnabled,
              staffManagementEnabled,
              payrollEnabled,
              collectionsModuleEnabled,
              customWorkflowsEnabled,
              advancedReportingEnabled,
              apiIntegrationSettings,
              status,
              customDocumentHeader,
              customInstitutionDetails,
            };
            const result = onChange(modelFields);
            value = result?.currencyCode ?? value;
          }
          if (errors.currencyCode?.hasError) {
            runValidationTasks("currencyCode", value);
          }
          setCurrencyCode(value);
        }}
        onBlur={() => runValidationTasks("currencyCode", currencyCode)}
        errorMessage={errors.currencyCode?.errorMessage}
        hasError={errors.currencyCode?.hasError}
        {...getOverrideProps(overrides, "currencyCode")}
      ></TextField>
      <TextField
        label="Subscription tier"
        isRequired={false}
        isReadOnly={false}
        value={subscriptionTier}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              currencyCode,
              subscriptionTier: value,
              subscriptionStatus,
              trialEndDate,
              nextBillingDate,
              stripeCustomerID,
              stripeSubscriptionID,
              defaultDateFormat,
              defaultCurrencyFormat,
              defaultLanguage,
              regulatoryRegion,
              maxUsers,
              maxBranches,
              maxStaffPerBranch,
              saccoFeaturesEnabled,
              staffManagementEnabled,
              payrollEnabled,
              collectionsModuleEnabled,
              customWorkflowsEnabled,
              advancedReportingEnabled,
              apiIntegrationSettings,
              status,
              customDocumentHeader,
              customInstitutionDetails,
            };
            const result = onChange(modelFields);
            value = result?.subscriptionTier ?? value;
          }
          if (errors.subscriptionTier?.hasError) {
            runValidationTasks("subscriptionTier", value);
          }
          setSubscriptionTier(value);
        }}
        onBlur={() => runValidationTasks("subscriptionTier", subscriptionTier)}
        errorMessage={errors.subscriptionTier?.errorMessage}
        hasError={errors.subscriptionTier?.hasError}
        {...getOverrideProps(overrides, "subscriptionTier")}
      ></TextField>
      <TextField
        label="Subscription status"
        isRequired={false}
        isReadOnly={false}
        value={subscriptionStatus}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              currencyCode,
              subscriptionTier,
              subscriptionStatus: value,
              trialEndDate,
              nextBillingDate,
              stripeCustomerID,
              stripeSubscriptionID,
              defaultDateFormat,
              defaultCurrencyFormat,
              defaultLanguage,
              regulatoryRegion,
              maxUsers,
              maxBranches,
              maxStaffPerBranch,
              saccoFeaturesEnabled,
              staffManagementEnabled,
              payrollEnabled,
              collectionsModuleEnabled,
              customWorkflowsEnabled,
              advancedReportingEnabled,
              apiIntegrationSettings,
              status,
              customDocumentHeader,
              customInstitutionDetails,
            };
            const result = onChange(modelFields);
            value = result?.subscriptionStatus ?? value;
          }
          if (errors.subscriptionStatus?.hasError) {
            runValidationTasks("subscriptionStatus", value);
          }
          setSubscriptionStatus(value);
        }}
        onBlur={() =>
          runValidationTasks("subscriptionStatus", subscriptionStatus)
        }
        errorMessage={errors.subscriptionStatus?.errorMessage}
        hasError={errors.subscriptionStatus?.hasError}
        {...getOverrideProps(overrides, "subscriptionStatus")}
      ></TextField>
      <TextField
        label="Trial end date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={trialEndDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              currencyCode,
              subscriptionTier,
              subscriptionStatus,
              trialEndDate: value,
              nextBillingDate,
              stripeCustomerID,
              stripeSubscriptionID,
              defaultDateFormat,
              defaultCurrencyFormat,
              defaultLanguage,
              regulatoryRegion,
              maxUsers,
              maxBranches,
              maxStaffPerBranch,
              saccoFeaturesEnabled,
              staffManagementEnabled,
              payrollEnabled,
              collectionsModuleEnabled,
              customWorkflowsEnabled,
              advancedReportingEnabled,
              apiIntegrationSettings,
              status,
              customDocumentHeader,
              customInstitutionDetails,
            };
            const result = onChange(modelFields);
            value = result?.trialEndDate ?? value;
          }
          if (errors.trialEndDate?.hasError) {
            runValidationTasks("trialEndDate", value);
          }
          setTrialEndDate(value);
        }}
        onBlur={() => runValidationTasks("trialEndDate", trialEndDate)}
        errorMessage={errors.trialEndDate?.errorMessage}
        hasError={errors.trialEndDate?.hasError}
        {...getOverrideProps(overrides, "trialEndDate")}
      ></TextField>
      <TextField
        label="Next billing date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={nextBillingDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              currencyCode,
              subscriptionTier,
              subscriptionStatus,
              trialEndDate,
              nextBillingDate: value,
              stripeCustomerID,
              stripeSubscriptionID,
              defaultDateFormat,
              defaultCurrencyFormat,
              defaultLanguage,
              regulatoryRegion,
              maxUsers,
              maxBranches,
              maxStaffPerBranch,
              saccoFeaturesEnabled,
              staffManagementEnabled,
              payrollEnabled,
              collectionsModuleEnabled,
              customWorkflowsEnabled,
              advancedReportingEnabled,
              apiIntegrationSettings,
              status,
              customDocumentHeader,
              customInstitutionDetails,
            };
            const result = onChange(modelFields);
            value = result?.nextBillingDate ?? value;
          }
          if (errors.nextBillingDate?.hasError) {
            runValidationTasks("nextBillingDate", value);
          }
          setNextBillingDate(value);
        }}
        onBlur={() => runValidationTasks("nextBillingDate", nextBillingDate)}
        errorMessage={errors.nextBillingDate?.errorMessage}
        hasError={errors.nextBillingDate?.hasError}
        {...getOverrideProps(overrides, "nextBillingDate")}
      ></TextField>
      <TextField
        label="Stripe customer id"
        isRequired={false}
        isReadOnly={false}
        value={stripeCustomerID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              currencyCode,
              subscriptionTier,
              subscriptionStatus,
              trialEndDate,
              nextBillingDate,
              stripeCustomerID: value,
              stripeSubscriptionID,
              defaultDateFormat,
              defaultCurrencyFormat,
              defaultLanguage,
              regulatoryRegion,
              maxUsers,
              maxBranches,
              maxStaffPerBranch,
              saccoFeaturesEnabled,
              staffManagementEnabled,
              payrollEnabled,
              collectionsModuleEnabled,
              customWorkflowsEnabled,
              advancedReportingEnabled,
              apiIntegrationSettings,
              status,
              customDocumentHeader,
              customInstitutionDetails,
            };
            const result = onChange(modelFields);
            value = result?.stripeCustomerID ?? value;
          }
          if (errors.stripeCustomerID?.hasError) {
            runValidationTasks("stripeCustomerID", value);
          }
          setStripeCustomerID(value);
        }}
        onBlur={() => runValidationTasks("stripeCustomerID", stripeCustomerID)}
        errorMessage={errors.stripeCustomerID?.errorMessage}
        hasError={errors.stripeCustomerID?.hasError}
        {...getOverrideProps(overrides, "stripeCustomerID")}
      ></TextField>
      <TextField
        label="Stripe subscription id"
        isRequired={false}
        isReadOnly={false}
        value={stripeSubscriptionID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              currencyCode,
              subscriptionTier,
              subscriptionStatus,
              trialEndDate,
              nextBillingDate,
              stripeCustomerID,
              stripeSubscriptionID: value,
              defaultDateFormat,
              defaultCurrencyFormat,
              defaultLanguage,
              regulatoryRegion,
              maxUsers,
              maxBranches,
              maxStaffPerBranch,
              saccoFeaturesEnabled,
              staffManagementEnabled,
              payrollEnabled,
              collectionsModuleEnabled,
              customWorkflowsEnabled,
              advancedReportingEnabled,
              apiIntegrationSettings,
              status,
              customDocumentHeader,
              customInstitutionDetails,
            };
            const result = onChange(modelFields);
            value = result?.stripeSubscriptionID ?? value;
          }
          if (errors.stripeSubscriptionID?.hasError) {
            runValidationTasks("stripeSubscriptionID", value);
          }
          setStripeSubscriptionID(value);
        }}
        onBlur={() =>
          runValidationTasks("stripeSubscriptionID", stripeSubscriptionID)
        }
        errorMessage={errors.stripeSubscriptionID?.errorMessage}
        hasError={errors.stripeSubscriptionID?.hasError}
        {...getOverrideProps(overrides, "stripeSubscriptionID")}
      ></TextField>
      <TextField
        label="Default date format"
        isRequired={false}
        isReadOnly={false}
        value={defaultDateFormat}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              currencyCode,
              subscriptionTier,
              subscriptionStatus,
              trialEndDate,
              nextBillingDate,
              stripeCustomerID,
              stripeSubscriptionID,
              defaultDateFormat: value,
              defaultCurrencyFormat,
              defaultLanguage,
              regulatoryRegion,
              maxUsers,
              maxBranches,
              maxStaffPerBranch,
              saccoFeaturesEnabled,
              staffManagementEnabled,
              payrollEnabled,
              collectionsModuleEnabled,
              customWorkflowsEnabled,
              advancedReportingEnabled,
              apiIntegrationSettings,
              status,
              customDocumentHeader,
              customInstitutionDetails,
            };
            const result = onChange(modelFields);
            value = result?.defaultDateFormat ?? value;
          }
          if (errors.defaultDateFormat?.hasError) {
            runValidationTasks("defaultDateFormat", value);
          }
          setDefaultDateFormat(value);
        }}
        onBlur={() =>
          runValidationTasks("defaultDateFormat", defaultDateFormat)
        }
        errorMessage={errors.defaultDateFormat?.errorMessage}
        hasError={errors.defaultDateFormat?.hasError}
        {...getOverrideProps(overrides, "defaultDateFormat")}
      ></TextField>
      <TextField
        label="Default currency format"
        isRequired={false}
        isReadOnly={false}
        value={defaultCurrencyFormat}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              currencyCode,
              subscriptionTier,
              subscriptionStatus,
              trialEndDate,
              nextBillingDate,
              stripeCustomerID,
              stripeSubscriptionID,
              defaultDateFormat,
              defaultCurrencyFormat: value,
              defaultLanguage,
              regulatoryRegion,
              maxUsers,
              maxBranches,
              maxStaffPerBranch,
              saccoFeaturesEnabled,
              staffManagementEnabled,
              payrollEnabled,
              collectionsModuleEnabled,
              customWorkflowsEnabled,
              advancedReportingEnabled,
              apiIntegrationSettings,
              status,
              customDocumentHeader,
              customInstitutionDetails,
            };
            const result = onChange(modelFields);
            value = result?.defaultCurrencyFormat ?? value;
          }
          if (errors.defaultCurrencyFormat?.hasError) {
            runValidationTasks("defaultCurrencyFormat", value);
          }
          setDefaultCurrencyFormat(value);
        }}
        onBlur={() =>
          runValidationTasks("defaultCurrencyFormat", defaultCurrencyFormat)
        }
        errorMessage={errors.defaultCurrencyFormat?.errorMessage}
        hasError={errors.defaultCurrencyFormat?.hasError}
        {...getOverrideProps(overrides, "defaultCurrencyFormat")}
      ></TextField>
      <TextField
        label="Default language"
        isRequired={false}
        isReadOnly={false}
        value={defaultLanguage}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              currencyCode,
              subscriptionTier,
              subscriptionStatus,
              trialEndDate,
              nextBillingDate,
              stripeCustomerID,
              stripeSubscriptionID,
              defaultDateFormat,
              defaultCurrencyFormat,
              defaultLanguage: value,
              regulatoryRegion,
              maxUsers,
              maxBranches,
              maxStaffPerBranch,
              saccoFeaturesEnabled,
              staffManagementEnabled,
              payrollEnabled,
              collectionsModuleEnabled,
              customWorkflowsEnabled,
              advancedReportingEnabled,
              apiIntegrationSettings,
              status,
              customDocumentHeader,
              customInstitutionDetails,
            };
            const result = onChange(modelFields);
            value = result?.defaultLanguage ?? value;
          }
          if (errors.defaultLanguage?.hasError) {
            runValidationTasks("defaultLanguage", value);
          }
          setDefaultLanguage(value);
        }}
        onBlur={() => runValidationTasks("defaultLanguage", defaultLanguage)}
        errorMessage={errors.defaultLanguage?.errorMessage}
        hasError={errors.defaultLanguage?.hasError}
        {...getOverrideProps(overrides, "defaultLanguage")}
      ></TextField>
      <TextField
        label="Regulatory region"
        isRequired={false}
        isReadOnly={false}
        value={regulatoryRegion}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              currencyCode,
              subscriptionTier,
              subscriptionStatus,
              trialEndDate,
              nextBillingDate,
              stripeCustomerID,
              stripeSubscriptionID,
              defaultDateFormat,
              defaultCurrencyFormat,
              defaultLanguage,
              regulatoryRegion: value,
              maxUsers,
              maxBranches,
              maxStaffPerBranch,
              saccoFeaturesEnabled,
              staffManagementEnabled,
              payrollEnabled,
              collectionsModuleEnabled,
              customWorkflowsEnabled,
              advancedReportingEnabled,
              apiIntegrationSettings,
              status,
              customDocumentHeader,
              customInstitutionDetails,
            };
            const result = onChange(modelFields);
            value = result?.regulatoryRegion ?? value;
          }
          if (errors.regulatoryRegion?.hasError) {
            runValidationTasks("regulatoryRegion", value);
          }
          setRegulatoryRegion(value);
        }}
        onBlur={() => runValidationTasks("regulatoryRegion", regulatoryRegion)}
        errorMessage={errors.regulatoryRegion?.errorMessage}
        hasError={errors.regulatoryRegion?.hasError}
        {...getOverrideProps(overrides, "regulatoryRegion")}
      ></TextField>
      <TextField
        label="Max users"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={maxUsers}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              currencyCode,
              subscriptionTier,
              subscriptionStatus,
              trialEndDate,
              nextBillingDate,
              stripeCustomerID,
              stripeSubscriptionID,
              defaultDateFormat,
              defaultCurrencyFormat,
              defaultLanguage,
              regulatoryRegion,
              maxUsers: value,
              maxBranches,
              maxStaffPerBranch,
              saccoFeaturesEnabled,
              staffManagementEnabled,
              payrollEnabled,
              collectionsModuleEnabled,
              customWorkflowsEnabled,
              advancedReportingEnabled,
              apiIntegrationSettings,
              status,
              customDocumentHeader,
              customInstitutionDetails,
            };
            const result = onChange(modelFields);
            value = result?.maxUsers ?? value;
          }
          if (errors.maxUsers?.hasError) {
            runValidationTasks("maxUsers", value);
          }
          setMaxUsers(value);
        }}
        onBlur={() => runValidationTasks("maxUsers", maxUsers)}
        errorMessage={errors.maxUsers?.errorMessage}
        hasError={errors.maxUsers?.hasError}
        {...getOverrideProps(overrides, "maxUsers")}
      ></TextField>
      <TextField
        label="Max branches"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={maxBranches}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              currencyCode,
              subscriptionTier,
              subscriptionStatus,
              trialEndDate,
              nextBillingDate,
              stripeCustomerID,
              stripeSubscriptionID,
              defaultDateFormat,
              defaultCurrencyFormat,
              defaultLanguage,
              regulatoryRegion,
              maxUsers,
              maxBranches: value,
              maxStaffPerBranch,
              saccoFeaturesEnabled,
              staffManagementEnabled,
              payrollEnabled,
              collectionsModuleEnabled,
              customWorkflowsEnabled,
              advancedReportingEnabled,
              apiIntegrationSettings,
              status,
              customDocumentHeader,
              customInstitutionDetails,
            };
            const result = onChange(modelFields);
            value = result?.maxBranches ?? value;
          }
          if (errors.maxBranches?.hasError) {
            runValidationTasks("maxBranches", value);
          }
          setMaxBranches(value);
        }}
        onBlur={() => runValidationTasks("maxBranches", maxBranches)}
        errorMessage={errors.maxBranches?.errorMessage}
        hasError={errors.maxBranches?.hasError}
        {...getOverrideProps(overrides, "maxBranches")}
      ></TextField>
      <TextField
        label="Max staff per branch"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={maxStaffPerBranch}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              currencyCode,
              subscriptionTier,
              subscriptionStatus,
              trialEndDate,
              nextBillingDate,
              stripeCustomerID,
              stripeSubscriptionID,
              defaultDateFormat,
              defaultCurrencyFormat,
              defaultLanguage,
              regulatoryRegion,
              maxUsers,
              maxBranches,
              maxStaffPerBranch: value,
              saccoFeaturesEnabled,
              staffManagementEnabled,
              payrollEnabled,
              collectionsModuleEnabled,
              customWorkflowsEnabled,
              advancedReportingEnabled,
              apiIntegrationSettings,
              status,
              customDocumentHeader,
              customInstitutionDetails,
            };
            const result = onChange(modelFields);
            value = result?.maxStaffPerBranch ?? value;
          }
          if (errors.maxStaffPerBranch?.hasError) {
            runValidationTasks("maxStaffPerBranch", value);
          }
          setMaxStaffPerBranch(value);
        }}
        onBlur={() =>
          runValidationTasks("maxStaffPerBranch", maxStaffPerBranch)
        }
        errorMessage={errors.maxStaffPerBranch?.errorMessage}
        hasError={errors.maxStaffPerBranch?.hasError}
        {...getOverrideProps(overrides, "maxStaffPerBranch")}
      ></TextField>
      <SwitchField
        label="Sacco features enabled"
        defaultChecked={false}
        isDisabled={false}
        isChecked={saccoFeaturesEnabled}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              name,
              currencyCode,
              subscriptionTier,
              subscriptionStatus,
              trialEndDate,
              nextBillingDate,
              stripeCustomerID,
              stripeSubscriptionID,
              defaultDateFormat,
              defaultCurrencyFormat,
              defaultLanguage,
              regulatoryRegion,
              maxUsers,
              maxBranches,
              maxStaffPerBranch,
              saccoFeaturesEnabled: value,
              staffManagementEnabled,
              payrollEnabled,
              collectionsModuleEnabled,
              customWorkflowsEnabled,
              advancedReportingEnabled,
              apiIntegrationSettings,
              status,
              customDocumentHeader,
              customInstitutionDetails,
            };
            const result = onChange(modelFields);
            value = result?.saccoFeaturesEnabled ?? value;
          }
          if (errors.saccoFeaturesEnabled?.hasError) {
            runValidationTasks("saccoFeaturesEnabled", value);
          }
          setSaccoFeaturesEnabled(value);
        }}
        onBlur={() =>
          runValidationTasks("saccoFeaturesEnabled", saccoFeaturesEnabled)
        }
        errorMessage={errors.saccoFeaturesEnabled?.errorMessage}
        hasError={errors.saccoFeaturesEnabled?.hasError}
        {...getOverrideProps(overrides, "saccoFeaturesEnabled")}
      ></SwitchField>
      <SwitchField
        label="Staff management enabled"
        defaultChecked={false}
        isDisabled={false}
        isChecked={staffManagementEnabled}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              name,
              currencyCode,
              subscriptionTier,
              subscriptionStatus,
              trialEndDate,
              nextBillingDate,
              stripeCustomerID,
              stripeSubscriptionID,
              defaultDateFormat,
              defaultCurrencyFormat,
              defaultLanguage,
              regulatoryRegion,
              maxUsers,
              maxBranches,
              maxStaffPerBranch,
              saccoFeaturesEnabled,
              staffManagementEnabled: value,
              payrollEnabled,
              collectionsModuleEnabled,
              customWorkflowsEnabled,
              advancedReportingEnabled,
              apiIntegrationSettings,
              status,
              customDocumentHeader,
              customInstitutionDetails,
            };
            const result = onChange(modelFields);
            value = result?.staffManagementEnabled ?? value;
          }
          if (errors.staffManagementEnabled?.hasError) {
            runValidationTasks("staffManagementEnabled", value);
          }
          setStaffManagementEnabled(value);
        }}
        onBlur={() =>
          runValidationTasks("staffManagementEnabled", staffManagementEnabled)
        }
        errorMessage={errors.staffManagementEnabled?.errorMessage}
        hasError={errors.staffManagementEnabled?.hasError}
        {...getOverrideProps(overrides, "staffManagementEnabled")}
      ></SwitchField>
      <SwitchField
        label="Payroll enabled"
        defaultChecked={false}
        isDisabled={false}
        isChecked={payrollEnabled}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              name,
              currencyCode,
              subscriptionTier,
              subscriptionStatus,
              trialEndDate,
              nextBillingDate,
              stripeCustomerID,
              stripeSubscriptionID,
              defaultDateFormat,
              defaultCurrencyFormat,
              defaultLanguage,
              regulatoryRegion,
              maxUsers,
              maxBranches,
              maxStaffPerBranch,
              saccoFeaturesEnabled,
              staffManagementEnabled,
              payrollEnabled: value,
              collectionsModuleEnabled,
              customWorkflowsEnabled,
              advancedReportingEnabled,
              apiIntegrationSettings,
              status,
              customDocumentHeader,
              customInstitutionDetails,
            };
            const result = onChange(modelFields);
            value = result?.payrollEnabled ?? value;
          }
          if (errors.payrollEnabled?.hasError) {
            runValidationTasks("payrollEnabled", value);
          }
          setPayrollEnabled(value);
        }}
        onBlur={() => runValidationTasks("payrollEnabled", payrollEnabled)}
        errorMessage={errors.payrollEnabled?.errorMessage}
        hasError={errors.payrollEnabled?.hasError}
        {...getOverrideProps(overrides, "payrollEnabled")}
      ></SwitchField>
      <SwitchField
        label="Collections module enabled"
        defaultChecked={false}
        isDisabled={false}
        isChecked={collectionsModuleEnabled}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              name,
              currencyCode,
              subscriptionTier,
              subscriptionStatus,
              trialEndDate,
              nextBillingDate,
              stripeCustomerID,
              stripeSubscriptionID,
              defaultDateFormat,
              defaultCurrencyFormat,
              defaultLanguage,
              regulatoryRegion,
              maxUsers,
              maxBranches,
              maxStaffPerBranch,
              saccoFeaturesEnabled,
              staffManagementEnabled,
              payrollEnabled,
              collectionsModuleEnabled: value,
              customWorkflowsEnabled,
              advancedReportingEnabled,
              apiIntegrationSettings,
              status,
              customDocumentHeader,
              customInstitutionDetails,
            };
            const result = onChange(modelFields);
            value = result?.collectionsModuleEnabled ?? value;
          }
          if (errors.collectionsModuleEnabled?.hasError) {
            runValidationTasks("collectionsModuleEnabled", value);
          }
          setCollectionsModuleEnabled(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "collectionsModuleEnabled",
            collectionsModuleEnabled
          )
        }
        errorMessage={errors.collectionsModuleEnabled?.errorMessage}
        hasError={errors.collectionsModuleEnabled?.hasError}
        {...getOverrideProps(overrides, "collectionsModuleEnabled")}
      ></SwitchField>
      <SwitchField
        label="Custom workflows enabled"
        defaultChecked={false}
        isDisabled={false}
        isChecked={customWorkflowsEnabled}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              name,
              currencyCode,
              subscriptionTier,
              subscriptionStatus,
              trialEndDate,
              nextBillingDate,
              stripeCustomerID,
              stripeSubscriptionID,
              defaultDateFormat,
              defaultCurrencyFormat,
              defaultLanguage,
              regulatoryRegion,
              maxUsers,
              maxBranches,
              maxStaffPerBranch,
              saccoFeaturesEnabled,
              staffManagementEnabled,
              payrollEnabled,
              collectionsModuleEnabled,
              customWorkflowsEnabled: value,
              advancedReportingEnabled,
              apiIntegrationSettings,
              status,
              customDocumentHeader,
              customInstitutionDetails,
            };
            const result = onChange(modelFields);
            value = result?.customWorkflowsEnabled ?? value;
          }
          if (errors.customWorkflowsEnabled?.hasError) {
            runValidationTasks("customWorkflowsEnabled", value);
          }
          setCustomWorkflowsEnabled(value);
        }}
        onBlur={() =>
          runValidationTasks("customWorkflowsEnabled", customWorkflowsEnabled)
        }
        errorMessage={errors.customWorkflowsEnabled?.errorMessage}
        hasError={errors.customWorkflowsEnabled?.hasError}
        {...getOverrideProps(overrides, "customWorkflowsEnabled")}
      ></SwitchField>
      <SwitchField
        label="Advanced reporting enabled"
        defaultChecked={false}
        isDisabled={false}
        isChecked={advancedReportingEnabled}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              name,
              currencyCode,
              subscriptionTier,
              subscriptionStatus,
              trialEndDate,
              nextBillingDate,
              stripeCustomerID,
              stripeSubscriptionID,
              defaultDateFormat,
              defaultCurrencyFormat,
              defaultLanguage,
              regulatoryRegion,
              maxUsers,
              maxBranches,
              maxStaffPerBranch,
              saccoFeaturesEnabled,
              staffManagementEnabled,
              payrollEnabled,
              collectionsModuleEnabled,
              customWorkflowsEnabled,
              advancedReportingEnabled: value,
              apiIntegrationSettings,
              status,
              customDocumentHeader,
              customInstitutionDetails,
            };
            const result = onChange(modelFields);
            value = result?.advancedReportingEnabled ?? value;
          }
          if (errors.advancedReportingEnabled?.hasError) {
            runValidationTasks("advancedReportingEnabled", value);
          }
          setAdvancedReportingEnabled(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "advancedReportingEnabled",
            advancedReportingEnabled
          )
        }
        errorMessage={errors.advancedReportingEnabled?.errorMessage}
        hasError={errors.advancedReportingEnabled?.hasError}
        {...getOverrideProps(overrides, "advancedReportingEnabled")}
      ></SwitchField>
      <TextAreaField
        label="Api integration settings"
        isRequired={false}
        isReadOnly={false}
        value={apiIntegrationSettings}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              currencyCode,
              subscriptionTier,
              subscriptionStatus,
              trialEndDate,
              nextBillingDate,
              stripeCustomerID,
              stripeSubscriptionID,
              defaultDateFormat,
              defaultCurrencyFormat,
              defaultLanguage,
              regulatoryRegion,
              maxUsers,
              maxBranches,
              maxStaffPerBranch,
              saccoFeaturesEnabled,
              staffManagementEnabled,
              payrollEnabled,
              collectionsModuleEnabled,
              customWorkflowsEnabled,
              advancedReportingEnabled,
              apiIntegrationSettings: value,
              status,
              customDocumentHeader,
              customInstitutionDetails,
            };
            const result = onChange(modelFields);
            value = result?.apiIntegrationSettings ?? value;
          }
          if (errors.apiIntegrationSettings?.hasError) {
            runValidationTasks("apiIntegrationSettings", value);
          }
          setApiIntegrationSettings(value);
        }}
        onBlur={() =>
          runValidationTasks("apiIntegrationSettings", apiIntegrationSettings)
        }
        errorMessage={errors.apiIntegrationSettings?.errorMessage}
        hasError={errors.apiIntegrationSettings?.hasError}
        {...getOverrideProps(overrides, "apiIntegrationSettings")}
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
              name,
              currencyCode,
              subscriptionTier,
              subscriptionStatus,
              trialEndDate,
              nextBillingDate,
              stripeCustomerID,
              stripeSubscriptionID,
              defaultDateFormat,
              defaultCurrencyFormat,
              defaultLanguage,
              regulatoryRegion,
              maxUsers,
              maxBranches,
              maxStaffPerBranch,
              saccoFeaturesEnabled,
              staffManagementEnabled,
              payrollEnabled,
              collectionsModuleEnabled,
              customWorkflowsEnabled,
              advancedReportingEnabled,
              apiIntegrationSettings,
              status: value,
              customDocumentHeader,
              customInstitutionDetails,
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
        label="Custom document header"
        isRequired={false}
        isReadOnly={false}
        value={customDocumentHeader}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              currencyCode,
              subscriptionTier,
              subscriptionStatus,
              trialEndDate,
              nextBillingDate,
              stripeCustomerID,
              stripeSubscriptionID,
              defaultDateFormat,
              defaultCurrencyFormat,
              defaultLanguage,
              regulatoryRegion,
              maxUsers,
              maxBranches,
              maxStaffPerBranch,
              saccoFeaturesEnabled,
              staffManagementEnabled,
              payrollEnabled,
              collectionsModuleEnabled,
              customWorkflowsEnabled,
              advancedReportingEnabled,
              apiIntegrationSettings,
              status,
              customDocumentHeader: value,
              customInstitutionDetails,
            };
            const result = onChange(modelFields);
            value = result?.customDocumentHeader ?? value;
          }
          if (errors.customDocumentHeader?.hasError) {
            runValidationTasks("customDocumentHeader", value);
          }
          setCustomDocumentHeader(value);
        }}
        onBlur={() =>
          runValidationTasks("customDocumentHeader", customDocumentHeader)
        }
        errorMessage={errors.customDocumentHeader?.errorMessage}
        hasError={errors.customDocumentHeader?.hasError}
        {...getOverrideProps(overrides, "customDocumentHeader")}
      ></TextAreaField>
      <TextAreaField
        label="Custom institution details"
        isRequired={false}
        isReadOnly={false}
        value={customInstitutionDetails}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              currencyCode,
              subscriptionTier,
              subscriptionStatus,
              trialEndDate,
              nextBillingDate,
              stripeCustomerID,
              stripeSubscriptionID,
              defaultDateFormat,
              defaultCurrencyFormat,
              defaultLanguage,
              regulatoryRegion,
              maxUsers,
              maxBranches,
              maxStaffPerBranch,
              saccoFeaturesEnabled,
              staffManagementEnabled,
              payrollEnabled,
              collectionsModuleEnabled,
              customWorkflowsEnabled,
              advancedReportingEnabled,
              apiIntegrationSettings,
              status,
              customDocumentHeader,
              customInstitutionDetails: value,
            };
            const result = onChange(modelFields);
            value = result?.customInstitutionDetails ?? value;
          }
          if (errors.customInstitutionDetails?.hasError) {
            runValidationTasks("customInstitutionDetails", value);
          }
          setCustomInstitutionDetails(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "customInstitutionDetails",
            customInstitutionDetails
          )
        }
        errorMessage={errors.customInstitutionDetails?.errorMessage}
        hasError={errors.customInstitutionDetails?.hasError}
        {...getOverrideProps(overrides, "customInstitutionDetails")}
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
          isDisabled={!(idProp || institutionModelProp)}
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
              !(idProp || institutionModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
