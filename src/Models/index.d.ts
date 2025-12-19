import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection, AsyncItem } from "@aws-amplify/datastore";

export enum InterestCalculationMethod {
  SIMPLE = "SIMPLE",
  COMPOUND = "COMPOUND",
  FLAT = "FLAT"
}

export enum Frequency {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  BIWEEKLY = "BIWEEKLY",
  MONTHLY = "MONTHLY",
  QUARTERLY = "QUARTERLY",
  SEMIANNUALLY = "SEMIANNUALLY",
  ANNUALLY = "ANNUALLY"
}

export enum LoanStatus {
  DRAFT = "DRAFT",
  APPROVED = "APPROVED",
  ACTIVE = "ACTIVE",
  CLOSED = "CLOSED",
  WRITTEN_OFF = "WRITTEN_OFF",
  VOIDED = "VOIDED"
}

export enum LoanApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

export enum InstallmentStatus {
  PENDING = "PENDING",
  PARTIALLY_PAID = "PARTIALLY_PAID",
  PAID = "PAID",
  OVERDUE = "OVERDUE"
}

export enum DisbursementStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED"
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  REVERSED = "REVERSED",
  FAILED = "FAILED"
}

export enum LoanEventType {
  CREATED = "CREATED",
  APPROVED = "APPROVED",
  DISBURSED = "DISBURSED",
  PAYMENT_POSTED = "PAYMENT_POSTED",
  PAYMENT_REVERSED = "PAYMENT_REVERSED",
  STATUS_CHANGED = "STATUS_CHANGED",
  OTHER = "OTHER"
}



type EagerInstitution = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Institution, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly currencyCode?: string | null;
  readonly subscriptionTier?: string | null;
  readonly subscriptionStatus?: string | null;
  readonly trialEndDate?: string | null;
  readonly nextBillingDate?: string | null;
  readonly stripeCustomerID?: string | null;
  readonly stripeSubscriptionID?: string | null;
  readonly defaultDateFormat?: string | null;
  readonly defaultCurrencyFormat?: string | null;
  readonly defaultLanguage?: string | null;
  readonly regulatoryRegion?: string | null;
  readonly maxUsers?: number | null;
  readonly maxBranches?: number | null;
  readonly maxStaffPerBranch?: number | null;
  readonly saccoFeaturesEnabled: boolean;
  readonly staffManagementEnabled: boolean;
  readonly payrollEnabled: boolean;
  readonly collectionsModuleEnabled: boolean;
  readonly customWorkflowsEnabled: boolean;
  readonly advancedReportingEnabled: boolean;
  readonly apiIntegrationSettings?: string | null;
  readonly users?: (User | null)[] | null;
  readonly branches?: (Branch | null)[] | null;
  readonly loanProducts?: (LoanProduct | null)[] | null;
  readonly customFormFields?: (CustomFormField | null)[] | null;
  readonly loanFeesConfigs?: (LoanFeesConfig | null)[] | null;
  readonly accounts?: (Account | null)[] | null;
  readonly status?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyInstitution = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Institution, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly currencyCode?: string | null;
  readonly subscriptionTier?: string | null;
  readonly subscriptionStatus?: string | null;
  readonly trialEndDate?: string | null;
  readonly nextBillingDate?: string | null;
  readonly stripeCustomerID?: string | null;
  readonly stripeSubscriptionID?: string | null;
  readonly defaultDateFormat?: string | null;
  readonly defaultCurrencyFormat?: string | null;
  readonly defaultLanguage?: string | null;
  readonly regulatoryRegion?: string | null;
  readonly maxUsers?: number | null;
  readonly maxBranches?: number | null;
  readonly maxStaffPerBranch?: number | null;
  readonly saccoFeaturesEnabled: boolean;
  readonly staffManagementEnabled: boolean;
  readonly payrollEnabled: boolean;
  readonly collectionsModuleEnabled: boolean;
  readonly customWorkflowsEnabled: boolean;
  readonly advancedReportingEnabled: boolean;
  readonly apiIntegrationSettings?: string | null;
  readonly users: AsyncCollection<User>;
  readonly branches: AsyncCollection<Branch>;
  readonly loanProducts: AsyncCollection<LoanProduct>;
  readonly customFormFields: AsyncCollection<CustomFormField>;
  readonly loanFeesConfigs: AsyncCollection<LoanFeesConfig>;
  readonly accounts: AsyncCollection<Account>;
  readonly status?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Institution = LazyLoading extends LazyLoadingDisabled ? EagerInstitution : LazyInstitution

export declare const Institution: (new (init: ModelInit<Institution>) => Institution) & {
  copyOf(source: Institution, mutator: (draft: MutableModel<Institution>) => MutableModel<Institution> | void): Institution;
}

type EagerBranch = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Branch, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly branchCode?: string | null;
  readonly address?: string | null;
  readonly status?: string | null;
  readonly institution?: Institution | null;
  readonly users?: (User | null)[] | null;
  readonly borrowers?: (Borrower | null)[] | null;
  readonly employees?: (Employee | null)[] | null;
  readonly accounts?: (AccountBranch | null)[] | null;
  readonly documents?: (Document | null)[] | null;
  readonly loanProducts?: (BranchLoanProduct | null)[] | null;
  readonly payrolls?: (Payroll | null)[] | null;
  readonly financialReports?: (FinancialReport | null)[] | null;
  readonly customFormFields?: (CustomFormField | null)[] | null;
  readonly loans?: (Loan | null)[] | null;
  readonly loanFeesConfigs?: (BranchLoanFeesConfig | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly institutionBranchesId?: string | null;
}

type LazyBranch = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Branch, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly branchCode?: string | null;
  readonly address?: string | null;
  readonly status?: string | null;
  readonly institution: AsyncItem<Institution | undefined>;
  readonly users: AsyncCollection<User>;
  readonly borrowers: AsyncCollection<Borrower>;
  readonly employees: AsyncCollection<Employee>;
  readonly accounts: AsyncCollection<AccountBranch>;
  readonly documents: AsyncCollection<Document>;
  readonly loanProducts: AsyncCollection<BranchLoanProduct>;
  readonly payrolls: AsyncCollection<Payroll>;
  readonly financialReports: AsyncCollection<FinancialReport>;
  readonly customFormFields: AsyncCollection<CustomFormField>;
  readonly loans: AsyncCollection<Loan>;
  readonly loanFeesConfigs: AsyncCollection<BranchLoanFeesConfig>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly institutionBranchesId?: string | null;
}

export declare type Branch = LazyLoading extends LazyLoadingDisabled ? EagerBranch : LazyBranch

export declare const Branch: (new (init: ModelInit<Branch>) => Branch) & {
  copyOf(source: Branch, mutator: (draft: MutableModel<Branch>) => MutableModel<Branch> | void): Branch;
}

type EagerUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly firstName?: string | null;
  readonly lastName?: string | null;
  readonly middleName?: string | null;
  readonly dateOfBirth?: string | null;
  readonly phoneNumber1?: string | null;
  readonly phoneNumber2?: string | null;
  readonly email?: string | null;
  readonly addressLine1?: string | null;
  readonly addressLine2?: string | null;
  readonly city?: string | null;
  readonly stateProvince?: string | null;
  readonly postalCode?: string | null;
  readonly nationalID?: string | null;
  readonly passportNumber?: string | null;
  readonly nationality?: string | null;
  readonly status?: string | null;
  readonly userType?: string | null;
  readonly userPermissions?: string | null;
  readonly description?: string | null;
  readonly customFieldsData?: string | null;
  readonly userDocuments?: string | null;
  readonly institution?: Institution | null;
  readonly branch?: Branch | null;
  readonly userNotifications?: (UserNotification | null)[] | null;
  readonly sentMessages?: (Message | null)[] | null;
  readonly receivedMessages?: (Message | null)[] | null;
  readonly sentNotifications?: (Notification | null)[] | null;
  readonly receivedNotifications?: (Notification | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly institutionUsersId?: string | null;
  readonly branchUsersId?: string | null;
}

type LazyUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly firstName?: string | null;
  readonly lastName?: string | null;
  readonly middleName?: string | null;
  readonly dateOfBirth?: string | null;
  readonly phoneNumber1?: string | null;
  readonly phoneNumber2?: string | null;
  readonly email?: string | null;
  readonly addressLine1?: string | null;
  readonly addressLine2?: string | null;
  readonly city?: string | null;
  readonly stateProvince?: string | null;
  readonly postalCode?: string | null;
  readonly nationalID?: string | null;
  readonly passportNumber?: string | null;
  readonly nationality?: string | null;
  readonly status?: string | null;
  readonly userType?: string | null;
  readonly userPermissions?: string | null;
  readonly description?: string | null;
  readonly customFieldsData?: string | null;
  readonly userDocuments?: string | null;
  readonly institution: AsyncItem<Institution | undefined>;
  readonly branch: AsyncItem<Branch | undefined>;
  readonly userNotifications: AsyncCollection<UserNotification>;
  readonly sentMessages: AsyncCollection<Message>;
  readonly receivedMessages: AsyncCollection<Message>;
  readonly sentNotifications: AsyncCollection<Notification>;
  readonly receivedNotifications: AsyncCollection<Notification>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly institutionUsersId?: string | null;
  readonly branchUsersId?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}

type EagerEmployee = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Employee, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly firstName?: string | null;
  readonly lastName?: string | null;
  readonly middleName?: string | null;
  readonly dateOfBirth?: string | null;
  readonly phoneNumber1?: string | null;
  readonly phoneNumber2?: string | null;
  readonly email?: string | null;
  readonly title?: string | null;
  readonly addressLine1?: string | null;
  readonly addressLine2?: string | null;
  readonly city?: string | null;
  readonly stateProvince?: string | null;
  readonly postalCode?: string | null;
  readonly nextOfKinName?: string | null;
  readonly nextOfKinPhoneNumber?: string | null;
  readonly nextOfKinEmail?: string | null;
  readonly nextOfKinRelationship?: string | null;
  readonly nextOfKinAddress?: string | null;
  readonly nationalID?: string | null;
  readonly passportNumber?: string | null;
  readonly nationality?: string | null;
  readonly status?: string | null;
  readonly employmentType?: string | null;
  readonly employmentStatus?: string | null;
  readonly employmentStartDate?: string | null;
  readonly employmentEndDate?: string | null;
  readonly employmentPosition?: string | null;
  readonly employmentDepartment?: string | null;
  readonly employmentGrade?: string | null;
  readonly employmentLocation?: string | null;
  readonly grossSalary?: number | null;
  readonly bankAccountNumber?: string | null;
  readonly bankName?: string | null;
  readonly bankBranchCode?: string | null;
  readonly socialSecurityNumber?: string | null;
  readonly taxIdentificationNumber?: string | null;
  readonly taxExemptStatus?: string | null;
  readonly customFieldsData?: string | null;
  readonly branch?: Branch | null;
  readonly relatedUserID?: string | null;
  readonly relatedBorrowerID?: string | null;
  readonly payroll?: (PayrollEmployee | null)[] | null;
  readonly approvedLoans?: (LoanApprovedByEmployee | null)[] | null;
  readonly approvedExpenses?: (ExpenseApprovedByEmployee | null)[] | null;
  readonly approvedApplications?: (ApplicationApprovedByEmployee | null)[] | null;
  readonly approvedCreditScores?: (CreditScoreApprovedByEmployee | null)[] | null;
  readonly approvedMoneyTransactions?: (MoneyTransactionApprovedByEmployee | null)[] | null;
  readonly approvedPayments?: (PaymentApprovedByEmployee | null)[] | null;
  readonly borrowers?: (BorrowerLoanOfficer | null)[] | null;
  readonly supervisorID?: string | null;
  readonly supervisor?: Employee | null;
  readonly subordinates?: (Employee | null)[] | null;
  readonly creditScore?: (CreditScore | null)[] | null;
  readonly applications?: (Application | null)[] | null;
  readonly documents?: (Document | null)[] | null;
  readonly expenses?: (Expense | null)[] | null;
  readonly payments?: (Payment | null)[] | null;
  readonly loans?: (Loan | null)[] | null;
  readonly moneyTransactions?: (MoneyTransaction | null)[] | null;
  readonly accounts?: (Account | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly branchEmployeesId?: string | null;
}

