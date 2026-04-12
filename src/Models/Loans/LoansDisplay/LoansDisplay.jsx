import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import InputBase from "@mui/material/InputBase";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../../App";
import AdminBranchScopeSelector from "../../../ModelAssets/AdminBranchScopeSelector";
import WorkingOverlay from "../../../ModelAssets/WorkingOverlay";
import CustomDataGrid from "../../../ModelAssets/CustomDataGrid";
import SFClickableText from "../../../ModelAssets/SF_ClickableText";
import PlusButtonMain from "../../../ModelAssets/PlusButtonMain";
import { useNotification } from "../../../ModelAssets/NotificationContext";
import { useSnackbar } from "../../../ModelAssets/SnackbarContext";
import { formatMoneyParts } from "../../../Resources/formatting";
import { Button } from "@mui/material";
import LoanInfoPopup from "./LoanInfoPopup";
import ManagePaymentsPopup from "../../Payments/ManagePaymentsPopup";
import LoanStatementPopup from "../LoanStatements/LoanStatementPopup";
import { buildLoanDisplayName } from "../loanDisplayHelpers";
import { LoanExplorerContext } from "./LoanExplorerContext";

const LOANS_PAGE_SIZE = 25;

const getCurrencyParts = (value, currency = "$", currencyCode) => {
  if (value == null || isNaN(value)) {
    return { prefix: "", number: "N/A" };
  }

  const parts = formatMoneyParts(value, currency, currencyCode);
  return {
    prefix: parts.prefix || "",
    number: parts.number || "N/A",
  };
};

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

const normalizeMoneyValue = (value) => {
  if (value == null) return 0;
  const numericValue =
    typeof value === "string"
      ? Number(value.replace(/,/g, "").trim())
      : Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
};

const computeTotalPaid = (payments) => {
  if (!payments?.items?.length) return 0;
  return payments.items
    .filter((p) => {
      const st = (p.paymentStatusEnum || p.status || "").toUpperCase();
      return st !== "REVERSED" && st !== "VOIDED" && st !== "FAILED";
    })
    .reduce((sum, p) => sum + normalizeMoneyValue(p?.amount), 0);
};

const getBalance = (loan) => {
  if (loan?.amountDueComputed != null) return loan.amountDueComputed;
  const paid = computeTotalPaid(loan.payments);
  return (loan.principal || 0) - paid;
};

const getPrincipalBalance = (loan) => {
  if (loan?.loanBalanceComputed != null) return loan.loanBalanceComputed;
  const paid = computeTotalPaid(loan.payments);
  return Math.max((loan.principal || 0) - paid, 0);
};

const getTotalPaid = (loan) =>
  loan?.totalPaidComputed != null
    ? loan.totalPaidComputed
    : computeTotalPaid(loan?.payments);

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

const formatDurationCompact = (duration, durationInterval) => {
  const numericDuration = Number(duration);
  if (!Number.isFinite(numericDuration)) return "N/A";

  const interval = String(durationInterval || "").toLowerCase();

  if (interval.includes("day")) return `${numericDuration}D`;
  if (interval.includes("week")) return `${numericDuration}WK`;
  if (interval.includes("quarter")) return `${numericDuration * 3}MO`;
  if (interval.includes("year") || interval.includes("annual")) {
    return `${numericDuration}YR`;
  }

  return `${numericDuration}MO`;
};

