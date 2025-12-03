import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleRoute({ allow = [] }) {
  const { isLoggedIn, hasRole } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  const ok = allow.some((r) => hasRole(r));
  return ok ? <Outlet /> : <Navigate to="/" replace />;
}
