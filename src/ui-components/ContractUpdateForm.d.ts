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
export declare type ContractUpdateFormInputValues = {
    contractNumber?: string;
    contractType?: string;
    contractDate?: string;
    contractStatus?: string;
    contractRecord?: string;
};
export declare type ContractUpdateFormValidationValues = {
    contractNumber?: ValidationFunction<string>;
    contractType?: ValidationFunction<string>;
    contractDate?: ValidationFunction<string>;
    contractStatus?: ValidationFunction<string>;
    contractRecord?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ContractUpdateFormOverridesProps = {
    ContractUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    contractNumber?: PrimitiveOverrideProps<TextFieldProps>;
    contractType?: PrimitiveOverrideProps<TextFieldProps>;
    contractDate?: PrimitiveOverrideProps<TextFieldProps>;
    contractStatus?: PrimitiveOverrideProps<TextFieldProps>;
    contractRecord?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type ContractUpdateFormProps = React.PropsWithChildren<{
    overrides?: ContractUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    contract?: any;
    onSubmit?: (fields: ContractUpdateFormInputValues) => ContractUpdateFormInputValues;
    onSuccess?: (fields: ContractUpdateFormInputValues) => void;
    onError?: (fields: ContractUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ContractUpdateFormInputValues) => ContractUpdateFormInputValues;
    onValidate?: ContractUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ContractUpdateForm(props: ContractUpdateFormProps): React.ReactElement;
