import { generateClient } from "aws-amplify/api";

// ─── Transaction type constants ───────────────────────────────────────────────

export const TX_TYPES = Object.freeze({
  OPENING_BALANCE: "opening_balance",
  DEPOSIT: "deposit",
  WITHDRAWAL: "withdrawal",
  EXPENSE: "expense",
  LOAN_DISBURSEMENT: "loan_disbursement",
  LOAN_PAYMENT: "loan_payment",
  LOAN_FEE: "loan_fee",
  PENALTY: "penalty",
  OTHER_INCOME: "other_income",
});

export const TX_TYPE_LABELS = {
  [TX_TYPES.OPENING_BALANCE]: "Opening Balance",
  [TX_TYPES.DEPOSIT]: "Deposit",
  [TX_TYPES.WITHDRAWAL]: "Withdrawal",
  [TX_TYPES.EXPENSE]: "Expense",
  [TX_TYPES.LOAN_DISBURSEMENT]: "Loan Disbursement",
  [TX_TYPES.LOAN_PAYMENT]: "Loan Repayment",
  [TX_TYPES.LOAN_FEE]: "Loan Fee",
  [TX_TYPES.PENALTY]: "Penalty",
  [TX_TYPES.OTHER_INCOME]: "Other Income",
};

// sf token keys { bg, text } for the type pill
export const TX_TYPE_PILL = {
  [TX_TYPES.OPENING_BALANCE]: { bg: "sf_infoBg", text: "sf_info" },
  [TX_TYPES.DEPOSIT]: { bg: "sf_successBg", text: "sf_success" },
  [TX_TYPES.WITHDRAWAL]: { bg: "sf_errorBg", text: "sf_error" },
  [TX_TYPES.EXPENSE]: { bg: "sf_warningBg", text: "sf_warning" },
  [TX_TYPES.LOAN_DISBURSEMENT]: { bg: "sf_pillNeutralBg", text: "sf_pillNeutralText" },
  [TX_TYPES.LOAN_PAYMENT]: { bg: "sf_successBg", text: "sf_success" },
  [TX_TYPES.LOAN_FEE]: { bg: "sf_warningBg", text: "sf_warning" },
  [TX_TYPES.PENALTY]: { bg: "sf_errorBg", text: "sf_error" },
  [TX_TYPES.OTHER_INCOME]: { bg: "sf_successBg", text: "sf_success" },
};

// ─── GraphQL queries ──────────────────────────────────────────────────────────

const LEDGER_ACCOUNTS_QUERY = `
  query ListAccountBranchesForLedger($branchId: ID!, $limit: Int, $nextToken: String) {
    listAccountBranches(
      filter: { branchId: { eq: $branchId } }
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        account {
          id
          name
          openingBalance
          status
          currency
          accountType
          moneyTransactions(limit: 1000) {
            items {
              id
              transactionType
              transactionDate
              amount
              description
              referenceNumber
            }
          }
          payments(limit: 1000) {
            items {
              id
              amount
              paymentDate
              description
            }
          }
          penalties(limit: 1000) {
            items {
              id
              amount
              penaltyDate
              penaltyName
              penaltyDescription
              createdAt
            }
          }
          loans(limit: 1000) {
            items {
              loan {
                id
                principal
                createdAt
                borrower {
                  businessName
                  firstname
                  othername
                }
              }
            }
          }
          loanFees(limit: 1000) {
            items {
              id
              amount
              loanFeesDate
              loanFeesName
              loanFeesDescription
              createdAt
            }
          }
        }
      }
      nextToken
    }
  }
`;

const LEDGER_EXPENSES_QUERY = `
  query ExpensesByBranchForLedger($branchID: ID!, $limit: Int, $nextToken: String) {
    expensesByBranchID(branchID: $branchID, limit: $limit, nextToken: $nextToken) {
      items {
        id
        transactionDate
        amount
        description
        category
        type
        status
        accountExpensesId
      }
      nextToken
    }
  }
`;

const LEDGER_OTHER_INCOMES_QUERY = `
  query OtherIncomesByBranchForLedger($branchID: ID!, $limit: Int, $nextToken: String) {
    otherIncomesByBranchID(branchID: $branchID, limit: $limit, nextToken: $nextToken) {
      items {
        id
        incomeDate
        amount
        name
        incomeType
        status
        customOtherIncomeDetails
      }
      nextToken
    }
  }
`;

// ─── Pagination helper ────────────────────────────────────────────────────────

const fetchAllPages = async (client, query, baseVars, resultKey) => {
  const items = [];
  let nextToken = null;
  let iteration = 0;
  while (true) {
    const prevToken = nextToken;
    const result = await client.graphql({
      query,
      variables: { ...baseVars, limit: 1000, nextToken },
    });
    const page = result?.data?.[resultKey] || {};
    const batch = Array.isArray(page.items) ? page.items.filter(Boolean) : [];
    items.push(...batch);
    nextToken = page.nextToken || null;
    if (!nextToken || nextToken === prevToken || ++iteration > 50) break;
  }
  return items;
};

