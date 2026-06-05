const OTHER_INCOME_RESULT_FIELDS = `
  id
  name
  description
  amount
  incomeDate
  incomeType
  status
  branchID
  customOtherIncomeDetails
  createdAt
  updatedAt
`;

export const CREATE_OTHER_INCOME_MUTATION = `
  mutation CreateOtherIncome($input: CreateOtherIncomeInput!) {
    createOtherIncome(input: $input) {
      ${OTHER_INCOME_RESULT_FIELDS}
    }
  }
`;

export const UPDATE_OTHER_INCOME_MUTATION = `
  mutation UpdateOtherIncome($input: UpdateOtherIncomeInput!) {
    updateOtherIncome(input: $input) {
      ${OTHER_INCOME_RESULT_FIELDS}
    }
  }
`;

// Helper: parse the AWSJSON blob and pull the receiving-account / employee
// metadata we stash there (the OtherIncome schema has neither field as a
// first-class column, so we store them inside `customOtherIncomeDetails`).
export const parseOtherIncomeCustomDetails = (raw) => {
  if (raw == null) return {};
  if (typeof raw === "object") return { ...raw };
  if (typeof raw !== "string" || !raw.trim()) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

export const getOtherIncomeAccountId = (item) =>
  parseOtherIncomeCustomDetails(item?.customOtherIncomeDetails)?.accountId ||
  null;

export const getOtherIncomeEmployeeId = (item) =>
  parseOtherIncomeCustomDetails(item?.customOtherIncomeDetails)?.employeeId ||
  null;

export const buildOtherIncomeCustomDetails = ({
  existing,
  accountId,
  employeeId,
  accountSnapshot,
  employeeSnapshot,
}) => ({
  ...(existing || {}),
  accountId: accountId || null,
  employeeId: employeeId || null,
  accountSnapshot: accountSnapshot || existing?.accountSnapshot || null,
  employeeSnapshot: employeeSnapshot || existing?.employeeSnapshot || null,
});

export const DELETE_OTHER_INCOME_MUTATION = `
  mutation DeleteOtherIncome($input: DeleteOtherIncomeInput!) {
    deleteOtherIncome(input: $input) {
      id
    }
  }
`;
