import React from "react";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  AccountBalance as AccountBalanceIcon,
  Group as GroupIcon,
  AccountBalanceWallet as WalletIcon,
  Assessment as ReportsIcon,
  PersonAdd as PersonAddIcon,
  ListAlt as ListAltIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Badge as BadgeIcon,
  Work as WorkIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

export const menuItems = [
  {
    name: "Notifications",
    icon: <NotificationsIcon sx={{ color: "white" }} />,
    route: "/messages",
  },

  {
    name: "Dashboard",
    icon: <DashboardIcon sx={{ color: "white" }} />,
    active: true,
  },
  {
    name: "Borrowers",
    icon: <PeopleIcon sx={{ color: "white" }} />,
    expandable: true,
    children: [
      {
        name: "Create Borrower",
        icon: <PersonAddIcon sx={{ color: "white" }} />,
        route: "/addBorrower",
        requiresPermission: { action: "create", resource: "borrower" },
      },
      {
        name: "View Borrowers",
        icon: <ListAltIcon sx={{ color: "white" }} />,
        route: "/borrowers",
      },
    ],
  },
  {
    name: "Loans",
    icon: <AccountBalanceIcon sx={{ color: "white" }} />,
    expandable: true,
    children: [
      {
        name: "Create Loan",
        icon: <PersonAddIcon sx={{ color: "white" }} />,
        route: "/add-loan",
        requiresPermission: { action: "create", resource: "loan" },
      },
      {
        name: "View Loans",
        icon: <ListAltIcon sx={{ color: "white" }} />,
        route: "/loans",
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
      {
        name: "Loan Fees",
        icon: <ListAltIcon sx={{ color: "white" }} />,
        route: "/admin/loan-fees",
      },
    ],
  },
  {
    name: "Team",
    icon: <GroupIcon sx={{ color: "white" }} />,
    expandable: true,
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
      {
        name: "Employee Management",
        icon: <WorkIcon sx={{ color: "white" }} />,
        route: "/employees",
      },
    ],
  },
  {
    name: "Users",
    icon: <GroupIcon sx={{ color: "white" }} />,
    route: "/users",
  },
  {
    name: "Accounts",
    icon: <WalletIcon sx={{ color: "white" }} />,
    route: "/admin/accounts",
  },
  {
    name: "Reports",
    icon: <ReportsIcon sx={{ color: "white" }} />,
    expandable: true,
    children: [
      {
        name: "All Reports",
        icon: <ListAltIcon sx={{ color: "white" }} />,
        route: "/reports",
      },
      {
        name: "Portfolio Overview",
        icon: <ListAltIcon sx={{ color: "white" }} />,
        route: "/reports/portfolio-overview",
      },
      {
        name: "Delinquency",
        icon: <ListAltIcon sx={{ color: "white" }} />,
        route: "/reports/delinquency",
      },
      {
        name: "Aging Analysis",
        icon: <ListAltIcon sx={{ color: "white" }} />,
        route: "/reports/aging-analysis",
      },
      {
        name: "PAR Summary",
        icon: <ListAltIcon sx={{ color: "white" }} />,
        route: "/reports/par-summary",
      },
      {
        name: "Provisions",
        icon: <ListAltIcon sx={{ color: "white" }} />,
        route: "/reports/provisions",
      },
      {
        name: "Disbursement",
        icon: <ListAltIcon sx={{ color: "white" }} />,
        route: "/reports/disbursement",
      },
      {
        name: "Repayment Schedules",
        icon: <ListAltIcon sx={{ color: "white" }} />,
        route: "/reports/repayment-schedules",
      },
      {
        name: "Loans by Officer",
        icon: <ListAltIcon sx={{ color: "white" }} />,
        route: "/reports/active-loans-by-officer",
      },
      {
        name: "Concentrations",
        icon: <ListAltIcon sx={{ color: "white" }} />,
        route: "/reports/concentrations",
      },
      {
        name: "Interest & Penalty",
        icon: <ListAltIcon sx={{ color: "white" }} />,
        route: "/reports/interest-and-penalty",
      },
      {
        name: "Write-Off & Recovery",
        icon: <ListAltIcon sx={{ color: "white" }} />,
        route: "/reports/write-off-and-recovery",
      },
    ],
  },
  {
    name: "Admin",
    icon: <AdminPanelSettingsIcon sx={{ color: "white" }} />,
    route: "/admin",
  },
  {
    name: "Settings",
    icon: <SettingsIcon sx={{ color: "white" }} />,
    route: "/settings",
  },
];
