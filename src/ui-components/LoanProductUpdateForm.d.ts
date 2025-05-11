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
export declare type LoanProductUpdateFormInputValues = {
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
export declare type LoanProductUpdateFormValidationValues = {
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
export declare type LoanProductUpdateFormOverridesProps = {
    LoanProductUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
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
export declare type LoanProductUpdateFormProps = React.PropsWithChildren<{
    overrides?: LoanProductUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    loanProduct?: any;
    onSubmit?: (fields: LoanProductUpdateFormInputValues) => LoanProductUpdateFormInputValues;
    onSuccess?: (fields: LoanProductUpdateFormInputValues) => void;
    onError?: (fields: LoanProductUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: LoanProductUpdateFormInputValues) => LoanProductUpdateFormInputValues;
    onValidate?: LoanProductUpdateFormValidationValues;
} & React.CSSProperties>;
export default function LoanProductUpdateForm(props: LoanProductUpdateFormProps): React.ReactElement;
