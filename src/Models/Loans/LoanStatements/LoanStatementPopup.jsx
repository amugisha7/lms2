import React from "react";
import CustomPopUp from "../../../ModelAssets/CustomPopUp";
import { UserContext } from "../../../App";
import { buildLoanDisplayName } from "../loanDisplayHelpers";
import LoanStatementScreen from "./LoanStatementScreen";

export default function LoanStatementPopup({ open, onClose, loan, loanId }) {
  const { userDetails } = React.useContext(UserContext);

  const currencyCode =
    userDetails?.institution?.currencyCode ||
    userDetails?.currencyCode ||
    loan?.loanCurrency ||
    "";

  const title = loan
    ? buildLoanDisplayName(loan, currencyCode)
    : "Loan Statement";

  return (
    <CustomPopUp
      open={open}
      onClose={onClose}
      title={title}
      showEdit={false}
      showDelete={false}
      maxWidth="xl"
    >
      <LoanStatementScreen loan={loan} loanId={loanId || loan?.id} embedded />
    </CustomPopUp>
  );
}
