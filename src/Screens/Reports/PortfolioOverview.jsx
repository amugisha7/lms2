/**
 * Portfolio Overview Report
 *
 * KPIs: total loans, active loans, total principal, outstanding balance, arrears,
 *       total collected, pct with missed installments.
 * Status breakdown, branch rollup (admin), near-term watchlists, detailed table.
 *
 * Loan status treatment:
 *   - WRITTEN_OFF and VOIDED are excluded from active portfolio KPIs (shown separately).
 *   - CLOSED loans are excluded from active KPIs but counted in totals.
 *   - Active = CURRENT, CURRENT_WITH_MISSED_PAYMENT, OVERDUE
 */

import React, { useState, useMemo, useContext } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { UserContext } from "../../App";
import ReportShell from "./ReportShell";
import { useReportData } from "./useReportData";
import { useSnapshotPersistence } from "./useSnapshotPersistence";
import {
  filterSummariesByDateWindow,
  fmtMoney,
  fmtReportDate,
  fmtPct,
  toCsv,
  downloadFile,
  safeNum,
} from "./reportUtils";
import { REPORT_TYPES } from "./reportRegistry";
import { LOAN_DISPLAY_STATUS } from "../../Models/Loans/loanSummaryProjection";

const ACTIVE_STATUS_CODES = new Set([
  LOAN_DISPLAY_STATUS.CURRENT.code,
  LOAN_DISPLAY_STATUS.MISSED_PAYMENT.code,
  LOAN_DISPLAY_STATUS.OVERDUE.code,
]);

const EXCLUDED_FROM_ACTIVE = new Set([
  LOAN_DISPLAY_STATUS.WRITTEN_OFF.code,
  LOAN_DISPLAY_STATUS.VOIDED.code,
  LOAN_DISPLAY_STATUS.CLOSED.code,
]);

function isActiveLoan(s) {
  return ACTIVE_STATUS_CODES.has(s?.displayStatus);
}

function kpiCardSx() {
  return {
    height: "100%",
    p: 0,
    border: "1px solid",
    borderColor: "divider",
  };
}

