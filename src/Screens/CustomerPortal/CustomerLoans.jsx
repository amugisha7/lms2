import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
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
import { useNavigate, useParams } from "react-router-dom";
import { CustomerContext } from "../../CustomerApp";
import CustomDataGrid from "../../ModelAssets/CustomDataGrid";
import SFClickableText from "../../ModelAssets/SF_ClickableText";
import { formatMoneyParts } from "../../Resources/formatting";
import { buildLoanDisplayName } from "../../Models/Loans/loanDisplayHelpers";
import {
  LOAN_DISPLAY_STATUS,
  computeMaturityDate,
  daysUntil,
  getBalance,
  getPrincipalBalance,
  getTotalPaid,
} from "../../Models/Loans/loanSummaryProjection";
import CustomerLoanStatementPopup from "./CustomerLoanStatementPopup";
import { fetchCustomerLoans } from "./customerLoanData";

const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "current", label: "Current" },
  { key: "missed_payment", label: "Missed Payment" },
  { key: "overdue", label: "Overdue" },
  { key: "closed", label: "Closed" },
  { key: "written_off", label: "Written Off" },
  { key: "voided", label: "Voided" },
];

const DISPLAY_STATUS_BY_CODE = Object.values(LOAN_DISPLAY_STATUS).reduce(
  (accumulator, meta) => {
    accumulator[meta.code] = meta;
    return accumulator;
  },
  {},
);

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

const normalizeStatusCode = (value) =>
  String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");

const getCurrencyParts = (value, currencyCode) => {
  if (value == null || Number.isNaN(Number(value))) {
    return { prefix: "", number: "N/A" };
  }

  const parts = formatMoneyParts(value, currencyCode || "", currencyCode);
  return {
    prefix: parts.prefix || "",
    number: parts.number || "N/A",
  };
};

const fmtDate = (dateStr) => {
  if (!dateStr) return "N/A";

  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;

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

    return `${String(d.getDate()).padStart(2, "0")}-${months[d.getMonth()]}-${String(
      d.getFullYear(),
    ).slice(-2)}`;
  } catch {
    return dateStr;
  }
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

const truncateWithEllipsis = (text, limit = 22) => {
  if (!text) return text;
  return text.length > limit ? `${text.slice(0, limit)}...` : text;
};

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
    filterKey: loan?.uiStatusFilterKey || "all",
    rank: 999,
  };
};

const getStatusColor = (statusMeta, sf) => {
  const statusKey = statusMeta?.filterKey;
  if (statusKey === "current") {
    return {
      bg: sf.sf_pillSuccessBg,
      text: sf.sf_pillSuccessText,
      accent: sf.sf_success,
    };
  }
  if (statusKey === "missed_payment") {
    return {
      bg: sf.sf_pillWarningBg,
      text: sf.sf_pillWarningText,
      accent: sf.sf_warning,
    };
  }
  if (statusKey === "overdue") {
    return {
      bg: sf.sf_pillErrorBg,
      text: sf.sf_pillErrorText,
      accent: sf.sf_error,
    };
  }
  if (statusKey === "closed") {
    return {
      bg: sf.sf_pillInfoBg,
      text: sf.sf_pillInfoText,
      accent: sf.sf_info,
    };
  }
  if (statusKey === "written_off") {
    return {
      bg: sf.sf_pillWarningBg,
      text: sf.sf_pillWarningText,
      accent: sf.sf_warning,
    };
  }
  if (statusKey === "voided") {
    return {
      bg: sf.sf_pillNeutralBg,
      text: sf.sf_pillNeutralText,
      accent: sf.sf_textTertiary,
    };
  }

  return {
    bg: sf.sf_pillNeutralBg,
    text: sf.sf_pillNeutralText,
    accent: sf.sf_textLink,
  };
};

const getMoneyTextSx = (color, fontWeight = 600) => ({
  fontSize: "0.82rem",
  fontWeight,
  color,
  lineHeight: 1.2,
});

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
        {subValue ? (
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
        ) : null}
      </Box>
    </Box>
  );
}

