# Prompt: Implement Enterprise Loan Drafts (Repo-Specific)

You are implementing **Loan Drafts** in an existing **React + AWS Amplify (GraphQL)** Loan Management System repository.

## Goal

Deliver an enterprise-grade **Loan Drafts** workflow so that the repo’s loan origination flow is:

**Create Loan → Draft Created/Updated → Loan Created From Draft**

Meaning:

- The Create Loan experience (blank form or template) must always create/update a **LoanDraft**.
- A **Loan** is only created by converting a draft ("Save as new loan").

Users can then:

- Edit draft details (draft stays editable until submitted)
- Copy draft → new loan draft (opens Create Loan form with prefilled values)
- Send draft for approval
- Save as new loan (convert draft → Loan)
- Export draft schedule/payment plan (A4 PDF)
- Maintain auditability, strong data integrity, and consistent styling.

## Hard requirements (must-follow)

1. Folder structure
   - Loan-related screens/helpers remain under `src/Models/Loans/*`.
   - Draft screens/helpers live under `src/Models/Loans/LoanDrafts/*`.
   - Payments remain under `src/Models/Payments/*`.
2. Forms
   - Use inputs from `src/Resources/FormComponents/*` (DateInput, NumberInput, Dropdown, TextInput, etc.) when building/editing draft forms.
   - Reuse existing CreateLoan form definitions where possible; do not introduce a new form system.
3. GraphQL operations
   - Queries and mutations must be **custom-written** in module helper files.
   - Do NOT use generated/prewritten operations from `src/graphql/*`.
4. Styling
   - Match existing repo styling patterns: MUI theme usage, Grid layout, and existing template components (e.g., CollectionsTemplate/CustomPopUp/NotificationBar patterns used elsewhere).
5. PDF export
   - Add A4 PDF exports for: draft loan schedule (payment plan), draft summary/statement.
   - Use existing repo print/export utilities if present (search for existing print/export helpers and follow their approach).
6. Scheduling math
   - Draft schedule generation must be **precise** for SIMPLE/COMPOUND/FLAT interest methods, and for any other interest types the repo supports.
   - If a selected configuration is unsupported, block “Send for approval” and “Save as new loan” with a clear message.
7. Accounts integration continuity
   - Draft must capture intended account routing (e.g., source/disbursement account, fee accounts). Conversion must carry these into the Loan and disbursement configuration.
   - Payments posting remains handled in Payments module and must post to Accounts (do not duplicate cash movement).

---

## Phase 0 — Repo discovery checklist (do first)

Inspect these areas and align with existing patterns before implementing:

- Loans create flows:
  - `src/Models/Loans/CreateLoan/CreateLoan.jsx`
  - `src/Models/Loans/CreateLoan/UseLoanProduct.jsx`
  - `src/Models/Loans/CreateLoan/createLoanForm.js`
  - `src/Models/Loans/CreateLoan/createLoanHelpers.js`
- Loans helpers/export:
  - `src/Models/Loans/loanHelpers.js`
  - `src/Models/Loans/exportHelpers.js`
- Loan drafts placeholder:
  - `src/Models/Loans/LoanDrafts/LoanDrafts.jsx`
- Form components:
  - `src/Resources/FormComponents/*`
- Existing account balance behavior (to avoid double-counting payments/transactions):
  - `src/Models/Accounts/Accounts.jsx`
- Routing patterns:
  - `src/Routes.jsx` (or wherever the app routes Loans/LoanDrafts)

Output (for yourself): list any current mismatch between create-loan form fields and the GraphQL Loan model so you don’t embed incorrect field names into drafts.

---

## Phase 1 — Schema changes

Edit: `amplify/backend/api/lms2/schema.graphql`

### 1.1 Add enums

Add these enums if they do not already exist:

- `enum LoanDraftStatus { DRAFT SENT_FOR_APPROVAL APPROVED REJECTED CONVERTED ARCHIVED }`
- `enum LoanDraftSource { BLANK TEMPLATE COPY }`

### 1.2 Add model: LoanDraft

Add:

`type LoanDraft @model { ... }`

Required fields (minimum):

- `id: ID!`
- `status: LoanDraftStatus!`
- `source: LoanDraftSource`
- `draftNumber: String` (generated in app logic; used as human-friendly reference)

Ownership / scoping (for enterprise multi-tenant + branch workflows):

- `institutionID: ID @index(name: "byInstitution", sortKeyFields: ["updatedAt"])`
- `branchID: ID @index(name: "byBranch", sortKeyFields: ["updatedAt"])`

Relationships (store IDs explicitly; you may also add belongsTo relations if consistent with the repo):

