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
export declare type LoanDraftEventUpdateFormInputValues = {
    loanDraftID?: string;
    eventAt?: string;
    eventType?: string;
    actorEmployeeID?: string;
    summary?: string;
    payload?: string;
};
export declare type LoanDraftEventUpdateFormValidationValues = {
    loanDraftID?: ValidationFunction<string>;
    eventAt?: ValidationFunction<string>;
    eventType?: ValidationFunction<string>;
    actorEmployeeID?: ValidationFunction<string>;
    summary?: ValidationFunction<string>;
    payload?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type LoanDraftEventUpdateFormOverridesProps = {
    LoanDraftEventUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    loanDraftID?: PrimitiveOverrideProps<TextFieldProps>;
    eventAt?: PrimitiveOverrideProps<TextFieldProps>;
    eventType?: PrimitiveOverrideProps<TextFieldProps>;
    actorEmployeeID?: PrimitiveOverrideProps<TextFieldProps>;
    summary?: PrimitiveOverrideProps<TextFieldProps>;
    payload?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type LoanDraftEventUpdateFormProps = React.PropsWithChildren<{
    overrides?: LoanDraftEventUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    loanDraftEvent?: any;
    onSubmit?: (fields: LoanDraftEventUpdateFormInputValues) => LoanDraftEventUpdateFormInputValues;
    onSuccess?: (fields: LoanDraftEventUpdateFormInputValues) => void;
    onError?: (fields: LoanDraftEventUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: LoanDraftEventUpdateFormInputValues) => LoanDraftEventUpdateFormInputValues;
    onValidate?: LoanDraftEventUpdateFormValidationValues;
} & React.CSSProperties>;
export default function LoanDraftEventUpdateForm(props: LoanDraftEventUpdateFormProps): React.ReactElement;
