import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "https://ai-meeting-api-z144.onrender.com/api/v1";

const api = axios.create({
  baseURL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

if (!import.meta.env.VITE_API_URL) {
  console.warn("VITE_API_URL not set, using default:", baseURL);
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
    }

    return Promise.reject(error);
  }
);

export default api;