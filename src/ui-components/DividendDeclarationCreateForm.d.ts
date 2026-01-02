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
export declare type DividendDeclarationCreateFormInputValues = {
    fiscalYear?: number;
    distributableSurplus?: number;
    dividendRate?: number;
    interestRebateRate?: number;
    status?: string;
    customDividendDeclarationDetails?: string;
};
export declare type DividendDeclarationCreateFormValidationValues = {
    fiscalYear?: ValidationFunction<number>;
    distributableSurplus?: ValidationFunction<number>;
    dividendRate?: ValidationFunction<number>;
    interestRebateRate?: ValidationFunction<number>;
    status?: ValidationFunction<string>;
    customDividendDeclarationDetails?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type DividendDeclarationCreateFormOverridesProps = {
    DividendDeclarationCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    fiscalYear?: PrimitiveOverrideProps<TextFieldProps>;
    distributableSurplus?: PrimitiveOverrideProps<TextFieldProps>;
    dividendRate?: PrimitiveOverrideProps<TextFieldProps>;
    interestRebateRate?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    customDividendDeclarationDetails?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type DividendDeclarationCreateFormProps = React.PropsWithChildren<{
    overrides?: DividendDeclarationCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: DividendDeclarationCreateFormInputValues) => DividendDeclarationCreateFormInputValues;
    onSuccess?: (fields: DividendDeclarationCreateFormInputValues) => void;
    onError?: (fields: DividendDeclarationCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: DividendDeclarationCreateFormInputValues) => DividendDeclarationCreateFormInputValues;
    onValidate?: DividendDeclarationCreateFormValidationValues;
} & React.CSSProperties>;
export default function DividendDeclarationCreateForm(props: DividendDeclarationCreateFormProps): React.ReactElement;
