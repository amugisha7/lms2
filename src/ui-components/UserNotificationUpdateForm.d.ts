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
export declare type UserNotificationUpdateFormInputValues = {
    eventType?: string;
    name?: string;
    description?: string;
    reference?: string;
    message?: string;
    status?: string;
    customUserNotificationDetails?: string;
};
export declare type UserNotificationUpdateFormValidationValues = {
    eventType?: ValidationFunction<string>;
    name?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    reference?: ValidationFunction<string>;
    message?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
    customUserNotificationDetails?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type UserNotificationUpdateFormOverridesProps = {
    UserNotificationUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    eventType?: PrimitiveOverrideProps<TextFieldProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    reference?: PrimitiveOverrideProps<TextFieldProps>;
    message?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    customUserNotificationDetails?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type UserNotificationUpdateFormProps = React.PropsWithChildren<{
    overrides?: UserNotificationUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    userNotification?: any;
    onSubmit?: (fields: UserNotificationUpdateFormInputValues) => UserNotificationUpdateFormInputValues;
    onSuccess?: (fields: UserNotificationUpdateFormInputValues) => void;
    onError?: (fields: UserNotificationUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: UserNotificationUpdateFormInputValues) => UserNotificationUpdateFormInputValues;
    onValidate?: UserNotificationUpdateFormValidationValues;
} & React.CSSProperties>;
export default function UserNotificationUpdateForm(props: UserNotificationUpdateFormProps): React.ReactElement;
