/**
 * Repayment Schedules Report — /reports/repayment-schedules
 *
 * Provides forward-looking installment-level schedule visibility for payment
 * forecasting and cash planning.
 *
 * Schedule resolution strategy:
 *   Primary:  `nextDueDate` + `amountDueAmount` from LoanSummary for immediate
 *             KPIs and the near-term forecast. This is always available and fast.
 *   Extended: For the installment-detail table, the report fetches the raw
 *             `loanComputationRecord` for each active loan via the
 *             GET_REPORT_LOAN_SOURCE_QUERY and calls `resolveLoanSchedule` from
 *             statementHelpers. Installments with a dueDate beyond today are kept
 *             as the forward-looking schedule rows. This enrichment is isolated to
 *             this component and not spread to other screens.
 *
 * Limitations:
 *   - Loans without a `loanComputationRecord` or persisted schedule rows will
 *     show only the next-due summary row derived from LoanSummary.
 *   - Legacy loans with no computation record fall back to a single "next due"
 *     row per loan.
 */

import React, { useState, useMemo, useContext, useCallback } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  TableSortLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { generateClient } from "aws-amplify/api";
import { UserContext } from "../../App";
import ReportShell from "./ReportShell";
import { useReportData } from "./useReportData";
import { useSnapshotPersistence } from "./useSnapshotPersistence";
import {
  parseReportDate,
  fmtMoney,
  fmtReportDate,
  toCsv,
  downloadFile,
  safeNum,
} from "./reportUtils";
import { REPORT_TYPES } from "./reportRegistry";
import { LOAN_DISPLAY_STATUS } from "../../Models/Loans/loanSummaryProjection";
import { resolveLoanSchedule } from "../../Models/Loans/LoanStatements/statementHelpers";
import { GET_REPORT_LOAN_SOURCE_QUERY } from "./reportLoanData";

const ACTIVE_STATUSES = new Set([
  LOAN_DISPLAY_STATUS.CURRENT.code,
  LOAN_DISPLAY_STATUS.MISSED_PAYMENT.code,
  LOAN_DISPLAY_STATUS.OVERDUE.code,
]);

