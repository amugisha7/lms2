import React from "react";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../../App";
import EditLoanDraft from "./EditLoanDraft";
import CustomSlider from "../../../ModelAssets/CustomSlider";
import { fetchBorrowers } from "../CreateLoan/createLoanHelpers";
import { getLoanDraftById } from "./loanDraftHelpers";
import NotificationBar from "../../../ModelAssets/NotificationBar";

const parseDraftRecord = (loanDraft) => {
  const record = loanDraft?.loanComputationRecord ?? loanDraft?.draftRecord;
  if (!record) return {};

  try {
    const parsed =
      typeof record === "string" && record.trim() ? JSON.parse(record) : record;
    if (!parsed || typeof parsed !== "object") return {};

    // updateLoanDraft stores draft values under computationRecord.draftRecord
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

    // Fallback: treat the computation record as the draft record
    return parsed;
  } catch (err) {
    console.error("Failed to parse loanComputationRecord:", err);
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

export default function LoanDraftDetail() {
  const { draftId } = useParams();
  const navigate = useNavigate();
  const { userDetails } = React.useContext(UserContext);

  const [loading, setLoading] = React.useState(true);
  const [loanDraft, setLoanDraft] = React.useState(null);
  const [borrower, setBorrower] = React.useState(null);
  const [initialValues, setInitialValues] = React.useState(null);
  const [notification, setNotification] = React.useState(null);
  const [editSliderOpen, setEditSliderOpen] = React.useState(false);

  const applyDraftState = React.useCallback(
    (draft) => {
      if (!draft) return;

      const attachedBorrower =
        borrower || loanDraft?.borrower || draft?.borrower || null;
      const draftRecord = parseDraftRecord(draft);
      const loanProductName =
        draft?.loanProduct?.name ||
        loanDraft?.loanProduct?.name ||
        (draft?.loanProductID ? "Unknown" : "N/A");

      setLoanDraft({
        ...draft,
        borrower: attachedBorrower,
        loanProduct: draft?.loanProduct || loanDraft?.loanProduct || null,
      });
      setInitialValues({
        ...draftRecord,
        borrowerName: formatBorrowerName(attachedBorrower),
        loanProductName,
        loanProduct: draft?.loanProductID || draftRecord?.loanProduct || "N/A",
      });
    },
    [borrower, loanDraft],
  );

  const load = React.useCallback(async () => {
    if (!draftId) return;
    setLoading(true);

    try {
      const draft = await getLoanDraftById(draftId);
      let attachedBorrower = null;

      if (userDetails?.branchUsersId) {
        const list = await fetchBorrowers(userDetails.branchUsersId);
        const b = list.find((x) => x.id === draft?.borrowerID);
        attachedBorrower = b || null;
        setBorrower(attachedBorrower);
      }

      const draftRecord = parseDraftRecord(draft);
      const loanProductName =
        draft?.loanProduct?.name || (draft?.loanProductID ? "Unknown" : "N/A");

      setLoanDraft({
        ...draft,
        borrower: attachedBorrower || draft?.borrower || null,
      });
      setInitialValues({
        ...draftRecord,
        // Display-only helpers (EditLoan strips these before saving)
        borrowerName: formatBorrowerName(attachedBorrower || draft?.borrower),
        loanProductName,
        // Display-only fallback value so the field can render as read-only
        loanProduct: draft?.loanProductID || draftRecord?.loanProduct || "N/A",
      });
    } catch (err) {
      console.error("Failed to load loan draft:", err);
      setNotification({
        type: "error",
        message: err?.message || "Failed to load draft",
      });
      setInitialValues(null);
    } finally {
      setLoading(false);
    }
  }, [draftId, userDetails?.branchUsersId, userDetails?.institutionUsersId]);

  React.useEffect(() => {
    load();
  }, [load]);

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

      <CustomSlider
        open={editSliderOpen}
        onClose={() => setEditSliderOpen(false)}
        title={`Edit Loan Draft${loanDraft?.draftNumber ? ` (${loanDraft.draftNumber})` : ""}`}
        showEdit={false}
        showDelete={false}
        showPdf={false}
      >
        {initialValues && loanDraft ? (
          <EditLoanDraft
            mode="edit"
            embedded
            loanDraft={loanDraft}
            initialValues={initialValues}
            borrower={borrower}
            onBack={() => setEditSliderOpen(false)}
            onDraftUpdated={(updatedDraft) => {
              applyDraftState(updatedDraft);
              setEditSliderOpen(false);
              setNotification({
                type: "success",
                message: "Draft updated successfully",
              });
            }}
          />
        ) : null}
      </CustomSlider>

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
      </Box>

      {initialValues && (
        <Box sx={{ mt: 2 }}>
          <EditLoanDraft
            mode="view"
            loanDraft={loanDraft}
            initialValues={initialValues}
            borrower={borrower}
            onBack={() => navigate("/loan-drafts")}
            onRequestEdit={() => setEditSliderOpen(true)}
            onDraftUpdated={(updatedDraft) => {
              applyDraftState(updatedDraft);
            }}
          />
        </Box>
      )}

      {!initialValues && (
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
      )}
    </Box>
  );
}
