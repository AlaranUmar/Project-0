import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import SalesChartCashier from "./SalesChartCashier";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PopularProducts from "./PopularProducts";
import OutOfStock from "./OutOfStock";
import ProductSearch from "@/components/ProductSearch";
import { DateRangeSelector } from "@/feautures/dashboard/Selectors";

function CashierDashboard({ profile }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="px-3 py-2 flex flex-col gap-3">
      <header className="flex">
        <div className="w-full ">
          <p className="text-sm font-normal leading-0 mb-2">Cashier</p>
          <div className="flex justify-between w-full items-center">
            <h1 className="text-xl font-semibold tracking-tight capitalize">
              {profile?.full_name}
            </h1>
          </div>
          <p className="text-muted-foreground text-xs">
            {time.toLocaleString("en-US", {
              dateStyle: "full",
              timeStyle: "medium",
            })}
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-5 w-5" /> Create Sale
        </Button>
      </header>
      <div className="flex justify-between gap-2 w-full">
        <ProductSearch />
        <DateRangeSelector />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <Card className="md:col-span-3 w-full">
          <CardHeader>
            <CardTitle>Sales Chart</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pr-8">
            <div className="w-full h-50">
              <SalesChartCashier />
            </div>
          </CardContent>
        </Card>
        <div className="md:col-span-2">
          <PopularProducts />
        </div>
        <div className="md:col-span-2">
          <OutOfStock />
        </div>
      </div>
    </div>
  );
}

export default CashierDashboard;
