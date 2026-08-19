import { useState, FormEvent } from "react";
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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Clear previous error
    setError("");

    // Validate fields
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);

    try {
      const result = await login(
        email.trim(),
        password
      );

      console.log("Login result:", result);

      if (result.success) {
        // Login successful
        navigate("/");
      } else {
        // Your useAuth returns `error`, not `message`
        setError(result.error || "Login failed");
      }
    } catch (error: any) {
      console.error("Login page error:", error);

      setError(
        error?.response?.data?.detail ||
        "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{
        maxWidth: 400,
        width: "100%",
        mx: "auto",
        p: 4,
        borderRadius: 3,
      }}
    >
      <Typography variant="h4" mb={0.5}>
        Welcome back
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={3}>
        Sign in to continue to your workspace
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleLogin}
      >
        <Stack spacing={2}>

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            fullWidth
            autoComplete="email"
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            fullWidth
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            fullWidth
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          <Box textAlign="center">
            <Typography variant="body2">
              Don't have an account?{" "}
              <Link
                component={RouterLink}
                to="/register"
                sx={{ cursor: "pointer" }}
              >
                Register here
              </Link>
            </Typography>
          </Box>

        </Stack>
      </Box>
    </Paper>
  );
};

export default Login;