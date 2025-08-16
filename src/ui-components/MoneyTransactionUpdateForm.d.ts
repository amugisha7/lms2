/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type MoneyTransactionUpdateFormInputValues = {
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
};
export declare type MoneyTransactionUpdateFormValidationValues = {
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
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type MoneyTransactionUpdateFormOverridesProps = {
    MoneyTransactionUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
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
} & EscapeHatchProps;
export declare type MoneyTransactionUpdateFormProps = React.PropsWithChildren<{
    overrides?: MoneyTransactionUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    moneyTransaction?: any;
    onSubmit?: (fields: MoneyTransactionUpdateFormInputValues) => MoneyTransactionUpdateFormInputValues;
    onSuccess?: (fields: MoneyTransactionUpdateFormInputValues) => void;
    onError?: (fields: MoneyTransactionUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: MoneyTransactionUpdateFormInputValues) => MoneyTransactionUpdateFormInputValues;
    onValidate?: MoneyTransactionUpdateFormValidationValues;
} & React.CSSProperties>;
export default function MoneyTransactionUpdateForm(props: MoneyTransactionUpdateFormProps): React.ReactElement;
