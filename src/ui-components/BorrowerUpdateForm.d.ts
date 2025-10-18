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
export declare type BorrowerUpdateFormInputValues = {
    firstname?: string;
    othername?: string;
    businessName?: string;
    typeOfBusiness?: string;
    uniqueIdNumber?: string;
    phoneNumber?: string;
    otherPhoneNumber?: string;
    email?: string;
    gender?: string;
    dateOfBirth?: string;
    nationality?: string;
    nationalIdPicture?: string;
    passportPicture?: string;
    address?: string;
    points?: number;
    borrowerOpeningBalance?: number;
    borrowerClosingBalance?: number;
    borrowerInterestRate?: number;
    city?: string;
    state?: string;
    title?: string;
    zipcode?: string;
    employmentStatus?: string;
    employerName?: string;
    creditScore?: string;
    additionalNote1?: string;
    additionalNote2?: string;
    borrowerDocuments?: string;
    customFieldsData?: string;
    status?: string;
};
export declare type BorrowerUpdateFormValidationValues = {
    firstname?: ValidationFunction<string>;
    othername?: ValidationFunction<string>;
    businessName?: ValidationFunction<string>;
    typeOfBusiness?: ValidationFunction<string>;
    uniqueIdNumber?: ValidationFunction<string>;
    phoneNumber?: ValidationFunction<string>;
    otherPhoneNumber?: ValidationFunction<string>;
    email?: ValidationFunction<string>;
    gender?: ValidationFunction<string>;
    dateOfBirth?: ValidationFunction<string>;
    nationality?: ValidationFunction<string>;
    nationalIdPicture?: ValidationFunction<string>;
    passportPicture?: ValidationFunction<string>;
    address?: ValidationFunction<string>;
    points?: ValidationFunction<number>;
    borrowerOpeningBalance?: ValidationFunction<number>;
    borrowerClosingBalance?: ValidationFunction<number>;
    borrowerInterestRate?: ValidationFunction<number>;
    city?: ValidationFunction<string>;
    state?: ValidationFunction<string>;
    title?: ValidationFunction<string>;
    zipcode?: ValidationFunction<string>;
    employmentStatus?: ValidationFunction<string>;
    employerName?: ValidationFunction<string>;
    creditScore?: ValidationFunction<string>;
    additionalNote1?: ValidationFunction<string>;
    additionalNote2?: ValidationFunction<string>;
    borrowerDocuments?: ValidationFunction<string>;
    customFieldsData?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type BorrowerUpdateFormOverridesProps = {
    BorrowerUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    firstname?: PrimitiveOverrideProps<TextFieldProps>;
    othername?: PrimitiveOverrideProps<TextFieldProps>;
    businessName?: PrimitiveOverrideProps<TextFieldProps>;
    typeOfBusiness?: PrimitiveOverrideProps<TextFieldProps>;
    uniqueIdNumber?: PrimitiveOverrideProps<TextFieldProps>;
    phoneNumber?: PrimitiveOverrideProps<TextFieldProps>;
    otherPhoneNumber?: PrimitiveOverrideProps<TextFieldProps>;
    email?: PrimitiveOverrideProps<TextFieldProps>;
    gender?: PrimitiveOverrideProps<TextFieldProps>;
    dateOfBirth?: PrimitiveOverrideProps<TextFieldProps>;
    nationality?: PrimitiveOverrideProps<TextFieldProps>;
    nationalIdPicture?: PrimitiveOverrideProps<TextFieldProps>;
    passportPicture?: PrimitiveOverrideProps<TextFieldProps>;
    address?: PrimitiveOverrideProps<TextFieldProps>;
    points?: PrimitiveOverrideProps<TextFieldProps>;
    borrowerOpeningBalance?: PrimitiveOverrideProps<TextFieldProps>;
    borrowerClosingBalance?: PrimitiveOverrideProps<TextFieldProps>;
    borrowerInterestRate?: PrimitiveOverrideProps<TextFieldProps>;
    city?: PrimitiveOverrideProps<TextFieldProps>;
    state?: PrimitiveOverrideProps<TextFieldProps>;
    title?: PrimitiveOverrideProps<TextFieldProps>;
    zipcode?: PrimitiveOverrideProps<TextFieldProps>;
    employmentStatus?: PrimitiveOverrideProps<TextFieldProps>;
    employerName?: PrimitiveOverrideProps<TextFieldProps>;
    creditScore?: PrimitiveOverrideProps<TextFieldProps>;
    additionalNote1?: PrimitiveOverrideProps<TextFieldProps>;
    additionalNote2?: PrimitiveOverrideProps<TextFieldProps>;
    borrowerDocuments?: PrimitiveOverrideProps<TextAreaFieldProps>;
    customFieldsData?: PrimitiveOverrideProps<TextAreaFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type BorrowerUpdateFormProps = React.PropsWithChildren<{
    overrides?: BorrowerUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    borrower?: any;
    onSubmit?: (fields: BorrowerUpdateFormInputValues) => BorrowerUpdateFormInputValues;
    onSuccess?: (fields: BorrowerUpdateFormInputValues) => void;
    onError?: (fields: BorrowerUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: BorrowerUpdateFormInputValues) => BorrowerUpdateFormInputValues;
    onValidate?: BorrowerUpdateFormValidationValues;
} & React.CSSProperties>;
export default function BorrowerUpdateForm(props: BorrowerUpdateFormProps): React.ReactElement;
