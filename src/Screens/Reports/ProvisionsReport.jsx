/**
 * Provisions Report
 *
 * Estimates required loan loss reserves by applying provision rates to each aging bucket.
 *
 * Default provisioning matrix (editable in UI, never persisted to backend schema):
 *   Current:      1%
 *   1-30 days:    5%
 *   31-60 days:   15%
 *   61-90 days:   35%
 *   91-180 days:  60%
 *   181+ days:    100%
 *
 * The matrix used for each calculation run is included in the saved snapshot so it is
 * fully auditable.
 *
 * Provision amount per loan = loanBalanceAmount × provision rate for its bucket.
 * The loanBalanceAmount (outstanding balance) is used as the exposure base.
 *
 * Loans in VOIDED status are excluded from scope.
 *
 * Next step if institution-specific persisted policy is needed:
 *   Create an `InstitutionSettings.provisioningMatrix` JSON field or a dedicated
 *   `ProvisionPolicy` model and load it here instead of the default matrix.
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
  Stack,
  Divider,
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
import { AGING_BUCKETS, enrichSummariesWithAging } from "./agingHelpers";

// Default provisioning matrix: bucket key → rate (0–1)
const DEFAULT_PROVISION_MATRIX = {
  current: 0.01,
  dpd_1_30: 0.05,
  dpd_31_60: 0.15,
  dpd_61_90: 0.35,
  dpd_91_180: 0.6,
  dpd_181: 1.0,
};

const EXCLUDED_STATUSES = new Set(["VOIDED"]);
function isEligible(s) {
  return (
    !EXCLUDED_STATUSES.has(s?.displayStatus) &&
    !EXCLUDED_STATUSES.has(s?.lifecycleStatus)
  );
}

/**
 * Pure provision calculation.
 * Returns enriched rows (with provisionAmount) and bucket-level totals.
 */
