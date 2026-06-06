/**
 * Balance Sheet Report — /reports/balance-sheet
 *
 * Point-in-time snapshot of branch assets:
 *   • Cash & Bank Accounts (account balances minus loans disbursed)
 *   • Gross Loan Portfolio (outstanding principal from loan data)
 *   • Less: Provision for Loan Losses (PAR-based tiers matching ProvisionsReport)
 *   • Accrued Receivables (interest, fees, penalties from schedule vs collections)
 *
 * Two date columns: primary "As of" date + optional comparison date.
 * Compare options: Previous Month / Previous Year / Custom.
 *
 * Visual language follows ProfitabilityReport (sf palette, square corners, 3px brand border).
 */

import React from "react";
import {
  Alert,
  Box,
  IconButton,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import RefreshIcon from "@mui/icons-material/Refresh";

import { UserContext } from "../../App";
import PlusButtonMain from "../../ModelAssets/PlusButtonMain";
import { useNotification } from "../../ModelAssets/NotificationContext";

import { useReportData } from "./useReportData";
import { fmtMoney, parseReportDate, downloadFile, toCsv } from "./reportUtils";
import {
  BS_COMPARE_TO,
  computeBalanceSheet,
  getComparisonDate,
} from "./balanceSheetHelpers";
import { fetchLedgerData } from "./cashLedgerHelpers";

// ─── Constants ────────────────────────────────────────────────────────────────

const COMPARE_OPTIONS = [
  { value: BS_COMPARE_TO.NONE,       label: "No Comparison" },
  { value: BS_COMPARE_TO.PREV_MONTH, label: "Same Date Last Month" },
  { value: BS_COMPARE_TO.PREV_YEAR,  label: "Same Date Last Year" },
  { value: BS_COMPARE_TO.CUSTOM,     label: "Custom Date…" },
];

const SECTION_FONT_SIZE  = "0.88rem";
const ROW_FONT_SIZE      = "0.82rem";
const HEADER_FONT_SIZE   = "0.74rem";

// ─── Row config ───────────────────────────────────────────────────────────────

const ROW_CONFIG = [
  { type: "sectionHeader", label: "Assets", color: "success" },

  { type: "subHeader", label: "Cash & Bank", indent: 1 },
  {
    type: "line",
    label: "Cash & Bank Accounts",
    indent: 2,
    key: "cashAndBank",
    format: "money",
  },

  { type: "subHeader", label: "Loan Portfolio", indent: 1 },
  {
    type: "line",
    label: "Gross Loan Portfolio",
    indent: 2,
    key: "grossLoanPortfolio",
    format: "money",
  },
  {
    type: "line",
    label: "Less: Provision for Loan Losses",
    indent: 2,
    key: "provisions",
    format: "money",
    deduction: true,
  },
  {
    type: "total",
    label: "Net Loan Portfolio",
    indent: 2,
    key: "netLoanPortfolio",
    format: "money",
  },

  { type: "subHeader", label: "Accrued Receivables", indent: 1 },
  {
    type: "line",
    label: "Interest Receivable",
    indent: 2,
    key: "interestReceivable",
    format: "money",
  },
  {
    type: "line",
    label: "Fees Receivable",
    indent: 2,
    key: "feesReceivable",
    format: "money",
  },
  {
    type: "line",
    label: "Penalties Receivable",
    indent: 2,
    key: "penaltiesReceivable",
    format: "money",
  },
  {
    type: "total",
    label: "Total Receivables",
    indent: 2,
    key: "totalReceivables",
    format: "money",
  },

  {
    type: "summary",
    label: "Total Assets",
    key: "totalAssets",
    format: "money",
    borderTop: true,
    borderBottom: true,
  },

  { type: "sectionHeader", label: "Portfolio Metrics", color: "info" },
  {
    type: "line",
    label: "Active Loans (count)",
    indent: 1,
    key: "activeLoansCount",
    format: "count",
  },
  {
    type: "line",
    label: "PAR 30 (% of gross portfolio)",
    indent: 1,
    key: "par30Pct",
    format: "pct",
  },
  {
    type: "line",
    label: "PAR 90 (% of gross portfolio)",
    indent: 1,
    key: "par90Pct",
    format: "pct",
  },
  {
    type: "line",
    label: "Provision Coverage (% of gross portfolio)",
    indent: 1,
    key: "provisionCoveragePct",
    format: "pct",
  },
];

// ─── Formatting ───────────────────────────────────────────────────────────────

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function fmtColumnHeader(date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) return "";
  return `As of ${String(date.getDate()).padStart(2, "0")} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

function fmtSubtitleDate(date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) return "";
  return `${String(date.getDate()).padStart(2, "0")}-${MONTHS[date.getMonth()]}-${date.getFullYear()}`;
}

function fmtValue(value, format, sf) {
  if (value == null) return { text: "—", color: sf.sf_textTertiary };

  if (format === "count") {
    return { text: String(Math.round(Number(value) || 0)), color: sf.sf_textPrimary };
  }
  if (format === "pct") {
    const num = Number(value || 0);
    const color = num > 30 ? sf.sf_error : num > 10 ? sf.sf_warning : sf.sf_textPrimary;
    return { text: `${num.toFixed(1)}%`, color };
  }
  // money
  const num = Number(value || 0);
  if (!Number.isFinite(num)) return { text: "0.00", color: sf.sf_textPrimary };
  return {
    text: fmtMoney(num),
    color: num < 0 ? sf.sf_error : sf.sf_textPrimary,
  };
}

// ─── Row components ───────────────────────────────────────────────────────────

function BsRow({ row, primarySheet, comparisonSheet, sf, columnCount }) {
  if (row.type === "sectionHeader") {
    const color =
      row.color === "success" ? sf.sf_success
      : row.color === "error" ? sf.sf_error
      : row.color === "info" ? sf.sf_info
      : sf.sf_textPrimary;
    return (
      <tr>
        <td
          colSpan={columnCount}
          style={{
            background: sf.sf_tableHeaderBg,
            fontSize: SECTION_FONT_SIZE,
            fontWeight: 700,
            color,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            padding: "6px 12px",
            borderBottom: `1px solid ${sf.sf_borderLight}`,
          }}
        >
          {row.label}
        </td>
      </tr>
    );
  }

  if (row.type === "subHeader") {
    return (
      <tr>
        <td
          colSpan={columnCount}
          style={{
            fontSize: ROW_FONT_SIZE,
            fontWeight: 700,
            color: sf.sf_textPrimary,
            paddingLeft: `${(row.indent || 0) * 16 + 12}px`,
            paddingTop: "5px",
            paddingBottom: "5px",
            borderBottom: `1px solid ${sf.sf_borderLight}`,
          }}
        >
          {row.label}
        </td>
      </tr>
    );
  }

  const isTotal   = row.type === "total";
  const isSummary = row.type === "summary";
  const fontWeight = isTotal || isSummary ? 700 : 500;
  const rowBg     = isSummary ? sf.sf_tableHeaderBg : "transparent";

  const renderCell = (sheet) => {
    if (!sheet) return <td style={{ textAlign: "right", minWidth: 150 }}>—</td>;
    const raw = sheet[row.key];
    const { text, color } = fmtValue(raw, row.format, sf);
    const displayText = row.deduction ? `(${text})` : text;
    const displayColor = row.deduction ? sf.sf_error : color;
    return (
      <td
        style={{
          textAlign: "right",
          fontSize: ROW_FONT_SIZE,
          fontWeight,
          color: displayColor,
          whiteSpace: "nowrap",
          padding: "5px 12px",
          minWidth: 150,
        }}
      >
        {displayText}
      </td>
    );
  };

  return (
    <tr
      style={{
        background: rowBg,
        borderTop: row.borderTop ? `2px solid ${sf.sf_borderMedium}` : undefined,
        borderBottom: row.borderBottom ? `2px solid ${sf.sf_borderMedium}` : undefined,
      }}
    >
      <td
        style={{
          fontSize: ROW_FONT_SIZE,
          fontWeight,
          color: sf.sf_textPrimary,
          paddingLeft: `${(row.indent || 0) * 16 + 12}px`,
          paddingTop: "5px",
          paddingBottom: "5px",
          borderBottom: `1px solid ${sf.sf_borderLight}`,
          minWidth: 280,
        }}
      >
        {row.label}
      </td>
      {renderCell(primarySheet)}
      {comparisonSheet !== undefined && renderCell(comparisonSheet)}
    </tr>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function BalanceSheetReport() {
  const { userDetails } = React.useContext(UserContext);
  const { showNotification } = useNotification();
  const theme = useTheme();
  const sf = theme.palette.sf;

  const activeBranchId = userDetails?.branchID || userDetails?.branch?.id || null;
  const shouldShowReport = Boolean(activeBranchId);

  // Default "as of" = today
  const todayStr = React.useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }, []);

  const [asOfDateStr, setAsOfDateStr] = React.useState(todayStr);
  const [compareTo, setCompareTo]     = React.useState(BS_COMPARE_TO.NONE);
  const [customCompareStr, setCustomCompareStr] = React.useState("");

  // Account / expense / income data
  const [accounts, setAccounts]         = React.useState([]);
  const [expenses, setExpenses]         = React.useState([]);
  const [otherIncomes, setOtherIncomes] = React.useState([]);
  const [accountsLoading, setAccountsLoading] = React.useState(false);
  const [accountsError, setAccountsError]     = React.useState(null);

  // Loan summaries from the shared hook
  const {
    summaries,
    loading: summariesLoading,
    error: summariesError,
    refresh: refreshSummaries,
  } = useReportData({ selectedBranchId: activeBranchId });

  const loadAccountData = React.useCallback(async (branchId) => {
    if (!branchId) {
      setAccounts([]);
      setExpenses([]);
      setOtherIncomes([]);
      return;
    }
    setAccountsLoading(true);
    setAccountsError(null);
    try {
      const { accounts: accts, expenses: exps, otherIncomes: incs } =
        await fetchLedgerData(branchId);
      setAccounts(accts);
      setExpenses(exps);
      setOtherIncomes(incs);
    } catch (err) {
      console.error("[BalanceSheet] account load failed:", err);
      setAccountsError("Failed to load account data.");
    } finally {
      setAccountsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadAccountData(activeBranchId);
  }, [activeBranchId, loadAccountData]);

  // Date objects (end-of-day so same-day transactions are included)
  const primaryDate = React.useMemo(() => {
    const d = parseReportDate(asOfDateStr, { endOfDay: true });
    return d || null;
  }, [asOfDateStr]);

  const comparisonDate = React.useMemo(
    () => getComparisonDate(primaryDate, compareTo, customCompareStr),
    [primaryDate, compareTo, customCompareStr],
  );

  const primarySheet = React.useMemo(() => {
    if (!primaryDate) return null;
    return computeBalanceSheet({
      accounts, expenses, otherIncomes, loanSummaries: summaries, asOfDate: primaryDate,
    });
  }, [accounts, expenses, otherIncomes, summaries, primaryDate]);

  const comparisonSheet = React.useMemo(() => {
    if (!comparisonDate) return null;
    return computeBalanceSheet({
      accounts, expenses, otherIncomes, loanSummaries: summaries, asOfDate: comparisonDate,
    });
  }, [accounts, expenses, otherIncomes, summaries, comparisonDate]);

  const loading      = summariesLoading || accountsLoading;
  const errorMessage = summariesError || accountsError;
  const hasComparison = comparisonSheet !== null;
  const columnCount  = hasComparison ? 3 : 2;

  const handleRefresh = React.useCallback(() => {
    refreshSummaries();
    loadAccountData(activeBranchId);
  }, [activeBranchId, loadAccountData, refreshSummaries]);

  const handleExportCsv = React.useCallback(() => {
    if (!primarySheet) {
      showNotification("Select a valid date first.", "red");
      return;
    }
    const columns = [
      { key: "label",   label: "Line" },
      { key: "primary", label: fmtColumnHeader(primaryDate) },
      ...(hasComparison ? [{ key: "comparison", label: fmtColumnHeader(comparisonDate) }] : []),
    ];
    const rows = ROW_CONFIG
      .filter((r) => r.type !== "sectionHeader" && r.type !== "subHeader")
      .map((r) => {
        const pVal = primarySheet?.[r.key] ?? "";
        const cVal = comparisonSheet?.[r.key] ?? "";
        return {
          label:      r.label,
          primary:    r.format === "pct" ? `${Number(pVal || 0).toFixed(1)}%` : String(pVal || 0),
          comparison: hasComparison
            ? (r.format === "pct" ? `${Number(cVal || 0).toFixed(1)}%` : String(cVal || 0))
            : undefined,
        };
      });
    const csv = toCsv(rows, columns);
    downloadFile(csv, `balance_sheet_${asOfDateStr}.csv`, "text/csv");
  }, [
    asOfDateStr, comparisonDate, comparisonSheet, hasComparison,
    primaryDate, primarySheet, showNotification,
  ]);

  // Styles shared with ProfitabilityReport
  const panelBoxSx = {
    border: `1px solid ${sf.sf_borderLight}`,
    bgcolor: sf.sf_cardBg,
    boxShadow: sf.sf_shadowSm,
    p: 1.5,
  };
  const filterRowSx = { display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" };
  const compactSelectSx = {
    minWidth: 200,
    height: 36,
    borderRadius: 0,
    bgcolor: sf.sf_searchBg,
    "& fieldset": { borderColor: sf.sf_searchBorder, borderRadius: 0 },
    "&:hover fieldset": { borderColor: sf.sf_searchFocusBorder },
    "& .MuiSelect-select": { fontSize: "0.82rem", py: 0.6 },
  };
  const compactDateSx = {
    minWidth: 160,
    "& .MuiInputBase-root": { borderRadius: 0, height: 36 },
    "& .MuiInputLabel-root": { fontSize: "0.72rem" },
    "& .MuiInputBase-input": { fontSize: "0.78rem", py: 0.7 },
  };
  const sectionLabelSx = {
    fontSize: HEADER_FONT_SIZE,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    mb: 0.3,
    color: sf.sf_textTertiary,
  };

  const summaryStatus = loading
    ? "Loading…"
    : `${summaries.length} ${summaries.length === 1 ? "loan" : "loans"} · ${accounts.length} ${accounts.length === 1 ? "account" : "accounts"}`;

  return (
    <>
      {/* Page Header */}
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
            sx={{ fontSize: "1.35rem", fontWeight: 700, color: sf.sf_textPrimary, letterSpacing: "-0.01em" }}
          >
            Balance Sheet
          </Typography>
          <Typography sx={{ fontSize: "0.75rem", color: sf.sf_textTertiary, mt: 0.15 }}>
            {summaryStatus}
            {primaryDate ? ` · As of ${fmtSubtitleDate(primaryDate)}` : ""}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PlusButtonMain buttonText="EXPORT" onClick={handleExportCsv} />
          <Tooltip title="Refresh data" placement="top">
            <span>
              <IconButton
                onClick={handleRefresh}
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
            </span>
          </Tooltip>
        </Box>
      </Box>

      {!shouldShowReport && (
        <Box sx={{ p: 2, mb: 2, bgcolor: "info.light" }}>
          <Typography variant="body2">
            No active branch is loaded. Use Change Branch from the top bar.
          </Typography>
        </Box>
      )}

      {shouldShowReport && errorMessage && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 0 }}>{errorMessage}</Alert>
      )}

      {shouldShowReport && (
        <>
          {/* Filter Container */}
          <Box sx={{ ...panelBoxSx, mb: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Box sx={filterRowSx}>
              {/* As of date */}
              <Box>
                <Typography sx={sectionLabelSx}>As of Date</Typography>
                <TextField
                  type="date"
                  size="small"
                  value={asOfDateStr}
                  onChange={(e) => setAsOfDateStr(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={compactDateSx}
                />
              </Box>

              {/* Divider */}
              <Box sx={{ width: 1, height: 28, bgcolor: sf.sf_borderLight }} />

              {/* Compare to */}
              <Box>
                <Typography sx={sectionLabelSx}>Compare To</Typography>
                <Select
                  value={compareTo}
                  onChange={(e) => setCompareTo(e.target.value)}
                  size="small"
                  sx={compactSelectSx}
                >
                  {COMPARE_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: "0.82rem" }}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              {/* Custom comparison date */}
              {compareTo === BS_COMPARE_TO.CUSTOM && (
                <Box>
                  <Typography sx={sectionLabelSx}>Comparison Date</Typography>
                  <TextField
                    type="date"
                    size="small"
                    value={customCompareStr}
                    onChange={(e) => setCustomCompareStr(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={compactDateSx}
                  />
                </Box>
              )}

              {/* Comparison date resolved label */}
              {comparisonDate && (
                <Typography sx={{ fontSize: "0.75rem", color: sf.sf_textTertiary, alignSelf: "flex-end", pb: 0.3 }}>
                  {`Comparing to ${fmtSubtitleDate(comparisonDate)}`}
                </Typography>
              )}
            </Box>
          </Box>

          {loading && <LinearProgress sx={{ mb: 1.5 }} />}

          {/* Balance Sheet Table */}
          <Box sx={{ ...panelBoxSx, p: 0 }}>
            <Box
              sx={{
                px: 2, py: 1,
                bgcolor: sf.sf_tableHeaderBg,
                borderBottom: `1px solid ${sf.sf_borderLight}`,
              }}
            >
              <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: sf.sf_textPrimary }}>
                Balance Sheet Statement
              </Typography>
            </Box>

            {!primaryDate ? (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography sx={{ fontSize: "0.85rem", color: sf.sf_textTertiary }}>
                  Select a valid date to compute the Balance Sheet.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ overflowX: "auto" }}>
                <Box
                  component="table"
                  sx={{
                    width: "100%",
                    borderCollapse: "collapse",
                    "& td, & th": {
                      borderBottom: `1px solid ${sf.sf_borderLight}`,
                      verticalAlign: "middle",
                    },
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          textAlign: "left",
                          fontSize: HEADER_FONT_SIZE,
                          fontWeight: 700,
                          color: sf.sf_textTertiary,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          background: sf.sf_tableHeaderBg,
                          padding: "7px 12px",
                          minWidth: 280,
                        }}
                      >
                        Line Item
                      </th>
                      <th
                        style={{
                          textAlign: "right",
                          fontSize: HEADER_FONT_SIZE,
                          fontWeight: 700,
                          color: sf.sf_textPrimary,
                          background: sf.sf_tableHeaderBg,
                          padding: "7px 12px",
                          minWidth: 160,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {fmtColumnHeader(primaryDate)}
                      </th>
                      {hasComparison && (
                        <th
                          style={{
                            textAlign: "right",
                            fontSize: HEADER_FONT_SIZE,
                            fontWeight: 700,
                            color: sf.sf_textTertiary,
                            background: sf.sf_tableHeaderBg,
                            padding: "7px 12px",
                            minWidth: 160,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {fmtColumnHeader(comparisonDate)}
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {ROW_CONFIG.map((row, idx) => (
                      <BsRow
                        key={`${row.type}-${row.label || idx}`}
                        row={row}
                        primarySheet={primarySheet}
                        comparisonSheet={hasComparison ? comparisonSheet : undefined}
                        sf={sf}
                        columnCount={columnCount}
                      />
                    ))}
                  </tbody>
                </Box>
              </Box>
            )}
          </Box>

          {/* Footnotes */}
          <Box sx={{ mt: 1.5, display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Typography sx={{ fontSize: "0.7rem", color: sf.sf_textTertiary }}>
              Cash & Bank: account opening balances + deposits + loan repayments received + other income − withdrawals − loan disbursements − operating expenses − account-level penalties & fees.
            </Typography>
            <Typography sx={{ fontSize: "0.7rem", color: sf.sf_textTertiary }}>
              Gross Loan Portfolio: outstanding principal per active loan (original principal − principal repaid to date). Written-off loans are included at 100% provision.
            </Typography>
            <Typography sx={{ fontSize: "0.7rem", color: sf.sf_textTertiary }}>
              Provision for Loan Losses: PAR-based (Current 1% · 1–30d 5% · 31–60d 15% · 61–90d 35% · 91–180d 60% · 181d+ 100%). Liabilities are not tracked in this system.
            </Typography>
          </Box>
        </>
      )}
    </>
  );
}
