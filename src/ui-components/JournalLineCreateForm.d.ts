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
export declare type JournalLineCreateFormInputValues = {
    debit?: number;
    credit?: number;
    description?: string;
    customJournalLineDetails?: string;
};
export declare type JournalLineCreateFormValidationValues = {
    debit?: ValidationFunction<number>;
    credit?: ValidationFunction<number>;
    description?: ValidationFunction<string>;
    customJournalLineDetails?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type JournalLineCreateFormOverridesProps = {
    JournalLineCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    debit?: PrimitiveOverrideProps<TextFieldProps>;
    credit?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    customJournalLineDetails?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type JournalLineCreateFormProps = React.PropsWithChildren<{
    overrides?: JournalLineCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: JournalLineCreateFormInputValues) => JournalLineCreateFormInputValues;
    onSuccess?: (fields: JournalLineCreateFormInputValues) => void;
    onError?: (fields: JournalLineCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: JournalLineCreateFormInputValues) => JournalLineCreateFormInputValues;
    onValidate?: JournalLineCreateFormValidationValues;
} & React.CSSProperties>;
export default function JournalLineCreateForm(props: JournalLineCreateFormProps): React.ReactElement;
