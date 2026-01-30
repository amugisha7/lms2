/**
 * Form field configuration for customer blank loan applications
 * This form allows customers to manually enter all loan details without selecting a loan product
 */
const customerBlankLoanForm = [
  // Principal Settings
  {
    label: "Loan Amount",
    name: "principalAmount",
    type: "number",
    required: true,
    span: 6,
    validationType: "number",
    min: 0,
    helperText: "Enter the amount you wish to borrow",
  },

  // Interest Settings
  {
    label: "Interest Settings",
    type: "label",
    span: 12,
  },
  {
    label: "Interest Method",
    name: "interestMethod",
    type: "select",
    span: 12,
    required: true,
    defaultValue: "reducing_balance_equal_installments",
    options: [
      {
        value: "compound_interest_accrued",
        label: "Compound Interest - Accrued",
      },
      {
        value: "compound_interest_equal_installments",
        label: "Compound Interest - Equal Installments",
      },
      { value: "flat", label: "Flat" },
      { value: "interest_only", label: "Interest-Only" },
      {
        value: "reducing_balance_equal_installments",
        label: "Reducing Balance - Equal Installments",
      },
      {
        value: "reducing_balance_equal_principal",
        label: "Reducing Balance - Equal Principal",
      },
    ],
    dynamicHelperText: {
      compound_interest_accrued:
        "Any unpaid interest is added to the loan balance. Future interest is then calculated on this new, higher balance.",
      compound_interest_equal_installments:
        "Interest compounds, but the borrower makes fixed payments to pay it down over time.",
      flat: "Interest is based on the original loan amount and stays the same throughout the loan.",
      interest_only:
        "The borrower only pays the interest charges for a set period. The principal is paid later.",
      reducing_balance_equal_installments:
        "Payment amount is the same each time. Early payments cover mostly interest, later payments pay off principal.",
      reducing_balance_equal_principal:
        "Fixed amount of principal plus interest due. Total payment decreases over time.",
    },
  },
  {
    label: "Interest Type",
    name: "interestType",
    type: "radio",
    span: 6,
    required: true,
    defaultValue: "percentage",
    options: [
      { value: "percentage", label: "Percentage" },
      { value: "fixed", label: "Fixed Amount" },
    ],
  },
  {
    type: "textAndDropdown",
    span: 6,
    textLabel: "Interest Rate",
    textName: "interestRate",
    textType: "number",
    textRequired: true,
    textDefaultValue: "",
    textPlaceholder: "",
    textHelperText: "",
    textInputProps: {
      validationType: "number",
      min: 0,
    },
    dynamicLabel: true,
    dynamicLabelMap: {
      percentage: "Interest Rate",
      fixed: "Interest Amount",
    },
    dependsOn: "interestType",
    dropdownLabel: "",
    dropdownName: "interestPeriod",
    dropdownRequired: true,
    dropdownDefaultValue: "per_month",
    dropdownHelperText: "",
    dropdownOptions: [
      { value: "per_day", label: "Per Day" },
      { value: "per_week", label: "Per Week" },
      { value: "per_month", label: "Per Month" },
      { value: "per_year", label: "Per Year" },
      { value: "per_loan", label: "Per Loan" },
    ],
  },

  // Duration Settings
  {
    label: "Duration Settings",
    type: "label",
    span: 12,
  },
  {
    label: "Preferred Start Date",
    name: "loanStartDate",
    type: "date",
    required: true,
    span: 6,
    helperText: "When would you like the loan to start?",
  },
  {
    type: "textAndDropdown",
    span: 6,
    textLabel: "Loan Duration",
    textName: "loanDuration",
    textType: "number",
    textRequired: true,
    textDefaultValue: "",
    textPlaceholder: "",
    textHelperText: "How long do you need the loan for?",
    textInputProps: {
      validationType: "number",
      min: 1,
    },
    dropdownLabel: "",
    dropdownName: "durationPeriod",
    dropdownRequired: true,
    dropdownDefaultValue: "months",
    dropdownHelperText: "",
    dropdownOptions: [
      { value: "days", label: "Days" },
      { value: "weeks", label: "Weeks" },
      { value: "months", label: "Months" },
      { value: "years", label: "Years" },
    ],
  },

  // Repayment Settings
  {
    label: "Repayment Settings",
    type: "label",
    span: 12,
  },
  {
    label: "Repayment Frequency",
    name: "repaymentFrequency",
    type: "select",
    span: 6,
    defaultValue: "monthly",
    required: true,
    options: [
      { value: "daily", label: "Daily" },
      { value: "weekly", label: "Weekly" },
      { value: "biweekly", label: "Every 2 weeks" },
      { value: "monthly", label: "Monthly" },
      { value: "quarterly", label: "Quarterly" },
      { value: "every_4_months", label: "Every 4 months" },
      { value: "semi_annual", label: "Semi-annual" },
      { value: "yearly", label: "Yearly" },
    ],
    helperText: "How often will you make repayments?",
  },

  // Loan Purpose
  {
    label: "Additional Information",
    type: "label",
    span: 12,
  },
  {
    label: "Loan Purpose",
    name: "loanPurpose",
    type: "textarea",
    span: 12,
    required: false,
    helperText: "Briefly describe what the loan will be used for",
  },
];

export default customerBlankLoanForm;
