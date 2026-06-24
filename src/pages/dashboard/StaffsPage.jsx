import { useAuth } from "@/context/AuthContext";
import OwnerStaffPage from "../Owner/OwnerStaffPage";
import ManagerStaffsPage from "../Manager/ManagerStaffsPage";

export default function StaffsPage() {
  const { role } = useAuth();

  if (role === "owner" || role === "admin") return <OwnerStaffPage />;
  if (role === "manager") return <ManagerStaffsPage />;

  return null;
}