type LazyEmployee = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Employee, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly firstName?: string | null;
  readonly lastName?: string | null;
  readonly middleName?: string | null;
  readonly dateOfBirth?: string | null;
  readonly phoneNumber1?: string | null;
  readonly phoneNumber2?: string | null;
  readonly email?: string | null;
  readonly title?: string | null;
  readonly addressLine1?: string | null;
  readonly addressLine2?: string | null;
  readonly city?: string | null;
  readonly stateProvince?: string | null;
  readonly postalCode?: string | null;
  readonly nextOfKinName?: string | null;
  readonly nextOfKinPhoneNumber?: string | null;
  readonly nextOfKinEmail?: string | null;
  readonly nextOfKinRelationship?: string | null;
  readonly nextOfKinAddress?: string | null;
  readonly nationalID?: string | null;
  readonly passportNumber?: string | null;
  readonly nationality?: string | null;
  readonly status?: string | null;
  readonly employmentType?: string | null;
  readonly employmentStatus?: string | null;
  readonly employmentStartDate?: string | null;
  readonly employmentEndDate?: string | null;
  readonly employmentPosition?: string | null;
  readonly employmentDepartment?: string | null;
  readonly employmentGrade?: string | null;
  readonly employmentLocation?: string | null;
  readonly grossSalary?: number | null;
  readonly bankAccountNumber?: string | null;
  readonly bankName?: string | null;
  readonly bankBranchCode?: string | null;
  readonly socialSecurityNumber?: string | null;
  readonly taxIdentificationNumber?: string | null;
  readonly taxExemptStatus?: string | null;
  readonly customFieldsData?: string | null;
  readonly branch: AsyncItem<Branch | undefined>;
  readonly relatedUserID?: string | null;
  readonly relatedBorrowerID?: string | null;
  readonly payroll: AsyncCollection<PayrollEmployee>;
  readonly approvedLoans: AsyncCollection<LoanApprovedByEmployee>;
  readonly approvedExpenses: AsyncCollection<ExpenseApprovedByEmployee>;
  readonly approvedApplications: AsyncCollection<ApplicationApprovedByEmployee>;
  readonly approvedCreditScores: AsyncCollection<CreditScoreApprovedByEmployee>;
  readonly approvedMoneyTransactions: AsyncCollection<MoneyTransactionApprovedByEmployee>;
  readonly approvedPayments: AsyncCollection<PaymentApprovedByEmployee>;
  readonly borrowers: AsyncCollection<BorrowerLoanOfficer>;
  readonly supervisorID?: string | null;
  readonly supervisor: AsyncItem<Employee | undefined>;
  readonly subordinates: AsyncCollection<Employee>;
  readonly creditScore: AsyncCollection<CreditScore>;
  readonly applications: AsyncCollection<Application>;
  readonly documents: AsyncCollection<Document>;
  readonly expenses: AsyncCollection<Expense>;
  readonly payments: AsyncCollection<Payment>;
  readonly loans: AsyncCollection<Loan>;
  readonly moneyTransactions: AsyncCollection<MoneyTransaction>;
  readonly accounts: AsyncCollection<Account>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly branchEmployeesId?: string | null;
}

export declare type Employee = LazyLoading extends LazyLoadingDisabled ? EagerEmployee : LazyEmployee

export declare const Employee: (new (init: ModelInit<Employee>) => Employee) & {
  copyOf(source: Employee, mutator: (draft: MutableModel<Employee>) => MutableModel<Employee> | void): Employee;
}

type EagerBorrower = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Borrower, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly firstname?: string | null;
  readonly othername?: string | null;
  readonly businessName?: string | null;
  readonly typeOfBusiness?: string | null;
  readonly uniqueIdNumber?: string | null;
  readonly phoneNumber?: string | null;
  readonly otherPhoneNumber?: string | null;
  readonly email?: string | null;
  readonly gender?: string | null;
  readonly dateOfBirth?: string | null;
  readonly nationality?: string | null;
  readonly nationalIdPicture?: string | null;
  readonly passportPicture?: string | null;
  readonly address?: string | null;
  readonly points?: number | null;
  readonly borrowerOpeningBalance?: number | null;
  readonly borrowerClosingBalance?: number | null;
  readonly borrowerInterestRate?: number | null;
  readonly city?: string | null;
  readonly state?: string | null;
  readonly title?: string | null;
  readonly zipcode?: string | null;
  readonly employmentStatus?: string | null;
  readonly employerName?: string | null;
  readonly creditScore?: string | null;
  readonly additionalNote1?: string | null;
  readonly additionalNote2?: string | null;
  readonly borrowerDocuments?: string | null;
  readonly customFieldsData?: string | null;
  readonly status?: string | null;
  readonly branch?: Branch | null;
  readonly loans?: (Loan | null)[] | null;
  readonly guarantors?: (Guarantor | null)[] | null;
  readonly securities?: (Security | null)[] | null;
  readonly applications?: (Application | null)[] | null;
  readonly contracts?: (Contract | null)[] | null;
  readonly documents?: (BorrowerDocument | null)[] | null;
  readonly employees?: (BorrowerLoanOfficer | null)[] | null;
  readonly collaterals?: (Collateral | null)[] | null;
  readonly creditScores?: (CreditScore | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly branchBorrowersId?: string | null;
}

type LazyBorrower = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Borrower, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly firstname?: string | null;
  readonly othername?: string | null;
  readonly businessName?: string | null;
  readonly typeOfBusiness?: string | null;
  readonly uniqueIdNumber?: string | null;
  readonly phoneNumber?: string | null;
  readonly otherPhoneNumber?: string | null;
  readonly email?: string | null;
  readonly gender?: string | null;
  readonly dateOfBirth?: string | null;
  readonly nationality?: string | null;
  readonly nationalIdPicture?: string | null;
  readonly passportPicture?: string | null;
  readonly address?: string | null;
  readonly points?: number | null;
  readonly borrowerOpeningBalance?: number | null;
  readonly borrowerClosingBalance?: number | null;
  readonly borrowerInterestRate?: number | null;
  readonly city?: string | null;
  readonly state?: string | null;
  readonly title?: string | null;
  readonly zipcode?: string | null;
  readonly employmentStatus?: string | null;
  readonly employerName?: string | null;
  readonly creditScore?: string | null;
  readonly additionalNote1?: string | null;
  readonly additionalNote2?: string | null;
  readonly borrowerDocuments?: string | null;
  readonly customFieldsData?: string | null;
  readonly status?: string | null;
  readonly branch: AsyncItem<Branch | undefined>;
  readonly loans: AsyncCollection<Loan>;
  readonly guarantors: AsyncCollection<Guarantor>;
  readonly securities: AsyncCollection<Security>;
  readonly applications: AsyncCollection<Application>;
  readonly contracts: AsyncCollection<Contract>;
  readonly documents: AsyncCollection<BorrowerDocument>;
  readonly employees: AsyncCollection<BorrowerLoanOfficer>;
  readonly collaterals: AsyncCollection<Collateral>;
  readonly creditScores: AsyncCollection<CreditScore>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly branchBorrowersId?: string | null;
}

export declare type Borrower = LazyLoading extends LazyLoadingDisabled ? EagerBorrower : LazyBorrower

export declare const Borrower: (new (init: ModelInit<Borrower>) => Borrower) & {
  copyOf(source: Borrower, mutator: (draft: MutableModel<Borrower>) => MutableModel<Borrower> | void): Borrower;
}

type EagerGuarantor = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Guarantor, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly relationship?: string | null;
  readonly phoneNumber?: string | null;
  readonly email?: string | null;
  readonly address?: string | null;
  readonly customFieldsData?: string | null;
  readonly status?: string | null;
  readonly borrower?: Borrower | null;
  readonly loans?: (LoanGuarantor | null)[] | null;
  readonly applications?: (ApplicationGuarantor | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly borrowerGuarantorsId?: string | null;
}

type LazyGuarantor = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Guarantor, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly relationship?: string | null;
  readonly phoneNumber?: string | null;
  readonly email?: string | null;
  readonly address?: string | null;
  readonly customFieldsData?: string | null;
  readonly status?: string | null;
  readonly borrower: AsyncItem<Borrower | undefined>;
  readonly loans: AsyncCollection<LoanGuarantor>;
  readonly applications: AsyncCollection<ApplicationGuarantor>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly borrowerGuarantorsId?: string | null;
}

export declare type Guarantor = LazyLoading extends LazyLoadingDisabled ? EagerGuarantor : LazyGuarantor

export declare const Guarantor: (new (init: ModelInit<Guarantor>) => Guarantor) & {
  copyOf(source: Guarantor, mutator: (draft: MutableModel<Guarantor>) => MutableModel<Guarantor> | void): Guarantor;
}

type EagerSecurity = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Security, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly type?: string | null;
  readonly description?: string | null;
  readonly value?: number | null;
  readonly status?: string | null;
  readonly borrower?: Borrower | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly borrowerSecuritiesId?: string | null;
}

type LazySecurity = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Security, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly type?: string | null;
  readonly description?: string | null;
  readonly value?: number | null;
  readonly status?: string | null;
  readonly borrower: AsyncItem<Borrower | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly borrowerSecuritiesId?: string | null;
}

export declare type Security = LazyLoading extends LazyLoadingDisabled ? EagerSecurity : LazySecurity

export declare const Security: (new (init: ModelInit<Security>) => Security) & {
  copyOf(source: Security, mutator: (draft: MutableModel<Security>) => MutableModel<Security> | void): Security;
}

type EagerUserNotification = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UserNotification, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly eventType?: string | null;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly reference?: string | null;
  readonly message?: string | null;
  readonly status?: string | null;
  readonly user?: User | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly userUserNotificationsId?: string | null;
}

type LazyUserNotification = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UserNotification, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly eventType?: string | null;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly reference?: string | null;
  readonly message?: string | null;
  readonly status?: string | null;
  readonly user: AsyncItem<User | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly userUserNotificationsId?: string | null;
}

export declare type UserNotification = LazyLoading extends LazyLoadingDisabled ? EagerUserNotification : LazyUserNotification

export declare const UserNotification: (new (init: ModelInit<UserNotification>) => UserNotification) & {
  copyOf(source: UserNotification, mutator: (draft: MutableModel<UserNotification>) => MutableModel<UserNotification> | void): UserNotification;
}

type EagerLoanProduct = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoanProduct, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly principalAmountMin?: number | null;
  readonly principalAmountMax?: number | null;
  readonly principalAmountDefault?: number | null;
  readonly interestRateMin?: number | null;
  readonly interestRateMax?: number | null;
  readonly interestRateDefault?: number | null;
  readonly interestCalculationMethod?: string | null;
  readonly interestType?: string | null;
  readonly interestPeriod?: string | null;
  readonly termDurationMin?: number | null;
  readonly termDurationMax?: number | null;
  readonly termDurationDefault?: number | null;
  readonly durationPeriod?: string | null;
  readonly repaymentFrequency?: string | null;
  readonly repaymentOrder?: string | null;
  readonly extendLoanAfterMaturity?: boolean | null;
  readonly interestTypeMaturity?: string | null;
  readonly calculateInterestOn?: string | null;
  readonly loanInterestRateAfterMaturity?: number | null;
  readonly recurringPeriodAfterMaturityUnit?: string | null;
  readonly status?: string | null;
  readonly institution?: Institution | null;
  readonly branches?: (BranchLoanProduct | null)[] | null;
  readonly loanFees?: (LoanProductLoanFees | null)[] | null;
  readonly loanFeesConfigs?: (LoanProductLoanFeesConfig | null)[] | null;
  readonly loanPenalties?: (LoanProductPenalty | null)[] | null;
  readonly applications?: (Application | null)[] | null;
  readonly loans?: (Loan | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly institutionLoanProductsId?: string | null;
}

type LazyLoanProduct = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoanProduct, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly principalAmountMin?: number | null;
  readonly principalAmountMax?: number | null;
  readonly principalAmountDefault?: number | null;
  readonly interestRateMin?: number | null;
  readonly interestRateMax?: number | null;
  readonly interestRateDefault?: number | null;
  readonly interestCalculationMethod?: string | null;
  readonly interestType?: string | null;
  readonly interestPeriod?: string | null;
  readonly termDurationMin?: number | null;
  readonly termDurationMax?: number | null;
  readonly termDurationDefault?: number | null;
  readonly durationPeriod?: string | null;
  readonly repaymentFrequency?: string | null;
  readonly repaymentOrder?: string | null;
  readonly extendLoanAfterMaturity?: boolean | null;
  readonly interestTypeMaturity?: string | null;
  readonly calculateInterestOn?: string | null;
  readonly loanInterestRateAfterMaturity?: number | null;
  readonly recurringPeriodAfterMaturityUnit?: string | null;
  readonly status?: string | null;
  readonly institution: AsyncItem<Institution | undefined>;
  readonly branches: AsyncCollection<BranchLoanProduct>;
  readonly loanFees: AsyncCollection<LoanProductLoanFees>;
  readonly loanFeesConfigs: AsyncCollection<LoanProductLoanFeesConfig>;
  readonly loanPenalties: AsyncCollection<LoanProductPenalty>;
  readonly applications: AsyncCollection<Application>;
  readonly loans: AsyncCollection<Loan>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly institutionLoanProductsId?: string | null;
}

export declare type LoanProduct = LazyLoading extends LazyLoadingDisabled ? EagerLoanProduct : LazyLoanProduct

export declare const LoanProduct: (new (init: ModelInit<LoanProduct>) => LoanProduct) & {
  copyOf(source: LoanProduct, mutator: (draft: MutableModel<LoanProduct>) => MutableModel<LoanProduct> | void): LoanProduct;
}

