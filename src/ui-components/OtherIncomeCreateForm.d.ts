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
export declare type OtherIncomeCreateFormInputValues = {
    name?: string;
    description?: string;
    amount?: number;
    incomeDate?: string;
    incomeType?: string;
    status?: string;
    customOtherIncomeDetails?: string;
};
export declare type OtherIncomeCreateFormValidationValues = {
    name?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    amount?: ValidationFunction<number>;
    incomeDate?: ValidationFunction<string>;
    incomeType?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
    customOtherIncomeDetails?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type OtherIncomeCreateFormOverridesProps = {
    OtherIncomeCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    amount?: PrimitiveOverrideProps<TextFieldProps>;
    incomeDate?: PrimitiveOverrideProps<TextFieldProps>;
    incomeType?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    customOtherIncomeDetails?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type OtherIncomeCreateFormProps = React.PropsWithChildren<{
    overrides?: OtherIncomeCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: OtherIncomeCreateFormInputValues) => OtherIncomeCreateFormInputValues;
    onSuccess?: (fields: OtherIncomeCreateFormInputValues) => void;
    onError?: (fields: OtherIncomeCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: OtherIncomeCreateFormInputValues) => OtherIncomeCreateFormInputValues;
    onValidate?: OtherIncomeCreateFormValidationValues;
} & React.CSSProperties>;
export default function OtherIncomeCreateForm(props: OtherIncomeCreateFormProps): React.ReactElement;
