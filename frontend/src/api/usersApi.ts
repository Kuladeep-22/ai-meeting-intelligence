import api from "./axios";

export interface UserOption {
  id: number;
  full_name: string;
  email: string;
}

export const usersApi = {
  getUsers: () => api.get<UserOption[]>("/users"),
};