type EagerCreditScore = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<CreditScore, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly score?: number | null;
  readonly scoreDate?: string | null;
  readonly scoreSource?: string | null;
  readonly scoreStatus?: string | null;
  readonly status?: string | null;
  readonly approvedByEmployees?: (CreditScoreApprovedByEmployee | null)[] | null;
  readonly borrowerID?: string | null;
  readonly borrower?: Borrower | null;
  readonly createdByEmployeeID?: string | null;
  readonly createdByEmployee?: Employee | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyCreditScore = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<CreditScore, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly score?: number | null;
  readonly scoreDate?: string | null;
  readonly scoreSource?: string | null;
  readonly scoreStatus?: string | null;
  readonly status?: string | null;
  readonly approvedByEmployees: AsyncCollection<CreditScoreApprovedByEmployee>;
  readonly borrowerID?: string | null;
  readonly borrower: AsyncItem<Borrower | undefined>;
  readonly createdByEmployeeID?: string | null;
  readonly createdByEmployee: AsyncItem<Employee | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type CreditScore = LazyLoading extends LazyLoadingDisabled ? EagerCreditScore : LazyCreditScore

export declare const CreditScore: (new (init: ModelInit<CreditScore>) => CreditScore) & {
  copyOf(source: CreditScore, mutator: (draft: MutableModel<CreditScore>) => MutableModel<CreditScore> | void): CreditScore;
}

type EagerDocument = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Document, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly documentType?: string | null;
  readonly documentName?: string | null;
  readonly documentDescription?: string | null;
  readonly serialNumber?: string | null;
  readonly documentDate?: string | null;
  readonly s3Key?: string | null;
  readonly fileName?: string | null;
  readonly contentType?: string | null;
  readonly status?: string | null;
  readonly branch?: Branch | null;
  readonly borrowers?: (BorrowerDocument | null)[] | null;
  readonly loans?: (LoanDocument | null)[] | null;
  readonly applications?: (ApplicationDocument | null)[] | null;
  readonly contracts?: (ContractDocument | null)[] | null;
  readonly expenses?: (ExpenseDocument | null)[] | null;
  readonly payments?: (PaymentDocument | null)[] | null;
  readonly moneyTransactions?: (MoneyTransactionDocument | null)[] | null;
  readonly createdByEmployeeID?: string | null;
  readonly createdByEmployee?: Employee | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly branchDocumentsId?: string | null;
}

type LazyDocument = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Document, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly documentType?: string | null;
  readonly documentName?: string | null;
  readonly documentDescription?: string | null;
  readonly serialNumber?: string | null;
  readonly documentDate?: string | null;
  readonly s3Key?: string | null;
  readonly fileName?: string | null;
  readonly contentType?: string | null;
  readonly status?: string | null;
  readonly branch: AsyncItem<Branch | undefined>;
  readonly borrowers: AsyncCollection<BorrowerDocument>;
  readonly loans: AsyncCollection<LoanDocument>;
  readonly applications: AsyncCollection<ApplicationDocument>;
  readonly contracts: AsyncCollection<ContractDocument>;
  readonly expenses: AsyncCollection<ExpenseDocument>;
  readonly payments: AsyncCollection<PaymentDocument>;
  readonly moneyTransactions: AsyncCollection<MoneyTransactionDocument>;
  readonly createdByEmployeeID?: string | null;
  readonly createdByEmployee: AsyncItem<Employee | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly branchDocumentsId?: string | null;
}

export declare type Document = LazyLoading extends LazyLoadingDisabled ? EagerDocument : LazyDocument

export declare const Document: (new (init: ModelInit<Document>) => Document) & {
  copyOf(source: Document, mutator: (draft: MutableModel<Document>) => MutableModel<Document> | void): Document;
}

type EagerContract = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Contract, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly contractNumber?: string | null;
  readonly contractType?: string | null;
  readonly contractDate?: string | null;
  readonly contractStatus?: string | null;
  readonly contractRecord?: string | null;
  readonly status?: string | null;
  readonly borrower?: Borrower | null;
  readonly applications?: (ApplicationContract | null)[] | null;
  readonly collaterals?: (CollateralContract | null)[] | null;
  readonly documents?: (ContractDocument | null)[] | null;
  readonly loans?: (LoanContract | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly borrowerContractsId?: string | null;
}

type LazyContract = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Contract, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly contractNumber?: string | null;
  readonly contractType?: string | null;
  readonly contractDate?: string | null;
  readonly contractStatus?: string | null;
  readonly contractRecord?: string | null;
  readonly status?: string | null;
  readonly borrower: AsyncItem<Borrower | undefined>;
  readonly applications: AsyncCollection<ApplicationContract>;
  readonly collaterals: AsyncCollection<CollateralContract>;
  readonly documents: AsyncCollection<ContractDocument>;
  readonly loans: AsyncCollection<LoanContract>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly borrowerContractsId?: string | null;
}

export declare type Contract = LazyLoading extends LazyLoadingDisabled ? EagerContract : LazyContract

export declare const Contract: (new (init: ModelInit<Contract>) => Contract) & {
  copyOf(source: Contract, mutator: (draft: MutableModel<Contract>) => MutableModel<Contract> | void): Contract;
}

type EagerApplication = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Application, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly applicationNumber?: string | null;
  readonly requestedPrincipalAmount?: number | null;
  readonly requestedTermMonths?: number | null;
  readonly requestedFrequency?: Frequency | keyof typeof Frequency | null;
  readonly applicationDate?: string | null;
  readonly status?: string | null;
  readonly applicationRecord?: string | null;
  readonly borrower?: Borrower | null;
  readonly guarantors?: (ApplicationGuarantor | null)[] | null;
  readonly collateral?: (ApplicationCollateral | null)[] | null;
  readonly contracts?: (ApplicationContract | null)[] | null;
  readonly expenses?: (ApplicationExpense | null)[] | null;
  readonly loans?: (LoanApplication | null)[] | null;
  readonly approvedByEmployees?: (ApplicationApprovedByEmployee | null)[] | null;
  readonly documents?: (ApplicationDocument | null)[] | null;
  readonly loanProductID?: string | null;
  readonly loanProduct?: LoanProduct | null;
  readonly createdByEmployeeID?: string | null;
  readonly createdByEmployee?: Employee | null;
  readonly customFieldsData?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly borrowerApplicationsId?: string | null;
}

type LazyApplication = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Application, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly applicationNumber?: string | null;
  readonly requestedPrincipalAmount?: number | null;
  readonly requestedTermMonths?: number | null;
  readonly requestedFrequency?: Frequency | keyof typeof Frequency | null;
  readonly applicationDate?: string | null;
  readonly status?: string | null;
  readonly applicationRecord?: string | null;
  readonly borrower: AsyncItem<Borrower | undefined>;
  readonly guarantors: AsyncCollection<ApplicationGuarantor>;
  readonly collateral: AsyncCollection<ApplicationCollateral>;
  readonly contracts: AsyncCollection<ApplicationContract>;
  readonly expenses: AsyncCollection<ApplicationExpense>;
  readonly loans: AsyncCollection<LoanApplication>;
  readonly approvedByEmployees: AsyncCollection<ApplicationApprovedByEmployee>;
  readonly documents: AsyncCollection<ApplicationDocument>;
  readonly loanProductID?: string | null;
  readonly loanProduct: AsyncItem<LoanProduct | undefined>;
  readonly createdByEmployeeID?: string | null;
  readonly createdByEmployee: AsyncItem<Employee | undefined>;
  readonly customFieldsData?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly borrowerApplicationsId?: string | null;
}

export declare type Application = LazyLoading extends LazyLoadingDisabled ? EagerApplication : LazyApplication

export declare const Application: (new (init: ModelInit<Application>) => Application) & {
  copyOf(source: Application, mutator: (draft: MutableModel<Application>) => MutableModel<Application> | void): Application;
}

type EagerCollateral = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Collateral, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly type?: string | null;
  readonly description?: string | null;
  readonly location?: string | null;
  readonly value?: number | null;
  readonly serialNumber?: string | null;
  readonly registrationNumber?: string | null;
  readonly insuranceDetails?: string | null;
  readonly insuranceExpiryDate?: string | null;
  readonly insuranceCompany?: string | null;
  readonly storedAt?: string | null;
  readonly customFieldsData?: string | null;
  readonly status?: string | null;
  readonly borrower?: Borrower | null;
  readonly loans?: (LoanCollateral | null)[] | null;
  readonly applications?: (ApplicationCollateral | null)[] | null;
  readonly contracts?: (CollateralContract | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly borrowerCollateralsId?: string | null;
}

type LazyCollateral = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Collateral, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly type?: string | null;
  readonly description?: string | null;
  readonly location?: string | null;
  readonly value?: number | null;
  readonly serialNumber?: string | null;
  readonly registrationNumber?: string | null;
  readonly insuranceDetails?: string | null;
  readonly insuranceExpiryDate?: string | null;
  readonly insuranceCompany?: string | null;
  readonly storedAt?: string | null;
  readonly customFieldsData?: string | null;
  readonly status?: string | null;
  readonly borrower: AsyncItem<Borrower | undefined>;
  readonly loans: AsyncCollection<LoanCollateral>;
  readonly applications: AsyncCollection<ApplicationCollateral>;
  readonly contracts: AsyncCollection<CollateralContract>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly borrowerCollateralsId?: string | null;
}

export declare type Collateral = LazyLoading extends LazyLoadingDisabled ? EagerCollateral : LazyCollateral

export declare const Collateral: (new (init: ModelInit<Collateral>) => Collateral) & {
  copyOf(source: Collateral, mutator: (draft: MutableModel<Collateral>) => MutableModel<Collateral> | void): Collateral;
}

type EagerLoan = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Loan, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly loanNumber?: string | null;
  readonly approvalStatus?: string | null;
  readonly approvalStatusEnum?: LoanApprovalStatus | keyof typeof LoanApprovalStatus | null;
  readonly approvedDate?: string | null;
  readonly principal?: number | null;
  readonly fees?: number | null;
  readonly interestRate?: number | null;
  readonly startDate?: string | null;
  readonly maturityDate?: string | null;
  readonly stopDate?: string | null;
  readonly extensionPeriod?: number | null;
  readonly duration?: number | null;
  readonly durationInterval?: string | null;
  readonly loanType?: string | null;
  readonly rateInterval?: string | null;
  readonly loanStatus?: string | null;
  readonly loanStatusEnum?: LoanStatus | keyof typeof LoanStatus | null;
  readonly loanCurrency?: string | null;
  readonly loanPurpose?: string | null;
  readonly loanComputationRecord?: string | null;
  readonly loanAttribute1?: string | null;
  readonly loanAttribute2?: string | null;
  readonly numberOfPayments?: number | null;
  readonly paymentFrequency?: string | null;
  readonly customFieldsData?: string | null;
  readonly status?: string | null;
  readonly borrowerID?: string | null;
  readonly borrower?: Borrower | null;
  readonly branchID?: string | null;
  readonly branch?: Branch | null;
  readonly payments?: (Payment | null)[] | null;
  readonly installments?: (LoanInstallment | null)[] | null;
  readonly disbursements?: (LoanDisbursement | null)[] | null;
  readonly events?: (LoanEvent | null)[] | null;
  readonly balanceSnapshots?: (LoanBalanceSnapshot | null)[] | null;
  readonly loanFees?: (LoanFees | null)[] | null;
  readonly penalties?: (Penalty | null)[] | null;
  readonly applications?: (LoanApplication | null)[] | null;
  readonly accounts?: (LoanAccount | null)[] | null;
  readonly guarantors?: (LoanGuarantor | null)[] | null;
  readonly collateral?: (LoanCollateral | null)[] | null;
  readonly contracts?: (LoanContract | null)[] | null;
  readonly expenses?: (LoanExpense | null)[] | null;
  readonly approvedByEmployees?: (LoanApprovedByEmployee | null)[] | null;
  readonly documents?: (LoanDocument | null)[] | null;
  readonly moneyTransactions?: (MoneyTransaction | null)[] | null;
  readonly loanProductID?: string | null;
  readonly loanProduct?: LoanProduct | null;
  readonly createdByEmployeeID?: string | null;
  readonly createdByEmployee?: Employee | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly borrowerLoansId?: string | null;
}

type LazyLoan = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Loan, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly loanNumber?: string | null;
  readonly approvalStatus?: string | null;
  readonly approvalStatusEnum?: LoanApprovalStatus | keyof typeof LoanApprovalStatus | null;
  readonly approvedDate?: string | null;
  readonly principal?: number | null;
  readonly fees?: number | null;
  readonly interestRate?: number | null;
  readonly startDate?: string | null;
  readonly maturityDate?: string | null;
  readonly stopDate?: string | null;
  readonly extensionPeriod?: number | null;
  readonly duration?: number | null;
  readonly durationInterval?: string | null;
  readonly loanType?: string | null;
  readonly rateInterval?: string | null;
  readonly loanStatus?: string | null;
  readonly loanStatusEnum?: LoanStatus | keyof typeof LoanStatus | null;
  readonly loanCurrency?: string | null;
  readonly loanPurpose?: string | null;
  readonly loanComputationRecord?: string | null;
  readonly loanAttribute1?: string | null;
  readonly loanAttribute2?: string | null;
  readonly numberOfPayments?: number | null;
  readonly paymentFrequency?: string | null;
  readonly customFieldsData?: string | null;
  readonly status?: string | null;
  readonly borrowerID?: string | null;
  readonly borrower: AsyncItem<Borrower | undefined>;
  readonly branchID?: string | null;
  readonly branch: AsyncItem<Branch | undefined>;
  readonly payments: AsyncCollection<Payment>;
  readonly installments: AsyncCollection<LoanInstallment>;
  readonly disbursements: AsyncCollection<LoanDisbursement>;
  readonly events: AsyncCollection<LoanEvent>;
  readonly balanceSnapshots: AsyncCollection<LoanBalanceSnapshot>;
  readonly loanFees: AsyncCollection<LoanFees>;
  readonly penalties: AsyncCollection<Penalty>;
  readonly applications: AsyncCollection<LoanApplication>;
  readonly accounts: AsyncCollection<LoanAccount>;
  readonly guarantors: AsyncCollection<LoanGuarantor>;
  readonly collateral: AsyncCollection<LoanCollateral>;
  readonly contracts: AsyncCollection<LoanContract>;
  readonly expenses: AsyncCollection<LoanExpense>;
  readonly approvedByEmployees: AsyncCollection<LoanApprovedByEmployee>;
  readonly documents: AsyncCollection<LoanDocument>;
  readonly moneyTransactions: AsyncCollection<MoneyTransaction>;
  readonly loanProductID?: string | null;
  readonly loanProduct: AsyncItem<LoanProduct | undefined>;
  readonly createdByEmployeeID?: string | null;
  readonly createdByEmployee: AsyncItem<Employee | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly borrowerLoansId?: string | null;
}

