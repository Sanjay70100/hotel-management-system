import { useCallback, useEffect, useState } from "react";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
} from "../api/auth";
import type { LoginCredentials } from "../api/auth";
import type { User } from "../types";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check the current authentication status
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("hotel_access_token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setError(null);
    } catch {
      logoutUser();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check authentication when the hook is initialized
  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  // Log in a user
  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);

    try {
      await loginUser(credentials);

      const currentUser = await getCurrentUser();
      setUser(currentUser);

      return currentUser;
    } catch (err) {
      logoutUser();

      const message =
        "Login failed. Please check your credentials and try again.";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Log out the current user
  const logout = () => {
    logoutUser();
    setUser(null);
    setError(null);
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: user !== null,
    login,
    logout,
    checkAuth,
  };
};