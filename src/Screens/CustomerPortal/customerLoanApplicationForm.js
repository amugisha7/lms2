const customerLoanApplicationForm = [
  // Loan Product Selection
  {
    label: "Loan Product",
    type: "label",
    span: 12,
  },
  {
    label: "Select Loan Product",
    name: "loanProduct",
    type: "select",
    required: true,
    span: 12,
    options: [], // Populated dynamically with visible products
    dynamicoptions: "true",
    helperText: "Choose the type of loan you wish to apply for", 
  },

  // Loan Amount
    {
    label: "Loan Amount",
    type: "label",
    span: 12,
  },

  {
    label: "Loan Amount",
    name: "principalAmount",
    type: "number",
    required: true,
    span: 12,
    helperText: "Enter the amount you wish to borrow",
  },

  // Loan Duration (combined text and dropdown)
    {
    label: "Loan Duration",
    type: "label",
    span: 12,
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

  // Preferred Start Date
  {
    label: "Preferred Start Date",
    name: "loanStartDate",
    type: "date",
    required: true,
    span: 6,
    helperText: "When would you like the loan to start?",
  },

    // Loan Purpose
  {
    label: "Loan Purpose",
    name: "loanPurpose",
    type: "textarea",
    span: 12,
    required: false,
    helperText: "Briefly describe what the loan will be used for",
  },
];

export default customerLoanApplicationForm;
