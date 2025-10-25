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

const { Institution, Branch, User, Employee, Borrower, Guarantor, Security, UserNotification, LoanProduct, CreditScore, Document, Contract, Application, Collateral, Loan, Investment, LoanFees, Penalty, Payroll, Account, MoneyTransaction, Payment, Expense, OtherIncome, FinancialReport, CustomFormField, LoanFeesConfig, Message, Notification, BranchLoanProduct, BranchLoanFeesConfig, PayrollEmployee, LoanApprovedByEmployee, ExpenseApprovedByEmployee, ApplicationApprovedByEmployee, CreditScoreApprovedByEmployee, MoneyTransactionApprovedByEmployee, PaymentApprovedByEmployee, BorrowerLoanOfficer, BorrowerDocument, LoanGuarantor, ApplicationGuarantor, LoanProductLoanFees, LoanProductPenalty, LoanDocument, ApplicationDocument, ContractDocument, ExpenseDocument, PaymentDocument, ApplicationContract, CollateralContract, LoanContract, ApplicationCollateral, ApplicationExpense, LoanApplication, LoanCollateral, LoanAccount, LoanExpense, InvestmentAccount, LoanFeesLoanFeesConfig, OtherIncomeAccount } = initSchema(schema);

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
  LoanProductPenalty,
  LoanDocument,
  ApplicationDocument,
  ContractDocument,
  ExpenseDocument,
  PaymentDocument,
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
  Frequency
};