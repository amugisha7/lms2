/**
 * Central registry for all report definitions.
 * Each entry provides: route path, report type identifier, display label, and description.
 */
export const REPORT_TYPES = Object.freeze({
  PORTFOLIO_OVERVIEW: "loan_portfolio_overview",
  DELINQUENCY: "delinquency_report",
  AGING_ANALYSIS: "aging_analysis_report",
  PAR_SUMMARY: "portfolio_at_risk_summary",
  PROVISIONS: "provisions_report",
  DISBURSEMENT: "disbursement_report",
  REPAYMENT_SCHEDULES: "loan_repayment_schedules_report",
  ACTIVE_LOANS_BY_OFFICER: "active_loans_by_officer_report",
  CONCENTRATIONS: "concentrations_report",
  INTEREST_AND_PENALTY: "interest_and_penalty_report",
  WRITE_OFF_AND_RECOVERY: "write_off_and_recovery_report",
});

export const REPORT_REGISTRY = [
  {
    key: "portfolio_overview",
    reportType: REPORT_TYPES.PORTFOLIO_OVERVIEW,
    label: "Portfolio Overview",
    route: "/reports/portfolio-overview",
    description:
      "Executive summary of portfolio health: total exposure, outstanding balances, arrears, and branch performance.",
    icon: "AccountBalance",
  },
  {
    key: "delinquency",
    reportType: REPORT_TYPES.DELINQUENCY,
    label: "Delinquency Report",
    route: "/reports/delinquency",
    description:
      "Collections worklist prioritized by urgency, arrears size, missed installments, and payment inactivity.",
    icon: "Warning",
  },
  {
    key: "aging_analysis",
    reportType: REPORT_TYPES.AGING_ANALYSIS,
    label: "Aging Analysis",
    route: "/reports/aging-analysis",
    description:
      "Classifies overdue loans into delinquency age bands to show how arrears and exposure are distributed.",
    icon: "AccessTime",
  },
  {
    key: "par_summary",
    reportType: REPORT_TYPES.PAR_SUMMARY,
    label: "Portfolio at Risk (PAR)",
    route: "/reports/par-summary",
    description:
      "PAR 30 / 60 / 90 metrics showing outstanding exposure and percentage of portfolio at risk.",
    icon: "TrendingDown",
  },
  {
    key: "provisions",
    reportType: REPORT_TYPES.PROVISIONS,
    label: "Provisions Report",
    route: "/reports/provisions",
    description:
      "Estimated loan loss reserve requirements using a configurable provisioning matrix by delinquency band.",
    icon: "Shield",
  },
  {
    key: "disbursement",
    reportType: REPORT_TYPES.DISBURSEMENT,
    label: "Disbursement Report",
    route: "/reports/disbursement",
    description:
      "Tracks loans disbursed in a selected period with product, officer, and branch rollups. Highlights approved-not-yet-disbursed loans.",
    icon: "Payments",
  },
  {
    key: "repayment_schedules",
    reportType: REPORT_TYPES.REPAYMENT_SCHEDULES,
    label: "Repayment Schedules",
    route: "/reports/repayment-schedules",
    description:
      "Upcoming installment forecast grouped by calendar week, with optional full schedule drill-down per loan.",
    icon: "CalendarMonth",
  },
  {
    key: "active_loans_by_officer",
    reportType: REPORT_TYPES.ACTIVE_LOANS_BY_OFFICER,
    label: "Active Loans by Officer",
    route: "/reports/active-loans-by-officer",
    description:
      "Portfolio exposure and delinquency breakdown per loan officer. Drill into individual officer loan lists.",
    icon: "Person",
  },
  {
    key: "concentrations",
    reportType: REPORT_TYPES.CONCENTRATIONS,
    label: "Concentrations Report",
    route: "/reports/concentrations",
    description:
      "Identifies top-borrower, product, and sector concentration risk as a percentage of total portfolio.",
    icon: "DonutSmall",
  },
  {
    key: "interest_and_penalty",
    reportType: REPORT_TYPES.INTEREST_AND_PENALTY,
    label: "Interest & Penalty Report",
    route: "/reports/interest-and-penalty",
    description:
      "Interest income and penalty collections vs. charges for a selected date range, with product and branch rollups.",
    icon: "AttachMoney",
  },
  {
    key: "write_off_and_recovery",
    reportType: REPORT_TYPES.WRITE_OFF_AND_RECOVERY,
    label: "Write-Off & Recovery Report",
    route: "/reports/write-off-and-recovery",
    description:
      "Stock of written-off loans and recoveries against them in a selected period, showing net written-off exposure.",
    icon: "MoneyOff",
  },
];
