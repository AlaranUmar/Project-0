import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import {
  Loader2,
  Receipt,
  User,
  Store,
  CreditCard,
  Calendar,
  Wallet,
  TrendingUp,
  Package,
  X,
} from "lucide-react";

import { getSaleDetails, getSaleItems } from "@/feautures/sales/Sales";

export default function SaleDetailsDrawer({ saleId, onClose }) {
  const [loading, setLoading] = useState(true);

  const [sale, setSale] = useState(null);

  const [items, setItems] = useState([]);

  useEffect(() => {
    if (saleId) {
      loadSale();
    }
  }, [saleId]);

  async function loadSale() {
    try {
      setLoading(true);

      const [saleData, itemsData] = await Promise.all([
        getSaleDetails(saleId),
        getSaleItems(saleId),
      ]);

      setSale(saleData);

      setItems(itemsData || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case "completed":
        return "success";

      case "pending":
        return "secondary";

      case "cancelled":
        return "destructive";

      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="bg-black/50 backdrop-blur-sm flex justify-center items-center fixed inset-0 z-50">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (!sale) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
      <div className="w-full md:w-4/5 lg:w-1/2 bg-background h-full overflow-y-auto shadow-2xl">
        {/* HEADER */}

        <div className="sticky top-0 z-20 bg-background border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Sale Receipt
            </h2>

            <p className="text-xs text-muted-foreground mt-1">{sale.sale_id}</p>
          </div>

          <Button variant="outline" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-3 space-y-6">
          {/* HERO SECTION */}

          <Card>
            <CardContent className="">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <Badge
                    variant={getStatusVariant(sale.status)}
                    className="capitalize mb-3"
                  >
                    {sale.status}
                  </Badge>

                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    ₦{Number(sale.total_amount).toLocaleString()}
                  </h1>

                  <p className="text-muted-foreground mt-2 capitalize">
                    {sale.transaction_type?.replace("_", " ")}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-sm text-muted-foreground">
                    Total Quantity
                  </div>

                  <div className="text-3xl font-bold">
                    {sale.total_quantity}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KPI CARDS */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Wallet className="h-5 w-5" />

                  <span className="text-sm text-muted-foreground">Revenue</span>
                </div>

                <div className="text-2xl font-bold">
                  ₦{Number(sale.total_amount).toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Package className="h-5 w-5" />

                  <span className="text-sm text-muted-foreground">Cost</span>
                </div>

                <div className="text-2xl font-bold">
                  ₦{Number(sale.total_cost).toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="h-5 w-5 text-green-600" />

                  <span className="text-sm text-muted-foreground">Profit</span>
                </div>

                <div className="text-2xl font-bold text-green-600">
                  ₦{Number(sale.profit).toLocaleString()}
                </div>

                <div className="text-xs text-muted-foreground mt-2">
                  Margin {sale.margin_percent}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* TRANSACTION DETAILS */}

          <Card>
            <CardHeader>
              <CardTitle>Transaction Information</CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InfoRow
                icon={<Receipt size={16} />}
                label="Receipt ID"
                value={sale.sale_id}
              />

              <InfoRow
                icon={<User size={16} />}
                label="Cashier"
                value={sale.cashier_name}
              />

              <InfoRow
                icon={<Store size={16} />}
                label="Branch"
                value={sale.location_name}
              />

              <InfoRow
                icon={<CreditCard size={16} />}
                label="Payment Method"
                value={sale.payment_methods}
              />

              <InfoRow
                icon={<Calendar size={16} />}
                label="Date & Time"
                value={new Date(sale.created_at).toLocaleString()}
              />
            </CardContent>
          </Card>
          {/* CUSTOMER */}

          {sale.customer_name && (
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">
                      {sale.customer_name}
                    </h3>

                    <p className="text-muted-foreground">
                      {sale.customer_phone || "No phone number"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* PRODUCTS SOLD */}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Products Sold
              </CardTitle>
            </CardHeader>

            <CardContent>
              {items.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  No items found
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <Card key={item.sale_item_id} className="border-muted">
                      <CardContent className="p-4">
                        <div className="flex justify-between gap-4">
                          <div className="flex-1">
                            {console.log(item)}
                            <h4 className="font-semibold text-base">
                              {item.product_name}
                            </h4>

                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className="w-20 h-20 rounded object-cover"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              {item.category_name || "Uncategorized"}
                            </p>

                            <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                              <span>Qty: {item.quantity}</span>

                              <span>
                                Unit Price: ₦
                                {Number(item.unit_price).toLocaleString()}
                              </span>

                              <span>
                                Cost: ₦
                                {Number(item.cost_price).toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-xl font-bold">
                              ₦{Number(item.subtotal).toLocaleString()}
                            </div>

                            <div className="text-xs text-green-600 mt-1">
                              Profit ₦{Number(item.profit).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* SALE SUMMARY */}

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Sale Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Quantity</span>

                <span className="font-medium">{sale.total_quantity}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Revenue</span>

                <span className="font-medium">
                  ₦{Number(sale.total_amount).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Cost</span>

                <span className="font-medium">
                  ₦{Number(sale.total_cost).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Profit</span>

                <span className="font-medium text-green-600">
                  ₦{Number(sale.profit).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Margin</span>

                <span className="font-medium">{sale.margin_percent}%</span>
              </div>

              <div className="border-t pt-4 flex justify-between items-center">
                <span className="font-bold text-lg">Grand Total</span>

                <span className="font-bold text-2xl">
                  ₦{Number(sale.total_amount).toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                HELPER ROW                                  */
/* -------------------------------------------------------------------------- */

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>

      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </p>

        <p className="font-medium break-all">{value || "-"}</p>
      </div>
    </div>
  );
}
