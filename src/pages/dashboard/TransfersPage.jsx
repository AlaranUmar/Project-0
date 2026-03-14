import { useAuth } from "@/context/AuthContext";
import OwnerTransfersPage from "../Owner/OwnerTransferPage";
import ManagerTransfersPage from "../Manager/ManagerTransfersPage";

export default function TransfersPage() {
  const { role } = useAuth();

  if (role === "owner") return <OwnerTransfersPage />;
  //   if (role === "admin") return <AdminProductsPage />;
  if (role === "manager") return <ManagerTransfersPage />;

  return null;
}
