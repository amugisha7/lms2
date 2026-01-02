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
export declare type MoneyTransactionCreateFormInputValues = {
    transactionType?: string;
    transactionDate?: string;
    amount?: number;
    description?: string;
    referenceNumber?: string;
    relatedEntityType?: string;
    approvalStatus?: string;
    approvedDate?: string;
    category?: string;
    notes?: string;
    paymentMethod?: string;
    deviceInfo?: string;
    status?: string;
    customMoneyTransactionDetails?: string;
};
export declare type MoneyTransactionCreateFormValidationValues = {
    transactionType?: ValidationFunction<string>;
    transactionDate?: ValidationFunction<string>;
    amount?: ValidationFunction<number>;
    description?: ValidationFunction<string>;
    referenceNumber?: ValidationFunction<string>;
    relatedEntityType?: ValidationFunction<string>;
    approvalStatus?: ValidationFunction<string>;
    approvedDate?: ValidationFunction<string>;
    category?: ValidationFunction<string>;
    notes?: ValidationFunction<string>;
    paymentMethod?: ValidationFunction<string>;
    deviceInfo?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
    customMoneyTransactionDetails?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type MoneyTransactionCreateFormOverridesProps = {
    MoneyTransactionCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    transactionType?: PrimitiveOverrideProps<TextFieldProps>;
    transactionDate?: PrimitiveOverrideProps<TextFieldProps>;
    amount?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    referenceNumber?: PrimitiveOverrideProps<TextFieldProps>;
    relatedEntityType?: PrimitiveOverrideProps<TextFieldProps>;
    approvalStatus?: PrimitiveOverrideProps<TextFieldProps>;
    approvedDate?: PrimitiveOverrideProps<TextFieldProps>;
    category?: PrimitiveOverrideProps<TextFieldProps>;
    notes?: PrimitiveOverrideProps<TextFieldProps>;
    paymentMethod?: PrimitiveOverrideProps<TextFieldProps>;
    deviceInfo?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    customMoneyTransactionDetails?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type MoneyTransactionCreateFormProps = React.PropsWithChildren<{
    overrides?: MoneyTransactionCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: MoneyTransactionCreateFormInputValues) => MoneyTransactionCreateFormInputValues;
    onSuccess?: (fields: MoneyTransactionCreateFormInputValues) => void;
    onError?: (fields: MoneyTransactionCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: MoneyTransactionCreateFormInputValues) => MoneyTransactionCreateFormInputValues;
    onValidate?: MoneyTransactionCreateFormValidationValues;
} & React.CSSProperties>;
export default function MoneyTransactionCreateForm(props: MoneyTransactionCreateFormProps): React.ReactElement;
