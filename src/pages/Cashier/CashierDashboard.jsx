import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Clock, Store, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import SalesChartCashier from "./SalesChartCashier";
import PopularProducts from "./PopularProducts";
import OutOfStock from "./OutOfStock";
import ProductSearch from "@/components/ProductSearch";
import { DateRangeSelector } from "@/feautures/dashboard/Selectors";

import { getSales } from "@/feautures/sales/Sales";
import { getStaffDetails } from "@/feautures/staff/staffService";

function CashierDashboard({ profile }) {
  const [time, setTime] = useState(new Date());
  const [rawSales, setRawSales] = useState([]);
  const [staff, setStaff] = useState(null);
  const [isLoadingSales, setIsLoadingSales] = useState(true);
  const [isLoadingStaff, setIsLoadingStaff] = useState(true);

  // 1. Clock Tracker
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Fetch Sales History Data
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setIsLoadingSales(true);
        const data = await getSales();
        setRawSales(data || []);
      } catch (error) {
        console.error("Failed to fetch dashboard sales:", error);
      } finally {
        setIsLoadingSales(false);
      }
    };
    fetchSalesData();
  }, []);

  // 3. Fetch Specific Staff Context
  useEffect(() => {
    if (!profile?.id) return;

    async function fetchStaff() {
      try {
        setIsLoadingStaff(true);
        const data = await getStaffDetails(profile.id);
        setStaff(data);
      } catch (error) {
        console.error("Failed to fetch staff assignment details:", error);
      } finally {
        setIsLoadingStaff(false);
      }
    }
    fetchStaff();
  }, [profile?.id]);

  // 4. Memoized Data Processing Engine (Prevents unwanted duplicate parsing)
  const dynamicChartData = useMemo(() => {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dailyBuckets = {};
    const timestampCutoff = new Date();

    // Set boundaries strictly to midnight 7 days ago to avoid stale historic duplication
    timestampCutoff.setDate(timestampCutoff.getDate() - 7);
    timestampCutoff.setHours(0, 0, 0, 0);

    // Initialize clean sliding window indices
    const chronologicalLabels = [...Array(7)]
      .map((_, index) => {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - index);
        const uniqueDayKey = `${targetDate.getFullYear()}-${targetDate.getMonth()}-${targetDate.getDate()}`;

        dailyBuckets[uniqueDayKey] = {
          name: dayNames[targetDate.getDay()],
          sales: 0,
        };
        return uniqueDayKey;
      })
      .reverse();

    // Map records safely
    rawSales.forEach((record) => {
      const recordDate = new Date(record.created_at);
      if (recordDate >= timestampCutoff) {
        const uniqueDayKey = `${recordDate.getFullYear()}-${recordDate.getMonth()}-${recordDate.getDate()}`;
        if (dailyBuckets[uniqueDayKey]) {
          dailyBuckets[uniqueDayKey].sales += Number(record.amount || 0);
        }
      }
    });

    return chronologicalLabels.map((key) => dailyBuckets[key]);
  }, [rawSales]);

  return (
    <div className="p-4 md:p-6 flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {/* Header Layout Zone */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/30 p-4 rounded-xl border border-border/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <Store className="h-3.5 w-3.5 text-emerald-500" />
            {isLoadingStaff ? (
              <Skeleton className="h-3 w-24" />
            ) : (
              staff?.branch_name || "Main Outlet"
            )}
          </div>

          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground/70 hidden sm:inline" />
            <h1 className="text-xl font-bold tracking-tight text-foreground capitalize">
              {profile?.full_name || "Welcome Back"}
            </h1>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 animate-pulse text-muted-foreground/60" />
            <span>
              {time.toLocaleString("en-GB", {
                dateStyle: "medium",
                timeStyle: "medium",
              })}
            </span>
          </div>
        </div>

        <Link to="products-sale" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all active:scale-[0.98]">
            <Plus className="h-4 w-4" /> Create Sale
          </Button>
        </Link>
      </header>

      {/* Global Dashboard Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 w-full items-center bg-card p-2 rounded-lg border border-border/40 shadow-xs">
        <div className="w-full sm:max-w-md">
          <ProductSearch />
        </div>
        <div className="w-full sm:w-auto self-stretch sm:self-auto">
          <DateRangeSelector />
        </div>
      </div>

      {/* Core Analytical Metrics and Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Weekly Revenue Flowchart Container */}
        <Card className="md:col-span-3 w-full shadow-sm hover:shadow-md/50 transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Weekly Sales Revenue
            </CardTitle>
            <CardDescription>
              Visual breakdown of receipts processed over the past 7 days
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-1 pr-4 pb-4">
            {/* Explicit, functional Tailwind layout wrapper ensures Recharts scales properly */}
            <div className="w-full h-[280px] relative mt-2">
              {isLoadingSales ? (
                <div className="absolute inset-0 flex flex-col gap-2 p-4 justify-end">
                  <div className="flex items-end justify-between h-full gap-4 px-2">
                    {[...Array(7)].map((_, i) => (
                      <Skeleton
                        key={i}
                        className="w-full bg-muted-foreground/10"
                        style={{ height: `${Math.random() * 60 + 20}%` }}
                      />
                    ))}
                  </div>
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : (
                <SalesChartCashier data={dynamicChartData} />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Supplementary Grid Widgets */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <PopularProducts />
            </CardContent>
          </Card>

          <Card className="shadow-sm border-destructive/20 bg-destructive/5 dark:bg-destructive/10">
            <CardContent className="p-4">
              <OutOfStock />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default CashierDashboard;
