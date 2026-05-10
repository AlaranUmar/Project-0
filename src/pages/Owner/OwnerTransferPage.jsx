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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowRight, Search, Loader2, Image } from "lucide-react";

// ✅ SERVICES
import {
  getTransfers,
  handle_dispatch,
  handle_receive,
  create_transfer,
} from "@/feautures/transfer/transferService";

import { getProducts } from "@/feautures/products/productService";

// ✅ COMPONENTS
import TransferOverlay from "./TransferOverlay";
// ✅ UTILS
import { formatCompactNaira } from "@/utils/formatting";
import CreateTransferModal from "@/feautures/transfer/CreateTransferModal";
export default function OwnerTransfersPage() {
  const [transfers, setTransfers] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [activeOverlay, setActiveOverlay] = useState(null);
  const [loadingIds, setLoadingIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);

  const productMap = useMemo(() => {
    const map = {};
    products.forEach((p) => (map[p.id] = p));
    return map;
  }, [products]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tData, pData] = await Promise.all([getTransfers(), getProducts()]);
      setTransfers(tData || []);
      setProducts(pData || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load transfers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ STATS
  const stats = useMemo(() => {
    let totalVal = 0;

    transfers.forEach((t) => {
      t.items?.forEach((item) => {
        const p = productMap[item.product_id];
        totalVal += (p?.price || 0) * item.quantity;
      });
    });

    return {
      total: transfers.length,
      pending: transfers.filter((t) => t.status === "pending").length,
      transit: transfers.filter((t) => t.status === "dispatched").length,
      value: formatCompactNaira(totalVal),
    };
  }, [transfers, productMap]);

  // ✅ SEARCH
  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return transfers.filter(
      (t) =>
        t.id?.toLowerCase().includes(term) ||
        t.to_location?.name?.toLowerCase().includes(term) ||
        t.from_location?.name?.toLowerCase().includes(term),
    );
  }, [transfers, search]);

  // ✅ ACTION HANDLER
  const performAction = async (fn, transfer, label) => {
    if (["completed", "rejected"].includes(transfer.status)) {
      toast.error("This transfer is locked");
      return;
    }

    setLoadingIds((prev) => [...prev, transfer.id]);

    try {
      await fn(transfer.id);
      toast.success(`${label} successful`);
      await fetchData();
    } catch (err) {
      toast.error(err?.message || `Failed to ${label}`);
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== transfer.id));
    }
  };

  // ✅ CREATE TRANSFER (OWNER POWER)
  const onCreateTransfer = async (payload) => {
    setLoadingIds((prev) => [...prev, "create"]);
    try {
      await create_transfer(payload);
      console.log("Transfer created:", payload);
      toast.success("Transfer created & approved");

      setOpenCreate(false);
      await fetchData();
    } catch (err) {
      toast.warning("transfer is being created");
      toast.error(err.message || "Failed to create transfer");
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== "create"));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-5 min-h-screen">
      {/* ✅ STATS */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total" value={stats.total} />
        <StatCard
          label="Pending"
          value={stats.pending}
          color="text-orange-600"
        />
        <StatCard
          label="In Transit"
          value={stats.transit}
          color="text-blue-600"
        />
        <StatCard label="Value" value={stats.value} />
      </div>

      <Card className="border-none">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Owner Transfer Control</CardTitle>
            <p className="text-sm">Full control over all inventory movement</p>

            <Button
              className="mt-2"
              onClick={() => setOpenCreate(true)}
              disabled={loadingIds.includes("create")}
            >
              {loadingIds.includes("create")
                ? "Creating..."
                : "Create Transfer"}
            </Button>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 " />
            <Input
              placeholder="Search transfers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      No transfers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="text-xs font-mono">
                        #{t.id.slice(0, 8)}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="">
                            {t.from_location?.name || "Warehouse"}
                          </span>
                          <ArrowRight className="w-3 h-3" />
                          <span className="font-bold">
                            {t.to_location?.name}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex -space-x-2">
                          {t.items?.slice(0, 3).map((item, i) => {
                            const product = productMap[item.product_id];

                            return product?.image_url ? (
                              <img
                                key={i}
                                src={product?.image_url}
                                className="w-7 h-7 rounded-full border bg-white"
                              />
                            ) : (
                              <div
                                key={i}
                                className="w-7 h-7 rounded-full border bg-slate-200 flex items-center justify-center"
                              >
                                <Image className="w-4 h-4 text-slate-500" />
                              </div>
                            );
                          })}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {t.status}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right flex justify-end gap-2">
                        {!["completed", "rejected"].includes(t.status) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setActiveOverlay(t.id)}
                          >
                            Review
                          </Button>
                        )}

                        {t.status === "approved" && (
                          <Button
                            size="sm"
                            disabled={loadingIds.includes(t.id)}
                            onClick={() =>
                              performAction(handle_dispatch, t, "Dispatch")
                            }
                          >
                            {loadingIds.includes(t.id) ? "Shipping..." : "Ship"}
                          </Button>
                        )}

                        {t.status === "dispatched" && (
                          <Button
                            size="sm"
                            variant="secondary"
                            disabled={loadingIds.includes(t.id)}
                            onClick={() =>
                              performAction(handle_receive, t, "Receive")
                            }
                          >
                            {loadingIds.includes(t.id)
                              ? "Receiving..."
                              : "Receive"}
                          </Button>
                        )}

                        {t.status === "completed" && (
                          <span className="text-xs text-green-600 font-bold">
                            Completed
                          </span>
                        )}

                        {t.status === "rejected" && (
                          <span className="text-xs text-red-600 font-bold">
                            Rejected
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ✅ OVERLAY */}
      {activeOverlay && (
        <TransferOverlay
          transferId={activeOverlay}
          transfers={transfers}
          products={products}
          onClose={() => setActiveOverlay(null)}
          onRefresh={fetchData}
        />
      )}

      {/* ✅ CREATE MODAL */}
      <CreateTransferModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        products={products}
        onSubmit={onCreateTransfer}
      />
    </div>
  );
}

// ✅ STAT CARD
function StatCard({ label, value, color = "" }) {
  return (
    <Card className="p-4">
      <p className="text-xs  uppercase">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
    </Card>
  );
}
