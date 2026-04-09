import { generateClient } from "aws-amplify/api";
import { createLoan as createLoanMutation } from "../loanHelpers";
import { calculateSchedule } from "../../Payments/servicingEngine";
import dayjs from 'dayjs';
import { resolveEmployeeIdForUser } from "../../Employees/employeeHelpers";

const LIST_ACCOUNTS_MINIMAL_QUERY = `
  query ListAccounts($institutionId: ID!, $nextToken: String) {
    listAccounts(
      filter: { institutionAccountsId: { eq: $institutionId } }
      limit: 100
      nextToken: $nextToken
    ) {
      items {
        id
        name
        status
      }
      nextToken
    }
  }
`;

const LIST_BORROWERS_QUERY = `
  query ListBorrowers($branchId: ID!, $nextToken: String) {
    listBorrowers(
      filter: { branchBorrowersId: { eq: $branchId } }
      limit: 100
      nextToken: $nextToken
    ) {
      items {
        id
        firstname
        othername
        businessName
        uniqueIdNumber
        branchBorrowersId
      }
      nextToken
    }
  }
`;

const LIST_BRANCHES_QUERY = `
  query ListBranches($institutionId: ID!, $nextToken: String) {
    listBranches(
      filter: { institutionBranchesId: { eq: $institutionId } }
      limit: 100
      nextToken: $nextToken
    ) {
      items {
        id
      }
      nextToken
    }
  }
`;

export const fetchBorrowersByInstitution = async (institutionId) => {
  const client = generateClient();
  let allBranches = [];
  let nextToken = null;

  // 1. Fetch all branches of the institution
  try {
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
      allBranches.push(...batchItems);

      nextToken = listResult.nextToken;
      if (!nextToken) break;
    }
  } catch (err) {
    console.error("Error fetching branches:", err);
    throw err;
  }

  // 2. Fetch borrowers for each branch (in parallel)
  try {
    const borrowersPromises = allBranches.map((branch) =>
      fetchBorrowers(branch.id)
    );
    const results = await Promise.all(borrowersPromises);
    return results.flat();
  } catch (err) {
    console.error("Error fetching borrowers for institution:", err);
    throw err;
  }
};

export const fetchBorrowers = async (branchId) => {
  const client = generateClient();
  let allBorrowersList = [];
  let nextToken = null;

  try {
    while (true) {
      console.log("API Call: LIST_BORROWERS_QUERY", {
        branchId,
        nextToken,
      });
      const result = await client.graphql({
        query: LIST_BORROWERS_QUERY,
        variables: {
          branchId,
          nextToken,
        },
      });

      const listResult = result?.data?.listBorrowers || {};
      const batchItems = Array.isArray(listResult.items)
        ? listResult.items
        : [];
      allBorrowersList.push(...batchItems);

      const newNextToken = listResult.nextToken || null;
      if (!newNextToken) {
        break;
      }
      nextToken = newNextToken;
    }
    return allBorrowersList;
  } catch (err) {
    console.error("Error fetching borrowers:", err);
    throw err;
  }
};

