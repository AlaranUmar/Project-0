import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RecentStockMovement from "@/components/ui/RecentStockMovement";
import {
  DateRangeSelector,
  // StaffSelector,
} from "@/feautures/dashboard/Selectors";

import { DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { getSales, sumSales } from "@/feautures/sales/Sales";
import SalesChartManager from "./SalesChartManager";
import RevenueExpenseChartManager from "./RevenueExpenseChartManager";

function ManagerDashboard() {
  const [sales, setSales] = useState([]);
  useEffect(() => {
    async function fetchSales() {
      const data = await getSales();
      setSales(data);
    }
    fetchSales();
  }, []);

  return (
    <div className="p-3">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between md:justify-end gap-2">
          <DateRangeSelector />
          {/* <StaffSelector /> */}
        </div>
        <div className="grid gap-3 md:gap-5 grid-cols-2 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Total Sales</CardTitle>

              <DollarSign size={18} />
            </CardHeader>

            <CardContent>
              <div className="text-xl font-bold">
                ${sumSales(sales).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Sales</CardTitle>

              <DollarSign size={18} />
            </CardHeader>

            <CardContent>
              <div className="text-xl font-bold">$4,200</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Sales</CardTitle>

              <DollarSign size={18} />
            </CardHeader>

            <CardContent>
              <div className="text-xl font-bold">$4,200</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Sales</CardTitle>

              <DollarSign size={18} />
            </CardHeader>

            <CardContent>
              <div className="text-xl font-bold">$4,200</div>
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
                <RevenueExpenseChartManager />
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-3 w-full">
            <CardHeader>
              <CardTitle>Cashier Sales</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pr-8">
              <div className="w-full h-64">
                <SalesChartManager />
              </div>
            </CardContent>
          </Card>

          <div className="col-span-1 md:col-span-2">
            <Alert />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;
