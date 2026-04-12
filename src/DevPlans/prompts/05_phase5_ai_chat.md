## Phase 5: AI Chat — Natural Language Loan Query Interface

Give this entire document to an LLM along with workspace access. This is Phase 5 of 5. Phases 1-4 must be complete before starting this phase.

---

### Context: What Phases 1-4 Built

- **Phase 1:** `LoanExplorerContext` caches the full set of `LoanSummary` records in `allSummaries` (flat ~1KB records), persists across navigation.
- **Phase 2:** Lambda triggers keep `LoanSummary` records fresh (stream trigger on Loan/Payment/Penalty, scheduled refresh every 15 min).
- **Phase 3:** `LoanWorkspace` — rich loan detail view with summary header, quick actions, tabs.
- **Phase 4:** Sort GSIs, saved views, smart search, server-side KPI aggregates. The full summary set is loaded in the background on mount and cached.

**Key fact for this phase:** By Phase 4, the `LoanExplorerContext` always has `allSummaries` loaded — the complete set of flat `LoanSummary` records for the institution/branch. The AI chat operates on this in-memory array. No additional API calls needed for most queries.

**LoanSummary fields available in `allSummaries`:**
```
id, loanID, refreshScope, institutionID, branchID, borrowerID,
borrowerDisplayName, borrowerDisplayNameNormalized, borrowerPhone,
loanNumber, loanOfficerID, loanOfficerDisplayName,
loanProductID, loanProductName,
principalAmount, totalPaidAmount, amountDueAmount, loanBalanceAmount,
arrearsAmount, missedInstallmentCount,
nextDueDate, lastPaymentDate, startDate, maturityDateEffective,
lifecycleStatus, displayStatus, displayStatusRank,
displayStatusComputedAt, nextStatusTransitionAt, currencyCode, updatedAt
```

**Existing Settings page** (`src/Models/Settings/SettingsWrapper.jsx`):
- Tab-based settings at `/settings`. Currently 4 tabs: Settings, Account Info, Document Header, Customer Applications.
- `Institution` model has `apiIntegrationSettings: AWSJSON` — can store the AI API key.

**Existing theme:** All UI uses `theme.palette.sf` tokens. borderRadius: 0 throughout.

---

### Phase 5 Objective

Add an AI-powered natural language chat interface to the Loan Explorer page. The chat sits at the top of the page, allowing users to type queries like:

- *"Show me all loans with payments due in the next 2 weeks in Central branch"*
- *"How much has Peter paid across all his loans?"*
- *"Which loans are overdue with arrears above 50,000?"*
- *"List the top 10 loans by outstanding balance"*
- *"How many loans does officer John manage?"*
- *"What's the total principal for closed loans this year?"*

The LLM translates natural language into a structured action object. A deterministic executor applies the action to the in-memory `allSummaries` array. Results are displayed in the DataGrid or as a summary card.

Also add an "AI Settings" section to the Settings page where the user enters their LLM API key.

---

### Architecture

```
User types query in chat input
    ↓
Frontend sends to a Lambda function:
  - The user's query text
  - The LoanSummary field schema (static, hardcoded in the Lambda)
  - The branch list with IDs and names (from context)
  - The current date
    ↓
Lambda calls the LLM API (OpenAI/Anthropic/etc.) with:
  - A system prompt describing the schema and available operations
  - The user query
    ↓
LLM returns a structured JSON action (NOT executable code)
    ↓
Lambda validates the action structure and returns it to the frontend
    ↓
Frontend applies the action to the in-memory allSummaries array
    ↓
Results displayed in DataGrid or as a summary response card
```

**CRITICAL SECURITY CHOICE:** The LLM returns a **structured action object**, never executable code. The frontend has a deterministic executor that only supports predefined operations. This prevents code injection.

---

### Step 1: Add AI API key to Settings

**Schema change:** No schema change needed. Use the existing `apiIntegrationSettings: AWSJSON` field on `Institution` to store:

```json
{
  "aiChat": {
    "provider": "openai",
    "model": "gpt-4o-mini",
    "apiKey": "sk-..."
  }
}
```

**Settings UI:**

Create `src/Models/Settings/AiChatSettings.jsx`:

- A simple form with:
  - Dropdown: "AI Provider" — options: "OpenAI", "Anthropic" (values: `"openai"`, `"anthropic"`).
  - Text input: "Model" — default `"gpt-4o-mini"` for OpenAI, `"claude-sonnet-4-20250514"` for Anthropic.
  - Password input: "API Key" — masked, with show/hide toggle.
  - Save button.
