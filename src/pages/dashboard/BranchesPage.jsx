import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BranchSalesChart from "@/feautures/dashboard/BranchSalesChart";
import { Button } from "@/components/ui/button";
import { LocationSelector } from "@/feautures/dashboard/Selectors";
import { useEffect, useMemo, useState } from "react";
import { getBranches } from "@/feautures/branches/branchService";
import React from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
function BranchesPage() {
  const [branches, setBranches] = useState([]);
  const [query, setQuery] = useState("");
  const filteredBranches = useMemo(() => {
    if (!query) return branches;

    const q = query.toLowerCase();

    return branches.filter(
      (p) =>
        p.branch_name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.type?.toLowerCase().includes(q) ||
        p.manager.name?.toLowerCase().includes(q),
    );
  }, [query, branches]);
  useEffect(() => {
    async function fetchBranch() {
      const { data } = await getBranches();
      setBranches(data);
    }
    fetchBranch();
  }, []);
  return (
    <div className="md:p-3">
      <div className="flex flex-col gap-3">
        <div className="grid gap-2 md:gap-5 grid-cols-2 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Total Revenue</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="text-sm md:text-lg font-semibold">
                ₦ 444,200,00.00
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Total Expense</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="text-sm md:text-lg font-semibold">
                {" "}
                ₦ 444,200.00
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Total Branches</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="text-lg font-semibold">5</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Total Products</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="text-lg font-semibold">245</div>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1  gap-3">
          <Card className=" w-full">
            <CardHeader>
              <CardTitle>Expense and Revenue Chart</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pr-8">
              <div className="w-full h-64">
                <BranchSalesChart />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle className={"flex justify-between items-center gap-3"}>
                {" "}
                <span className="text-lg">Branches</span>
                <Input
                  placeholder="Search branches by name, address, manager..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className={"max-w-90"}
                />
                <LocationSelector />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className={"h-60"}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-2">
                  {filteredBranches.map((branch) => (
                    <BranchCard
                      key={branch.location_id}
                      id={branch.location_id}
                      name={branch.branch_name}
                      type={branch.type}
                      manager={branch.manager}
                      address={branch.address}
                      cashiers={branch.cashiers}
                    />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function BranchCard({ name, type, manager, id, address, cashiers }) {
  const navigate = useNavigate();
  return (
    <Card className={"bg-gray-50 shadow-accent shadow-md"}>
      <CardHeader>
        <CardTitle className={"flex justify-between items-center"}>
          <p className="flex gap-1">
            <span className="capitalize">{name}</span>
            <span className="text-gray-600">{type}</span>
          </p>
          <Button variant="link" onClick={() => navigate(`/branches/${id}`)}>
            View Details
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className={"space-y-2"}>
        <p className="flex justify-between">
          <span className="text-sm text-gray-700">Manager:</span>
          <span className="text-gray-800 font-semibold">{manager.name}</span>
        </p>
        <p className="flex justify-between">
          <span className="text-sm text-gray-700">Address:</span>
          <span className="text-gray-800 text-nowrap font-semibold md:max-w-40 overflow-hidden text-ellipsis ">{address}</span>
        </p>
        <p className="flex justify-between">
          <span className="text-sm text-gray-700">Cashier No:</span>
          <span className="text-gray-800 text-nowrap font-semibold md:max-w-40 overflow-hidden text-ellipsis ">{cashiers.length}</span>
        </p>
      </CardContent>
    </Card>
  );
}
export default BranchesPage;
