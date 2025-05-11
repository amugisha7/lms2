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
export declare type LoanFeesCreateFormInputValues = {
    amount?: number;
    loanFeesName?: string;
    loanFeesCategory?: string;
    loanFeesCalculationMethod?: string;
    loanFeesRate?: number;
    loanFeesDate?: string;
    loanFeesStatus?: string;
    notes?: string;
    loanFeesType?: string;
    loanFeesDescription?: string;
    loanFeesAttribute1?: string;
    loanFeesAttribute2?: string;
};
export declare type LoanFeesCreateFormValidationValues = {
    amount?: ValidationFunction<number>;
    loanFeesName?: ValidationFunction<string>;
    loanFeesCategory?: ValidationFunction<string>;
    loanFeesCalculationMethod?: ValidationFunction<string>;
    loanFeesRate?: ValidationFunction<number>;
    loanFeesDate?: ValidationFunction<string>;
    loanFeesStatus?: ValidationFunction<string>;
    notes?: ValidationFunction<string>;
    loanFeesType?: ValidationFunction<string>;
    loanFeesDescription?: ValidationFunction<string>;
    loanFeesAttribute1?: ValidationFunction<string>;
    loanFeesAttribute2?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type LoanFeesCreateFormOverridesProps = {
    LoanFeesCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    amount?: PrimitiveOverrideProps<TextFieldProps>;
    loanFeesName?: PrimitiveOverrideProps<TextFieldProps>;
    loanFeesCategory?: PrimitiveOverrideProps<TextFieldProps>;
    loanFeesCalculationMethod?: PrimitiveOverrideProps<TextFieldProps>;
    loanFeesRate?: PrimitiveOverrideProps<TextFieldProps>;
    loanFeesDate?: PrimitiveOverrideProps<TextFieldProps>;
    loanFeesStatus?: PrimitiveOverrideProps<TextFieldProps>;
    notes?: PrimitiveOverrideProps<TextFieldProps>;
    loanFeesType?: PrimitiveOverrideProps<TextFieldProps>;
    loanFeesDescription?: PrimitiveOverrideProps<TextFieldProps>;
    loanFeesAttribute1?: PrimitiveOverrideProps<TextFieldProps>;
    loanFeesAttribute2?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type LoanFeesCreateFormProps = React.PropsWithChildren<{
    overrides?: LoanFeesCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: LoanFeesCreateFormInputValues) => LoanFeesCreateFormInputValues;
    onSuccess?: (fields: LoanFeesCreateFormInputValues) => void;
    onError?: (fields: LoanFeesCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: LoanFeesCreateFormInputValues) => LoanFeesCreateFormInputValues;
    onValidate?: LoanFeesCreateFormValidationValues;
} & React.CSSProperties>;
export default function LoanFeesCreateForm(props: LoanFeesCreateFormProps): React.ReactElement;
