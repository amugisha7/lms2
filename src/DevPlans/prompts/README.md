# Loan Explorer Rebuild — Prompt Index

Feed these files to an LLM **one at a time, in order**. Each phase builds on the previous.

| Phase | File | Summary |
|-------|------|---------|
| 1 | [01_phase1_explorer_core.md](01_phase1_explorer_core.md) | Context caching (`LoanExplorerContext`), hybrid sort (paginated default + full-fetch on sort), server-side status filtering, pagination controls, refactored LoansDisplay. |
| 2 | [02_phase2_lambda_freshness.md](02_phase2_lambda_freshness.md) | DynamoDB Stream Lambda on Loan/Payment/Penalty → auto-update LoanSummary. Scheduled Lambda for time-based status transitions. Remove client-side stale refresh. |
| 3 | [03_phase3_loan_workspace.md](03_phase3_loan_workspace.md) | Replace LoanDetailPage with LoanWorkspace: summary header, quick actions, tabs (Overview, Payments, Statement, Schedule, Documents, History). |
| 4 | [04_phase4_advanced_explorer.md](04_phase4_advanced_explorer.md) | Sort-field GSIs for server-side sorted pagination. Saved filter views. Smart search (loan number autocomplete, borrower lookup). Portfolio-level KPIs from cached full set. |
| 5 | [05_phase5_ai_chat.md](05_phase5_ai_chat.md) | AI-powered chat at top of explorer. LLM translates natural language → structured action → executed on in-memory data. Settings page for API key. |

## Prerequisites per phase

- **Phase 1:** No prerequisites. Start here.
- **Phase 2:** Phase 1 complete. Amplify CLI configured.
- **Phase 3:** Phases 1-2 complete.
- **Phase 4:** Phases 1-3 complete. `amplify push` access for GSI deployment.
- **Phase 5:** Phases 1-4 complete. An LLM API key (OpenAI or Anthropic).

## After all phases

The loan module will have:
- A fast, searchable, sortable Loan Explorer with AI chat.
- Server-side filtering, sorting, and status freshness.
- Navigation caching (instant back/forward).
- A rich Loan Workspace for operating on individual loans.
- Minimal API costs (flat read-model for browsing, detailed fetch only on demand).
