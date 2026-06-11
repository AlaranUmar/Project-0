// MANAGERDETAILSPAGE.jsx

import React, { useCallback, useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Wallet,
  Truck,
  CheckCircle,
  Inbox,
  Activity,
  Clock,
  Loader2,
  RefreshCw,
  UserCog,
  ClipboardList,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import { Separator } from "@/components/ui/separator";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Stats from "@/components/ui/Stats";

import { getManagerDetails } from "@/feautures/staff/staffService";
import Initials from "@/components/Initials";

export default function ManagerDetailsPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [activeTab, setActiveTab] = useState("overview");

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

  const activities = data.activities || [];

  return (
    <div className="space-y-5 p-3">
      {/* HEADER */}
      <Card className="rounded-2xl">
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
                <Initials name={data.name} />

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold tracking-tight">
                      {data.name}
                    </h1>

                    <Badge>Manager</Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {data.branch_name || "Assigned Branch"}
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
          title="Expenses"
          value={`₦${Number(
            data.total_expenses_recorded || 0,
          ).toLocaleString()}`}
          icon={Wallet}
          color="text-red-600"
        />

        <Stats
          title="Transfers Requested"
          value={data.transfers_requested || 0}
          icon={Inbox}
          color="text-blue-600"
        />

        <Stats
          title="Transfers Approved"
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

      {/* QUICK STATS */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Transfers Dispatched
              </p>

              <h2 className="text-2xl font-bold">
                {data.transfers_dispatched || 0}
              </h2>
            </div>

            <Truck className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Last Activity</p>

              <h2 className="text-sm font-semibold">
                {data.last_activity_at
                  ? new Date(data.last_activity_at).toLocaleString()
                  : "---"}
              </h2>
            </div>

            <Clock className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Operations Score</p>

              <h2 className="text-2xl font-bold">
                {data.total_operations || 0}
              </h2>
            </div>

            <ClipboardList className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>
      </div>

      {/* TABS */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="h-auto w-full justify-start rounded-2xl p-2">
          <TabsTrigger value="overview" className="rounded-xl">
            Overview
          </TabsTrigger>

          <TabsTrigger value="activities" className="rounded-xl">
            Activities
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Manager Overview</CardTitle>

              <CardDescription>Operational performance summary</CardDescription>
            </CardHeader>

            <Separator />

            <CardContent className="space-y-5 pt-5">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="rounded-2xl border-muted">
                  <CardContent className="space-y-2 p-5">
                    <p className="text-sm text-muted-foreground">
                      Operations Managed
                    </p>

                    <h2 className="text-3xl font-bold">
                      {data.total_operations || 0}
                    </h2>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-muted">
                  <CardContent className="space-y-2 p-5">
                    <p className="text-sm text-muted-foreground">
                      Total Expenses Recorded
                    </p>

                    <h2 className="text-3xl font-bold">
                      ₦
                      {Number(
                        data.total_expenses_recorded || 0,
                      ).toLocaleString()}
                    </h2>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ACTIVITIES */}
        <TabsContent value="activities">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>

              <CardDescription>Latest operational activities</CardDescription>
            </CardHeader>

            <Separator />

            <CardContent>
              {activities.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  No activities found
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>

                      <TableHead>Activity</TableHead>

                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {activities.map((activity, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {new Date(activity.created_at).toLocaleDateString()}
                        </TableCell>

                        <TableCell>{activity.activity}</TableCell>

                        <TableCell>
                          <Badge>{activity.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
