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
export declare type CustomFormFieldUpdateFormInputValues = {
    formKey?: string;
    label?: string;
    fieldType?: string;
    options?: string;
    required?: boolean;
    order?: number;
    createdBy?: string;
};
export declare type CustomFormFieldUpdateFormValidationValues = {
    formKey?: ValidationFunction<string>;
    label?: ValidationFunction<string>;
    fieldType?: ValidationFunction<string>;
    options?: ValidationFunction<string>;
    required?: ValidationFunction<boolean>;
    order?: ValidationFunction<number>;
    createdBy?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type CustomFormFieldUpdateFormOverridesProps = {
    CustomFormFieldUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    formKey?: PrimitiveOverrideProps<TextFieldProps>;
    label?: PrimitiveOverrideProps<TextFieldProps>;
    fieldType?: PrimitiveOverrideProps<TextFieldProps>;
    options?: PrimitiveOverrideProps<TextAreaFieldProps>;
    required?: PrimitiveOverrideProps<SwitchFieldProps>;
    order?: PrimitiveOverrideProps<TextFieldProps>;
    createdBy?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type CustomFormFieldUpdateFormProps = React.PropsWithChildren<{
    overrides?: CustomFormFieldUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    customFormField?: any;
    onSubmit?: (fields: CustomFormFieldUpdateFormInputValues) => CustomFormFieldUpdateFormInputValues;
    onSuccess?: (fields: CustomFormFieldUpdateFormInputValues) => void;
    onError?: (fields: CustomFormFieldUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: CustomFormFieldUpdateFormInputValues) => CustomFormFieldUpdateFormInputValues;
    onValidate?: CustomFormFieldUpdateFormValidationValues;
} & React.CSSProperties>;
export default function CustomFormFieldUpdateForm(props: CustomFormFieldUpdateFormProps): React.ReactElement;
