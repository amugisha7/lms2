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
export declare type JournalEntryUpdateFormInputValues = {
    date?: string;
    description?: string;
    reference?: string;
    status?: string;
    relatedLoanID?: string;
    relatedPaymentID?: string;
    relatedExpenseID?: string;
    customJournalEntryDetails?: string;
};
export declare type JournalEntryUpdateFormValidationValues = {
    date?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    reference?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
    relatedLoanID?: ValidationFunction<string>;
    relatedPaymentID?: ValidationFunction<string>;
    relatedExpenseID?: ValidationFunction<string>;
    customJournalEntryDetails?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type JournalEntryUpdateFormOverridesProps = {
    JournalEntryUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    date?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    reference?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    relatedLoanID?: PrimitiveOverrideProps<TextFieldProps>;
    relatedPaymentID?: PrimitiveOverrideProps<TextFieldProps>;
    relatedExpenseID?: PrimitiveOverrideProps<TextFieldProps>;
    customJournalEntryDetails?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type JournalEntryUpdateFormProps = React.PropsWithChildren<{
    overrides?: JournalEntryUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    journalEntry?: any;
    onSubmit?: (fields: JournalEntryUpdateFormInputValues) => JournalEntryUpdateFormInputValues;
    onSuccess?: (fields: JournalEntryUpdateFormInputValues) => void;
    onError?: (fields: JournalEntryUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: JournalEntryUpdateFormInputValues) => JournalEntryUpdateFormInputValues;
    onValidate?: JournalEntryUpdateFormValidationValues;
} & React.CSSProperties>;
export default function JournalEntryUpdateForm(props: JournalEntryUpdateFormProps): React.ReactElement;
