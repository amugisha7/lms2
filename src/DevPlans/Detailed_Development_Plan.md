# detailed_development_plan.md

## **Project Status Overview**
Based on the codebase analysis and `LT_Development_Plan.md`:
-   **Phase 1 (Foundation)**: ✅ **COMPLETE**. (User/Auth, Branches, Institutions, Members are implemented).
-   **Phase 2 (Lending Core)**: 🚧 **PARTIAL**. (Loan Products & Application forms exist. `loanComputations` is robust. **Missing**: Disbursement logic, strict Loan State transitions, Repayment Schedule persistency).
-   **Phase 3 (SACCO Core)**: 🚧 **PARTIAL**. (Accounts structure exists. **Missing**: Specific logic for Savings Products, Dividend calculation, Share Capital management).
-   **Phase 4 (Accounting)**: ❌ **PENDING**. (No GL, Journal Entries, or Poster Lambda found).
-   **Phase 5 (Ops & Risk)**: ❌ **PENDING**. (Repayment Waterfall, Arrears Cron, Collections).
-   **Phase 6 (Reporting)**: ❌ **PENDING**. (Dashboards exist but need specific financial widgets. Statutory reports missing).

---

## **Hour-by-Hour Execution Plan**

### **Part 1: Lending Core Completion (Hours 1-4)**
**Goal**: Finalize the Loan Lifecycle (Draft -> Approved -> Active -> Closed).

*   **Hour 1: Loan State Machine Refinement**
    *   **Task**: Verify `Models/Loans/LoanDrafts` vs `Models/Loans/Loans`. Ensure "Approve" action converts Draft -> Loan.
    *   **Deliverable**: Working "Approve" button that creates a `Loan` record from `LoanDraft` and generates `LoanInstallment` records using `loanComputations`.
*   **Hour 2: Repayment Schedule Persistence**
    *   **Task**: Implement logic to save the *preview* schedule from `loanComputations` into the database (`LoanInstallment` table) upon approval.
    *   **Deliverable**: `LoanInstallment` records created in DynamoDB for every approved loan.
*   **Hour 3: Disbursement Logic**
    *   **Task**: Implement `Disburse` action. Check strict status (must be `APPROVED`). Prevent double disbursement (Idempotency check).
    *   **Deliverable**: Disbursement function that updates Loan Status to `ACTIVE` and creates a `Disbursement` transaction record.
*   **Hour 4: Lending Validation**
    *   **Task**: Manual test cycle: Create Product -> Apply -> Approve -> Disburse -> Check Schedule.
    *   **Deliverable**: Verified Lending Loop.

### **Part 2: SACCO Core - Savings (Hours 5-8)**
**Goal**: Enable Savings Accounts and Transactions.

*   **Hour 5: Savings Product Configuration**
    *   **Task**: Create/Verify `SavingsProduct` model (Interest Rate, Min Balance). Create UI for defining these products.
    *   **Deliverable**: `SavingsProduct` creation form and list.
*   **Hour 6: Savings Account Opening**
    *   **Task**: Create "Open Account" flow. Link `SavingsAccount` to `Member` and `SavingsProduct`.
    *   **Deliverable**: Ability to open a savings account for a member.
*   **Hour 7: Deposit/Withdrawal Engine**
    *   **Task**: Refine `MoneyTransactions` to handle `DEPOSIT` and `WITHDRAWAL`. Implement `AvailableBalance` check for withdrawals.
    *   **Deliverable**: Trusted transaction engine that updates `SavingsAccount.currentBalance` atomically (or via dynamo streams).
*   **Hour 8: Interest Scheduler (Mock)**
    *   **Task**: Create a script (or Lambda) to calculate daily interest accrual based on `SavingsProduct` rate.
    *   **Deliverable**: Function to post "Interest Accrued" transactions.

### **Part 3: SACCO Core - Shares (Hours 9-12)**
**Goal**: Enable Share Capital management.

*   **Hour 9: Share Product & Account**
    *   **Task**: Create `ShareProduct` (Unit Price) and `ShareAccount` models.
    *   **Deliverable**: Schema update and UI for Share Products.
