import React, { useContext } from "react";
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Button,
} from "@mui/material";
import {
  Close as CloseIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Add as AddIcon,
  List as ListIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import myLogo from "../../Resources/loantabs_logo.png";
import { CustomerContext } from "../../CustomerApp";

const CustomerMobileMenu = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { institutionId } = useParams();
  const { signOut, borrower } = useContext(CustomerContext);

  const hasBorrower = !!borrower;

  const menuItems = [
    {
      name: "My Profile",
      route: `/client/${institutionId}/profile`,
      icon: <PersonIcon sx={{ color: "white" }} />,
      disabled: false,
    },
    {
      name: "Apply for Loan",
      route: `/client/${institutionId}/apply`,
      icon: <AddIcon sx={{ color: "white" }} />,
      disabled: !hasBorrower,
    },
    {
      name: "My Loans",
      route: `/client/${institutionId}/loans`,
      icon: <ListIcon sx={{ color: "white" }} />,
      disabled: !hasBorrower,
    },
  ];

  const handleMenuItemClick = (route, disabled) => {
    if (!disabled && route) {
      navigate(route);
      onClose();
    }
  };

  const handleSignOut = () => {
    onClose();
    navigate("/");
    setTimeout(() => {
      if (signOut) signOut();
    }, 300);
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: 280,
          bgcolor: "#282828",
          color: "white",
        },
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header with Logo and Close Button */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            borderBottom: "1px solid #404040",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: "2rem",
                height: "2rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
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
            <Typography variant="h6" sx={{ fontWeight: 600, color: "white" }}>
              LoanTabs
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>
        </Box>

        {/* Menu Items */}
        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                key={item.name}
                button
                onClick={() => handleMenuItemClick(item.route, item.disabled)}
                disabled={item.disabled}
                sx={{
                  py: 1.5,
                  px: 2,
                  cursor: item.disabled ? "not-allowed" : "pointer",
                  opacity: item.disabled ? 0.5 : 1,
                  "&:hover": {
                    bgcolor: item.disabled
                      ? "transparent"
                      : "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  primaryTypographyProps={{
                    fontSize: "1rem",
                    fontWeight: 500,
                    sx: { color: "white" },
                  }}
                />
              </ListItem>
            ))}
          </List>

          {/* Info message for disabled items */}
          {!hasBorrower && (
            <Box sx={{ px: 2, mt: 2 }}>
              <Typography
                variant="caption"
                sx={{ color: "rgba(255,255,255,0.6)" }}
              >
                Complete your profile to access loan features
              </Typography>
            </Box>
          )}
        </Box>

        {/* Sign Out Button at Bottom */}
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid #404040",
            mt: "auto",
          }}
        >
          <Button
            fullWidth
            variant="outlined"
            startIcon={<LogoutIcon sx={{ color: "white" }} />}
            onClick={handleSignOut}
            sx={{
              color: "white",
              borderColor: "rgba(255, 255, 255, 0.3)",
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                borderColor: "rgba(255, 255, 255, 0.5)",
                bgcolor: "rgba(255, 255, 255, 0.05)",
              },
            }}
          >
            Sign Out
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default CustomerMobileMenu;
