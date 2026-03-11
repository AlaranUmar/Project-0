import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const { user, role, loading } = useAuth();
  if (loading) {
    return <p>loading...</p>;
  }
  if (!user || role === "customer") {
    return <Navigate to={"/login"} replace />;
  }
  return <Outlet />;
}