function CurrencyText({ value, currencyCode, numberSx = {}, prefixSx = {} }) {
  const parts = getCurrencyParts(value, currencyCode);

  if (parts.number === "N/A") {
    return (
      <Typography component="span" sx={{ ...numberSx }}>
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

export default function CustomerLoans() {
  const { borrower, institution } = React.useContext(CustomerContext);
  const [loans, setLoans] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [statementPreviewOpen, setStatementPreviewOpen] = React.useState(false);
  const [selectedStatementLoan, setSelectedStatementLoan] =
    React.useState(null);
  const navigate = useNavigate();
  const { institutionId } = useParams();
  const theme = useTheme();
  const sf = theme.palette.sf;
  const defaultCurrencyCode =
    institution?.currencyCode || loans[0]?.loanCurrency || "";

  const loadLoans = React.useCallback(async () => {
    if (!borrower?.id) {
      setLoans([]);
      setError("");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const nextLoans = await fetchCustomerLoans({ borrowerId: borrower.id });
      setLoans(nextLoans);
    } catch (err) {
      console.error("Error fetching customer loans:", err);
      setError("Unable to load your loans right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [borrower?.id]);

  React.useEffect(() => {
    loadLoans();
  }, [loadLoans]);

  const openLoanStatement = React.useCallback(
    (loanId) => {
      if (!loanId) {
        return;
      }

      navigate(`/client/${institutionId}/loans/${loanId}`);
    },
    [institutionId, navigate],
  );

  const openLoanStatementPreview = React.useCallback((loan) => {
    if (!loan?.id) {
      return;
    }

    setSelectedStatementLoan(loan);
    setStatementPreviewOpen(true);
  }, []);

  const closeLoanStatementPreview = React.useCallback(() => {
    setStatementPreviewOpen(false);
    setSelectedStatementLoan(null);
  }, []);

  const MoneyText = React.useCallback(
    ({ value, loanCurrencyCode, numberSx = {}, prefixSx = {} }) => (
      <CurrencyText
        value={value}
        currencyCode={loanCurrencyCode || defaultCurrencyCode}
        numberSx={numberSx}
        prefixSx={prefixSx}
      />
    ),
    [defaultCurrencyCode],
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

  const columns = React.useMemo(
    () => [
      {
        field: "borrower",
        headerName: "Loan",
        flex: 1.4,
        minWidth: 260,
        valueGetter: (value, row) =>
          buildLoanDisplayName(row, row.loanCurrency || defaultCurrencyCode),
        renderCell: (params) => {
          const loan = params.row;
          const loanName = buildLoanDisplayName(
            loan,
            loan.loanCurrency || defaultCurrencyCode,
          );
          const statusMeta = getLoanStatusMeta(loan);
          const statusColors = getStatusColor(statusMeta, sf);

          return (
            <Box sx={{ ...STACKED_CELL_SX, whiteSpace: "normal", py: 0.5 }}>
              <Typography
                onClick={(event) => {
                  event.stopPropagation();
                  openLoanStatement(loan.id);
                }}
                sx={{
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: statusColors.accent,
                  cursor: "pointer",
                  textDecoration: "underline",
                  lineHeight: 1.25,
                  wordBreak: "break-word",
                  "&:hover": { opacity: 0.85 },
                }}
              >
                {loanName}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.68rem",
                  mt: 0.35,
                  color: sf.sf_textTertiary,
                }}
              >
                {loan.loanProduct?.name || "Loan product unavailable"}
              </Typography>
              <Box
                sx={{
                  ...INLINE_META_ROW_SX,
                  gap: 0.6,
                  mt: 0.35,
                  flexWrap: "wrap",
                }}
              >
                <Chip
                  label={statusMeta.label}
                  size="small"
                  sx={{
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
                <Typography
                  sx={{
                    fontSize: "0.6rem",
                    color: sf.sf_textTertiary,
                  }}
                >
                  LOAN ID: {loan.loanNumber || loan.id || "N/A"}
                </Typography>
              </Box>
              <SFClickableText
                onClick={(event) => {
                  event.stopPropagation();
                  openLoanStatementPreview(loan);
                }}
              >
                Preview Statement
              </SFClickableText>
            </Box>
          );
        },
      },
      {
        field: "principal",
        headerName: "Principal",
        headerAlign: "center",
        flex: 0.95,
        minWidth: 140,
        type: "number",
        valueGetter: (value, row) => row.principal || 0,
        renderCell: (params) => (
          <Box sx={STACKED_CELL_SX}>
            <MoneyText
              value={params.value}
              loanCurrencyCode={params.row.loanCurrency}
              numberSx={getMoneyTextSx(sf.sf_textPrimary)}
            />
            <Typography
              sx={{
                fontSize: "0.6rem",
                mt: 0.4,
                color: sf.sf_textTertiary,
              }}
            >
              PRODUCT:{" "}
              {truncateWithEllipsis(params.row.loanProduct?.name || "N/A", 18)}
            </Typography>
          </Box>
        ),
      },
      {
        field: "startDate",
        headerName: "Date Taken",
        headerAlign: "center",
        renderHeader: renderTwoLineHeader("Date", "Taken"),
        flex: 0.7,
        minWidth: 100,
        valueGetter: (value, row) =>
          row.startDate ? new Date(row.startDate).getTime() : 0,
        renderCell: (params) => (
          <Box sx={STACKED_CELL_SX}>
            <Typography
              sx={{
                fontSize: "0.82rem",
                color: sf.sf_textPrimary,
                fontWeight: 600,
                lineHeight: 1.2,
              }}
            >
              {fmtDate(params.row.startDate)}
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
                {formatDurationCompact(
                  params.row.duration,
                  params.row.durationInterval,
                )}
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        field: "maturityDate",
        headerName: "Maturity Date",
        headerAlign: "center",
        renderHeader: renderTwoLineHeader("Maturity", "Date"),
        flex: 0.8,
        minWidth: 112,
        valueGetter: (value, row) => {
          const maturityDate = computeMaturityDate(row);
          return maturityDate ? new Date(maturityDate).getTime() : 0;
        },
        renderCell: (params) => {
          const maturityDate = computeMaturityDate(params.row);
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
        field: "amountDue",
        headerName: "Amount Due",
        headerAlign: "center",
        renderHeader: renderTwoLineHeader("Amount", "Due"),
        flex: 0.8,
        minWidth: 120,
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
                loanCurrencyCode={params.row.loanCurrency}
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
        headerAlign: "center",
        renderHeader: renderTwoLineHeader("Total", "Paid"),
        flex: 0.8,
        minWidth: 120,
        type: "number",
        valueGetter: (value, row) => getTotalPaid(row),
        renderCell: (params) => (
          <Box sx={STACKED_CELL_SX}>
            <MoneyText
              value={params.value}
              loanCurrencyCode={params.row.loanCurrency}
              numberSx={getMoneyTextSx(sf.sf_success, 500)}
            />
            <Typography
              sx={{
                fontSize: "0.6rem",
                mt: 0.4,
                color: sf.sf_textTertiary,
              }}
            >
              READ ONLY
            </Typography>
          </Box>
        ),
      },
      {
        field: "loanBalance",
        headerName: "Loan Balance",
        headerAlign: "center",
        renderHeader: renderTwoLineHeader("Loan", "Balance"),
        flex: 0.85,
        minWidth: 125,
        type: "number",
        valueGetter: (value, row) => getPrincipalBalance(row),
        renderCell: (params) => (
          <Box sx={STACKED_CELL_SX}>
            <MoneyText
              value={params.value}
              loanCurrencyCode={params.row.loanCurrency}
              numberSx={getMoneyTextSx(sf.sf_textPrimary)}
            />
            <SFClickableText
              onClick={(event) => {
                event.stopPropagation();
                openLoanStatementPreview(params.row);
              }}
            >
              Preview Statement
            </SFClickableText>
          </Box>
        ),
      },
      {
        field: "loanOfficer",
        headerName: "Loan Officer",
        headerAlign: "center",
        renderHeader: renderTwoLineHeader("Loan", "Officer"),
        flex: 0.9,
        minWidth: 140,
        sortable: false,
        valueGetter: (value, row) => {
          const officer = row.createdByEmployee;
          return officer
            ? [officer.firstName, officer.lastName].filter(Boolean).join(" ") ||
                officer.email ||
                "N/A"
            : "N/A";
        },
        renderCell: (params) => (
          <Box sx={STACKED_CELL_SX}>
            <Typography
              sx={{
                fontSize: "0.82rem",
                fontWeight: 600,
                color: sf.sf_textPrimary,
                lineHeight: 1.2,
              }}
            >
              {truncateWithEllipsis(params.value, 17) || "N/A"}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.6rem",
                mt: 0.4,
                color: sf.sf_textTertiary,
              }}
            >
              {truncateWithEllipsis(
                params.row.createdByEmployee?.email || "No assigned officer",
                22,
              )}
            </Typography>
          </Box>
        ),
      },
    ],
    [
      defaultCurrencyCode,
      openLoanStatement,
      openLoanStatementPreview,
      renderTwoLineHeader,
      sf,
    ],
  );

  const filteredLoans = React.useMemo(() => {
    let result = loans;

    if (statusFilter !== "all") {
      result = result.filter(
        (loan) => getLoanStatusMeta(loan).filterKey === statusFilter,
      );
    }

    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      result = result.filter((loan) => {
        const searchable = [
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

        return searchable.includes(q);
      });
    }

    return result;
  }, [loans, searchTerm, statusFilter]);

  const kpis = React.useMemo(() => {
    const current = loans.filter(
      (loan) => getLoanStatusMeta(loan).filterKey === "current",
    );
    const missedPayment = loans.filter(
      (loan) => getLoanStatusMeta(loan).filterKey === "missed_payment",
    );
    const overdue = loans.filter(
      (loan) => getLoanStatusMeta(loan).filterKey === "overdue",
    );
    const totalPrincipal = loans.reduce(
      (sum, loan) => sum + (loan.principal || 0),
      0,
    );
    const totalOutstanding = loans.reduce(
      (sum, loan) => sum + getBalance(loan),
      0,
    );

    return {
      total: loans.length,
      current: current.length,
      missedPayment: missedPayment.length,
      overdue: overdue.length,
      totalPrincipal,
      totalOutstanding,
    };
  }, [loans]);

  const tabCounts = React.useMemo(() => {
    const counts = { all: loans.length };
    STATUS_TABS.forEach((tab) => {
      if (tab.key !== "all") {
        counts[tab.key] = loans.filter(
          (loan) => getLoanStatusMeta(loan).filterKey === tab.key,
        ).length;
      }
    });
    return counts;
  }, [loans]);

  if (!borrower) {
    return (
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
          My Loans
        </Typography>
        <Paper sx={{ p: 3, bgcolor: "warning.light" }}>
          <Typography>
            Please complete your profile to view your loans.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          mb: "20px",
          pb: "12px",
          borderBottom: `3px solid ${sf.sf_brandPrimary}`,
          gap: 2,
          flexWrap: "wrap",
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
            My Loans
          </Typography>
          <Typography
            sx={{
              fontSize: "0.75rem",
              color: sf.sf_textTertiary,
              mt: 0.15,
            }}
          >
            {loading
              ? "Loading your loans..."
              : `${loans.length} loans loaded · ${filteredLoans.length} shown · statements are read only`}
          </Typography>
        </Box>
        <Tooltip title="Refresh loans" placement="top">
          <IconButton
            onClick={loadLoans}
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

      {error ? (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={loadLoans}>
              Retry
            </Button>
          }
          sx={{ mb: 2, borderRadius: 0 }}
        >
          {error}
        </Alert>
      ) : null}

      {!loading && loans.length > 0 ? (
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
            label="Current"
            value={kpis.current}
            accent={sf.sf_successBg}
            sf={sf}
          />
          <KpiCard
            icon={InfoOutlinedIcon}
            label="Missed Payment"
            value={kpis.missedPayment}
            accent={sf.sf_warningBg}
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
                loanCurrencyCode={defaultCurrencyCode}
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
                loanCurrencyCode={defaultCurrencyCode}
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
      ) : null}

      <Alert severity="info" sx={{ mb: 2, borderRadius: 0 }}>
        Loan statements are available in read-only mode. Payments and internal
        loan comments are not available from the customer portal.
      </Alert>

      {loans.length === 0 && !loading && !error ? (
        <Paper sx={{ p: 3, borderRadius: 0 }}>
          <Typography sx={{ color: sf.sf_textPrimary }}>
            You don&apos;t have any active or completed loans to display yet.
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2, borderRadius: 0 }}
            onClick={() => navigate(`/client/${institutionId}/apply`)}
          >
            Apply for Loan
          </Button>
        </Paper>
      ) : null}

      {loans.length > 0 ? (
        <>
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
                placeholder="Search loan #, product, officer..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
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
            <CustomDataGrid
              rows={filteredLoans}
              columns={columns}
              loading={loading}
              getRowId={(row) => row.id}
              pageSize={25}
              pageSizeOptions={[10, 25, 50]}
              getRowHeight={() => "auto"}
              getEstimatedRowHeight={() => 72}
              showToolbar={false}
              onRowClick={(params) => openLoanStatementPreview(params.row)}
              sx={{
                borderRadius: 0,
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontSize: "0.74rem",
                },
                "& .MuiDataGrid-cell": {
                  cursor: "pointer",
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
      ) : null}

      <CustomerLoanStatementPopup
        open={statementPreviewOpen}
        onClose={closeLoanStatementPreview}
        loan={selectedStatementLoan}
        institution={institution}
        onOpenFullStatement={() => {
          if (!selectedStatementLoan?.id) {
            return;
          }

          closeLoanStatementPreview();
          openLoanStatement(selectedStatementLoan.id);
        }}
      />
    </Box>
  );
}
