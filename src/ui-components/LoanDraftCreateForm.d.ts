/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SelectFieldProps, TextAreaFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type LoanDraftCreateFormInputValues = {
    status?: string;
    source?: string;
    draftNumber?: string;
    institutionID?: string;
    branchID?: string;
    borrowerID?: string;
    loanProductID?: string;
    createdByEmployeeID?: string;
    assignedToEmployeeID?: string;
    submittedAt?: string;
    approvedAt?: string;
    rejectedAt?: string;
    rejectionReason?: string;
    convertedAt?: string;
    draftRecord?: string;
    termsSnapshot?: string;
    schedulePreview?: string;
    scheduleHash?: string;
    editVersion?: number;
    lastEditedByEmployeeID?: string;
    lastEditedAt?: string;
    principal?: number;
    interestRate?: number;
    interestCalculationMethod?: string;
    startDate?: string;
    maturityDate?: string;
    loanCurrency?: string;
    createdAt?: string;
    updatedAt?: string;
};
export declare type LoanDraftCreateFormValidationValues = {
    status?: ValidationFunction<string>;
    source?: ValidationFunction<string>;
    draftNumber?: ValidationFunction<string>;
    institutionID?: ValidationFunction<string>;
    branchID?: ValidationFunction<string>;
    borrowerID?: ValidationFunction<string>;
    loanProductID?: ValidationFunction<string>;
    createdByEmployeeID?: ValidationFunction<string>;
    assignedToEmployeeID?: ValidationFunction<string>;
    submittedAt?: ValidationFunction<string>;
    approvedAt?: ValidationFunction<string>;
    rejectedAt?: ValidationFunction<string>;
    rejectionReason?: ValidationFunction<string>;
    convertedAt?: ValidationFunction<string>;
    draftRecord?: ValidationFunction<string>;
    termsSnapshot?: ValidationFunction<string>;
    schedulePreview?: ValidationFunction<string>;
    scheduleHash?: ValidationFunction<string>;
    editVersion?: ValidationFunction<number>;
    lastEditedByEmployeeID?: ValidationFunction<string>;
    lastEditedAt?: ValidationFunction<string>;
    principal?: ValidationFunction<number>;
    interestRate?: ValidationFunction<number>;
    interestCalculationMethod?: ValidationFunction<string>;
    startDate?: ValidationFunction<string>;
    maturityDate?: ValidationFunction<string>;
    loanCurrency?: ValidationFunction<string>;
    createdAt?: ValidationFunction<string>;
    updatedAt?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type LoanDraftCreateFormOverridesProps = {
    LoanDraftCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    status?: PrimitiveOverrideProps<SelectFieldProps>;
    source?: PrimitiveOverrideProps<SelectFieldProps>;
    draftNumber?: PrimitiveOverrideProps<TextFieldProps>;
    institutionID?: PrimitiveOverrideProps<TextFieldProps>;
    branchID?: PrimitiveOverrideProps<TextFieldProps>;
    borrowerID?: PrimitiveOverrideProps<TextFieldProps>;
    loanProductID?: PrimitiveOverrideProps<TextFieldProps>;
    createdByEmployeeID?: PrimitiveOverrideProps<TextFieldProps>;
    assignedToEmployeeID?: PrimitiveOverrideProps<TextFieldProps>;
    submittedAt?: PrimitiveOverrideProps<TextFieldProps>;
    approvedAt?: PrimitiveOverrideProps<TextFieldProps>;
    rejectedAt?: PrimitiveOverrideProps<TextFieldProps>;
    rejectionReason?: PrimitiveOverrideProps<TextFieldProps>;
    convertedAt?: PrimitiveOverrideProps<TextFieldProps>;
    draftRecord?: PrimitiveOverrideProps<TextAreaFieldProps>;
    termsSnapshot?: PrimitiveOverrideProps<TextAreaFieldProps>;
    schedulePreview?: PrimitiveOverrideProps<TextAreaFieldProps>;
    scheduleHash?: PrimitiveOverrideProps<TextFieldProps>;
    editVersion?: PrimitiveOverrideProps<TextFieldProps>;
    lastEditedByEmployeeID?: PrimitiveOverrideProps<TextFieldProps>;
    lastEditedAt?: PrimitiveOverrideProps<TextFieldProps>;
    principal?: PrimitiveOverrideProps<TextFieldProps>;
    interestRate?: PrimitiveOverrideProps<TextFieldProps>;
    interestCalculationMethod?: PrimitiveOverrideProps<SelectFieldProps>;
    startDate?: PrimitiveOverrideProps<TextFieldProps>;
    maturityDate?: PrimitiveOverrideProps<TextFieldProps>;
    loanCurrency?: PrimitiveOverrideProps<TextFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
    updatedAt?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type LoanDraftCreateFormProps = React.PropsWithChildren<{
    overrides?: LoanDraftCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: LoanDraftCreateFormInputValues) => LoanDraftCreateFormInputValues;
    onSuccess?: (fields: LoanDraftCreateFormInputValues) => void;
    onError?: (fields: LoanDraftCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: LoanDraftCreateFormInputValues) => LoanDraftCreateFormInputValues;
    onValidate?: LoanDraftCreateFormValidationValues;
} & React.CSSProperties>;
export default function LoanDraftCreateForm(props: LoanDraftCreateFormProps): React.ReactElement;
