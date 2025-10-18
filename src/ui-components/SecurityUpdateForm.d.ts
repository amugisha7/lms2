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
export declare type SecurityUpdateFormInputValues = {
    name?: string;
    type?: string;
    description?: string;
    value?: number;
    status?: string;
};
export declare type SecurityUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    type?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    value?: ValidationFunction<number>;
    status?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type SecurityUpdateFormOverridesProps = {
    SecurityUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    type?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    value?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type SecurityUpdateFormProps = React.PropsWithChildren<{
    overrides?: SecurityUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    security?: any;
    onSubmit?: (fields: SecurityUpdateFormInputValues) => SecurityUpdateFormInputValues;
    onSuccess?: (fields: SecurityUpdateFormInputValues) => void;
    onError?: (fields: SecurityUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: SecurityUpdateFormInputValues) => SecurityUpdateFormInputValues;
    onValidate?: SecurityUpdateFormValidationValues;
} & React.CSSProperties>;
export default function SecurityUpdateForm(props: SecurityUpdateFormProps): React.ReactElement;
