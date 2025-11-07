import { generateClient } from "aws-amplify/api";

export const createLoanProduct = async (input) => {
  const client = generateClient();
  const result = await client.graphql({
    query: `
      mutation CreateLoanProduct($input: CreateLoanProductInput!) {
        createLoanProduct(input: $input) {
          id
          name
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
              id
              branch {
                id
                name
              }
            }
          }
          loanFees {
            items {
              id
            }
          }
        }
      }
    `,
    variables: { input },
  });
  return result?.data?.createLoanProduct;
};

export const associateBranchWithLoanProduct = async (
  loanProductId,
  branchId
) => {
  const client = generateClient();
  await client.graphql({
    query: `
      mutation CreateBranchLoanProduct($input: CreateBranchLoanProductInput!) {
        createBranchLoanProduct(input: $input) {
          id
        }
      }
    `,
    variables: {
      input: {
        branchId,
        loanProductId,
      },
    },
  });
};

export const associateFeeWithLoanProduct = async (loanProductId, loanFeesId) => {
  const client = generateClient();
  await client.graphql({
    query: `
      mutation CreateLoanProductLoanFees($input: CreateLoanProductLoanFeesInput!) {
        createLoanProductLoanFees(input: $input) {
          id
        }
      }
    `,
    variables: {
      input: {
        loanFeesId,
        loanProductId,
      },
    },
  });
};

export const buildLoanProductInput = (values, userDetails) => ({
  name: values.name,
  description: "",
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
  interestType: values.interestType || null,
  interestPeriod: values.interestPeriod || null,
  termDurationMin: values.minDuration ? Number(values.minDuration) : null,
  termDurationMax: values.maxDuration ? Number(values.maxDuration) : null,
  termDurationDefault: values.defaultDuration
    ? Number(values.defaultDuration)
    : null,
  durationPeriod: values.durationPeriod || null,
  repaymentFrequency: values.repaymentFrequency || null,
  extendLoanAfterMaturity:
    values.extendLoanAfterMaturity === ""
      ? null
      : values.extendLoanAfterMaturity === "true" ||
        values.extendLoanAfterMaturity === true,
  interestTypeMaturity: values.interestTypeMaturity || null,
  calculateInterestOn: values.calculateInterestOn || null,
  loanInterestRateAfterMaturity: values.loanInterestRateAfterMaturity
    ? Number(values.loanInterestRateAfterMaturity)
    : null,
  recurringPeriodAfterMaturityUnit:
    values.recurringPeriodAfterMaturityUnit || null,
  institutionLoanProductsId: userDetails?.institutionUsersId || null,
});
