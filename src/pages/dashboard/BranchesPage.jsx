import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BranchSalesChart from "@/feautures/dashboard/BranchSalesChart";
import { Button } from "@/components/ui/button";
import { DateRangeSelector } from "@/feautures/dashboard/Selectors";
import { useEffect, useMemo, useState } from "react";
import React from "react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { getBranchDashboardSummary } from "@/feautures/branches/branchService";
import { toast } from "sonner";
import Stats from "@/components/ui/stats";
import { formatCompactNaira } from "@/utils/formatting";
function BranchesPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  useEffect(() => {
    async function fetchBranches() {
      try {
        setLoading(true);
        const data = await getBranchDashboardSummary();
        setBranches(data);
        toast.success("Branches loaded successfully");
      } catch (err) {
        toast.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBranches();
  }, []);

  const filteredBranches = useMemo(() => {
    console.log(branches);
    if (!query) return branches;

    const q = query.toLowerCase();

    return branches.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.address?.toLowerCase().includes(q) ||
        p.type?.toLowerCase().includes(q),
    );
  }, [query, branches]);
  const totalBranches = branches.length;
  const branchSalesData = branches
    .filter((b) => b.type !== "warehouse")
    .map((b) => ({
      name: b.name,
      sales: Number(b.total_revenue || 0),
    }));
  const totalInventoryValue = branches.reduce(
    (sum, b) => sum + Number(b.inventory_value || 0),
    0,
  );
  const branchesLowStock = branches.filter((b) => b.low_stock_count > 0).length;
  const total_staff = branches.reduce(
    (sum, b) => sum + Number(b.total_staff || 0),
    0,
  );
  if (loading) return <div>Loading...</div>;
  return (
    <div className="md:p-3">
      <div className="flex flex-col gap-3">
        <div className="grid gap-2 md:gap-5 grid-cols-2 md:grid-cols-4">
          <Stats title="Total Branches" value={totalBranches} />
          <Stats
            title="Branches With Low Stock"
            value={branchesLowStock}
            color="text-orange-500"
          />
          <Stats title="Total Staff" value={total_staff} />
          <Stats
            title="Total Inventory Value"
            value={formatCompactNaira(totalInventoryValue)}
          />
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
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-2">
                {filteredBranches.map((branch) => (
                  <BranchCard
                    key={branch.id}
                    id={branch.id}
                    name={branch.name}
                    type={branch.type}
                    address={branch.address}
                    total_staff={branch.total_staff}
                    manager={branch.manager_name}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function BranchCard({ name, type, id, address, total_staff, manager }) {
  const navigate = useNavigate();
  return (
    <Card>
      <CardHeader>
        <CardTitle className={"flex justify-between items-center"}>
          <p className="flex flex-col">
            <span className="capitalize">{name}</span>
            <span className="text-muted-foreground text-xs capitalize">
              {type}
            </span>
          </p>
          {type === "warehouse" ? (
            <Button
              variant="link"
              onClick={() => navigate(`/warehouses/${id}`)}
            >
              View Details
            </Button>
          ) : (
            <Button variant="link" onClick={() => navigate(`/branches/${id}`)}>
              View Details
            </Button>
          )}
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
          <span className="text-sm text-gray-700">Manager:</span>
          <span className="text-gray-800 text-nowrap font-semibold md:max-w-40 overflow-hidden text-ellipsis ">
            {manager}
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
