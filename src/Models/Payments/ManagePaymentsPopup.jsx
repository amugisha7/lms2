import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Tabs,
  Tab,
  CircularProgress,
  IconButton,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { generateClient } from "aws-amplify/api";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseIcon from "@mui/icons-material/Close";

import CustomSlider from "../../ModelAssets/CustomSlider";
import CustomDataGrid from "../../ModelAssets/CustomDataGrid";
import { useSnackbar } from "../../ModelAssets/SnackbarContext";
import { UserContext } from "../../App";
import { useHasPermission } from "../../ModelAssets/Permissions/permissions";

// FormComponents
import DropDownSearchable from "../../Resources/FormComponents/DropDownSearchable";
import TextInput from "../../Resources/FormComponents/TextInput";
import DateInput from "../../Resources/FormComponents/DateInput";
import TextArea from "../../Resources/FormComponents/TextArea";
import { formatMoneyParts } from "../../Resources/formatting";

// Helpers
import {
  createPayment,
  updatePayment,
  listPaymentsByLoan,
  LIST_ACCOUNT_BRANCHES_QUERY,
  createMoneyTransaction,
} from "./paymentHelpers";
import {
  getDefaultEmployeeForUserContext,
  getEmployeeOptionLabel,
  listEmployeesByBranch,
  resolveEmployeeIdForUser,
} from "../Employees/employeeHelpers";

const client = generateClient();

const TABS = [
  { key: 0, label: "Add Payment" },
  { key: 1, label: "Payment History" },
];

const paymentValidationSchema = Yup.object().shape({
  accountID: Yup.string().required("Please select an account"),
  amount: Yup.string()
    .required("Payment amount is required")
    .test("is-positive", "Must be a positive number", (val) => {
      const num = Number(String(val).replace(/,/g, ""));
      return !isNaN(num) && num > 0;
    }),
  paymentDate: Yup.date().required("Payment date is required"),
});

const fmtDate = (dateStr) => {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = String(d.getDate()).padStart(2, "0");
    const mon = months[d.getMonth()];
    const year = String(d.getFullYear()).slice(-2);
    return `${day}-${mon}-${year}`;
  } catch {
    return dateStr;
  }
};

const getStatusColor = (status, sf) => {
  const normalized = String(status || "").toUpperCase();

  if (
    ["COMPLETED", "PAID", "SUCCESS", "CURRENT", "ACTIVE"].includes(normalized)
  ) {
    return { bg: sf.sf_pillSuccessBg, text: sf.sf_pillSuccessText };
  }

  if (["FAILED", "REVERSED", "VOIDED", "CANCELLED"].includes(normalized)) {
    return { bg: sf.sf_pillErrorBg, text: sf.sf_pillErrorText };
  }

  if (["PENDING", "PROCESSING", "APPROVED"].includes(normalized)) {
    return { bg: sf.sf_pillInfoBg, text: sf.sf_pillInfoText };
  }

  return { bg: sf.sf_pillNeutralBg, text: sf.sf_pillNeutralText };
};

const useBranchLinkedAccounts = (branchId) => {
  const [accounts, setAccounts] = useState([]);
  const [accountsLoading, setAccountsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchAccounts = async () => {
      if (!branchId) {
        setAccounts([]);
        setAccountsLoading(false);
        return;
      }
      setAccountsLoading(true);
      try {
        let allAccounts = [];
        let nextToken = null;
        do {
          const result = await client.graphql({
            query: LIST_ACCOUNT_BRANCHES_QUERY,
            variables: { branchId, nextToken },
          });
          const items = result?.data?.listAccountBranches?.items || [];
          const batch = items.map((item) => item.account).filter(Boolean);
          allAccounts = [...allAccounts, ...batch];
          nextToken = result?.data?.listAccountBranches?.nextToken;
        } while (nextToken);
        if (!cancelled) setAccounts(allAccounts);
      } catch (err) {
        console.error("Error fetching accounts for branch:", err);
        if (!cancelled) setAccounts([]);
      } finally {
        if (!cancelled) setAccountsLoading(false);
      }
    };
    fetchAccounts();
    return () => {
      cancelled = true;
    };
  }, [branchId]);

  return { accounts, accountsLoading };
};

