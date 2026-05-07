import { useState, useMemo } from "react";

import Alerts from "@/components/ui/Alerts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RecentStockMovement from "@/components/ui/RecentStockMovement";

import { useReports } from "@/context/ReportContext";
import { getDateRange } from "@/feautures/branches/getDate";

import BranchSalesChart from "@/feautures/dashboard/BranchSalesChart";
import RevenueExpenseChart from "@/feautures/dashboard/RevenueExpenseChart";
import { DateRangeSelector } from "@/feautures/dashboard/Selectors";

import Stats from "@/components/ui/stats";
export default function OwnerDashboard() {
  const [dateRange, setDateRange] = useState("month");

  // ✅ Prevent unnecessary recalculation
  const [startDate, endDate] = useMemo(
    () => getDateRange(dateRange),
    [dateRange],
  );

  // ✅ New hook structure
  const { totals, summary, timeline, loading, error } = useReports(
    startDate,
    endDate,
    "all",
    dateRange,
  );
  // 🔴 Loading State
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center font-medium animate-pulse">
        Aggregating dashboard data...
      </div>
    );
  }

  // 🔴 Error State
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-destructive">
        Failed to load dashboard data.
      </div>
    );
  }

  // ⚠️ Empty Data State
  if (!summary.length && !timeline.length) {
    return (
      <div className="h-screen flex items-center justify-center text-muted-foreground">
        No data available for this period
      </div>
    );
  }

  // ✅ Transform data for charts
  const branchSalesData = summary.map((b) => ({
    name: b.branch_name,
    sales: Number(b.total_sales || 0),
  }));

  const revenueExpenseData = timeline.map((t) => ({
    name: t.period, // Don't format here!
    revenue: Number(t.total_sales || 0),
    expense: Number(t.total_expenses || 0),
  }));

  return (
    <div className="p-3 space-y-4">
      {/* HEADER */}
      <div className="flex justify-end items-center p-3 rounded-lg border">
        <DateRangeSelector onChange={setDateRange} value={dateRange} />
      </div>

      {/* STAT CARDS */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <Stats
          title="Total Revenue"
          value={totals.sales}
          subtitle={dateRange}
        />
        <Stats title="Inventory Value" value={totals.inventory} />
        <Stats
          title="Total Profit"
          value={totals.profit}
          color="text-green-600"
        />
        <Stats
          title="Total Expense"
          value={totals.expenses}
          color="text-destructive"
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Revenue vs Expense */}
        <Card className="md:col-span-2 w-full">
          <CardHeader>
            <CardTitle className="text-base">Revenue vs Expense</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pr-4">
            <div className="w-full h-72">
              <RevenueExpenseChart data={revenueExpenseData} view={dateRange} />
            </div>
          </CardContent>
        </Card>
        {/* Branch Performance */}
        <Card className="md:col-span-3 w-full">
          <CardHeader>
            <CardTitle className="text-base">Branch Performance</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pr-4">
            <div className="w-full h-72">
              <BranchSalesChart data={branchSalesData} />
            </div>
          </CardContent>
        </Card>
        {/* LOGS */}
        <div className="col-span-1 md:col-span-3">
          <RecentStockMovement />
        </div>
        {/* ALERTS */}
        <div className="col-span-1 md:col-span-2">
          <Alerts />
        </div>
      </div>
    </div>
  );
}
/**
 * 📦 Stat Card Component
 */
