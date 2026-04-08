import React from "react";
import Box from "@mui/material/Box";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { useTheme } from "@mui/material/styles";
import ClickableText from "../../../ModelAssets/ClickableText";

const CLOSE_DELAY = 140;

function DetailCell({ label, children, sf, sx }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0, ...sx }}>
      <Typography
        sx={{
          fontSize: "0.6rem",
          fontWeight: 600,
          color: sf.sf_textTertiary,
          textTransform: "uppercase",
          letterSpacing: "0.03em",
          lineHeight: 1.2,
          mb: 0.15,
        }}
      >
        {label}
      </Typography>
      {children}
    </Box>
  );
}

export default function LoanInfoPopup({
  loan,
  loanName,
  onNavigate,
  onBorrowerClick,
  onLoanOfficerClick,
  onStatementClick,
  onPaymentsClick,
  onCommentsClick,
  statusColors,
  MoneyText,
  getMoneyTextSx,
  fmtDate,
  durationDisplay,
  daysLeft,
  formatRateInterval,
  getBalance,
  computeTotalPaid,
  getPrincipalBalance,
  parseLoanRecord,
}) {
  const theme = useTheme();
  const sf = theme.palette.sf;
  const anchorRef = React.useRef(null);
  const closeTimerRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);

  const clearCloseTimer = React.useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openPopup = React.useCallback(() => {
    clearCloseTimer();
    setOpen(true);
  }, [clearCloseTimer]);

  const closePopup = React.useCallback(() => {
    clearCloseTimer();
    setOpen(false);
  }, [clearCloseTimer]);

  const scheduleClose = React.useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
    }, CLOSE_DELAY);
  }, [clearCloseTimer]);

  React.useEffect(
    () => () => {
      clearCloseTimer();
    },
    [clearCloseTimer],
  );

  const handleTriggerClick = React.useCallback(
    (event) => {
      event.stopPropagation();
      onNavigate?.();
    },
    [onNavigate],
  );

  const handlePopupNavigate = React.useCallback(
    (event) => {
      event.stopPropagation();
      closePopup();
      onNavigate?.();
    },
    [closePopup, onNavigate],
  );

  const handleBorrowerClick = React.useCallback(
    (event) => {
      event.stopPropagation();
      closePopup();
      onBorrowerClick?.();
    },
    [closePopup, onBorrowerClick],
  );

  const handleOfficerClick = React.useCallback(
    (event) => {
      event.stopPropagation();
      closePopup();
      onLoanOfficerClick?.();
    },
    [closePopup, onLoanOfficerClick],
  );

  const handleStatementClick = React.useCallback(
    (event) => {
      event.stopPropagation();
      closePopup();
      onStatementClick?.();
    },
    [closePopup, onStatementClick],
  );

  const handlePaymentsClick = React.useCallback(
    (event) => {
      event.stopPropagation();
      closePopup();
      onPaymentsClick?.();
    },
    [closePopup, onPaymentsClick],
  );

  const handleCommentsClick = React.useCallback(
    (event) => {
      event.stopPropagation();
      closePopup();
      onCommentsClick?.();
    },
    [closePopup, onCommentsClick],
  );

  const b = loan.borrower || {};
  const borrowerName =
    [b.firstname, b.othername, b.businessName]
      .filter(Boolean)
      .join(" ")
      .trim() || "N/A";
  const status = loan.status || "N/A";
  const loanIdDisplay = loan.loanNumber || loan.id || "\u2014";
  const officer = loan.createdByEmployee;
  const officerName = officer
    ? [officer.firstName, officer.lastName].filter(Boolean).join(" ") ||
      officer.email
    : "N/A";
  const balance = getBalance(loan);
  const totalPaid = computeTotalPaid(loan.payments);
  const principalBal = getPrincipalBalance(loan);
  const computationRecord = parseLoanRecord(loan);
  const rateDisplay =
    loan.interestRate != null
      ? `${loan.interestRate}% / ${formatRateInterval(loan.rateInterval)}`
      : "N/A";
  const interestMethod =
    computationRecord?.interestMethod ||
    computationRecord?.interestCalculationMethod ||
    loan.loanProduct?.interestCalculationMethod ||
    loan.loanType ||
    "N/A";
  const daysLeftDisplay =
    daysLeft == null
      ? "N/A"
      : daysLeft < 0
        ? `${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? "s" : ""} overdue`
        : `${daysLeft} day${daysLeft !== 1 ? "s" : ""}`;

  const cellTextSx = {
    fontSize: "0.82rem",
    fontWeight: 600,
    color: sf.sf_textPrimary,
    lineHeight: 1.2,
    wordBreak: "break-word",
  };

  return (
    <ClickAwayListener onClickAway={closePopup}>
      <Box sx={{ display: "block", width: "100%", lineHeight: 1 }}>
        <Typography
          component="span"
          ref={anchorRef}
          onMouseEnter={openPopup}
          onMouseLeave={scheduleClose}
          onClick={handleTriggerClick}
          sx={{
            display: "inline-block",
            fontSize: "0.82rem",
            fontWeight: 600,
            color: sf.sf_textLink,
            cursor: "pointer",
            whiteSpace: "normal",
            wordBreak: "break-word",
            lineHeight: 1.2,
            verticalAlign: "top",
            m: 0,
            p: 0,
            textDecoration: "underline",
            "&:hover": {
              color: sf.sf_textLinkHover,
            },
          }}
        >
          {loanName}
        </Typography>

        <Popper
          open={open}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          modifiers={[{ name: "offset", options: { offset: [0, 6] } }]}
          sx={{ zIndex: 1300 }}
        >
          <Paper
            elevation={3}
            onMouseEnter={openPopup}
            onMouseLeave={scheduleClose}
            sx={{
              px: 1.5,
              py: 1.25,
              minWidth: 420,
              maxWidth: 500,
              borderRadius: 0,
              border: `1px solid ${sf.sf_borderLight}`,
              boxShadow: sf.sf_shadowMd,
              bgcolor: sf.sf_cardBg || sf.sf_background || "background.paper",
            }}
          >
            {/* Loan Name — full width, clickable */}
            <ClickableText
              onClick={handlePopupNavigate}
              sx={{
                display: "block",
                fontSize: "1rem",
                fontWeight: 700,
                color: sf.sf_textLink,
                lineHeight: 1.3,
                mb: 0.5,
                wordBreak: "break-word",
                justifyContent: "center",
              }}
            >
              {loanName}
            </ClickableText>

            {/* Action links row */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 0.9,
                pt: 0.5,
                pb: 0.75,
                borderBottom: `1px solid ${sf.sf_borderLight}`,
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  color: sf.sf_textTertiary,
                  letterSpacing: "0.01em",
                  flexShrink: 0,
                }}
              >
                ID:{" "}
                <Typography
                  component="span"
                  sx={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: sf.sf_textPrimary,
                  }}
                >
                  {loanIdDisplay}
                </Typography>
              </Typography>
              <Box
                sx={{
                  width: "1px",
                  height: 12,
                  bgcolor: sf.sf_borderLight,
                  flexShrink: 0,
                }}
              />
              <ClickableText
                sx={{ fontSize: "0.75rem", fontWeight: 400, lineHeight: 1.2 }}
                onClick={handlePaymentsClick}
              >
                Manage Payments
              </ClickableText>
              <ClickableText
                sx={{ fontSize: "0.75rem", fontWeight: 400, lineHeight: 1.2 }}
                onClick={handleStatementClick}
              >
                View Statement
              </ClickableText>
              <ClickableText
                sx={{ fontSize: "0.75rem", fontWeight: 400, lineHeight: 1.2 }}
                onClick={handleCommentsClick}
              >
                Loan Comments
              </ClickableText>
            </Box>

            {/* 3-column detail grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                columnGap: 1.5,
                rowGap: 1.15,
              }}
            >
              {/* Row 1: Borrower, Principal, Status */}
              <DetailCell label="Borrower" sf={sf}>
                <ClickableText
                  sx={{
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    lineHeight: 1.2,
                    wordBreak: "break-word",
                  }}
                  onClick={handleBorrowerClick}
                >
                  {borrowerName}
                </ClickableText>
              </DetailCell>
              <DetailCell label="Principal" sf={sf}>
                <MoneyText
                  value={loan.principal}
                  numberSx={getMoneyTextSx(sf.sf_textPrimary)}
                />
              </DetailCell>
              <DetailCell label="Status" sf={sf}>
                <Chip
                  label={status}
                  size="small"
                  sx={{
                    alignSelf: "flex-start",
                    height: 18,
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    bgcolor: statusColors.bg,
                    color: statusColors.text,
                    borderRadius: 0,
                    "& .MuiChip-label": { px: 0.7 },
                  }}
                />
              </DetailCell>

              {/* Row 3: Date Taken, Maturity, Duration */}
              <DetailCell label="Date Taken" sf={sf}>
                <Typography sx={cellTextSx}>
                  {fmtDate(loan.startDate)}
                </Typography>
              </DetailCell>
              <DetailCell label="Maturity" sf={sf}>
                <Typography sx={cellTextSx}>
                  {fmtDate(loan.maturityDate)}
                </Typography>
              </DetailCell>
              <DetailCell label="Duration" sf={sf}>
                <Typography sx={cellTextSx}>{durationDisplay}</Typography>
              </DetailCell>

              {/* Row 4: Interest, Interest Method */}
              <DetailCell label="Interest" sf={sf}>
                <Typography sx={cellTextSx}>{rateDisplay}</Typography>
              </DetailCell>
              <DetailCell label="Interest Method" sf={sf}>
                <Typography sx={cellTextSx}>{interestMethod}</Typography>
              </DetailCell>
              <DetailCell label="Days Left" sf={sf}>
                <Typography
                  sx={{
                    ...cellTextSx,
                    color:
                      daysLeft != null && daysLeft < 0
                        ? sf.sf_error
                        : sf.sf_textPrimary,
                  }}
                >
                  {daysLeftDisplay}
                </Typography>
              </DetailCell>

              {/* Row 5: Total Paid, Amount Due, Loan Balance */}
              <DetailCell label="Total Paid" sf={sf}>
                <MoneyText
                  value={totalPaid}
                  numberSx={getMoneyTextSx(sf.sf_success, 500)}
                />
              </DetailCell>
              <DetailCell label="Amount Due" sf={sf}>
                <MoneyText
                  value={balance}
                  numberSx={getMoneyTextSx(
                    balance > 0 ? sf.sf_textPrimary : sf.sf_success,
                  )}
                />
              </DetailCell>
              <DetailCell label="Loan Balance" sf={sf}>
                <MoneyText
                  value={principalBal}
                  numberSx={getMoneyTextSx(
                    principalBal > 0 ? sf.sf_error : sf.sf_success,
                  )}
                />
              </DetailCell>

              {/* Row 6: Loan Product, Loan Officer (clickable) */}
              <DetailCell label="Product" sf={sf}>
                <Typography sx={cellTextSx}>
                  {loan.loanProduct?.name || "N/A"}
                </Typography>
              </DetailCell>
              <DetailCell label="Loan Officer" sf={sf}>
                <ClickableText
                  sx={{
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    lineHeight: 1.2,
                    wordBreak: "break-word",
                  }}
                  onClick={handleOfficerClick}
                >
                  {officerName}
                </ClickableText>
              </DetailCell>
              <Box />
            </Box>
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}
