import React from "react";
import { Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { UserContext } from "../../../App";
import CollectionsTemplate from "../../../ModelAssets/CollectionsTemplate";
import ClickableText from "../../../ModelAssets/ClickableText";
import NotificationBar from "../../../ModelAssets/NotificationBar";
import { formatMoney, formatMoneyParts } from "../../../Resources/formatting";
import { fetchBorrowers } from "../CreateLoan/createLoanHelpers";
import {
  listLoanDraftsByBranch,
  listLoanDraftsByInstitution,
} from "./loanDraftHelpers";

export default function LoanDrafts() {
  const navigate = useNavigate();
  const { userDetails } = React.useContext(UserContext);
  const [loading, setLoading] = React.useState(true);
  const [rows, setRows] = React.useState([]);
  const [borrowers, setBorrowers] = React.useState([]);
  const [notification, setNotification] = React.useState(null);

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
    [borrowers],
  );

  const onEdit = React.useCallback(
    (id) => {
      navigate(`/loan-drafts/id/${id}/view`);
    },
    [navigate],
  );

  const parseDraftRecord = React.useCallback((row) => {
    try {
      const raw = row?.draftRecord ?? row?.loanComputationRecord;
      if (!raw) return {};
      let parsed = raw;
      if (typeof parsed === "string") parsed = JSON.parse(parsed);
      if (typeof parsed !== "object" || parsed === null) return {};

      // Back-compat: some API paths store a wrapper computationRecord with nested draftRecord.
      if (parsed?.draftRecord && typeof parsed.draftRecord === "object") {
        return parsed.draftRecord;
      }
      if (typeof parsed?.draftRecord === "string") {
        try {
          return JSON.parse(parsed.draftRecord);
        } catch {
          return {};
        }
      }

      return parsed;
    } catch {
      return {};
    }
  }, []);

  const formatInterestPeriodLabel = React.useCallback((interestPeriod) => {
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
  }, []);

  const formatInterestMethodLabel = React.useCallback((interestMethod) => {
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
  }, []);

  const formatInterestMethod = React.useCallback(
    (row) => {
      const draftRecord = parseDraftRecord(row);
      return formatInterestMethodLabel(draftRecord?.interestMethod);
    },
    [parseDraftRecord, formatInterestMethodLabel],
  );

  const formatInterestRate = React.useCallback(
    (row) => {
      const draftRecord = parseDraftRecord(row);
      const currencyCode = userDetails?.institution?.currencyCode;

      let interestText = "";
      if (draftRecord?.interestType === "percentage") {
        // Match LoanScheduleDraft display: `${interestRate}%`
        interestText = `${draftRecord?.interestRate ?? ""}%`;
      } else {
        // Match LoanScheduleDraft display: Money(value)
        interestText = formatMoney(
          draftRecord?.interestRate,
          "$",
          currencyCode,
        );
      }

      if (!interestText) return "";

      if (draftRecord?.interestPeriod === "per_loan") {
        return `${interestText} of Principal`;
      }

      const periodLabel = formatInterestPeriodLabel(
        draftRecord?.interestPeriod,
      );
      return periodLabel ? `${interestText} per ${periodLabel}` : interestText;
    },
    [
      parseDraftRecord,
      userDetails?.institution?.currencyCode,
      formatInterestPeriodLabel,
    ],
  );

  const formatPrincipalParts = React.useCallback(
    (row) => {
      const draftRecord = parseDraftRecord(row);
      const currencyCode = userDetails?.institution?.currencyCode;

      const principalValue =
        draftRecord?.principalAmount ??
        row?.principal ??
        row?.principalAmount ??
        "";

      // Match LoanScheduleDraft Money() formatting: separators + currency decimals.
      return formatMoneyParts(
        principalValue,
        currencyCode || "$",
        currencyCode,
      );
    },
    [parseDraftRecord, userDetails?.institution?.currencyCode],
  );

  const columns = React.useMemo(
    () => [
      {
        field: "draftNumber",
        headerName: "ID",
        width: 140,
        renderCell: (params) => (
          <ClickableText onClick={() => onEdit(params.row.id)}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {(() => {
                const v = params.value;
                if (v === null || v === undefined) return "";
                if (typeof v === "string" || typeof v === "number")
                  return String(v);
                return "";
              })()}
            </Box>
          </ClickableText>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        width: 100,
        valueGetter: (value) => {
          if (!value) return "";
          const raw = String(value);
          return raw
            .toLowerCase()
            .split("_")
            .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
            .join(" ");
        },
      },
      {
        field: "borrowerID",
        headerName: "Borrower",
        minWidth: 160,
        valueGetter: (value, row) => borrowerName(row?.borrowerID || value),
      },
      {
        field: "principal",
        headerName: "Principal",
        width: 140,
        valueGetter: (value, row) => {
          const draftRecord = parseDraftRecord(row);
          return (
            draftRecord?.principalAmount ??
            row?.principal ??
            row?.principalAmount ??
            ""
          );
        },
        renderCell: (params) => {
          const parts = formatPrincipalParts(params.row);
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
                    fontSize: "0.8em", // 20% smaller than the figure
                    verticalAlign: "baseline",
                    marginRight: "2px",
                    opacity: 0.9,
                  }}
                >
                  {parts.prefix}
                </Box>
              ) : null}
              <Box component="span">{parts.number}</Box>
            </Box>
          );
        },
      },
      {
        field: "interestRate",
        headerName: "Interest",
        width: 120,
        valueGetter: (value, row) => formatInterestRate(row),
      },
      {
        field: "interestMethod",
        headerName: "Interest Method",
        width: 200,
        valueGetter: (value, row) => formatInterestMethod(row),
      },
      {
        field: "lastEditedAt",
        headerName: "Last Edited",
        width: 110,
        valueGetter: (value) =>
          value ? dayjs(value).format("DD-MMM-YYYY") : "",
      },
    ],
    [
      borrowerName,
      onEdit,
      formatInterestMethod,
      formatInterestRate,
      formatPrincipalParts,
    ],
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
        createButtonText="New Loan"
        onCreateClick={() => navigate("/add-loan")}
        items={rows}
        loading={loading}
        columns={columns}
        enableSearch={false}
        noDataMessage="No loan drafts found."
      />
    </Box>
  );
}