const formatDurationFull = (duration, durationInterval) => {
  const n = Number(duration);
  if (!Number.isFinite(n)) return "N/A";
  const interval = String(durationInterval || "").toLowerCase();
  const plural = (word, count) => `${count} ${word}${count !== 1 ? "s" : ""}`;
  if (interval.includes("day")) return plural("Day", n);
  if (interval.includes("week")) return plural("Week", n);
  if (interval.includes("quarter")) return plural("Month", n * 3);
  if (interval.includes("year") || interval.includes("annual"))
    return plural("Year", n);
  return plural("Month", n);
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

//  Compute maturity date from startDate + duration when stored value is absent
const computeMaturityDate = (loan) => {
  if (loan.maturityDate) return loan.maturityDate;
  const { startDate, duration, durationInterval } = loan;
  if (!startDate || !duration || !durationInterval) return null;
  const d = new Date(startDate);
  const n = Number(duration);
  const interval = String(durationInterval).toLowerCase();
  if (interval.includes("day")) d.setDate(d.getDate() + n);
  else if (interval.includes("week")) d.setDate(d.getDate() + n * 7);
  else if (interval.includes("month")) d.setMonth(d.getMonth() + n);
  else if (interval.includes("year")) d.setFullYear(d.getFullYear() + n);
  else return null;
  return d.toISOString().slice(0, 10);
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

const STACKED_CELL_SX = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
};

const INLINE_META_ROW_SX = {
  display: "inline-flex",
  alignItems: "center",
};

const KPI_MONEY_SX = {
  fontSize: "1.15rem",
  fontWeight: 700,
  lineHeight: 1.3,
};

const KPI_MONEY_PREFIX_SX = {
  fontSize: "0.62em",
};

const getMoneyTextSx = (color, fontWeight = 600) => ({
  fontSize: "0.82rem",
  fontWeight,
  color,
  lineHeight: 1.2,
});

// (Grid column template removed – using MUI DataGrid columns instead)

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

function CurrencyText({
  value,
  currency,
  currencyCode,
  numberSx = {},
  prefixSx = {},
}) {
  const parts = getCurrencyParts(value, currency, currencyCode);

  if (parts.number === "N/A") {
    return (
      <Typography
        component="span"
        sx={{
          ...numberSx,
        }}
      >
        N/A
      </Typography>
    );
  }

  return (
    <Typography
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: 0.35,
        ...numberSx,
      }}
    >
      {parts.prefix ? (
        <Typography
          component="span"
          sx={{
            fontSize: "0.72em",
            fontWeight: 600,
            color: "inherit",
            lineHeight: 1,
            ...prefixSx,
          }}
        >
          {parts.prefix}
        </Typography>
      ) : null}
      <Typography
        component="span"
        sx={{
          fontSize: "1em",
          fontWeight: "inherit",
          color: "inherit",
          lineHeight: "inherit",
        }}
      >
        {parts.number}
      </Typography>
    </Typography>
  );
}

// --- Helpers ---
const truncateWithEllipsis = (text, limit = 30) => {
  if (!text) return text;
  return text.length > limit ? `${text.slice(0, limit)}...` : text;
};

const parseLoanRecord = (loan) => {
  const record = loan?.draftRecord ?? loan?.loanComputationRecord;
  if (!record) return {};

  try {
    const parsed =
      typeof record === "string" && record.trim() ? JSON.parse(record) : record;
    if (!parsed || typeof parsed !== "object") return {};

    const nested = parsed.draftRecord;
    if (nested) {
      if (typeof nested === "string" && nested.trim()) {
        try {
          const nestedParsed = JSON.parse(nested);
          return nestedParsed && typeof nestedParsed === "object"
            ? nestedParsed
            : {};
        } catch {
          return {};
        }
      }

      if (typeof nested === "object") return nested;
    }

    return parsed;
  } catch (err) {
    console.error("Failed to parse loan record:", err);
    return {};
  }
};

