import { useAuth } from "@/context/AuthContext";
import OwnerTransfersPage from "../Owner/OwnerTransferPage";
import ManagerTransfersPage from "../Manager/ManagerTransfersPage";
import { Loader } from "lucide-react";

export default function TransfersPage() {
  const { role, profile, loading } = useAuth();
  if (loading)
    return (
      <div className="p-4">
        <Loader />
      </div>
    );
  if (role === "owner") return <OwnerTransfersPage />;
  //   if (role === "admin") return <AdminProductsPage />;
  if (role === "manager") return <ManagerTransfersPage profile={profile} />;

  return null;
}