// ─── Public fetch function ────────────────────────────────────────────────────

export const fetchLedgerData = async (branchId) => {
  if (!branchId) return { accounts: [], expenses: [], otherIncomes: [] };
  const client = generateClient();

  const accountBranchItems = await fetchAllPages(
    client,
    LEDGER_ACCOUNTS_QUERY,
    { branchId },
    "listAccountBranches",
  );

  // De-duplicate accounts (a branch query can return duplicates via multiple join rows)
  const seen = new Set();
  const accounts = accountBranchItems
    .map((item) => item?.account)
    .filter((a) => {
      if (!a?.id || seen.has(a.id)) return false;
      seen.add(a.id);
      return true;
    });

  const [expenses, otherIncomes] = await Promise.all([
    fetchAllPages(client, LEDGER_EXPENSES_QUERY, { branchID: branchId }, "expensesByBranchID"),
    fetchAllPages(client, LEDGER_OTHER_INCOMES_QUERY, { branchID: branchId }, "otherIncomesByBranchID"),
  ]);

  return { accounts, expenses, otherIncomes };
};

// ─── Date helpers ─────────────────────────────────────────────────────────────

const parseDate = (val) => {
  if (!val) return null;
  if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}$/.test(val.trim())) {
    const [y, m, d] = val.trim().split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return isNaN(date.getTime()) ? null : date;
  }
  const date = new Date(val);
  return isNaN(date.getTime()) ? null : date;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const formatLedgerDate = (date) => {
  if (!date) return "—";
  return `${String(date.getDate()).padStart(2, "0")}-${MONTHS[date.getMonth()]}-${date.getFullYear()}`;
};

const borrowerLabel = (borrower) => {
  if (!borrower) return "";
  if (borrower.businessName) return borrower.businessName;
  return [borrower.firstname, borrower.othername].filter(Boolean).join(" ");
};

// ─── Row builder ──────────────────────────────────────────────────────────────
//
// Direction mapping mirrors Accounts.jsx calculateCurrentBalance:
//   deposit → credit   withdrawal → debit
//   payment → credit   penalty    → debit
//   loan principal → credit (fund account grows when loan booked)
//   loanFee → debit    expense → debit   otherIncome → credit

