import React from "react";
import {
  Box,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { UserContext } from "../../../App";
import CollectionsTemplate from "../../../ModelAssets/CollectionsTemplate";
import ClickableText from "../../../ModelAssets/ClickableText";
import NotificationBar from "../../../ModelAssets/NotificationBar";
import PlusButtonSmall from "../../../ModelAssets/PlusButtonSmall";
import LoanScheduleDraft from "./LoanScheduleDraft";
import { fetchBorrowers } from "../CreateLoan/createLoanHelpers";
import {
  listLoanDraftsByBranch,
  listLoanDraftsByInstitution,
  getLoanDraftById,
  copyLoanDraft,
  transitionLoanDraftStatus,
  convertDraftToLoan,
} from "./loanDraftHelpers";
import {
  exportLoanDraftScheduleA4,
  exportLoanDraftSummaryA4,
} from "./loanDraftExportHelpers";

export default function LoanDrafts() {
  const navigate = useNavigate();
  const { userDetails } = React.useContext(UserContext);
  const [loading, setLoading] = React.useState(true);
  const [rows, setRows] = React.useState([]);
  const [borrowers, setBorrowers] = React.useState([]);
  const [notification, setNotification] = React.useState(null);
  const [exportModalOpen, setExportModalOpen] = React.useState(false);
  const [selectedDraftForExport, setSelectedDraftForExport] =
    React.useState(null);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    try {
      const branchID = userDetails?.branchUsersId || null;
      const institutionID = userDetails?.institutionUsersId || null;

      if (!branchID && !institutionID) {
        setRows([]);
        setBorrowers([]);
        setNotification({
          type: "error",
          message: "Missing institution/branch context for drafts.",
        });
        return;
      }

      // Borrowers lookup is branch-scoped in this app.
      const borrowersPromise = branchID ? fetchBorrowers(branchID) : [];

      let drafts = [];
      if (branchID) {
        drafts = await listLoanDraftsByBranch({ branchID });
        if (drafts.length === 0 && institutionID) {
          drafts = await listLoanDraftsByInstitution({ institutionID });
        }
      } else {
        drafts = await listLoanDraftsByInstitution({ institutionID });
      }

      const borrowersList = await borrowersPromise;
      setRows(Array.isArray(drafts) ? drafts : []);
      setBorrowers(Array.isArray(borrowersList) ? borrowersList : []);
    } catch (err) {
      console.error("Failed to load drafts:", err);
      setRows([]);
      setBorrowers([]);
      setNotification({
        type: "error",
        message: err?.message || "Failed to load drafts",
      });
    } finally {
      setLoading(false);
    }
  }, [userDetails?.branchUsersId, userDetails?.institutionUsersId]);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const borrowerName = React.useCallback(
    (borrowerID) => {
      const b = borrowers.find((x) => x.id === borrowerID);
      if (!b) return borrowerID || "";
      return (
        `${b.firstname || ""} ${b.othername || ""} ${
          b.businessName || ""
        }`.trim() ||
        b.uniqueIdNumber ||
        b.id
      );
    },
    [borrowers]
  );

  const requireDraft = async (id) => {
    const draft = await getLoanDraftById(id);
    if (!draft) throw new Error("Draft not found");
    return draft;
  };

  const onEdit = React.useCallback(
    (id) => {
      navigate(`/loan-drafts/id/${id}/edit`);
    },
    [navigate]
  );

  const onView = React.useCallback(
    (id) => {
      navigate(`/loan-drafts/id/${id}/view`);
    },
    [navigate]
  );

  const onCopy = async (id) => {
    try {
      const draft = await requireDraft(id);
      const created = await copyLoanDraft({ loanDraft: draft, userDetails });
      setNotification({ type: "success", message: "Draft copied" });
      navigate(`/add-loan?draftId=${created.id}`);
    } catch (err) {
      console.error(err);
      setNotification({
        type: "error",
        message: err?.message || "Copy failed",
      });
    }
  };

  const onSend = async (id) => {
    try {
      const draft = await requireDraft(id);
      await transitionLoanDraftStatus({
        loanDraft: draft,
        userDetails,
        nextStatus: "SENT_FOR_APPROVAL",
      });
      setNotification({ type: "success", message: "Sent for approval" });
      refresh();
    } catch (err) {
      console.error(err);
      setNotification({
        type: "error",
        message: err?.message || "Send failed",
      });
    }
  };

  const onConvert = async (id) => {
    try {
      const draft = await requireDraft(id);
      await convertDraftToLoan({ loanDraft: draft, userDetails });
      setNotification({ type: "success", message: "Converted to loan" });
      navigate("/loans");
    } catch (err) {
      console.error(err);
      setNotification({
        type: "error",
        message: err?.message || "Convert failed",
      });
    }
  };

  const onExportSchedule = async (id) => {
    try {
      const draft = await requireDraft(id);
      exportLoanDraftScheduleA4({
        loanDraft: draft,
        borrower: borrowers.find((b) => b.id === draft.borrowerID) || null,
      });
    } catch (err) {
      console.error(err);
      setNotification({
        type: "error",
        message: err?.message || "Export failed",
      });
    }
  };

  const onExportSummary = async (id) => {
    try {
      const draft = await requireDraft(id);
      exportLoanDraftSummaryA4({
        loanDraft: draft,
        borrower: borrowers.find((b) => b.id === draft.borrowerID) || null,
      });
    } catch (err) {
      console.error(err);
      setNotification({
        type: "error",
        message: err?.message || "Export failed",
      });
    }
  };

  const onOpenExportModal = async (id) => {
    try {
      const draft = await requireDraft(id);
      setSelectedDraftForExport(draft);
      setExportModalOpen(true);
    } catch (err) {
      console.error(err);
      setNotification({
        type: "error",
        message: err?.message || "Failed to load draft",
      });
    }
  };

  const handleCloseExportModal = () => {
    setExportModalOpen(false);
    setSelectedDraftForExport(null);
  };

  const columns = React.useMemo(
    () => [
      {
        field: "draftNumber",
        headerName: "Draft #",
        width: 140,
        renderCell: (params) => (
          <ClickableText onClick={() => onView(params.row.id)}>
            {(() => {
              const v = params.value;
              if (v === null || v === undefined) return "";
              if (typeof v === "string" || typeof v === "number")
                return String(v);
              return "";
            })()}
          </ClickableText>
        ),
      },
      {
        field: "borrowerID",
        headerName: "Borrower",
        flex: 1,
        minWidth: 220,
        valueGetter: (value, row) => borrowerName(row?.borrowerID || value),
      },
      {
        field: "principal",
        headerName: "Principal",
        width: 140,
      },
      {
        field: "status",
        headerName: "Status",
        width: 120,
      },
      // {
      //   field: "lastEditedAt",
      //   headerName: "Last Edited",
      //   width: 180,
      //   valueGetter: (value) =>
      //     value ? dayjs(value).format("DD-MMM-YYYY HH:mm") : "",
      // },
      {
        field: "actions",
        headerName: "Actions",
        width: 520,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const id = params.row.id;
          const status = params.row.status;
          const canSend = status === "DRAFT" || status === "REJECTED";
          const canConvert = status === "APPROVED";
          return (
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                py: 1,
                alignItems: "center",
              }}
            >
              <IconButton
                size="small"
                onClick={() => onEdit(id)}
                sx={{ color: "primary.main" }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <PlusButtonSmall
                label="Export"
                onClick={() => onOpenExportModal(id)}
              />
            </Box>
          );
        },
      },
    ],
    [borrowerName, onEdit, onView]
  );

  return (
    <Box sx={{ width: "100%" }}>
      {notification && (
        <NotificationBar
          notification={notification}
          clearNotification={() => setNotification(null)}
        />
      )}
      <CollectionsTemplate
        title="Loan Drafts"
        createButtonText="Create Loan"
        onCreateClick={() => navigate("/add-loan")}
        items={rows}
        loading={loading}
        columns={columns}
        enableSearch={false}
        noDataMessage="No loan drafts found."
      />

      <Dialog
        open={exportModalOpen}
        onClose={handleCloseExportModal}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Loan Schedule Preview</DialogTitle>
        <DialogContent>
          {selectedDraftForExport &&
            (() => {
              // Parse draftRecord to get the actual form values
              let parsedDraftValues = {};
              try {
                const draftRecord = selectedDraftForExport.draftRecord;
                if (typeof draftRecord === "string") {
                  parsedDraftValues = JSON.parse(draftRecord);
                } else if (
                  typeof draftRecord === "object" &&
                  draftRecord !== null
                ) {
                  parsedDraftValues = draftRecord;
                }
              } catch (err) {
                console.error("Failed to parse draftRecord:", err);
              }

              return (
                <LoanScheduleDraft
                  loanDraft={selectedDraftForExport}
                  draftValues={parsedDraftValues}
                  borrower={
                    borrowers.find(
                      (b) => b.id === selectedDraftForExport.borrowerID
                    ) || null
                  }
                  userDetails={userDetails}
                  readOnly={true}
                />
              );
            })()}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
