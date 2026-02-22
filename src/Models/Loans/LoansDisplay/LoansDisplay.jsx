import React from "react";
import { generateClient } from "aws-amplify/api";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import { useTheme, alpha } from "@mui/material/styles";
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

// ─── Status chip color mapping ───
const getStatusColor = (status, theme) => {
  const s = (status || "").toUpperCase();
  if (["ACTIVE", "CURRENT"].includes(s))
    return {
      bg: alpha(theme.palette.success.main, 0.15),
      text: theme.palette.success.main,
    };
  if (["PAYMENT_DUE", "PAST_DUE", "OVERDUE"].includes(s))
    return {
      bg: alpha(theme.palette.error.main, 0.15),
      text: theme.palette.error.main,
    };
  if (["CLOSED", "CLEARED", "PAID"].includes(s))
    return {
      bg: alpha(theme.palette.info.main, 0.15),
      text: theme.palette.info.main,
    };
  if (s === "WRITTEN_OFF")
    return {
      bg: alpha(theme.palette.warning.main, 0.15),
      text: theme.palette.warning.main,
    };
  if (s === "VOIDED")
    return {
      bg: alpha(theme.palette.text.disabled, 0.15),
      text: theme.palette.text.disabled,
    };
  return {
    bg: alpha(theme.palette.text.secondary, 0.1),
    text: theme.palette.text.secondary,
  };
};

// ─── LabelValue: reusable inline label + value display ───
function LabelValue({ label, value, valueSx: valueSxOverride, sx }) {
  const theme = useTheme();
  return (
    <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75, ...sx }}>
      <Typography
        sx={{
          fontSize: "0.7rem",
          color: theme.palette.text.secondary,
          fontWeight: 500,
          letterSpacing: "0.02em",
          textTransform: "uppercase",
          lineHeight: 1.2,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: "0.82rem",
          color: theme.palette.text.primary,
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

// ─── Single Loan Row component ───
function LoanRow({ loan, theme, index }) {
  const borrower = loan.borrower || {};
  const borrowerName =
    [borrower.firstname, borrower.othername, borrower.businessName]
      .filter(Boolean)
      .join(" ")
      .trim() || "Unknown";

  const loanId = loan.loanNumber || loan.id || "—";
  const status = loan.status || "N/A";
  const statusColors = getStatusColor(status, theme);

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

  const isDark = theme.palette.mode === "dark";

  // Alternating row background
  const rowBg =
    index % 2 === 0
      ? "transparent"
      : isDark
        ? alpha(theme.palette.primary.light, 0.08)
        : alpha(theme.palette.primary.main, 0.03);

  const hoverBg = isDark
    ? alpha(theme.palette.primary.light, 0.14)
    : alpha(theme.palette.blueAccent[500], 0.06);

  // Label style helper
  const labelSx = {
    fontSize: "0.7rem",
    color: theme.palette.text.secondary,
    fontWeight: 500,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    lineHeight: 1.2,
    mb: 0.2,
  };

  const valueSx = {
    fontSize: "0.82rem",
    color: theme.palette.text.primary,
    fontWeight: 500,
    lineHeight: 1.35,
  };

  return (
    <>
      {/* ─── Main Row ─── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "200px 320px 240px 170px 220px",
          borderBottom: `1px solid ${theme.palette.divider}`,
          transition: "background-color 0.15s ease",
          "&:hover": { bgcolor: hoverBg },
          minHeight: 80,
        }}
      >
        {/* ─── Col 1: Borrower / Loan ID ─── */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 1.5,
            borderRight: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography
                sx={{
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 130,
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
                    color: theme.palette.text.secondary,
                    "&:hover": { color: theme.palette.blueText.main },
                  }}
                >
                  <PhoneOutlinedIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={borrower.email || "No email"}
                placement="top"
                arrow
              >
                <IconButton
                  size="small"
                  sx={{
                    p: 0.3,
                    color: theme.palette.text.secondary,
                    "&:hover": { color: theme.palette.blueText.main },
                  }}
                >
                  <EmailOutlinedIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
            </Box>
            <LabelValue
              label="Loan ID:"
              value={loanId}
              sx={{ mt: 0.3 }}
              valueSx={{ fontSize: "0.75rem" }}
            />
            <Chip
              label={status}
              size="small"
              sx={{
                mt: 0.5,
                height: 20,
                fontSize: "0.68rem",
                fontWeight: 600,
                bgcolor: statusColors.bg,
                color: statusColors.text,
                borderRadius: "4px",
                "& .MuiChip-label": { px: 1 },
              }}
            />
          </Box>
        </Box>

        {/* ─── Col 2: Amounts ─── */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1,
            px: 2,
            py: 1.5,
            borderRight: `1px solid ${theme.palette.divider}`,
          }}
        >
          {/* Left sub-col: monetary values */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.4 }}>
            <LabelValue label="Taken:" value={fmtCurrency(principal)} />
            <LabelValue
              label="Paid:"
              value={fmtCurrency(totalPaid)}
              valueSx={{ color: theme.palette.success.main }}
            />
            <LabelValue
              label="Balance:"
              value={fmtCurrency(balance)}
              valueSx={{
                color:
                  balance > 0
                    ? theme.palette.error.main
                    : theme.palette.success.main,
                fontWeight: 600,
              }}
            />
          </Box>
          {/* Right sub-col: rate info */}
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
            px: 2,
            py: 1.5,
            borderRight: `1px solid ${theme.palette.divider}`,
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
            gap: 0.8,
            px: 2,
            py: 1.5,
            borderRight: `1px solid ${theme.palette.divider}`,
            justifyContent: "center",
          }}
        >
          <Box>
            <Typography sx={labelSx}>Loan Officer</Typography>
            <Typography
              sx={{
                ...valueSx,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 120,
              }}
            >
              {loanOfficer}
            </Typography>
          </Box>
          <Tooltip title="Comments" placement="top">
            <IconButton
              size="small"
              sx={{
                alignSelf: "flex-start",
                color: theme.palette.blueText.main,
                border: `1px solid ${alpha(theme.palette.blueText.main, 0.3)}`,
                borderRadius: "6px",
                px: 1,
                "&:hover": {
                  bgcolor: alpha(theme.palette.blueText.main, 0.1),
                },
              }}
            >
              <CommentOutlinedIcon sx={{ fontSize: 16 }} />
              <Typography sx={{ fontSize: "0.7rem", ml: 0.5, fontWeight: 500 }}>
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
            gap: 0.6,
            px: 1.5,
            py: 1.5,
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <ClickableText
            sx={{ fontSize: "0.72rem", textTransform: "uppercase" }}
          >
            Edit Loan
          </ClickableText>
          <ClickableText
            sx={{ fontSize: "0.72rem", textTransform: "uppercase" }}
          >
            Loan Statement
          </ClickableText>
          <ClickableText
            sx={{ fontSize: "0.72rem", textTransform: "uppercase" }}
          >
            Add Payment
          </ClickableText>
        </Box>
      </Box>
    </>
  );
}

