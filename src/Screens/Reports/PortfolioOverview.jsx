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
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  InputAdornment,
  InputBase,
  LinearProgress,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
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

const STATUS_LABELS = Object.values(LOAN_DISPLAY_STATUS).reduce(
  (accumulator, meta) => {
    accumulator[meta.code] = String(meta.label || meta.code).replace(/\s+/g, " ");
    return accumulator;
  },
  {},
);

const AGING_BUCKETS = [
  { key: "current", label: "Current / Not Yet Due", minDays: -Infinity, maxDays: 0 },
  { key: "1_30", label: "1-30 Days", minDays: 1, maxDays: 30 },
  { key: "31_60", label: "31-60 Days", minDays: 31, maxDays: 60 },
  { key: "61_90", label: "61-90 Days", minDays: 61, maxDays: 90 },
  { key: "90_plus", label: "90+ Days", minDays: 91, maxDays: Infinity },
];

const EXPORT_COLUMNS = [
  { key: "borrowerDisplayName", label: "Borrower" },
  { key: "loanNumber", label: "Loan #" },
  { key: "branchName", label: "Branch" },
  { key: "loanOfficerDisplayName", label: "Loan Officer" },
  { key: "loanProductName", label: "Product" },
  { key: "displayStatusLabel", label: "Status" },
  { key: "principalAmountFmt", label: "Principal" },
  { key: "loanBalanceAmountFmt", label: "Balance" },
  { key: "arrearsAmountFmt", label: "Arrears" },
  { key: "totalPaidAmountFmt", label: "Total Paid" },
  { key: "nextDueDateFmt", label: "Next Due" },
  { key: "lastPaymentDateFmt", label: "Last Payment" },
];

const DETAIL_TABLE_COLUMNS = [
  {
    key: "borrowerDisplayName",
    label: "Borrower",
    align: "left",
    sortValue: (row) => row.borrowerDisplayName || "",
  },
  {
    key: "loanNumber",
    label: "Loan #",
    align: "left",
    sortValue: (row) => row.loanNumber || "",
  },
  {
    key: "branchName",
    label: "Branch",
    align: "left",
    sortValue: (row) => row.branchName || "",
  },
  {
    key: "loanOfficerDisplayName",
    label: "Loan Officer",
    align: "left",
    sortValue: (row) => row.loanOfficerDisplayName || "",
  },
  {
    key: "loanProductName",
    label: "Product",
    align: "left",
    sortValue: (row) => row.loanProductName || "",
  },
  {
    key: "displayStatus",
    label: "Status",
    align: "left",
    sortValue: (row) => row.displayStatusRank ?? 999,
  },
  {
    key: "principalAmount",
    label: "Principal",
    align: "right",
    sortValue: (row) => safeNum(row.principalAmount),
  },
  {
    key: "loanBalanceAmount",
    label: "Balance",
    align: "right",
    sortValue: (row) => safeNum(row.loanBalanceAmount),
  },
  {
    key: "arrearsAmount",
    label: "Arrears",
    align: "right",
    sortValue: (row) => safeNum(row.arrearsAmount),
  },
  {
    key: "totalPaidAmount",
    label: "Total Paid",
    align: "right",
    sortValue: (row) => safeNum(row.totalPaidAmount),
  },
  {
    key: "nextDueDate",
    label: "Next Due",
    align: "left",
    sortValue: (row) => row.nextDueDate || "",
  },
  {
    key: "lastPaymentDate",
    label: "Last Payment",
    align: "left",
    sortValue: (row) => row.lastPaymentDate || "",
  },
];

function isActiveLoan(s) {
  return ACTIVE_STATUS_CODES.has(s?.displayStatus);
}

function getStatusLabel(code) {
  return STATUS_LABELS[code] || code || "Unknown";
}

function getStatusTone(code, sf) {
  if (code === LOAN_DISPLAY_STATUS.CURRENT.code) {
    return {
      bg: sf.sf_pillSuccessBg,
      text: sf.sf_pillSuccessText,
      border: sf.sf_success,
    };
  }

  if (code === LOAN_DISPLAY_STATUS.MISSED_PAYMENT.code) {
    return {
      bg: sf.sf_pillWarningBg,
      text: sf.sf_pillWarningText,
      border: sf.sf_warning,
    };
  }

  if (
    code === LOAN_DISPLAY_STATUS.OVERDUE.code ||
    code === LOAN_DISPLAY_STATUS.WRITTEN_OFF.code
  ) {
    return {
      bg: sf.sf_pillErrorBg,
      text: sf.sf_pillErrorText,
      border: sf.sf_error,
    };
  }

  if (code === LOAN_DISPLAY_STATUS.CLOSED.code) {
    return {
      bg: sf.sf_pillInfoBg,
      text: sf.sf_pillInfoText,
      border: sf.sf_info,
    };
  }

  return {
    bg: sf.sf_pillNeutralBg,
    text: sf.sf_pillNeutralText,
    border: sf.sf_borderLight,
  };
}

