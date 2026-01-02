/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextAreaFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type ShareAccountCreateFormInputValues = {
    numberOfShares?: number;
    shareValue?: number;
    totalValue?: number;
    customShareAccountDetails?: string;
};
export declare type ShareAccountCreateFormValidationValues = {
    numberOfShares?: ValidationFunction<number>;
    shareValue?: ValidationFunction<number>;
    totalValue?: ValidationFunction<number>;
    customShareAccountDetails?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ShareAccountCreateFormOverridesProps = {
    ShareAccountCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    numberOfShares?: PrimitiveOverrideProps<TextFieldProps>;
    shareValue?: PrimitiveOverrideProps<TextFieldProps>;
    totalValue?: PrimitiveOverrideProps<TextFieldProps>;
    customShareAccountDetails?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type ShareAccountCreateFormProps = React.PropsWithChildren<{
    overrides?: ShareAccountCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ShareAccountCreateFormInputValues) => ShareAccountCreateFormInputValues;
    onSuccess?: (fields: ShareAccountCreateFormInputValues) => void;
    onError?: (fields: ShareAccountCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ShareAccountCreateFormInputValues) => ShareAccountCreateFormInputValues;
    onValidate?: ShareAccountCreateFormValidationValues;
} & React.CSSProperties>;
export default function ShareAccountCreateForm(props: ShareAccountCreateFormProps): React.ReactElement;
