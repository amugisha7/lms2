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
export declare type SavingsTransactionUpdateFormInputValues = {
    amount?: number;
    type?: string;
    date?: string;
    customSavingsTransactionDetails?: string;
};
export declare type SavingsTransactionUpdateFormValidationValues = {
    amount?: ValidationFunction<number>;
    type?: ValidationFunction<string>;
    date?: ValidationFunction<string>;
    customSavingsTransactionDetails?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type SavingsTransactionUpdateFormOverridesProps = {
    SavingsTransactionUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    amount?: PrimitiveOverrideProps<TextFieldProps>;
    type?: PrimitiveOverrideProps<TextFieldProps>;
    date?: PrimitiveOverrideProps<TextFieldProps>;
    customSavingsTransactionDetails?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type SavingsTransactionUpdateFormProps = React.PropsWithChildren<{
    overrides?: SavingsTransactionUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    savingsTransaction?: any;
    onSubmit?: (fields: SavingsTransactionUpdateFormInputValues) => SavingsTransactionUpdateFormInputValues;
    onSuccess?: (fields: SavingsTransactionUpdateFormInputValues) => void;
    onError?: (fields: SavingsTransactionUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: SavingsTransactionUpdateFormInputValues) => SavingsTransactionUpdateFormInputValues;
    onValidate?: SavingsTransactionUpdateFormValidationValues;
} & React.CSSProperties>;
export default function SavingsTransactionUpdateForm(props: SavingsTransactionUpdateFormProps): React.ReactElement;
