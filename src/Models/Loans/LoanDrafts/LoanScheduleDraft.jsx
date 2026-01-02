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
  Tooltip,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PlusButtonMain from "../../../ModelAssets/PlusButtonMain";
import WorkingOverlay from "../../../ModelAssets/WorkingOverlay";
import { generateSchedulePreviewFromDraftValues } from "../loanComputations";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { formatMoneyParts } from "../../../Resources/formatting";

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

const formatInterestMethodLabel = (interestMethod) => {
  switch (interestMethod) {
    case "compound_interest_accrued":
      return "Compound Interest - Accrued";
    case "compound_interest_equal_installments":
      return "Compound Interest - Equal Installments";
    case "flat":
      return "Flat";
    case "interest_only":
      return "Interest-Only";
    case "reducing_balance_equal_installments":
      return "Reducing Balance - Equal Installments";
    case "reducing_balance_equal_principal":
      return "Reducing Balance - Equal Principal";
    default:
      return interestMethod || "";
  }
};

export default function LoanScheduleDraft({
  loanDraft,
  draftValues,
  borrower,
  userDetails,
  currency = "$",
  loading = false,
  error,
  readOnly = false,
  onEdit,
  onSaveDraft,
  onSendForApproval,
  onConfirmCreateLoan,
  totalLoanFee = 0,
  loanFeeSummary,
}) {
  const theme = useTheme();
  const printAreaRef = React.useRef(null);
  const [exportingPdf, setExportingPdf] = React.useState(false);
  const [showLoanFees, setShowLoanFees] = React.useState(true);
  const [showInterestRate, setShowInterestRate] = React.useState(true);
  const [showInterestMethod, setShowInterestMethod] = React.useState(false);
  const [showTotals, setShowTotals] = React.useState(false);

  const currencyCode = userDetails?.institution?.currencyCode;

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
          <Box
            component="span"
            sx={{
              fontSize: "0.8em",
              verticalAlign: "baseline",
              marginRight: "2px",
            }}
          >
            {parts.prefix}
          </Box>
        ) : null}
        <Box component="span">{parts.number}</Box>
      </Box>
    );
  };

  const institutionName = userDetails?.institution?.name || "";
  const branchName = userDetails?.branch?.name || "Main Branch";

  const computed = React.useMemo(() => {
    return generateSchedulePreviewFromDraftValues(draftValues || {});
  }, [draftValues]);

  const schedule = computed?.schedulePreview || null;
  const installments = React.useMemo(() => {
    const items = schedule?.installments;
    return Array.isArray(items) ? items : [];
  }, [schedule]);

  const totals = schedule?.totals || {};

  const draftRecord = draftValues || {};

  const startDateLabel = React.useMemo(() => {
    const raw = draftRecord?.loanStartDate || draftRecord?.startDate;
    return raw ? fmtDate(raw) : "";
  }, [draftRecord?.loanStartDate, draftRecord?.startDate]);

  const maturityDateLabel = React.useMemo(() => {
    if (!installments.length) return "";
    const lastDue = installments[installments.length - 1]?.dueDate;
    return lastDue ? fmtDate(lastDue) : "";
  }, [installments]);

  const borrowerLabel = React.useMemo(() => {
    if (borrower) {
      return (
        `${borrower.firstname || ""} ${borrower.othername || ""} ${
          borrower.businessName || ""
        }`.trim() ||
        borrower.uniqueIdNumber ||
        borrower.id ||
        ""
      );
    }
    return draftRecord?.borrower || loanDraft?.borrowerID || "";
  }, [borrower, loanDraft?.borrowerID, draftRecord?.borrower]);

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
      // Allow React to paint the overlay and stabilize DOM before snapshotting.
      await new Promise((resolve) => requestAnimationFrame(resolve));
      await new Promise((resolve) => requestAnimationFrame(resolve));

      const getPageElements = () =>
        Array.from(container.querySelectorAll(".page") || []);

      const pageElements = getPageElements();
      if (!pageElements.length) return;

      // A4 portrait in mm
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Process each page sequentially using html2canvas
      for (let i = 0; i < pageElements.length; i++) {
        const freshPages = getPageElements();
        const pageElement = freshPages[i];
        if (!pageElement) continue;

        // Capture the page as a canvas image
        const canvas = await html2canvas(pageElement, {
          scale: 1.5, // Reduced scale to optimize file size
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          onclone: (clonedDoc) => {
            // Ensure backdrops/overlays don't get captured in the snapshot.
            const backdrops = clonedDoc.querySelectorAll(".MuiBackdrop-root");
            backdrops.forEach((node) => node.remove());
          },
        });

        // Use JPEG with compression to reduce file size
        const imgData = canvas.toDataURL("image/jpeg", 0.75);

        // Calculate dimensions to fit A4 while maintaining aspect ratio
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * pageWidth) / canvas.width;

        // Add new page only after the first one
        if (i > 0) {
          pdf.addPage();
        }

        pdf.addImage(
          imgData,
          "JPEG",
          0,
          0,
          imgWidth,
          Math.min(imgHeight, pageHeight)
        );
      }

      const filename = `LoanSchedule_${borrowerLabel || "Draft"}.pdf`;
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
            Made with LOAN MANAGEMENT SOFTWARE from www.LoanTabs.com
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
      {loanDraft?.draftNumber && (
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.common.black,
            fontSize: "0.8rem",
            textDecoration: "italic",
          }}
        >
          Reference: {loanDraft?.draftNumber}
        </Typography>
      )}
      <Typography
        variant="body2"
        className="muted"
        sx={{ color: theme.palette.common.black, textAlign: "right" }}
      >
        {institutionName ? institutionName : ""}
        {institutionName ? " — " : ""}
        {branchName}
      </Typography>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: theme.palette.common.black,
          fontSize: "1.3rem",
        }}
      >
        LOAN SCHEDULE
      </Typography>
      <Divider sx={{ borderColor: theme.palette.common.black }} />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 1,
        }}
      >
        <Box>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.common.black }}
          >
            <strong>Borrower:</strong> {borrowerLabel}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.common.black }}
          >
            <strong>Principal:</strong>{" "}
            <Money value={draftRecord?.principalAmount} />
          </Typography>
          {showInterestRate ? (
            <Typography
              variant="body2"
              sx={{ color: theme.palette.common.black }}
            >
              <strong>Interest:</strong>{" "}
              {draftRecord?.interestType === "percentage" ? (
                <>{draftRecord?.interestRate ?? ""}%</>
              ) : (
                <Money value={draftRecord?.interestRate} />
              )}
              {(() => {
                const periodLabel = formatInterestPeriodLabel(
                  draftRecord?.interestPeriod
                );
                if (draftRecord?.interestPeriod === "per_loan") {
                  return <> of Principal</>;
                }
                return periodLabel ? <> per {periodLabel}</> : null;
              })()}
            </Typography>
          ) : null}
          {showInterestMethod ? (
            <Typography
              variant="body2"
              sx={{ color: theme.palette.common.black }}
            >
              <strong>Interest Method:</strong>{" "}
              {formatInterestMethodLabel(draftRecord?.interestMethod)}
            </Typography>
          ) : null}
          {loanFeeSummary && showLoanFees ? (
            <Typography
              variant="body2"
              sx={{ color: theme.palette.common.black }}
            >
              <strong>Loan Fees:</strong> <Money value={totalLoanFee} />
            </Typography>
          ) : null}
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
            {`${draftRecord?.loanDuration || ""} ${
              draftRecord?.durationPeriod || ""
            }`.trim()}
          </Typography>
        </Box>
      </Box>

      {showTotals ? (
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
      ) : null}

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
            <TableCell
              sx={{ color: theme.palette.common.black, fontWeight: 700 }}
            >
              #
            </TableCell>
            <TableCell
              sx={{ color: theme.palette.common.black, fontWeight: 700 }}
            >
              Date
            </TableCell>
            <TableCell
              sx={{ color: theme.palette.common.black, fontWeight: 700 }}
              align="right"
            >
              Opening Balance
            </TableCell>
            <TableCell
              sx={{ color: theme.palette.common.black, fontWeight: 700 }}
              align="right"
            >
              Interest
            </TableCell>
            <TableCell
              sx={{ color: theme.palette.common.black, fontWeight: 700 }}
              align="right"
            >
              Principal Repaid
            </TableCell>
            <TableCell
              sx={{ color: theme.palette.common.black, fontWeight: 700 }}
              align="right"
            >
              Total Payment
            </TableCell>
            <TableCell
              sx={{ color: theme.palette.common.black, fontWeight: 700 }}
              align="right"
            >
              Closing Balance
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((inst, idx) => (
            <TableRow key={`${inst?.dueDate || "row"}-${startIndex + idx}`}>
              <TableCell sx={{ color: theme.palette.common.black }}>
                {startIndex + idx + 1}
              </TableCell>
              <TableCell sx={{ color: theme.palette.common.black }}>
                {fmtDate(inst?.dueDate)}
              </TableCell>
              <TableCell
                sx={{ color: theme.palette.common.black }}
                align="right"
              >
                <Money value={inst?.openingBalance} />
              </TableCell>
              <TableCell
                sx={{ color: theme.palette.common.black }}
                align="right"
              >
                <Money value={inst?.interestDue} />
              </TableCell>
              <TableCell
                sx={{ color: theme.palette.common.black }}
                align="right"
              >
                <Money value={inst?.principalDue} />
              </TableCell>
              <TableCell
                sx={{ color: theme.palette.common.black }}
                align="right"
              >
                <Money value={inst?.totalDue} />
              </TableCell>
              <TableCell
                sx={{ color: theme.palette.common.black }}
                align="right"
              >
                <Money value={inst?.balanceAfter} />
              </TableCell>
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
            : "Unable to generate schedule."}
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
        {loanFeeSummary ? (
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
                  checked={showLoanFees}
                  onChange={(e) => setShowLoanFees(e.target.checked)}
                  disabled={readOnly}
                />
              }
              label="Show Loan Fees"
            />
          </Box>
        ) : null}

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
                checked={showInterestRate}
                onChange={(e) => setShowInterestRate(e.target.checked)}
                disabled={readOnly}
              />
            }
            label="Show Interest Rate"
          />
        </Box>

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
                checked={showInterestMethod}
                onChange={(e) => setShowInterestMethod(e.target.checked)}
                disabled={readOnly}
              />
            }
            label="Show Interest Method"
          />
        </Box>

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
                disabled={readOnly}
              />
            }
            label="Show Totals"
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
            buttonText="EDIT"
            variant="outlined"
            startIcon={null}
            onClick={onEdit}
            disabled={!onEdit}
          />
          <Tooltip title="Saving this draft generates a reference number. You can then edit the details later before creating the loan.">
            <span>
              <PlusButtonMain
                buttonText="SAVE DRAFT"
                variant="outlined"
                startIcon={null}
                onClick={onSaveDraft}
                disabled={readOnly || !onSaveDraft}
              />
            </span>
          </Tooltip>
          <PlusButtonMain
            buttonText="EXPORT PDF"
            variant="outlined"
            startIcon={null}
            onClick={handleExportPdf}
            disabled={exportingPdf}
          />
          <PlusButtonMain
            buttonText="CREATE LOAN"
            variant="outlined"
            startIcon={null}
            onClick={onConfirmCreateLoan}
            disabled={readOnly || !onConfirmCreateLoan}
          />
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, width: "100%" }}>
          <Typography variant="body2">
            <strong>Totals:</strong> Interest{" "}
            <Money value={totals.totalInterest} /> | Payable{" "}
            <Money value={totals.totalPayable} />
          </Typography>
        </Box>
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
