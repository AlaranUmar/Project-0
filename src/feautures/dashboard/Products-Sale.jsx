import { useAuth } from "@/context/AuthContext";
import ManagerProductsSale from "@/pages/Manager/ManagerProductsSale";

export default function ProductsSale() {
  const { role, profile } = useAuth();

  if (role === "manager" || role === "cashier")
    return <ManagerProductsSale profile={profile} />;

  return null;
}
