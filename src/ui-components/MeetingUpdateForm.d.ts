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
export declare type MeetingUpdateFormInputValues = {
    title?: string;
    date?: string;
    type?: string;
    status?: string;
    minutes?: string;
    attendanceRecord?: string;
    resolutionsRecord?: string;
    customMeetingDetails?: string;
};
export declare type MeetingUpdateFormValidationValues = {
    title?: ValidationFunction<string>;
    date?: ValidationFunction<string>;
    type?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
    minutes?: ValidationFunction<string>;
    attendanceRecord?: ValidationFunction<string>;
    resolutionsRecord?: ValidationFunction<string>;
    customMeetingDetails?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type MeetingUpdateFormOverridesProps = {
    MeetingUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    title?: PrimitiveOverrideProps<TextFieldProps>;
    date?: PrimitiveOverrideProps<TextFieldProps>;
    type?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    minutes?: PrimitiveOverrideProps<TextFieldProps>;
    attendanceRecord?: PrimitiveOverrideProps<TextAreaFieldProps>;
    resolutionsRecord?: PrimitiveOverrideProps<TextAreaFieldProps>;
    customMeetingDetails?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type MeetingUpdateFormProps = React.PropsWithChildren<{
    overrides?: MeetingUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    meeting?: any;
    onSubmit?: (fields: MeetingUpdateFormInputValues) => MeetingUpdateFormInputValues;
    onSuccess?: (fields: MeetingUpdateFormInputValues) => void;
    onError?: (fields: MeetingUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: MeetingUpdateFormInputValues) => MeetingUpdateFormInputValues;
    onValidate?: MeetingUpdateFormValidationValues;
} & React.CSSProperties>;
export default function MeetingUpdateForm(props: MeetingUpdateFormProps): React.ReactElement;
