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
export declare type PenaltyCreateFormInputValues = {
    amount?: number;
    penaltyName?: string;
    penaltyCategory?: string;
    penaltyCalculationMethod?: string;
    penaltyRate?: number;
    penaltyDate?: string;
    penaltyStatus?: string;
    notes?: string;
    penaltyType?: string;
    penaltyDescription?: string;
    penaltyAttribute1?: string;
    penaltyAttribute2?: string;
    status?: string;
};
export declare type PenaltyCreateFormValidationValues = {
    amount?: ValidationFunction<number>;
    penaltyName?: ValidationFunction<string>;
    penaltyCategory?: ValidationFunction<string>;
    penaltyCalculationMethod?: ValidationFunction<string>;
    penaltyRate?: ValidationFunction<number>;
    penaltyDate?: ValidationFunction<string>;
    penaltyStatus?: ValidationFunction<string>;
    notes?: ValidationFunction<string>;
    penaltyType?: ValidationFunction<string>;
    penaltyDescription?: ValidationFunction<string>;
    penaltyAttribute1?: ValidationFunction<string>;
    penaltyAttribute2?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type PenaltyCreateFormOverridesProps = {
    PenaltyCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    amount?: PrimitiveOverrideProps<TextFieldProps>;
    penaltyName?: PrimitiveOverrideProps<TextFieldProps>;
    penaltyCategory?: PrimitiveOverrideProps<TextFieldProps>;
    penaltyCalculationMethod?: PrimitiveOverrideProps<TextFieldProps>;
    penaltyRate?: PrimitiveOverrideProps<TextFieldProps>;
    penaltyDate?: PrimitiveOverrideProps<TextFieldProps>;
    penaltyStatus?: PrimitiveOverrideProps<TextFieldProps>;
    notes?: PrimitiveOverrideProps<TextFieldProps>;
    penaltyType?: PrimitiveOverrideProps<TextFieldProps>;
    penaltyDescription?: PrimitiveOverrideProps<TextFieldProps>;
    penaltyAttribute1?: PrimitiveOverrideProps<TextFieldProps>;
    penaltyAttribute2?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type PenaltyCreateFormProps = React.PropsWithChildren<{
    overrides?: PenaltyCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: PenaltyCreateFormInputValues) => PenaltyCreateFormInputValues;
    onSuccess?: (fields: PenaltyCreateFormInputValues) => void;
    onError?: (fields: PenaltyCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: PenaltyCreateFormInputValues) => PenaltyCreateFormInputValues;
    onValidate?: PenaltyCreateFormValidationValues;
} & React.CSSProperties>;
export default function PenaltyCreateForm(props: PenaltyCreateFormProps): React.ReactElement;
