import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Divider,
  Badge,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import myLogo from "../../Resources/loantabs_logo.png";
import { menuItems } from "./Menu";
import { useUnreadMessageCount } from "../Notifications";

const MobileMenu = ({ open, onClose }) => {
  const [expandedItems, setExpandedItems] = useState({});
  const navigate = useNavigate();
  const unreadCount = useUnreadMessageCount();

  const handleToggleExpand = (itemName) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  const handleMenuItemClick = (route) => {
    if (route) {
      navigate(route);
      onClose();
    }
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
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Menu Items */}
        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
          <List>
            {menuItems.map((item, index) => {
              if (item.expandable && item.children) {
                const isExpanded = expandedItems[item.name] || false;

                return (
                  <React.Fragment key={item.name}>
                    <ListItem
                      button
                      onClick={() => handleToggleExpand(item.name)}
                      sx={{
                        py: 1.5,
                        px: 2,
                        cursor: "pointer",
                        "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
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
                      {isExpanded ? (
                        <ExpandLess sx={{ color: "white" }} />
                      ) : (
                        <ExpandMore sx={{ color: "white" }} />
                      )}
                    </ListItem>
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {item.children.map((child, childIndex) => (
                          <ListItem
                            key={child.name}
                            button
                            onClick={() => handleMenuItemClick(child.route)}
                            sx={{
                              pl: 6,
                              py: 1,
                              cursor: "pointer",
                              "&:hover": {
                                bgcolor: "rgba(255, 255, 255, 0.1)",
                              },
                            }}
                          >
                            <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                              {child.icon}
                            </ListItemIcon>
                            <ListItemText
                              primary={child.name}
                              primaryTypographyProps={{
                                fontSize: "0.9rem",
                                sx: { color: "white" },
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  </React.Fragment>
                );
              }

              return (
                <ListItem
                  key={item.name}
                  button
                  onClick={() => handleMenuItemClick(item.route)}
                  sx={{
                    py: 1.5,
                    px: 2,
                    cursor: "pointer",
                    "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
                  }}
                >
                  <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                    {item.name === "Messages" && unreadCount > 0 ? (
                      <Badge badgeContent={unreadCount} color="error">
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )}
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
              );
            })}
          </List>
        </Box>
      </Box>
    </Drawer>
  );
};

export default MobileMenu;
