import React, { useState, useEffect, useContext } from "react";
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
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [userDetails?.institutionUsersId]);

  const fetchUsers = async () => {
    if (!userDetails?.institutionUsersId) return;

    try {
      setLoading(true);
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
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        {getUserInitials(user)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={getUserDisplayName(user)}
                      secondary={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: 0.5,
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ flexGrow: 1 }}
                          >
                            {user.email}
                          </Typography>
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
