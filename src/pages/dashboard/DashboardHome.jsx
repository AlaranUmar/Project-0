import { useAuth } from "@/context/AuthContext";
import OwnerDashboard from "../Owner/OwnerDashboard";
import ManagerDashboard from "../Manager/ManagerDashboard";
// import CashierDashboard from "../Cashier/CashierDashboard";

export default function DashboardHome() {
  const { role, profile } = useAuth();

  if (role === "owner" || role === "admin")
    return <OwnerDashboard profile={profile} />;
  if (role === "manager") return <ManagerDashboard profile={profile} />;
  // if (role === "cashier") return <CashierDashboard profile={profile} />;

  return null;
}
