import { useAuth } from "@/context/AuthContext";
import CashierSalesPage from "../Cashier/CashierSalesPage";
import OwnerSalesPage from "../Owner/OwnerSalesPage";
import ManagerSalesPage from "../Manager/ManagerSalesPage";

export default function SalesPage() {
  const { role } = useAuth();

    if (role === "owner") return <OwnerSalesPage />;
  //   if (role === "admin") return <AdminDashboard />;
    if (role === "manager") return <ManagerSalesPage />;
  if (role === "cashier") return <CashierSalesPage />;

  return null;
}