function getKpiAccent(tone, sf) {
  if (tone === "success") return sf.sf_success;
  if (tone === "warning") return sf.sf_warning;
  if (tone === "danger") return sf.sf_error;
  return sf.sf_brandPrimary;
}

function getDaysPastDue(summary, reportDate) {
  if (!summary?.nextDueDate) return 0;

  const dueDate = new Date(summary.nextDueDate);
  if (Number.isNaN(dueDate.getTime())) return 0;

  const dueMidnight = new Date(dueDate);
  dueMidnight.setHours(0, 0, 0, 0);
  const reportMidnight = new Date(reportDate);
  reportMidnight.setHours(0, 0, 0, 0);

  return Math.floor((reportMidnight - dueMidnight) / 86400000);
}

function buildAgingBreakdown(rows, reportDate) {
  const bucketMap = AGING_BUCKETS.reduce((accumulator, bucket) => {
    accumulator[bucket.key] = {
      ...bucket,
      count: 0,
      balance: 0,
      arrears: 0,
    };
    return accumulator;
  }, {});

  rows.forEach((row) => {
    const daysPastDue = getDaysPastDue(row, reportDate);
    const bucket = AGING_BUCKETS.find(
      (entry) => daysPastDue >= entry.minDays && daysPastDue <= entry.maxDays,
    );

    if (!bucket) return;

    bucketMap[bucket.key].count += 1;
    bucketMap[bucket.key].balance += safeNum(row.loanBalanceAmount);
    bucketMap[bucket.key].arrears += safeNum(row.arrearsAmount);
  });

  return AGING_BUCKETS.map((bucket) => bucketMap[bucket.key]);
}

function buildDimensionBreakdown(rows, getGroupMeta, totalBalance) {
  const groups = rows.reduce((accumulator, row) => {
    const meta = getGroupMeta(row);
    const key = meta?.key || "unassigned";
    const label = meta?.label || "Unassigned";

    if (!accumulator[key]) {
      accumulator[key] = {
        key,
        label,
        count: 0,
        balance: 0,
        arrears: 0,
        missedCount: 0,
      };
    }

    accumulator[key].count += 1;
    accumulator[key].balance += safeNum(row.loanBalanceAmount);
    accumulator[key].arrears += safeNum(row.arrearsAmount);
    if (safeNum(row.missedInstallmentCount) > 0) {
      accumulator[key].missedCount += 1;
    }

    return accumulator;
  }, {});

  return Object.values(groups)
    .map((group) => ({
      ...group,
      balanceShare: totalBalance > 0 ? (group.balance / totalBalance) * 100 : 0,
    }))
    .sort((left, right) => right.balance - left.balance)
    .slice(0, 5);
}

function compareValues(left, right) {
  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }

  const leftDate = typeof left === "string" ? Date.parse(left) : NaN;
  const rightDate = typeof right === "string" ? Date.parse(right) : NaN;
  if (!Number.isNaN(leftDate) && !Number.isNaN(rightDate)) {
    return leftDate - rightDate;
  }

  return String(left ?? "").localeCompare(String(right ?? ""), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

function formatShare(value) {
  return `${Math.round(safeNum(value))}%`;
}

function SectionBlock({ title, subtitle, sf, children }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ mb: 1.3 }}>
        <Typography
          sx={{
            fontSize: "1rem",
            fontWeight: 700,
            color: sf.sf_textPrimary,
          }}
        >
          {title}
        </Typography>
        {subtitle ? (
          <Typography sx={{ fontSize: "0.78rem", color: sf.sf_textTertiary }}>
            {subtitle}
          </Typography>
        ) : null}
      </Box>
      {children}
    </Box>
  );
}

