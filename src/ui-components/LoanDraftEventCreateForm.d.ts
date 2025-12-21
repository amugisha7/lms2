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
export declare type LoanDraftEventCreateFormInputValues = {
    loanDraftID?: string;
    eventAt?: string;
    eventType?: string;
    actorEmployeeID?: string;
    summary?: string;
    payload?: string;
};
export declare type LoanDraftEventCreateFormValidationValues = {
    loanDraftID?: ValidationFunction<string>;
    eventAt?: ValidationFunction<string>;
    eventType?: ValidationFunction<string>;
    actorEmployeeID?: ValidationFunction<string>;
    summary?: ValidationFunction<string>;
    payload?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type LoanDraftEventCreateFormOverridesProps = {
    LoanDraftEventCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    loanDraftID?: PrimitiveOverrideProps<TextFieldProps>;
    eventAt?: PrimitiveOverrideProps<TextFieldProps>;
    eventType?: PrimitiveOverrideProps<TextFieldProps>;
    actorEmployeeID?: PrimitiveOverrideProps<TextFieldProps>;
    summary?: PrimitiveOverrideProps<TextFieldProps>;
    payload?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type LoanDraftEventCreateFormProps = React.PropsWithChildren<{
    overrides?: LoanDraftEventCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: LoanDraftEventCreateFormInputValues) => LoanDraftEventCreateFormInputValues;
    onSuccess?: (fields: LoanDraftEventCreateFormInputValues) => void;
    onError?: (fields: LoanDraftEventCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: LoanDraftEventCreateFormInputValues) => LoanDraftEventCreateFormInputValues;
    onValidate?: LoanDraftEventCreateFormValidationValues;
} & React.CSSProperties>;
export default function LoanDraftEventCreateForm(props: LoanDraftEventCreateFormProps): React.ReactElement;