- On save, read the current `apiIntegrationSettings` JSON from the institution, merge the `aiChat` key, and update the institution record.
- On load, read `apiIntegrationSettings` and populate the form.
- Show a test button: "Test Connection" — sends a simple test prompt to the Lambda and shows success/failure.

**Wire into SettingsWrapper:**

In `src/Models/Settings/SettingsWrapper.jsx`:
- Add a 5th tab: "AI Chat".
- Import and render `AiChatSettings` for that tab.

**Security:** The API key is stored in the institution's DynamoDB record. Only admin users can access Settings. The key is sent to the Lambda (server-side) and never exposed to the browser's network tab in plain text beyond the initial save. The Lambda uses the key to call the LLM API.

### Step 2: Create `loanChatLambda` Lambda function

Create `amplify/backend/function/loanChatLambda/`.

**`amplify/backend/function/loanChatLambda/src/index.js`:**

The Lambda receives:

```json
{
  "query": "Show me all loans with payments due in the next 2 weeks in Central branch",
  "institutionId": "abc123",
  "branches": [
    { "id": "branch1", "name": "Central" },
    { "id": "branch2", "name": "West" }
  ],
  "loanOfficers": [
    { "id": "emp1", "name": "John Doe" }
  ],
  "loanProducts": [
    { "id": "prod1", "name": "Personal Loan" }
  ],
  "currentDate": "2026-04-10"
}
```

Implementation:

1. Fetch the institution's `apiIntegrationSettings` from DynamoDB to get the AI provider, model, and API key.
2. Construct the LLM system prompt (see Step 3).
3. Call the LLM API with the system prompt + user query.
4. Parse the LLM's JSON response.
5. Validate the action structure (see Step 4 for schema).
6. Return the validated action to the frontend.

**Error handling:**
- If no API key configured: return `{ error: "AI Chat is not configured. Go to Settings > AI Chat to add your API key." }`.
- If LLM returns invalid JSON: return `{ error: "I couldn't understand that query. Try rephrasing it." }`.
- If LLM API call fails: return `{ error: "AI service is temporarily unavailable. Please try again." }`.

**Dependencies:** `node-fetch` v2 (for LLM API calls), `@aws-sdk/client-dynamodb` + `@aws-sdk/lib-dynamodb` (for reading institution record).

**IAM permissions:** `dynamodb:GetItem` on the Institution table.

### Step 3: LLM System Prompt

The system prompt sent to the LLM should be:

```
You are a loan data assistant. You translate natural language questions about a loan portfolio into structured JSON actions.

The loan data has these fields:
- loanID (string): unique loan identifier
- borrowerDisplayName (string): borrower's full name
- borrowerPhone (string): borrower's phone number
- loanNumber (string): loan reference number
- loanOfficerID (string): loan officer's ID
- loanOfficerDisplayName (string): loan officer's name
- loanProductID (string): loan product ID
- loanProductName (string): loan product name
- branchID (string): branch ID
- principalAmount (number): original loan principal
- totalPaidAmount (number): total payments made
- amountDueAmount (number): total amount still owed
- loanBalanceAmount (number): remaining principal balance
- arrearsAmount (number): overdue payment amount
- missedInstallmentCount (number): number of missed scheduled payments
- nextDueDate (string, YYYY-MM-DD): next payment due date
- lastPaymentDate (string, YYYY-MM-DD): most recent payment date
- startDate (string, YYYY-MM-DD): loan disbursement date
- maturityDateEffective (string, YYYY-MM-DD): loan maturity date
- displayStatus (string): one of CURRENT, CURRENT_WITH_MISSED_PAYMENT, OVERDUE, CLOSED, WRITTEN_OFF, VOIDED
- currencyCode (string): e.g. "KES", "USD"

Available branches: {branches as JSON array}
Available loan officers: {officers as JSON array}
Available loan products: {products as JSON array}
Current date: {currentDate}

You must respond with ONLY a JSON object (no markdown, no explanation) in one of these formats:

FORMAT 1 — Filter/Sort (display results in a table):
{
  "action": "filter",
  "filters": [
    { "field": "fieldName", "op": "eq|neq|gt|gte|lt|lte|between|contains|in", "value": "..." }
  ],
  "sort": { "field": "fieldName", "direction": "asc|desc" },
  "limit": 50
}

FORMAT 2 — Aggregate (compute a summary):
{
  "action": "aggregate",
  "filters": [
    { "field": "fieldName", "op": "...", "value": "..." }
  ],
  "aggregations": [
    { "field": "fieldName", "op": "sum|count|avg|min|max", "label": "Human readable label" }
  ],
  "groupBy": "fieldName"
}

FORMAT 3 — Lookup (find a specific loan):
{
  "action": "lookup",
  "lookupField": "loanNumber|borrowerDisplayName|borrowerPhone",
  "lookupValue": "..."
}

Filter operators:
- "eq": equals
- "neq": not equals
- "gt": greater than
- "gte": greater than or equal
- "lt": less than
- "lte": less than or equal
- "between": value is [min, max] array
- "contains": string contains (case-insensitive)
- "in": value is an array, field matches any

For date comparisons, use YYYY-MM-DD strings. For "next 2 weeks", compute the date range from the current date.
For branch names, resolve to branchID using the branches list.
For officer names, resolve to loanOfficerID using the officers list.
For product names, resolve to loanProductID using the products list.
If you cannot determine the intent, return: { "action": "error", "message": "I need more details. Try asking about..." }
```

