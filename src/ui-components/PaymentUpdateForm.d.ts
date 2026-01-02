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
export declare type PaymentUpdateFormInputValues = {
    paymentDate?: string;
    paymentType?: string;
    amount?: number;
    description?: string;
    referenceNumber?: string;
    paymentMethod?: string;
    status?: string;
    paymentStatusEnum?: string;
    notes?: string;
    amountAllocatedToPrincipal?: number;
    amountAllocatedToInterest?: number;
    amountAllocatedToFees?: number;
    amountAllocatedToPenalty?: number;
    customPaymentDetails?: string;
};
export declare type PaymentUpdateFormValidationValues = {
    paymentDate?: ValidationFunction<string>;
    paymentType?: ValidationFunction<string>;
    amount?: ValidationFunction<number>;
    description?: ValidationFunction<string>;
    referenceNumber?: ValidationFunction<string>;
    paymentMethod?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
    paymentStatusEnum?: ValidationFunction<string>;
    notes?: ValidationFunction<string>;
    amountAllocatedToPrincipal?: ValidationFunction<number>;
    amountAllocatedToInterest?: ValidationFunction<number>;
    amountAllocatedToFees?: ValidationFunction<number>;
    amountAllocatedToPenalty?: ValidationFunction<number>;
    customPaymentDetails?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type PaymentUpdateFormOverridesProps = {
    PaymentUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    paymentDate?: PrimitiveOverrideProps<TextFieldProps>;
    paymentType?: PrimitiveOverrideProps<TextFieldProps>;
    amount?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    referenceNumber?: PrimitiveOverrideProps<TextFieldProps>;
    paymentMethod?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    paymentStatusEnum?: PrimitiveOverrideProps<SelectFieldProps>;
    notes?: PrimitiveOverrideProps<TextFieldProps>;
    amountAllocatedToPrincipal?: PrimitiveOverrideProps<TextFieldProps>;
    amountAllocatedToInterest?: PrimitiveOverrideProps<TextFieldProps>;
    amountAllocatedToFees?: PrimitiveOverrideProps<TextFieldProps>;
    amountAllocatedToPenalty?: PrimitiveOverrideProps<TextFieldProps>;
    customPaymentDetails?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type PaymentUpdateFormProps = React.PropsWithChildren<{
    overrides?: PaymentUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    payment?: any;
    onSubmit?: (fields: PaymentUpdateFormInputValues) => PaymentUpdateFormInputValues;
    onSuccess?: (fields: PaymentUpdateFormInputValues) => void;
    onError?: (fields: PaymentUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: PaymentUpdateFormInputValues) => PaymentUpdateFormInputValues;
    onValidate?: PaymentUpdateFormValidationValues;
} & React.CSSProperties>;
export default function PaymentUpdateForm(props: PaymentUpdateFormProps): React.ReactElement;
