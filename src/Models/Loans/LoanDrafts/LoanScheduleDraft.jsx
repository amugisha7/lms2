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
  Alert,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import WorkingOverlay from "../../../ModelAssets/WorkingOverlay";
import DraftHeader from "../../../Resources/DraftHeader";
import { generateSchedulePreviewFromDraftValues } from "../loanComputations";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { formatMoneyParts } from "../../../Resources/formatting";
import { getUrl } from "aws-amplify/storage";
import DropDownSearchable from "../../../Resources/FormComponents/DropDownSearchable";

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
  isEditDraftFlow = false,
  createButtonText = "CREATE LOAN",
  branchAccounts = [],
}) {
  const theme = useTheme();

  // Check if user is privileged (admin or branch manager)
  const isPrivileged = React.useMemo(() => {
    const type = userDetails?.userType;
    return type?.toLowerCase() === "admin" || type === "branchManager";
  }, [userDetails]);

  const printAreaRef = React.useRef(null);
  const [exportingPdf, setExportingPdf] = React.useState(false);
  const [showLoanFees, setShowLoanFees] = React.useState(true);
  const [showInterestRate, setShowInterestRate] = React.useState(true);
  const [showInterestMethod, setShowInterestMethod] = React.useState(false);
  const [showTotals, setShowTotals] = React.useState(false);
  const [showCustomHeader, setShowCustomHeader] = React.useState(false);
  const [showCustomHeaderFirstPageOnly, setShowCustomHeaderFirstPageOnly] =
    React.useState(true);
  const [showInstitutionName, setShowInstitutionName] = React.useState(true);
  const [showBranchName, setShowBranchName] = React.useState(true);
  const [headerImageSignedUrl, setHeaderImageSignedUrl] = React.useState(null);
  const [visibleColumns, setVisibleColumns] = React.useState({
    number: true,
    date: true,
    openingBalance: true,
    interest: true,
    principalRepaid: true,
    totalPayment: true,
    closingBalance: true,
  });

  // Account selection state
  const [principalAccountId, setPrincipalAccountId] = React.useState("");
  const [feesAccountId, setFeesAccountId] = React.useState("");
  const [showAccountSelection, setShowAccountSelection] = React.useState(false);

  const hasLoanFees = totalLoanFee > 0;

  const currencyCode = userDetails?.institution?.currencyCode;

  const revokeObjectUrl = React.useCallback((maybeUrl) => {
    if (typeof maybeUrl === "string" && maybeUrl.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(maybeUrl);
      } catch {
        // ignore
      }
    }
  }, []);

  // Initialize custom header checkbox and fetch signed URL
  React.useEffect(() => {
    let cancelled = false;

    const fetchHeaderImage = async () => {
      if (userDetails?.institution) {
        let documentHeader = userDetails.institution.customDocumentHeader;
        if (typeof documentHeader === "string") {
          try {
            documentHeader = JSON.parse(documentHeader);
          } catch (e) {
            console.error("Failed to parse customDocumentHeader", e);
            documentHeader = {};
          }
        }

        const headerImageUrl = documentHeader?.headerImageUrl || null;

        // Set checkbox to checked by default only if header exists
        setShowCustomHeader(!!headerImageUrl);

        // Fetch signed URL and (optionally) convert to a same-origin blob URL.
        // If S3 CORS is not configured, the fetch will be blocked; we fall back to using
        // the signed URL so the image still displays in the UI.
        if (headerImageUrl) {
          try {
            const signedURL = await getUrl({
              path: `public/${headerImageUrl}`,
              options: {
                expiresIn: 3600, // 1 hour
              },
            });

            const remoteUrl =
              signedURL?.url?.toString?.() || String(signedURL?.url);

            let nextSrc = remoteUrl;
            try {
              const response = await fetch(remoteUrl);
              if (!response.ok) {
                throw new Error(
                  `Header image fetch failed: ${response.status}`,
                );
              }
              const blob = await response.blob();
              nextSrc = URL.createObjectURL(blob);
            } catch (innerError) {
              console.warn(
                "Header image could not be fetched as a blob (likely CORS). Falling back to remote URL.",
                innerError,
              );
            }

            if (cancelled) {
              revokeObjectUrl(nextSrc);
              return;
            }

            setHeaderImageSignedUrl((prev) => {
              revokeObjectUrl(prev);
              return nextSrc;
            });
          } catch (error) {
            console.error("Error fetching header image URL:", error);
            if (!cancelled) {
              setHeaderImageSignedUrl((prev) => {
                revokeObjectUrl(prev);
                return null;
              });
            }
          }
        } else {
          if (!cancelled) {
            setHeaderImageSignedUrl((prev) => {
              revokeObjectUrl(prev);
              return null;
            });
          }
        }
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

        // Ensure images within the page are loaded before snapshotting.
        const imgs = Array.from(pageElement.querySelectorAll("img") || []);
        if (imgs.length) {
          await Promise.all(
            imgs.map((img) => {
              if (img.complete && img.naturalWidth > 0)
                return Promise.resolve();
              return new Promise((resolve) => {
                const done = () => resolve();
                img.addEventListener("load", done, { once: true });
                img.addEventListener("error", done, { once: true });
              });
            }),
          );
        }

        // Capture the page as a canvas image
        const canvas = await html2canvas(pageElement, {
          scale: 1.5, // Reduced scale to optimize file size
          useCORS: true,
          imageTimeout: 15000,
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
          Math.min(imgHeight, pageHeight),
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
      {showInstitutionName &&
        institutionName &&
        (pageNumber === 1 || !showCustomHeaderFirstPageOnly) && (
          <Box sx={{ mb: 1 }}>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.common.black,
                textAlign: "left",
                fontWeight: 600,
              }}
            >
              {institutionName}
            </Typography>
          </Box>
        )}
      {showBranchName &&
        branchName &&
        (pageNumber === 1 || !showCustomHeaderFirstPageOnly) && (
          <Box sx={{ mb: 1 }}>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.common.black,
                textAlign: "left",
                fontWeight: 600,
              }}
            >
              {branchName}
            </Typography>
          </Box>
        )}
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
                  draftRecord?.interestPeriod,
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
            : "Unable to generate schedule."}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <DraftHeader
        // Header options
        showCustomHeader={showCustomHeader}
        onCustomHeaderChange={setShowCustomHeader}
        hasCustomHeader={!!headerImageSignedUrl}
        showCustomHeaderFirstPageOnly={showCustomHeaderFirstPageOnly}
        onCustomHeaderFirstPageOnlyChange={setShowCustomHeaderFirstPageOnly}
        // Institution display options
        showInstitutionName={showInstitutionName}
        onInstitutionNameChange={setShowInstitutionName}
        showBranchName={showBranchName}
        onBranchNameChange={setShowBranchName}
        // Column visibility
        visibleColumns={visibleColumns}
        onColumnVisibilityChange={setVisibleColumns}
        availableColumns={[
          { key: "openingBalance", label: "Opening Balance" },
          { key: "interest", label: "Interest" },
          { key: "principalRepaid", label: "Principal Repaid" },
          { key: "closingBalance", label: "Closing Balance" },
        ]}
        // Configurable checkbox rows
        checkboxRows={[
          {
            key: "fields",
            label: "Fields",
            checkboxes: [
              ...(loanFeeSummary
                ? [
                    {
                      key: "loanFees",
                      label: "Loan Fees",
                      checked: showLoanFees,
                      onChange: setShowLoanFees,
                    },
                  ]
                : []),
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
              {
                key: "totals",
                label: "Totals",
                checked: showTotals,
                onChange: setShowTotals,
              },
            ],
          },
        ]}
        // Actions
        actions={[
          // Show edit button UNLESS user is not privileged AND status contains "review"
          // Privileged users (admin/branch manager) can always see the edit button
          // Use case-insensitive includes check for status
          ...(isPrivileged ||
          !(loanDraft?.status || "").toLowerCase().includes("review")
            ? [
                {
                  key: "edit",
                  text: isEditDraftFlow ? "BACK" : "EDIT",
                  onClick: onEdit,
                  disabled: !onEdit,
                },
              ]
            : []),
          {
            key: "save",
            text: "SAVE DRAFT",
            onClick: onSaveDraft,
            disabled: readOnly || !onSaveDraft,
            tooltip:
              "Saving this draft generates a reference number. You can then edit the details later before creating the loan.",
          },
          {
            key: "export",
            text: "EXPORT PDF",
            onClick: handleExportPdf,
            disabled: exportingPdf,
          },
          {
            key: "create",
            text: createButtonText,
            onClick: () => {
              if (isPrivileged) {
                setShowAccountSelection(true);
              } else if (onConfirmCreateLoan) {
                onConfirmCreateLoan();
              }
            },
            disabled: readOnly || !onConfirmCreateLoan,
            tooltip: undefined,
          },
        ]}
        // Totals
        totalsContent={
          <Typography variant="body2">
            <strong>Totals:</strong> Interest{" "}
            <Money value={totals.totalInterest} /> | Payable{" "}
            <Money value={totals.totalPayable} />
          </Typography>
        }
        readOnly={readOnly}
      />

      {/* Account Selection Section for Privileged Users */}
      {isPrivileged && showAccountSelection && (
        <Box
          sx={{
            mt: 2,
            mb: 2,
            p: 3,
            borderRadius: 1,
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(118, 177, 211, 0.08)"
                : "#f8f9ff",
            border: `2px solid ${theme.palette.mode === "dark" ? "#76B1D3" : "#1976d2"}`,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Account Selection (Required)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Select the accounts for disbursement and fee collection before
            creating the loan.
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <DropDownSearchable
              label="Principal Account"
              name="principalAccountId"
              options={branchAccounts.map((a) => ({
                value: a.id,
                label: a.name,
              }))}
              required={true}
              placeholder="Search for an account..."
              helperText="Select the account from which the loan principal will be disbursed."
              value={principalAccountId}
              onChange={(e) => setPrincipalAccountId(e.target.value)}
              editing={true}
            />

            {hasLoanFees && (
              <DropDownSearchable
                label="Loan Fees Account"
                name="feesAccountId"
                options={branchAccounts.map((a) => ({
                  value: a.id,
                  label: a.name,
                }))}
                required={true}
                placeholder="Search for an account..."
                helperText="Select the account where the loan fees will be received."
                value={feesAccountId}
                onChange={(e) => setFeesAccountId(e.target.value)}
                editing={true}
              />
            )}

            {(!principalAccountId || (hasLoanFees && !feesAccountId)) && (
              <Alert severity="warning" sx={{ mt: 1 }}>
                Please select all required accounts before creating the loan.
              </Alert>
            )}

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  onConfirmCreateLoan({
                    principalAccountId,
                    feesAccountId: hasLoanFees ? feesAccountId : null,
                    totalLoanFee,
                  })
                }
                disabled={
                  !principalAccountId || (hasLoanFees && !feesAccountId)
                }
              >
                CONFIRM LOAN
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setShowAccountSelection(false)}
              >
                CANCEL
              </Button>
            </Box>
          </Box>
        </Box>
      )}

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
