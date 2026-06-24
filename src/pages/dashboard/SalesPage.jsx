import { useAuth } from "@/context/AuthContext";
import CashierSalesPage from "../Cashier/CashierSalesPage";
import OwnerSalesPage from "../Owner/OwnerSalesPage";

export default function SalesPage() {
  const { role } = useAuth();

  if (role === "owner" || role === "admin" || role === "manager")
    return <OwnerSalesPage />;
  if (role === "cashier") return <CashierSalesPage />;

  return null;
}
