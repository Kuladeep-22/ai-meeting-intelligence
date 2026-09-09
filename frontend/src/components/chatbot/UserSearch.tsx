import {
  Box,
  TextField,
  List,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Typography,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";

import { usersApi, UserOption } from "../../api/usersApi";
import { useAuthStore } from "../../store/authStore";

interface UserSearchProps {
  onUserSelect: (user: UserOption) => void;
}

const UserSearch = ({ onUserSelect }: UserSearchProps) => {
  const [searchQuery, setSearchQuery] =
    useState("");
  const [users, setUsers] =
    useState<UserOption[]>([]);
  const [filteredUsers, setFilteredUsers] =
    useState<UserOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] =
    useState(false);

  const currentUser = useAuthStore(
    (state) => state.user
  );

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setShowDropdown(false);
      return;
    }

    const loadUsers = async () => {
      try {
        setLoading(true);
        const response =
          await usersApi.getUsers();
        setUsers(response.data);
      } catch (error) {
        console.error(
          "Failed to load users:",
          error
        );
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers([]);
      return;
    }

    const query = searchQuery
      .toLowerCase()
      .trim();
    const filtered = users
      .filter(
        (user) =>
          user.full_name
            .toLowerCase()
            .includes(query) ||
          user.email
            .toLowerCase()
            .includes(query)
      )
      .filter(
        (user) =>
          user.id !== currentUser?.id
      );

    setFilteredUsers(filtered);
    setShowDropdown(filtered.length > 0);
  }, [searchQuery, users, currentUser?.id]);

  const handleUserClick = (user: UserOption) => {
    onUserSelect(user);
    setSearchQuery("");
    setShowDropdown(false);
  };

  return (
    <Box sx={{ position: "relative" }}>
      <TextField
        fullWidth
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) =>
          setSearchQuery(e.target.value)
        }
        onFocus={() =>
          searchQuery.trim() !== "" &&
          setShowDropdown(true)
        }
        size="small"
        sx={{ mb: 2 }}
      />

      {showDropdown && (
        <Box
          sx={{
            position: "absolute",
            top: 45,
            left: 0,
            right: 0,
            backgroundColor: "white",
            border: "1px solid #ddd",
            borderRadius: 1,
            maxHeight: 300,
            overflowY: "auto",
            zIndex: 10,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 2,
                minHeight: 60,
              }}
            >
              <CircularProgress size={24} />
            </Box>
          ) : filteredUsers.length === 0 ? (
            <Box sx={{ padding: 2 }}>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                No users found
              </Typography>
            </Box>
          ) : (
            <List>
              {filteredUsers.map((user) => (
                <div key={user.id}>
                  <ListItemButton
                    onClick={() =>
                      handleUserClick(user)
                    }
                  >
                    <ListItemText
                      primary={
                        user.full_name
                      }
                      secondary={user.email}
                    />
                  </ListItemButton>
                  <Divider />
                </div>
              ))}
            </List>
          )}
        </Box>
      )}
    </Box>
  );
};

export default UserSearch;
