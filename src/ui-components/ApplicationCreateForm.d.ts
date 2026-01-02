/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SelectFieldProps, TextAreaFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type ApplicationCreateFormInputValues = {
    name?: string;
    description?: string;
    applicationNumber?: string;
    requestedPrincipalAmount?: number;
    requestedTermMonths?: number;
    requestedFrequency?: string;
    applicationDate?: string;
    status?: string;
    applicationRecord?: string;
    customFieldsData?: string;
    customApplicationDetails?: string;
};
export declare type ApplicationCreateFormValidationValues = {
    name?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    applicationNumber?: ValidationFunction<string>;
    requestedPrincipalAmount?: ValidationFunction<number>;
    requestedTermMonths?: ValidationFunction<number>;
    requestedFrequency?: ValidationFunction<string>;
    applicationDate?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
    applicationRecord?: ValidationFunction<string>;
    customFieldsData?: ValidationFunction<string>;
    customApplicationDetails?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ApplicationCreateFormOverridesProps = {
    ApplicationCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    applicationNumber?: PrimitiveOverrideProps<TextFieldProps>;
    requestedPrincipalAmount?: PrimitiveOverrideProps<TextFieldProps>;
    requestedTermMonths?: PrimitiveOverrideProps<TextFieldProps>;
    requestedFrequency?: PrimitiveOverrideProps<SelectFieldProps>;
    applicationDate?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    applicationRecord?: PrimitiveOverrideProps<TextAreaFieldProps>;
    customFieldsData?: PrimitiveOverrideProps<TextAreaFieldProps>;
    customApplicationDetails?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type ApplicationCreateFormProps = React.PropsWithChildren<{
    overrides?: ApplicationCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ApplicationCreateFormInputValues) => ApplicationCreateFormInputValues;
    onSuccess?: (fields: ApplicationCreateFormInputValues) => void;
    onError?: (fields: ApplicationCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ApplicationCreateFormInputValues) => ApplicationCreateFormInputValues;
    onValidate?: ApplicationCreateFormValidationValues;
} & React.CSSProperties>;
export default function ApplicationCreateForm(props: ApplicationCreateFormProps): React.ReactElement;
