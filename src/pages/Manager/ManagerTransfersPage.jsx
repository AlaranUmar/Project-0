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
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch all initial data
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

  // Debounced search filtering
  const filteredTransfers = useMemo(() => {
    const term = search.toLowerCase();
    return transfers.filter(
      (t) =>
        t.id.toLowerCase().includes(term) ||
        t.status.toLowerCase().includes(term) ||
        t.from_branch?.toLowerCase().includes(term) ||
        t.to_branch?.toLowerCase().includes(term),
    );
  }, [transfers, search]);

  // Dispatch transfer
  const handleDispatch = async (transferId) => {
    setActionLoading(true);
    try {
      await handle_dispatch(transferId);
      fetchData();
    } finally {
      setActionLoading(false);
    }
  };

  // Receive transfer
  const handleReceive = async (transferId) => {
    setActionLoading(true);
    try {
      await handle_receive(transferId);
      fetchData();
    } finally {
      setActionLoading(false);
    }
  };

  // Request a new transfer
  const handleRequestTransfer = async (items) => {
    if (!branchId) return;
    setActionLoading(true);
    try {
      await handle_request(branchId, items);
      setOpenRequest(false);
      fetchData();
    } finally {
      setActionLoading(false);
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
          >
            Request Transfer
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
                  <TableHead>From Branch</TableHead>
                  <TableHead>To Branch</TableHead>
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
                    <TableCell>{t.from_branch || "-"}</TableCell>
                    <TableCell>{t.to_branch}</TableCell>
                    <TableCell className="capitalize">{t.status}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {t.items.map((item) => (
                          <span
                            key={item.product_id}
                            className="px-2 py-1 bg-secondary rounded text-[10px]"
                          >
                            {item.product_name} ({item.quantity})
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
                            disabled={actionLoading}
                          >
                            Dispatch
                          </Button>
                        )}
                      {t.status === "dispatched" &&
                        t.to_location_id === branchId && (
                          <Button
                            size="sm"
                            onClick={() => handleReceive(t.id)}
                            disabled={actionLoading}
                          >
                            Receive
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
