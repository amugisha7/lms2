/**
 * Cash Ledger — /reports/cash-ledger
 *
 * Shows every cash movement across all accounts linked to the active branch.
 * Accounts appear as columns; the last column is the cumulative running balance
 * across all accounts. Supports date-range, search, and transaction-type filters.
 */

import React from "react";
import {
  Alert,
  Box,
  Chip,
  IconButton,
  InputAdornment,
  LinearProgress,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import { UserContext } from "../../App";
import PlusButtonMain from "../../ModelAssets/PlusButtonMain";
import { downloadFile } from "./reportUtils";
import {
  TX_TYPES,
  TX_TYPE_LABELS,
  TX_TYPE_PILL,
  buildLedgerRows,
  fetchLedgerData,
} from "./cashLedgerHelpers";

// ─── Constants ────────────────────────────────────────────────────────────────

// All filterable types (exclude the synthetic opening-balance row)
const ALL_TYPES = Object.values(TX_TYPES).filter(
  (t) => t !== TX_TYPES.OPENING_BALANCE,
);

const MAX_DISPLAY = 1000;

// Sticky column pixel offsets
const W_DATE = 95;
const W_TYPE = 135;
const W_DESC = 220;
const W_ACCT = 130;
const W_BAL = 148;

// ─── Formatting helpers ───────────────────────────────────────────────────────

const fmt = (n) =>
  Number.isFinite(n) && n !== 0
    ? Math.abs(n).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "";

const fmtAccounting = (amount, direction) => {
  const s = fmt(amount);
  if (!s) return "";
  return direction === "debit" ? `(${s})` : s;
};

const fmtBalance = (n) => {
  const num = Number(n);
  if (!Number.isFinite(num)) return "—";
  const s = Math.abs(num).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return num < 0 ? `(${s})` : s;
};

// ─── TypePill ─────────────────────────────────────────────────────────────────

function TypePill({ typeKey, sf }) {
  const pill = TX_TYPE_PILL[typeKey] || {
    bg: "sf_pillNeutralBg",
    text: "sf_pillNeutralText",
  };
  return (
    <Box
      sx={{
        display: "inline-block",
        px: 0.75,
        py: 0.2,
        borderRadius: "2px",
        bgcolor: sf[pill.bg],
        color: sf[pill.text],
        fontSize: "0.66rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        whiteSpace: "nowrap",
        lineHeight: 1.6,
      }}
    >
      {TX_TYPE_LABELS[typeKey] || typeKey}
    </Box>
  );
}

// ─── CashLedger ──────────────────────────────────────────────────────────────

export default function CashLedger() {
  const { userDetails } = React.useContext(UserContext);
  const theme = useTheme();
  const sf = theme.palette.sf;

  const activeBranchId =
    userDetails?.branchID || userDetails?.branch?.id || null;

  // ── Data state ──
  const [accounts, setAccounts] = React.useState([]);
  const [allRows, setAllRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  // ── Filter state ──
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [selectedTypes, setSelectedTypes] = React.useState(
    new Set(ALL_TYPES),
  );

  // ── Load ──────────────────────────────────────────────────────────────────
  const load = React.useCallback(async () => {
    if (!activeBranchId) return;
    setLoading(true);
    setError("");
    try {
      const { accounts: accts, expenses, otherIncomes } =
        await fetchLedgerData(activeBranchId);
      setAccounts(accts);
      setAllRows(buildLedgerRows(accts, expenses, otherIncomes));
    } catch (err) {
      setError(err?.message || "Failed to load ledger data.");
    } finally {
      setLoading(false);
    }
  }, [activeBranchId]);

  React.useEffect(() => {
    load();
  }, [load]);

  // ── Filter computation ────────────────────────────────────────────────────
  const filteredRows = React.useMemo(() => {
    return allRows.filter((row) => {
      // Opening balance row always visible regardless of filters
      if (row.isOpeningBalance) return true;

      // Type filter
      if (!selectedTypes.has(row.typeKey)) return false;

      // Date range
      if (startDate && row.date) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (row.date < start) return false;
      }
      if (endDate && row.date) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (row.date > end) return false;
      }

      // Search (type label, description, account name)
      if (search) {
        const q = search.toLowerCase();
        if (
          !row.type?.toLowerCase().includes(q) &&
          !row.description?.toLowerCase().includes(q) &&
          !row.accountName?.toLowerCase().includes(q)
        )
          return false;
      }

      return true;
    });
  }, [allRows, startDate, endDate, search, selectedTypes]);

  const displayRows = filteredRows.slice(0, MAX_DISPLAY);
  const isTruncated = filteredRows.length > MAX_DISPLAY;
  const hasFilters =
    startDate ||
    endDate ||
    search ||
    selectedTypes.size < ALL_TYPES.length;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setSearch("");
    setSelectedTypes(new Set(ALL_TYPES));
  };

  const handleTypeChange = (e) => {
    setSelectedTypes(new Set(e.target.value));
  };

  const handleExport = () => {
    const headers = [
      "Date",
      "Type",
      "Description",
      ...accounts.map((a) => a.name),
      "Running Balance",
    ];
    const csvRows = filteredRows.map((row) => {
      const acctCols = accounts.map((account) => {
        if (row.isOpeningBalance) {
          return row.openingByAccount?.[account.id] ?? "";
        }
        if (row.accountId !== account.id) return "";
        return row.direction === "credit" ? row.amount : -row.amount;
      });
      return [
        row.dateDisplay,
        row.type,
        row.description,
        ...acctCols,
        row.runningBalance ?? "",
      ];
    });
    const csv = [headers, ...csvRows]
      .map((r) => r.map((v) => JSON.stringify(v ?? "")).join(","))
      .join("\n");
    downloadFile(csv, "cash-ledger.csv");
  };

  // ── Shared cell styles ────────────────────────────────────────────────────
  const cellBase = {
    fontSize: "0.78rem",
    py: 0.75,
    px: 1.5,
    borderBottom: `1px solid ${sf.sf_tableBorder}`,
    whiteSpace: "nowrap",
    color: sf.sf_textPrimary,
  };

  const headBase = {
    ...cellBase,
    fontWeight: 700,
    fontSize: "0.70rem",
    bgcolor: sf.sf_tableHeaderBg,
    color: sf.sf_tableHeaderText,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: `2px solid ${sf.sf_tableBorder}`,
    top: 0,
    zIndex: 2,
  };

  const stickyLeft = (left, zIndex = 1, bg = sf.sf_cardBg) => ({
    position: "sticky",
    left,
    zIndex,
    bgcolor: bg,
  });

  const stickyRight = (zIndex = 1, bg = sf.sf_cardBg) => ({
    position: "sticky",
    right: 0,
    zIndex,
    bgcolor: bg,
  });

  // ── No branch guard ───────────────────────────────────────────────────────
  if (!activeBranchId) {
    return (
      <Box sx={{ py: 6, textAlign: "center" }}>
        <Typography color="text.secondary" variant="body2">
          No branch loaded. Use Change Branch from the top bar.
        </Typography>
      </Box>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Box>
      {/* ── Page header ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Cash Ledger
        </Typography>
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
          <Tooltip title="Refresh data">
            <span>
              <IconButton onClick={load} disabled={loading} size="small">
                <RefreshIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <PlusButtonMain
            onClick={handleExport}
            buttonText="EXPORT CSV"
            disabled={loading || allRows.length === 0}
          />
        </Box>
      </Box>

      {/* ── Filter bar ── */}
      <Box
        sx={{
          bgcolor: sf.sf_cardBg,
          border: `1px solid ${sf.sf_borderLight}`,
          borderLeft: `3px solid ${sf.sf_brandPrimary}`,
          p: 1.5,
          mb: 2,
          display: "flex",
          flexWrap: "wrap",
          gap: 1.5,
          alignItems: "center",
        }}
      >
        <TextField
          label="From"
          type="date"
          size="small"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ width: 155 }}
        />
        <TextField
          label="To"
          type="date"
          size="small"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ width: 155 }}
        />
        <TextField
          placeholder="Search description, type, account…"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 17, color: sf.sf_textTertiary }} />
              </InputAdornment>
            ),
          }}
          sx={{ width: 260 }}
        />

        {/* Transaction type multi-select */}
        <Select
          multiple
          size="small"
          value={Array.from(selectedTypes)}
          onChange={handleTypeChange}
          input={<OutlinedInput size="small" />}
          displayEmpty
          renderValue={(selected) => {
            if (selected.length === ALL_TYPES.length) return "All Types";
            if (selected.length === 0) return "No Types";
            return `${selected.length} of ${ALL_TYPES.length} Types`;
          }}
          sx={{ minWidth: 170 }}
          MenuProps={{ PaperProps: { sx: { maxHeight: 380 } } }}
        >
          {/* Select All / Clear All shortcut */}
          <MenuItem
            dense
            onMouseDown={(e) => {
              e.preventDefault();
              if (selectedTypes.size === ALL_TYPES.length) {
                setSelectedTypes(new Set());
              } else {
                setSelectedTypes(new Set(ALL_TYPES));
              }
            }}
            sx={{ borderBottom: `1px solid ${sf.sf_borderLight}`, mb: 0.5 }}
          >
            <Typography
              sx={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: sf.sf_brandPrimary,
              }}
            >
              {selectedTypes.size === ALL_TYPES.length
                ? "Clear All"
                : "Select All"}
            </Typography>
          </MenuItem>

          {ALL_TYPES.map((typeKey) => (
            <MenuItem key={typeKey} value={typeKey} dense>
              <ListItemText
                primary={TX_TYPE_LABELS[typeKey]}
                primaryTypographyProps={{ fontSize: "0.8rem" }}
              />
            </MenuItem>
          ))}
        </Select>

        {hasFilters && (
          <Box
            component="span"
            onClick={clearFilters}
            sx={{
              fontSize: "0.76rem",
              color: sf.sf_brandPrimary,
              cursor: "pointer",
              textDecoration: "underline",
              userSelect: "none",
            }}
          >
            Clear Filters
          </Box>
        )}
      </Box>

      {/* ── Error ── */}
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 0 }}>
          {error}
        </Alert>
      )}

      {/* ── Loading bar ── */}
      {loading && <LinearProgress sx={{ mb: 1 }} />}

      {/* ── Truncation warning ── */}
      {isTruncated && (
        <Alert severity="warning" sx={{ mb: 1, borderRadius: 0 }}>
          Showing first {MAX_DISPLAY.toLocaleString()} of{" "}
          {filteredRows.length.toLocaleString()} rows. Narrow the date range to
          see all transactions.
        </Alert>
      )}

      {/* ── Row count summary ── */}
      {!loading && allRows.length > 0 && (
        <Typography
          sx={{ fontSize: "0.76rem", color: sf.sf_textTertiary, mb: 0.75 }}
        >
          {(filteredRows.length - 1).toLocaleString()} transaction
          {filteredRows.length - 1 !== 1 ? "s" : ""}
          {accounts.length > 0 &&
            ` · ${accounts.length} account${accounts.length !== 1 ? "s" : ""}`}
          {hasFilters && " (filtered)"}
        </Typography>
      )}

      {/* ── Table ── */}
      <TableContainer
        sx={{
          border: `1px solid ${sf.sf_tableBorder}`,
          bgcolor: sf.sf_cardBg,
          overflowX: "auto",
          maxHeight: "calc(100vh - 360px)",
          minHeight: 200,
        }}
      >
        <Table stickyHeader size="small">
          {/* ── Header ── */}
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  ...headBase,
                  ...stickyLeft(0, 4, sf.sf_tableHeaderBg),
                  width: W_DATE,
                  minWidth: W_DATE,
                }}
              >
                Date
              </TableCell>
              <TableCell
                sx={{
                  ...headBase,
                  ...stickyLeft(W_DATE, 4, sf.sf_tableHeaderBg),
                  width: W_TYPE,
                  minWidth: W_TYPE,
                }}
              >
                Type
              </TableCell>
              <TableCell
                sx={{
                  ...headBase,
                  ...stickyLeft(W_DATE + W_TYPE, 4, sf.sf_tableHeaderBg),
                  width: W_DESC,
                  minWidth: W_DESC,
                  whiteSpace: "normal",
                }}
              >
                Description
              </TableCell>
              {accounts.map((account) => (
                <TableCell
                  key={account.id}
                  sx={{
                    ...headBase,
                    width: W_ACCT,
                    minWidth: W_ACCT,
                    textAlign: "right",
                  }}
                >
                  <Tooltip title={account.accountType || ""} placement="top">
                    <span>{account.name}</span>
                  </Tooltip>
                </TableCell>
              ))}
              <TableCell
                sx={{
                  ...headBase,
                  ...stickyRight(4, sf.sf_tableHeaderBg),
                  width: W_BAL,
                  minWidth: W_BAL,
                  textAlign: "right",
                }}
              >
                Running Balance
              </TableCell>
            </TableRow>
          </TableHead>

          {/* ── Body ── */}
          <TableBody>
            {displayRows.length === 0 && !loading && (
              <TableRow>
                <TableCell
                  colSpan={3 + accounts.length + 1}
                  sx={{
                    ...cellBase,
                    textAlign: "center",
                    color: sf.sf_textTertiary,
                    py: 4,
                  }}
                >
                  No transactions match your filters.
                </TableCell>
              </TableRow>
            )}

            {displayRows.map((row, idx) => {
              const isOB = row.isOpeningBalance;
              // Alternate row background; opening-balance row gets info tint
              const rowBg = isOB
                ? sf.sf_infoBg
                : idx % 2 === 0
                  ? sf.sf_cardBg
                  : sf.sf_rowStripeBg;

              const balAmt = row.runningBalance ?? 0;
              const balColor =
                balAmt < 0 ? sf.sf_error : sf.sf_textPrimary;

              return (
                <TableRow
                  key={row.id}
                  sx={{
                    bgcolor: rowBg,
                    "&:hover": { bgcolor: sf.sf_rowHover },
                  }}
                >
                  {/* Date */}
                  <TableCell
                    sx={{
                      ...cellBase,
                      ...stickyLeft(0, 2, rowBg),
                      fontWeight: isOB ? 700 : 400,
                      color: isOB ? sf.sf_info : sf.sf_textPrimary,
                    }}
                  >
                    {row.dateDisplay}
                  </TableCell>

                  {/* Type pill */}
                  <TableCell
                    sx={{ ...cellBase, ...stickyLeft(W_DATE, 2, rowBg) }}
                  >
                    <TypePill typeKey={row.typeKey} sf={sf} />
                  </TableCell>

                  {/* Description */}
                  <TableCell
                    sx={{
                      ...cellBase,
                      ...stickyLeft(W_DATE + W_TYPE, 2, rowBg),
                      whiteSpace: "normal",
                      maxWidth: W_DESC,
                      color: sf.sf_textSecondary,
                      fontStyle: isOB ? "italic" : "normal",
                    }}
                  >
                    {row.description || "—"}
                  </TableCell>

                  {/* Per-account columns */}
                  {accounts.map((account) => {
                    // Opening balance row: show each account's opening balance
                    if (isOB) {
                      const obAmt = row.openingByAccount?.[account.id] ?? 0;
                      return (
                        <TableCell
                          key={account.id}
                          sx={{
                            ...cellBase,
                            textAlign: "right",
                            fontWeight: 600,
                            color: sf.sf_textSecondary,
                          }}
                        >
                          {obAmt !== 0 ? fmt(obAmt) : ""}
                        </TableCell>
                      );
                    }

                    // Normal row: only fill the matched account's column
                    if (row.accountId !== account.id) {
                      return (
                        <TableCell
                          key={account.id}
                          sx={{ ...cellBase, textAlign: "right" }}
                        />
                      );
                    }

                    return (
                      <TableCell
                        key={account.id}
                        sx={{
                          ...cellBase,
                          textAlign: "right",
                          fontWeight: 600,
                          color:
                            row.direction === "credit"
                              ? sf.sf_success
                              : sf.sf_error,
                        }}
                      >
                        {fmtAccounting(row.amount, row.direction)}
                      </TableCell>
                    );
                  })}

                  {/* Running balance */}
                  <TableCell
                    sx={{
                      ...cellBase,
                      ...stickyRight(2, rowBg),
                      textAlign: "right",
                      fontWeight: 700,
                      color: balColor,
                    }}
                  >
                    {fmtBalance(balAmt)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ── Footer note ── */}
      {!loading && allRows.length > 0 && (
        <Typography
          sx={{ fontSize: "0.72rem", color: sf.sf_textTertiary, mt: 1 }}
        >
          Running balance reflects all transactions across all accounts in the
          active branch. Credits shown in green, debits in red (parentheses).
        </Typography>
      )}
    </Box>
  );
}
