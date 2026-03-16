import React, { useEffect, useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getFinancials, getReports } from "@/feautures/dashboard/reportService";
import { getDateRange } from "@/feautures/branches/getDate";
import { ReportsChart } from "@/feautures/ReportsChart";
import { Separator } from "@/components/ui/separator";
import { DateRangeSelector } from "@/feautures/dashboard/Selectors";

export default function ManagerReportsPage() {
  const [report, setReport] = useState([]);
  const [dateRange, setDateRange] = useState("today");
  const [daily, setDaily] = useState([]);
  const [loading, setLoading] = useState(false);

  const reportRef = useRef();

  const [startDate, endDate] = getDateRange(dateRange);

  useEffect(() => {
    async function fetchReport() {
      setLoading(true);

      const data = await getReports(startDate, endDate);
      setReport(data || []);

      const financials = await getFinancials(startDate, endDate);

      const dailyData = (financials || []).map((item) => ({
        date: new Date(item.report_date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        sales: item.total_sales || 0,
        expenses: item.total_expenses || 0,
      }));

      setDaily(dailyData);

      setLoading(false);
    }

    fetchReport();
  }, [dateRange]);

  if (loading) return <div>Loading...</div>;

  /* ---------------- Totals ---------------- */

  const totalSales = report.reduce((acc, b) => acc + (b.total_sales || 0), 0);

  const totalExpenses = report.reduce(
    (acc, b) => acc + (b.total_expenses || 0),
    0,
  );

  const totalInventoryValue = report.reduce(
    (acc, b) => acc + (b.inventory_value || 0),
    0,
  );

  const totalProfit = totalSales - totalExpenses;

  /* ---------------- UI ---------------- */

  return (
    <div className="p-2 md:p-4 space-y-6" ref={reportRef}>
      <div className="flex flex-col gap-3">
        {/* Date Selector */}

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <DateRangeSelector onChange={setDateRange} value={dateRange} />
        </div>

        {/* KPI Cards */}

        <div className="grid gap-2 md:gap-5 grid-cols-2 md:grid-cols-4">
          <Card className="border-success border bg-success/10">
            <CardHeader>
              <CardTitle className="text-sm">Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm md:text-lg font-semibold">
                ₦{totalProfit.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive border bg-destructive/10">
            <CardHeader>
              <CardTitle className="text-sm">Expense</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm md:text-lg font-semibold">
                ₦{totalExpenses.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="border-warning border bg-warning/10">
            <CardHeader>
              <CardTitle className="text-sm">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm md:text-lg font-semibold">
                ₦{totalSales.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary border bg-primary/10">
            <CardHeader>
              <CardTitle className="text-sm">Inventory Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm md:text-lg font-semibold">
                ₦{totalInventoryValue.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Branch Cards */}

        <div className="grid md:grid-cols-5 gap-3">
          {report.map((branch) => (
            <Card key={branch.branch_id} className="col-span-2">
              <CardHeader>
                <CardTitle className="text-lg capitalize">
                  {branch.branch_name} ({branch.branch_type})
                </CardTitle>
              </CardHeader>

              <Separator />

              <CardContent className="space-y-2">
                <p className="flex justify-between font-bold">
                  <span>Staff:</span>
                  {branch.total_staff}
                </p>

                <p className="flex justify-between font-bold">
                  <span>Products:</span>
                  {branch.total_products}
                </p>

                <p className="flex justify-between font-bold">
                  <span>Inventory Value:</span>₦
                  {branch.inventory_value?.toLocaleString()}
                </p>

                <p className="flex justify-between font-bold">
                  <span>Sales:</span>₦{branch.total_sales?.toLocaleString()}
                </p>

                <p className="flex justify-between font-bold">
                  <span>Expenses:</span>₦
                  {branch.total_expenses?.toLocaleString()}
                </p>

                <p className="flex justify-between font-bold">
                  <span>Net Profit:</span>₦
                  {(
                    (branch.total_sales || 0) - (branch.total_expenses || 0)
                  ).toLocaleString()}
                </p>

                {branch.low_stock_items > 0 && (
                  <p className="text-red-600 font-semibold">
                    ⚠ Low Stock: {branch.low_stock_items} items
                  </p>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Financial Chart */}

          <ReportsChart data={daily} />
        </div>
      </div>
    </div>
  );
}
