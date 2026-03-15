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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  approveTransfer,
  getTransfers,
  handle_dispatch,
  handle_receive,
} from "@/feautures/transfer/transferService";
import { getBranches } from "@/feautures/branches/branchService";

export default function OwnerTransfersPage() {
  const [transfers, setTransfers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedItems, setSelectedItems] = useState({});
  const [sourceBranches, setSourceBranches] = useState([]);
  const [selectedSourceBranch, setSelectedSourceBranch] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeOverlay, setActiveOverlay] = useState(null);

  const fetchTransfers = async () => {
    setLoading(true);
    const data = await getTransfers();
    setTransfers(data || []);
    setLoading(false);
  };

  const loadBranches = async () => {
    const branches = await getBranches();
    setSourceBranches(branches || []);
  };

  useEffect(() => {
    fetchTransfers();
    loadBranches();
  }, []);

  const handleQuantityChange = (transferId, productId, value) => {
    setSelectedItems((prev) => ({
      ...prev,
      [transferId]: {
        ...prev[transferId],
        [productId]: {
          ...prev[transferId]?.[productId],
          quantity: Number(value),
          approved: prev[transferId]?.[productId]?.approved || false,
        },
      },
    }));
  };

  const toggleItemApproval = (transferId, productId, approved) => {
    setSelectedItems((prev) => ({
      ...prev,
      [transferId]: {
        ...prev[transferId],
        [productId]: {
          ...prev[transferId]?.[productId],
          approved,
          quantity: prev[transferId]?.[productId]?.quantity || 0,
        },
      },
    }));
  };

  const allItemsDecided = (transfer) => {
    const decisions = selectedItems[transfer.id] || {};
    return transfer.items.every(
      (item) => decisions[item.product_id]?.approved !== undefined,
    );
  };

  const canSubmit = (transfer) =>
    allItemsDecided(transfer) && !!selectedSourceBranch[transfer.id];

  const handleApprove = async (transfer) => {
    if (!canSubmit(transfer)) return;

    const itemsObj = selectedItems[transfer.id] || {};
    const items = Object.entries(itemsObj).map(
      ([product_id, { approved, quantity }]) => ({
        product_id,
        approved,
        quantity,
      }),
    );

    await approveTransfer(
      transfer.id,
      items,
      selectedSourceBranch[transfer.id],
    );

    setSelectedItems((prev) => ({ ...prev, [transfer.id]: {} }));
    setSelectedSourceBranch((prev) => ({ ...prev, [transfer.id]: null }));
    setActiveOverlay(null);
    fetchTransfers();
  };

  const handleDispatch = async (transferId) => {
    await handle_dispatch(transferId);
    fetchTransfers();
  };

  const handleReceive = async (transferId) => {
    await handle_receive(transferId);
    fetchTransfers();
  };

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

  if (loading)
    return <div className="p-4 text-center">Loading transfers...</div>;

  return (
    <div className="p-1 md:p-2 space-y-4 relative">
      {/* Stats Cards */}
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

      {/* Transfer Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transfer Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4">
            <Input
              placeholder="Search transfers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
          </div>

          {filteredTransfers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No transfers found
            </div>
          ) : (
            <div className="overflow-x-auto relative">
              <Table className="min-w-full w-max">
                <TableHeader>
                  <TableRow className="bg-accent text-white">
                    <TableHead>Transfer ID</TableHead>
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
                    <TableRow key={t.id} className="hover:bg-gray-50">
                      <TableCell>{t.id.slice(0, 8)}</TableCell>
                      <TableCell>{t.from_branch || "-"}</TableCell>
                      <TableCell>{t.to_branch}</TableCell>
                      <TableCell>{t.requested_by.slice(0, 8)}</TableCell>
                      <TableCell>{t.status}</TableCell>

                      <TableCell className="space-y-1">
                        {t.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => handleApprove(t)}
                            disabled={!canSubmit(t)}
                          >
                            Submit Decisions
                          </Button>
                        )}
                        {t.status === "approved" && (
                          <Button
                            size="sm"
                            onClick={() => handleDispatch(t.id)}
                          >
                            Dispatch
                          </Button>
                        )}
                        {t.status === "dispatched" && (
                          <Button size="sm" onClick={() => handleReceive(t.id)}>
                            Receive
                          </Button>
                        )}
                      </TableCell>

                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() =>
                            setActiveOverlay(
                              activeOverlay === t.id ? null : t.id,
                            )
                          }
                        >
                          {activeOverlay === t.id ? "Hide Items" : "View Items"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Floating Overlay */}
      {activeOverlay && (
        <div className="fixed inset-0 flex justify-center items-start bg-black/30 z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-4 relative">
            <Button
              size="sm"
              variant="destructive"
              className="absolute top-2 right-2"
              onClick={() => setActiveOverlay(null)}
            >
              X
            </Button>

            <h3 className="text-lg font-semibold mb-2">
              Items for Transfer {activeOverlay.slice(0, 8)}
            </h3>

            {/* Select Source Branch inside overlay */}
            {transfers.find((t) => t.id === activeOverlay)?.status ===
              "pending" && (
              <div className="mb-4">
                <Select
                  value={selectedSourceBranch[activeOverlay] || ""}
                  onValueChange={(val) =>
                    setSelectedSourceBranch((prev) => ({
                      ...prev,
                      [activeOverlay]: val,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceBranches.map((b) => (
                      <SelectItem key={b.location_id} value={b.location_id}>
                        {b.branch_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {transfers
                .find((t) => t.id === activeOverlay)
                ?.items.map((item) => {
                  const itemState = selectedItems[activeOverlay]?.[
                    item.product_id
                  ] || { quantity: item.quantity };
                  return (
                    <div
                      key={item.product_id}
                      className="flex items-center space-x-2 flex-wrap"
                    >
                      <span className="px-1 py-0.5 rounded bg-gray-100 truncate max-w-xs block">
                        {item.product_name}
                      </span>
                      <Input
                        type="number"
                        min={0}
                        value={itemState.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            activeOverlay,
                            item.product_id,
                            e.target.value,
                          )
                        }
                        className="w-16"
                      />
                      <Button
                        size="xs"
                        variant={
                          itemState.approved === true ? "success" : "outline"
                        }
                        onClick={() =>
                          toggleItemApproval(
                            activeOverlay,
                            item.product_id,
                            true,
                          )
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        size="xs"
                        variant={
                          itemState.approved === false
                            ? "destructive"
                            : "outline"
                        }
                        onClick={() =>
                          toggleItemApproval(
                            activeOverlay,
                            item.product_id,
                            false,
                          )
                        }
                      >
                        Reject
                      </Button>
                    </div>
                  );
                })}
            </div>

            <Button
              className="mt-4"
              onClick={() =>
                handleApprove(transfers.find((t) => t.id === activeOverlay))
              }
              disabled={
                !canSubmit(transfers.find((t) => t.id === activeOverlay))
              }
            >
              Submit Decisions
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
