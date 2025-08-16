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
export declare type AccountUpdateFormInputValues = {
    name?: string;
    accountType?: string;
    accountNumber?: string;
    description?: string;
    currency?: string;
    currentBalance?: number;
    openingBalance?: number;
    interestRate?: number;
    interestCalculationMethod?: string;
    interestPostingFrequency?: string;
    interestPostingDate?: string;
    interestAccrued?: number;
    interestAccruedDate?: string;
    accountStatus?: string;
    status?: string;
};
export declare type AccountUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    accountType?: ValidationFunction<string>;
    accountNumber?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    currency?: ValidationFunction<string>;
    currentBalance?: ValidationFunction<number>;
    openingBalance?: ValidationFunction<number>;
    interestRate?: ValidationFunction<number>;
    interestCalculationMethod?: ValidationFunction<string>;
    interestPostingFrequency?: ValidationFunction<string>;
    interestPostingDate?: ValidationFunction<string>;
    interestAccrued?: ValidationFunction<number>;
    interestAccruedDate?: ValidationFunction<string>;
    accountStatus?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type AccountUpdateFormOverridesProps = {
    AccountUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    accountType?: PrimitiveOverrideProps<TextFieldProps>;
    accountNumber?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    currency?: PrimitiveOverrideProps<TextFieldProps>;
    currentBalance?: PrimitiveOverrideProps<TextFieldProps>;
    openingBalance?: PrimitiveOverrideProps<TextFieldProps>;
    interestRate?: PrimitiveOverrideProps<TextFieldProps>;
    interestCalculationMethod?: PrimitiveOverrideProps<TextFieldProps>;
    interestPostingFrequency?: PrimitiveOverrideProps<TextFieldProps>;
    interestPostingDate?: PrimitiveOverrideProps<TextFieldProps>;
    interestAccrued?: PrimitiveOverrideProps<TextFieldProps>;
    interestAccruedDate?: PrimitiveOverrideProps<TextFieldProps>;
    accountStatus?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type AccountUpdateFormProps = React.PropsWithChildren<{
    overrides?: AccountUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    account?: any;
    onSubmit?: (fields: AccountUpdateFormInputValues) => AccountUpdateFormInputValues;
    onSuccess?: (fields: AccountUpdateFormInputValues) => void;
    onError?: (fields: AccountUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: AccountUpdateFormInputValues) => AccountUpdateFormInputValues;
    onValidate?: AccountUpdateFormValidationValues;
} & React.CSSProperties>;
export default function AccountUpdateForm(props: AccountUpdateFormProps): React.ReactElement;
