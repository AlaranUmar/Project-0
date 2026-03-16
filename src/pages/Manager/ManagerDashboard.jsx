import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangeSelector } from "@/feautures/dashboard/Selectors";
import { useState, useEffect, useMemo } from "react";

import SalesChartManager from "./SalesChartManager";
import RevenueExpenseChartManager from "./RevenueExpenseChartManager";

import { useReports } from "@/context/ReportContext";
import { getDateRange } from "@/feautures/branches/getDate";
import { getBranchDetails } from "@/feautures/branches/branchService";
import { getStaffDetails } from "@/feautures/staff/staffService";
import { getSales } from "@/feautures/sales/Sales";
import Alerts from "@/components/ui/Alerts";
import RecentStockMovement from "@/components/ui/RecentStockMovement";

function ManagerDashboard({ profile }) {
  const [dateRange, setDateRange] = useState("today");
  const [branchId, setBranchId] = useState(null);
  const [branch, setBranch] = useState(null);
  const [sales, setSales] = useState([]);
  const [staff, setStaff] = useState(null);

  const [startDate, endDate] = getDateRange(dateRange);

  const {
    totalSales,
    totalInventoryValue,
    totalProfit,
    loading,
    revenueExpenseData,
    totalExpense,
    branches,
  } = useReports(startDate, endDate);

  /* ---------------- Set Default Branch ---------------- */

  useEffect(() => {
    if (branches?.length && !branchId) {
      setBranchId(branches[0].branch_id);
    }
  }, [branches, branchId]);

  /* ---------------- Fetch Branch ---------------- */

  useEffect(() => {
    if (!branchId) return;

    async function fetchBranch() {
      const data = await getBranchDetails(branchId);
      setBranch(data);
    }

    fetchBranch();
  }, [branchId]);

  /* ---------------- Fetch Sales ---------------- */

  useEffect(() => {
    async function fetchSales() {
      const data = await getSales();
      console.log("Sales data:", data);
      setSales(data || []);
    }

    fetchSales();
  }, []);

  /* ---------------- Fetch Staff ---------------- */

  useEffect(() => {
    if (!profile?.id) return;

    async function fetchStaff() {
      const data = await getStaffDetails(profile.id);
      setStaff(data);
    }

    fetchStaff();
  }, [profile?.id]);

  /* ---------------- Filter Sales by Branch ---------------- */

  const branchSales = useMemo(() => {
    if (!sales?.length || !branchId) return [];

    return sales.filter((sale) => sale.location_id === branchId);
  }, [sales, branchId]);

  /* ---------------- Build Chart Data ---------------- */

  const memoizedBranchSalesData = useMemo(() => {
    if (!branchSales.length) return [];

    const grouped = {};

    branchSales.forEach((sale) => {
      if (!sale?.created_at) return;

      const date = new Date(sale.created_at).toISOString().split("T")[0];

      if (!grouped[date]) {
        grouped[date] = { date };
      }

      const cashier =
        sale.cashier_name && sale.cashier_name.trim() !== ""
          ? sale.cashier_name
          : "Unknown";

      grouped[date][cashier] =
        (grouped[date][cashier] || 0) + (sale.amount || 0);
    });

    return Object.values(grouped).sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );
  }, [branchSales]);

  const memoizedRevenueExpenseData = useMemo(
    () => revenueExpenseData || [],
    [revenueExpenseData],
  );

  /* ---------------- Loading State ---------------- */

  if (loading) {
    return (
      <div className="p-4 text-center">
        <span className="font-semibold">Loading dashboard...</span>
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="p-3">
      <div className="flex flex-col gap-3">
        {/* Header */}

        <div className="flex justify-between items-center">
          <span className="capitalize font-semibold text-xl">
            {staff?.branch_name || "No Branch"}
          </span>

          <DateRangeSelector onChange={setDateRange} value={dateRange} />
        </div>

        {/* KPI Cards */}

        <div className="grid gap-3 md:gap-5 grid-cols-2 md:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total Sales</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="text-lg font-semibold">
                ₦{totalSales?.toLocaleString() || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total Expense</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="text-lg font-semibold">
                ₦{totalExpense?.toLocaleString() || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total Profit</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="text-lg font-semibold">
                ₦{totalProfit?.toLocaleString() || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Inventory Value</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="text-lg font-semibold">
                ₦{totalInventoryValue?.toLocaleString() || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Expense vs Revenue</CardTitle>
            </CardHeader>

            <CardContent className="px-0 pr-8">
              <div className="w-full h-64">
                <RevenueExpenseChartManager data={memoizedRevenueExpenseData} />
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Cashier Sales</CardTitle>
            </CardHeader>

            <CardContent className="px-0 pr-8">
              <div className="w-full h-64">
                <SalesChartManager data={memoizedBranchSalesData} />
              </div>
            </CardContent>
          </Card>
          <div className="col-span-2">
            <RecentStockMovement />
          </div>
          <div className="col-span-1">
            <Alerts />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;
