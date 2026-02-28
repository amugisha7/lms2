import React from "react";
import { generateClient } from "aws-amplify/api";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import InputBase from "@mui/material/InputBase";
import LinearProgress from "@mui/material/LinearProgress";
import { useTheme } from "@mui/material/styles";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Formik, Form, useField } from "formik";
import { UserContext } from "../../../App";
import { listBranches } from "../../../graphql/queries";
import WorkingOverlay from "../../../ModelAssets/WorkingOverlay";
import MultipleDropDownSearchable from "../../../Resources/FormComponents/MultipleDropDownSearchable";

//  Enhanced query that fetches all the fields we need for the display
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

//  Helper: format currency
const fmtCurrency = (value, currency = "$") => {
  if (value == null || isNaN(value)) return "N/A";
  return `${currency}${Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

//  Helper: format date to DD-MMM-YYYY
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
    const year = String(d.getFullYear()).slice(-2);
    return `${day}-${mon}-${year}`;
  } catch {
    return dateStr;
  }
};

//  Helper: compute total paid from payments
const computeTotalPaid = (payments) => {
  if (!payments?.items?.length) return 0;
  return payments.items
    .filter((p) => {
      const st = (p.paymentStatusEnum || p.status || "").toUpperCase();
      return st !== "REVERSED" && st !== "VOIDED" && st !== "FAILED";
    })
    .reduce((sum, p) => sum + (p.amount || 0), 0);
};

//  Helper: get balance from latest snapshot or compute
const getBalance = (loan) => {
  const snapshot = loan.balanceSnapshots?.items?.[0];
  if (snapshot) return snapshot.totalOutstanding ?? 0;
  const paid = computeTotalPaid(loan.payments);
  return (loan.principal || 0) - paid;
};

// --- Helper: get principal balance (remaining principal only) ---
const getPrincipalBalance = (loan) => {
  const snapshot = loan.balanceSnapshots?.items?.[0];
  if (snapshot)
    return snapshot.principalOutstanding ?? snapshot.totalOutstanding ?? 0;
  const paid = computeTotalPaid(loan.payments);
  return Math.max((loan.principal || 0) - paid, 0);
};

// --- Helper: format rate interval ---
const formatRateInterval = (interval) => {
  if (!interval) return "month";
  const lower = interval.toLowerCase();
  if (lower.includes("day") || lower.includes("daily")) return "day";
  if (lower.includes("week") || lower.includes("weekly")) return "week";
  if (lower.includes("month") || lower.includes("monthly")) return "month";
  if (lower.includes("quarter") || lower.includes("quarterly"))
    return "quarter";
  if (lower.includes("year") || lower.includes("annual")) return "year";
  return interval.toLowerCase();
};

//  Status pill color mapping
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

//  Days until a date (negative = past due)
const daysUntil = (dateStr) => {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  if (isNaN(target.getTime())) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.round((target - now) / 86400000);
};

//  Maturity urgency badge
const getMaturityUrgency = (dateStr, status, sf) => {
  const s = (status || "").toUpperCase();
  if (["CLOSED", "CLEARED", "PAID", "VOIDED", "WRITTEN_OFF"].includes(s))
    return null;
  const days = daysUntil(dateStr);
  if (days === null) return null;
  if (days < 0)
    return {
      label: `${Math.abs(days)}d overdue`,
      color: sf.sf_error,
      bg: sf.sf_errorBg,
    };
  if (days <= 7)
    return {
      label: `${days}d left`,
      color: sf.sf_warning,
      bg: sf.sf_warningBg,
    };
  if (days <= 30)
    return { label: `${days}d left`, color: sf.sf_info, bg: sf.sf_infoBg };
  return null;
};

//  Status filter tabs config
const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active", match: ["ACTIVE", "CURRENT"] },
  {
    key: "overdue",
    label: "Overdue",
    match: ["PAYMENT_DUE", "PAST_DUE", "OVERDUE"],
  },
  { key: "closed", label: "Closed", match: ["CLOSED", "CLEARED", "PAID"] },
  { key: "written_off", label: "Written Off", match: ["WRITTEN_OFF"] },
];

//  Grid column template
const SF_GRID_COLS =
  "minmax(140px,1.2fr) minmax(125px,1fr) minmax(88px,0.65fr) minmax(100px,0.75fr) minmax(100px,0.75fr) minmax(92px,0.65fr) minmax(115px,0.85fr) minmax(115px,0.85fr) minmax(120px,0.9fr)";

//  KPI Card
function KpiCard({ icon: Icon, label, value, subValue, accent, sf }) {
  return (
    <Box
      sx={{
        flex: "1 1 0",
        minWidth: 170,
        bgcolor: sf.sf_kpiCardBg,
        border: `1px solid ${sf.sf_borderLight}`,
        borderRadius: 0,
        p: "16px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        boxShadow: sf.sf_shadowSm,
        transition: "box-shadow 0.15s, transform 0.15s",
        "&:hover": {
          boxShadow: sf.sf_shadowMd,
          transform: "translateY(-1px)",
        },
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 0,
          bgcolor: accent || sf.sf_kpiIconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon sx={{ fontSize: 20, color: sf.sf_kpiIconColor }} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: "0.68rem",
            fontWeight: 600,
            color: sf.sf_textTertiary,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            lineHeight: 1.2,
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            fontSize: "1.15rem",
            fontWeight: 700,
            color: sf.sf_textPrimary,
            lineHeight: 1.3,
            mt: 0.15,
          }}
        >
          {value}
        </Typography>
        {subValue && (
          <Typography
            sx={{
              fontSize: "0.68rem",
              color: sf.sf_textTertiary,
              lineHeight: 1.2,
              mt: 0.15,
            }}
          >
            {subValue}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

//  LabelValue: reusable inline label + value
function LabelValue({ label, value, valueSx: valueSxOverride, sx }) {
  const theme = useTheme();
  const sf = theme.palette.sf;
  return (
    <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75, ...sx }}>
      <Typography
        sx={{
          fontSize: "0.68rem",
          color: sf.sf_textTertiary,
          fontWeight: 500,
          letterSpacing: "0.03em",
          textTransform: "uppercase",
          lineHeight: 1.2,
          flexShrink: 0,
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

//  Repayment progress mini bar
function RepaymentBar({ principal, totalPaid, sf }) {
  const pct = principal > 0 ? Math.min((totalPaid / principal) * 100, 100) : 0;
  const isComplete = pct >= 100;
  return (
    <Box sx={{ mt: 0.5 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.2 }}>
        <Typography
          sx={{
            fontSize: "0.62rem",
            color: sf.sf_textTertiary,
            fontWeight: 500,
          }}
        >
          Repayment
        </Typography>
        <Typography
          sx={{
            fontSize: "0.62rem",
            fontWeight: 700,
            color: isComplete ? sf.sf_progressSuccess : sf.sf_textSecondary,
          }}
        >
          {pct.toFixed(0)}%
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={pct}
        sx={{
          height: 5,
          borderRadius: 0,
          bgcolor: sf.sf_progressTrack,
          "& .MuiLinearProgress-bar": {
            borderRadius: 0,
            bgcolor: isComplete ? sf.sf_progressSuccess : sf.sf_progressFill,
            transition: "width 0.4s ease",
          },
        }}
      />
    </Box>
  );
}

//  Action button
function ActionBtn({ icon: Icon, label, primary, sf, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        px: 1,
        py: 0.4,
        borderRadius: 0,
        cursor: "pointer",
        fontSize: "0.7rem",
        fontWeight: 500,
        color: primary ? sf.sf_textOnBrand : sf.sf_textLink,
        bgcolor: primary ? sf.sf_brandPrimary : "transparent",
        border: primary ? "none" : `1px solid ${sf.sf_borderLight}`,
        transition: "all 0.12s ease",
        "&:hover": {
          bgcolor: primary ? sf.sf_brandHover : sf.sf_actionHoverBg,
          color: primary ? sf.sf_textOnBrand : sf.sf_textLinkHover,
        },
      }}
    >
      <Icon sx={{ fontSize: 14 }} />
      <Typography sx={{ fontSize: "0.7rem", fontWeight: 500, lineHeight: 1 }}>
        {label}
      </Typography>
    </Box>
  );
}

// --- Single Loan Row ---
function LoanRow({ loan, theme, index }) {
  const sf = theme.palette.sf;
  const borrower = loan.borrower || {};
  const borrowerName =
    [borrower.firstname, borrower.othername, borrower.businessName]
      .filter(Boolean)
      .join(" ")
      .trim() || "Unknown";

  const loanId = loan.loanNumber || loan.id || "\u2014";
  const status = loan.status || "N/A";
  const statusColors = getStatusColor(status, sf);
  const principal = loan.principal || 0;
  const totalPaid = computeTotalPaid(loan.payments);
  const balance = getBalance(loan);
  const principalBal = getPrincipalBalance(loan);

  const rateDisplay =
    loan.interestRate != null
      ? `${loan.interestRate}% / ${formatRateInterval(loan.rateInterval)}`
      : "N/A";
  const interestMethod =
    loan.loanProduct?.interestCalculationMethod || loan.loanType || "N/A";

  const startDate = fmtDate(loan.startDate);
  const maturityDate = fmtDate(loan.maturityDate);

  const loanOfficer = loan.createdByEmployee
    ? [loan.createdByEmployee.firstName, loan.createdByEmployee.lastName]
        .filter(Boolean)
        .join(" ")
    : "N/A";

  const maturityUrgency = getMaturityUrgency(loan.maturityDate, status, sf);
  const rowBg = index % 2 === 0 ? "transparent" : sf.sf_rowStripeBg;

  const cellSx = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    px: "10px",
    py: "5px",
    borderRight: `1px solid ${sf.sf_tableBorder}`,
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: SF_GRID_COLS,
        bgcolor: rowBg,
        borderBottom: `1px solid ${sf.sf_tableBorder}`,
        transition: "background-color 0.12s ease",
        "&:hover": { bgcolor: sf.sf_rowHover },
        minHeight: 52,
      }}
    >
      {/* Col 1: Borrower */}
      <Box sx={cellSx}>
        <Typography
          sx={{
            fontSize: "0.82rem",
            fontWeight: 600,
            color: sf.sf_textLink,
            cursor: "pointer",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            "&:hover": {
              textDecoration: "underline",
              color: sf.sf_textLinkHover,
            },
          }}
        >
          {borrowerName}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.3, mt: 0.3 }}>
          <Tooltip
            title={borrower.phoneNumber || "No phone"}
            placement="top"
            arrow
          >
            <IconButton
              size="small"
              sx={{
                p: 0.2,
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
                p: 0.2,
                color: sf.sf_textTertiary,
                "&:hover": { color: sf.sf_brandPrimary },
              }}
            >
              <EmailOutlinedIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Col 2: Principal */}
      <Box sx={cellSx}>
        <Typography
          sx={{
            fontSize: "0.82rem",
            fontWeight: 600,
            color: sf.sf_textPrimary,
          }}
        >
          {fmtCurrency(principal)}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.7rem",
            color: sf.sf_textLink,
            cursor: "pointer",
            mt: 0.2,
            "&:hover": {
              textDecoration: "underline",
              color: sf.sf_textLinkHover,
            },
          }}
        >
          {loanId}
        </Typography>
        <Chip
          label={status}
          size="small"
          sx={{
            alignSelf: "flex-start",
            mt: 0.3,
            height: 18,
            fontSize: "0.62rem",
            fontWeight: 700,
            bgcolor: statusColors.bg,
            color: statusColors.text,
            borderRadius: 0,
            "& .MuiChip-label": { px: 0.7 },
          }}
        />
      </Box>

      {/* Col 3: Date Taken */}
      <Box sx={cellSx}>
        <Typography
          sx={{
            fontSize: "0.8rem",
            color: sf.sf_textPrimary,
            fontWeight: 500,
          }}
        >
          {startDate}
        </Typography>
      </Box>

      {/* Col 4: Maturity Date */}
      <Box sx={cellSx}>
        <Typography
          sx={{
            fontSize: "0.8rem",
            color: sf.sf_textPrimary,
            fontWeight: 500,
          }}
        >
          {maturityDate}
        </Typography>
        {maturityUrgency && (
          <Chip
            label={maturityUrgency.label}
            size="small"
            sx={{
              alignSelf: "flex-start",
              mt: 0.3,
              height: 17,
              fontSize: "0.58rem",
              fontWeight: 700,
              bgcolor: maturityUrgency.bg,
              color: maturityUrgency.color,
              borderRadius: 0,
              "& .MuiChip-label": { px: 0.5 },
            }}
          />
        )}
      </Box>

      {/* Col 5: Interest */}
      <Box sx={cellSx}>
        <Typography
          sx={{
            fontSize: "0.8rem",
            color: sf.sf_textPrimary,
            fontWeight: 500,
          }}
        >
          {rateDisplay}
        </Typography>
        <Tooltip title={`Method: ${interestMethod}`} placement="top" arrow>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              alignSelf: "flex-start",
              gap: 0.3,
              mt: 0.3,
              cursor: "help",
              color: sf.sf_textTertiary,
              "&:hover": { color: sf.sf_brandPrimary },
            }}
          >
            <InfoOutlinedIcon sx={{ fontSize: 14 }} />
            <Typography sx={{ fontSize: "0.62rem", fontWeight: 500 }}>
              Info
            </Typography>
          </Box>
        </Tooltip>
      </Box>

      {/* Col 6: Amount Due */}
      <Box sx={cellSx}>
        <Typography
          sx={{
            fontSize: "0.82rem",
            fontWeight: 600,
            color: balance > 0 ? sf.sf_textPrimary : sf.sf_success,
          }}
        >
          {fmtCurrency(balance)}
        </Typography>
      </Box>

      {/* Col 7: Total Paid */}
      <Box sx={cellSx}>
        <Typography
          sx={{
            fontSize: "0.82rem",
            fontWeight: 500,
            color: sf.sf_success,
          }}
        >
          {fmtCurrency(totalPaid)}
        </Typography>
        <ActionBtn icon={PaymentOutlinedIcon} label="Add Payment" sf={sf} />
      </Box>

      {/* Col 8: Loan Balance */}
      <Box sx={cellSx}>
        <Typography
          sx={{
            fontSize: "0.82rem",
            fontWeight: 600,
            color: principalBal > 0 ? sf.sf_error : sf.sf_success,
          }}
        >
          {fmtCurrency(principalBal)}
        </Typography>
        <ActionBtn icon={ReceiptLongOutlinedIcon} label="Statement" sf={sf} />
      </Box>

      {/* Col 9: Loan Officer */}
      <Box sx={{ ...cellSx, borderRight: "none" }}>
        <Typography
          sx={{
            fontSize: "0.8rem",
            color: sf.sf_textPrimary,
            fontWeight: 500,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {loanOfficer}
        </Typography>
        <Tooltip title="View Comments" placement="top">
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              alignSelf: "flex-start",
              gap: 0.3,
              mt: 0.3,
              cursor: "pointer",
              color: sf.sf_textLink,
              fontSize: "0.66rem",
              fontWeight: 500,
              "&:hover": { color: sf.sf_textLinkHover },
            }}
          >
            <CommentOutlinedIcon sx={{ fontSize: 13 }} />
            <span>Comments</span>
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
}
//  Loading skeleton
function LoadingSkeleton({ theme }) {
  const sf = theme.palette.sf;
  return Array.from({ length: 6 }).map((_, i) => (
    <Box
      key={i}
      sx={{
        display: "grid",
        gridTemplateColumns: SF_GRID_COLS,
        py: 1.5,
        borderBottom: `1px solid ${sf.sf_tableBorder}`,
        bgcolor: i % 2 === 0 ? "transparent" : sf.sf_rowStripeBg,
      }}
    >
      {Array.from({ length: 9 }).map((_, c) => (
        <Box key={c} sx={{ px: "10px" }}>
          <Skeleton
            variant="text"
            width="70%"
            height={16}
            sx={{ borderRadius: 0 }}
          />
          <Skeleton
            variant="text"
            width="50%"
            height={12}
            sx={{ borderRadius: 0 }}
          />
        </Box>
      ))}
    </Box>
  ));
}

//  Empty state
function EmptyState({ sf, searchTerm, statusFilter }) {
  const hasFilters = searchTerm || statusFilter !== "all";
  return (
    <Box sx={{ textAlign: "center", py: 8, px: 3 }}>
      <AssignmentOutlinedIcon
        sx={{
          fontSize: 48,
          color: sf.sf_textTertiary,
          mb: 1.5,
          opacity: 0.5,
        }}
      />
      <Typography
        sx={{
          color: sf.sf_textSecondary,
          fontSize: "0.95rem",
          fontWeight: 600,
          mb: 0.5,
        }}
      >
        {hasFilters ? "No matching loans" : "No loans found"}
      </Typography>
      <Typography
        sx={{
          color: sf.sf_textTertiary,
          fontSize: "0.8rem",
          maxWidth: 320,
          mx: "auto",
        }}
      >
        {hasFilters
          ? "Try adjusting your search or changing the status filter."
          : "Loans will appear here once they are created and approved."}
      </Typography>
    </Box>
  );
}

// --- FormikEffect: sync formik field value changes to a callback ---
function FormikEffect({ onChange, fieldName }) {
  const [field] = useField(fieldName);
  const prevValueRef = React.useRef(field.value);
  React.useEffect(() => {
    if (JSON.stringify(field.value) !== JSON.stringify(prevValueRef.current)) {
      prevValueRef.current = field.value;
      onChange(field.value);
    }
  }, [field.value, onChange]);
  return null;
}

// --- Branch filter wrapper (admin only) ---
function BranchFilterWrapper({ branches, onFilterChange, selectedCount }) {
  return (
    <Box sx={{ mb: 2, width: "100%" }}>
      <Formik initialValues={{ branchFilter: [] }} enableReinitialize>
        <Form>
          <FormikEffect onChange={onFilterChange} fieldName="branchFilter" />
          <MultipleDropDownSearchable
            label="Filter by Branch"
            name="branchFilter"
            options={branches.map((branch) => ({
              value: branch.id,
              label: branch.name,
            }))}
            placeholder={selectedCount === 0 ? "All Branches" : ""}
            editing={true}
            helperText={
              selectedCount === 0
                ? "Showing all branches"
                : `Showing ${selectedCount} branch(es)`
            }
          />
        </Form>
      </Formik>
    </Box>
  );
}

//
//  Main LoansDisplay Component
//
export default function LoansDisplay() {
  const [loans, setLoans] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [workingOverlayOpen, setWorkingOverlayOpen] = React.useState(false);
  const [workingOverlayMessage, setWorkingOverlayMessage] =
    React.useState("Working...");
  const [sortField, setSortField] = React.useState(null);
  const [sortDirection, setSortDirection] = React.useState("asc");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [branches, setBranches] = React.useState([]);
  const [selectedBranchFilter, setSelectedBranchFilter] = React.useState([]);
  const hasFetchedRef = React.useRef();
  const { userDetails } = React.useContext(UserContext);
  const theme = useTheme();

  //  Sort handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  //  Filtered + sorted loans
  const filteredLoans = React.useMemo(() => {
    let result = loans;

    // Branch filter (admin only)
    if (
      (userDetails?.userType || "").toLowerCase() === "admin" &&
      selectedBranchFilter.length > 0
    ) {
      result = result.filter((loan) =>
        selectedBranchFilter.includes(loan.branchID),
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      const tab = STATUS_TABS.find((t) => t.key === statusFilter);
      if (tab?.match) {
        result = result.filter((loan) =>
          tab.match.includes((loan.status || "").toUpperCase()),
        );
      }
    }

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter((loan) => {
        const b = loan.borrower || {};
        const searchable = [
          b.firstname,
          b.othername,
          b.businessName,
          loan.loanNumber,
          loan.id,
          loan.status,
          loan.loanProduct?.name,
          loan.createdByEmployee?.firstName,
          loan.createdByEmployee?.lastName,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return searchable.includes(q);
      });
    }

    return result;
  }, [loans, statusFilter, searchTerm, selectedBranchFilter, userDetails]);

  const sortedLoans = React.useMemo(() => {
    if (!sortField) return filteredLoans;
    const dir = sortDirection === "asc" ? 1 : -1;

    const getValue = (loan, field) => {
      switch (field) {
        case "borrower": {
          const b = loan.borrower || {};
          return [b.firstname, b.othername, b.businessName]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
        }
        case "taken":
          return loan.principal ?? 0;
        case "rate":
          return loan.interestRate ?? 0;
        case "paid":
          return computeTotalPaid(loan.payments);
        case "balance":
          return getBalance(loan);
        case "principalBal":
          return getPrincipalBalance(loan);
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

    return [...filteredLoans].sort((a, b) => {
      const va = getValue(a, sortField);
      const vb = getValue(b, sortField);
      if (typeof va === "string") return va.localeCompare(vb) * dir;
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });
  }, [filteredLoans, sortField, sortDirection]);

  //  KPI computations
  const kpis = React.useMemo(() => {
    const active = loans.filter((l) =>
      ["ACTIVE", "CURRENT"].includes((l.status || "").toUpperCase()),
    );
    const overdue = loans.filter((l) =>
      ["PAYMENT_DUE", "PAST_DUE", "OVERDUE"].includes(
        (l.status || "").toUpperCase(),
      ),
    );
    const totalPrincipal = loans.reduce((s, l) => s + (l.principal || 0), 0);
    const totalOutstanding = loans.reduce((s, l) => s + getBalance(l), 0);
    return {
      total: loans.length,
      active: active.length,
      overdue: overdue.length,
      totalPrincipal,
      totalOutstanding,
    };
  }, [loans]);

  //  Status tab counts
  const tabCounts = React.useMemo(() => {
    const counts = { all: loans.length };
    STATUS_TABS.forEach((tab) => {
      if (tab.key !== "all") {
        counts[tab.key] = loans.filter((l) =>
          tab.match.includes((l.status || "").toUpperCase()),
        ).length;
      }
    });
    return counts;
  }, [loans]);

  //  Fetch loans
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
      console.error("LoansDisplay \u2013 Error fetching loans:", err);
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

  // Fetch branches list for admin branch filter UI
  React.useEffect(() => {
    const fetchBranchesForAdmin = async () => {
      const isAdmin = (userDetails?.userType || "").toLowerCase() === "admin";
      const institutionId =
        userDetails?.institution?.id || userDetails?.institutionUsersId;
      console.log(
        "[LoansDisplay] userType:",
        userDetails?.userType,
        "isAdmin:",
        isAdmin,
        "institutionId:",
        institutionId,
      );
      if (!isAdmin || !institutionId) {
        setBranches([]);
        setSelectedBranchFilter([]);
        return;
      }
      try {
        const client = generateClient();
        const branchData = await client.graphql({
          query: listBranches,
          variables: {
            limit: 1000,
            filter: { institutionBranchesId: { eq: institutionId } },
          },
        });
        const items = branchData?.data?.listBranches?.items || [];
        console.log("[LoansDisplay] branches fetched:", items.length, items);
        setBranches(items);
        setSelectedBranchFilter([]);
      } catch (err) {
        console.error("LoansDisplay - Error fetching branches:", err);
        setBranches([]);
      }
    };
    if (userDetails) fetchBranchesForAdmin();
  }, [userDetails]);

  const sf = theme.palette.sf;

  //  Sort chip builder
  const renderSortChips = (items) =>
    items.map((s) => {
      const isActive = sortField === s.key;
      return (
        <Chip
          key={s.key}
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.3 }}>
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
            height: 19,
            fontSize: "0.6rem",
            fontWeight: isActive ? 700 : 500,
            cursor: "pointer",
            bgcolor: isActive ? sf.sf_actionBg : "transparent",
            color: isActive ? sf.sf_actionText : sf.sf_textTertiary,
            border: `1px solid ${isActive ? sf.sf_borderFocus : sf.sf_borderLight}`,
            borderRadius: 0,
            "&:hover": { bgcolor: sf.sf_actionHoverBg },
            "& .MuiChip-label": { px: 0.5 },
          }}
        />
      );
    });

  return (
    <>
      <WorkingOverlay
        open={workingOverlayOpen}
        message={workingOverlayMessage}
      />

      {/*  Page Header  */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          mb: "20px",
          pb: "12px",
          borderBottom: `3px solid ${sf.sf_brandPrimary}`,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "1.35rem",
              fontWeight: 700,
              color: sf.sf_textPrimary,
              letterSpacing: "-0.01em",
            }}
          >
            Loans
          </Typography>
          <Typography
            sx={{
              fontSize: "0.75rem",
              color: sf.sf_textTertiary,
              mt: 0.15,
            }}
          >
            {loading
              ? "Loading..."
              : `${loans.length} total \u00B7 ${filteredLoans.length} shown`}
          </Typography>
        </Box>
        <Tooltip title="Refresh data" placement="top">
          <IconButton
            onClick={() => {
              hasFetchedRef.current = null;
              fetchLoans();
            }}
            disabled={loading}
            sx={{
              color: sf.sf_brandPrimary,
              border: `1px solid ${sf.sf_borderLight}`,
              borderRadius: 0,
              p: 0.7,
              "&:hover": { bgcolor: sf.sf_actionHoverBg },
            }}
          >
            <RefreshIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Branch Filter (Admin only) */}
      {(userDetails?.userType || "").toLowerCase() === "admin" &&
        branches.length > 0 && (
          <BranchFilterWrapper
            branches={branches}
            onFilterChange={setSelectedBranchFilter}
            selectedCount={selectedBranchFilter.length}
          />
        )}

      {/*  KPI Cards  */}
      {!loading && (
        <Box
          sx={{
            display: "flex",
            gap: "14px",
            mb: "18px",
            flexWrap: "wrap",
          }}
        >
          <KpiCard
            icon={AssignmentOutlinedIcon}
            label="Total Loans"
            value={kpis.total}
            sf={sf}
          />
          <KpiCard
            icon={CheckCircleOutlineIcon}
            label="Active"
            value={kpis.active}
            accent={sf.sf_successBg}
            sf={sf}
          />
          <KpiCard
            icon={WarningAmberIcon}
            label="Overdue"
            value={kpis.overdue}
            accent={sf.sf_errorBg}
            sf={sf}
          />
          <KpiCard
            icon={AccountBalanceWalletOutlinedIcon}
            label="Portfolio"
            value={fmtCurrency(kpis.totalPrincipal)}
            sf={sf}
          />
          <KpiCard
            icon={TrendingUpIcon}
            label="Outstanding"
            value={fmtCurrency(kpis.totalOutstanding)}
            subValue={
              kpis.totalPrincipal > 0
                ? `${((kpis.totalOutstanding / kpis.totalPrincipal) * 100).toFixed(1)}% of portfolio`
                : undefined
            }
            accent={sf.sf_warningBg}
            sf={sf}
          />
        </Box>
      )}

      {/*  Search + Status Tabs  */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: "14px",
          flexWrap: "wrap",
        }}
      >
        {/* Search */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: sf.sf_searchBg,
            border: `1px solid ${sf.sf_searchBorder}`,
            borderRadius: 0,
            px: 1.2,
            py: 0.4,
            minWidth: 240,
            maxWidth: 340,
            flex: "1 1 240px",
            transition: "border-color 0.15s",
            "&:focus-within": { borderColor: sf.sf_searchFocusBorder },
          }}
        >
          <SearchIcon
            sx={{ fontSize: 18, color: sf.sf_textTertiary, mr: 0.8 }}
          />
          <InputBase
            placeholder="Search borrower, loan #, officer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              flex: 1,
              fontSize: "0.8rem",
              color: sf.sf_textPrimary,
              "& ::placeholder": {
                color: sf.sf_searchPlaceholder,
                opacity: 1,
              },
            }}
          />
        </Box>

        {/* Status filter tabs */}
        <Box sx={{ display: "flex", gap: 0.6, flexWrap: "wrap" }}>
          {STATUS_TABS.map((tab) => {
            const isActive = statusFilter === tab.key;
            const count = tabCounts[tab.key] ?? 0;
            return (
              <Chip
                key={tab.key}
                label={`${tab.label} (${count})`}
                size="small"
                onClick={() => setStatusFilter(tab.key)}
                sx={{
                  height: 26,
                  fontSize: "0.72rem",
                  fontWeight: isActive ? 700 : 500,
                  cursor: "pointer",
                  bgcolor: isActive ? sf.sf_tabActiveBg : sf.sf_tabInactiveBg,
                  color: isActive ? sf.sf_tabActiveText : sf.sf_tabInactiveText,
                  borderRadius: 0,
                  transition: "all 0.12s",
                  "&:hover": {
                    bgcolor: isActive ? sf.sf_tabActiveBg : sf.sf_tabHoverBg,
                  },
                  "& .MuiChip-label": { px: 1.2 },
                }}
              />
            );
          })}
        </Box>
      </Box>

      {/*  Table Card  */}
      {/* Outer wrapper flipped so scrollbar appears at top */}
      <Box
        sx={{
          transform: "rotateX(180deg)",
          border: `1px solid ${sf.sf_borderLight}`,
          overflowX: "auto",
          overflowY: "hidden",
          bgcolor: sf.sf_cardBg,
          boxShadow: sf.sf_shadowMd,
        }}
      >
        {/* Inner content flipped back upright */}
        <Box sx={{ transform: "rotateX(180deg)", minWidth: 1000 }}>
          {/* --- Header Row --- */}
          {/* Column definitions: label + optional sortKey */}
          {(() => {
            const COLS = [
              { label: "Borrower", key: "borrower" },
              { label: "Principal", key: "taken" },
              { label: "Date Taken", key: "start" },
              { label: "Maturity Date", key: "maturity" },
              { label: "Interest", key: "rate" },
              { label: "Amount Due", key: "balance" },
              { label: "Total Paid", key: "paid" },
              { label: "Loan Balance", key: "principalBal" },
              { label: "Loan Officer", key: null },
            ];
            return (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: SF_GRID_COLS,
                  bgcolor: sf.sf_tableHeaderBg,
                  borderBottom: `1px solid ${sf.sf_tableBorder}`,
                }}
              >
                {COLS.map(({ label, key }, i) => {
                  const isActive = sortField === key;
                  return (
                    <Box
                      key={label}
                      onClick={key ? () => handleSort(key) : undefined}
                      sx={{
                        px: "10px",
                        py: "8px",
                        borderRight:
                          i < COLS.length - 1
                            ? `1px solid ${sf.sf_tableBorder}`
                            : "none",
                        cursor: key ? "pointer" : "default",
                        userSelect: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.4,
                        "&:hover": key ? { bgcolor: sf.sf_rowHover } : {},
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.7rem",
                          fontWeight: isActive ? 800 : 700,
                          color: isActive
                            ? sf.sf_brandPrimary
                            : sf.sf_tableHeaderText,
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                        }}
                      >
                        {label}
                      </Typography>
                      {key &&
                        (isActive ? (
                          sortDirection === "asc" ? (
                            <ArrowUpwardIcon
                              sx={{ fontSize: 11, color: sf.sf_brandPrimary }}
                            />
                          ) : (
                            <ArrowDownwardIcon
                              sx={{ fontSize: 11, color: sf.sf_brandPrimary }}
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            sx={{ fontSize: 11, color: sf.sf_tableHeaderText }}
                          />
                        ))}
                    </Box>
                  );
                })}
              </Box>
            );
          })()}
          {/*  Body  */}
          {loading ? (
            <LoadingSkeleton theme={theme} />
          ) : sortedLoans.length === 0 ? (
            <EmptyState
              sf={sf}
              searchTerm={searchTerm}
              statusFilter={statusFilter}
            />
          ) : (
            sortedLoans.map((loan, idx) => (
              <LoanRow key={loan.id} loan={loan} theme={theme} index={idx} />
            ))
          )}

          {/*  Footer  */}
          {!loading && sortedLoans.length > 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: "10px",
                py: "8px",
                bgcolor: sf.sf_footerBg,
                borderTop: `1px solid ${sf.sf_tableBorder}`,
              }}
            >
              <Typography sx={{ fontSize: "0.72rem", color: sf.sf_footerText }}>
                Showing {sortedLoans.length} of {filteredLoans.length} loans
                {statusFilter !== "all" &&
                  ` (${STATUS_TABS.find((t) => t.key === statusFilter)?.label})`}
              </Typography>
              <Typography sx={{ fontSize: "0.72rem", color: sf.sf_footerText }}>
                Total Outstanding:{" "}
                {fmtCurrency(
                  sortedLoans.reduce((s, l) => s + getBalance(l), 0),
                )}
              </Typography>
            </Box>
          )}
        </Box>
        {/* end scroll container */}
      </Box>
    </>
  );
}
