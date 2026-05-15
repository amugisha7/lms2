import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import InputAdornment from "@mui/material/InputAdornment";
import InputBase from "@mui/material/InputBase";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../../App";
import AdminBranchScopeSelector from "../../../ModelAssets/AdminBranchScopeSelector";
import WorkingOverlay from "../../../ModelAssets/WorkingOverlay";
import CustomDataGrid from "../../../ModelAssets/CustomDataGrid";
import SFClickableText from "../../../ModelAssets/SF_ClickableText";
import DateFilters from "../../../ModelAssets/DateFilters";
import PlusButtonMain from "../../../ModelAssets/PlusButtonMain";
import SFTabs from "../../../ModelAssets/SF_Tabs";
import { useNotification } from "../../../ModelAssets/NotificationContext";
import { useSnackbar } from "../../../ModelAssets/SnackbarContext";
import { formatMoneyParts } from "../../../Resources/formatting";
import { Button } from "@mui/material";
import LoanInfoPopup from "./LoanInfoPopup";
import ManagePaymentsPopup from "../../Payments/ManagePaymentsPopup";
import LoanStatementPopup from "../LoanStatements/LoanStatementPopup";
import { buildLoanDisplayName } from "../loanDisplayHelpers";
import {
  LOAN_DISPLAY_STATUS,
  getBalance,
  getPrincipalBalance,
  getTotalPaid,
} from "../loanSummaryProjection";
import { LoanExplorerContext } from "./LoanExplorerContext";
import { downloadFile, toCsv } from "../../../Screens/Reports/reportUtils";

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
  const parsedDate = dayjs(dateStr);
  if (!parsedDate.isValid()) {
    return dateStr;
  }
  return parsedDate.format("DD-MMM-YY");
};

const normalizeMoneyValue = (value) => {
  if (value == null) return 0;
  const numericValue =
    typeof value === "string"
      ? Number(value.replace(/,/g, "").trim())
      : Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
};

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

const DISPLAY_STATUS_BY_CODE = Object.values(LOAN_DISPLAY_STATUS).reduce(
  (accumulator, meta) => {
    accumulator[meta.code] = meta;
    return accumulator;
  },
  {},
);

const normalizeStatusCode = (value) =>
  String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");

const getLoanStatusMeta = (loan) => {
  const computedCode = normalizeStatusCode(loan?.uiStatusCode);
  if (DISPLAY_STATUS_BY_CODE[computedCode]) {
    return DISPLAY_STATUS_BY_CODE[computedCode];
  }

  const rawStatus = normalizeStatusCode(loan?.status);
  if (rawStatus === "WRITTEN_OFF") return LOAN_DISPLAY_STATUS.WRITTEN_OFF;
  if (rawStatus === "VOIDED") return LOAN_DISPLAY_STATUS.VOIDED;
  if (["CLOSED", "CLEARED", "PAID"].includes(rawStatus)) {
    return LOAN_DISPLAY_STATUS.CLOSED;
  }
  if (["PAYMENT_DUE", "PAST_DUE"].includes(rawStatus)) {
    return LOAN_DISPLAY_STATUS.MISSED_PAYMENT;
  }
  if (rawStatus === "OVERDUE") {
    return LOAN_DISPLAY_STATUS.OVERDUE;
  }
  if (["ACTIVE", "CURRENT"].includes(rawStatus)) {
    return LOAN_DISPLAY_STATUS.CURRENT;
  }

  return {
    code: rawStatus || "UNKNOWN",
    label: loan?.uiStatusLabel || loan?.status || "N/A",
    filterKey: "all",
    rank: 999,
  };
};

