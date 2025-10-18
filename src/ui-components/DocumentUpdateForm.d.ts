/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type DocumentUpdateFormInputValues = {
    documentType?: string;
    documentName?: string;
    documentDescription?: string;
    serialNumber?: string;
    documentDate?: string;
    s3Key?: string;
    fileName?: string;
    contentType?: string;
    status?: string;
};
export declare type DocumentUpdateFormValidationValues = {
    documentType?: ValidationFunction<string>;
    documentName?: ValidationFunction<string>;
    documentDescription?: ValidationFunction<string>;
    serialNumber?: ValidationFunction<string>;
    documentDate?: ValidationFunction<string>;
    s3Key?: ValidationFunction<string>;
    fileName?: ValidationFunction<string>;
    contentType?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type DocumentUpdateFormOverridesProps = {
    DocumentUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    documentType?: PrimitiveOverrideProps<TextFieldProps>;
    documentName?: PrimitiveOverrideProps<TextFieldProps>;
    documentDescription?: PrimitiveOverrideProps<TextFieldProps>;
    serialNumber?: PrimitiveOverrideProps<TextFieldProps>;
    documentDate?: PrimitiveOverrideProps<TextFieldProps>;
    s3Key?: PrimitiveOverrideProps<TextFieldProps>;
    fileName?: PrimitiveOverrideProps<TextFieldProps>;
    contentType?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type DocumentUpdateFormProps = React.PropsWithChildren<{
    overrides?: DocumentUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    document?: any;
    onSubmit?: (fields: DocumentUpdateFormInputValues) => DocumentUpdateFormInputValues;
    onSuccess?: (fields: DocumentUpdateFormInputValues) => void;
    onError?: (fields: DocumentUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: DocumentUpdateFormInputValues) => DocumentUpdateFormInputValues;
    onValidate?: DocumentUpdateFormValidationValues;
} & React.CSSProperties>;
export default function DocumentUpdateForm(props: DocumentUpdateFormProps): React.ReactElement;
