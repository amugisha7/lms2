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
export declare type BranchUpdateFormInputValues = {
    name?: string;
    branchCode?: string;
    address?: string;
    status?: string;
};
export declare type BranchUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    branchCode?: ValidationFunction<string>;
    address?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type BranchUpdateFormOverridesProps = {
    BranchUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    branchCode?: PrimitiveOverrideProps<TextFieldProps>;
    address?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type BranchUpdateFormProps = React.PropsWithChildren<{
    overrides?: BranchUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    branch?: any;
    onSubmit?: (fields: BranchUpdateFormInputValues) => BranchUpdateFormInputValues;
    onSuccess?: (fields: BranchUpdateFormInputValues) => void;
    onError?: (fields: BranchUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: BranchUpdateFormInputValues) => BranchUpdateFormInputValues;
    onValidate?: BranchUpdateFormValidationValues;
} & React.CSSProperties>;
export default function BranchUpdateForm(props: BranchUpdateFormProps): React.ReactElement;
