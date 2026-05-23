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

import { getSales } from "@/feautures/sales/Sales";

import { Banknote, CreditCard, Send, Wallet } from "lucide-react";

import Stats from "@/components/ui/Stats";

export default function OwnerSalesPage() {
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSales() {
      try {
        setLoading(true);
        const data = await getSales();
        setSales(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch sales:", err);
        setSales([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSales();
  }, []);

  const filteredSales = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return sales;

    return (sales ?? []).filter((sale) => {
      const saleId = sale.sale_id?.toLowerCase() || "";
      const cashier = sale.cashier_name?.toLowerCase() || "";
      const branch = sale.branch_name?.toLowerCase() || "";

      const itemsMatch = (sale.items ?? []).some((p) =>
        (p.product_name || "").toLowerCase().includes(term),
      );

      return (
        saleId.includes(term) ||
        cashier.includes(term) ||
        branch.includes(term) ||
        itemsMatch
      );
    });
  }, [sales, search]);

  // GLOBAL STATS (NOT FILTERED — FIXED)
  const totalTransferRevenue = useMemo(
    () =>
      (sales ?? []).reduce(
        (sum, sale) =>
          sum + (sale.payment_method === "transfer" ? sale.amount : 0),
        0,
      ),
    [sales],
  );

  const totalCashRevenue = useMemo(
    () =>
      (sales ?? []).reduce(
        (sum, sale) => sum + (sale.payment_method === "cash" ? sale.amount : 0),
        0,
      ),
    [sales],
  );

  const totalPOSRevenue = useMemo(
    () =>
      (sales ?? []).reduce(
        (sum, sale) => sum + (sale.payment_method === "pos" ? sale.amount : 0),
        0,
      ),
    [sales],
  );

  const totalSales = sales.length;

  if (loading) {
    return (
      <div className="p-4 text-sm text-muted-foreground animate-pulse">
        Loading sales data...
      </div>
    );
  }

  return (
    <div className="p-1 md:p-4 space-y-4">
      {/* STATS */}
      <div className="grid gap-3 md:gap-5 grid-cols-2 md:grid-cols-4">
        <Stats title="Total Sales" value={totalSales} icon={Wallet} />
        <Stats
          title="Transfer Revenue"
          value={totalTransferRevenue}
          icon={Send}
        />
        <Stats title="Cash Revenue" value={totalCashRevenue} icon={Banknote} />
        <Stats title="POS Revenue" value={totalPOSRevenue} icon={CreditCard} />
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Management</CardTitle>
        </CardHeader>

        <CardContent>
          {/* SEARCH */}
          <div className="flex items-center mb-4">
            <Input
              placeholder="Search sales by ID, cashier, product, or branch"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-accent">
                <TableHead className="w-10 text-center">
                  <input type="checkbox" className="size-3.5" />
                </TableHead>
                <TableHead>Id</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Cashier</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Items</TableHead>
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
    <TableRow className="hover:bg-gray-50">
      <TableCell className="text-center">
        <input type="checkbox" className="size-3.5" />
      </TableCell>

      <TableCell className="font-mono">{sale_id?.slice(0, 8)}</TableCell>

      <TableCell>{new Date(created_at).toLocaleString()}</TableCell>

      <TableCell>{branch_name}</TableCell>

      <TableCell>{cashier_name}</TableCell>

      <TableCell className="capitalize">{payment_method}</TableCell>

      <TableCell>
        <div className="flex flex-wrap gap-1">
          {(items ?? []).map((p, idx) => (
            <span
              key={`${sale_id}-${idx}`}
              className="px-2 py-1 bg-secondary rounded text-[10px] flex items-center gap-1 max-w-32"
            >
              <span className="truncate max-w-24">{p.product_name}</span>
              <span>({p.quantity})</span>
            </span>
          ))}
        </div>
      </TableCell>

      <TableCell>₦{Number(amount || 0).toLocaleString()}</TableCell>
    </TableRow>
  );
}