function KpiCard({ label, value, sub, tone = "brand", sf }) {
  const accent = getKpiAccent(tone, sf);

  return (
    <Box
      sx={{
        height: "100%",
        p: 2,
        border: `1px solid ${sf.sf_borderLight}`,
        bgcolor: sf.sf_kpiCardBg,
        boxShadow: sf.sf_shadowSm,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: "0 auto 0 0",
          width: 4,
          bgcolor: accent,
        }}
      />
      <Typography
        sx={{
          fontSize: "0.7rem",
          color: sf.sf_textTertiary,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
          {label}
        </Typography>
        <Typography
          sx={{
            fontSize: "1.3rem",
            fontWeight: 700,
            color: sf.sf_textPrimary,
            lineHeight: 1.25,
            mt: 0.4,
          }}
        >
          {value}
        </Typography>
        {sub && (
          <Typography sx={{ fontSize: "0.74rem", color: sf.sf_textTertiary, mt: 0.5 }}>
            {sub}
          </Typography>
        )}
    </Box>
  );
}

function StatusPill({ code, sf }) {
  const tone = getStatusTone(code, sf);

  return (
    <Chip
      label={getStatusLabel(code)}
      size="small"
      sx={{
        bgcolor: tone.bg,
        color: tone.text,
        border: `1px solid ${tone.border}`,
        borderRadius: 0,
        fontWeight: 600,
        maxWidth: "100%",
        "& .MuiChip-label": {
          display: "block",
          whiteSpace: "normal",
        },
      }}
    />
  );
}

function ConcentrationCard({ title, subtitle, items, currencyCode, sf }) {
  return (
    <Box
      sx={{
        height: "100%",
        p: 2,
        border: `1px solid ${sf.sf_borderLight}`,
        bgcolor: sf.sf_cardBg,
        boxShadow: sf.sf_shadowSm,
      }}
    >
      <Typography sx={{ fontSize: "0.92rem", fontWeight: 700, color: sf.sf_textPrimary }}>
        {title}
      </Typography>
      <Typography sx={{ fontSize: "0.74rem", color: sf.sf_textTertiary, mb: 1.5 }}>
        {subtitle}
      </Typography>
      <Stack spacing={1.25}>
        {items.length === 0 ? (
          <Typography sx={{ fontSize: "0.78rem", color: sf.sf_textTertiary }}>
            No concentration data available.
          </Typography>
        ) : (
          items.map((item) => (
            <Box key={item.key}>
              <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      color: sf.sf_textPrimary,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.label}
                  </Typography>
                  <Typography sx={{ fontSize: "0.72rem", color: sf.sf_textTertiary }}>
                    {item.count} loans · Arrears {fmtMoney(item.arrears, currencyCode)}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                  <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: sf.sf_textPrimary }}>
                    {fmtMoney(item.balance, currencyCode)}
                  </Typography>
                  <Typography sx={{ fontSize: "0.72rem", color: sf.sf_textTertiary }}>
                    {formatShare(item.balanceShare)} of balance
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min(100, safeNum(item.balanceShare))}
                sx={{
                  mt: 0.7,
                  height: 8,
                  borderRadius: 0,
                  bgcolor: sf.sf_progressTrack,
                  "& .MuiLinearProgress-bar": {
                    bgcolor: sf.sf_progressFill,
                  },
                }}
              />
            </Box>
          ))
        )}
      </Stack>
    </Box>
  );
}

function RiskListCard({ title, subtitle, rows, emptyText, currencyCode, sf, metaLabel }) {
  return (
    <Box
      sx={{
        height: "100%",
        p: 2,
        border: `1px solid ${sf.sf_borderLight}`,
        bgcolor: sf.sf_cardBg,
        boxShadow: sf.sf_shadowSm,
      }}
    >
      <Typography sx={{ fontSize: "0.92rem", fontWeight: 700, color: sf.sf_textPrimary }}>
        {title}
      </Typography>
      <Typography sx={{ fontSize: "0.74rem", color: sf.sf_textTertiary, mb: 1.5 }}>
        {subtitle}
      </Typography>
      <Stack spacing={1.2}>
        {rows.length === 0 ? (
          <Typography sx={{ fontSize: "0.78rem", color: sf.sf_textTertiary }}>
            {emptyText}
          </Typography>
        ) : (
          rows.map((row) => (
            <Box
              key={row.id}
              sx={{
                p: 1.25,
                border: `1px solid ${sf.sf_borderLight}`,
                bgcolor: sf.sf_kpiCardBg,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      color: sf.sf_textPrimary,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {row.borrowerDisplayName || "—"}
                  </Typography>
                  <Typography sx={{ fontSize: "0.72rem", color: sf.sf_textTertiary }}>
                    {row.loanNumber || "—"} · {row.branchName || "—"}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                  <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: sf.sf_textPrimary }}>
                    {fmtMoney(row.loanBalanceAmount, currencyCode)}
                  </Typography>
                  <Typography sx={{ fontSize: "0.72rem", color: sf.sf_textTertiary }}>
                    Balance
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  mt: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <StatusPill code={row.displayStatus} sf={sf} />
                <Typography sx={{ fontSize: "0.72rem", color: sf.sf_textTertiary }}>
                  {metaLabel(row)}
                </Typography>
              </Box>
            </Box>
          ))
        )}
      </Stack>
    </Box>
  );
}

