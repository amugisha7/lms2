import React from "react";
import { generateClient } from "aws-amplify/api";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material/styles";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { UserContext } from "../../../App";
import { listBranches } from "../../../graphql/queries";
import WorkingOverlay from "../../../ModelAssets/WorkingOverlay";
import ClickableText from "../../../ModelAssets/ClickableText";

// ─── Enhanced query that fetches all the fields we need for the display ───
const LIST_LOANS_DISPLAY_QUERY = `
  query ListLoansDisplay(
    $filter: ModelLoanFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLoans(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        loanNumber
        branchID
        principal
        interestRate
        startDate
        maturityDate
        duration
        durationInterval
        loanType
        rateInterval
        paymentFrequency
        status
        loanCurrency
        borrower {
          id
          firstname
          othername
          businessName
          phoneNumber
          email
        }
        loanProduct {
          id
          name
          interestCalculationMethod
        }
        createdByEmployee {
          id
          firstName
          lastName
        }
        balanceSnapshots(limit: 1, sortDirection: DESC) {
          items {
            principalOutstanding
            interestOutstanding
            feesOutstanding
            penaltyOutstanding
            totalOutstanding
          }
        }
        payments(limit: 1000) {
          items {
            amount
            status
            paymentStatusEnum
          }
        }
      }
      nextToken
    }
  }
`;

// ─── Helper: format currency ───
const fmtCurrency = (value, currency = "$") => {
  if (value == null || isNaN(value)) return "N/A";
  return `${currency}${Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// ─── Helper: format date to DD-MMM-YYYY ───
const fmtDate = (dateStr) => {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = String(d.getDate()).padStart(2, "0");
    const mon = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day}-${mon}-${year}`;
  } catch {
    return dateStr;
  }
};

// ─── Helper: compute total paid from payments ───
const computeTotalPaid = (payments) => {
  if (!payments?.items?.length) return 0;
  return payments.items
    .filter((p) => {
      const st = (p.paymentStatusEnum || p.status || "").toUpperCase();
      return st !== "REVERSED" && st !== "VOIDED" && st !== "FAILED";
    })
    .reduce((sum, p) => sum + (p.amount || 0), 0);
};

// ─── Helper: get balance from latest snapshot or compute ───
const getBalance = (loan) => {
  const snapshot = loan.balanceSnapshots?.items?.[0];
  if (snapshot) return snapshot.totalOutstanding ?? 0;
  const paid = computeTotalPaid(loan.payments);
  return (loan.principal || 0) - paid;
};

// ─── Status pill color mapping (Salesforce-style) ───
const getStatusColor = (status, sf) => {
  const s = (status || "").toUpperCase();
  if (["ACTIVE", "CURRENT"].includes(s))
    return { bg: sf.sf_pillSuccessBg, text: sf.sf_pillSuccessText };
  if (["PAYMENT_DUE", "PAST_DUE", "OVERDUE"].includes(s))
    return { bg: sf.sf_pillErrorBg, text: sf.sf_pillErrorText };
  if (["CLOSED", "CLEARED", "PAID"].includes(s))
    return { bg: sf.sf_pillInfoBg, text: sf.sf_pillInfoText };
  if (s === "WRITTEN_OFF")
    return { bg: sf.sf_pillWarningBg, text: sf.sf_pillWarningText };
  if (s === "VOIDED")
    return { bg: sf.sf_pillNeutralBg, text: sf.sf_pillNeutralText };
  return { bg: sf.sf_pillNeutralBg, text: sf.sf_pillNeutralText };
};

// ─── Grid column template (shared by header, rows, skeleton) ───
const SF_GRID_COLS =
  "minmax(180px,1.2fr) minmax(280px,1.8fr) minmax(200px,1.2fr) minmax(140px,1fr) minmax(160px,1fr)";

