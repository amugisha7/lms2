import { countries } from "../../Resources/listOfCountries";
import { currenciesObj } from "../../Resources/currenciesObj";

const currencies = Object.keys(currenciesObj);

const dateFormatOptions = [
  { value: "dd-mmm-yyyy", label: "DD-MMM-YYYY (e.g., 15-Jan-2025)" },
  { value: "dd/mm/yyyy", label: "DD/MM/YYYY (e.g., 15/01/2025)" },
  { value: "mm/dd/yyyy", label: "MM/DD/YYYY (e.g., 01/15/2025)" },
  { value: "yyyy-mm-dd", label: "YYYY-MM-DD (e.g., 2025-01-15)" },
];

const countryOptions = countries.map((country) => ({
  value: country,
  label: country,
}));

const currencyOptions = currencies.map((currency) => ({
  value: currency,
  label: `${currency} - ${currenciesObj[currency].name}`,
}));

export const settingsForm = [
  // Institution Information Section
  {
    label: "Organization Details",
    type: "label",
    span: 12,
  },
  {
    label: "Institution Name",
    name: "name",
    type: "text",
    required: true,
    span: 12,
    helperText: "The official name of your institution.",
  },
  {
    label: "Institution ID",
    name: "institutionUsersId",
    type: "text",
    span: 12,
    helperText: "The unique identifier for your institution.",
    adminOnly: true,
    readOnly: true,
  },
  {
    label: "Branch",
    name: "branchName",
    type: "text",
    span: 12,
    helperText: "The branch name.",
    readOnly: true,
  },
  {
    label: "Country",
    name: "regulatoryRegion",
    type: "select",
    span: 12,
    helperText: "The country where your institution operates.",
    options: countryOptions,
  },

  // Financial Settings
  {
    label: "Financial Settings",
    type: "label",
    span: 12,
  },
  {
    label: "Currency",
    name: "currencyCode",
    type: "select",
    required: true,
    span: 12,
    helperText: "The primary currency used for transactions.",
    options: currencyOptions,
  },
  
];
