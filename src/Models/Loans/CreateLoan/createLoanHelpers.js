import { generateClient } from "aws-amplify/api";
import { createLoan as createLoanMutation, createLoanInstallment as createLoanInstallmentMutation } from "../loanHelpers";
import { calculateSchedule } from "../../Payments/servicingEngine";
import dayjs from 'dayjs';

const runWithConcurrency = async (items, limit, worker) => {
  const list = Array.isArray(items) ? items : [];
  const concurrency = Math.max(1, Math.min(limit || 1, list.length || 1));
  const results = new Array(list.length);
  let nextIndex = 0;

  const runners = Array.from({ length: concurrency }, async () => {
    while (true) {
      const current = nextIndex;
      nextIndex += 1;
      if (current >= list.length) return;
      results[current] = await worker(list[current], current);
    }
  });

  await Promise.all(runners);
  return results;
};

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
      }
      nextToken
    }
  }
`;

const LIST_LOAN_PRODUCTS_QUERY = `
  query ListLoanProducts($institutionId: ID!, $nextToken: String) {
    listLoanProducts(
      filter: { institutionLoanProductsId: { eq: $institutionId } }
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

export const fetchLoanProducts = async (institutionId, branchId) => {
  const client = generateClient();
  let allLoanProductsList = [];
  let nextToken = null;

  try {
    console.log("Fetching loan products...");
    while (true) {
      console.log("API Call: LIST_LOAN_PRODUCTS_QUERY", {
        institutionId,
        nextToken,
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
    // If branchId provided, filter products to those associated with the branch
    if (branchId) {
      const filtered = allLoanProductsList.filter((p) => {
        const branchItems = p?.branches?.items || [];
        return branchItems.some((bi) => bi?.branch?.id === branchId);
      });
      return filtered;
    }

    return allLoanProductsList;
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

export const fetchLoanFeesConfig = async (institutionId) => {
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
    return allLoanFeesConfigList;
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
  
  // 1. Prepare Loan Input
  const loanInput = {
    loanNumber: `LN-${Date.now()}`,
    borrowerID: values?.borrower,
    branchID: userDetails?.branchUsersId,
    ...(values?.loanProduct ? { loanProductID: values.loanProduct } : {}),
    principal: Number(values?.principalAmount),
    interestRate: Number(values?.interestRate),
    duration,
    durationInterval,
    startDate,
    maturityDate,
    paymentFrequency: repaymentFrequency,
    loanStatusEnum: "DRAFT",
    approvalStatusEnum: "PENDING",
    createdByEmployeeID: userDetails?.id,
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

  // 3. Create Loan
  const result = await client.graphql({
    query: createLoanMutation,
    variables: { input: loanInput }
  });
  
  const loan = result.data.createLoan;
  
  // 4. Create Installments
  const installments = Array.isArray(schedule) ? schedule : [];
  const INSTALLMENT_CONCURRENCY = 6;

  await runWithConcurrency(installments, INSTALLMENT_CONCURRENCY, (inst) =>
    client.graphql({
      query: createLoanInstallmentMutation,
      variables: {
        input: {
          loanID: loan.id,
          dueDate: inst.dueDate,
          principalDue: inst.principalDue,
          interestDue: inst.interestDue,
          feesDue: inst.feesDue,
          penaltyDue: inst.penaltyDue,
          totalDue: inst.totalDue,
          principalPaid: 0,
          interestPaid: 0,
          feesPaid: 0,
          penaltyPaid: 0,
          totalPaid: 0,
          status: "PENDING",
        },
      },
    })
  );
  
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
  borrowerLoansId: values.borrower,
  loanProductLoansId: values.loanProduct,
  principalAmount: values.principalAmount ? Number(values.principalAmount) : null,
  interestRate: values.interestRate ? Number(values.interestRate) : null,
  termDuration: values.termDuration ? Number(values.termDuration) : null,
  durationPeriod: values.durationPeriod || null,
  disbursementDate: values.disbursementDate || null,
  maturityDate: values.maturityDate || null,
  status: values.status || "Pending",
  repaymentFrequency: values.repaymentFrequency || null,
  repaymentOrder: values.repaymentOrder ? JSON.stringify(values.repaymentOrder) : null,
  totalAmountDue: values.totalAmountDue ? Number(values.totalAmountDue) : null,
  totalAmountPaid: 0,
  outstandingBalance: values.principalAmount ? Number(values.principalAmount) : null,
  institutionLoansId: userDetails?.institutionUsersId || null,
  createdByEmployeeLoansId: userDetails?.id || null,
});