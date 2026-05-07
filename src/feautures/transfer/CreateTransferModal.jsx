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
import { getLocations } from "../branches/branchService";

export default function CreateTransferModal({
  open,
  onClose,
  products = [],
  onSubmit,
}) {
  const [locations, setLocations] = useState([]);
  const [fromBranch, setFromBranch] = useState("");
  const [toBranch, setToBranch] = useState("");
  const [items, setItems] = useState([{ product_id: "", quantity: 1 }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    async function init() {
      try {
        const data = await getLocations();
        setLocations(data || []);
      } catch (err) {
        console.error(err);
      }

      // reset form
      setItems([{ product_id: "", quantity: 1 }]);
      setFromBranch("");
      setToBranch("");
    }

    init();
  }, [open]);

  const selectedProductIds = items.map((i) => String(i.product_id));

  const addItem = () => {
    setItems((prev) => [...prev, { product_id: "", quantity: 1 }]);
  };

  const updateItem = (index, field, value) => {
    setItems((prev) => {
      const copy = [...prev];

      if (field === "quantity") {
        copy[index][field] = Math.max(1, Number(value) || 1);
      } else {
        copy[index][field] = value;
      }

      return copy;
    });
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  async function submit() {
    if (!fromBranch || !toBranch) {
      alert("submitted");
      return alert("Select both source and destination");
    }

    if (fromBranch === toBranch) {
      return alert("Source and destination cannot be the same");
    }

    if (items.some((i) => !i.product_id)) {
      return alert("Please select products");
    }

    setLoading(true);

    try {
      await onSubmit({
        from_location_id: fromBranch,
        to_location_id: toBranch,
        items,
      });

      onClose();
    } catch (err) {
      alert(err.message || "Transfer failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Stock Transfer</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {/* Branch Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm">From</label>
              <Select
                key={fromBranch}
                value={fromBranch}
                onValueChange={setFromBranch}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc?.id} value={String(loc?.id)}>
                      {loc.name.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm">To</label>
              <Select value={toBranch} onValueChange={setToBranch}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem
                      key={loc?.id}
                      value={String(loc?.id)}
                      disabled={String(loc?.id) === fromBranch}
                    >
                      {loc.name.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-3">
            <label className="text-sm">Products</label>

            {items.map((item, i) => (
              <div key={i} className="flex gap-2">
                <Select
                  value={item.product_id}
                  onValueChange={(val) => updateItem(i, "product_id", val)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Product" />
                  </SelectTrigger>

                  <SelectContent>
                    {products.map((p) => {
                      const isSelected =
                        selectedProductIds.includes(String(p.id)) &&
                        item.product_id !== String(p.id);

                      return (
                        <SelectItem
                          key={p.id}
                          value={String(p.id)}
                          disabled={isSelected}
                        >
                          <img
                            key={p.id}
                            src={p?.image_url}
                            className="w-7 h-7 rounded-full border bg-white"
                          />
                          {p.name.slice(0, 20)}...
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                <Input
                  type="number"
                  className="w-20"
                  value={item.quantity}
                  onChange={(e) => updateItem(i, "quantity", e.target.value)}
                />

                <Button
                  variant="ghost"
                  onClick={() => removeItem(i)}
                  disabled={items.length === 1}
                >
                  ✕
                </Button>
              </div>
            ))}

            <Button variant="outline" onClick={addItem}>
              + Add Product
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={submit} disabled={loading}>
            {loading ? "Processing..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
