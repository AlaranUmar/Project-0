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
import { Button } from "@/components/ui/button";
import { getStaffs } from "@/feautures/staff/staffService";
export default function OwnerStaffPage() {
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchStaff() {
      const data = await getStaffs();
      setStaff(data);
    }
    fetchStaff();
  }, []);
  if (!staff) {
    return (
      <div className="p-4">
        <p>Loading staffs...</p>
      </div>
    );
  }

  const filteredStaff = staff.filter(
    (s) =>
      `${s.full_name}`?.toLowerCase().includes(search?.toLowerCase()) ||
      s.branch_name?.toLowerCase().includes(search?.toLowerCase()) ||
      s.email?.toLowerCase().includes(search?.toLowerCase()) ||
      s.user_role?.toLowerCase().includes(search?.toLowerCase()),
  );

  return (
    <div className="p-4 space-y-4">
      <div className="grid gap-2 md:gap-5 grid-cols-2 md:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-sm">Total Staffs</CardTitle>
                  </CardHeader>
      
                  <CardContent>
                    <div className="text-sm md:text-lg font-semibold">
                      5
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-sm">Active Staffs</CardTitle>
                  </CardHeader>
      
                  <CardContent>
                    <div className="text-sm md:text-lg font-semibold">
                      5
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-sm">Total Managers</CardTitle>
                  </CardHeader>
      
                  <CardContent>
                    <div className="text-lg font-semibold">5</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-sm">Total Branches</CardTitle>
                  </CardHeader>
      
                  <CardContent>
                    <div className="text-lg font-semibold">4</div>
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

          <Table>
            <TableHeader>
              <TableRow className={"bg-accent"}>
                <TableCell>Id</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Total Sales</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((st) => (
                <TableRow key={st.staff_id}>
                  <TableCell>{st.staff_id.slice(0, 8)}</TableCell>
                  <TableCell>{st.full_name}</TableCell>
                  <TableCell>{st.user_role}</TableCell>
                  <TableCell>{st.branch_name}</TableCell>
                  <TableCell>{st.email}</TableCell>
                  <TableCell>₦{st.total_sales.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
