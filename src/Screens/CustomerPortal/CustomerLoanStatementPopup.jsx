import React from "react";
import CustomPopUp from "../../ModelAssets/CustomPopUp";
import { buildLoanDisplayName } from "../../Models/Loans/loanDisplayHelpers";
import LoanStatementScreen from "../../Models/Loans/LoanStatements/LoanStatementScreen";

export default function CustomerLoanStatementPopup({
  open,
  onClose,
  loan,
  institution,
}) {
  if (!loan) {
    return null;
  }

  const currencyCode = loan.loanCurrency || institution?.currencyCode || "";
  const title = buildLoanDisplayName(loan, currencyCode) || "Loan Statement";

  return (
    <CustomPopUp
      open={open}
      onClose={onClose}
      title={title}
      showEdit={false}
      showDelete={false}
      maxWidth="xl"
    >
      <LoanStatementScreen
        loan={loan}
        embedded
        institutionOverride={institution}
        showHeaderControls={false}
        showDetailControls={false}
      />
    </CustomPopUp>
  );
}
