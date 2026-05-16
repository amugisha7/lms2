import { generateClient } from "aws-amplify/api";
import {
  listBranches,
  accountsByInstitutionID,
  accountBranchesByBranchId,
} from "../graphql/queries";
import { updateInstitution } from "../Models/Settings/helpers/updateInstitution";
import { GET_BRANCH_BORROWERS_QUERY } from "../Models/Borrowers/borrowerQueries";
import {
  ensureDefaultEmployeeForUser,
  fetchEmployeeByRelatedUserId,
} from "../Models/Employees/employeeHelpers";
import {
  parseCustomInstitutionDetails,
  stringifyCustomInstitutionDetails,
} from "./customInstitutionDetails";

const DEFAULT_BRANCH_NAME = "Branch #001";
const DEFAULT_SYSTEM_ACCOUNT_NAME = "Cash_System_Default";
const DEFAULT_SYSTEM_ACCOUNT_DESCRIPTION = "Default system account";

const CREATE_BRANCH_MUTATION = `
  mutation CreateBranch($input: CreateBranchInput!) {
    createBranch(input: $input) {
      id
      name
      branchCode
      address
      status
      institutionID
      createdAt
      updatedAt
    }
  }
`;

const CREATE_ACCOUNT_MUTATION = `
  mutation CreateAccount($input: CreateAccountInput!) {
    createAccount(input: $input) {
      id
      name
      openingBalance
      status
      currency
      accountType
      description
      institutionID
      createdAt
      updatedAt
    }
  }
`;

const CREATE_ACCOUNT_BRANCH_MUTATION = `
  mutation CreateAccountBranch($input: CreateAccountBranchInput!) {
    createAccountBranch(input: $input) {
      id
      accountId
      branchId
    }
  }
`;

const RECOVERY_DEFAULTS = {
  defaultBranch: {
    key: "defaultBranch",
    title: "Default branch",
    description: "Your institution does not have a branch yet.",
  },
  currentBranch: {
    key: "currentBranch",
    title: "Active branch",
    description:
      "The institution does not have a valid currentBranchID in customInstitutionDetails.",
  },
  defaultSystemAccount: {
    key: "defaultSystemAccount",
    title: "Default system account",
    description:
      "The active branch is missing its default system cash account link.",
  },
  defaultEmployee: {
    key: "defaultEmployee",
    title: "Default employee",
    description:
      "The admin user is missing the default employee record for the active branch.",
  },
};

const buildRecoveryState = (overrides = {}) => ({
  required: false,
  missingDefaults: [],
  canAutoRepair: false,
  showRecoveryScreen: false,
  validationFailed: false,
  reason: "ready",
  errorMessage: null,
  ...overrides,
});

const getClient = (graphClient) => graphClient || generateClient();

const logRecoveryApiCall = (operation, variables) => {
  console.log(`[admin-defaults-recovery] API ${operation}`, variables);
};

const logRecoveryError = (step, error, context = {}) => {
  console.error(`[admin-defaults-recovery] ${step} failed`, {
    message: error?.message,
    context,
    error,
    graphqlErrors: error?.errors,
    data: error?.data,
  });
};

const isAdminUser = (userDetails) =>
  String(userDetails?.userType || "").toLowerCase() === "admin";

const addMissingDefault = (collection, key) => {
  if (!RECOVERY_DEFAULTS[key]) {
    return collection;
  }

  if (collection.some((item) => item.key === key)) {
    return collection;
  }

  return [...collection, RECOVERY_DEFAULTS[key]];
};

const fetchAllPages = async (query, variables, accessor, graphClient) => {
  const client = getClient(graphClient);
  const items = [];
  let nextToken = null;

  do {
    let response;
    try {
      response = await client.graphql({
        query,
        variables: {
          ...variables,
          nextToken,
        },
      });
    } catch (error) {
      logRecoveryError("fetchAllPages", error, {
        variables: {
          ...variables,
          nextToken,
        },
      });
      throw error;
    }

    const page = accessor(response) || {};
    items.push(...(page.items || []));
    nextToken = page.nextToken || null;
  } while (nextToken);

  return items.filter(Boolean);
};

