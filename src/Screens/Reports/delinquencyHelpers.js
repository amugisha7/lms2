/**
 * Delinquency urgency scoring helpers.
 *
 * The urgency formula is isolated here so it can be tuned independently.
 *
 * Score components (each 0-100, weighted average):
 *   1. Days Past Due contribution    – 40%
 *   2. Missed installment count      – 30%
 *   3. Arrears amount (relative)     – 20%
 *   4. Payment inactivity            – 10%
 *
 * The final score is 0–100. Urgency bands:
 *   CRITICAL  ≥ 75
 *   HIGH      50–74
 *   MEDIUM    25–49
 *   LOW       < 25
 */

import { safeNum } from "./reportUtils";

// Days past due thresholds for score ceiling
const DPD_CAP = 180; // 180+ days scores max

// Max arrears reference. Scores are relative; this is just to bound the scale.
const ARREARS_REFERENCE = 500_000;

// Max missed installments before score caps
const MISSED_CAP = 12;

// Inactivity: days without payment before score caps
const INACTIVITY_CAP = 90;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Computes a 0–100 urgency score for a delinquent loan row.
 * @param {object} s - LoanSummary row, already enriched with daysPastDue
 * @returns {number} score
 */
export function computeUrgencyScore(s) {
  const today = new Date();

  // 1. Days past due (40%)
  const dpd = safeNum(s.daysPastDue);
  const dpdScore = clamp((dpd / DPD_CAP) * 100, 0, 100);

  // 2. Missed installments (30%)
  const missed = safeNum(s.missedInstallmentCount);
  const missedScore = clamp((missed / MISSED_CAP) * 100, 0, 100);

  // 3. Arrears amount (20%)
  const arrears = safeNum(s.arrearsAmount);
  const arrearsScore = clamp((arrears / ARREARS_REFERENCE) * 100, 0, 100);

  // 4. Payment inactivity (10%)
  let inactivityScore = 0;
  if (s.lastPaymentDate) {
    const daysSincePayment =
      (today - new Date(s.lastPaymentDate)) / (1000 * 60 * 60 * 24);
    inactivityScore = clamp((daysSincePayment / INACTIVITY_CAP) * 100, 0, 100);
  } else {
    // Never paid → maximum inactivity score
    inactivityScore = 100;
  }

  const score =
    dpdScore * 0.4 +
    missedScore * 0.3 +
    arrearsScore * 0.2 +
    inactivityScore * 0.1;

  return Math.round(clamp(score, 0, 100));
}

/**
 * Returns the urgency band label and MUI color for a score.
 */
export function getUrgencyBand(score) {
  if (score >= 75) return { label: "Critical", color: "error" };
  if (score >= 50) return { label: "High",     color: "warning" };
  if (score >= 25) return { label: "Medium",   color: "info" };
  return                  { label: "Low",      color: "default" };
}