export const fetchLoanProducts = async (institutionId, branchId, isAdmin = false) => {
  const client = generateClient();
  let allLoanProductsList = [];
  let nextToken = null;

  try {
    console.log("Fetching loan products...");
    while (true) {
      console.log("API Call: LIST_LOAN_PRODUCTS_QUERY", {
        institutionId,
        nextToken,
        isAdmin,
      });
        const result = await client.graphql({
        query: `
          query ListLoanProducts($institutionId: ID!, $nextToken: String) {
            listLoanProducts(
              filter: { institutionLoanProductsId: { eq: $institutionId } }
              limit: 100
              nextToken: $nextToken
            ) {
              nextToken
              items {
                id
                name
                status
                calculateInterestOn
                durationPeriod
                extendLoanAfterMaturity
                interestCalculationMethod
                interestPeriod
                interestRateDefault
                interestRateMax
                interestRateMin
                interestType
                interestTypeMaturity
                loanInterestRateAfterMaturity
                principalAmountDefault
                principalAmountMax
                principalAmountMin
                recurringPeriodAfterMaturityUnit
                repaymentFrequency
                repaymentOrder
                termDurationDefault
                termDurationMax
                termDurationMin
                branches {
                  items {
                    branch {
                      id
                    }
                  }
                }
                loanFeesConfigs {
                  items {
                    loanFeesConfigId
                    loanFeesConfig {
                      id
                      name
                      calculationMethod
                      category
                      status
                      percentageBase
                      rate
                      branches {
                        items {
                          branchId
                          branch {
                            id
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `,
        variables: {
          institutionId,
          nextToken,
        },
      });

      const listResult = result?.data?.listLoanProducts || {};
      const batchItems = Array.isArray(listResult.items)
        ? listResult.items
        : [];
      allLoanProductsList.push(...batchItems);

      const newNextToken = listResult.nextToken || null;
      if (!newNextToken) {
        break;
      }
      nextToken = newNextToken;
    }
    const branchFilteredProducts =
      branchId && !isAdmin
        ? allLoanProductsList.filter((product) => {
            const branchItems = product?.branches?.items || [];
            return branchItems.some((item) => item?.branch?.id === branchId);
          })
        : allLoanProductsList;

    if (!branchId) {
      return branchFilteredProducts;
    }

    return branchFilteredProducts.map((product) => {
      const feeItems = product?.loanFeesConfigs?.items || [];
      const filteredFeeItems = feeItems.filter((item) => {
        const feeBranchItems = item?.loanFeesConfig?.branches?.items || [];
        if (feeBranchItems.length === 0) {
          return true;
        }

        return feeBranchItems.some(
          (feeBranchItem) =>
            feeBranchItem?.branch?.id === branchId ||
            feeBranchItem?.branchId === branchId,
        );
      });

      return {
        ...product,
        loanFeesConfigs: {
          ...(product?.loanFeesConfigs || {}),
          items: filteredFeeItems,
        },
      };
    });
  } catch (err) {
    console.error("Error fetching loan products:", err);
    throw err;
  }
};

export const fetchAccounts = async (institutionId) => {
  const client = generateClient();
  let allAccountsList = [];
  let nextToken = null;

  try {
    while (true) {
      console.log("API Call: LIST_ACCOUNTS_MINIMAL_QUERY", {
        institutionId,
        nextToken,
      });
      const result = await client.graphql({
        query: LIST_ACCOUNTS_MINIMAL_QUERY,
        variables: {
          institutionId,
          nextToken,
        },
      });

      const listResult = result?.data?.listAccounts || {};
      const batchItems = Array.isArray(listResult.items)
        ? listResult.items
        : [];
      allAccountsList.push(...batchItems);

      const newNextToken = listResult.nextToken || null;
      if (!newNextToken) {
        break;
      }
      nextToken = newNextToken;
    }
    return allAccountsList;
  } catch (err) {
    console.error("Error fetching accounts:", err);
    throw err;
  }
};

