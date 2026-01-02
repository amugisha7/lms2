/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SwitchFieldProps, TextAreaFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type InstitutionUpdateFormInputValues = {
    name?: string;
    currencyCode?: string;
    subscriptionTier?: string;
    subscriptionStatus?: string;
    trialEndDate?: string;
    nextBillingDate?: string;
    stripeCustomerID?: string;
    stripeSubscriptionID?: string;
    defaultDateFormat?: string;
    defaultCurrencyFormat?: string;
    defaultLanguage?: string;
    regulatoryRegion?: string;
    maxUsers?: number;
    maxBranches?: number;
    maxStaffPerBranch?: number;
    saccoFeaturesEnabled?: boolean;
    staffManagementEnabled?: boolean;
    payrollEnabled?: boolean;
    collectionsModuleEnabled?: boolean;
    customWorkflowsEnabled?: boolean;
    advancedReportingEnabled?: boolean;
    apiIntegrationSettings?: string;
    status?: string;
    customDocumentHeader?: string;
    customInstitutionDetails?: string;
};
export declare type InstitutionUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    currencyCode?: ValidationFunction<string>;
    subscriptionTier?: ValidationFunction<string>;
    subscriptionStatus?: ValidationFunction<string>;
    trialEndDate?: ValidationFunction<string>;
    nextBillingDate?: ValidationFunction<string>;
    stripeCustomerID?: ValidationFunction<string>;
    stripeSubscriptionID?: ValidationFunction<string>;
    defaultDateFormat?: ValidationFunction<string>;
    defaultCurrencyFormat?: ValidationFunction<string>;
    defaultLanguage?: ValidationFunction<string>;
    regulatoryRegion?: ValidationFunction<string>;
    maxUsers?: ValidationFunction<number>;
    maxBranches?: ValidationFunction<number>;
    maxStaffPerBranch?: ValidationFunction<number>;
    saccoFeaturesEnabled?: ValidationFunction<boolean>;
    staffManagementEnabled?: ValidationFunction<boolean>;
    payrollEnabled?: ValidationFunction<boolean>;
    collectionsModuleEnabled?: ValidationFunction<boolean>;
    customWorkflowsEnabled?: ValidationFunction<boolean>;
    advancedReportingEnabled?: ValidationFunction<boolean>;
    apiIntegrationSettings?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
    customDocumentHeader?: ValidationFunction<string>;
    customInstitutionDetails?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type InstitutionUpdateFormOverridesProps = {
    InstitutionUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    currencyCode?: PrimitiveOverrideProps<TextFieldProps>;
    subscriptionTier?: PrimitiveOverrideProps<TextFieldProps>;
    subscriptionStatus?: PrimitiveOverrideProps<TextFieldProps>;
    trialEndDate?: PrimitiveOverrideProps<TextFieldProps>;
    nextBillingDate?: PrimitiveOverrideProps<TextFieldProps>;
    stripeCustomerID?: PrimitiveOverrideProps<TextFieldProps>;
    stripeSubscriptionID?: PrimitiveOverrideProps<TextFieldProps>;
    defaultDateFormat?: PrimitiveOverrideProps<TextFieldProps>;
    defaultCurrencyFormat?: PrimitiveOverrideProps<TextFieldProps>;
    defaultLanguage?: PrimitiveOverrideProps<TextFieldProps>;
    regulatoryRegion?: PrimitiveOverrideProps<TextFieldProps>;
    maxUsers?: PrimitiveOverrideProps<TextFieldProps>;
    maxBranches?: PrimitiveOverrideProps<TextFieldProps>;
    maxStaffPerBranch?: PrimitiveOverrideProps<TextFieldProps>;
    saccoFeaturesEnabled?: PrimitiveOverrideProps<SwitchFieldProps>;
    staffManagementEnabled?: PrimitiveOverrideProps<SwitchFieldProps>;
    payrollEnabled?: PrimitiveOverrideProps<SwitchFieldProps>;
    collectionsModuleEnabled?: PrimitiveOverrideProps<SwitchFieldProps>;
    customWorkflowsEnabled?: PrimitiveOverrideProps<SwitchFieldProps>;
    advancedReportingEnabled?: PrimitiveOverrideProps<SwitchFieldProps>;
    apiIntegrationSettings?: PrimitiveOverrideProps<TextAreaFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    customDocumentHeader?: PrimitiveOverrideProps<TextAreaFieldProps>;
    customInstitutionDetails?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type InstitutionUpdateFormProps = React.PropsWithChildren<{
    overrides?: InstitutionUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    institution?: any;
    onSubmit?: (fields: InstitutionUpdateFormInputValues) => InstitutionUpdateFormInputValues;
    onSuccess?: (fields: InstitutionUpdateFormInputValues) => void;
    onError?: (fields: InstitutionUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: InstitutionUpdateFormInputValues) => InstitutionUpdateFormInputValues;
    onValidate?: InstitutionUpdateFormValidationValues;
} & React.CSSProperties>;
export default function InstitutionUpdateForm(props: InstitutionUpdateFormProps): React.ReactElement;
