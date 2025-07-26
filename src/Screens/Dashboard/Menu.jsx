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
} from "@mui/icons-material";

export const menuItems = [
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
        route: "/allBorrowers",
      },
    ],
  },
  {
    name: "Loans",
    icon: <AccountBalanceIcon sx={{ color: "white" }} />,
    expandable: true,
  },
  {
    name: "Team",
    icon: <GroupIcon sx={{ color: "white" }} />,
    expandable: true,
  },
  {
    name: "Accounts",
    icon: <WalletIcon sx={{ color: "white" }} />,
    expandable: true,
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
