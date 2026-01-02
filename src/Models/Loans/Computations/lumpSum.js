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

    // 3. Calculate Rate per Step (Dynamic per segment)
    const rawRate = Number(interestRate);
    const inputRate = rawRate / 100;

    // 4. Build Schedule
    const installments = [];
    let outstanding = principal;
    let accruedInterest = 0; 
    
    let currentBalance = principal; // This is what we show in the table
    let prevDate = dayjs(startDate);

    for (let i = 0; i < dates.length; i++) {
        const date = dates[i];
        const currentDate = dayjs(date);
        const isLast = i === dates.length - 1;
        
        // Calculate rate for this specific period
        let segmentRate = 0;
        let durationInUnits = 0;
        
        if (interestPeriod === "per_month") {
            durationInUnits = currentDate.diff(prevDate, "month", true);
        } else if (interestPeriod === "per_week") {
            durationInUnits = currentDate.diff(prevDate, "week", true);
        } else if (interestPeriod === "per_year") {
            durationInUnits = currentDate.diff(prevDate, "year", true);
        } else {
            durationInUnits = currentDate.diff(prevDate, "day");
        }
        
        if (interestMethod === "COMPOUND") {
             segmentRate = Math.pow(1 + inputRate, durationInUnits) - 1;
        } else {
             segmentRate = inputRate * durationInUnits;
        }
        
        let interestForPeriod = 0;
        
        if (interestMethod === "COMPOUND") {
            interestForPeriod = round2(currentBalance * segmentRate);
        } else {
            // Simple / Flat: Interest on Principal
            interestForPeriod = round2(principal * segmentRate);
        }
        
        const openingBalance = currentBalance;
        
        // Payment is 0 until last
        let principalRepaid = 0;
        let interestPaid = 0;
        let totalPayment = 0;
        
        if (isLast) {
            // Pay everything
            totalPayment = round2(openingBalance + interestForPeriod);
            
            // For the last payment, we clear the balance.
            // Interest Paid is the interest for this period + any accrued interest if we were tracking it separately?
            // In this model, currentBalance includes accrued interest for Compound.
            // For Simple, currentBalance includes accrued interest too (see below).
            
            interestPaid = interestForPeriod; // Just show this period's interest
            principalRepaid = round2(totalPayment - interestPaid); 
            // Note: principalRepaid here will include the original principal + previously accrued interest.
            // This might be confusing if the column is strictly "Principal Repaid".
            // But for Lump Sum, the final payment covers everything.
        }
        
        const totalDue = isLast ? totalPayment : 0;
        
        // Update Balance
        // Closing Balance = Opening + Interest - Payment
        let balanceAfter = round2(openingBalance + interestForPeriod - totalPayment);
        if (balanceAfter < 0) balanceAfter = 0; // Floating point safety
        
        installments.push({
            dueDate: date,
            openingBalance: round2(openingBalance),
            principalDue: principalRepaid,
            interestDue: interestForPeriod,
            feesDue: 0,
            totalDue: totalDue,
            balanceAfter: balanceAfter,
        });
        
        currentBalance = balanceAfter;
        prevDate = currentDate;
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