const useBranchEmployees = (branchId, userDetails) => {
  const [employees, setEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [defaultEmployeeId, setDefaultEmployeeId] = useState("");

  useEffect(() => {
    let cancelled = false;
    const fetchEmployees = async () => {
      if (!branchId) {
        setEmployees([]);
        setDefaultEmployeeId("");
        setEmployeesLoading(false);
        return;
      }

      setEmployeesLoading(true);
      try {
        const [items, defaultEmployee] = await Promise.all([
          listEmployeesByBranch(branchId),
          getDefaultEmployeeForUserContext({
            ...userDetails,
            branchUsersId: branchId,
          }),
        ]);

        if (cancelled) return;

        setEmployees(items);
        setDefaultEmployeeId(defaultEmployee?.id || items[0]?.id || "");
      } catch (error) {
        console.error("Error fetching employees for payment popup:", error);
        if (!cancelled) {
          setEmployees([]);
          setDefaultEmployeeId("");
        }
      } finally {
        if (!cancelled) setEmployeesLoading(false);
      }
    };

    fetchEmployees();
    return () => {
      cancelled = true;
    };
  }, [branchId, userDetails]);

  return { employees, employeesLoading, defaultEmployeeId };
};

function AddPaymentForm({
  loan,
  sf,
  currencyCode,
  userDetails,
  onPaymentSaved,
}) {
  const { showSnackbar } = useSnackbar();
  const branchId =
    loan?.branchID ||
    loan?.borrower?.branchBorrowersId ||
    loan?.borrower?.branchID ||
    loan?.borrower?.branch?.id ||
    null;
  const { accounts, accountsLoading } = useBranchLinkedAccounts(branchId);
  const { employees, employeesLoading, defaultEmployeeId } = useBranchEmployees(
    branchId,
    userDetails,
  );

  const activeAccounts = useMemo(
    () =>
      accounts.filter((account) => {
        const normalizedStatus = String(account?.status || "").toLowerCase();
        return normalizedStatus === "active" || normalizedStatus === "system";
      }),
    [accounts],
  );

  const defaultAccountId = useMemo(() => {
    const cashAccount = activeAccounts.find((account) =>
      String(account?.accountType || "")
        .toLowerCase()
        .includes("cash"),
    );
    return cashAccount?.id || activeAccounts[0]?.id || "";
  }, [activeAccounts]);

  const accountOptions = useMemo(
    () =>
      activeAccounts.map((account) => ({
        value: account.id,
        label: account.name || account.id,
      })),
    [activeAccounts],
  );

  const currencyLabel =
    userDetails?.institution?.currencyCode || userDetails?.currencyCode || "";
  const employeeOptions = useMemo(
    () =>
      employees.map((employee) => ({
        value: employee.id,
        label: getEmployeeOptionLabel(employee),
      })),
    [employees],
  );

  return (
    <Formik
      enableReinitialize
      initialValues={{
        accountID: defaultAccountId,
        receivingEmployeeID: defaultEmployeeId,
        amount: "",
        paymentDate: new Date().toISOString().split("T")[0],
        collectedBy: "",
        description: "",
      }}
      validationSchema={paymentValidationSchema}
      onSubmit={async (values, formikHelpers) => {
        try {
          const actorEmployeeId = await resolveEmployeeIdForUser({
            userDetails,
            branchId,
          });
          const numericAmount = Number(String(values.amount).replace(/,/g, ""));
          const paymentResult = await client.graphql({
            query: createPayment,
            variables: {
              input: {
                loanID: loan.id,
                paymentDate: values.paymentDate,
                amount: numericAmount,
                accountID: values.accountID,
                description: values.description || null,
                notes: values.collectedBy
                  ? `Collected by: ${values.collectedBy}`
                  : null,
                status: "COMPLETED",
                paymentStatusEnum: "COMPLETED",
                receivingEmployeeID:
                  values.receivingEmployeeID || defaultEmployeeId || null,
              },
            },
          });

          const newPaymentId = paymentResult?.data?.createPayment?.id;

          await client.graphql({
            query: createMoneyTransaction,
            variables: {
              input: {
                transactionDate: values.paymentDate,
                amount: numericAmount,
                transactionType: "deposit",
                description: `Payment for Loan ${loan.loanNumber || loan.id}`,
                status: "completed",
                accountMoneyTransactionsId: values.accountID,
                loanID: loan.id,
                paymentID: newPaymentId,
                relatedEntityType: "LOAN_PAYMENT",
                category: "Loan Payment",
                createdByEmployeeID: actorEmployeeId,
              },
            },
          });

          showSnackbar("Payment recorded successfully!", "green");
          formikHelpers.resetForm({
            values: {
              accountID: defaultAccountId,
              receivingEmployeeID: defaultEmployeeId,
              amount: "",
              paymentDate: new Date().toISOString().split("T")[0],
              collectedBy: "",
              description: "",
            },
          });
          onPaymentSaved?.();
        } catch (error) {
          console.error("Failed to record payment:", error);
          showSnackbar("Failed to record payment. Please try again.", "red");
        } finally {
          formikHelpers.setSubmitting(false);
        }
      }}
    >
      {(formik) => (
        <Form>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.2,
            }}
          >
            <DropDownSearchable
              label="Receiving Account"
              name="accountID"
              required={true}
              editing={true}
              disabled={accountsLoading}
              options={accountOptions}
              value={formik.values.accountID}
              onChange={(e) =>
                formik.setFieldValue("accountID", e.target.value)
              }
              onBlur={() => formik.setFieldTouched("accountID", true)}
              helperText={
                (formik.submitCount > 0 || formik.touched.accountID) &&
                formik.errors.accountID
                  ? formik.errors.accountID
                  : "Account to receive payment. Showing accounts linked to borrower's branch."
              }
              placeholder={
                accountsLoading
                  ? "Loading accounts..."
                  : "Search for an account..."
              }
            />

            <DropDownSearchable
              label="Receiving Employee"
              name="receivingEmployeeID"
              editing={true}
              disabled={employeesLoading}
              options={employeeOptions}
              value={formik.values.receivingEmployeeID}
              onChange={(e) =>
                formik.setFieldValue("receivingEmployeeID", e.target.value)
              }
              helperText="Employee receiving this payment. Defaults to the branch's default employee."
              placeholder={
                employeesLoading
                  ? "Loading employees..."
                  : "Search for an employee..."
              }
            />

            <TextInput
              label="Payment Amount"
              name="amount"
              type="number"
              required={true}
              editing={true}
              helperText={currencyLabel}
            />

            <DateInput
              label="Payment Date"
              name="paymentDate"
              required={true}
              editing={true}
            />

            <TextInput
              label="Collected By"
              name="collectedBy"
              editing={true}
              helperText="Optional"
            />

            <TextArea
              label="Description / Comments"
              name="description"
              editing={true}
              rows={3}
              helperText="Optional"
            />

            {accountsLoading && (
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
              >
                <CircularProgress
                  size={16}
                  sx={{ color: sf.sf_brandPrimary }}
                />
                <Typography
                  sx={{ fontSize: "0.72rem", color: sf.sf_textTertiary }}
                >
                  Loading branch-linked accounts...
                </Typography>
              </Box>
            )}

            {!accountsLoading && !accountOptions.length && (
              <Typography
                sx={{ fontSize: "0.72rem", color: sf.sf_error, mt: 1 }}
              >
                No eligible receiving accounts were found for this branch.
              </Typography>
            )}

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={
                  formik.isSubmitting ||
                  accountsLoading ||
                  employeesLoading ||
                  !accountOptions.length
                }
                sx={{
                  bgcolor: sf.sf_brandPrimary,
                  color: "#fff",
                  borderRadius: 0,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  px: 3,
                  "&:hover": {
                    bgcolor: sf.sf_brandPrimaryHover || sf.sf_brandPrimary,
                  },
                }}
              >
                {formik.isSubmitting ? "Submitting..." : "Submit Payment"}
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
}

function PaymentHistoryGrid({
  loan,
  sf,
  currencyCode,
  userDetails,
  refreshSignal,
  onPaymentUpdated,
}) {
  const { showSnackbar } = useSnackbar();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editDraft, setEditDraft] = useState({
    amount: "",
    paymentDate: "",
    description: "",
  });
  const [savingRowId, setSavingRowId] = useState(null);

  const canEditPayments = useHasPermission("update", "payment");

  const fetchPayments = useCallback(async () => {
    if (!loan?.id) {
      setPayments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      let allPayments = [];
      let nextToken = null;

      do {
        const result = await client.graphql({
          query: listPaymentsByLoan,
          variables: {
            loanID: loan.id,
            limit: 100,
            nextToken,
          },
        });

        const items = result?.data?.listPayments?.items || [];
        allPayments = [...allPayments, ...items.filter(Boolean)];
        nextToken = result?.data?.listPayments?.nextToken;
      } while (nextToken);

      allPayments.sort((a, b) => {
        const aTime = new Date(a?.paymentDate || a?.createdAt || 0).getTime();
        const bTime = new Date(b?.paymentDate || b?.createdAt || 0).getTime();
        return bTime - aTime;
      });

      setPayments(allPayments);
    } catch (error) {
      console.error("Failed to fetch loan payments:", error);
      showSnackbar("Failed to load payment history.", "red");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, [loan?.id, showSnackbar]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments, refreshSignal]);

  const handleStartEdit = useCallback((row) => {
    setEditingRowId(row.id);
    setEditDraft({
      amount: row?.amount != null ? String(row.amount) : "",
      paymentDate: row?.paymentDate
        ? String(row.paymentDate).split("T")[0]
        : "",
      description: row?.description || "",
    });
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingRowId(null);
    setEditDraft({ amount: "", paymentDate: "", description: "" });
  }, []);

  const handleSaveEdit = useCallback(
    async (row) => {
      const numericAmount = Number(String(editDraft.amount).replace(/,/g, ""));
      if (
        !editDraft.paymentDate ||
        Number.isNaN(numericAmount) ||
        numericAmount <= 0
      ) {
        showSnackbar("Enter a valid payment date and amount.", "red");
        return;
      }

      setSavingRowId(row.id);
      try {
        await client.graphql({
          query: updatePayment,
          variables: {
            input: {
              id: row.id,
              amount: numericAmount,
              paymentDate: editDraft.paymentDate,
              description: editDraft.description || null,
            },
          },
        });

        showSnackbar("Payment updated.", "green");
        setEditingRowId(null);
        setEditDraft({ amount: "", paymentDate: "", description: "" });
        await fetchPayments();
        onPaymentUpdated?.();
      } catch (error) {
        console.error("Failed to update payment:", error);
        showSnackbar("Failed to update payment.", "red");
      } finally {
        setSavingRowId(null);
      }
    },
    [editDraft, fetchPayments, onPaymentUpdated, showSnackbar],
  );

  const columns = useMemo(
    () => [
      {
        field: "paymentDate",
        headerName: "Date",
        minWidth: 110,
        flex: 0.7,
        sortable: false,
        renderCell: (params) =>
          editingRowId === params.row.id ? (
            <TextField
              type="date"
              size="small"
              value={editDraft.paymentDate}
              onChange={(e) =>
                setEditDraft((prev) => ({
                  ...prev,
                  paymentDate: e.target.value,
                }))
              }
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": { borderRadius: 0 },
              }}
            />
          ) : (
            <Typography sx={{ fontSize: "0.76rem", color: sf.sf_textPrimary }}>
              {fmtDate(params.value)}
            </Typography>
          ),
      },
      {
        field: "amount",
        headerName: "Amount",
        minWidth: 130,
        flex: 0.9,
        sortable: false,
        renderCell: (params) => {
          if (editingRowId === params.row.id) {
            return (
              <TextField
                type="number"
                size="small"
                value={editDraft.amount}
                onChange={(e) =>
                  setEditDraft((prev) => ({ ...prev, amount: e.target.value }))
                }
                sx={{
                  width: "100%",
                  "& .MuiOutlinedInput-root": { borderRadius: 0 },
                }}
              />
            );
          }

          const parts = formatMoneyParts(
            params.value,
            currencyCode,
            currencyCode,
          );
          return (
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.4 }}>
              <Typography
                sx={{ fontSize: "0.7rem", color: sf.sf_textTertiary }}
              >
                {parts.prefix}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  color: sf.sf_textPrimary,
                }}
              >
                {parts.number || "0.00"}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: "accountName",
        headerName: "Account",
        minWidth: 150,
        flex: 0.95,
        sortable: false,
        valueGetter: (_value, row) => row?.account?.name || "N/A",
        renderCell: (params) => (
          <Typography sx={{ fontSize: "0.76rem", color: sf.sf_textPrimary }}>
            {params.row?.account?.name || "N/A"}
          </Typography>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        minWidth: 100,
        flex: 0.7,
        sortable: false,
        renderCell: (params) => {
          const colors = getStatusColor(
            params.row?.paymentStatusEnum || params.value,
            sf,
          );
          const label = params.row?.paymentStatusEnum || params.value || "N/A";
          return (
            <Chip
              label={label}
              size="small"
              sx={{
                height: 20,
                fontSize: "0.62rem",
                fontWeight: 700,
                bgcolor: colors.bg,
                color: colors.text,
                borderRadius: 0,
                "& .MuiChip-label": { px: 0.7 },
              }}
            />
          );
        },
      },
      {
        field: "description",
        headerName: "Description",
        minWidth: 160,
        flex: 1,
        sortable: false,
        renderCell: (params) =>
          editingRowId === params.row.id ? (
            <TextField
              size="small"
              value={editDraft.description}
              onChange={(e) =>
                setEditDraft((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": { borderRadius: 0 },
              }}
            />
          ) : (
            <Typography
              sx={{
                fontSize: "0.76rem",
                color: sf.sf_textPrimary,
                whiteSpace: "normal",
                lineHeight: 1.25,
              }}
            >
              {params.row?.description || params.row?.notes || ""}
            </Typography>
          ),
      },
      {
        field: "actions",
        headerName: "",
        width: 60,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          if (!canEditPayments) return null;

          const isEditing = editingRowId === params.row.id;
          const isSaving = savingRowId === params.row.id;

          return isEditing ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                size="small"
                disabled={isSaving}
                onClick={() => handleSaveEdit(params.row)}
                sx={{ color: sf.sf_brandPrimary, borderRadius: 0 }}
              >
                <SaveOutlinedIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                disabled={isSaving}
                onClick={handleCancelEdit}
                sx={{ color: sf.sf_textTertiary, borderRadius: 0 }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <IconButton
              size="small"
              onClick={() => handleStartEdit(params.row)}
              sx={{
                color: sf.sf_textPrimary,
                borderRadius: 0,
                "&:hover": { bgcolor: sf.sf_actionHoverBg },
              }}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          );
        },
      },
    ],
    [
      canEditPayments,
      currencyCode,
      editDraft.amount,
      editDraft.description,
      editDraft.paymentDate,
      editingRowId,
      handleCancelEdit,
      handleSaveEdit,
      handleStartEdit,
      savingRowId,
      sf,
    ],
  );

  if (loading) {
    return (
      <Box
        sx={{
          py: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1.2,
        }}
      >
        <CircularProgress size={22} sx={{ color: sf.sf_brandPrimary }} />
        <Typography sx={{ fontSize: "0.74rem", color: sf.sf_textTertiary }}>
          Loading payment history...
        </Typography>
      </Box>
    );
  }

  if (!payments.length) {
    return (
      <Box
        sx={{
          minHeight: 220,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ fontSize: "0.82rem", color: sf.sf_textTertiary }}>
          No payments recorded yet.
        </Typography>
      </Box>
    );
  }

  return (
    <CustomDataGrid
      rows={payments}
      columns={columns}
      loading={loading}
      getRowId={(row) => row.id}
      pageSize={10}
      pageSizeOptions={[10, 25, 50]}
      rowHeight={64}
      showToolbar={false}
      disableRowSelectionOnClick
      autoHeight
      sx={{
        borderRadius: 0,
        "& .MuiDataGrid-columnHeaderTitle": { fontSize: "0.74rem" },
        "& .MuiDataGrid-cell": {
          pt: 0.5,
          pb: 0,
          display: "flex",
          alignItems: "center",
        },
      }}
    />
  );
}

