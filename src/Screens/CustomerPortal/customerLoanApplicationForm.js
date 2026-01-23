const customerLoanApplicationForm = [
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
  {
    label: "Loan Amount",
    name: "principalAmount",
    type: "number",
    required: true,
    span: 6,
    helperText: "Enter the amount you wish to borrow",
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

export default customerLoanApplicationForm;
