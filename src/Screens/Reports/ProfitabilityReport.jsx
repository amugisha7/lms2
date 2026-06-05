/**
 * Profit / Loss Report — /reports/profitability
 *
 * A classic Profit / Loss statement built from real repo data:
 *   - Revenue from Loans: payment allocations to interest, fees, penalties
 *   - Other Income: OtherIncome.amount in period
 *   - Operating Expenses: Expense.amount in period (grouped by category)
 *   - Taxes: Expense entries flagged as tax via category/type keyword
 *
 * Visual language follows LoansDisplay (sf palette, square corners, 3px brand
 * border, PlusButtonMain EXPORT, refresh IconButton, flat filter container).
 */

import React from "react";
import {
  Alert,
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  LinearProgress,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import RefreshIcon from "@mui/icons-material/Refresh";
import { generateClient } from "aws-amplify/api";

import { UserContext } from "../../App";
import PlusButtonMain from "../../ModelAssets/PlusButtonMain";
import DateFilters, { getPresetRange } from "../../ModelAssets/DateFilters";
import { useNotification } from "../../ModelAssets/NotificationContext";
import {
  expensesByBranchID,
  otherIncomesByBranchID,
} from "../../graphql/queries";

import { useReportData } from "./useReportData";
import { fmtMoney, downloadFile, toCsv } from "./reportUtils";
import {
  BASIS_MODES,
  COMPARE_MODES,
  buildPeriods,
  computeProfitLoss,
  fetchAllExpensesByBranch,
  fetchAllOtherIncomesByBranch,
} from "./profitLossHelpers";

const COMPARE_OPTIONS = [
  { value: COMPARE_MODES.NONE, label: "No Comparison" },
  { value: COMPARE_MODES.MONTHLY, label: "Compare Monthly" },
  { value: COMPARE_MODES.QUARTERLY, label: "Compare Quarterly" },
  { value: COMPARE_MODES.YEARLY, label: "Compare Yearly" },
];

const PERIOD_COUNT_OPTIONS = [1, 2, 3, 4, 5, 6];

const SECTION_HEADER_FONT_SIZE = "0.92rem";
const ROW_FONT_SIZE = "0.82rem";
const HEADER_FONT_SIZE = "0.74rem";

const formatMoneyOrEmpty = (value) => {
  if (value == null) return "";
  const num = Number(value);
  if (!Number.isFinite(num) || num === 0) return "";
  return fmtMoney(num);
};

const buildRowConfig = ({ expenseCategories }) => {
  const expenseLineRows = expenseCategories.map((category) => ({
    type: "line",
    label: category,
    indent: 2,
    valueOf: (period) => period.operatingExpensesByCategory?.[category] ?? 0,
  }));

  return [
    {
      type: "sectionHeader",
      label: "Revenue",
      color: "success",
    },
    {
      type: "subHeader",
      label: "Revenue from Loans",
      indent: 1,
    },
    {
      type: "line",
      label: "Interest on Loans",
      indent: 2,
      valueOf: (p) => p.interestOnLoans,
    },
    {
      type: "line",
      label: "Fees Collected",
      indent: 2,
      valueOf: (p) => p.feesCollected,
    },
    {
      type: "line",
      label: "Penalties Collected",
      indent: 2,
      valueOf: (p) => p.penaltiesCollected,
    },
    {
      type: "line",
      label: "Other Income",
      indent: 1,
      valueOf: (p) => p.otherIncome,
    },
    {
      type: "total",
      label: "Total Revenue",
      indent: 1,
      valueOf: (p) => p.totalRevenue,
    },
    {
      type: "sectionHeader",
      label: "Expenses",
      color: "error",
    },
    ...(expenseLineRows.length > 0
      ? [
          {
            type: "subHeader",
            label: "Operating Expenses",
            indent: 1,
          },
          ...expenseLineRows,
        ]
      : []),
    {
      type: "total",
      label: "Total Expenses",
      indent: 1,
      valueOf: (p) => p.totalExpenses,
    },
    {
      type: "summary",
      label: "Net Operating Income",
      valueOf: (p) => p.netOperatingIncome,
      borderTop: true,
      borderBottom: true,
    },
    {
      type: "summary",
      label: "Net Income Before Taxes and Subsidy",
      valueOf: (p) => p.netIncomeBeforeTaxes,
      borderBottom: true,
    },
    {
      type: "sectionHeader",
      label: "Taxes",
      color: "neutral",
    },
    {
      type: "line",
      label: "Income Tax Expense",
      indent: 1,
      valueOf: (p) => p.taxExpense,
    },
    {
      type: "summary",
      label: "Net Income After Taxes and Subsidy",
      valueOf: (p) => p.netIncomeAfterTaxes,
      highlight: true,
    },
  ];
};

export default function ProfitabilityReport() {
  const { userDetails } = React.useContext(UserContext);
  const { showNotification } = useNotification();
  const theme = useTheme();
  const sf = theme.palette.sf;

  // Mirror LoansDisplay: use whatever branch is currently loaded in userDetails
  // for both admin (set via the top-bar branch selector) and non-admin users.
  const activeBranchId =
    userDetails?.branchID || userDetails?.branch?.id || null;
  const shouldShowReport = Boolean(activeBranchId);

  const defaultRange = React.useMemo(
    () => getPresetRange("this_year") || { from: "", to: "" },
    [],
  );
  const [startDate, setStartDate] = React.useState(defaultRange.from);
  const [endDate, setEndDate] = React.useState(defaultRange.to);
  const [basis, setBasis] = React.useState(BASIS_MODES.CASH);
  const [compareMode, setCompareMode] = React.useState(COMPARE_MODES.MONTHLY);
  const [comparePeriods, setComparePeriods] = React.useState(2);
  const [expenses, setExpenses] = React.useState([]);
  const [otherIncomes, setOtherIncomes] = React.useState([]);
  const [extrasLoading, setExtrasLoading] = React.useState(false);
  const [extrasError, setExtrasError] = React.useState(null);

  // Pass activeBranchId to useReportData so it loads loan summaries for the
  // currently-loaded branch regardless of admin status.
  const {
    summaries,
    loading: summariesLoading,
    error: summariesError,
    refresh: refreshSummaries,
  } = useReportData({ selectedBranchId: activeBranchId });

  const effectiveBranchId = activeBranchId;

  const loadExtras = React.useCallback(async (branchId) => {
    if (!branchId) {
      setExpenses([]);
      setOtherIncomes([]);
      return;
    }
    setExtrasLoading(true);
    setExtrasError(null);
    try {
      const client = generateClient();
      const [loadedExpenses, loadedOtherIncomes] = await Promise.all([
        fetchAllExpensesByBranch({
          client,
          branchId,
          query: expensesByBranchID,
        }),
        fetchAllOtherIncomesByBranch({
          client,
          branchId,
          query: otherIncomesByBranchID,
        }),
      ]);
      setExpenses(loadedExpenses);
      setOtherIncomes(loadedOtherIncomes);
    } catch (err) {
      console.error("[ProfitLoss] failed to load extras:", err);
      setExpenses([]);
      setOtherIncomes([]);
      setExtrasError("Failed to load expense / other income data.");
    } finally {
      setExtrasLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadExtras(effectiveBranchId);
  }, [effectiveBranchId, loadExtras]);

  const periods = React.useMemo(
    () =>
      buildPeriods({
        startDate,
        endDate,
        compareMode,
        comparePeriods,
      }),
    [startDate, endDate, compareMode, comparePeriods],
  );

  const profitLoss = React.useMemo(
    () =>
      computeProfitLoss({
        loanSummaries: summaries,
        expenses,
        otherIncomes,
        periods,
        basis,
      }),
    [summaries, expenses, otherIncomes, periods, basis],
  );

  const rowConfig = React.useMemo(
    () => buildRowConfig({ expenseCategories: profitLoss.expenseCategories }),
    [profitLoss.expenseCategories],
  );

  const loading = summariesLoading || extrasLoading;
  const validPeriods = periods.length > 0;
  const errorMessage = summariesError || extrasError;

  const handleRefresh = React.useCallback(() => {
    refreshSummaries();
    loadExtras(effectiveBranchId);
  }, [effectiveBranchId, loadExtras, refreshSummaries]);

  const handleExportCsv = React.useCallback(() => {
    if (!validPeriods) {
      showNotification("Select a valid date range first.", "red");
      return;
    }
    const columns = [
      { key: "label", label: "Line" },
      ...periods.map((period, idx) => ({
        key: `value_${idx}`,
        label: period.label,
      })),
    ];

    const rows = rowConfig
      .filter((row) => row.type !== "sectionHeader" && row.type !== "subHeader")
      .map((row) => {
        const out = { label: row.label };
        periods.forEach((period, idx) => {
          const periodTotal = profitLoss.periodTotals[idx];
          const value = periodTotal ? row.valueOf(periodTotal) : 0;
          out[`value_${idx}`] = Number(value || 0).toFixed(2);
        });
        return out;
      });

    const csv = toCsv(rows, columns);
    const dateLabel = `${startDate}_to_${endDate}`;
    downloadFile(csv, `profit_loss_${dateLabel}.csv`, "text/csv");
  }, [
    endDate,
    periods,
    profitLoss.periodTotals,
    rowConfig,
    showNotification,
    startDate,
    validPeriods,
  ]);

  const panelBoxSx = {
    border: `1px solid ${sf.sf_borderLight}`,
    bgcolor: sf.sf_cardBg,
    boxShadow: sf.sf_shadowSm,
    p: 1.5,
  };

  const filterRowSx = {
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    flexWrap: "wrap",
  };

  const compactSelectSx = {
    minWidth: 170,
    height: 36,
    borderRadius: 0,
    bgcolor: sf.sf_searchBg,
    "& fieldset": {
      borderColor: sf.sf_searchBorder,
      borderRadius: 0,
    },
    "&:hover fieldset": {
      borderColor: sf.sf_searchFocusBorder,
    },
    "& .MuiSelect-select": {
      fontSize: "0.82rem",
      py: 0.6,
    },
  };

  return (
    <>
      {/* Page Header — matches LoansDisplay */}
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
            Profit / Loss
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
              : `${summaries.length} ${
                  summaries.length === 1 ? "loan" : "loans"
                } · ${expenses.length} ${
                  expenses.length === 1 ? "expense" : "expenses"
                } · ${otherIncomes.length} other income`}
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
        <Alert severity="error" sx={{ mb: 2, borderRadius: 0 }}>
          {errorMessage}
        </Alert>
      )}

      {shouldShowReport && (
        <>
          {/* Filter Container */}
          <Box
            sx={{
              ...panelBoxSx,
              mb: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            <Box sx={filterRowSx}>
              <FormControl>
                <FormLabel
                  sx={{
                    fontSize: HEADER_FONT_SIZE,
                    fontWeight: 600,
                    // color: sf.sf_textTertiary,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    mb: 0,
                  }}
                >
                  Basis
                </FormLabel>
                <RadioGroup
                  row
                  value={basis}
                  onChange={(e) => setBasis(e.target.value)}
                >
                  <FormControlLabel
                    value={BASIS_MODES.CASH}
                    control={<Radio size="small" />}
                    label={
                      <Typography sx={{ fontSize: "0.82rem" }}>
                        Cash Basis
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value={BASIS_MODES.ACCRUAL}
                    control={<Radio size="small" />}
                    label={
                      <Typography sx={{ fontSize: "0.82rem" }}>
                        Accrual Basis
                      </Typography>
                    }
                  />
                </RadioGroup>
              </FormControl>
            </Box>

            <DateFilters
              dateFrom={startDate}
              dateTo={endDate}
              onDateFromChange={setStartDate}
              onDateToChange={setEndDate}
              alwaysVisible
              allowClear={false}
            />

            <Box sx={filterRowSx}>
              <Box>
                <Typography
                  sx={{
                    fontSize: HEADER_FONT_SIZE,
                    fontWeight: 600,
                    // color: sf.sf_textTertiary,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    mb: 0.3,
                  }}
                >
                  Compare
                </Typography>
                <Select
                  value={compareMode}
                  onChange={(e) => setCompareMode(e.target.value)}
                  size="small"
                  sx={compactSelectSx}
                >
                  {COMPARE_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: HEADER_FONT_SIZE,
                    fontWeight: 600,
                    // color: sf.sf_textTertiary,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    mb: 0.3,
                  }}
                >
                  Periods
                </Typography>
                <Select
                  value={comparePeriods}
                  onChange={(e) => setComparePeriods(Number(e.target.value))}
                  size="small"
                  disabled={compareMode === COMPARE_MODES.NONE}
                  sx={{ ...compactSelectSx, minWidth: 110 }}
                >
                  {PERIOD_COUNT_OPTIONS.map((value) => (
                    <MenuItem key={value} value={value}>
                      {value} {value === 1 ? "period" : "periods"}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>
          </Box>

          {loading && <LinearProgress sx={{ mb: 1.5 }} />}

          {/* P&L Statement Panel */}
          <Box sx={{ ...panelBoxSx, p: 0 }}>
            <Box
              sx={{
                px: 2,
                py: 1,
                bgcolor: sf.sf_tableHeaderBg,
                borderBottom: `1px solid ${sf.sf_borderLight}`,
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: sf.sf_textPrimary,
                }}
              >
                Profit / Loss Statement
              </Typography>
            </Box>

            {!validPeriods ? (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography
                  sx={{ fontSize: "0.85rem", color: sf.sf_textTertiary }}
                >
                  Select a valid date range to compute the Profit / Loss
                  statement.
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
                      px: 1.5,
                      py: 0.75,
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
                          minWidth: 280,
                        }}
                      >
                        Line
                      </th>
                      {periods.map((period) => (
                        <th
                          key={period.key}
                          style={{
                            textAlign: "right",
                            fontSize: HEADER_FONT_SIZE,
                            fontWeight: 700,
                            color: sf.sf_textPrimary,
                            background: sf.sf_tableHeaderBg,
                            minWidth: 160,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {period.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rowConfig.map((row, rowIdx) => (
                      <ProfitLossRow
                        key={`${row.type}-${row.label}-${rowIdx}`}
                        row={row}
                        periods={periods}
                        periodTotals={profitLoss.periodTotals}
                        sf={sf}
                      />
                    ))}
                  </tbody>
                </Box>
              </Box>
            )}
          </Box>

          <Typography
            sx={{
              fontSize: "0.7rem",
              color: sf.sf_textTertiary,
              mt: 1,
              display: "block",
            }}
          >
            {basis === BASIS_MODES.ACCRUAL
              ? "Accrual basis: interest is recognized from scheduled installments due in the period; fees and penalties from LoanFees and Penalty records by their charge date. Interest accrual stops at the loan's write-off event or its Stop Interest date, whichever comes first."
              : "Cash basis: revenue is recognized when received, derived from the statement ledger's payment allocations (interest, fees, penalties). Other Income and Expenses come from OtherIncome and Expense records in the selected period."}
          </Typography>
        </>
      )}
    </>
  );
}

function ProfitLossRow({ row, periods, periodTotals, sf }) {
  if (row.type === "sectionHeader") {
    const color =
      row.color === "success"
        ? sf.sf_success
        : row.color === "error"
          ? sf.sf_error
          : sf.sf_textPrimary;
    return (
      <tr>
        <td
          colSpan={periods.length + 1}
          style={{
            background: sf.sf_tableHeaderBg,
            fontSize: SECTION_HEADER_FONT_SIZE,
            fontWeight: 700,
            color,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
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
          colSpan={periods.length + 1}
          style={{
            fontSize: ROW_FONT_SIZE,
            fontWeight: 700,
            color: sf.sf_textPrimary,
            paddingLeft: `${(row.indent || 0) * 16 + 12}px`,
          }}
        >
          {row.label}
        </td>
      </tr>
    );
  }

  const isTotal = row.type === "total";
  const isSummary = row.type === "summary";
  const isHighlight = isSummary && row.highlight;

  return (
    <tr
      style={{
        background: isHighlight ? sf.sf_tableHeaderBg : "transparent",
        borderTop: row.borderTop ? `2px solid ${sf.sf_borderLight}` : undefined,
        borderBottom: row.borderBottom
          ? `2px solid ${sf.sf_borderLight}`
          : undefined,
      }}
    >
      <td
        style={{
          fontSize: ROW_FONT_SIZE,
          fontWeight: isTotal || isSummary ? 700 : 500,
          color: sf.sf_textPrimary,
          paddingLeft: `${(row.indent || 0) * 16 + 12}px`,
        }}
      >
        {row.label}
      </td>
      {periods.map((period, idx) => {
        const periodTotal = periodTotals[idx];
        const value = periodTotal ? row.valueOf(periodTotal) : 0;
        return (
          <td
            key={period.key}
            style={{
              textAlign: "right",
              fontSize: ROW_FONT_SIZE,
              fontWeight: isTotal || isSummary ? 700 : 500,
              color:
                isSummary && Number(value) < 0
                  ? sf.sf_error
                  : sf.sf_textPrimary,
              whiteSpace: "nowrap",
            }}
          >
            {formatMoneyOrEmpty(value) || (isSummary || isTotal ? "0" : "")}
          </td>
        );
      })}
    </tr>
  );
}
