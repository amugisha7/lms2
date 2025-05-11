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
export declare type CreditScoreCreateFormInputValues = {
    name?: string;
    description?: string;
    score?: number;
    scoreDate?: string;
    scoreSource?: string;
    scoreStatus?: string;
};
export declare type CreditScoreCreateFormValidationValues = {
    name?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    score?: ValidationFunction<number>;
    scoreDate?: ValidationFunction<string>;
    scoreSource?: ValidationFunction<string>;
    scoreStatus?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type CreditScoreCreateFormOverridesProps = {
    CreditScoreCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    score?: PrimitiveOverrideProps<TextFieldProps>;
    scoreDate?: PrimitiveOverrideProps<TextFieldProps>;
    scoreSource?: PrimitiveOverrideProps<TextFieldProps>;
    scoreStatus?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type CreditScoreCreateFormProps = React.PropsWithChildren<{
    overrides?: CreditScoreCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: CreditScoreCreateFormInputValues) => CreditScoreCreateFormInputValues;
    onSuccess?: (fields: CreditScoreCreateFormInputValues) => void;
    onError?: (fields: CreditScoreCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: CreditScoreCreateFormInputValues) => CreditScoreCreateFormInputValues;
    onValidate?: CreditScoreCreateFormValidationValues;
} & React.CSSProperties>;
export default function CreditScoreCreateForm(props: CreditScoreCreateFormProps): React.ReactElement;
