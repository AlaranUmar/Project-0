import React, { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getDateRange } from "@/feautures/branches/getDate";
import { ReportsChart } from "@/feautures/ReportsChart";
import BranchSalesChart from "@/feautures/dashboard/BranchSalesChart";
import { Separator } from "@/components/ui/separator";
import { useReports } from "@/context/ReportContext";
import {
  DateRangeSelector,
  LocationSelector,
} from "@/feautures/dashboard/Selectors";

export default function OwnerReportPage() {
  const [dateRange, setDateRange] = useState("today");
  const [startDate, endDate] = getDateRange(dateRange);
  const [branch, setBranch] = useState("all");
  const reportRef = useRef();
  // const { data, daily, loading } = useReports(startDate, endDate, "owner");
  const {
    revenueExpenseData,
    branchSalesData,
    totalSales,
    totalInventoryValue,
    totalProfit,
    totalExpense,
    loading,
    branches,
  } = useReports(startDate, endDate, "owner", branch);

  if (loading) return <div>Loading...</div>;
  // const expenseRevenueData = data?.map((b) => ({
  //   date: b.location_name,
  //   sales: b.total_sales,
  //   expenses: b.total_expenses,
  // }));

  return (
    <div className="p-2 md:p-4 space-y-6" ref={reportRef}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex justify-between w-full">
            <DateRangeSelector onChange={setDateRange} value={dateRange} />
            <LocationSelector
              value={branch}
              onChange={setBranch}
              branches={branches}
            />
          </div>
        </div>
        <div className="grid gap-2 md:gap-5 grid-cols-2 md:grid-cols-4">
          <Card className=" border-success border bg-success/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Profit</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="text-sm md:text-lg font-semibold">
                ₦{totalProfit.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card className="border-destructive border bg-destructive/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Expense</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="text-sm md:text-lg font-semibold">
                ₦{totalExpense.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card className="border-warning border bg-warning/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Revenue</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="text-sm md:text-lg font-semibold">
                ₦{totalSales.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary border bg-primary/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Inventory Value</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="text-lg font-semibold">
                {totalInventoryValue.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid md:grid-cols-4 gap-3">
          <ReportsChart data={revenueExpenseData} />
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Branch Sales</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pr-8">
              <div className="w-full h-64">
                <BranchSalesChart data={branchSalesData} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-gray-700 mt-8">
        Branch Performance
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((branch) => (
          <Card key={branch.branch_id}>
            <CardHeader>
              <CardTitle className="text-lg capitalize">
                {branch.branch_name}
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-2">
              <p className="flex justify-between font-bold tracking-wide">
                <span className="font-semibold">Staff:</span>{" "}
                {branch.total_staff}
              </p>
              <p className="flex justify-between font-bold tracking-wide">
                <span className="font-semibold">Products:</span>{" "}
                {branch.total_products}
              </p>
              <p className="flex justify-between font-bold tracking-wide">
                <span className="font-semibold">Inventory Value:</span> ₦
                {branch.inventory_value?.toLocaleString()}
              </p>
              <p className="flex justify-between font-bold tracking-wide">
                <span className="font-semibold">Sales:</span> ₦
                {branch.total_sales?.toLocaleString()}
              </p>
              <p className="flex justify-between font-bold tracking-wide">
                <span className="font-semibold">Expenses:</span> ₦
                {branch.total_expenses?.toLocaleString()}
              </p>
              <p className="flex justify-between font-bold tracking-wide">
                <span className="font-semibold">Net Profit:</span> ₦
                {branch.net_profit?.toLocaleString()}
              </p>
              {branch.low_stock_items > 0 && (
                <p className="text-red-600 font-semibold">
                  ⚠ Low Stock: {branch.low_stock_items} items
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
