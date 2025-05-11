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
export declare type FinancialReportCreateFormInputValues = {
    reportName?: string;
    reportType?: string;
    reportDate?: string;
    startDate?: string;
    endDate?: string;
    reportData?: string;
};
export declare type FinancialReportCreateFormValidationValues = {
    reportName?: ValidationFunction<string>;
    reportType?: ValidationFunction<string>;
    reportDate?: ValidationFunction<string>;
    startDate?: ValidationFunction<string>;
    endDate?: ValidationFunction<string>;
    reportData?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type FinancialReportCreateFormOverridesProps = {
    FinancialReportCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    reportName?: PrimitiveOverrideProps<TextFieldProps>;
    reportType?: PrimitiveOverrideProps<TextFieldProps>;
    reportDate?: PrimitiveOverrideProps<TextFieldProps>;
    startDate?: PrimitiveOverrideProps<TextFieldProps>;
    endDate?: PrimitiveOverrideProps<TextFieldProps>;
    reportData?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type FinancialReportCreateFormProps = React.PropsWithChildren<{
    overrides?: FinancialReportCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: FinancialReportCreateFormInputValues) => FinancialReportCreateFormInputValues;
    onSuccess?: (fields: FinancialReportCreateFormInputValues) => void;
    onError?: (fields: FinancialReportCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: FinancialReportCreateFormInputValues) => FinancialReportCreateFormInputValues;
    onValidate?: FinancialReportCreateFormValidationValues;
} & React.CSSProperties>;
export default function FinancialReportCreateForm(props: FinancialReportCreateFormProps): React.ReactElement;