export default function ManagePaymentsPopup({
  open,
  onClose,
  loan,
  onPaymentSuccess,
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [refreshSignal, setRefreshSignal] = useState(0);
  const theme = useTheme();
  const sf = theme.palette.sf;
  const { userDetails } = useContext(UserContext);
  const currencyCode =
    userDetails?.institution?.currencyCode || userDetails?.currencyCode || "";

  useEffect(() => {
    if (open) {
      setActiveTab(0);
      setRefreshSignal(0);
    }
  }, [open, loan?.id]);

  const handlePaymentSaved = useCallback(() => {
    setRefreshSignal((prev) => prev + 1);
    setActiveTab(1);
    onPaymentSuccess?.();
  }, [onPaymentSuccess]);

  const handlePaymentUpdated = useCallback(() => {
    onPaymentSuccess?.();
  }, [onPaymentSuccess]);

  if (!loan) return null;

  return (
    <CustomSlider
      open={open}
      onClose={onClose}
      title={`Manage Payments — Loan ${loan.loanNumber || loan.id}`}
      showEdit={false}
      showDelete={false}
      maxWidth="md"
      fullWidth
    >
      <Box sx={{ p: 3, height: "100%", border: `none` }}>
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
              value={activeTab}
              onChange={(_event, newValue) => setActiveTab(newValue)}
              aria-label="manage payments tabs"
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
              {TABS.map((tab) => (
                <Tab key={tab.key} label={tab.label} value={tab.key} />
              ))}
            </Tabs>
          </Box>
        </Box>

        {activeTab === 0 ? (
          <AddPaymentForm
            loan={loan}
            sf={sf}
            currencyCode={currencyCode}
            userDetails={userDetails}
            onPaymentSaved={handlePaymentSaved}
          />
        ) : (
          <PaymentHistoryGrid
            loan={loan}
            sf={sf}
            currencyCode={currencyCode}
            userDetails={userDetails}
            refreshSignal={refreshSignal}
            onPaymentUpdated={handlePaymentUpdated}
          />
        )}
      </Box>
    </CustomSlider>
  );
}
