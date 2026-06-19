import React, { useEffect, useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Bell, AlertTriangle, CheckCircle2 } from "lucide-react";

import { formatDistanceToNow } from "date-fns";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  archiveNotification,
} from "@/feautures/notifications/notificationService";
import Stats from "@/components/ui/Stats";

function OwnerNotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  async function loadNotifications() {
    try {
      setLoading(true);

      const data = await getNotifications();

      setNotifications(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  async function handleMarkRead(id) {
    try {
      await markNotificationRead(id);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id
            ? {
                ...n,
                is_read: true,
              }
            : n,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function handleArchive(id) {
    try {
      await archiveNotification(id);

      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  async function handleMarkAllRead() {
    try {
      await markAllNotificationsRead();

      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          is_read: true,
        })),
      );
    } catch (err) {
      console.error(err);
    }
  }

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const matchesSearch =
        notification.title.toLowerCase().includes(search.toLowerCase()) ||
        notification.message.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "all"
          ? true
          : filter === "read"
            ? notification.is_read
            : !notification.is_read;

      return matchesSearch && matchesFilter;
    });
  }, [notifications, search, filter]);

  const stats = useMemo(() => {
    return {
      total: notifications.length,
      unread: notifications.filter((n) => !n.is_read).length,
      alerts: notifications.filter((n) => n.type === "ALERT").length,
    };
  }, [notifications]);
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>

        <Button onClick={handleMarkAllRead}>Mark All Read</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Stats title={"Total Notifications"} value={stats.total} icon={Bell} />
        <Stats
          title={"Unread Notifications"}
          value={stats.unread}
          icon={CheckCircle2}
        />
        <Stats title={"Alerts"} value={stats.alerts} icon={AlertTriangle} />
      </div>

      <Input
        placeholder="Search notifications..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>

          <TabsTrigger value="unread">Unread</TabsTrigger>

          <TabsTrigger value="read">Read</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-3">
        {loading ? (
          <Card>
            <CardContent className="py-10 text-center">Loading...</CardContent>
          </Card>
        ) : filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <Bell className="mx-auto mb-2 h-8 w-8" />
              No notifications found.
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={
                !notification.is_read ? "border-l-4 border-l-red-500" : ""
              }
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {notification.type === "ALERT" ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}

                  {notification.title}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="mb-3 text-sm text-muted-foreground">
                  {notification.message}
                </p>

                <div className="mb-4 text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(notification.created_at), {
                    addSuffix: true,
                  })}
                </div>

                <div className="flex gap-2">
                  {!notification.is_read && (
                    <Button
                      size="sm"
                      onClick={() => handleMarkRead(notification.id)}
                    >
                      Mark Read
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleArchive(notification.id)}
                  >
                    Archive
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default OwnerNotificationsPage;