export declare type Loan = LazyLoading extends LazyLoadingDisabled ? EagerLoan : LazyLoan

export declare const Loan: (new (init: ModelInit<Loan>) => Loan) & {
  copyOf(source: Loan, mutator: (draft: MutableModel<Loan>) => MutableModel<Loan> | void): Loan;
}

type EagerLoanInstallment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoanInstallment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly loanID: string;
  readonly loan?: Loan | null;
  readonly dueDate: string;
  readonly principalDue?: number | null;
  readonly interestDue?: number | null;
  readonly feesDue?: number | null;
  readonly penaltyDue?: number | null;
  readonly totalDue?: number | null;
  readonly principalPaid?: number | null;
  readonly interestPaid?: number | null;
  readonly feesPaid?: number | null;
  readonly penaltyPaid?: number | null;
  readonly totalPaid?: number | null;
  readonly status?: InstallmentStatus | keyof typeof InstallmentStatus | null;
  readonly calculationRecord?: string | null;
  readonly events?: (LoanEvent | null)[] | null;
  readonly moneyTransactions?: (MoneyTransaction | null)[] | null;
  readonly payments?: (Payment | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyLoanInstallment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoanInstallment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly loanID: string;
  readonly loan: AsyncItem<Loan | undefined>;
  readonly dueDate: string;
  readonly principalDue?: number | null;
  readonly interestDue?: number | null;
  readonly feesDue?: number | null;
  readonly penaltyDue?: number | null;
  readonly totalDue?: number | null;
  readonly principalPaid?: number | null;
  readonly interestPaid?: number | null;
  readonly feesPaid?: number | null;
  readonly penaltyPaid?: number | null;
  readonly totalPaid?: number | null;
  readonly status?: InstallmentStatus | keyof typeof InstallmentStatus | null;
  readonly calculationRecord?: string | null;
  readonly events: AsyncCollection<LoanEvent>;
  readonly moneyTransactions: AsyncCollection<MoneyTransaction>;
  readonly payments: AsyncCollection<Payment>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type LoanInstallment = LazyLoading extends LazyLoadingDisabled ? EagerLoanInstallment : LazyLoanInstallment

export declare const LoanInstallment: (new (init: ModelInit<LoanInstallment>) => LoanInstallment) & {
  copyOf(source: LoanInstallment, mutator: (draft: MutableModel<LoanInstallment>) => MutableModel<LoanInstallment> | void): LoanInstallment;
}

type EagerLoanDisbursement = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoanDisbursement, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly loanID: string;
  readonly loan?: Loan | null;
  readonly disbursedAt: string;
  readonly amount: number;
  readonly status?: DisbursementStatus | keyof typeof DisbursementStatus | null;
  readonly method?: string | null;
  readonly reference?: string | null;
  readonly accountID?: string | null;
  readonly account?: Account | null;
  readonly moneyTransactionID?: string | null;
  readonly moneyTransaction?: MoneyTransaction | null;
  readonly moneyTransactions?: (MoneyTransaction | null)[] | null;
  readonly events?: (LoanEvent | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyLoanDisbursement = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoanDisbursement, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly loanID: string;
  readonly loan: AsyncItem<Loan | undefined>;
  readonly disbursedAt: string;
  readonly amount: number;
  readonly status?: DisbursementStatus | keyof typeof DisbursementStatus | null;
  readonly method?: string | null;
  readonly reference?: string | null;
  readonly accountID?: string | null;
  readonly account: AsyncItem<Account | undefined>;
  readonly moneyTransactionID?: string | null;
  readonly moneyTransaction: AsyncItem<MoneyTransaction | undefined>;
  readonly moneyTransactions: AsyncCollection<MoneyTransaction>;
  readonly events: AsyncCollection<LoanEvent>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type LoanDisbursement = LazyLoading extends LazyLoadingDisabled ? EagerLoanDisbursement : LazyLoanDisbursement

export declare const LoanDisbursement: (new (init: ModelInit<LoanDisbursement>) => LoanDisbursement) & {
  copyOf(source: LoanDisbursement, mutator: (draft: MutableModel<LoanDisbursement>) => MutableModel<LoanDisbursement> | void): LoanDisbursement;
}

type EagerLoanEvent = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoanEvent, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly loanID: string;
  readonly loan?: Loan | null;
  readonly eventAt: string;
  readonly eventType: LoanEventType | keyof typeof LoanEventType;
  readonly actorEmployeeID?: string | null;
  readonly summary?: string | null;
  readonly payload?: string | null;
  readonly paymentID?: string | null;
  readonly payment?: Payment | null;
  readonly installmentID?: string | null;
  readonly installment?: LoanInstallment | null;
  readonly disbursementID?: string | null;
  readonly disbursement?: LoanDisbursement | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyLoanEvent = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoanEvent, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly loanID: string;
  readonly loan: AsyncItem<Loan | undefined>;
  readonly eventAt: string;
  readonly eventType: LoanEventType | keyof typeof LoanEventType;
  readonly actorEmployeeID?: string | null;
  readonly summary?: string | null;
  readonly payload?: string | null;
  readonly paymentID?: string | null;
  readonly payment: AsyncItem<Payment | undefined>;
  readonly installmentID?: string | null;
  readonly installment: AsyncItem<LoanInstallment | undefined>;
  readonly disbursementID?: string | null;
  readonly disbursement: AsyncItem<LoanDisbursement | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type LoanEvent = LazyLoading extends LazyLoadingDisabled ? EagerLoanEvent : LazyLoanEvent

export declare const LoanEvent: (new (init: ModelInit<LoanEvent>) => LoanEvent) & {
  copyOf(source: LoanEvent, mutator: (draft: MutableModel<LoanEvent>) => MutableModel<LoanEvent> | void): LoanEvent;
}

type EagerLoanBalanceSnapshot = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoanBalanceSnapshot, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly loanID: string;
  readonly loan?: Loan | null;
  readonly asOfAt: string;
  readonly principalOutstanding?: number | null;
  readonly interestOutstanding?: number | null;
  readonly feesOutstanding?: number | null;
  readonly penaltyOutstanding?: number | null;
  readonly totalOutstanding?: number | null;
  readonly daysPastDue?: number | null;
  readonly snapshotRecord?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyLoanBalanceSnapshot = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoanBalanceSnapshot, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly loanID: string;
  readonly loan: AsyncItem<Loan | undefined>;
  readonly asOfAt: string;
  readonly principalOutstanding?: number | null;
  readonly interestOutstanding?: number | null;
  readonly feesOutstanding?: number | null;
  readonly penaltyOutstanding?: number | null;
  readonly totalOutstanding?: number | null;
  readonly daysPastDue?: number | null;
  readonly snapshotRecord?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type LoanBalanceSnapshot = LazyLoading extends LazyLoadingDisabled ? EagerLoanBalanceSnapshot : LazyLoanBalanceSnapshot

export declare const LoanBalanceSnapshot: (new (init: ModelInit<LoanBalanceSnapshot>) => LoanBalanceSnapshot) & {
  copyOf(source: LoanBalanceSnapshot, mutator: (draft: MutableModel<LoanBalanceSnapshot>) => MutableModel<LoanBalanceSnapshot> | void): LoanBalanceSnapshot;
}

type EagerInvestment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Investment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly principal?: number | null;
  readonly description?: string | null;
  readonly fees?: number | null;
  readonly interestRate?: number | null;
  readonly startDate?: string | null;
  readonly maturityDate?: string | null;
  readonly stopDate?: string | null;
  readonly extensionPeriod?: number | null;
  readonly duration?: number | null;
  readonly durationInterval?: string | null;
  readonly type?: string | null;
  readonly rateInterval?: string | null;
  readonly investmentStatus?: string | null;
  readonly investmentAttribute1?: string | null;
  readonly investmentAttribute2?: string | null;
  readonly numberOfPayments?: number | null;
  readonly paymentFrequency?: number | null;
  readonly status?: string | null;
  readonly accounts?: (InvestmentAccount | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyInvestment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Investment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly principal?: number | null;
  readonly description?: string | null;
  readonly fees?: number | null;
  readonly interestRate?: number | null;
  readonly startDate?: string | null;
  readonly maturityDate?: string | null;
  readonly stopDate?: string | null;
  readonly extensionPeriod?: number | null;
  readonly duration?: number | null;
  readonly durationInterval?: string | null;
  readonly type?: string | null;
  readonly rateInterval?: string | null;
  readonly investmentStatus?: string | null;
  readonly investmentAttribute1?: string | null;
  readonly investmentAttribute2?: string | null;
  readonly numberOfPayments?: number | null;
  readonly paymentFrequency?: number | null;
  readonly status?: string | null;
  readonly accounts: AsyncCollection<InvestmentAccount>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Investment = LazyLoading extends LazyLoadingDisabled ? EagerInvestment : LazyInvestment

export declare const Investment: (new (init: ModelInit<Investment>) => Investment) & {
  copyOf(source: Investment, mutator: (draft: MutableModel<Investment>) => MutableModel<Investment> | void): Investment;
}

type EagerLoanFees = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoanFees, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly amount?: number | null;
  readonly loanFeesName?: string | null;
  readonly loanFeesCategory?: string | null;
  readonly loanFeesCalculationMethod?: string | null;
  readonly loanFeesRate?: number | null;
  readonly loanFeesDate?: string | null;
  readonly loanFeesStatus?: string | null;
  readonly notes?: string | null;
  readonly loanFeesType?: string | null;
  readonly loanFeesDescription?: string | null;
  readonly loanFeesAttribute1?: string | null;
  readonly loanFeesAttribute2?: string | null;
  readonly status?: string | null;
  readonly loan?: Loan | null;
  readonly loanProducts?: (LoanProductLoanFees | null)[] | null;
  readonly accountID?: string | null;
  readonly account?: Account | null;
  readonly loanFeesConfigs?: (LoanFeesLoanFeesConfig | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly loanLoanFeesId?: string | null;
}

type LazyLoanFees = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoanFees, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly amount?: number | null;
  readonly loanFeesName?: string | null;
  readonly loanFeesCategory?: string | null;
  readonly loanFeesCalculationMethod?: string | null;
  readonly loanFeesRate?: number | null;
  readonly loanFeesDate?: string | null;
  readonly loanFeesStatus?: string | null;
  readonly notes?: string | null;
  readonly loanFeesType?: string | null;
  readonly loanFeesDescription?: string | null;
  readonly loanFeesAttribute1?: string | null;
  readonly loanFeesAttribute2?: string | null;
  readonly status?: string | null;
  readonly loan: AsyncItem<Loan | undefined>;
  readonly loanProducts: AsyncCollection<LoanProductLoanFees>;
  readonly accountID?: string | null;
  readonly account: AsyncItem<Account | undefined>;
  readonly loanFeesConfigs: AsyncCollection<LoanFeesLoanFeesConfig>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly loanLoanFeesId?: string | null;
}

export declare type LoanFees = LazyLoading extends LazyLoadingDisabled ? EagerLoanFees : LazyLoanFees

export declare const LoanFees: (new (init: ModelInit<LoanFees>) => LoanFees) & {
  copyOf(source: LoanFees, mutator: (draft: MutableModel<LoanFees>) => MutableModel<LoanFees> | void): LoanFees;
}

type EagerPenalty = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Penalty, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly amount?: number | null;
  readonly penaltyName?: string | null;
  readonly penaltyCategory?: string | null;
  readonly penaltyCalculationMethod?: string | null;
  readonly penaltyRate?: number | null;
  readonly penaltyDate?: string | null;
  readonly penaltyStatus?: string | null;
  readonly notes?: string | null;
  readonly penaltyType?: string | null;
  readonly penaltyDescription?: string | null;
  readonly penaltyAttribute1?: string | null;
  readonly penaltyAttribute2?: string | null;
  readonly status?: string | null;
  readonly loan?: Loan | null;
  readonly loanProducts?: (LoanProductPenalty | null)[] | null;
  readonly accountID?: string | null;
  readonly account?: Account | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly loanPenaltiesId?: string | null;
}

type LazyPenalty = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Penalty, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly amount?: number | null;
  readonly penaltyName?: string | null;
  readonly penaltyCategory?: string | null;
  readonly penaltyCalculationMethod?: string | null;
  readonly penaltyRate?: number | null;
  readonly penaltyDate?: string | null;
  readonly penaltyStatus?: string | null;
  readonly notes?: string | null;
  readonly penaltyType?: string | null;
  readonly penaltyDescription?: string | null;
  readonly penaltyAttribute1?: string | null;
  readonly penaltyAttribute2?: string | null;
  readonly status?: string | null;
  readonly loan: AsyncItem<Loan | undefined>;
  readonly loanProducts: AsyncCollection<LoanProductPenalty>;
  readonly accountID?: string | null;
  readonly account: AsyncItem<Account | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly loanPenaltiesId?: string | null;
}