const sortBranches = (branches = []) =>
  [...branches].sort((left, right) => {
    const leftTime = new Date(left?.createdAt || 0).getTime();
    const rightTime = new Date(right?.createdAt || 0).getTime();
    return leftTime - rightTime;
  });

const listInstitutionBranches = async (institutionId, graphClient) => {
  if (!institutionId) {
    return [];
  }

  logRecoveryApiCall("listBranches", {
    filter: { institutionID: { eq: institutionId } },
    limit: 100,
  });

  const branches = await fetchAllPages(
    listBranches,
    {
      filter: { institutionID: { eq: institutionId } },
      limit: 100,
    },
    (response) => response?.data?.listBranches,
    graphClient,
  );

  return sortBranches(branches);
};

const branchHasAnyBorrowers = async (branchId, graphClient) => {
  if (!branchId) {
    return false;
  }

  const client = getClient(graphClient);
  logRecoveryApiCall("GetBranchBorrowers", {
    id: branchId,
    limit: 1,
  });

  const response = await client.graphql({
    query: GET_BRANCH_BORROWERS_QUERY,
    variables: {
      id: branchId,
      limit: 1,
    },
  });

  const borrowers = response?.data?.getBranch?.borrowers?.items || [];
  return borrowers.length > 0;
};

const getBorrowerPresenceGuard = async ({
  branches,
  recoveryBranchId,
  graphClient,
}) => {
  if (!branches.length) {
    return {
      branchHasBorrowers: false,
      institutionHasBorrowers: false,
    };
  }

  const checkedBranchIds = new Set();
  let recoveryBranchHasBorrowers = false;

  if (recoveryBranchId) {
    recoveryBranchHasBorrowers = await branchHasAnyBorrowers(
      recoveryBranchId,
      graphClient,
    );
    checkedBranchIds.add(recoveryBranchId);
  }

  if (recoveryBranchHasBorrowers) {
    return {
      branchHasBorrowers: true,
      institutionHasBorrowers: true,
    };
  }

  for (const branch of branches) {
    if (!branch?.id || checkedBranchIds.has(branch.id)) {
      continue;
    }

    const hasBorrowers = await branchHasAnyBorrowers(branch.id, graphClient);
    checkedBranchIds.add(branch.id);

    if (hasBorrowers) {
      return {
        branchHasBorrowers: false,
        institutionHasBorrowers: true,
      };
    }
  }

  return {
    branchHasBorrowers: false,
    institutionHasBorrowers: false,
  };
};

const getSystemAccountForInstitution = async (institutionId, graphClient) => {
  if (!institutionId) {
    return null;
  }

  const client = getClient(graphClient);
  let response;
  try {
    logRecoveryApiCall("accountsByInstitutionID", {
      institutionID: institutionId,
      limit: 20,
      filter: {
        name: { eq: DEFAULT_SYSTEM_ACCOUNT_NAME },
      },
    });
    response = await client.graphql({
      query: accountsByInstitutionID,
      variables: {
        institutionID: institutionId,
        limit: 20,
        filter: {
          name: { eq: DEFAULT_SYSTEM_ACCOUNT_NAME },
        },
      },
    });
  } catch (error) {
    logRecoveryError("getSystemAccountForInstitution", error, {
      institutionId,
    });
    throw error;
  }

  const accounts = response?.data?.accountsByInstitutionID?.items || [];
  return (
    accounts.find(
      (account) =>
        account?.name === DEFAULT_SYSTEM_ACCOUNT_NAME &&
        account?.description === DEFAULT_SYSTEM_ACCOUNT_DESCRIPTION,
    ) || accounts.find(Boolean) || null
  );
};

