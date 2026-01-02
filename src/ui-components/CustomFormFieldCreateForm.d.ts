/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SwitchFieldProps, TextAreaFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type CustomFormFieldCreateFormInputValues = {
    formKey?: string;
    label?: string;
    fieldType?: string;
    options?: string;
    required?: boolean;
    order?: number;
    createdBy?: string;
    status?: string;
    customCustomFormFieldDetails?: string;
};
export declare type CustomFormFieldCreateFormValidationValues = {
    formKey?: ValidationFunction<string>;
    label?: ValidationFunction<string>;
    fieldType?: ValidationFunction<string>;
    options?: ValidationFunction<string>;
    required?: ValidationFunction<boolean>;
    order?: ValidationFunction<number>;
    createdBy?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
    customCustomFormFieldDetails?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type CustomFormFieldCreateFormOverridesProps = {
    CustomFormFieldCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    formKey?: PrimitiveOverrideProps<TextFieldProps>;
    label?: PrimitiveOverrideProps<TextFieldProps>;
    fieldType?: PrimitiveOverrideProps<TextFieldProps>;
    options?: PrimitiveOverrideProps<TextAreaFieldProps>;
    required?: PrimitiveOverrideProps<SwitchFieldProps>;
    order?: PrimitiveOverrideProps<TextFieldProps>;
    createdBy?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    customCustomFormFieldDetails?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type CustomFormFieldCreateFormProps = React.PropsWithChildren<{
    overrides?: CustomFormFieldCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: CustomFormFieldCreateFormInputValues) => CustomFormFieldCreateFormInputValues;
    onSuccess?: (fields: CustomFormFieldCreateFormInputValues) => void;
    onError?: (fields: CustomFormFieldCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: CustomFormFieldCreateFormInputValues) => CustomFormFieldCreateFormInputValues;
    onValidate?: CustomFormFieldCreateFormValidationValues;
} & React.CSSProperties>;
export default function CustomFormFieldCreateForm(props: CustomFormFieldCreateFormProps): React.ReactElement;
