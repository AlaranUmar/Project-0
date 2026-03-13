import { useAuth } from "@/context/AuthContext";
import OwnerProductsPage from "../Owner/OwnerProductsPage";
import AdminProductsPage from "../Admin/AdminProductsPage";
import ManagerProductsPage from "../Manager/ManagerProductsPage";
import CashierProductsPage from "../Cashier/CashierProductsPage";

export default function ProductsPage() {
  const { role, profile } = useAuth();
  
  
  if (role === "owner") return <OwnerProductsPage profile={profile}/>;
  if (role === "admin") return <AdminProductsPage />;
  if (role === "manager") return <ManagerProductsPage />;
  if (role === "cashier") return <CashierProductsPage profile={profile} />;

  return null;
}