const isSystemAccountLinkedToBranch = async (branchId, accountId, graphClient) => {
  if (!branchId || !accountId) {
    return false;
  }

  logRecoveryApiCall("accountBranchesByBranchId", {
    branchId,
    limit: 100,
  });

  const branchLinks = await fetchAllPages(
    accountBranchesByBranchId,
    {
      branchId,
      limit: 100,
    },
    (response) => response?.data?.accountBranchesByBranchId,
    graphClient,
  );

  return branchLinks.some((link) => link.accountId === accountId);
};

const chooseRecoveryBranch = ({
  branches,
  currentBranchId,
  fallbackBranchId,
  userBranch,
}) => {
  const branchById = new Map(branches.map((branch) => [branch.id, branch]));

  if (currentBranchId && branchById.has(currentBranchId)) {
    return branchById.get(currentBranchId);
  }

  if (fallbackBranchId && branchById.has(fallbackBranchId)) {
    return branchById.get(fallbackBranchId);
  }

  if (userBranch?.id) {
    return branchById.get(userBranch.id) || userBranch;
  }

  return branches[0] || null;
};

export const getAdminDefaultsRecoveryState = async ({
  userDetails,
  graphClient,
}) => {
  if (!isAdminUser(userDetails) || !userDetails?.institutionID) {
    return buildRecoveryState();
  }

  try {
    const institutionId = userDetails.institutionID;
    const details = parseCustomInstitutionDetails(
      userDetails?.institution?.customInstitutionDetails,
    );
    const currentBranchId = details.currentBranchID || null;
    const fallbackBranchId =
      userDetails?.branchID || userDetails?.branch?.id || null;
    const branches = await listInstitutionBranches(institutionId, graphClient);

    let missingDefaults = [];

    if (!branches.length) {
      missingDefaults = addMissingDefault(missingDefaults, "defaultBranch");
      missingDefaults = addMissingDefault(missingDefaults, "currentBranch");
      return buildRecoveryState({
        required: true,
        missingDefaults,
        canAutoRepair: true,
        reason: "missing-defaults",
      });
    }

    const recoveryBranch = chooseRecoveryBranch({
      branches,
      currentBranchId,
      fallbackBranchId,
      userBranch: userDetails?.branch,
    });

    if (
      !currentBranchId ||
      !branches.some((branch) => branch.id === currentBranchId)
    ) {
      missingDefaults = addMissingDefault(missingDefaults, "currentBranch");
    }

    if (!recoveryBranch?.id) {
      missingDefaults = addMissingDefault(missingDefaults, "defaultBranch");
      return buildRecoveryState({
        required: true,
        missingDefaults,
        canAutoRepair: true,
        reason: "missing-defaults",
      });
    }

    const systemAccount = await getSystemAccountForInstitution(
      institutionId,
      graphClient,
    );
    const isAccountLinked = systemAccount?.id
      ? await isSystemAccountLinkedToBranch(
          recoveryBranch.id,
          systemAccount.id,
          graphClient,
        )
      : false;

    if (!systemAccount?.id || !isAccountLinked) {
      missingDefaults = addMissingDefault(missingDefaults, "defaultSystemAccount");
    }

    const defaultEmployee = await fetchEmployeeByRelatedUserId(
      userDetails.id,
      recoveryBranch.id,
    );

    if (!defaultEmployee?.id) {
      missingDefaults = addMissingDefault(missingDefaults, "defaultEmployee");
    }

    if (missingDefaults.length > 0) {
      const borrowerPresence = await getBorrowerPresenceGuard({
        branches,
        recoveryBranchId: recoveryBranch?.id || null,
        graphClient,
      });

      if (
        borrowerPresence.branchHasBorrowers ||
        borrowerPresence.institutionHasBorrowers
      ) {
        console.warn(
          "[admin-defaults-recovery] Borrowers already exist; skipping automatic repair to avoid a false negative.",
          {
            institutionId,
            recoveryBranchId: recoveryBranch?.id || null,
            missingDefaults,
            borrowerPresence,
          },
        );

        return buildRecoveryState({
          reason: "borrowers-present",
        });
      }
    }

    return buildRecoveryState({
      required: missingDefaults.length > 0,
      missingDefaults,
      canAutoRepair: missingDefaults.length > 0,
      reason: missingDefaults.length > 0 ? "missing-defaults" : "ready",
    });
  } catch (error) {
    logRecoveryError("getAdminDefaultsRecoveryState", error, {
      userId: userDetails?.id,
      institutionId: userDetails?.institutionID,
    });

    return buildRecoveryState({
      validationFailed: true,
      reason: "validation-error",
      errorMessage: error?.message || "Failed to validate admin defaults.",
    });
  }
};

