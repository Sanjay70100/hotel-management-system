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
    response = await api.post<LoginResponse>("/auth/login", credentials);
  } catch (err: unknown) {
    // If FastAPI endpoint expects OAuth2 password form (application/x-www-form-urlencoded)
    const status = (err as { response?: { status?: number } })?.response?.status;
    if (status === 422) {
      const formData = new URLSearchParams();
      formData.append("username", credentials.username);
      formData.append("password", credentials.password);

      response = await api.post<LoginResponse>("/auth/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
    } else {
      throw err;
    }
  }

  // Extract access token regardless of backend key naming
  const token =
    response.data.access_token ||
    response.data.accessToken ||
    response.data.token;

  if (token) {
    localStorage.setItem("hotel_access_token", token);
  }

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