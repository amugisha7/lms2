/**
 * Delinquency Report
 *
 * Delinquency definition:
 *   - missedInstallmentCount > 0
 *   - OR displayStatus is CURRENT_WITH_MISSED_PAYMENT or OVERDUE
 *
 * daysPastDue is derived from nextDueDate. If nextDueDate is null, the field is null
 * (no invented number). Such loans are still included if their displayStatus indicates
 * a missed payment state.
 *
 * Urgency scoring: see delinquencyHelpers.js
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
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { UserContext } from "../../App";
import ReportShell from "./ReportShell";
import { useReportData } from "./useReportData";
import { useSnapshotPersistence } from "./useSnapshotPersistence";
import {
  filterSummariesByDateWindow,
  getReportAsOfDate,
  fmtMoney,
  fmtReportDate,
  toCsv,
  downloadFile,
  safeNum,
} from "./reportUtils";
import { REPORT_TYPES } from "./reportRegistry";
import { LOAN_DISPLAY_STATUS } from "../../Models/Loans/loanSummaryProjection";
import { computeDaysPastDue } from "./agingHelpers";
import { computeUrgencyScore, getUrgencyBand } from "./delinquencyHelpers";

const DELINQUENT_STATUSES = new Set([
  LOAN_DISPLAY_STATUS.MISSED_PAYMENT.code,
  LOAN_DISPLAY_STATUS.OVERDUE.code,
]);

function isDelinquent(s) {
  return (
    safeNum(s.missedInstallmentCount) > 0 ||
    DELINQUENT_STATUSES.has(s.displayStatus)
  );
}

function KpiCard({ label, value, color }) {
  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
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
      </CardContent>
    </Card>
  );
}

const TABLE_COLUMNS = [
  { key: "borrowerDisplayName", label: "Borrower" },
  { key: "loanNumber", label: "Loan #" },
  { key: "branchName", label: "Branch" },
  { key: "loanOfficerDisplayName", label: "Loan Officer" },
  { key: "nextDueDateFmt", label: "Next Due" },
  { key: "daysPastDueFmt", label: "Days Past Due" },
  { key: "missedInstallmentCount", label: "Missed Inst." },
  { key: "arrearsAmountFmt", label: "Arrears" },
  { key: "loanBalanceAmountFmt", label: "Balance" },
  { key: "lastPaymentDateFmt", label: "Last Payment" },
  { key: "urgencyLabel", label: "Urgency" },
  { key: "urgencyScore", label: "Score" },
];

export default function DelinquencyReport() {
  const { userDetails } = useContext(UserContext);
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");
  const [filterBranch, setFilterBranch] = useState("all");
  const [filterOfficer, setFilterOfficer] = useState("all");
  const [filterUrgency, setFilterUrgency] = useState("all");
  const [orderBy, setOrderBy] = useState("urgencyScore");
  const [orderDir, setOrderDir] = useState("desc");

  const { summaries, branches, loading, error, refresh, scope } = useReportData(
    {
      selectedBranchId,
    },
  );
  const { saveSnapshot, saving, lastSavedAt, saveError } =
    useSnapshotPersistence();
  const currencyCode = userDetails?.institution?.currencyCode || "";
  const reportDate = useMemo(() => getReportAsOfDate(endDate), [endDate]);

  const windowSummaries = useMemo(
    () => filterSummariesByDateWindow(summaries, startDate, endDate),
    [summaries, startDate, endDate],
  );

  // Enrich delinquent rows
  const delinquentRows = useMemo(() => {
    const delinquent = windowSummaries.filter(isDelinquent);
    return delinquent.map((s) => {
      const dpd = computeDaysPastDue(s, reportDate);
      const enriched = { ...s, daysPastDue: dpd };
      const score = computeUrgencyScore(enriched, reportDate);
      const band = getUrgencyBand(score);
      const branch = branches.find((b) => b.id === s.branchID);
      return {
        ...enriched,
        branchName: branch?.name || s.branchID || "—",
        daysPastDueFmt: dpd !== null ? String(dpd) : "N/A",
        arrearsAmountFmt: fmtMoney(s.arrearsAmount, currencyCode),
        loanBalanceAmountFmt: fmtMoney(s.loanBalanceAmount, currencyCode),
        nextDueDateFmt: fmtReportDate(s.nextDueDate),
        lastPaymentDateFmt: fmtReportDate(s.lastPaymentDate),
        urgencyScore: score,
        urgencyLabel: band.label,
        urgencyColor: band.color,
      };
    });
  }, [windowSummaries, branches, currencyCode, reportDate]);

  // KPIs
  const kpis = useMemo(() => {
    const count = delinquentRows.length;
    const totalArrears = delinquentRows.reduce(
      (s, r) => s + safeNum(r.arrearsAmount),
      0,
    );
    const totalBalance = delinquentRows.reduce(
      (s, r) => s + safeNum(r.loanBalanceAmount),
      0,
    );
    const avgArrears = count > 0 ? totalArrears / count : 0;
    const noPayment30 = delinquentRows.filter((r) => {
      if (!r.lastPaymentDate) return true;
      return (
        (reportDate - new Date(r.lastPaymentDate)) / (1000 * 60 * 60 * 24) >= 30
      );
    }).length;
    return { count, totalArrears, totalBalance, avgArrears, noPayment30 };
  }, [delinquentRows, reportDate]);

  // Distinct loan officers for filter
  const officers = useMemo(() => {
    const set = new Set(
      delinquentRows.map((r) => r.loanOfficerDisplayName).filter(Boolean),
    );
    return Array.from(set).sort();
  }, [delinquentRows]);

  // Filtered + sorted rows
  const filteredRows = useMemo(() => {
    const q = search.toLowerCase();
    let rows = delinquentRows;
    if (q)
      rows = rows.filter(
        (r) =>
          (r.borrowerDisplayName || "").toLowerCase().includes(q) ||
          (r.loanNumber || "").toLowerCase().includes(q),
      );
    if (filterBranch !== "all")
      rows = rows.filter((r) => r.branchID === filterBranch);
    if (filterOfficer !== "all")
      rows = rows.filter((r) => r.loanOfficerDisplayName === filterOfficer);
    if (filterUrgency !== "all")
      rows = rows.filter((r) => r.urgencyLabel === filterUrgency);

    return [...rows].sort((a, b) => {
      const av = a[orderBy] ?? "";
      const bv = b[orderBy] ?? "";
      const isNum = typeof av === "number" && typeof bv === "number";
      const cmp = isNum
        ? av - bv
        : String(av).localeCompare(String(bv), undefined, { numeric: true });
      return orderDir === "asc" ? cmp : -cmp;
    });
  }, [
    delinquentRows,
    search,
    filterBranch,
    filterOfficer,
    filterUrgency,
    orderBy,
    orderDir,
  ]);

  const handleSort = (col) => {
    if (orderBy === col) setOrderDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setOrderBy(col);
      setOrderDir("desc");
    }
  };

  const handleExportCsv = () => {
    const csv = toCsv(filteredRows, TABLE_COLUMNS);
    downloadFile(csv, "delinquency_report.csv", "text/csv");
  };

  const handleSaveSnapshot = async () => {
    const payload = { kpis, rowCount: delinquentRows.length };
    await saveSnapshot({
      reportType: REPORT_TYPES.DELINQUENCY,
      reportName: "Delinquency Report",
      startDate,
      endDate,
      branchId: selectedBranchId || scope.branchId,
      reportData: payload,
      customDetails: {
        startDate,
        endDate,
        selectedBranchId,
        generatedAt: new Date().toISOString(),
        delinquencyDefinition:
          "missedInstallmentCount > 0 OR displayStatus in [CURRENT_WITH_MISSED_PAYMENT, OVERDUE]",
        urgencyFormula:
          "40% DPD + 30% missed installments + 20% arrears amount + 10% payment inactivity",
      },
    });
  };

  // Operational summaries
  const topByBalance = useMemo(
    () =>
      [...delinquentRows]
        .sort(
          (a, b) => safeNum(b.loanBalanceAmount) - safeNum(a.loanBalanceAmount),
        )
        .slice(0, 5),
    [delinquentRows],
  );

  const oldestUnpaid = useMemo(
    () =>
      [...delinquentRows]
        .filter((r) => r.daysPastDue !== null)
        .sort((a, b) => safeNum(b.daysPastDue) - safeNum(a.daysPastDue))
        .slice(0, 5),
    [delinquentRows],
  );

  const repeatedMissed = useMemo(
    () =>
      [...delinquentRows]
        .filter((r) => safeNum(r.missedInstallmentCount) >= 3)
        .sort(
          (a, b) =>
            safeNum(b.missedInstallmentCount) -
            safeNum(a.missedInstallmentCount),
        )
        .slice(0, 5),
    [delinquentRows],
  );

  return (
    <ReportShell
      title="Delinquency Report"
      description="Collections worklist prioritized by urgency. Delinquent loans only."
      isAdmin={scope.isAdmin}
      branches={branches}
      selectedBranchId={selectedBranchId}
      onBranchChange={(v) => setSelectedBranchId(v || null)}
      startDate={startDate}
      endDate={endDate}
      onStartDateChange={setStartDate}
      onEndDateChange={setEndDate}
      showDateFilters={false}
      onRefresh={refresh}
      loading={loading}
      onSaveSnapshot={handleSaveSnapshot}
      saving={saving}
      lastSavedAt={lastSavedAt}
      onExportCsv={handleExportCsv}
      loadError={error}
      saveError={saveError}
    >
      {/* KPI Cards */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
        Delinquency Summary
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4} md={2.4}>
          <KpiCard
            label="Delinquent Loans"
            value={kpis.count}
            color="error.main"
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          <KpiCard
            label="Total Arrears"
            value={fmtMoney(kpis.totalArrears)}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          <KpiCard
            label="Delinquent Balance"
            value={fmtMoney(kpis.totalBalance)}
            color="error.main"
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          <KpiCard
            label="Avg Arrears / Loan"
            value={fmtMoney(kpis.avgArrears)}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          <KpiCard
            label="No Payment in 30+ Days"
            value={kpis.noPayment30}
            color={kpis.noPayment30 > 0 ? "error.main" : "text.primary"}
          />
        </Grid>
      </Grid>

      {/* Operational Summaries */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
        Operational Highlights
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
            Top Delinquent Balances
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
                {topByBalance.map((r) => (
                  <TableRow key={r.id} hover>
                    <TableCell>{r.borrowerDisplayName || "—"}</TableCell>
                    <TableCell align="right">
                      {fmtMoney(r.loanBalanceAmount)}
                    </TableCell>
                  </TableRow>
                ))}
                {topByBalance.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
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
        <Grid item xs={12} md={4}>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
            Oldest Unpaid (by DPD)
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Borrower</TableCell>
                  <TableCell align="right">DPD</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {oldestUnpaid.map((r) => (
                  <TableRow key={r.id} hover>
                    <TableCell>{r.borrowerDisplayName || "—"}</TableCell>
                    <TableCell align="right">{r.daysPastDueFmt}</TableCell>
                  </TableRow>
                ))}
                {oldestUnpaid.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
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
        <Grid item xs={12} md={4}>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
            Repeated Missed (≥ 3 installments)
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Borrower</TableCell>
                  <TableCell align="right">Missed</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {repeatedMissed.map((r) => (
                  <TableRow key={r.id} hover>
                    <TableCell>{r.borrowerDisplayName || "—"}</TableCell>
                    <TableCell align="right">
                      {r.missedInstallmentCount}
                    </TableCell>
                  </TableRow>
                ))}
                {repeatedMissed.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
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
      </Grid>

      {/* Filters */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
        Collections Worklist
      </Typography>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{ mb: 2, flexWrap: "wrap" }}
      >
        <TextField
          placeholder="Search borrower or loan #…"
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
          sx={{ minWidth: 220 }}
        />
        {scope.isAdmin && (
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Branch</InputLabel>
            <Select
              value={filterBranch}
              label="Branch"
              onChange={(e) => setFilterBranch(e.target.value)}
            >
              <MenuItem value="all">All Branches</MenuItem>
              {branches.map((b) => (
                <MenuItem key={b.id} value={b.id}>
                  {b.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Loan Officer</InputLabel>
          <Select
            value={filterOfficer}
            label="Loan Officer"
            onChange={(e) => setFilterOfficer(e.target.value)}
          >
            <MenuItem value="all">All Officers</MenuItem>
            {officers.map((o) => (
              <MenuItem key={o} value={o}>
                {o}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>Urgency</InputLabel>
          <Select
            value={filterUrgency}
            label="Urgency"
            onChange={(e) => setFilterUrgency(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="Critical">Critical</MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {TABLE_COLUMNS.map((col) => (
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
                <TableCell colSpan={TABLE_COLUMNS.length} align="center">
                  <Typography variant="caption" color="text.secondary">
                    {loading ? "Loading…" : "No delinquent loans found."}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {filteredRows.map((row) => (
              <TableRow key={row.id} hover>
                {TABLE_COLUMNS.map((col) => (
                  <TableCell key={col.key}>
                    {col.key === "urgencyLabel" ? (
                      <Chip
                        label={row.urgencyLabel}
                        size="small"
                        color={row.urgencyColor || "default"}
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
