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
export declare type SavingsAccountCreateFormInputValues = {
    accountNumber?: string;
    balance?: number;
    status?: string;
    lockedAmount?: number;
    lockedForLoanID?: string;
    customSavingsAccountDetails?: string;
};
export declare type SavingsAccountCreateFormValidationValues = {
    accountNumber?: ValidationFunction<string>;
    balance?: ValidationFunction<number>;
    status?: ValidationFunction<string>;
    lockedAmount?: ValidationFunction<number>;
    lockedForLoanID?: ValidationFunction<string>;
    customSavingsAccountDetails?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type SavingsAccountCreateFormOverridesProps = {
    SavingsAccountCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    accountNumber?: PrimitiveOverrideProps<TextFieldProps>;
    balance?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    lockedAmount?: PrimitiveOverrideProps<TextFieldProps>;
    lockedForLoanID?: PrimitiveOverrideProps<TextFieldProps>;
    customSavingsAccountDetails?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type SavingsAccountCreateFormProps = React.PropsWithChildren<{
    overrides?: SavingsAccountCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: SavingsAccountCreateFormInputValues) => SavingsAccountCreateFormInputValues;
    onSuccess?: (fields: SavingsAccountCreateFormInputValues) => void;
    onError?: (fields: SavingsAccountCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: SavingsAccountCreateFormInputValues) => SavingsAccountCreateFormInputValues;
    onValidate?: SavingsAccountCreateFormValidationValues;
} & React.CSSProperties>;
export default function SavingsAccountCreateForm(props: SavingsAccountCreateFormProps): React.ReactElement;
