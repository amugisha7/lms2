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
export declare type PaymentCreateFormInputValues = {
    paymentDate?: string;
    paymentType?: string;
    amount?: number;
    description?: string;
    referenceNumber?: string;
    paymentMethod?: string;
    status?: string;
    notes?: string;
};
export declare type PaymentCreateFormValidationValues = {
    paymentDate?: ValidationFunction<string>;
    paymentType?: ValidationFunction<string>;
    amount?: ValidationFunction<number>;
    description?: ValidationFunction<string>;
    referenceNumber?: ValidationFunction<string>;
    paymentMethod?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
    notes?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type PaymentCreateFormOverridesProps = {
    PaymentCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    paymentDate?: PrimitiveOverrideProps<TextFieldProps>;
    paymentType?: PrimitiveOverrideProps<TextFieldProps>;
    amount?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    referenceNumber?: PrimitiveOverrideProps<TextFieldProps>;
    paymentMethod?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    notes?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type PaymentCreateFormProps = React.PropsWithChildren<{
    overrides?: PaymentCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: PaymentCreateFormInputValues) => PaymentCreateFormInputValues;
    onSuccess?: (fields: PaymentCreateFormInputValues) => void;
    onError?: (fields: PaymentCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: PaymentCreateFormInputValues) => PaymentCreateFormInputValues;
    onValidate?: PaymentCreateFormValidationValues;
} & React.CSSProperties>;
export default function PaymentCreateForm(props: PaymentCreateFormProps): React.ReactElement;