export const repairAdminDefaults = async ({ userDetails, graphClient }) => {
  if (!isAdminUser(userDetails) || !userDetails?.institutionID) {
    return {
      repaired: false,
      actions: [],
    };
  }

  const client = getClient(graphClient);
  const institutionId = userDetails.institutionID;
  const details = parseCustomInstitutionDetails(
    userDetails?.institution?.customInstitutionDetails,
  );
  const actions = [];

  try {
    console.log("[admin-defaults-recovery] Starting repair", {
      userId: userDetails.id,
      institutionId,
      branchId: userDetails?.branchID || userDetails?.branch?.id || null,
      currentBranchID: details.currentBranchID || null,
    });

    let branches = await listInstitutionBranches(institutionId, client);
    let branch = chooseRecoveryBranch({
      branches,
      currentBranchId: details.currentBranchID || null,
      fallbackBranchId: userDetails?.branchID || userDetails?.branch?.id || null,
      userBranch: userDetails?.branch,
    });

    const borrowerPresence = await getBorrowerPresenceGuard({
      branches,
      recoveryBranchId: branch?.id || null,
      graphClient: client,
    });

    if (
      borrowerPresence.branchHasBorrowers ||
      borrowerPresence.institutionHasBorrowers
    ) {
      console.warn(
        "[admin-defaults-recovery] Repair skipped because borrowers already exist.",
        {
          institutionId,
          recoveryBranchId: branch?.id || null,
          borrowerPresence,
        },
      );

      return {
        repaired: false,
        skipped: true,
        actions: ["Skipped repair because borrowers already exist."],
      };
    }

    console.log("[admin-defaults-recovery] Resolved recovery branch", {
      availableBranchIds: branches.map((item) => item.id),
      selectedBranchId: branch?.id || null,
      currentBranchID: details.currentBranchID || null,
    });

    if (!branch?.id) {
      try {
        const createBranchInput = {
          name: DEFAULT_BRANCH_NAME,
          status: "system",
          institutionID: institutionId,
        };

        logRecoveryApiCall("CreateBranch", { input: createBranchInput });
        const branchResponse = await client.graphql({
          query: CREATE_BRANCH_MUTATION,
          variables: {
            input: createBranchInput,
          },
        });

        branch = branchResponse?.data?.createBranch || null;
        branches = branch?.id ? [branch] : branches;
        actions.push("Created the default branch.");
        console.log("[admin-defaults-recovery] Created default branch", {
          branch,
        });
      } catch (error) {
        logRecoveryError("createDefaultBranch", error, {
          institutionId,
          input: {
            name: DEFAULT_BRANCH_NAME,
            status: "system",
            institutionID: institutionId,
          },
        });
        throw error;
      }
    }

    if (!branch?.id) {
      throw new Error("The default branch could not be created or resolved.");
    }

    if (details.currentBranchID !== branch.id) {
      try {
        const institutionUpdateInput = stringifyCustomInstitutionDetails({
          ...details,
          currentBranchID: branch.id,
        });

        logRecoveryApiCall("UpdateInstitution", {
          input: {
            id: institutionId,
            customInstitutionDetails: institutionUpdateInput,
          },
        });
        await updateInstitution({
          id: institutionId,
          customInstitutionDetails: institutionUpdateInput,
        });
        actions.push("Set the institution active branch.");
        console.log("[admin-defaults-recovery] Updated institution active branch", {
          institutionId,
          currentBranchID: branch.id,
        });
      } catch (error) {
        logRecoveryError("updateInstitutionCurrentBranch", error, {
          institutionId,
          currentBranchID: branch.id,
        });
        throw error;
      }
    }

    let systemAccount = await getSystemAccountForInstitution(institutionId, client);

    if (!systemAccount?.id) {
      const accountInput = {
        institutionID: institutionId,
        name: DEFAULT_SYSTEM_ACCOUNT_NAME,
        openingBalance: 0,
        status: "active",
        currency:
          userDetails?.institution?.currencyCode || userDetails?.currencyCode,
        accountType: "system",
        description: DEFAULT_SYSTEM_ACCOUNT_DESCRIPTION,
      };

      try {
        logRecoveryApiCall("CreateAccount", { input: accountInput });
        const accountResponse = await client.graphql({
          query: CREATE_ACCOUNT_MUTATION,
          variables: {
            input: accountInput,
          },
        });
        systemAccount = accountResponse?.data?.createAccount || null;
        actions.push("Created the default system account.");
        console.log("[admin-defaults-recovery] Created default system account", {
          accountId: systemAccount?.id || null,
          institutionId,
        });
      } catch (error) {
        logRecoveryError("createDefaultSystemAccount", error, {
          institutionId,
          input: accountInput,
        });
        throw error;
      }
    }

    if (!systemAccount?.id) {
      throw new Error("The default system account could not be created or resolved.");
    }

    const isAccountLinked = await isSystemAccountLinkedToBranch(
      branch.id,
      systemAccount.id,
      client,
    );

    if (!isAccountLinked) {
      const accountBranchInput = {
        accountId: systemAccount.id,
        branchId: branch.id,
      };

      try {
        logRecoveryApiCall("CreateAccountBranch", {
          input: accountBranchInput,
        });
        await client.graphql({
          query: CREATE_ACCOUNT_BRANCH_MUTATION,
          variables: {
            input: accountBranchInput,
          },
        });
        actions.push("Linked the default system account to the active branch.");
        console.log("[admin-defaults-recovery] Linked system account to branch", {
          accountId: systemAccount.id,
          branchId: branch.id,
        });
      } catch (error) {
        logRecoveryError("linkSystemAccountToBranch", error, {
          institutionId,
          input: accountBranchInput,
        });
        throw error;
      }
    }

    try {
      logRecoveryApiCall("ensureDefaultEmployeeForUser", {
        userId: userDetails.id,
        branchId: branch.id,
        institutionId,
        email: userDetails.email,
      });
      const defaultEmployeeResult = await ensureDefaultEmployeeForUser({
        userId: userDetails.id,
        branchId: branch.id,
        institutionId,
        email: userDetails.email,
      });

      if (defaultEmployeeResult?.employee?.id) {
        actions.push(
          defaultEmployeeResult.created
            ? "Created the default employee record."
            : "Verified the default employee record.",
        );
      }

      console.log("[admin-defaults-recovery] Ensured default employee", {
        userId: userDetails.id,
        branchId: branch.id,
        employeeId: defaultEmployeeResult?.employee?.id || null,
        created: defaultEmployeeResult?.created || false,
      });
    } catch (error) {
      logRecoveryError("ensureDefaultEmployee", error, {
        userId: userDetails.id,
        branchId: branch.id,
        email: userDetails.email,
      });
      throw error;
    }

    console.log("[admin-defaults-recovery] Repair completed", {
      userId: userDetails.id,
      institutionId,
      branchId: branch.id,
      actions,
    });

    return {
      repaired: true,
      actions,
    };
  } catch (error) {
    logRecoveryError("repairAdminDefaults", error, {
      userId: userDetails.id,
      institutionId,
      branchId: userDetails?.branchID || userDetails?.branch?.id || null,
      currentBranchID: details.currentBranchID || null,
      actions,
    });
    throw error;
  }
};