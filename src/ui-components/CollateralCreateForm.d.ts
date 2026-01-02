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
export declare type CollateralCreateFormInputValues = {
    name?: string;
    type?: string;
    description?: string;
    location?: string;
    value?: number;
    serialNumber?: string;
    registrationNumber?: string;
    insuranceDetails?: string;
    insuranceExpiryDate?: string;
    insuranceCompany?: string;
    storedAt?: string;
    customFieldsData?: string;
    status?: string;
    customCollateralDetails?: string;
};
export declare type CollateralCreateFormValidationValues = {
    name?: ValidationFunction<string>;
    type?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    location?: ValidationFunction<string>;
    value?: ValidationFunction<number>;
    serialNumber?: ValidationFunction<string>;
    registrationNumber?: ValidationFunction<string>;
    insuranceDetails?: ValidationFunction<string>;
    insuranceExpiryDate?: ValidationFunction<string>;
    insuranceCompany?: ValidationFunction<string>;
    storedAt?: ValidationFunction<string>;
    customFieldsData?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
    customCollateralDetails?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type CollateralCreateFormOverridesProps = {
    CollateralCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    type?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    location?: PrimitiveOverrideProps<TextFieldProps>;
    value?: PrimitiveOverrideProps<TextFieldProps>;
    serialNumber?: PrimitiveOverrideProps<TextFieldProps>;
    registrationNumber?: PrimitiveOverrideProps<TextFieldProps>;
    insuranceDetails?: PrimitiveOverrideProps<TextFieldProps>;
    insuranceExpiryDate?: PrimitiveOverrideProps<TextFieldProps>;
    insuranceCompany?: PrimitiveOverrideProps<TextFieldProps>;
    storedAt?: PrimitiveOverrideProps<TextFieldProps>;
    customFieldsData?: PrimitiveOverrideProps<TextAreaFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    customCollateralDetails?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type CollateralCreateFormProps = React.PropsWithChildren<{
    overrides?: CollateralCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: CollateralCreateFormInputValues) => CollateralCreateFormInputValues;
    onSuccess?: (fields: CollateralCreateFormInputValues) => void;
    onError?: (fields: CollateralCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: CollateralCreateFormInputValues) => CollateralCreateFormInputValues;
    onValidate?: CollateralCreateFormValidationValues;
} & React.CSSProperties>;
export default function CollateralCreateForm(props: CollateralCreateFormProps): React.ReactElement;
