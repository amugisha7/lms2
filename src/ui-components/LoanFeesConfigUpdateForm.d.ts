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
export declare type LoanFeesConfigUpdateFormInputValues = {
    name?: string;
    category?: string;
    calculationMethod?: string;
    description?: string;
    percentageBase?: string;
    rate?: number;
    status?: string;
};
export declare type LoanFeesConfigUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    category?: ValidationFunction<string>;
    calculationMethod?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    percentageBase?: ValidationFunction<string>;
    rate?: ValidationFunction<number>;
    status?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type LoanFeesConfigUpdateFormOverridesProps = {
    LoanFeesConfigUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    category?: PrimitiveOverrideProps<TextFieldProps>;
    calculationMethod?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    percentageBase?: PrimitiveOverrideProps<TextFieldProps>;
    rate?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type LoanFeesConfigUpdateFormProps = React.PropsWithChildren<{
    overrides?: LoanFeesConfigUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    loanFeesConfig?: any;
    onSubmit?: (fields: LoanFeesConfigUpdateFormInputValues) => LoanFeesConfigUpdateFormInputValues;
    onSuccess?: (fields: LoanFeesConfigUpdateFormInputValues) => void;
    onError?: (fields: LoanFeesConfigUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: LoanFeesConfigUpdateFormInputValues) => LoanFeesConfigUpdateFormInputValues;
    onValidate?: LoanFeesConfigUpdateFormValidationValues;
} & React.CSSProperties>;
export default function LoanFeesConfigUpdateForm(props: LoanFeesConfigUpdateFormProps): React.ReactElement;
