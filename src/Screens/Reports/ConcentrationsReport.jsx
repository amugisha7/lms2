/**
 * Concentrations Report — /reports/concentrations
 *
 * Detects excessive exposure to single borrowers, products, and sector-like segments.
 *
 * Dimensions supported:
 *   1. Borrower  — borrowerDisplayName + borrowerID from LoanSummary
 *   2. Product   — loanProductName from LoanSummary
 *   3. Sector    — loanProductName used as proxy (see note below)
 *
 * Sector fallback order (per prompt):
 *   borrower typeOfBusiness → employmentDepartment → employerName → loanPurpose → Unclassified
 *   None of those fields are projected into LoanSummary. loanProductName (field 2) is
 *   used as the sector proxy from the summary layer. A note in the UI explains the
 *   limitation and indicates how enrichment from raw borrower reads could improve it.
 *
 * No raw loan/borrower enrichment is done in this build. All calculations use
 * LoanSummary exclusively — this avoids N+1 queries at portfolio scale while still
 * providing meaningful borrower and product concentration views.
 *
 * VOIDED loans are excluded from all concentration calculations.
 */

import React, { useState, useMemo, useContext } from "react";
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
  LinearProgress,
  Chip,
  Alert,
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
  filterSummariesByDateWindow,
  fmtMoney,
  fmtPct,
  toCsv,
  downloadFile,
  safeNum,
} from "./reportUtils";
import { REPORT_TYPES } from "./reportRegistry";
import { LOAN_DISPLAY_STATUS } from "../../Models/Loans/loanSummaryProjection";
import {
  buildConcentrationGroups,
  resolveSectorLabel,
} from "./concentrationHelpers";

