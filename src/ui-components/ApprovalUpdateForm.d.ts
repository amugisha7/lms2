/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SelectFieldProps, TextAreaFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type ApprovalUpdateFormInputValues = {
    approvalType?: string;
    recordID?: string;
    approvalDate?: string;
    status?: string;
    notes?: string;
    customApprovalDetails?: string;
};
export declare type ApprovalUpdateFormValidationValues = {
    approvalType?: ValidationFunction<string>;
    recordID?: ValidationFunction<string>;
    approvalDate?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
    notes?: ValidationFunction<string>;
    customApprovalDetails?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ApprovalUpdateFormOverridesProps = {
    ApprovalUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    approvalType?: PrimitiveOverrideProps<SelectFieldProps>;
    recordID?: PrimitiveOverrideProps<TextFieldProps>;
    approvalDate?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    notes?: PrimitiveOverrideProps<TextFieldProps>;
    customApprovalDetails?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type ApprovalUpdateFormProps = React.PropsWithChildren<{
    overrides?: ApprovalUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    approval?: any;
    onSubmit?: (fields: ApprovalUpdateFormInputValues) => ApprovalUpdateFormInputValues;
    onSuccess?: (fields: ApprovalUpdateFormInputValues) => void;
    onError?: (fields: ApprovalUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ApprovalUpdateFormInputValues) => ApprovalUpdateFormInputValues;
    onValidate?: ApprovalUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ApprovalUpdateForm(props: ApprovalUpdateFormProps): React.ReactElement;
