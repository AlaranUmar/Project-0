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

import {
  getTransfers,
  handle_dispatch,
  handle_receive,
} from "@/feautures/transfer/transferService";

import { getProducts } from "@/feautures/products/productService";
import TransferOverlay from "./TransferOverlay";

export default function OwnerTransfersPage() {
  const [transfers, setTransfers] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [activeOverlay, setActiveOverlay] = useState(null);

  const fetchTransfers = async () => {
    const data = await getTransfers();
    setTransfers(data || []);
  };

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data || []);
  };

  useEffect(() => {
    fetchTransfers();
    loadProducts();

    // Auto refresh transfers every 15 seconds
    const interval = setInterval(fetchTransfers, 15000);

    return () => clearInterval(interval);
  }, []);

  const stats = useMemo(
    () => ({
      total: transfers.length,
      completed: transfers.filter((t) => t.status === "completed").length,
      approved: transfers.filter((t) => t.status === "approved").length,
      dispatched: transfers.filter((t) => t.status === "dispatched").length,
    }),
    [transfers],
  );

  const filteredTransfers = useMemo(
    () =>
      transfers.filter((t) =>
        t.id.toLowerCase().includes(search.toLowerCase()),
      ),
    [transfers, search],
  );

  const dispatchTransfer = async (id) => {
    await handle_dispatch(id);
    await fetchTransfers();
  };

  const receiveTransfer = async (id) => {
    await handle_receive(id);
    await fetchTransfers();
  };

  return (
    <div className="p-2 space-y-4">
      {/* STATS */}
      <div className="grid gap-2 md:gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        {Object.entries(stats).map(([label, value]) => (
          <Card key={label}>
            <CardHeader>
              <CardTitle className="text-sm capitalize">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* TRANSFERS TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Transfer Management</CardTitle>
        </CardHeader>

        <CardContent>
          <Input
            placeholder="Search transfers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4"
          />

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-accent text-white">
                  <TableHead>ID</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                  <TableHead>Items</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredTransfers.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.id.slice(0, 8)}</TableCell>
                    <TableCell>{t.from_branch || "-"}</TableCell>
                    <TableCell>{t.to_branch}</TableCell>
                    <TableCell>{t.requested_by.slice(0, 8)}</TableCell>
                    <TableCell className="capitalize">{t.status}</TableCell>

                    <TableCell className="flex gap-2 flex-wrap">
                      {/* View */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setActiveOverlay(t.id)}
                      >
                        View
                      </Button>

                      {/* Decide */}
                      {t.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => setActiveOverlay(t.id)}
                        >
                          Decide
                        </Button>
                      )}

                      {/* Dispatch */}
                      {t.status === "approved" && (
                        <Button
                          size="sm"
                          onClick={() => dispatchTransfer(t.id)}
                        >
                          Dispatch
                        </Button>
                      )}

                      {/* Receive */}
                      {t.status === "dispatched" && (
                        <Button size="sm" onClick={() => receiveTransfer(t.id)}>
                          Receive
                        </Button>
                      )}
                    </TableCell>

                    <TableCell>{t.items.length} items</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* OVERLAY */}
      {activeOverlay && (
        <TransferOverlay
          transferId={activeOverlay}
          transfers={transfers}
          products={products}
          onClose={() => setActiveOverlay(null)}
          onRefresh={fetchTransfers}
        />
      )}
    </div>
  );
}