export declare type Penalty = LazyLoading extends LazyLoadingDisabled ? EagerPenalty : LazyPenalty

export declare const Penalty: (new (init: ModelInit<Penalty>) => Penalty) & {
  copyOf(source: Penalty, mutator: (draft: MutableModel<Penalty>) => MutableModel<Penalty> | void): Penalty;
}

type EagerPayroll = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Payroll, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly periodStartDate?: string | null;
  readonly periodEndDate?: string | null;
  readonly payDate?: string | null;
  readonly status?: string | null;
  readonly processedByUserID?: string | null;
  readonly totalGrossPay?: number | null;
  readonly totalLoanDeductions?: number | null;
  readonly totalSavingsDeductions?: number | null;
  readonly totalShareDeductions?: number | null;
  readonly totalNetPay?: number | null;
  readonly details?: string | null;
  readonly branch?: Branch | null;
  readonly employees?: (PayrollEmployee | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly branchPayrollsId?: string | null;
}

type LazyPayroll = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Payroll, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly periodStartDate?: string | null;
  readonly periodEndDate?: string | null;
  readonly payDate?: string | null;
  readonly status?: string | null;
  readonly processedByUserID?: string | null;
  readonly totalGrossPay?: number | null;
  readonly totalLoanDeductions?: number | null;
  readonly totalSavingsDeductions?: number | null;
  readonly totalShareDeductions?: number | null;
  readonly totalNetPay?: number | null;
  readonly details?: string | null;
  readonly branch: AsyncItem<Branch | undefined>;
  readonly employees: AsyncCollection<PayrollEmployee>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly branchPayrollsId?: string | null;
}

export declare type Payroll = LazyLoading extends LazyLoadingDisabled ? EagerPayroll : LazyPayroll

export declare const Payroll: (new (init: ModelInit<Payroll>) => Payroll) & {
  copyOf(source: Payroll, mutator: (draft: MutableModel<Payroll>) => MutableModel<Payroll> | void): Payroll;
}

type EagerAccount = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Account, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly accountType?: string | null;
  readonly accountNumber?: string | null;
  readonly description?: string | null;
  readonly currency?: string | null;
  readonly currentBalance?: number | null;
  readonly openingBalance?: number | null;
  readonly interestRate?: number | null;
  readonly interestCalculationMethod?: string | null;
  readonly interestPostingFrequency?: string | null;
  readonly interestPostingDate?: string | null;
  readonly interestAccrued?: number | null;
  readonly interestAccruedDate?: string | null;
  readonly accountStatus?: string | null;
  readonly status?: string | null;
  readonly institution?: Institution | null;
  readonly branches?: (AccountBranch | null)[] | null;
  readonly moneyTransactions?: (MoneyTransaction | null)[] | null;
  readonly expenses?: (Expense | null)[] | null;
  readonly loans?: (LoanAccount | null)[] | null;
  readonly investments?: (InvestmentAccount | null)[] | null;
  readonly otherIncomes?: (OtherIncomeAccount | null)[] | null;
  readonly loanFees?: (LoanFees | null)[] | null;
  readonly payments?: (Payment | null)[] | null;
  readonly disbursements?: (LoanDisbursement | null)[] | null;
  readonly penalties?: (Penalty | null)[] | null;
  readonly createdByEmployeeID?: string | null;
  readonly createdByEmployee?: Employee | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly institutionAccountsId?: string | null;
}

type LazyAccount = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Account, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly accountType?: string | null;
  readonly accountNumber?: string | null;
  readonly description?: string | null;
  readonly currency?: string | null;
  readonly currentBalance?: number | null;
  readonly openingBalance?: number | null;
  readonly interestRate?: number | null;
  readonly interestCalculationMethod?: string | null;
  readonly interestPostingFrequency?: string | null;
  readonly interestPostingDate?: string | null;
  readonly interestAccrued?: number | null;
  readonly interestAccruedDate?: string | null;
  readonly accountStatus?: string | null;
  readonly status?: string | null;
  readonly institution: AsyncItem<Institution | undefined>;
  readonly branches: AsyncCollection<AccountBranch>;
  readonly moneyTransactions: AsyncCollection<MoneyTransaction>;
  readonly expenses: AsyncCollection<Expense>;
  readonly loans: AsyncCollection<LoanAccount>;
  readonly investments: AsyncCollection<InvestmentAccount>;
  readonly otherIncomes: AsyncCollection<OtherIncomeAccount>;
  readonly loanFees: AsyncCollection<LoanFees>;
  readonly payments: AsyncCollection<Payment>;
  readonly disbursements: AsyncCollection<LoanDisbursement>;
  readonly penalties: AsyncCollection<Penalty>;
  readonly createdByEmployeeID?: string | null;
  readonly createdByEmployee: AsyncItem<Employee | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly institutionAccountsId?: string | null;
}

export declare type Account = LazyLoading extends LazyLoadingDisabled ? EagerAccount : LazyAccount

export declare const Account: (new (init: ModelInit<Account>) => Account) & {
  copyOf(source: Account, mutator: (draft: MutableModel<Account>) => MutableModel<Account> | void): Account;
}

type EagerMoneyTransaction = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<MoneyTransaction, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly transactionType?: string | null;
  readonly transactionDate?: string | null;
  readonly amount: number;
  readonly description?: string | null;
  readonly referenceNumber?: string | null;
  readonly relatedEntityType?: string | null;
  readonly approvalStatus?: string | null;
  readonly approvedDate?: string | null;
  readonly category?: string | null;
  readonly notes?: string | null;
  readonly paymentMethod?: string | null;
  readonly deviceInfo?: string | null;
  readonly status?: string | null;
  readonly account?: Account | null;
  readonly loanID?: string | null;
  readonly loan?: Loan | null;
  readonly paymentID?: string | null;
  readonly payment?: Payment | null;
  readonly disbursementID?: string | null;
  readonly disbursement?: LoanDisbursement | null;
  readonly installmentID?: string | null;
  readonly installment?: LoanInstallment | null;
  readonly approvedByEmployees?: (MoneyTransactionApprovedByEmployee | null)[] | null;
  readonly documents?: (MoneyTransactionDocument | null)[] | null;
  readonly createdByEmployeeID?: string | null;
  readonly createdByEmployee?: Employee | null;
  readonly paymentsLink?: (Payment | null)[] | null;
  readonly disbursementsLink?: (LoanDisbursement | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly accountMoneyTransactionsId?: string | null;
}

type LazyMoneyTransaction = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<MoneyTransaction, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly transactionType?: string | null;
  readonly transactionDate?: string | null;
  readonly amount: number;
  readonly description?: string | null;
  readonly referenceNumber?: string | null;
  readonly relatedEntityType?: string | null;
  readonly approvalStatus?: string | null;
  readonly approvedDate?: string | null;
  readonly category?: string | null;
  readonly notes?: string | null;
  readonly paymentMethod?: string | null;
  readonly deviceInfo?: string | null;
  readonly status?: string | null;
  readonly account: AsyncItem<Account | undefined>;
  readonly loanID?: string | null;
  readonly loan: AsyncItem<Loan | undefined>;
  readonly paymentID?: string | null;
  readonly payment: AsyncItem<Payment | undefined>;
  readonly disbursementID?: string | null;
  readonly disbursement: AsyncItem<LoanDisbursement | undefined>;
  readonly installmentID?: string | null;
  readonly installment: AsyncItem<LoanInstallment | undefined>;
  readonly approvedByEmployees: AsyncCollection<MoneyTransactionApprovedByEmployee>;
  readonly documents: AsyncCollection<MoneyTransactionDocument>;
  readonly createdByEmployeeID?: string | null;
  readonly createdByEmployee: AsyncItem<Employee | undefined>;
  readonly paymentsLink: AsyncCollection<Payment>;
  readonly disbursementsLink: AsyncCollection<LoanDisbursement>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly accountMoneyTransactionsId?: string | null;
}

export declare type MoneyTransaction = LazyLoading extends LazyLoadingDisabled ? EagerMoneyTransaction : LazyMoneyTransaction

export declare const MoneyTransaction: (new (init: ModelInit<MoneyTransaction>) => MoneyTransaction) & {
  copyOf(source: MoneyTransaction, mutator: (draft: MutableModel<MoneyTransaction>) => MutableModel<MoneyTransaction> | void): MoneyTransaction;
}

type EagerPayment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Payment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly paymentDate?: string | null;
  readonly paymentType?: string | null;
  readonly amount: number;
  readonly description?: string | null;
  readonly referenceNumber?: string | null;
  readonly paymentMethod?: string | null;
  readonly status?: string | null;
  readonly paymentStatusEnum?: PaymentStatus | keyof typeof PaymentStatus | null;
  readonly notes?: string | null;
  readonly loanID?: string | null;
  readonly loan?: Loan | null;
  readonly installmentID?: string | null;
  readonly installment?: LoanInstallment | null;
  readonly moneyTransactionID?: string | null;
  readonly moneyTransaction?: MoneyTransaction | null;
  readonly accountID?: string | null;
  readonly account?: Account | null;
  readonly receivingEmployeeID?: string | null;
  readonly receivingEmployee?: Employee | null;
  readonly approvedByEmployees?: (PaymentApprovedByEmployee | null)[] | null;
  readonly documents?: (PaymentDocument | null)[] | null;
  readonly moneyTransactions?: (MoneyTransaction | null)[] | null;
  readonly events?: (LoanEvent | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyPayment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Payment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly paymentDate?: string | null;
  readonly paymentType?: string | null;
  readonly amount: number;
  readonly description?: string | null;
  readonly referenceNumber?: string | null;
  readonly paymentMethod?: string | null;
  readonly status?: string | null;
  readonly paymentStatusEnum?: PaymentStatus | keyof typeof PaymentStatus | null;
  readonly notes?: string | null;
  readonly loanID?: string | null;
  readonly loan: AsyncItem<Loan | undefined>;
  readonly installmentID?: string | null;
  readonly installment: AsyncItem<LoanInstallment | undefined>;
  readonly moneyTransactionID?: string | null;
  readonly moneyTransaction: AsyncItem<MoneyTransaction | undefined>;
  readonly accountID?: string | null;
  readonly account: AsyncItem<Account | undefined>;
  readonly receivingEmployeeID?: string | null;
  readonly receivingEmployee: AsyncItem<Employee | undefined>;
  readonly approvedByEmployees: AsyncCollection<PaymentApprovedByEmployee>;
  readonly documents: AsyncCollection<PaymentDocument>;
  readonly moneyTransactions: AsyncCollection<MoneyTransaction>;
  readonly events: AsyncCollection<LoanEvent>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Payment = LazyLoading extends LazyLoadingDisabled ? EagerPayment : LazyPayment

export declare const Payment: (new (init: ModelInit<Payment>) => Payment) & {
  copyOf(source: Payment, mutator: (draft: MutableModel<Payment>) => MutableModel<Payment> | void): Payment;
}

type EagerExpense = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Expense, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly transactionDate?: string | null;
  readonly amount: number;
  readonly description?: string | null;
  readonly referenceNumber?: string | null;
  readonly receiptDocumentS3Key?: string | null;
  readonly status?: string | null;
  readonly notes?: string | null;
  readonly payee?: string | null;
  readonly paymentMethod?: string | null;
  readonly checkNumber?: string | null;
  readonly approvedDate?: string | null;
  readonly type?: string | null;
  readonly category?: string | null;
  readonly account?: Account | null;
  readonly loans?: (LoanExpense | null)[] | null;
  readonly applications?: (ApplicationExpense | null)[] | null;
  readonly approvedByEmployees?: (ExpenseApprovedByEmployee | null)[] | null;
  readonly documents?: (ExpenseDocument | null)[] | null;
  readonly createdByEmployeeID?: string | null;
  readonly createdByEmployee?: Employee | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly accountExpensesId?: string | null;
}

type LazyExpense = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Expense, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly transactionDate?: string | null;
  readonly amount: number;
  readonly description?: string | null;
  readonly referenceNumber?: string | null;
  readonly receiptDocumentS3Key?: string | null;
  readonly status?: string | null;
  readonly notes?: string | null;
  readonly payee?: string | null;
  readonly paymentMethod?: string | null;
  readonly checkNumber?: string | null;
  readonly approvedDate?: string | null;
  readonly type?: string | null;
  readonly category?: string | null;
  readonly account: AsyncItem<Account | undefined>;
  readonly loans: AsyncCollection<LoanExpense>;
  readonly applications: AsyncCollection<ApplicationExpense>;
  readonly approvedByEmployees: AsyncCollection<ExpenseApprovedByEmployee>;
  readonly documents: AsyncCollection<ExpenseDocument>;
  readonly createdByEmployeeID?: string | null;
  readonly createdByEmployee: AsyncItem<Employee | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly accountExpensesId?: string | null;
}

