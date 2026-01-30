import React from "react";
import dayjs from "dayjs";
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

import PlusButtonMain from "../../ModelAssets/PlusButtonMain";
import WorkingOverlay from "../../ModelAssets/WorkingOverlay";
import { formatMoneyParts } from "../../Resources/formatting";
import { generateSchedulePreviewFromDraftValues } from "../../Models/Loans/loanComputations";

const fmtDate = (d) => {
  if (!d) return "";
  const parsed = dayjs(d);
  return parsed.isValid() ? parsed.format("DD-MMM-YYYY") : String(d);
};

const chunk = (items, size) => {
  if (!Array.isArray(items) || size <= 0) return [];
  const out = [];
  for (let i = 0; i < items.length; i += size)
    out.push(items.slice(i, i + size));
  return out;
};

const formatInterestPeriodLabel = (interestPeriod) => {
  switch (interestPeriod) {
    case "per_day":
      return "day";
    case "per_week":
      return "week";
    case "per_month":
      return "month";
    case "per_year":
      return "year";
    case "per_loan":
      return "loan";
    default:
      return "";
  }
};

/**
 * CustomerLoanCalculatorSchedule
 *
 * Displays loan calculation results with payment schedule for customers.
 * Includes PDF export functionality for customer records.
 */
export default function CustomerLoanCalculatorSchedule({
  draftValues,
  userDetails,
  currency = "$",
  loading = false,
  error,
  onClose,
}) {
  const theme = useTheme();
  const printAreaRef = React.useRef(null);
  const [exportingPdf, setExportingPdf] = React.useState(false);
  const [showTotals, setShowTotals] = React.useState(false);
  const [visibleColumns, setVisibleColumns] = React.useState({
    number: true,
    date: true,
    openingBalance: true,
    interest: true,
    principalRepaid: true,
    totalPayment: true,
    closingBalance: true,
  });

  const currencyCode = userDetails?.institution?.currencyCode;
  const institutionName = userDetails?.institution?.name || "";

  const Money = ({ value }) => {
    const parts = formatMoneyParts(value, currency, currencyCode);
    if (!parts?.number) return "";
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
          <Box component="span" sx={{ fontSize: "0.8em", marginRight: "2px" }}>
            {parts.prefix}
          </Box>
        ) : null}
        <Box component="span">{parts.number}</Box>
      </Box>
    );
  };

  const computed = React.useMemo(() => {
    return generateSchedulePreviewFromDraftValues(draftValues || {});
  }, [draftValues]);

  const schedule = computed?.schedulePreview || null;
  const installments = React.useMemo(() => {
    const items = schedule?.installments;
    return Array.isArray(items) ? items : [];
  }, [schedule]);

  const totals = schedule?.totals || {};

  const startDateLabel = React.useMemo(() => {
    const raw = draftValues?.loanStartDate || draftValues?.startDate;
    return raw ? fmtDate(raw) : "";
  }, [draftValues?.loanStartDate, draftValues?.startDate]);

  const maturityDateLabel = React.useMemo(() => {
    if (!installments.length) return "";
    const lastDue = installments[installments.length - 1]?.dueDate;
    return lastDue ? fmtDate(lastDue) : "";
  }, [installments]);

  const rowsPerPage = 25;
  const pages = React.useMemo(() => {
    if (!installments.length) return [];
    return chunk(installments, rowsPerPage);
  }, [installments]);

  const totalPages = Math.max(pages.length, 1);

  const handleExportPdf = async () => {
    if (exportingPdf) return;
    if (!printAreaRef.current) return;

    const container = printAreaRef.current;
    setExportingPdf(true);
    try {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      await new Promise((resolve) => requestAnimationFrame(resolve));

      const getPageElements = () =>
        Array.from(container.querySelectorAll(".page") || []);
      const pageElements = getPageElements();
      if (!pageElements.length) return;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < pageElements.length; i++) {
        const freshPages = getPageElements();
        const pageElement = freshPages[i];
        if (!pageElement) continue;

        const canvas = await html2canvas(pageElement, {
          scale: 1.5,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          onclone: (clonedDoc) => {
            const backdrops = clonedDoc.querySelectorAll(".MuiBackdrop-root");
            backdrops.forEach((node) => node.remove());
          },
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.75);
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * pageWidth) / canvas.width;

        if (i > 0) pdf.addPage();
        pdf.addImage(
          imgData,
          "JPEG",
          0,
          0,
          imgWidth,
          Math.min(imgHeight, pageHeight),
        );
      }

      const filename = `LoanEstimate_${dayjs().format("YYYYMMDD_HHmmss")}.pdf`;
      pdf.save(filename);
    } catch (e) {
      console.error("Failed to export PDF:", e);
    } finally {
      setExportingPdf(false);
    }
  };

  const A4Page = ({ children, pageNumber }) => (
    <Box
      className="page"
      sx={{
        width: "210mm",
        minHeight: "297mm",
        backgroundColor: theme.palette.common.white,
        color: theme.palette.common.black,
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
      {children}
      <Box sx={{ mt: "auto", pt: 1 }}>
        <Divider sx={{ borderColor: theme.palette.common.black }} />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Typography
            variant="caption"
            sx={{ color: theme.palette.common.black }}
          >
            Loan Estimate - For illustration purposes only
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: theme.palette.common.black, fontWeight: 600 }}
          >
            Page {pageNumber} of {totalPages}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  const renderSummaryBlock = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      {institutionName && (
        <Typography
          variant="body2"
          sx={{ color: theme.palette.common.black, textAlign: "right" }}
        >
          {institutionName}
        </Typography>
      )}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: theme.palette.common.black,
          fontSize: "1.3rem",
        }}
      >
        LOAN ESTIMATE
      </Typography>
      <Typography
        variant="caption"
        sx={{ color: theme.palette.grey[600], fontStyle: "italic" }}
      >
        This is an estimate only. Actual loan terms may vary based on the loan
        product you apply for.
      </Typography>
      <Divider sx={{ borderColor: theme.palette.common.black, mt: 1 }} />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 1,
          mt: 1,
        }}
      >
        <Box>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.common.black }}
          >
            <strong>Principal:</strong>{" "}
            <Money value={draftValues?.principalAmount} />
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.common.black }}
          >
            <strong>Interest:</strong>{" "}
            {draftValues?.interestType === "percentage" ? (
              <>{draftValues?.interestRate ?? ""}%</>
            ) : (
              <Money value={draftValues?.interestRate} />
            )}
            {(() => {
              const periodLabel = formatInterestPeriodLabel(
                draftValues?.interestPeriod,
              );
              if (draftValues?.interestPeriod === "per_loan") {
                return <> of Principal</>;
              }
              return periodLabel ? <> per {periodLabel}</> : null;
            })()}
          </Typography>
        </Box>
        <Box>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.common.black }}
          >
            <strong>Start Date:</strong> {startDateLabel}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.common.black }}
          >
            <strong>Maturity Date:</strong> {maturityDateLabel}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.common.black }}
          >
            <strong>Duration:</strong>{" "}
            {`${draftValues?.loanDuration || ""} ${draftValues?.durationPeriod || ""}`.trim()}
          </Typography>
        </Box>
      </Box>

      {showTotals && (
        <Box sx={{ mt: 0.5 }}>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.common.black }}
          >
            <strong>Totals:</strong> Interest{" "}
            <Money value={totals.totalInterest} /> | Payable{" "}
            <Money value={totals.totalPayable} />
          </Typography>
        </Box>
      )}

      <Box sx={{ mt: 0.5 }}>
        <Typography variant="body2" sx={{ color: theme.palette.common.black }}>
          <strong>Payment schedule:</strong>
        </Typography>
      </Box>
    </Box>
  );

  const ScheduleTable = ({ rows, startIndex }) => (
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
          mt: 1,
          width: "100%",
          tableLayout: "fixed",
          "& th, & td": {
            fontSize: "11px",
            pr: "5px",
            whiteSpace: "nowrap",
            lineHeight: 1.4,
          },
          "& thead th:nth-of-type(1), & tbody td:nth-of-type(1)": {
            width: "28px",
          },
          "& thead th:nth-of-type(2), & tbody td:nth-of-type(2)": {
            width: "78px",
          },
          "& thead th:nth-of-type(3), & tbody td:nth-of-type(3)": {
            width: "calc((100% - 106px) * 0.2)",
          },
          "& thead th:nth-of-type(4), & tbody td:nth-of-type(4)": {
            width: "calc((100% - 106px) * 0.2)",
          },
          "& thead th:nth-of-type(5), & tbody td:nth-of-type(5)": {
            width: "calc((100% - 106px) * 0.2)",
          },
          "& thead th:nth-of-type(6), & tbody td:nth-of-type(6)": {
            width: "calc((100% - 106px) * 0.2)",
          },
          "& thead th:nth-of-type(7), & tbody td:nth-of-type(7)": {
            width: "calc((100% - 106px) * 0.2)",
          },
        }}
      >
        <TableHead>
          <TableRow>
            {visibleColumns.number && (
              <TableCell
                sx={{ color: theme.palette.common.black, fontWeight: 700 }}
              >
                #
              </TableCell>
            )}
            {visibleColumns.date && (
              <TableCell
                sx={{ color: theme.palette.common.black, fontWeight: 700 }}
              >
                Date
              </TableCell>
            )}
            {visibleColumns.openingBalance && (
              <TableCell
                sx={{ color: theme.palette.common.black, fontWeight: 700 }}
                align="right"
              >
                Opening Balance
              </TableCell>
            )}
            {visibleColumns.interest && (
              <TableCell
                sx={{ color: theme.palette.common.black, fontWeight: 700 }}
                align="right"
              >
                Interest
              </TableCell>
            )}
            {visibleColumns.principalRepaid && (
              <TableCell
                sx={{ color: theme.palette.common.black, fontWeight: 700 }}
                align="right"
              >
                Principal Repaid
              </TableCell>
            )}
            {visibleColumns.totalPayment && (
              <TableCell
                sx={{ color: theme.palette.common.black, fontWeight: 700 }}
                align="right"
              >
                Total Payment
              </TableCell>
            )}
            {visibleColumns.closingBalance && (
              <TableCell
                sx={{ color: theme.palette.common.black, fontWeight: 700 }}
                align="right"
              >
                Closing Balance
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((inst, idx) => (
            <TableRow key={`${inst?.dueDate || "row"}-${startIndex + idx}`}>
              {visibleColumns.number && (
                <TableCell sx={{ color: theme.palette.common.black }}>
                  {startIndex + idx + 1}
                </TableCell>
              )}
              {visibleColumns.date && (
                <TableCell sx={{ color: theme.palette.common.black }}>
                  {fmtDate(inst?.dueDate)}
                </TableCell>
              )}
              {visibleColumns.openingBalance && (
                <TableCell
                  sx={{ color: theme.palette.common.black }}
                  align="right"
                >
                  <Money value={inst?.openingBalance} />
                </TableCell>
              )}
              {visibleColumns.interest && (
                <TableCell
                  sx={{ color: theme.palette.common.black }}
                  align="right"
                >
                  <Money value={inst?.interestDue} />
                </TableCell>
              )}
              {visibleColumns.principalRepaid && (
                <TableCell
                  sx={{ color: theme.palette.common.black }}
                  align="right"
                >
                  <Money value={inst?.principalDue} />
                </TableCell>
              )}
              {visibleColumns.totalPayment && (
                <TableCell
                  sx={{ color: theme.palette.common.black }}
                  align="right"
                >
                  <Money value={inst?.totalDue} />
                </TableCell>
              )}
              {visibleColumns.closingBalance && (
                <TableCell
                  sx={{ color: theme.palette.common.black }}
                  align="right"
                >
                  <Money value={inst?.balanceAfter} />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 2 }}>
        <Typography color="error">{String(error)}</Typography>
      </Box>
    );
  }

  if (!installments.length) {
    return (
      <Box sx={{ py: 2 }}>
        <Typography color="error">
          {computed?.supported === false
            ? computed?.reason || "Unable to generate schedule."
            : "Unable to generate schedule. Please check your inputs."}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box
        className="no-print"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "stretch", md: "center" },
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ width: { xs: "100%", md: "auto" } }}>
          <FormControlLabel
            sx={{
              m: 0,
              "& .MuiFormControlLabel-label": {
                fontSize: theme.typography.caption.fontSize,
              },
            }}
            control={
              <Checkbox
                size="small"
                checked={showTotals}
                onChange={(e) => setShowTotals(e.target.checked)}
              />
            }
            label="Show Totals on PDF"
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            justifyContent: { xs: "flex-start", md: "flex-end" },
            width: "100%",
            flex: 1,
          }}
        >
          <PlusButtonMain
            buttonText="BACK"
            variant="outlined"
            startIcon={null}
            onClick={onClose}
            disabled={!onClose}
          />
          <PlusButtonMain
            buttonText="EXPORT PDF"
            variant="outlined"
            startIcon={null}
            onClick={handleExportPdf}
            disabled={exportingPdf}
          />
        </Box>
      </Box>

      {/* Summary totals */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        <Typography variant="body2">
          <strong>Total Principal:</strong>{" "}
          <Money value={totals.totalPrincipal} />
        </Typography>
        <Typography variant="body2">
          <strong>Total Interest:</strong>{" "}
          <Money value={totals.totalInterest} />
        </Typography>
        <Typography variant="body2">
          <strong>Total Payable:</strong> <Money value={totals.totalPayable} />
        </Typography>
        <Typography variant="body2">
          <strong>Number of Payments:</strong> {installments.length}
        </Typography>
      </Box>

      <WorkingOverlay open={exportingPdf} message="Exporting PDF..." />

      <Box
        ref={printAreaRef}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          py: 2,
          backgroundColor: theme.palette.grey[100],
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
        {pages.map((rows, pageIdx) => {
          const startIndex = pageIdx * rowsPerPage;
          return (
            <A4Page key={`page-${pageIdx}`} pageNumber={pageIdx + 1}>
              {pageIdx === 0 ? renderSummaryBlock() : null}
              <ScheduleTable rows={rows} startIndex={startIndex} />
            </A4Page>
          );
        })}
      </Box>
    </Box>
  );
}