function KpiCard({ label, value, sub, color }) {
  return (
    <Card variant="outlined" sx={kpiCardSx()}>
      <CardContent>
        <Typography variant="caption" color="text.secondary" display="block">
          {label}
        </Typography>
        <Typography
          variant="h6"
          fontWeight={700}
          color={color || "text.primary"}
        >
          {value}
        </Typography>
        {sub && (
          <Typography variant="caption" color="text.secondary">
            {sub}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

const PORTFOLIO_TABLE_COLUMNS = [
  { key: "borrowerDisplayName", label: "Borrower" },
  { key: "loanNumber", label: "Loan #" },
  { key: "branchName", label: "Branch" },
  { key: "loanOfficerDisplayName", label: "Loan Officer" },
  { key: "displayStatus", label: "Status" },
  { key: "principalAmountFmt", label: "Principal" },
  { key: "loanBalanceAmountFmt", label: "Balance" },
  { key: "arrearsAmountFmt", label: "Arrears" },
  { key: "totalPaidAmountFmt", label: "Total Paid" },
  { key: "nextDueDateFmt", label: "Next Due" },
  { key: "lastPaymentDateFmt", label: "Last Payment" },
];

function statusChipColor(code) {
  if (code === "CURRENT") return "success";
  if (code === "OVERDUE") return "error";
  if (code === "CURRENT_WITH_MISSED_PAYMENT") return "warning";
  if (code === "CLOSED") return "default";
  if (code === "WRITTEN_OFF") return "error";
  if (code === "VOIDED") return "default";
  return "default";
}

export default function PortfolioOverview() {
  const { userDetails } = useContext(UserContext);
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState("borrowerDisplayName");
  const [orderDir, setOrderDir] = useState("asc");

  const { summaries, branches, loading, error, refresh, scope, lastFetchedAt } =
    useReportData({ selectedBranchId });

  const { saveSnapshot, saving, lastSavedAt, saveError } =
    useSnapshotPersistence();

  const currencyCode = userDetails?.institution?.currencyCode || "";

  // Filter by date window
  const windowSummaries = useMemo(
    () => filterSummariesByDateWindow(summaries, startDate, endDate),
    [summaries, startDate, endDate],
  );

  // Active portfolio (excludes CLOSED, WRITTEN_OFF, VOIDED)
  const activeSummaries = useMemo(
    () => windowSummaries.filter(isActiveLoan),
    [windowSummaries],
  );

  // KPI computations
  const kpis = useMemo(() => {
    const total = windowSummaries.length;
    const active = activeSummaries.length;
    const totalPrincipal = activeSummaries.reduce(
      (s, r) => s + safeNum(r.principalAmount),
      0,
    );
    const totalBalance = activeSummaries.reduce(
      (s, r) => s + safeNum(r.loanBalanceAmount),
      0,
    );
    const totalArrears = activeSummaries.reduce(
      (s, r) => s + safeNum(r.arrearsAmount),
      0,
    );
    const totalPaid = activeSummaries.reduce(
      (s, r) => s + safeNum(r.totalPaidAmount),
      0,
    );
    const missedCount = activeSummaries.filter(
      (r) => safeNum(r.missedInstallmentCount) > 0,
    ).length;
    const missedPct = active > 0 ? (missedCount / active) * 100 : 0;

    return {
      total,
      active,
      totalPrincipal,
      totalBalance,
      totalArrears,
      totalPaid,
      missedCount,
      missedPct,
    };
  }, [windowSummaries, activeSummaries]);

  // Status breakdown
  const statusBreakdown = useMemo(() => {
    const map = {};
    windowSummaries.forEach((s) => {
      const code = s.displayStatus || "UNKNOWN";
      if (!map[code]) map[code] = { code, count: 0, balance: 0 };
      map[code].count += 1;
      map[code].balance += safeNum(s.loanBalanceAmount);
    });
    return Object.values(map).sort((a, b) => b.count - a.count);
  }, [windowSummaries]);

  // Branch rollup (admin only)
  const branchRollup = useMemo(() => {
    if (!scope.isAdmin) return [];
    const map = {};
    activeSummaries.forEach((s) => {
      const id = s.branchID || "unknown";
      if (!map[id]) {
        const branch = branches.find((b) => b.id === id);
        map[id] = {
          branchId: id,
          branchName: branch?.name || s.branchID || "Unknown",
          loanCount: 0,
          outstandingBalance: 0,
          arrearsAmount: 0,
          missedCount: 0,
          overdueCount: 0,
        };
      }
      map[id].loanCount += 1;
      map[id].outstandingBalance += safeNum(s.loanBalanceAmount);
      map[id].arrearsAmount += safeNum(s.arrearsAmount);
      if (safeNum(s.missedInstallmentCount) > 0) map[id].missedCount += 1;
      if (s.displayStatus === LOAN_DISPLAY_STATUS.OVERDUE.code)
        map[id].overdueCount += 1;
    });
    return Object.values(map).sort(
      (a, b) => b.outstandingBalance - a.outstandingBalance,
    );
  }, [activeSummaries, branches, scope.isAdmin]);

  const today = useMemo(() => new Date(), []);
  const in7Days = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 7);
    return d;
  }, [today]);

  // Watchlists
  const upcomingDue = useMemo(
    () =>
      activeSummaries
        .filter((s) => {
          if (!s.nextDueDate) return false;
          const d = new Date(s.nextDueDate);
          return d >= today && d <= in7Days;
        })
        .slice(0, 10),
    [activeSummaries, today, in7Days],
  );

  const noRecentPayment = useMemo(
    () =>
      activeSummaries
        .filter((s) => {
          if (!s.lastPaymentDate) return true; // never paid
          const diff =
            (today - new Date(s.lastPaymentDate)) / (1000 * 60 * 60 * 24);
          return diff >= 30;
        })
        .sort(
          (a, b) => safeNum(b.loanBalanceAmount) - safeNum(a.loanBalanceAmount),
        )
        .slice(0, 10),
    [activeSummaries, today],
  );

  const largestBalances = useMemo(
    () =>
      [...activeSummaries]
        .sort(
          (a, b) => safeNum(b.loanBalanceAmount) - safeNum(a.loanBalanceAmount),
        )
        .slice(0, 10),
    [activeSummaries],
  );

  // Enriched table rows
  const tableRows = useMemo(
    () =>
      activeSummaries.map((s) => ({
        ...s,
        branchName:
          branches.find((b) => b.id === s.branchID)?.name || s.branchID || "—",
        principalAmountFmt: fmtMoney(s.principalAmount, currencyCode),
        loanBalanceAmountFmt: fmtMoney(s.loanBalanceAmount, currencyCode),
        arrearsAmountFmt: fmtMoney(s.arrearsAmount, currencyCode),
        totalPaidAmountFmt: fmtMoney(s.totalPaidAmount, currencyCode),
        nextDueDateFmt: fmtReportDate(s.nextDueDate),
        lastPaymentDateFmt: fmtReportDate(s.lastPaymentDate),
      })),
    [activeSummaries, branches, currencyCode],
  );

  // Filtered + sorted table
  const filteredRows = useMemo(() => {
    const q = search.toLowerCase();
    let rows = q
      ? tableRows.filter(
          (r) =>
            (r.borrowerDisplayName || "").toLowerCase().includes(q) ||
            (r.loanNumber || "").toLowerCase().includes(q) ||
            (r.branchName || "").toLowerCase().includes(q),
        )
      : tableRows;

    return [...rows].sort((a, b) => {
      const av = a[orderBy] ?? "";
      const bv = b[orderBy] ?? "";
      const cmp = String(av).localeCompare(String(bv), undefined, {
        numeric: true,
      });
      return orderDir === "asc" ? cmp : -cmp;
    });
  }, [tableRows, search, orderBy, orderDir]);

  const handleSort = (col) => {
    if (orderBy === col) {
      setOrderDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setOrderBy(col);
      setOrderDir("asc");
    }
  };

  const handleExportCsv = () => {
    const csv = toCsv(filteredRows, PORTFOLIO_TABLE_COLUMNS);
    downloadFile(csv, "portfolio_overview.csv", "text/csv");
  };

  const handleExportJson = () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      startDate,
      endDate,
      kpis,
      statusBreakdown,
      branchRollup,
    };
    downloadFile(
      JSON.stringify(payload, null, 2),
      "portfolio_overview.json",
      "application/json",
    );
  };

  const handleSaveSnapshot = async () => {
    const payload = { kpis, statusBreakdown, branchRollup };
    await saveSnapshot({
      reportType: REPORT_TYPES.PORTFOLIO_OVERVIEW,
      reportName: "Loan Portfolio Overview",
      startDate,
      endDate,
      branchId: selectedBranchId || scope.branchId,
      reportData: payload,
      customDetails: {
        startDate,
        endDate,
        selectedBranchId,
        generatedAt: new Date().toISOString(),
      },
    });
  };

  return (
    <ReportShell
      title="Portfolio Overview"
      description="Executive summary of portfolio health, arrears concentration, and branch performance."
      isAdmin={scope.isAdmin}
      branches={branches}
      selectedBranchId={selectedBranchId}
      onBranchChange={(v) => setSelectedBranchId(v || null)}
      startDate={startDate}
      endDate={endDate}
      onStartDateChange={setStartDate}
      onEndDateChange={setEndDate}
      onRefresh={refresh}
      loading={loading}
      onSaveSnapshot={handleSaveSnapshot}
      saving={saving}
      lastSavedAt={lastSavedAt}
      onExportCsv={handleExportCsv}
      onExportJson={handleExportJson}
      loadError={error}
      saveError={saveError}
    >
      {/* KPI Cards */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
        Key Metrics
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4} md={3}>
          <KpiCard label="Total Loans (in scope)" value={kpis.total} />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <KpiCard label="Active Loans" value={kpis.active} />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <KpiCard
            label="Total Principal Disbursed"
            value={fmtMoney(kpis.totalPrincipal)}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <KpiCard
            label="Total Outstanding Balance"
            value={fmtMoney(kpis.totalBalance)}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <KpiCard
            label="Total Arrears"
            value={fmtMoney(kpis.totalArrears)}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <KpiCard
            label="Total Collected"
            value={fmtMoney(kpis.totalPaid)}
            color="success.main"
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <KpiCard
            label="% with Missed Installments"
            value={fmtPct(kpis.missedPct)}
            sub={`${kpis.missedCount} of ${kpis.active} active loans`}
            color={kpis.missedPct > 10 ? "error.main" : "text.primary"}
          />
        </Grid>
      </Grid>

      {/* Status Breakdown */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
        Status Breakdown
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
        {statusBreakdown.map((s) => (
          <Box
            key={s.code}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              px: 1.5,
              py: 1,
              minWidth: 140,
            }}
          >
            <Chip
              label={s.code}
              size="small"
              color={statusChipColor(s.code)}
              sx={{ mb: 0.5 }}
            />
            <Typography variant="body2" fontWeight={600}>
              {s.count} loans
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Balance: {fmtMoney(s.balance)}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Branch Rollup – admin only */}
      {scope.isAdmin && branchRollup.length > 0 && (
        <>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
            Branch Rollup
          </Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Branch</TableCell>
                  <TableCell align="right">Loans</TableCell>
                  <TableCell align="right">Outstanding Balance</TableCell>
                  <TableCell align="right">Arrears</TableCell>
                  <TableCell align="right">Missed Inst.</TableCell>
                  <TableCell align="right">Overdue</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {branchRollup.map((r) => (
                  <TableRow key={r.branchId} hover>
                    <TableCell>{r.branchName}</TableCell>
                    <TableCell align="right">{r.loanCount}</TableCell>
                    <TableCell align="right">
                      {fmtMoney(r.outstandingBalance)}
                    </TableCell>
                    <TableCell align="right">
                      {fmtMoney(r.arrearsAmount)}
                    </TableCell>
                    <TableCell align="right">{r.missedCount}</TableCell>
                    <TableCell align="right">{r.overdueCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Watchlists */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
        Watchlists
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Upcoming due within 7 days */}
        <Grid item xs={12} md={4}>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
            Due in Next 7 Days ({upcomingDue.length})
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Borrower</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell align="right">Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {upcomingDue.map((s) => (
                  <TableRow key={s.id} hover>
                    <TableCell
                      sx={{
                        maxWidth: 120,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {s.borrowerDisplayName || "—"}
                    </TableCell>
                    <TableCell>{fmtReportDate(s.nextDueDate)}</TableCell>
                    <TableCell align="right">
                      {fmtMoney(s.loanBalanceAmount)}
                    </TableCell>
                  </TableRow>
                ))}
                {upcomingDue.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Typography variant="caption" color="text.secondary">
                        None
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* No recent payment */}
        <Grid item xs={12} md={4}>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
            No Payment in 30+ Days ({noRecentPayment.length})
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Borrower</TableCell>
                  <TableCell>Last Payment</TableCell>
                  <TableCell align="right">Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {noRecentPayment.map((s) => (
                  <TableRow key={s.id} hover>
                    <TableCell
                      sx={{
                        maxWidth: 120,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {s.borrowerDisplayName || "—"}
                    </TableCell>
                    <TableCell>{fmtReportDate(s.lastPaymentDate)}</TableCell>
                    <TableCell align="right">
                      {fmtMoney(s.loanBalanceAmount)}
                    </TableCell>
                  </TableRow>
                ))}
                {noRecentPayment.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Typography variant="caption" color="text.secondary">
                        None
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Largest balances */}
        <Grid item xs={12} md={4}>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
            Largest Balances
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Borrower</TableCell>
                  <TableCell align="right">Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {largestBalances.map((s) => (
                  <TableRow key={s.id} hover>
                    <TableCell
                      sx={{
                        maxWidth: 150,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {s.borrowerDisplayName || "—"}
                    </TableCell>
                    <TableCell align="right">
                      {fmtMoney(s.loanBalanceAmount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Detailed Portfolio Table */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
        Detailed Portfolio
      </Typography>
      <Box sx={{ mb: 1 }}>
        <TextField
          placeholder="Search borrower, loan number, branch…"
          size="small"
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
      </Box>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {PORTFOLIO_TABLE_COLUMNS.map((col) => (
                <TableCell key={col.key}>
                  <TableSortLabel
                    active={orderBy === col.key}
                    direction={orderBy === col.key ? orderDir : "asc"}
                    onClick={() => handleSort(col.key)}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={PORTFOLIO_TABLE_COLUMNS.length}
                  align="center"
                >
                  <Typography variant="caption" color="text.secondary">
                    {loading ? "Loading…" : "No records found."}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {filteredRows.map((row) => (
              <TableRow key={row.id} hover>
                {PORTFOLIO_TABLE_COLUMNS.map((col) => (
                  <TableCell key={col.key}>
                    {col.key === "displayStatus" ? (
                      <Chip
                        label={row.displayStatus || "—"}
                        size="small"
                        color={statusChipColor(row.displayStatus)}
                      />
                    ) : (
                      (row[col.key] ?? "—")
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ReportShell>
  );
}
