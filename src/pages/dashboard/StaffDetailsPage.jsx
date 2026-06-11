import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getStaffBasicDetails } from "@/feautures/staff/staffService";
import CashierDetailsPage from "./CashierDetailsPage";
import ManagerDetailsPage from "./ManagerDetailsPage";

export default function StaffDetailsPage() {
  const { id } = useParams();

  const [role, setRole] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await getStaffBasicDetails(id);

      setRole(data?.user_role);
    }

    load();
  }, [id]);

  if (!role) return <div>Loading...</div>;

  if (role === "cashier") {
    return <CashierDetailsPage />;
  }

  if (role === "manager") {
    return <ManagerDetailsPage />;
  }

  return <div>Role not supported</div>;
}
