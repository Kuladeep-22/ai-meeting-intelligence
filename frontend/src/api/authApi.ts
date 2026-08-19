import api from "./axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
}

export const authApi = {

  register: (data: RegisterPayload) =>
    api.post("/auth/register", data),

  login: (data: LoginPayload) =>
    api.post("/auth/login", data),

  logout: () =>
    api.post("/auth/logout"),

  refreshToken: () =>
    api.post("/auth/refresh"),

  getCurrentUser: () =>
    api.get("/auth/me"),
};