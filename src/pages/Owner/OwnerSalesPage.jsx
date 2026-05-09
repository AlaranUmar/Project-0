import React, { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getSales } from "@/feautures/sales/Sales";
import Stats from "@/components/ui/Stats";
import { Banknote, CreditCard, Plane, Send, Wallet } from "lucide-react";
export default function OwnerSalesPage() {
  const [sales, setSales] = useState(null);
  const [search, setSearch] = useState("");

  const filteredSales = useMemo(() => {
    const term = search.toLowerCase();
    return sales.filter(
      (sale) =>
        sale.sale_id.toLowerCase().includes(term) ||
        sale.cashier_name.toLowerCase().includes(term) ||
        sale.items.some((p) => p.product_name.toLowerCase().includes(term)) ||
        sale.branch_name.toLowerCase().includes(term),
    );
  }, [sales, search]);
  useEffect(() => {
    async function fetchSales() {
      const data = await getSales();
      setSales(data);
      console.log(data);
    }
    fetchSales();
  }, []);
  if (!sales) {
    return (
      <div className="p-4">
        <p>Loading sales...</p>
      </div>
    );
  }
  const totalTransferRevenue = filteredSales.reduce(
    (sum, sale) => sum + (sale.payment_method === "transfer" ? sale.amount : 0),
    0,
  );
  const totalCashRevenue = filteredSales.reduce(
    (sum, sale) => sum + (sale.payment_method === "cash" ? sale.amount : 0),
    0,
  );
  const totalPOSRevenue = filteredSales.reduce(
    (sum, sale) => sum + (sale.payment_method === "pos" ? sale.amount : 0),
    0,
  );
  const totalSales = filteredSales.length;

  return (
    <div className="p-1 md:p-4 space-y-4">
      <div className="grid gap-3 md:gap-5 grid-cols-2 md:grid-cols-4">
        <Stats title={"Total Sales"} value={totalSales} icon={Wallet} />
        <Stats
          title={"Total Transfer Revenue"}
          value={totalTransferRevenue}
          icon={Send}
        />
        <Stats
          title={"Total Cash Revenue"}
          value={totalCashRevenue}
          icon={Banknote}
        />
        <Stats
          title={"Total POS Revenue"}
          value={totalPOSRevenue}
          icon={CreditCard}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Sales Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <Input
              placeholder="Search sales by ID, cashier name, product name, or branch"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 mr-2"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow className={"bg-accent"}>
                <TableHead className={"w-10"}>
                  <div className="flex justify-center items-center h-full">
                    <Input
                      type={"checkbox"}
                      className={"size-3.5 text-white"}
                    />
                  </div>
                </TableHead>
                <TableHead>Id</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Cashier Name</TableHead>
                <TableHead>Paid with</TableHead>
                <TableHead>items</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => (
                <SalesRow key={sale.sale_id} sale={sale} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function SalesRow({ sale }) {
  const {
    sale_id,
    created_at,
    branch_name,
    cashier_name,
    payment_method,
    items,
    amount,
  } = sale;
  return (
    <TableRow key={sale_id} className={"hover:bg-gray-50"}>
      <TableCell className={"font-mono"}>
        {" "}
        <div className="flex justify-center items-center h-full">
          <Input type={"checkbox"} className={"size-3.5 text-white"} />
        </div>
      </TableCell>
      <TableCell className={"font-mono"}>{sale_id.slice(0, 8)}</TableCell>
      <TableCell>{new Date(created_at).toLocaleString()}</TableCell>
      <TableCell>{branch_name}</TableCell>
      <TableCell>{cashier_name}</TableCell>
      <TableCell className="capitalize">{payment_method}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {items.map((p) => (
            <span
              key={p.product_name}
              className="px-2 py-1 bg-secondary rounded text-[10px] space-x-1 flex items-center max-w-30"
            >
              <p className="truncate max-w-30 text-ellipsis inline-block">
                {p.product_name}
              </p>
              ({p.quantity})
            </span>
          ))}
        </div>
      </TableCell>
      <TableCell>₦{amount.toLocaleString()}</TableCell>
    </TableRow>
  );
}
