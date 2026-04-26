/**
 * Shared aging bucket helpers.
 *
 * These are used by: Aging Analysis, PAR Summary, and Provisions Report.
 * Keep bucket definitions and calculations here so they stay in sync across all reports.
 */

import { safeNum } from "./reportUtils";

/**
 * Aging bucket definitions in order.
 * label   – display name
 * minDays – minimum days past due (inclusive). null means "0 or not yet due"
 * maxDays – maximum days past due (inclusive). null means "no upper bound"
 */
export const AGING_BUCKETS = [
  { key: "current",   label: "Current / Not Past Due", minDays: null, maxDays: 0  },
  { key: "dpd_1_30",  label: "1 – 30 Days",            minDays: 1,   maxDays: 30  },
  { key: "dpd_31_60", label: "31 – 60 Days",           minDays: 31,  maxDays: 60  },
  { key: "dpd_61_90", label: "61 – 90 Days",           minDays: 61,  maxDays: 90  },
  { key: "dpd_91_180",label: "91 – 180 Days",          minDays: 91,  maxDays: 180 },
  { key: "dpd_181",   label: "181+ Days",              minDays: 181, maxDays: null},
];

/**
 * Compute days past due for a LoanSummary relative to today.
 * Returns null when nextDueDate is absent (do not invent a number).
 * Returns 0 or negative when the loan is not yet past due.
 */
export function computeDaysPastDue(summary, today = new Date()) {
  if (!summary?.nextDueDate) return null;
  const due = new Date(summary.nextDueDate);
  if (isNaN(due.getTime())) return null;
  const todayStart = new Date(today);
  todayStart.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return Math.floor((todayStart.getTime() - due.getTime()) / 86_400_000);
}

/**
 * Assigns a LoanSummary to an aging bucket key.
 * Loans with no nextDueDate are placed in "current".
 * Loans with daysPastDue <= 0 are placed in "current".
 */
export function getAgingBucketKey(summary, today = new Date()) {
  const dpd = computeDaysPastDue(summary, today);
  // No due date or not past due → current
  if (dpd === null || dpd <= 0) return "current";

  for (const bucket of AGING_BUCKETS) {
    if (bucket.key === "current") continue;
    const aboveLow = dpd >= bucket.minDays;
    const belowHigh = bucket.maxDays === null || dpd <= bucket.maxDays;
    if (aboveLow && belowHigh) return bucket.key;
  }
  return "dpd_181";
}

/**
 * Returns the AGING_BUCKETS entry for a given key.
 */
export function getBucketMeta(key) {
  return AGING_BUCKETS.find((b) => b.key === key) || AGING_BUCKETS[0];
}

/**
 * Builds an aging summary table from a flat list of LoanSummary rows.
 * Returns an array of bucket rows, each with:
 *   key, label, loanCount, outstandingBalance, arrearsAmount, shareOfTotalAtRisk
 */
export function buildAgingSummary(summaries, today = new Date()) {
  const bucketMap = {};
  AGING_BUCKETS.forEach((b) => {
    bucketMap[b.key] = {
      key: b.key,
      label: b.label,
      loanCount: 0,
      outstandingBalance: 0,
      arrearsAmount: 0,
    };
  });

  let totalAtRisk = 0;

  summaries.forEach((s) => {
    const key = getAgingBucketKey(s, today);
    const bucket = bucketMap[key];
    if (!bucket) return;
    bucket.loanCount += 1;
    bucket.outstandingBalance += safeNum(s.loanBalanceAmount);
    bucket.arrearsAmount += safeNum(s.arrearsAmount);
    if (key !== "current") {
      totalAtRisk += safeNum(s.loanBalanceAmount);
    }
  });

  // Calculate share of total at-risk balance
  return AGING_BUCKETS.map((b) => {
    const row = bucketMap[b.key];
    const share =
      b.key !== "current" && totalAtRisk > 0
        ? (row.outstandingBalance / totalAtRisk) * 100
        : 0;
    return { ...row, shareOfTotalAtRisk: share };
  });
}

/**
 * Enriches each LoanSummary with aging fields (daysPastDue, agingBucketKey, agingBucketLabel).
 * Does not mutate the original — returns a new array.
 */
export function enrichSummariesWithAging(summaries, today = new Date()) {
  return summaries.map((s) => {
    const dpd = computeDaysPastDue(s, today);
    const key = getAgingBucketKey(s, today);
    const meta = getBucketMeta(key);
    return {
      ...s,
      daysPastDue: dpd,
      agingBucketKey: key,
      agingBucketLabel: meta.label,
    };
  });
}
