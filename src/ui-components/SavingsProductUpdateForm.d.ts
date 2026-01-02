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
export declare type SavingsProductUpdateFormInputValues = {
    name?: string;
    type?: string;
    interestRate?: number;
    interestPostingFrequency?: string;
    minBalance?: number;
    customSavingsProductDetails?: string;
};
export declare type SavingsProductUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    type?: ValidationFunction<string>;
    interestRate?: ValidationFunction<number>;
    interestPostingFrequency?: ValidationFunction<string>;
    minBalance?: ValidationFunction<number>;
    customSavingsProductDetails?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type SavingsProductUpdateFormOverridesProps = {
    SavingsProductUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    type?: PrimitiveOverrideProps<TextFieldProps>;
    interestRate?: PrimitiveOverrideProps<TextFieldProps>;
    interestPostingFrequency?: PrimitiveOverrideProps<TextFieldProps>;
    minBalance?: PrimitiveOverrideProps<TextFieldProps>;
    customSavingsProductDetails?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type SavingsProductUpdateFormProps = React.PropsWithChildren<{
    overrides?: SavingsProductUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    savingsProduct?: any;
    onSubmit?: (fields: SavingsProductUpdateFormInputValues) => SavingsProductUpdateFormInputValues;
    onSuccess?: (fields: SavingsProductUpdateFormInputValues) => void;
    onError?: (fields: SavingsProductUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: SavingsProductUpdateFormInputValues) => SavingsProductUpdateFormInputValues;
    onValidate?: SavingsProductUpdateFormValidationValues;
} & React.CSSProperties>;
export default function SavingsProductUpdateForm(props: SavingsProductUpdateFormProps): React.ReactElement;
