/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SelectFieldProps, SwitchFieldProps, TextAreaFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
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
    principalAmountMin?: number;
    principalAmountMax?: number;
    principalAmountDefault?: number;
    interestRateMin?: number;
    interestRateMax?: number;
    interestRateDefault?: number;
    interestCalculationMethod?: string;
    interestType?: string;
    interestPeriod?: string;
    termDurationMin?: number;
    termDurationMax?: number;
    termDurationDefault?: number;
    durationPeriod?: string;
    repaymentFrequency?: string;
    repaymentOrder?: string;
    extendLoanAfterMaturity?: boolean;
    interestTypeMaturity?: string;
    calculateInterestOn?: string;
    loanInterestRateAfterMaturity?: number;
    recurringPeriodAfterMaturityUnit?: string;
};
export declare type LoanProductCreateFormValidationValues = {
    name?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    principalAmountMin?: ValidationFunction<number>;
    principalAmountMax?: ValidationFunction<number>;
    principalAmountDefault?: ValidationFunction<number>;
    interestRateMin?: ValidationFunction<number>;
    interestRateMax?: ValidationFunction<number>;
    interestRateDefault?: ValidationFunction<number>;
    interestCalculationMethod?: ValidationFunction<string>;
    interestType?: ValidationFunction<string>;
    interestPeriod?: ValidationFunction<string>;
    termDurationMin?: ValidationFunction<number>;
    termDurationMax?: ValidationFunction<number>;
    termDurationDefault?: ValidationFunction<number>;
    durationPeriod?: ValidationFunction<string>;
    repaymentFrequency?: ValidationFunction<string>;
    repaymentOrder?: ValidationFunction<string>;
    extendLoanAfterMaturity?: ValidationFunction<boolean>;
    interestTypeMaturity?: ValidationFunction<string>;
    calculateInterestOn?: ValidationFunction<string>;
    loanInterestRateAfterMaturity?: ValidationFunction<number>;
    recurringPeriodAfterMaturityUnit?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type LoanProductCreateFormOverridesProps = {
    LoanProductCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    principalAmountMin?: PrimitiveOverrideProps<TextFieldProps>;
    principalAmountMax?: PrimitiveOverrideProps<TextFieldProps>;
    principalAmountDefault?: PrimitiveOverrideProps<TextFieldProps>;
    interestRateMin?: PrimitiveOverrideProps<TextFieldProps>;
    interestRateMax?: PrimitiveOverrideProps<TextFieldProps>;
    interestRateDefault?: PrimitiveOverrideProps<TextFieldProps>;
    interestCalculationMethod?: PrimitiveOverrideProps<SelectFieldProps>;
    interestType?: PrimitiveOverrideProps<TextFieldProps>;
    interestPeriod?: PrimitiveOverrideProps<TextFieldProps>;
    termDurationMin?: PrimitiveOverrideProps<TextFieldProps>;
    termDurationMax?: PrimitiveOverrideProps<TextFieldProps>;
    termDurationDefault?: PrimitiveOverrideProps<TextFieldProps>;
    durationPeriod?: PrimitiveOverrideProps<TextFieldProps>;
    repaymentFrequency?: PrimitiveOverrideProps<TextFieldProps>;
    repaymentOrder?: PrimitiveOverrideProps<TextAreaFieldProps>;
    extendLoanAfterMaturity?: PrimitiveOverrideProps<SwitchFieldProps>;
    interestTypeMaturity?: PrimitiveOverrideProps<TextFieldProps>;
    calculateInterestOn?: PrimitiveOverrideProps<TextFieldProps>;
    loanInterestRateAfterMaturity?: PrimitiveOverrideProps<TextFieldProps>;
    recurringPeriodAfterMaturityUnit?: PrimitiveOverrideProps<TextFieldProps>;
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