*   **Hour 10: Share Purchasing Logic**
    *   **Task**: Implement "Buy Shares" transaction.
    *   **Deliverable**: API to credit `ShareAccount` units and debit Cash/Bank.
*   **Hour 11: Dividend Module**
    *   **Task**: Create a "Declare Dividend" form. Input: `TotalPayout`. Logic: Distribute to all `ShareAccounts` pro-rata.
    *   **Deliverable**: Dividend distribution script/function.
*   **Hour 12: Member Statement View**
    *   **Task**: Create a unified view of Savings + Shares + Loans for a member.
    *   **Deliverable**: "Member 360" Dashboard.

### **Part 4: Accounting & GL (Hours 13-17)**
**Goal**: Double-entry bookkeeping for every event.

*   **Hour 13: Chart of Accounts (COA)**
    *   **Task**: Complete `ChartOfAccounts` CRUD. Seed default accounts (Cash, Loan Portfolio, Savings Liability, Interest Income).
    *   **Deliverable**: Fully populated COA.
*   **Hour 14: Journal Entry Model**
    *   **Task**: Define `JournalEntry` and `JournalLine` models in schema.
    *   **Deliverable**: GL Database Schema ready.
*   **Hour 15: The "Poster" Lambda (Design)**
    *   **Task**: Plan the DynamoDB Stream trigger that listens to `LoanTransaction`, `SavingsTransaction`.
    *   **Deliverable**: Lambda function scaffold.
*   **Hour 16: The "Poster" Lambda (Implementation - Lending)**
    *   **Task**: Map Loan Events (Disbursement, Repayment) to GL Debits/Credits.
    *   **Deliverable**: Loans automatically posting to GL.
*   **Hour 17: The "Poster" Lambda (Implementation - Savings)**
    *   **Task**: Map Savings Events (Deposit, Withdrawal) to GL.
    *   **Deliverable**: Savings operations posting to GL.

### **Part 5: Operations & Collections (Hours 18-21)**
**Goal**: Automate repayments and arrears.

*   **Hour 18: Repayment Waterfall**
    *   **Task**: Implement the logic: Payment splits into Penalty -> Fees -> Interest -> Principal.
    *   **Deliverable**: Unit tested `allocatePayment(amount)` function.
*   **Hour 19: Collections Dashboard**
    *   **Task**: Create a view for Loans with `Status = IN_ARREARS`.
    *   **Deliverable**: "Collections" Queue for Loan Officers.
*   **Hour 20: Arrears Cron Job**
    *   **Task**: Write the Lambda to run nightly. `if (nextInstallmentDue < today) -> Status = IN_ARREARS`.
    *   **Deliverable**: Automated classification of bad loans.
*   **Hour 21: Penalty Logic**
    *   **Task**: Add logic to `Arrears Cron` to post penalty fees if applicable.
    *   **Deliverable**: Revenue generation from late payers.

### **Part 6: Reporting & Governance (Hours 22-25)**
**Goal**: Management Visibility.

*   **Hour 22: Financial Reports (Balance Sheet)**
    *   **Task**: Aggregation query for `JournalLines` by Account Type.
    *   **Deliverable**: Real-time Balance Sheet View.
*   **Hour 23: Portfolio at Risk (PAR)**
    *   **Task**: Report calculating % of Portfolio > 30 days overdue.
    *   **Deliverable**: PAR metric on Dashboard.
*   **Hour 24: Operational Exports**
    *   **Task**: CSV export for "Disbursements this Month" and "Repayments this Month".
    *   **Deliverable**: Data export feature for accountants.
*   **Hour 25: Final Integration & Polish**
    *   **Task**: End-to-end testing of the full flow. UI Cleanup.
    *   **Deliverable**: Production-ready Release Candidate.

---

## **Dependencies & Critical Path**
1.  **Loan Lifecycle (Hours 1-4)** is the blocker for Accounting/GL. Must be done first.
2.  **Transactions (Hours 7, 10)** must be robust before turning on the **Poster Lambda**.
3.  **Accounting (Hours 13-17)** is the most technically complex. Allocate best energy here.
