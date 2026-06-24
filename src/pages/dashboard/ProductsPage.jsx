import { useAuth } from "@/context/AuthContext";
import OwnerProductsPage from "../Owner/OwnerProductsPage";
import ManagerProductsPage from "../Manager/ManagerProductsPage";

export default function ProductsPage() {
  const { role, profile } = useAuth();

  if (role === "owner" || role === "admin")
    return <OwnerProductsPage profile={profile} />;
  if (role === "manager" || role === "cashier") return <ManagerProductsPage />;

  return null;
}
