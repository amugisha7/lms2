You are implementing the Loans module of a React + AWS Amplify (GraphQL) Loan Management System this repo. Use the instructions below, inspect the workspace, then implement everything end-to-end.

**Goal**

- Deliver an enterprise-grade Loans module with fully integrated Payments:
  - Loans have schedules (installments), disbursements, audit events, and balance snapshots.
  - Payments are posted against a loan (and optionally against installments), automatically allocate amounts, update loan/installment status, and create linked accounting transactions.
- Repo structure requirements:
  - All loan-related UI/helpers stay under src/Models/Loans.
  - All payment-related UI/helpers/components live under src/Models/Payments.
  - Do not leave payment UI inside Loans folders.

**What you must do (high-level)**

1. Inspect current Loans UI and helpers under src/Models/Loans and identify schema/UI field mismatches. Fix those mismatches as part of this work (do not ignore).
2. Update the Amplify GraphQL schema to support:
   - Loan schedules (installments)
   - Disbursements
   - Payment allocation (principal/interest/fees/penalty)
   - Loan audit/events
   - Balance snapshots (or a minimal ledger)
   - Direct linkage between Payment and Loan and optionally LoanInstallment
   - Direct linkage between MoneyTransaction and Loan/Payment/Disbursement (do not rely only on free-form strings)
3. Regenerate models and GraphQL operations after schema changes.
4. Implement Loans screens/workflows:
   - Create loan (borrower + loan product template + terms snapshot)
   - Approve (simple approval flow)
   - Disburse (create LoanDisbursement and link to MoneyTransaction if used)
   - Loan detail (schedule + balances + payments list + events)
5. Implement Payments under src/Models/Payments:
   - Payment creation/posting UI and helpers
   - Payment allocation logic
   - Reverse/void payment (minimum: mark reversed + append event; update balances)
6. Wire Loans ↔ Payments:
   - From a loan detail screen, user can post a payment using Payments module components
   - Loan views reflect posted payments immediately (schedule updated, balances updated, events appended)
7. Update routing/imports so the moved Payments module works (update any references across the app).

**Non-goals / constraints**

- Only work on Loans + Payments integration required for Loans servicing. Do not expand unrelated modules.
- Do not add new “nice-to-have” pages beyond what’s necessary for the loans + payments lifecycle.
- Keep UI consistent with existing component patterns in the repo.

**Hard requirements (must-follow)**

1. Payments must post to Accounts:
   - Every posted Payment must require/select an Account and persist `accountID` so it appears under the Account’s `payments` relationship and is included in account balances.
   - Avoid double-posting: if the app’s Account balance already treats `Payment` as the cash movement, do NOT also create a `MoneyTransaction` for the same repayment unless you update the balance computation to prevent double counting.
2. Exports:
   - Enable PDF export in A4 format for at least: loan statement, payment plan (schedule), and payments history.
   - Use existing repo patterns/utilities for printing/export if present; keep styling consistent with the app.
3. Forms:
   - When building forms, use the reusable controls in `src/Resources/FormComponents` (e.g., `TextInput`, `NumberInput`, `DateInput`, `Dropdown`, etc.) rather than ad-hoc inputs.
4. GraphQL operations:
   - Queries and mutations must be custom-written and placed in module helper files.
   - Do not import/consume auto-generated operations from `src/graphql/*`.
5. Styling:
   - Match existing repo UI structure (e.g., use existing template/components from src/ModelAssets like `CollectionsTemplate`, `CustomPopUp`, `CustomSlider`,`NotificationBar`, existing buttons, and the MUI theme patterns already used).

### A) Required schema changes (implement these in amplify/backend/api/lms2/schema.graphql)

1. Add enums (keep existing String statuses for backward compatibility during transition):
   - LoanStatus, LoanApprovalStatus, InstallmentStatus, DisbursementStatus, PaymentStatus, LoanEventType.
2. Extend Loan:
   - Add loanNumber (indexed for lookup; enforce uniqueness in app logic).
   - Add borrowerID (reuse the existing FK used by the current belongsTo) and define borrower belongsTo via borrowerID.
   - Add branchID (denormalized) + branch belongsTo for branch-based queries.
   - Add loanStatusEnum and approvalStatusEnum (do not remove existing string fields yet).
   - Add hasMany links to: LoanInstallment, LoanDisbursement, LoanEvent, LoanBalanceSnapshot via indexed FK fields.
   - Add indexes to support:
     - list loans by borrower (sorted by maturity or start date)
     - list loans by branch (sorted by maturity or start date)
     - list loans by status (sorted by maturity)