export const fetchLoanFeesConfig = async (institutionId, branchId = null) => {
  const client = generateClient();
  let allLoanFeesConfigList = [];
  let nextToken = null;

  try {
    while (true) {
      console.log("API Call: LIST_LOAN_FEES_CONFIG_QUERY", {
        institutionId,
        nextToken,
      });
      const result = await client.graphql({
        query: `
          query ListLoanFeesConfigs($institutionId: ID!, $nextToken: String) {
            listLoanFeesConfigs(
              filter: { institutionLoanFeesConfigsId: { eq: $institutionId } }
              limit: 100
              nextToken: $nextToken
            ) {
              items {
                id
                name
                calculationMethod
                category
                status
                description
                percentageBase
                rate
                branches {
                  items {
                    branchId
                    branch {
                      id
                      name
                    }
                  }
                }
              }
              nextToken
            }
          }
        `,
        variables: {
          institutionId,
          nextToken,
        },
      });

      const listResult = result?.data?.listLoanFeesConfigs || {};
      const batchItems = Array.isArray(listResult.items)
        ? listResult.items
        : [];
      allLoanFeesConfigList.push(...batchItems);

      const newNextToken = listResult.nextToken || null;
      if (!newNextToken) {
        break;
      }
      nextToken = newNextToken;
    }

    if (!branchId) {
      return allLoanFeesConfigList;
    }

    return allLoanFeesConfigList.filter((loanFeeConfig) => {
      const branchItems = loanFeeConfig?.branches?.items || [];
      if (branchItems.length === 0) {
        return true;
      }

      return branchItems.some(
        (item) => item?.branch?.id === branchId || item?.branchId === branchId,
      );
    });
  } catch (err) {
    console.error("Error fetching loan fees config:", err);
    throw err;
  }
};

export const createLoanWithSchedule = async (values, userDetails) => {
  const client = generateClient();
  const durationUnitMap = {
    days: "day",
    weeks: "week",
    months: "month",
    years: "year",
  };

  const mapRepaymentFrequency = (frequency) => {
    switch (frequency) {
      case "daily":
        return "DAILY";
      case "weekly":
        return "WEEKLY";
      case "biweekly":
        return "BIWEEKLY";
      case "monthly":
        return "MONTHLY";
      case "quarterly":
        return "QUARTERLY";
      case "semi_annual":
        return "SEMIANNUALLY";
      case "yearly":
        return "ANNUALLY";
      default:
        return "MONTHLY";
    }
  };

  const mapInterestMethod = (method) => {
    if (!method) return "FLAT";
    if (method === "flat") return "FLAT";
    if (String(method).startsWith("compound")) return "COMPOUND";
    return "SIMPLE";
  };

  const duration = Number(
    values?.termDuration ?? values?.loanDuration ?? values?.duration ?? 0
  );
  const durationInterval = values?.durationPeriod ?? values?.durationInterval;
  const startDate =
    values?.disbursementDate ?? values?.loanStartDate ?? values?.startDate;

  const maturityDate =
    values?.maturityDate ||
    (startDate && duration && durationInterval
      ? dayjs(startDate)
          .add(duration, durationUnitMap[durationInterval] || durationInterval)
          .format("YYYY-MM-DD")
      : null);

  const repaymentFrequency = mapRepaymentFrequency(
    values?.repaymentFrequency ?? values?.paymentFrequency
  );
  const interestMethod = mapInterestMethod(values?.interestMethod);
  const borrowerId = values?.borrower;
  const borrowerBranchId =
    values?.borrowerBranchID || values?.borrowerObj?.branchBorrowersId || null;
  const actorEmployeeId = await resolveEmployeeIdForUser({
    userDetails,
    branchId: borrowerBranchId || userDetails?.branchUsersId || null,
  });
  const loanOfficerEmployeeId = await resolveEmployeeIdForUser({
    userDetails,
    preferredEmployeeId: values?.employeeId || values?.assignedToEmployeeID,
    branchId: borrowerBranchId || userDetails?.branchUsersId || null,
  });
  
  // 1. Prepare Loan Input
  const loanInput = {
    loanNumber: `LN-${Date.now()}`,
    borrowerID: borrowerId,
    branchID: borrowerBranchId || userDetails?.branchUsersId || null,
    ...(values?.loanProduct ? { loanProductID: values.loanProduct } : {}),
    principal: Number(values?.principalAmount),
    interestRate: Number(values?.interestRate),
    duration,
    durationInterval,
    startDate,
    maturityDate,
    paymentFrequency: repaymentFrequency,
    loanComputationRecord: JSON.stringify({
      principalAmount: Number(values?.principalAmount),
      interestRate: Number(values?.interestRate),
      interestMethod: values?.interestMethod || null,
      interestCalculationMethod: values?.interestMethod || null,
      interestType: values?.interestType || "percentage",
      interestPeriod: values?.interestPeriod || "per_month",
      loanStartDate: startDate,
      startDate,
      maturityDate,
      termDuration: duration,
      loanDuration: duration,
      durationPeriod: durationInterval,
      durationInterval,
      repaymentFrequency,
      paymentFrequency: repaymentFrequency,
      repaymentFrequencyType: values?.repaymentFrequencyType || null,
      customPaymentDays: values?.customPaymentDays || [],
      customPaymentDates: values?.customPaymentDates || [],
    }),
    status: "DRAFT",
    createdByEmployeeID: loanOfficerEmployeeId || actorEmployeeId,
  };

  // 2. Calculate Schedule
  const schedule = calculateSchedule({
    principal: loanInput.principal,
    interestRate: loanInput.interestRate,
    duration: loanInput.duration,
    durationUnit: loanInput.durationInterval,
    repaymentFrequency: loanInput.paymentFrequency,
    interestMethod,
    startDate: loanInput.startDate
  });

  if (!Array.isArray(schedule) || schedule.length === 0) {
    throw new Error("Unable to compute a repayment schedule for this loan.");
  }

  // 3. Create Loan
  const result = await client.graphql({
    query: createLoanMutation,
    variables: { input: loanInput }
  });
  
  const loan = result.data.createLoan;
  
  return loan;
};

