import React, { useContext } from "react";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Person as PersonIcon,
  Add as AddIcon,
  List as ListIcon,
  Calculate as CalculateIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import myLogo from "../../Resources/loantabs_logo.png";
import { CustomerContext } from "../../CustomerApp";

const CustomerSideBar = ({ open = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { institutionId } = useParams();
  const { borrower } = useContext(CustomerContext);

  const hasBorrower = !!borrower;

  const menuItems = [
    {
      name: "My Profile",
      route: `/client/${institutionId}/profile`,
      icon: <PersonIcon sx={{ color: "white" }} />,
      disabled: false,
    },
    {
      name: "Loan Calculator",
      route: `/client/${institutionId}/calculator`,
      icon: <CalculateIcon sx={{ color: "white" }} />,
      disabled: false,
    },
    {
      name: "Apply for Loan",
      route: `/client/${institutionId}/apply`,
      icon: <AddIcon sx={{ color: "white" }} />,
      disabled: !hasBorrower,
    },
    {
      name: "My Applications",
      route: `/client/${institutionId}/applications`,
      icon: <AssignmentIcon sx={{ color: "white" }} />,
      disabled: !hasBorrower,
    },
    {
      name: "My Loans",
      route: `/client/${institutionId}/loans`,
      icon: <ListIcon sx={{ color: "white" }} />,
      disabled: !hasBorrower,
    },
  ];

  return (
    <Box
      sx={{
        width: 220,
        minWidth: 220,
        flexShrink: 0,
        bgcolor: "#1B1B1B",
        color: "white",
        display: open ? "flex" : "none",
        flexDirection: "column",
        transition: "all 0.3s",
        overflowY: "auto",
        height: "100vh",
        borderRight: "1px solid #e0e0e0",
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          mt: 2,
          ml: 2,
        }}
      >
        <Box
          sx={{
            width: "2rem",
            height: "2rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            overflow: "hidden",
          }}
        >
          <img
            src={myLogo}
            alt="LoanTabs Logo"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
            }}
          />
        </Box>
        <Typography
          variant="body"
          noWrap
          component="div"
          sx={{ mr: 3, display: { xs: "none", sm: "block" }, color: "white" }}
        >
          LoanTabs
        </Typography>
      </Box>

      {/* Menu Section */}
      <Box sx={{ mt: 4 }}>
        <List dense>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.route;

            return (
              <ListItemButton
                key={item.name}
                onClick={() => !item.disabled && navigate(item.route)}
                disabled={item.disabled}
                sx={{
                  pl: 3,
                  pr: 2,
                  py: 1.5,
                  bgcolor: isActive
                    ? "rgba(255, 255, 255, 0.1)"
                    : "transparent",
                  "&:hover": {
                    bgcolor: item.disabled
                      ? "transparent"
                      : "rgba(255, 255, 255, 0.05)",
                  },
                  opacity: item.disabled ? 0.5 : 1,
                  cursor: item.disabled ? "not-allowed" : "pointer",
                }}
              >
                <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  primaryTypographyProps={{
                    fontSize: "0.9rem",
                    fontWeight: isActive ? 600 : 400,
                    color: "white",
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* Info message for disabled items */}
      {!hasBorrower && (
        <Box sx={{ px: 2, mt: 2 }}>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)" }}>
            Complete your profile to access loan features
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CustomerSideBar;
