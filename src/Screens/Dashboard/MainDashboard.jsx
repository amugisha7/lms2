import React, { useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Chip,
  Grid,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";

import { UserContext } from "../../App";
import { useReportData } from "../Reports/useReportData";
import { fmtMoney, fmtReportDate, safeNum } from "../Reports/reportUtils";
import { LOAN_DISPLAY_STATUS } from "../../Models/Loans/loanSummaryProjection";

// ─── Constants ────────────────────────────────────────────────────────────────

const ACTIVE_CODES = new Set([
  LOAN_DISPLAY_STATUS.CURRENT.code,
  LOAN_DISPLAY_STATUS.MISSED_PAYMENT.code,
  LOAN_DISPLAY_STATUS.OVERDUE.code,
]);

const STATUS_DISPLAY_ORDER = [
  LOAN_DISPLAY_STATUS.CURRENT.code,
  LOAN_DISPLAY_STATUS.MISSED_PAYMENT.code,
  LOAN_DISPLAY_STATUS.OVERDUE.code,
  LOAN_DISPLAY_STATUS.CLOSED.code,
  LOAN_DISPLAY_STATUS.WRITTEN_OFF.code,
];

const AGING_DEFS = [
  { label: "Current", min: -Infinity, max: 0 },
  { label: "1–30d", min: 1, max: 30 },
  { label: "31–60d", min: 31, max: 60 },
  { label: "61–90d", min: 61, max: 90 },
  { label: "90+d", min: 91, max: Infinity },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getKpiAccent(tone, sf) {
  if (tone === "success") return sf.sf_success || "#2e7d32";
  if (tone === "warning") return sf.sf_warning || "#ed6c02";
  if (tone === "danger") return sf.sf_error || "#d32f2f";
  return sf.sf_brandPrimary || "#0176d3";
}

function getStatusMeta(code, sf) {
  const map = {
    [LOAN_DISPLAY_STATUS.CURRENT.code]: {
      label: "Current",
      bg: sf.sf_pillSuccessBg,
      text: sf.sf_pillSuccessText,
      border: sf.sf_success,
      color: sf.sf_success || "#2e7d32",
    },
    [LOAN_DISPLAY_STATUS.MISSED_PAYMENT.code]: {
      label: "Missed Payment",
      bg: sf.sf_pillWarningBg,
      text: sf.sf_pillWarningText,
      border: sf.sf_warning,
      color: sf.sf_warning || "#ed6c02",
    },
    [LOAN_DISPLAY_STATUS.OVERDUE.code]: {
      label: "Overdue",
      bg: sf.sf_pillErrorBg,
      text: sf.sf_pillErrorText,
      border: sf.sf_error,
      color: sf.sf_error || "#d32f2f",
    },
    [LOAN_DISPLAY_STATUS.CLOSED.code]: {
      label: "Closed",
      bg: sf.sf_pillInfoBg,
      text: sf.sf_pillInfoText,
      border: sf.sf_info,
      color: sf.sf_info || "#0288d1",
    },
    [LOAN_DISPLAY_STATUS.WRITTEN_OFF.code]: {
      label: "Written Off",
      bg: sf.sf_pillNeutralBg,
      text: sf.sf_pillNeutralText,
      border: sf.sf_borderMedium,
      color: sf.sf_textSecondary || "#767676",
    },
  };
  return (
    map[code] || {
      label: code,
      bg: sf.sf_pillNeutralBg,
      text: sf.sf_pillNeutralText,
      border: sf.sf_borderLight,
      color: sf.sf_textTertiary || "#9e9e9e",
    }
  );
}

function getDaysPastDue(summary) {
  if (!summary?.nextDueDate) return 0;
  const due = new Date(summary.nextDueDate);
  if (isNaN(due.getTime())) return 0;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((now - due) / 86400000));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, tone = "brand", sf, onClick }) {
  const accent = getKpiAccent(tone, sf);
  return (
    <Box
      onClick={onClick}
      sx={{
        height: "100%",
        minHeight: 88,
        p: 2,
        border: `1px solid ${sf.sf_borderLight}`,
        bgcolor: sf.sf_kpiCardBg,
        boxShadow: sf.sf_shadowSm,
        position: "relative",
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        transition: "box-shadow 0.15s",
        "&:hover": onClick ? { boxShadow: sf.sf_shadowMd } : {},
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
          fontSize: "0.67rem",
          color: sf.sf_textTertiary,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          fontWeight: 600,
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
        {value ?? "—"}
      </Typography>
      {sub && (
        <Typography sx={{ fontSize: "0.7rem", color: sf.sf_textTertiary, mt: 0.35 }}>
          {sub}
        </Typography>
      )}
    </Box>
  );
}

function QuickAction({ icon, label, description, onClick, sf }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        px: 2,
        py: "10px",
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        bgcolor: sf.sf_cardBg,
        cursor: "pointer",
        transition: "background-color 0.12s",
        "&:hover": { bgcolor: sf.sf_rowHover },
      }}
    >
      <Box sx={{ color: sf.sf_brandPrimary, flexShrink: 0, display: "flex" }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography
          sx={{ fontSize: "0.83rem", fontWeight: 600, color: sf.sf_textPrimary }}
        >
          {label}
        </Typography>
        {description && (
          <Typography sx={{ fontSize: "0.7rem", color: sf.sf_textTertiary }}>
            {description}
          </Typography>
        )}
      </Box>
      <ArrowForwardIosIcon sx={{ fontSize: 10, color: sf.sf_textTertiary, flexShrink: 0 }} />
    </Box>
  );
}