3. Add new models (minimal enterprise servicing set):
   - LoanInstallment: loanID index sorted by dueDate; store due amounts + paid amounts; status enum; optional calculationRecord JSON.
   - LoanDisbursement: loanID index sorted by disbursedAt; store amount/status/method/reference; optional accountID; optional moneyTransactionID.
   - LoanEvent: loanID index sorted by eventAt; store eventType, actorEmployeeID, summary, payload JSON; optional paymentID/installmentID/disbursementID links.
   - LoanBalanceSnapshot: loanID index sorted by asOfAt; store outstanding breakdown + daysPastDue + snapshotRecord JSON.
4. Update Payment to be loan-first:
   - Add loanID index sorted by paymentDate; define loan belongsTo via loanID (avoid FK collisions; reuse existing where present).
   - Add installmentID (optional) belongsTo LoanInstallment.
   - Add moneyTransactionID (optional) for accounting linkage.
   - Add paymentStatusEnum alongside existing status.
   - Ensure `accountID` remains required at the UI level for all posted repayments (Payments must land in Accounts).
5. Update MoneyTransaction for traceability:
   - Add loanID index sorted by transactionDate.
   - Add optional paymentID, disbursementID, installmentID indexes.
   - Keep existing relatedEntityType string for legacy but prefer explicit IDs in new writes.

After schema edits:

- Run Amplify push and regenerate models/ops (use repo’s existing commands).
- Ensure generated models compile.

### B) Repo refactor requirements (Payments module location)

1. Create a Payments module folder: src/Models/Payments.
2. Move or create all payment UI/components/helpers there:
   - Payment create/post screen/component
   - Payment helper functions (allocation, validation, mutation calls)
   - Payment queries/mutations wrappers if you keep them modular
   - PDF/export helpers for payment receipts/statements (if you implement per-payment receipt export)
3. Update all imports/references so no payment UI logic remains under Loans folders.
4. Keep Loans UI under src/Models/Loans. If any loan screen needs to “post a payment”, it should import a Payments component from src/Models/Payments.

**GraphQL helper-file rule (applies to both modules)**

- Create module helper files and put all custom-written operations there:
  - `src/Models/Loans/loanHelpers.js` for loan queries/mutations
  - `src/Models/Payments/paymentHelpers.js` for payment queries/mutations
- These helpers must define operation strings and variables explicitly (similar to existing module helper style in the repo).
- Do not rely on `src/graphql/queries.js` / `src/graphql/mutations.js` auto-generated content.

### C) Payment integration requirements (must be implemented)

1. Posting a payment must:
   - Create a Payment record linked to loanID (and optionally installmentID).
   - Require a receiving Account selection and persist `accountID` (so the payment shows under that Account’s payments and affects balances).
   - Allocate payment amount in this order (configurable later using the repaymentOrder from LoanProducts): penalties → fees → interest → principal.
   - Update affected LoanInstallment rows:
     - increase paidAmount
     - set status (PARTIALLY_PAID/PAID)
   - Append a LoanEvent (PAYMENT_POSTED) with allocation breakdown.
   - Only create a MoneyTransaction for the payment if (and only if) you also update Account balance logic to avoid double counting with Payments.
   - Update or create a LoanBalanceSnapshot after posting.
2. Reversing a payment must:
   - Mark Payment as reversed (status enum + existing status string), append LoanEvent (PAYMENT_REVERSED).
   - Roll back allocation impacts (installments/balances). Minimum acceptable: create compensating updates that restore previous totals.
3. Loan “next due” and delinquency must be derived from installments:
   - daysPastDue computed from earliest unpaid dueDate.
   - balance snapshot fields reflect outstanding amounts.

### C.1) Loan schedule generation requirements (must be implemented)

1. The amortization/schedule generator must match interest calculations precisely for:
   - SIMPLE
   - COMPOUND
   - FLAT
2. The generator must also support (at minimum) additional common interest/repayment variants present in real LMS deployments:
   - declining-balance (amortized) schedules
   - interest-only periods (then amortizing)
   - balloon payments
   - variable repayment frequencies per product configuration (including “set days” / “set dates” patterns if the repo already supports them)
3. Implementation rule:
   - Use a strategy/adapter approach (e.g., a map from `{interestCalculationMethod, interestType, interestPeriod, repaymentFrequency}` → calculator) so future interest types can be added without rewriting the Loans module.
   - If a product configuration is not supported, block loan creation with a clear validation error (do not silently generate an incorrect schedule).
