import React from "react";
import { generateClient } from "aws-amplify/api";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import InputBase from "@mui/material/InputBase";
import { useTheme } from "@mui/material/styles";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useNavigate } from "react-router-dom";
import { Formik, Form, useField } from "formik";
import { UserContext } from "../../../App";
import { listBranches } from "../../../graphql/queries";
import WorkingOverlay from "../../../ModelAssets/WorkingOverlay";
import CustomDataGrid from "../../../ModelAssets/CustomDataGrid";
import MultipleDropDownSearchable from "../../../Resources/FormComponents/MultipleDropDownSearchable";
import { Button } from "@mui/material";

//  Enhanced query that fetches all the fields we need for the display
const LIST_LOANS_DISPLAY_QUERY = `
  query ListLoansDisplay(
    $filter: ModelLoanFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLoans(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        loanNumber
        branchID
        principal
        interestRate
        startDate
        maturityDate
        duration
        durationInterval
        loanType
        rateInterval
        paymentFrequency
        status
        loanCurrency
        borrower {
          id
          firstname
          othername
          businessName
          phoneNumber
          email
        }
        loanProduct {
          id
          name
          interestCalculationMethod
        }
        createdByEmployee {
          id
          firstName
          lastName
        }
        balanceSnapshots(limit: 1, sortDirection: DESC) {
          items {
            principalOutstanding
            interestOutstanding
            feesOutstanding
            penaltyOutstanding
            totalOutstanding
          }
        }
        payments(limit: 1000) {
          items {
            amount
            status
            paymentStatusEnum
          }
        }
      }
      nextToken
    }
  }
`;

