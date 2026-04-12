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
export declare type LoanSummaryCreateFormInputValues = {
    loanID?: string;
    refreshScope?: string;
    institutionID?: string;
    branchID?: string;
    borrowerID?: string;
    borrowerDisplayName?: string;
    borrowerDisplayNameNormalized?: string;
    borrowerPhone?: string;
    loanNumber?: string;
    loanOfficerID?: string;
    loanOfficerDisplayName?: string;
    loanProductID?: string;
    loanProductName?: string;
    principalAmount?: number;
    totalPaidAmount?: number;
    amountDueAmount?: number;
    loanBalanceAmount?: number;
    arrearsAmount?: number;
    missedInstallmentCount?: number;
    nextDueDate?: string;
    lastPaymentDate?: string;
    startDate?: string;
    maturityDateEffective?: string;
    lifecycleStatus?: string;
    displayStatus?: string;
    displayStatusRank?: number;
    displayStatusComputedAt?: string;
    nextStatusTransitionAt?: string;
    currencyCode?: string;
};
export declare type LoanSummaryCreateFormValidationValues = {
    loanID?: ValidationFunction<string>;
    refreshScope?: ValidationFunction<string>;
    institutionID?: ValidationFunction<string>;
    branchID?: ValidationFunction<string>;
    borrowerID?: ValidationFunction<string>;
    borrowerDisplayName?: ValidationFunction<string>;
    borrowerDisplayNameNormalized?: ValidationFunction<string>;
    borrowerPhone?: ValidationFunction<string>;
    loanNumber?: ValidationFunction<string>;
    loanOfficerID?: ValidationFunction<string>;
    loanOfficerDisplayName?: ValidationFunction<string>;
    loanProductID?: ValidationFunction<string>;
    loanProductName?: ValidationFunction<string>;
    principalAmount?: ValidationFunction<number>;
    totalPaidAmount?: ValidationFunction<number>;
    amountDueAmount?: ValidationFunction<number>;
    loanBalanceAmount?: ValidationFunction<number>;
    arrearsAmount?: ValidationFunction<number>;
    missedInstallmentCount?: ValidationFunction<number>;
    nextDueDate?: ValidationFunction<string>;
    lastPaymentDate?: ValidationFunction<string>;
    startDate?: ValidationFunction<string>;
    maturityDateEffective?: ValidationFunction<string>;
    lifecycleStatus?: ValidationFunction<string>;
    displayStatus?: ValidationFunction<string>;
    displayStatusRank?: ValidationFunction<number>;
    displayStatusComputedAt?: ValidationFunction<string>;
    nextStatusTransitionAt?: ValidationFunction<string>;
    currencyCode?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type LoanSummaryCreateFormOverridesProps = {
    LoanSummaryCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    loanID?: PrimitiveOverrideProps<TextFieldProps>;
    refreshScope?: PrimitiveOverrideProps<TextFieldProps>;
    institutionID?: PrimitiveOverrideProps<TextFieldProps>;
    branchID?: PrimitiveOverrideProps<TextFieldProps>;
    borrowerID?: PrimitiveOverrideProps<TextFieldProps>;
    borrowerDisplayName?: PrimitiveOverrideProps<TextFieldProps>;
    borrowerDisplayNameNormalized?: PrimitiveOverrideProps<TextFieldProps>;
    borrowerPhone?: PrimitiveOverrideProps<TextFieldProps>;
    loanNumber?: PrimitiveOverrideProps<TextFieldProps>;
    loanOfficerID?: PrimitiveOverrideProps<TextFieldProps>;
    loanOfficerDisplayName?: PrimitiveOverrideProps<TextFieldProps>;
    loanProductID?: PrimitiveOverrideProps<TextFieldProps>;
    loanProductName?: PrimitiveOverrideProps<TextFieldProps>;
    principalAmount?: PrimitiveOverrideProps<TextFieldProps>;
    totalPaidAmount?: PrimitiveOverrideProps<TextFieldProps>;
    amountDueAmount?: PrimitiveOverrideProps<TextFieldProps>;
    loanBalanceAmount?: PrimitiveOverrideProps<TextFieldProps>;
    arrearsAmount?: PrimitiveOverrideProps<TextFieldProps>;
    missedInstallmentCount?: PrimitiveOverrideProps<TextFieldProps>;
    nextDueDate?: PrimitiveOverrideProps<TextFieldProps>;
    lastPaymentDate?: PrimitiveOverrideProps<TextFieldProps>;
    startDate?: PrimitiveOverrideProps<TextFieldProps>;
    maturityDateEffective?: PrimitiveOverrideProps<TextFieldProps>;
    lifecycleStatus?: PrimitiveOverrideProps<TextFieldProps>;
    displayStatus?: PrimitiveOverrideProps<SelectFieldProps>;
    displayStatusRank?: PrimitiveOverrideProps<TextFieldProps>;
    displayStatusComputedAt?: PrimitiveOverrideProps<TextFieldProps>;
    nextStatusTransitionAt?: PrimitiveOverrideProps<TextFieldProps>;
    currencyCode?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type LoanSummaryCreateFormProps = React.PropsWithChildren<{
    overrides?: LoanSummaryCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: LoanSummaryCreateFormInputValues) => LoanSummaryCreateFormInputValues;
    onSuccess?: (fields: LoanSummaryCreateFormInputValues) => void;
    onError?: (fields: LoanSummaryCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: LoanSummaryCreateFormInputValues) => LoanSummaryCreateFormInputValues;
    onValidate?: LoanSummaryCreateFormValidationValues;
} & React.CSSProperties>;
export default function LoanSummaryCreateForm(props: LoanSummaryCreateFormProps): React.ReactElement;
