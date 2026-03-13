import React, { useEffect, useState } from "react";
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
import { DollarSign } from "lucide-react";
export default function OwnerSalesPage() {
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchSales() {
      const data = await getSales();
      setSales(data);
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
  const filteredSales = sales.filter(
    (s) =>
      s.sale_id?.toLowerCase().includes(search?.toLowerCase()) ||
      s.cashier_name?.toLowerCase().includes(search?.toLowerCase()) ||
      s.product_name?.toLowerCase().includes(search?.toLowerCase()) ||
      s.branch_name?.toLowerCase().includes(search?.toLowerCase()) ||
      s.transaction_type?.toLowerCase().includes(search?.toLowerCase()),
  );

  return (
    <div className="p-1 md:p-4 space-y-4">
      <div className="grid gap-3 md:gap-5 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Total Transfer Revenue</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-xl font-bold">$4,200</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Total Cash Revenue</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-xl font-bold">$4,200</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Total POS Revenue</CardTitle>

            <DollarSign size={18} />
          </CardHeader>

          <CardContent>
            <div className="text-xl font-bold">$4,200</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Total Revenue</CardTitle>

            <DollarSign size={18} />
          </CardHeader>

          <CardContent>
            <div className="text-xl font-bold">$4,200</div>
          </CardContent>
        </Card>
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
                <TableHead>Products</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((st) => (
                <TableRow key={st.sale_id}>
                  <TableCell className="font-medium">
                    <div className="flex justify-center items-center h-full">
                      <Input
                        type={"checkbox"}
                        className={"size-3 text-white"}
                      />
                    </div>
                  </TableCell>
                  <TableCell>{st.sale_id.slice(0, 8)}</TableCell>
                  <TableCell>{st.created_at?.slice(0, 10)}</TableCell>
                  <TableCell>{st.branch_name}</TableCell>
                  <TableCell>{st.cashier_name}</TableCell>
                  <TableCell>{st.payment_method}</TableCell>
                  <TableCell className={"flex flex-wrap"}>
                    {st.items.map((item, idx) => (
                      <span
                        title={item.product_name}
                        key={idx}
                        className="mr-2 max-w-20 text-ellipsis overflow-hidden whitespace-nowrap"
                      >
                        {item.product_name}
                      </span>
                    ))}
                  </TableCell>
                  <TableCell>{st.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
