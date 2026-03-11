import { useAuth } from "@/context/AuthContext";
import CashierSalesPage from "../Cashier/CashierSalesPage";

export default function SalesPage() {
  const { role, profile } = useAuth();

  //   if (role === "owner") return <OwnerDashboard profile={profile} />;
  //   if (role === "admin") return <AdminDashboard profile={profile} />;
  //   if (role === "manager") return <ManagerDashboard profile={profile} />;
  if (role === "cashier") return <CashierSalesPage profile={profile} />;

  return null;
}
