import { useAuth } from "@/context/AuthContext";
import OwnerReportsPage from "../Owner/OwnerReportsPage";
import ManagerReportsPage from "../Manager/ManagerReportsPage";

export default function ReportsPage() {
  const { role} = useAuth();

    if (role === "owner") return <OwnerReportsPage />;
  //   if (role === "admin") return <AdminDashboard profile={profile} />;
    if (role === "manager") return <ManagerReportsPage />;
  // if (role === "cashier") return <CashierSalesPage profile={profile} />;

  return null;
}
