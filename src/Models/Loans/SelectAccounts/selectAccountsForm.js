const selectAccountsForm = [
  {
    label: "Disbursement Settings",
    type: "label",
    span: 12,
  },
  {
    label: "Principal Account",
    name: "principalAccountId",
    type: "dropdownSearchable",
    required: true,
    span: 12,
    options: [], // populated dynamically from fetched accounts
    helperText: "Select the account from which the loan principal will be disbursed.",
    placeholder: "Search for an account...",
  },
  {
    label: "Loan Fees Settings",
    type: "label",
    span: 12,
    showWhen: "hasLoanFees", // only rendered when loan has fees
  },
  {
    label: "Loan Fees Account",
    name: "feesAccountId",
    type: "dropdownSearchable",
    required: true,
    span: 12,
    options: [], // populated dynamically from fetched accounts
    helperText: "Select the account where the loan fees will be received.",
    placeholder: "Search for an account...",
    showWhen: "hasLoanFees", // only rendered when loan has fees
  },
];

export default selectAccountsForm;
