import { useState, useEffect } from "react";

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

export default function RequestTransferModal({
  open,
  onClose,
  products = [],
  onSubmit,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Reset + auto-add first row
  useEffect(() => {
    if (open) {
      setItems([{ product_id: "", quantity: 1 }]);
    } else {
      setItems([]);
    }
  }, [open]);

  const selectedIds = items.map((i) => String(i.product_id));

  function addItem() {
    if (items.length >= products.length) return;
    setItems((prev) => [...prev, { product_id: "", quantity: 1 }]);
  }

  function updateItem(index, field, value) {
    setItems((prev) => {
      const copy = [...prev];

      copy[index][field] =
        field === "quantity" ? Math.max(1, Number(value) || 1) : String(value);

      return copy;
    });
  }

  function removeItem(index) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function submit() {
    if (!items.length) {
      return alert("Add at least one product");
    }

    if (items.some((i) => !i.product_id)) {
      return alert("Select all products");
    }

    const unique = new Set(items.map((i) => i.product_id));
    if (unique.size !== items.length) {
      return alert("Duplicate products selected");
    }

    setLoading(true);

    try {
      console.log("Submitting items:", items);

      await onSubmit(items);
      onClose();
    } catch (err) {
      console.error("MODAL ERROR:", err);
      alert(err.message || "Failed to submit request");
    }

    setLoading(false);
  }
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
                <SelectTrigger className="w-[180px] md:w-[220px]">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>

                <SelectContent>
                  {products.map((p) => {
                    const id = String(p.id);

                    const isUsed =
                      selectedIds.includes(id) && item.product_id !== id;

                    return (
                      <SelectItem key={id} value={id} disabled={isUsed}>
                        <span className="truncate block max-w-[180px]">
                          {p.name}
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

              {items.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(i)}
                >
                  ✕
                </Button>
              )}
            </div>
          ))}

          <Button
            variant="outline"
            className="w-full"
            onClick={addItem}
            disabled={items.length >= products.length}
          >
            + Add Item
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={submit} disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
