import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock,
  MapPin,
  Package2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { getRecentAlerts } from "@/feautures/alerts/alertsService";
import { Link } from "react-router-dom";

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const data = await getRecentAlerts();

        // Sort by priority then latest
        const sortedAlerts = [...data].sort((a, b) => {
          if (a.priority !== b.priority) {
            return a.priority - b.priority;
          }

          return new Date(b.created_at) - new Date(a.created_at);
        });

        setAlerts(sortedAlerts);
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAlerts();
  }, []);

  const severityStyles = {
    critical: {
      icon: AlertTriangle,
      iconColor: "text-red-500",
      iconBg: "bg-red-500/10",
      border: "border-red-500/20",
      badge: "destructive",
    },

    warning: {
      icon: Package2,
      iconColor: "text-yellow-500",
      iconBg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
      badge: "secondary",
    },

    info: {
      icon: Bell,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
      border: "border-blue-500/20",
      badge: "outline",
    },
  };

  async function handleResolve(alertId) {
    try {
      // optimistic update
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId ? { ...alert, status: "resolved" } : alert,
        ),
      );

      // TODO:
      // await resolveAlert(alertId);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Card className="max-h-130 flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Recent Alerts</CardTitle>

            <CardDescription>Latest inventory notifications</CardDescription>
          </div>

          <Badge variant="outline">{alerts.length} Alerts</Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        {loading ? (
          <div className="h-[400px] flex items-center justify-center">
            <div className="text-sm text-muted-foreground">
              Loading alerts...
            </div>
          </div>
        ) : alerts.length === 0 ? (
          <div className="h-[400px] flex flex-col items-center justify-center text-center">
            <div className="h-14 w-14 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-7 w-7 text-green-500" />
            </div>

            <p className="font-semibold">No Active Alerts</p>

            <p className="text-sm text-muted-foreground mt-1">
              Your inventory system looks healthy.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[420px]">
            <div className="space-y-4">
              {alerts.map((alert) => {
                const styles =
                  severityStyles[alert.severity] || severityStyles.info;

                const Icon = styles.icon;

                return (
                  <Card
                    key={alert.id}
                    className={`
                 border p-4 transition-all
                      ${styles.border}
                    `}
                  >
                    <div className="flex gap-4">
                      {/* ICON */}

                      {/* CONTENT */}
                      <div className="flex-1 min-w-0">
                        {/* TOP */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-sm">
                                {alert.display_title}
                              </p>

                              <Badge
                                variant={styles.badge}
                                className="capitalize"
                              >
                                {alert.severity}
                              </Badge>
                            </div>

                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {alert.product_name}
                            </p>
                          </div>
                          <Link to={"products"}>
                            <Button
                              size="sm"
                              variant={
                                alert.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                              disabled={alert.status !== "active"}
                              onClick={() => handleResolve(alert.id)}
                            >
                              {alert.status === "active"
                                ? "Resolve"
                                : "Resolved"}
                            </Button>
                          </Link>
                        </div>

                        {/* META */}
                        <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{alert.location_name}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Package2 className="h-3.5 w-3.5" />
                            <span>Stock: {alert.current_stock}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />

                            <span>
                              {formatDistanceToNow(new Date(alert.created_at), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                        </div>

                        {/* IMAGE */}
                        {alert.image_url && (
                          <div className="mt-4">
                            <img
                              src={alert.image_url}
                              alt={alert.product_name}
                              className="
                                h-16 w-16 rounded-lg border object-cover
                              "
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

export default Alerts;
