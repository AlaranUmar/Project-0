import { useAuth } from "@/context/AuthContext";
import CashierProductsPage from "@/pages/Cashier/CashierProductsPage";
import ManagerProductsSale from "@/pages/Manager/ManagerProductsSale";
// import OwnerProductsPage from "../Owner/OwnerProductsPage";
// import AdminProductsPage from "../Admin/AdminProductsPage";
// import ManagerProductsPage from "../Manager/ManagerProductsPage";
// import CashierProductsPage from "../Cashier/CashierProductsPage";

export default function ProductsSale() {
  const { role, profile } = useAuth();

  //   if (role === "owner") return <OwnerProductsPage profile={profile}/>;
  //   if (role === "admin") return <AdminProductsPage />;
  if (role === "manager") return <ManagerProductsSale profile={profile} />;
  if (role === "cashier") return <CashierProductsPage profile={profile} />;

  return null;
}
