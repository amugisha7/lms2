// Controlled expense taxonomy. The Create/Edit forms use this list to populate
// the category dropdown. The Profit / Loss report uses TAX_EXPENSE_CATEGORIES
// to decide whether an Expense lands under "Operating Expenses" or "Taxes" via
// exact match (no keyword sniffing).

export const TAX_EXPENSE_CATEGORIES = Object.freeze([
  "Income Tax",
  "VAT",
  "Withholding Tax",
  "Other Tax",
]);

export const OPERATING_EXPENSE_CATEGORIES = Object.freeze([
  "Salaries & Wages",
  "Rent",
  "Utilities",
  "Office Supplies",
  "Travel",
  "Professional Services",
  "Bank Charges",
  "Marketing",
  "Depreciation",
  "Other Operating",
]);

export const EXPENSE_CATEGORIES = Object.freeze([
  ...OPERATING_EXPENSE_CATEGORIES,
  ...TAX_EXPENSE_CATEGORIES,
]);

export const isTaxCategory = (category) =>
  TAX_EXPENSE_CATEGORIES.includes(String(category || "").trim());
