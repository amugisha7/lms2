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
export declare type BranchCreateFormInputValues = {
    name?: string;
    branchCode?: string;
    address?: string;
};
export declare type BranchCreateFormValidationValues = {
    name?: ValidationFunction<string>;
    branchCode?: ValidationFunction<string>;
    address?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type BranchCreateFormOverridesProps = {
    BranchCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    branchCode?: PrimitiveOverrideProps<TextFieldProps>;
    address?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type BranchCreateFormProps = React.PropsWithChildren<{
    overrides?: BranchCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: BranchCreateFormInputValues) => BranchCreateFormInputValues;
    onSuccess?: (fields: BranchCreateFormInputValues) => void;
    onError?: (fields: BranchCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: BranchCreateFormInputValues) => BranchCreateFormInputValues;
    onValidate?: BranchCreateFormValidationValues;
} & React.CSSProperties>;
export default function BranchCreateForm(props: BranchCreateFormProps): React.ReactElement;
