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
          status
          customLoanProductDetails
        }
      }
    `,
    variables: { input },
  });
  return result?.data?.createLoanProduct;
};

export const associateFeeWithLoanProduct = async (loanProductId, loanFeesConfigId) => {
  const client = generateClient();
  await client.graphql({
    query: `
      mutation CreateLoanProductLoanFeesConfig($input: CreateLoanProductLoanFeesConfigInput!) {
        createLoanProductLoanFeesConfig(input: $input) {
          id
        }
      }
    `,
    variables: {
      input: {
        loanFeesConfigId,
        loanProductId,
      },
    },
  });
};

export const associateBranchWithLoanProduct = async (loanProductId, branchId) => {
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

export const buildLoanProductInput = (values, userDetails) => {
  // Build customLoanProductDetails
  const customDetails = {
    customerPortalVisible: values.customerPortalVisible === 'yes',
  };

  return {
    institutionLoanProductsId: userDetails.institutionUsersId,
    name: values.name,
    status: values.status || "Active",
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
    repaymentOrder: values.repaymentOrder
      ? JSON.stringify(values.repaymentOrder)
      : null,
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