- `borrowerID: ID @index(name: "byBorrower", sortKeyFields: ["updatedAt"])`
- `loanProductID: ID @index(name: "byLoanProduct", sortKeyFields: ["updatedAt"])`
- `createdByEmployeeID: ID @index(name: "byCreatedByEmployee", sortKeyFields: ["updatedAt"])`
- `assignedToEmployeeID: ID @index(name: "byAssignedToEmployee", sortKeyFields: ["updatedAt"])`

Workflow fields:

- `submittedAt: AWSDateTime`
- `approvedAt: AWSDateTime`
- `rejectedAt: AWSDateTime`
- `rejectionReason: String`
- `convertedAt: AWSDateTime`

Draft data and preview artifacts:

- `draftRecord: AWSJSON!` (the entire form payload; must include account routing fields)
- `termsSnapshot: AWSJSON` (immutable snapshot of LoanProduct-derived defaults)
- `schedulePreview: AWSJSON` (installment lines + totals; used for export/review)
- `scheduleHash: String` (detect stale preview vs input)

Concurrency & audit:

- `editVersion: Int!` (start at 1; increment on each save)
- `lastEditedByEmployeeID: ID`
- `lastEditedAt: AWSDateTime`

Denormalized list fields (optional but recommended for performant tables/search):

- `principal: Float`
- `interestRate: Float`
- `interestCalculationMethod: InterestCalculationMethod`
- `startDate: AWSDate`
- `maturityDate: AWSDate`
- `loanCurrency: String`

### 1.3 Add model: LoanDraftEvent (recommended)

Add an immutable audit log for draft lifecycle:

`type LoanDraftEvent @model { ... }`

Fields:

- `id: ID!`
- `loanDraftID: ID! @index(name: "byLoanDraft", sortKeyFields: ["eventAt"])`
- `eventAt: AWSDateTime!`
- `eventType: String!` (e.g., CREATED, UPDATED, SUBMITTED, APPROVED, REJECTED, CONVERTED, COPIED)
- `actorEmployeeID: ID`
- `summary: String`
- `payload: AWSJSON`

### 1.4 Link Loan to LoanDraft (traceability)

Update `type Loan` to add:

- `loanDraftID: ID @index(name: "byLoanDraftID")`
- `loanDraft: LoanDraft @belongsTo(fields: ["loanDraftID"])`

### 1.5 Apply and regenerate

- Run `amplify push`.
- Run codegen/model regeneration steps used by this repo.

---

## Phase 2 — Helper files (custom GraphQL ops only)

Create these helper files (or extend if they already exist):

- `src/Models/Loans/LoanDrafts/loanDraftHelpers.js`
- `src/Models/Loans/LoanDrafts/loanDraftExportHelpers.js`

Rules:

- Define custom query/mutation strings in these helper files.
- Use `generateClient()` for GraphQL calls.
- Do not import anything from `src/graphql/*`.

Required GraphQL operations (minimum set):

1. Create draft (status DRAFT)
2. Update draft (with optimistic concurrency using `editVersion` at app level)
3. Get draft by id
4. List drafts scoped by institution/branch and filter by status
5. List drafts by borrower
6. Transition draft status:
   - send for approval
   - approve
   - reject (with reason)
   - archive
7. Convert draft → Loan:
   - Create Loan (linked to draft)
   - Create LoanInstallments (from schedule preview or regenerated deterministically)
   - Create initial LoanDisbursement record if your Loans module requires it
8. Create/list draft events

---

## Phase 3 — UI and workflows

### 3.1 Add routes/screens

Implement these screens under `src/Models/Loans/LoanDrafts/*`:

1. `LoanDrafts.jsx` — list view
   - Table/grid lists drafts with borrower, principal, status, lastEditedAt.
   - Row actions: Edit, Copy, Send for approval, Save as new loan, Export schedule.
2. `LoanDraftDetail.jsx` (create this)
   - Displays and edits draft using the same field definitions as CreateLoan.
   - Status-aware read-only rules:
     - DRAFT/REJECTED: editable
     - SENT_FOR_APPROVAL: read-only; allow “Recall to draft” only if you implement it
     - APPROVED: read-only except convert
     - CONVERTED: read-only; navigate to resulting Loan

### 3.2 Modify loan creation flows to create drafts

Update both creation entry points so they ALWAYS operate on a LoanDraft (and never create a Loan directly):

- Blank form flow: `src/Models/Loans/CreateLoan/CreateLoan.jsx`
- Template flow: `src/Models/Loans/CreateLoan/UseLoanProduct.jsx`

