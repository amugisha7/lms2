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
export declare type ContractCreateFormInputValues = {
    contractNumber?: string;
    contractType?: string;
    contractDate?: string;
    contractStatus?: string;
    contractRecord?: string;
    status?: string;
};
export declare type ContractCreateFormValidationValues = {
    contractNumber?: ValidationFunction<string>;
    contractType?: ValidationFunction<string>;
    contractDate?: ValidationFunction<string>;
    contractStatus?: ValidationFunction<string>;
    contractRecord?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ContractCreateFormOverridesProps = {
    ContractCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    contractNumber?: PrimitiveOverrideProps<TextFieldProps>;
    contractType?: PrimitiveOverrideProps<TextFieldProps>;
    contractDate?: PrimitiveOverrideProps<TextFieldProps>;
    contractStatus?: PrimitiveOverrideProps<TextFieldProps>;
    contractRecord?: PrimitiveOverrideProps<TextAreaFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ContractCreateFormProps = React.PropsWithChildren<{
    overrides?: ContractCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ContractCreateFormInputValues) => ContractCreateFormInputValues;
    onSuccess?: (fields: ContractCreateFormInputValues) => void;
    onError?: (fields: ContractCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ContractCreateFormInputValues) => ContractCreateFormInputValues;
    onValidate?: ContractCreateFormValidationValues;
} & React.CSSProperties>;
export default function ContractCreateForm(props: ContractCreateFormProps): React.ReactElement;
