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
        route: "/admin/add-loan",
      },
      {
        name: "View Loans",
        icon: <ListAltIcon sx={{ color: "white" }} />,
        route: "/admin/loans",
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
      },
      {
        name: "Employee Management",
        icon: <WorkIcon sx={{ color: "white" }} />,
        route: "/employees/manage",
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
  },
  {
    name: "Admin",
    icon: <AdminPanelSettingsIcon sx={{ color: "white" }} />,
    route: "/admin",
  },
];
