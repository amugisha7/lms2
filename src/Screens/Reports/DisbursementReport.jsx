/**
 * Disbursement Report — /reports/disbursement
 *
 * Tracks loan funding outflows for operational control and compliance review.
 *
 * Disbursement date choice:
 *   `startDate` from LoanSummary is used as the disbursement date proxy.
 *   This field represents when the loan became active / was funded — the closest
 *   available proxy from the LoanSummary projection. The Loan model also carries
 *   `approvedDate`, but that precedes disbursement and would over-count.
 *
 * Disbursement status:
 *   `lifecycleStatus` from LoanSummary.
 *   - ACTIVE / CURRENT / OVERDUE / etc. → loan has been disbursed (COMPLETED proxy)
 *   - APPROVED → loan was approved but not yet disbursed (approved-not-disbursed exception)
 *   - DRAFT → pre-approval, not in scope
 *
 * Approved-but-not-disbursed logic:
 *   Any loan whose `lifecycleStatus` is "APPROVED" is treated as approved-not-disbursed.
 *   These do not have a startDate yet and are surfaced as an exception.
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
  TextField,
  InputAdornment,
  TableSortLabel,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { UserContext } from "../../App";
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

// Lifecycle statuses that indicate the loan has been disbursed (is active)
const DISBURSED_LIFECYCLE = new Set([
  "ACTIVE",
  "CURRENT",
  "CURRENT_WITH_MISSED_PAYMENT",
  "OVERDUE",
  "CLOSED",
  "WRITTEN_OFF",
]);

function isDisbursed(s) {
  const lc = (s?.lifecycleStatus || s?.displayStatus || "").toUpperCase();
  return (
    DISBURSED_LIFECYCLE.has(lc) ||
    (lc !== "APPROVED" && lc !== "DRAFT" && lc !== "VOIDED" && s?.startDate)
  );
}

function isApprovedNotDisbursed(s) {
  const lc = (s?.lifecycleStatus || "").toUpperCase();
  return (
    lc === "APPROVED" || (!s?.startDate && lc !== "CLOSED" && lc !== "VOIDED")
  );
}

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

const DETAIL_COLS = [
  { key: "loanNumber", label: "Loan #" },
  { key: "borrowerDisplayName", label: "Borrower" },
  { key: "branchName", label: "Branch" },
  { key: "loanOfficerDisplayName", label: "Officer" },
  { key: "loanProductName", label: "Product" },
  { key: "startDate", label: "Start / Disburse Date" },
  { key: "disbursementStatus", label: "Disburse Status" },
  { key: "principalAmount", label: "Principal" },
  { key: "loanPurpose", label: "Purpose" },
];

export default function DisbursementReport() {
  const { userDetails } = useContext(UserContext);

  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
  const todayStr = today.toISOString().slice(0, 10);

  const [startDate, setStartDate] = useState(firstOfMonth);
  const [endDate, setEndDate] = useState(todayStr);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("startDate");
  const [sortDir, setSortDir] = useState("desc");
  const [highValueThreshold, setHighValueThreshold] = useState(50000);

  const activeBranchId = userDetails?.branchID || userDetails?.branch?.id || null;
  const { summaries, branches, loading, error, refresh, scope } = useReportData(
    { selectedBranchId: activeBranchId },
  );

  // Resolve branch names
  const branchMap = useMemo(() => {
    const m = {};
    branches.forEach((b) => {
      if (b?.id) m[b.id] = b.name || b.id;
    });
    return m;
  }, [branches]);

  // Enrich summaries with derived fields
  const enriched = useMemo(
    () =>
      summaries.map((s) => ({
        ...s,
        branchName: branchMap[s.branchID] || s.branchID || "—",
        disbursementStatus: isDisbursed(s)
          ? "COMPLETED"
          : isApprovedNotDisbursed(s)
            ? "PENDING"
            : "—",
        loanPurpose: s.loanPurpose || "—",
      })),
    [summaries, branchMap],
  );

  // Loans in the date window (filter by startDate as disbursement date)
  const inWindow = useMemo(() => {
    if (!startDate && !endDate) return enriched.filter(isDisbursed);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate + "T23:59:59") : null;
    return enriched.filter((s) => {
      if (!isDisbursed(s) || !s.startDate) return false;
      const d = new Date(s.startDate);
      if (start && d < start) return false;
      if (end && d > end) return false;
      return true;
    });
  }, [enriched, startDate, endDate]);

  // Approved-not-disbursed (no date window filter — ongoing exceptions)
  const approvedNotDisbursed = useMemo(
    () => enriched.filter(isApprovedNotDisbursed),
    [enriched],
  );

  // KPIs
  const kpis = useMemo(() => {
    const total = inWindow.reduce(
      (acc, s) => acc + safeNum(s.principalAmount),
      0,
    );
    const count = inWindow.length;
    const avg = count ? total / count : 0;
    const largest = inWindow.reduce(
      (max, s) => Math.max(max, safeNum(s.principalAmount)),
      0,
    );
    return {
      total,
      count,
      avg,
      largest,
      approvedNotDisbursed: approvedNotDisbursed.length,
    };
  }, [inWindow, approvedNotDisbursed]);

  // Branch rollup
  const branchRollup = useMemo(() => {
    if (!scope?.isAdmin) return [];
    const map = {};
    inWindow.forEach((s) => {
      const key = s.branchName;
      if (!map[key]) map[key] = { branch: key, count: 0, total: 0 };
      map[key].count++;
      map[key].total += safeNum(s.principalAmount);
    });
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [inWindow, scope]);

  // Product rollup
  const productRollup = useMemo(() => {
    const map = {};
    inWindow.forEach((s) => {
      const key = s.loanProductName || "Unknown";
      if (!map[key]) map[key] = { product: key, count: 0, total: 0 };
      map[key].count++;
      map[key].total += safeNum(s.principalAmount);
    });
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [inWindow]);

  // Officer rollup
  const officerRollup = useMemo(() => {
    const map = {};
    inWindow.forEach((s) => {
      const key = s.loanOfficerDisplayName || "Unknown";
      if (!map[key]) map[key] = { officer: key, count: 0, total: 0 };
      map[key].count++;
      map[key].total += safeNum(s.principalAmount);
    });
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [inWindow]);

  // High-value exceptions
  const highValueExceptions = useMemo(
    () =>
      inWindow.filter((s) => safeNum(s.principalAmount) >= highValueThreshold),
    [inWindow, highValueThreshold],
  );

  // Filtered + sorted detail table
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const rows = search
      ? inWindow.filter(
          (s) =>
            (s.loanNumber || "").toLowerCase().includes(q) ||
            (s.borrowerDisplayName || "").toLowerCase().includes(q) ||
            (s.branchName || "").toLowerCase().includes(q) ||
            (s.loanOfficerDisplayName || "").toLowerCase().includes(q),
        )
      : inWindow;
    return [...rows].sort((a, b) => {
      let av = a[sortKey] ?? "";
      let bv = b[sortKey] ?? "";
      if (sortKey === "principalAmount") {
        av = safeNum(a.principalAmount);
        bv = safeNum(b.principalAmount);
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [inWindow, search, sortKey, sortDir]);

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function handleExportCsv() {
    const csv = toCsv(
      filtered.map((s) => ({
        ...s,
        principalAmount: safeNum(s.principalAmount).toFixed(2),
        startDate: fmtReportDate(s.startDate),
      })),
      DETAIL_COLS,
    );
    downloadFile(
      csv,
      `disbursement_report_${startDate}_to_${endDate}.csv`,
      "text/csv",
    );
  }

  return (
    <ReportShell
      title="Disbursement Report"
      description="Monitors loan funding outflows by period, branch, product, and officer."
      startDate={startDate}
      endDate={endDate}
      onStartDateChange={setStartDate}
      onEndDateChange={setEndDate}
      onRefresh={refresh}
      loading={loading}
      loadError={error}
      onExportCsv={handleExportCsv}
    >
      {/* KPIs */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: "Disbursed Count (in range)", value: kpis.count },
          { label: "Total Disbursed (in range)", value: fmtMoney(kpis.total) },
          { label: "Average Disbursement", value: fmtMoney(kpis.avg) },
          { label: "Largest Disbursement", value: fmtMoney(kpis.largest) },
          {
            label: "Approved – Not Disbursed",
            value: kpis.approvedNotDisbursed,
            color:
              kpis.approvedNotDisbursed > 0 ? "warning.main" : "text.primary",
          },
        ].map((k) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={k.label}>
            <KpiCard {...k} />
          </Grid>
        ))}
      </Grid>

      {/* Approved-not-disbursed exception */}
      {approvedNotDisbursed.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <strong>{approvedNotDisbursed.length} loan(s)</strong> are in APPROVED
          status with no disbursement date. Review:{" "}
          {approvedNotDisbursed
            .slice(0, 5)
            .map((s) => s.loanNumber || s.id)
            .join(", ")}
          {approvedNotDisbursed.length > 5 && " …"}
        </Alert>
      )}

      {/* High-value threshold config */}
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          label="High-Value Threshold"
          type="number"
          size="small"
          value={highValueThreshold}
          onChange={(e) => setHighValueThreshold(Number(e.target.value))}
          sx={{ width: 200 }}
        />
        {highValueExceptions.length > 0 && (
          <Chip
            label={`${highValueExceptions.length} high-value disbursement(s) ≥ ${fmtMoney(highValueThreshold)}`}
            color="warning"
            size="small"
          />
        )}
      </Box>

      {/* Rollups */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Product rollup */}
        <Grid item xs={12} md={scope?.isAdmin ? 4 : 6}>
          <Typography variant="subtitle2" sx={{ mb: 1 }} fontWeight="bold">
            By Product
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Count</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productRollup.map((r) => (
                  <TableRow key={r.product} hover>
                    <TableCell>{r.product}</TableCell>
                    <TableCell align="right">{r.count}</TableCell>
                    <TableCell align="right">{fmtMoney(r.total)}</TableCell>
                  </TableRow>
                ))}
                {productRollup.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      align="center"
                      sx={{ color: "text.secondary" }}
                    >
                      No data
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Officer rollup */}
        <Grid item xs={12} md={scope?.isAdmin ? 4 : 6}>
          <Typography variant="subtitle2" sx={{ mb: 1 }} fontWeight="bold">
            By Loan Officer
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Officer</TableCell>
                  <TableCell align="right">Count</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {officerRollup.map((r) => (
                  <TableRow key={r.officer} hover>
                    <TableCell>{r.officer}</TableCell>
                    <TableCell align="right">{r.count}</TableCell>
                    <TableCell align="right">{fmtMoney(r.total)}</TableCell>
                  </TableRow>
                ))}
                {officerRollup.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      align="center"
                      sx={{ color: "text.secondary" }}
                    >
                      No data
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Branch rollup (admin only) */}
        {scope?.isAdmin && (
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" sx={{ mb: 1 }} fontWeight="bold">
              By Branch
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Branch</TableCell>
                    <TableCell align="right">Count</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {branchRollup.map((r) => (
                    <TableRow key={r.branch} hover>
                      <TableCell>{r.branch}</TableCell>
                      <TableCell align="right">{r.count}</TableCell>
                      <TableCell align="right">{fmtMoney(r.total)}</TableCell>
                    </TableRow>
                  ))}
                  {branchRollup.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        align="center"
                        sx={{ color: "text.secondary" }}
                      >
                        No data
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}
      </Grid>

      {/* Detail table */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
          Disbursement Detail
        </Typography>
        <TextField
          size="small"
          placeholder="Search loan #, borrower, branch, officer…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 1, width: 340 }}
        />
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                {DETAIL_COLS.map((col) => (
                  <TableCell
                    key={col.key}
                    align={col.key === "principalAmount" ? "right" : "left"}
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
              {filtered.slice(0, 200).map((s) => (
                <TableRow key={s.id} hover>
                  <TableCell>{s.loanNumber || "—"}</TableCell>
                  <TableCell>{s.borrowerDisplayName || "—"}</TableCell>
                  <TableCell>{s.branchName}</TableCell>
                  <TableCell>{s.loanOfficerDisplayName || "—"}</TableCell>
                  <TableCell>{s.loanProductName || "—"}</TableCell>
                  <TableCell>{fmtReportDate(s.startDate)}</TableCell>
                  <TableCell>
                    <Chip
                      label={s.disbursementStatus}
                      size="small"
                      color={
                        s.disbursementStatus === "COMPLETED"
                          ? "success"
                          : s.disbursementStatus === "PENDING"
                            ? "warning"
                            : "default"
                      }
                    />
                  </TableCell>
                  <TableCell align="right">
                    {fmtMoney(safeNum(s.principalAmount))}
                  </TableCell>
                  <TableCell>{s.loanPurpose}</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={DETAIL_COLS.length}
                    align="center"
                    sx={{ color: "text.secondary", py: 3 }}
                  >
                    No disbursements found for the selected date window.
                  </TableCell>
                </TableRow>
              )}
              {filtered.length > 200 && (
                <TableRow>
                  <TableCell
                    colSpan={DETAIL_COLS.length}
                    align="center"
                    sx={{ color: "text.secondary" }}
                  >
                    Showing 200 of {filtered.length} rows. Export CSV for full
                    data.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </ReportShell>
  );
}
