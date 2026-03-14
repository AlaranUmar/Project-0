import Alerts from "@/components/ui/Alerts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RecentStockMovement from "@/components/ui/RecentStockMovement";
import { useReports } from "@/context/ReportContext";
import { getDateRange } from "@/feautures/branches/getDate";

import BranchSalesChart from "@/feautures/dashboard/BranchSalesChart";
import RevenueExpenseChart from "@/feautures/dashboard/RevenueExpenseChart";
import {
  DateRangeSelector,
  LocationSelector,
} from "@/feautures/dashboard/Selectors";
import { useState } from "react";

function OwnerDashboard() {
  const [dateRange, setDateRange] = useState("today");
  const [branch, setBranch] = useState("all");
  const [startDate, endDate] = getDateRange(dateRange);
  const {
    totalSales,
    totalInventoryValue,
    totalProfit,
    loading,
    branches,
    branchSalesData,
    revenueExpenseData,
    totalExpense,
  } = useReports(startDate, endDate, "owner", branch);
  if (loading) return <div>Loading..</div>;
  return (
    <div className="p-3">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between md:justify-end gap-2">
          <DateRangeSelector onChange={setDateRange} value={dateRange} />
          <LocationSelector
            value={branch}
            onChange={setBranch}
            branches={branches}
          />
        </div>
        <div className="grid gap-3 md:gap-5 grid-cols-2 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Total Revenue</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="text-xl font-bold">${totalSales}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Inventory Value</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="text-xl font-bold">${totalInventoryValue}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Total Profit</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="text-xl font-bold">${totalProfit}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Total Expense</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="text-xl font-bold">${totalExpense}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <Card className="md:col-span-2 w-full">
            <CardHeader>
              <CardTitle>Expense and Revenue Chart</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pr-8">
              <div className="w-full h-64">
                <RevenueExpenseChart data={revenueExpenseData} />
              </div>
            </CardContent>
          </Card>

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

          <div className="col-span-1 md:col-span-3">
            <RecentStockMovement />
          </div>
          <div className="col-span-1 md:col-span-2">
            <Alerts />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboard;
