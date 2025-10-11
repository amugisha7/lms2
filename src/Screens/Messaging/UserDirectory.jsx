import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
  Typography,
  CircularProgress,
  Divider,
  InputAdornment,
  Chip,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import { generateClient } from "aws-amplify/api";
import { UserContext } from "../../App";
import { LIST_USERS_IN_INSTITUTION_QUERY } from "./messagingQueries";
import { getUserDisplayName } from "./messageUtils";

const client = generateClient();

const UserDirectory = ({ onSelectUser, selectedUserId }) => {
  const { userDetails } = useContext(UserContext);
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!hasFetchedRef.current && userDetails?.institutionUsersId) {
      fetchUsers();
      hasFetchedRef.current = true;
    }
  }, [userDetails?.institutionUsersId]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log("API Call: LIST_USERS_IN_INSTITUTION_QUERY", {
        institutionUsersId: userDetails.institutionUsersId,
      });
      const response = await client.graphql({
        query: LIST_USERS_IN_INSTITUTION_QUERY,
        variables: {
          filter: {
            institutionUsersId: { eq: userDetails.institutionUsersId },
            status: { eq: "active" },
          },
          limit: 100,
        },
      });

      // Filter out current user
      const allUsers = response.data.listUsers.items.filter(
        (u) => u.id !== userDetails.id
      );

      setUsers(allUsers);
      setFilteredUsers(allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.firstName?.toLowerCase().includes(term) ||
        user.lastName?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.userType?.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const getUserInitials = (user) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return "?";
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Select Recipient
        </Typography>
        <TextField
          fullWidth
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Divider />
      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        {filteredUsers.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography color="text.secondary">
              {searchTerm ? "No users found" : "No users available"}
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {filteredUsers.map((user) => (
              <React.Fragment key={user.id}>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={selectedUserId === user.id}
                    onClick={() => onSelectUser(user)}
                    sx={{
                      "&:hover": {
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "rgba(240, 135, 53, 0.08)"
                            : "rgba(221, 98, 26, 0.06)",
                        "& .MuiListItemText-primary": {
                          color:
                            theme.palette.mode === "dark"
                              ? "#fff"
                              : theme.palette.text.primary,
                        },
                        "& .MuiListItemText-secondary": {
                          color:
                            theme.palette.mode === "dark"
                              ? theme.palette.grey[300]
                              : theme.palette.text.secondary,
                        },
                      },
                      "&.Mui-selected": {
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "rgba(240, 135, 53, 0.4)"
                            : "rgba(221, 98, 26, 0.4)",
                        "&:hover": {
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "rgba(240, 135, 53, 0.4)"
                              : "rgba(221, 98, 26, 0.4)",
                        },
                        "& .MuiListItemText-primary": {
                          color:
                            theme.palette.mode === "dark"
                              ? "#f08735"
                              : "#dd621a",
                          fontWeight: 600,
                        },
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        {getUserInitials(user)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={getUserDisplayName(user)}
                      slotProps={{ secondary: { component: "div" } }}
                      secondary={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: 0.5,
                          }}
                        >
                          {user.userType && (
                            <Chip
                              label={user.userType}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default UserDirectory;