function SectionHeader({ children, sf, action }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 1.5,
      }}
    >
      <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: sf.sf_textPrimary }}>
        {children}
      </Typography>
      {action}
    </Box>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MainDashboard() {
  const theme = useTheme();
  const sf = theme.palette.sf || {};
  const navigate = useNavigate();
  const { userDetails } = useContext(UserContext);

  // Use the branch already loaded in context — no gating
  const activeBranchId =
    userDetails?.branchID || userDetails?.branch?.id || null;

  const { summaries, loading, scope } = useReportData({
    selectedBranchId: activeBranchId,
  });

  const currencyCode =
    scope?.currencyCode || userDetails?.institution?.currencyCode || "UGX";

  const today = useMemo(() => new Date(), []);
  const firstOfMonth = useMemo(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
    [today],
  );

  const greeting = useMemo(() => {
    const h = today.getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  }, [today]);

  const firstName = userDetails?.firstName || "";
  const branchName = userDetails?.branch?.name || "";
  const institutionName = userDetails?.institution?.name || "";

  const dateStr = today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const monthLabel = today.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  // ── Aging colors keyed by bucket index ──────────────────────────────────────
  const agingColors = [
    sf.sf_success || "#2e7d32",
    sf.sf_warning || "#ed6c02",
    "#e65100",
    sf.sf_error || "#d32f2f",
    "#7f0000",
  ];

  // ── Computed metrics ────────────────────────────────────────────────────────

  const metrics = useMemo(() => {
    const active = summaries.filter((s) => ACTIVE_CODES.has(s.displayStatus));
    const overdue = summaries.filter(
      (s) => s.displayStatus === LOAN_DISPLAY_STATUS.OVERDUE.code,
    );
    const missed = summaries.filter(
      (s) => s.displayStatus === LOAN_DISPLAY_STATUS.MISSED_PAYMENT.code,
    );

    const outstanding = active.reduce(
      (sum, s) => sum + safeNum(s.loanBalanceAmount),
      0,
    );
    const totalArrears = active.reduce(
      (sum, s) => sum + safeNum(s.arrearsAmount),
      0,
    );
    const totalPrincipal = summaries.reduce(
      (sum, s) => sum + safeNum(s.principalAmount),
      0,
    );

    const thisMonth = summaries.filter((s) => {
      if (!s.startDate) return false;
      const sd = new Date(s.startDate);
      return !isNaN(sd.getTime()) && sd >= firstOfMonth;
    });
    const thisMonthPrincipal = thisMonth.reduce(
      (sum, s) => sum + safeNum(s.principalAmount),
      0,
    );

    const par30Balance = active
      .filter((s) => getDaysPastDue(s) >= 30)
      .reduce((sum, s) => sum + safeNum(s.loanBalanceAmount), 0);
    const par30Pct = outstanding > 0 ? (par30Balance / outstanding) * 100 : 0;

    const recentLoans = [...summaries]
      .filter((s) => s.startDate)
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
      .slice(0, 8);

    const atRisk = [...overdue, ...missed]
      .filter((s) => safeNum(s.arrearsAmount) > 0)
      .sort((a, b) => safeNum(b.arrearsAmount) - safeNum(a.arrearsAmount))
      .slice(0, 5);

    // Aging buckets (active loans only)
    const aging = AGING_DEFS.map((def) => ({ ...def, count: 0, balance: 0 }));
    active.forEach((s) => {
      const dpd = getDaysPastDue(s);
      const bucket = aging.find((b) => dpd >= b.min && dpd <= b.max);
      if (bucket) {
        bucket.count++;
        bucket.balance += safeNum(s.loanBalanceAmount);
      }
    });

    // Status breakdown for pie chart
    const statusBreakdown = STATUS_DISPLAY_ORDER.map((code) => ({
      code,
      count: summaries.filter((s) => s.displayStatus === code).length,
    })).filter((s) => s.count > 0);

    return {
      activeCount: active.length,
      overdueCount: overdue.length,
      missedCount: missed.length,
      outstanding,
      totalArrears,
      totalPrincipal,
      totalCount: summaries.length,
      thisMonthCount: thisMonth.length,
      thisMonthPrincipal,
      par30Pct,
      recentLoans,
      atRisk,
      aging,
      statusBreakdown,
    };
  }, [summaries, firstOfMonth]);

  // ── Chart data ──────────────────────────────────────────────────────────────

  const pieData = useMemo(
    () =>
      metrics.statusBreakdown.map(({ code, count }) => {
        const meta = getStatusMeta(code, sf);
        return { id: code, value: count, label: meta.label, color: meta.color };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [metrics.statusBreakdown, theme.palette.mode],
  );

  const agingDataset = useMemo(
    () =>
      metrics.aging.map((b) => ({
        label: b.label,
        count: b.count,
        balance: b.balance,
      })),
    [metrics.aging],
  );

  // ── Cell styles ─────────────────────────────────────────────────────────────

  const headCellSx = {
    py: 0.75,
    px: 1.5,
    fontSize: "0.67rem",
    fontWeight: 700,
    color: sf.sf_textTertiary,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    bgcolor: sf.sf_tableHeaderBg,
    borderBottom: `1px solid ${sf.sf_tableBorder}`,
  };
  const cellSx = {
    py: 0.8,
    px: 1.5,
    fontSize: "0.79rem",
    color: sf.sf_textPrimary,
    borderBottom: `1px solid ${sf.sf_borderLight}`,
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ width: "100%" }}>
      {loading && (
        <LinearProgress sx={{ mb: 2, height: 2, bgcolor: sf.sf_borderLight }} />
      )}

      {/* ── Header ── */}
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{ fontSize: "1.35rem", fontWeight: 700, color: sf.sf_textPrimary }}
        >
          {greeting}
          {firstName ? `, ${firstName}` : ""}
        </Typography>
        <Typography sx={{ fontSize: "0.8rem", color: sf.sf_textSecondary, mt: 0.2 }}>
          {dateStr}
          {branchName
            ? ` · ${branchName}`
            : institutionName
              ? ` · ${institutionName}`
              : ""}
        </Typography>
      </Box>

      {/* ── KPI Row 1 ── */}
      <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            label="Active Loans"
            value={loading ? "…" : metrics.activeCount}
            sub={
              metrics.overdueCount + metrics.missedCount > 0
                ? `${metrics.overdueCount + metrics.missedCount} with arrears`
                : "all current"
            }
            tone="brand"
            sf={sf}
            onClick={() => navigate("/loans")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            label="Outstanding Balance"
            value={loading ? "…" : fmtMoney(metrics.outstanding, currencyCode)}
            sub="active portfolio"
            tone="brand"
            sf={sf}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            label="Total Arrears"
            value={loading ? "…" : fmtMoney(metrics.totalArrears, currencyCode)}
            sub={
              metrics.totalArrears > 0 && metrics.outstanding > 0
                ? `${((metrics.totalArrears / metrics.outstanding) * 100).toFixed(1)}% of portfolio`
                : "no arrears"
            }
            tone={metrics.totalArrears > 0 ? "danger" : "success"}
            sf={sf}
            onClick={() => navigate("/reports/delinquency")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            label="PAR 30"
            value={loading ? "…" : `${metrics.par30Pct.toFixed(1)}%`}
            sub="portfolio at risk ≥ 30 days"
            tone={
              metrics.par30Pct > 30
                ? "danger"
                : metrics.par30Pct > 10
                  ? "warning"
                  : "success"
            }
            sf={sf}
            onClick={() => navigate("/reports/par-summary")}
          />
        </Grid>
      </Grid>

      {/* ── KPI Row 2 ── */}
      <Grid container spacing={1.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            label={`New Disbursements — ${monthLabel}`}
            value={loading ? "…" : fmtMoney(metrics.thisMonthPrincipal, currencyCode)}
            sub={`${metrics.thisMonthCount} loan${metrics.thisMonthCount !== 1 ? "s" : ""} this month`}
            tone="success"
            sf={sf}
            onClick={() => navigate("/reports/disbursement")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            label="Overdue Loans"
            value={loading ? "…" : metrics.overdueCount}
            sub="require immediate attention"
            tone={metrics.overdueCount > 0 ? "danger" : "success"}
            sf={sf}
            onClick={() => navigate("/reports/delinquency")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            label="Missed Payments"
            value={loading ? "…" : metrics.missedCount}
            sub="current but behind schedule"
            tone={metrics.missedCount > 0 ? "warning" : "success"}
            sf={sf}
            onClick={() => navigate("/reports/delinquency")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            label="Total Loans Issued"
            value={loading ? "…" : metrics.totalCount}
            sub={fmtMoney(metrics.totalPrincipal, currencyCode) + " total principal"}
            tone="brand"
            sf={sf}
            onClick={() => navigate("/loans")}
          />
        </Grid>
      </Grid>

      {/* ── Charts Row ── */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* Portfolio distribution — donut pie chart */}
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              p: 2,
              height: "100%",
              border: `1px solid ${sf.sf_borderLight}`,
              bgcolor: sf.sf_cardBg,
              boxShadow: sf.sf_shadowSm,
            }}
          >
            <SectionHeader sf={sf}>Portfolio Distribution</SectionHeader>
            {pieData.length === 0 && !loading ? (
              <Typography sx={{ fontSize: "0.82rem", color: sf.sf_textTertiary }}>
                No data available.
              </Typography>
            ) : (
              <>
                <Box sx={{ width: "100%" }}>
                  <PieChart
                    series={[
                      {
                        data: pieData,
                        innerRadius: 48,
                        outerRadius: 90,
                        paddingAngle: 2,
                        cornerRadius: 2,
                        highlightScope: { fade: "global", highlight: "item" },
                      },
                    ]}
                    height={210}
                    slotProps={{ legend: { hidden: true } }}
                    margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
                  />
                </Box>
                {/* Custom legend */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.7, mt: 0.5 }}>
                  {pieData.map((item) => {
                    const pct =
                      metrics.totalCount > 0
                        ? ((item.value / metrics.totalCount) * 100).toFixed(0)
                        : 0;
                    return (
                      <Box
                        key={item.id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            bgcolor: item.color,
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            color: sf.sf_textSecondary,
                            flexGrow: 1,
                          }}
                        >
                          {item.label}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            color: sf.sf_textPrimary,
                          }}
                        >
                          {item.value}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "0.7rem",
                            color: sf.sf_textTertiary,
                            minWidth: 34,
                            textAlign: "right",
                          }}
                        >
                          {pct}%
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </>
            )}
          </Box>
        </Grid>

        {/* Aging analysis — bar chart */}
        <Grid item xs={12} md={7}>
          <Box
            sx={{
              p: 2,
              height: "100%",
              border: `1px solid ${sf.sf_borderLight}`,
              bgcolor: sf.sf_cardBg,
              boxShadow: sf.sf_shadowSm,
            }}
          >
            <SectionHeader
              sf={sf}
              action={
                <Typography sx={{ fontSize: "0.72rem", color: sf.sf_textTertiary }}>
                  active loans by days past due
                </Typography>
              }
            >
              Aging Analysis
            </SectionHeader>
            {metrics.activeCount === 0 && !loading ? (
              <Typography sx={{ fontSize: "0.82rem", color: sf.sf_textTertiary }}>
                No active loans to display.
              </Typography>
            ) : (
              <>
                <Box sx={{ width: "100%", mt: -1 }}>
                  <BarChart
                    dataset={agingDataset}
                    xAxis={[
                      {
                        scaleType: "band",
                        dataKey: "label",
                        colorMap: {
                          type: "ordinal",
                          colors: agingColors,
                        },
                        tickLabelStyle: {
                          fontSize: 11,
                          fill: sf.sf_textSecondary || "#767676",
                        },
                      },
                    ]}
                    yAxis={[
                      {
                        tickLabelStyle: {
                          fontSize: 10,
                          fill: sf.sf_textTertiary || "#9e9e9e",
                        },
                      },
                    ]}
                    series={[
                      {
                        dataKey: "count",
                        label: "Loans",
                        valueFormatter: (v) => `${v} loan${v !== 1 ? "s" : ""}`,
                      },
                    ]}
                    height={210}
                    slotProps={{ legend: { hidden: true } }}
                    margin={{ top: 10, right: 12, bottom: 30, left: 36 }}
                    sx={{
                      "& .MuiChartsAxis-line": {
                        stroke: sf.sf_borderLight || "#e0e0e0",
                      },
                      "& .MuiChartsAxis-tick": {
                        stroke: sf.sf_borderLight || "#e0e0e0",
                      },
                    }}
                  />
                </Box>
                {/* Balance summary row */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    mt: 0.5,
                    flexWrap: "wrap",
                  }}
                >
                  {metrics.aging.map((b, i) => (
                    <Box
                      key={b.label}
                      sx={{
                        flex: 1,
                        minWidth: 80,
                        textAlign: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.65rem",
                          color: agingColors[i],
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.03em",
                        }}
                      >
                        {b.label}
                      </Typography>
                      <Typography
                        sx={{ fontSize: "0.7rem", color: sf.sf_textTertiary }}
                      >
                        {fmtMoney(b.balance, currencyCode)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* ── Recent Loans + Quick Actions + Alerts ── */}
      <Grid container spacing={2}>
        {/* Recent loans table */}
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              border: `1px solid ${sf.sf_borderLight}`,
              bgcolor: sf.sf_cardBg,
              boxShadow: sf.sf_shadowSm,
            }}
          >
            <Box sx={{ p: 2, pb: 0.5 }}>
              <SectionHeader
                sf={sf}
                action={
                  <Typography
                    onClick={() => navigate("/loans")}
                    sx={{
                      fontSize: "0.74rem",
                      color: sf.sf_textLink,
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    View all
                  </Typography>
                }
              >
                Recently Disbursed
              </SectionHeader>
            </Box>
            {!loading && metrics.recentLoans.length === 0 ? (
              <Box sx={{ px: 2, pb: 2 }}>
                <Typography sx={{ fontSize: "0.82rem", color: sf.sf_textTertiary }}>
                  No loans found.
                </Typography>
              </Box>
            ) : (
              <Table
                size="small"
                sx={{ "& td, & th": { borderColor: sf.sf_tableBorder } }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={headCellSx}>Borrower</TableCell>
                    <TableCell sx={headCellSx}>Loan #</TableCell>
                    <TableCell sx={headCellSx}>Status</TableCell>
                    <TableCell sx={{ ...headCellSx, textAlign: "right" }}>
                      Balance
                    </TableCell>
                    <TableCell sx={headCellSx}>Next Due</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {metrics.recentLoans.map((loan) => {
                    const meta = getStatusMeta(loan.displayStatus, sf);
                    return (
                      <TableRow
                        key={loan.id || loan.loanNumber}
                        onClick={() =>
                          loan.id && navigate(`/loans/id/${loan.id}/view`)
                        }
                        sx={{
                          cursor: loan.id ? "pointer" : "default",
                          "&:hover": { bgcolor: sf.sf_rowHover },
                          "&:last-child td": { borderBottom: "none" },
                        }}
                      >
                        <TableCell sx={cellSx}>
                          {loan.borrowerDisplayName || "—"}
                        </TableCell>
                        <TableCell sx={{ ...cellSx, color: sf.sf_textLink }}>
                          {loan.loanNumber || "—"}
                        </TableCell>
                        <TableCell sx={cellSx}>
                          <Chip
                            label={meta.label}
                            size="small"
                            sx={{
                              bgcolor: meta.bg,
                              color: meta.text,
                              border: `1px solid ${meta.border}`,
                              borderRadius: 0,
                              fontWeight: 600,
                              fontSize: "0.65rem",
                              height: 18,
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ ...cellSx, textAlign: "right" }}>
                          {fmtMoney(safeNum(loan.loanBalanceAmount), currencyCode)}
                        </TableCell>
                        <TableCell sx={cellSx}>
                          {loan.nextDueDate ? fmtReportDate(loan.nextDueDate) : "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </Box>
        </Grid>

        {/* Right column: Quick Actions + Alerts */}
        <Grid item xs={12} md={4}>
          {/* Quick Actions */}
          <Box
            sx={{
              mb: 2,
              border: `1px solid ${sf.sf_borderLight}`,
              bgcolor: sf.sf_cardBg,
              boxShadow: sf.sf_shadowSm,
            }}
          >
            <Box sx={{ px: 2, pt: "12px", pb: "6px" }}>
              <SectionHeader sf={sf}>Quick Actions</SectionHeader>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "1px",
                bgcolor: sf.sf_borderLight,
                borderTop: `1px solid ${sf.sf_borderLight}`,
              }}
            >
              {[
                {
                  icon: <AddCircleOutlineIcon fontSize="small" />,
                  label: "New Loan",
                  description: "Start a loan application",
                  to: "/add-loan",
                },
                {
                  icon: <PeopleOutlineIcon fontSize="small" />,
                  label: "Borrowers",
                  description: "Manage borrower profiles",
                  to: "/borrowers",
                },
                {
                  icon: <PersonOutlineIcon fontSize="small" />,
                  label: "Employees",
                  description: "Staff & loan officers",
                  to: "/employees",
                },
                {
                  icon: <AssessmentOutlinedIcon fontSize="small" />,
                  label: "Reports",
                  description: "Portfolio & financial reports",
                  to: "/reports",
                },
                {
                  icon: <AccountBalanceWalletOutlinedIcon fontSize="small" />,
                  label: "Expenses",
                  description: "Record operating costs",
                  to: "/expenses",
                },
                {
                  icon: <ReceiptLongOutlinedIcon fontSize="small" />,
                  label: "Cash Ledger",
                  description: "Full transaction history",
                  to: "/reports/cash-ledger",
                },
              ].map((item) => (
                <QuickAction
                  key={item.to}
                  icon={item.icon}
                  label={item.label}
                  description={item.description}
                  onClick={() => navigate(item.to)}
                  sf={sf}
                />
              ))}
            </Box>
          </Box>

          {/* High Arrears Alert */}
          {metrics.atRisk.length > 0 && (
            <Box
              sx={{
                border: `1px solid ${sf.sf_error}`,
                boxShadow: sf.sf_shadowSm,
              }}
            >
              <Box
                sx={{
                  px: 2,
                  py: "9px",
                  bgcolor: sf.sf_pillErrorBg,
                  borderBottom: `1px solid ${sf.sf_error}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  sx={{ fontSize: "0.8rem", fontWeight: 700, color: sf.sf_error }}
                >
                  High Arrears Loans
                </Typography>
                <Typography
                  onClick={() => navigate("/reports/delinquency")}
                  sx={{
                    fontSize: "0.7rem",
                    color: sf.sf_error,
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  View all
                </Typography>
              </Box>
              <Box sx={{ bgcolor: sf.sf_cardBg }}>
                {metrics.atRisk.map((loan) => (
                  <Box
                    key={loan.id || loan.loanNumber}
                    onClick={() =>
                      loan.id && navigate(`/loans/id/${loan.id}/view`)
                    }
                    sx={{
                      px: 2,
                      py: "9px",
                      borderBottom: `1px solid ${sf.sf_borderLight}`,
                      cursor: loan.id ? "pointer" : "default",
                      "&:hover": { bgcolor: sf.sf_rowHover },
                      "&:last-child": { borderBottom: "none" },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        color: sf.sf_textPrimary,
                      }}
                      noWrap
                    >
                      {loan.borrowerDisplayName || loan.loanNumber || "—"}
                    </Typography>
                    <Typography sx={{ fontSize: "0.7rem", color: sf.sf_error }}>
                      Arrears:{" "}
                      {fmtMoney(safeNum(loan.arrearsAmount), currencyCode)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
