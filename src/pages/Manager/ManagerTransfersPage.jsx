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
import {
  approveTransfer,
  getTransfers,
  handle_dispatch,
  handle_receive,
} from "@/feautures/transfer/transferService";

export default function ManagerTransfersPage() {
  const [transfers, setTransfers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedItems, setSelectedItems] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTransfers = async () => {
      setLoading(true);
      const data = await getTransfers();
      setTransfers(data);
      setLoading(false);
    };

    fetchTransfers();
  }, []);

  const filteredTransfers = transfers.filter(
    (t) =>
      t.transfer_id?.toLowerCase().includes(search?.toLowerCase()) ||
      t.from_branch_name?.toLowerCase().includes(search?.toLowerCase()) ||
      t.to_branch_name?.toLowerCase().includes(search?.toLowerCase()) ||
      t.requested_by_name?.toLowerCase().includes(search?.toLowerCase()),
  );

  const toggleItemSelection = (transferId, productId) => {
    setSelectedItems((prev) => {
      const current = prev[transferId] || [];
      const updated = current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId];
      return { ...prev, [transferId]: updated };
    });
  };

  const handleApprove = async (transferId) => {
    const items = selectedItems[transferId]?.map((pid) => ({
      product_id: pid,
      approved: true,
    }));
    if (!items || items.length === 0) return;

    await approveTransfer(transferId, items);
  };

  const handleDispatch = async (transferId) => {
    await handle_dispatch(transferId);
  };

  const handleReceive = async (transferId) => {
    await handle_receive(transferId);
  };

  if (loading) return <div className="p-4">Loading transfers...</div>;

  return (
    <div className="p-1 md:p-4 space-y-4">
      <div className="grid gap-2 md:gap-5 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Total</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-lg font-semibold">{transfers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Completed</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-lg font-semibold">
              {transfers.filter((t) => t.status === "completed").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Approved</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-lg font-semibold">
              {transfers.filter((t) => t.status === "approved").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Rejected</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-lg font-semibold">
              {transfers.filter((t) => t.status === "rejected").length}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Transfer Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4">
            <Input
              placeholder="Search transfers by ID, from/to branch, or requester"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 mr-2"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-accent text-white">
                <TableHead>Select</TableHead>
                <TableHead>Transfer ID</TableHead>
                <TableHead>From Branch</TableHead>
                <TableHead>To Branch</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredTransfers.map((t) => (
                <TableRow key={t.transfer_id} className="hover:bg-gray-50">
                  <TableCell className="flex justify-center">
                    <Input
                      type="checkbox"
                      checked={
                        selectedItems[t.transfer_id]?.length === t.items.length
                      }
                      onChange={() =>
                        t.items.forEach((item) =>
                          toggleItemSelection(t.transfer_id, item.product_id),
                        )
                      }
                    />
                  </TableCell>

                  <TableCell>{t.transfer_id.slice(0, 8)}</TableCell>
                  <TableCell>{t.from_branch_name || "-"}</TableCell>
                  <TableCell>{t.to_branch_name}</TableCell>
                  <TableCell>{t.requested_by_name}</TableCell>
                  <TableCell>{t.status}</TableCell>

                  <TableCell className="flex flex-wrap">
                    {t.items.map((item) => (
                      <span
                        key={item.product_id}
                        title={`${item.product_name} (${item.quantity})`}
                        className="mr-2 mb-1 px-1 rounded bg-gray-200 cursor-pointer"
                        onClick={() =>
                          toggleItemSelection(t.transfer_id, item.product_id)
                        }
                      >
                        {item.product_name} ({item.quantity})
                      </span>
                    ))}
                  </TableCell>

                  <TableCell className="space-x-2">
                    {t.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => handleApprove(t.transfer_id)}
                      >
                        Approve Selected
                      </Button>
                    )}
                    {t.status === "approved" && (
                      <Button
                        size="sm"
                        onClick={() => handleDispatch(t.transfer_id)}
                      >
                        Dispatch
                      </Button>
                    )}
                    {t.status === "dispatched" && (
                      <Button
                        size="sm"
                        onClick={() => handleReceive(t.transfer_id)}
                      >
                        Receive
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
