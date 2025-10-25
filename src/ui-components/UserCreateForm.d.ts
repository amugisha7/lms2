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
export declare type UserCreateFormInputValues = {
    firstName?: string;
    lastName?: string;
    middleName?: string;
    dateOfBirth?: string;
    phoneNumber1?: string;
    phoneNumber2?: string;
    email?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    stateProvince?: string;
    postalCode?: string;
    nationalID?: string;
    passportNumber?: string;
    nationality?: string;
    status?: string;
    userType?: string;
    userPermissions?: string;
    description?: string;
    customFieldsData?: string;
    userDocuments?: string;
};
export declare type UserCreateFormValidationValues = {
    firstName?: ValidationFunction<string>;
    lastName?: ValidationFunction<string>;
    middleName?: ValidationFunction<string>;
    dateOfBirth?: ValidationFunction<string>;
    phoneNumber1?: ValidationFunction<string>;
    phoneNumber2?: ValidationFunction<string>;
    email?: ValidationFunction<string>;
    addressLine1?: ValidationFunction<string>;
    addressLine2?: ValidationFunction<string>;
    city?: ValidationFunction<string>;
    stateProvince?: ValidationFunction<string>;
    postalCode?: ValidationFunction<string>;
    nationalID?: ValidationFunction<string>;
    passportNumber?: ValidationFunction<string>;
    nationality?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
    userType?: ValidationFunction<string>;
    userPermissions?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    customFieldsData?: ValidationFunction<string>;
    userDocuments?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type UserCreateFormOverridesProps = {
    UserCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    firstName?: PrimitiveOverrideProps<TextFieldProps>;
    lastName?: PrimitiveOverrideProps<TextFieldProps>;
    middleName?: PrimitiveOverrideProps<TextFieldProps>;
    dateOfBirth?: PrimitiveOverrideProps<TextFieldProps>;
    phoneNumber1?: PrimitiveOverrideProps<TextFieldProps>;
    phoneNumber2?: PrimitiveOverrideProps<TextFieldProps>;
    email?: PrimitiveOverrideProps<TextFieldProps>;
    addressLine1?: PrimitiveOverrideProps<TextFieldProps>;
    addressLine2?: PrimitiveOverrideProps<TextFieldProps>;
    city?: PrimitiveOverrideProps<TextFieldProps>;
    stateProvince?: PrimitiveOverrideProps<TextFieldProps>;
    postalCode?: PrimitiveOverrideProps<TextFieldProps>;
    nationalID?: PrimitiveOverrideProps<TextFieldProps>;
    passportNumber?: PrimitiveOverrideProps<TextFieldProps>;
    nationality?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    userType?: PrimitiveOverrideProps<TextFieldProps>;
    userPermissions?: PrimitiveOverrideProps<TextAreaFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    customFieldsData?: PrimitiveOverrideProps<TextAreaFieldProps>;
    userDocuments?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type UserCreateFormProps = React.PropsWithChildren<{
    overrides?: UserCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: UserCreateFormInputValues) => UserCreateFormInputValues;
    onSuccess?: (fields: UserCreateFormInputValues) => void;
    onError?: (fields: UserCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: UserCreateFormInputValues) => UserCreateFormInputValues;
    onValidate?: UserCreateFormValidationValues;
} & React.CSSProperties>;
export default function UserCreateForm(props: UserCreateFormProps): React.ReactElement;
