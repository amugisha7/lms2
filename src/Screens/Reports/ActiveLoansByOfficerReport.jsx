/**
 * Active Loans by Officer Report — /reports/active-loans-by-officer
 *
 * Measures officer workload, portfolio quality per officer, and accountability.
 *
 * Active loan definition:
 *   CURRENT, CURRENT_WITH_MISSED_PAYMENT, OVERDUE.
 *   CLOSED, VOIDED, and WRITTEN_OFF are excluded.
 *
 * Officer identity:
 *   Primary: loanOfficerID + loanOfficerDisplayName from LoanSummary.
 *   Fallback: "Unknown" when both are absent (rare; a data-entry gap on source loans).
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { UserContext } from "../../App";
import ReportShell from "./ReportShell";
import { useReportData } from "./useReportData";
import { useSnapshotPersistence } from "./useSnapshotPersistence";
import {
  fmtMoney,
  fmtReportDate,
  toCsv,
  downloadFile,
  safeNum,
} from "./reportUtils";
import { REPORT_TYPES } from "./reportRegistry";
import { LOAN_DISPLAY_STATUS } from "../../Models/Loans/loanSummaryProjection";
import {
  groupByOfficer,
  OFFICER_ACTIVE_STATUSES,
  DELINQUENT_STATUSES,
} from "./officerHelpers";

function KpiCard({ label, value, sub, color }) {
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
        {sub && (
          <Typography variant="caption" color="text.secondary">
            {sub}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

const OFFICER_TABLE_COLS = [
  { key: "officerName", label: "Officer" },
  { key: "activeCount", label: "Active Loans" },
  { key: "totalBalance", label: "Outstanding Balance" },
  { key: "totalArrears", label: "Total Arrears" },
  { key: "delinquentCount", label: "Delinquent" },
  { key: "overdueCount", label: "Overdue" },
  { key: "avgBalance", label: "Avg Balance" },
];

const DETAIL_COLS = [
  { key: "loanOfficerDisplayName", label: "Officer" },
  { key: "borrowerDisplayName", label: "Borrower" },
  { key: "loanNumber", label: "Loan #" },
  { key: "branchName", label: "Branch" },
  { key: "displayStatus", label: "Status" },
  { key: "nextDueDate", label: "Next Due" },
  { key: "missedInstallmentCount", label: "Missed" },
  { key: "arrearsAmount", label: "Arrears" },
  { key: "loanBalanceAmount", label: "Balance" },
];

const STATUS_COLOR_MAP = {
  [LOAN_DISPLAY_STATUS.CURRENT.code]: "success",
  [LOAN_DISPLAY_STATUS.MISSED_PAYMENT.code]: "warning",
  [LOAN_DISPLAY_STATUS.OVERDUE.code]: "error",
};

export default function ActiveLoansByOfficerReport() {
  const { userDetails } = useContext(UserContext);

  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [search, setSearch] = useState("");
  const [officerFilter, setOfficerFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [delinquencyFilter, setDelinquencyFilter] = useState("ALL");
  const [sortKey, setSortKey] = useState("totalBalance");
  const [sortDir, setSortDir] = useState("desc");
  const [detailSortKey, setDetailSortKey] = useState("arrearsAmount");
  const [detailSortDir, setDetailSortDir] = useState("desc");
  const [selectedOfficer, setSelectedOfficer] = useState(null);

  const { summaries, branches, loading, error, refresh, scope } = useReportData(
    { selectedBranchId },
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

  // Officer summary rows
  const officerRows = useMemo(() => groupByOfficer(summaries), [summaries]);

  // KPI cards
  const kpis = useMemo(() => {
    if (!officerRows.length)
      return {
        officerCount: 0,
        highestBalance: null,
        highestDelinquent: null,
        mostOverloaded: null,
      };
    const highestBalance = officerRows.reduce(
      (max, r) => (r.totalBalance > max.totalBalance ? r : max),
      officerRows[0],
    );
    const highestDelinquent = officerRows.reduce(
      (max, r) => (r.totalArrears > max.totalArrears ? r : max),
      officerRows[0],
    );
    const mostOverloaded = officerRows.reduce(
      (max, r) => (r.activeCount > max.activeCount ? r : max),
      officerRows[0],
    );
    return {
      officerCount: officerRows.length,
      highestBalance,
      highestDelinquent,
      mostOverloaded,
    };
  }, [officerRows]);

  // Sorted officer summary
  const sortedOfficerRows = useMemo(
    () =>
      [...officerRows].sort((a, b) => {
        let av = a[sortKey] ?? 0;
        let bv = b[sortKey] ?? 0;
        if (typeof av === "string") av = av.toLowerCase();
        if (typeof bv === "string") bv = bv.toLowerCase();
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      }),
    [officerRows, sortKey, sortDir],
  );

  function handleOfficerSort(key) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir(key === "officerName" ? "asc" : "desc");
    }
  }

  // Active loans for detail table
  const activeLoans = useMemo(
    () =>
      summaries
        .filter((s) => OFFICER_ACTIVE_STATUSES.has(s?.displayStatus))
        .map((s) => ({
          ...s,
          branchName: branchMap[s.branchID] || s.branchID || "—",
        })),
    [summaries, branchMap],
  );

  // Unique officers list for filter
  const officers = useMemo(() => {
    const set = new Set(
      activeLoans.map((s) => s.loanOfficerDisplayName).filter(Boolean),
    );
    return ["ALL", ...Array.from(set).sort()];
  }, [activeLoans]);

  // Filtered + sorted detail rows
  const filteredDetail = useMemo(() => {
    let rows = activeLoans;
    if (officerFilter !== "ALL" || selectedOfficer) {
      const f = selectedOfficer || officerFilter;
      rows = rows.filter(
        (s) => (s.loanOfficerDisplayName || s.loanOfficerID) === f,
      );
    }
    if (statusFilter !== "ALL")
      rows = rows.filter((s) => s.displayStatus === statusFilter);
    if (delinquencyFilter === "DELINQUENT")
      rows = rows.filter((s) => DELINQUENT_STATUSES.has(s.displayStatus));
    if (delinquencyFilter === "OVERDUE")
      rows = rows.filter(
        (s) => s.displayStatus === LOAN_DISPLAY_STATUS.OVERDUE.code,
      );

    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (s) =>
          (s.borrowerDisplayName || "").toLowerCase().includes(q) ||
          (s.loanNumber || "").toLowerCase().includes(q) ||
          (s.loanOfficerDisplayName || "").toLowerCase().includes(q),
      );
    }
    return [...rows].sort((a, b) => {
      let av = a[detailSortKey] ?? "";
      let bv = b[detailSortKey] ?? "";
      if (
        [
          "arrearsAmount",
          "loanBalanceAmount",
          "missedInstallmentCount",
        ].includes(detailSortKey)
      ) {
        av = safeNum(a[detailSortKey]);
        bv = safeNum(b[detailSortKey]);
      }
      if (av < bv) return detailSortDir === "asc" ? -1 : 1;
      if (av > bv) return detailSortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [
    activeLoans,
    officerFilter,
    selectedOfficer,
    statusFilter,
    delinquencyFilter,
    search,
    detailSortKey,
    detailSortDir,
  ]);

  function handleDetailSort(key) {
    if (detailSortKey === key)
      setDetailSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setDetailSortKey(key);
      setDetailSortDir(
        ["arrearsAmount", "loanBalanceAmount"].includes(key) ? "desc" : "asc",
      );
    }
  }

  function handleExportCsv() {
    const csv = toCsv(
      filteredDetail.map((s) => ({
        ...s,
        arrearsAmount: safeNum(s.arrearsAmount).toFixed(2),
        loanBalanceAmount: safeNum(s.loanBalanceAmount).toFixed(2),
        nextDueDate: fmtReportDate(s.nextDueDate),
      })),
      DETAIL_COLS,
    );
    downloadFile(csv, "active_loans_by_officer.csv", "text/csv");
  }

  async function handleSaveSnapshot() {
    const payload = {
      kpis: {
        officerCount: kpis.officerCount,
        highestBalanceOfficer: kpis.highestBalance?.officerName,
        highestDelinquentOfficer: kpis.highestDelinquent?.officerName,
        mostOverloadedOfficer: kpis.mostOverloaded?.officerName,
      },
      officerSummary: officerRows.map((r) => ({
        officer: r.officerName,
        activeCount: r.activeCount,
        totalBalance: r.totalBalance,
        totalArrears: r.totalArrears,
        delinquentCount: r.delinquentCount,
      })),
      activeDefinition: "CURRENT | CURRENT_WITH_MISSED_PAYMENT | OVERDUE",
      officerGroupField:
        "loanOfficerID + loanOfficerDisplayName from LoanSummary",
      generatedAt: new Date().toISOString(),
    };
    await saveSnapshot({
      reportType: REPORT_TYPES.ACTIVE_LOANS_BY_OFFICER,
      reportName: "Active Loans by Officer",
      startDate,
      endDate,
      branchId: selectedBranchId || scope?.branchId || null,
      reportData: payload,
    });
  }

  return (
    <ReportShell
      title="Active Loans by Officer"
      description="Portfolio workload, quality, and accountability metrics per loan officer."
      isAdmin={scope?.isAdmin}
      branches={branches}
      selectedBranchId={selectedBranchId}
      onBranchChange={setSelectedBranchId}
      startDate={startDate}
      endDate={endDate}
      onStartDateChange={setStartDate}
      onEndDateChange={setEndDate}
      onRefresh={refresh}
      loading={loading}
      loadError={error}
      onSaveSnapshot={handleSaveSnapshot}
      saving={saving}
      lastSavedAt={lastSavedAt}
      saveError={saveError}
      onExportCsv={handleExportCsv}
    >
      {/* KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            label="Officers with Active Loans"
            value={kpis.officerCount}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            label="Highest Active Balance"
            value={
              kpis.highestBalance
                ? fmtMoney(kpis.highestBalance.totalBalance)
                : "—"
            }
            sub={kpis.highestBalance?.officerName}
            color="info.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            label="Highest Delinquent Balance"
            value={
              kpis.highestDelinquent
                ? fmtMoney(kpis.highestDelinquent.totalArrears)
                : "—"
            }
            sub={kpis.highestDelinquent?.officerName}
            color={
              kpis.highestDelinquent?.totalArrears > 0
                ? "error.main"
                : "text.primary"
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            label="Most Overloaded (by count)"
            value={kpis.mostOverloaded ? kpis.mostOverloaded.activeCount : "—"}
            sub={kpis.mostOverloaded?.officerName}
            color="warning.main"
          />
        </Grid>
      </Grid>

      {/* Officer Summary Table */}
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
        Officer Summary
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {OFFICER_TABLE_COLS.map((col) => (
                <TableCell
                  key={col.key}
                  align={col.key === "officerName" ? "left" : "right"}
                >
                  <TableSortLabel
                    active={sortKey === col.key}
                    direction={sortKey === col.key ? sortDir : "asc"}
                    onClick={() => handleOfficerSort(col.key)}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedOfficerRows.map((r) => (
              <TableRow
                key={r.officerId}
                hover
                selected={selectedOfficer === r.officerName}
                onClick={() =>
                  setSelectedOfficer(
                    selectedOfficer === r.officerName ? null : r.officerName,
                  )
                }
                sx={{ cursor: "pointer" }}
              >
                <TableCell>{r.officerName}</TableCell>
                <TableCell align="right">{r.activeCount}</TableCell>
                <TableCell align="right">{fmtMoney(r.totalBalance)}</TableCell>
                <TableCell
                  align="right"
                  sx={{ color: r.totalArrears > 0 ? "error.main" : "inherit" }}
                >
                  {fmtMoney(r.totalArrears)}
                </TableCell>
                <TableCell align="right">{r.delinquentCount}</TableCell>
                <TableCell align="right">{r.overdueCount}</TableCell>
                <TableCell align="right">{fmtMoney(r.avgBalance)}</TableCell>
              </TableRow>
            ))}
            {sortedOfficerRows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={OFFICER_TABLE_COLS.length}
                  align="center"
                  sx={{ color: "text.secondary", py: 3 }}
                >
                  No active loans found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedOfficer && (
        <Chip
          label={`Filtered to: ${selectedOfficer}`}
          onDelete={() => setSelectedOfficer(null)}
          sx={{ mb: 2 }}
          color="primary"
          size="small"
        />
      )}

      {/* Detail Table Filters */}
      <Box sx={{ mb: 1, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          size="small"
          placeholder="Search borrower, loan #, officer…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ width: 280 }}
        />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Officer</InputLabel>
          <Select
            value={officerFilter}
            label="Officer"
            onChange={(e) => {
              setOfficerFilter(e.target.value);
              setSelectedOfficer(null);
            }}
          >
            {officers.map((o) => (
              <MenuItem key={o} value={o}>
                {o === "ALL" ? "All Officers" : o}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Delinquency</InputLabel>
          <Select
            value={delinquencyFilter}
            label="Delinquency"
            onChange={(e) => setDelinquencyFilter(e.target.value)}
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="DELINQUENT">Delinquent</MenuItem>
            <MenuItem value="OVERDUE">Overdue only</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Detail Loan Table */}
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
        Loan Detail ({filteredDetail.length} active loans)
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
                      "arrearsAmount",
                      "loanBalanceAmount",
                      "missedInstallmentCount",
                    ].includes(col.key)
                      ? "right"
                      : "left"
                  }
                >
                  <TableSortLabel
                    active={detailSortKey === col.key}
                    direction={
                      detailSortKey === col.key ? detailSortDir : "asc"
                    }
                    onClick={() => handleDetailSort(col.key)}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDetail.slice(0, 300).map((s) => (
              <TableRow key={s.id} hover>
                <TableCell>{s.loanOfficerDisplayName || "Unknown"}</TableCell>
                <TableCell>{s.borrowerDisplayName || "—"}</TableCell>
                <TableCell>{s.loanNumber || "—"}</TableCell>
                <TableCell>{s.branchName}</TableCell>
                <TableCell>
                  <Chip
                    label={s.displayStatus}
                    size="small"
                    color={STATUS_COLOR_MAP[s.displayStatus] || "default"}
                  />
                </TableCell>
                <TableCell>{fmtReportDate(s.nextDueDate)}</TableCell>
                <TableCell align="right">
                  {safeNum(s.missedInstallmentCount)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color:
                      safeNum(s.arrearsAmount) > 0 ? "error.main" : "inherit",
                  }}
                >
                  {fmtMoney(safeNum(s.arrearsAmount))}
                </TableCell>
                <TableCell align="right">
                  {fmtMoney(safeNum(s.loanBalanceAmount))}
                </TableCell>
              </TableRow>
            ))}
            {filteredDetail.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={DETAIL_COLS.length}
                  align="center"
                  sx={{ color: "text.secondary", py: 3 }}
                >
                  No active loans found for the selected filters.
                </TableCell>
              </TableRow>
            )}
            {filteredDetail.length > 300 && (
              <TableRow>
                <TableCell
                  colSpan={DETAIL_COLS.length}
                  align="center"
                  sx={{ color: "text.secondary" }}
                >
                  Showing 300 of {filteredDetail.length}. Export CSV for full
                  data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </ReportShell>
  );
}
