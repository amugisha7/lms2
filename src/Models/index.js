// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const InterestCalculationMethod = {
  "SIMPLE": "SIMPLE",
  "COMPOUND": "COMPOUND",
  "FLAT": "FLAT"
};

const Frequency = {
  "DAILY": "DAILY",
  "WEEKLY": "WEEKLY",
  "BIWEEKLY": "BIWEEKLY",
  "MONTHLY": "MONTHLY",
  "QUARTERLY": "QUARTERLY",
  "SEMIANNUALLY": "SEMIANNUALLY",
  "ANNUALLY": "ANNUALLY"
};

const LoanStatus = {
  "DRAFT": "DRAFT",
  "APPROVED": "APPROVED",
  "ACTIVE": "ACTIVE",
  "CLOSED": "CLOSED",
  "WRITTEN_OFF": "WRITTEN_OFF",
  "VOIDED": "VOIDED"
};

const LoanApprovalStatus = {
  "PENDING": "PENDING",
  "APPROVED": "APPROVED",
  "REJECTED": "REJECTED"
};

const InstallmentStatus = {
  "PENDING": "PENDING",
  "PARTIALLY_PAID": "PARTIALLY_PAID",
  "PAID": "PAID",
  "OVERDUE": "OVERDUE"
};

const DisbursementStatus = {
  "PENDING": "PENDING",
  "COMPLETED": "COMPLETED",
  "FAILED": "FAILED"
};

const PaymentStatus = {
  "PENDING": "PENDING",
  "COMPLETED": "COMPLETED",
  "REVERSED": "REVERSED",
  "FAILED": "FAILED"
};

const LoanEventType = {
  "CREATED": "CREATED",
  "APPROVED": "APPROVED",
  "DISBURSED": "DISBURSED",
  "PAYMENT_POSTED": "PAYMENT_POSTED",
  "PAYMENT_REVERSED": "PAYMENT_REVERSED",
  "STATUS_CHANGED": "STATUS_CHANGED",
  "OTHER": "OTHER"
};

const { Institution, Branch, User, Employee, Borrower, Guarantor, Security, UserNotification, LoanProduct, CreditScore, Document, Contract, Application, Collateral, Loan, LoanInstallment, LoanDisbursement, LoanEvent, LoanBalanceSnapshot, Investment, LoanFees, Penalty, Payroll, Account, MoneyTransaction, Payment, Expense, OtherIncome, FinancialReport, CustomFormField, LoanFeesConfig, Message, Notification, AccountBranch, BranchLoanProduct, BranchLoanFeesConfig, PayrollEmployee, LoanApprovedByEmployee, ExpenseApprovedByEmployee, ApplicationApprovedByEmployee, CreditScoreApprovedByEmployee, MoneyTransactionApprovedByEmployee, PaymentApprovedByEmployee, BorrowerLoanOfficer, BorrowerDocument, LoanGuarantor, ApplicationGuarantor, LoanProductLoanFees, LoanProductLoanFeesConfig, LoanProductPenalty, LoanDocument, ApplicationDocument, ContractDocument, ExpenseDocument, PaymentDocument, MoneyTransactionDocument, ApplicationContract, CollateralContract, LoanContract, ApplicationCollateral, ApplicationExpense, LoanApplication, LoanCollateral, LoanAccount, LoanExpense, InvestmentAccount, LoanFeesLoanFeesConfig, OtherIncomeAccount } = initSchema(schema);

export {
  Institution,
  Branch,
  User,
  Employee,
  Borrower,
  Guarantor,
  Security,
  UserNotification,
  LoanProduct,
  CreditScore,
  Document,
  Contract,
  Application,
  Collateral,
  Loan,
  LoanInstallment,
  LoanDisbursement,
  LoanEvent,
  LoanBalanceSnapshot,
  Investment,
  LoanFees,
  Penalty,
  Payroll,
  Account,
  MoneyTransaction,
  Payment,
  Expense,
  OtherIncome,
  FinancialReport,
  CustomFormField,
  LoanFeesConfig,
  Message,
  Notification,
  AccountBranch,
  BranchLoanProduct,
  BranchLoanFeesConfig,
  PayrollEmployee,
  LoanApprovedByEmployee,
  ExpenseApprovedByEmployee,
  ApplicationApprovedByEmployee,
  CreditScoreApprovedByEmployee,
  MoneyTransactionApprovedByEmployee,
  PaymentApprovedByEmployee,
  BorrowerLoanOfficer,
  BorrowerDocument,
  LoanGuarantor,
  ApplicationGuarantor,
  LoanProductLoanFees,
  LoanProductLoanFeesConfig,
  LoanProductPenalty,
  LoanDocument,
  ApplicationDocument,
  ContractDocument,
  ExpenseDocument,
  PaymentDocument,
  MoneyTransactionDocument,
  ApplicationContract,
  CollateralContract,
  LoanContract,
  ApplicationCollateral,
  ApplicationExpense,
  LoanApplication,
  LoanCollateral,
  LoanAccount,
  LoanExpense,
  InvestmentAccount,
  LoanFeesLoanFeesConfig,
  OtherIncomeAccount,
  InterestCalculationMethod,
  Frequency,
  LoanStatus,
  LoanApprovalStatus,
  InstallmentStatus,
  DisbursementStatus,
  PaymentStatus,
  LoanEventType
};