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
  const [loadingIds, setLoadingIds] = useState([]); // per-transfer loading

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
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
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [profile?.id]);

  // Stats calculation
  const stats = useMemo(
    () => ({
      total: transfers.length,
      completed: transfers.filter((t) => t.status === "completed").length,
      approved: transfers.filter((t) => t.status === "approved").length,
      dispatched: transfers.filter((t) => t.status === "dispatched").length,
    }),
    [transfers],
  );

  // Filtered transfers
  const filteredTransfers = useMemo(() => {
    const term = search.toLowerCase();
    return transfers.filter(
      (t) =>
        t.id.toLowerCase().includes(term) ||
        (t.status?.toLowerCase() || "").includes(term) ||
        (t.from_branch?.toLowerCase() || "").includes(term) ||
        (t.to_branch?.toLowerCase() || "").includes(term),
    );
  }, [transfers, search]);

  // Dispatch transfer
  const handleDispatch = async (transferId) => {
    setLoadingIds((prev) => [...prev, transferId]);
    try {
      await handle_dispatch(transferId);
      setTransfers((prev) =>
        prev.map((t) =>
          t.id === transferId ? { ...t, status: "dispatched" } : t,
        ),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== transferId));
    }
  };

  // Receive transfer
  const handleReceive = async (transferId) => {
    setLoadingIds((prev) => [...prev, transferId]);
    try {
      await handle_receive(transferId);
      setTransfers((prev) =>
        prev.map((t) =>
          t.id === transferId ? { ...t, status: "completed" } : t,
        ),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== transferId));
    }
  };

  const handleRequestTransfer = async (items) => {
    if (!branchId) return;
    setLoadingIds((prev) => [...prev, "request"]);
    try {
      await handle_request(branchId, items); // send request to backend
      setOpenRequest(false);

      // Create a temporary transfer object to add immediately
      const tempTransfer = {
        id: "tmp_" + Date.now(), // temporary unique ID
        status: "approved", // default status for new request
        from_location_id: branchId, // your branch
        to_location_id: branchId, // adjust if needed
        items: items.map((i) => ({
          product_id: i.id,
          product_name: i.name,
          quantity: i.quantity,
        })),
      };

      // Add it to the top of the list
      setTransfers((prev) => [tempTransfer, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== "request"));
    }
  };

  if (loading)
    return <div className="p-4 text-center">Loading transfers...</div>;

  return (
    <div className="p-1 md:p-4 space-y-4">
      {/* Stats Cards */}
      <div className="grid gap-2 md:gap-5 grid-cols-2 md:grid-cols-4">
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

      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Transfer Management</CardTitle>
          <Button
            onClick={() =>
              branchId ? setOpenRequest(true) : alert("Branch info loading...")
            }
            disabled={loadingIds.includes("request")}
          >
            {loadingIds.includes("request")
              ? "Requesting..."
              : "Request Transfer"}
          </Button>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex mb-4">
            <Input
              placeholder="Search by ID, Branch, or Status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
          </div>

          {/* Transfer Table */}
          {filteredTransfers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No transfers found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-accent text-white">
                  <TableHead>Transfer ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransfers.map((t) => (
                  <TableRow key={t.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono">
                      {t.id.slice(0, 8)}
                    </TableCell>
                    <TableCell className="capitalize">{t.status}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {(t.items || []).map((item) => (
                          <span
                            key={item.product_id}
                            className="px-2 py-1 bg-secondary rounded text-[10px] flex items-center"
                          >
                            <p className="truncate max-w-40 inline-block">
                              {item.product_name}
                            </p>
                            ({item.quantity})
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="space-x-2">
                      {t.status === "approved" &&
                        t.from_location_id === branchId && (
                          <Button
                            size="sm"
                            onClick={() => handleDispatch(t.id)}
                            disabled={loadingIds.includes(t.id)}
                          >
                            {loadingIds.includes(t.id)
                              ? "Dispatching..."
                              : "Dispatch"}
                          </Button>
                        )}
                      {t.status === "dispatched" &&
                        t.to_location_id === branchId && (
                          <Button
                            size="sm"
                            onClick={() => handleReceive(t.id)}
                            disabled={loadingIds.includes(t.id)}
                          >
                            {loadingIds.includes(t.id)
                              ? "Receiving..."
                              : "Receive"}
                          </Button>
                        )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Request Transfer Modal */}
          <RequestTransferModal
            open={openRequest}
            onClose={() => setOpenRequest(false)}
            branchId={branchId}
            products={products}
            onSubmit={handleRequestTransfer}
          />
        </CardContent>
      </Card>
    </div>
  );
}
