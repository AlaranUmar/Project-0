import React, { useEffect, useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getReports } from "@/feautures/dashboard/reportService";
import { getDateRange } from "@/feautures/branches/getDate";
import { ReportsChart } from "@/feautures/ReportsChart";
import RevenueExpenseChart from "@/feautures/dashboard/RevenueExpenseChart";
import BranchSalesChart from "@/feautures/dashboard/BranchSalesChart";
import { Separator } from "@/components/ui/separator";

export default function OwnerReportPage() {
  const [report, setReport] = useState([]);
  const [dateRange, setDateRange] = useState("today"); // today | week | month
  const reportRef = useRef();

  useEffect(() => {
    async function fetchReport() {
      const [startDate, endDate] = getDateRange(dateRange);
      const data = await getReports(startDate, endDate);
      console.log(data);
      setReport(data);
    }
    fetchReport();
  }, [dateRange]);

  const totalSales = report.reduce((acc, b) => acc + (b.total_sales || 0), 0);
  const totalExpenses = report.reduce(
    (acc, b) => acc + (b.total_expenses || 0),
    0,
  );
  const totalProfit = totalSales - totalExpenses;

  return (
    <div className="p-2 md:p-4 space-y-6" ref={reportRef}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-x-2">
            <button
              onClick={() => setDateRange("today")}
              className={`px-4 py-2 rounded-md ${dateRange === "today" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              Today
            </button>
            <button
              onClick={() => setDateRange("week")}
              className={`px-4 py-2 rounded-md ${dateRange === "week" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              This Week
            </button>
            <button
              onClick={() => setDateRange("month")}
              className={`px-4 py-2 rounded-md ${dateRange === "month" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              This Month
            </button>
          </div>
        </div>
        <div className="grid gap-2 md:gap-5 grid-cols-2 md:grid-cols-4">
          <Card className=" border-success border bg-success/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Total Profit</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="text-sm md:text-lg font-semibold">
                ₦{totalProfit.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card className="border-destructive border bg-destructive/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Total Expense</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="text-sm md:text-lg font-semibold">
                ₦{totalExpenses.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card className="border-warning border bg-warning/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Total Revenue</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="text-sm md:text-lg font-semibold">
                ₦{totalSales.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary border bg-primary/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Total Products</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="text-lg font-semibold">245</div>
            </CardContent>
          </Card>
        </div>
        <div className="grid md:grid-cols-5 gap-3">
          <ReportsChart />
          <Card className="md:col-span-3">
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
      </div>
      
      

      <h2 className="text-2xl font-semibold text-gray-700 mt-8">
        Branch Performance
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {report.map((branch) => (
          <Card
            key={branch.branch_id}
            className=" "
          >
            <CardHeader>
              <CardTitle className="text-lg capitalize">{branch.branch_name}</CardTitle>
            </CardHeader>
            <Separator/>
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
                {(branch.total_sales - branch.total_expenses)?.toLocaleString()}
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