### Step 4: Action Executor on the Frontend

Create `src/Models/Loans/LoansDisplay/loanChatExecutor.js`.

Export:

```js
executeAction(action, allSummaries)
→ { type: "table", rows: [...] }
  | { type: "aggregate", results: [...], label: "..." }
  | { type: "lookup", loan: {...} | null }
  | { type: "error", message: "..." }
```

Implementation:

**For `action.action === "filter"`:**
1. Start with `allSummaries`.
2. For each filter in `action.filters`, apply the operation:
   - `eq`: `item[field] === value` (case-insensitive for strings)
   - `neq`: `item[field] !== value`
   - `gt/gte/lt/lte`: numeric or date comparison
   - `between`: `value[0] <= item[field] <= value[1]`
   - `contains`: `String(item[field]).toLowerCase().includes(value.toLowerCase())`
   - `in`: `value.includes(item[field])`
3. If `action.sort`, sort the result.
4. If `action.limit`, slice.
5. Return `{ type: "table", rows }`.

**For `action.action === "aggregate"`:**
1. Apply filters (same as above).
2. If `action.groupBy`, group the filtered results by that field.
3. For each aggregation, compute:
   - `sum`: reduce to sum the field
   - `count`: count items
   - `avg`: sum / count
   - `min/max`: Math.min/max over the field
4. Return `{ type: "aggregate", results: [{ label, value }], groupedResults: {...} }`.

**For `action.action === "lookup"`:**
1. Search `allSummaries` for a match on the lookup field.
2. Return `{ type: "lookup", loan: matchedSummary || null }`.

**Validation:** Before executing, validate the action object:
- `action.action` must be one of `"filter"`, `"aggregate"`, `"lookup"`, `"error"`.
- `action.filters` must be an array (or undefined).
- Each filter's `field` must be a key in the LoanSummary schema. Reject unknown fields.
- Each filter's `op` must be one of the allowed operators.
- `action.sort.field` must be a valid field.
- If validation fails, return `{ type: "error", message: "Invalid query result. Try rephrasing." }`.

### Step 5: Chat UI Component

Create `src/Models/Loans/LoansDisplay/LoanExplorerChat.jsx`.

This component renders at the top of the Loan Explorer page, above the KPI cards.

**UI structure:**

