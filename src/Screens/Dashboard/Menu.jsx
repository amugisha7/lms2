import React from "react";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  AccountBalance as AccountBalanceIcon,
  AccountBalanceWallet as WalletIcon,
  Assessment as ReportsIcon,
  PersonAdd as PersonAddIcon,
  ListAlt as ListAltIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Badge as BadgeIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  ReceiptLong as ReceiptLongIcon,
  Savings as SavingsIcon,
  AccountBalanceWallet as AccountingIcon,
  Business as BusinessIcon,
  Shield as ShieldIcon,
  Group as GroupIcon,
  Tune as TuneIcon,
} from "@mui/icons-material";
import { REPORT_REGISTRY } from "../Reports/reportRegistry";

const reportMenuChildren = [
  {
    name: "All Reports",
    icon: <ListAltIcon sx={{ color: "white" }} />,
    route: "/reports",
  },
  ...REPORT_REGISTRY.map((report) => ({
    name: report.label,
    icon: <ListAltIcon sx={{ color: "white" }} />,
    route: report.route,
  })),
];

export const menuItems = [
  {
    name: "Dashboard",
    icon: <DashboardIcon sx={{ color: "white" }} />,
    route: "/",
  },
  {
    name: "Messages",
    icon: <NotificationsIcon sx={{ color: "white" }} />,
    route: "/messages",
  },
  {
    name: "Borrowers",
    icon: <PeopleIcon sx={{ color: "white" }} />,
    expandable: true,
    children: [
      {
        name: "View Borrowers",
        icon: <ListAltIcon sx={{ color: "white" }} />,
        route: "/borrowers",
      },
      {
        name: "Create Borrower",
        icon: <PersonAddIcon sx={{ color: "white" }} />,
        route: "/addBorrower",
        requiresPermission: { action: "create", resource: "borrower" },
      },
    ],
  },
  {
    name: "Loans",
    icon: <AccountBalanceIcon sx={{ color: "white" }} />,
    expandable: true,
    children: [
      {
        name: "View Loans",
        icon: <ListAltIcon sx={{ color: "white" }} />,
        route: "/loans",
      },
      {
        name: "Create Loan",
        icon: <PersonAddIcon sx={{ color: "white" }} />,
        route: "/add-loan",
        requiresPermission: { action: "create", resource: "loan" },
      },
      {
        name: "Loan Drafts",
        icon: <ListAltIcon sx={{ color: "white" }} />,
        route: "/loan-drafts",
      },
      {
        name: "Loan Calculator",
        icon: <ListAltIcon sx={{ color: "white" }} />,
        route: "/loan-calculator",
      },
    ],
  },
  {
    name: "Employees",
    icon: <BadgeIcon sx={{ color: "white" }} />,
    expandable: true,
    children: [
      {
        name: "View Employees",
        icon: <ListAltIcon sx={{ color: "white" }} />,
        route: "/employees",
      },
      {
        name: "Add Employee",
        icon: <PersonAddIcon sx={{ color: "white" }} />,
        route: "/employees/create",
        requiresPermission: { action: "create", resource: "employee" },
      },
    ],
  },
  {
    name: "Accounting",
    icon: <AccountingIcon sx={{ color: "white" }} />,
    expandable: true,
    children: [
      {
        name: "Cash Accounts",
        icon: <WalletIcon sx={{ color: "white" }} />,
        route: "/admin/accounts",
      },
      {
        name: "Expenses",
        icon: <ReceiptLongIcon sx={{ color: "white" }} />,
        route: "/expenses",
      },
      {
        name: "Other Income",
        icon: <SavingsIcon sx={{ color: "white" }} />,
        route: "/other-incomes",
      },
      {
        name: "Profit / Loss",
        icon: <ReportsIcon sx={{ color: "white" }} />,
        route: "/reports/profitability",
      },
    ],
  },
  {
    name: "Reports",
    icon: <ReportsIcon sx={{ color: "white" }} />,
    expandable: true,
    children: reportMenuChildren,
  },
  {
    name: "Admin",
    icon: <AdminPanelSettingsIcon sx={{ color: "white" }} />,
    expandable: true,
    adminOnly: true,
    children: [
      {
        name: "Loan Products",
        icon: <AccountBalanceIcon sx={{ color: "white" }} />,
        route: "/admin/loan-products",
        adminOnly: true,
      },
      {
        name: "Loan Fees",
        icon: <ReceiptLongIcon sx={{ color: "white" }} />,
        route: "/admin/loan-fees",
        adminOnly: true,
      },
      {
        name: "Branches",
        icon: <BusinessIcon sx={{ color: "white" }} />,
        route: "/admin/branches",
        adminOnly: true,
      },
      {
        name: "Securities",
        icon: <ShieldIcon sx={{ color: "white" }} />,
        route: "/admin/securities",
        adminOnly: true,
      },
      {
        name: "Users",
        icon: <GroupIcon sx={{ color: "white" }} />,
        route: "/users",
        adminOnly: true,
      },
      {
        name: "Custom Fields",
        icon: <TuneIcon sx={{ color: "white" }} />,
        route: "/customFields",
        adminOnly: true,
      },
    ],
  },
  {
    name: "Settings",
    icon: <SettingsIcon sx={{ color: "white" }} />,
    route: "/settings",
  },
];
