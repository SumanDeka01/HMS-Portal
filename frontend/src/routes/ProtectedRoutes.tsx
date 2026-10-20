import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth, type UserRole } from "../context/AuthContext";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(user.role)) {
    if (user.role === "student") {
      return <Navigate to="/student/dashboard" replace />;
    }

    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (user.role === "security") {
      return <Navigate to="/security/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
