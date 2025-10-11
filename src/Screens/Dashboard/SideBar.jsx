import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Badge,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import myLogo from "../../Resources/loantabs_logo.png";
import { menuItems } from "./Menu";
import { UserContext } from "../../App";
import { useUnreadMessageCount } from "../Messaging";

const SideBar = ({ open = true, onClose }) => {
  const [expandedItems, setExpandedItems] = useState({});
  const navigate = useNavigate();
  const { user, userDetails } = React.useContext(UserContext);
  const unreadCount = useUnreadMessageCount();

  const handleToggleExpand = (itemName) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

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
      {/* LoanTabs Logo */}
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
          sx={{ mr: 3, display: { xs: "none", sm: "block" } }}
        >
          LoanTabs
        </Typography>
      </Box>

      {/* Menu Section */}
      <Box sx={{ mt: 4 }}>
        <List dense>
          {menuItems.map((item, index) => {
            if (item.expandable && item.children) {
              const isExpanded = expandedItems[item.name] || false;

              return (
                <React.Fragment key={item.name}>
                  <ListItemButton
                    onClick={() => handleToggleExpand(item.name)}
                    sx={{
                      mb: 0.5,
                      px: 3,
                      cursor: "pointer",
                      "&:hover": { bgcolor: "#000" },
                    }}
                  >
                    <ListItemIcon sx={{ color: "white", minWidth: 36 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.name}
                      primaryTypographyProps={{
                        fontSize: "0.875rem",
                        sx: { color: "white" },
                      }}
                    />
                    {isExpanded ? (
                      <ExpandLess sx={{ color: "white" }} />
                    ) : (
                      <ExpandMore sx={{ color: "white" }} />
                    )}
                  </ListItemButton>
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding dense>
                      {item.children.map((child, childIndex) => (
                        <ListItemButton
                          key={child.name}
                          onClick={() => child.route && navigate(child.route)}
                          sx={{
                            pl: 6,
                            mb: 0.5,
                            color: "white",
                            cursor: "pointer",
                            "&:hover": { bgcolor: "#000" },
                          }}
                        >
                          <ListItemIcon sx={{ color: "white", minWidth: 36 }}>
                            {child.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={child.name}
                            primaryTypographyProps={{
                              fontSize: "0.85rem",
                              sx: { color: "white" },
                            }}
                          />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                </React.Fragment>
              );
            }

            return (
              <ListItemButton
                key={item.name}
                onClick={() => item.route && navigate(item.route)}
                sx={{
                  mb: 0.5,
                  px: 3,
                  cursor: "pointer",
                  "&:hover": { bgcolor: "#000" },
                }}
              >
                <ListItemIcon sx={{ color: "white", minWidth: 36 }}>
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
                    fontSize: "0.875rem",
                    sx: { color: "white" },
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
        <Box>
          <Typography variant="body2" sx={{ color: "white" }}>
            Email: {user?.signInDetails?.loginId || "N/A"}
          </Typography>
          <Typography variant="body2" sx={{ color: "white" }}>
            User Type: {userDetails?.userType || "N/A"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SideBar;
