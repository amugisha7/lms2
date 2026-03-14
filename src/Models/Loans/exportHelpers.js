/**
 * Loan export helpers – statement export re-routes to the accurate pipeline
 * in LoanStatements/statementExportHelpers.js.
 *
 * The raw jsPDF stubs for exportSchedule and exportPaymentHistory are kept for
 * backward compatibility but will log a deprecation warning.
 */
import jsPDF from 'jspdf';
export { exportStatementPdf } from './LoanStatements/statementExportHelpers';

// ---------------------------------------------------------------------------
// Legacy stub – kept for any callers that haven't migrated yet.
// Navigating to /loans/id/:id/statement is the recommended approach.
// ---------------------------------------------------------------------------

const DEP_WARN = (name) =>
  console.warn(
    `[exportHelpers] ${name} is deprecated. Use LoanStatementScreen (/loans/id/:id/statement) for accurate statements.`
  );

export const exportLoanStatement = (loan) => {
  DEP_WARN('exportLoanStatement');
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(`Loan Statement`, 10, 10);

  doc.setFontSize(12);
  doc.text(`Loan Number: ${loan.loanNumber}`, 10, 20);
  doc.text(`Borrower: ${loan.borrower?.firstname} ${loan.borrower?.othername || ''}`, 10, 30);
  doc.text(`Principal: ${loan.principal}`, 10, 40);
  doc.text(`Status: ${loan.status}`, 10, 50);
  doc.text('Use the statement screen for full detail.', 10, 70);

  doc.save(`LoanStatement_${loan.loanNumber}.pdf`);
};

export const exportSchedule = (loan) => {
  DEP_WARN('exportSchedule');
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
    if (y > 280) { doc.addPage(); y = 20; }
    doc.text(`${inst.dueDate} | ${inst.principalDue} | ${inst.interestDue} | ${inst.totalDue} | ${inst.status}`, 10, y);
    y += 10;
  });

  doc.save(`Schedule_${loan.loanNumber}.pdf`);
};

export const exportPaymentHistory = (loan) => {
  DEP_WARN('exportPaymentHistory');
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
    if (y > 280) { doc.addPage(); y = 20; }
    doc.text(`${pmt.paymentDate} | ${pmt.amount} | ${pmt.paymentMethod} | ${pmt.referenceNumber} | ${pmt.status}`, 10, y);
    y += 10;
  });

  doc.save(`PaymentHistory_${loan.loanNumber}.pdf`);
};
