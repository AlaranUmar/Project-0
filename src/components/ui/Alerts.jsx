import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, AlertCircle, Bell, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { useState, useEffect } from "react";
import { getRecentAlerts } from "@/feautures/inventory/alertsService";

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  useEffect(() => {
    async function fetchAlerts() {
      const data = await getRecentAlerts();
      setAlerts(data);
    }
    fetchAlerts();
  }, []);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <CardTitle className="text-base font-bold">System Alerts</CardTitle>
        </div>
        <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
          {alerts?.length} New
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-sm px-4">
          <div className="flex flex-col gap-3 pb-4">
            {alerts?.length > 0 ? (
              alerts.map((alert) => (
                <Alert
                  key={alert?.id}
                  variant={
                    alert.message.includes("Low") ? "destructive" : "default"
                  }
                  className="bg-card shadow-sm border-muted-foreground/10"
                >
                  {alert?.message.includes("Low") ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : (
                    <Info className="h-4 w-4" />
                  )}
                  <AlertTitle className="text-sm font-semibold">
                    {alert?.title}
                  </AlertTitle>
                  <AlertDescription className="text-xs text-muted-foreground mt-1">
                    {alert?.message}
                    <div className="mt-2 flex items-center text-[10px] opacity-70">
                      {new Date(alert?.created_at).toLocaleDateString()} •{" "}
                      {alert?.location_name || "Global"}
                    </div>
                  </AlertDescription>
                </Alert>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground text-sm italic">
                All systems clear.
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default Alerts;
