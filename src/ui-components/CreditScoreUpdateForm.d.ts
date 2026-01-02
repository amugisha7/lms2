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
export declare type CreditScoreUpdateFormInputValues = {
    name?: string;
    description?: string;
    score?: number;
    scoreDate?: string;
    scoreSource?: string;
    scoreStatus?: string;
    status?: string;
    customCreditScoreDetails?: string;
};
export declare type CreditScoreUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    score?: ValidationFunction<number>;
    scoreDate?: ValidationFunction<string>;
    scoreSource?: ValidationFunction<string>;
    scoreStatus?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
    customCreditScoreDetails?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type CreditScoreUpdateFormOverridesProps = {
    CreditScoreUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    score?: PrimitiveOverrideProps<TextFieldProps>;
    scoreDate?: PrimitiveOverrideProps<TextFieldProps>;
    scoreSource?: PrimitiveOverrideProps<TextFieldProps>;
    scoreStatus?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    customCreditScoreDetails?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type CreditScoreUpdateFormProps = React.PropsWithChildren<{
    overrides?: CreditScoreUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    creditScore?: any;
    onSubmit?: (fields: CreditScoreUpdateFormInputValues) => CreditScoreUpdateFormInputValues;
    onSuccess?: (fields: CreditScoreUpdateFormInputValues) => void;
    onError?: (fields: CreditScoreUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: CreditScoreUpdateFormInputValues) => CreditScoreUpdateFormInputValues;
    onValidate?: CreditScoreUpdateFormValidationValues;
} & React.CSSProperties>;
export default function CreditScoreUpdateForm(props: CreditScoreUpdateFormProps): React.ReactElement;
