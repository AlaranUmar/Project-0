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
import { Package, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import Stats from "@/components/ui/Stats";

export default function OwnerDashboard() {
  const [dateRange, setDateRange] = useState("month");

  // ✅ Prevent unnecessary recalculation of date strings
  const [startDate, endDate] = useMemo(
    () => getDateRange(dateRange),
    [dateRange],
  );

  // ✅ Fetch data based on calculated date range
  const { totals, summary, timeline, loading, error } = useReports(
    startDate,
    endDate,
    "all",
    dateRange,
  );

  // 🔴 Loading State
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center font-medium animate-pulse text-muted-foreground">
        Aggregating dashboard data...
      </div>
    );
  }

  // 🔴 Error State
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-destructive font-medium">
        Failed to load dashboard data. Please try again later.
      </div>
    );
  }

  // ⚠️ Empty Data State - Kept inside the dashboard flow to allow range switching
  const hasData = summary.length > 0 || timeline.length > 0;

  // ✅ Transform data for charts
  const branchSalesData = summary.map((b) => ({
    name: b.branch_name,
    sales: Number(b.total_sales || 0),
  }));

  const revenueExpenseData = timeline.map((t) => ({
    name: t.period,
    revenue: Number(t.total_sales || 0),
    expense: Number(t.total_expenses || 0),
  }));

  return (
    <div className="p-3 space-y-4">
      <div className="flex justify-between items-center p-3 rounded-lg border bg-card">
        <span className=" text-muted-foreground truncate">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        <DateRangeSelector onChange={setDateRange} value={dateRange} />
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground border rounded-xl border-dashed">
          <p>No data available for the selected period ({dateRange})</p>
          <button
            onClick={() => setDateRange("total")}
            className="text-primary text-sm underline mt-2"
          >
            View all-time data
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
            <Stats
              title="Total Revenue"
              value={formatCompactNaira(totals.sales)}
              subtitle={dateRange}
              icon={Wallet}
            />
            <Stats
              title="Inventory Value"
              value={formatCompactNaira(totals.inventory)}
              icon={Package}
            />
            <Stats
              title="Total Profit"
              value={formatCompactNaira(totals.profit)}
              icon={TrendingUp}
            />
            <Stats
              title="Total Expense"
              value={formatCompactNaira(totals.expenses)}
              icon={TrendingDown}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card className="md:col-span-2 w-full">
              <CardHeader>
                <CardTitle className="text-base">Revenue vs Expense</CardTitle>
              </CardHeader>
              <CardContent className="px-0 pr-4">
                <div className="w-full h-72">
                  <RevenueExpenseChart
                    data={revenueExpenseData}
                    view={dateRange}
                  />
                </div>
              </CardContent>
            </Card>

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

            <div className="col-span-1 md:col-span-3">
              <RecentStockMovement />
            </div>

            <div className="col-span-1 md:col-span-2">
              <Alerts />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
