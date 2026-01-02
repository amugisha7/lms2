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
export declare type ChartOfAccountsUpdateFormInputValues = {
    code?: string;
    name?: string;
    type?: string;
    subtype?: string;
    balance?: number;
    customChartOfAccountsDetails?: string;
};
export declare type ChartOfAccountsUpdateFormValidationValues = {
    code?: ValidationFunction<string>;
    name?: ValidationFunction<string>;
    type?: ValidationFunction<string>;
    subtype?: ValidationFunction<string>;
    balance?: ValidationFunction<number>;
    customChartOfAccountsDetails?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ChartOfAccountsUpdateFormOverridesProps = {
    ChartOfAccountsUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    code?: PrimitiveOverrideProps<TextFieldProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    type?: PrimitiveOverrideProps<TextFieldProps>;
    subtype?: PrimitiveOverrideProps<TextFieldProps>;
    balance?: PrimitiveOverrideProps<TextFieldProps>;
    customChartOfAccountsDetails?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type ChartOfAccountsUpdateFormProps = React.PropsWithChildren<{
    overrides?: ChartOfAccountsUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    chartOfAccounts?: any;
    onSubmit?: (fields: ChartOfAccountsUpdateFormInputValues) => ChartOfAccountsUpdateFormInputValues;
    onSuccess?: (fields: ChartOfAccountsUpdateFormInputValues) => void;
    onError?: (fields: ChartOfAccountsUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ChartOfAccountsUpdateFormInputValues) => ChartOfAccountsUpdateFormInputValues;
    onValidate?: ChartOfAccountsUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ChartOfAccountsUpdateForm(props: ChartOfAccountsUpdateFormProps): React.ReactElement;