export function computeProvisions(summaries, matrix, today = new Date()) {
  const eligible = summaries.filter(isEligible);
  const enriched = enrichSummariesWithAging(eligible, today);

  const rows = enriched.map((s) => {
    const rate = matrix[s.agingBucketKey] ?? 0;
    const exposure = safeNum(s.loanBalanceAmount);
    const provisionAmount = exposure * rate;
    return { ...s, provisionRate: rate, provisionAmount };
  });

  // Bucket-level totals
  const bucketTotals = {};
  AGING_BUCKETS.forEach((b) => {
    bucketTotals[b.key] = {
      key: b.key,
      label: b.label,
      rate: matrix[b.key] ?? 0,
      loanCount: 0,
      outstandingBalance: 0,
      provisionAmount: 0,
    };
  });

  rows.forEach((r) => {
    const bucket = bucketTotals[r.agingBucketKey];
    if (!bucket) return;
    bucket.loanCount += 1;
    bucket.outstandingBalance += safeNum(r.loanBalanceAmount);
    bucket.provisionAmount += safeNum(r.provisionAmount);
  });

  const grossBalance = rows.reduce(
    (s, r) => s + safeNum(r.loanBalanceAmount),
    0,
  );
  const totalProvision = rows.reduce(
    (s, r) => s + safeNum(r.provisionAmount),
    0,
  );
  const netPortfolio = grossBalance - totalProvision;

  return {
    rows,
    bucketTotals: AGING_BUCKETS.map((b) => bucketTotals[b.key]),
    grossBalance,
    totalProvision,
    netPortfolio,
  };
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

const DETAIL_COLUMNS = [
  { key: "borrowerDisplayName", label: "Borrower" },
  { key: "loanNumber", label: "Loan #" },
  { key: "branchName", label: "Branch" },
  { key: "agingBucketLabel", label: "Aging Bucket" },
  { key: "daysPastDueFmt", label: "DPD" },
  { key: "displayStatus", label: "Status" },
  { key: "loanBalanceAmountFmt", label: "Exposure" },
  { key: "provisionRatePct", label: "Rate" },
  { key: "provisionAmountFmt", label: "Provision Amt" },
  { key: "nextDueDateFmt", label: "Next Due" },
  { key: "lastPaymentDateFmt", label: "Last Payment" },
];

export default function ProvisionsReport() {
  const { userDetails } = useContext(UserContext);
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState("provisionAmount");
  const [orderDir, setOrderDir] = useState("desc");

  // Editable provisioning matrix (rates stored as percentages in the input, converted to 0-1 internally)
  const [matrixPct, setMatrixPct] = useState(
    Object.fromEntries(
      Object.entries(DEFAULT_PROVISION_MATRIX).map(([k, v]) => [
        k,
        (v * 100).toFixed(0),
      ]),
    ),
  );

  const matrix = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(matrixPct).map(([k, v]) => [k, Number(v) / 100]),
      ),
    [matrixPct],
  );

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
    () => filterSummariesByDateWindow(summaries, startDate, endDate),
    [summaries, startDate, endDate],
  );

  const { rows, bucketTotals, grossBalance, totalProvision, netPortfolio } =
    useMemo(
      () => computeProvisions(windowSummaries, matrix, today),
      [windowSummaries, matrix, today],
    );

  // Enrich display rows
  const detailRows = useMemo(
    () =>
      rows.map((s) => {
        const branch = branches.find((b) => b.id === s.branchID);
        return {
          ...s,
          branchName: branch?.name || s.branchID || "—",
          daysPastDueFmt:
            s.daysPastDue !== null ? String(s.daysPastDue) : "N/A",
          loanBalanceAmountFmt: fmtMoney(s.loanBalanceAmount, currencyCode),
          provisionRatePct: fmtPct(s.provisionRate * 100),
          provisionAmountFmt: fmtMoney(s.provisionAmount, currencyCode),
          nextDueDateFmt: fmtReportDate(s.nextDueDate),
          lastPaymentDateFmt: fmtReportDate(s.lastPaymentDate),
        };
      }),
    [rows, branches, currencyCode],
  );

  const filteredRows = useMemo(() => {
    const q = search.toLowerCase();
    let filtered = q
      ? detailRows.filter(
          (r) =>
            (r.borrowerDisplayName || "").toLowerCase().includes(q) ||
            (r.loanNumber || "").toLowerCase().includes(q),
        )
      : detailRows;

    return [...filtered].sort((a, b) => {
      const av = a[orderBy] ?? "";
      const bv = b[orderBy] ?? "";
      const isNum = typeof av === "number" && typeof bv === "number";
      const cmp = isNum
        ? av - bv
        : String(av).localeCompare(String(bv), undefined, { numeric: true });
      return orderDir === "asc" ? cmp : -cmp;
    });
  }, [detailRows, search, orderBy, orderDir]);

  const handleSort = (col) => {
    if (orderBy === col) setOrderDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setOrderBy(col);
      setOrderDir("desc");
    }
  };

  const handleExportCsv = () => {
    const csv = toCsv(filteredRows, DETAIL_COLUMNS);
    downloadFile(csv, "provisions_report.csv", "text/csv");
  };

  const handleExportJson = () => {
    const payload = buildSnapshotPayload();
    downloadFile(
      JSON.stringify(payload, null, 2),
      "provisions_report.json",
      "application/json",
    );
  };

  function buildSnapshotPayload() {
    return {
      generatedAt: new Date().toISOString(),
      startDate,
      endDate,
      selectedBranchId,
      matrix,
      grossBalance,
      totalProvision,
      netPortfolio,
      bucketTotals,
    };
  }

  const handleSaveSnapshot = async () => {
    const payload = buildSnapshotPayload();
    await saveSnapshot({
      reportType: REPORT_TYPES.PROVISIONS,
      reportName: "Provisions Report",
      startDate,
      endDate,
      branchId: selectedBranchId || scope.branchId,
      reportData: payload,
      customDetails: {
        // Include exact matrix used so the snapshot is fully auditable
        matrixUsed: matrix,
        matrixPctUsed: matrixPct,
        generatedAt: new Date().toISOString(),
        note: "Edit the provisioning matrix above before saving to capture the rates used in this run.",
      },
    });
  };

  return (
    <ReportShell
      title="Provisions Report"
      description="Estimates loan loss reserves using a configurable provisioning matrix applied to aging buckets."
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
      {/* Editable Provisioning Matrix */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
        Provisioning Matrix
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mb: 1.5, display: "block" }}
      >
        Edit the rates below before running or saving this report. Changes apply
        only to the current session.
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
          p: 2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          bgcolor: "background.paper",
        }}
      >
        {AGING_BUCKETS.map((b) => (
          <Box key={b.key} sx={{ minWidth: 130 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              {b.label}
            </Typography>
            <TextField
              size="small"
              type="number"
              value={matrixPct[b.key] ?? "0"}
              onChange={(e) =>
                setMatrixPct((prev) => ({ ...prev, [b.key]: e.target.value }))
              }
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              inputProps={{ min: 0, max: 100, step: 1 }}
              sx={{ width: 110 }}
            />
          </Box>
        ))}
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* KPI Cards */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
        Provision Totals
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <KpiCard
            label="Gross Outstanding Balance"
            value={fmtMoney(grossBalance)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <KpiCard
            label="Total Provision Required"
            value={fmtMoney(totalProvision)}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <KpiCard
            label="Net Portfolio After Provisions"
            value={fmtMoney(netPortfolio)}
            color="success.main"
          />
        </Grid>
      </Grid>

      {/* Bucket-level summary */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
        Provision by Bucket
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Aging Bucket</TableCell>
              <TableCell align="right">Loans</TableCell>
              <TableCell align="right">Outstanding Balance</TableCell>
              <TableCell align="right">Rate</TableCell>
              <TableCell align="right">Provision Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bucketTotals.map((b) => (
              <TableRow key={b.key} hover>
                <TableCell>
                  <Chip label={b.label} size="small" />
                </TableCell>
                <TableCell align="right">{b.loanCount}</TableCell>
                <TableCell align="right">
                  {fmtMoney(b.outstandingBalance)}
                </TableCell>
                <TableCell align="right">{fmtPct(b.rate * 100)}</TableCell>
                <TableCell align="right">
                  {fmtMoney(b.provisionAmount)}
                </TableCell>
              </TableRow>
            ))}
            {/* Totals row */}
            <TableRow sx={{ fontWeight: "bold", bgcolor: "action.hover" }}>
              <TableCell>
                <strong>Total</strong>
              </TableCell>
              <TableCell align="right">
                <strong>
                  {bucketTotals.reduce((s, b) => s + b.loanCount, 0)}
                </strong>
              </TableCell>
              <TableCell align="right">
                <strong>{fmtMoney(grossBalance)}</strong>
              </TableCell>
              <TableCell align="right">—</TableCell>
              <TableCell align="right">
                <strong>{fmtMoney(totalProvision)}</strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Detailed loan table */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
        Loan Detail
      </Typography>
      <Box sx={{ mb: 1 }}>
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
          sx={{ width: 280 }}
        />
      </Box>
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
                      <Chip label={row.agingBucketLabel} size="small" />
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
