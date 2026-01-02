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
export declare type OtherIncomeUpdateFormInputValues = {
    name?: string;
    description?: string;
    amount?: number;
    incomeDate?: string;
    incomeType?: string;
    status?: string;
    customOtherIncomeDetails?: string;
};
export declare type OtherIncomeUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    amount?: ValidationFunction<number>;
    incomeDate?: ValidationFunction<string>;
    incomeType?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
    customOtherIncomeDetails?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type OtherIncomeUpdateFormOverridesProps = {
    OtherIncomeUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    amount?: PrimitiveOverrideProps<TextFieldProps>;
    incomeDate?: PrimitiveOverrideProps<TextFieldProps>;
    incomeType?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    customOtherIncomeDetails?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type OtherIncomeUpdateFormProps = React.PropsWithChildren<{
    overrides?: OtherIncomeUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    otherIncome?: any;
    onSubmit?: (fields: OtherIncomeUpdateFormInputValues) => OtherIncomeUpdateFormInputValues;
    onSuccess?: (fields: OtherIncomeUpdateFormInputValues) => void;
    onError?: (fields: OtherIncomeUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: OtherIncomeUpdateFormInputValues) => OtherIncomeUpdateFormInputValues;
    onValidate?: OtherIncomeUpdateFormValidationValues;
} & React.CSSProperties>;
export default function OtherIncomeUpdateForm(props: OtherIncomeUpdateFormProps): React.ReactElement;
