import dayjs from 'dayjs';

// Helper to add duration to date
const addDuration = (date, amount, unit) => {
  // unit: 'days', 'weeks', 'months', 'years'
  return dayjs(date).add(amount, unit);
};

const getFrequencyDays = (frequency) => {
  switch (frequency) {
    case 'DAILY': return 1;
    case 'WEEKLY': return 7;
    case 'BIWEEKLY': return 14;
    case 'MONTHLY': return 30; // Approximate, usually handled by month addition
    case 'QUARTERLY': return 90;
    case 'SEMIANNUALLY': return 180;
    case 'ANNUALLY': return 360;
    default: return 30;
  }
};

const getFrequencyMonths = (frequency) => {
  switch (frequency) {
    case 'MONTHLY': return 1;
    case 'QUARTERLY': return 3;
    case 'SEMIANNUALLY': return 6;
    case 'ANNUALLY': return 12;
    default: return 0;
  }
};

export const calculateSchedule = (loanTerms) => {
  const {
    principal,
    interestRate, // Annual rate in %
    duration,
    durationUnit, // 'months', 'weeks', 'days', 'years'
    repaymentFrequency, // 'MONTHLY', 'WEEKLY', etc.
    interestMethod, // 'FLAT', 'SIMPLE', 'COMPOUND'
    startDate,
    repaymentOrder = ['penalty', 'fees', 'interest', 'principal']
  } = loanTerms;

  if (!principal || !interestRate || !duration || !startDate) {
    throw new Error("Missing required loan terms");
  }

  const start = dayjs(startDate);
  let installments = [];
  let numberOfInstallments = 0;
  
  // Calculate number of installments
  // This is a simplification. Real logic depends on exact dates.
  // Assuming standard intervals.
  
  let intervalUnit = 'months';
  let intervalCount = 1;

  switch (repaymentFrequency) {
    case 'DAILY': intervalUnit = 'days'; intervalCount = 1; break;
    case 'WEEKLY': intervalUnit = 'weeks'; intervalCount = 1; break;
    case 'BIWEEKLY': intervalUnit = 'weeks'; intervalCount = 2; break;
    case 'MONTHLY': intervalUnit = 'months'; intervalCount = 1; break;
    case 'QUARTERLY': intervalUnit = 'months'; intervalCount = 3; break;
    case 'SEMIANNUALLY': intervalUnit = 'months'; intervalCount = 6; break;
    case 'ANNUALLY': intervalUnit = 'years'; intervalCount = 1; break;
    default: intervalUnit = 'months'; intervalCount = 1;
  }

  // Calculate total duration in the interval unit
  // This is tricky if durationUnit != intervalUnit.
  // For now, assume they align or convert simply.
  
  // Better approach: Generate dates until maturity.
  const maturityDate = dayjs(startDate).add(duration, durationUnit);
  let currentDate = start.add(intervalCount, intervalUnit);
  
  while (currentDate.isBefore(maturityDate) || currentDate.isSame(maturityDate, 'day')) {
    installments.push({
      dueDate: currentDate.format('YYYY-MM-DD'),
      principalDue: 0,
      interestDue: 0,
      feesDue: 0,
      penaltyDue: 0,
      totalDue: 0,
      principalPaid: 0,
      interestPaid: 0,
      feesPaid: 0,
      penaltyPaid: 0,
      totalPaid: 0,
      status: 'PENDING'
    });
    currentDate = currentDate.add(intervalCount, intervalUnit);
  }
  
  numberOfInstallments = installments.length;
  if (numberOfInstallments === 0) return [];

  // Calculate Amounts
  const ratePerPeriod = (interestRate / 100) / (12 / (getFrequencyMonths(repaymentFrequency) || (getFrequencyDays(repaymentFrequency)/30))); 
  // Note: Rate conversion is complex. Simplified here.
  // If frequency is weekly, rate is annual / 52.
  
  let periodicRate = 0;
  if (['WEEKLY', 'BIWEEKLY', 'DAILY'].includes(repaymentFrequency)) {
     periodicRate = (interestRate / 100) * (getFrequencyDays(repaymentFrequency) / 365);
  } else {
     periodicRate = (interestRate / 100) * (getFrequencyMonths(repaymentFrequency) / 12);
  }

  if (interestMethod === 'FLAT') {
    const totalInterest = principal * (interestRate / 100) * (dayjs(maturityDate).diff(start, 'year', true)); // Simplified
    // Or total interest = principal * rate * duration_in_years
    
    // Duration in years
    const durationInYears = dayjs(maturityDate).diff(start, 'day') / 365;
    const totalInterestFlat = principal * (interestRate / 100) * durationInYears;
    
    const principalPerInstallment = principal / numberOfInstallments;
    const interestPerInstallment = totalInterestFlat / numberOfInstallments;
    
    installments = installments.map(inst => ({
      ...inst,
      principalDue: parseFloat(principalPerInstallment.toFixed(2)),
      interestDue: parseFloat(interestPerInstallment.toFixed(2)),
      totalDue: parseFloat((principalPerInstallment + interestPerInstallment).toFixed(2))
    }));
    
    // Adjust last installment for rounding
    const totalPrincipal = installments.reduce((sum, i) => sum + i.principalDue, 0);
    const diff = principal - totalPrincipal;
    installments[installments.length - 1].principalDue += diff;
    installments[installments.length - 1].principalDue = parseFloat(installments[installments.length - 1].principalDue.toFixed(2));
    installments[installments.length - 1].totalDue += diff;
    installments[installments.length - 1].totalDue = parseFloat(installments[installments.length - 1].totalDue.toFixed(2));

  } else if (interestMethod === 'SIMPLE' || interestMethod === 'COMPOUND') {
    // Declining balance (Amortization)
    // PMT formula for equal installments
    // PMT = P * r * (1 + r)^n / ((1 + r)^n - 1)
    
    const r = periodicRate;
    const n = numberOfInstallments;
    
    let pmt = 0;
    if (r === 0) {
        pmt = principal / n;
    } else {
        pmt = principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    }
    
    let outstandingBalance = principal;
    
    installments = installments.map((inst, index) => {
      let interest = outstandingBalance * r;
      let principalComponent = pmt - interest;
      
      // Last installment adjustment
      if (index === numberOfInstallments - 1) {
        principalComponent = outstandingBalance;
        pmt = principalComponent + interest;
      }
      
      outstandingBalance -= principalComponent;
      
      return {
        ...inst,
        principalDue: parseFloat(principalComponent.toFixed(2)),
        interestDue: parseFloat(interest.toFixed(2)),
        totalDue: parseFloat(pmt.toFixed(2))
      };
    });
  }

  return installments;
};