// ─── LabelValue: reusable inline label + value display ───
function LabelValue({ label, value, valueSx: valueSxOverride, sx }) {
  const theme = useTheme();
  const sf = theme.palette.sf;
  return (
    <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75, ...sx }}>
      <Typography
        sx={{
          fontSize: "0.7rem",
          color: sf.sf_textTertiary,
          fontWeight: 500,
          letterSpacing: "0.03em",
          textTransform: "uppercase",
          lineHeight: 1.2,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: "0.82rem",
          color: sf.sf_textPrimary,
          fontWeight: 500,
          lineHeight: 1.35,
          ...valueSxOverride,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

// ─── Single Loan Row component (Salesforce Lightning style) ───
function LoanRow({ loan, theme, index }) {
  const sf = theme.palette.sf;
  const borrower = loan.borrower || {};
  const borrowerName =
    [borrower.firstname, borrower.othername, borrower.businessName]
      .filter(Boolean)
      .join(" ")
      .trim() || "Unknown";

  const loanId = loan.loanNumber || loan.id || "—";
  const status = loan.status || "N/A";
  const statusColors = getStatusColor(status, sf);

  const principal = loan.principal;
  const totalPaid = computeTotalPaid(loan.payments);
  const balance = getBalance(loan);

  const interestRate =
    loan.interestRate != null ? `${loan.interestRate}%` : "N/A";
  const interestMethod =
    loan.loanProduct?.interestCalculationMethod || loan.loanType || "N/A";
  const paymentFrequency = loan.paymentFrequency || "N/A";

  const startDate = fmtDate(loan.startDate);
  const maturityDate = fmtDate(loan.maturityDate);
  const durationText =
    loan.duration != null
      ? `${loan.duration} ${loan.durationInterval || "months"}`
      : "N/A";

  const loanOfficer = loan.createdByEmployee
    ? [loan.createdByEmployee.firstName, loan.createdByEmployee.lastName]
        .filter(Boolean)
        .join(" ")
    : "N/A";

  // Alternating row background (Salesforce zebra)
  const rowBg = index % 2 === 0 ? "transparent" : sf.sf_rowStripeBg;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: SF_GRID_COLS,
        bgcolor: rowBg,
        borderBottom: `1px solid ${sf.sf_tableBorder}`,
        transition: "background-color 0.12s ease",
        "&:hover": { bgcolor: sf.sf_rowHover },
        minHeight: 72,
      }}
    >
      {/* ─── Col 1: Borrower / Loan ID ─── */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 0.3,
          px: sf.sf_tableCellPadX,
          py: sf.sf_tableCellPadY,
          borderRight: `1px solid ${sf.sf_tableBorder}`,
        }}
      >
        {/* Name row with contact icons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography
            sx={{
              fontSize: "0.85rem",
              fontWeight: 600,
              color: sf.sf_textLink,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 130,
              cursor: "pointer",
              "&:hover": {
                textDecoration: "underline",
                color: sf.sf_textLinkHover,
              },
            }}
          >
            {borrowerName}
          </Typography>
          <Tooltip
            title={borrower.phoneNumber || "No phone"}
            placement="top"
            arrow
          >
            <IconButton
              size="small"
              sx={{
                p: 0.3,
                color: sf.sf_textTertiary,
                "&:hover": { color: sf.sf_brandPrimary },
              }}
            >
              <PhoneOutlinedIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title={borrower.email || "No email"} placement="top" arrow>
            <IconButton
              size="small"
              sx={{
                p: 0.3,
                color: sf.sf_textTertiary,
                "&:hover": { color: sf.sf_brandPrimary },
              }}
            >
              <EmailOutlinedIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Loan ID */}
        <Typography sx={{ fontSize: "0.72rem", color: sf.sf_textTertiary }}>
          {loanId}
        </Typography>

        {/* Status pill */}
        <Chip
          label={status}
          size="small"
          sx={{
            alignSelf: "flex-start",
            mt: 0.3,
            height: 20,
            fontSize: "0.68rem",
            fontWeight: 700,
            bgcolor: statusColors.bg,
            color: statusColors.text,
            borderRadius: sf.sf_radiusPill,
            "& .MuiChip-label": { px: 1 },
          }}
        />
      </Box>

      {/* ─── Col 2: Amounts ─── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1,
          px: sf.sf_tableCellPadX,
          py: sf.sf_tableCellPadY,
          borderRight: `1px solid ${sf.sf_tableBorder}`,
          alignContent: "center",
        }}
      >
        {/* Left: monetary values */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.4 }}>
          <LabelValue label="Taken:" value={fmtCurrency(principal)} />
          <LabelValue
            label="Paid:"
            value={fmtCurrency(totalPaid)}
            valueSx={{ color: sf.sf_success }}
          />
          <LabelValue
            label="Balance:"
            value={fmtCurrency(balance)}
            valueSx={{
              color: balance > 0 ? sf.sf_error : sf.sf_success,
              fontWeight: 600,
            }}
          />
        </Box>
        {/* Right: rate info */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.4 }}>
          <LabelValue label="Rate:" value={interestRate} />
          <LabelValue
            label="Method:"
            value={interestMethod}
            valueSx={{
              fontSize: "0.76rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 110,
            }}
          />
          <LabelValue label="Freq.:" value={paymentFrequency} />
        </Box>
      </Box>

      {/* ─── Col 3: Dates ─── */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
          px: sf.sf_tableCellPadX,
          py: sf.sf_tableCellPadY,
          borderRight: `1px solid ${sf.sf_tableBorder}`,
          justifyContent: "center",
        }}
      >
        <LabelValue label="Start:" value={startDate} />
        <LabelValue label="Duration:" value={durationText} />
        <LabelValue label="Maturity:" value={maturityDate} />
      </Box>

      {/* ─── Col 4: Loan Officer ─── */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0.6,
          px: sf.sf_tableCellPadX,
          py: sf.sf_tableCellPadY,
          borderRight: `1px solid ${sf.sf_tableBorder}`,
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: "0.7rem",
            color: sf.sf_textTertiary,
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.03em",
            lineHeight: 1.2,
          }}
        >
          Loan Officer
        </Typography>
        <Typography
          sx={{
            fontSize: "0.82rem",
            color: sf.sf_textPrimary,
            fontWeight: 500,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: 120,
          }}
        >
          {loanOfficer}
        </Typography>
        <Tooltip title="Comments" placement="top">
          <IconButton
            size="small"
            sx={{
              alignSelf: "flex-start",
              color: sf.sf_brandPrimary,
              border: `1px solid ${sf.sf_borderLight}`,
              borderRadius: sf.sf_radiusSm,
              px: 1,
              "&:hover": { bgcolor: sf.sf_actionHoverBg },
            }}
          >
            <CommentOutlinedIcon sx={{ fontSize: 15 }} />
            <Typography sx={{ fontSize: "0.68rem", ml: 0.5, fontWeight: 500 }}>
              Comments
            </Typography>
          </IconButton>
        </Tooltip>
      </Box>

      {/* ─── Col 5: Actions ─── */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
          px: sf.sf_tableCellPadX,
          py: sf.sf_tableCellPadY,
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        {["Edit Loan", "Loan Statement", "Add Payment"].map((action) => (
          <ClickableText
            key={action}
            sx={{
              fontSize: "0.72rem",
              color: sf.sf_textLink,
              fontWeight: 500,
              "&:hover": {
                color: sf.sf_textLinkHover,
                textDecoration: "underline",
              },
            }}
          >
            {action}
          </ClickableText>
        ))}
      </Box>
    </Box>
  );
}