const HORIZON_OPTIONS = [
  { label: "Next 7 days", days: 7 },
  { label: "Next 30 days", days: 30 },
  { label: "Next 60 days", days: 60 },
  { label: "Next 90 days", days: 90 },
  { label: "Next 180 days", days: 180 },
];

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function KpiCard({ label, value, color }) {
  return (
    <Card
      variant="outlined"
      sx={{ height: "100%", border: "1px solid", borderColor: "divider" }}
    >
      <CardContent>
        <Typography variant="caption" color="text.secondary" display="block">
          {label}
        </Typography>
        <Typography
          variant="h5"
          fontWeight="bold"
          color={color || "text.primary"}
          sx={{ mt: 0.5 }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

/**
 * Build a simplified "next installment" row from a LoanSummary record.
 * Used when full schedule data is not available.
 */
function summaryToInstallmentRow(s) {
  if (!s.nextDueDate) return null;
  return {
    id: `${s.id}-next`,
    loanId: s.loanID || s.id,
    loanNumber: s.loanNumber || "—",
    borrowerDisplayName: s.borrowerDisplayName || "—",
    branchID: s.branchID,
    loanOfficerDisplayName: s.loanOfficerDisplayName || "—",
    dueDate: s.nextDueDate,
    installmentNumber: null,
    principalDue: 0,
    interestDue: 0,
    feesDue: 0,
    penaltyDue: 0,
    totalDue: safeNum(s.amountDueAmount),
    source: "summary",
    displayStatus: s.displayStatus,
    loanProductName: s.loanProductName || "—",
  };
}

/**
 * Build installment rows from a full raw loan object using resolveLoanSchedule.
 * Keeps all schedule rows so the selected date window can filter them client-side.
 */
function loanToScheduleRows(loan, summary) {
  const schedule = resolveLoanSchedule(loan);

  const scheduleRows = schedule
    .filter((inst) => {
      if (!inst?.dueDate) return false;
      return !Number.isNaN(new Date(inst.dueDate).getTime());
    })
    .map((inst, idx) => ({
      id: `${summary.id}-inst-${idx}`,
      loanId: summary.loanID || summary.id,
      loanNumber: summary.loanNumber || "—",
      borrowerDisplayName: summary.borrowerDisplayName || "—",
      branchID: summary.branchID,
      loanOfficerDisplayName: summary.loanOfficerDisplayName || "—",
      dueDate: inst.dueDate,
      installmentNumber: inst.installmentNumber ?? inst.number ?? null,
      principalDue: safeNum(inst.principalDue),
      interestDue: safeNum(inst.interestDue),
      feesDue: safeNum(inst.feesDue),
      penaltyDue: safeNum(inst.penaltyDue ?? 0),
      totalDue: safeNum(
        inst.totalDue ??
          safeNum(inst.principalDue) +
            safeNum(inst.interestDue) +
            safeNum(inst.feesDue) +
            safeNum(inst.penaltyDue ?? 0),
      ),
      source: "schedule",
      displayStatus: summary.displayStatus,
      loanProductName: summary.loanProductName || "—",
    }));

  return scheduleRows;
}

const DETAIL_COLS = [
  { key: "dueDate", label: "Due Date" },
  { key: "loanNumber", label: "Loan #" },
  { key: "borrowerDisplayName", label: "Borrower" },
  { key: "loanOfficerDisplayName", label: "Officer" },
  { key: "installmentNumber", label: "Inst #" },
  { key: "principalDue", label: "Principal" },
  { key: "interestDue", label: "Interest" },
  { key: "feesDue", label: "Fees" },
  { key: "penaltyDue", label: "Penalty" },
  { key: "totalDue", label: "Total Due" },
];

export default function RepaymentSchedulesReport() {
  const { userDetails } = useContext(UserContext);

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const defaultEndDate = addDays(today, 30).toISOString().slice(0, 10);

  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [horizonDays, setHorizonDays] = useState(30);
  const [search, setSearch] = useState("");
  const [officerFilter, setOfficerFilter] = useState("ALL");
  const [sortKey, setSortKey] = useState("dueDate");
  const [sortDir, setSortDir] = useState("asc");
  const [scheduleRows, setScheduleRows] = useState(null); // null = not loaded; [] = loaded
  const [scheduleLoading, setScheduleLoading] = useState(false);

  const { summaries, branches, loading, error, refresh, scope } = useReportData(
    {
      selectedBranchId,
    },
  );
  const { saveSnapshot, saving, lastSavedAt, saveError } =
    useSnapshotPersistence();

  const branchMap = useMemo(() => {
    const m = {};
    branches.forEach((b) => {
      if (b?.id) m[b.id] = b.name || b.id;
    });
    return m;
  }, [branches]);

  const windowStart = useMemo(
    () => parseReportDate(startDate) || parseReportDate(todayStr) || new Date(),
    [startDate, todayStr],
  );

  const windowEnd = useMemo(
    () =>
      parseReportDate(endDate, { endOfDay: true }) ||
      parseReportDate(defaultEndDate, { endOfDay: true }) ||
      addDays(windowStart, horizonDays),
    [defaultEndDate, endDate, horizonDays, windowStart],
  );

  // Active loans only
  const activeLoans = useMemo(
    () => summaries.filter((s) => ACTIVE_STATUSES.has(s?.displayStatus)),
    [summaries],
  );

  // Unique officers for filter dropdown
  const officers = useMemo(() => {
    const set = new Set(
      activeLoans.map((s) => s.loanOfficerDisplayName).filter(Boolean),
    );
    return ["ALL", ...Array.from(set).sort()];
  }, [activeLoans]);

  // KPIs from LoanSummary nextDueDate
  const kpis = useMemo(() => {
    const horizon7 = addDays(windowStart, 7);
    const horizon30 = addDays(windowStart, 30);
    const first7End = horizon7 < windowEnd ? horizon7 : windowEnd;
    const first30End = horizon30 < windowEnd ? horizon30 : windowEnd;

    const due7 = activeLoans.filter((s) => {
      if (!s.nextDueDate) return false;
      const d = new Date(s.nextDueDate);
      return d >= windowStart && d <= first7End;
    });
    const due30 = activeLoans.filter((s) => {
      if (!s.nextDueDate) return false;
      const d = new Date(s.nextDueDate);
      return d >= windowStart && d <= first30End;
    });
    const expectedDue30 = due30.reduce(
      (acc, s) => acc + safeNum(s.amountDueAmount),
      0,
    );

    return {
      due7Count: due7.length,
      due7Amount: due7.reduce((acc, s) => acc + safeNum(s.amountDueAmount), 0),
      due30Count: due30.length,
      due30Amount: expectedDue30,
    };
  }, [activeLoans, windowEnd, windowStart]);

  // Forecast summary grouped by week from nextDueDate
  const forecastByWeek = useMemo(() => {
    const map = {};

    activeLoans.forEach((s) => {
      if (!s.nextDueDate) return;
      const d = new Date(s.nextDueDate);
      if (d < windowStart || d > windowEnd) return;

      // Week key: Monday of that week
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - ((d.getDay() + 6) % 7));
      const key = weekStart.toISOString().slice(0, 10);
      if (!map[key]) map[key] = { weekOf: key, count: 0, totalDue: 0 };
      map[key].count++;
      map[key].totalDue += safeNum(s.amountDueAmount);
    });

    return Object.values(map).sort((a, b) => a.weekOf.localeCompare(b.weekOf));
  }, [activeLoans, windowEnd, windowStart]);

  // Load full schedules for active loans
  const loadFullSchedules = useCallback(async () => {
    setScheduleLoading(true);
    setScheduleRows(null);
    try {
      const client = generateClient();
      const rows = [];
      const toFetch = activeLoans;

      for (const summary of toFetch) {
        try {
          const result = await client.graphql({
            query: GET_REPORT_LOAN_SOURCE_QUERY,
            variables: { id: summary.loanID || summary.id },
          });
          const loan = result?.data?.getLoan;
          if (!loan) {
            const fallback = summaryToInstallmentRow(summary);
            if (fallback) rows.push(fallback);
            continue;
          }
          const instRows = loanToScheduleRows(loan, summary);
          if (instRows.length > 0) {
            rows.push(...instRows);
          } else {
            const fallback = summaryToInstallmentRow(summary);
            if (fallback) rows.push(fallback);
          }
        } catch {
          const fallback = summaryToInstallmentRow(summary);
          if (fallback) rows.push(fallback);
        }
      }
      setScheduleRows(rows);
    } catch (err) {
      console.error("[RepaymentSchedulesReport] schedule load error:", err);
      setScheduleRows([]);
    } finally {
      setScheduleLoading(false);
    }
  }, [activeLoans]);

  // Display rows: use full schedule if loaded, otherwise next-due summaries
  const displayRows = useMemo(() => {
    const base =
      scheduleRows !== null
        ? scheduleRows
        : activeLoans
            .filter((s) => {
              if (!s.nextDueDate) return false;
              const d = new Date(s.nextDueDate);
              return d >= windowStart && d <= windowEnd;
            })
            .map(summaryToInstallmentRow)
            .filter(Boolean);

    return base.filter((r) => {
      if (!r?.dueDate) return false;
      const dueDate = new Date(r.dueDate);
      if (dueDate < windowStart || dueDate > windowEnd) return false;
      if (officerFilter !== "ALL" && r.loanOfficerDisplayName !== officerFilter)
        return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !(r.loanNumber || "").toLowerCase().includes(q) &&
          !(r.borrowerDisplayName || "").toLowerCase().includes(q) &&
          !(r.loanOfficerDisplayName || "").toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [
    scheduleRows,
    activeLoans,
    officerFilter,
    search,
    windowEnd,
    windowStart,
  ]);

  const sorted = useMemo(
    () =>
      [...displayRows].sort((a, b) => {
        let av = a[sortKey] ?? "";
        let bv = b[sortKey] ?? "";
        if (
          [
            "principalDue",
            "interestDue",
            "feesDue",
            "penaltyDue",
            "totalDue",
          ].includes(sortKey)
        ) {
          av = safeNum(a[sortKey]);
          bv = safeNum(b[sortKey]);
        }
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      }),
    [displayRows, sortKey, sortDir],
  );

  function handleSort(key) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function handleExportCsv() {
    const csv = toCsv(
      sorted.map((r) => ({
        ...r,
        dueDate: fmtReportDate(r.dueDate),
        principalDue: safeNum(r.principalDue).toFixed(2),
        interestDue: safeNum(r.interestDue).toFixed(2),
        feesDue: safeNum(r.feesDue).toFixed(2),
        penaltyDue: safeNum(r.penaltyDue).toFixed(2),
        totalDue: safeNum(r.totalDue).toFixed(2),
      })),
      DETAIL_COLS,
    );
    downloadFile(csv, `repayment_schedules_${horizonDays}d.csv`, "text/csv");
  }

  async function handleSaveSnapshot() {
    const payload = {
      kpis,
      forecastByWeek,
      horizonDays,
      scheduleSource:
        scheduleRows !== null
          ? "resolveLoanSchedule + summary fallback"
          : "LoanSummary.nextDueDate",
      generatedAt: new Date().toISOString(),
      dateWindow: { startDate, endDate },
    };
    await saveSnapshot({
      reportType: REPORT_TYPES.REPAYMENT_SCHEDULES,
      reportName: `Repayment Schedules — Next ${horizonDays} days`,
      startDate,
      endDate,
      branchId: selectedBranchId || scope?.branchId || null,
      reportData: payload,
    });
  }

  return (
    <ReportShell
      title="Loan Repayment Schedules"
      description="Forward-looking installment schedule for payment forecasting and cash planning."
      isAdmin={scope?.isAdmin}
      branches={branches}
      selectedBranchId={selectedBranchId}
      onBranchChange={(v) => {
        setSelectedBranchId(v);
        setScheduleRows(null);
      }}
      startDate={startDate}
      endDate={endDate}
      onStartDateChange={setStartDate}
      onEndDateChange={setEndDate}
      onRefresh={() => {
        refresh();
        setScheduleRows(null);
      }}
      loading={loading || scheduleLoading}
      loadError={error}
      onSaveSnapshot={handleSaveSnapshot}
      saving={saving}
      lastSavedAt={lastSavedAt}
      saveError={saveError}
      onExportCsv={handleExportCsv}
    >
      {/* Horizon selector */}
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Forecast Horizon</InputLabel>
          <Select
            value={horizonDays}
            label="Forecast Horizon"
            onChange={(e) => {
              const nextDays = e.target.value;
              const baseStart =
                parseReportDate(startDate) ||
                parseReportDate(todayStr) ||
                new Date();
              setHorizonDays(nextDays);
              setEndDate(
                addDays(baseStart, nextDays).toISOString().slice(0, 10),
              );
            }}
          >
            {HORIZON_OPTIONS.map((o) => (
              <MenuItem key={o.days} value={o.days}>
                {o.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Chip
          label={
            scheduleRows !== null
              ? "Full schedules loaded"
              : "Using next-due dates from summaries"
          }
          size="small"
          color={scheduleRows !== null ? "success" : "default"}
          onClick={
            scheduleRows === null && !scheduleLoading
              ? loadFullSchedules
              : undefined
          }
          sx={{ cursor: scheduleRows === null ? "pointer" : "default" }}
        />
        {scheduleLoading && <LinearProgress sx={{ width: 120 }} />}
      </Box>

      {/* KPIs */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: "Due in First 7 Days", value: kpis.due7Count },
          {
            label: "Expected Due in First 7 Days",
            value: fmtMoney(kpis.due7Amount),
          },
          { label: "Due in First 30 Days", value: kpis.due30Count },
          {
            label: "Expected Due in First 30 Days",
            value: fmtMoney(kpis.due30Amount),
          },
        ].map((k) => (
          <Grid item xs={12} sm={6} md={3} key={k.label}>
            <KpiCard {...k} />
          </Grid>
        ))}
      </Grid>

      {/* Weekly forecast summary */}
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
        Weekly Forecast — {startDate} to {endDate}
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Week of</TableCell>
              <TableCell align="right">Loans Due</TableCell>
              <TableCell align="right">Expected Total Due</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {forecastByWeek.map((row) => (
              <TableRow key={row.weekOf} hover>
                <TableCell>{fmtReportDate(row.weekOf)}</TableCell>
                <TableCell align="right">{row.count}</TableCell>
                <TableCell align="right">{fmtMoney(row.totalDue)}</TableCell>
              </TableRow>
            ))}
            {forecastByWeek.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  align="center"
                  sx={{ color: "text.secondary", py: 2 }}
                >
                  No upcoming payments in the selected date window.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Detail table filters */}
      <Box sx={{ mb: 1, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          size="small"
          placeholder="Search loan #, borrower, officer…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
        <FormControl size="small" sx={{ minWidth: 180 }}>
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
      </Box>

      {/* Installment detail table */}
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
        Installment Detail ({sorted.length} rows)
      </Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              {DETAIL_COLS.map((col) => (
                <TableCell
                  key={col.key}
                  align={
                    [
                      "principalDue",
                      "interestDue",
                      "feesDue",
                      "penaltyDue",
                      "totalDue",
                    ].includes(col.key)
                      ? "right"
                      : "left"
                  }
                >
                  <TableSortLabel
                    active={sortKey === col.key}
                    direction={sortKey === col.key ? sortDir : "asc"}
                    onClick={() => handleSort(col.key)}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sorted.slice(0, 500).map((r) => (
              <TableRow key={r.id} hover>
                <TableCell>{fmtReportDate(r.dueDate)}</TableCell>
                <TableCell>{r.loanNumber}</TableCell>
                <TableCell>{r.borrowerDisplayName}</TableCell>
                <TableCell>{r.loanOfficerDisplayName}</TableCell>
                <TableCell align="center">
                  {r.installmentNumber ?? "—"}
                </TableCell>
                <TableCell align="right">
                  {r.principalDue > 0 ? fmtMoney(r.principalDue) : "—"}
                </TableCell>
                <TableCell align="right">
                  {r.interestDue > 0 ? fmtMoney(r.interestDue) : "—"}
                </TableCell>
                <TableCell align="right">
                  {r.feesDue > 0 ? fmtMoney(r.feesDue) : "—"}
                </TableCell>
                <TableCell align="right">
                  {r.penaltyDue > 0 ? fmtMoney(r.penaltyDue) : "—"}
                </TableCell>
                <TableCell align="right">
                  <strong>{fmtMoney(r.totalDue)}</strong>
                </TableCell>
              </TableRow>
            ))}
            {sorted.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={DETAIL_COLS.length}
                  align="center"
                  sx={{ color: "text.secondary", py: 3 }}
                >
                  No installments found for the selected horizon and filters.
                </TableCell>
              </TableRow>
            )}
            {sorted.length > 500 && (
              <TableRow>
                <TableCell
                  colSpan={DETAIL_COLS.length}
                  align="center"
                  sx={{ color: "text.secondary" }}
                >
                  Showing 500 of {sorted.length}. Export CSV for full data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </ReportShell>
  );
}