//  Status pill color mapping
const getStatusColor = (statusMeta, sf) => {
  const statusKey = statusMeta?.filterKey;
  if (statusKey === "current")
    return {
      bg: sf.sf_pillSuccessBg,
      text: sf.sf_pillSuccessText,
      accent: sf.sf_success,
    };
  if (statusKey === "missed_payment")
    return {
      bg: sf.sf_pillWarningBg,
      text: sf.sf_pillWarningText,
      accent: sf.sf_warning,
    };
  if (statusKey === "overdue")
    return {
      bg: sf.sf_pillErrorBg,
      text: sf.sf_pillErrorText,
      accent: sf.sf_error,
    };
  if (statusKey === "closed")
    return {
      bg: sf.sf_pillInfoBg,
      text: sf.sf_pillInfoText,
      accent: sf.sf_info,
    };
  if (statusKey === "written_off")
    return {
      bg: sf.sf_pillWarningBg,
      text: sf.sf_pillWarningText,
      accent: sf.sf_warning,
    };
  if (statusKey === "voided")
    return {
      bg: sf.sf_pillNeutralBg,
      text: sf.sf_pillNeutralText,
      accent: sf.sf_textTertiary,
    };
  return {
    bg: sf.sf_pillNeutralBg,
    text: sf.sf_pillNeutralText,
    accent: sf.sf_textLink,
  };
};

//  Days until a date (negative = past due)
const daysUntil = (dateStr) => {
  if (!dateStr) return null;
  const target = dayjs(dateStr).startOf("day");
  if (!target.isValid()) return null;
  return target.diff(dayjs().startOf("day"), "day");
};

//  Compute maturity date from startDate + duration when stored value is absent
const computeMaturityDate = (loan) => {
  if (loan.maturityDate) return loan.maturityDate;
  const { startDate, duration, durationInterval } = loan;
  if (!startDate || !duration || !durationInterval) return null;
  const n = Number(duration);
  const interval = String(durationInterval).toLowerCase();
  const start = dayjs(startDate).startOf("day");
  if (!start.isValid()) return null;

  if (interval.includes("day")) return start.add(n, "day").format("YYYY-MM-DD");
  if (interval.includes("week"))
    return start.add(n, "week").format("YYYY-MM-DD");
  if (interval.includes("month"))
    return start.add(n, "month").format("YYYY-MM-DD");
  if (interval.includes("year"))
    return start.add(n, "year").format("YYYY-MM-DD");
  return null;
};

//  Status filter tabs config
const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "current", label: "Current" },
  { key: "missed_payment", label: "Missed Payment" },
  { key: "overdue", label: "Overdue" },
  { key: "closed", label: "Closed" },
  { key: "written_off", label: "Written Off" },
  { key: "voided", label: "Voided" },
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

const formatCsvMoney = (value) => normalizeMoneyValue(value).toFixed(2);

// (Grid column template removed – using MUI DataGrid columns instead)

