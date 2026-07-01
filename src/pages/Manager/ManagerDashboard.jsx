import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangeSelector } from "@/feautures/dashboard/Selectors";
import { useState, useEffect } from "react";

import { useReports } from "@/context/ReportContext";
import { getDateRange } from "@/feautures/locations/getDate";
import { getLocationOverview } from "@/feautures/locations/locationService";

import Alerts from "@/components/ui/Alerts";
import RecentStockMovement from "@/components/ui/RecentStockMovement";
import RevenueExpenseChart from "@/feautures/dashboard/RevenueExpenseChart";
import { getMyLocation } from "@/feautures/users/profileService";

import { Badge } from "@/components/ui/badge";
import Stats from "@/components/ui/Stats";

import { Box, TrendingDown, TrendingUp, Wallet } from "lucide-react";

import { formatCompactNaira } from "@/utils/formatting";
import CashierSalesChart from "@/feautures/dashboard/CashierSalesChart";

function ManagerDashboard() {
  const [dateRange, setDateRange] = useState("week");

  const [LocationId, setLocationId] = useState(null);
  const [Location, setLocation] = useState(null);
  const [LocationData, setLocationData] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true); // Added to prevent early fetch

  const [startDate, endDate] = getDateRange(dateRange);

  // Load manager location
  useEffect(() => {
    async function loadLocation() {
      try {
        const data = await getMyLocation();
        setLocation(data);
        setLocationId(data?.location_id);
      } catch (error) {
        console.error("Error fetching manager location:", error);
      } finally {
        setLoadingLocation(false); // Done checking for location
      }
    }

    loadLocation();
  }, []);

  // Load branch overview
  useEffect(() => {
    if (!LocationId) return;

    async function fetchLocationOverview() {
      const data = await getLocationOverview(LocationId);

      setLocationData(data);
    }

    fetchLocationOverview();
  }, [LocationId]);

  const {
    timeline,
    cashierSales,
    loading: reportsLoading,
  } = useReports(startDate, endDate, LocationId, dateRange);

  const revenueExpenseData = timeline.map((t) => ({
    period: t.period,
    name: t.period,
    revenue: Number(t.total_sales || 0),
    expense: Number(t.total_expenses || 0),
  }));

  const CashierSalesData = cashierSales.map((c) => ({
    cashier: c.cashier_name,
    name: c.cashier_name,
    sales: Number(c.total_sales || 0),
    transactions: Number(c.transaction_count || 0),
    items: Number(c.total_items || 0),
    averageSale: Number(c.average_sale || 0),
  }));

  // Combines location checking and report data validation to block design flashes
  if (loadingLocation || reportsLoading) {
    return (
      <div className="p-4 text-center">
        <span className="font-semibold">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="flex flex-col gap-3">
        {/* Header */}

        <div className="flex justify-between items-center">
          <span className="capitalize font-semibold text-xl flex items-center gap-2">
            {Location?.location_name || "No Location"}

            <Badge variant="outline" className="text-xs">
              {Location?.location_type}
            </Badge>
          </span>

          <DateRangeSelector onChange={setDateRange} value={dateRange} />
        </div>

        {/* Stats */}

        <div className="grid gap-3 md:gap-5 grid-cols-2 md:grid-cols-4">
          <Stats
            title="Revenue"
            value={formatCompactNaira(LocationData?.revenue || 0)}
            icon={Wallet}
          />

          <Stats
            title="Expenses"
            value={formatCompactNaira(LocationData?.expenses || 0)}
            icon={TrendingDown}
          />

          <Stats
            title="Profit"
            value={formatCompactNaira(
              (LocationData?.revenue || 0) - (LocationData?.expenses || 0),
            )}
            icon={TrendingUp}
          />

          <Stats
            title="Inventory Value"
            value={formatCompactNaira(LocationData?.stockVal || 0)}
            icon={Box}
          />
        </div>

        {/* Charts */}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Expense vs Revenue</CardTitle>
            </CardHeader>

            <CardContent className="px-0 pr-8">
              <div className="w-full h-64">
                <RevenueExpenseChart
                  data={revenueExpenseData}
                  view={dateRange}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Cashier Sales Ranking</CardTitle>
            </CardHeader>

            <CardContent className="px-0 pr-8">
              <div className="w-full h-64">
                <CashierSalesChart data={CashierSalesData} />
                {console.log(CashierSalesData)}
              </div>
            </CardContent>
          </Card>

          {/* Stock Movement */}

          <div className="col-span-3">
            <RecentStockMovement />
          </div>

          {/* Alerts */}

          <div className="col-span-2">
            <Alerts />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;
