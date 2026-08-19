import { authApi } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

export const useAuth = () => {
  const {
    user,
    token,
    setUser,
    setToken,
    logout,
  } = useAuthStore();

  // ==================================================
  // REGISTER
  // ==================================================

  const register = async (
    fullName: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await authApi.register({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
      });

      console.log(
        "REGISTER RESPONSE:",
        response.data
      );

      // Store token only if backend returns one
      if (response.data?.access_token) {
        setToken(response.data.access_token);
      }

      // Store user if backend returns user
      if (response.data?.user) {
        setUser(response.data.user);
      }

      return {
        success: true,
        message:
          response.data?.message ||
          "Registration successful",
        data: response.data,
      };

    } catch (error: any) {
      console.error(
        "REGISTER ERROR:",
        error.response?.status,
        error.response?.data ||
          error.message
      );

      return {
        success: false,
        error:
          error.response?.data?.detail ||
          error.response?.data?.message ||
          "Registration failed",
      };
    }
  };

  // ==================================================
  // LOGIN
  // ==================================================

  const login = async (
    email: string,
    password: string
  ) => {
    try {
      const response = await authApi.login({
        email: email.trim(),
        password,
      });

      console.log(
        "LOGIN RESPONSE:",
        response.data
      );

      const accessToken =
        response.data?.access_token;

      // Make sure backend returned JWT
      if (!accessToken) {
        console.error(
          "Login succeeded but access_token is missing"
        );

        return {
          success: false,
          error: "Access token not returned",
        };
      }

      // Store JWT
      setToken(accessToken);

      // Store logged-in user
      if (response.data?.user) {
        setUser(response.data.user);
      }

      console.log(
        "LOGIN SUCCESS - TOKEN STORED"
      );

      return {
        success: true,
        message:
          response.data?.message ||
          "Login successful",
        data: response.data,
      };

    } catch (error: any) {
      console.error(
        "LOGIN ERROR:",
        error.response?.status,
        error.response?.data ||
          error.message
      );

      return {
        success: false,
        error:
          error.response?.data?.detail ||
          error.response?.data?.message ||
          "Login failed",
      };
    }
  };

  // ==================================================
  // RETURN
  // ==================================================

  return {
    user,
    token,
    register,
    login,
    logout,
  };
};