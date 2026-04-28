import React, { useEffect, useState, useMemo } from "react";
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
import { Search, Package, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  getTransfers,
  handle_dispatch,
  handle_receive,
  handle_request,
} from "@/feautures/transfer/transferService";

import RequestTransferModal from "@/feautures/transfer/RequestTransferModal";
import { getStaff } from "@/feautures/staff/staffService";
import { getProducts } from "@/feautures/products/productService";

export default function ManagerTransfersPage({ profile }) {
  const [transfers, setTransfers] = useState([]);
  const [products, setProducts] = useState([]);
  const [branchId, setBranchId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [openRequest, setOpenRequest] = useState(false);
  const [loadingIds, setLoadingIds] = useState([]);

  const fetchData = async () => {
    try {
      const [transfersData, productsData] = await Promise.all([
        getTransfers(),
        getProducts(),
      ]);
      setTransfers(transfersData || []);
      setProducts(productsData || []);

      if (profile?.id) {
        const staff = await getStaff(profile.id);
        setBranchId(staff.location_id);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to sync transfer data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [profile?.id]);

  const stats = useMemo(
    () => ({
      total: transfers.length,
      pending: transfers.filter((t) => t.status === "pending").length,
      transit: transfers.filter((t) => t.status === "dispatched").length,
      completed: transfers.filter((t) => t.status === "completed").length,
    }),
    [transfers],
  );

  const filteredTransfers = useMemo(() => {
    const term = search.toLowerCase();
    return transfers.filter(
      (t) =>
        t.id.toLowerCase().includes(term) ||
        t.to_location?.name?.toLowerCase().includes(term) ||
        t.from_location?.name?.toLowerCase().includes(term),
    );
  }, [transfers, search]);

  const handleAction = async (fn, transferId, label) => {
    setLoadingIds((prev) => [...prev, transferId]);
    try {
      await fn(transferId);
      toast.success(`${label} successful`);
      await fetchData(); // Refresh data from server to ensure sync
    } catch (err) {
      toast.error(err.message || `Failed to ${label}`);
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== transferId));
    }
  };

  const onHandleRequest = async (items) => {
    if (!branchId) {
      toast.error("Branch not loaded yet");
      return;
    }

    setLoadingIds((prev) => [...prev, "request"]);

    try {
      await handle_request(branchId, items);

      toast.success("Transfer request sent");

      setOpenRequest(false);

      await fetchData(); // ✅ IMPORTANT
    } catch (err) {
      console.error("REQUEST ERROR:", err);
      toast.error(err.message || "Failed to request transfer");
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== "request"));
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
        <p className="text-sm text-muted-foreground">Loading transfers...</p>
      </div>
    );

  return (
    <div className="p-4 space-y-4">
      {/* Stats Section */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <StatCard label="My Transfers" value={stats.total} />
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
        <StatCard
          label="Completed"
          value={stats.completed}
          color="text-green-600"
        />
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Transfer Management</CardTitle>
            <p className="text-xs text-muted-foreground">
              Manage stock moving in and out of your branch
            </p>
          </div>
          <Button
            onClick={() =>
              branchId
                ? setOpenRequest(true)
                : toast.info("Branch info loading...")
            }
            disabled={loadingIds.includes("request")}
          >
            Request Transfer
          </Button>
        </CardHeader>

        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID or Branch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Route</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransfers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-10 text-muted-foreground"
                    >
                      No transfers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransfers.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-medium text-slate-500">
                            {t.from_location?.name || "Warehouse"}
                          </span>
                          <ArrowRight className="w-3 h-3 text-primary" />
                          <span className="font-bold">
                            {t.to_location?.name}
                          </span>
                        </div>
                        <div className="text-[9px] font-mono text-muted-foreground">
                          #{t.id.slice(0, 8)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="capitalize text-[10px]"
                        >
                          {t.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex -space-x-2">
                          {t.items?.slice(0, 3).map((item, i) => {
                            const p = products.find(
                              (prod) => prod.id === item.product_id,
                            );
                            return (
                              <img
                                key={i}
                                src={p?.image_url}
                                className="w-7 h-7 rounded-full border-2 border-white object-cover bg-slate-100"
                                title={p?.name}
                              />
                            );
                          })}
                          {t.items?.length > 3 && (
                            <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[9px] font-bold">
                              +{t.items.length - 3}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {t.status === "approved" &&
                          t.from_location_id === branchId && (
                            <Button
                              size="sm"
                              className="h-8 text-xs"
                              onClick={() =>
                                handleAction(handle_dispatch, t.id, "Dispatch")
                              }
                              disabled={loadingIds.includes(t.id)}
                            >
                              {loadingIds.includes(t.id)
                                ? "Shipping..."
                                : "Ship Items"}
                            </Button>
                          )}
                        {t.status === "dispatched" &&
                          t.to_location_id === branchId && (
                            <Button
                              size="sm"
                              variant="secondary"
                              className="h-8 text-xs"
                              onClick={() =>
                                handleAction(handle_receive, t.id, "Receive")
                              }
                              disabled={loadingIds.includes(t.id)}
                            >
                              {loadingIds.includes(t.id)
                                ? "Receiving..."
                                : "Receive Items"}
                            </Button>
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

      <RequestTransferModal
        open={openRequest}
        onClose={() => setOpenRequest(false)}
        branchId={branchId}
        products={products}
        onSubmit={onHandleRequest}
      />
    </div>
  );
}

function StatCard({ label, value, color = "" }) {
  return (
    <Card className="p-4 flex flex-col gap-1">
      <p className="text-[10px] font-bold text-muted-foreground uppercase">
        {label}
      </p>
      <p className={`text-xl font-black ${color}`}>{value}</p>
    </Card>
  );
}
