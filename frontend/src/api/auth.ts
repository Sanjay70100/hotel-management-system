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
  let response;

  try {
    // Attempt standard JSON payload first
    response = await api.post<LoginResponse>("/api/auth/login", credentials);
  } catch (err: unknown) {
    // Fallback if needed
    throw err;
  }

  // Extract access token regardless of backend key naming
  const token =
    response.data.access_token ||
    response.data.accessToken ||
    response.data.token;

  if (token) {
    localStorage.setItem("hotel_access_token", token);
  }
  if (response.data.username) {
    localStorage.setItem(
      "hotel_user",
      JSON.stringify({
        id: response.data.id,
        username: response.data.username,
        role: response.data.role,
      })
    );
  }

  return response.data;
};

// Retrieve the currently authenticated user
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get<User>("/api/auth/me");
    return response.data;
  } catch {
    const cached = localStorage.getItem("hotel_user");
    if (cached) {
      return JSON.parse(cached);
    }
    throw new Error("User not authenticated");
  }
};

// Log out the current user
export const logoutUser = (): void => {
  localStorage.removeItem("hotel_access_token");
};