const loanCalculatorForm = [
  // Principal Settings
  
  
  {
    label: "Principal Amount",
    name: "principalAmount",
    type: "number",
    required: true,
    span: 12,
    helperText: "The amount of money being lent.",
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
      { value: "compound_interest_accrued", label: "Compound Interest - Accrued" },
      { value: "compound_interest_equal_installments", label: "Compound Interest - Equal Installments" },
      { value: "declining_balance", label: "Declining Balance" },
      { value: "flat", label: "Flat" },
      { value: "interest_only", label: "Interest-Only" },
      { value: "reducing_balance_equal_installments", label: "Reducing Balance - Equal Installments" },
      { value: "reducing_balance_equal_principal", label: "Reducing Balance - Equal Principal" },
    ],
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
    dynamicLabelMap: {
      percentage: "Interest Rate",
      fixed: "Interest Amount",
    },
    dependsOn: "interestType",
    dropdownLabel: "",
    dropdownName: "interestPeriod",
    dropdownRequired: true,
    dropdownDefaultValue: "per_month",
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
    label: "Loan Start Date",
    name: "loanStartDate",
    type: "date",
    required: true,
    span: 6,
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
    textInputProps: {
      min: 1,
    },
    dropdownLabel: "",
    dropdownName: "durationPeriod",
    dropdownRequired: true,
    dropdownDefaultValue: "months",
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
    name: "repaymentFrequencyType",
    type: "radio",
    required: true,
    span: 12,
    defaultValue: "interval",
    options: [
      { value: "interval", label: "Interval Based" },
      { value: "setDays", label: "Set Days of the Week" },
      { value: "setDates", label: "Set Dates of the Month" },
    ],
    helperText: "Choose how repayments will be scheduled.",
  },
  {
    label: "Repayment Interval",
    name: "repaymentFrequency",
    type: "select",
    span: 6,
    defaultValue: "monthly",
    options: [
      { value: "daily", label: "Daily" },
      { value: "weekly", label: "Weekly" },
      { value: "biweekly", label: "Biweekly" },
      { value: "monthly", label: "Monthly" },
      { value: "bimonthly", label: "Bi-Monthly" },
      { value: "quarterly", label: "Quarterly" },
      { value: "every_4_months", label: "Every 4 months" },
      { value: "semi_annual", label: "Semi-annual" },
      { value: "every_9_months", label: "Every 9 months" },
      { value: "yearly", label: "Yearly" },
      { value: "lump_sum", label: "Lump Sum" },
    ],
    helperText: "Select the interval for repayment.",
    dependsOn: "repaymentFrequencyType",
    dependsOnValue: "interval",
  },
  {
    label: "Payment Days",
    name: "customPaymentDays",
    type: "selectMultiple",
    span: 6,
    defaultValue: [],
    options: [
      { value: "Monday", label: "Monday" },
      { value: "Tuesday", label: "Tuesday" },
      { value: "Wednesday", label: "Wednesday" },
      { value: "Thursday", label: "Thursday" },
      { value: "Friday", label: "Friday" },
      { value: "Saturday", label: "Saturday" },
      { value: "Sunday", label: "Sunday" },
    ],
    helperText: "Select the days of the week on which payments should be received.",
    dependsOn: "repaymentFrequencyType",
    dependsOnValue: "setDays",
    showSelectAll: false,
  },
  {
    label: "Payment Dates",
    name: "customPaymentDates",
    type: "selectMultiple",
    span: 6,
    defaultValue: [],
    options: Array.from({ length: 31 }).map((_, i) => {
      const v = String(i + 1);
      return { value: v, label: v };
    }),
    helperText: "Select the dates of the month on which payments should be received.",
    dependsOn: "repaymentFrequencyType",
    dependsOnValue: "setDates",
    showSelectAll: false,
  },
];

export default loanCalculatorForm;
