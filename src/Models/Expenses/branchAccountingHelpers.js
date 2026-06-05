import { generateClient } from "aws-amplify/api";

const LIST_ACCOUNT_BRANCHES_QUERY = `
  query ListAccountBranches($branchId: ID!, $nextToken: String) {
    listAccountBranches(
      filter: { branchId: { eq: $branchId } }
      limit: 100
      nextToken: $nextToken
    ) {
      items {
        account {
          id
          name
          accountType
          currency
          status
        }
      }
      nextToken
    }
  }
`;

// Fetches the set of Accounts linked to a branch via the AccountBranch
// many-to-many join. Mirrors the loader used by SelectAccounts (loan
// disbursement / fee collection accounts) so the new Expense / OtherIncome
// forms reuse exactly the same accounts list.
export const fetchBranchLinkedAccounts = async (branchId) => {
  if (!branchId) return [];
  const client = generateClient();
  const accounts = [];
  let nextToken = null;
  do {
    const result = await client.graphql({
      query: LIST_ACCOUNT_BRANCHES_QUERY,
      variables: { branchId, nextToken },
    });
    const items = result?.data?.listAccountBranches?.items || [];
    items.forEach((item) => {
      if (item?.account?.id) accounts.push(item.account);
    });
    nextToken = result?.data?.listAccountBranches?.nextToken || null;
  } while (nextToken);

  // De-dup by id and only show usable (active / system) accounts.
  const seen = new Set();
  return accounts.filter((account) => {
    if (seen.has(account.id)) return false;
    seen.add(account.id);
    const status = String(account.status || "").toLowerCase();
    return status === "active" || status === "system" || status === "";
  });
};
