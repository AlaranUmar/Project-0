import { useMemo, useState, useEffect } from "react";
import { getSales } from "@/feautures/sales/Sales";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { Search, Receipt } from "lucide-react";

function ManagerSalesPage() {
  const [sales, setSales] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function fetchSales() {
      const data = await getSales();
      setSales(data || []);
    }
    fetchSales();
  }, []);

  const filteredSales = useMemo(() => {
    if (!query) return sales;
    const q = query.toLowerCase();

    return sales.filter((sale) => {
      const matchesId = sale.sale_id?.toLowerCase().includes(q);
      const matchesCashier = sale.cashier_name?.toLowerCase().includes(q);
      const matchesProduct = sale.items?.some((item) =>
        item.product_name?.toLowerCase().includes(q),
      );

      return matchesId || matchesCashier || matchesProduct;
    });
  }, [query, sales]);
  console.log(sales);
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  return (
    <div className="container mx-auto max-w-5xl p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Sales History</h1>
          <p className="text-sm text-muted-foreground">
            View and search past transactions
          </p>
        </div>

        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by sale ID or product..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                {filteredSales.length} transaction
                {filteredSales.length !== 1 && "s"}
              </CardDescription>
            </div>

            <Badge variant="secondary" className="gap-1">
              <Receipt className="h-3 w-3" />
              Sales
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0 max-h-[600px] overflow-y-auto">
          {filteredSales.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Search className="h-10 w-10 opacity-20 mb-3" />
              <p className="text-sm">No transactions found</p>
              {query && <p className="text-xs">Try a different search term</p>}
            </div>
          ) : (
            <div className="divide-y">
              {filteredSales.map((sale) => (
                <div
                  key={sale.sale_id}
                  className="p-5 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-primary">
                        #{sale.sale_id.slice(0, 8).toUpperCase()}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {new Date(sale.created_at).toLocaleString([], {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>

                    <div className="text-right space-y-1">
                      <p className="font-semibold text-lg">
                        ₦{sale.amount.toLocaleString()}
                      </p>
                      <Badge variant="outline">
                        {sale.cashier_name || "Cashier"}
                      </Badge>
                    </div>
                  </div>

                  <div className="rounded-md bg-muted/30 md:p-2 space-y-1 text-sm">
                    {sale.items?.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span className="text-muted-foreground flex items-center">
                          <span className="truncate max-w-30  inline-block">
                            {item.product_name}
                          </span>
                          <span className="text-xs ml-1">×{item.quantity}</span>
                        </span>

                        <span className="font-medium">
                          ₦{item.subtotal.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ManagerSalesPage;
