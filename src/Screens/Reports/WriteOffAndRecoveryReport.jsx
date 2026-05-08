/**
 * Write-Off and Recovery Report — /reports/write-off-and-recovery
 *
 * Tracks the stock of written-off loans and recoveries made against them.
 *
 * Data sources:
 *   - LoanSummary: identifies written-off loans via displayStatus === "WRITTEN_OFF"
 *     No raw reads needed for basic written-off metrics (count, balance, officer, branch).
 *   - Raw loan read (GET_REPORT_LOAN_SOURCE_QUERY): payment records on written-off loans
 *     to infer recovery amounts in the selected date window.
 *   - Recovery = valid payment (isValidPayment) on a WRITTEN_OFF loan in the date window.
 *   - Payment validity: isValidPayment() from statementHelpers (excludes REVERSED/VOIDED/FAILED).
 *
 * Written-off stock is shown immediately from LoanSummary (no load required).
 * Recovery detail requires raw reads and is loaded on demand.
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
  Chip,
  Alert,
  Button,
  TextField,
  InputAdornment,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { generateClient } from "aws-amplify/api";
import { UserContext } from "../../App";
import ReportShell from "./ReportShell";
import { useReportData } from "./useReportData";
import {
  filterRowsByDateWindow,
  fmtMoney,
  fmtReportDate,
  fmtPct,
  toCsv,
  downloadFile,
  safeNum,
} from "./reportUtils";
import { LOAN_DISPLAY_STATUS } from "../../Models/Loans/loanSummaryProjection";
import { isValidPayment } from "../../Models/Loans/LoanStatements/statementHelpers";
import { GET_REPORT_LOAN_SOURCE_QUERY } from "./reportLoanData";

const WO_STATUS = LOAN_DISPLAY_STATUS.WRITTEN_OFF?.code || "WRITTEN_OFF";

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

const WO_COLS = [
  { key: "borrowerDisplayName", label: "Borrower" },
  { key: "loanNumber", label: "Loan #" },
  { key: "loanOfficerDisplayName", label: "Officer" },
  { key: "branchName", label: "Branch" },
  { key: "loanProductName", label: "Product" },
  { key: "principalAmount", label: "Original Principal" },
  { key: "loanBalanceAmount", label: "Balance at Write-Off" },
  { key: "startDate", label: "Disbursement Date" },
  { key: "maturityDateEffective", label: "Maturity" },
  { key: "recoveredAmount", label: "Recovery (in range)" },
];

const RECOVERY_COLS = [
  { key: "paymentDate", label: "Payment Date" },
  { key: "loanNumber", label: "Loan #" },
  { key: "borrowerDisplayName", label: "Borrower" },
  { key: "branchName", label: "Branch" },
  { key: "loanOfficerDisplayName", label: "Officer" },
  { key: "loanProductName", label: "Product" },
  { key: "paymentAmount", label: "Recovered Amount" },
];

export default function WriteOffAndRecoveryReport() {
  const { userDetails } = useContext(UserContext);

  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
  const todayStr = today.toISOString().slice(0, 10);

  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [startDate, setStartDate] = useState(firstOfMonth);
  const [endDate, setEndDate] = useState(todayStr);
  const [recoveries, setRecoveries] = useState(null); // null = not loaded
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoveryError, setRecoveryError] = useState(null);
  const [woSearch, setWoSearch] = useState("");
  const [officerFilter, setOfficerFilter] = useState("ALL");
  const [activeTab, setActiveTab] = useState("written-off"); // 'written-off' | 'recoveries'

  const { summaries, branches, loading, error, refresh, scope } = useReportData(
    { selectedBranchId },
  );

  const branchMap = useMemo(() => {
    const m = {};
    branches.forEach((b) => {
      if (b?.id) m[b.id] = b.name || b.id;
    });
    return m;
  }, [branches]);

  // Written-off loans from LoanSummary — no raw reads needed
  const woSummaries = useMemo(
    () =>
      summaries
        .filter((s) => s.displayStatus === WO_STATUS)
        .map((s) => ({
          ...s,
          branchName: branchMap[s.branchID] || s.branchID || "—",
          recoveredAmount: 0, // populated after recovery load
        })),
    [summaries, branchMap],
  );

  const officers = useMemo(() => {
    const set = new Set(
      woSummaries.map((s) => s.loanOfficerDisplayName).filter(Boolean),
    );
    return ["ALL", ...Array.from(set).sort()];
  }, [woSummaries]);

  // Written-off stock KPIs (no load needed)
  const stockKpis = useMemo(() => {
    const total = woSummaries.reduce(
      (acc, s) => acc + safeNum(s.loanBalanceAmount),
      0,
    );
    const count = woSummaries.length;
    return { total, count };
  }, [woSummaries]);

  // Recovery load
  const loadRecoveries = useCallback(async () => {
    setRecoveryLoading(true);
    setRecoveryError(null);
    try {
      const client = generateClient();
      const rows = [];

      for (const summary of woSummaries) {
        try {
          const result = await client.graphql({
            query: GET_REPORT_LOAN_SOURCE_QUERY,
            variables: { id: summary.loanID || summary.id },
          });
          const loan = result?.data?.getLoan;
          if (!loan) continue;

          const payments = loan.payments?.items || [];

          payments.forEach((p) => {
            if (!isValidPayment(p)) return;
            const amt = safeNum(p.amount);
            rows.push({
              id: p.id,
              loanId: loan.id,
              loanNumber: summary.loanNumber || "—",
              borrowerDisplayName: summary.borrowerDisplayName || "—",
              branchName: summary.branchName,
              loanOfficerDisplayName: summary.loanOfficerDisplayName || "—",
              loanProductName: summary.loanProductName || "—",
              paymentDate: p.paymentDate,
              paymentAmount: amt,
            });
          });
        } catch {
          // Skip individual loan errors
        }
      }

      setRecoveries({ rows, loadedAt: Date.now() });
    } catch (err) {
      console.error("[WriteOffAndRecoveryReport] load error:", err);
      setRecoveryError("Failed to load recovery data. Please try again.");
    } finally {
      setRecoveryLoading(false);
    }
  }, [woSummaries]);

  const windowRecoveries = useMemo(
    () =>
      filterRowsByDateWindow(
        recoveries?.rows || [],
        (row) => row.paymentDate,
        startDate,
        endDate,
      ),
    [recoveries, startDate, endDate],
  );

  const recoveryLoanMap = useMemo(() => {
    const map = {};
    windowRecoveries.forEach((row) => {
      map[row.loanId] = (map[row.loanId] || 0) + row.paymentAmount;
    });
    return map;
  }, [windowRecoveries]);

  // Enrich wo summaries with recovery amounts
  const woSummariesEnriched = useMemo(() => {
    return woSummaries.map((s) => ({
      ...s,
      recoveredAmount: recoveryLoanMap[s.loanID || s.id] || 0,
    }));
  }, [woSummaries, recoveryLoanMap]);

  // Recovery KPIs
  const recoveryKpis = useMemo(() => {
    if (!recoveries) return null;
    const totalRecovered = windowRecoveries.reduce(
      (acc, r) => acc + r.paymentAmount,
      0,
    );
    const loansWithRecovery = Object.keys(recoveryLoanMap).length;
    const netExposure = stockKpis.total - totalRecovered;
    const recoveryRate =
      stockKpis.total > 0 ? (totalRecovered / stockKpis.total) * 100 : 0;
    return { totalRecovered, loansWithRecovery, netExposure, recoveryRate };
  }, [recoveries, recoveryLoanMap, stockKpis, windowRecoveries]);

  // Branch rollup (written-off stock)
  const branchRollup = useMemo(() => {
    const map = {};
    woSummariesEnriched.forEach((s) => {
      const key = s.branchName;
      if (!map[key])
        map[key] = { branch: key, count: 0, balance: 0, recovered: 0 };
      map[key].count += 1;
      map[key].balance += safeNum(s.loanBalanceAmount);
      map[key].recovered += s.recoveredAmount;
    });
    return Object.values(map).sort((a, b) => b.balance - a.balance);
  }, [woSummariesEnriched]);

  // Filtered WO list
  const filteredWo = useMemo(() => {
    let rows = woSummariesEnriched;
    if (officerFilter !== "ALL")
      rows = rows.filter((s) => s.loanOfficerDisplayName === officerFilter);
    if (woSearch) {
      const q = woSearch.toLowerCase();
      rows = rows.filter(
        (s) =>
          (s.borrowerDisplayName || "").toLowerCase().includes(q) ||
          (s.loanNumber || "").toLowerCase().includes(q),
      );
    }
    return [...rows].sort(
      (a, b) => safeNum(b.loanBalanceAmount) - safeNum(a.loanBalanceAmount),
    );
  }, [woSummariesEnriched, officerFilter, woSearch]);

  // Filtered recovery rows
  const filteredRecoveries = useMemo(() => {
    if (!recoveries) return [];
    let rows = windowRecoveries;
    if (officerFilter !== "ALL")
      rows = rows.filter((r) => r.loanOfficerDisplayName === officerFilter);
    if (woSearch) {
      const q = woSearch.toLowerCase();
      rows = rows.filter(
        (r) =>
          (r.borrowerDisplayName || "").toLowerCase().includes(q) ||
          (r.loanNumber || "").toLowerCase().includes(q),
      );
    }
    return [...rows].sort((a, b) =>
      (b.paymentDate || "").localeCompare(a.paymentDate || ""),
    );
  }, [recoveries, officerFilter, woSearch, windowRecoveries]);

  function handleExportCsv() {
    if (activeTab === "written-off") {
      const csv = toCsv(
        filteredWo.map((s) => ({
          ...s,
          startDate: fmtReportDate(s.startDate),
          maturityDateEffective: fmtReportDate(s.maturityDateEffective),
          principalAmount: safeNum(s.principalAmount).toFixed(2),
          loanBalanceAmount: safeNum(s.loanBalanceAmount).toFixed(2),
          recoveredAmount: s.recoveredAmount.toFixed(2),
        })),
        WO_COLS,
      );
      downloadFile(
        csv,
        `write_offs_${new Date().toISOString().slice(0, 10)}.csv`,
        "text/csv",
      );
    } else {
      const csv = toCsv(
        filteredRecoveries.map((r) => ({
          ...r,
          paymentDate: fmtReportDate(r.paymentDate),
          paymentAmount: r.paymentAmount.toFixed(2),
        })),
        RECOVERY_COLS,
      );
      downloadFile(
        csv,
        `recoveries_${startDate}_to_${endDate}.csv`,
        "text/csv",
      );
    }
  }

  return (
    <ReportShell
      title="Write-Off & Recovery Report"
      description="Stock of written-off loans and recoveries made against them in the selected period."
      isAdmin={scope?.isAdmin}
      branches={branches}
      selectedBranchId={selectedBranchId}
      onBranchChange={(v) => {
        setSelectedBranchId(v);
        setRecoveries(null);
      }}
      startDate={startDate}
      endDate={endDate}
      onStartDateChange={setStartDate}
      onEndDateChange={setEndDate}
      onRefresh={() => {
        refresh();
        setRecoveries(null);
      }}
      loading={loading || recoveryLoading}
      loadError={error || recoveryError}
      onExportCsv={handleExportCsv}
    >
      {/* Stock KPIs — available immediately from LoanSummary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          {
            label: "Written-Off Loans (total stock)",
            value: stockKpis.count,
            color: "error.main",
          },
          {
            label: "Total Written-Off Balance",
            value: fmtMoney(stockKpis.total),
            color: "error.main",
          },
          {
            label: `Recovered (${startDate} → ${endDate})`,
            value: recoveryKpis
              ? fmtMoney(recoveryKpis.totalRecovered)
              : "Load required",
            color: "success.main",
          },
          {
            label: "Net Written-Off Exposure",
            value: recoveryKpis ? fmtMoney(recoveryKpis.netExposure) : "—",
            sub: recoveryKpis
              ? `${fmtPct(recoveryKpis.recoveryRate)} recovered`
              : undefined,
          },
        ].map((k) => (
          <Grid item xs={12} sm={6} md={3} key={k.label}>
            <KpiCard {...k} />
          </Grid>
        ))}
      </Grid>

      {/* Recovery load trigger */}
      {!recoveries && !recoveryLoading && (
        <Alert
          severity="info"
          sx={{ mb: 3 }}
          action={
            <Button
              size="small"
              variant="contained"
              onClick={loadRecoveries}
              disabled={woSummaries.length === 0}
            >
              Load Recovery Data
            </Button>
          }
        >
          Recovery details (payments on written-off loans) require fetching raw
          loan records once for {woSummaries.length} written-off{" "}
          {woSummaries.length === 1 ? "loan" : "loans"}. Date window:{" "}
          {startDate} → {endDate}. After loading, date changes filter the cached
          recoveries client-side.
        </Alert>
      )}
      {recoveryLoading && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Loading recovery payments…
          </Typography>
          <LinearProgress />
        </Box>
      )}

      {/* Branch rollup */}
      {scope?.isAdmin && branchRollup.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
            By Branch
          </Typography>
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{ maxWidth: 600 }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Branch</TableCell>
                  <TableCell align="right">Count</TableCell>
                  <TableCell align="right">Balance</TableCell>
                  <TableCell align="right">Recovered (in range)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {branchRollup.map((r) => (
                  <TableRow key={r.branch} hover>
                    <TableCell>{r.branch}</TableCell>
                    <TableCell align="right">{r.count}</TableCell>
                    <TableCell align="right">{fmtMoney(r.balance)}</TableCell>
                    <TableCell align="right">
                      {r.recovered > 0 ? fmtMoney(r.recovered) : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Detail section */}
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
              label={`Written-Off Loans (${filteredWo.length})`}
              onClick={() => setActiveTab("written-off")}
              color={activeTab === "written-off" ? "error" : "default"}
              variant={activeTab === "written-off" ? "filled" : "outlined"}
            />
            {recoveries && (
              <Chip
                label={`Recoveries (${filteredRecoveries.length})`}
                onClick={() => setActiveTab("recoveries")}
                color={activeTab === "recoveries" ? "success" : "default"}
                variant={activeTab === "recoveries" ? "filled" : "outlined"}
              />
            )}
          </Box>
          <TextField
            size="small"
            placeholder="Search loan #, borrower…"
            value={woSearch}
            onChange={(e) => setWoSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ width: 240 }}
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

        {activeTab === "written-off" && (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Borrower</TableCell>
                  <TableCell>Loan #</TableCell>
                  <TableCell>Officer</TableCell>
                  <TableCell>Branch</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Original Principal</TableCell>
                  <TableCell align="right">Balance at WO</TableCell>
                  <TableCell>Disbursed</TableCell>
                  <TableCell>Maturity</TableCell>
                  <TableCell align="right">Recovered (range)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredWo.slice(0, 300).map((s) => (
                  <TableRow key={s.id} hover>
                    <TableCell>{s.borrowerDisplayName || "—"}</TableCell>
                    <TableCell>{s.loanNumber || "—"}</TableCell>
                    <TableCell>{s.loanOfficerDisplayName || "—"}</TableCell>
                    <TableCell>{s.branchName}</TableCell>
                    <TableCell>{s.loanProductName || "—"}</TableCell>
                    <TableCell align="right">
                      {fmtMoney(safeNum(s.principalAmount))}
                    </TableCell>
                    <TableCell align="right" sx={{ color: "error.main" }}>
                      {fmtMoney(safeNum(s.loanBalanceAmount))}
                    </TableCell>
                    <TableCell>{fmtReportDate(s.startDate)}</TableCell>
                    <TableCell>
                      {fmtReportDate(s.maturityDateEffective)}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color:
                          s.recoveredAmount > 0
                            ? "success.main"
                            : "text.secondary",
                      }}
                    >
                      {s.recoveredAmount > 0
                        ? fmtMoney(s.recoveredAmount)
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredWo.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      align="center"
                      sx={{ color: "text.secondary", py: 3 }}
                    >
                      No written-off loans found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {activeTab === "recoveries" && recoveries && (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Payment Date</TableCell>
                  <TableCell>Loan #</TableCell>
                  <TableCell>Borrower</TableCell>
                  <TableCell>Branch</TableCell>
                  <TableCell>Officer</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Recovered Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRecoveries.slice(0, 300).map((r) => (
                  <TableRow key={r.id} hover>
                    <TableCell>{fmtReportDate(r.paymentDate)}</TableCell>
                    <TableCell>{r.loanNumber}</TableCell>
                    <TableCell>{r.borrowerDisplayName}</TableCell>
                    <TableCell>{r.branchName}</TableCell>
                    <TableCell>{r.loanOfficerDisplayName}</TableCell>
                    <TableCell>{r.loanProductName}</TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: "success.main", fontWeight: "bold" }}
                    >
                      {fmtMoney(r.paymentAmount)}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredRecoveries.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      align="center"
                      sx={{ color: "text.secondary", py: 3 }}
                    >
                      No recoveries found in this window.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </ReportShell>
  );
}
