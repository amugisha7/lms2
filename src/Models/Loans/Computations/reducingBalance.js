import dayjs from "dayjs";

const round2 = (num) => {
	const n = Number(num);
	if (!Number.isFinite(n)) return 0;
	return Math.round((n + Number.EPSILON) * 100) / 100;
};

const frequencyToInterval = (repaymentFrequency) => {
	switch (repaymentFrequency) {
		case "DAILY":
			return { unit: "day", count: 1 };
		case "WEEKLY":
			return { unit: "week", count: 1 };
		case "BIWEEKLY":
			return { unit: "week", count: 2 };
		case "MONTHLY":
			return { unit: "month", count: 1 };
		case "QUARTERLY":
			return { unit: "month", count: 3 };
		case "SEMIANNUALLY":
			return { unit: "month", count: 6 };
		case "ANNUALLY":
			return { unit: "year", count: 1 };
		default:
			return { unit: "month", count: 1 };
	}
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

export const generateReducingBalanceSchedule = ({
	principal,
	interestRate,
	installmentDates,
	interestPeriod,
	interestMethod, // SIMPLE or COMPOUND
	repaymentFrequency,
	repaymentFrequencyType,
	startDate,
	maturityDate,
	rawInterestMethod, // reducing_balance_equal_principal check
}) => {
	const n = installmentDates.length;
	let r;
	const inputRate = interestRate / 100;

	const interestPeriodToAnnualFreq = {
		per_year: 1,
		per_month: 12,
		per_week: 52,
		per_day: 365,
	};

	const repaymentFreqToAnnualFreq = {
		DAILY: 365,
		WEEKLY: 52,
		BIWEEKLY: 26,
		MONTHLY: 12,
		QUARTERLY: 4,
		SEMIANNUALLY: 2,
		ANNUALLY: 1,
	};

	const calculatePeriodYears = (start, end, iPeriod) => {
		const s = dayjs(start);
		const e = dayjs(end);
		if (iPeriod === "per_month") {
			return e.diff(s, "month", true) / 12;
		}
		if (iPeriod === "per_week") {
			return e.diff(s, "week", true) / 52;
		}
		if (iPeriod === "per_year") {
			return e.diff(s, "year", true);
		}
		return e.diff(s, "day") / 365;
	};

	if (interestMethod === "COMPOUND") {
		const iFreq = interestPeriodToAnnualFreq[interestPeriod];
		const rFreq = repaymentFreqToAnnualFreq[repaymentFrequency];
		
		// Check if we have a standard interval repayment
		const isStandardInterval = (!repaymentFrequencyType || repaymentFrequencyType === "interval") && rFreq;

		if (isStandardInterval && iFreq) {
			// Standard conversion: (1 + r_source)^(f_source / f_target) - 1
			const exponent = iFreq / rFreq;
			r = Math.pow(1 + inputRate, exponent) - 1;
		} else {
			// Fallback for irregular intervals or LUMP_SUM
			let periodYears;
			if (repaymentFrequency === "LUMP_SUM") {
				periodYears = calculatePeriodYears(startDate, maturityDate, interestPeriod);
			} else {
				// For setDays/setDates, use average duration
				periodYears = calculatePeriodYears(startDate, maturityDate, interestPeriod) / (n || 1);
			}
			
			if (iFreq) {
				r = Math.pow(1 + inputRate, iFreq * periodYears) - 1;
			} else {
				r = inputRate; 
			}
		}
	} else {
		// SIMPLE interest
		let periodYears;
		const rFreq = repaymentFreqToAnnualFreq[repaymentFrequency];
		const isStandardInterval = (!repaymentFrequencyType || repaymentFrequencyType === "interval") && rFreq;

		if (isStandardInterval) {
			periodYears = 1 / rFreq;
		} else {
			if (repaymentFrequency === "LUMP_SUM") {
				periodYears = calculatePeriodYears(startDate, maturityDate, interestPeriod);
			} else {
				const { unit, count } = frequencyToInterval(repaymentFrequency);
				const start = dayjs(startDate);
				const next = start.add(count, unit);
				periodYears = calculatePeriodYears(start, next, interestPeriod);
			}
		}

		const annualRate = getAnnualRateFromInterestPeriod({
			interestRate,
			interestPeriod,
		}) ?? 0;
		r = annualRate * periodYears;
	}

	const safeR = Number.isFinite(r) ? r : 0;
	const isEqualPrincipal = rawInterestMethod === "reducing_balance_equal_principal";

	let pmt = 0;
	let fixedPrincipal = 0;

	if (isEqualPrincipal) {
		fixedPrincipal = round2(principal / n);
	} else {
		if (safeR <= 0) {
			pmt = principal / n;
		} else {
			pmt =
				(principal * safeR * Math.pow(1 + safeR, n)) /
				(Math.pow(1 + safeR, n) - 1);
		}
	}

	let outstanding = principal;
	const installments = [];

	for (let i = 0; i < n; i += 1) {
		const interestDue = round2(outstanding * safeR);
		let principalDue;

		if (isEqualPrincipal) {
			principalDue = fixedPrincipal;
			if (i === n - 1) {
				principalDue = round2(outstanding);
			}
		} else {
			principalDue = round2(pmt - interestDue);
			if (i === n - 1) {
				principalDue = round2(outstanding);
			}
		}

		const totalDue = round2(principalDue + interestDue);
		const balanceAfter = round2(outstanding - principalDue);

		installments.push({
			dueDate: installmentDates[i],
			openingBalance: round2(outstanding),
			principalDue,
			interestDue,
			feesDue: 0,
			totalDue,
			balanceAfter: balanceAfter < 0 ? 0 : balanceAfter,
		});

		outstanding = Math.max(0, outstanding - principalDue);
	}

	const principalSum = round2(installments.reduce((s, x) => s + x.principalDue, 0));
	const principalDiff = round2(principal - principalSum);
	const last = installments[installments.length - 1];
	last.principalDue = round2(last.principalDue + principalDiff);
	last.totalDue = round2(last.principalDue + last.interestDue);
	last.balanceAfter = 0;

	return {
		installments,
		totals: {
			totalPrincipal: round2(principal),
			totalInterest: round2(installments.reduce((s, x) => s + x.interestDue, 0)),
			totalFees: 0,
			totalPayable: round2(installments.reduce((s, x) => s + x.totalDue, 0)),
			numberOfInstallments: n,
		},
	};
};
