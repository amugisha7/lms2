/**
 * StatementLedger – combined chronological ledger table.
 *
 * Renders installment rows (scheduled) and payment rows interleaved in date
 * order.  Column visibility is driven by the `visibleColumns` prop so the
 * same state controls both the screen and the exported PDF.
 */
import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { formatMoneyParts } from "../../../Resources/formatting";
import dayjs from "dayjs";

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------
const fmtDate = (d) => {
  if (!d) return "";
  const p = dayjs(d);
  return p.isValid() ? p.format("DD-MMM-YYYY") : String(d);
};

function Money({ value, currency, currencyCode }) {
  const parts = formatMoneyParts(value, currency, currencyCode);
  if (!parts?.number) return <span>—</span>;
  return (
    <Box
      component="span"
      sx={{
        whiteSpace: "nowrap",
        display: "inline-flex",
        alignItems: "baseline",
      }}
    >
      {parts.prefix ? (
        <Box component="span" sx={{ fontSize: "0.8em", mr: "2px" }}>
          {parts.prefix}
        </Box>
      ) : null}
      <Box component="span">{parts.number}</Box>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Default visible columns definition
// ---------------------------------------------------------------------------
export const DEFAULT_VISIBLE_COLUMNS = {
  date: true,
  description: true,
  scheduledPrincipal: false,
  scheduledInterest: false,
  scheduledFees: false,
  scheduledPenalty: false,
  scheduledTotal: true,
  paymentAmount: true,
  allocPrincipal: false,
  allocInterest: false,
  allocFees: false,
  allocPenalty: false,
  runningBalance: true,
};

export const AVAILABLE_COLUMNS = [
  { key: "scheduledTotal", label: "Total Due" },
  { key: "allocPrincipal", label: "Paid Principal" },
  { key: "allocInterest", label: "Paid Interest" },
  { key: "runningBalance", label: "Balance" },
];

// ---------------------------------------------------------------------------
// Cell styles (common to screen + PDF layout)
// ---------------------------------------------------------------------------
const CELL_BASE = {
  fontSize: "11px",
  py: "4px",
  px: "5px",
  lineHeight: 1.4,
  whiteSpace: "nowrap",
  color: "inherit",
};

const HEADER_CELL = {
  ...CELL_BASE,
  fontWeight: 700,
  borderBottom: "1.5px solid #000",
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function StatementLedger({
  rows = [],
  visibleColumns = DEFAULT_VISIBLE_COLUMNS,
  currency = "$",
  currencyCode,
}) {
  const theme = useTheme();

  const M = ({ value }) => (
    <Money value={value} currency={currency} currencyCode={currencyCode} />
  );

  const vc = visibleColumns;

  return (
    <Box
      sx={{
        width: "100%",
        overflowX: { xs: "auto", md: "hidden" },
        WebkitOverflowScrolling: "touch",
      }}
    >
      <Table
        size="small"
        sx={{
          width: "100%",
          tableLayout: "auto",
          "& th, & td": {
            fontSize: "11px",
            py: "3px",
            px: "5px",
            whiteSpace: "nowrap",
            lineHeight: 1.4,
            color: theme.palette.common.black,
          },
        }}
      >
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            {vc.date && (
              <TableCell sx={{ ...HEADER_CELL, width: "80px" }}>Date</TableCell>
            )}
            {vc.description && (
              <TableCell sx={{ ...HEADER_CELL, minWidth: "120px" }}>
                Description
              </TableCell>
            )}
            {vc.scheduledPrincipal && (
              <TableCell sx={HEADER_CELL} align="right">
                Sched. Principal
              </TableCell>
            )}
            {vc.scheduledInterest && (
              <TableCell sx={HEADER_CELL} align="right">
                Sched. Interest
              </TableCell>
            )}
            {vc.scheduledFees && (
              <TableCell sx={HEADER_CELL} align="right">
                Sched. Fees
              </TableCell>
            )}
            {vc.scheduledPenalty && (
              <TableCell sx={HEADER_CELL} align="right">
                Sched. Penalty
              </TableCell>
            )}
            {vc.scheduledTotal && (
              <TableCell sx={HEADER_CELL} align="right">
                Total Due
              </TableCell>
            )}
            {vc.paymentAmount && (
              <TableCell sx={HEADER_CELL} align="right">
                Payment
              </TableCell>
            )}
            {vc.allocPrincipal && (
              <TableCell sx={HEADER_CELL} align="right">
                Paid Principal
              </TableCell>
            )}
            {vc.allocInterest && (
              <TableCell sx={HEADER_CELL} align="right">
                Paid Interest
              </TableCell>
            )}
            {vc.allocFees && (
              <TableCell sx={HEADER_CELL} align="right">
                Paid Fees
              </TableCell>
            )}
            {vc.allocPenalty && (
              <TableCell sx={HEADER_CELL} align="right">
                Paid Penalty
              </TableCell>
            )}
            {vc.runningBalance && (
              <TableCell sx={HEADER_CELL} align="right">
                Balance
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => {
            if (row.rowType === "disbursement") {
              return (
                <TableRow key={row.key} sx={{ backgroundColor: "#e8f4e8" }}>
                  {vc.date && (
                    <TableCell sx={CELL_BASE}>{fmtDate(row.date)}</TableCell>
                  )}
                  {vc.description && (
                    <TableCell sx={{ ...CELL_BASE, fontStyle: "italic" }}>
                      {row.description}
                    </TableCell>
                  )}
                  {vc.scheduledPrincipal && <TableCell sx={CELL_BASE} />}
                  {vc.scheduledInterest && <TableCell sx={CELL_BASE} />}
                  {vc.scheduledFees && <TableCell sx={CELL_BASE} />}
                  {vc.scheduledPenalty && <TableCell sx={CELL_BASE} />}
                  {vc.scheduledTotal && <TableCell sx={CELL_BASE} />}
                  {vc.paymentAmount && (
                    <TableCell sx={CELL_BASE} align="right">
                      <M value={row.amount} />
                    </TableCell>
                  )}
                  {vc.allocPrincipal && <TableCell sx={CELL_BASE} />}
                  {vc.allocInterest && <TableCell sx={CELL_BASE} />}
                  {vc.allocFees && <TableCell sx={CELL_BASE} />}
                  {vc.allocPenalty && <TableCell sx={CELL_BASE} />}
                  {vc.runningBalance && (
                    <TableCell sx={CELL_BASE} align="right">
                      <M value={row.runningBalance} />
                    </TableCell>
                  )}
                </TableRow>
              );
            }

            if (row.rowType === "installment") {
              return (
                <TableRow
                  key={row.key}
                  sx={{ backgroundColor: idx % 2 === 0 ? "#fff" : "#fafafa" }}
                >
                  {vc.date && (
                    <TableCell sx={CELL_BASE}>{fmtDate(row.date)}</TableCell>
                  )}
                  {vc.description && (
                    <TableCell sx={{ ...CELL_BASE, fontWeight: 500 }}>
                      Installment {row.installmentNumber}
                    </TableCell>
                  )}
                  {vc.scheduledPrincipal && (
                    <TableCell sx={CELL_BASE} align="right">
                      <M value={row.principalDue} />
                    </TableCell>
                  )}
                  {vc.scheduledInterest && (
                    <TableCell sx={CELL_BASE} align="right">
                      <M value={row.interestDue} />
                    </TableCell>
                  )}
                  {vc.scheduledFees && (
                    <TableCell sx={CELL_BASE} align="right">
                      <M value={row.feesDue} />
                    </TableCell>
                  )}
                  {vc.scheduledPenalty && (
                    <TableCell sx={CELL_BASE} align="right">
                      <M value={row.penaltyDue} />
                    </TableCell>
                  )}
                  {vc.scheduledTotal && (
                    <TableCell sx={CELL_BASE} align="right">
                      <M value={row.totalDue} />
                    </TableCell>
                  )}
                  {vc.paymentAmount && <TableCell sx={CELL_BASE} />}
                  {vc.allocPrincipal && <TableCell sx={CELL_BASE} />}
                  {vc.allocInterest && <TableCell sx={CELL_BASE} />}
                  {vc.allocFees && <TableCell sx={CELL_BASE} />}
                  {vc.allocPenalty && <TableCell sx={CELL_BASE} />}
                  {vc.runningBalance && (
                    <TableCell sx={CELL_BASE} align="right">
                      <M value={row.runningBalance} />
                    </TableCell>
                  )}
                </TableRow>
              );
            }

            if (row.rowType === "payment") {
              return (
                <TableRow key={row.key} sx={{ backgroundColor: "#e8f0fe" }}>
                  {vc.date && (
                    <TableCell sx={CELL_BASE}>{fmtDate(row.date)}</TableCell>
                  )}
                  {vc.description && (
                    <TableCell sx={{ ...CELL_BASE, fontStyle: "italic" }}>
                      Payment
                      {row.paymentMethod ? ` (${row.paymentMethod})` : ""}
                      {row.referenceNumber
                        ? ` Ref: ${row.referenceNumber}`
                        : ""}
                    </TableCell>
                  )}
                  {vc.scheduledPrincipal && <TableCell sx={CELL_BASE} />}
                  {vc.scheduledInterest && <TableCell sx={CELL_BASE} />}
                  {vc.scheduledFees && <TableCell sx={CELL_BASE} />}
                  {vc.scheduledPenalty && <TableCell sx={CELL_BASE} />}
                  {vc.scheduledTotal && <TableCell sx={CELL_BASE} />}
                  {vc.paymentAmount && (
                    <TableCell
                      sx={{ ...CELL_BASE, fontWeight: 600 }}
                      align="right"
                    >
                      <M value={row.amount} />
                    </TableCell>
                  )}
                  {vc.allocPrincipal && (
                    <TableCell sx={CELL_BASE} align="right">
                      <M value={row.allocPrincipal} />
                    </TableCell>
                  )}
                  {vc.allocInterest && (
                    <TableCell sx={CELL_BASE} align="right">
                      <M value={row.allocInterest} />
                    </TableCell>
                  )}
                  {vc.allocFees && (
                    <TableCell sx={CELL_BASE} align="right">
                      <M value={row.allocFees} />
                    </TableCell>
                  )}
                  {vc.allocPenalty && (
                    <TableCell sx={CELL_BASE} align="right">
                      <M value={row.allocPenalty} />
                    </TableCell>
                  )}
                  {vc.runningBalance && (
                    <TableCell
                      sx={{ ...CELL_BASE, fontWeight: 600 }}
                      align="right"
                    >
                      <M value={row.runningBalance} />
                    </TableCell>
                  )}
                </TableRow>
              );
            }

            return null;
          })}
        </TableBody>
      </Table>
    </Box>
  );
}