Required behavior:

1. Draft is created early in the Create Loan flow:
   - At minimum: create the draft on the first explicit user action that establishes intent (e.g., when borrower is selected and the user proceeds, or when the user clicks “Save Draft”).
   - Prefer enterprise behavior: once borrower is chosen (and product chosen for template flow), create a draft immediately and autosave subsequent edits.
2. On initial draft creation:
   - status = DRAFT
   - source = BLANK or TEMPLATE
   - draftRecord = full form payload
   - termsSnapshot set when template-based
   - schedulePreview computed and stored
3. On subsequent saves/edits, update the same draft (increment editVersion).
4. IMPORTANT: Create Loan screens must not call any createLoan mutation.
   - The only place a Loan is created is the draft conversion action ("Save as new loan") implemented in Draft helpers.
5. Add explicit actions (buttons) that match repo styling:
   - Save Draft
   - Send for approval
   - Save as new loan
   - Export schedule (A4)

### 3.3 Copy to new loan

Implement a “Copy” action from the drafts list/detail:

- Creates a new LoanDraft with `source = COPY`.
- Copies draftRecord and termsSnapshot.
- Clears identifiers/fields that must be unique (draftNumber, any internal ids).
- Opens the loan creation form with values prefilled from copied draftRecord.

### 3.4 Send for approval

Implement:

- status transition DRAFT/REJECTED → SENT_FOR_APPROVAL
- set submittedAt
- create LoanDraftEvent

Approval UI can be minimal:

- Either add approve/reject actions on the draft detail (for authorized roles)
- Or implement a simple “Draft Approvals” list filtered to SENT_FOR_APPROVAL

### 3.5 Convert: “Save as new loan”

Conversion must:

1. Validate draft completeness.
2. Create Loan linked to draft (`loanDraftID`).
3. Generate and persist schedule rows (LoanInstallment) from schedulePreview or deterministic regeneration.
4. Create a LoanEvent (CREATED_FROM_DRAFT) if your loans module supports LoanEvent.
5. Mark draft status → CONVERTED and set convertedAt.
6. Create LoanDraftEvent.

This conversion is the ONLY supported path for creating a Loan from the Create Loan workflows.

---

## Phase 4 — Schedule preview + export

### 4.1 Schedule preview generation

Implement a schedule generator that produces `schedulePreview` with:

- Installment lines: dueDate, principalDue, interestDue, feesDue (optional), totalDue, balanceAfter
- Totals: totalPrincipal, totalInterest, totalPayable, numberOfInstallments

Precision rules:

- Exact implementations for SIMPLE/COMPOUND/FLAT.
- Consistent rounding per installment; adjust last installment to eliminate drift.
- If unsupported configuration exists, block submit actions that would externalize the schedule (approval/convert/export).

### 4.2 A4 PDF export

Implement exports accessible from draft list + draft detail:

- Export payment plan (schedule)
- Export draft summary (terms + borrower + totals)

Requirements:

- A4 page size
- Use existing repo export/print helpers/patterns where available.
- Ensure exported values come from persisted `schedulePreview` (not recomputed on the fly unless you guarantee determinism).

---

## Enterprise-grade “extras” (must implement only if minimal)

Add only the following high-value enterprise controls (no extra pages beyond what’s needed):

1. Audit trail:
   - Every create/update/status transition writes a LoanDraftEvent.
2. Data integrity:
   - Prevent editing when status is SENT_FOR_APPROVAL/APPROVED/CONVERTED (except allowed actions).
3. Safety:
   - Prevent conversion if schedulePreview is stale (scheduleHash mismatch) or missing.

---

## Acceptance Criteria (must be true)

1. Schema:
   - `LoanDraft` exists with required indexes and fields.
   - `LoanDraftEvent` exists with loanDraftID + eventAt index.
   - `Loan.loanDraftID` links a Loan back to its draft.
2. UX:
   - Create Loan (blank/template) creates/updates a draft.
   - No Create Loan screen creates a Loan directly.
   - Loans are created only via Draft conversion ("Save as new loan").
   - Drafts list supports edit, copy, send for approval, convert to loan, export.
3. Operations:
   - All draft queries/mutations are custom-written in helper files under `src/Models/Loans/LoanDrafts/*`.
   - No code uses generated `src/graphql/*` operations.
4. PDF:
   - A4 exports work for draft schedule and draft summary.
5. Scheduling:
   - schedulePreview is precise for SIMPLE/COMPOUND/FLAT and reconciles totals.
6. Repo consistency:
   - Forms use `src/Resources/FormComponents/*`.
   - Styling matches existing Loans patterns.
