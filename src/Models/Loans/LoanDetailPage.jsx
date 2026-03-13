import React from "react";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import EditLoan from "./EditLoan/EditLoan";
import NotificationBar from "../../ModelAssets/NotificationBar";
import { getLoanById } from "./loanHelpers";

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
  const [loading, setLoading] = React.useState(true);
  const [loan, setLoan] = React.useState(null);
  const [initialValues, setInitialValues] = React.useState(null);
  const [notification, setNotification] = React.useState(null);

  const backPath = location.state?.from || "/loans";

  const load = React.useCallback(async () => {
    if (!loanId) return;
    setLoading(true);

    try {
      const loanRecord = await getLoanById(loanId);
      if (!loanRecord) {
        setLoan(null);
        setInitialValues(null);
        return;
      }

      const draftRecord = parseLoanRecord(loanRecord);
      const loanProductName =
        loanRecord?.loanProduct?.name ||
        (loanRecord?.loanProductID ? "Unknown" : "N/A");

      setLoan(loanRecord);
      setInitialValues({
        ...draftRecord,
        borrowerName: formatBorrowerName(loanRecord.borrower),
        loanProductName,
        loanProduct:
          loanRecord.loanProductID || draftRecord.loanProduct || "N/A",
      });
    } catch (err) {
      console.error("Failed to load loan:", err);
      setNotification({
        type: "error",
        message: err?.message || "Failed to load loan",
      });
      setLoan(null);
      setInitialValues(null);
    } finally {
      setLoading(false);
    }
  }, [loanId]);

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

  if (!loan) {
    return (
      <Box sx={{ p: 2 }}>
        {notification && (
          <NotificationBar
            notification={notification}
            clearNotification={() => setNotification(null)}
          />
        )}
        <Typography variant="h6">Loan not found</Typography>
        <Button
          sx={{ mt: 2 }}
          variant="outlined"
          onClick={() => navigate(backPath)}
        >
          Back to Loans
        </Button>
      </Box>
    );
  }

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
            Loan {loan.loanNumber ? `(${loan.loanNumber})` : ""}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Status: {loan.status}
            {` • Loan Officer: ${formatOfficerName(
              loan.assignedToEmployee || loan.createdByEmployee,
            )}`}
            {` • Branch: ${loan.branch?.name || "N/A"}`}
          </Typography>
        </Box>
      </Box>

      {initialValues ? (
        <Box sx={{ mt: 2 }}>
          <EditLoan
            loanDraft={loan}
            initialValues={initialValues}
            onEditSuccess={() => {
              setNotification({
                type: "success",
                message: "Loan updated successfully",
              });
              load();
            }}
            isEditMode={false}
            onCancel={() => navigate(backPath)}
            readOnlyFields={["loanProduct", "borrower"]}
            allowEditingOverride={true}
            entityLabel="Loan"
          />
        </Box>
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
    </Box>
  );
}
