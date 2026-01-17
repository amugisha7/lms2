# **Detailed Functional Specifications**

These specifications map directly to the Schema you have implemented.

## **Module 1: System Core & Administration**

**Purpose:** Set the foundational rules, tenant isolation, and security.

* **1.1 Institution Management (Multi-Tenancy)**  
  * **Function:** Super Admin creates an Institution.  
  * **Inputs:** Name, Currency, Timezone, Logo, Subscription Tier.  
  * **Logic:**  
    * Auto-generate a unique TenantID.  
    * Initialize default ChartOfAccounts (Asset, Liability, Income, Expense, Equity) upon creation.  
    * Initialize Holiday calendar based on the selected Country.  
  *   
*   
* **1.2 Branch Management**  
  * **Function:** Create operational units.  
  * **Logic:** Users and Data (Loans/Borrowers) are tagged to a Branch ID. Reports can be filtered by Branch.  
*   
* **1.3 Feature Toggles**  
  * **Function:** Enable/Disable modules based on business type (Lender vs. SACCO).  
  * **Logic:**  
    * If saccoFeaturesEnabled \= False, hide "Shares", "Dividends", and "Governance" from the UI.  
  *   
* 

## **Module 2: HR & Security (User Management)**

**Purpose:** Manage staff access and performance.

* **2.1 Employee Onboarding**  
  * **Function:** Create User linked to Employee profile.  
  * **Logic:** System sends an email invite via AWS Cognito.  
*   
* **2.2 Role-Based Access Control (RBAC)**  
  * **Function:** Assign permissions (e.g., LOAN\_OFFICER, BRANCH\_MANAGER).  
  * **Rules:**  
    * *Loan Officer:* Can View/Create Applications, cannot Approve.  
    * *Manager:* Can Approve Loans up to $X amount.  
    * *Admin:* Full Access.  
  *   
*   
* **2.3 Portfolio Assignment**  
  * **Function:** Link Borrowers to an Employee.  
  * **Logic:** When a user logs in, the "My Borrowers" dashboard filters Borrower where employees contains CurrentUserID.  
* 

## **Module 3: CRM (Member & Group Management)**

**Purpose:** Single view of the customer.

* **3.1 Unified Profile (KYC)**  
  * **Function:** Create/Edit Borrower.  
  * **Logic:**  
    * Upload Documents (ID, Photo) to S3; store keys in Document table.  
    * Duplicate Check: Prevent creation if NationalID already exists.  
  *   
*   
* **3.2 Group Management (Microfinance)**  
  * **Function:** Create Group and add Borrower as members.  
  * **Logic:**  
    * Allow election of Group Leaders (Chairperson, Treasurer).  
    * **Co-Guarantor Logic:** If a group member applies for a loan, other members can be selected as guarantors easily.  
  *   
* 

## **Module 4: SACCO Core (Shares & Savings)**

**Purpose:** Deposit-taking and Equity management.

* **4.1 Product Configuration**  
  * **Function:** Define SavingsProduct (e.g., "Holiday Savings" \- 5% Interest).  
*   
* **4.2 Account Operations**  
  * **Function:** Open SavingsAccount for a Borrower.  
  * **Transaction Logic (SavingsTransaction):**  
    * *Deposit:* Credit Account, Update Balance.  
    * *Withdrawal:* Check AvailableBalance (Balance \- LockedAmount). If sufficient, Debit Account.  
  *   
*   
* **4.3 Interest Scheduler**  
  * **Function:** End-of-day/month routine.  
  * **Logic:** Calculate (Balance \* Rate / 365). Create a "Interest Accrued" transaction.  
* 

## **Module 5: Lending Engine (The Core)**

**Purpose:** Loan lifecycle management.

* **5.1 Product Builder**  
  * **Function:** Define LoanProduct (Min/Max amounts, Interest Method: Flat/Reducing).  
*   
* **5.2 Origination (The Workflow)**  
  * **Step 1:** Create LoanDraft.  
  * **Step 2:** **Scoring:** System calculates CreditScore based on history.  
  * **Step 3:** **Approval:** Manager clicks "Approve".  
    * *Action:* Convert LoanDraft to Loan.  
    * *Action:* Generate Repayment Schedule (LoanInstallment).  
  *   
*   
* **5.3 Disbursement**  
  * **Function:** Release funds.  
  * **Logic:**  
    * Create LoanDisbursement record.  
    * **Accounting Trigger:** Credit "Bank GL", Debit "Loan Portfolio GL".  
    * **Status Change:** Loan becomes ACTIVE.  
  *   
*   
* **5.4 Repayment & Allocation (Waterfall)**  
  * **Function:** Process Payment.  
  * **Logic:**  
    * Input: Payment Amount (e.g., $100).  
    * Allocation Order: 1\. Penalty, 2\. Fees, 3\. Interest, 4\. Principal.  
    * Update LoanInstallment status (Paid/Partially Paid).  
    * Update Loan balance.  
  *   
* 

## **Module 6: Accounting & Finance (GL)**

**Purpose:** Double-entry bookkeeping.

* **6.1 Chart of Accounts**  
  * **Function:** Manage GL Accounts.  
