import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import EditLoan from "../EditLoan/EditLoan";
import { getLoanDraftById } from "./loanDraftHelpers";
import NotificationBar from "../../../ModelAssets/NotificationBar";

const parseDraftRecord = (loanDraft) => {
  const record = loanDraft?.loanComputationRecord;
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

export default function EditLoanDraft() {
  const { draftId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [draftData, setDraftData] = useState(null);
  const [initialValues, setInitialValues] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchDraft = async () => {
      if (!draftId) {
        setNotification({ type: "error", message: "No draft ID provided" });
        setLoading(false);
        return;
      }

      try {
        const draft = await getLoanDraftById(draftId);
        if (cancelled) return;
        if (!draft) {
          setNotification({ type: "error", message: "Draft not found" });
          setLoading(false);
          return;
        }

        setDraftData(draft);
        const draftRecord = parseDraftRecord(draft);

        const loanProductName =
          draft?.loanProduct?.name ||
          (draft?.loanProductID ? "Unknown" : "N/A");

        setInitialValues({
          ...draftRecord,
          // Display-only helpers (EditLoan strips these before saving)
          borrowerName: formatBorrowerName(draft.borrower),
          loanProductName,
          // Display-only fallback value so the field can render as read-only
          loanProduct: draft.loanProductID || draftRecord.loanProduct || "N/A",
        });
      } catch (err) {
        console.error("Error fetching draft:", err);
        setNotification({
          type: "error",
          message: err?.message || "Failed to load draft",
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchDraft();
    return () => {
      cancelled = true;
    };
  }, [draftId]);

  const handleEditSuccess = () => {
    setNotification({
      type: "success",
      message: "Draft updated successfully",
    });
    setTimeout(() => {
      navigate("/loan-drafts");
    }, 1500);
  };

  const handleCancel = () => {
    navigate("/loan-drafts");
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!initialValues || !draftData) {
    return (
      <Box sx={{ p: 3 }}>
        {notification && (
          <NotificationBar
            notification={notification}
            clearNotification={() => setNotification(null)}
          />
        )}
        <Typography variant="h6" color="error">
          Failed to load draft data
        </Typography>
        <Button onClick={handleCancel} sx={{ mt: 2 }}>
          Back to Loan Drafts
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {notification && (
        <NotificationBar
          notification={notification}
          clearNotification={() => setNotification(null)}
        />
      )}
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
        Edit Loan Draft
      </Typography>
      <Typography variant="h6" sx={{ mb: 3, color: "text.secondary" }}>
        Draft Number: {draftData?.draftNumber || draftId}
      </Typography>

      <EditLoan
        loanDraft={draftData}
        initialValues={initialValues}
        onEditSuccess={handleEditSuccess}
        isEditMode={true}
        onCancel={handleCancel}
        readOnlyFields={["loanProduct", "borrower"]}
      />
    </Box>
  );
}
