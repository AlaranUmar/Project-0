import { getSales } from "@/feautures/sales/Sales";
import { useEffect, useState } from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

function CashierSalesPage() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    async function fetchSales() {
      const data = await getSales();
      setSales(data);
    }
    fetchSales();
  }, []);

  // group sale items by sale
  const groupedSales = sales.reduce((acc, item) => {
    if (!acc[item.sale_id]) {
      acc[item.sale_id] = {
        sale_id: item.sale_id,
        created_at: item.created_at,
        amount: item.amount,
        cashier_name: item.cashier_name,
        items: [],
      };
    }

    acc[item.sale_id].items.push({
      product_name: item.product_name,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.subtotal,
    });

    return acc;
  }, {});

  const salesList = Object.values(groupedSales);

  return (
    <div className="p-4 flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Sales History</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {salesList.map((sale) => (
            <div
              key={sale.sale_id}
              className="border rounded-md p-3 flex flex-col gap-2"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">
                    Sale #{sale.sale_id.slice(0, 8)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(sale.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">${sale.amount}</p>
                  <p className="text-xs text-muted-foreground">
                    {sale.cashier_name}
                  </p>
                </div>
              </div>

              {/* products */}
              <div className="text-sm flex flex-col gap-1">
                {sale.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-muted-foreground"
                  >
                    <span>
                      {item.product_name} x{item.quantity}
                    </span>
                    <span>${item.subtotal}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default CashierSalesPage;
