const createLoanForm = [
  {
    label: "Loan Product",
    name: "loanProduct",
    type: "select",
    
    span: 12,
    options: [], // Will be populated dynamically
    dynamicoptions: "true",
    helperText: "Use a pre-set Loan Product."
  },
  {
    label: "Principal Amount",
    name: "principalAmount",
    type: "number",
    required: true,
    span: 6,
    validationType: "number",
    min: 0,
    helperText: "The amount of money being lent."
  },
  {
    label: "Interest Rate (%)",
    name: "interestRate",
    type: "number",
    required: true,
    span: 6,
    validationType: "number",
    min: 0,
    max: 100,
    helperText: "The interest rate as a percentage."
  },
  {
    label: "Term Duration",
    name: "termDuration",
    type: "number",
    required: true,
    span: 6,
    validationType: "number",
    min: 1,
    helperText: "The duration of the loan term."
  },
  {
    label: "Duration Period",
    name: "durationPeriod",
    type: "select",
    required: true,
    span: 6,
    options: [
      { value: "days", label: "Days" },
      { value: "weeks", label: "Weeks" },
      { value: "months", label: "Months" },
      { value: "years", label: "Years" },
    ],
    helperText: "The period unit for the term duration."
  },
  {
    label: "Disbursement Date",
    name: "disbursementDate",
    type: "text", // Could be date picker, but using text for now
    required: true,
    span: 6,
    helperText: "The date when the loan is disbursed."
  },
  {
    label: "Maturity Date",
    name: "maturityDate",
    type: "text", // Could be date picker, but using text for now
    required: true,
    span: 6,
    helperText: "The date when the loan matures."
  },
  {
    label: "Repayment Frequency",
    name: "repaymentFrequency",
    type: "select",
    required: true,
    span: 12,
    options: [
      { value: "daily", label: "Daily" },
      { value: "weekly", label: "Weekly" },
      { value: "biweekly", label: "Bi-weekly" },
      { value: "monthly", label: "Monthly" },
      { value: "bimonthly", label: "Bimonthly" },
      { value: "quarterly", label: "Quarterly" },
      { value: "every_4_months", label: "Every 4 months" },
      { value: "semi_annual", label: "Semi-annual" },
      { value: "every_9_months", label: "Every 9 months" },
      { value: "yearly", label: "Yearly" },
      { value: "lump_sum", label: "Lump Sum" },
    ],
    helperText: "How often repayments are made."
  },
  {
    label: "Repayment Order",
    name: "repaymentOrder",
    type: "orderedList",
    span: 12,
    defaultValue: ["Penalty", "Fees", "Interest", "Principal"],
    helperText: "The order in which received payments are allocated.",
  },
  {
    label: "Status",
    name: "status",
    type: "select",
    required: true,
    span: 6,
    options: [
      { value: "Active", label: "Active" },
      { value: "Pending", label: "Pending" },
      { value: "Approved", label: "Approved" },
      { value: "Rejected", label: "Rejected" },
      { value: "Closed", label: "Closed" },
    ],
    defaultValue: "Pending",
    helperText: "The current status of the loan."
  },
  {
    label: "Total Amount Due",
    name: "totalAmountDue",
    type: "number",
    span: 6,
    validationType: "number",
    min: 0,
    helperText: "The total amount due for the loan."
  },
];

export default createLoanForm;