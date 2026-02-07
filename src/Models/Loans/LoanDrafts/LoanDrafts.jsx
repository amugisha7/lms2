import React from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { UserContext } from "../../../App";
import CollectionsTemplate from "../../../ModelAssets/CollectionsTemplate";
import ClickableText from "../../../ModelAssets/ClickableText";
import NotificationBar from "../../../ModelAssets/NotificationBar";
import PlusButtonMain from "../../../ModelAssets/PlusButtonMain";
import { formatMoney, formatMoneyParts } from "../../../Resources/formatting";
import { useTheme } from "@mui/material/styles";
import {
  listLoanDraftsByBranch,
  listLoanDraftsByInstitution,
} from "./loanDraftHelpers";

export default function LoanDrafts() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { userDetails } = React.useContext(UserContext);
  const [loading, setLoading] = React.useState(true);
  const [rows, setRows] = React.useState([]);
  const [notification, setNotification] = React.useState(null);
  const [selectedTab, setSelectedTab] = React.useState("all");

  const refresh = React.useCallback(async () => {
    setLoading(true);
    try {
      const branchID = userDetails?.branchUsersId || null;
      const institutionID = userDetails?.institutionUsersId || null;
      const isAdmin = userDetails?.userType === "Admin";

      if (!branchID && !institutionID) {
        setRows([]);
        setNotification({
          type: "error",
          message: "Missing institution/branch context for drafts.",
        });
        return;
      }

      // Fetch drafts based on user type:
      // - Admin: fetch from all branches in the institution
      // - Non-admin: fetch from the user's branch
      let drafts = [];
      if (isAdmin && institutionID) {
        drafts = await listLoanDraftsByInstitution({ institutionID });
      } else if (branchID) {
        drafts = await listLoanDraftsByBranch({ branchID });
      }

      console.log("Fetched loan drafts:", drafts);
      setRows(Array.isArray(drafts) ? drafts : []);
    } catch (err) {
      console.error("Failed to load drafts:", err);
      setRows([]);
      setNotification({
        type: "error",
        message: err?.message || "Failed to load drafts",
      });
    } finally {
      setLoading(false);
    }
  }, [
    userDetails?.branchUsersId,
    userDetails?.institutionUsersId,
    userDetails?.userType,
  ]);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const filteredRows = React.useMemo(() => {
    if (selectedTab === "all") return rows;
    if (selectedTab === "in_review") {
      return rows.filter((r) => {
        const status = (r.status || "").toLowerCase();
        return status === "in review" || status === "sent_for_approval";
      });
    }
    if (selectedTab === "drafts") {
      return rows.filter((r) => {
        const status = (r.status || "").toLowerCase();
        return !r.status || status === "draft";
      });
    }
    if (selectedTab === "rejected") {
      return rows.filter((r) => {
        const status = (r.status || "").toLowerCase();
        return status === "rejected";
      });
    }
    return rows;
  }, [rows, selectedTab]);

  const borrowerName = React.useCallback((borrowerID, borrower) => {
    // If borrower object is passed directly (nested from query), use it
    const b = borrower || null;
    if (!b) return borrowerID || "";
    const fullName = [b.firstname, b.othername].filter(Boolean).join(" ");
    return fullName
      ? `${fullName}${b.businessName ? ` (${b.businessName})` : ""}`
      : b.businessName || "Unnamed Borrower";
  }, []);

  const isPrivileged =
    userDetails?.role === "admin" || userDetails?.role === "branch_manager";

  const onEdit = React.useCallback(
    (rowOrId) => {
      const id = rowOrId?.id || rowOrId;
      const row =
        typeof rowOrId === "object"
          ? rowOrId
          : rows.find((r) => r.id === rowOrId);

      if (!isPrivileged && row?.status === "SENT_FOR_APPROVAL") {
        setNotification({
          type: "warning",
          message:
            "This draft is currently under review and cannot be edited. Please wait for admin approval.",
        });
        return;
      }

      navigate(`/loan-drafts/id/${id}/view`);
    },
    [navigate, isPrivileged, rows],
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
          <ClickableText onClick={() => onEdit(params.row)}>
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
        valueGetter: (value, row) =>
          borrowerName(row?.borrowerID || value, row?.borrower),
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
    <Box>
      {notification && (
        <NotificationBar
          notification={notification}
          clearNotification={() => setNotification(null)}
        />
      )}

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Loan Drafts
        </Typography>
        <PlusButtonMain
          onClick={() => navigate("/add-loan")}
          buttonText="NEW LOAN"
        />
      </Box>

      {/* Tabs */}
      <Box sx={{ width: "100%", mb: 2 }}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: theme.palette.divider,
            backgroundColor: theme.palette.background.paper,
            borderRadius: "8px 8px 0 0",
          }}
        >
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            aria-label="loan drafts filter tabs"
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
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
                "&:hover": {
                  color: theme.palette.blueText.main,
                },
                "&.Mui-selected": {
                  color: theme.palette.blueText.main,
                  fontWeight: 600,
                },
                "&.Mui-focusVisible": {
                  backgroundColor: theme.palette.action.focus,
                },
              },
              "& .MuiTabs-flexContainer": {
                gap: 1,
              },
            }}
          >
            <Tab label="All" value="all" />
            <Tab label="Drafts" value="drafts" />
            <Tab label="In Review" value="in_review" />
            <Tab label="Rejected" value="rejected" />
          </Tabs>
        </Box>
      </Box>

      {/* Data Grid */}
      <CollectionsTemplate
        items={filteredRows}
        loading={loading}
        columns={columns}
        enableSearch={false}
        noDataMessage="No loan drafts found."
      />
    </Box>
  );
}
