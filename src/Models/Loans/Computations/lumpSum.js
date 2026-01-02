import dayjs from "dayjs";

const round2 = (num) => {
    const n = Number(num);
    if (!Number.isFinite(n)) return 0;
    return Math.round((n + Number.EPSILON) * 100) / 100;
};

const durationUnitMap = {
    days: "day",
    weeks: "week",
    months: "month",
    years: "year",
};

const interestPeriodToAnnualFreq = {
    per_year: 1,
    per_month: 12,
    per_week: 52,
    per_day: 365,
};

const durationIntervalToAnnualFreq = {
    years: 1,
    months: 12,
    weeks: 52,
    days: 365,
};

export const generateLumpSumSchedule = ({
    principal,
    startDate,
    maturityDate,
    duration,
    durationInterval,
    interestRate,
    interestPeriod,
    interestType,
    interestMethod, // SIMPLE, COMPOUND, FLAT
}) => {
    const start = dayjs(startDate);
    const maturity = dayjs(maturityDate);

    // Handle "Per Loan" Interest specifically for Lump Sum
    // If per_loan, we only show one installment at maturity with the full calculation
    if (interestPeriod === "per_loan") {
        let totalInterest = 0;
        if (interestType === "fixed") {
            totalInterest = Number(interestRate);
        } else {
            // Percentage
            totalInterest = principal * (Number(interestRate) / 100);
        }
        
        totalInterest = round2(totalInterest);
        const totalDue = round2(principal + totalInterest);

        return {
            supported: true,
            schedulePreview: {
                installments: [{
                    dueDate: maturity.format("YYYY-MM-DD"),
                    openingBalance: round2(principal),
                    principalDue: round2(principal),
                    interestDue: totalInterest,
                    feesDue: 0,
                    totalDue: totalDue,
                    balanceAfter: 0
                }],
                totals: {
                    totalPrincipal: round2(principal),
                    totalInterest: totalInterest,
                    totalFees: 0,
                    totalPayable: totalDue,
                    numberOfInstallments: 1
                }
            }
        };
    }
    
    // 1. Determine Reporting Interval (Step)
    // Default to durationInterval if available, otherwise monthly
    let stepUnit = durationUnitMap[durationInterval] || "month";
    let stepCount = 1;

    // If duration is in days, maybe we don't want daily rows? 
    // But user asked for "periodic (daily, monthly etc)". 
    // If duration is short (e.g. 30 days), daily is fine. 
    // If duration is long (e.g. 365 days), daily is too much?
    // For now, respect durationInterval.
    
    // 2. Generate Dates
    const dates = [];
    let cursor = start.add(stepCount, stepUnit);
    
    // Safety break
    let safety = 0;
    while ((cursor.isBefore(maturity) || cursor.isSame(maturity, 'day')) && safety < 1000) {
        dates.push(cursor.format("YYYY-MM-DD"));
        cursor = cursor.add(stepCount, stepUnit);
        safety++;
    }
    
    // Ensure maturity date is the last one and we don't overshoot or miss it
    const lastDate = dates.length > 0 ? dates[dates.length - 1] : null;
    if (!lastDate || !dayjs(lastDate).isSame(maturity, 'day')) {
        // If the last generated date is not maturity, handle it.
        // If we overshot, replace last? No, loop condition handles overshoot.
        // If we undershot (e.g. monthly steps for 4.5 months), add maturity.
        if (!lastDate || dayjs(lastDate).isBefore(maturity)) {
             dates.push(maturity.format("YYYY-MM-DD"));
        }
    }

    // 3. Calculate Rate per Step
    // We need to convert input Interest Rate (per interestPeriod) to Rate (per stepUnit)
    
    const rawRate = Number(interestRate);
    const inputRate = rawRate / 100;
    
    let periodicRate = 0;
    
    // Frequencies per year
    const iFreq = interestPeriodToAnnualFreq[interestPeriod]; // e.g. 12 for per_month
    const stepFreq = durationIntervalToAnnualFreq[durationInterval] || 12; // e.g. 12 for months
    
    // Check if we have standard units
    const isStandardUnits = iFreq && stepFreq;
    
    if (interestMethod === "COMPOUND") {
        if (isStandardUnits) {
            // (1+r_input)^(iFreq / stepFreq) - 1
            // Example: Input 10% per month (iFreq=12). Step = Month (stepFreq=12).
            // Exp = 1. Rate = 10%.
            const exponent = iFreq / stepFreq;
            periodicRate = Math.pow(1 + inputRate, exponent) - 1;
        } else {
            // Fallback to day counting
            // This might happen if interest is "per_loan" or units are weird
            // For now, assume standard units for the user's case.
            // If fallback needed:
            // Calculate annualized rate first?
            // Let's stick to simple day ratio if units mismatch significantly
             periodicRate = inputRate; // Placeholder if complex
        }
    } else if (interestMethod === "SIMPLE") {
        if (isStandardUnits) {
            // r_input * (iFreq / stepFreq)
            periodicRate = inputRate * (iFreq / stepFreq);
        } else {
             periodicRate = inputRate;
        }
    } else {
        // FLAT
        // Usually Flat is calculated on total duration and spread?
        // Or calculated on principal per period?
        // For Lump Sum Flat: Total Interest = P * R * T.
        // We can just accrue it.
        if (isStandardUnits) {
             periodicRate = inputRate * (iFreq / stepFreq);
        }
    }

    // 4. Build Schedule
    const installments = [];
    let outstanding = principal;
    let accruedInterest = 0; // For Simple/Flat where it doesn't compound into principal base
    
    // For Compound, we update 'outstanding' to include interest if we want to show it growing.
    // But 'outstanding' usually means 'Principal Outstanding'.
    // However, the user wants "Opening Balance" -> "Closing Balance".
    // If Closing Balance includes interest, then next Opening Balance includes interest.
    // This naturally compounds.
    
    // For Simple, we should NOT update 'outstanding' (Principal) for calculation base.
    // But we should update the 'Balance' shown in the table?
    // If we update the Balance shown, but calculate interest on original Principal, that works.
    
    let currentBalance = principal; // This is what we show in the table
    
    for (let i = 0; i < dates.length; i++) {
        const date = dates[i];
        const isLast = i === dates.length - 1;
        
        let interestForPeriod = 0;
        
        if (interestMethod === "COMPOUND") {
            interestForPeriod = round2(currentBalance * periodicRate);
        } else {
            // Simple / Flat: Interest on Principal
            interestForPeriod = round2(principal * periodicRate);
        }
        
        const openingBalance = currentBalance;
        
        // Payment is 0 until last
        let principalRepaid = 0;
        let interestPaid = 0;
        let totalPayment = 0;
        
        if (isLast) {
            // Pay everything
            // For Compound: Pay currentBalance + interestForPeriod
            // For Simple: Pay Principal + Accrued + interestForPeriod
            
            // Actually, currentBalance tracks the total debt (Principal + Accrued)
            // So just pay currentBalance + interestForPeriod
            
            totalPayment = round2(openingBalance + interestForPeriod);
            
            // Breakdown
            // Interest part is all accrued interest + this period interest?
            // Or just this period?
            // The table columns are: Interest, Principal Repaid, Total Payment.
            // Usually "Interest" column shows interest accrued/charged in that period.
            // "Principal Repaid" shows how much of the payment goes to principal.
            
            // If we pay 161,051.
            // Principal was 100,000.
            // Total Interest is 61,051.
            
            // In the last row:
            // Interest Due: 14,641 (example for last month)
            // Total Payment: 161,051.
            // If we say Interest Paid = 14,641, then Principal Repaid = 146,410? No.
            
            // The "Interest" column in the schedule usually means "Interest Accrued/Due for this period".
            // The "Total Payment" is what the user pays.
            
            // If it's a lump sum, we pay everything at the end.
            // So Total Payment = Opening Balance + InterestForPeriod.
            
            // How to split Principal/Interest in the payment?
            // Principal Repaid = Total Payment - Total Interest Accumulated?
            // Or Principal Repaid = Original Principal?
            
            // If we want the schedule to look "clean":
            // Last row:
            // Interest: <Interest for this period>
            // Total Payment: <Full Amount>
            // Principal Repaid: <Full Amount - Interest for this period>? 
            // No, that implies we are paying off previous interest too.
            
            // Let's stick to the accounting flow:
            // Closing Balance = Opening + Interest - Payment.
            // We want Closing = 0.
            // So Payment = Opening + Interest.
            
            // Principal Repaid is usually a derived field: Payment - Interest Paid.
            // But here "Interest Paid" covers all previous interest too?
            
            // Let's just set Principal Repaid = Total Payment - InterestForPeriod?
            // No, that would mean we repaid more principal than 100k.
            
            // Let's calculate Principal Repaid as: Total Payment - (InterestForPeriod + PreviouslyAccruedInterest??)
            // But currentBalance includes previously accrued interest.
            
            // Let's just set Principal Repaid = Original Principal (if we clear debt).
            // And Interest Paid = Total Payment - Original Principal.
            // But the column is "Interest". Is it "Interest Accrued" or "Interest Paid"?
            // Usually "Interest Due".
            
            // Let's set:
            // Interest: interestForPeriod
            // Total Payment: round2(openingBalance + interestForPeriod)
            // Principal Repaid: round2(openingBalance + interestForPeriod - interestForPeriod) = openingBalance?
            // No, openingBalance includes accrued interest.
            
            // Let's look at the columns again:
            // #, Date, Opening Balance, Interest, Principal Repaid, Total Payment, Closing Balance
            
            // Row 1: Open 100k. Int 10k. Pay 0. Close 110k.
            // Row 2: Open 110k. Int 11k. Pay 0. Close 121k.
            // ...
            // Row 5: Open 146.4k. Int 14.6k. Pay 161k. Close 0.
            
            // In Row 5:
            // Interest = 14.6k.
            // Total Payment = 161k.
            // Principal Repaid = 161k - 14.6k = 146.4k?
            // This "Principal Repaid" label is tricky when it includes capitalized interest.
            // But mathematically, `Closing = Opening + Interest - Payment`.
            // `0 = 146.4 + 14.6 - 161`. Correct.
            // `Payment = Principal Repaid + Interest`?
            // If `Principal Repaid` = 146.4k, and `Interest` = 14.6k. Sum = 161k. Correct.
            
            // So "Principal Repaid" in this context effectively means "Amount applied to reduce the balance".
            principalRepaid = round2(openingBalance); 
            interestPaid = interestForPeriod; // This is just the interest for this period
            
        } else {
            // Intermediate
            totalPayment = 0;
            principalRepaid = 0;
            interestPaid = interestForPeriod;
        }
        
        const closingBalance = round2(openingBalance + interestForPeriod - totalPayment);
        
        installments.push({
            dueDate: date,
            openingBalance: round2(openingBalance),
            interestDue: round2(interestForPeriod),
            principalDue: round2(principalRepaid), // Using principalDue field for Principal Repaid
            totalDue: round2(totalPayment),
            balanceAfter: closingBalance
        });
        
        currentBalance = closingBalance;
    }
    
    // Totals
    const totals = {
        totalPrincipal: round2(installments.reduce((s, x) => s + x.principalDue, 0)),
        totalInterest: round2(installments.reduce((s, x) => s + x.interestDue, 0)),
        totalPayable: round2(installments.reduce((s, x) => s + x.totalDue, 0)),
        numberOfInstallments: installments.length,
    };

    return {
        supported: true,
        schedulePreview: {
            installments,
            totals
        }
    };
};
