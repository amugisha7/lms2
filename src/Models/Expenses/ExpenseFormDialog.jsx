import React from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { generateClient } from "aws-amplify/api";

import {
  CREATE_EXPENSE_MUTATION,
  UPDATE_EXPENSE_MUTATION,
} from "./expenseQueries";
import { EXPENSE_CATEGORIES } from "./expenseCategories";
import { fetchBranchLinkedAccounts } from "./branchAccountingHelpers";
import {
  getEmployeeOptionLabel,
  listEmployeesByBranch,
  resolveEmployeeIdForUser,
} from "../Employees/employeeHelpers";

const toAmount = (raw) => {
  const cleaned = String(raw ?? "").replace(/,/g, "").trim();
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : null;
};

const todayIso = () => new Date().toISOString().slice(0, 10);

const buildInitialForm = (initialExpense) => ({
  accountId:
    initialExpense?.accountExpensesId || initialExpense?.account?.id || "",
  employeeId: initialExpense?.createdByEmployeeID || "",
  transactionDate: initialExpense?.transactionDate || todayIso(),
  amount: initialExpense?.amount != null ? String(initialExpense.amount) : "",
  category: initialExpense?.category || EXPENSE_CATEGORIES[0],
  payee: initialExpense?.payee || "",
  description: initialExpense?.description || "",
  referenceNumber: initialExpense?.referenceNumber || "",
  paymentMethod: initialExpense?.paymentMethod || "",
  notes: initialExpense?.notes || "",
});