// ─── Loading skeleton (Salesforce style) ───
function LoadingSkeleton({ theme }) {
  const sf = theme.palette.sf;
  return Array.from({ length: 6 }).map((_, i) => (
    <Box
      key={i}
      sx={{
        display: "grid",
        gridTemplateColumns: SF_GRID_COLS,
        px: 0,
        py: 1.5,
        borderBottom: `1px solid ${sf.sf_tableBorder}`,
        bgcolor: i % 2 === 0 ? "transparent" : sf.sf_rowStripeBg,
      }}
    >
      {[0, 1, 2, 3, 4].map((c) => (
        <Box key={c} sx={{ px: sf.sf_tableCellPadX }}>
          <Skeleton
            variant="text"
            width="70%"
            height={18}
            sx={{ borderRadius: sf.sf_radiusSm }}
          />
          <Skeleton
            variant="text"
            width="50%"
            height={14}
            sx={{ borderRadius: sf.sf_radiusSm }}
          />
          <Skeleton
            variant="text"
            width="40%"
            height={14}
            sx={{ borderRadius: sf.sf_radiusSm }}
          />
        </Box>
      ))}
    </Box>
  ));
}

// ═══════════════════════════════════════════════════════
// ─── Main LoansDisplay Component ───
// ═══════════════════════════════════════════════════════
export default function LoansDisplay() {
  const [loans, setLoans] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [workingOverlayOpen, setWorkingOverlayOpen] = React.useState(false);
  const [workingOverlayMessage, setWorkingOverlayMessage] =
    React.useState("Working...");
  const [sortField, setSortField] = React.useState(null);
  const [sortDirection, setSortDirection] = React.useState("asc");
  const hasFetchedRef = React.useRef();
  const { userDetails } = React.useContext(UserContext);
  const theme = useTheme();

  // ─── Sort handler: toggle asc/desc or switch field ───
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // ─── Sorted loans memo ───
  const sortedLoans = React.useMemo(() => {
    if (!sortField) return loans;
    const dir = sortDirection === "asc" ? 1 : -1;

    const getValue = (loan, field) => {
      switch (field) {
        case "taken":
          return loan.principal ?? 0;
        case "paid":
          return computeTotalPaid(loan.payments);
        case "balance":
          return getBalance(loan);
        case "start":
          return loan.startDate ? new Date(loan.startDate).getTime() : 0;
        case "duration":
          return loan.duration ?? 0;
        case "maturity":
          return loan.maturityDate ? new Date(loan.maturityDate).getTime() : 0;
        default:
          return 0;
      }
    };

    return [...loans].sort((a, b) => {
      const va = getValue(a, sortField);
      const vb = getValue(b, sortField);
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });
  }, [loans, sortField, sortDirection]);

  // ─── Fetch loans (same logic as Loans.jsx) ───
  const fetchLoans = React.useCallback(async () => {
    const isAdmin = userDetails?.userType === "Admin";
    const branchId = userDetails?.branchUsersId;
    const institutionId =
      userDetails?.institution?.id || userDetails?.institutionUsersId;

    if ((!isAdmin && !branchId) || (isAdmin && !institutionId)) return;

    setLoading(true);
    setWorkingOverlayOpen(true);
    setWorkingOverlayMessage("Loading Loans...");

    try {
      const client = generateClient();

      // Resolve branch IDs for admin users
      let institutionBranchIds = [];
      if (isAdmin) {
        let branchesNextToken = null;
        do {
          const branchData = await client.graphql({
            query: listBranches,
            variables: {
              limit: 1000,
              nextToken: branchesNextToken,
              filter: { institutionBranchesId: { eq: institutionId } },
            },
          });
          const branchItems = branchData?.data?.listBranches?.items || [];
          institutionBranchIds.push(...branchItems.map((b) => b.id));
          branchesNextToken = branchData?.data?.listBranches?.nextToken;
        } while (branchesNextToken);
        institutionBranchIds = [...new Set(institutionBranchIds)];
      }

      // Fetch loans for each branch
      let allLoans = [];
      const loadLoansForBranch = async (targetBranchId) => {
        let nextToken = null;
        do {
          const result = await client.graphql({
            query: LIST_LOANS_DISPLAY_QUERY,
            variables: {
              limit: 100,
              nextToken,
              filter: { branchID: { eq: targetBranchId } },
            },
          });
          const batch = result?.data?.listLoans?.items || [];
          allLoans.push(...batch);
          nextToken = result?.data?.listLoans?.nextToken;
        } while (nextToken);
      };

      if (isAdmin) {
        for (const bid of institutionBranchIds) {
          await loadLoansForBranch(bid);
        }
      } else {
        await loadLoansForBranch(branchId);
      }

      // De-duplicate & filter out draft/review/rejected
      const processed = Array.from(
        new Map(allLoans.map((l) => [l.id, l])).values(),
      ).filter((loan) => {
        const st = (loan.status || "").toLowerCase();
        return (
          !st.includes("draft") &&
          !st.includes("review") &&
          !st.includes("rejected")
        );
      });

      setLoans(processed);
    } catch (err) {
      console.error("LoansDisplay – Error fetching loans:", err);
      setLoans([]);
    } finally {
      setLoading(false);
      setWorkingOverlayOpen(false);
    }
  }, [userDetails]);

  React.useEffect(() => {
    if (!userDetails) return;

    const fetchKey =
      userDetails.userType === "Admin"
        ? userDetails.institution?.id ||
          userDetails.institutionUsersId ||
          "admin"
        : userDetails.branchUsersId;

    if (fetchKey && fetchKey !== hasFetchedRef.current) {
      fetchLoans();
      hasFetchedRef.current = fetchKey;
    }
  }, [userDetails, fetchLoans]);

  const sf = theme.palette.sf;

  return (
    <Box sx={{ bgcolor: sf.sf_pageBg, minHeight: "100vh", p: sf.sf_spacingXl }}>
      <WorkingOverlay
        open={workingOverlayOpen}
        message={workingOverlayMessage}
      />

      {/* ─── Salesforce Page Header ─── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: sf.sf_spacingLg,
          pb: sf.sf_spacingMd,
          borderBottom: `2px solid ${sf.sf_brandPrimary}`,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: sf.sf_textPrimary,
              letterSpacing: "-0.01em",
            }}
          >
            Loans
          </Typography>
          <Typography
            sx={{
              fontSize: "0.78rem",
              color: sf.sf_textTertiary,
              mt: 0.25,
            }}
          >
            {loans.length} {loans.length === 1 ? "item" : "items"}
          </Typography>
        </Box>
      </Box>

      {/* ─── Table Card Container ─── */}
      <Box
        sx={{
          border: `1px solid ${sf.sf_borderLight}`,
          borderRadius: sf.sf_radiusMd,
          overflow: "hidden",
          bgcolor: sf.sf_cardBg,
          boxShadow: sf.sf_shadowMd,
        }}
      >
        {/* ─── Header Row ─── */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: SF_GRID_COLS,
            bgcolor: sf.sf_tableHeaderBg,
            borderBottom: `1px solid ${sf.sf_tableBorder}`,
          }}
        >
          {/* Col Header: Borrower / Loan ID */}
          <Box
            sx={{
              px: sf.sf_tableCellPadX,
              py: "10px",
              borderRight: `1px solid ${sf.sf_tableBorder}`,
            }}
          >
            <Typography
              sx={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: sf.sf_tableHeaderText,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Borrower / Loan ID
            </Typography>
          </Box>

          {/* Col Header: Amounts (with sort chips) */}
          <Box
            sx={{
              px: sf.sf_tableCellPadX,
              py: "10px",
              borderRight: `1px solid ${sf.sf_tableBorder}`,
            }}
          >
            <Typography
              sx={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: sf.sf_tableHeaderText,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Amounts
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                mt: 0.4,
                flexWrap: "wrap",
              }}
            >
              <Typography
                sx={{ fontSize: "0.62rem", color: sf.sf_textTertiary, mr: 0.3 }}
              >
                Sort:
              </Typography>
              {[
                { key: "taken", label: "Taken" },
                { key: "paid", label: "Paid" },
                { key: "balance", label: "Balance" },
              ].map((s) => {
                const isActive = sortField === s.key;
                return (
                  <Chip
                    key={s.key}
                    label={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.3 }}
                      >
                        {s.label}
                        {isActive &&
                          (sortDirection === "asc" ? (
                            <ArrowUpwardIcon sx={{ fontSize: 10 }} />
                          ) : (
                            <ArrowDownwardIcon sx={{ fontSize: 10 }} />
                          ))}
                      </Box>
                    }
                    size="small"
                    onClick={() => handleSort(s.key)}
                    sx={{
                      height: 20,
                      fontSize: "0.62rem",
                      fontWeight: isActive ? 700 : 500,
                      cursor: "pointer",
                      bgcolor: isActive ? sf.sf_actionBg : "transparent",
                      color: isActive ? sf.sf_actionText : sf.sf_textTertiary,
                      border: `1px solid ${isActive ? sf.sf_borderFocus : sf.sf_borderLight}`,
                      borderRadius: sf.sf_radiusSm,
                      "&:hover": { bgcolor: sf.sf_actionHoverBg },
                      "& .MuiChip-label": { px: 0.6 },
                    }}
                  />
                );
              })}
            </Box>
          </Box>

          {/* Col Header: Dates (with sort chips) */}
          <Box
            sx={{
              px: sf.sf_tableCellPadX,
              py: "10px",
              borderRight: `1px solid ${sf.sf_tableBorder}`,
            }}
          >
            <Typography
              sx={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: sf.sf_tableHeaderText,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Dates
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                mt: 0.4,
                flexWrap: "wrap",
              }}
            >
              <Typography
                sx={{ fontSize: "0.62rem", color: sf.sf_textTertiary, mr: 0.3 }}
              >
                Sort:
              </Typography>
              {[
                { key: "start", label: "Start" },
                { key: "duration", label: "Duration" },
                { key: "maturity", label: "Maturity" },
              ].map((s) => {
                const isActive = sortField === s.key;
                return (
                  <Chip
                    key={s.key}
                    label={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.3 }}
                      >
                        {s.label}
                        {isActive &&
                          (sortDirection === "asc" ? (
                            <ArrowUpwardIcon sx={{ fontSize: 10 }} />
                          ) : (
                            <ArrowDownwardIcon sx={{ fontSize: 10 }} />
                          ))}
                      </Box>
                    }
                    size="small"
                    onClick={() => handleSort(s.key)}
                    sx={{
                      height: 20,
                      fontSize: "0.62rem",
                      fontWeight: isActive ? 700 : 500,
                      cursor: "pointer",
                      bgcolor: isActive ? sf.sf_actionBg : "transparent",
                      color: isActive ? sf.sf_actionText : sf.sf_textTertiary,
                      border: `1px solid ${isActive ? sf.sf_borderFocus : sf.sf_borderLight}`,
                      borderRadius: sf.sf_radiusSm,
                      "&:hover": { bgcolor: sf.sf_actionHoverBg },
                      "& .MuiChip-label": { px: 0.6 },
                    }}
                  />
                );
              })}
            </Box>
          </Box>

          {/* Col Header: Loan Officer */}
          <Box
            sx={{
              px: sf.sf_tableCellPadX,
              py: "10px",
              borderRight: `1px solid ${sf.sf_tableBorder}`,
            }}
          >
            <Typography
              sx={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: sf.sf_tableHeaderText,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Loan Officer
            </Typography>
          </Box>

          {/* Col Header: Actions */}
          <Box sx={{ px: sf.sf_tableCellPadX, py: "10px" }}>
            <Typography
              sx={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: sf.sf_tableHeaderText,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Actions
            </Typography>
          </Box>
        </Box>

        {/* ─── Body ─── */}
        {loading ? (
          <LoadingSkeleton theme={theme} />
        ) : loans.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography
              sx={{
                color: sf.sf_textTertiary,
                fontSize: "0.9rem",
              }}
            >
              No loans found.
            </Typography>
          </Box>
        ) : (
          sortedLoans.map((loan, idx) => (
            <LoanRow key={loan.id} loan={loan} theme={theme} index={idx} />
          ))
        )}
      </Box>
    </Box>
  );
}
