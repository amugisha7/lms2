import React from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Breadcrumbs,
  Tabs,
  Tab,
  IconButton,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditLoan from "./EditLoan/EditLoan";
import ManagePaymentsPopup from "../Payments/ManagePaymentsPopup";
import LoanFiles from "./LoanFiles/LoanFiles";
import LoanStatementPopup from "./LoanStatements/LoanStatementPopup";
import NotificationBar from "../../ModelAssets/NotificationBar";
import CustomSlider from "../../ModelAssets/CustomSlider";
import ClickableText from "../../ModelAssets/ClickableText";
import { UserContext } from "../../App";
import { buildLoanDisplayName } from "./loanDisplayHelpers";
import { LoanExplorerContext } from "./LoansDisplay/LoanExplorerContext";

const parseLoanRecord = (loan) => {
  const record = loan?.draftRecord ?? loan?.loanComputationRecord;
  if (!record) return {};

  try {
    const parsed =
      typeof record === "string" && record.trim() ? JSON.parse(record) : record;
    if (!parsed || typeof parsed !== "object") return {};

    const nested = parsed.draftRecord;
    if (nested) {
      if (typeof nested === "string" && nested.trim()) {
        try {
          const nestedParsed = JSON.parse(nested);
          return nestedParsed && typeof nestedParsed === "object"
            ? nestedParsed
            : {};
        } catch {
          return {};
        }
      }

      if (typeof nested === "object") return nested;
    }

    return parsed;
  } catch (err) {
    console.error("Failed to parse loan record:", err);
    return {};
  }
};

const formatBorrowerName = (borrower) => {
  if (!borrower) return "";
  return (
    `${borrower.firstname || ""} ${borrower.othername || ""} ${
      borrower.businessName || ""
    }`.trim() ||
    borrower.uniqueIdNumber ||
    borrower.id ||
    ""
  );
};

const formatOfficerName = (employee) => {
  if (!employee) return "N/A";
  return (
    [employee.firstName, employee.lastName].filter(Boolean).join(" ") ||
    employee.email ||
    employee.id ||
    "N/A"
  );
};