export default function ExpenseFormDialog({
  open,
  onClose,
  onSaved,
  branchId,
  userDetails,
  initialExpense = null,
}) {
  const theme = useTheme();
  const sf = theme.palette.sf;
  const isEdit = Boolean(initialExpense?.id);

  const [form, setForm] = React.useState(() => buildInitialForm(initialExpense));
  const [accounts, setAccounts] = React.useState([]);
  const [employees, setEmployees] = React.useState([]);
  const [optionsLoading, setOptionsLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  // Load accounts + employees + resolve default employee whenever the dialog
  // opens for a given branch. Same gating model as Use-Loan-Product on /add-loan.
  React.useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;

    setError("");
    setForm(buildInitialForm(initialExpense));
    setOptionsLoading(true);

    (async () => {
      try {
        const [loadedAccounts, loadedEmployees, defaultEmployeeId] =
          await Promise.all([
            branchId ? fetchBranchLinkedAccounts(branchId) : [],
            branchId ? listEmployeesByBranch(branchId) : [],
            branchId
              ? resolveEmployeeIdForUser({
                  userDetails,
                  branchId,
                  preferredEmployeeId: initialExpense?.createdByEmployeeID,
                })
              : null,
          ]);

        if (cancelled) return;
        setAccounts(loadedAccounts);
        setEmployees(loadedEmployees);
        setForm((current) => ({
          ...current,
          employeeId: current.employeeId || defaultEmployeeId || "",
        }));
      } catch (err) {
        console.error("[ExpenseFormDialog] failed to load options:", err);
        if (!cancelled) {
          setAccounts([]);
          setEmployees([]);
          setError("Failed to load accounts or employees for this branch.");
        }
      } finally {
        if (!cancelled) setOptionsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [branchId, initialExpense, open, userDetails]);

  const update = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const gatingReady = Boolean(form.accountId && form.employeeId);

  const validate = () => {
    if (!branchId && !isEdit) return "No active branch is loaded.";
    if (!form.accountId) return "Select an account first.";
    if (!form.employeeId) return "Select an employee first.";
    if (!form.transactionDate) return "Date is required.";
    const amount = toAmount(form.amount);
    if (amount == null || amount <= 0) {
      return "Amount must be a positive number.";
    }
    if (!form.category) return "Category is required.";
    return null;
  };

  const handleSave = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError("");
    try {
      const client = generateClient();
      const amount = toAmount(form.amount);
      const baseInput = {
        transactionDate: form.transactionDate,
        amount,
        category: form.category,
        payee: form.payee.trim() || null,
        description: form.description.trim() || null,
        referenceNumber: form.referenceNumber.trim() || null,
        paymentMethod: form.paymentMethod.trim() || null,
        notes: form.notes.trim() || null,
        status: "active",
        accountExpensesId: form.accountId,
        createdByEmployeeID: form.employeeId,
      };

      let result;
      if (isEdit) {
        result = await client.graphql({
          query: UPDATE_EXPENSE_MUTATION,
          variables: { input: { id: initialExpense.id, ...baseInput } },
        });
        onSaved?.(result?.data?.updateExpense);
      } else {
        result = await client.graphql({
          query: CREATE_EXPENSE_MUTATION,
          variables: { input: { ...baseInput, branchID: branchId } },
        });
        onSaved?.(result?.data?.createExpense);
      }

      onClose?.();
    } catch (err) {
      console.error("Expense save failed:", err);
      setError(err?.message || "Failed to save expense.");
    } finally {
      setSaving(false);
    }
  };

  const helperBoxSx = {
    p: 1.5,
    border: `1px solid ${sf.sf_borderLight}`,
    bgcolor: sf.sf_tableHeaderBg,
    fontSize: "0.75rem",
    color: sf.sf_textSecondary,
  };

  return (
    <Dialog
      open={open}
      onClose={() => !saving && onClose?.()}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 0 } }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          fontSize: "1rem",
          borderBottom: `1px solid ${sf.sf_borderLight}`,
        }}
      >
        {isEdit ? "Edit Expense" : "New Expense"}
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 0 }}>
            {error}
          </Alert>
        )}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <Box sx={helperBoxSx}>
            Select the account the expense will be paid from and the employee
            recording it before filling in the rest of the form.
          </Box>

          <TextField
            select
            label="Account"
            size="small"
            value={form.accountId}
            onChange={update("accountId")}
            required
            disabled={optionsLoading || accounts.length === 0}
            helperText={
              optionsLoading
                ? "Loading accounts for this branch..."
                : accounts.length === 0
                  ? "No accounts are linked to this branch."
                  : "The expense will be deducted from this account."
            }
          >
            {accounts.map((account) => (
              <MenuItem key={account.id} value={account.id}>
                {account.name}
                {account.accountType ? ` · ${account.accountType}` : ""}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Employee"
            size="small"
            value={form.employeeId}
            onChange={update("employeeId")}
            required
            disabled={optionsLoading || employees.length === 0}
            helperText={
              optionsLoading
                ? "Loading employees for this branch..."
                : employees.length === 0
                  ? "No employees are assigned to this branch."
                  : "Defaults to your linked employee; pick another if recording on behalf of someone else."
            }
          >
            {employees.map((employee) => (
              <MenuItem key={employee.id} value={employee.id}>
                {getEmployeeOptionLabel(employee)}
              </MenuItem>
            ))}
          </TextField>

          {gatingReady && (
            <>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <TextField
                  label="Date"
                  type="date"
                  size="small"
                  value={form.transactionDate}
                  onChange={update("transactionDate")}
                  InputLabelProps={{ shrink: true }}
                  sx={{ flex: "1 1 180px" }}
                />
                <TextField
                  label="Amount"
                  type="number"
                  size="small"
                  value={form.amount}
                  onChange={update("amount")}
                  inputProps={{ min: 0, step: "0.01" }}
                  sx={{ flex: "1 1 180px" }}
                  required
                />
              </Box>
              <TextField
                select
                label="Category"
                size="small"
                value={form.category}
                onChange={update("category")}
                required
              >
                {EXPENSE_CATEGORIES.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Payee"
                size="small"
                value={form.payee}
                onChange={update("payee")}
              />
              <TextField
                label="Description"
                size="small"
                value={form.description}
                onChange={update("description")}
                multiline
                minRows={2}
              />
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <TextField
                  label="Reference #"
                  size="small"
                  value={form.referenceNumber}
                  onChange={update("referenceNumber")}
                  sx={{ flex: "1 1 180px" }}
                />
                <TextField
                  label="Payment Method"
                  size="small"
                  value={form.paymentMethod}
                  onChange={update("paymentMethod")}
                  sx={{ flex: "1 1 180px" }}
                />
              </Box>
              <TextField
                label="Notes"
                size="small"
                value={form.notes}
                onChange={update("notes")}
                multiline
                minRows={2}
              />
            </>
          )}

          {!branchId && (
            <Typography sx={{ fontSize: "0.75rem", color: sf.sf_error }}>
              No active branch is loaded. Use Change Branch from the top bar.
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ borderTop: `1px solid ${sf.sf_borderLight}`, px: 3 }}>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving || !gatingReady || (!branchId && !isEdit)}
          variant="contained"
          sx={{ borderRadius: 0 }}
        >
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
