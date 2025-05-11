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
export declare type ExpenseUpdateFormInputValues = {
    transactionDate?: string;
    amount?: number;
    description?: string;
    referenceNumber?: string;
    receiptDocumentS3Key?: string;
    status?: string;
    notes?: string;
    payee?: string;
    paymentMethod?: string;
    checkNumber?: string;
    approvedDate?: string;
    type?: string;
    category?: string;
};
export declare type ExpenseUpdateFormValidationValues = {
    transactionDate?: ValidationFunction<string>;
    amount?: ValidationFunction<number>;
    description?: ValidationFunction<string>;
    referenceNumber?: ValidationFunction<string>;
    receiptDocumentS3Key?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
    notes?: ValidationFunction<string>;
    payee?: ValidationFunction<string>;
    paymentMethod?: ValidationFunction<string>;
    checkNumber?: ValidationFunction<string>;
    approvedDate?: ValidationFunction<string>;
    type?: ValidationFunction<string>;
    category?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ExpenseUpdateFormOverridesProps = {
    ExpenseUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    transactionDate?: PrimitiveOverrideProps<TextFieldProps>;
    amount?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    referenceNumber?: PrimitiveOverrideProps<TextFieldProps>;
    receiptDocumentS3Key?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    notes?: PrimitiveOverrideProps<TextFieldProps>;
    payee?: PrimitiveOverrideProps<TextFieldProps>;
    paymentMethod?: PrimitiveOverrideProps<TextFieldProps>;
    checkNumber?: PrimitiveOverrideProps<TextFieldProps>;
    approvedDate?: PrimitiveOverrideProps<TextFieldProps>;
    type?: PrimitiveOverrideProps<TextFieldProps>;
    category?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ExpenseUpdateFormProps = React.PropsWithChildren<{
    overrides?: ExpenseUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    expense?: any;
    onSubmit?: (fields: ExpenseUpdateFormInputValues) => ExpenseUpdateFormInputValues;
    onSuccess?: (fields: ExpenseUpdateFormInputValues) => void;
    onError?: (fields: ExpenseUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ExpenseUpdateFormInputValues) => ExpenseUpdateFormInputValues;
    onValidate?: ExpenseUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ExpenseUpdateForm(props: ExpenseUpdateFormProps): React.ReactElement;
