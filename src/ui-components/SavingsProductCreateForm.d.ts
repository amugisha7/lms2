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
export declare type SavingsProductCreateFormInputValues = {
    name?: string;
    type?: string;
    interestRate?: number;
    interestPostingFrequency?: string;
    minBalance?: number;
    customSavingsProductDetails?: string;
};
export declare type SavingsProductCreateFormValidationValues = {
    name?: ValidationFunction<string>;
    type?: ValidationFunction<string>;
    interestRate?: ValidationFunction<number>;
    interestPostingFrequency?: ValidationFunction<string>;
    minBalance?: ValidationFunction<number>;
    customSavingsProductDetails?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type SavingsProductCreateFormOverridesProps = {
    SavingsProductCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    type?: PrimitiveOverrideProps<TextFieldProps>;
    interestRate?: PrimitiveOverrideProps<TextFieldProps>;
    interestPostingFrequency?: PrimitiveOverrideProps<TextFieldProps>;
    minBalance?: PrimitiveOverrideProps<TextFieldProps>;
    customSavingsProductDetails?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type SavingsProductCreateFormProps = React.PropsWithChildren<{
    overrides?: SavingsProductCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: SavingsProductCreateFormInputValues) => SavingsProductCreateFormInputValues;
    onSuccess?: (fields: SavingsProductCreateFormInputValues) => void;
    onError?: (fields: SavingsProductCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: SavingsProductCreateFormInputValues) => SavingsProductCreateFormInputValues;
    onValidate?: SavingsProductCreateFormValidationValues;
} & React.CSSProperties>;
export default function SavingsProductCreateForm(props: SavingsProductCreateFormProps): React.ReactElement;