export declare type Expense = LazyLoading extends LazyLoadingDisabled ? EagerExpense : LazyExpense

export declare const Expense: (new (init: ModelInit<Expense>) => Expense) & {
  copyOf(source: Expense, mutator: (draft: MutableModel<Expense>) => MutableModel<Expense> | void): Expense;
}

type EagerOtherIncome = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<OtherIncome, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly amount?: number | null;
  readonly incomeDate?: string | null;
  readonly incomeType?: string | null;
  readonly status?: string | null;
  readonly accounts?: (OtherIncomeAccount | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyOtherIncome = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<OtherIncome, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly amount?: number | null;
  readonly incomeDate?: string | null;
  readonly incomeType?: string | null;
  readonly status?: string | null;
  readonly accounts: AsyncCollection<OtherIncomeAccount>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type OtherIncome = LazyLoading extends LazyLoadingDisabled ? EagerOtherIncome : LazyOtherIncome

export declare const OtherIncome: (new (init: ModelInit<OtherIncome>) => OtherIncome) & {
  copyOf(source: OtherIncome, mutator: (draft: MutableModel<OtherIncome>) => MutableModel<OtherIncome> | void): OtherIncome;
}

type EagerFinancialReport = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<FinancialReport, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly reportName?: string | null;
  readonly reportType?: string | null;
  readonly reportDate?: string | null;
  readonly startDate?: string | null;
  readonly endDate?: string | null;
  readonly reportData?: string | null;
  readonly status?: string | null;
  readonly branch?: Branch | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly branchFinancialReportsId?: string | null;
}

type LazyFinancialReport = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<FinancialReport, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly reportName?: string | null;
  readonly reportType?: string | null;
  readonly reportDate?: string | null;
  readonly startDate?: string | null;
  readonly endDate?: string | null;
  readonly reportData?: string | null;
  readonly status?: string | null;
  readonly branch: AsyncItem<Branch | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly branchFinancialReportsId?: string | null;
}

export declare type FinancialReport = LazyLoading extends LazyLoadingDisabled ? EagerFinancialReport : LazyFinancialReport

export declare const FinancialReport: (new (init: ModelInit<FinancialReport>) => FinancialReport) & {
  copyOf(source: FinancialReport, mutator: (draft: MutableModel<FinancialReport>) => MutableModel<FinancialReport> | void): FinancialReport;
}

type EagerCustomFormField = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<CustomFormField, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly formKey?: string | null;
  readonly label?: string | null;
  readonly fieldType?: string | null;
  readonly options?: string | null;
  readonly required?: boolean | null;
  readonly order?: number | null;
  readonly createdBy?: string | null;
  readonly status?: string | null;
  readonly branch?: Branch | null;
  readonly institution?: Institution | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly institutionCustomFormFieldsId?: string | null;
  readonly branchCustomFormFieldsId?: string | null;
}

type LazyCustomFormField = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<CustomFormField, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly formKey?: string | null;
  readonly label?: string | null;
  readonly fieldType?: string | null;
  readonly options?: string | null;
  readonly required?: boolean | null;
  readonly order?: number | null;
  readonly createdBy?: string | null;
  readonly status?: string | null;
  readonly branch: AsyncItem<Branch | undefined>;
  readonly institution: AsyncItem<Institution | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly institutionCustomFormFieldsId?: string | null;
  readonly branchCustomFormFieldsId?: string | null;
}

export declare type CustomFormField = LazyLoading extends LazyLoadingDisabled ? EagerCustomFormField : LazyCustomFormField

export declare const CustomFormField: (new (init: ModelInit<CustomFormField>) => CustomFormField) & {
  copyOf(source: CustomFormField, mutator: (draft: MutableModel<CustomFormField>) => MutableModel<CustomFormField> | void): CustomFormField;
}

type EagerLoanFeesConfig = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoanFeesConfig, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly category?: string | null;
  readonly calculationMethod?: string | null;
  readonly description?: string | null;
  readonly percentageBase?: string | null;
  readonly rate?: number | null;
  readonly status?: string | null;
  readonly institution?: Institution | null;
  readonly branches?: (BranchLoanFeesConfig | null)[] | null;
  readonly loanFees?: (LoanFeesLoanFeesConfig | null)[] | null;
  readonly loanProducts?: (LoanProductLoanFeesConfig | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly institutionLoanFeesConfigsId?: string | null;
}

type LazyLoanFeesConfig = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoanFeesConfig, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly category?: string | null;
  readonly calculationMethod?: string | null;
  readonly description?: string | null;
  readonly percentageBase?: string | null;
  readonly rate?: number | null;
  readonly status?: string | null;
  readonly institution: AsyncItem<Institution | undefined>;
  readonly branches: AsyncCollection<BranchLoanFeesConfig>;
  readonly loanFees: AsyncCollection<LoanFeesLoanFeesConfig>;
  readonly loanProducts: AsyncCollection<LoanProductLoanFeesConfig>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly institutionLoanFeesConfigsId?: string | null;
}

export declare type LoanFeesConfig = LazyLoading extends LazyLoadingDisabled ? EagerLoanFeesConfig : LazyLoanFeesConfig

export declare const LoanFeesConfig: (new (init: ModelInit<LoanFeesConfig>) => LoanFeesConfig) & {
  copyOf(source: LoanFeesConfig, mutator: (draft: MutableModel<LoanFeesConfig>) => MutableModel<LoanFeesConfig> | void): LoanFeesConfig;
}

type EagerMessage = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Message, 'id'>;
    readOnlyFields: 'updatedAt';
  };
  readonly id: string;
  readonly subject?: string | null;
  readonly body?: string | null;
  readonly status?: string | null;
  readonly createdAt?: string | null;
  readonly sender?: User | null;
  readonly senderUserId: string;
  readonly recipient?: User | null;
  readonly recipientUserId: string;
  readonly updatedAt?: string | null;
}

type LazyMessage = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Message, 'id'>;
    readOnlyFields: 'updatedAt';
  };
  readonly id: string;
  readonly subject?: string | null;
  readonly body?: string | null;
  readonly status?: string | null;
  readonly createdAt?: string | null;
  readonly sender: AsyncItem<User | undefined>;
  readonly senderUserId: string;
  readonly recipient: AsyncItem<User | undefined>;
  readonly recipientUserId: string;
  readonly updatedAt?: string | null;
}

export declare type Message = LazyLoading extends LazyLoadingDisabled ? EagerMessage : LazyMessage

export declare const Message: (new (init: ModelInit<Message>) => Message) & {
  copyOf(source: Message, mutator: (draft: MutableModel<Message>) => MutableModel<Message> | void): Message;
}

type EagerNotification = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Notification, 'id'>;
    readOnlyFields: 'updatedAt';
  };
  readonly id: string;
  readonly subject?: string | null;
  readonly body?: string | null;
  readonly notificationType?: string | null;
  readonly approvalStatus?: string | null;
  readonly referenceId?: string | null;
  readonly status?: string | null;
  readonly createdAt?: string | null;
  readonly sender?: User | null;
  readonly senderUserId: string;
  readonly recipient?: User | null;
  readonly recipientUserId: string;
  readonly institutionMessagesId?: string | null;
  readonly updatedAt?: string | null;
}

type LazyNotification = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Notification, 'id'>;
    readOnlyFields: 'updatedAt';
  };
  readonly id: string;
  readonly subject?: string | null;
  readonly body?: string | null;
  readonly notificationType?: string | null;
  readonly approvalStatus?: string | null;
  readonly referenceId?: string | null;
  readonly status?: string | null;
  readonly createdAt?: string | null;
  readonly sender: AsyncItem<User | undefined>;
  readonly senderUserId: string;
  readonly recipient: AsyncItem<User | undefined>;
  readonly recipientUserId: string;
  readonly institutionMessagesId?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Notification = LazyLoading extends LazyLoadingDisabled ? EagerNotification : LazyNotification

export declare const Notification: (new (init: ModelInit<Notification>) => Notification) & {
  copyOf(source: Notification, mutator: (draft: MutableModel<Notification>) => MutableModel<Notification> | void): Notification;
}

type EagerAccountBranch = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<AccountBranch, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly branchId?: string | null;
  readonly accountId?: string | null;
  readonly branch: Branch;
  readonly account: Account;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyAccountBranch = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<AccountBranch, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly branchId?: string | null;
  readonly accountId?: string | null;
  readonly branch: AsyncItem<Branch>;
  readonly account: AsyncItem<Account>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type AccountBranch = LazyLoading extends LazyLoadingDisabled ? EagerAccountBranch : LazyAccountBranch

export declare const AccountBranch: (new (init: ModelInit<AccountBranch>) => AccountBranch) & {
  copyOf(source: AccountBranch, mutator: (draft: MutableModel<AccountBranch>) => MutableModel<AccountBranch> | void): AccountBranch;
}

type EagerBranchLoanProduct = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<BranchLoanProduct, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly branchId?: string | null;
  readonly loanProductId?: string | null;
  readonly branch: Branch;
  readonly loanProduct: LoanProduct;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyBranchLoanProduct = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<BranchLoanProduct, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly branchId?: string | null;
  readonly loanProductId?: string | null;
  readonly branch: AsyncItem<Branch>;
  readonly loanProduct: AsyncItem<LoanProduct>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type BranchLoanProduct = LazyLoading extends LazyLoadingDisabled ? EagerBranchLoanProduct : LazyBranchLoanProduct

export declare const BranchLoanProduct: (new (init: ModelInit<BranchLoanProduct>) => BranchLoanProduct) & {
  copyOf(source: BranchLoanProduct, mutator: (draft: MutableModel<BranchLoanProduct>) => MutableModel<BranchLoanProduct> | void): BranchLoanProduct;
}

type EagerBranchLoanFeesConfig = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<BranchLoanFeesConfig, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly branchId?: string | null;
  readonly loanFeesConfigId?: string | null;
  readonly branch: Branch;
  readonly loanFeesConfig: LoanFeesConfig;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyBranchLoanFeesConfig = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<BranchLoanFeesConfig, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly branchId?: string | null;
  readonly loanFeesConfigId?: string | null;
  readonly branch: AsyncItem<Branch>;
  readonly loanFeesConfig: AsyncItem<LoanFeesConfig>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type BranchLoanFeesConfig = LazyLoading extends LazyLoadingDisabled ? EagerBranchLoanFeesConfig : LazyBranchLoanFeesConfig

export declare const BranchLoanFeesConfig: (new (init: ModelInit<BranchLoanFeesConfig>) => BranchLoanFeesConfig) & {
  copyOf(source: BranchLoanFeesConfig, mutator: (draft: MutableModel<BranchLoanFeesConfig>) => MutableModel<BranchLoanFeesConfig> | void): BranchLoanFeesConfig;
}

type EagerPayrollEmployee = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PayrollEmployee, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly employeeId?: string | null;
  readonly payrollId?: string | null;
  readonly employee: Employee;
  readonly payroll: Payroll;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyPayrollEmployee = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PayrollEmployee, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly employeeId?: string | null;
  readonly payrollId?: string | null;
  readonly employee: AsyncItem<Employee>;
  readonly payroll: AsyncItem<Payroll>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type PayrollEmployee = LazyLoading extends LazyLoadingDisabled ? EagerPayrollEmployee : LazyPayrollEmployee

export declare const PayrollEmployee: (new (init: ModelInit<PayrollEmployee>) => PayrollEmployee) & {
  copyOf(source: PayrollEmployee, mutator: (draft: MutableModel<PayrollEmployee>) => MutableModel<PayrollEmployee> | void): PayrollEmployee;
}

type EagerLoanApprovedByEmployee = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoanApprovedByEmployee, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly employeeId?: string | null;
  readonly loanId?: string | null;
  readonly employee: Employee;
  readonly loan: Loan;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyLoanApprovedByEmployee = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoanApprovedByEmployee, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly employeeId?: string | null;
  readonly loanId?: string | null;
  readonly employee: AsyncItem<Employee>;
  readonly loan: AsyncItem<Loan>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type LoanApprovedByEmployee = LazyLoading extends LazyLoadingDisabled ? EagerLoanApprovedByEmployee : LazyLoanApprovedByEmployee

export declare const LoanApprovedByEmployee: (new (init: ModelInit<LoanApprovedByEmployee>) => LoanApprovedByEmployee) & {
  copyOf(source: LoanApprovedByEmployee, mutator: (draft: MutableModel<LoanApprovedByEmployee>) => MutableModel<LoanApprovedByEmployee> | void): LoanApprovedByEmployee;
}

