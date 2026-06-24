import { useAuth } from "@/context/AuthContext";
import OwnerNotificationsPage from "../Owner/OwnerNotificationsPage";

export default function NotificationsPage() {
  const { role } = useAuth();

  if (
    role === "owner" ||
    role === "admin" ||
    role === "manager" ||
    role === "cashier"
  )
    return <OwnerNotificationsPage />;

  return null;
}
