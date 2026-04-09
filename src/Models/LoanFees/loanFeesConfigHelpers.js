import { generateClient } from "aws-amplify/api";

const LIST_BRANCHES_QUERY = `
  query ListBranches($institutionId: ID!, $nextToken: String) {
    listBranches(
      filter: { institutionBranchesId: { eq: $institutionId } }
      limit: 100
      nextToken: $nextToken
    ) {
      items {
        id
        name
      }
      nextToken
    }
  }
`;

const LIST_BRANCH_LOAN_FEES_CONFIGS_QUERY = `
  query ListBranchLoanFeesConfigs($loanFeesConfigId: ID!, $nextToken: String) {
    listBranchLoanFeesConfigs(
      filter: { loanFeesConfigId: { eq: $loanFeesConfigId } }
      limit: 100
      nextToken: $nextToken
    ) {
      items {
        id
        branchId
        loanFeesConfigId
        branch {
          id
          name
        }
      }
      nextToken
    }
  }
`;

const CREATE_BRANCH_LOAN_FEES_CONFIG_MUTATION = `
  mutation CreateBranchLoanFeesConfig($input: CreateBranchLoanFeesConfigInput!) {
    createBranchLoanFeesConfig(input: $input) {
      id
    }
  }
`;

const DELETE_BRANCH_LOAN_FEES_CONFIG_MUTATION = `
  mutation DeleteBranchLoanFeesConfig($input: DeleteBranchLoanFeesConfigInput!) {
    deleteBranchLoanFeesConfig(input: $input) {
      id
    }
  }
`;

export const fetchInstitutionBranches = async (institutionId) => {
  if (!institutionId) return [];

  const client = generateClient();
  const branches = [];
  let nextToken = null;

  while (true) {
    const result = await client.graphql({
      query: LIST_BRANCHES_QUERY,
      variables: {
        institutionId,
        nextToken,
      },
    });

    const listResult = result?.data?.listBranches || {};
    const batchItems = Array.isArray(listResult.items) ? listResult.items : [];
    branches.push(...batchItems);

    nextToken = listResult.nextToken || null;
    if (!nextToken) break;
  }

  return branches;
};

export const listLoanFeeBranchRelations = async (loanFeesConfigId) => {
  if (!loanFeesConfigId) return [];

  const client = generateClient();
  const relations = [];
  let nextToken = null;

  while (true) {
    const result = await client.graphql({
      query: LIST_BRANCH_LOAN_FEES_CONFIGS_QUERY,
      variables: {
        loanFeesConfigId,
        nextToken,
      },
    });

    const listResult = result?.data?.listBranchLoanFeesConfigs || {};
    const batchItems = Array.isArray(listResult.items) ? listResult.items : [];
    relations.push(...batchItems);

    nextToken = listResult.nextToken || null;
    if (!nextToken) break;
  }

  return relations;
};

export const syncLoanFeeBranches = async (loanFeesConfigId, branchIds = []) => {
  if (!loanFeesConfigId) return [];

  const client = generateClient();
  const existingRelations = await listLoanFeeBranchRelations(loanFeesConfigId);

  for (const relation of existingRelations) {
    await client.graphql({
      query: DELETE_BRANCH_LOAN_FEES_CONFIG_MUTATION,
      variables: { input: { id: relation.id } },
    });
  }

  for (const branchId of branchIds) {
    await client.graphql({
      query: CREATE_BRANCH_LOAN_FEES_CONFIG_MUTATION,
      variables: {
        input: {
          branchId,
          loanFeesConfigId,
        },
      },
    });
  }

  return branchIds;
};

export const extractLoanFeeBranchIds = (loanFeeConfig) => {
  const items = loanFeeConfig?.branches?.items || [];
  return items
    .map((item) => item?.branch?.id || item?.branchId)
    .filter(Boolean);
};

export const buildLoanFeeBranchItems = (branchIds = [], branches = []) => {
  return branchIds.map((branchId) => {
    const branchDetails = branches.find((branch) => branch.id === branchId);
    return {
      branchId,
      branch: {
        id: branchId,
        name: branchDetails?.name || "",
      },
    };
  });
};