*   
* **6.2 Automated Journaling**  
  * **Function:** Event-driven posting.  
  * **Logic:**  
    * *On Disbursement:* Dr Loans Receivable | Cr Bank.  
    * *On Repayment:* Dr Bank | Cr Loans Receivable.  
    * *On Fee Charge:* Dr Loans Receivable | Cr Fee Income.  
  *   
* 

## **Module 7: Collections & Recovery**

**Purpose:** Managing bad debt.

* **7.1 Aging Analysis**  
  * **Function:** Nightly batch job.  
  * **Logic:** Check LoanInstallment due dates. If Overdue \> 30 days, move Loan Status to In Arrears.  
*   
* **7.2 Case Management**  
  * **Function:** Auto-create CollectionCase when loan is \> X days overdue.  
  * **Action:** Assign to specific Employee.  
* 

## **Module 8: Governance (SACCO)**

* **8.1 Dividend Processing**  
  * **Function:** Distribute Surplus.  
  * **Logic:** Input NetProfit. System calculates Dividend per Share and posts to Member SavingsAccount.  
* 

---

# **Phased Development Plan**

This plan organizes the build into logical dependencies. Do not try to build everything at once.

### **Phase 1: Foundation (Weeks 1-3)**

**Goal:** Can login, create a company, and add a customer.

1. **Infrastructure:** Setup AWS Amplify, Cognito (Auth), and deploy the GraphQL Schema.  
2. **Admin Portal:** Build Institution and Branch settings forms.  
3. **User Management:** Build Employee creation and Role assignment.  
4. **CRM:** Build Borrower registration form (capture basic info \+ photo upload).  
   * *Deliverable:* A working app where I can log in and create a customer profile.  
5. 

### **Phase 2: The Lending Core (Weeks 4-8)**

**Goal:** Can configure a loan product, disburse money, and view the schedule.

1. **Product Engine:** Build LoanProduct configuration screens.

**Origination:** Build Application form. Implement the LoanDraft  
        →\\rightarrow→

2.        
    Loan conversion logic.  
3. **Scheduling Algorithm:** Write the TypeScript/JavaScript logic to generate Amortization Schedules (Flat vs. Reducing balance) and save them to LoanInstallment.  
4. **Disbursement:** Build the logic to change status to Active and "release" funds (mocked transaction).  
   * *Deliverable:* A customer has an Active loan with a viewable repayment schedule.  
5. 

### **Phase 3: The Banking Core (SACCO) (Weeks 9-11)**

**Goal:** Members can save money and buy shares.

1. **Savings Products:** Configuration screens for savings types.  
2. **Transaction Engine:** Build the SavingsTransaction logic (Deposit/Withdrawal).  
3. **Share Capital:** Build logic to purchase ShareAccount units.  
4. **Statement Generation:** Build a view that lists all transactions for a member.

### **Phase 4: Financial Integration (Accounting) (Weeks 12-14)**

**Goal:** Every action in Phase 2 & 3 automatically updates the General Ledger.

1. **GL Setup:** Build ChartOfAccounts management.  
2. **The "Poster" Lambda:** Write a backend function/resolver that listens to onCreatePayment, onCreateDisbursement, onCreateSavingsTransaction.  
   * *Logic:* It takes the transaction event and creates a JournalEntry with two JournalLines.  
3.   
4. **Reconciliation:** Build a simple report showing Trial Balance.

### **Phase 5: Operations & Risk (Weeks 15-17)**

**Goal:** Manage repayments and bad debt.

**Payment Processing:** Build the "Make Payment" screen. Implement the "Waterfall" allocation logic (Penalty  
        →\\rightarrow→  
       
 Interest  
        →\\rightarrow→

1.        
    Principal).  
2. **Arrears Calculation:** Build a scheduled Lambda function (Cron job) that runs every night to check for overdue payments and apply Penalty fees.  
3. **Collections CRM:** Build the CollectionCase dashboard for staff to log calls/promises.

### **Phase 6: Reporting & Governance (Weeks 18-20)**

**Goal:** Management insights and compliance.

1. **Dashboards:** Build "Portfolio at Risk (PAR)", "Total Disbursed", "Active Borrowers" widgets.  
2. **Statutory Reports:** Generate PDF/CSV exports for Balance Sheet and Income Statement.  
3. **Governance:** Build the Meeting and Dividend modules.

---

# **Part 3: Technical Recommendations for the Agency**

Give these instructions to your developers along with the schema:

1. **Amplify Triggers:** Use DynamoDB Stream triggers (Lambda) for the **Accounting** module. Do not try to write Journal Entries on the client side (Frontend). It must be backend logic to ensure data integrity.  
2. **Scheduler:** Use AWS EventBridge Scheduler to trigger the "End of Day" processing (Interest accrual, Penalty checks, Aging analysis).  
3. **Floating Point Math:** **Crucial:** Do not use standard JavaScript float math for money. Use a library like Dinero.js or Currency.js to handle precision (2 decimal places) correctly, or store everything in cents (Integers).  
4. **Idempotency:** Ensure that if a user clicks "Disburse" twice, the system checks if a disbursement already exists for that Loan ID to prevent double payment.

