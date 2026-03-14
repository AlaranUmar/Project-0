import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BranchSalesChart from "@/feautures/dashboard/BranchSalesChart";
import { Button } from "@/components/ui/button";
import {
  DateRangeSelector,
  LocationSelector,
} from "@/feautures/dashboard/Selectors";
import { useMemo, useState } from "react";
import React from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { getDateRange } from "@/feautures/branches/getDate";
import { useReports } from "@/context/ReportContext";
function BranchesPage() {
  const [dateRange, setDateRange] = useState("today");
  const [startDate, endDate] = getDateRange(dateRange);

  const [query, setQuery] = useState("");
  const [branch, setBranch] = useState("all");
  const { branches, totalInventoryValue, loading, branchSalesData } =
    useReports(startDate, endDate, "owner", branch);

  const filteredBranches = useMemo(() => {
    if (!query) return branches;

    const q = query.toLowerCase();

    return branches.filter(
      (p) =>
        p.branch_name?.toLowerCase().includes(q) ||
        p.branch_address?.toLowerCase().includes(q) ||
        p.branch_type?.toLowerCase().includes(q),
    );
  }, [query, branches]);
  const totalBranches = branches.length;

  const branchesLowStock = branches.filter((b) => b.low_stock_items > 0).length;

  const branchesOutOfStock = branches.filter(
    (b) => b.out_of_stock_items > 0,
  ).length;
  if (loading) return <div>Loading...</div>;
  return (
    <div className="md:p-3">
      <div className="flex flex-col gap-3">
        <DateRangeSelector onChange={setDateRange} value={dateRange} />
        <div className="grid gap-2 md:gap-5 grid-cols-2 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Total Branches</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="text-sm md:text-lg font-semibold">
                {totalBranches}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Inventory Value</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="text-sm md:text-lg font-semibold">
                ₦ {totalInventoryValue.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Branches With Low Stock</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="text-lg font-semibold">{branchesLowStock}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Branches Out Of Stock</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="text-lg font-semibold">{branchesOutOfStock}</div>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1  gap-3">
          <Card className="md:col-span-3 w-full">
            <CardHeader>
              <CardTitle>Branch Sales Chart</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pr-8">
              <div className="w-full h-64">
                <BranchSalesChart data={branchSalesData} />
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
                  placeholder="Search branches by name, address..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className={"max-w-90"}
                />
                <LocationSelector onChange={setBranch} branches={branches} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className={"h-60"}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-2">
                  {console.log(branches)}
                  {filteredBranches.map((branch) => (
                    <BranchCard
                      key={branch.branch_id}
                      id={branch.branch_id}
                      name={branch.branch_name}
                      type={branch.branch_type}
                      address={branch.branch_address}
                      total_staff={branch.total_staff}
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

function BranchCard({ name, type, id, address, total_staff }) {
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
          <span className="text-sm text-gray-700">Address:</span>
          <span className="text-gray-800 text-nowrap font-semibold md:max-w-40 overflow-hidden text-ellipsis ">
            {address}
          </span>
        </p>
        <p className="flex justify-between">
          <span className="text-sm text-gray-700">Staff No:</span>
          <span className="text-gray-800 text-nowrap font-semibold md:max-w-40 overflow-hidden text-ellipsis ">
            {total_staff}
          </span>
        </p>
      </CardContent>
    </Card>
  );
}
export default BranchesPage;
