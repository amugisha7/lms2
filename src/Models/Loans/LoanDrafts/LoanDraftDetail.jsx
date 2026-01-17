import React from "react";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../../App";
import { fetchBorrowers } from "../CreateLoan/createLoanHelpers";
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
  const [notification, setNotification] = React.useState(null);

  const load = React.useCallback(async () => {
    if (!draftId) return;
    setLoading(true);

    try {
      const draft = await getLoanDraftById(draftId);
      setLoanDraft(draft);

      if (userDetails?.branchUsersId) {
        const list = await fetchBorrowers(userDetails.branchUsersId);
        const b = list.find((x) => x.id === draft?.borrowerID);
        setBorrower(b || null);
      }
    } catch (err) {
      console.error("Failed to load loan draft:", err);
      setNotification({
        type: "error",
        message: err?.message || "Failed to load draft",
      });
    } finally {
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
      navigate("/loans");
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
          onClick={() => navigate("/loan-drafts")}
        >
          Back to Drafts
        </Button>
      </Box>
    );
  }

  const readOnly = !canEdit(loanDraft.status);
  const loanProductName =
    loanDraft?.loanProduct?.name ||
    (loanDraft?.loanProductID ? "Unknown" : "N/A");

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
          <Button variant="outlined" onClick={() => navigate("/loan-drafts")}>
            Back
          </Button>
          {!readOnly && (
            <Button
              variant="contained"
              onClick={() => navigate(`/loan-drafts/id/${draftId}/edit`)}
            >
              Edit draft
            </Button>
          )}
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

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Summary
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
          Loan Product: {loanProductName}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
          Principal: {loanDraft?.principal ?? "N/A"}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
          Interest Rate: {loanDraft?.interestRate ?? "N/A"}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
          Start Date: {loanDraft?.startDate || "N/A"}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
          Maturity Date: {loanDraft?.maturityDate || "N/A"}
        </Typography>
      </Box>
    </Box>
  );
}
