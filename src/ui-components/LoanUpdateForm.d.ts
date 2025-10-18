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
export declare type LoanUpdateFormInputValues = {
    approvalStatus?: string;
    approvedDate?: string;
    principal?: number;
    fees?: number;
    interestRate?: number;
    startDate?: string;
    maturityDate?: string;
    stopDate?: string;
    extensionPeriod?: number;
    duration?: number;
    durationInterval?: string;
    loanType?: string;
    rateInterval?: string;
    loanStatus?: string;
    loanCurrency?: string;
    loanPurpose?: string;
    loanComputationRecord?: string;
    loanAttribute1?: string;
    loanAttribute2?: string;
    numberOfPayments?: number;
    paymentFrequency?: string;
    customFieldsData?: string;
    status?: string;
};
export declare type LoanUpdateFormValidationValues = {
    approvalStatus?: ValidationFunction<string>;
    approvedDate?: ValidationFunction<string>;
    principal?: ValidationFunction<number>;
    fees?: ValidationFunction<number>;
    interestRate?: ValidationFunction<number>;
    startDate?: ValidationFunction<string>;
    maturityDate?: ValidationFunction<string>;
    stopDate?: ValidationFunction<string>;
    extensionPeriod?: ValidationFunction<number>;
    duration?: ValidationFunction<number>;
    durationInterval?: ValidationFunction<string>;
    loanType?: ValidationFunction<string>;
    rateInterval?: ValidationFunction<string>;
    loanStatus?: ValidationFunction<string>;
    loanCurrency?: ValidationFunction<string>;
    loanPurpose?: ValidationFunction<string>;
    loanComputationRecord?: ValidationFunction<string>;
    loanAttribute1?: ValidationFunction<string>;
    loanAttribute2?: ValidationFunction<string>;
    numberOfPayments?: ValidationFunction<number>;
    paymentFrequency?: ValidationFunction<string>;
    customFieldsData?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type LoanUpdateFormOverridesProps = {
    LoanUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    approvalStatus?: PrimitiveOverrideProps<TextFieldProps>;
    approvedDate?: PrimitiveOverrideProps<TextFieldProps>;
    principal?: PrimitiveOverrideProps<TextFieldProps>;
    fees?: PrimitiveOverrideProps<TextFieldProps>;
    interestRate?: PrimitiveOverrideProps<TextFieldProps>;
    startDate?: PrimitiveOverrideProps<TextFieldProps>;
    maturityDate?: PrimitiveOverrideProps<TextFieldProps>;
    stopDate?: PrimitiveOverrideProps<TextFieldProps>;
    extensionPeriod?: PrimitiveOverrideProps<TextFieldProps>;
    duration?: PrimitiveOverrideProps<TextFieldProps>;
    durationInterval?: PrimitiveOverrideProps<TextFieldProps>;
    loanType?: PrimitiveOverrideProps<TextFieldProps>;
    rateInterval?: PrimitiveOverrideProps<TextFieldProps>;
    loanStatus?: PrimitiveOverrideProps<TextFieldProps>;
    loanCurrency?: PrimitiveOverrideProps<TextFieldProps>;
    loanPurpose?: PrimitiveOverrideProps<TextFieldProps>;
    loanComputationRecord?: PrimitiveOverrideProps<TextAreaFieldProps>;
    loanAttribute1?: PrimitiveOverrideProps<TextFieldProps>;
    loanAttribute2?: PrimitiveOverrideProps<TextFieldProps>;
    numberOfPayments?: PrimitiveOverrideProps<TextFieldProps>;
    paymentFrequency?: PrimitiveOverrideProps<TextFieldProps>;
    customFieldsData?: PrimitiveOverrideProps<TextAreaFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type LoanUpdateFormProps = React.PropsWithChildren<{
    overrides?: LoanUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    loan?: any;
    onSubmit?: (fields: LoanUpdateFormInputValues) => LoanUpdateFormInputValues;
    onSuccess?: (fields: LoanUpdateFormInputValues) => void;
    onError?: (fields: LoanUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: LoanUpdateFormInputValues) => LoanUpdateFormInputValues;
    onValidate?: LoanUpdateFormValidationValues;
} & React.CSSProperties>;
export default function LoanUpdateForm(props: LoanUpdateFormProps): React.ReactElement;