type EagerExpenseApprovedByEmployee = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ExpenseApprovedByEmployee, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly employeeId?: string | null;
  readonly expenseId?: string | null;
  readonly employee: Employee;
  readonly expense: Expense;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyExpenseApprovedByEmployee = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ExpenseApprovedByEmployee, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly employeeId?: string | null;
  readonly expenseId?: string | null;
  readonly employee: AsyncItem<Employee>;
  readonly expense: AsyncItem<Expense>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ExpenseApprovedByEmployee = LazyLoading extends LazyLoadingDisabled ? EagerExpenseApprovedByEmployee : LazyExpenseApprovedByEmployee

export declare const ExpenseApprovedByEmployee: (new (init: ModelInit<ExpenseApprovedByEmployee>) => ExpenseApprovedByEmployee) & {
  copyOf(source: ExpenseApprovedByEmployee, mutator: (draft: MutableModel<ExpenseApprovedByEmployee>) => MutableModel<ExpenseApprovedByEmployee> | void): ExpenseApprovedByEmployee;
}

type EagerApplicationApprovedByEmployee = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ApplicationApprovedByEmployee, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly employeeId?: string | null;
  readonly applicationId?: string | null;
  readonly employee: Employee;
  readonly application: Application;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyApplicationApprovedByEmployee = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ApplicationApprovedByEmployee, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly employeeId?: string | null;
  readonly applicationId?: string | null;
  readonly employee: AsyncItem<Employee>;
  readonly application: AsyncItem<Application>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ApplicationApprovedByEmployee = LazyLoading extends LazyLoadingDisabled ? EagerApplicationApprovedByEmployee : LazyApplicationApprovedByEmployee

export declare const ApplicationApprovedByEmployee: (new (init: ModelInit<ApplicationApprovedByEmployee>) => ApplicationApprovedByEmployee) & {
  copyOf(source: ApplicationApprovedByEmployee, mutator: (draft: MutableModel<ApplicationApprovedByEmployee>) => MutableModel<ApplicationApprovedByEmployee> | void): ApplicationApprovedByEmployee;
}

type EagerCreditScoreApprovedByEmployee = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<CreditScoreApprovedByEmployee, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly employeeId?: string | null;
  readonly creditScoreId?: string | null;
  readonly employee: Employee;
  readonly creditScore: CreditScore;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyCreditScoreApprovedByEmployee = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<CreditScoreApprovedByEmployee, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly employeeId?: string | null;
  readonly creditScoreId?: string | null;
  readonly employee: AsyncItem<Employee>;
  readonly creditScore: AsyncItem<CreditScore>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type CreditScoreApprovedByEmployee = LazyLoading extends LazyLoadingDisabled ? EagerCreditScoreApprovedByEmployee : LazyCreditScoreApprovedByEmployee

export declare const CreditScoreApprovedByEmployee: (new (init: ModelInit<CreditScoreApprovedByEmployee>) => CreditScoreApprovedByEmployee) & {
  copyOf(source: CreditScoreApprovedByEmployee, mutator: (draft: MutableModel<CreditScoreApprovedByEmployee>) => MutableModel<CreditScoreApprovedByEmployee> | void): CreditScoreApprovedByEmployee;
}

type EagerMoneyTransactionApprovedByEmployee = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<MoneyTransactionApprovedByEmployee, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly employeeId?: string | null;
  readonly moneyTransactionId?: string | null;
  readonly employee: Employee;
  readonly moneyTransaction: MoneyTransaction;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyMoneyTransactionApprovedByEmployee = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<MoneyTransactionApprovedByEmployee, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly employeeId?: string | null;
  readonly moneyTransactionId?: string | null;
  readonly employee: AsyncItem<Employee>;
  readonly moneyTransaction: AsyncItem<MoneyTransaction>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type MoneyTransactionApprovedByEmployee = LazyLoading extends LazyLoadingDisabled ? EagerMoneyTransactionApprovedByEmployee : LazyMoneyTransactionApprovedByEmployee

export declare const MoneyTransactionApprovedByEmployee: (new (init: ModelInit<MoneyTransactionApprovedByEmployee>) => MoneyTransactionApprovedByEmployee) & {
  copyOf(source: MoneyTransactionApprovedByEmployee, mutator: (draft: MutableModel<MoneyTransactionApprovedByEmployee>) => MutableModel<MoneyTransactionApprovedByEmployee> | void): MoneyTransactionApprovedByEmployee;
}

type EagerPaymentApprovedByEmployee = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PaymentApprovedByEmployee, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly employeeId?: string | null;
  readonly paymentId?: string | null;
  readonly employee: Employee;
  readonly payment: Payment;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyPaymentApprovedByEmployee = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PaymentApprovedByEmployee, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly employeeId?: string | null;
  readonly paymentId?: string | null;
  readonly employee: AsyncItem<Employee>;
  readonly payment: AsyncItem<Payment>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type PaymentApprovedByEmployee = LazyLoading extends LazyLoadingDisabled ? EagerPaymentApprovedByEmployee : LazyPaymentApprovedByEmployee

export declare const PaymentApprovedByEmployee: (new (init: ModelInit<PaymentApprovedByEmployee>) => PaymentApprovedByEmployee) & {
  copyOf(source: PaymentApprovedByEmployee, mutator: (draft: MutableModel<PaymentApprovedByEmployee>) => MutableModel<PaymentApprovedByEmployee> | void): PaymentApprovedByEmployee;
}

type EagerBorrowerLoanOfficer = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<BorrowerLoanOfficer, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly employeeId?: string | null;
  readonly borrowerId?: string | null;
  readonly employee: Employee;
  readonly borrower: Borrower;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyBorrowerLoanOfficer = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<BorrowerLoanOfficer, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly employeeId?: string | null;
  readonly borrowerId?: string | null;
  readonly employee: AsyncItem<Employee>;
  readonly borrower: AsyncItem<Borrower>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type BorrowerLoanOfficer = LazyLoading extends LazyLoadingDisabled ? EagerBorrowerLoanOfficer : LazyBorrowerLoanOfficer

export declare const BorrowerLoanOfficer: (new (init: ModelInit<BorrowerLoanOfficer>) => BorrowerLoanOfficer) & {
  copyOf(source: BorrowerLoanOfficer, mutator: (draft: MutableModel<BorrowerLoanOfficer>) => MutableModel<BorrowerLoanOfficer> | void): BorrowerLoanOfficer;
}

type EagerBorrowerDocument = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<BorrowerDocument, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly borrowerId?: string | null;
  readonly documentId?: string | null;
  readonly borrower: Borrower;
  readonly document: Document;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyBorrowerDocument = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<BorrowerDocument, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly borrowerId?: string | null;
  readonly documentId?: string | null;
  readonly borrower: AsyncItem<Borrower>;
  readonly document: AsyncItem<Document>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type BorrowerDocument = LazyLoading extends LazyLoadingDisabled ? EagerBorrowerDocument : LazyBorrowerDocument

export declare const BorrowerDocument: (new (init: ModelInit<BorrowerDocument>) => BorrowerDocument) & {
  copyOf(source: BorrowerDocument, mutator: (draft: MutableModel<BorrowerDocument>) => MutableModel<BorrowerDocument> | void): BorrowerDocument;
}

type EagerLoanGuarantor = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoanGuarantor, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly guarantorId?: string | null;
  readonly loanId?: string | null;
  readonly guarantor: Guarantor;
  readonly loan: Loan;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyLoanGuarantor = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoanGuarantor, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly guarantorId?: string | null;
  readonly loanId?: string | null;
  readonly guarantor: AsyncItem<Guarantor>;
  readonly loan: AsyncItem<Loan>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type LoanGuarantor = LazyLoading extends LazyLoadingDisabled ? EagerLoanGuarantor : LazyLoanGuarantor

export declare const LoanGuarantor: (new (init: ModelInit<LoanGuarantor>) => LoanGuarantor) & {
  copyOf(source: LoanGuarantor, mutator: (draft: MutableModel<LoanGuarantor>) => MutableModel<LoanGuarantor> | void): LoanGuarantor;
}

type EagerApplicationGuarantor = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ApplicationGuarantor, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly guarantorId?: string | null;
  readonly applicationId?: string | null;
  readonly guarantor: Guarantor;
  readonly application: Application;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyApplicationGuarantor = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ApplicationGuarantor, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly guarantorId?: string | null;
  readonly applicationId?: string | null;
  readonly guarantor: AsyncItem<Guarantor>;
  readonly application: AsyncItem<Application>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ApplicationGuarantor = LazyLoading extends LazyLoadingDisabled ? EagerApplicationGuarantor : LazyApplicationGuarantor

export declare const ApplicationGuarantor: (new (init: ModelInit<ApplicationGuarantor>) => ApplicationGuarantor) & {
  copyOf(source: ApplicationGuarantor, mutator: (draft: MutableModel<ApplicationGuarantor>) => MutableModel<ApplicationGuarantor> | void): ApplicationGuarantor;
}

type EagerLoanProductLoanFees = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoanProductLoanFees, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly loanProductId?: string | null;
  readonly loanFeesId?: string | null;
  readonly loanProduct: LoanProduct;
  readonly loanFees: LoanFees;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyLoanProductLoanFees = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoanProductLoanFees, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly loanProductId?: string | null;
  readonly loanFeesId?: string | null;
  readonly loanProduct: AsyncItem<LoanProduct>;
  readonly loanFees: AsyncItem<LoanFees>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type LoanProductLoanFees = LazyLoading extends LazyLoadingDisabled ? EagerLoanProductLoanFees : LazyLoanProductLoanFees

export declare const LoanProductLoanFees: (new (init: ModelInit<LoanProductLoanFees>) => LoanProductLoanFees) & {
  copyOf(source: LoanProductLoanFees, mutator: (draft: MutableModel<LoanProductLoanFees>) => MutableModel<LoanProductLoanFees> | void): LoanProductLoanFees;
}

type EagerLoanProductLoanFeesConfig = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoanProductLoanFeesConfig, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly loanProductId?: string | null;
  readonly loanFeesConfigId?: string | null;
  readonly loanProduct: LoanProduct;
  readonly loanFeesConfig: LoanFeesConfig;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyLoanProductLoanFeesConfig = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoanProductLoanFeesConfig, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly loanProductId?: string | null;
  readonly loanFeesConfigId?: string | null;
  readonly loanProduct: AsyncItem<LoanProduct>;
  readonly loanFeesConfig: AsyncItem<LoanFeesConfig>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type LoanProductLoanFeesConfig = LazyLoading extends LazyLoadingDisabled ? EagerLoanProductLoanFeesConfig : LazyLoanProductLoanFeesConfig

export declare const LoanProductLoanFeesConfig: (new (init: ModelInit<LoanProductLoanFeesConfig>) => LoanProductLoanFeesConfig) & {
  copyOf(source: LoanProductLoanFeesConfig, mutator: (draft: MutableModel<LoanProductLoanFeesConfig>) => MutableModel<LoanProductLoanFeesConfig> | void): LoanProductLoanFeesConfig;
}

type EagerLoanProductPenalty = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoanProductPenalty, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly loanProductId?: string | null;
  readonly penaltyId?: string | null;
  readonly loanProduct: LoanProduct;
  readonly penalty: Penalty;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyLoanProductPenalty = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoanProductPenalty, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly loanProductId?: string | null;
  readonly penaltyId?: string | null;
  readonly loanProduct: AsyncItem<LoanProduct>;
  readonly penalty: AsyncItem<Penalty>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type LoanProductPenalty = LazyLoading extends LazyLoadingDisabled ? EagerLoanProductPenalty : LazyLoanProductPenalty

export declare const LoanProductPenalty: (new (init: ModelInit<LoanProductPenalty>) => LoanProductPenalty) & {
  copyOf(source: LoanProductPenalty, mutator: (draft: MutableModel<LoanProductPenalty>) => MutableModel<LoanProductPenalty> | void): LoanProductPenalty;
}

type EagerLoanDocument = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoanDocument, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly documentId?: string | null;
  readonly loanId?: string | null;
  readonly document: Document;
  readonly loan: Loan;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyLoanDocument = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoanDocument, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly documentId?: string | null;
  readonly loanId?: string | null;
  readonly document: AsyncItem<Document>;
  readonly loan: AsyncItem<Loan>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type LoanDocument = LazyLoading extends LazyLoadingDisabled ? EagerLoanDocument : LazyLoanDocument

export declare const LoanDocument: (new (init: ModelInit<LoanDocument>) => LoanDocument) & {
  copyOf(source: LoanDocument, mutator: (draft: MutableModel<LoanDocument>) => MutableModel<LoanDocument> | void): LoanDocument;
}

type EagerApplicationDocument = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ApplicationDocument, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly documentId?: string | null;
  readonly applicationId?: string | null;
  readonly document: Document;
  readonly application: Application;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyApplicationDocument = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ApplicationDocument, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly documentId?: string | null;
  readonly applicationId?: string | null;
  readonly document: AsyncItem<Document>;
  readonly application: AsyncItem<Application>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ApplicationDocument = LazyLoading extends LazyLoadingDisabled ? EagerApplicationDocument : LazyApplicationDocument

export declare const ApplicationDocument: (new (init: ModelInit<ApplicationDocument>) => ApplicationDocument) & {
  copyOf(source: ApplicationDocument, mutator: (draft: MutableModel<ApplicationDocument>) => MutableModel<ApplicationDocument> | void): ApplicationDocument;
}

