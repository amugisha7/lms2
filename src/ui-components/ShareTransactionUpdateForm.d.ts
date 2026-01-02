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
export declare type ShareTransactionUpdateFormInputValues = {
    type?: string;
    numberOfShares?: number;
    amount?: number;
    date?: string;
    customShareTransactionDetails?: string;
};
export declare type ShareTransactionUpdateFormValidationValues = {
    type?: ValidationFunction<string>;
    numberOfShares?: ValidationFunction<number>;
    amount?: ValidationFunction<number>;
    date?: ValidationFunction<string>;
    customShareTransactionDetails?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ShareTransactionUpdateFormOverridesProps = {
    ShareTransactionUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    type?: PrimitiveOverrideProps<TextFieldProps>;
    numberOfShares?: PrimitiveOverrideProps<TextFieldProps>;
    amount?: PrimitiveOverrideProps<TextFieldProps>;
    date?: PrimitiveOverrideProps<TextFieldProps>;
    customShareTransactionDetails?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type ShareTransactionUpdateFormProps = React.PropsWithChildren<{
    overrides?: ShareTransactionUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    shareTransaction?: any;
    onSubmit?: (fields: ShareTransactionUpdateFormInputValues) => ShareTransactionUpdateFormInputValues;
    onSuccess?: (fields: ShareTransactionUpdateFormInputValues) => void;
    onError?: (fields: ShareTransactionUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ShareTransactionUpdateFormInputValues) => ShareTransactionUpdateFormInputValues;
    onValidate?: ShareTransactionUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ShareTransactionUpdateForm(props: ShareTransactionUpdateFormProps): React.ReactElement;
