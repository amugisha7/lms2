import React, { useState, useEffect, useContext, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import EditLoan from "../EditLoan/EditLoan";
import UseLoanProduct from "../CreateLoan/UseLoanProduct";
import ClickableText from "../../../ModelAssets/ClickableText";
import CustomPopUp from "../../../ModelAssets/CustomPopUp";
import {
  convertDraftToLoan,
  getLoanDraftById,
  transitionLoanDraftStatus,
} from "./loanDraftHelpers";
import LoanScheduleDraft from "./LoanScheduleDraft";
import NotificationBar from "../../../ModelAssets/NotificationBar";
import { UserContext } from "../../../App";
import {
  fetchInstitutionAdmins,
  fetchLoanProducts,
} from "../CreateLoan/createLoanHelpers";
import { sendLoanApprovalRequest } from "../../../Screens/Notifications/notificationsAPI";

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

export default function EditLoanDraft({
  mode = "edit",
  loanDraft: propLoanDraft = null,
  initialValues: propInitialValues = null,
  borrower: propBorrower = null,
  onBack,
  onDraftUpdated,
  onRequestEdit,
  embedded = false,
}) {
  const { draftId } = useParams();
  const navigate = useNavigate();
  const { userDetails } = useContext(UserContext);
  const isViewMode = mode === "view";
  const [loading, setLoading] = useState(!propLoanDraft || !propInitialValues);
  const [draftData, setDraftData] = useState(propLoanDraft);
  const [initialValues, setInitialValues] = useState(propInitialValues);
  const [borrower, setBorrower] = useState(propBorrower);
  const [notification, setNotification] = useState(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [loanProducts, setLoanProducts] = useState([]);
  const [loanProductsLoading, setLoanProductsLoading] = useState(false);

  useEffect(() => {
    if (propLoanDraft) setDraftData(propLoanDraft);
    if (propInitialValues) setInitialValues(propInitialValues);
    if (propBorrower !== undefined) setBorrower(propBorrower);
    if (propLoanDraft && propInitialValues) setLoading(false);
  }, [propBorrower, propInitialValues, propLoanDraft]);

  useEffect(() => {
    if (propLoanDraft && propInitialValues) return;

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
        setBorrower(draft.borrower || null);
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
  }, [draftId, propInitialValues, propLoanDraft]);

  const handleEditSuccess = () => {
    setNotification({
      type: "success",
      message: "Draft updated successfully",
    });
    const targetDraftId = draftData?.id || draftId;
    if (targetDraftId) {
      setTimeout(() => {
        navigate(`/loan-drafts/id/${targetDraftId}/view`);
      }, 1500);
    }
  };

  const handleCancel = () => {
    if (onBack) {
      onBack();
      return;
    }
    const targetDraftId = draftData?.id || draftId;
    if (targetDraftId) {
      navigate(`/loan-drafts/id/${targetDraftId}/view`);
      return;
    }
    navigate("/loan-drafts");
  };

  const handleNavigateToEdit = () => {
    if (onRequestEdit) {
      onRequestEdit();
      return;
    }
    const targetDraftId = draftData?.id || draftId;
    if (!targetDraftId) return;
    navigate(`/loan-drafts/id/${targetDraftId}/edit`);
  };

  const isPrivileged = useMemo(() => {
    const type = userDetails?.userType;
    return type?.toLowerCase() === "admin" || type === "branchManager";
  }, [userDetails]);

  useEffect(() => {
    if (isViewMode) {
      setLoanProductsLoading(false);
      return;
    }

    const institutionId = userDetails?.institutionUsersId;
    const branchId =
      borrower?.branchBorrowersId ||
      draftData?.branchID ||
      userDetails?.branchUsersId ||
      null;

    if (!institutionId) {
      setLoanProducts([]);
      setLoanProductsLoading(false);
      return;
    }

    let cancelled = false;
    setLoanProductsLoading(true);

    fetchLoanProducts(institutionId, branchId, isPrivileged)
      .then((products) => {
        if (!cancelled) {
          setLoanProducts(Array.isArray(products) ? products : []);
        }
      })
      .catch((error) => {
        console.error("Failed to load loan products for draft editing:", error);
        if (!cancelled) {
          setLoanProducts([]);
          setNotification((prev) =>
            prev?.type === "error"
              ? prev
              : {
                  type: "error",
                  message: error?.message || "Failed to load loan products.",
                },
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoanProductsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    borrower?.branchBorrowersId,
    draftData?.branchID,
    isPrivileged,
    isViewMode,
    userDetails?.branchUsersId,
    userDetails?.institutionUsersId,
  ]);

  const scheduleBorrower = borrower || draftData?.borrower || null;
  const borrowerDisplayName =
    formatBorrowerName(scheduleBorrower) || draftData?.borrowerID || "N/A";
  const readOnlyDraft = useMemo(() => {
    if (!draftData || !isViewMode) return draftData;
    return {
      ...draftData,
      status: "__VIEW_ONLY__",
      borrower: scheduleBorrower,
    };
  }, [draftData, isViewMode, scheduleBorrower]);

  const handleSendForApproval = async () => {
    setNotification(null);

    try {
      if (!draftData?.id) throw new Error("Save Draft first.");

      const updated = await transitionLoanDraftStatus({
        loanDraft: draftData,
        userDetails,
        nextStatus: "IN_REVIEW",
      });

      const nextDraft = {
        ...updated,
        borrower: scheduleBorrower,
        loanProduct: draftData?.loanProduct || null,
      };

      setDraftData(nextDraft);
      setScheduleOpen(false);
      setNotification({
        type: "success",
        message: "Draft sent for approval. Admins notified.",
      });

      if (typeof onDraftUpdated === "function") {
        onDraftUpdated(nextDraft);
      }

      if (userDetails?.institutionUsersId) {
        fetchInstitutionAdmins(userDetails.institutionUsersId).then(
          (admins) => {
            const draftValues = parseDraftRecord(nextDraft);
            const borrowerName =
              formatBorrowerName(scheduleBorrower) ||
              draftValues.borrower ||
              "Unknown";

            const loanData = {
              borrowerName,
              loanAmount: draftValues.principalAmount || 0,
              loanProduct: draftValues.loanProduct || "Standard Loan",
              applicationDate: new Date().toISOString(),
              loanOfficer:
                `${userDetails.firstName || ""} ${userDetails.lastName || ""}`.trim(),
              loanId: nextDraft.id,
              borrowerId: nextDraft.borrowerID,
            };

            admins.forEach((admin) => {
              sendLoanApprovalRequest(
                loanData,
                admin.id,
                userDetails.institutionUsersId,
              ).catch((err) =>
                console.error(
                  `Failed to notify admin ${admin.firstName}:`,
                  err,
                ),
              );
            });
          },
        );
      }
    } catch (err) {
      console.error(err);
      setNotification({
        type: "error",
        message: err?.message || "Failed to send draft for approval.",
      });
    }
  };

  const handleConvertToLoan = async () => {
    setNotification(null);

    try {
      if (!draftData?.id) throw new Error("Save Draft first.");

      await convertDraftToLoan({ loanDraft: draftData, userDetails });
      setScheduleOpen(false);
      navigate("/loans");
    } catch (err) {
      console.error(err);
      setNotification({
        type: "error",
        message: err?.message || "Failed to create loan.",
      });
    }
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
      <Box sx={{ width: "100%", p: 2 }}>
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
    <Box sx={{ width: "100%" }}>
      {notification && (
        <NotificationBar
          notification={notification}
          clearNotification={() => setNotification(null)}
        />
      )}
      {isViewMode ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
            mb: 2,
          }}
        >
          <ClickableText
            onClick={handleCancel}
            sx={{ fontSize: 14, fontWeight: 600, letterSpacing: 0.2 }}
          >
            BACK
          </ClickableText>
          <ClickableText
            onClick={handleNavigateToEdit}
            sx={{ fontSize: 14, fontWeight: 600, letterSpacing: 0.2 }}
          >
            EDIT
          </ClickableText>
          <ClickableText
            onClick={() => setScheduleOpen(true)}
            sx={{ fontSize: 14, fontWeight: 600, letterSpacing: 0.2 }}
          >
            VIEW LOAN SCHEDULE
          </ClickableText>
        </Box>
      ) : embedded ? null : (
        <>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Edit Loan Draft
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, color: "text.secondary" }}>
            Draft Number: {draftData?.draftNumber || draftId}
          </Typography>
        </>
      )}

      <CustomPopUp
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        title={draftData?.draftNumber || "Loan Draft"}
        showEdit={false}
        showDelete={false}
        maxWidth="lg"
      >
        <LoanScheduleDraft
          loanDraft={draftData}
          draftValues={initialValues}
          borrower={scheduleBorrower}
          userDetails={userDetails}
          currency={userDetails?.institution?.currencyCode || "$"}
          readOnly={false}
          onEdit={() => setScheduleOpen(false)}
          onConfirmCreateLoan={
            isPrivileged ? handleConvertToLoan : handleSendForApproval
          }
          createButtonText={
            isPrivileged ? "CREATE LOAN" : "SUBMIT FOR APPROVAL"
          }
          isEditDraftFlow
        />
      </CustomPopUp>

      {isViewMode ? (
        <EditLoan
          loanDraft={readOnlyDraft}
          initialValues={initialValues}
          onEditSuccess={handleEditSuccess}
          isEditMode={false}
          onCancel={undefined}
          readOnlyFields={["loanProduct", "borrower"]}
        />
      ) : (
        <>
          <UseLoanProduct
            initialValues={initialValues}
            borrower={scheduleBorrower}
            isEditMode
            onCancel={handleCancel}
            borrowers={[]}
            borrowersLoading={false}
            loanProducts={loanProducts}
            loanProductsLoading={loanProductsLoading}
            draftId={draftData?.id || draftId}
            useEditingButtons
            hideScheduleAction
            topContent={
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "stretch", sm: "center" },
                  gap: { xs: 0, sm: 1 },
                  borderBottom: (theme) =>
                    `1.5px dotted ${
                      theme.palette.mode === "dark"
                        ? theme.palette.grey[500]
                        : theme.palette.grey[400]
                    }`,
                  pb: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 12,
                    minWidth: { xs: "100%", sm: "120px" },
                    maxWidth: { xs: "100%", sm: "120px" },
                  }}
                >
                  Borrower
                </Typography>
                <TextField
                  fullWidth
                  variant="filled"
                  value={borrowerDisplayName}
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />
              </Box>
            }
            onDraftUpdated={(updatedDraft) => {
              if (!updatedDraft) return;
              const updatedDraftRecord = parseDraftRecord(updatedDraft);
              const resolvedLoanProductId =
                updatedDraft?.loanProductID || updatedDraftRecord?.loanProduct;
              const resolvedLoanProduct =
                loanProducts.find(
                  (product) => product.id === resolvedLoanProductId,
                ) ||
                updatedDraft?.loanProduct ||
                draftData?.loanProduct ||
                null;

              const mergedDraft = {
                ...updatedDraft,
                borrower:
                  draftData?.borrower ||
                  scheduleBorrower ||
                  updatedDraft?.borrower ||
                  null,
                loanProduct: resolvedLoanProduct,
              };

              setDraftData(mergedDraft);
              if (typeof onDraftUpdated === "function") {
                onDraftUpdated(mergedDraft);
              }
            }}
          />
        </>
      )}
    </Box>
  );
}