export default function PortfolioOverview() {
  const { userDetails } = useContext(UserContext);
  const theme = useTheme();
  const sf = theme.palette.sf;
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState("loanBalanceAmount");
  const [orderDir, setOrderDir] = useState("desc");

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
    const overdueCount = activeSummaries.filter(
      (r) => r.displayStatus === LOAN_DISPLAY_STATUS.OVERDUE.code,
    ).length;
    const averageBalance = active > 0 ? totalBalance / active : 0;
    const arrearsCoverage = totalBalance > 0 ? (totalArrears / totalBalance) * 100 : 0;

    return {
      total,
      active,
      totalPrincipal,
      totalBalance,
      totalArrears,
      totalPaid,
      missedCount,
      missedPct,
      overdueCount,
      averageBalance,
      arrearsCoverage,
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

  const reportDate = useMemo(() => getReportAsOfDate(endDate), [endDate]);
  const in7Days = useMemo(() => {
    const d = new Date(reportDate);
    d.setDate(d.getDate() + 7);
    return d;
  }, [reportDate]);

  // Watchlists
  const upcomingDue = useMemo(
    () =>
      activeSummaries
        .filter((s) => {
          if (!s.nextDueDate) return false;
          const d = new Date(s.nextDueDate);
          return d >= reportDate && d <= in7Days;
        })
        .slice(0, 10),
    [activeSummaries, reportDate, in7Days],
  );

  const noRecentPayment = useMemo(
    () =>
      activeSummaries
        .filter((s) => {
          if (!s.lastPaymentDate) return true; // never paid
          const diff =
            (reportDate - new Date(s.lastPaymentDate)) / (1000 * 60 * 60 * 24);
          return diff >= 30;
        })
        .sort(
          (a, b) => safeNum(b.loanBalanceAmount) - safeNum(a.loanBalanceAmount),
        )
        .slice(0, 10),
    [activeSummaries, reportDate],
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

  const highArrears = useMemo(
    () =>
      [...activeSummaries]
        .filter((row) => safeNum(row.arrearsAmount) > 0)
        .sort((left, right) => safeNum(right.arrearsAmount) - safeNum(left.arrearsAmount))
        .slice(0, 8),
    [activeSummaries],
  );

  const agingBreakdown = useMemo(
    () => buildAgingBreakdown(activeSummaries, reportDate),
    [activeSummaries, reportDate],
  );

  const branchConcentration = useMemo(
    () =>
      buildDimensionBreakdown(
        activeSummaries,
        (row) => ({
          key: row.branchID || "unknown",
          label: branches.find((branch) => branch.id === row.branchID)?.name || row.branchID || "Unknown",
        }),
        kpis.totalBalance,
      ),
    [activeSummaries, branches, kpis.totalBalance],
  );

  const officerConcentration = useMemo(
    () =>
      buildDimensionBreakdown(
        activeSummaries,
        (row) => ({
          key: row.loanOfficerID || row.loanOfficerDisplayName || "unassigned",
          label: row.loanOfficerDisplayName || "Unassigned",
        }),
        kpis.totalBalance,
      ),
    [activeSummaries, kpis.totalBalance],
  );

  const productConcentration = useMemo(
    () =>
      buildDimensionBreakdown(
        activeSummaries,
        (row) => ({
          key: row.loanProductID || row.loanProductName || "unassigned",
          label: row.loanProductName || "Unassigned",
        }),
        kpis.totalBalance,
      ),
    [activeSummaries, kpis.totalBalance],
  );

  // Enriched table rows
  const tableRows = useMemo(
    () =>
      activeSummaries.map((s) => ({
        ...s,
        branchName:
          branches.find((b) => b.id === s.branchID)?.name || s.branchID || "—",
        displayStatusLabel: getStatusLabel(s.displayStatus),
        loanProductName: s.loanProductName || "—",
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
    const column = DETAIL_TABLE_COLUMNS.find((item) => item.key === orderBy);
    const rows = q
      ? tableRows.filter(
          (r) =>
            (r.borrowerDisplayName || "").toLowerCase().includes(q) ||
            (r.loanNumber || "").toLowerCase().includes(q) ||
            (r.branchName || "").toLowerCase().includes(q) ||
            (r.loanOfficerDisplayName || "").toLowerCase().includes(q) ||
            (r.loanProductName || "").toLowerCase().includes(q),
        )
      : tableRows;

    return [...rows].sort((a, b) => {
      const av = column?.sortValue ? column.sortValue(a) : a[orderBy];
      const bv = column?.sortValue ? column.sortValue(b) : b[orderBy];
      const cmp = compareValues(av, bv);
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
    const csv = toCsv(filteredRows, EXPORT_COLUMNS);
    downloadFile(csv, "portfolio_overview.csv", "text/csv");
  };

  const handleExportJson = () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      startDate,
      endDate,
      kpis,
      statusBreakdown,
      agingBreakdown,
      branchRollup,
      branchConcentration,
      officerConcentration,
      productConcentration,
    };
    downloadFile(
      JSON.stringify(payload, null, 2),
      "portfolio_overview.json",
      "application/json",
    );
  };

  const handleSaveSnapshot = async () => {
    const payload = {
      kpis,
      statusBreakdown,
      agingBreakdown,
      branchRollup,
      branchConcentration,
      officerConcentration,
      productConcentration,
    };
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

  const selectedBranchName =
    branches.find((branch) => branch.id === selectedBranchId)?.name || null;
  const scopeLabel = scope.isAdmin
    ? selectedBranchName || (branches.length === 1 ? branches[0]?.name : "All branches")
    : selectedBranchName || "My branch";
  const topBranch = branchConcentration[0];
  const topOfficer = officerConcentration[0];
  const topProduct = productConcentration[0];

  return (
    <ReportShell
      title="Portfolio Overview"
      description="Executive summary of portfolio health, concentration, aging pressure, and repayment momentum using the live loan summary projection."
      isAdmin={scope.isAdmin}
      branches={branches}
      selectedBranchId={selectedBranchId}
      onBranchChange={(v) => setSelectedBranchId(v || null)}
      startDate={startDate}
      endDate={endDate}
      onStartDateChange={setStartDate}
      onEndDateChange={setEndDate}
      showDateFilters={true}
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
      <Box
        sx={{
          mb: 3,
          p: 2,
          border: `1px solid ${sf.sf_borderLight}`,
          bgcolor: sf.sf_cardBg,
          boxShadow: sf.sf_shadowSm,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "0.72rem",
                color: sf.sf_textTertiary,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Portfolio Coverage
            </Typography>
            <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: sf.sf_textPrimary }}>
              {scopeLabel}
            </Typography>
            <Typography sx={{ fontSize: "0.76rem", color: sf.sf_textTertiary, mt: 0.4 }}>
              As of {fmtReportDate(reportDate)}
              {startDate || endDate
                ? ` · Window ${startDate || "Start"} to ${endDate || "Today"}`
                : " · Full available loan summary set"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {topBranch ? (
              <Box
                sx={{
                  minWidth: 170,
                  px: 1.4,
                  py: 1,
                  border: `1px solid ${sf.sf_borderLight}`,
                  bgcolor: sf.sf_kpiCardBg,
                }}
              >
                <Typography sx={{ fontSize: "0.68rem", color: sf.sf_textTertiary, textTransform: "uppercase" }}>
                  Largest Branch Exposure
                </Typography>
                <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: sf.sf_textPrimary }}>
                  {topBranch.label}
                </Typography>
                <Typography sx={{ fontSize: "0.74rem", color: sf.sf_textTertiary }}>
                  {formatShare(topBranch.balanceShare)} of outstanding balance
                </Typography>
              </Box>
            ) : null}
            {topOfficer ? (
              <Box
                sx={{
                  minWidth: 170,
                  px: 1.4,
                  py: 1,
                  border: `1px solid ${sf.sf_borderLight}`,
                  bgcolor: sf.sf_kpiCardBg,
                }}
              >
                <Typography sx={{ fontSize: "0.68rem", color: sf.sf_textTertiary, textTransform: "uppercase" }}>
                  Largest Officer Book
                </Typography>
                <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: sf.sf_textPrimary }}>
                  {topOfficer.label}
                </Typography>
                <Typography sx={{ fontSize: "0.74rem", color: sf.sf_textTertiary }}>
                  {formatShare(topOfficer.balanceShare)} of outstanding balance
                </Typography>
              </Box>
            ) : null}
            {topProduct ? (
              <Box
                sx={{
                  minWidth: 170,
                  px: 1.4,
                  py: 1,
                  border: `1px solid ${sf.sf_borderLight}`,
                  bgcolor: sf.sf_kpiCardBg,
                }}
              >
                <Typography sx={{ fontSize: "0.68rem", color: sf.sf_textTertiary, textTransform: "uppercase" }}>
                  Largest Product Mix
                </Typography>
                <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: sf.sf_textPrimary }}>
                  {topProduct.label}
                </Typography>
                <Typography sx={{ fontSize: "0.74rem", color: sf.sf_textTertiary }}>
                  {formatShare(topProduct.balanceShare)} of outstanding balance
                </Typography>
              </Box>
            ) : null}
          </Box>
        </Box>
      </Box>

      <SectionBlock
        title="Key Metrics"
        subtitle="LoansDisplay-inspired metric cards with portfolio size, repayment momentum, and delinquency pressure."
        sf={sf}
      >
      <Grid container spacing={2} sx={{ mb: 0 }}>
        <Grid item xs={6} sm={4} md={3}>
          <KpiCard label="Total Loans in Scope" value={kpis.total} sf={sf} />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <KpiCard label="Active Loans" value={kpis.active} sf={sf} />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <KpiCard
            label="Total Principal Disbursed"
            value={fmtMoney(kpis.totalPrincipal, currencyCode)}
            sf={sf}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <KpiCard
            label="Total Outstanding Balance"
            value={fmtMoney(kpis.totalBalance, currencyCode)}
            sf={sf}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <KpiCard
            label="Total Arrears"
            value={fmtMoney(kpis.totalArrears, currencyCode)}
            tone="warning"
            sf={sf}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <KpiCard
            label="Total Collected"
            value={fmtMoney(kpis.totalPaid, currencyCode)}
            tone="success"
            sf={sf}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <KpiCard
            label="Arrears Coverage"
            value={fmtPct(kpis.arrearsCoverage)}
            sub={`${kpis.overdueCount} overdue loans in active portfolio`}
            tone={kpis.arrearsCoverage >= 10 ? "warning" : "brand"}
            sf={sf}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <KpiCard
            label="Missed Installments"
            value={fmtPct(kpis.missedPct)}
            sub={`${kpis.missedCount} of ${kpis.active} active loans`}
            tone={kpis.missedPct > 10 ? "danger" : "brand"}
            sf={sf}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <KpiCard
            label="Average Active Balance"
            value={fmtMoney(kpis.averageBalance, currencyCode)}
            sub="Outstanding balance per active loan"
            sf={sf}
          />
        </Grid>
      </Grid>
      </SectionBlock>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} lg={6}>
          <SectionBlock
            title="Status Mix"
            subtitle="Current status distribution by count and portfolio balance."
            sf={sf}
          >
            <Box sx={{ display: "grid", gap: 1, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" } }}>
              {statusBreakdown.map((item) => (
                <Box
                  key={item.code}
                  sx={{
                    p: 1.5,
                    border: `1px solid ${sf.sf_borderLight}`,
                    bgcolor: sf.sf_cardBg,
                    boxShadow: sf.sf_shadowSm,
                  }}
                >
                  <StatusPill code={item.code} sf={sf} />
                  <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: sf.sf_textPrimary, mt: 1 }}>
                    {item.count} loans
                  </Typography>
                  <Typography sx={{ fontSize: "0.75rem", color: sf.sf_textTertiary, mt: 0.35 }}>
                    {fmtMoney(item.balance, currencyCode)} balance · {formatShare(windowSummaries.length > 0 ? (item.count / windowSummaries.length) * 100 : 0)} of scoped loans
                  </Typography>
                </Box>
              ))}
            </Box>
          </SectionBlock>
        </Grid>
        <Grid item xs={12} lg={6}>
          <SectionBlock
            title="Aging and Delinquency"
            subtitle="Outstanding balances grouped by how far the next unpaid due date sits behind the selected report date."
            sf={sf}
          >
            <Box sx={{ display: "grid", gap: 1 }}>
              {agingBreakdown.map((bucket) => (
                <Box
                  key={bucket.key}
                  sx={{
                    p: 1.5,
                    border: `1px solid ${sf.sf_borderLight}`,
                    bgcolor: sf.sf_cardBg,
                    boxShadow: sf.sf_shadowSm,
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                    <Box>
                      <Typography sx={{ fontSize: "0.84rem", fontWeight: 700, color: sf.sf_textPrimary }}>
                        {bucket.label}
                      </Typography>
                      <Typography sx={{ fontSize: "0.72rem", color: sf.sf_textTertiary }}>
                        {bucket.count} loans · Arrears {fmtMoney(bucket.arrears, currencyCode)}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: "0.84rem", fontWeight: 700, color: sf.sf_textPrimary }}>
                      {fmtMoney(bucket.balance, currencyCode)}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, kpis.totalBalance > 0 ? (bucket.balance / kpis.totalBalance) * 100 : 0)}
                    sx={{
                      mt: 0.85,
                      height: 8,
                      borderRadius: 0,
                      bgcolor: sf.sf_progressTrack,
                      "& .MuiLinearProgress-bar": {
                        bgcolor:
                          bucket.key === "current"
                            ? sf.sf_progressSuccess
                            : bucket.key === "1_30"
                              ? sf.sf_warning
                              : sf.sf_error,
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </SectionBlock>
        </Grid>
      </Grid>

      <SectionBlock
        title="Concentration Snapshot"
        subtitle="Top portfolio concentrations by branch, officer, and product using current outstanding balance."
        sf={sf}
      >
        <Grid container spacing={2} sx={{ mb: 0 }}>
          <Grid item xs={12} md={4}>
            <ConcentrationCard
              title="By Branch"
              subtitle="Largest balance concentrations in the selected scope."
              items={branchConcentration}
              currencyCode={currencyCode}
              sf={sf}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <ConcentrationCard
              title="By Loan Officer"
              subtitle="Books with the largest active exposure."
              items={officerConcentration}
              currencyCode={currencyCode}
              sf={sf}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <ConcentrationCard
              title="By Product"
              subtitle="Product mix concentration without extra schema changes."
              items={productConcentration}
              currencyCode={currencyCode}
              sf={sf}
            />
          </Grid>
        </Grid>
      </SectionBlock>

      {scope.isAdmin && branchRollup.length > 0 && (
        <SectionBlock
          title="Branch Rollup"
          subtitle="Admin view of branch-level balance, arrears, and missed installment pressure."
          sf={sf}
        >
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{
              mb: 0,
              borderRadius: 0,
              borderColor: sf.sf_borderLight,
              boxShadow: sf.sf_shadowSm,
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  {[
                    "Branch",
                    "Loans",
                    "Outstanding Balance",
                    "Arrears",
                    "Missed Inst.",
                    "Overdue",
                  ].map((label) => (
                    <TableCell
                      key={label}
                      align={label === "Branch" ? "left" : "right"}
                      sx={{
                        bgcolor: sf.sf_tableHeaderBg,
                        color: sf.sf_tableHeaderText,
                        fontWeight: 700,
                        borderBottom: `1px solid ${sf.sf_tableBorder}`,
                      }}
                    >
                      {label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {branchRollup.map((r) => (
                  <TableRow
                    key={r.branchId}
                    hover
                    sx={{ "&:hover": { bgcolor: sf.sf_rowHover } }}
                  >
                    <TableCell sx={{ borderBottom: `1px solid ${sf.sf_tableBorder}` }}>
                      {r.branchName}
                    </TableCell>
                    <TableCell align="right" sx={{ borderBottom: `1px solid ${sf.sf_tableBorder}` }}>
                      {r.loanCount}
                    </TableCell>
                    <TableCell align="right" sx={{ borderBottom: `1px solid ${sf.sf_tableBorder}` }}>
                      {fmtMoney(r.outstandingBalance, currencyCode)}
                    </TableCell>
                    <TableCell align="right" sx={{ borderBottom: `1px solid ${sf.sf_tableBorder}` }}>
                      {fmtMoney(r.arrearsAmount, currencyCode)}
                    </TableCell>
                    <TableCell align="right" sx={{ borderBottom: `1px solid ${sf.sf_tableBorder}` }}>
                      {r.missedCount}
                    </TableCell>
                    <TableCell align="right" sx={{ borderBottom: `1px solid ${sf.sf_tableBorder}` }}>
                      {r.overdueCount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </SectionBlock>
      )}

      <SectionBlock
        title="Portfolio Risk Highlights"
        subtitle="Operational watchlists built from existing summary dates, arrears, and repayment history."
        sf={sf}
      >
      <Grid container spacing={2} sx={{ mb: 0 }}>
        <Grid item xs={12} md={4}>
          <RiskListCard
            title={`High Arrears (${highArrears.length})`}
            subtitle="Largest arrears balances to review first."
            rows={highArrears}
            emptyText="No loans with arrears in the current scope."
            currencyCode={currencyCode}
            sf={sf}
            metaLabel={(row) => `Arrears ${fmtMoney(row.arrearsAmount, currencyCode)}`}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <RiskListCard
            title={`No Payment in 30+ Days (${noRecentPayment.length})`}
            subtitle="Accounts with stale repayment activity and active exposure."
            rows={noRecentPayment}
            emptyText="All active loans show recent payment activity."
            currencyCode={currencyCode}
            sf={sf}
            metaLabel={(row) => `Last payment ${fmtReportDate(row.lastPaymentDate)}`}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <RiskListCard
            title={`Due in Next 7 Days (${upcomingDue.length})`}
            subtitle="Near-term maturities and scheduled balances requiring attention."
            rows={upcomingDue.length > 0 ? upcomingDue : largestBalances}
            emptyText="No loans are due inside the next seven days."
            currencyCode={currencyCode}
            sf={sf}
            metaLabel={(row) => `Next due ${fmtReportDate(row.nextDueDate)}`}
          />
        </Grid>
      </Grid>
      </SectionBlock>

      <SectionBlock
        title="Detailed Portfolio"
        subtitle="Searchable active-loan detail table with numeric sorting, product visibility, and status-aware styling."
        sf={sf}
      >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
          mb: 1.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: sf.sf_searchBg,
            border: `1px solid ${sf.sf_searchBorder}`,
            borderRadius: 0,
            px: 1.2,
            py: 0.4,
            minWidth: 260,
            maxWidth: 360,
            flex: "1 1 260px",
            transition: "border-color 0.15s",
            "&:focus-within": { borderColor: sf.sf_searchFocusBorder },
          }}
        >
          <InputBase
            placeholder="Search borrower, loan #, branch, officer, product..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            sx={{
              flex: 1,
              fontSize: "0.82rem",
              color: sf.sf_textPrimary,
              "& ::placeholder": {
                color: sf.sf_searchPlaceholder,
                opacity: 1,
              },
            }}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: sf.sf_textTertiary }} />
              </InputAdornment>
            }
          />
        </Box>
        <Typography sx={{ fontSize: "0.76rem", color: sf.sf_textTertiary, alignSelf: "center" }}>
          {filteredRows.length} active loans shown · Sorted by {DETAIL_TABLE_COLUMNS.find((column) => column.key === orderBy)?.label || "Balance"}
        </Typography>
      </Box>
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{
          borderRadius: 0,
          borderColor: sf.sf_borderLight,
          boxShadow: sf.sf_shadowSm,
          overflowX: "auto",
        }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {DETAIL_TABLE_COLUMNS.map((col) => (
                <TableCell
                  key={col.key}
                  align={col.align || "left"}
                  sx={{
                    bgcolor: sf.sf_tableHeaderBg,
                    color: sf.sf_tableHeaderText,
                    fontWeight: 700,
                    borderBottom: `1px solid ${sf.sf_tableBorder}`,
                    whiteSpace: "nowrap",
                  }}
                >
                  <TableSortLabel
                    active={orderBy === col.key}
                    direction={orderBy === col.key ? orderDir : "asc"}
                    onClick={() => handleSort(col.key)}
                    sx={{ color: `${sf.sf_tableHeaderText} !important` }}
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
                  colSpan={DETAIL_TABLE_COLUMNS.length}
                  align="center"
                  sx={{ borderBottom: `1px solid ${sf.sf_tableBorder}` }}
                >
                  <Typography sx={{ fontSize: "0.78rem", color: sf.sf_textTertiary }}>
                    {loading ? "Loading…" : "No records found."}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {filteredRows.map((row) => (
              <TableRow
                key={row.id}
                hover
                sx={{
                  "&:nth-of-type(even)": { bgcolor: sf.sf_rowStripeBg },
                  "&:hover": { bgcolor: sf.sf_rowHover },
                }}
              >
                {DETAIL_TABLE_COLUMNS.map((col) => (
                  <TableCell
                    key={col.key}
                    align={col.align || "left"}
                    sx={{ borderBottom: `1px solid ${sf.sf_tableBorder}` }}
                  >
                    {col.key === "displayStatus" ? (
                      <StatusPill code={row.displayStatus} sf={sf} />
                    ) : col.key === "principalAmount" ? (
                      row.principalAmountFmt
                    ) : col.key === "loanBalanceAmount" ? (
                      row.loanBalanceAmountFmt
                    ) : col.key === "arrearsAmount" ? (
                      row.arrearsAmountFmt
                    ) : col.key === "totalPaidAmount" ? (
                      row.totalPaidAmountFmt
                    ) : col.key === "nextDueDate" ? (
                      row.nextDueDateFmt
                    ) : col.key === "lastPaymentDate" ? (
                      row.lastPaymentDateFmt
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
      </SectionBlock>
    </ReportShell>
  );
}
