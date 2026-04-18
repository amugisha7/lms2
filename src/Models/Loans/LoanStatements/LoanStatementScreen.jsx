/**
 * LoanStatementScreen – live loan statement with combined schedule + payment ledger.
 *
 * Models the export/print pipeline on LoanScheduleDraft.jsx.
 * Reuses DraftHeader for the control strip.
 */
import React from "react";
import dayjs from "dayjs";
import {
  Box,
  CircularProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useParams, useNavigate } from "react-router-dom";
import { generateClient } from "aws-amplify/api";
import { getUrl } from "aws-amplify/storage";

import WorkingOverlay from "../../../ModelAssets/WorkingOverlay";
import DraftHeader from "../../../Resources/DraftHeader";
import { UserContext } from "../../../App";
import { useSnackbar } from "../../../ModelAssets/SnackbarContext";
import { formatMoneyParts } from "../../../Resources/formatting";
import {
  buildStatementLedger,
  formatBorrowerName,
  formatEmployeeName,
  parseLoanComputationRecord,
} from "./statementHelpers";
import { DEFAULT_VISIBLE_COLUMNS, AVAILABLE_COLUMNS } from "./StatementLedger";
import { exportStatementPdf } from "./statementExportHelpers";
import { GET_LOAN_STATEMENT_READY_QUERY } from "../loanDataQueries";
import { attachDerivedLoanData } from "../loanSummaryProjection";

