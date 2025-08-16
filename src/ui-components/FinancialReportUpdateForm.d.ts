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
export declare type FinancialReportUpdateFormInputValues = {
    reportName?: string;
    reportType?: string;
    reportDate?: string;
    startDate?: string;
    endDate?: string;
    reportData?: string;
    status?: string;
};
export declare type FinancialReportUpdateFormValidationValues = {
    reportName?: ValidationFunction<string>;
    reportType?: ValidationFunction<string>;
    reportDate?: ValidationFunction<string>;
    startDate?: ValidationFunction<string>;
    endDate?: ValidationFunction<string>;
    reportData?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type FinancialReportUpdateFormOverridesProps = {
    FinancialReportUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    reportName?: PrimitiveOverrideProps<TextFieldProps>;
    reportType?: PrimitiveOverrideProps<TextFieldProps>;
    reportDate?: PrimitiveOverrideProps<TextFieldProps>;
    startDate?: PrimitiveOverrideProps<TextFieldProps>;
    endDate?: PrimitiveOverrideProps<TextFieldProps>;
    reportData?: PrimitiveOverrideProps<TextAreaFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type FinancialReportUpdateFormProps = React.PropsWithChildren<{
    overrides?: FinancialReportUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    financialReport?: any;
    onSubmit?: (fields: FinancialReportUpdateFormInputValues) => FinancialReportUpdateFormInputValues;
    onSuccess?: (fields: FinancialReportUpdateFormInputValues) => void;
    onError?: (fields: FinancialReportUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: FinancialReportUpdateFormInputValues) => FinancialReportUpdateFormInputValues;
    onValidate?: FinancialReportUpdateFormValidationValues;
} & React.CSSProperties>;
export default function FinancialReportUpdateForm(props: FinancialReportUpdateFormProps): React.ReactElement;
