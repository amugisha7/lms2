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
export declare type UserNotificationCreateFormInputValues = {
    eventType?: string;
    name?: string;
    description?: string;
    reference?: string;
    message?: string;
    status?: string;
};
export declare type UserNotificationCreateFormValidationValues = {
    eventType?: ValidationFunction<string>;
    name?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    reference?: ValidationFunction<string>;
    message?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type UserNotificationCreateFormOverridesProps = {
    UserNotificationCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    eventType?: PrimitiveOverrideProps<TextFieldProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    reference?: PrimitiveOverrideProps<TextFieldProps>;
    message?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type UserNotificationCreateFormProps = React.PropsWithChildren<{
    overrides?: UserNotificationCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: UserNotificationCreateFormInputValues) => UserNotificationCreateFormInputValues;
    onSuccess?: (fields: UserNotificationCreateFormInputValues) => void;
    onError?: (fields: UserNotificationCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: UserNotificationCreateFormInputValues) => UserNotificationCreateFormInputValues;
    onValidate?: UserNotificationCreateFormValidationValues;
} & React.CSSProperties>;
export default function UserNotificationCreateForm(props: UserNotificationCreateFormProps): React.ReactElement;
