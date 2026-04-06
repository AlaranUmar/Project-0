import React, { useState } from "react";
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
  approveTransfer,
  rejectTransfer,
} from "@/feautures/transfer/transferService";

export default function TransferOverlay({
  transferId,
  transfers,
  products,
  onClose,
  onRefresh,
}) {
  const transfer = transfers.find((t) => t.id === transferId);
  const isEditable = transfer?.status === "pending";

  const [selectedItems, setSelectedItems] = useState(() =>
    transfer.items.reduce((acc, item) => {
      acc[item.product_id] = { quantity: item.quantity, approved: undefined };
      return acc;
    }, {}),
  );

  const [selectedSourceBranch, setSelectedSourceBranch] = useState(null);

  const getAvailableStock = (productId) => {
    if (!selectedSourceBranch) return 0;

    const branchProducts = products.filter(
      (p) => String(p.location_id) === String(selectedSourceBranch),
    );

    const product = branchProducts.find((p) => p.product_id === productId);

    return product?.stock_quantity || 0;
  };

  const handleQuantityChange = (productId, value) => {
    const maxStock = getAvailableStock(productId);
    const quantity = Math.min(Number(value), maxStock);

    setSelectedItems((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], quantity },
    }));
  };

  const toggleItemApproval = (productId, approved) => {
    if (!isEditable) return;

    setSelectedItems((prev) => {
      const current = prev[productId];
      const newApproved = current?.approved === approved ? undefined : approved;

      return {
        ...prev,
        [productId]: { ...current, approved: newApproved },
      };
    });
  };

  const allRejected = Object.values(selectedItems).every(
    (i) => i.approved === false,
  );

  const canSubmit =
    isEditable &&
    (allRejected ||
      (selectedSourceBranch &&
        Object.values(selectedItems).every((i) => i.approved !== undefined)));

  const handleSubmit = async () => {
    try {
      const items = Object.entries(selectedItems).map(
        ([product_id, { approved, quantity }]) => ({
          product_id,
          approved,
          quantity,
        }),
      );

      if (allRejected) {
        await rejectTransfer(transferId);
      } else {
        await approveTransfer(transferId, items, selectedSourceBranch);
      }

      onClose();
      onRefresh();
    } catch (err) {
      console.error(err);
      alert("Error submitting decisions");
    }
  };

  const branchesWithStock = products.reduce((acc, p) => {
    if (!acc.find((b) => b.location_id === p.location_id)) {
      acc.push({
        location_id: p.location_id,
        branch_name: p.location_name,
      });
    }
    return acc;
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/30 flex justify-center items-start p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white h-fit rounded-lg shadow-lg p-4 max-w-xl w-full">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">
            Transfer {transferId.slice(0, 8)}
          </h3>

          <Button variant="destructive" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

        {/* Source Branch */}
        {isEditable &&
          Object.values(selectedItems).some((i) => i.approved !== false) && (
            <Select
              value={selectedSourceBranch || ""}
              onValueChange={setSelectedSourceBranch}
              disabled={!isEditable}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select source branch" />
              </SelectTrigger>
              <SelectContent>
                {branchesWithStock.map((b) => (
                  <SelectItem key={b.location_id} value={b.location_id}>
                    {b.branch_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

        {/* Items */}
        <div className="space-y-2 mt-4 h-fit overflow-y-auto">
          {transfer.items.map((item) => {
            const stock = getAvailableStock(item.product_id);
            const itemState = selectedItems[item.product_id];

            return (
              <div
                key={item.product_id}
                className={`flex items-center gap-2 flex-wrap p-2 rounded 
                ${itemState.approved === true ? "bg-green-100" : ""}
                ${itemState.approved === false ? "bg-red-100" : ""}`}
              >
                <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                  {item.product_name} (Available: {stock})
                </span>

                <Input
                  type="number"
                  min={0}
                  max={stock}
                  value={itemState.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.product_id, e.target.value)
                  }
                  disabled={!isEditable || itemState.approved === false}
                  className="w-20"
                />

                <Button
                  size="xs"
                  disabled={!isEditable}
                  onClick={() => toggleItemApproval(item.product_id, true)}
                >
                  {itemState.approved === true ? "Cancel" : "Approve"}
                </Button>

                <Button
                  size="xs"
                  variant="destructive"
                  disabled={!isEditable}
                  onClick={() => toggleItemApproval(item.product_id, false)}
                >
                  {itemState.approved === false ? "Cancel" : "Reject"}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Submit */}
        {isEditable && (
          <Button
            className="mt-4 w-full"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            Submit Decisions
          </Button>
        )}
      </div>
    </div>
  );
}
