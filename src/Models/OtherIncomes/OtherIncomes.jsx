import React from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  InputBase,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { generateClient } from "aws-amplify/api";
import dayjs from "dayjs";

import { UserContext } from "../../App";
import PlusButtonMain from "../../ModelAssets/PlusButtonMain";
import DateFilters from "../../ModelAssets/DateFilters";
import SFClickableText from "../../ModelAssets/SF_ClickableText";
import CustomDataGrid from "../../ModelAssets/CustomDataGrid";
import { useNotification } from "../../ModelAssets/NotificationContext";
import { formatMoneyParts } from "../../Resources/formatting";
import { downloadFile, toCsv } from "../../Screens/Reports/reportUtils";

import OtherIncomeFormDialog from "./OtherIncomeFormDialog";
import {
  DELETE_OTHER_INCOME_MUTATION,
  parseOtherIncomeCustomDetails,
} from "./otherIncomeQueries";

const fmtDate = (value) => {
  if (!value) return "N/A";
  const d = dayjs(value);
  return d.isValid() ? d.format("DD-MMM-YY") : value;
};

const fmtMoneyDisplay = (value, currency, currencyCode) => {
  if (value == null || isNaN(value)) return "N/A";
  const parts = formatMoneyParts(value, currency, currencyCode);
  return `${parts.prefix || ""}${parts.number || "N/A"}`;
};

const formatCsvMoney = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num.toFixed(2) : "0.00";
};

