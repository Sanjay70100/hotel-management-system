import api from "./axios";
import type { LoginResponse, User } from "../types";

// Login request data
export interface LoginCredentials {
  username: string;
  password: string;
}

// Authenticate a user
export const loginUser = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/auth/login",
    credentials
  );

  // Store the access token
  localStorage.setItem(
    "hotel_access_token",
    response.data.access_token
  );

  return response.data;
};

// Retrieve the currently authenticated user
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>("/auth/me");

  return response.data;
};

// Log out the current user
export const logoutUser = (): void => {
  localStorage.removeItem("hotel_access_token");
};