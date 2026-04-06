import { useAuth } from "@/context/AuthContext";
import OwnerNotificationsPage from "../Owner/OwnerNotificationsPage";
import ManagerNotificationsPage from "../Manager/ManagerNotificationsPage";
import CashierNotificationsPage from "../Cashier/CashierNotificationsPage";

export default function NotificationsPage() {
  const { role } = useAuth();

  if (role === "owner") return <OwnerNotificationsPage />;
  // if (role === "admin") return <AdminDashboard profile={profile} />;
  if (role === "manager") return <ManagerNotificationsPage />;
  if (role === "cashier") return <CashierNotificationsPage />;

  return null;
}
