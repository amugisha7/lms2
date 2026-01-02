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
export declare type LoanFeesConfigCreateFormInputValues = {
    name?: string;
    category?: string;
    calculationMethod?: string;
    description?: string;
    percentageBase?: string;
    rate?: number;
    status?: string;
    customLoanFeesConfigDetails?: string;
};
export declare type LoanFeesConfigCreateFormValidationValues = {
    name?: ValidationFunction<string>;
    category?: ValidationFunction<string>;
    calculationMethod?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    percentageBase?: ValidationFunction<string>;
    rate?: ValidationFunction<number>;
    status?: ValidationFunction<string>;
    customLoanFeesConfigDetails?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type LoanFeesConfigCreateFormOverridesProps = {
    LoanFeesConfigCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    category?: PrimitiveOverrideProps<TextFieldProps>;
    calculationMethod?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    percentageBase?: PrimitiveOverrideProps<TextFieldProps>;
    rate?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    customLoanFeesConfigDetails?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type LoanFeesConfigCreateFormProps = React.PropsWithChildren<{
    overrides?: LoanFeesConfigCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: LoanFeesConfigCreateFormInputValues) => LoanFeesConfigCreateFormInputValues;
    onSuccess?: (fields: LoanFeesConfigCreateFormInputValues) => void;
    onError?: (fields: LoanFeesConfigCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: LoanFeesConfigCreateFormInputValues) => LoanFeesConfigCreateFormInputValues;
    onValidate?: LoanFeesConfigCreateFormValidationValues;
} & React.CSSProperties>;
export default function LoanFeesConfigCreateForm(props: LoanFeesConfigCreateFormProps): React.ReactElement;