const OTHER_INCOMES_QUERY = `
  query OtherIncomesByBranchID(
    $branchID: ID!
    $limit: Int
    $nextToken: String
  ) {
    otherIncomesByBranchID(branchID: $branchID, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        amount
        incomeDate
        incomeType
        status
        branchID
        customOtherIncomeDetails
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

const fetchAllOtherIncomes = async (branchId) => {
  if (!branchId) return [];
  const client = generateClient();
  const items = [];
  let nextToken = null;
  do {
    const result = await client.graphql({
      query: OTHER_INCOMES_QUERY,
      variables: { branchID: branchId, limit: 1000, nextToken },
    });
    const page = result?.data?.otherIncomesByBranchID || {};
    items.push(...(page.items || []).filter(Boolean));
    nextToken = page.nextToken || null;
  } while (nextToken);
  return items;
};

const getAccountLabel = (item) =>
  parseOtherIncomeCustomDetails(item?.customOtherIncomeDetails)
    ?.accountSnapshot?.name || "";

const getEmployeeLabel = (item) => {
  const snapshot = parseOtherIncomeCustomDetails(
    item?.customOtherIncomeDetails,
  )?.employeeSnapshot;
  if (!snapshot) return "";
  const fullName = [snapshot.firstName, snapshot.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  return fullName || snapshot.email || "";
};

export default function OtherIncomes() {
  const { userDetails } = React.useContext(UserContext);
  const { showNotification } = useNotification();
  const theme = useTheme();
  const sf = theme.palette.sf;

  const activeBranchId =
    userDetails?.branchID || userDetails?.branch?.id || null;
  const shouldShow = Boolean(activeBranchId);
  const currencyCode =
    userDetails?.institution?.currencyCode || userDetails?.currencyCode || "";
  const currency = currencyCode || "$";

  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");
  const [showDateFilters, setShowDateFilters] = React.useState(false);
  const [formDialogOpen, setFormDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState(null);
  const [deleteTarget, setDeleteTarget] = React.useState(null);
  const [deleting, setDeleting] = React.useState(false);

  const load = React.useCallback(async () => {
    if (!activeBranchId) return;
    setLoading(true);
    setError("");
    try {
      const fetched = await fetchAllOtherIncomes(activeBranchId);
      setItems(fetched);
    } catch (err) {
      console.error("Failed to load other incomes:", err);
      setError("Failed to load other incomes.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [activeBranchId]);

  React.useEffect(() => {
    load();
  }, [load]);

  const filteredItems = React.useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return items.filter((item) => {
      if (dateFrom) {
        const d = dayjs(item.incomeDate);
        if (d.isValid() && d.isBefore(dayjs(dateFrom).startOf("day"))) {
          return false;
        }
      }
      if (dateTo) {
        const d = dayjs(item.incomeDate);
        if (d.isValid() && d.isAfter(dayjs(dateTo).endOf("day"))) return false;
      }
      if (!q) return true;
      const searchable = [
        item.name,
        item.description,
        item.incomeType,
        getAccountLabel(item),
        getEmployeeLabel(item),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return searchable.includes(q);
    });
  }, [items, searchTerm, dateFrom, dateTo]);

  const totalAmount = filteredItems.reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0,
  );

  const handleNew = () => {
    setEditingItem(null);
    setFormDialogOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormDialogOpen(true);
  };

  const handleSaved = (saved) => {
    if (!saved) return;
    setItems((current) => {
      const existingIndex = current.findIndex((i) => i.id === saved.id);
      if (existingIndex >= 0) {
        const next = current.slice();
        next[existingIndex] = { ...current[existingIndex], ...saved };
        return next;
      }
      return [saved, ...current];
    });
    showNotification(
      editingItem ? "Other income updated." : "Other income recorded.",
      "green",
    );
  };

  const handleDelete = async () => {
    if (!deleteTarget?.id) return;
    setDeleting(true);
    try {
      const client = generateClient();
      await client.graphql({
        query: DELETE_OTHER_INCOME_MUTATION,
        variables: { input: { id: deleteTarget.id } },
      });
      setItems((current) => current.filter((i) => i.id !== deleteTarget.id));
      showNotification("Other income deleted.", "green");
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete other income failed:", err);
      showNotification(err?.message || "Failed to delete.", "red");
    } finally {
      setDeleting(false);
    }
  };

  const handleExportCsv = () => {
    if (!filteredItems.length) {
      showNotification("No other income available to export.", "red");
      return;
    }
    const rows = filteredItems.map((item) => ({
      incomeDate: fmtDate(item.incomeDate),
      incomeType: item.incomeType || "",
      amount: formatCsvMoney(item.amount),
      account: getAccountLabel(item),
      recordedBy: getEmployeeLabel(item),
      name: item.name || "",
      description: item.description || "",
    }));
    const csv = toCsv(rows, [
      { key: "incomeDate", label: "Date" },
      { key: "incomeType", label: "Category" },
      { key: "amount", label: "Amount" },
      { key: "account", label: "Account" },
      { key: "recordedBy", label: "Recorded By" },
      { key: "name", label: "Name / Source" },
      { key: "description", label: "Description" },
    ]);
    downloadFile(
      csv,
      `other_incomes_${dayjs().format("YYYY-MM-DD")}.csv`,
      "text/csv",
    );
  };

  const columns = React.useMemo(
    () => [
      {
        field: "incomeDate",
        headerName: "Date",
        flex: 0.7,
        minWidth: 110,
        valueGetter: (value, row) =>
          row.incomeDate ? dayjs(row.incomeDate).valueOf() : 0,
        renderCell: (params) => (
          <Typography sx={{ fontSize: "0.82rem", fontWeight: 600 }}>
            {fmtDate(params.row.incomeDate)}
          </Typography>
        ),
      },
      {
        field: "incomeType",
        headerName: "Category",
        flex: 1,
        minWidth: 160,
        renderCell: (params) => (
          <Typography sx={{ fontSize: "0.82rem", fontWeight: 600 }}>
            {params.row.incomeType || "Uncategorized"}
          </Typography>
        ),
      },
      {
        field: "amount",
        headerName: "Amount",
        flex: 0.8,
        minWidth: 130,
        type: "number",
        renderCell: (params) => (
          <Typography
            sx={{ fontSize: "0.82rem", fontWeight: 700, color: sf.sf_success }}
          >
            {fmtMoneyDisplay(params.row.amount, currency, currencyCode)}
          </Typography>
        ),
      },
      {
        field: "account",
        headerName: "Account",
        flex: 0.9,
        minWidth: 140,
        valueGetter: (value, row) => getAccountLabel(row),
        renderCell: (params) => (
          <Typography sx={{ fontSize: "0.82rem" }}>
            {getAccountLabel(params.row) || "—"}
          </Typography>
        ),
      },
      {
        field: "recordedBy",
        headerName: "Recorded By",
        flex: 1,
        minWidth: 150,
        valueGetter: (value, row) => getEmployeeLabel(row),
        renderCell: (params) => (
          <Typography sx={{ fontSize: "0.82rem" }}>
            {getEmployeeLabel(params.row) || "—"}
          </Typography>
        ),
      },
      {
        field: "name",
        headerName: "Name / Source",
        flex: 1,
        minWidth: 140,
      },
      {
        field: "description",
        headerName: "Description",
        flex: 1.5,
        minWidth: 200,
        sortable: false,
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: 0.9,
        minWidth: 140,
        sortable: false,
        renderCell: (params) => (
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            <SFClickableText
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(params.row);
              }}
            >
              Edit
            </SFClickableText>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteTarget(params.row);
                }}
                sx={{ color: sf.sf_error, p: 0.3 }}
              >
                <DeleteOutlineIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [currency, currencyCode, sf],
  );

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          mb: "20px",
          pb: "12px",
          borderBottom: `3px solid ${sf.sf_brandPrimary}`,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "1.35rem",
              fontWeight: 700,
              color: sf.sf_textPrimary,
              letterSpacing: "-0.01em",
            }}
          >
            Other Income
          </Typography>
          <Typography
            sx={{ fontSize: "0.75rem", color: sf.sf_textTertiary, mt: 0.15 }}
          >
            {loading
              ? "Loading..."
              : `${items.length} loaded · ${filteredItems.length} shown`}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PlusButtonMain
            buttonText="NEW INCOME"
            onClick={handleNew}
            disabled={!shouldShow}
          />
          <PlusButtonMain buttonText="EXPORT" onClick={handleExportCsv} />
          <Tooltip title="Refresh data" placement="top">
            <span>
              <IconButton
                onClick={load}
                disabled={loading}
                sx={{
                  color: sf.sf_brandPrimary,
                  border: `1px solid ${sf.sf_borderLight}`,
                  borderRadius: 0,
                  p: 0.7,
                  "&:hover": { bgcolor: sf.sf_actionHoverBg },
                }}
              >
                <RefreshIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>

      {!shouldShow && (
        <Box sx={{ p: 2, mb: 2, bgcolor: "info.light" }}>
          <Typography variant="body2">
            No active branch is loaded. Use Change Branch from the top bar.
          </Typography>
        </Box>
      )}

      {shouldShow && error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 0 }}>
          {error}
        </Alert>
      )}

      {shouldShow && (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              mb: "10px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: sf.sf_searchBg,
                border: `1px solid ${sf.sf_searchBorder}`,
                px: 1.2,
                py: 0.4,
                "&:focus-within": { borderColor: sf.sf_searchFocusBorder },
              }}
            >
              <InputBase
                placeholder="Search description, source, category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ flex: 1, fontSize: "0.8rem", color: sf.sf_textPrimary }}
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{ fontSize: 18, color: sf.sf_textTertiary }}
                    />
                  </InputAdornment>
                }
                endAdornment={
                  searchTerm ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setSearchTerm("")}
                        sx={{ color: sf.sf_textTertiary }}
                      >
                        <CancelIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }
              />
            </Box>

            {!showDateFilters && (
              <SFClickableText onClick={() => setShowDateFilters(true)}>
                Filter by Date
              </SFClickableText>
            )}

            {showDateFilters && (
              <Box
                sx={{
                  p: 1.5,
                  border: `1px solid ${sf.sf_borderLight}`,
                  bgcolor: sf.sf_cardBg,
                  boxShadow: sf.sf_shadowSm,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: sf.sf_textSecondary,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Date Filter
                  </Typography>
                  <SFClickableText
                    onClick={() => {
                      setDateFrom("");
                      setDateTo("");
                      setShowDateFilters(false);
                    }}
                  >
                    Clear Date Filter
                  </SFClickableText>
                </Box>
                <DateFilters
                  dateFrom={dateFrom}
                  dateTo={dateTo}
                  onDateFromChange={setDateFrom}
                  onDateToChange={setDateTo}
                  alwaysVisible
                  allowClear={false}
                />
              </Box>
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
            {[
              { label: "Entries", value: filteredItems.length },
              {
                label: "Total Amount",
                value: fmtMoneyDisplay(totalAmount, currency, currencyCode),
              },
            ].map((kpi) => (
              <Box key={kpi.label} sx={{ flex: "1 1 170px", minWidth: 170 }}>
                <Typography
                  sx={{
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    color: sf.sf_textTertiary,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {kpi.label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    color: sf.sf_textPrimary,
                  }}
                >
                  {kpi.value}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ boxShadow: sf.sf_shadowSm }}>
            <CustomDataGrid
              rows={filteredItems}
              columns={columns}
              loading={loading}
              getRowId={(row) => row.id}
              pageSize={50}
              pageSizeOptions={[25, 50, 100]}
              showToolbar={false}
              sx={{
                borderRadius: 0,
                "& .MuiDataGrid-cell": { fontSize: "0.82rem" },
              }}
            />
          </Box>
        </>
      )}

      <OtherIncomeFormDialog
        open={formDialogOpen}
        onClose={() => setFormDialogOpen(false)}
        onSaved={handleSaved}
        branchId={activeBranchId}
        userDetails={userDetails}
        initialItem={editingItem}
      />

      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => !deleting && setDeleteTarget(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 0 } }}
      >
        <DialogTitle>Delete Other Income</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: "0.85rem" }}>
            {deleteTarget?.name ||
              deleteTarget?.incomeType ||
              "This entry"}{" "}
            will be permanently deleted. This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={deleting}
            color="error"
            variant="contained"
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
