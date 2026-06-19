import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Loader2, X, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import {
  approveTransfer,
  rejectTransfer,
} from "@/feautures/transfer/transferService";

import { getLocations } from "@/feautures/locations/locationService";
import { getInventoryByLocation } from "@/feautures/inventory/inventoryService";

export default function TransferOverlay({
  transferId,
  transfers,
  products,
  onClose,
  onRefresh,
}) {
  const transfer = transfers.find((t) => t.id === transferId);

  const isApproved = transfer?.status === "approved";
  const isRejected = transfer?.status === "rejected";
  const isPending = transfer?.status === "pending";
  const isCompleted = transfer?.status === "completed";
  const [locations, setLocations] = useState([]);
  const [selectedSource, setSelectedSource] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log(transfer);
  const [locationInventory, setLocationInventory] = useState({});

  const [selectedItems, setSelectedItems] = useState(
    () =>
      transfer?.items?.reduce((acc, item) => {
        acc[item.product_id] = {
          quantity: Number(item.quantity),
          approved: true,
        };
        return acc;
      }, {}) || {},
  );

  useEffect(() => {
    async function loadLocations() {
      try {
        const data = await getLocations();

        setLocations(
          (data || []).filter(
            (loc) => String(loc.id) !== String(transfer?.to_location_id),
          ),
        );
      } catch (err) {
        console.error(err);
      }
    }

    if (transfer) {
      loadLocations();
    }
  }, [transfer]);

  useEffect(() => {
    if (!transfer) return;

    if (transfer.from_location_id) {
      setSelectedSource(String(transfer.from_location_id));
    }
  }, [transfer]);

  useEffect(() => {
    let active = true;

    if (!selectedSource) {
      setLocationInventory({});
      return;
    }

    async function loadInventory() {
      try {
        const inventory = await getInventoryByLocation(selectedSource);

        if (!active) return;

        const stockMap = {};

        inventory?.forEach((row) => {
          stockMap[String(row.product_id)] = Number(row.quantity || 0);
        });

        setLocationInventory(stockMap);
      } catch (err) {
        console.error(err);
        toast.error("Failed loading inventory");
      }
    }

    loadInventory();

    return () => {
      active = false;
    };
  }, [selectedSource]);

  const itemsArray = Object.values(selectedItems);

  const hasApprovedItems = itemsArray.some((item) => item.approved === true);

  const updateQuantity = (productId, value) => {
    if (isApproved || isRejected) return;

    const available =
      locationInventory[String(productId)] ?? Number.MAX_SAFE_INTEGER;

    setSelectedItems((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        quantity: Math.max(1, Math.min(Number(value) || 1, available)),
      },
    }));
  };

  const toggleApproval = (productId, approved) => {
    if (isApproved || isRejected) return;

    setSelectedItems((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        approved,
      },
    }));
  };

  const handleSubmit = async () => {
    if (isApproved) {
      toast.error("Transfer has already been approved");
      return;
    }

    if (isRejected) {
      toast.error("Transfer has already been rejected");
      return;
    }

    const decisions = Object.entries(selectedItems).map(
      ([product_id, value]) => ({
        product_id,
        quantity: Number(value.quantity),
        approved: value.approved,
      }),
    );

    const allRejected = decisions.every((i) => !i.approved);

    if (!allRejected && !selectedSource) {
      return toast.error("Select Source Branch");
    }

    if (!allRejected) {
      for (const item of decisions) {
        if (!item.approved) continue;

        const available = locationInventory[String(item.product_id)] || 0;

        const product = products.find(
          (p) => String(p.id) === String(item.product_id),
        );

        const productName = product?.name || "Product";

        if (available <= 0) {
          toast.error(`${productName} is out of stock`);
          return;
        }

        if (item.quantity > available) {
          toast.error(`${productName}: only ${available} available`);
          return;
        }
      }
    }

    setIsSubmitting(true);

    try {
      if (allRejected) {
        await rejectTransfer(transferId);

        toast.success("Transfer rejected");
      } else {
        await approveTransfer(transferId, decisions, selectedSource);

        toast.success("Transfer approved");
      }

      onRefresh?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed processing transfer");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!transfer) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center px-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div className="flex flex-col gap-2">
            <CardTitle>Transfer Review</CardTitle>

            <div>
              {isPending && (
                <span className="px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-700">
                  Pending
                </span>
              )}

              {isApproved && (
                <span className="px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700">
                  Approved
                </span>
              )}

              {isRejected && (
                <span className="px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-700">
                  Rejected
                </span>
              )}
              {isCompleted && (
                <span className="px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700">
                  Completed
                </span>
              )}
            </div>
          </div>

          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 overflow-y-auto max-h-[75vh] pt-6">
          {hasApprovedItems && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Origin Location</label>

              <Select
                value={selectedSource}
                onValueChange={setSelectedSource}
                disabled={isApproved || isRejected || isCompleted}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose Origin Branch..." />
                </SelectTrigger>

                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc.id} value={String(loc.id)}>
                      {loc.name.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedSource && (
                <p className="text-xs text-muted-foreground">
                  Stock shown below is from the selected branch.
                </p>
              )}
            </div>
          )}

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Product</TableHead>

                  <TableHead className="text-center">Requested</TableHead>

                  <TableHead className="text-center">Available</TableHead>

                  <TableHead className="text-right">Decision</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {transfer.items?.map((item) => {
                  const product = products.find(
                    (p) => String(p.id) === String(item.product_id),
                  );

                  const state = selectedItems[item.product_id];

                  const availableStock =
                    locationInventory[String(item.product_id)] ?? 0;

                  const insufficientStock =
                    selectedSource &&
                    state?.approved &&
                    state.quantity > availableStock;

                  return (
                    <TableRow
                      key={item.product_id}
                      className={
                        !state?.approved
                          ? "opacity-40 bg-muted/30"
                          : insufficientStock
                            ? "bg-destructive/10"
                            : ""
                      }
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={product?.image_url}
                            alt={product?.name}
                            className="w-10 h-10 rounded object-cover border"
                          />

                          <div>
                            <p
                              className="font-medium text-sm truncate min-w-[200px] max-w-xs"
                              title={product?.name}
                            >
                              {product?.name || `Product ${item.product_id}`}
                            </p>

                            {selectedSource && (
                              <p className="text-xs text-muted-foreground">
                                Available Stock: {availableStock}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Input
                          type="number"
                          min={1}
                          max={selectedSource ? availableStock : undefined}
                          value={state?.quantity}
                          disabled={
                            !state?.approved ||
                            isApproved ||
                            isRejected ||
                            isCompleted
                          }
                          onChange={(e) =>
                            updateQuantity(item.product_id, e.target.value)
                          }
                          className={`w-20 mx-auto text-center ${
                            insufficientStock ? "border-destructive" : ""
                          }`}
                        />
                      </TableCell>

                      <TableCell className="text-center">
                        {!selectedSource ? (
                          <span className="text-muted-foreground">—</span>
                        ) : (
                          <div className="flex items-center justify-center gap-1">
                            {availableStock <= 0 && (
                              <AlertTriangle className="h-4 w-4 text-destructive" />
                            )}

                            <span
                              className={
                                availableStock <= 0
                                  ? "text-destructive font-semibold"
                                  : ""
                              }
                            >
                              {availableStock}
                            </span>
                          </div>
                        )}
                      </TableCell>

                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            className="h-8 w-8"
                            disabled={isApproved || isRejected || isCompleted}
                            variant={state?.approved ? "default" : "outline"}
                            onClick={() =>
                              toggleApproval(item.product_id, true)
                            }
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>

                          <Button
                            size="icon"
                            className="h-8 w-8"
                            disabled={isApproved || isRejected || isCompleted}
                            variant={
                              !state?.approved ? "destructive" : "outline"
                            }
                            onClick={() =>
                              toggleApproval(item.product_id, false)
                            }
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {selectedSource &&
            isPending &&
            Object.entries(selectedItems).some(
              ([productId, item]) =>
                item.approved &&
                item.quantity > (locationInventory[String(productId)] || 0),
            ) && (
              <div className="rounded-md border border-destructive bg-destructive/10 p-3">
                <p className="text-sm text-destructive font-medium">
                  One or more approved products exceed the available stock in
                  this branch.
                </p>
              </div>
            )}

          {(isApproved || isRejected || isCompleted) && (
            <div className="rounded-md border bg-muted/30 p-3">
              <p className="text-sm font-medium">
                This transfer has already been{" "}
                {isApproved
                  ? "approved"
                  : isRejected
                    ? "rejected"
                    : "completed"}
                .
              </p>

              <p className="text-xs text-muted-foreground mt-1">
                Transfer details are now read-only.
              </p>
              <p>Requested by: {transfer.requester.profiles.full_name}</p>
              {isApproved && <p>Approved by: {transfer.approver.full_name}</p>}
              {isRejected && (
                <p>Rejected by: {transfer.rejecter?.profiles?.full_name}</p>
              )}
              {isCompleted && (
                <>
                  <p>Approved by: {transfer.approver.full_name}</p>
                  <p>Dispatched by: {transfer.dispatcher.full_name}</p>
                  <p>Received by: {transfer.receiver?.full_name}</p>
                </>
              )}
            </div>
          )}

          <Button
            className="w-full h-11"
            disabled={isSubmitting || isApproved || isRejected || isCompleted}
            onClick={handleSubmit}
            variant={hasApprovedItems ? "default" : "destructive"}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

            {isApproved
              ? "Transfer Already Approved"
              : isRejected
                ? "Transfer Already Rejected"
                : isCompleted
                  ? "Transfer Already Completed"
                  : hasApprovedItems
                    ? "Confirm Transfer"
                    : "Reject Entire Transfer"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
