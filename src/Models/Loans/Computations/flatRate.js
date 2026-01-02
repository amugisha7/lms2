import dayjs from "dayjs";

const round2 = (num) => {
	const n = Number(num);
	if (!Number.isFinite(n)) return 0;
	return Math.round((n + Number.EPSILON) * 100) / 100;
};

const getAnnualRateFromInterestPeriod = ({
	interestRate,
	interestPeriod,
}) => {
	const r = interestRate / 100;
	switch (interestPeriod) {
		case "per_day":
			return r * 365;
		case "per_week":
			return r * 52;
		case "per_month":
			return r * 12;
		case "per_year":
			return r;
		default:
			return r;
	}
};

export const generateFlatRateSchedule = ({
	principal,
	interestRate,
	installmentDates,
	interestPeriod,
	startDate,
	maturityDate,
}) => {
	const n = installmentDates.length;
	
	const annualRate = getAnnualRateFromInterestPeriod({
		interestRate,
		interestPeriod,
	});

	const durationInYears = dayjs(maturityDate).diff(dayjs(startDate), "day") / 365;
	const totalInterest = principal * annualRate * durationInYears;

	const interestPer = totalInterest / n;
	const principalPer = principal / n;
	
	let outstanding = principal;
	const installments = [];

	for (let i = 0; i < n; i += 1) {
		const principalDue = round2(principalPer);
		const interestDue = round2(interestPer);
		const balanceAfter = round2(outstanding - principalDue);

		installments.push({
			dueDate: installmentDates[i],
			openingBalance: round2(outstanding),
			principalDue,
			interestDue,
			feesDue: 0,
			totalDue: round2(principalDue + interestDue),
			balanceAfter: balanceAfter < 0 ? 0 : balanceAfter,
		});
		outstanding = Math.max(0, outstanding - principalDue);
	}

	// Adjust last installment
	const principalSum = round2(installments.reduce((s, x) => s + x.principalDue, 0));
	const interestSum = round2(installments.reduce((s, x) => s + x.interestDue, 0));

	const principalDiff = round2(principal - principalSum);
	const interestDiff = round2(totalInterest - interestSum);

	const last = installments[installments.length - 1];
	last.principalDue = round2(last.principalDue + principalDiff);
	last.interestDue = round2(last.interestDue + interestDiff);
	last.totalDue = round2(last.principalDue + last.interestDue);
	last.balanceAfter = 0;

	return {
		installments,
		totals: {
			totalPrincipal: round2(principal),
			totalInterest: round2(totalInterest),
			totalFees: 0,
			totalPayable: round2(principal + totalInterest),
			numberOfInstallments: n,
		},
	};
};
