/**
 * Aging Analysis Report
 *
 * Classifies loans into aging buckets based on days past due.
 * Bucket definitions live in agingHelpers.js and are shared with PAR and Provisions.
 *
 * Current / not past due → included in bucket summary but excluded from at-risk totals.
 * Loans with no nextDueDate → placed in Current bucket.
 */

import React, { useState, useMemo, useContext } from "react";
import {
  Box,
  Typography,
  Grid,
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
  LinearProgress,
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
import {
  AGING_BUCKETS,
  buildAgingSummary,
  enrichSummariesWithAging,
} from "./agingHelpers";

// Loans eligible for aging analysis = not voided, not draft
const EXCLUDED_STATUSES = new Set(["VOIDED"]);
function isEligible(s) {
  return (
    !EXCLUDED_STATUSES.has(s?.displayStatus) &&
    !EXCLUDED_STATUSES.has(s?.lifecycleStatus)
  );
}

const BUCKET_COLORS = {
  current: "success",
  dpd_1_30: "warning",
  dpd_31_60: "warning",
  dpd_61_90: "error",
  dpd_91_180: "error",
  dpd_181: "error",
};

const DETAIL_COLUMNS = [
  { key: "borrowerDisplayName", label: "Borrower" },
  { key: "loanNumber", label: "Loan #" },
  { key: "branchName", label: "Branch" },
  { key: "loanOfficerDisplayName", label: "Loan Officer" },
  { key: "displayStatus", label: "Status" },
  { key: "nextDueDateFmt", label: "Next Due" },
  { key: "daysPastDueFmt", label: "DPD" },
  { key: "agingBucketLabel", label: "Aging Bucket" },
  { key: "arrearsAmountFmt", label: "Arrears" },
  { key: "loanBalanceAmountFmt", label: "Balance" },
  { key: "lastPaymentDateFmt", label: "Last Payment" },
];

export default function AgingAnalysis() {
  const { userDetails } = useContext(UserContext);
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");
  const [filterBranch, setFilterBranch] = useState("all");
  const [filterOfficer, setFilterOfficer] = useState("all");
  const [filterBucket, setFilterBucket] = useState("all");
  const [orderBy, setOrderBy] = useState("daysPastDue");
  const [orderDir, setOrderDir] = useState("desc");

  const { summaries, branches, loading, error, refresh, scope } = useReportData(
    {
      selectedBranchId,
    },
  );
  const { saveSnapshot, saving, lastSavedAt, saveError } =
    useSnapshotPersistence();
  const currencyCode = userDetails?.institution?.currencyCode || "";
  const today = useMemo(() => new Date(), []);

  const windowSummaries = useMemo(
    () =>
      filterSummariesByDateWindow(summaries, startDate, endDate).filter(
        isEligible,
      ),
    [summaries, startDate, endDate],
  );

  // Bucket summary totals
  const bucketSummary = useMemo(
    () => buildAgingSummary(windowSummaries, today),
    [windowSummaries, today],
  );

  // Enriched detail rows
  const detailRows = useMemo(() => {
    const enriched = enrichSummariesWithAging(windowSummaries, today);
    return enriched.map((s) => {
      const branch = branches.find((b) => b.id === s.branchID);
      return {
        ...s,
        branchName: branch?.name || s.branchID || "—",
        daysPastDueFmt: s.daysPastDue !== null ? String(s.daysPastDue) : "N/A",
        arrearsAmountFmt: fmtMoney(s.arrearsAmount, currencyCode),
        loanBalanceAmountFmt: fmtMoney(s.loanBalanceAmount, currencyCode),
        nextDueDateFmt: fmtReportDate(s.nextDueDate),
        lastPaymentDateFmt: fmtReportDate(s.lastPaymentDate),
      };
    });
  }, [windowSummaries, branches, currencyCode, today]);

  // Branch rollup by bucket (admin only)
  const branchBucketRollup = useMemo(() => {
    if (!scope.isAdmin) return [];
    const map = {};
    detailRows.forEach((r) => {
      const bid = r.branchID || "unknown";
      if (!map[bid]) {
        map[bid] = { branchName: r.branchName, branchId: bid };
        AGING_BUCKETS.forEach((b) => {
          map[bid][b.key] = 0;
        });
      }
      map[bid][r.agingBucketKey] = (map[bid][r.agingBucketKey] || 0) + 1;
    });
    return Object.values(map).sort((a, b) =>
      a.branchName.localeCompare(b.branchName),
    );
  }, [detailRows, scope.isAdmin]);

  // Distinct loan officers
  const officers = useMemo(() => {
    const set = new Set(
      detailRows.map((r) => r.loanOfficerDisplayName).filter(Boolean),
    );
    return Array.from(set).sort();
  }, [detailRows]);

  // Filtered + sorted detail
  const filteredRows = useMemo(() => {
    const q = search.toLowerCase();
    let rows = detailRows;
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
    if (filterBucket !== "all")
      rows = rows.filter((r) => r.agingBucketKey === filterBucket);

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
    detailRows,
    search,
    filterBranch,
    filterOfficer,
    filterBucket,
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
    const csv = toCsv(filteredRows, DETAIL_COLUMNS);
    downloadFile(csv, "aging_analysis.csv", "text/csv");
  };

  const handleSaveSnapshot = async () => {
    const payload = { bucketSummary, branchBucketRollup };
    await saveSnapshot({
      reportType: REPORT_TYPES.AGING_ANALYSIS,
      reportName: "Aging Analysis Report",
      startDate,
      endDate,
      branchId: selectedBranchId || scope.branchId,
      reportData: payload,
      customDetails: {
        startDate,
        endDate,
        selectedBranchId,
        generatedAt: new Date().toISOString(),
        buckets: AGING_BUCKETS.map((b) => b.label),
      },
    });
  };

  // Total at-risk (all non-current buckets)
  const totalAtRisk = useMemo(
    () =>
      bucketSummary
        .filter((b) => b.key !== "current")
        .reduce((s, b) => s + b.outstandingBalance, 0),
    [bucketSummary],
  );

  return (
    <ReportShell
      title="Aging Analysis"
      description="Distributes loans into delinquency age bands. Shared bucket logic is also used by PAR and Provisions reports."
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
      loadError={error}
      saveError={saveError}
    >
      {/* Bucket Summary */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
        Bucket Summary
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Aging Bucket</TableCell>
              <TableCell align="right">Loans</TableCell>
              <TableCell align="right">Outstanding Balance</TableCell>
              <TableCell align="right">Arrears</TableCell>
              <TableCell align="right">Share of At-Risk</TableCell>
              <TableCell sx={{ width: 120 }}>Distribution</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bucketSummary.map((b) => (
              <TableRow key={b.key} hover>
                <TableCell>
                  <Chip
                    label={b.label}
                    size="small"
                    color={BUCKET_COLORS[b.key] || "default"}
                  />
                </TableCell>
                <TableCell align="right">{b.loanCount}</TableCell>
                <TableCell align="right">
                  {fmtMoney(b.outstandingBalance)}
                </TableCell>
                <TableCell align="right">{fmtMoney(b.arrearsAmount)}</TableCell>
                <TableCell align="right">
                  {b.key === "current" ? "—" : fmtPct(b.shareOfTotalAtRisk)}
                </TableCell>
                <TableCell>
                  {b.key !== "current" && totalAtRisk > 0 && (
                    <LinearProgress
                      variant="determinate"
                      value={b.shareOfTotalAtRisk}
                      color={BUCKET_COLORS[b.key] || "primary"}
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Branch rollup (admin) */}
      {scope.isAdmin && branchBucketRollup.length > 0 && (
        <>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
            Branch Rollup by Bucket (Loan Counts)
          </Typography>
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{ mb: 3, overflowX: "auto" }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Branch</TableCell>
                  {AGING_BUCKETS.map((b) => (
                    <TableCell key={b.key} align="right">
                      {b.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {branchBucketRollup.map((r) => (
                  <TableRow key={r.branchId} hover>
                    <TableCell>{r.branchName}</TableCell>
                    {AGING_BUCKETS.map((b) => (
                      <TableCell key={b.key} align="right">
                        {r[b.key] || 0}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Detail table */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
        Loan Detail
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
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Bucket</InputLabel>
          <Select
            value={filterBucket}
            label="Bucket"
            onChange={(e) => setFilterBucket(e.target.value)}
          >
            <MenuItem value="all">All Buckets</MenuItem>
            {AGING_BUCKETS.map((b) => (
              <MenuItem key={b.key} value={b.key}>
                {b.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {DETAIL_COLUMNS.map((col) => (
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
                <TableCell colSpan={DETAIL_COLUMNS.length} align="center">
                  <Typography variant="caption" color="text.secondary">
                    {loading ? "Loading…" : "No records."}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {filteredRows.map((row) => (
              <TableRow key={row.id} hover>
                {DETAIL_COLUMNS.map((col) => (
                  <TableCell key={col.key}>
                    {col.key === "displayStatus" ? (
                      <Chip label={row.displayStatus || "—"} size="small" />
                    ) : col.key === "agingBucketLabel" ? (
                      <Chip
                        label={row.agingBucketLabel}
                        size="small"
                        color={BUCKET_COLORS[row.agingBucketKey] || "default"}
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
