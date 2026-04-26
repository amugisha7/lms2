/**
 * Portfolio at Risk (PAR) Summary Report
 *
 * PAR 30: loans with DPD > 30 days
 * PAR 60: loans with DPD > 60 days
 * PAR 90: loans with DPD > 90 days
 *
 * Denominator: total outstanding balance of all active/eligible loans (excludes VOIDED,
 * WRITTEN_OFF, CLOSED).
 *
 * The snapshot payload includes a trend-ready structure so future periods can be compared
 * even though chart rendering is not built yet.
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
import { computePAR, computeBranchPAR } from "./parHelpers";
import { computeDaysPastDue } from "./agingHelpers";

const PAR_THRESHOLDS = [30, 60, 90];

const PAR_COLORS = {
  30: "warning",
  60: "error",
  90: "error",
};

function KpiCard({ label, value, sub, color }) {
  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="caption" color="text.secondary" display="block">
          {label}
        </Typography>
        <Typography
          variant="h5"
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

const DETAIL_COLUMNS = [
  { key: "borrowerDisplayName", label: "Borrower" },
  { key: "loanNumber", label: "Loan #" },
  { key: "branchName", label: "Branch" },
  { key: "loanOfficerDisplayName", label: "Loan Officer" },
  { key: "displayStatus", label: "Status" },
  { key: "nextDueDateFmt", label: "Next Due" },
  { key: "daysPastDueFmt", label: "DPD" },
  { key: "loanBalanceAmountFmt", label: "Balance" },
  { key: "arrearsAmountFmt", label: "Arrears" },
  { key: "parFlags", label: "PAR Threshold" },
];

export default function PARSummary() {
  const { userDetails } = useContext(UserContext);
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");
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
    () => filterSummariesByDateWindow(summaries, startDate, endDate),
    [summaries, startDate, endDate],
  );

  // Compute PAR
  const { denominator, eligible, par } = useMemo(
    () => computePAR(windowSummaries, PAR_THRESHOLDS, today),
    [windowSummaries, today],
  );

  // Branch PAR
  const branchPAR = useMemo(
    () =>
      scope.isAdmin
        ? computeBranchPAR(windowSummaries, PAR_THRESHOLDS, branches, today)
        : [],
    [windowSummaries, branches, scope.isAdmin, today],
  );

  // Detail rows (PAR 30 loans — superset of PAR 60 and PAR 90)
  const detailRows = useMemo(() => {
    const par30Set = new Set((par[30]?.loans || []).map((s) => s.id));
    const par60Set = new Set((par[60]?.loans || []).map((s) => s.id));
    const par90Set = new Set((par[90]?.loans || []).map((s) => s.id));

    return (par[30]?.loans || []).map((s) => {
      const dpd = computeDaysPastDue(s, today);
      const branch = branches.find((b) => b.id === s.branchID);
      const flags = PAR_THRESHOLDS.filter((t) => {
        if (t === 30) return par30Set.has(s.id);
        if (t === 60) return par60Set.has(s.id);
        if (t === 90) return par90Set.has(s.id);
        return false;
      });

      return {
        ...s,
        branchName: branch?.name || s.branchID || "—",
        daysPastDue: dpd,
        daysPastDueFmt: dpd !== null ? String(dpd) : "N/A",
        loanBalanceAmountFmt: fmtMoney(s.loanBalanceAmount, currencyCode),
        arrearsAmountFmt: fmtMoney(s.arrearsAmount, currencyCode),
        nextDueDateFmt: fmtReportDate(s.nextDueDate),
        parFlags: flags.map((t) => `PAR${t}`).join(", "),
        parThresholds: flags,
      };
    });
  }, [par, branches, currencyCode, today]);

  const filteredRows = useMemo(() => {
    const q = search.toLowerCase();
    let rows = q
      ? detailRows.filter(
          (r) =>
            (r.borrowerDisplayName || "").toLowerCase().includes(q) ||
            (r.loanNumber || "").toLowerCase().includes(q),
        )
      : detailRows;

    return [...rows].sort((a, b) => {
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
    downloadFile(csv, "par_summary.csv", "text/csv");
  };

  const handleExportJson = () => {
    const payload = buildSnapshotPayload();
    downloadFile(
      JSON.stringify(payload, null, 2),
      "par_summary.json",
      "application/json",
    );
  };

  function buildSnapshotPayload() {
    return {
      generatedAt: new Date().toISOString(),
      reportDate: new Date().toISOString().slice(0, 10),
      startDate,
      endDate,
      selectedBranchId,
      // Trend-ready structure: keyed by date so future periods can be appended
      snapshot: {
        [new Date().toISOString().slice(0, 10)]: {
          denominator,
          eligibleLoanCount: eligible.length,
          par: PAR_THRESHOLDS.reduce((acc, t) => {
            acc[`par${t}`] = {
              balance: par[t]?.balance || 0,
              count: par[t]?.count || 0,
              pct: par[t]?.pct || 0,
            };
            return acc;
          }, {}),
        },
      },
      branchPAR,
      denominatorNote:
        "Total outstanding balance of active loans (excludes VOIDED, WRITTEN_OFF, CLOSED).",
    };
  }

  const handleSaveSnapshot = async () => {
    const payload = buildSnapshotPayload();
    await saveSnapshot({
      reportType: REPORT_TYPES.PAR_SUMMARY,
      reportName: "Portfolio at Risk Summary",
      startDate,
      endDate,
      branchId: selectedBranchId || scope.branchId,
      reportData: payload,
      customDetails: {
        thresholds: PAR_THRESHOLDS,
        denominatorDefinition:
          "Active loan outstanding balance (excl. VOIDED, WRITTEN_OFF, CLOSED)",
        generatedAt: new Date().toISOString(),
      },
    });
  };

  return (
    <ReportShell
      title="Portfolio at Risk (PAR)"
      description="PAR 30 / 60 / 90 metrics. Denominator = total outstanding balance of active eligible loans."
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
      {/* PAR KPI Cards */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
        PAR Metrics
      </Typography>
      <Grid container spacing={2} sx={{ mb: 1 }}>
        <Grid item xs={12} sm={4}>
          <KpiCard
            label="Total Qualifying Portfolio"
            value={fmtMoney(denominator)}
            sub={`${eligible.length} eligible loans`}
          />
        </Grid>
        {PAR_THRESHOLDS.map((t) => (
          <Grid item xs={6} sm={4} key={t}>
            <KpiCard
              label={`PAR ${t}`}
              value={fmtPct(par[t]?.pct || 0)}
              sub={`${fmtMoney(par[t]?.balance || 0)} · ${par[t]?.count || 0} loans`}
              color={
                par[t]?.pct > 10
                  ? "error.main"
                  : par[t]?.pct > 5
                    ? "warning.main"
                    : "text.primary"
              }
            />
          </Grid>
        ))}
      </Grid>

      {/* Summary table */}
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ mb: 3, maxWidth: 700 }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Threshold</TableCell>
              <TableCell align="right">At-Risk Balance</TableCell>
              <TableCell align="right">Denominator</TableCell>
              <TableCell align="right">PAR %</TableCell>
              <TableCell align="right">Loans at Risk</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {PAR_THRESHOLDS.map((t) => (
              <TableRow key={t} hover>
                <TableCell>
                  <Chip label={`PAR ${t}`} size="small" color={PAR_COLORS[t]} />
                </TableCell>
                <TableCell align="right">
                  {fmtMoney(par[t]?.balance || 0)}
                </TableCell>
                <TableCell align="right">{fmtMoney(denominator)}</TableCell>
                <TableCell align="right">{fmtPct(par[t]?.pct || 0)}</TableCell>
                <TableCell align="right">{par[t]?.count || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Branch PAR comparison (admin only) */}
      {scope.isAdmin && branchPAR.length > 0 && (
        <>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
            Branch PAR Comparison
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
                  <TableCell align="right">Portfolio</TableCell>
                  {PAR_THRESHOLDS.map((t) => (
                    <React.Fragment key={t}>
                      <TableCell align="right">PAR {t} Balance</TableCell>
                      <TableCell align="right">PAR {t} %</TableCell>
                    </React.Fragment>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {branchPAR.map((r) => (
                  <TableRow key={r.branchId} hover>
                    <TableCell>{r.branchName}</TableCell>
                    <TableCell align="right">
                      {fmtMoney(r.totalBalance)}
                    </TableCell>
                    {PAR_THRESHOLDS.map((t) => (
                      <React.Fragment key={t}>
                        <TableCell align="right">
                          {fmtMoney(r.par[t]?.balance || 0)}
                        </TableCell>
                        <TableCell align="right">
                          {fmtPct(r.par[t]?.pct || 0)}
                        </TableCell>
                      </React.Fragment>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* PAR 30 Detail */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
        Loans in PAR 30+ ({filteredRows.length})
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
                    {loading ? "Loading…" : "No loans in PAR 30+."}
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
                    ) : col.key === "parFlags" ? (
                      <Stack direction="row" spacing={0.5}>
                        {(row.parThresholds || []).map((t) => (
                          <Chip
                            key={t}
                            label={`PAR${t}`}
                            size="small"
                            color={PAR_COLORS[t]}
                          />
                        ))}
                      </Stack>
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