// ─── Loading skeleton ───
function LoadingSkeleton({ theme }) {
  return Array.from({ length: 5 }).map((_, i) => (
    <Box
      key={i}
      sx={{
        display: "grid",
        gridTemplateColumns: "200px 320px 240px 170px 220px",
        gap: 0,
        px: 2,
        py: 2,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      {[0, 1, 2, 3, 4].map((c) => (
        <Box key={c} sx={{ px: 1 }}>
          <Skeleton variant="text" width="70%" height={20} />
          <Skeleton variant="text" width="50%" height={16} />
          <Skeleton variant="text" width="40%" height={16} />
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

  const isDark = theme.palette.mode === "dark";

  return (
    <>
      <WorkingOverlay
        open={workingOverlayOpen}
        message={workingOverlayMessage}
      />

      {/* ─── Title ─── */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Loans Overview
        </Typography>
      </Box>

      {/* ─── Table Container ─── */}
      <Box
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 0,
          overflow: "hidden",
          bgcolor: theme.palette.background.paper,
          boxShadow: isDark
            ? "0 2px 8px rgba(0,0,0,0.35)"
            : "0 1px 4px rgba(0,0,0,0.08)",
        }}
      >
        {/* ─── Header Row ─── */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "200px 320px 240px 170px 220px",
            gap: 0,
            bgcolor: isDark
              ? alpha(theme.palette.blueAccent[900], 0.9)
              : alpha(theme.palette.blueAccent[100], 0.5),
            borderBottom: `2px solid ${theme.palette.divider}`,
          }}
        >
          {/* Col Header: Borrower / Loan ID */}
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderRight: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              sx={{
                fontSize: "0.78rem",
                fontWeight: 700,
                color: theme.palette.text.primary,
                letterSpacing: "0.03em",
                textTransform: "uppercase",
              }}
            >
              Borrower / Loan ID
            </Typography>
          </Box>

          {/* Col Header: Amounts (with sort chips) */}
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderRight: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              sx={{
                fontSize: "0.78rem",
                fontWeight: 700,
                color: theme.palette.text.primary,
                letterSpacing: "0.03em",
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
                sx={{
                  fontSize: "0.65rem",
                  color: theme.palette.text.secondary,
                  mr: 0.3,
                }}
              >
                Sort by:
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
                            <ArrowUpwardIcon sx={{ fontSize: 11 }} />
                          ) : (
                            <ArrowDownwardIcon sx={{ fontSize: 11 }} />
                          ))}
                      </Box>
                    }
                    size="small"
                    onClick={() => handleSort(s.key)}
                    sx={{
                      height: 20,
                      fontSize: "0.65rem",
                      fontWeight: isActive ? 700 : 500,
                      cursor: "pointer",
                      bgcolor: isActive
                        ? alpha(theme.palette.blueText.main, 0.15)
                        : "transparent",
                      color: isActive
                        ? theme.palette.blueText.main
                        : theme.palette.text.secondary,
                      border: `1px solid ${isActive ? alpha(theme.palette.blueText.main, 0.4) : theme.palette.divider}`,
                      "&:hover": {
                        bgcolor: alpha(theme.palette.blueText.main, 0.1),
                      },
                      "& .MuiChip-label": { px: 0.7 },
                    }}
                  />
                );
              })}
            </Box>
          </Box>

          {/* Col Header: Dates (with sort chips) */}
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderRight: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              sx={{
                fontSize: "0.78rem",
                fontWeight: 700,
                color: theme.palette.text.primary,
                letterSpacing: "0.03em",
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
                sx={{
                  fontSize: "0.65rem",
                  color: theme.palette.text.secondary,
                  mr: 0.3,
                }}
              >
                Sort by:
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
                            <ArrowUpwardIcon sx={{ fontSize: 11 }} />
                          ) : (
                            <ArrowDownwardIcon sx={{ fontSize: 11 }} />
                          ))}
                      </Box>
                    }
                    size="small"
                    onClick={() => handleSort(s.key)}
                    sx={{
                      height: 20,
                      fontSize: "0.65rem",
                      fontWeight: isActive ? 700 : 500,
                      cursor: "pointer",
                      bgcolor: isActive
                        ? alpha(theme.palette.blueText.main, 0.15)
                        : "transparent",
                      color: isActive
                        ? theme.palette.blueText.main
                        : theme.palette.text.secondary,
                      border: `1px solid ${isActive ? alpha(theme.palette.blueText.main, 0.4) : theme.palette.divider}`,
                      "&:hover": {
                        bgcolor: alpha(theme.palette.blueText.main, 0.1),
                      },
                      "& .MuiChip-label": { px: 0.7 },
                    }}
                  />
                );
              })}
            </Box>
          </Box>

          {/* Col Header: Loan Officer */}
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderRight: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              sx={{
                fontSize: "0.78rem",
                fontWeight: 700,
                color: theme.palette.text.primary,
                letterSpacing: "0.03em",
                textTransform: "uppercase",
              }}
            >
              Loan Officer
            </Typography>
          </Box>

          {/* Col Header: Actions */}
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography
              sx={{
                fontSize: "0.78rem",
                fontWeight: 700,
                color: theme.palette.text.primary,
                letterSpacing: "0.03em",
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
          <Box sx={{ textAlign: "center", py: 6 }}>
            <Typography sx={{ color: theme.palette.text.secondary }}>
              No loans found.
            </Typography>
          </Box>
        ) : (
          sortedLoans.map((loan, idx) => (
            <LoanRow key={loan.id} loan={loan} theme={theme} index={idx} />
          ))
        )}
      </Box>
    </>
  );
}
