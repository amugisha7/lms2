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
export declare type JournalLineUpdateFormInputValues = {
    debit?: number;
    credit?: number;
    description?: string;
    customJournalLineDetails?: string;
};
export declare type JournalLineUpdateFormValidationValues = {
    debit?: ValidationFunction<number>;
    credit?: ValidationFunction<number>;
    description?: ValidationFunction<string>;
    customJournalLineDetails?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type JournalLineUpdateFormOverridesProps = {
    JournalLineUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    debit?: PrimitiveOverrideProps<TextFieldProps>;
    credit?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    customJournalLineDetails?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type JournalLineUpdateFormProps = React.PropsWithChildren<{
    overrides?: JournalLineUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    journalLine?: any;
    onSubmit?: (fields: JournalLineUpdateFormInputValues) => JournalLineUpdateFormInputValues;
    onSuccess?: (fields: JournalLineUpdateFormInputValues) => void;
    onError?: (fields: JournalLineUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: JournalLineUpdateFormInputValues) => JournalLineUpdateFormInputValues;
    onValidate?: JournalLineUpdateFormValidationValues;
} & React.CSSProperties>;
export default function JournalLineUpdateForm(props: JournalLineUpdateFormProps): React.ReactElement;
