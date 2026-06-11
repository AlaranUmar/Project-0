import { useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getStaffBasicDetails } from "@/feautures/staff/staffService";

export default function StaffRouter() {
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
    return <Navigate to={`/owner/staff/${id}/cashier`} />;
  }

  if (role === "manager") {
    return <Navigate to={`/owner/staff/${id}/manager`} />;
  }

  return <div>Role not supported</div>;
}
