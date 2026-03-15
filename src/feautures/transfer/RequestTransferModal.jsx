import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { handle_request } from "./transferService";

export default function RequestTransferModal({
  open,
  onClose,
  products,
  branchId,
}) {
  const [items, setItems] = useState([]);

  // Get all currently selected IDs to filter them out later
  const selectedIds = items.map((item) => item.product_id);

  const addItem = () => {
    // Only add if there are still products left to pick
    if (items.length >= products.length) return;
    setItems([...items, { product_id: "", quantity: 1 }]);
  };

  const updateItem = (index, field, value) => {
    const copy = [...items];
    // Force minimum of 1 for quantity
    const finalValue =
      field === "quantity" ? Math.max(1, Number(value)) : value;
    copy[index][field] = finalValue;
    setItems(copy);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const submit = async () => {
    // Basic validation: ensure all items have a product selected
    if (items.length === 0 || items.some((i) => !i.product_id)) return;
    await handle_request(branchId, items);
    setItems([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Request Transfer</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {items.map((item, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Select
                value={item.product_id}
                onValueChange={(value) => updateItem(i, "product_id", value)}
              >
                {/* 1. FIX OVERFLOW: Set a fixed width and truncate on the trigger */}
                <SelectTrigger className="w-[180px] md:w-[220px]">
                  <SelectValue
                    placeholder="Select product"
                    className="truncate"
                  />
                </SelectTrigger>

                <SelectContent>
                  {products.map((p) => {
                    const isSelectedElsewhere =
                      selectedIds.includes(p.product_id) &&
                      item.product_id !== p.product_id;

                    return (
                      <SelectItem
                        key={p.product_id}
                        value={p.product_id}
                        disabled={isSelectedElsewhere}
                      >
                        <span className="block truncate max-w-50">
                          {p.product_name}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <Input
                type="number"
                className="w-20"
                value={item.quantity}
                min={1}
                onChange={(e) => updateItem(i, "quantity", e.target.value)}
              />

              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeItem(i)}
                className="text-destructive"
              >
                ✕
              </Button>
            </div>
          ))}

          <Button
            variant="outline"
            className="w-full"
            onClick={addItem}
            disabled={items.length >= products.length} // Prevent adding more rows than products
          >
            + Add Item
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={items.length === 0}>
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
