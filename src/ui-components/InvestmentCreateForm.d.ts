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
export declare type InvestmentCreateFormInputValues = {
    principal?: number;
    description?: string;
    fees?: number;
    interestRate?: number;
    startDate?: string;
    maturityDate?: string;
    stopDate?: string;
    extensionPeriod?: number;
    duration?: number;
    durationInterval?: string;
    type?: string;
    rateInterval?: string;
    investmentStatus?: string;
    investmentAttribute1?: string;
    investmentAttribute2?: string;
    numberOfPayments?: number;
    paymentFrequency?: number;
    status?: string;
    customInvestmentDetails?: string;
};
export declare type InvestmentCreateFormValidationValues = {
    principal?: ValidationFunction<number>;
    description?: ValidationFunction<string>;
    fees?: ValidationFunction<number>;
    interestRate?: ValidationFunction<number>;
    startDate?: ValidationFunction<string>;
    maturityDate?: ValidationFunction<string>;
    stopDate?: ValidationFunction<string>;
    extensionPeriod?: ValidationFunction<number>;
    duration?: ValidationFunction<number>;
    durationInterval?: ValidationFunction<string>;
    type?: ValidationFunction<string>;
    rateInterval?: ValidationFunction<string>;
    investmentStatus?: ValidationFunction<string>;
    investmentAttribute1?: ValidationFunction<string>;
    investmentAttribute2?: ValidationFunction<string>;
    numberOfPayments?: ValidationFunction<number>;
    paymentFrequency?: ValidationFunction<number>;
    status?: ValidationFunction<string>;
    customInvestmentDetails?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type InvestmentCreateFormOverridesProps = {
    InvestmentCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    principal?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    fees?: PrimitiveOverrideProps<TextFieldProps>;
    interestRate?: PrimitiveOverrideProps<TextFieldProps>;
    startDate?: PrimitiveOverrideProps<TextFieldProps>;
    maturityDate?: PrimitiveOverrideProps<TextFieldProps>;
    stopDate?: PrimitiveOverrideProps<TextFieldProps>;
    extensionPeriod?: PrimitiveOverrideProps<TextFieldProps>;
    duration?: PrimitiveOverrideProps<TextFieldProps>;
    durationInterval?: PrimitiveOverrideProps<TextFieldProps>;
    type?: PrimitiveOverrideProps<TextFieldProps>;
    rateInterval?: PrimitiveOverrideProps<TextFieldProps>;
    investmentStatus?: PrimitiveOverrideProps<TextFieldProps>;
    investmentAttribute1?: PrimitiveOverrideProps<TextFieldProps>;
    investmentAttribute2?: PrimitiveOverrideProps<TextFieldProps>;
    numberOfPayments?: PrimitiveOverrideProps<TextFieldProps>;
    paymentFrequency?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    customInvestmentDetails?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type InvestmentCreateFormProps = React.PropsWithChildren<{
    overrides?: InvestmentCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: InvestmentCreateFormInputValues) => InvestmentCreateFormInputValues;
    onSuccess?: (fields: InvestmentCreateFormInputValues) => void;
    onError?: (fields: InvestmentCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: InvestmentCreateFormInputValues) => InvestmentCreateFormInputValues;
    onValidate?: InvestmentCreateFormValidationValues;
} & React.CSSProperties>;
export default function InvestmentCreateForm(props: InvestmentCreateFormProps): React.ReactElement;
