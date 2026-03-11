import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
  const { user, role, loading } = useAuth();
  if (loading) {
    return <p>loading...</p>;
  }
  if (user && role && role !== "customer") {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
