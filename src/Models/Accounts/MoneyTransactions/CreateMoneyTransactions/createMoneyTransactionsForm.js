import { rows } from "../../../../muiTemplates/dashboard/internals/data/gridData";

const createMoneyTransactionsForm = [
  {
    label: "Amount",
    name: "amount",
    type: "number",
    required: true,
    span: 6,
    validationType: "number",
    min: 0,
    validationMessage: "Amount must be positive",
  },
  {
    label: "Transaction Date",
    name: "transactionDate",
    type: "date",
    required: true,
    span: 6,
    defaultValue: new Date().toISOString().split("T")[0],
    validationType: "string",
  },
  {
    label: "Description",
    name: "description",
    type: "textarea",
    required: true,
    span: 12,
    rows: 2,
    placeholder: "(required)",
    validationType: "string",
    validationMessage: "Description is required",
  },
  {
    label: "Ref. Number",
    name: "referenceNumber",
    type: "text",
    required: false,
    span: 6,
    placeholder: "(optional)",
    validationType: "string",
  },
  
];

export default createMoneyTransactionsForm;
