import { useState, useMemo } from "react";

import Alerts from "@/components/ui/Alerts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RecentStockMovement from "@/components/ui/RecentStockMovement";

import { useReports } from "@/context/ReportContext";
import { getDateRange } from "@/feautures/branches/getDate";

import BranchSalesChart from "@/feautures/dashboard/BranchSalesChart";
import RevenueExpenseChart from "@/feautures/dashboard/RevenueExpenseChart";
import { DateRangeSelector } from "@/feautures/dashboard/Selectors";

import { formatCompactNaira } from "@/utils/formatting";

function OwnerDashboard() {
  const [dateRange, setDateRange] = useState("today");

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
    name: formatChartLabel(t.period, dateRange),
    revenue: Number(t.total_sales || 0),
    expense: Number(t.total_expenses || 0),
  }));

  return (
    <div className="p-3 space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-card p-3 rounded-lg border shadow-sm">
        <h1 className="text-xl font-bold tracking-tight">Business Overview</h1>
        <DateRangeSelector onChange={setDateRange} value={dateRange} />
      </div>

      {/* STAT CARDS */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <DashboardStat
          title="Total Revenue"
          value={totals.sales}
          subtitle={dateRange}
        />
        <DashboardStat title="Inventory Value" value={totals.inventory} />
        <DashboardStat
          title="Total Profit"
          value={totals.profit}
          color="text-green-600"
        />
        <DashboardStat
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
 * 📊 Chart Label Formatter (handles time buckets properly)
 */
function formatChartLabel(date, view) {
  try {
    const d = new Date(date);

    switch (view) {
      case "today":
        return d.toLocaleTimeString([], { hour: "2-digit" });

      case "week":
        return d.toLocaleDateString([], { weekday: "short" });

      case "month":
        return d.toLocaleDateString([], { day: "numeric" });

      case "year":
        return d.toLocaleDateString([], { month: "short" });

      default:
        return d.toLocaleDateString();
    }
  } catch {
    return "n/a";
  }
}

/**
 * 📦 Stat Card Component
 */
function DashboardStat({ title, value, subtitle, color = "text-foreground" }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-xl md:text-2xl font-bold ${color}`}>
          {formatCompactNaira(value ?? 0)}
        </div>
        {subtitle && (
          <p className="text-[10px] text-muted-foreground capitalize mt-1">
            Period: {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default OwnerDashboard;
