import { generateClient } from "aws-amplify/api";

export const updateLoanProduct = async (input) => {
  const client = generateClient();
  const result = await client.graphql({
    query: `
      mutation UpdateLoanProduct($input: UpdateLoanProductInput!) {
        updateLoanProduct(input: $input) {
          id
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
                    principalAmountMin
                    principalAmountMax
                    principalAmountDefault
                    interestRateMin
                    interestRateMax
                    interestRateDefault
                    interestType
                    interestPeriod
                    termDurationMin
                    termDurationMax
                    termDurationDefault
                    durationPeriod
                    repaymentFrequency
                    extendLoanAfterMaturity
                    interestTypeMaturity
                    calculateInterestOn
                    loanInterestRateAfterMaturity
                    recurringPeriodAfterMaturityUnit
                    institutionLoanProductsId
                    Branches {
                        items {
                            branchId
                        }
                    }
                    LoanFees {
                        items {
                            loanFeesId
                        }
                    }
                }
            }
        `,
        variables: { id }
    });
    return result?.data?.getLoanProduct;
}

export const buildLoanProductUpdateInput = (values, userDetails, id) => ({
  id: id,
  name: values.name,
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
