import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuthContext } from "../../context/AuthContext";
import LoadingSpinner from "../common/LoadingSpinner";

interface ProtectedRouteProps {
  allowedRoles?: Array<"admin" | "staff" | "guest">;
}

const ProtectedRoute = ({
  allowedRoles,
}: ProtectedRouteProps) => {
  const { user, loading, isAuthenticated } = useAuthContext();
  const location = useLocation();

  // Wait until the authentication check finishes.
  if (loading) {
    return (
      <LoadingSpinner
        fullscreen
        message="Verifying your session..."
      />
    );
  }

  // Redirect unauthenticated users to login.
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Redirect users who do not have the required role.
  if (
    allowedRoles &&
    !allowedRoles.some(
      (role) => role.toLowerCase() === (user.role ?? "").toLowerCase()
    )
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  // Allow access to the requested page.
  return <Outlet />;
};

export default ProtectedRoute;