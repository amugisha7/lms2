import React from "react";
import CustomPopUp from "../../ModelAssets/CustomPopUp";
import { buildLoanDisplayName } from "../../Models/Loans/loanDisplayHelpers";
import CustomerLoanStatementView from "./CustomerLoanStatementView";

export default function CustomerLoanStatementPopup({
  open,
  onClose,
  loan,
  institution,
  onOpenFullStatement,
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
      maxWidth="lg"
    >
      <CustomerLoanStatementView
        loan={loan}
        institution={institution}
        preview
        onOpenFullStatement={onOpenFullStatement}
      />
    </CustomPopUp>
  );
}
