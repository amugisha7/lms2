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
export declare type PayrollUpdateFormInputValues = {
    periodStartDate?: string;
    periodEndDate?: string;
    payDate?: string;
    status?: string;
    processedByUserID?: string;
    totalGrossPay?: number;
    totalLoanDeductions?: number;
    totalSavingsDeductions?: number;
    totalShareDeductions?: number;
    totalNetPay?: number;
    details?: string;
    customPayrollDetails?: string;
};
export declare type PayrollUpdateFormValidationValues = {
    periodStartDate?: ValidationFunction<string>;
    periodEndDate?: ValidationFunction<string>;
    payDate?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
    processedByUserID?: ValidationFunction<string>;
    totalGrossPay?: ValidationFunction<number>;
    totalLoanDeductions?: ValidationFunction<number>;
    totalSavingsDeductions?: ValidationFunction<number>;
    totalShareDeductions?: ValidationFunction<number>;
    totalNetPay?: ValidationFunction<number>;
    details?: ValidationFunction<string>;
    customPayrollDetails?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type PayrollUpdateFormOverridesProps = {
    PayrollUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    periodStartDate?: PrimitiveOverrideProps<TextFieldProps>;
    periodEndDate?: PrimitiveOverrideProps<TextFieldProps>;
    payDate?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    processedByUserID?: PrimitiveOverrideProps<TextFieldProps>;
    totalGrossPay?: PrimitiveOverrideProps<TextFieldProps>;
    totalLoanDeductions?: PrimitiveOverrideProps<TextFieldProps>;
    totalSavingsDeductions?: PrimitiveOverrideProps<TextFieldProps>;
    totalShareDeductions?: PrimitiveOverrideProps<TextFieldProps>;
    totalNetPay?: PrimitiveOverrideProps<TextFieldProps>;
    details?: PrimitiveOverrideProps<TextFieldProps>;
    customPayrollDetails?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type PayrollUpdateFormProps = React.PropsWithChildren<{
    overrides?: PayrollUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    payroll?: any;
    onSubmit?: (fields: PayrollUpdateFormInputValues) => PayrollUpdateFormInputValues;
    onSuccess?: (fields: PayrollUpdateFormInputValues) => void;
    onError?: (fields: PayrollUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: PayrollUpdateFormInputValues) => PayrollUpdateFormInputValues;
    onValidate?: PayrollUpdateFormValidationValues;
} & React.CSSProperties>;
export default function PayrollUpdateForm(props: PayrollUpdateFormProps): React.ReactElement;
