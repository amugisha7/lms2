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
export declare type ShareAccountUpdateFormInputValues = {
    numberOfShares?: number;
    shareValue?: number;
    totalValue?: number;
    customShareAccountDetails?: string;
};
export declare type ShareAccountUpdateFormValidationValues = {
    numberOfShares?: ValidationFunction<number>;
    shareValue?: ValidationFunction<number>;
    totalValue?: ValidationFunction<number>;
    customShareAccountDetails?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ShareAccountUpdateFormOverridesProps = {
    ShareAccountUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    numberOfShares?: PrimitiveOverrideProps<TextFieldProps>;
    shareValue?: PrimitiveOverrideProps<TextFieldProps>;
    totalValue?: PrimitiveOverrideProps<TextFieldProps>;
    customShareAccountDetails?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type ShareAccountUpdateFormProps = React.PropsWithChildren<{
    overrides?: ShareAccountUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    shareAccount?: any;
    onSubmit?: (fields: ShareAccountUpdateFormInputValues) => ShareAccountUpdateFormInputValues;
    onSuccess?: (fields: ShareAccountUpdateFormInputValues) => void;
    onError?: (fields: ShareAccountUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ShareAccountUpdateFormInputValues) => ShareAccountUpdateFormInputValues;
    onValidate?: ShareAccountUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ShareAccountUpdateForm(props: ShareAccountUpdateFormProps): React.ReactElement;