export const createLoan = createLoanWithSchedule;

export const associateLoanWithFees = async (loanId, loanFeesId) => {
  const client = generateClient();
  await client.graphql({
    query: `
      mutation CreateLoanLoanFees($input: CreateLoanLoanFeesInput!) {
        createLoanLoanFees(input: $input) {
          id
        }
      }
    `,
    variables: {
      input: {
        loanId,
        loanFeesId,
      },
    },
  });
};

export const associateLoanWithPenalty = async (loanId, penaltyId) => {
  const client = generateClient();
  await client.graphql({
    query: `
      mutation CreateLoanPenalty($input: CreateLoanPenaltyInput!) {
        createLoanPenalty(input: $input) {
          id
        }
      }
    `,
    variables: {
      input: {
        loanId,
        penaltyId,
      },
    },
  });
};

export const buildLoanInput = (values, userDetails) => ({
  borrowerID: values.borrower || null,
  branchID:
    values.borrowerBranchID ||
    values.borrowerObj?.branchBorrowersId ||
    userDetails?.branchUsersId ||
    null,
  ...(values.loanProduct ? { loanProductID: values.loanProduct } : {}),
  principal: values.principalAmount ? Number(values.principalAmount) : null,
  interestRate: values.interestRate ? Number(values.interestRate) : null,
  duration: values.termDuration ? Number(values.termDuration) : null,
  durationInterval: values.durationPeriod || null,
  startDate: values.disbursementDate || null,
  maturityDate: values.maturityDate || null,
  status: values.status || "DRAFT",
  paymentFrequency: values.repaymentFrequency || null,
  createdByEmployeeID: values.employeeId || null,
});
export const fetchInstitutionAdmins = async (institutionId) => {
  const client = generateClient();
  let admins = [];
  let nextToken = null;

  const LIST_ADMINS_QUERY = `
    query ListUsers($institutionId: ID!, $nextToken: String) {
      listUsers(
        filter: {
          institutionUsersId: { eq: $institutionId }
          userType: { eq: "admin" }
        }
        limit: 100
        nextToken: $nextToken
      ) {
        items {
          id
          firstName
          lastName
          email
        }
        nextToken
      }
    }
  `;

  try {
    do {
      const result = await client.graphql({
        query: LIST_ADMINS_QUERY,
        variables: {
          institutionId,
          nextToken,
        },
      });
      const items = result.data.listUsers.items;
      admins = [...admins, ...items];
      nextToken = result.data.listUsers.nextToken;
    } while (nextToken);
  } catch (err) {
    console.error("Error fetching admins:", err);
  }

  return admins;
};

