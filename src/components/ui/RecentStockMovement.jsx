import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowUpRight, ArrowDownLeft, RefreshCcw, User } from "lucide-react";
import { getRecentStockMovements } from "@/feautures/inventory/inventoryService";
import { useEffect, useState } from "react";

const getIcon = (type) => {
  switch (type) {
    case "sale":
      return <ArrowDownLeft className="text-red-500" size={16} />;
    case "restock":
      return <ArrowUpRight className="text-green-500" size={16} />;
    case "transfer":
      return <RefreshCcw className="text-blue-500" size={16} />;
    default:
      return <User size={16} />;
  }
};

export default function RecentStockMovement() {
  const [movements, setMovements] = useState([]);
  useEffect(() => {
    async function getMovements() {
      const data = await getRecentStockMovements();
      setMovements(data);
    }
    getMovements();
  }, []);
  return (
    <Card className="md:col-span-3 h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-bold">Stock Movements</CardTitle>
        <Badge variant="outline">{movements.length} updates</Badge>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea>
          <div className="flex flex-col max-h-80">
            {movements.length > 0 ? (
              movements.map((m, index) => (
                <div key={m.id}>
                  <div className="flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors">
                    <div className="mt-1 p-2 rounded-full bg-muted flex items-center justify-center">
                      {getIcon(m.movement_type)}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-sm leading-none capitalize w-full flex justify-between gap-2">
                            <p className="truncate max-w-40 inline-block">
                              {m.product_name}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {m.movement_type}
                            </span>
                          </span>
                          <p className="text-xs text-muted-foreground mt-1 capitalize">
                            {m.created_by_name} • {m.role}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 capitalize">
                            - {m.location_name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-sm font-bold ${m.quantity_change > 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {m.quantity_change > 0
                              ? `+${m.quantity_change}`
                              : m.quantity_change}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {new Date(m.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>

                      {m.notes && (
                        <p className="text-xs bg-muted/30 p-2 rounded italic text-muted-foreground mt-2 border-l-2 border-primary/20">
                          "{m.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                  {index < movements.length - 1 && <Separator />}
                </div>
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