//  Helper: format currency
const fmtCurrency = (value, currency = "$") => {
  if (value == null || isNaN(value)) return "N/A";
  return `${currency}${Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

//  Helper: format date to DD-MMM-YYYY
const fmtDate = (dateStr) => {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
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

//  Helper: compute total paid from payments
const computeTotalPaid = (payments) => {
  if (!payments?.items?.length) return 0;
  return payments.items
    .filter((p) => {
      const st = (p.paymentStatusEnum || p.status || "").toUpperCase();
      return st !== "REVERSED" && st !== "VOIDED" && st !== "FAILED";
    })
    .reduce((sum, p) => sum + (p.amount || 0), 0);
};

//  Helper: get balance from latest snapshot or compute
const getBalance = (loan) => {
  const snapshot = loan.balanceSnapshots?.items?.[0];
  if (snapshot) return snapshot.totalOutstanding ?? 0;
  const paid = computeTotalPaid(loan.payments);
  return (loan.principal || 0) - paid;
};

// --- Helper: get principal balance (remaining principal only) ---
const getPrincipalBalance = (loan) => {
  const snapshot = loan.balanceSnapshots?.items?.[0];
  if (snapshot)
    return snapshot.principalOutstanding ?? snapshot.totalOutstanding ?? 0;
  const paid = computeTotalPaid(loan.payments);
  return Math.max((loan.principal || 0) - paid, 0);
};

// --- Helper: format rate interval ---
const formatRateInterval = (interval) => {
  if (!interval) return "month";
  const lower = interval.toLowerCase();
  if (lower.includes("day") || lower.includes("daily")) return "day";
  if (lower.includes("week") || lower.includes("weekly")) return "week";
  if (lower.includes("month") || lower.includes("monthly")) return "month";
  if (lower.includes("quarter") || lower.includes("quarterly"))
    return "quarter";
  if (lower.includes("year") || lower.includes("annual")) return "year";
  return interval.toLowerCase();
};

//  Status pill color mapping
const getStatusColor = (status, sf) => {
  const s = (status || "").toUpperCase();
  if (["ACTIVE", "CURRENT"].includes(s))
    return { bg: sf.sf_pillSuccessBg, text: sf.sf_pillSuccessText };
  if (["PAYMENT_DUE", "PAST_DUE", "OVERDUE"].includes(s))
    return { bg: sf.sf_pillErrorBg, text: sf.sf_pillErrorText };
  if (["CLOSED", "CLEARED", "PAID"].includes(s))
    return { bg: sf.sf_pillInfoBg, text: sf.sf_pillInfoText };
  if (s === "WRITTEN_OFF")
    return { bg: sf.sf_pillWarningBg, text: sf.sf_pillWarningText };
  if (s === "VOIDED")
    return { bg: sf.sf_pillNeutralBg, text: sf.sf_pillNeutralText };
  return { bg: sf.sf_pillNeutralBg, text: sf.sf_pillNeutralText };
};

//  Days until a date (negative = past due)
const daysUntil = (dateStr) => {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  if (isNaN(target.getTime())) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.round((target - now) / 86400000);
};

//  Maturity urgency badge
const getMaturityUrgency = (dateStr, status, sf) => {
  const s = (status || "").toUpperCase();
  if (["CLOSED", "CLEARED", "PAID", "VOIDED", "WRITTEN_OFF"].includes(s))
    return null;
  const days = daysUntil(dateStr);
  if (days === null) return null;
  if (days < 0)
    return {
      label: `${Math.abs(days)}d overdue`,
      color: sf.sf_error,
      bg: sf.sf_errorBg,
    };
  if (days <= 7)
    return {
      label: `${days}d left`,
      color: sf.sf_warning,
      bg: sf.sf_warningBg,
    };
  if (days <= 30)
    return { label: `${days}d left`, color: sf.sf_info, bg: sf.sf_infoBg };
  return null;
};

//  Status filter tabs config
const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active", match: ["ACTIVE", "CURRENT"] },
  {
    key: "overdue",
    label: "Overdue",
    match: ["PAYMENT_DUE", "PAST_DUE", "OVERDUE"],
  },
  { key: "closed", label: "Closed", match: ["CLOSED", "CLEARED", "PAID"] },
  { key: "written_off", label: "Written Off", match: ["WRITTEN_OFF"] },
];

// (Grid column template removed – using MUI DataGrid columns instead)

//  KPI Card
function KpiCard({ icon: Icon, label, value, subValue, accent, sf }) {
  return (
    <Box
      sx={{
        flex: "1 1 0",
        minWidth: 170,
        bgcolor: sf.sf_kpiCardBg,
        border: `1px solid ${sf.sf_borderLight}`,
        borderRadius: 0,
        p: "16px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        boxShadow: sf.sf_shadowSm,
        transition: "box-shadow 0.15s, transform 0.15s",
        "&:hover": {
          boxShadow: sf.sf_shadowMd,
          transform: "translateY(-1px)",
        },
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 0,
          bgcolor: accent || sf.sf_kpiIconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon sx={{ fontSize: 20, color: sf.sf_kpiIconColor }} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: "0.68rem",
            fontWeight: 600,
            color: sf.sf_textTertiary,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            lineHeight: 1.2,
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            fontSize: "1.15rem",
            fontWeight: 700,
            color: sf.sf_textPrimary,
            lineHeight: 1.3,
            mt: 0.15,
          }}
        >
          {value}
        </Typography>
        {subValue && (
          <Typography
            sx={{
              fontSize: "0.68rem",
              color: sf.sf_textTertiary,
              lineHeight: 1.2,
              mt: 0.15,
            }}
          >
            {subValue}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

//  Action button
function ActionBtn({ icon: Icon, label, primary, sf, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        px: 1,
        py: 0.4,
        borderRadius: 0,
        cursor: "pointer",
        fontSize: "0.7rem",
        fontWeight: 500,
        color: primary ? sf.sf_textOnBrand : sf.sf_textLink,
        bgcolor: primary ? sf.sf_brandPrimary : "transparent",
        border: primary ? "none" : `1px solid ${sf.sf_borderLight}`,
        transition: "all 0.12s ease",
        mt: 0.5,
        "&:hover": {
          bgcolor: primary ? sf.sf_brandHover : sf.sf_actionHoverBg,
          color: primary ? sf.sf_textOnBrand : sf.sf_textLinkHover,
        },
      }}
    >
      <Icon sx={{ fontSize: 14 }} />
      <Typography sx={{ fontSize: "0.7rem", fontWeight: 500, lineHeight: 1 }}>
        {label}
      </Typography>
    </Box>
  );
}

// --- Helpers ---
const truncateWithEllipsis = (text, limit = 36) => {
  if (!text) return text;
  return text.length > limit ? `${text.slice(0, limit)}...` : text;
};

// --- FormikEffect: sync formik field value changes to a callback ---
function FormikEffect({ onChange, fieldName }) {
  const [field] = useField(fieldName);
  const prevValueRef = React.useRef(field.value);
  React.useEffect(() => {
    if (JSON.stringify(field.value) !== JSON.stringify(prevValueRef.current)) {
      prevValueRef.current = field.value;
      onChange(field.value);
    }
  }, [field.value, onChange]);
  return null;
}

// --- Branch filter wrapper (admin only) ---
function BranchFilterWrapper({ branches, onFilterChange, selectedCount }) {
  return (
    <Box sx={{ mb: 2, width: "100%" }}>
      <Formik initialValues={{ branchFilter: [] }} enableReinitialize>
        <Form>
          <FormikEffect onChange={onFilterChange} fieldName="branchFilter" />
          <MultipleDropDownSearchable
            label="Filter by Branch"
            name="branchFilter"
            options={branches.map((branch) => ({
              value: branch.id,
              label: branch.name,
            }))}
            placeholder={selectedCount === 0 ? "All Branches" : ""}
            editing={true}
            helperText={
              selectedCount === 0
                ? "Showing all branches"
                : `Showing ${selectedCount} branch(es)`
            }
          />
        </Form>
      </Formik>
    </Box>
  );
}

//
//  Main LoansDisplay Component
//
export default function LoansDisplay() {
  const [loans, setLoans] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [workingOverlayOpen, setWorkingOverlayOpen] = React.useState(false);
  const [workingOverlayMessage, setWorkingOverlayMessage] =
    React.useState("Working...");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [branches, setBranches] = React.useState([]);
  const [selectedBranchFilter, setSelectedBranchFilter] = React.useState([]);
  const hasFetchedRef = React.useRef();
  const gridDragContainerRef = React.useRef(null);
  const topScrollRef = React.useRef(null);
  const topScrollInnerRef = React.useRef(null);
  const { userDetails } = React.useContext(UserContext);
  const theme = useTheme();
  const sf = theme.palette.sf;
  const navigate = useNavigate();

  const renderTwoLineHeader = React.useCallback(
    (line1, line2) => () => (
      <Typography
        component="span"
        sx={{
          fontSize: "0.74rem",
          fontWeight: 600,
          lineHeight: 1.05,
          textAlign: "center",
          width: "100%",
        }}
      >
        {line1}
        <br />
        {line2}
      </Typography>
    ),
    [],
  );

  React.useEffect(() => {
    const el = gridDragContainerRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const getScroller = () =>
      el.querySelector(".MuiDataGrid-virtualScroller") || el;

    const onMouseDown = (e) => {
      if (e.target.closest("button, a, input, [role='button'], .MuiChip-root"))
        return;
      const scroller = getScroller();
      isDown = true;
      el.style.cursor = "grabbing";
      startX = e.pageX - scroller.offsetLeft;
      scrollLeft = scroller.scrollLeft;
    };

    const onMouseLeave = () => {
      isDown = false;
      el.style.cursor = "";
    };

    const onMouseUp = () => {
      isDown = false;
      el.style.cursor = "";
    };

    const onMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const scroller = getScroller();
      const x = e.pageX - scroller.offsetLeft;
      scroller.scrollLeft = scrollLeft - (x - startX);
    };

    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mouseleave", onMouseLeave);
    el.addEventListener("mouseup", onMouseUp);
    el.addEventListener("mousemove", onMouseMove);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  // Sync top scrollbar width and scroll position with DataGrid's virtual scroller
  React.useEffect(() => {
    if (loading) return;
    const frame = requestAnimationFrame(() => {
      const gridEl = gridDragContainerRef.current;
      const topEl = topScrollRef.current;
      const innerEl = topScrollInnerRef.current;
      if (!gridEl || !topEl || !innerEl) return;
      const scroller = gridEl.querySelector(".MuiDataGrid-virtualScroller");
      if (!scroller) return;

      innerEl.style.width = scroller.scrollWidth + "px";

      const onTopScroll = () => {
        scroller.scrollLeft = topEl.scrollLeft;
      };
      const onGridScroll = () => {
        topEl.scrollLeft = scroller.scrollLeft;
      };

      topEl.addEventListener("scroll", onTopScroll);
      scroller.addEventListener("scroll", onGridScroll);

      return () => {
        topEl.removeEventListener("scroll", onTopScroll);
        scroller.removeEventListener("scroll", onGridScroll);
      };
    });
    return () => cancelAnimationFrame(frame);
  }, [loading, loans]);

  const scrollTopBarBy = React.useCallback((delta) => {
    const topEl = topScrollRef.current;
    if (!topEl) return;
    topEl.scrollBy({ left: delta, behavior: "smooth" });
  }, []);

  //  DataGrid column definitions
  const columns = React.useMemo(
    () => [
      {
        field: "borrower",
        headerName: "Borrower",
        disableColumnMenu: false,
        flex: 1,
        minWidth: 160,
        valueGetter: (value, row) => {
          const b = row.borrower || {};
          return (
            [b.firstname, b.othername, b.businessName]
              .filter(Boolean)
              .join(" ")
              .trim() || "Unknown"
          );
        },
        renderCell: (params) => {
          const b = params.row.borrower || {};
          const name = params.value;
          const displayName = truncateWithEllipsis(name, 36);
          return (
            <Box>
              <Typography
                onClick={() => b.id && navigate(`/borrowers/id/${b.id}/view`)}
                sx={{
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: sf.sf_textLink,
                  cursor: "pointer",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  lineHeight: 1.2,
                  textDecoration: "underline",
                  "&:hover": {
                    color: sf.sf_textLinkHover,
                  },
                }}
              >
                {displayName}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.3,
                  mt: 0.3,
                }}
              >
                <Tooltip
                  title={b.phoneNumber || "No phone"}
                  placement="top"
                  arrow
                >
                  <IconButton
                    size="small"
                    sx={{
                      p: 0.2,
                      color: sf.sf_textTertiary,
                      "&:hover": { color: sf.sf_brandPrimary },
                    }}
                  >
                    <PhoneOutlinedIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title={b.email || "No email"} placement="top" arrow>
                  <IconButton
                    size="small"
                    sx={{
                      p: 0.2,
                      color: sf.sf_textTertiary,
                      "&:hover": { color: sf.sf_brandPrimary },
                    }}
                  >
                    <EmailOutlinedIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          );
        },
      },
      {
        field: "principal",
        headerName: "Principal",
        disableColumnMenu: true,
        headerAlign: "center",
        flex: 1,
        minWidth: 140,
        type: "number",
        valueGetter: (value, row) => row.principal || 0,
        renderCell: (params) => {
          const loan = params.row;
          const loanId = loan.loanNumber || loan.id || "\u2014";
          const loanIdDisplay =
            typeof loanId === "string" && loanId.length > 3
              ? loanId.slice(3)
              : loanId;
          return (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: sf.sf_textPrimary,
                }}
              >
                {fmtCurrency(params.value)}
              </Typography>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.6rem",
                    mt: 0.2,
                    color: sf.sf_textTertiary,
                  }}
                >
                  LOAN ID:
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.7rem",
                    color: sf.sf_textLink,
                    cursor: "pointer",
                    mt: 0.2,
                    ml: 0.4,
                    textDecoration: "underline",
                    "&:hover": {
                      color: sf.sf_textLinkHover,
                    },
                  }}
                >
                  {loanIdDisplay}
                </Typography>
              </Box>
            </Box>
          );
        },
      },
      {
        field: "startDate",
        headerName: "Date Taken",
        disableColumnMenu: true,
        headerAlign: "center",
        renderHeader: renderTwoLineHeader("Date", "Taken"),
        flex: 0.65,
        minWidth: 95,
        valueGetter: (value, row) =>
          row.startDate ? new Date(row.startDate).getTime() : 0,
        renderCell: (params) => (
          <Typography
            sx={{
              fontSize: "0.8rem",
              color: sf.sf_textPrimary,
              fontWeight: 500,
            }}
          >
            {fmtDate(params.row.startDate)}
          </Typography>
        ),
      },
      {
        field: "maturityDate",
        headerName: "Maturity Date",
        disableColumnMenu: true,
        headerAlign: "center",
        renderHeader: renderTwoLineHeader("Maturity", "Date"),
        flex: 0.75,
        minWidth: 110,
        valueGetter: (value, row) =>
          row.maturityDate ? new Date(row.maturityDate).getTime() : 0,
        renderCell: (params) => {
          const loan = params.row;
          const maturityUrgency = getMaturityUrgency(
            loan.maturityDate,
            loan.status,
            sf,
          );
          return (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  color: sf.sf_textPrimary,
                  fontWeight: 500,
                }}
              >
                {fmtDate(loan.maturityDate)}
              </Typography>
              {maturityUrgency && (
                <Chip
                  label={maturityUrgency.label}
                  size="small"
                  sx={{
                    alignSelf: "flex-start",
                    mt: 0.3,
                    height: 17,
                    fontSize: "0.58rem",
                    fontWeight: 700,
                    bgcolor: maturityUrgency.bg,
                    color: maturityUrgency.color,
                    borderRadius: 0,
                    "& .MuiChip-label": { px: 0.5 },
                  }}
                />
              )}
            </Box>
          );
        },
      },
      {
        field: "interestRate",
        headerName: "Interest",
        disableColumnMenu: true,
        headerAlign: "center",
        flex: 0.75,
        minWidth: 110,
        type: "number",
        valueGetter: (value, row) => row.interestRate ?? 0,
        renderCell: (params) => {
          const loan = params.row;
          const rateDisplay =
            loan.interestRate != null
              ? `${loan.interestRate}% / ${formatRateInterval(loan.rateInterval)}`
              : "N/A";
          const interestMethod =
            loan.loanProduct?.interestCalculationMethod ||
            loan.loanType ||
            "N/A";
          return (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  color: sf.sf_textPrimary,
                  fontWeight: 500,
                }}
              >
                {rateDisplay}
              </Typography>
              <Tooltip
                title={`Method: ${interestMethod}`}
                placement="top"
                arrow
              >
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.3,
                    mt: 0.3,
                    cursor: "help",
                    color: sf.sf_textTertiary,
                    "&:hover": { color: sf.sf_brandPrimary },
                  }}
                >
                  <InfoOutlinedIcon sx={{ fontSize: 14 }} />
                  <Typography
                    sx={{
                      color: sf.sf_textTertiary,
                      fontSize: "0.62rem",
                      fontWeight: 500,
                    }}
                  >
                    Method
                  </Typography>
                </Box>
              </Tooltip>
            </Box>
          );
        },
      },
      {
        field: "amountDue",
        headerName: "Amount Due",
        disableColumnMenu: true,
        headerAlign: "center",
        renderHeader: renderTwoLineHeader("Amount", "Due"),
        flex: 0.65,
        minWidth: 100,
        type: "number",
        valueGetter: (value, row) => getBalance(row),
        renderCell: (params) => {
          const status = params.row.status || "N/A";
          const statusColors = getStatusColor(status, sf);
          const balance = params.value;
          return (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: balance > 0 ? sf.sf_textPrimary : sf.sf_success,
                }}
              >
                {fmtCurrency(balance)}
              </Typography>
              <Chip
                label={status}
                size="small"
                sx={{
                  alignSelf: "flex-start",
                  mt: 0.3,
                  height: 18,
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  bgcolor: statusColors.bg,
                  color: statusColors.text,
                  borderRadius: 0,
                  "& .MuiChip-label": { px: 0.7 },
                }}
              />
            </Box>
          );
        },
      },
      {
        field: "totalPaid",
        headerName: "Total Paid",
        disableColumnMenu: true,
        headerAlign: "center",
        renderHeader: renderTwoLineHeader("Total", "Paid"),
        flex: 0.85,
        minWidth: 120,
        type: "number",
        valueGetter: (value, row) => computeTotalPaid(row.payments),
        renderCell: (params) => (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.82rem",
                fontWeight: 500,
                color: sf.sf_success,
              }}
            >
              {fmtCurrency(params.value)}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.7rem",
                color: sf.sf_textLink,
                cursor: "pointer",
                mt: 0.2,
                textDecoration: "underline",
                "&:hover": { color: sf.sf_textLinkHover },
              }}
            >
              Manage Payments
            </Typography>
          </Box>
        ),
      },
      {
        field: "loanBalance",
        headerName: "Loan Balance",
        disableColumnMenu: true,
        headerAlign: "center",
        renderHeader: renderTwoLineHeader("Loan", "Balance"),
        flex: 0.85,
        minWidth: 120,
        type: "number",
        valueGetter: (value, row) => getPrincipalBalance(row),
        renderCell: (params) => {
          const principalBal = params.value;
          return (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: principalBal > 0 ? sf.sf_error : sf.sf_success,
                }}
              >
                {fmtCurrency(principalBal)}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.7rem",
                  color: sf.sf_textLink,
                  cursor: "pointer",
                  mt: 0.2,
                  textDecoration: "underline",
                  "&:hover": { color: sf.sf_textLinkHover },
                }}
              >
                View Statement
              </Typography>
            </Box>
          );
        },
      },
      {
        field: "loanOfficer",
        headerName: "Loan Officer",
        disableColumnMenu: true,
        headerAlign: "center",
        renderHeader: renderTwoLineHeader("Loan", "Officer"),
        flex: 0.9,
        minWidth: 130,
        sortable: false,
        valueGetter: (value, row) => {
          const emp = row.createdByEmployee;
          return emp
            ? [emp.firstName, emp.lastName].filter(Boolean).join(" ")
            : "N/A";
        },
        renderCell: (params) => {
          const officerName = truncateWithEllipsis(params.value, 36);
          return (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: sf.sf_textPrimary,
                }}
              >
                {officerName}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.7rem",
                  color: sf.sf_textLink,
                  cursor: "pointer",
                  mt: 0.2,
                  textDecoration: "underline",
                  "&:hover": { color: sf.sf_textLinkHover },
                }}
              >
                Loan Comments
              </Typography>
            </Box>
          );
        },
      },
    ],
    [sf, renderTwoLineHeader, navigate],
  );

  //  Filtered + sorted loans
  const filteredLoans = React.useMemo(() => {
    let result = loans;

    // Branch filter (admin only)
    if (
      (userDetails?.userType || "").toLowerCase() === "admin" &&
      selectedBranchFilter.length > 0
    ) {
      result = result.filter((loan) =>
        selectedBranchFilter.includes(loan.branchID),
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      const tab = STATUS_TABS.find((t) => t.key === statusFilter);
      if (tab?.match) {
        result = result.filter((loan) =>
          tab.match.includes((loan.status || "").toUpperCase()),
        );
      }
    }

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter((loan) => {
        const b = loan.borrower || {};
        const searchable = [
          b.firstname,
          b.othername,
          b.businessName,
          loan.loanNumber,
          loan.id,
          loan.status,
          loan.loanProduct?.name,
          loan.createdByEmployee?.firstName,
          loan.createdByEmployee?.lastName,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return searchable.includes(q);
      });
    }

    return result;
  }, [loans, statusFilter, searchTerm, selectedBranchFilter, userDetails]);

  //  KPI computations
  const kpis = React.useMemo(() => {
    const active = loans.filter((l) =>
      ["ACTIVE", "CURRENT"].includes((l.status || "").toUpperCase()),
    );
    const overdue = loans.filter((l) =>
      ["PAYMENT_DUE", "PAST_DUE", "OVERDUE"].includes(
        (l.status || "").toUpperCase(),
      ),
    );
    const totalPrincipal = loans.reduce((s, l) => s + (l.principal || 0), 0);
    const totalOutstanding = loans.reduce((s, l) => s + getBalance(l), 0);
    return {
      total: loans.length,
      active: active.length,
      overdue: overdue.length,
      totalPrincipal,
      totalOutstanding,
    };
  }, [loans]);

  //  Status tab counts
  const tabCounts = React.useMemo(() => {
    const counts = { all: loans.length };
    STATUS_TABS.forEach((tab) => {
      if (tab.key !== "all") {
        counts[tab.key] = loans.filter((l) =>
          tab.match.includes((l.status || "").toUpperCase()),
        ).length;
      }
    });
    return counts;
  }, [loans]);

  //  Fetch loans
  const fetchLoans = React.useCallback(async () => {
    const isAdmin = userDetails?.userType === "Admin";
    const branchId = userDetails?.branchUsersId;
    const institutionId =
      userDetails?.institution?.id || userDetails?.institutionUsersId;

    if ((!isAdmin && !branchId) || (isAdmin && !institutionId)) return;

    setLoading(true);
    setWorkingOverlayOpen(true);
    setWorkingOverlayMessage("Loading Loans...");

    try {
      const client = generateClient();

      let institutionBranchIds = [];
      if (isAdmin) {
        let branchesNextToken = null;
        do {
          const branchData = await client.graphql({
            query: listBranches,
            variables: {
              limit: 1000,
              nextToken: branchesNextToken,
              filter: { institutionBranchesId: { eq: institutionId } },
            },
          });
          const branchItems = branchData?.data?.listBranches?.items || [];
          institutionBranchIds.push(...branchItems.map((b) => b.id));
          branchesNextToken = branchData?.data?.listBranches?.nextToken;
        } while (branchesNextToken);
        institutionBranchIds = [...new Set(institutionBranchIds)];
      }

      let allLoans = [];
      const loadLoansForBranch = async (targetBranchId) => {
        let nextToken = null;
        do {
          const result = await client.graphql({
            query: LIST_LOANS_DISPLAY_QUERY,
            variables: {
              limit: 100,
              nextToken,
              filter: { branchID: { eq: targetBranchId } },
            },
          });
          const batch = result?.data?.listLoans?.items || [];
          allLoans.push(...batch);
          nextToken = result?.data?.listLoans?.nextToken;
        } while (nextToken);
      };

      if (isAdmin) {
        for (const bid of institutionBranchIds) {
          await loadLoansForBranch(bid);
        }
      } else {
        await loadLoansForBranch(branchId);
      }

      const processed = Array.from(
        new Map(allLoans.map((l) => [l.id, l])).values(),
      ).filter((loan) => {
        const st = (loan.status || "").toLowerCase();
        return (
          !st.includes("draft") &&
          !st.includes("review") &&
          !st.includes("rejected")
        );
      });

      setLoans(processed);
    } catch (err) {
      console.error("LoansDisplay \u2013 Error fetching loans:", err);
      setLoans([]);
    } finally {
      setLoading(false);
      setWorkingOverlayOpen(false);
    }
  }, [userDetails]);

  React.useEffect(() => {
    if (!userDetails) return;
    const fetchKey =
      userDetails.userType === "Admin"
        ? userDetails.institution?.id ||
          userDetails.institutionUsersId ||
          "admin"
        : userDetails.branchUsersId;
    if (fetchKey && fetchKey !== hasFetchedRef.current) {
      fetchLoans();
      hasFetchedRef.current = fetchKey;
    }
  }, [userDetails, fetchLoans]);

  // Fetch branches list for admin branch filter UI
  React.useEffect(() => {
    const fetchBranchesForAdmin = async () => {
      const isAdmin = (userDetails?.userType || "").toLowerCase() === "admin";
      const institutionId =
        userDetails?.institution?.id || userDetails?.institutionUsersId;
      console.log(
        "[LoansDisplay] userType:",
        userDetails?.userType,
        "isAdmin:",
        isAdmin,
        "institutionId:",
        institutionId,
      );
      if (!isAdmin || !institutionId) {
        setBranches([]);
        setSelectedBranchFilter([]);
        return;
      }
      try {
        const client = generateClient();
        const branchData = await client.graphql({
          query: listBranches,
          variables: {
            limit: 1000,
            filter: { institutionBranchesId: { eq: institutionId } },
          },
        });
        const items = branchData?.data?.listBranches?.items || [];
        console.log("[LoansDisplay] branches fetched:", items.length, items);
        setBranches(items);
        setSelectedBranchFilter([]);
      } catch (err) {
        console.error("LoansDisplay - Error fetching branches:", err);
        setBranches([]);
      }
    };
    if (userDetails) fetchBranchesForAdmin();
  }, [userDetails]);

  return (
    <>
      <WorkingOverlay
        open={workingOverlayOpen}
        message={workingOverlayMessage}
      />

      {/*  Page Header  */}
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
            Loans
          </Typography>
          <Typography
            sx={{
              fontSize: "0.75rem",
              color: sf.sf_textTertiary,
              mt: 0.15,
            }}
          >
            {loading
              ? "Loading..."
              : `${loans.length} total \u00B7 ${filteredLoans.length} shown`}
          </Typography>
        </Box>
        <Tooltip title="Refresh data" placement="top">
          <IconButton
            onClick={() => {
              hasFetchedRef.current = null;
              fetchLoans();
            }}
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
        </Tooltip>
      </Box>

      {/* Branch Filter (Admin only) */}
      {(userDetails?.userType || "").toLowerCase() === "admin" &&
        branches.length > 0 && (
          <BranchFilterWrapper
            branches={branches}
            onFilterChange={setSelectedBranchFilter}
            selectedCount={selectedBranchFilter.length}
          />
        )}

      {/*  KPI Cards  */}
      {!loading && (
        <Box
          sx={{
            display: "flex",
            gap: "14px",
            mb: "18px",
            flexWrap: "wrap",
          }}
        >
          <KpiCard
            icon={AssignmentOutlinedIcon}
            label="Total Loans"
            value={kpis.total}
            sf={sf}
          />
          <KpiCard
            icon={CheckCircleOutlineIcon}
            label="Active"
            value={kpis.active}
            accent={sf.sf_successBg}
            sf={sf}
          />
          <KpiCard
            icon={WarningAmberIcon}
            label="Overdue"
            value={kpis.overdue}
            accent={sf.sf_errorBg}
            sf={sf}
          />
          <KpiCard
            icon={AccountBalanceWalletOutlinedIcon}
            label="Portfolio"
            value={fmtCurrency(kpis.totalPrincipal)}
            sf={sf}
          />
          <KpiCard
            icon={TrendingUpIcon}
            label="Outstanding"
            value={fmtCurrency(kpis.totalOutstanding)}
            subValue={
              kpis.totalPrincipal > 0
                ? `${((kpis.totalOutstanding / kpis.totalPrincipal) * 100).toFixed(1)}% of portfolio`
                : undefined
            }
            accent={sf.sf_warningBg}
            sf={sf}
          />
        </Box>
      )}

      {/*  Search + Status Tabs  */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: "14px",
          flexWrap: "wrap",
        }}
      >
        {/* Search */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: sf.sf_searchBg,
            border: `1px solid ${sf.sf_searchBorder}`,
            borderRadius: 0,
            px: 1.2,
            py: 0.4,
            minWidth: 240,
            maxWidth: 340,
            flex: "1 1 240px",
            transition: "border-color 0.15s",
            "&:focus-within": { borderColor: sf.sf_searchFocusBorder },
          }}
        >
          <SearchIcon
            sx={{ fontSize: 18, color: sf.sf_textTertiary, mr: 0.8 }}
          />
          <InputBase
            placeholder="Search borrower, loan #, officer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              flex: 1,
              fontSize: "0.8rem",
              color: sf.sf_textPrimary,
              "& ::placeholder": {
                color: sf.sf_searchPlaceholder,
                opacity: 1,
              },
            }}
          />
        </Box>

        {/* Status filter tabs */}
        <Box sx={{ display: "flex", gap: 0.6, flexWrap: "wrap" }}>
          {STATUS_TABS.map((tab) => {
            const isActive = statusFilter === tab.key;
            const count = tabCounts[tab.key] ?? 0;
            return (
              <Chip
                key={tab.key}
                label={`${tab.label} (${count})`}
                size="small"
                onClick={() => setStatusFilter(tab.key)}
                sx={{
                  height: 26,
                  fontSize: "0.72rem",
                  fontWeight: isActive ? 700 : 500,
                  cursor: "pointer",
                  bgcolor: isActive ? sf.sf_tabActiveBg : sf.sf_tabInactiveBg,
                  color: isActive ? sf.sf_tabActiveText : sf.sf_tabInactiveText,
                  borderRadius: 0,
                  transition: "all 0.12s",
                  "&:hover": {
                    bgcolor: isActive ? sf.sf_tabActiveBg : sf.sf_tabHoverBg,
                  },
                  "& .MuiChip-label": { px: 1.2 },
                }}
              />
            );
          })}
        </Box>
      </Box>

      {/*  DataGrid with click-and-drag horizontal scroll  */}
      <Box
        sx={{
          boxShadow: sf.sf_shadowSm,
          transition: "box-shadow 0.15s, transform 0.15s",
          "&:hover": {
            boxShadow: sf.sf_shadowMd,
            transform: "translateY(-1px)",
          },
        }}
      >
        {/* Synchronized top scrollbar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
            px: 0.5,
            py: 0,
            minHeight: 24,
            bgcolor: sf.sf_tableHeaderBg,
            borderBottom: `1px solid ${sf.sf_borderLight}`,
          }}
        >
          <Button
            onClick={() => scrollTopBarBy(-220)}
            variant="outlined"
            sx={{
              minWidth: 22,
              width: 22,
              height: 18,
              p: 0,
              bgcolor: sf.sf_actionHoverBg,
              borderRadius: 0,
              "&:hover": { bgcolor: sf.sf_brandPrimary },
              mt: 0.5,
            }}
          >
            <KeyboardArrowLeftIcon sx={{ fontSize: 16 }} />
          </Button>
          <Box
            ref={topScrollRef}
            sx={{
              overflowX: "auto",
              overflowY: "hidden",
              flex: 1,
              height: 14,
              "&::-webkit-scrollbar": { height: 10 },
              "&::-webkit-scrollbar-track": {
                bgcolor: sf.sf_borderLight,
                borderRadius: 0,
              },
              "&::-webkit-scrollbar-thumb": {
                bgcolor: sf.sf_textTertiary,
                borderRadius: 0,
                "&:hover": { bgcolor: sf.sf_brandPrimary },
              },
            }}
          >
            <Box ref={topScrollInnerRef} sx={{ height: 1, minWidth: "100%" }} />
          </Box>
          <Button
            onClick={() => scrollTopBarBy(220)}
            variant="outlined"
            sx={{
              minWidth: 22,
              width: 22,
              height: 18,
              p: 0,
              bgcolor: sf.sf_actionHoverBg,
              borderRadius: 0,
              "&:hover": { bgcolor: sf.sf_brandPrimary },
              mt: 0.5,
            }}
          >
            <KeyboardArrowRightIcon sx={{ fontSize: 16 }} />
          </Button>
        </Box>
        <Box ref={gridDragContainerRef} sx={{ cursor: "grab" }}>
          <CustomDataGrid
            rows={filteredLoans}
            columns={columns}
            loading={loading}
            getRowId={(row) => row.id}
            pageSize={50}
            pageSizeOptions={[25, 50, 100]}
            rowHeight={91}
            showToolbar={false}
            sx={{
              borderRadius: 0,
              "& .MuiDataGrid-columnHeaderTitle": {
                fontSize: "0.74rem",
              },
              "& .MuiDataGrid-cell": {
                pt: 0.5,
                pb: 0,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                textAlign: "center",
              },
              "& .MuiDataGrid-cell[data-field='borrower']": {
                justifyContent: "flex-start",
                textAlign: "left",
              },
            }}
          />
        </Box>
      </Box>
    </>
  );
}