```
┌──────────────────────────────────────────────────────────────┐
│  🤖 Ask about your loans...                    [⚙ Settings] │
│  ┌──────────────────────────────────────────────────── [↑] ┐ │
│  │ Type a question...                                      │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  (AI response / results appear here)                         │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │ Suggestions:                                          │   │
│  │ "Show overdue loans" | "Top 10 by balance" | "Peter?" │   │
│  └───────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

**Implementation:**

1. A collapsible/expandable section. Default: collapsed to just the input bar. Clicking or typing expands it.
2. Input: single-line text input with a send button (or Enter to send). Styled with sf theme tokens.
3. "Settings" link (small gear icon or text link) in the top-right corner → navigates to `/settings?tab=4` (the AI Chat settings tab).
4. **Suggestion chips** below the input: predefined quick queries the user can click. Examples:
   - "Show overdue loans"
   - "Top 10 by outstanding balance"
   - "Loans due this week"
   - "Total principal by branch"
   - "Loans with missed payments"
5. Loading state: show a spinner or pulsing dots while waiting for the Lambda response.
6. **Response rendering:**
   - For `type: "table"` → apply the filter/sort to the explorer DataGrid. Call `explorer.setFilteredFromChat(rows)` or equivalent. The DataGrid shows the AI-filtered results. Add a "Clear AI filter" button to return to normal view.
   - For `type: "aggregate"` → show a response card below the chat input with the computed values. E.g., "Peter Ochieng has 3 loans with KES 245,000 total paid." Format numbers with the institution's currency.
   - For `type: "lookup"` → if found, show a mini loan card with key details and a "Open Loan" button that navigates to the workspace. If not found, show "No loan found matching that query."
   - For `type: "error"` → show the error message in a muted text style.
7. **Conversation history:** Keep the last 5 query/response pairs in local state (not persisted). Show them in a scrollable area above the input.

### Step 6: Wire chat into `LoansDisplay.jsx`

In `LoansDisplay.jsx`:
- Import and render `LoanExplorerChat` at the top of the page, between the page header and the KPI cards.
- Pass required props:
  - `allSummaries` from the explorer context.
  - `branches` from the explorer context.
  - `userDetails` for institution ID and currency.
  - `onFilterResult(rows)` — callback that, when the AI returns a "filter" result, applies it to the DataGrid. Implementation: set a `chatFilteredRows` state; when set, the DataGrid uses these rows instead of `explorer.filteredLoans`. When cleared, revert to normal.
  - `onNavigateToLoan(loanId)` — navigates to the workspace.
- Add a "Clear AI filter" button/chip that appears when a chat filter is active.

### Step 7: Add LoanExplorerContext support

Add to the context:
- `chatFilterActive: boolean`
- `chatFilteredLoans: []`
- `setChatFilteredLoans(rows)` — sets the chat-filtered rows and `chatFilterActive = true`.
- `clearChatFilter()` — clears chat filter, reverts to normal view.

When `chatFilterActive` is true:
- `filteredLoans` returns `chatFilteredLoans` instead of the normal filtered set.
- KPIs and tab counts still reflect the full data (not the chat filter).
- The status tabs and search bar are visually dimmed/disabled to indicate the chat is controlling the view.
- A banner or chip says "Showing AI-filtered results" with a clear button.

---

### What NOT to change in Phase 5

- Do NOT change the `LoanSummary` schema.
- Do NOT change the Lambda triggers from Phase 2.
- Do NOT change the LoanWorkspace from Phase 3.
- Do NOT change the sort GSIs from Phase 4.

### Constraints

- The LLM API key is stored in the Institution record (DynamoDB) and accessed only by the Lambda. Never send it to the client.
- The LLM returns structured JSON actions only — never executable code.
- The executor validates all fields before applying — reject unknown field names.
- npm package additions: `node-fetch` v2 in the Lambda only. No new frontend packages.
- All UI uses `theme.palette.sf` tokens.
- The chat Lambda must handle the case where no API key is configured gracefully.

### Files to create

1. `src/Models/Settings/AiChatSettings.jsx` — AI settings form.
2. `amplify/backend/function/loanChatLambda/src/index.js` — Lambda handler.
3. `amplify/backend/function/loanChatLambda/src/package.json` — Lambda dependencies.
4. `src/Models/Loans/LoansDisplay/loanChatExecutor.js` — action executor.
5. `src/Models/Loans/LoansDisplay/LoanExplorerChat.jsx` — chat UI component.

### Files to modify

1. `src/Models/Settings/SettingsWrapper.jsx` — add AI Chat tab.
2. `src/Models/Loans/LoansDisplay/LoansDisplay.jsx` — add chat component, chat filter state.
3. `src/Models/Loans/LoansDisplay/LoanExplorerContext.jsx` — add chat filter state.

### Verification

1. In Settings > AI Chat, entering and saving an OpenAI API key works. The key is stored in `apiIntegrationSettings.aiChat`.
2. "Test Connection" sends a test query and shows success.
3. On the Loan Explorer, the chat bar appears at the top.
4. Typing "Show me overdue loans" → the LLM returns a filter action → the DataGrid shows only overdue loans → a "Clear AI filter" button appears.
5. Typing "How much has Peter paid?" → the LLM returns an aggregate action → a response card shows: "Peter has 3 loans with total paid of KES 245,000."
6. Typing "Find loan #1234" → the LLM returns a lookup action → a mini card shows the loan with an "Open" button.
7. Clicking a suggestion chip sends that query.
8. Clicking "Clear AI filter" returns the DataGrid to normal.
9. When no API key is configured, the chat shows "Configure AI Chat in Settings to use this feature" with a link.
10. The executor rejects actions with unknown field names (security validation).
11. The Settings link in the chat bar navigates to `/settings?tab=4`.
12. All Phase 1-4 functionality still works.
13. `amplify push` and `npm start` both succeed.
