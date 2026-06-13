// MANAGERDETAILSPAGE.jsx

import React, { useCallback, useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Wallet,
  CheckCircle,
  Inbox,
  Activity,
  Loader2,
  RefreshCw,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import Stats from "@/components/ui/Stats";

import { getManagerDetails } from "@/feautures/staff/staffService";
import Initials from "@/components/Initials";
import { formatCompactNaira } from "@/utils/formatting";

export default function ManagerDetailsPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  /*
  ========================================
  LOAD
  ========================================
  */

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const result = await getManagerDetails(id);

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

      const result = await getManagerDetails(id);
      console.log(result);
      setData(result, "manager");
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
            Loading manager dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-muted-foreground">No manager data found</p>
      </div>
    );
  }

  /*
  ========================================
  DATA
  ========================================
  */

  return (
    <div className="space-y-5 p-3">
      {/* HEADER */}
      <Card className="rounded-2xl">
        <CardContent>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <Button
                size="icon"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <Initials name={data.full_name} />

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold">{data.full_name}</h1>

                  <Badge>{data.user_role}</Badge>

                  <Badge variant={data.is_active ? "default" : "destructive"}>
                    {data.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="mt-1 flex flex-col gap-1 text-sm text-muted-foreground">
                  <span>{data.email || "No email"}</span>

                  <span>{data.location_name?.toUpperCase()}</span>
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
          value={formatCompactNaira(data.total_sales || 0).toLocaleString()}
          icon={ShoppingCart}
          color="text-green-600"
        />

        <Stats
          title="Today's Sales"
          value={formatCompactNaira(data.today_sales || 0).toLocaleString()}
          icon={TrendingUp}
          color="text-emerald-600"
        />

        <Stats
          title="Transactions"
          value={data.total_transactions || 0}
          icon={Activity}
          color="text-blue-600"
        />

        <Stats
          title="Average Sale"
          value={formatCompactNaira(data.average_sale || 0).toLocaleString()}
          icon={Wallet}
          color="text-purple-600"
        />
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stats
          title="Expenses"
          value={formatCompactNaira(
            data.total_expenses_recorded || 0,
          ).toLocaleString()}
          icon={Wallet}
          color="text-red-600"
        />

        <Stats
          title="Requested"
          value={data.transfers_requested || 0}
          icon={Inbox}
          color="text-blue-600"
        />

        <Stats
          title="Approved"
          value={data.transfers_approved || 0}
          icon={CheckCircle}
          color="text-green-600"
        />

        <Stats
          title="Operations"
          value={data.total_operations || 0}
          icon={Activity}
          color="text-orange-600"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Branch Information</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Branch</p>
              <p>{data.location_name}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p>{data.location_address}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p>{data.location_phone}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Employment Details</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Salary</p>

              <p>{formatCompactNaira(data.salary || 0).toLocaleString()}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Hire Date</p>

              <p>{new Date(data.hired_at).toLocaleDateString()}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Status</p>

              <Badge>{data.is_active ? "Active" : "Inactive"}</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Activity Summary</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Last Sale</p>

              <p>
                {data.last_sale_at
                  ? new Date(data.last_sale_at).toLocaleString()
                  : "No sales yet"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Last Activity</p>

              <p>
                {data.last_activity_at
                  ? new Date(data.last_activity_at).toLocaleString()
                  : "No activity"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Today's Transactions
              </p>

              <p>{data.today_transactions}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
