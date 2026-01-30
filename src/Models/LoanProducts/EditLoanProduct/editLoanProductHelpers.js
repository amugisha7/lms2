import { generateClient } from "aws-amplify/api";

export const updateLoanProduct = async (input) => {
  const client = generateClient();
  const result = await client.graphql({
    query: `
      mutation UpdateLoanProduct($input: UpdateLoanProductInput!) {
        updateLoanProduct(input: $input) {
          id
          name
          status
          principalAmountMin
          principalAmountMax
          principalAmountDefault
          interestRateMin
          interestRateMax
          interestRateDefault
          interestCalculationMethod
          interestType
          interestPeriod
          termDurationMin
          termDurationMax
          termDurationDefault
          durationPeriod
          repaymentFrequency
          repaymentOrder
          extendLoanAfterMaturity
          interestTypeMaturity
          calculateInterestOn
          loanInterestRateAfterMaturity
          recurringPeriodAfterMaturityUnit
          customLoanProductDetails
          branches {
            items {
              branch {
                id
                name
              }
            }
          }
          loanFeesConfigs {
            items {
              loanFeesConfig {
                id
                name
              }
            }
          }
        }
      }
    `,
    variables: { input },
  });
  return result?.data?.updateLoanProduct;
};

export const getLoanProductById = async (id) => {
  const client = generateClient();
  const result = await client.graphql({
    query: `
            query GetLoanProduct($id: ID!) {
                getLoanProduct(id: $id) {
                    id
                    name
                    status
                    principalAmountMin
                    principalAmountMax
                    principalAmountDefault
                    interestRateMin
                    interestRateMax
                    interestRateDefault
                    interestCalculationMethod
                    interestType
                    interestPeriod
                    termDurationMin
                    termDurationMax
                    termDurationDefault
                    durationPeriod
                    repaymentFrequency
                    repaymentOrder
                    extendLoanAfterMaturity
                    interestTypeMaturity
                    calculateInterestOn
                    loanInterestRateAfterMaturity
                    recurringPeriodAfterMaturityUnit
                    customLoanProductDetails
                    branches {
                        items {
                            branch {
                                id
                                name
                            }
                        }
                    }
                    loanFeesConfigs {
                        items {
                            loanFeesConfig {
                                id
                                name
                            }
                        }
                    }
                }
            }
        `,
    variables: { id }
  });
  return result?.data?.getLoanProduct;
}

export const buildLoanProductUpdateInput = (values, userDetails, id) => {
  // Build customLoanProductDetails
  const customDetails = {
    customerPortalVisible: values.customerPortalVisible === 'yes',
  };

  return {
    id: id,
    institutionLoanProductsId: userDetails.institutionUsersId,
    name: values.name,
    status: values.status || "Active",
    principalAmountMin: values.minPrincipal ? Number(values.minPrincipal) : null,
    principalAmountMax: values.maxPrincipal ? Number(values.maxPrincipal) : null,
    principalAmountDefault: values.defaultPrincipal
      ? Number(values.defaultPrincipal)
      : null,
    interestRateMin: values.minInterest ? Number(values.minInterest) : null,
    interestRateMax: values.maxInterest ? Number(values.maxInterest) : null,
    interestRateDefault: values.defaultInterest
      ? Number(values.defaultInterest)
      : null,
    interestCalculationMethod: values.interestMethod || null,
    interestType: values.interestType || null,
    interestPeriod: values.interestPeriod || null,
    termDurationMin: values.minDuration ? Number(values.minDuration) : null,
    termDurationMax: values.maxDuration ? Number(values.maxDuration) : null,
    termDurationDefault: values.defaultDuration
      ? Number(values.defaultDuration)
      : null,
    durationPeriod: values.durationPeriod || null,
    repaymentFrequency: values.repaymentFrequency || null,
    repaymentOrder: values.repaymentOrder ? JSON.stringify(values.repaymentOrder) : null,
    extendLoanAfterMaturity:
      values.extendLoanAfterMaturity === ""
        ? null
        : values.extendLoanAfterMaturity === "yes",
    interestTypeMaturity: values.interestTypeMaturity || null,
    calculateInterestOn: values.calculateInterestOn || null,
    loanInterestRateAfterMaturity: values.loanInterestRateAfterMaturity
      ? Number(values.loanInterestRateAfterMaturity)
      : null,
    recurringPeriodAfterMaturityUnit:
      values.recurringPeriodAfterMaturityUnit || null,
    customLoanProductDetails: JSON.stringify(customDetails),
  };
};

export const LIST_BRANCHES_QUERY = `
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

export const LIST_LOAN_FEES_QUERY = `
  query ListLoanFeesConfigs($institutionId: ID!, $nextToken: String) {
    listLoanFeesConfigs(
      filter: {
        institutionLoanFeesConfigsId: { eq: $institutionId }
        status: { eq: "active" }
      }
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

export const fetchBranchesAndFees = async (institutionId) => {
  const client = generateClient();
  const branches = [];
  const loanFees = [];

  try {
    // Fetch Branches
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
      const batchItems = Array.isArray(listResult.items)
        ? listResult.items
        : [];
      branches.push(...batchItems);

      const newNextToken = listResult.nextToken || null;
      if (!newNextToken) {
        break;
      }
      nextToken = newNextToken;
    }

    // Fetch Loan Fees
    nextToken = null;
    while (true) {
      const result = await client.graphql({
        query: LIST_LOAN_FEES_QUERY,
        variables: {
          institutionId,
          nextToken,
        },
      });

      const listResult = result?.data?.listLoanFeesConfigs || {};
      const batchItems = Array.isArray(listResult.items)
        ? listResult.items
        : [];
      loanFees.push(...batchItems);

      const newNextToken = listResult.nextToken || null;
      if (!newNextToken) {
        break;
      }
      nextToken = newNextToken;
    }
  } catch (err) {
    console.error("Error fetching branches or fees:", err);
    throw err;
  }

  return { branches, loanFees };
};