import { useAuth } from "@/context/AuthContext";
import OwnerStaffPage from "../Owner/OwnerStaffPage";

export default function StaffsPage() {
  const { role } = useAuth();

  if (role === "owner") return <OwnerStaffPage />;
  //   if (role === "admin") return <AdminProductsPage />;
  //   if (role === "manager") return <ManagerProductsPage />;
  //   if (role === "cashier") return <CashierProductsPage profile={profile} />;

  return null;
}