type EagerContractDocument = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ContractDocument, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly documentId?: string | null;
  readonly contractId?: string | null;
  readonly document: Document;
  readonly contract: Contract;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyContractDocument = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ContractDocument, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly documentId?: string | null;
  readonly contractId?: string | null;
  readonly document: AsyncItem<Document>;
  readonly contract: AsyncItem<Contract>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ContractDocument = LazyLoading extends LazyLoadingDisabled ? EagerContractDocument : LazyContractDocument

export declare const ContractDocument: (new (init: ModelInit<ContractDocument>) => ContractDocument) & {
  copyOf(source: ContractDocument, mutator: (draft: MutableModel<ContractDocument>) => MutableModel<ContractDocument> | void): ContractDocument;
}

type EagerExpenseDocument = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ExpenseDocument, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly documentId?: string | null;
  readonly expenseId?: string | null;
  readonly document: Document;
  readonly expense: Expense;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyExpenseDocument = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ExpenseDocument, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly documentId?: string | null;
  readonly expenseId?: string | null;
  readonly document: AsyncItem<Document>;
  readonly expense: AsyncItem<Expense>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ExpenseDocument = LazyLoading extends LazyLoadingDisabled ? EagerExpenseDocument : LazyExpenseDocument

export declare const ExpenseDocument: (new (init: ModelInit<ExpenseDocument>) => ExpenseDocument) & {
  copyOf(source: ExpenseDocument, mutator: (draft: MutableModel<ExpenseDocument>) => MutableModel<ExpenseDocument> | void): ExpenseDocument;
}

type EagerPaymentDocument = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PaymentDocument, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly documentId?: string | null;
  readonly paymentId?: string | null;
  readonly document: Document;
  readonly payment: Payment;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyPaymentDocument = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PaymentDocument, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly documentId?: string | null;
  readonly paymentId?: string | null;
  readonly document: AsyncItem<Document>;
  readonly payment: AsyncItem<Payment>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type PaymentDocument = LazyLoading extends LazyLoadingDisabled ? EagerPaymentDocument : LazyPaymentDocument

export declare const PaymentDocument: (new (init: ModelInit<PaymentDocument>) => PaymentDocument) & {
  copyOf(source: PaymentDocument, mutator: (draft: MutableModel<PaymentDocument>) => MutableModel<PaymentDocument> | void): PaymentDocument;
}

type EagerMoneyTransactionDocument = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<MoneyTransactionDocument, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly documentId?: string | null;
  readonly moneyTransactionId?: string | null;
  readonly document: Document;
  readonly moneyTransaction: MoneyTransaction;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyMoneyTransactionDocument = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<MoneyTransactionDocument, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly documentId?: string | null;
  readonly moneyTransactionId?: string | null;
  readonly document: AsyncItem<Document>;
  readonly moneyTransaction: AsyncItem<MoneyTransaction>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type MoneyTransactionDocument = LazyLoading extends LazyLoadingDisabled ? EagerMoneyTransactionDocument : LazyMoneyTransactionDocument

export declare const MoneyTransactionDocument: (new (init: ModelInit<MoneyTransactionDocument>) => MoneyTransactionDocument) & {
  copyOf(source: MoneyTransactionDocument, mutator: (draft: MutableModel<MoneyTransactionDocument>) => MutableModel<MoneyTransactionDocument> | void): MoneyTransactionDocument;
}

type EagerApplicationContract = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ApplicationContract, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly contractId?: string | null;
  readonly applicationId?: string | null;
  readonly contract: Contract;
  readonly application: Application;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyApplicationContract = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ApplicationContract, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly contractId?: string | null;
  readonly applicationId?: string | null;
  readonly contract: AsyncItem<Contract>;
  readonly application: AsyncItem<Application>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ApplicationContract = LazyLoading extends LazyLoadingDisabled ? EagerApplicationContract : LazyApplicationContract

export declare const ApplicationContract: (new (init: ModelInit<ApplicationContract>) => ApplicationContract) & {
  copyOf(source: ApplicationContract, mutator: (draft: MutableModel<ApplicationContract>) => MutableModel<ApplicationContract> | void): ApplicationContract;
}

type EagerCollateralContract = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<CollateralContract, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly contractId?: string | null;
  readonly collateralId?: string | null;
  readonly contract: Contract;
  readonly collateral: Collateral;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyCollateralContract = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<CollateralContract, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly contractId?: string | null;
  readonly collateralId?: string | null;
  readonly contract: AsyncItem<Contract>;
  readonly collateral: AsyncItem<Collateral>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type CollateralContract = LazyLoading extends LazyLoadingDisabled ? EagerCollateralContract : LazyCollateralContract

export declare const CollateralContract: (new (init: ModelInit<CollateralContract>) => CollateralContract) & {
  copyOf(source: CollateralContract, mutator: (draft: MutableModel<CollateralContract>) => MutableModel<CollateralContract> | void): CollateralContract;
}

type EagerLoanContract = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoanContract, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly contractId?: string | null;
  readonly loanId?: string | null;
  readonly contract: Contract;
  readonly loan: Loan;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyLoanContract = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoanContract, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly contractId?: string | null;
  readonly loanId?: string | null;
  readonly contract: AsyncItem<Contract>;
  readonly loan: AsyncItem<Loan>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type LoanContract = LazyLoading extends LazyLoadingDisabled ? EagerLoanContract : LazyLoanContract

export declare const LoanContract: (new (init: ModelInit<LoanContract>) => LoanContract) & {
  copyOf(source: LoanContract, mutator: (draft: MutableModel<LoanContract>) => MutableModel<LoanContract> | void): LoanContract;
}

type EagerApplicationCollateral = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ApplicationCollateral, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly applicationId?: string | null;
  readonly collateralId?: string | null;
  readonly application: Application;
  readonly collateral: Collateral;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyApplicationCollateral = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ApplicationCollateral, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly applicationId?: string | null;
  readonly collateralId?: string | null;
  readonly application: AsyncItem<Application>;
  readonly collateral: AsyncItem<Collateral>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ApplicationCollateral = LazyLoading extends LazyLoadingDisabled ? EagerApplicationCollateral : LazyApplicationCollateral

export declare const ApplicationCollateral: (new (init: ModelInit<ApplicationCollateral>) => ApplicationCollateral) & {
  copyOf(source: ApplicationCollateral, mutator: (draft: MutableModel<ApplicationCollateral>) => MutableModel<ApplicationCollateral> | void): ApplicationCollateral;
}

type EagerApplicationExpense = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ApplicationExpense, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly applicationId?: string | null;
  readonly expenseId?: string | null;
  readonly application: Application;
  readonly expense: Expense;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyApplicationExpense = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ApplicationExpense, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly applicationId?: string | null;
  readonly expenseId?: string | null;
  readonly application: AsyncItem<Application>;
  readonly expense: AsyncItem<Expense>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ApplicationExpense = LazyLoading extends LazyLoadingDisabled ? EagerApplicationExpense : LazyApplicationExpense

export declare const ApplicationExpense: (new (init: ModelInit<ApplicationExpense>) => ApplicationExpense) & {
  copyOf(source: ApplicationExpense, mutator: (draft: MutableModel<ApplicationExpense>) => MutableModel<ApplicationExpense> | void): ApplicationExpense;
}

type EagerLoanApplication = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoanApplication, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly applicationId?: string | null;
  readonly loanId?: string | null;
  readonly application: Application;
  readonly loan: Loan;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyLoanApplication = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoanApplication, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly applicationId?: string | null;
  readonly loanId?: string | null;
  readonly application: AsyncItem<Application>;
  readonly loan: AsyncItem<Loan>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type LoanApplication = LazyLoading extends LazyLoadingDisabled ? EagerLoanApplication : LazyLoanApplication

export declare const LoanApplication: (new (init: ModelInit<LoanApplication>) => LoanApplication) & {
  copyOf(source: LoanApplication, mutator: (draft: MutableModel<LoanApplication>) => MutableModel<LoanApplication> | void): LoanApplication;
}

type EagerLoanCollateral = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoanCollateral, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly collateralId?: string | null;
  readonly loanId?: string | null;
  readonly collateral: Collateral;
  readonly loan: Loan;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyLoanCollateral = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoanCollateral, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly collateralId?: string | null;
  readonly loanId?: string | null;
  readonly collateral: AsyncItem<Collateral>;
  readonly loan: AsyncItem<Loan>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type LoanCollateral = LazyLoading extends LazyLoadingDisabled ? EagerLoanCollateral : LazyLoanCollateral

export declare const LoanCollateral: (new (init: ModelInit<LoanCollateral>) => LoanCollateral) & {
  copyOf(source: LoanCollateral, mutator: (draft: MutableModel<LoanCollateral>) => MutableModel<LoanCollateral> | void): LoanCollateral;
}

type EagerLoanAccount = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoanAccount, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly loanId?: string | null;
  readonly accountId?: string | null;
  readonly loan: Loan;
  readonly account: Account;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyLoanAccount = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoanAccount, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly loanId?: string | null;
  readonly accountId?: string | null;
  readonly loan: AsyncItem<Loan>;
  readonly account: AsyncItem<Account>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type LoanAccount = LazyLoading extends LazyLoadingDisabled ? EagerLoanAccount : LazyLoanAccount

export declare const LoanAccount: (new (init: ModelInit<LoanAccount>) => LoanAccount) & {
  copyOf(source: LoanAccount, mutator: (draft: MutableModel<LoanAccount>) => MutableModel<LoanAccount> | void): LoanAccount;
}

type EagerLoanExpense = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoanExpense, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly loanId?: string | null;
  readonly expenseId?: string | null;
  readonly loan: Loan;
  readonly expense: Expense;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyLoanExpense = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoanExpense, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly loanId?: string | null;
  readonly expenseId?: string | null;
  readonly loan: AsyncItem<Loan>;
  readonly expense: AsyncItem<Expense>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type LoanExpense = LazyLoading extends LazyLoadingDisabled ? EagerLoanExpense : LazyLoanExpense

export declare const LoanExpense: (new (init: ModelInit<LoanExpense>) => LoanExpense) & {
  copyOf(source: LoanExpense, mutator: (draft: MutableModel<LoanExpense>) => MutableModel<LoanExpense> | void): LoanExpense;
}

type EagerInvestmentAccount = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<InvestmentAccount, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly investmentId?: string | null;
  readonly accountId?: string | null;
  readonly investment: Investment;
  readonly account: Account;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyInvestmentAccount = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<InvestmentAccount, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly investmentId?: string | null;
  readonly accountId?: string | null;
  readonly investment: AsyncItem<Investment>;
  readonly account: AsyncItem<Account>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type InvestmentAccount = LazyLoading extends LazyLoadingDisabled ? EagerInvestmentAccount : LazyInvestmentAccount

export declare const InvestmentAccount: (new (init: ModelInit<InvestmentAccount>) => InvestmentAccount) & {
  copyOf(source: InvestmentAccount, mutator: (draft: MutableModel<InvestmentAccount>) => MutableModel<InvestmentAccount> | void): InvestmentAccount;
}

type EagerLoanFeesLoanFeesConfig = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoanFeesLoanFeesConfig, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly loanFeesId?: string | null;
  readonly loanFeesConfigId?: string | null;
  readonly loanFees: LoanFees;
  readonly loanFeesConfig: LoanFeesConfig;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyLoanFeesLoanFeesConfig = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LoanFeesLoanFeesConfig, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly loanFeesId?: string | null;
  readonly loanFeesConfigId?: string | null;
  readonly loanFees: AsyncItem<LoanFees>;
  readonly loanFeesConfig: AsyncItem<LoanFeesConfig>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type LoanFeesLoanFeesConfig = LazyLoading extends LazyLoadingDisabled ? EagerLoanFeesLoanFeesConfig : LazyLoanFeesLoanFeesConfig

export declare const LoanFeesLoanFeesConfig: (new (init: ModelInit<LoanFeesLoanFeesConfig>) => LoanFeesLoanFeesConfig) & {
  copyOf(source: LoanFeesLoanFeesConfig, mutator: (draft: MutableModel<LoanFeesLoanFeesConfig>) => MutableModel<LoanFeesLoanFeesConfig> | void): LoanFeesLoanFeesConfig;
}

type EagerOtherIncomeAccount = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<OtherIncomeAccount, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly accountId?: string | null;
  readonly otherIncomeId?: string | null;
  readonly account: Account;
  readonly otherIncome: OtherIncome;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyOtherIncomeAccount = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<OtherIncomeAccount, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly accountId?: string | null;
  readonly otherIncomeId?: string | null;
  readonly account: AsyncItem<Account>;
  readonly otherIncome: AsyncItem<OtherIncome>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type OtherIncomeAccount = LazyLoading extends LazyLoadingDisabled ? EagerOtherIncomeAccount : LazyOtherIncomeAccount

export declare const OtherIncomeAccount: (new (init: ModelInit<OtherIncomeAccount>) => OtherIncomeAccount) & {
  copyOf(source: OtherIncomeAccount, mutator: (draft: MutableModel<OtherIncomeAccount>) => MutableModel<OtherIncomeAccount> | void): OtherIncomeAccount;
}