import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import { useAuth } from "../hooks/useAuth";
import type { User } from "../types";
import type { LoginCredentials } from "../api/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  login: (credentials: LoginCredentials) => Promise<User>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const auth = useAuth();

  const contextValue = useMemo<AuthContextType>(
    () => ({
      user: auth.user,
      loading: auth.loading,
      error: auth.error,
      isAuthenticated: auth.isAuthenticated,
      login: auth.login,
      logout: auth.logout,
      checkAuth: auth.checkAuth,
    }),
    [
      auth.user,
      auth.loading,
      auth.error,
      auth.isAuthenticated,
      auth.login,
      auth.logout,
      auth.checkAuth,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Access authentication information from any component
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthProvider."
    );
  }

  return context;
};