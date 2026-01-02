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
export declare type GroupCreateFormInputValues = {
    name?: string;
    groupNumber?: string;
    formationDate?: string;
    meetingDay?: string;
    meetingFrequency?: string;
    chairpersonID?: string;
    secretaryID?: string;
    viceChairpersonID?: string;
    treasurerID?: string;
    status?: string;
    customGroupDetails?: string;
};
export declare type GroupCreateFormValidationValues = {
    name?: ValidationFunction<string>;
    groupNumber?: ValidationFunction<string>;
    formationDate?: ValidationFunction<string>;
    meetingDay?: ValidationFunction<string>;
    meetingFrequency?: ValidationFunction<string>;
    chairpersonID?: ValidationFunction<string>;
    secretaryID?: ValidationFunction<string>;
    viceChairpersonID?: ValidationFunction<string>;
    treasurerID?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
    customGroupDetails?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type GroupCreateFormOverridesProps = {
    GroupCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    groupNumber?: PrimitiveOverrideProps<TextFieldProps>;
    formationDate?: PrimitiveOverrideProps<TextFieldProps>;
    meetingDay?: PrimitiveOverrideProps<TextFieldProps>;
    meetingFrequency?: PrimitiveOverrideProps<TextFieldProps>;
    chairpersonID?: PrimitiveOverrideProps<TextFieldProps>;
    secretaryID?: PrimitiveOverrideProps<TextFieldProps>;
    viceChairpersonID?: PrimitiveOverrideProps<TextFieldProps>;
    treasurerID?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    customGroupDetails?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type GroupCreateFormProps = React.PropsWithChildren<{
    overrides?: GroupCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: GroupCreateFormInputValues) => GroupCreateFormInputValues;
    onSuccess?: (fields: GroupCreateFormInputValues) => void;
    onError?: (fields: GroupCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: GroupCreateFormInputValues) => GroupCreateFormInputValues;
    onValidate?: GroupCreateFormValidationValues;
} & React.CSSProperties>;
export default function GroupCreateForm(props: GroupCreateFormProps): React.ReactElement;
