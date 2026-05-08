import {
  filterRowsByDateWindow,
  filterSummariesByDateWindow,
  getReportAsOfDate,
} from "./reportUtils";
import { computeUrgencyScore } from "./delinquencyHelpers";

describe("report date helpers", () => {
  it("uses the selected end date as the report as-of date", () => {
    const reportDate = getReportAsOfDate("2026-03-15", new Date("2026-05-01"));

    expect(reportDate.getFullYear()).toBe(2026);
    expect(reportDate.getMonth()).toBe(2);
    expect(reportDate.getDate()).toBe(15);
  });

  it("filters generic rows by the selected date window", () => {
    const rows = [
      { id: "a", activityDate: "2026-03-01" },
      { id: "b", activityDate: "2026-03-15" },
      { id: "c", activityDate: "2026-04-01" },
    ];

    const filtered = filterRowsByDateWindow(
      rows,
      (row) => row.activityDate,
      "2026-03-10",
      "2026-03-31",
    );

    expect(filtered.map((row) => row.id)).toEqual(["b"]);
  });

  it("filters summaries by loan start date while retaining undated loans", () => {
    const summaries = [
      { id: "early", startDate: "2026-03-01" },
      { id: "inside", startDate: "2026-03-15" },
      { id: "undated", startDate: null },
    ];

    const filtered = filterSummariesByDateWindow(
      summaries,
      "2026-03-10",
      "2026-03-31",
    );

    expect(filtered.map((row) => row.id)).toEqual(["inside", "undated"]);
  });
});

describe("computeUrgencyScore", () => {
  it("uses the provided report date for payment inactivity scoring", () => {
    const loan = {
      daysPastDue: 20,
      missedInstallmentCount: 2,
      arrearsAmount: 1000,
      lastPaymentDate: "2026-03-10",
    };

    const marchScore = computeUrgencyScore(loan, new Date("2026-03-15T00:00:00Z"));
    const mayScore = computeUrgencyScore(loan, new Date("2026-05-15T00:00:00Z"));

    expect(mayScore).toBeGreaterThan(marchScore);
  });
});