// ---------------------------------------------------------------------------
// Date / money helpers
// ---------------------------------------------------------------------------
const fmtDate = (d) => {
  if (!d) return "N/A";
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
// Chunk rows into pages
// ---------------------------------------------------------------------------
const ROWS_PER_PAGE = 28;

function chunk(items, size) {
  if (!Array.isArray(items) || size <= 0) return [];
  const out = [];
  for (let i = 0; i < items.length; i += size)
    out.push(items.slice(i, i + size));
  return out;
}

// ---------------------------------------------------------------------------
// Interest method label
// ---------------------------------------------------------------------------
function interestMethodLabel(method) {
  switch (method) {
    case "compound_interest_accrued":
      return "Compound – Accrued";
    case "compound_interest_equal_installments":
      return "Compound – Equal Installments";
    case "flat":
      return "Flat";
    case "interest_only":
      return "Interest Only";
    case "reducing_balance_equal_installments":
      return "Reducing Balance – Equal Installments";
    case "reducing_balance_equal_principal":
      return "Reducing Balance – Equal Principal";
    default:
      return method || "N/A";
  }
}

// ---------------------------------------------------------------------------
// Cell styles (re-exported for reuse between screen + PDF)
// ---------------------------------------------------------------------------
const CELL_BASE = {
  fontSize: "11px",
  py: "3px",
  px: "5px",
  lineHeight: 1.4,
  whiteSpace: "nowrap",
};

const HEADER_CELL = {
  ...CELL_BASE,
  fontWeight: 700,
  borderBottom: "1.5px solid #000",
};

// ---------------------------------------------------------------------------
// LedgerTable – renders one page-slice of rows
// ---------------------------------------------------------------------------
function LedgerTable({ rows, visibleColumns: vc, currency, currencyCode }) {
  const M = ({ value }) => (
    <Money value={value} currency={currency} currencyCode={currencyCode} />
  );

  return (
    <Box sx={{ width: "100%", overflowX: "hidden" }}>
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
            color: "#000",
          },
        }}
      >
        <TableHead>
          <TableRow sx={{ backgroundColor: "#eeeeee" }}>
            {vc.date && (
              <TableCell sx={{ ...HEADER_CELL, width: "78px", color: "#000" }}>
                Date
              </TableCell>
            )}
            {vc.description && (
              <TableCell
                sx={{ ...HEADER_CELL, minWidth: "120px", color: "#000" }}
              >
                Description
              </TableCell>
            )}
            {vc.scheduledPrincipal && (
              <TableCell sx={{ ...HEADER_CELL, color: "#000" }} align="right">
                Sched. Principal
              </TableCell>
            )}
            {vc.scheduledInterest && (
              <TableCell sx={{ ...HEADER_CELL, color: "#000" }} align="right">
                Sched. Interest
              </TableCell>
            )}
            {vc.scheduledFees && (
              <TableCell sx={{ ...HEADER_CELL, color: "#000" }} align="right">
                Sched. Fees
              </TableCell>
            )}
            {vc.scheduledPenalty && (
              <TableCell sx={{ ...HEADER_CELL, color: "#000" }} align="right">
                Sched. Penalty
              </TableCell>
            )}
            {vc.scheduledTotal && (
              <TableCell sx={{ ...HEADER_CELL, color: "#000" }} align="right">
                Total Due
              </TableCell>
            )}
            {vc.paymentAmount && (
              <TableCell sx={{ ...HEADER_CELL, color: "#000" }} align="right">
                Payment
              </TableCell>
            )}
            {vc.allocPrincipal && (
              <TableCell sx={{ ...HEADER_CELL, color: "#000" }} align="right">
                Paid Principal
              </TableCell>
            )}
            {vc.allocInterest && (
              <TableCell sx={{ ...HEADER_CELL, color: "#000" }} align="right">
                Paid Interest
              </TableCell>
            )}
            {vc.allocFees && (
              <TableCell sx={{ ...HEADER_CELL, color: "#000" }} align="right">
                Paid Fees
              </TableCell>
            )}
            {vc.allocPenalty && (
              <TableCell sx={{ ...HEADER_CELL, color: "#000" }} align="right">
                Paid Penalty
              </TableCell>
            )}
            {vc.runningBalance && (
              <TableCell sx={{ ...HEADER_CELL, color: "#000" }} align="right">
                Balance
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => {
            if (row.rowType === "disbursement") {
              return (
                <TableRow key={row.key} sx={{ bgcolor: "#e8f4e8" }}>
                  {vc.date && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }}>
                      {fmtDate(row.date)}
                    </TableCell>
                  )}
                  {vc.description && (
                    <TableCell
                      sx={{ ...CELL_BASE, color: "#000", fontStyle: "italic" }}
                    >
                      {row.description}
                    </TableCell>
                  )}
                  {vc.scheduledPrincipal && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }} />
                  )}
                  {vc.scheduledInterest && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }} />
                  )}
                  {vc.scheduledFees && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }} />
                  )}
                  {vc.scheduledPenalty && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }} />
                  )}
                  {vc.scheduledTotal && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }} />
                  )}
                  {vc.paymentAmount && (
                    <TableCell
                      sx={{ ...CELL_BASE, color: "#000" }}
                      align="right"
                    >
                      <M value={row.amount} />
                    </TableCell>
                  )}
                  {vc.allocPrincipal && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }} />
                  )}
                  {vc.allocInterest && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }} />
                  )}
                  {vc.allocFees && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }} />
                  )}
                  {vc.allocPenalty && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }} />
                  )}
                  {vc.runningBalance && (
                    <TableCell
                      sx={{ ...CELL_BASE, color: "#000" }}
                      align="right"
                    >
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
                  sx={{ bgcolor: idx % 2 === 0 ? "#fff" : "#fafafa" }}
                >
                  {vc.date && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }}>
                      {fmtDate(row.date)}
                    </TableCell>
                  )}
                  {vc.description && (
                    <TableCell
                      sx={{ ...CELL_BASE, color: "#000", fontWeight: 500 }}
                    >
                      Installment {row.installmentNumber}
                    </TableCell>
                  )}
                  {vc.scheduledPrincipal && (
                    <TableCell
                      sx={{ ...CELL_BASE, color: "#000" }}
                      align="right"
                    >
                      <M value={row.principalDue} />
                    </TableCell>
                  )}
                  {vc.scheduledInterest && (
                    <TableCell
                      sx={{ ...CELL_BASE, color: "#000" }}
                      align="right"
                    >
                      <M value={row.interestDue} />
                    </TableCell>
                  )}
                  {vc.scheduledFees && (
                    <TableCell
                      sx={{ ...CELL_BASE, color: "#000" }}
                      align="right"
                    >
                      <M value={row.feesDue} />
                    </TableCell>
                  )}
                  {vc.scheduledPenalty && (
                    <TableCell
                      sx={{ ...CELL_BASE, color: "#000" }}
                      align="right"
                    >
                      <M value={row.penaltyDue} />
                    </TableCell>
                  )}
                  {vc.scheduledTotal && (
                    <TableCell
                      sx={{ ...CELL_BASE, color: "#000" }}
                      align="right"
                    >
                      <M value={row.totalDue} />
                    </TableCell>
                  )}
                  {vc.paymentAmount && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }} />
                  )}
                  {vc.allocPrincipal && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }} />
                  )}
                  {vc.allocInterest && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }} />
                  )}
                  {vc.allocFees && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }} />
                  )}
                  {vc.allocPenalty && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }} />
                  )}
                  {vc.runningBalance && (
                    <TableCell
                      sx={{ ...CELL_BASE, color: "#000" }}
                      align="right"
                    >
                      <M value={row.runningBalance} />
                    </TableCell>
                  )}
                </TableRow>
              );
            }

            if (row.rowType === "penalty") {
              return (
                <TableRow key={row.key} sx={{ bgcolor: "#fff4e5" }}>
                  {vc.date && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }}>
                      {fmtDate(row.date)}
                    </TableCell>
                  )}
                  {vc.description && (
                    <TableCell
                      sx={{ ...CELL_BASE, color: "#000", fontStyle: "italic" }}
                    >
                      {row.description}
                      {row.status ? ` (${row.status})` : ""}
                    </TableCell>
                  )}
                  {vc.scheduledPrincipal && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }} />
                  )}
                  {vc.scheduledInterest && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }} />
                  )}
                  {vc.scheduledFees && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }} />
                  )}
                  {vc.scheduledPenalty && (
                    <TableCell
                      sx={{ ...CELL_BASE, color: "#000", fontWeight: 600 }}
                      align="right"
                    >
                      <M value={row.penaltyDue} />
                    </TableCell>
                  )}
                  {vc.scheduledTotal && (
                    <TableCell
                      sx={{ ...CELL_BASE, color: "#000", fontWeight: 600 }}
                      align="right"
                    >
                      <M value={row.totalDue} />
                    </TableCell>
                  )}
                  {vc.paymentAmount && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }} />
                  )}
                  {vc.allocPrincipal && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }} />
                  )}
                  {vc.allocInterest && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }} />
                  )}
                  {vc.allocFees && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }} />
                  )}
                  {vc.allocPenalty && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }} />
                  )}
                  {vc.runningBalance && (
                    <TableCell
                      sx={{ ...CELL_BASE, color: "#000", fontWeight: 600 }}
                      align="right"
                    >
                      <M value={row.runningBalance} />
                    </TableCell>
                  )}
                </TableRow>
              );
            }

            if (row.rowType === "extension") {
              return (
                <TableRow key={row.key} sx={{ bgcolor: "#fff7e6" }}>
                  {vc.date && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }}>
                      {fmtDate(row.date)}
                    </TableCell>
                  )}
                  {vc.description && (
                    <TableCell
                      sx={{ ...CELL_BASE, color: "#000", fontStyle: "italic" }}
                    >
                      {row.description}
                      {row.status ? ` (${row.status})` : ""}
                    </TableCell>
                  )}
                  {vc.scheduledPrincipal && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }} />
                  )}
                  {vc.scheduledInterest && (
                    <TableCell
                      sx={{ ...CELL_BASE, color: "#000", fontWeight: 600 }}
                      align="right"
                    >
                      <M value={row.interestDue} />
                    </TableCell>
                  )}
                  {vc.scheduledFees && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }} />
                  )}
                  {vc.scheduledPenalty && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }} />
                  )}
                  {vc.scheduledTotal && (
                    <TableCell
                      sx={{ ...CELL_BASE, color: "#000", fontWeight: 600 }}
                      align="right"
                    >
                      <M value={row.totalDue} />
                    </TableCell>
                  )}
                  {vc.paymentAmount && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }} />
                  )}
                  {vc.allocPrincipal && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }} />
                  )}
                  {vc.allocInterest && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }} />
                  )}
                  {vc.allocFees && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }} />
                  )}
                  {vc.allocPenalty && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }} />
                  )}
                  {vc.runningBalance && (
                    <TableCell
                      sx={{ ...CELL_BASE, color: "#000", fontWeight: 600 }}
                      align="right"
                    >
                      <M value={row.runningBalance} />
                    </TableCell>
                  )}
                </TableRow>
              );
            }

            if (row.rowType === "payment") {
              return (
                <TableRow key={row.key} sx={{ bgcolor: "#e8f0fe" }}>
                  {vc.date && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }}>
                      {fmtDate(row.date)}
                    </TableCell>
                  )}
                  {vc.description && (
                    <TableCell
                      sx={{ ...CELL_BASE, color: "#000", fontStyle: "italic" }}
                    >
                      Payment
                      {row.paymentMethod ? ` (${row.paymentMethod})` : ""}
                      {row.referenceNumber
                        ? ` Ref: ${row.referenceNumber}`
                        : ""}
                    </TableCell>
                  )}
                  {vc.scheduledPrincipal && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }} />
                  )}
                  {vc.scheduledInterest && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }} />
                  )}
                  {vc.scheduledFees && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }} />
                  )}
                  {vc.scheduledPenalty && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }} />
                  )}
                  {vc.scheduledTotal && (
                    <TableCell sx={{ ...CELL_BASE, color: "#000" }} />
                  )}
                  {vc.paymentAmount && (
                    <TableCell
                      sx={{ ...CELL_BASE, color: "#000", fontWeight: 600 }}
                      align="right"
                    >
                      <M value={row.amount} />
                    </TableCell>
                  )}
                  {vc.allocPrincipal && (
                    <TableCell
                      sx={{ ...CELL_BASE, color: "#000" }}
                      align="right"
                    >
                      <M value={row.allocPrincipal} />
                    </TableCell>
                  )}
                  {vc.allocInterest && (
                    <TableCell
                      sx={{ ...CELL_BASE, color: "#000" }}
                      align="right"
                    >
                      <M value={row.allocInterest} />
                    </TableCell>
                  )}
                  {vc.allocFees && (
                    <TableCell
                      sx={{ ...CELL_BASE, color: "#000" }}
                      align="right"
                    >
                      <M value={row.allocFees} />
                    </TableCell>
                  )}
                  {vc.allocPenalty && (
                    <TableCell
                      sx={{ ...CELL_BASE, color: "#000" }}
                      align="right"
                    >
                      <M value={row.allocPenalty} />
                    </TableCell>
                  )}
                  {vc.runningBalance && (
                    <TableCell
                      sx={{ ...CELL_BASE, color: "#000", fontWeight: 600 }}
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

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function LoanStatementScreen({
  loan: loanProp,
  loanId: loanIdProp,
  embedded = false,
}) {
  const params = useParams();
  const loanId = loanIdProp || params.loanId;
  const navigate = useNavigate();
  const theme = useTheme();
  const { userDetails } = React.useContext(UserContext);
  const { showSnackbar } = useSnackbar();

  const [fetchedLoan, setFetchedLoan] = React.useState(null);
  const [loading, setLoading] = React.useState(!loanProp);
  const [exportingPdf, setExportingPdf] = React.useState(false);
  const printAreaRef = React.useRef(null);
  const loan = loanProp || fetchedLoan;

  // Header / display toggles
  const [showCustomHeader, setShowCustomHeader] = React.useState(false);
  const [showCustomHeaderFirstPageOnly, setShowCustomHeaderFirstPageOnly] =
    React.useState(true);
  const [showInstitutionName, setShowInstitutionName] = React.useState(true);
  const [showBranchName, setShowBranchName] = React.useState(true);
  const [showStatus, setShowStatus] = React.useState(true);
  const [showLoanOfficer, setShowLoanOfficer] = React.useState(false);
  const [showLoanProduct, setShowLoanProduct] = React.useState(false);
  const [showInterestRate, setShowInterestRate] = React.useState(false);
  const [showInterestMethod, setShowInterestMethod] = React.useState(false);
  const [headerImageSignedUrl, setHeaderImageSignedUrl] = React.useState(null);

  // Column visibility
  const [visibleColumns, setVisibleColumns] = React.useState(
    DEFAULT_VISIBLE_COLUMNS,
  );

  const currencyCode =
    userDetails?.institution?.currencyCode || userDetails?.currencyCode;
  const currency = currencyCode || "$";

  const institutionName = userDetails?.institution?.name || "";
  const branchName = React.useMemo(() => {
    if (loan?.branch?.name) return loan.branch.name;
    return userDetails?.branch?.name || "";
  }, [loan, userDetails]);

  // -------------------------------------------------------------------------
  // Custom header image fetch (mirrors LoanScheduleDraft logic exactly)
  // -------------------------------------------------------------------------
  const revokeObjectUrl = React.useCallback((maybeUrl) => {
    if (typeof maybeUrl === "string" && maybeUrl.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(maybeUrl);
      } catch {
        /* ignore */
      }
    }
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    const fetchHeaderImage = async () => {
      if (!userDetails?.institution) return;
      let docHeader = userDetails.institution.customDocumentHeader;
      if (typeof docHeader === "string") {
        try {
          docHeader = JSON.parse(docHeader);
        } catch {
          docHeader = {};
        }
      }
      const headerImageUrl = docHeader?.headerImageUrl || null;
      setShowCustomHeader(!!headerImageUrl);

      if (!headerImageUrl) {
        if (!cancelled)
          setHeaderImageSignedUrl((prev) => {
            revokeObjectUrl(prev);
            return null;
          });
        return;
      }

      try {
        const signedURL = await getUrl({
          path: `public/${headerImageUrl}`,
          options: { expiresIn: 3600 },
        });
        const remoteUrl =
          signedURL?.url?.toString?.() || String(signedURL?.url);
        let nextSrc = remoteUrl;
        try {
          const resp = await fetch(remoteUrl);
          if (!resp.ok) throw new Error(`fetch failed ${resp.status}`);
          const blob = await resp.blob();
          nextSrc = URL.createObjectURL(blob);
        } catch (inner) {
          console.warn(
            "Header image blob fetch blocked – using remote URL",
            inner,
          );
        }
        if (!cancelled) {
          setHeaderImageSignedUrl((prev) => {
            revokeObjectUrl(prev);
            return nextSrc;
          });
        } else {
          revokeObjectUrl(nextSrc);
        }
      } catch (err) {
        console.error("Error fetching header image:", err);
        if (!cancelled)
          setHeaderImageSignedUrl((prev) => {
            revokeObjectUrl(prev);
            return null;
          });
      }
    };
    fetchHeaderImage();
    return () => {
      cancelled = true;
    };
  }, [userDetails?.institution, revokeObjectUrl]);

  React.useEffect(() => {
    return () => {
      revokeObjectUrl(headerImageSignedUrl);
    };
  }, [headerImageSignedUrl, revokeObjectUrl]);

  // -------------------------------------------------------------------------
  // Fetch loan
  // -------------------------------------------------------------------------
  React.useEffect(() => {
    if (loanProp) {
      setLoading(false);
      return;
    }

    if (!loanId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    const fetchLoan = async () => {
      setLoading(true);
      try {
        const client = generateClient();
        const result = await client.graphql({
          query: GET_LOAN_STATEMENT_READY_QUERY,
          variables: { id: loanId },
        });
        if (!cancelled) {
          setFetchedLoan(result?.data?.getLoan || null);
        }
      } catch (err) {
        console.error("Failed to fetch loan for statement:", err);
        if (!cancelled) {
          showSnackbar("Failed to load loan statement data", "error");
          setFetchedLoan(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchLoan();
    return () => {
      cancelled = true;
    };
  }, [loanId, loanProp, showSnackbar]);

  // -------------------------------------------------------------------------
  // Build ledger
  // -------------------------------------------------------------------------
  const derivedStatement = React.useMemo(
    () => buildStatementLedger(loan),
    [loan],
  );
  const { rows, totals } = derivedStatement;
  const loanWithDisplayStatus = React.useMemo(() => {
    if (!loan) {
      return null;
    }

    return attachDerivedLoanData({
      ...loan,
      derivedStatement,
    });
  }, [derivedStatement, loan]);
  const statementStatusLabel =
    loanWithDisplayStatus?.uiStatusLabel || loan?.status || "N/A";

  const pages = React.useMemo(() => chunk(rows, ROWS_PER_PAGE), [rows]);
  const totalPages = Math.max(pages.length, 1);

  // -------------------------------------------------------------------------
  // Loan metadata for summary block
  // -------------------------------------------------------------------------
  const borrowerLabel = React.useMemo(
    () => formatBorrowerName(loan?.borrower),
    [loan],
  );
  const officerLabel = React.useMemo(
    () => formatEmployeeName(loan?.createdByEmployee),
    [loan],
  );
  const compRec = React.useMemo(() => parseLoanComputationRecord(loan), [loan]);
  const interestMethod =
    loan?.loanProduct?.interestCalculationMethod ||
    compRec?.interestMethod ||
    "";

  // -------------------------------------------------------------------------
  // PDF export
  // -------------------------------------------------------------------------
  const handleExportPdf = async () => {
    if (exportingPdf || !loan || rows.length === 0) return;
    setExportingPdf(true);
    try {
      const interestRateLabel =
        loan?.interestRate != null
          ? `${loan.interestRate}%${
              compRec?.interestPeriod
                ? ` / ${compRec.interestPeriod.replace("per_", "")}`
                : ""
            }`
          : "N/A";

      await exportStatementPdf({
        loan,
        rows,
        visibleColumns,
        currency,
        currencyCode,
        institutionName,
        branchName,
        headerImageSrc: headerImageSignedUrl,
        showCustomHeader,
        showCustomHeaderFirstPageOnly,
        showInstitutionName,
        showBranchName,
        showStatus,
        borrowerLabel,
        officerLabel,
        statusLabel: statementStatusLabel,
        interestRateLabel,
        interestMethodLabel: interestMethodLabel(interestMethod),
        showLoanOfficer,
        showLoanProduct,
        showInterestRate,
        showInterestMethod,
        filename: `LoanStatement_${loan?.loanNumber || loan?.id || "export"}.pdf`,
      });
    } catch (err) {
      console.error("PDF export failed:", err);
      showSnackbar("PDF export failed", "error");
    } finally {
      setExportingPdf(false);
    }
  };

  // -------------------------------------------------------------------------
  // A4 page shell (mirrors the one in LoanScheduleDraft exactly)
  // -------------------------------------------------------------------------
  const A4Page = React.useCallback(
    ({ children, pageNumber }) => (
      <Box
        className="page"
        sx={{
          width: "210mm",
          minHeight: "297mm",
          backgroundColor: "#ffffff",
          color: "#000000",
          p: "15mm",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          boxShadow: 1,
          "@media print": {
            boxShadow: "none",
            m: 0,
            width: "210mm",
            height: "297mm",
            breakAfter: "page",
          },
        }}
      >
        {/* Custom image header */}
        {showCustomHeader &&
          headerImageSignedUrl &&
          (pageNumber === 1 || !showCustomHeaderFirstPageOnly) && (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                mb: 1,
              }}
            >
              <img
                src={headerImageSignedUrl}
                alt="Document header"
                crossOrigin="anonymous"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            </Box>
          )}
        {/* Institution name */}
        {showInstitutionName &&
          institutionName &&
          (pageNumber === 1 || !showCustomHeaderFirstPageOnly) && (
            <Typography variant="h6" sx={{ color: "#000", fontWeight: 600 }}>
              {institutionName}
            </Typography>
          )}
        {/* Branch name */}
        {showBranchName &&
          branchName &&
          (pageNumber === 1 || !showCustomHeaderFirstPageOnly) && (
            <Typography variant="h6" sx={{ color: "#000", fontWeight: 600 }}>
              {branchName}
            </Typography>
          )}

        {children}

        {/* Footer */}
        <Box sx={{ mt: "auto", pt: 1 }}>
          <Divider sx={{ borderColor: "#000" }} />
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}
          >
            <Typography variant="caption" sx={{ color: "#000" }}>
              Made with LOAN MANAGEMENT SOFTWARE from www.LoanTabs.com
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#000", fontWeight: 600 }}
            >
              Page {pageNumber} of {totalPages}
            </Typography>
          </Box>
        </Box>
      </Box>
    ),
    [
      showCustomHeader,
      headerImageSignedUrl,
      showCustomHeaderFirstPageOnly,
      showInstitutionName,
      institutionName,
      showBranchName,
      branchName,
      totalPages,
    ],
  );

  // -------------------------------------------------------------------------
  // Summary block (rendered on first page)
  // -------------------------------------------------------------------------
  const M = ({ value }) => (
    <Money value={value} currency={currency} currencyCode={currencyCode} />
  );

  const renderSummaryBlock = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, color: "#000", fontSize: "1.2rem" }}
      >
        LOAN STATEMENT
      </Typography>
      <Divider sx={{ borderColor: "#000", mb: 0.5 }} />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 0.75,
        }}
      >
        {/* Left column */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.4 }}>
          <Typography variant="body2" sx={{ color: "#000", fontSize: "11px" }}>
            <strong>Loan #:</strong> {loan?.loanNumber || loan?.id || "N/A"}
          </Typography>
          <Typography variant="body2" sx={{ color: "#000", fontSize: "11px" }}>
            <strong>Borrower:</strong> {borrowerLabel || "N/A"}
          </Typography>
          {showLoanOfficer && (
            <Typography
              variant="body2"
              sx={{ color: "#000", fontSize: "11px" }}
            >
              <strong>Loan Officer:</strong> {officerLabel}
            </Typography>
          )}
          {showStatus && (
            <Typography
              variant="body2"
              sx={{ color: "#000", fontSize: "11px" }}
            >
              <strong>Status:</strong>{" "}
              <Box component="span" sx={{ whiteSpace: "pre-line" }}>
                {statementStatusLabel}
              </Box>
            </Typography>
          )}
          {showLoanProduct && (
            <Typography
              variant="body2"
              sx={{ color: "#000", fontSize: "11px" }}
            >
              <strong>Loan Product:</strong> {loan?.loanProduct?.name || "N/A"}
            </Typography>
          )}
        </Box>

        {/* Right column */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.4 }}>
          <Typography variant="body2" sx={{ color: "#000", fontSize: "11px" }}>
            <strong>Principal:</strong> <M value={loan?.principal} />
          </Typography>
          {showInterestRate && (
            <Typography
              variant="body2"
              sx={{ color: "#000", fontSize: "11px" }}
            >
              <strong>Interest Rate:</strong>{" "}
              {loan?.interestRate != null ? `${loan.interestRate}%` : "N/A"}{" "}
              {compRec?.interestPeriod
                ? `/ ${compRec.interestPeriod.replace("per_", "")}`
                : ""}
            </Typography>
          )}
          {showInterestMethod && (
            <Typography
              variant="body2"
              sx={{ color: "#000", fontSize: "11px" }}
            >
              <strong>Interest Method:</strong>{" "}
              {interestMethodLabel(interestMethod)}
            </Typography>
          )}
          <Typography variant="body2" sx={{ color: "#000", fontSize: "11px" }}>
            <strong>Term:</strong>{" "}
            {loan?.duration
              ? `${loan.duration} ${loan.durationInterval || ""}`
              : "N/A"}
          </Typography>
          <Typography variant="body2" sx={{ color: "#000", fontSize: "11px" }}>
            <strong>Start Date:</strong> {fmtDate(loan?.startDate)}
          </Typography>
          <Typography variant="body2" sx={{ color: "#000", fontSize: "11px" }}>
            <strong>Maturity Date:</strong> {fmtDate(loan?.maturityDate)}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 0.5 }}>
        <Typography variant="body2" sx={{ color: "#000", fontSize: "11px" }}>
          <strong>Statement:</strong>
        </Typography>
      </Box>
    </Box>
  );

  // -------------------------------------------------------------------------
  // Loading & error states
  // -------------------------------------------------------------------------
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!loan) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">
          Loan not found. Please go back and try again.
        </Alert>
      </Box>
    );
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <WorkingOverlay open={exportingPdf} message="Exporting PDF..." />

      {/* Control Strip */}
      <DraftHeader
        showCustomHeader={showCustomHeader}
        onCustomHeaderChange={setShowCustomHeader}
        hasCustomHeader={!!headerImageSignedUrl}
        showCustomHeaderFirstPageOnly={showCustomHeaderFirstPageOnly}
        onCustomHeaderFirstPageOnlyChange={setShowCustomHeaderFirstPageOnly}
        showInstitutionName={showInstitutionName}
        onInstitutionNameChange={setShowInstitutionName}
        showBranchName={showBranchName}
        onBranchNameChange={setShowBranchName}
        visibleColumns={visibleColumns}
        onColumnVisibilityChange={setVisibleColumns}
        availableColumns={AVAILABLE_COLUMNS}
        checkboxRows={[
          {
            key: "details",
            label: "Details",
            checkboxes: [
              {
                key: "status",
                label: "Status",
                checked: showStatus,
                onChange: setShowStatus,
              },
              {
                key: "loanOfficer",
                label: "Loan Officer",
                checked: showLoanOfficer,
                onChange: setShowLoanOfficer,
              },
              {
                key: "loanProduct",
                label: "Loan Product",
                checked: showLoanProduct,
                onChange: setShowLoanProduct,
              },
              {
                key: "interestRate",
                label: "Interest Rate",
                checked: showInterestRate,
                onChange: setShowInterestRate,
              },
              {
                key: "interestMethod",
                label: "Interest Method",
                checked: showInterestMethod,
                onChange: setShowInterestMethod,
              },
            ],
          },
        ]}
        actions={[
          !embedded
            ? {
                key: "back",
                text: "BACK TO LOAN",
                variant: "outlined",
                onClick: () => navigate(`/loans/id/${loanId}/view`),
              }
            : null,
          {
            key: "export",
            text: "EXPORT PDF",
            onClick: handleExportPdf,
            disabled: exportingPdf || rows.length === 0,
          },
        ].filter(Boolean)}
      />

      {/* Schedule source / no data warnings */}
      {rows.length === 0 && (
        <Alert severity="warning">
          No schedule or payment data could be loaded for this loan. The loan
          may be missing installments and a valid computation record.
        </Alert>
      )}

      {/* Print area – A4 pages */}
      <Box
        ref={printAreaRef}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          py: embedded ? 0 : 2,
          backgroundColor: embedded ? "transparent" : theme.palette.grey[100],
          alignItems: { xs: "flex-start", md: "center" },
          maxWidth: "100%",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          "@media print": {
            gap: 0,
            overflowX: "visible",
            backgroundColor: "transparent",
          },
        }}
      >
        {pages.length > 0 ? (
          pages.map((pageRows, pageIdx) => {
            return (
              <A4Page key={`page-${pageIdx}`} pageNumber={pageIdx + 1}>
                {pageIdx === 0 ? renderSummaryBlock() : null}
                <LedgerTable
                  rows={pageRows}
                  visibleColumns={visibleColumns}
                  currency={currency}
                  currencyCode={currencyCode}
                />
              </A4Page>
            );
          })
        ) : (
          /* Empty placeholder page so UI still makes sense */
          <A4Page pageNumber={1}>
            {renderSummaryBlock()}
            <Typography sx={{ fontSize: "11px", color: "#555", mt: 2 }}>
              No statement rows available.
            </Typography>
          </A4Page>
        )}
      </Box>
    </Box>
  );
}
