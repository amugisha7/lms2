/**
 * Interest and Penalty Report — /reports/interest-and-penalty
 *
 * Tracks revenue attributable to loan interest collections and penalty charges/collections.
 *
 * Data sources:
 *   - LoanSummary: scope, loan metadata, product/officer/branch groupings
 *   - Raw loan read (GET_REPORT_LOAN_SOURCE_QUERY): payment records with
 *     amountAllocatedToInterest / amountAllocatedToPenalty, and penalty records
 *   - Payment validity: isValidPayment() from statementHelpers (excludes REVERSED/VOIDED/FAILED)
 *   - Penalty validity: penaltyStatus not in VOIDED/CANCELLED/REVERSED (mirrors repo logic)
 *
 * Collected values use payment date; charged penalty values use penaltyDate or createdAt.
 *
 * The full data load fetches the raw loan for each loan in scope that has activity
 * (lastPaymentDate within or after the start of the date window). This fetch is
 * triggered explicitly by the user to avoid accidental large reads.
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import { generateClient } from "aws-amplify/api";
import { UserContext } from "../../App";
import ReportShell from "./ReportShell";
import { useReportData } from "./useReportData";
import { useSnapshotPersistence } from "./useSnapshotPersistence";
import {
  filterRowsByDateWindow,
  fmtMoney,
  fmtReportDate,
  fmtPct,
  toCsv,
  downloadFile,
  safeNum,
} from "./reportUtils";
import { REPORT_TYPES } from "./reportRegistry";
import { LOAN_DISPLAY_STATUS } from "../../Models/Loans/loanSummaryProjection";
import { isValidPayment } from "../../Models/Loans/LoanStatements/statementHelpers";
import { GET_REPORT_LOAN_SOURCE_QUERY } from "./reportLoanData";

const EXCLUDED_PENALTY_STATUSES = new Set(["VOIDED", "CANCELLED", "REVERSED"]);

function isActivePenalty(p) {
  return !EXCLUDED_PENALTY_STATUSES.has(
    (p?.penaltyStatus || p?.status || "").toUpperCase(),
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

const PAYMENT_DETAIL_COLS = [
  { key: "paymentDate", label: "Date" },
  { key: "loanNumber", label: "Loan #" },
  { key: "borrowerDisplayName", label: "Borrower" },
  { key: "branchName", label: "Branch" },
  { key: "loanOfficerDisplayName", label: "Officer" },
  { key: "loanProductName", label: "Product" },
  { key: "interestCollected", label: "Interest Collected" },
  { key: "penaltyCollected", label: "Penalty Collected" },
  { key: "paymentAmount", label: "Total Payment" },
];

const PENALTY_DETAIL_COLS = [
  { key: "penaltyDate", label: "Date" },
  { key: "loanNumber", label: "Loan #" },
  { key: "borrowerDisplayName", label: "Borrower" },
  { key: "branchName", label: "Branch" },
  { key: "loanOfficerDisplayName", label: "Officer" },
  { key: "loanProductName", label: "Product" },
  { key: "penaltyName", label: "Penalty Type" },
  { key: "penaltyAmount", label: "Charged" },
];

export default function InterestAndPenaltyReport() {
  const { userDetails } = useContext(UserContext);

  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
  const todayStr = today.toISOString().slice(0, 10);

  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [startDate, setStartDate] = useState(firstOfMonth);
  const [endDate, setEndDate] = useState(todayStr);
  const [enrichedData, setEnrichedData] = useState(null); // null = not loaded
  const [enrichLoading, setEnrichLoading] = useState(false);
  const [enrichError, setEnrichError] = useState(null);
  const [search, setSearch] = useState("");
  const [productFilter, setProductFilter] = useState("ALL");
  const [activeTab, setActiveTab] = useState("payments"); // 'payments' | 'penalties'

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

  const products = useMemo(() => {
    const set = new Set(
      summaries.map((s) => s.loanProductName).filter(Boolean),
    );
    return ["ALL", ...Array.from(set).sort()];
  }, [summaries]);

  // Load raw loan data to extract payment/penalty details
  const loadEnrichedData = useCallback(async () => {
    setEnrichLoading(true);
    setEnrichError(null);
    try {
      const client = generateClient();
      const paymentRows = [];
      const penaltyRows = [];

      const relevantSummaries = summaries.filter(
        (s) => s.displayStatus !== LOAN_DISPLAY_STATUS.VOIDED.code,
      );

      for (const summary of relevantSummaries) {
        try {
          const result = await client.graphql({
            query: GET_REPORT_LOAN_SOURCE_QUERY,
            variables: { id: summary.loanID || summary.id },
          });
          const loan = result?.data?.getLoan;
          if (!loan) continue;

          const branchName =
            branchMap[summary.branchID] || summary.branchID || "—";

          // Payment rows
          const payments = loan.payments?.items || [];
          payments.forEach((p) => {
            if (!isValidPayment(p)) return;
            const interestCollected = safeNum(p.amountAllocatedToInterest);
            const penaltyCollected = safeNum(p.amountAllocatedToPenalty);
            if (interestCollected === 0 && penaltyCollected === 0) return;

            paymentRows.push({
              id: p.id,
              loanId: loan.id,
              loanNumber: loan.loanNumber || "—",
              borrowerDisplayName: summary.borrowerDisplayName || "—",
              branchName,
              loanOfficerDisplayName: summary.loanOfficerDisplayName || "—",
              loanProductName: summary.loanProductName || "—",
              paymentDate: p.paymentDate,
              interestCollected,
              penaltyCollected,
              paymentAmount: safeNum(p.amount),
            });
          });

          // Penalty charge rows
          const penalties = loan.penalties?.items || [];
          penalties.forEach((pen) => {
            if (!isActivePenalty(pen)) return;
            const penDate = pen.penaltyDate || pen.createdAt;
            const amt = safeNum(pen.amount);
            if (amt === 0) return;

            penaltyRows.push({
              id: pen.id,
              loanId: loan.id,
              loanNumber: loan.loanNumber || "—",
              borrowerDisplayName: summary.borrowerDisplayName || "—",
              branchName,
              loanOfficerDisplayName: summary.loanOfficerDisplayName || "—",
              loanProductName: summary.loanProductName || "—",
              penaltyDate: penDate,
              penaltyName:
                pen.penaltyName ||
                pen.penaltyType ||
                pen.penaltyCategory ||
                "Penalty",
              penaltyAmount: amt,
              penaltyStatus: pen.penaltyStatus || pen.status || "—",
            });
          });
        } catch {
          // Skip individual loan errors — don't abort the whole load
        }
      }

      setEnrichedData({ paymentRows, penaltyRows, loadedAt: Date.now() });
    } catch (err) {
      console.error("[InterestAndPenaltyReport] load error:", err);
      setEnrichError("Failed to load payment data. Please try again.");
    } finally {
      setEnrichLoading(false);
    }
  }, [summaries, branchMap]);

  const windowPaymentRows = useMemo(
    () =>
      filterRowsByDateWindow(
        enrichedData?.paymentRows || [],
        (row) => row.paymentDate,
        startDate,
        endDate,
      ),
    [enrichedData, startDate, endDate],
  );

  const windowPenaltyRows = useMemo(
    () =>
      filterRowsByDateWindow(
        enrichedData?.penaltyRows || [],
        (row) => row.penaltyDate,
        startDate,
        endDate,
      ),
    [enrichedData, startDate, endDate],
  );

  // KPIs from enriched data
  const kpis = useMemo(() => {
    if (!enrichedData) return null;
    const interestCollected = windowPaymentRows.reduce(
      (acc, r) => acc + r.interestCollected,
      0,
    );
    const penaltyCollected = windowPaymentRows.reduce(
      (acc, r) => acc + r.penaltyCollected,
      0,
    );
    const penaltyCharged = windowPenaltyRows.reduce(
      (acc, r) => acc + r.penaltyAmount,
      0,
    );
    const totalCollected = interestCollected + penaltyCollected;
    const interestPct =
      totalCollected > 0 ? (interestCollected / totalCollected) * 100 : 0;
    const penaltyPct =
      totalCollected > 0 ? (penaltyCollected / totalCollected) * 100 : 0;

    return {
      interestCollected,
      penaltyCollected,
      penaltyCharged,
      interestPct,
      penaltyPct,
    };
  }, [enrichedData, windowPaymentRows, windowPenaltyRows]);

  // Product rollups from payment rows
  const productRollup = useMemo(() => {
    if (!enrichedData) return [];
    const map = {};
    windowPaymentRows.forEach((r) => {
      const key = r.loanProductName;
      if (!map[key])
        map[key] = { product: key, interestCollected: 0, penaltyCollected: 0 };
      map[key].interestCollected += r.interestCollected;
      map[key].penaltyCollected += r.penaltyCollected;
    });
    return Object.values(map).sort(
      (a, b) => b.interestCollected - a.interestCollected,
    );
  }, [enrichedData, windowPaymentRows]);

  // Branch rollups
  const branchRollup = useMemo(() => {
    if (!enrichedData || !scope?.isAdmin) return [];
    const map = {};
    windowPaymentRows.forEach((r) => {
      const key = r.branchName;
      if (!map[key])
        map[key] = { branch: key, interestCollected: 0, penaltyCollected: 0 };
      map[key].interestCollected += r.interestCollected;
      map[key].penaltyCollected += r.penaltyCollected;
    });
    return Object.values(map).sort(
      (a, b) => b.interestCollected - a.interestCollected,
    );
  }, [enrichedData, scope, windowPaymentRows]);

  // Filtered detail rows
  const filteredPayments = useMemo(() => {
    if (!enrichedData) return [];
    let rows = windowPaymentRows;
    if (productFilter !== "ALL")
      rows = rows.filter((r) => r.loanProductName === productFilter);
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          (r.loanNumber || "").toLowerCase().includes(q) ||
          (r.borrowerDisplayName || "").toLowerCase().includes(q),
      );
    }
    return [...rows].sort((a, b) =>
      (b.paymentDate || "").localeCompare(a.paymentDate || ""),
    );
  }, [enrichedData, productFilter, search, windowPaymentRows]);

  const filteredPenalties = useMemo(() => {
    if (!enrichedData) return [];
    let rows = windowPenaltyRows;
    if (productFilter !== "ALL")
      rows = rows.filter((r) => r.loanProductName === productFilter);
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          (r.loanNumber || "").toLowerCase().includes(q) ||
          (r.borrowerDisplayName || "").toLowerCase().includes(q),
      );
    }
    return [...rows].sort((a, b) =>
      (b.penaltyDate || "").localeCompare(a.penaltyDate || ""),
    );
  }, [enrichedData, productFilter, search, windowPenaltyRows]);

  function handleExportCsv() {
    if (activeTab === "payments") {
      const csv = toCsv(
        filteredPayments.map((r) => ({
          ...r,
          paymentDate: fmtReportDate(r.paymentDate),
          interestCollected: r.interestCollected.toFixed(2),
          penaltyCollected: r.penaltyCollected.toFixed(2),
          paymentAmount: r.paymentAmount.toFixed(2),
        })),
        PAYMENT_DETAIL_COLS,
      );
      downloadFile(
        csv,
        `interest_penalty_payments_${startDate}_to_${endDate}.csv`,
        "text/csv",
      );
    } else {
      const csv = toCsv(
        filteredPenalties.map((r) => ({
          ...r,
          penaltyDate: fmtReportDate(r.penaltyDate),
          penaltyAmount: r.penaltyAmount.toFixed(2),
        })),
        PENALTY_DETAIL_COLS,
      );
      downloadFile(
        csv,
        `interest_penalty_charges_${startDate}_to_${endDate}.csv`,
        "text/csv",
      );
    }
  }

  async function handleSaveSnapshot() {
    const payload = {
      kpis: kpis || { note: "Run data load to populate KPIs" },
      productRollup,
      branchRollup: scope?.isAdmin ? branchRollup : undefined,
      dataSource:
        "Payment.amountAllocatedToInterest + amountAllocatedToPenalty (valid payments); Penalty.amount (active penalties)",
      paymentValidityRule:
        "isValidPayment() — excludes REVERSED/VOIDED/FAILED via paymentStatusEnum or status",
      penaltyValidityRule: "penaltyStatus not in VOIDED/CANCELLED/REVERSED",
      dateFieldNote:
        "Payments filtered by paymentDate; penalties filtered by penaltyDate or createdAt",
      generatedAt: new Date().toISOString(),
    };
    await saveSnapshot({
      reportType: REPORT_TYPES.INTEREST_AND_PENALTY,
      reportName: `Interest & Penalty Report ${startDate} to ${endDate}`,
      startDate,
      endDate,
      branchId: selectedBranchId || scope?.branchId || null,
      reportData: payload,
    });
  }

  return (
    <ReportShell
      title="Interest & Penalty Report"
      description="Interest income collected and penalty charges/collections over a selected period."
      isAdmin={scope?.isAdmin}
      branches={branches}
      selectedBranchId={selectedBranchId}
      onBranchChange={(v) => {
        setSelectedBranchId(v);
        setEnrichedData(null);
      }}
      startDate={startDate}
      endDate={endDate}
      onStartDateChange={setStartDate}
      onEndDateChange={setEndDate}
      onRefresh={() => {
        refresh();
        setEnrichedData(null);
      }}
      loading={loading || enrichLoading}
      loadError={error || enrichError}
      onSaveSnapshot={handleSaveSnapshot}
      saving={saving}
      lastSavedAt={lastSavedAt}
      saveError={saveError}
      onExportCsv={enrichedData ? handleExportCsv : undefined}
    >
      {/* Load trigger */}
      {!enrichedData && !enrichLoading && (
        <Alert
          severity="info"
          sx={{ mb: 3 }}
          action={
            <Button size="small" variant="contained" onClick={loadEnrichedData}>
              Load Payment Data
            </Button>
          }
        >
          Payment allocation data requires fetching raw loan records once for
          the current scope. After loading, the date window filters the cached
          rows client-side.
        </Alert>
      )}
      {enrichLoading && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Loading payment allocations…
          </Typography>
          <LinearProgress />
        </Box>
      )}

      {/* KPIs */}
      {kpis && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            {
              label: "Interest Collected (in range)",
              value: fmtMoney(kpis.interestCollected),
              color: "success.main",
            },
            {
              label: "Penalty Collected (in range)",
              value: fmtMoney(kpis.penaltyCollected),
            },
            {
              label: "Penalty Charged (in range)",
              value: fmtMoney(kpis.penaltyCharged),
              sub: "Penalty records created in window",
            },
            {
              label: "Interest/Penalty Mix",
              value: `${fmtPct(kpis.interestPct)} / ${fmtPct(kpis.penaltyPct)}`,
              sub: "Interest % / Penalty %",
            },
          ].map((k) => (
            <Grid item xs={12} sm={6} md={3} key={k.label}>
              <KpiCard {...k} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Rollups */}
      {enrichedData && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={scope?.isAdmin ? 6 : 12}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
              By Product
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Interest Collected</TableCell>
                    <TableCell align="right">Penalty Collected</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productRollup.map((r) => (
                    <TableRow key={r.product} hover>
                      <TableCell>{r.product}</TableCell>
                      <TableCell align="right">
                        {fmtMoney(r.interestCollected)}
                      </TableCell>
                      <TableCell align="right">
                        {fmtMoney(r.penaltyCollected)}
                      </TableCell>
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

          {scope?.isAdmin && (
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                By Branch
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Branch</TableCell>
                      <TableCell align="right">Interest Collected</TableCell>
                      <TableCell align="right">Penalty Collected</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {branchRollup.map((r) => (
                      <TableRow key={r.branch} hover>
                        <TableCell>{r.branch}</TableCell>
                        <TableCell align="right">
                          {fmtMoney(r.interestCollected)}
                        </TableCell>
                        <TableCell align="right">
                          {fmtMoney(r.penaltyCollected)}
                        </TableCell>
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
      )}

      {/* Detail tables */}
      {enrichedData && (
        <Box>
          <Box
            sx={{
              mb: 1,
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              <Chip
                label={`Payment Collections (${filteredPayments.length})`}
                onClick={() => setActiveTab("payments")}
                color={activeTab === "payments" ? "primary" : "default"}
                variant={activeTab === "payments" ? "filled" : "outlined"}
              />
              <Chip
                label={`Penalty Charges (${filteredPenalties.length})`}
                onClick={() => setActiveTab("penalties")}
                color={activeTab === "penalties" ? "primary" : "default"}
                variant={activeTab === "penalties" ? "filled" : "outlined"}
              />
            </Box>
            <TextField
              size="small"
              placeholder="Search loan #, borrower…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 240 }}
            />
            <FormControl size="small" sx={{ minWidth: 160 }}>
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
          </Box>

          {activeTab === "payments" && (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {PAYMENT_DETAIL_COLS.map((col) => (
                      <TableCell
                        key={col.key}
                        align={
                          [
                            "interestCollected",
                            "penaltyCollected",
                            "paymentAmount",
                          ].includes(col.key)
                            ? "right"
                            : "left"
                        }
                      >
                        {col.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPayments.slice(0, 500).map((r) => (
                    <TableRow key={r.id} hover>
                      <TableCell>{fmtReportDate(r.paymentDate)}</TableCell>
                      <TableCell>{r.loanNumber}</TableCell>
                      <TableCell>{r.borrowerDisplayName}</TableCell>
                      <TableCell>{r.branchName}</TableCell>
                      <TableCell>{r.loanOfficerDisplayName}</TableCell>
                      <TableCell>{r.loanProductName}</TableCell>
                      <TableCell align="right">
                        {fmtMoney(r.interestCollected)}
                      </TableCell>
                      <TableCell align="right">
                        {fmtMoney(r.penaltyCollected)}
                      </TableCell>
                      <TableCell align="right">
                        {fmtMoney(r.paymentAmount)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredPayments.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={PAYMENT_DETAIL_COLS.length}
                        align="center"
                        sx={{ color: "text.secondary", py: 3 }}
                      >
                        No payment collections with interest or penalty
                        allocations in this window.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {activeTab === "penalties" && (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {PENALTY_DETAIL_COLS.map((col) => (
                      <TableCell
                        key={col.key}
                        align={col.key === "penaltyAmount" ? "right" : "left"}
                      >
                        {col.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPenalties.slice(0, 500).map((r) => (
                    <TableRow key={r.id} hover>
                      <TableCell>{fmtReportDate(r.penaltyDate)}</TableCell>
                      <TableCell>{r.loanNumber}</TableCell>
                      <TableCell>{r.borrowerDisplayName}</TableCell>
                      <TableCell>{r.branchName}</TableCell>
                      <TableCell>{r.loanOfficerDisplayName}</TableCell>
                      <TableCell>{r.loanProductName}</TableCell>
                      <TableCell>{r.penaltyName}</TableCell>
                      <TableCell align="right">
                        {fmtMoney(r.penaltyAmount)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredPenalties.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={PENALTY_DETAIL_COLS.length}
                        align="center"
                        sx={{ color: "text.secondary", py: 3 }}
                      >
                        No penalty charges found in this window.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}
    </ReportShell>
  );
}
