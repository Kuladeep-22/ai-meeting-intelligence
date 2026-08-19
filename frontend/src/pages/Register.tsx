import { useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Box,
  Link,
  Alert,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await register(
        fullName.trim(),
        email.trim(),
        password
      );

      console.log("Registration result:", result);

      if (result.success) {
        navigate("/login");
      } else {
        setError(result.error || "Registration failed");
      }
    } catch (err: any) {
      console.error("Registration error:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        "Registration failed";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{
        maxWidth: 450,
        width: "100%",
        mx: "auto",
        p: 4,
        borderRadius: 3,
      }}
    >
      <Typography variant="h4" mb={0.5}>
        Create an account
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={3}>
        Join your team's meeting workspace
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={2}>
        <TextField
          label="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={loading}
          fullWidth
        />

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          fullWidth
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          fullWidth
        />

        <Button
          variant="contained"
          onClick={handleRegister}
          disabled={loading}
          fullWidth
        >
          {loading ? "Registering..." : "Register"}
        </Button>

        <Box textAlign="center">
          <Typography variant="body2">
            Already have an account?{" "}
            <Link
              component={RouterLink}
              to="/login"
              sx={{ cursor: "pointer" }}
            >
              Login here
            </Link>
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

export default Register;