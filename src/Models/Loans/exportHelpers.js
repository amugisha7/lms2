import jsPDF from 'jspdf';

export const exportLoanStatement = (loan) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(`Loan Statement`, 10, 10);
  
  doc.setFontSize(12);
  doc.text(`Loan Number: ${loan.loanNumber}`, 10, 20);
  doc.text(`Borrower: ${loan.borrower?.firstname} ${loan.borrower?.othername || ''}`, 10, 30);
  doc.text(`Principal: ${loan.principal}`, 10, 40);
  doc.text(`Status: ${loan.loanStatusEnum || loan.status}`, 10, 50);
  
  let y = 70;
  doc.text('Recent Transactions:', 10, y);
  y += 10;
  
  // Combine payments and disbursements
  const transactions = [
    ...(loan.payments?.items || []).map(p => ({ date: p.paymentDate, type: 'Payment', amount: p.amount })),
    ...(loan.disbursements?.items || []).map(d => ({ date: d.disbursedAt, type: 'Disbursement', amount: d.amount }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  transactions.forEach(t => {
    doc.text(`${t.date} - ${t.type} - ${t.amount}`, 10, y);
    y += 10;
  });
  
  doc.save(`LoanStatement_${loan.loanNumber}.pdf`);
};

export const exportSchedule = (loan) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(`Repayment Schedule`, 10, 10);
  
  doc.setFontSize(12);
  doc.text(`Loan Number: ${loan.loanNumber}`, 10, 20);
  
  let y = 40;
  doc.text(`Due Date | Principal | Interest | Total | Status`, 10, y);
  y += 10;
  
  const installments = loan.installments?.items?.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)) || [];
  
  installments.forEach(inst => {
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
    doc.text(`${inst.dueDate} | ${inst.principalDue} | ${inst.interestDue} | ${inst.totalDue} | ${inst.status}`, 10, y);
    y += 10;
  });
  
  doc.save(`Schedule_${loan.loanNumber}.pdf`);
};

export const exportPaymentHistory = (loan) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(`Payment History`, 10, 10);
  
  doc.setFontSize(12);
  doc.text(`Loan Number: ${loan.loanNumber}`, 10, 20);
  
  let y = 40;
  doc.text(`Date | Amount | Method | Reference | Status`, 10, y);
  y += 10;
  
  const payments = loan.payments?.items?.sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)) || [];
  
  payments.forEach(pmt => {
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
    doc.text(`${pmt.paymentDate} | ${pmt.amount} | ${pmt.paymentMethod} | ${pmt.referenceNumber} | ${pmt.status}`, 10, y);
    y += 10;
  });
  
  doc.save(`PaymentHistory_${loan.loanNumber}.pdf`);
};
