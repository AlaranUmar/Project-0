import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Users, Search, Pencil, Filter, ArrowUpDown } from "lucide-react";

import { getStaffs } from "@/feautures/staff/staffService";
import Stats from "@/components/ui/Stats";
import Initials from "@/components/Initials";

export default function OwnerStaffPage() {
  const navigate = useNavigate();

  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name"); // name | role | branch

  async function fetchStaff() {
    try {
      setLoading(true);
      const data = await getStaffs();
      setStaff(data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStaff();
  }, []);

  const totalStaff = staff.length;

  const totalManagers = staff.filter(
    (s) => s.user_role?.toLowerCase() === "manager",
  ).length;

  const totalCashiers = staff.filter(
    (s) => s.user_role?.toLowerCase() === "cashier",
  ).length;

  const totalLocations = [...new Set(staff.map((s) => s.location_name))].length;

  const filteredStaff = useMemo(() => {
    let data = [...staff];

    const query = search.toLowerCase();

    // SEARCH
    data = data.filter(
      (s) =>
        s.full_name?.toLowerCase().includes(query) ||
        s.location_name?.toLowerCase().includes(query) ||
        s.email?.toLowerCase().includes(query) ||
        s.user_role?.toLowerCase().includes(query),
    );

    // ROLE FILTER
    if (roleFilter !== "all") {
      data = data.filter((s) => s.user_role?.toLowerCase() === roleFilter);
    }

    // STATUS FILTER
    if (statusFilter !== "all") {
      data = data.filter((s) =>
        statusFilter === "active" ? s.is_active : !s.is_active,
      );
    }

    // SORTING
    data.sort((a, b) => {
      if (sortBy === "name") {
        return (a.full_name || "").localeCompare(b.full_name || "");
      }

      if (sortBy === "role") {
        return (a.user_role || "").localeCompare(b.user_role || "");
      }

      if (sortBy === "branch") {
        return (a.location_name || "").localeCompare(b.location_name || "");
      }

      return 0;
    });

    return data;
  }, [staff, search, roleFilter, statusFilter, sortBy]);

  return (
    <div className="space-y-6 p-2 md:p-6">
      {/* STATS */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <Stats title="Total Staff" value={totalStaff} icon={Users} />
        <Stats title="Managers" value={totalManagers} icon={Users} />
        <Stats title="Cashiers" value={totalCashiers} icon={Users} />
        <Stats title="Locations" value={totalLocations} icon={Users} />
      </div>

      {/* TABLE CARD */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>All Staff</CardTitle>
          <CardDescription>Search, filter and manage staff</CardDescription>

          {/* CONTROLS */}
          <div className="flex flex-col md:flex-row gap-3 mt-4">
            {/* SEARCH */}
            <div className="relative w-full md:w-[280px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search staff..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* ROLE FILTER */}
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px] text-sm">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="cashier">Cashier</SelectItem>
              </SelectContent>
            </Select>

            {/* STATUS FILTER */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] text-sm">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            {/* SORT */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] text-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort: Name</SelectItem>
                <SelectItem value="role">Sort: Role</SelectItem>
                <SelectItem value="branch">Sort: Branch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="py-10 text-muted-foreground">Loading staff...</div>
          ) : filteredStaff.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              No staff found
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredStaff.map((st) => (
                    <TableRow
                      key={st.staff_id}
                      onClick={() => navigate(`/staffs/${st.staff_id}`)}
                      className="cursor-pointer hover:bg-muted/50"
                    >
                      {/* STAFF */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Initials name={st.full_name} />

                          <div>
                            <p className="font-medium">{st.full_name}</p>

                            <p className="text-xs text-muted-foreground">
                              #{st.staff_id.slice(0, 6)}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* ROLE */}
                      <TableCell>
                        <Badge>{st.user_role}</Badge>
                      </TableCell>

                      {/* BRANCH */}
                      <TableCell>{st.location_name}</TableCell>

                      {/* EMAIL */}
                      <TableCell className="text-muted-foreground">
                        {st.email || "No email"}
                      </TableCell>

                      {/* STATUS */}
                      <TableCell>
                        <Badge
                          className={
                            st.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }
                        >
                          {st.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>

                      {/* ACTION */}
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/staffs/${st.staff_id}`);
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
