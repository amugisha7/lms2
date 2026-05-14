/**
 * Profitability Report — /reports/profitability
 *
 * Tracks realized income (interest + fees + penalties collected) and a
 * net-profit proxy derived by subtracting explicit, user-visible modeled costs.
 *
 * Layers:
 *   1. Realized income  — actual payment allocations from repo transaction data
 *   2. Net profit proxy — realized income minus client-side modeled cost assumptions
 *
 * Data sources:
 *   - LoanSummary (via useReportData): scope, identity, balances, status, arrears, groupings
 *   - Raw loan read (GET_REPORT_LOAN_SOURCE_QUERY): payment records with allocation fields
 *   - Payment validity: isValidPayment() from statementHelpers
 *
 * Modeled cost assumptions are kept client-side only and are persisted in the
 * FinancialReport JSON payload (not schema). They are labeled as modeled inputs
 * throughout the UI.
 */

import React, { useState, useMemo, useContext } from "react";
import {
  Box,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TextField,
  InputAdornment,
  LinearProgress,
  Chip,
  Alert,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Tooltip,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { BarChart } from "@mui/x-charts/BarChart";
import { UserContext } from "../../App";
import { getPresetRange } from "../../ModelAssets/DateFilters";
import ReportShell from "./ReportShell";
import { useReportData } from "./useReportData";
import {
  fmtMoney,
  fmtReportDate,
  toCsv,
  downloadFile,
  safeNum,
} from "./reportUtils";
import { LOAN_DISPLAY_STATUS } from "../../Models/Loans/loanSummaryProjection";
import {
  DEFAULT_ASSUMPTIONS,
  computeLoanRealizedIncome,
  computeLoanModeledCost,
  profitabilityBand,
  buildMonthlyTrend,
  buildRollup,
} from "./profitabilityHelpers";

// ---------------------------------------------------------------------------
// Column definitions for CSV export
// ---------------------------------------------------------------------------
const DETAIL_COLS = [
  { key: "borrowerDisplayName", label: "Borrower" },
  { key: "loanNumber", label: "Loan #" },
  { key: "branchName", label: "Branch" },
  { key: "loanOfficerDisplayName", label: "Loan Officer" },
  { key: "loanProductName", label: "Product" },
  { key: "displayStatusLabel", label: "Status" },
  { key: "startDateFmt", label: "Date Taken" },
  { key: "maturityDateFmt", label: "Maturity Date" },
  { key: "loanBalanceAmount", label: "Outstanding Balance" },
  { key: "arrearsAmount", label: "Arrears Amount" },
  { key: "interestCollected", label: "Interest Collected" },
  { key: "feesCollected", label: "Fees Collected" },
  { key: "penaltiesCollected", label: "Penalties Collected" },
  { key: "realizedIncome", label: "Total Realized Income" },
  { key: "modeledCost", label: "Modeled Cost" },
  { key: "netProfit", label: "Net Profit Proxy" },
  { key: "band", label: "Profitability Band" },
];

// ---------------------------------------------------------------------------
// Status label map
// ---------------------------------------------------------------------------
const STATUS_LABELS = Object.values(LOAN_DISPLAY_STATUS).reduce((acc, meta) => {
  acc[meta.code] = String(meta.label || meta.code).replace(/\s+/g, " ");
  return acc;
}, {});

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function KpiBlock({ label, value, sub, color, tooltip }) {
  const theme = useTheme();
  const sf = theme.palette.sf;
  return (
    <Box
      sx={{
        p: 1.5,
        border: `1px solid ${sf.sf_borderLight}`,
        bgcolor: sf.sf_cardBg,
        height: "100%",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
        <Typography
          variant="caption"
          sx={{
            color: sf.sf_textTertiary,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            fontSize: "0.68rem",
          }}
        >
          {label}
        </Typography>
        {tooltip && (
          <Tooltip title={tooltip} arrow>
            <InfoOutlinedIcon
              sx={{ fontSize: 12, color: sf.sf_textTertiary }}
            />
          </Tooltip>
        )}
      </Box>
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ color: color || sf.sf_textPrimary, lineHeight: 1.2 }}
      >
        {value}
      </Typography>
      {sub && (
        <Typography variant="caption" sx={{ color: sf.sf_textTertiary }}>
          {sub}
        </Typography>
      )}
    </Box>
  );
}

function AssumptionField({ label, value, onChange, helpText }) {
  const theme = useTheme();
  const sf = theme.palette.sf;
  return (
    <Box>
      <Typography
        variant="caption"
        sx={{
          color: sf.sf_textTertiary,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          fontSize: "0.68rem",
          display: "block",
          mb: 0.5,
        }}
      >
        {label}
        {helpText && (
          <Tooltip title={helpText} arrow>
            <InfoOutlinedIcon
              sx={{ fontSize: 12, ml: 0.5, verticalAlign: "middle" }}
            />
          </Tooltip>
        )}
      </Typography>
      <TextField
        size="small"
        type="number"
        value={value}
        onChange={(e) => onChange(safeNum(e.target.value))}
        inputProps={{ min: 0, step: "any" }}
        sx={{ width: 160 }}
      />
    </Box>
  );
}

function RollupTable({ rows, labelField, labelHeader }) {
  const theme = useTheme();
  const sf = theme.palette.sf;
  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{ borderColor: sf.sf_borderLight }}
    >
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: sf.sf_sectionBg }}>
            <TableCell
              sx={{
                fontWeight: 700,
                textTransform: "uppercase",
                fontSize: "0.7rem",
              }}
            >
              {labelHeader}
            </TableCell>
            <TableCell
              align="right"
              sx={{
                fontWeight: 700,
                textTransform: "uppercase",
                fontSize: "0.7rem",
              }}
            >
              Loans
            </TableCell>
            <TableCell
              align="right"
              sx={{
                fontWeight: 700,
                textTransform: "uppercase",
                fontSize: "0.7rem",
              }}
            >
              Realized Income
            </TableCell>
            <TableCell
              align="right"
              sx={{
                fontWeight: 700,
                textTransform: "uppercase",
                fontSize: "0.7rem",
              }}
            >
              Modeled Cost
            </TableCell>
            <TableCell
              align="right"
              sx={{
                fontWeight: 700,
                textTransform: "uppercase",
                fontSize: "0.7rem",
              }}
            >
              Net Profit Proxy
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                align="center"
                sx={{ color: "text.secondary" }}
              >
                No data
              </TableCell>
            </TableRow>
          ) : (
            rows.map((r, i) => (
              <TableRow key={i} hover>
                <TableCell>{r[labelField] || "—"}</TableCell>
                <TableCell align="right">{r.loanCount}</TableCell>
                <TableCell align="right">
                  {fmtMoney(r.realizedIncome)}
                </TableCell>
                <TableCell align="right">{fmtMoney(r.modeledCost)}</TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color: r.netProfit < 0 ? "error.main" : "success.main",
                    fontWeight: 600,
                  }}
                >
                  {fmtMoney(r.netProfit)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// ---------------------------------------------------------------------------
// Main report
// ---------------------------------------------------------------------------

export default function ProfitabilityReport() {
  const { userDetails } = useContext(UserContext);
  const theme = useTheme();
  const sf = theme.palette.sf;
  const defaultDateRange = getPresetRange("last_month");

  // ── Page state ──────────────────────────────────────────────────────────
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [startDate, setStartDate] = useState(defaultDateRange?.from || "");
  const [endDate, setEndDate] = useState(defaultDateRange?.to || "");

  // Cost assumptions (modeled, client-side only)
  const [assumptions, setAssumptions] = useState({ ...DEFAULT_ASSUMPTIONS });

  // Filters & sorting
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [productFilter, setProductFilter] = useState("ALL");
  const [officerFilter, setOfficerFilter] = useState("ALL");
  const [rollupTab, setRollupTab] = useState("product"); // product | officer | status | branch
  const [exceptionTab, setExceptionTab] = useState("all"); // all | top | bottom | negative | written_off
  const [sortField, setSortField] = useState("netProfit");
  const [sortDir, setSortDir] = useState("desc");

  const { summaries, branches, loading, error, refresh, scope } = useReportData(
    { selectedBranchId },
  );

  // ── Branch map ───────────────────────────────────────────────────────────
  const branchMap = useMemo(() => {
    const m = {};
    branches.forEach((b) => {
      if (b?.id) m[b.id] = b.name || b.id;
    });
    return m;
  }, [branches]);

  // ── Dropdown option lists ────────────────────────────────────────────────
  const statuses = useMemo(() => {
    const set = new Set(summaries.map((s) => s.displayStatus).filter(Boolean));
    return ["ALL", ...Array.from(set).sort()];
  }, [summaries]);

  const products = useMemo(() => {
    const set = new Set(
      summaries.map((s) => s.loanProductName).filter(Boolean),
    );
    return ["ALL", ...Array.from(set).sort()];
  }, [summaries]);

  const officers = useMemo(() => {
    const set = new Set(
      summaries.map((s) => s.loanOfficerDisplayName).filter(Boolean),
    );
    return ["ALL", ...Array.from(set).sort()];
  }, [summaries]);

  // ── Derived loan rows ──────────────────────────────────────────────────────
  const loanRows = useMemo(() => {
    return summaries
      .filter(
        (summary) => summary.displayStatus !== LOAN_DISPLAY_STATUS.VOIDED.code,
      )
      .map((summary) => {
        const payments = Array.isArray(summary.reportSourcePayments)
          ? summary.reportSourcePayments
          : [];
        const realized = computeLoanRealizedIncome(
          payments,
          startDate,
          endDate,
        );
        const cost = computeLoanModeledCost(
          summary,
          assumptions,
          startDate,
          endDate,
        );
        const netProfit = realized.total - cost.total;

        return {
          id: summary.loanID || summary.id,
          loanId: summary.loanID || summary.id,
          loanNumber: summary.loanNumber || "—",
          borrowerDisplayName: summary.borrowerDisplayName || "—",
          branchID: summary.branchID,
          branchName: branchMap[summary.branchID] || summary.branchID || "—",
          loanOfficerDisplayName: summary.loanOfficerDisplayName || "—",
          loanProductName: summary.loanProductName || "—",
          displayStatus: summary.displayStatus || "—",
          displayStatusLabel:
            STATUS_LABELS[summary.displayStatus] ||
            summary.displayStatus ||
            "—",
          startDate: summary.startDate,
          startDateFmt: fmtReportDate(summary.startDate),
          maturityDate: summary.maturityDateEffective,
          maturityDateFmt: fmtReportDate(summary.maturityDateEffective),
          loanBalanceAmount: safeNum(summary.loanBalanceAmount),
          arrearsAmount: safeNum(summary.arrearsAmount),
          interestCollected: realized.interest,
          feesCollected: realized.fees,
          penaltiesCollected: realized.penalties,
          realizedIncome: realized.total,
          modeledCost: cost.total,
          modeledOrigination: cost.origination,
          modeledServicing: cost.servicing,
          modeledFunding: cost.funding,
          modeledCredit: cost.credit,
          netProfit,
          band: profitabilityBand(netProfit, realized.total),
          paymentRows: realized.paymentRows,
        };
      });
  }, [assumptions, branchMap, endDate, startDate, summaries]);

  // ── KPIs ─────────────────────────────────────────────────────────────────
  const kpis = useMemo(() => {
    if (loading) return null;
    const count = loanRows.length;
    const outstandingBalance = loanRows.reduce(
      (acc, r) => acc + r.loanBalanceAmount,
      0,
    );
    const interestCollected = loanRows.reduce(
      (acc, r) => acc + r.interestCollected,
      0,
    );
    const feesCollected = loanRows.reduce((acc, r) => acc + r.feesCollected, 0);
    const penaltiesCollected = loanRows.reduce(
      (acc, r) => acc + r.penaltiesCollected,
      0,
    );
    const realizedIncome = loanRows.reduce(
      (acc, r) => acc + r.realizedIncome,
      0,
    );
    const modeledCost = loanRows.reduce((acc, r) => acc + r.modeledCost, 0);
    const netProfit = realizedIncome - modeledCost;
    const avgNetProfit = count > 0 ? netProfit / count : 0;
    return {
      count,
      outstandingBalance,
      interestCollected,
      feesCollected,
      penaltiesCollected,
      realizedIncome,
      modeledCost,
      netProfit,
      avgNetProfit,
    };
  }, [loanRows, loading]);

  // ── Monthly trend ─────────────────────────────────────────────────────────
  const monthlyTrend = useMemo(
    () => buildMonthlyTrend(loanRows, startDate, endDate),
    [loanRows, startDate, endDate],
  );

  // ── Rollups ───────────────────────────────────────────────────────────────
  const productRollup = useMemo(
    () => buildRollup(loanRows, (r) => r.loanProductName, "product"),
    [loanRows],
  );
  const officerRollup = useMemo(
    () => buildRollup(loanRows, (r) => r.loanOfficerDisplayName, "officer"),
    [loanRows],
  );
  const statusRollup = useMemo(
    () => buildRollup(loanRows, (r) => r.displayStatusLabel, "status"),
    [loanRows],
  );
  const branchRollup = useMemo(
    () => buildRollup(loanRows, (r) => r.branchName, "branch"),
    [loanRows],
  );

  // ── Filtered detail rows ──────────────────────────────────────────────────
  const filteredRows = useMemo(() => {
    let rows = loanRows;

    if (exceptionTab === "top")
      rows = [...rows].sort((a, b) => b.netProfit - a.netProfit).slice(0, 20);
    else if (exceptionTab === "bottom")
      rows = [...rows].sort((a, b) => a.netProfit - b.netProfit).slice(0, 20);
    else if (exceptionTab === "negative")
      rows = rows.filter((r) => r.netProfit < 0);
    else if (exceptionTab === "written_off")
      rows = rows.filter(
        (r) =>
          r.displayStatus === LOAN_DISPLAY_STATUS.WRITTEN_OFF.code &&
          r.netProfit <= 0,
      );

    if (statusFilter !== "ALL")
      rows = rows.filter((r) => r.displayStatus === statusFilter);
    if (productFilter !== "ALL")
      rows = rows.filter((r) => r.loanProductName === productFilter);
    if (officerFilter !== "ALL")
      rows = rows.filter((r) => r.loanOfficerDisplayName === officerFilter);

    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          (r.loanNumber || "").toLowerCase().includes(q) ||
          (r.borrowerDisplayName || "").toLowerCase().includes(q),
      );
    }

    return [...rows].sort((a, b) => {
      const av = safeNum(a[sortField]);
      const bv = safeNum(b[sortField]);
      return sortDir === "asc" ? av - bv : bv - av;
    });
  }, [
    loanRows,
    exceptionTab,
    statusFilter,
    productFilter,
    officerFilter,
    search,
    sortField,
    sortDir,
  ]);

  // ── Sort handler ──────────────────────────────────────────────────────────
  const handleSort = (field) => {
    if (field === sortField) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  // ── CSV export ────────────────────────────────────────────────────────────
  function handleExportCsv() {
    const rows = filteredRows.map((r) => ({
      ...r,
      loanBalanceAmount: r.loanBalanceAmount.toFixed(2),
      arrearsAmount: r.arrearsAmount.toFixed(2),
      interestCollected: r.interestCollected.toFixed(2),
      feesCollected: r.feesCollected.toFixed(2),
      penaltiesCollected: r.penaltiesCollected.toFixed(2),
      realizedIncome: r.realizedIncome.toFixed(2),
      modeledCost: r.modeledCost.toFixed(2),
      netProfit: r.netProfit.toFixed(2),
    }));
    const csv = toCsv(rows, DETAIL_COLS);
    downloadFile(
      csv,
      `profitability_report_${startDate}_to_${endDate}.csv`,
      "text/csv",
    );
  }

  // ── Rollup tab label config ───────────────────────────────────────────────
  const rollupConfig = {
    product: {
      rows: productRollup,
      labelField: "product",
      labelHeader: "Product",
    },
    officer: {
      rows: officerRollup,
      labelField: "officer",
      labelHeader: "Loan Officer",
    },
    status: { rows: statusRollup, labelField: "status", labelHeader: "Status" },
    branch: { rows: branchRollup, labelField: "branch", labelHeader: "Branch" },
  };

  const pillSx = (active) => ({
    borderRadius: 0,
    textTransform: "none",
    fontSize: "0.75rem",
    px: 1.5,
    py: 0.4,
    minWidth: 0,
    border: `1px solid`,
    borderColor: active ? sf.sf_brandPrimary : sf.sf_borderLight,
    bgcolor: active ? sf.sf_brandPrimary : sf.sf_cardBg,
    color: active ? "#fff" : sf.sf_textPrimary,
    "&:hover": {
      bgcolor: active ? sf.sf_brandPrimary : sf.sf_actionHoverBg,
      borderColor: sf.sf_brandPrimary,
    },
  });

  return (
    <ReportShell
      title="Profitability Report"
      description="Realized income and net-profit proxy by loan, branch, product, and officer. Includes optional modeled cost assumptions."
      isAdmin={scope?.isAdmin}
      branches={branches}
      selectedBranchId={selectedBranchId}
      onBranchChange={(v) => {
        setSelectedBranchId(v);
      }}
      startDate={startDate}
      endDate={endDate}
      onStartDateChange={setStartDate}
      onEndDateChange={setEndDate}
      defaultDatePreset="last_month"
      onRefresh={() => {
        refresh();
      }}
      loading={loading}
      loadError={error}
      onExportCsv={loanRows.length ? handleExportCsv : undefined}
    >
      {/* ── Assumptions panel ────────────────────────────────────────────── */}
      <Box
        sx={{
          mb: 3,
          p: 2,
          border: `1px solid ${sf.sf_borderLight}`,
          bgcolor: sf.sf_sectionBg,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <Typography
            variant="caption"
            sx={{
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontSize: "0.72rem",
              fontWeight: 700,
              color: sf.sf_textSecondary,
            }}
          >
            Modeled Cost Assumptions
          </Typography>
          <Chip
            label="MODELED — not sourced from repo data"
            size="small"
            sx={{
              fontSize: "0.65rem",
              height: 18,
              bgcolor: "warning.light",
              color: "warning.dark",
              fontWeight: 600,
            }}
          />
          <Button
            size="small"
            onClick={() => setAssumptions({ ...DEFAULT_ASSUMPTIONS })}
            sx={{
              ml: "auto",
              fontSize: "0.7rem",
              textTransform: "none",
              color: sf.sf_textTertiary,
            }}
          >
            Reset to defaults
          </Button>
        </Box>
        <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
          <AssumptionField
            label="Origination cost / loan"
            value={assumptions.originationCostPerLoan}
            onChange={(v) =>
              setAssumptions((a) => ({ ...a, originationCostPerLoan: v }))
            }
            helpText="One-time cost applied to every loan in scope, regardless of date range."
          />
          <AssumptionField
            label="Servicing cost / loan / month"
            value={assumptions.servicingCostPerLoanPerMonth}
            onChange={(v) =>
              setAssumptions((a) => ({ ...a, servicingCostPerLoanPerMonth: v }))
            }
            helpText="Recurring monthly administrative cost applied across the full date range."
          />
          <AssumptionField
            label="Funding cost rate (%)"
            value={assumptions.fundingCostRatePct}
            onChange={(v) =>
              setAssumptions((a) => ({ ...a, fundingCostRatePct: v }))
            }
            helpText="Annual rate (%) applied to the outstanding balance for the proportion of the year covered by the date range."
          />
          <AssumptionField
            label="Credit cost factor (%)"
            value={assumptions.creditCostFactorPct}
            onChange={(v) =>
              setAssumptions((a) => ({ ...a, creditCostFactorPct: v }))
            }
            helpText="Percentage of the arrears amount treated as an impairment / credit cost provision."
          />
        </Stack>
      </Box>

      {/* ── KPI blocks ──────────────────────────────────────────────────── */}
      {kpis && (
        <Grid container spacing={1.5} sx={{ mb: 3 }}>
          {[
            { label: "Loans in Scope", value: kpis.count.toLocaleString() },
            {
              label: "Outstanding Principal",
              value: fmtMoney(kpis.outstandingBalance),
              sub: "Active exposure",
            },
            {
              label: "Interest Collected",
              value: fmtMoney(kpis.interestCollected),
              color: "success.main",
              sub: "In range",
            },
            {
              label: "Fees Collected",
              value: fmtMoney(kpis.feesCollected),
              sub: "In range",
            },
            {
              label: "Penalties Collected",
              value: fmtMoney(kpis.penaltiesCollected),
              sub: "In range",
            },
            {
              label: "Total Realized Income",
              value: fmtMoney(kpis.realizedIncome),
              color: "primary.main",
              sub: "Interest + fees + penalties",
              tooltip:
                "Actual payment allocations from transaction data. This is sourced data.",
            },
            {
              label: "Modeled Cost Total",
              value: fmtMoney(kpis.modeledCost),
              color: "warning.main",
              sub: "From assumptions above",
              tooltip:
                "Derived from client-side assumption inputs — not sourced from repo fields.",
            },
            {
              label: "Net Profit Proxy",
              value: fmtMoney(kpis.netProfit),
              color: kpis.netProfit < 0 ? "error.main" : "success.main",
              sub: "Realized income − modeled cost",
              tooltip:
                "Modeled output — deduct assumptions from actual income. Not a ledger figure.",
            },
            {
              label: "Avg Net Profit / Loan",
              value: fmtMoney(kpis.avgNetProfit),
              color: kpis.avgNetProfit < 0 ? "error.main" : "success.main",
              tooltip: "Net profit proxy divided by number of loans in scope.",
            },
          ].map((k) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={k.label}>
              <KpiBlock {...k} />
            </Grid>
          ))}
        </Grid>
      )}

      {loanRows.length > 0 && (
        <>
          <Divider sx={{ mb: 3, borderColor: sf.sf_borderLight }} />

          {/* ── Monthly trend chart ────────────────────────────────────── */}
          {monthlyTrend.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="caption"
                sx={{
                  textTransform: "uppercase",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  color: sf.sf_textSecondary,
                  display: "block",
                  mb: 1,
                }}
              >
                Monthly Trend — Realized Income vs Modeled Costs vs Net Profit
                Proxy
              </Typography>
              <Box
                sx={{
                  border: `1px solid ${sf.sf_borderLight}`,
                  bgcolor: sf.sf_cardBg,
                  p: 1,
                }}
              >
                <BarChart
                  dataset={monthlyTrend}
                  xAxis={[{ scaleType: "band", dataKey: "label" }]}
                  series={[
                    {
                      dataKey: "realizedIncome",
                      label: "Realized Income",
                      color: "#1976d2",
                    },
                    {
                      dataKey: "modeledCost",
                      label: "Modeled Cost",
                      color: "#ed6c02",
                    },
                    {
                      dataKey: "netProfit",
                      label: "Net Profit Proxy",
                      color: "#2e7d32",
                    },
                  ]}
                  height={260}
                  margin={{ top: 10, right: 20, bottom: 50, left: 70 }}
                  slotProps={{ legend: { hidden: false } }}
                />
              </Box>
            </Box>
          )}

          <Divider sx={{ mb: 3, borderColor: sf.sf_borderLight }} />

          {/* ── Ranked rollups ────────────────────────────────────────── */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="caption"
              sx={{
                textTransform: "uppercase",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
                color: sf.sf_textSecondary,
                display: "block",
                mb: 1,
              }}
            >
              Ranked Rollups
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              sx={{ mb: 1.5 }}
              flexWrap="wrap"
              useFlexGap
            >
              {[
                { key: "product", label: "By Product" },
                { key: "officer", label: "By Officer" },
                { key: "status", label: "By Status" },
                ...(scope?.isAdmin
                  ? [{ key: "branch", label: "By Branch" }]
                  : []),
              ].map((tab) => (
                <Button
                  key={tab.key}
                  size="small"
                  onClick={() => setRollupTab(tab.key)}
                  sx={pillSx(rollupTab === tab.key)}
                >
                  {tab.label}
                </Button>
              ))}
            </Stack>
            <RollupTable
              rows={rollupConfig[rollupTab]?.rows || []}
              labelField={rollupConfig[rollupTab]?.labelField || "label"}
              labelHeader={rollupConfig[rollupTab]?.labelHeader || ""}
            />
          </Box>

          <Divider sx={{ mb: 3, borderColor: sf.sf_borderLight }} />

          {/* ── Loan-level detail grid ─────────────────────────────────── */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                textTransform: "uppercase",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
                color: sf.sf_textSecondary,
                display: "block",
                mb: 1,
              }}
            >
              Loan Detail
            </Typography>

            {/* Exception view tabs */}
            <Stack
              direction="row"
              spacing={1}
              sx={{ mb: 1.5 }}
              flexWrap="wrap"
              useFlexGap
            >
              {[
                { key: "all", label: `All (${loanRows.length})` },
                { key: "top", label: "Top 20 Profit" },
                { key: "bottom", label: "Bottom 20 Profit" },
                { key: "negative", label: "Negative Profit" },
                { key: "written_off", label: "Written-Off / Weak" },
              ].map((tab) => (
                <Button
                  key={tab.key}
                  size="small"
                  onClick={() => setExceptionTab(tab.key)}
                  sx={pillSx(exceptionTab === tab.key)}
                >
                  {tab.label}
                </Button>
              ))}
            </Stack>

            {/* Filters */}
            <Stack
              direction="row"
              spacing={1.5}
              sx={{ mb: 1.5 }}
              flexWrap="wrap"
              useFlexGap
              alignItems="center"
            >
              <TextField
                size="small"
                placeholder="Search borrower or loan #"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 16 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 240 }}
              />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {statuses.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s === "ALL" ? "All Statuses" : STATUS_LABELS[s] || s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Product</InputLabel>
                <Select
                  value={productFilter}
                  label="Product"
                  onChange={(e) => setProductFilter(e.target.value)}
                >
                  {products.map((p) => (
                    <MenuItem key={p} value={p}>
                      {p === "ALL" ? "All Products" : p}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Officer</InputLabel>
                <Select
                  value={officerFilter}
                  label="Officer"
                  onChange={(e) => setOfficerFilter(e.target.value)}
                >
                  {officers.map((o) => (
                    <MenuItem key={o} value={o}>
                      {o === "ALL" ? "All Officers" : o}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography variant="caption" sx={{ color: sf.sf_textTertiary }}>
                {filteredRows.length} rows
              </Typography>
            </Stack>

            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{
                borderColor: sf.sf_borderLight,
                maxHeight: 480,
                overflow: "auto",
              }}
            >
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow sx={{ bgcolor: sf.sf_sectionBg }}>
                    {[
                      {
                        key: "borrowerDisplayName",
                        label: "Borrower",
                        numeric: false,
                      },
                      { key: "loanNumber", label: "Loan #", numeric: false },
                      { key: "branchName", label: "Branch", numeric: false },
                      {
                        key: "loanOfficerDisplayName",
                        label: "Officer",
                        numeric: false,
                      },
                      {
                        key: "loanProductName",
                        label: "Product",
                        numeric: false,
                      },
                      {
                        key: "displayStatusLabel",
                        label: "Status",
                        numeric: false,
                      },
                      { key: "startDate", label: "Date Taken", numeric: false },
                      {
                        key: "maturityDate",
                        label: "Maturity",
                        numeric: false,
                      },
                      {
                        key: "loanBalanceAmount",
                        label: "Balance",
                        numeric: true,
                      },
                      { key: "arrearsAmount", label: "Arrears", numeric: true },
                      {
                        key: "interestCollected",
                        label: "Interest",
                        numeric: true,
                      },
                      { key: "feesCollected", label: "Fees", numeric: true },
                      {
                        key: "penaltiesCollected",
                        label: "Penalties",
                        numeric: true,
                      },
                      {
                        key: "realizedIncome",
                        label: "Realized Income",
                        numeric: true,
                      },
                      {
                        key: "modeledCost",
                        label: "Modeled Cost*",
                        numeric: true,
                      },
                      { key: "netProfit", label: "Net Profit*", numeric: true },
                      { key: "band", label: "Band", numeric: false },
                    ].map((col) => (
                      <TableCell
                        key={col.key}
                        align={col.numeric ? "right" : "left"}
                        sortDirection={sortField === col.key ? sortDir : false}
                        sx={{
                          fontWeight: 700,
                          textTransform: "uppercase",
                          fontSize: "0.68rem",
                          whiteSpace: "nowrap",
                          bgcolor: sf.sf_sectionBg,
                        }}
                      >
                        {col.numeric ? (
                          <TableSortLabel
                            active={sortField === col.key}
                            direction={sortField === col.key ? sortDir : "desc"}
                            onClick={() => handleSort(col.key)}
                          >
                            {col.label}
                          </TableSortLabel>
                        ) : (
                          col.label
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRows.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={17}
                        align="center"
                        sx={{ color: "text.secondary", py: 3 }}
                      >
                        No loans match the current filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRows.map((r) => (
                      <TableRow key={r.id} hover>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          {r.borrowerDisplayName}
                        </TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          {r.loanNumber}
                        </TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          {r.branchName}
                        </TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          {r.loanOfficerDisplayName}
                        </TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          {r.loanProductName}
                        </TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          {r.displayStatusLabel}
                        </TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          {r.startDateFmt}
                        </TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          {r.maturityDateFmt}
                        </TableCell>
                        <TableCell align="right">
                          {fmtMoney(r.loanBalanceAmount)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            color:
                              r.arrearsAmount > 0 ? "warning.main" : undefined,
                          }}
                        >
                          {fmtMoney(r.arrearsAmount)}
                        </TableCell>
                        <TableCell align="right">
                          {fmtMoney(r.interestCollected)}
                        </TableCell>
                        <TableCell align="right">
                          {fmtMoney(r.feesCollected)}
                        </TableCell>
                        <TableCell align="right">
                          {fmtMoney(r.penaltiesCollected)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          {fmtMoney(r.realizedIncome)}
                        </TableCell>
                        <TableCell align="right" sx={{ color: "warning.main" }}>
                          {fmtMoney(r.modeledCost)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            fontWeight: 700,
                            color:
                              r.netProfit < 0 ? "error.main" : "success.main",
                          }}
                        >
                          {fmtMoney(r.netProfit)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={r.band}
                            size="small"
                            sx={{
                              fontSize: "0.65rem",
                              height: 18,
                              bgcolor:
                                r.band === "High"
                                  ? "success.light"
                                  : r.band === "Medium"
                                    ? "info.light"
                                    : r.band === "Low"
                                      ? "warning.light"
                                      : r.band === "Negative"
                                        ? "error.light"
                                        : "action.hover",
                              color:
                                r.band === "High"
                                  ? "success.dark"
                                  : r.band === "Medium"
                                    ? "info.dark"
                                    : r.band === "Low"
                                      ? "warning.dark"
                                      : r.band === "Negative"
                                        ? "error.dark"
                                        : "text.secondary",
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography
              variant="caption"
              sx={{ color: sf.sf_textTertiary, mt: 0.5, display: "block" }}
            >
              * Modeled Cost and Net Profit Proxy are client-side estimates
              derived from the assumption inputs above — they are not sourced
              from repo ledger or cost-of-funds data.
            </Typography>
          </Box>
        </>
      )}
    </ReportShell>
  );
}
