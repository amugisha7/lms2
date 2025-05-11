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
export declare type EmployeeUpdateFormInputValues = {
    firstName?: string;
    lastName?: string;
    middleName?: string;
    dateOfBirth?: string;
    phoneNumber1?: string;
    phoneNumber2?: string;
    email?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    stateProvince?: string;
    postalCode?: string;
    nextOfKinName?: string;
    nextOfKinPhoneNumber?: string;
    nextOfKinEmail?: string;
    nextOfKinRelationship?: string;
    nextOfKinAddress?: string;
    nationalID?: string;
    passportNumber?: string;
    nationality?: string;
    status?: string;
    employmentType?: string;
    employmentStatus?: string;
    employmentStartDate?: string;
    employmentEndDate?: string;
    employmentPosition?: string;
    employmentDepartment?: string;
    employmentGrade?: string;
    employmentLocation?: string;
    grossSalary?: number;
    bankAccountNumber?: string;
    bankName?: string;
    bankBranchCode?: string;
    socialSecurityNumber?: string;
    taxIdentificationNumber?: string;
    taxExemptStatus?: string;
    relatedUserID?: string;
    relatedBorrowerID?: string;
};
export declare type EmployeeUpdateFormValidationValues = {
    firstName?: ValidationFunction<string>;
    lastName?: ValidationFunction<string>;
    middleName?: ValidationFunction<string>;
    dateOfBirth?: ValidationFunction<string>;
    phoneNumber1?: ValidationFunction<string>;
    phoneNumber2?: ValidationFunction<string>;
    email?: ValidationFunction<string>;
    addressLine1?: ValidationFunction<string>;
    addressLine2?: ValidationFunction<string>;
    city?: ValidationFunction<string>;
    stateProvince?: ValidationFunction<string>;
    postalCode?: ValidationFunction<string>;
    nextOfKinName?: ValidationFunction<string>;
    nextOfKinPhoneNumber?: ValidationFunction<string>;
    nextOfKinEmail?: ValidationFunction<string>;
    nextOfKinRelationship?: ValidationFunction<string>;
    nextOfKinAddress?: ValidationFunction<string>;
    nationalID?: ValidationFunction<string>;
    passportNumber?: ValidationFunction<string>;
    nationality?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
    employmentType?: ValidationFunction<string>;
    employmentStatus?: ValidationFunction<string>;
    employmentStartDate?: ValidationFunction<string>;
    employmentEndDate?: ValidationFunction<string>;
    employmentPosition?: ValidationFunction<string>;
    employmentDepartment?: ValidationFunction<string>;
    employmentGrade?: ValidationFunction<string>;
    employmentLocation?: ValidationFunction<string>;
    grossSalary?: ValidationFunction<number>;
    bankAccountNumber?: ValidationFunction<string>;
    bankName?: ValidationFunction<string>;
    bankBranchCode?: ValidationFunction<string>;
    socialSecurityNumber?: ValidationFunction<string>;
    taxIdentificationNumber?: ValidationFunction<string>;
    taxExemptStatus?: ValidationFunction<string>;
    relatedUserID?: ValidationFunction<string>;
    relatedBorrowerID?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type EmployeeUpdateFormOverridesProps = {
    EmployeeUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    firstName?: PrimitiveOverrideProps<TextFieldProps>;
    lastName?: PrimitiveOverrideProps<TextFieldProps>;
    middleName?: PrimitiveOverrideProps<TextFieldProps>;
    dateOfBirth?: PrimitiveOverrideProps<TextFieldProps>;
    phoneNumber1?: PrimitiveOverrideProps<TextFieldProps>;
    phoneNumber2?: PrimitiveOverrideProps<TextFieldProps>;
    email?: PrimitiveOverrideProps<TextFieldProps>;
    addressLine1?: PrimitiveOverrideProps<TextFieldProps>;
    addressLine2?: PrimitiveOverrideProps<TextFieldProps>;
    city?: PrimitiveOverrideProps<TextFieldProps>;
    stateProvince?: PrimitiveOverrideProps<TextFieldProps>;
    postalCode?: PrimitiveOverrideProps<TextFieldProps>;
    nextOfKinName?: PrimitiveOverrideProps<TextFieldProps>;
    nextOfKinPhoneNumber?: PrimitiveOverrideProps<TextFieldProps>;
    nextOfKinEmail?: PrimitiveOverrideProps<TextFieldProps>;
    nextOfKinRelationship?: PrimitiveOverrideProps<TextFieldProps>;
    nextOfKinAddress?: PrimitiveOverrideProps<TextFieldProps>;
    nationalID?: PrimitiveOverrideProps<TextFieldProps>;
    passportNumber?: PrimitiveOverrideProps<TextFieldProps>;
    nationality?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    employmentType?: PrimitiveOverrideProps<TextFieldProps>;
    employmentStatus?: PrimitiveOverrideProps<TextFieldProps>;
    employmentStartDate?: PrimitiveOverrideProps<TextFieldProps>;
    employmentEndDate?: PrimitiveOverrideProps<TextFieldProps>;
    employmentPosition?: PrimitiveOverrideProps<TextFieldProps>;
    employmentDepartment?: PrimitiveOverrideProps<TextFieldProps>;
    employmentGrade?: PrimitiveOverrideProps<TextFieldProps>;
    employmentLocation?: PrimitiveOverrideProps<TextFieldProps>;
    grossSalary?: PrimitiveOverrideProps<TextFieldProps>;
    bankAccountNumber?: PrimitiveOverrideProps<TextFieldProps>;
    bankName?: PrimitiveOverrideProps<TextFieldProps>;
    bankBranchCode?: PrimitiveOverrideProps<TextFieldProps>;
    socialSecurityNumber?: PrimitiveOverrideProps<TextFieldProps>;
    taxIdentificationNumber?: PrimitiveOverrideProps<TextFieldProps>;
    taxExemptStatus?: PrimitiveOverrideProps<TextFieldProps>;
    relatedUserID?: PrimitiveOverrideProps<TextFieldProps>;
    relatedBorrowerID?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type EmployeeUpdateFormProps = React.PropsWithChildren<{
    overrides?: EmployeeUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    employee?: any;
    onSubmit?: (fields: EmployeeUpdateFormInputValues) => EmployeeUpdateFormInputValues;
    onSuccess?: (fields: EmployeeUpdateFormInputValues) => void;
    onError?: (fields: EmployeeUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: EmployeeUpdateFormInputValues) => EmployeeUpdateFormInputValues;
    onValidate?: EmployeeUpdateFormValidationValues;
} & React.CSSProperties>;
export default function EmployeeUpdateForm(props: EmployeeUpdateFormProps): React.ReactElement;
