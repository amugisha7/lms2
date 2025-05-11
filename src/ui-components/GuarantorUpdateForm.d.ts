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
export declare type GuarantorUpdateFormInputValues = {
    name?: string;
    relationship?: string;
    phoneNumber?: string;
    email?: string;
    address?: string;
};
export declare type GuarantorUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    relationship?: ValidationFunction<string>;
    phoneNumber?: ValidationFunction<string>;
    email?: ValidationFunction<string>;
    address?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type GuarantorUpdateFormOverridesProps = {
    GuarantorUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    relationship?: PrimitiveOverrideProps<TextFieldProps>;
    phoneNumber?: PrimitiveOverrideProps<TextFieldProps>;
    email?: PrimitiveOverrideProps<TextFieldProps>;
    address?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type GuarantorUpdateFormProps = React.PropsWithChildren<{
    overrides?: GuarantorUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    guarantor?: any;
    onSubmit?: (fields: GuarantorUpdateFormInputValues) => GuarantorUpdateFormInputValues;
    onSuccess?: (fields: GuarantorUpdateFormInputValues) => void;
    onError?: (fields: GuarantorUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: GuarantorUpdateFormInputValues) => GuarantorUpdateFormInputValues;
    onValidate?: GuarantorUpdateFormValidationValues;
} & React.CSSProperties>;
export default function GuarantorUpdateForm(props: GuarantorUpdateFormProps): React.ReactElement;