export const allocatePayment = (paymentAmount, installments, repaymentOrder = ['penalty', 'fees', 'interest', 'principal']) => {
  let remainingAmount = paymentAmount;
  const updatedInstallments = installments.map(inst => ({ ...inst })); // Deep copy needed? Shallow for now.
  const allocation = {
    principal: 0,
    interest: 0,
    fees: 0,
    penalty: 0
  };

  // Sort installments by due date (should be already sorted)
  
  for (let i = 0; i < updatedInstallments.length; i++) {
    if (remainingAmount <= 0) break;
    
    const inst = updatedInstallments[i];
    if (inst.status === 'PAID') continue;
    
    // Calculate what is owed on this installment
    const owed = {
      penalty: inst.penaltyDue - (inst.penaltyPaid || 0),
      fees: inst.feesDue - (inst.feesPaid || 0),
      interest: inst.interestDue - (inst.interestPaid || 0),
      principal: inst.principalDue - (inst.principalPaid || 0)
    };
    
    for (const type of repaymentOrder) {
      if (remainingAmount <= 0) break;
      
      const amountToPay = Math.min(remainingAmount, owed[type]);
      if (amountToPay > 0) {
        inst[`${type}Paid`] = (inst[`${type}Paid`] || 0) + amountToPay;
        inst.totalPaid = (inst.totalPaid || 0) + amountToPay;
        allocation[type] += amountToPay;
        remainingAmount -= amountToPay;
        owed[type] -= amountToPay;
      }
    }
    
    // Update status
    const totalDue = inst.principalDue + inst.interestDue + inst.feesDue + inst.penaltyDue;
    // Re-sum paid
    const totalPaid = (inst.principalPaid || 0) + (inst.interestPaid || 0) + (inst.feesPaid || 0) + (inst.penaltyPaid || 0);
    
    if (totalPaid >= totalDue - 0.01) { // Tolerance
      inst.status = 'PAID';
    } else if (totalPaid > 0) {
      inst.status = 'PARTIALLY_PAID';
    }
  }
  
  return { updatedInstallments, allocation, remainingAmount };
};

export const reversePaymentAllocation = (paymentAmount, installments, repaymentOrder = ['penalty', 'fees', 'interest', 'principal']) => {
  let remainingAmount = paymentAmount;
  const updatedInstallments = installments.map(inst => ({ ...inst }));
  
  // Sort installments by due date descending (LIFO for reversal)
  const sortedInstallments = updatedInstallments.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
  
  const reverseOrder = [...repaymentOrder].reverse();
  
  for (const inst of sortedInstallments) {
    if (remainingAmount <= 0) break;
    
    for (const type of reverseOrder) {
      if (remainingAmount <= 0) break;
      
      const paid = inst[`${type}Paid`] || 0;
      if (paid > 0) {
        const amountToReverse = Math.min(remainingAmount, paid);
        inst[`${type}Paid`] -= amountToReverse;
        inst.totalPaid -= amountToReverse;
        remainingAmount -= amountToReverse;
      }
    }
    
    // Update status
    // Re-sum paid
    const totalPaid = (inst.principalPaid || 0) + (inst.interestPaid || 0) + (inst.feesPaid || 0) + (inst.penaltyPaid || 0);
    const totalDue = inst.principalDue + inst.interestDue + inst.feesDue + inst.penaltyDue;

    if (totalPaid >= totalDue - 0.01) {
      inst.status = 'PAID';
    } else if (totalPaid > 0.01) {
      inst.status = 'PARTIALLY_PAID';
    } else {
      inst.status = 'PENDING';
    }
  }
  
  return updatedInstallments;
};
