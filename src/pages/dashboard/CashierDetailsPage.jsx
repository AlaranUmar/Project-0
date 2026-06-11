// CASHIERDETAILSPAGE.jsx

import React, { useCallback, useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Wallet,
  ShoppingCart,
  TrendingUp,
  Clock,
  Loader2,
  RefreshCw,
  Activity,
  CalendarDays,
  BadgeDollarSign,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import { Separator } from "@/components/ui/separator";

import Stats from "@/components/ui/Stats";

import { getCashierDetails } from "@/feautures/staff/staffService";

import Initials from "@/components/Initials";

export default function CashierDetailsPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  /*
  ========================================
  LOAD DATA
  ========================================
  */

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const result = await getCashierDetails(id);

      setData(result);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /*
  ========================================
  REFRESH
  ========================================
  */

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      const result = await getCashierDetails(id);

      setData(result);
    } catch (err) {
      console.log(err);
    } finally {
      setRefreshing(false);
    }
  };

  /*
  ========================================
  LOADING
  ========================================
  */

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />

          <p className="text-sm text-muted-foreground">
            Loading cashier details...
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-muted-foreground">No cashier data found</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-3">
      {/* HEADER */}
      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Button
                size="icon"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-start gap-3">
                <Initials name={data.full_name} />

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold tracking-tight">
                      {data.full_name}
                    </h1>

                    <Badge>{data.user_role}</Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {data.location_name || "No Location Assigned"}
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stats
          title="Total Sales"
          value={`₦${Number(data.total_sales || 0).toLocaleString()}`}
          icon={Wallet}
          color="text-green-600"
        />

        <Stats
          title="Transactions"
          value={data.total_transactions || 0}
          icon={ShoppingCart}
          color="text-blue-600"
        />

        <Stats
          title="Average Sale"
          value={`₦${Number(data.average_sale || 0).toLocaleString()}`}
          icon={TrendingUp}
          color="text-orange-600"
        />

        <Stats
          title="Today Sales"
          value={`₦${Number(data.today_sales || 0).toLocaleString()}`}
          icon={BadgeDollarSign}
          color="text-purple-600"
        />
      </div>
      {/* QUICK STATS */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Today Transactions
              </p>

              <h2 className="text-2xl font-bold">
                {data.today_transactions || 0}
              </h2>
            </div>

            <Activity className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Last Sale</p>

              <h2 className="text-sm font-semibold">
                {data.last_sale_at
                  ? new Date(data.last_sale_at).toLocaleString()
                  : "---"}
              </h2>
            </div>

            <Clock className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Joined</p>

              <h2 className="text-sm font-semibold">
                {data.hired_at
                  ? new Date(data.hired_at).toLocaleDateString()
                  : "---"}
              </h2>
            </div>

            <CalendarDays className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>
      </div>

      {/* OVERVIEW */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Cashier Overview</CardTitle>

          <CardDescription>
            Performance summary, employment details and assigned location
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-5 pt-5">
          <div className="grid gap-4 md:grid-cols-2">
            {/* STAFF INFORMATION */}
            <Card className="rounded-2xl border-muted">
              <CardHeader>
                <CardTitle className="text-base">Staff Information</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>

                  <p className="font-medium">{data.full_name || "---"}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Email</p>

                  <p className="break-all">{data.email || "---"}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Role</p>

                  <Badge>{data.user_role || "---"}</Badge>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Salary</p>

                  <p>₦{Number(data.salary || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Employment Status
                  </p>

                  <Badge variant={data.is_active ? "default" : "secondary"}>
                    {data.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* LOCATION INFORMATION */}
            <Card className="rounded-2xl border-muted">
              <CardHeader>
                <CardTitle className="text-base">Assigned Location</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Branch Name</p>

                  <p>{data.location_name || "---"}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Address</p>

                  <p>{data.location_address || "---"}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>

                  <p>{data.location_phone || "---"}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Location ID</p>

                  <p className="break-all text-xs text-muted-foreground">
                    {data.location_id || "---"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SALES SUMMARY */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="rounded-2xl border-muted">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">
                  Total Revenue Handled
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  ₦{Number(data.total_sales || 0).toLocaleString()}
                </h2>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-muted">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">
                  Average Sale Value
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  ₦{Number(data.average_sale || 0).toLocaleString()}
                </h2>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-muted">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">
                  Total Transactions
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {data.total_transactions || 0}
                </h2>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
