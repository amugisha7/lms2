import React from "react";
import {
  Alert,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { generateClient } from "aws-amplify/api";
import CreateFormButtons from "../../ModelAssets/CreateFormButtons";

import {
  CREATE_OTHER_INCOME_MUTATION,
  UPDATE_OTHER_INCOME_MUTATION,
  buildOtherIncomeCustomDetails,
  getOtherIncomeAccountId,
  getOtherIncomeEmployeeId,
  parseOtherIncomeCustomDetails,
} from "./otherIncomeQueries";
import { OTHER_INCOME_CATEGORIES } from "./otherIncomeCategories";
import { fetchBranchLinkedAccounts } from "../Expenses/branchAccountingHelpers";
import {
  getEmployeeOptionLabel,
  listEmployeesByBranch,
  resolveEmployeeIdForUser,
} from "../Employees/employeeHelpers";

const toAmount = (raw) => {
  const cleaned = String(raw ?? "")
    .replace(/,/g, "")
    .trim();
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : null;
};

const todayIso = () => new Date().toISOString().slice(0, 10);

const buildInitialForm = (initialItem) => ({
  accountId: getOtherIncomeAccountId(initialItem) || "",
  employeeId: getOtherIncomeEmployeeId(initialItem) || "",
  incomeDate: initialItem?.incomeDate || todayIso(),
  amount: initialItem?.amount != null ? String(initialItem.amount) : "",
  incomeType: initialItem?.incomeType || OTHER_INCOME_CATEGORIES[0],
  name: initialItem?.name || "",
  description: initialItem?.description || "",
});

export default function OtherIncomeFormDialog({
  open,
  onClose,
  onSaved,
  branchId,
  userDetails,
  initialItem = null,
}) {
  const theme = useTheme();
  const sf = theme.palette.sf;
  const isEdit = Boolean(initialItem?.id);

  const [form, setForm] = React.useState(() => buildInitialForm(initialItem));
  const [accounts, setAccounts] = React.useState([]);
  const [employees, setEmployees] = React.useState([]);
  const [optionsLoading, setOptionsLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;

    setError("");
    setForm(buildInitialForm(initialItem));
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
                  preferredEmployeeId: getOtherIncomeEmployeeId(initialItem),
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
        console.error("[OtherIncomeFormDialog] failed to load options:", err);
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
  }, [branchId, initialItem, open, userDetails]);

  const update = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const gatingReady = Boolean(form.accountId && form.employeeId);

  const validate = () => {
    if (!branchId && !isEdit) return "No active branch is loaded.";
    if (!form.accountId) return "Select an account first.";
    if (!form.employeeId) return "Select an employee first.";
    if (!form.incomeDate) return "Date is required.";
    const amount = toAmount(form.amount);
    if (amount == null || amount <= 0) {
      return "Amount must be a positive number.";
    }
    if (!form.incomeType) return "Category is required.";
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

      const accountSnapshot = accounts.find((a) => a.id === form.accountId);
      const employeeSnapshot = employees.find((e) => e.id === form.employeeId);

      const customDetails = buildOtherIncomeCustomDetails({
        existing: parseOtherIncomeCustomDetails(
          initialItem?.customOtherIncomeDetails,
        ),
        accountId: form.accountId,
        employeeId: form.employeeId,
        accountSnapshot: accountSnapshot
          ? {
              id: accountSnapshot.id,
              name: accountSnapshot.name,
              accountType: accountSnapshot.accountType || null,
            }
          : null,
        employeeSnapshot: employeeSnapshot
          ? {
              id: employeeSnapshot.id,
              firstName: employeeSnapshot.firstName || null,
              lastName: employeeSnapshot.lastName || null,
              email: employeeSnapshot.email || null,
            }
          : null,
      });

      const baseInput = {
        incomeDate: form.incomeDate,
        amount,
        incomeType: form.incomeType,
        name: form.name.trim() || form.incomeType,
        description: form.description.trim() || null,
        status: "active",
        customOtherIncomeDetails: JSON.stringify(customDetails),
      };

      let result;
      if (isEdit) {
        result = await client.graphql({
          query: UPDATE_OTHER_INCOME_MUTATION,
          variables: { input: { id: initialItem.id, ...baseInput } },
        });
        onSaved?.(result?.data?.updateOtherIncome);
      } else {
        result = await client.graphql({
          query: CREATE_OTHER_INCOME_MUTATION,
          variables: { input: { ...baseInput, branchID: branchId } },
        });
        onSaved?.(result?.data?.createOtherIncome);
      }
      onClose?.();
    } catch (err) {
      console.error("OtherIncome save failed:", err);
      setError(err?.message || "Failed to save other income.");
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
        {isEdit ? "Edit Other Income" : "New Other Income"}
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 0 }}>
              {error}
            </Alert>
          )}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <Box sx={helperBoxSx}>
              Select the account receiving this income and the employee
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
              SelectProps={{
                MenuProps: {
                  sx: {
                    "& .MuiMenuItem-root:hover": {
                      color: "white",
                    },
                  },
                },
              }}
              helperText={
                optionsLoading
                  ? "Loading accounts for this branch..."
                  : accounts.length === 0
                    ? "No accounts are linked to this branch."
                    : "The account that received this income."
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
              SelectProps={{
                MenuProps: {
                  sx: {
                    "& .MuiMenuItem-root:hover": {
                      color: "white",
                    },
                  },
                },
              }}
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
                    value={form.incomeDate}
                    onChange={update("incomeDate")}
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
                  value={form.incomeType}
                  onChange={update("incomeType")}
                  required
                  SelectProps={{
                    MenuProps: {
                      sx: {
                        "& .MuiMenuItem-root:hover": {
                          color: "white",
                        },
                      },
                    },
                  }}
                >
                  {OTHER_INCOME_CATEGORIES.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Name / Source"
                  size="small"
                  value={form.name}
                  onChange={update("name")}
                />
                <TextField
                  label="Description"
                  size="small"
                  value={form.description}
                  onChange={update("description")}
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
          <CreateFormButtons
            formik={{
              isSubmitting: saving,
              resetForm: () => {
                setForm(buildInitialForm(initialItem));
                setError("");
              },
            }}
            onClose={onClose}
            submitLabel={isEdit ? "Save Changes" : "SAVE"}
            submitDisabled={!gatingReady || (!branchId && !isEdit)}
            setSubmitError={setError}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