export default function LoanDetailPage() {
  const { loanId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const { userDetails } = React.useContext(UserContext);
  const {
    ensureLoanRecord,
    getLoanRecord,
    mergeCachedLoanPatch,
    applyLoanPaymentMutation,
  } = React.useContext(LoanExplorerContext);
  const loan = getLoanRecord(loanId);
  const [loading, setLoading] = React.useState(() => Boolean(loanId && !loan));
  const [missingLoan, setMissingLoan] = React.useState(false);
  const [notification, setNotification] = React.useState(null);
  const [tabValue, setTabValue] = React.useState(0);
  const [editSliderOpen, setEditSliderOpen] = React.useState(false);
  const [paymentsPopupOpen, setPaymentsPopupOpen] = React.useState(false);
  const [statementPopupOpen, setStatementPopupOpen] = React.useState(false);

  const branchLoansNavigation = React.useMemo(() => {
    const branchId =
      location.state?.selectedBranchId ||
      location.state?.branchId ||
      loan?.branchID ||
      loan?.branch?.id ||
      null;

    return {
      pathname: "/loans",
      state: branchId ? { selectedBranchId: branchId } : null,
    };
  }, [loan?.branch?.id, loan?.branchID, location.state]);

  const navigateToBranchLoans = React.useCallback(() => {
    if (branchLoansNavigation.state) {
      navigate(branchLoansNavigation.pathname, {
        state: branchLoansNavigation.state,
      });
      return;
    }

    navigate(branchLoansNavigation.pathname);
  }, [branchLoansNavigation, navigate]);

  const handleLoanEditSuccess = React.useCallback(
    async (updated, { closeSlider = false } = {}) => {
      if (closeSlider) {
        setEditSliderOpen(false);
      }

      try {
        if (updated) {
          mergeCachedLoanPatch(loanId, updated);
        }

        await ensureLoanRecord(loanId, { force: true });
      } catch (err) {
        console.error("Failed to refresh edited loan:", err);
      }

      setNotification({
        type: "success",
        message: "Loan updated successfully",
      });
    },
    [ensureLoanRecord, loanId, mergeCachedLoanPatch],
  );

  React.useEffect(() => {
    let active = true;

    const loadLoan = async () => {
      if (!loanId) {
        return;
      }

      if (loan) {
        setMissingLoan(false);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const loanRecord = await ensureLoanRecord(loanId);

        if (!active) {
          return;
        }

        setMissingLoan(!loanRecord);
      } catch (err) {
        if (!active) {
          return;
        }

        console.error("Failed to load loan:", err);
        setNotification({
          type: "error",
          message: err?.message || "Failed to load loan",
        });
        setMissingLoan(true);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadLoan();

    return () => {
      active = false;
    };
  }, [ensureLoanRecord, loan, loanId]);

  const initialValues = React.useMemo(() => {
    if (!loan) {
      return null;
    }

    const draftRecord = parseLoanRecord(loan);
    const loanProductName =
      loan?.loanProduct?.name || (loan?.loanProductID ? "Unknown" : "N/A");

    return {
      ...draftRecord,
      borrowerName: formatBorrowerName(loan.borrower),
      loanProductName,
      loanProduct: loan.loanProductID || draftRecord.loanProduct || "N/A",
      employeeId:
        draftRecord.employeeId ||
        loan.createdByEmployeeID ||
        loan.createdByEmployee?.id ||
        "",
    };
  }, [loan]);

  const currencyCode =
    userDetails?.institution?.currencyCode || userDetails?.currencyCode || "";

  const getLoanName = () => {
    if (!loan) return "Loan";
    return buildLoanDisplayName(loan, currencyCode);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!loan || missingLoan) {
    return (
      <Box sx={{ p: 2 }}>
        {notification && (
          <NotificationBar
            notification={notification}
            clearNotification={() => setNotification(null)}
          />
        )}
        <Typography variant="h6">Loan not found</Typography>
        <ClickableText
          sx={{ mt: 2, color: theme.palette.blueText.main }}
          onClick={navigateToBranchLoans}
        >
          Back to Loans
        </ClickableText>
      </Box>
    );
  }

  return (
    <>
      {notification && (
        <NotificationBar
          notification={notification}
          clearNotification={() => setNotification(null)}
        />
      )}

      {/* Edit Slider */}
      <CustomSlider
        open={editSliderOpen}
        onClose={() => setEditSliderOpen(false)}
        title={`Edit ${getLoanName()}`}
        showEdit={false}
        showDelete={false}
        showPdf={false}
      >
        {initialValues && (
          <EditLoan
            loanDraft={loan}
            initialValues={initialValues}
            onEditSuccess={(updated) =>
              handleLoanEditSuccess(updated, { closeSlider: true })
            }
            isEditMode={true}
            onCancel={() => setEditSliderOpen(false)}
            allowEditingOverride={true}
            readOnlyFields={["loanProduct", "borrower"]}
            entityLabel="Loan"
          />
        )}
      </CustomSlider>

      {/* Manage Payments Popup */}
      <ManagePaymentsPopup
        open={paymentsPopupOpen}
        onClose={() => setPaymentsPopupOpen(false)}
        loan={loan}
        onPaymentSuccess={(payload) => {
          if (payload?.payment) {
            applyLoanPaymentMutation({
              loanId: payload.loanId || loanId,
              payment: payload.payment,
            });
          }
        }}
      />

      <LoanStatementPopup
        open={statementPopupOpen}
        onClose={() => setStatementPopupOpen(false)}
        loan={loan}
        loanId={loanId}
      />

      <Box sx={{ width: "100%" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            mb: 1,
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <IconButton
              onClick={navigateToBranchLoans}
              sx={{
                mr: 1,
                mt: 0.5,
                color: theme.palette.text.primary,
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Breadcrumbs
                separator="›"
                aria-label="breadcrumb"
                sx={{ mb: 0.25 }}
              >
                <Typography
                  variant="caption"
                  onClick={navigateToBranchLoans}
                  sx={{
                    color: theme.palette.blueText.main,
                    cursor: "pointer",
                    fontWeight: 500,
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  All Loans
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  Loan Profile
                </Typography>
              </Breadcrumbs>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  fontFamily: theme.typography.h4.fontFamily,
                }}
              >
                {getLoanName()}
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: theme.palette.text.secondary, mt: 0.25 }}
              >
                Status:<strong> {loan.status || "N/A"}</strong>
                {` • `}
                Loan ID:
                <strong>
                  {" "}
                  {(() => {
                    const loanId = loan.loanNumber || loan.id || "\u2014";
                    return typeof loanId === "string" && loanId.length > 3
                      ? loanId.slice(3)
                      : loanId;
                  })()}
                </strong>
                {` • `}
                Loan Officer:
                <strong> {formatOfficerName(loan.createdByEmployee)}</strong>
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ width: "100%" }}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: theme.palette.divider,
              backgroundColor: theme.palette.background.paper,
              borderRadius: "8px 8px 0 0",
            }}
          >
            <Tabs
              value={tabValue}
              onChange={(_e, v) => setTabValue(v)}
              aria-label="loan profile tabs"
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: theme.palette.blueText.main,
                  height: 3,
                  borderRadius: "1.5px",
                },
                "& .MuiTab-root": {
                  fontFamily: theme.typography.fontFamily,
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  textTransform: "none",
                  letterSpacing: "0.02em",
                  color: theme.palette.text.secondary,
                  minHeight: 48,
                  padding: "12px 24px",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": { color: theme.palette.blueText.main },
                  "&.Mui-selected": {
                    color: theme.palette.blueText.main,
                    fontWeight: 600,
                  },
                },
                "& .MuiTabs-flexContainer": { gap: 1 },
              }}
            >
              <Tab label="Details" id="loan-tab-0" />
              <Tab label="Files" id="loan-tab-1" />
            </Tabs>
          </Box>

          {/* Details Tab */}
          <TabPanel value={tabValue} index={0}>
            {/* Action links */}
            <Box
              sx={{
                display: "flex",
                gap: 3,
                mb: 2,
                alignItems: "center",
                flexWrap: "wrap",
                justifyContent: "flex-end",
              }}
            >
              <ClickableText
                onClick={() => setEditSliderOpen(true)}
                sx={{ color: theme.palette.blueText.main, fontSize: "0.9rem" }}
              >
                Edit
              </ClickableText>
              <ClickableText
                onClick={() => setStatementPopupOpen(true)}
                sx={{ color: theme.palette.blueText.main, fontSize: "0.9rem" }}
              >
                View Statement
              </ClickableText>
              <ClickableText
                onClick={() => setPaymentsPopupOpen(true)}
                sx={{ color: theme.palette.blueText.main, fontSize: "0.9rem" }}
              >
                Manage Payments
              </ClickableText>
            </Box>

            {initialValues ? (
              <EditLoan
                loanDraft={loan}
                initialValues={initialValues}
                onEditSuccess={handleLoanEditSuccess}
                isEditMode={false}
                readOnlyFields={["loanProduct", "borrower"]}
                allowEditingOverride={false}
                entityLabel="Loan"
              />
            ) : (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Summary
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
                  Principal: {loan?.principal ?? "N/A"}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
                  Interest Rate: {loan?.interestRate ?? "N/A"}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
                  Start Date: {loan?.startDate || "N/A"}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
                  Maturity Date: {loan?.maturityDate || "N/A"}
                </Typography>
              </Box>
            )}
          </TabPanel>

          {/* Files Tab */}
          <TabPanel value={tabValue} index={1}>
            <LoanFiles
              loan={loan}
              setNotification={(n) =>
                setNotification({
                  type: n.color === "green" ? "success" : "error",
                  message: n.message,
                })
              }
            />
          </TabPanel>
        </Box>
      </Box>
    </>
  );
}

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`loan-tabpanel-${index}`}
      aria-labelledby={`loan-tab-${index}`}
      {...other}
    >
      <Box sx={{ pt: 3 }}>{children}</Box>
    </div>
  );
}
