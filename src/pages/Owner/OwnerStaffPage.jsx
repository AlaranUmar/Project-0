import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { getStaffs } from "@/feautures/staff/staffService";
import AddStaffModal from "../dashboard/AddStaffModal";
import { Button } from "@/components/ui/button";
export default function OwnerStaffPage() {
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");
  // {
  //     "staff_id": "00d80538-c762-41b5-8c84-c022fb81f920",
  //     "full_name": "John Doe",
  //     "email": null,
  //     "user_role": "manager",
  //     "hired_at": "2026-03-05T16:33:49.280153+00:00",
  //     "salary": 123455,
  //     "is_active": true,
  //     "location_id": "d3807ff7-63e5-4def-8863-9cb22978c82e",
  //     "location_name": "okejigbo",
  //     "location_address": "okejigbo abeokuta ogunstate",
  //     "location_type": "branch",
  //     "employment_status": "Active"
  // }
  async function fetchStaff() {
    const data = await getStaffs();
    setStaff(data);
  }
  useEffect(() => {
    fetchStaff();
  }, []);
  if (!staff) {
    return (
      <div className="p-4">
        <p>Loading staffs...</p>
      </div>
    );
  }
  console.log(staff);
  const totalStaff = staff.length;
  const totalManagers = staff.filter(
    (s) => s.user_role.toLowerCase() === "manager",
  ).length;
  const totalBranches = [...new Set(staff.map((s) => s.location_name))].length;

  const query = search.toLowerCase();
  const filteredStaff = staff.filter(
    (s) =>
      s.full_name?.toLowerCase().includes(query) ||
      s.location_name?.toLowerCase().includes(query) ||
      s.email?.toLowerCase().includes(query) ||
      s.user_role?.toLowerCase().includes(query),
  );

  return (
    <div className="p-1 md:p-4 space-y-4">
      <div className="grid gap-2 md:gap-5 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Total Staffs</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-sm md:text-lg font-semibold">{totalStaff}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Total Managers</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-lg font-semibold">{totalManagers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Total Branches</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-lg font-semibold">{totalBranches}</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Staff Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <Input
              placeholder="Search staff by name, branch or role"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 mr-2"
            />
          </div>
          {/* <AddStaffModal onStaffAdded={fetchStaff} /> */}
          <Table>
            <TableHeader>
              <TableRow className={"bg-accent"}>
                <TableCell>Id</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Is Active</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((st) => (
                <TableRow key={st.staff_id}>
                  <TableCell>{st.staff_id.slice(0, 8)}</TableCell>
                  <TableCell>{st.full_name}</TableCell>
                  <TableCell>{st.user_role}</TableCell>
                  <TableCell>{st.location_name}</TableCell>
                  <TableCell>{st.email}</TableCell>
                  <TableCell>{st.is_active ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