export const buildLedgerRows = (accounts, expenses, otherIncomes) => {
  const rows = [];
  let counter = 0;
  const uid = (prefix) => `${prefix}_${++counter}`;

  accounts.forEach((account) => {
    // ── Money Transactions ──
    (account.moneyTransactions?.items || []).forEach((tx) => {
      const isDeposit = tx.transactionType === "deposit";
      const date = parseDate(tx.transactionDate);
      const amt = Math.abs(tx.amount || 0);
      rows.push({
        id: uid("mt"),
        date,
        sortKey: date ? date.getTime() : Infinity,
        dateDisplay: formatLedgerDate(date),
        typeKey: isDeposit ? TX_TYPES.DEPOSIT : TX_TYPES.WITHDRAWAL,
        type: TX_TYPE_LABELS[isDeposit ? TX_TYPES.DEPOSIT : TX_TYPES.WITHDRAWAL],
        description: tx.description || tx.referenceNumber || "",
        accountId: account.id,
        accountName: account.name,
        amount: amt,
        direction: isDeposit ? "credit" : "debit",
        globalAmount: isDeposit ? amt : -amt,
      });
    });

    // ── Loan Disbursements ──
    (account.loans?.items || []).forEach(({ loan } = {}) => {
      if (!loan) return;
      const date = parseDate(loan.createdAt);
      const amt = Math.abs(loan.principal || 0);
      const name = borrowerLabel(loan.borrower);
      rows.push({
        id: uid("loan"),
        date,
        sortKey: date ? date.getTime() : Infinity,
        dateDisplay: formatLedgerDate(date),
        typeKey: TX_TYPES.LOAN_DISBURSEMENT,
        type: TX_TYPE_LABELS[TX_TYPES.LOAN_DISBURSEMENT],
        description: name ? `Loan to ${name}` : "Loan disbursement",
        accountId: account.id,
        accountName: account.name,
        amount: amt,
        direction: "credit",
        globalAmount: amt,
      });
    });

    // ── Loan Repayments ──
    (account.payments?.items || []).forEach((payment) => {
      const date = parseDate(payment.paymentDate);
      const amt = Math.abs(payment.amount || 0);
      rows.push({
        id: uid("pay"),
        date,
        sortKey: date ? date.getTime() : Infinity,
        dateDisplay: formatLedgerDate(date),
        typeKey: TX_TYPES.LOAN_PAYMENT,
        type: TX_TYPE_LABELS[TX_TYPES.LOAN_PAYMENT],
        description: payment.description || "Loan repayment",
        accountId: account.id,
        accountName: account.name,
        amount: amt,
        direction: "credit",
        globalAmount: amt,
      });
    });

    // ── Penalties ──
    (account.penalties?.items || []).forEach((penalty) => {
      const date = parseDate(penalty.penaltyDate || penalty.createdAt);
      const amt = Math.abs(penalty.amount || 0);
      rows.push({
        id: uid("pen"),
        date,
        sortKey: date ? date.getTime() : Infinity,
        dateDisplay: formatLedgerDate(date),
        typeKey: TX_TYPES.PENALTY,
        type: TX_TYPE_LABELS[TX_TYPES.PENALTY],
        description: penalty.penaltyName || penalty.penaltyDescription || "",
        accountId: account.id,
        accountName: account.name,
        amount: amt,
        direction: "debit",
        globalAmount: -amt,
      });
    });

    // ── Loan Fees ──
    (account.loanFees?.items || []).forEach((fee) => {
      const date = parseDate(fee.loanFeesDate || fee.createdAt);
      const amt = Math.abs(fee.amount || 0);
      rows.push({
        id: uid("fee"),
        date,
        sortKey: date ? date.getTime() : Infinity,
        dateDisplay: formatLedgerDate(date),
        typeKey: TX_TYPES.LOAN_FEE,
        type: TX_TYPE_LABELS[TX_TYPES.LOAN_FEE],
        description: fee.loanFeesName || fee.loanFeesDescription || "",
        accountId: account.id,
        accountName: account.name,
        amount: amt,
        direction: "debit",
        globalAmount: -amt,
      });
    });
  });

  // ── Expenses (branch-level, linked via accountExpensesId) ──
  expenses.forEach((expense) => {
    if (!expense?.amount) return;
    const date = parseDate(expense.transactionDate);
    const amt = Math.abs(expense.amount);
    const account = accounts.find((a) => a.id === expense.accountExpensesId);
    rows.push({
      id: uid("exp"),
      date,
      sortKey: date ? date.getTime() : Infinity,
      dateDisplay: formatLedgerDate(date),
      typeKey: TX_TYPES.EXPENSE,
      type: TX_TYPE_LABELS[TX_TYPES.EXPENSE],
      description: expense.description || expense.category || expense.type || "",
      accountId: expense.accountExpensesId || "",
      accountName: account?.name || "",
      amount: amt,
      direction: "debit",
      globalAmount: -amt,
    });
  });

  // ── Other Incomes (branch-level, accountId in customOtherIncomeDetails) ──
  otherIncomes.forEach((income) => {
    if (!income?.amount) return;
    const date = parseDate(income.incomeDate);
    const amt = Math.abs(income.amount);
    let accountId = "";
    try {
      const details = income.customOtherIncomeDetails
        ? JSON.parse(income.customOtherIncomeDetails)
        : null;
      accountId = details?.accountId || "";
    } catch {
      // ignore malformed JSON
    }
    const account = accounts.find((a) => a.id === accountId);
    rows.push({
      id: uid("inc"),
      date,
      sortKey: date ? date.getTime() : Infinity,
      dateDisplay: formatLedgerDate(date),
      typeKey: TX_TYPES.OTHER_INCOME,
      type: TX_TYPE_LABELS[TX_TYPES.OTHER_INCOME],
      description: income.name || income.incomeType || "",
      accountId,
      accountName: account?.name || "",
      amount: amt,
      direction: "credit",
      globalAmount: amt,
    });
  });

  // Sort chronologically; undated rows go to the end
  rows.sort((a, b) => a.sortKey - b.sortKey);

  // Prepend synthetic opening-balance row
  const openingByAccount = Object.fromEntries(
    accounts.map((a) => [a.id, a.openingBalance || 0]),
  );
  const totalOpening = Object.values(openingByAccount).reduce((s, v) => s + v, 0);
  const openingRow = {
    id: "opening_balance",
    date: null,
    sortKey: -Infinity,
    dateDisplay: "—",
    typeKey: TX_TYPES.OPENING_BALANCE,
    type: TX_TYPE_LABELS[TX_TYPES.OPENING_BALANCE],
    description: "Initial account balances",
    accountId: "__opening__",
    accountName: "",
    amount: totalOpening,
    direction: "credit",
    globalAmount: totalOpening,
    isOpeningBalance: true,
    openingByAccount,
  };

  const allRows = [openingRow, ...rows];

  // Compute running balance (single pass, cumulative)
  let running = 0;
  allRows.forEach((row) => {
    running += row.globalAmount || 0;
    row.runningBalance = running;
  });

  return allRows;
};