4. Precision/rounding:
   - Apply consistent rounding per installment and ensure the final installment corrects any rounding drift so that totals exactly reconcile (principal paid sums to principal; totals match expected interest/fees).
5. Persist schedule:
   - Persist one `LoanInstallment` per due date with explicit breakdown fields (principal/interest/fees/penalty due and totals) so statements and exports do not depend on recomputation.

### D) Required UI screens / flows (minimal set)

1. Loans list: show loanNumber, borrower, principal, loanStatusEnum, maturityDate, next due date, daysPastDue.
2. Create loan: borrower selection + product template; on submit:
   - persist Loan with terms snapshot
   - generate LoanInstallment schedule rows
   - set loanStatusEnum (DRAFT or APPROVED depending on your chosen flow)
3. Loan detail:
   - header: key terms + balances
   - tabs or sections: schedule, payments, disbursements, events
   - “Post Payment” action uses Payments module component from src/Models/Payments
   - “Export” actions (A4 PDF): loan statement, payment plan, payments history
4. Disbursement action:
   - create LoanDisbursement and optionally MoneyTransaction
   - append LoanEvent (DISBURSED)
   - set loanStatusEnum ACTIVE when disbursed

### E) Chronological execution order (follow exactly)

1. Inspect existing Loans UI/helpers and existing schema; list all field mismatches and fix plan.
2. Implement schema changes in amplify/backend/api/lms2/schema.graphql.
3. Run amplify push and regenerate models + GraphQL operations; fix compile errors.
4. Create custom module helper operations (do not use `src/graphql/*`): implement all Loans queries/mutations in `src/Models/Loans/loanHelpers.*` and all Payments queries/mutations in `src/Models/Payments/paymentHelpers.*`.
5. Implement new servicing logic (schedule generation, payment allocation) in Payments helpers under src/Models/Payments.
6. Implement/adjust Loans UI screens to:
   - create loan → create installments
   - show loan detail with schedule and payments
   - invoke Payments module for posting/reversal
7. Implement A4 PDF exports for loan statement, schedule, and payment history.
8. Add minimal backfill handling:
   - for old loans without branchID or enum fields, derive values at read-time or run a one-time backfill script (keep it simple).
9. Ensure the app builds and the main flows work end-to-end.

---

## Acceptance Criteria (must be demonstrably true in the repo)

1. Folder structure:
   - All loan UI/helpers remain under `src/Models/Loans/*`.
   - All payment UI/helpers/components are under `src/Models/Payments/*` (no payment UI inside Loans folders).
2. Custom GraphQL ops only:
   - Loans and Payments modules use only custom-written GraphQL queries/mutations located in their helper files.
   - No module imports or relies on auto-generated operations from `src/graphql/*`.
3. Payments → Accounts integration:
   - Posting a payment requires selecting an Account and persists `accountID` on Payment.
   - The payment appears in the selected Account’s payments list and is reflected in account balance calculations.
   - No double counting occurs (either Payment OR MoneyTransaction represents the repayment cash movement—never both unless balance logic is explicitly adjusted).
4. Loan schedule correctness:
   - For each of SIMPLE/COMPOUND/FLAT interest methods, a known test loan configuration produces an installment schedule whose totals reconcile (principal sums to principal; interest totals match the method; final installment corrects rounding drift).
   - Unsupported interest configuration blocks creation with a clear error.
5. End-to-end loan lifecycle:
   - Create loan → schedule persists to `LoanInstallment`.
   - Disburse loan → `LoanDisbursement` created and loan status transitions to ACTIVE.
   - Post payment → Payment is created, installments update (PAID/PARTIALLY_PAID), LoanEvent appended, balance snapshot updated.
   - Reverse payment → Payment marked reversed, schedule/balances corrected, LoanEvent appended.
6. Exports:
   - Loan statement, payment plan (schedule), and payment history can each be exported as an A4 PDF from the loan detail context.
7. Forms + styling:
   - All new/updated forms use controls from `src/Resources/FormComponents`.
   - Screens use existing repo patterns/components mostly found in src/ModelAssets (e.g., `CollectionsTemplate`, `CustomPopUp`, `NotificationBar`, consistent MUI theming) and match the repo’s formatting conventions.
8. Ensure color mode responsivensess as already exists in the repo through the theme.js