function KpiTextItem({ label, value, subValue, sf }) {
  const hasPrimitiveValue =
    typeof value === "string" || typeof value === "number";

  return (
    <Box
      sx={{
        flex: "1 1 170px",
        minWidth: 170,
      }}
    >
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
      {hasPrimitiveValue ? (
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
      ) : (
        <Box sx={{ mt: 0.15, lineHeight: 1.3 }}>{value}</Box>
      )}
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

const getLoanOfficerMeta = (loan) => {
  const officer = loan?.createdByEmployee;
  const label =
    [officer?.firstName, officer?.lastName].filter(Boolean).join(" ").trim() ||
    officer?.email ||
    "";
  const key =
    officer?.id ||
    loan?.createdByEmployeeID ||
    officer?.email ||
    (label ? `name:${label.toLowerCase()}` : "");

  if (!label || !key) {
    return null;
  }

  return { key, label };
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
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");
  const [showDateFilters, setShowDateFilters] = React.useState(false);
  const [showLoanOfficerFilters, setShowLoanOfficerFilters] =
    React.useState(false);
  const [selectedLoanOfficerKey, setSelectedLoanOfficerKey] =
    React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [selectedBranchId, setSelectedBranchId] = React.useState("");
  const [paymentPopupOpen, setPaymentPopupOpen] = React.useState(false);
  const [paymentLoanId, setPaymentLoanId] = React.useState(null);
  const [statementPopupOpen, setStatementPopupOpen] = React.useState(false);
  const [statementLoanId, setStatementLoanId] = React.useState(null);
  const gridDragContainerRef = React.useRef(null);
  const topScrollRef = React.useRef(null);
  const topScrollInnerRef = React.useRef(null);
  const loadLoanDisplayPageRef = React.useRef(null);
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
  const hasMultipleAdminBranches = isAdminUser && branches.length > 1;
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
    loadLoanDisplayPageRef.current = loadLoanDisplayPage;
  }, [loadLoanDisplayPage]);

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

  const buildLoanDetailState = React.useCallback(
    (loan, initialTab = 0) => ({
      from: "/loans",
      initialTab,
      selectedBranchId:
        selectedBranchId || loan?.branchID || loan?.branch?.id || "",
    }),
    [selectedBranchId],
  );

  const openLoanDetail = React.useCallback(
    (loan, initialTab = 0) => {
      if (!loan?.id) {
        return;
      }

      navigate(`/loans/id/${loan.id}/view`, {
        state: buildLoanDetailState(loan, initialTab),
      });
    },
    [buildLoanDetailState, navigate],
  );

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
          const statusMeta = getLoanStatusMeta(loan);
          const statusColors = getStatusColor(statusMeta, sf);
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
                status={statusMeta.label}
                startDateDisplay={fmtDate(loan.startDate)}
                maturityDateDisplay={fmtDate(maturityDate)}
                durationDisplay={durationDisplay}
                rateDisplay={rateDisplay}
                interestMethod={interestMethod}
                daysLeftText={daysLeftText}
                daysLeftIsOverdue={daysLeftIsOverdue}
                totalPaid={totalPaid}
                amountDue={balance}
                loanBalance={balance}
                productName={loan.loanProduct?.name || "N/A"}
                officerName={officerName}
                statusColors={statusColors}
                MoneyText={MoneyText}
                getMoneyTextSx={getMoneyTextSx}
                onNavigate={() => openLoanDetail(loan)}
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
                onCommentsClick={() => openLoanDetail(loan, 2)}
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
          row.startDate ? dayjs(row.startDate).valueOf() : 0,
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
          return md ? dayjs(md).valueOf() : 0;
        },
        renderCell: (params) => {
          const loan = params.row;
          const maturityDate = computeMaturityDate(loan);
          const daysLeft = daysUntil(maturityDate);
          const daysLeftIsOverdue = daysLeft != null && daysLeft < 0;
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
                    color: daysLeftIsOverdue ? sf.sf_error : sf.sf_textTertiary,
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
          const statusMeta = getLoanStatusMeta(params.row);
          const statusColors = getStatusColor(statusMeta, sf);
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
                label={statusMeta.label}
                size="small"
                sx={{
                  alignSelf: "flex-start",
                  mt: 0.3,
                  height: 18,
                  fontSize: "0.56rem",
                  fontWeight: 700,
                  bgcolor: statusColors.bg,
                  color: statusColors.text,
                  borderRadius: 0,
                  "& .MuiChip-label": {
                    px: 0.7,
                    py: 0.2,
                    whiteSpace: "pre-line",
                    textAlign: "center",
                    lineHeight: 1.1,
                  },
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
        valueGetter: (value, row) => getBalance(row),
        renderCell: (params) => {
          const loanBalance = params.value;
          return (
            <Box sx={STACKED_CELL_SX}>
              <MoneyText
                value={loanBalance}
                numberSx={getMoneyTextSx(sf.sf_textPrimary)}
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
              <SFClickableText
                onClick={(event) => {
                  event.stopPropagation();
                  openLoanDetail(params.row, 2);
                }}
              >
                Loan Comments
              </SFClickableText>
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
      openLoanDetail,
      openStatementPopup,
      showSnackbar,
    ],
  );

  const loanMatchesSearch = React.useCallback((loan, query) => {
    if (!query) return true;
    const b = loan.borrower || {};
    const searchable = [
      b.firstname,
      b.othername,
      b.businessName,
      loan.loanNumber,
      loan.id,
      loan.status,
      loan.uiStatusLabel,
      loan.loanProduct?.name,
      loan.createdByEmployee?.firstName,
      loan.createdByEmployee?.lastName,
      loan.createdByEmployee?.email,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return searchable.includes(query);
  }, []);

  const loanInDateRange = React.useCallback((loan, from, to) => {
    if (!from && !to) return true;
    if (!loan?.startDate) return false;

    const loanDate = dayjs(loan.startDate).startOf("day");
    if (!loanDate.isValid()) return false;

    if (from) {
      const fromDate = dayjs(from).startOf("day");
      if (fromDate.isValid()) {
        if (loanDate.isBefore(fromDate, "day")) return false;
      }
    }

    if (to) {
      const toDate = dayjs(to).startOf("day");
      if (toDate.isValid()) {
        if (loanDate.isAfter(toDate, "day")) return false;
      }
    }

    return true;
  }, []);

  //  Base filtered set (search + date range)
  const baseFilteredLoans = React.useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return loans.filter(
      (loan) =>
        loanInDateRange(loan, dateFrom, dateTo) && loanMatchesSearch(loan, q),
    );
  }, [dateFrom, dateTo, loanInDateRange, loanMatchesSearch, loans, searchTerm]);

  const { tabs: loanOfficerFilterTabs, counts: loanOfficerTabCounts } =
    React.useMemo(() => {
      const counts = {};
      const labelsByKey = {};

      baseFilteredLoans.forEach((loan) => {
        const officerMeta = getLoanOfficerMeta(loan);
        if (!officerMeta) {
          return;
        }

        labelsByKey[officerMeta.key] = officerMeta.label;
        counts[officerMeta.key] = (counts[officerMeta.key] || 0) + 1;
      });

      const tabs = Object.entries(labelsByKey)
        .map(([key, label]) => ({ key, label }))
        .sort((left, right) => left.label.localeCompare(right.label));

      return { tabs, counts };
    }, [baseFilteredLoans]);

  const clearLoanOfficerFilter = React.useCallback(() => {
    setSelectedLoanOfficerKey("");
    setShowLoanOfficerFilters(false);
  }, []);

  const clearDateFilter = React.useCallback(() => {
    setDateFrom("");
    setDateTo("");
    setShowDateFilters(false);
  }, []);

  const isLoanOfficerFilterActive = Boolean(selectedLoanOfficerKey);
  const isDateFilterActive = Boolean(dateFrom || dateTo);

  //  Final table set (base filters + status tab)
  const filteredLoans = React.useMemo(() => {
    return baseFilteredLoans.filter((loan) => {
      if (selectedLoanOfficerKey) {
        const officerMeta = getLoanOfficerMeta(loan);
        if (!officerMeta || officerMeta.key !== selectedLoanOfficerKey) {
          return false;
        }
      }

      if (statusFilter !== "all") {
        return getLoanStatusMeta(loan).filterKey === statusFilter;
      }

      return true;
    });
  }, [baseFilteredLoans, selectedLoanOfficerKey, statusFilter]);

  // Sync top scrollbar width and scroll position with DataGrid's virtual scroller
  React.useEffect(() => {
    if (loading || !shouldShowLoansView || filteredLoans.length === 0) return;
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
  }, [filteredLoans.length, loading, loans, shouldShowLoansView]);

  const handleExportCsv = React.useCallback(() => {
    if (!filteredLoans.length) {
      showSnackbar("No loan rows available to export.", "red");
      return;
    }

    const exportRows = filteredLoans.map((loan) => {
      const borrower = loan.borrower || {};
      const officer = loan.createdByEmployee || {};
      const maturityDate = computeMaturityDate(loan);
      const statusMeta = getLoanStatusMeta(loan);
      const computationRecord = parseLoanRecord(loan);
      const loanId = loan.loanNumber || loan.id || "N/A";

      return {
        loanName: buildLoanDisplayName(loan, currency),
        borrowerName:
          [borrower.firstname, borrower.othername, borrower.businessName]
            .filter(Boolean)
            .join(" ")
            .trim() || "N/A",
        loanId,
        principal: formatCsvMoney(loan.principal),
        startDate: fmtDate(loan.startDate),
        maturityDate: fmtDate(maturityDate),
        duration: formatDurationFull(loan.duration, loan.durationInterval),
        interestRate:
          loan.interestRate != null
            ? `${loan.interestRate}% / ${formatRateInterval(loan.rateInterval)}`
            : "N/A",
        interestMethod:
          computationRecord?.interestMethod ||
          computationRecord?.interestCalculationMethod ||
          loan.loanProduct?.interestCalculationMethod ||
          loan.loanType ||
          "N/A",
        amountDue: formatCsvMoney(getBalance(loan)),
        status: statusMeta.label,
        totalPaid: formatCsvMoney(getTotalPaid(loan)),
        loanBalance: formatCsvMoney(getBalance(loan)),
        loanOfficer:
          [officer.firstName, officer.lastName].filter(Boolean).join(" ") ||
          officer.email ||
          "N/A",
      };
    });

    const csv = toCsv(exportRows, [
      { key: "loanName", label: "Loan" },
      { key: "borrowerName", label: "Borrower" },
      { key: "loanId", label: "Loan ID" },
      { key: "principal", label: "Principal" },
      { key: "startDate", label: "Date Taken" },
      { key: "maturityDate", label: "Maturity Date" },
      { key: "duration", label: "Duration" },
      { key: "interestRate", label: "Interest" },
      { key: "interestMethod", label: "Interest Method" },
      { key: "amountDue", label: "Amount Due" },
      { key: "status", label: "Status" },
      { key: "totalPaid", label: "Total Paid" },
      { key: "loanBalance", label: "Loan Balance" },
      { key: "loanOfficer", label: "Loan Officer" },
    ]);

    downloadFile(csv, `loans_${dayjs().format("YYYY-MM-DD")}.csv`, "text/csv");
  }, [currency, filteredLoans, showSnackbar]);

  const hasNoLoans =
    !loading && !loadingMore && filteredLoans.length === 0 && !hasMoreLoans;
  const hasNoBranchLoans =
    !loading && !loadingMore && loans.length === 0 && !hasMoreLoans;

  //  KPI computations
  const kpis = React.useMemo(() => {
    const sourceLoans = filteredLoans;
    const totalPrincipal = sourceLoans.reduce(
      (s, l) => s + (l.principal || 0),
      0,
    );
    const totalOutstanding = sourceLoans.reduce((s, l) => s + getBalance(l), 0);
    const totalPayments = sourceLoans.reduce((s, l) => s + getTotalPaid(l), 0);

    return {
      total: sourceLoans.length,
      totalPrincipal,
      totalOutstanding,
      totalPayments,
    };
  }, [filteredLoans]);

  //  Status tab counts
  const tabCounts = React.useMemo(() => {
    const counts = { all: baseFilteredLoans.length };
    STATUS_TABS.forEach((tab) => {
      if (tab.key !== "all") {
        counts[tab.key] = baseFilteredLoans.filter(
          (loan) => getLoanStatusMeta(loan).filterKey === tab.key,
        ).length;
      }
    });
    return counts;
  }, [baseFilteredLoans]);

  React.useEffect(() => {
    if (!userDetails) return;

    if (isAdminUser) {
      if (selectedBranchId) {
        loadLoanDisplayPageRef.current?.({
          reset: true,
          branchIdOverride: selectedBranchId,
        });
      }
      return;
    }

    loadLoanDisplayPageRef.current?.({ reset: true });
  }, [isAdminUser, selectedBranchId, userDetails]);

  React.useEffect(() => {
    if (!userDetails || !isAdminUser) {
      return;
    }

    loadBranches();
  }, [isAdminUser, loadBranches, userDetails]);

  React.useEffect(() => {
    if (!isAdminUser) {
      return;
    }

    if (branches.length === 1) {
      const onlyBranchId = branches[0]?.id || "";
      if (onlyBranchId && selectedBranchId !== onlyBranchId) {
        setSelectedBranchId(onlyBranchId);
      }
      return;
    }

    if (branches.length > 1 && selectedBranchId) {
      const selectedBranchExists = branches.some(
        (branch) => branch?.id === selectedBranchId,
      );
      if (!selectedBranchExists) {
        setSelectedBranchId("");
      }
    }
  }, [branches, isAdminUser, selectedBranchId]);

  React.useEffect(() => {
    if (!selectedLoanOfficerKey) {
      return;
    }

    const selectedOfficerStillAvailable = loanOfficerFilterTabs.some(
      (tab) => tab.key === selectedLoanOfficerKey,
    );

    if (!selectedOfficerStillAvailable) {
      setSelectedLoanOfficerKey("");
    }
  }, [loanOfficerFilterTabs, selectedLoanOfficerKey]);

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
          <PlusButtonMain
            buttonText="EXPORT"
            // startIcon={<DownloadIcon />}
            onClick={handleExportCsv}
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
      {hasMultipleAdminBranches && (
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              mb: "10px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: "100%",
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
                  width: "100%",
                  flex: "1 1 100%",
                  transition: "border-color 0.15s",
                  "&:focus-within": { borderColor: sf.sf_searchFocusBorder },
                }}
              >
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
                  startAdornment={
                    <InputAdornment position="start">
                      <SearchIcon
                        sx={{ fontSize: 18, color: sf.sf_textTertiary }}
                      />
                    </InputAdornment>
                  }
                  endAdornment={
                    searchTerm ? (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Clear search"
                          onClick={() => setSearchTerm("")}
                          edge="end"
                          size="small"
                          sx={{
                            color: sf.sf_textTertiary,
                            mr: -0.5,
                            "&:hover": { color: sf.sf_brandPrimary },
                          }}
                        >
                          <CancelIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </InputAdornment>
                    ) : null
                  }
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                flexWrap: "wrap",
              }}
            >
              {!showDateFilters && (
                <SFClickableText onClick={() => setShowDateFilters(true)}>
                  Filter by Date
                </SFClickableText>
              )}
              {!showLoanOfficerFilters && (
                <SFClickableText
                  onClick={() => setShowLoanOfficerFilters(true)}
                >
                  Filter by Loan Officer
                </SFClickableText>
              )}
            </Box>

            {showDateFilters && (
              <Box
                sx={{
                  mb: 2,
                  p: 1.5,
                  border: `1px solid ${sf.sf_borderLight}`,
                  bgcolor: sf.sf_cardBg,
                  boxShadow: sf.sf_shadowSm,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    flexWrap: "wrap",
                    mb: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: sf.sf_textSecondary,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Date Filter
                  </Typography>
                  <SFClickableText
                    onClick={(event) => {
                      event.stopPropagation();
                      clearDateFilter();
                    }}
                  >
                    {isDateFilterActive
                      ? "Clear Date Filter"
                      : "Hide Date Filter"}
                  </SFClickableText>
                </Box>

                <DateFilters
                  dateFrom={dateFrom}
                  dateTo={dateTo}
                  onDateFromChange={setDateFrom}
                  onDateToChange={setDateTo}
                  alwaysVisible
                  allowClear={false}
                />
              </Box>
            )}

            {showLoanOfficerFilters && (
              <Box
                sx={{
                  mb: 2,
                  p: 1.5,
                  border: `1px solid ${sf.sf_borderLight}`,
                  bgcolor: sf.sf_cardBg,
                  boxShadow: sf.sf_shadowSm,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    flexWrap: "wrap",
                    mb: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: sf.sf_textSecondary,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Loan Officer Filter
                  </Typography>
                  <SFClickableText
                    onClick={(event) => {
                      event.stopPropagation();
                      clearLoanOfficerFilter();
                    }}
                  >
                    {isLoanOfficerFilterActive
                      ? "Clear Loan Officer Filter"
                      : "Hide Loan Officer Filter"}
                  </SFClickableText>
                </Box>

                {loanOfficerFilterTabs.length > 0 ? (
                  <Box
                    role="tablist"
                    aria-label="Loan officer filters"
                    sx={{
                      display: "grid",
                      gap: 1,
                      width: "100%",
                      mt: 1,
                      gridTemplateColumns: {
                        xs: "repeat(2, minmax(0, 1fr))",
                        sm: "repeat(auto-fit, minmax(180px, max-content))",
                      },
                      alignItems: "stretch",
                    }}
                  >
                    {loanOfficerFilterTabs.map((officerTab) => {
                      const isActive =
                        selectedLoanOfficerKey === officerTab.key;
                      const count = loanOfficerTabCounts[officerTab.key] ?? 0;

                      return (
                        <SFClickableText
                          key={officerTab.key}
                          onClick={() =>
                            setSelectedLoanOfficerKey(officerTab.key)
                          }
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: 33,
                            px: 1,
                            mt: 0,
                            gap: 0.5,
                            border: `1px solid ${isActive ? sf.sf_brandPrimary : sf.sf_searchBorder}`,
                            bgcolor: isActive
                              ? sf.sf_brandPrimary
                              : sf.sf_searchBg,
                            color: isActive
                              ? sf.sf_whiteMain || "#fff"
                              : sf.sf_textLink,
                            textDecoration: "none",
                            textAlign: "center",
                            lineHeight: 1.2,
                            borderRadius: 0,
                            transition:
                              "background-color 0.15s, color 0.15s, border-color 0.15s",
                            "&:hover": {
                              color: isActive
                                ? sf.sf_whiteMain || "#fff"
                                : sf.sf_textLinkHover,
                              bgcolor: isActive
                                ? sf.sf_brandPrimary
                                : sf.sf_actionHoverBg,
                              borderColor: sf.sf_brandPrimary,
                            },
                          }}
                        >
                          <Typography
                            component="span"
                            sx={{
                              fontSize: "0.8rem",
                              fontWeight: 500,
                              color: "inherit",
                              lineHeight: 1.2,
                            }}
                          >
                            {officerTab.label}
                          </Typography>
                          <Typography
                            component="span"
                            sx={{
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              color: "inherit",
                              lineHeight: 1,
                              opacity: 0.88,
                            }}
                          >
                            {count}
                          </Typography>
                        </SFClickableText>
                      );
                    })}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      mt: 1,
                      px: 1,
                      py: 1.25,
                      borderBottom: `1px solid ${sf.sf_borderLight}`,
                      bgcolor: sf.sf_cardBg,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.8rem",
                        color: sf.sf_textTertiary,
                      }}
                    >
                      No loan officers found for the current loan results.
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>

          <SFTabs
            tabs={STATUS_TABS}
            activeKey={statusFilter}
            onChange={setStatusFilter}
            counts={tabCounts}
            ariaLabel="Loan status filters"
          />

          {!loading && (
            <Box
              sx={{
                display: "flex",
                gap: "14px",
                mb: "18px",
                flexWrap: "wrap",
              }}
            >
              <KpiTextItem label="Total Loans" value={kpis.total} sf={sf} />
              <KpiTextItem
                label="Pricipal Released"
                value={
                  <MoneyText
                    value={kpis.totalPrincipal}
                    numberSx={{ ...KPI_MONEY_SX, color: sf.sf_textPrimary }}
                    prefixSx={KPI_MONEY_PREFIX_SX}
                  />
                }
                sf={sf}
              />
              <KpiTextItem
                label="Total Payments"
                value={
                  <MoneyText
                    value={kpis.totalPayments}
                    numberSx={{ ...KPI_MONEY_SX, color: sf.sf_textPrimary }}
                    prefixSx={KPI_MONEY_PREFIX_SX}
                  />
                }
                sf={sf}
              />
              <KpiTextItem
                label="Total Due"
                value={
                  <MoneyText
                    value={kpis.totalOutstanding}
                    numberSx={{ ...KPI_MONEY_SX, color: sf.sf_textPrimary }}
                    prefixSx={KPI_MONEY_PREFIX_SX}
                  />
                }
                sf={sf}
              />
            </Box>
          )}

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
            {hasNoLoans ? (
              <Box
                sx={{
                  px: 3,
                  py: hasNoBranchLoans ? 4 : 3,
                  textAlign: "center",
                  border: `1px solid ${sf.sf_borderLight}`,
                  bgcolor: sf.sf_kpiCardBg,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: sf.sf_textPrimary,
                    mb: 0.8,
                  }}
                >
                  No loans found.
                </Typography>
                {hasNoBranchLoans && (
                  <>
                    <Typography
                      sx={{
                        fontSize: "0.82rem",
                        color: sf.sf_textSecondary,
                        mb: 2,
                      }}
                    >
                      Create your first loan to start tracking repayments and
                      portfolio performance.
                    </Typography>
                    <PlusButtonMain
                      onClick={() => navigate("/add-loan")}
                      buttonText="CREATE LOAN"
                    />
                  </>
                )}
              </Box>
            ) : (
              <>
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
              </>
            )}
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