//
//  Main LoansDisplay Component
//
export default function LoansDisplay() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [selectedBranchId, setSelectedBranchId] = React.useState("");
  const [paymentPopupOpen, setPaymentPopupOpen] = React.useState(false);
  const [paymentLoanId, setPaymentLoanId] = React.useState(null);
  const [statementPopupOpen, setStatementPopupOpen] = React.useState(false);
  const [statementLoanId, setStatementLoanId] = React.useState(null);
  const gridDragContainerRef = React.useRef(null);
  const topScrollRef = React.useRef(null);
  const topScrollInnerRef = React.useRef(null);
  const { userDetails } = React.useContext(UserContext);
  const {
    branches,
    loadBranches,
    loanDisplayRows: loans,
    loanDisplayLoading: loading,
    loanDisplayLoadingMore: loadingMore,
    loanDisplayHasMore: hasMoreLoans,
    workingOverlayOpen,
    workingOverlayMessage,
    loadLoanDisplayPage,
    refreshLoanDisplayPage,
    getLoanRecord,
    applyLoanPaymentMutation,
  } = React.useContext(LoanExplorerContext);
  const { showSnackbar } = useSnackbar();
  const { showNotification } = useNotification();
  const theme = useTheme();
  const sf = theme.palette.sf;
  const location = useLocation();
  const navigate = useNavigate();
  const currencyCode =
    userDetails?.institution?.currencyCode || userDetails?.currencyCode;
  const currency = currencyCode || "$";
  const normalizedUserType = (userDetails?.userType || "").toLowerCase();
  const isAdminUser = normalizedUserType === "admin";
  const shouldShowLoansView = !isAdminUser || Boolean(selectedBranchId);
  const paymentLoanRow = paymentLoanId ? getLoanRecord(paymentLoanId) : null;
  const statementLoanRow = statementLoanId
    ? getLoanRecord(statementLoanId)
    : null;
  const MoneyText = React.useCallback(
    ({ value, numberSx = {}, prefixSx = {} }) => (
      <CurrencyText
        value={value}
        currency={currency}
        currencyCode={currencyCode}
        numberSx={numberSx}
        prefixSx={prefixSx}
      />
    ),
    [currency, currencyCode],
  );

  const renderTwoLineHeader = React.useCallback(
    (line1, line2) => () => (
      <Typography
        component="span"
        sx={{
          fontSize: "0.74rem",
          fontWeight: 600,
          lineHeight: 1.05,
          textAlign: "center",
          width: "100%",
        }}
      >
        {line1}
        <br />
        {line2}
      </Typography>
    ),
    [],
  );

  React.useEffect(() => {
    const routeNotification = location.state?.notification;
    if (!routeNotification?.message) return;

    showNotification(
      routeNotification.message,
      routeNotification.color || "blue",
    );

    const nextState = { ...(location.state || {}) };
    delete nextState.notification;

    navigate(location.pathname, {
      replace: true,
      state: Object.keys(nextState).length > 0 ? nextState : null,
    });
  }, [location.pathname, location.state, navigate, showNotification]);

  React.useEffect(() => {
    if (!isAdminUser) {
      return;
    }

    const routeBranchId =
      location.state?.selectedBranchId || location.state?.branchId || "";

    if (!routeBranchId) {
      return;
    }

    if (routeBranchId !== selectedBranchId) {
      setSelectedBranchId(routeBranchId);
    }

    const nextState = { ...(location.state || {}) };
    delete nextState.selectedBranchId;
    delete nextState.branchId;

    navigate(location.pathname, {
      replace: true,
      state: Object.keys(nextState).length > 0 ? nextState : null,
    });
  }, [
    isAdminUser,
    location.pathname,
    location.state,
    navigate,
    selectedBranchId,
  ]);

  React.useEffect(() => {
    const el = gridDragContainerRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const getScroller = () =>
      el.querySelector(".MuiDataGrid-virtualScroller") || el;

    const onMouseDown = (e) => {
      if (e.target.closest("button, a, input, [role='button'], .MuiChip-root"))
        return;
      const scroller = getScroller();
      isDown = true;
      el.style.cursor = "grabbing";
      startX = e.pageX - scroller.offsetLeft;
      scrollLeft = scroller.scrollLeft;
    };

    const onMouseLeave = () => {
      isDown = false;
      el.style.cursor = "";
    };

    const onMouseUp = () => {
      isDown = false;
      el.style.cursor = "";
    };

    const onMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const scroller = getScroller();
      const x = e.pageX - scroller.offsetLeft;
      scroller.scrollLeft = scrollLeft - (x - startX);
    };

    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mouseleave", onMouseLeave);
    el.addEventListener("mouseup", onMouseUp);
    el.addEventListener("mousemove", onMouseMove);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  // Sync top scrollbar width and scroll position with DataGrid's virtual scroller
  React.useEffect(() => {
    if (loading) return;
    const frame = requestAnimationFrame(() => {
      const gridEl = gridDragContainerRef.current;
      const topEl = topScrollRef.current;
      const innerEl = topScrollInnerRef.current;
      if (!gridEl || !topEl || !innerEl) return;
      const scroller = gridEl.querySelector(".MuiDataGrid-virtualScroller");
      if (!scroller) return;

      innerEl.style.width = scroller.scrollWidth + "px";

      const onTopScroll = () => {
        scroller.scrollLeft = topEl.scrollLeft;
      };
      const onGridScroll = () => {
        topEl.scrollLeft = scroller.scrollLeft;
      };

      topEl.addEventListener("scroll", onTopScroll);
      scroller.addEventListener("scroll", onGridScroll);

      return () => {
        topEl.removeEventListener("scroll", onTopScroll);
        scroller.removeEventListener("scroll", onGridScroll);
      };
    });
    return () => cancelAnimationFrame(frame);
  }, [loading, loans]);

  const scrollTopBarBy = React.useCallback((delta) => {
    const topEl = topScrollRef.current;
    if (!topEl) return;
    topEl.scrollBy({ left: delta, behavior: "smooth" });
  }, []);

  const openStatementPopup = React.useCallback((loan) => {
    if (!loan?.id) return;
    setStatementLoanId(loan.id);
    setStatementPopupOpen(true);
  }, []);

  //  DataGrid column definitions
  const columns = React.useMemo(
    () => [
      {
        field: "borrower",
        headerName: "Loan",
        disableColumnMenu: false,
        flex: 1.4,
        minWidth: 240,
        valueGetter: (value, row) => buildLoanDisplayName(row, currency),
        renderCell: (params) => {
          const loan = params.row;
          const loanName = buildLoanDisplayName(loan, currency);
          const statusColors = getStatusColor(loan.status, sf);
          const borrower = loan.borrower || {};
          const officer = loan.createdByEmployee || {};
          const loanId = loan.loanNumber || loan.id || "\u2014";
          const loanIdDisplay =
            typeof loanId === "string" && loanId.length > 3
              ? loanId.slice(3)
              : loanId;
          const borrowerName =
            [borrower.firstname, borrower.othername, borrower.businessName]
              .filter(Boolean)
              .join(" ")
              .trim() || "N/A";
          const officerName =
            [officer.firstName, officer.lastName].filter(Boolean).join(" ") ||
            officer.email ||
            "N/A";
          const maturityDate = computeMaturityDate(loan);
          const daysLeft = daysUntil(maturityDate);
          const daysLeftText =
            daysLeft == null
              ? "N/A"
              : daysLeft < 0
                ? `${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? "s" : ""} overdue`
                : `${daysLeft} day${daysLeft !== 1 ? "s" : ""}`;
          const daysLeftIsOverdue = daysLeft != null && daysLeft < 0;
          const durationDisplay = formatDurationFull(
            loan.duration,
            loan.durationInterval,
          );
          const rateDisplay =
            loan.interestRate != null
              ? `${loan.interestRate}% / ${formatRateInterval(loan.rateInterval)}`
              : "N/A";
          const computationRecord = parseLoanRecord(loan);
          const interestMethod =
            computationRecord?.interestMethod ||
            computationRecord?.interestCalculationMethod ||
            loan.loanProduct?.interestCalculationMethod ||
            loan.loanType ||
            "N/A";
          const balance = getBalance(loan);
          const totalPaid = getTotalPaid(loan);
          const principalBal = getPrincipalBalance(loan);
          return (
            <Box
              sx={{
                ...STACKED_CELL_SX,
                whiteSpace: "normal",
                wordBreak: "break-word",
                py: 0.5,
              }}
            >
              <LoanInfoPopup
                loanName={loanName}
                loanIdDisplay={loanIdDisplay}
                borrowerName={borrowerName}
                principal={loan.principal}
                status={loan.status || "N/A"}
                startDateDisplay={fmtDate(loan.startDate)}
                maturityDateDisplay={fmtDate(maturityDate)}
                durationDisplay={durationDisplay}
                rateDisplay={rateDisplay}
                interestMethod={interestMethod}
                daysLeftText={daysLeftText}
                daysLeftIsOverdue={daysLeftIsOverdue}
                totalPaid={totalPaid}
                amountDue={balance}
                loanBalance={principalBal}
                productName={loan.loanProduct?.name || "N/A"}
                officerName={officerName}
                statusColors={statusColors}
                MoneyText={MoneyText}
                getMoneyTextSx={getMoneyTextSx}
                onNavigate={() =>
                  loan.id &&
                  navigate(`/loans/id/${loan.id}/view`, {
                    state: {
                      from: "/loans",
                      selectedBranchId:
                        selectedBranchId ||
                        loan.branchID ||
                        loan.branch?.id ||
                        "",
                    },
                  })
                }
                onBorrowerClick={() =>
                  loan.borrower?.id &&
                  navigate(`/borrowers/id/${loan.borrower.id}/view`)
                }
                onStatementClick={() => openStatementPopup(loan)}
                onLoanOfficerClick={() =>
                  loan.createdByEmployee?.id &&
                  navigate(`/employees/id/${loan.createdByEmployee.id}/view`)
                }
                onPaymentsClick={() => {
                  if (loan.id) {
                    setPaymentLoanId(loan.id);
                    setPaymentPopupOpen(true);
                  }
                }}
              />
            </Box>
          );
        },
      },
      {
        field: "principal",
        headerName: "Principal",
        disableColumnMenu: true,
        headerAlign: "center",
        flex: 1,
        minWidth: 140,
        type: "number",
        valueGetter: (value, row) => row.principal || 0,
        renderCell: (params) => {
          const loan = params.row;
          const loanId = loan.loanNumber || loan.id || "\u2014";
          const loanIdDisplay =
            typeof loanId === "string" && loanId.length > 3
              ? loanId.slice(3)
              : loanId;
          return (
            <Box sx={STACKED_CELL_SX}>
              <MoneyText
                value={params.value}
                numberSx={getMoneyTextSx(sf.sf_textPrimary)}
              />
              <Box sx={INLINE_META_ROW_SX}>
                <Typography
                  sx={{
                    fontSize: "0.6rem",
                    mt: 0.4,
                    color: sf.sf_textTertiary,
                  }}
                >
                  LOAN ID: {loanIdDisplay}
                </Typography>
              </Box>
            </Box>
          );
        },
      },
      {
        field: "startDate",
        headerName: "Date Taken",
        disableColumnMenu: true,
        headerAlign: "center",
        renderHeader: renderTwoLineHeader("Date", "Taken"),
        flex: 0.65,
        minWidth: 95,
        valueGetter: (value, row) =>
          row.startDate ? new Date(row.startDate).getTime() : 0,
        renderCell: (params) => {
          const loan = params.row;
          return (
            <Box sx={STACKED_CELL_SX}>
              <Typography
                sx={{
                  fontSize: "0.82rem",
                  color: sf.sf_textPrimary,
                  fontWeight: 600,
                  lineHeight: 1.2,
                }}
              >
                {fmtDate(loan.startDate)}
              </Typography>
              <Box sx={INLINE_META_ROW_SX}>
                <Typography
                  sx={{
                    fontSize: "0.6rem",
                    mt: 0.4,
                    color: sf.sf_textTertiary,
                  }}
                >
                  DURATION:
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.6rem",
                    mt: 0.4,
                    ml: 0.4,
                    color: sf.sf_textTertiary,
                  }}
                >
                  {formatDurationCompact(loan.duration, loan.durationInterval)}
                </Typography>
              </Box>
            </Box>
          );
        },
      },
      {
        field: "maturityDate",
        headerName: "Maturity Date",
        disableColumnMenu: true,
        headerAlign: "center",
        renderHeader: renderTwoLineHeader("Maturity", "Date"),
        flex: 0.75,
        minWidth: 110,
        valueGetter: (value, row) => {
          const md = computeMaturityDate(row);
          return md ? new Date(md).getTime() : 0;
        },
        renderCell: (params) => {
          const loan = params.row;
          const maturityDate = computeMaturityDate(loan);
          const daysLeft = daysUntil(maturityDate);
          return (
            <Box sx={STACKED_CELL_SX}>
              <Typography
                sx={{
                  fontSize: "0.82rem",
                  color: sf.sf_textPrimary,
                  fontWeight: 600,
                  lineHeight: 1.2,
                }}
              >
                {fmtDate(maturityDate)}
              </Typography>
              <Box sx={INLINE_META_ROW_SX}>
                <Typography
                  sx={{
                    fontSize: "0.6rem",
                    mt: 0.4,
                    color: sf.sf_textTertiary,
                  }}
                >
                  DAYS LEFT:
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.6rem",
                    mt: 0.4,

                    ml: 0.4,
                    color: sf.sf_textTertiary,
                  }}
                >
                  {daysLeft ?? "N/A"}
                </Typography>
              </Box>
            </Box>
          );
        },
      },
      {
        field: "interestRate",
        headerName: "Interest",
        disableColumnMenu: true,
        headerAlign: "center",
        flex: 0.75,
        minWidth: 110,
        type: "number",
        valueGetter: (value, row) => row.interestRate ?? 0,
        renderCell: (params) => {
          const loan = params.row;
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
          return (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.82rem",
                  color: sf.sf_textPrimary,
                  fontWeight: 600,
                  lineHeight: 1.2,
                }}
              >
                {rateDisplay}
              </Typography>
              <Tooltip
                title={`Method: ${interestMethod}`}
                placement="top"
                arrow
              >
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.3,
                    mt: 0.3,
                    cursor: "help",
                    color: sf.sf_textTertiary,
                    "&:hover": { color: sf.sf_brandPrimary },
                  }}
                >
                  <InfoOutlinedIcon sx={{ fontSize: 14 }} />
                  <Typography
                    sx={{
                      color: sf.sf_textTertiary,
                      fontSize: "0.62rem",
                      fontWeight: 500,
                    }}
                  >
                    Method
                  </Typography>
                </Box>
              </Tooltip>
            </Box>
          );
        },
      },
      {
        field: "amountDue",
        headerName: "Amount Due",
        disableColumnMenu: true,
        headerAlign: "center",
        renderHeader: renderTwoLineHeader("Amount", "Due"),
        flex: 0.65,
        minWidth: 100,
        type: "number",
        valueGetter: (value, row) => getBalance(row),
        renderCell: (params) => {
          const status = params.row.status || "N/A";
          const statusColors = getStatusColor(status, sf);
          const balance = params.value;
          return (
            <Box sx={STACKED_CELL_SX}>
              <MoneyText
                value={balance}
                numberSx={getMoneyTextSx(
                  balance > 0 ? sf.sf_textPrimary : sf.sf_success,
                )}
              />
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
          );
        },
      },
      {
        field: "totalPaid",
        headerName: "Total Paid",
        disableColumnMenu: true,
        headerAlign: "center",
        renderHeader: renderTwoLineHeader("Total", "Paid"),
        flex: 0.85,
        minWidth: 120,
        type: "number",
        valueGetter: (value, row) => getTotalPaid(row),
        renderCell: (params) => (
          <Box sx={STACKED_CELL_SX}>
            <MoneyText
              value={params.value}
              numberSx={getMoneyTextSx(sf.sf_success, 500)}
            />
            <SFClickableText
              onClick={(e) => {
                e.stopPropagation();
                if (!params.row?.id) {
                  showSnackbar("Loan details unavailable.", "red");
                  return;
                }
                setPaymentLoanId(params.row.id);
                setPaymentPopupOpen(true);
              }}
            >
              Manage Payments
            </SFClickableText>
          </Box>
        ),
      },
      {
        field: "loanBalance",
        headerName: "Loan Balance",
        disableColumnMenu: true,
        headerAlign: "center",
        renderHeader: renderTwoLineHeader("Loan", "Balance"),
        flex: 0.85,
        minWidth: 120,
        type: "number",
        valueGetter: (value, row) => getPrincipalBalance(row),
        renderCell: (params) => {
          const principalBal = params.value;
          return (
            <Box sx={STACKED_CELL_SX}>
              <MoneyText
                value={principalBal}
                numberSx={getMoneyTextSx(
                  principalBal > 0 ? sf.sf_error : sf.sf_success,
                )}
              />
              <SFClickableText
                onClick={(e) => {
                  e.stopPropagation();
                  openStatementPopup(params.row);
                }}
              >
                View Statement
              </SFClickableText>
            </Box>
          );
        },
      },
      {
        field: "loanOfficer",
        headerName: "Loan Officer",
        disableColumnMenu: true,
        headerAlign: "center",
        renderHeader: renderTwoLineHeader("Loan", "Officer"),
        flex: 0.9,
        minWidth: 130,
        sortable: false,
        valueGetter: (value, row) => {
          const emp = row.createdByEmployee;
          return emp
            ? [emp.firstName, emp.lastName].filter(Boolean).join(" ") ||
                emp.email
            : "N/A";
        },
        renderCell: (params) => {
          const officerName = truncateWithEllipsis(params.value, 17);
          return (
            <Box sx={STACKED_CELL_SX}>
              <Typography
                sx={{
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: sf.sf_textPrimary,
                  lineHeight: 1.2,
                }}
              >
                {officerName}
              </Typography>
              <SFClickableText>Loan Comments</SFClickableText>
            </Box>
          );
        },
      },
    ],
    [
      sf,
      renderTwoLineHeader,
      navigate,
      MoneyText,
      currency,
      openStatementPopup,
      showSnackbar,
    ],
  );

  //  Filtered + sorted loans
  const filteredLoans = React.useMemo(() => {
    let result = loans;

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
          loan.createdByEmployee?.email,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return searchable.includes(q);
      });
    }

    return result;
  }, [loans, searchTerm, statusFilter]);

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

  React.useEffect(() => {
    if (!userDetails) return;

    if (isAdminUser) {
      if (selectedBranchId) {
        loadLoanDisplayPage({
          reset: true,
          branchIdOverride: selectedBranchId,
        });
      }
      return;
    }

    loadLoanDisplayPage({ reset: true });
  }, [isAdminUser, loadLoanDisplayPage, selectedBranchId, userDetails]);

  React.useEffect(() => {
    if (!userDetails || !isAdminUser) {
      return;
    }

    loadBranches();
  }, [isAdminUser, loadBranches, userDetails]);

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
              : `${loans.length} loaded \u00B7 ${filteredLoans.length} shown${hasMoreLoans ? " \u00B7 more available" : ""}`}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PlusButtonMain
            onClick={() => navigate("/add-loan")}
            buttonText="NEW LOAN"
          />
          <Tooltip title="Refresh data" placement="top">
            <IconButton
              onClick={() => {
                refreshLoanDisplayPage({
                  branchIdOverride: isAdminUser ? selectedBranchId : undefined,
                });
              }}
              disabled={loading || loadingMore}
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
      </Box>

      {/* Branch Filter (Admin only) */}
      {isAdminUser && (
        <AdminBranchScopeSelector
          branches={branches}
          selectedBranchId={selectedBranchId}
          onBranchChange={setSelectedBranchId}
          helperText="Choose a branch before viewing loans."
          emptyMessage="Please select a branch above to view loans."
        />
      )}

      {shouldShowLoansView && (
        <>
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
                value={
                  <MoneyText
                    value={kpis.totalPrincipal}
                    numberSx={{ ...KPI_MONEY_SX, color: sf.sf_textPrimary }}
                    prefixSx={KPI_MONEY_PREFIX_SX}
                  />
                }
                sf={sf}
              />
              <KpiCard
                icon={TrendingUpIcon}
                label="Outstanding"
                value={
                  <MoneyText
                    value={kpis.totalOutstanding}
                    numberSx={{ ...KPI_MONEY_SX, color: sf.sf_textPrimary }}
                    prefixSx={KPI_MONEY_PREFIX_SX}
                  />
                }
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
                      bgcolor: isActive
                        ? sf.sf_tabActiveBg
                        : sf.sf_tabInactiveBg,
                      color: isActive
                        ? sf.sf_tabActiveText
                        : sf.sf_tabInactiveText,
                      borderRadius: 0,
                      transition: "all 0.12s",
                      "&:hover": {
                        bgcolor: isActive
                          ? sf.sf_tabActiveBg
                          : sf.sf_tabHoverBg,
                      },
                      "& .MuiChip-label": { px: 1.2 },
                    }}
                  />
                );
              })}
            </Box>
          </Box>

          <Box
            sx={{
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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5,
                px: 0.5,
                py: 0,
                minHeight: 24,
                bgcolor: sf.sf_tableHeaderBg,
                borderBottom: `1px solid ${sf.sf_borderLight}`,
              }}
            >
              <Button
                onClick={() => scrollTopBarBy(-220)}
                variant="outlined"
                sx={{
                  minWidth: 22,
                  width: 22,
                  height: 18,
                  p: 0,
                  bgcolor: sf.sf_actionHoverBg,
                  borderRadius: 0,
                  "&:hover": { bgcolor: sf.sf_brandPrimary },
                  mt: 0.5,
                }}
              >
                <KeyboardArrowLeftIcon sx={{ fontSize: 16 }} />
              </Button>
              <Box
                ref={topScrollRef}
                sx={{
                  overflowX: "auto",
                  overflowY: "hidden",
                  flex: 1,
                  height: 14,
                  "&::-webkit-scrollbar": { height: 10 },
                  "&::-webkit-scrollbar-track": {
                    bgcolor: sf.sf_borderLight,
                    borderRadius: 0,
                  },
                  "&::-webkit-scrollbar-thumb": {
                    bgcolor: sf.sf_textTertiary,
                    borderRadius: 0,
                    "&:hover": { bgcolor: sf.sf_brandPrimary },
                  },
                }}
              >
                <Box
                  ref={topScrollInnerRef}
                  sx={{ height: 1, minWidth: "100%" }}
                />
              </Box>
              <Button
                onClick={() => scrollTopBarBy(220)}
                variant="outlined"
                sx={{
                  minWidth: 22,
                  width: 22,
                  height: 18,
                  p: 0,
                  bgcolor: sf.sf_actionHoverBg,
                  borderRadius: 0,
                  "&:hover": { bgcolor: sf.sf_brandPrimary },
                  mt: 0.5,
                }}
              >
                <KeyboardArrowRightIcon sx={{ fontSize: 16 }} />
              </Button>
            </Box>
            <Box ref={gridDragContainerRef} sx={{ cursor: "grab" }}>
              <CustomDataGrid
                rows={filteredLoans}
                columns={columns}
                loading={loading}
                getRowId={(row) => row.id}
                pageSize={50}
                pageSizeOptions={[25, 50, 100]}
                getRowHeight={() => "auto"}
                getEstimatedRowHeight={() => 72}
                showToolbar={false}
                sx={{
                  borderRadius: 0,
                  "& .MuiDataGrid-columnHeaderTitle": {
                    fontSize: "0.74rem",
                  },
                  "& .MuiDataGrid-cell": {
                    cursor: "default",
                    pt: 0.5,
                    pb: 0.5,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    textAlign: "center",
                    minHeight: "60px !important",
                  },
                  "& .MuiDataGrid-cell[data-field='borrower']": {
                    justifyContent: "flex-start",
                    textAlign: "left",
                  },
                  "& .MuiDataGrid-cell[data-field='amountDue']": {
                    justifyContent: "flex-start",
                    textAlign: "left",
                  },
                }}
              />
            </Box>
          </Box>

          {(hasMoreLoans || loadingMore) && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() =>
                  loadLoanDisplayPage({
                    branchIdOverride: isAdminUser
                      ? selectedBranchId
                      : undefined,
                  })
                }
                disabled={loading || loadingMore}
                sx={{ borderRadius: 0 }}
              >
                {loadingMore
                  ? "LOADING MORE..."
                  : `LOAD ${LOANS_PAGE_SIZE} MORE LOANS`}
              </Button>
            </Box>
          )}
        </>
      )}

      {paymentPopupOpen && paymentLoanRow && (
        <ManagePaymentsPopup
          open={paymentPopupOpen}
          onClose={() => {
            setPaymentPopupOpen(false);
            setPaymentLoanId(null);
          }}
          loan={paymentLoanRow}
          onPaymentSuccess={(payload) => {
            if (payload?.payment) {
              applyLoanPaymentMutation({
                loanId: payload.loanId || paymentLoanId,
                payment: payload.payment,
              });
            }
          }}
        />
      )}

      <LoanStatementPopup
        open={statementPopupOpen}
        onClose={() => {
          setStatementPopupOpen(false);
          setStatementLoanId(null);
        }}
        loan={statementLoanRow}
      />
    </>
  );
}