function isEligible(s) {
  return s?.displayStatus !== LOAN_DISPLAY_STATUS.VOIDED.code;
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

function ConcentrationTable({ rows, maxRows = 10, onSelect, selectedKey }) {
  const shown = rows.slice(0, maxRows);
  const maxBalance = shown[0]?.balance || 1;
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Group</TableCell>
            <TableCell align="right">Count</TableCell>
            <TableCell align="right">Balance</TableCell>
            <TableCell align="right">% of Portfolio</TableCell>
            <TableCell sx={{ width: 120 }}>Share</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {shown.map((r, idx) => (
            <TableRow
              key={r.key}
              hover
              selected={selectedKey === r.key}
              onClick={() => onSelect(selectedKey === r.key ? null : r.key)}
              sx={{ cursor: "pointer" }}
            >
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{r.label}</TableCell>
              <TableCell align="right">{r.count}</TableCell>
              <TableCell align="right">{fmtMoney(r.balance)}</TableCell>
              <TableCell
                align="right"
                sx={{
                  color:
                    r.pct > 20
                      ? "error.main"
                      : r.pct > 10
                        ? "warning.main"
                        : "inherit",
                }}
              >
                {fmtPct(r.pct)}
              </TableCell>
              <TableCell>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, (r.balance / maxBalance) * 100)}
                  color={
                    r.pct > 20 ? "error" : r.pct > 10 ? "warning" : "primary"
                  }
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </TableCell>
            </TableRow>
          ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                align="center"
                sx={{ color: "text.secondary", py: 2 }}
              >
                No data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const DRILL_COLS = [
  { key: "borrowerDisplayName", label: "Borrower" },
  { key: "loanNumber", label: "Loan #" },
  { key: "loanOfficerDisplayName", label: "Officer" },
  { key: "branchName", label: "Branch" },
  { key: "displayStatus", label: "Status" },
  { key: "loanBalanceAmount", label: "Balance" },
];

const DRILL_DIMENSIONS = [
  { value: "borrower", label: "Borrower" },
  { value: "product", label: "Product" },
  { value: "sector", label: "Sector (Product proxy)" },
];

export default function ConcentrationsReport() {
  const { userDetails } = useContext(UserContext);

  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [activeDimension, setActiveDimension] = useState("borrower");
  const [selectedGroupKey, setSelectedGroupKey] = useState(null);
  const [drillSearch, setDrillSearch] = useState("");

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

  const windowSummaries = useMemo(
    () => filterSummariesByDateWindow(summaries, startDate, endDate),
    [summaries, startDate, endDate],
  );

  const eligible = useMemo(
    () => windowSummaries.filter(isEligible),
    [windowSummaries],
  );

  const totalPortfolioBalance = useMemo(
    () => eligible.reduce((acc, s) => acc + safeNum(s.loanBalanceAmount), 0),
    [eligible],
  );

  // Borrower groups
  const borrowerGroups = useMemo(
    () =>
      buildConcentrationGroups(
        eligible,
        (s) => s.borrowerID || s.borrowerDisplayName || "Unknown",
        (s) => s.borrowerDisplayName || s.borrowerID || "Unknown",
      ),
    [eligible],
  );

  // Product groups
  const productGroups = useMemo(
    () =>
      buildConcentrationGroups(
        eligible,
        (s) => s.loanProductID || s.loanProductName || "Unknown",
        (s) => s.loanProductName || s.loanProductID || "Unknown",
      ),
    [eligible],
  );

  // Sector groups (using loanProductName as proxy per note above)
  const sectorGroups = useMemo(
    () =>
      buildConcentrationGroups(
        eligible,
        (s) => resolveSectorLabel(s),
        (s) => resolveSectorLabel(s),
      ),
    [eligible],
  );

  // KPIs
  const kpis = useMemo(() => {
    const top1borrower = borrowerGroups[0];
    const top5balance = borrowerGroups
      .slice(0, 5)
      .reduce((acc, r) => acc + r.balance, 0);
    const top5pct =
      totalPortfolioBalance > 0
        ? (top5balance / totalPortfolioBalance) * 100
        : 0;
    const topProduct = productGroups[0];
    const topSector = sectorGroups[0];
    return { top1borrower, top5pct, topProduct, topSector };
  }, [borrowerGroups, productGroups, sectorGroups, totalPortfolioBalance]);

  // Active groups based on selected dimension
  const activeGroups = useMemo(() => {
    if (activeDimension === "borrower") return borrowerGroups;
    if (activeDimension === "product") return productGroups;
    return sectorGroups;
  }, [activeDimension, borrowerGroups, productGroups, sectorGroups]);

  // Drill-down rows for selected group
  const drillRows = useMemo(() => {
    if (!selectedGroupKey) return [];
    let rows = eligible;

    if (activeDimension === "borrower") {
      rows = rows.filter(
        (s) =>
          (s.borrowerID || s.borrowerDisplayName || "Unknown") ===
          selectedGroupKey,
      );
    } else if (activeDimension === "product") {
      rows = rows.filter(
        (s) =>
          (s.loanProductID || s.loanProductName || "Unknown") ===
          selectedGroupKey,
      );
    } else {
      rows = rows.filter((s) => resolveSectorLabel(s) === selectedGroupKey);
    }

    if (drillSearch) {
      const q = drillSearch.toLowerCase();
      rows = rows.filter(
        (s) =>
          (s.borrowerDisplayName || "").toLowerCase().includes(q) ||
          (s.loanNumber || "").toLowerCase().includes(q),
      );
    }

    return rows
      .map((s) => ({
        ...s,
        branchName: branchMap[s.branchID] || s.branchID || "—",
      }))
      .sort(
        (a, b) => safeNum(b.loanBalanceAmount) - safeNum(a.loanBalanceAmount),
      );
  }, [eligible, selectedGroupKey, activeDimension, drillSearch, branchMap]);

  const selectedGroupLabel = useMemo(
    () =>
      activeGroups.find((r) => r.key === selectedGroupKey)?.label ||
      selectedGroupKey,
    [activeGroups, selectedGroupKey],
  );

  function handleExportCsv() {
    const rows = selectedGroupKey
      ? drillRows
      : eligible.map((s) => ({
          ...s,
          branchName: branchMap[s.branchID] || s.branchID || "—",
        }));
    const csv = toCsv(
      rows.map((s) => ({
        ...s,
        loanBalanceAmount: safeNum(s.loanBalanceAmount).toFixed(2),
      })),
      DRILL_COLS,
    );
    downloadFile(csv, `concentrations_${activeDimension}.csv`, "text/csv");
  }

  async function handleSaveSnapshot() {
    const payload = {
      kpis: {
        largestBorrower: kpis.top1borrower?.label,
        largestBorrowerPct: kpis.top1borrower?.pct,
        top5BorrowerSharePct: kpis.top5pct,
        largestProduct: kpis.topProduct?.label,
        largestProductPct: kpis.topProduct?.pct,
        largestSector: kpis.topSector?.label,
        largestSectorPct: kpis.topSector?.pct,
      },
      topBorrowers: borrowerGroups
        .slice(0, 10)
        .map((r) => ({ borrower: r.label, balance: r.balance, pct: r.pct })),
      topProducts: productGroups
        .slice(0, 10)
        .map((r) => ({ product: r.label, balance: r.balance, pct: r.pct })),
      sectorNote:
        "Sector uses loanProductName as proxy. Raw borrower typeOfBusiness/employerName enrichment not loaded.",
      segmentationFallbackOrder:
        "loanProductName (LoanSummary) → Unclassified. Full order per spec: typeOfBusiness → employmentDepartment → employerName → loanPurpose → Unclassified",
      generatedAt: new Date().toISOString(),
    };
    await saveSnapshot({
      reportType: REPORT_TYPES.CONCENTRATIONS,
      reportName: "Concentrations Report",
      startDate,
      endDate,
      branchId: selectedBranchId || scope?.branchId || null,
      reportData: payload,
    });
  }

  return (
    <ReportShell
      title="Concentrations Report"
      description="Identifies top-borrower exposure and portfolio segment concentration risk."
      isAdmin={scope?.isAdmin}
      branches={branches}
      selectedBranchId={selectedBranchId}
      onBranchChange={setSelectedBranchId}
      startDate={startDate}
      endDate={endDate}
      onStartDateChange={setStartDate}
      onEndDateChange={setEndDate}
      showDateFilters={false}
      onRefresh={() => {
        refresh();
        setSelectedGroupKey(null);
      }}
      loading={loading}
      loadError={error}
      onSaveSnapshot={handleSaveSnapshot}
      saving={saving}
      lastSavedAt={lastSavedAt}
      saveError={saveError}
      onExportCsv={handleExportCsv}
    >
      {/* KPIs */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          {
            label: "Largest Single Borrower",
            value: kpis.top1borrower
              ? fmtMoney(kpis.top1borrower.balance)
              : "—",
            sub: kpis.top1borrower
              ? `${fmtPct(kpis.top1borrower.pct)} of portfolio | ${kpis.top1borrower.label}`
              : undefined,
            color: kpis.top1borrower?.pct > 20 ? "error.main" : "text.primary",
          },
          {
            label: "Top 5 Borrowers Share",
            value: fmtPct(kpis.top5pct),
            color:
              kpis.top5pct > 50
                ? "error.main"
                : kpis.top5pct > 30
                  ? "warning.main"
                  : "text.primary",
          },
          {
            label: "Largest Product",
            value: kpis.topProduct ? fmtMoney(kpis.topProduct.balance) : "—",
            sub: kpis.topProduct
              ? `${fmtPct(kpis.topProduct.pct)} | ${kpis.topProduct.label}`
              : undefined,
          },
          {
            label: "Largest Sector (Product proxy)",
            value: kpis.topSector ? fmtMoney(kpis.topSector.balance) : "—",
            sub: kpis.topSector
              ? `${fmtPct(kpis.topSector.pct)} | ${kpis.topSector.label}`
              : undefined,
          },
        ].map((k) => (
          <Grid item xs={12} sm={6} md={3} key={k.label}>
            <KpiCard {...k} />
          </Grid>
        ))}
      </Grid>

      {/* Sector note */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>Sector grouping note:</strong> The LoanSummary projection does
        not include <code>loanPurpose</code>, <code>typeOfBusiness</code>,{" "}
        <code>employmentDepartment</code>, or <code>employerName</code>. The
        "Sector" view uses <code>loanProductName</code> as a proxy. For true
        sector segmentation, enrich with raw borrower records using the fallback
        order specified in <code>concentrationHelpers.js</code>.
      </Alert>

      {/* Dimension tabs */}
      <Box sx={{ mb: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
        {DRILL_DIMENSIONS.map((d) => (
          <Chip
            key={d.value}
            label={d.label}
            onClick={() => {
              setActiveDimension(d.value);
              setSelectedGroupKey(null);
            }}
            color={activeDimension === d.value ? "primary" : "default"}
            variant={activeDimension === d.value ? "filled" : "outlined"}
          />
        ))}
      </Box>

      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
        Top Concentration Groups — by{" "}
        {DRILL_DIMENSIONS.find((d) => d.value === activeDimension)?.label}
      </Typography>
      <Box sx={{ mb: 3 }}>
        <ConcentrationTable
          rows={activeGroups}
          maxRows={20}
          onSelect={(key) => {
            setSelectedGroupKey(key);
            setDrillSearch("");
          }}
          selectedKey={selectedGroupKey}
        />
      </Box>

      {/* Drill-down */}
      {selectedGroupKey && (
        <Box>
          <Box sx={{ mb: 1, display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Drill-Down: {selectedGroupLabel}
            </Typography>
            <Chip
              label="Clear"
              size="small"
              onClick={() => setSelectedGroupKey(null)}
            />
          </Box>
          <TextField
            size="small"
            placeholder="Search borrower, loan #…"
            value={drillSearch}
            onChange={(e) => setDrillSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 1, width: 280 }}
          />
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  {DRILL_COLS.map((col) => (
                    <TableCell
                      key={col.key}
                      align={col.key === "loanBalanceAmount" ? "right" : "left"}
                    >
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {drillRows.slice(0, 200).map((s) => (
                  <TableRow key={s.id} hover>
                    <TableCell>{s.borrowerDisplayName || "—"}</TableCell>
                    <TableCell>{s.loanNumber || "—"}</TableCell>
                    <TableCell>{s.loanOfficerDisplayName || "—"}</TableCell>
                    <TableCell>{s.branchName}</TableCell>
                    <TableCell>
                      <Chip label={s.displayStatus} size="small" />
                    </TableCell>
                    <TableCell align="right">
                      {fmtMoney(safeNum(s.loanBalanceAmount))}
                    </TableCell>
                  </TableRow>
                ))}
                {drillRows.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={DRILL_COLS.length}
                      align="center"
                      sx={{ color: "text.secondary", py: 2 }}
                    >
                      No loans found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </ReportShell>
  );
}
