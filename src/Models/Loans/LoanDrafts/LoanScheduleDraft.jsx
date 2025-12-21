import React from "react";
import dayjs from "dayjs";
import {
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PlusButtonMain from "../../../ModelAssets/PlusButtonMain";
import { generateSchedulePreviewFromDraftValues } from "../loanComputations";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const money = (n, currency = "") => {
  const num = Number(n);
  if (!Number.isFinite(num)) return "";
  return `${currency}${num.toFixed(2)}`;
};

const fmtDate = (d) => {
  if (!d) return "";
  const parsed = dayjs(d);
  return parsed.isValid() ? parsed.format("YYYY-MM-DD") : String(d);
};

const chunk = (items, size) => {
  if (!Array.isArray(items) || size <= 0) return [];
  const out = [];
  for (let i = 0; i < items.length; i += size)
    out.push(items.slice(i, i + size));
  return out;
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
}) {
  const theme = useTheme();
  const printAreaRef = React.useRef(null);

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

  const rowsFirstPage = 18;
  const rowsOtherPages = 26;

  const pages = React.useMemo(() => {
    if (!installments.length) return [];
    const first = installments.slice(0, rowsFirstPage);
    const rest = installments.slice(rowsFirstPage);
    const restPages = chunk(rest, rowsOtherPages);
    return [first, ...restPages];
  }, [installments]);

  const totalPages = Math.max(pages.length, 1);

  const handleExportPdf = async () => {
    if (!printAreaRef.current) return;

    const element = printAreaRef.current;
    const originalOverflow = element.style.overflow;

    try {
      // Ensure full content is capturable (no clipping due to scroll containers)
      element.style.overflow = "visible";
      await new Promise((r) => setTimeout(r, 50));

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: element.scrollWidth || undefined,
        windowHeight: element.scrollHeight || undefined,
      });

      // A4 portrait in mm
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Margins
      const marginX = 10;
      const marginY = 10;
      const availableWidth = pageWidth - marginX * 2;
      const availableHeight = pageHeight - marginY * 2;

      // Scale canvas width to fit page width; compute px per mm
      const pxPerMm = canvas.width / availableWidth;
      const pageSliceHeightPx = Math.floor(availableHeight * pxPerMm);

      let offsetPx = 0;
      let pageIndex = 0;
      while (offsetPx < canvas.height) {
        if (pageIndex > 0) pdf.addPage();

        const sliceHeightPx = Math.min(
          pageSliceHeightPx,
          canvas.height - offsetPx
        );
        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = sliceHeightPx;

        const ctx = sliceCanvas.getContext("2d");
        ctx.drawImage(
          canvas,
          0,
          offsetPx,
          canvas.width,
          sliceHeightPx,
          0,
          0,
          canvas.width,
          sliceHeightPx
        );

        const imgData = sliceCanvas.toDataURL("image/jpeg", 1.0);
        const sliceHeightMm = sliceHeightPx / pxPerMm;
        pdf.addImage(
          imgData,
          "JPEG",
          marginX,
          marginY,
          availableWidth,
          sliceHeightMm
        );

        offsetPx += sliceHeightPx;
        pageIndex += 1;
      }

      const filename = `LoanSchedule_${borrowerLabel || "Draft"}.pdf`;
      pdf.save(filename);
    } catch (e) {
      console.error("Failed to export PDF:", e);
    } finally {
      element.style.overflow = originalOverflow;
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
            {draftRecord?.loanStartDate
              ? `Start Date: ${fmtDate(draftRecord.loanStartDate)}`
              : ""}
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

  const SummaryBlock = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, color: theme.palette.common.black }}
      >
        LOAN REPAYMENT SCHEDULE
      </Typography>
      <Typography
        variant="body2"
        className="muted"
        sx={{ color: theme.palette.common.black }}
      >
        {institutionName ? institutionName : ""}
        {institutionName ? " — " : ""}
        {branchName}
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
        </Box>
        <Box>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.common.black }}
          >
            <strong>Principal:</strong>{" "}
            {money(draftRecord?.principalAmount, currency)}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.common.black }}
          >
            <strong>Interest:</strong> {draftRecord?.interestRate ?? ""}
            {draftRecord?.interestType === "percentage" ? "%" : ""}
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
          <Typography
            variant="body2"
            sx={{ color: theme.palette.common.black }}
          >
            <strong>Repayment:</strong>{" "}
            {`${draftRecord?.repaymentFrequencyType || ""} ${
              draftRecord?.repaymentFrequency || ""
            }`.trim()}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 0.5 }}>
        <Typography variant="body2" sx={{ color: theme.palette.common.black }}>
          <strong>Totals:</strong> Principal{" "}
          {money(totals?.totalPrincipal, currency)}
          {"  "}• Interest {money(totals?.totalInterest, currency)}
          {"  "}• Payable {money(totals?.totalPayable, currency)}
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
              Due Date
            </TableCell>
            <TableCell
              sx={{ color: theme.palette.common.black, fontWeight: 700 }}
              align="right"
            >
              Principal
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
              Total
            </TableCell>
            <TableCell
              sx={{ color: theme.palette.common.black, fontWeight: 700 }}
              align="right"
            >
              Balance
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
                {money(inst?.principalDue, currency)}
              </TableCell>
              <TableCell
                sx={{ color: theme.palette.common.black }}
                align="right"
              >
                {money(inst?.interestDue, currency)}
              </TableCell>
              <TableCell
                sx={{ color: theme.palette.common.black }}
                align="right"
              >
                {money(inst?.totalDue, currency)}
              </TableCell>
              <TableCell
                sx={{ color: theme.palette.common.black }}
                align="right"
              >
                {money(inst?.balanceAfter, currency)}
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
        sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}
      >
        <PlusButtonMain
          buttonText="EDIT"
          variant="outlined"
          startIcon={null}
          onClick={onEdit}
          disabled={!onEdit}
        />
        <PlusButtonMain
          buttonText="SAVE DRAFT"
          variant="outlined"
          startIcon={null}
          onClick={onSaveDraft}
          disabled={readOnly || !onSaveDraft}
        />
        <PlusButtonMain
          buttonText="EXPORT PDF"
          variant="outlined"
          startIcon={null}
          onClick={handleExportPdf}
        />
        <PlusButtonMain
          buttonText="SEND FOR APPROVAL"
          variant="outlined"
          startIcon={null}
          onClick={onSendForApproval}
          disabled={readOnly || !onSendForApproval}
        />
        <PlusButtonMain
          buttonText="CONFIRM AND CREATE LOAN"
          variant="outlined"
          startIcon={null}
          onClick={onConfirmCreateLoan}
          disabled={readOnly || !onConfirmCreateLoan}
        />
      </Box>

      <Box
        ref={printAreaRef}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "center",
          maxWidth: "100%",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          "@media print": {
            gap: 0,
            overflowX: "visible",
          },
        }}
      >
        {pages.map((rows, pageIdx) => {
          const startIndex =
            pageIdx === 0 ? 0 : rowsFirstPage + (pageIdx - 1) * rowsOtherPages;
          return (
            <A4Page key={`page-${pageIdx}`} pageNumber={pageIdx + 1}>
              {pageIdx === 0 ? (
                <SummaryBlock />
              ) : (
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: theme.palette.common.black }}
                  >
                    Loan Draft Repayment Schedule
                  </Typography>
                  <Typography
                    variant="body2"
                    className="muted"
                    sx={{ color: theme.palette.common.black }}
                  >
                    {institutionName ? institutionName : ""}
                    {institutionName ? " — " : ""}
                    {branchName}
                  </Typography>
                  <Divider sx={{ borderColor: theme.palette.common.black }} />
                </Box>
              )}
              <ScheduleTable rows={rows} startIndex={startIndex} />
            </A4Page>
          );
        })}
      </Box>
    </Box>
  );
}
