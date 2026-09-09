import {
  Box,
  TextField,
  List,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Typography,
  Divider,
  Alert,
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
  const [error, setError] = useState<string | null>(
    null
  );
  const [usersLoaded, setUsersLoaded] =
    useState(false);

  const currentUser = useAuthStore(
    (state) => state.user
  );

  // Load users once when component mounts
  useEffect(() => {
    const loadAllUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response =
          await usersApi.getUsers();

        console.log(
          "Users API response:",
          response
        );

        if (response.data && Array.isArray(response.data)) {
          setUsers(response.data);
          console.log(
            `Loaded ${response.data.length} users`
          );
        } else {
          throw new Error(
            "Invalid response format"
          );
        }

        setUsersLoaded(true);
      } catch (err) {
        const errorMsg =
          err instanceof Error
            ? err.message
            : "Failed to load users";

        console.error(
          "Users API error:",
          err
        );

        setError(errorMsg);
        setUsers([]);
        setUsersLoaded(true);
      } finally {
        setLoading(false);
      }
    };

    loadAllUsers();
  }, []);

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers([]);
      setShowDropdown(false);
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

    console.log(
      `Filtered ${filtered.length} users for query "${searchQuery}"`
    );
  }, [searchQuery, users, currentUser?.id]);

  const handleUserClick = (user: UserOption) => {
    onUserSelect(user);
    setSearchQuery("");
    setShowDropdown(false);
  };

  return (
    <Box sx={{ position: "relative" }}>
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {!usersLoaded ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 2,
            minHeight: 40,
          }}
        >
          <CircularProgress size={20} />
          <Typography
            variant="body2"
            sx={{ ml: 1 }}
          >
            Loading users...
          </Typography>
        </Box>
      ) : users.length === 0 ? (
        <Alert severity="info">
          No registered users found. Please
          ensure users have registered in the
          application.
        </Alert>
      ) : (
        <>
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
                top: 85,
                left: 0,
                right: 0,
                backgroundColor: "white",
                border: "1px solid #ddd",
                borderRadius: 1,
                maxHeight: 300,
                overflowY: "auto",
                zIndex: 10,
                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.15)",
              }}
            >
              {filteredUsers.length === 0 ? (
                <Box sx={{ padding: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    No users match your search
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
                          secondary={
                            user.email
                          }
                        />
                      </ListItemButton>
                      <Divider />
                    </div>
                  ))}
                </List>
              )}
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default UserSearch;
