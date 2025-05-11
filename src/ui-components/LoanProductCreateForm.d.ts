/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SelectFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type LoanProductCreateFormInputValues = {
    name?: string;
    description?: string;
    interestRateMin?: number;
    interestRateMax?: number;
    termMonthsMin?: number;
    termMonthsMax?: number;
    principalAmountMin?: number;
    principalAmountMax?: number;
    interestCalculationMethod?: string;
    repaymentFrequencies?: string;
};
export declare type LoanProductCreateFormValidationValues = {
    name?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    interestRateMin?: ValidationFunction<number>;
    interestRateMax?: ValidationFunction<number>;
    termMonthsMin?: ValidationFunction<number>;
    termMonthsMax?: ValidationFunction<number>;
    principalAmountMin?: ValidationFunction<number>;
    principalAmountMax?: ValidationFunction<number>;
    interestCalculationMethod?: ValidationFunction<string>;
    repaymentFrequencies?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type LoanProductCreateFormOverridesProps = {
    LoanProductCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    interestRateMin?: PrimitiveOverrideProps<TextFieldProps>;
    interestRateMax?: PrimitiveOverrideProps<TextFieldProps>;
    termMonthsMin?: PrimitiveOverrideProps<TextFieldProps>;
    termMonthsMax?: PrimitiveOverrideProps<TextFieldProps>;
    principalAmountMin?: PrimitiveOverrideProps<TextFieldProps>;
    principalAmountMax?: PrimitiveOverrideProps<TextFieldProps>;
    interestCalculationMethod?: PrimitiveOverrideProps<SelectFieldProps>;
    repaymentFrequencies?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type LoanProductCreateFormProps = React.PropsWithChildren<{
    overrides?: LoanProductCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: LoanProductCreateFormInputValues) => LoanProductCreateFormInputValues;
    onSuccess?: (fields: LoanProductCreateFormInputValues) => void;
    onError?: (fields: LoanProductCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: LoanProductCreateFormInputValues) => LoanProductCreateFormInputValues;
    onValidate?: LoanProductCreateFormValidationValues;
} & React.CSSProperties>;
export default function LoanProductCreateForm(props: LoanProductCreateFormProps): React.ReactElement;
