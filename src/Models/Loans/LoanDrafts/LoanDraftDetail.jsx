import React from "react";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../../App";
import CreateLoan from "../CreateLoan/CreateLoan";
import UseLoanProduct from "../CreateLoan/UseLoanProduct";
import {
  fetchBorrowers,
  fetchLoanProducts,
} from "../CreateLoan/createLoanHelpers";
import {
  getLoanDraftById,
  transitionLoanDraftStatus,
  convertDraftToLoan,
} from "./loanDraftHelpers";
import {
  exportLoanDraftScheduleA4,
  exportLoanDraftSummaryA4,
} from "./loanDraftExportHelpers";
import NotificationBar from "../../../ModelAssets/NotificationBar";

const canEdit = (status) => status === "DRAFT" || status === "REJECTED";

export default function LoanDraftDetail() {
  const { draftId } = useParams();
  const navigate = useNavigate();
  const { userDetails } = React.useContext(UserContext);

  const [loading, setLoading] = React.useState(true);
  const [loanDraft, setLoanDraft] = React.useState(null);
  const [borrower, setBorrower] = React.useState(null);
  const [borrowers, setBorrowers] = React.useState([]);
  const [borrowersLoading, setBorrowersLoading] = React.useState(true);
  const [loanProducts, setLoanProducts] = React.useState([]);
  const [loanProductsLoading, setLoanProductsLoading] = React.useState(true);
  const [notification, setNotification] = React.useState(null);

  const load = React.useCallback(async () => {
    if (!draftId) return;
    setLoading(true);

    try {
      const draft = await getLoanDraftById(draftId);
      setLoanDraft(draft);

      if (userDetails?.branchUsersId) {
        setBorrowersLoading(true);
        const list = await fetchBorrowers(userDetails.branchUsersId);
        setBorrowers(list);
        const b = list.find((x) => x.id === draft?.borrowerID);
        setBorrower(b || null);
      }

      if (userDetails?.institutionUsersId && userDetails?.branchUsersId) {
        setLoanProductsLoading(true);
        const prods = await fetchLoanProducts(
          userDetails.institutionUsersId,
          userDetails.branchUsersId
        );
        setLoanProducts(prods);
      }
    } catch (err) {
      console.error("Failed to load loan draft:", err);
      setNotification({
        type: "error",
        message: err?.message || "Failed to load draft",
      });
    } finally {
      setBorrowersLoading(false);
      setLoanProductsLoading(false);
      setLoading(false);
    }
  }, [draftId, userDetails?.branchUsersId, userDetails?.institutionUsersId]);

  React.useEffect(() => {
    load();
  }, [load]);

  const handleSendForApproval = async () => {
    try {
      if (!loanDraft) return;
      const updated = await transitionLoanDraftStatus({
        loanDraft,
        userDetails,
        nextStatus: "SENT_FOR_APPROVAL",
      });
      setLoanDraft(updated);
      setNotification({ type: "success", message: "Draft sent for approval" });
    } catch (err) {
      console.error(err);
      setNotification({
        type: "error",
        message: err?.message || "Failed to send",
      });
    }
  };

  const handleApprove = async () => {
    try {
      if (!loanDraft) return;
      const updated = await transitionLoanDraftStatus({
        loanDraft,
        userDetails,
        nextStatus: "APPROVED",
      });
      setLoanDraft(updated);
      setNotification({ type: "success", message: "Draft approved" });
    } catch (err) {
      console.error(err);
      setNotification({
        type: "error",
        message: err?.message || "Failed to approve",
      });
    }
  };

  const handleReject = async () => {
    try {
      if (!loanDraft) return;
      const reason = window.prompt("Rejection reason (required):");
      if (!reason) {
        setNotification({
          type: "error",
          message: "Rejection reason is required",
        });
        return;
      }
      const updated = await transitionLoanDraftStatus({
        loanDraft,
        userDetails,
        nextStatus: "REJECTED",
        rejectionReason: reason,
      });
      setLoanDraft(updated);
      setNotification({ type: "success", message: "Draft rejected" });
    } catch (err) {
      console.error(err);
      setNotification({
        type: "error",
        message: err?.message || "Failed to reject",
      });
    }
  };

  const handleConvert = async () => {
    try {
      if (!loanDraft) return;
      const loan = await convertDraftToLoan({ loanDraft, userDetails });
      setNotification({ type: "success", message: "Draft converted to loan" });
      navigate("/admin/loans");
      return loan;
    } catch (err) {
      console.error(err);
      setNotification({
        type: "error",
        message: err?.message || "Failed to convert",
      });
    }
  };

  const handleExportSchedule = async () => {
    try {
      if (!loanDraft) return;
      exportLoanDraftScheduleA4({ loanDraft, borrower });
    } catch (err) {
      console.error(err);
      setNotification({
        type: "error",
        message: err?.message || "Failed to export schedule",
      });
    }
  };

  const handleExportSummary = async () => {
    try {
      if (!loanDraft) return;
      exportLoanDraftSummaryA4({ loanDraft, borrower });
    } catch (err) {
      console.error(err);
      setNotification({
        type: "error",
        message: err?.message || "Failed to export summary",
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!loanDraft) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Draft not found</Typography>
        <Button
          sx={{ mt: 2 }}
          variant="outlined"
          onClick={() => navigate("/admin/loan-drafts")}
        >
          Back to Drafts
        </Button>
      </Box>
    );
  }

  const readOnly = !canEdit(loanDraft.status);
  const hasLoanProduct = Boolean(loanDraft.loanProductID);

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      {notification && (
        <NotificationBar
          notification={notification}
          clearNotification={() => setNotification(null)}
        />
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Loan Draft{" "}
            {loanDraft.draftNumber ? `(${loanDraft.draftNumber})` : ""}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Status: {loanDraft.status}
            {borrower
              ? ` • Borrower: ${
                  `${borrower.firstname || ""} ${borrower.othername || ""} ${
                    borrower.businessName || ""
                  }`.trim() || borrower.uniqueIdNumber
                }`
              : loanDraft.borrowerID
              ? ` • BorrowerID: ${loanDraft.borrowerID}`
              : ""}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => navigate("/admin/loan-drafts")}
          >
            Back
          </Button>
          <Button variant="outlined" onClick={handleExportSchedule}>
            Export schedule
          </Button>
          <Button variant="outlined" onClick={handleExportSummary}>
            Export summary
          </Button>
          {(loanDraft.status === "DRAFT" ||
            loanDraft.status === "REJECTED") && (
            <Button variant="contained" onClick={handleSendForApproval}>
              Send for approval
            </Button>
          )}
          {loanDraft.status === "SENT_FOR_APPROVAL" && (
            <>
              <Button variant="outlined" onClick={handleReject}>
                Reject
              </Button>
              <Button variant="contained" onClick={handleApprove}>
                Approve
              </Button>
            </>
          )}
          {loanDraft.status === "APPROVED" && (
            <Button variant="contained" onClick={handleConvert}>
              Save as new loan
            </Button>
          )}
        </Box>
      </Box>

      {hasLoanProduct ? (
        <UseLoanProduct
          borrower={borrower}
          borrowers={borrowers}
          borrowersLoading={borrowersLoading}
          loanProducts={loanProducts}
          loanProductsLoading={loanProductsLoading}
          initialValues={parseDraftRecord(loanDraft)}
          hideCancel
          readOnly={readOnly}
          draftId={loanDraft.id}
          onDraftUpdated={setLoanDraft}
        />
      ) : (
        <CreateLoan
          borrower={borrower}
          borrowers={borrowers}
          borrowersLoading={borrowersLoading}
          initialValues={parseDraftRecord(loanDraft)}
          hideCancel
          readOnly={readOnly}
          draftId={loanDraft.id}
          onDraftUpdated={setLoanDraft}
        />
      )}
    </Box>
  );
}

function parseDraftRecord(loanDraft) {
  if (!loanDraft?.draftRecord) return undefined;
  if (typeof loanDraft.draftRecord === "object") return loanDraft.draftRecord;
  try {
    return JSON.parse(loanDraft.draftRecord);
  } catch {
    return undefined;
  }
}
