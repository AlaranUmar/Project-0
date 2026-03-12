import { useAuth } from "@/context/AuthContext";
import OwnerReportsPage from "../Owner/OwnerReportsPage";

export default function ReportsPage() {
  const { role, profile } = useAuth();

    if (role === "owner") return <OwnerReportsPage />;
  //   if (role === "admin") return <AdminDashboard profile={profile} />;
  //   if (role === "manager") return <ManagerDashboard profile={profile} />;
  if (role === "cashier") return <CashierSalesPage profile={profile} />;

  return null;
}
