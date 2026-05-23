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
import { getLocations } from "../locations/locationService";
import { getInventoryByLocation } from "../inventory/inventoryService";
export default function CreateTransferModal({
  open,
  onClose,
  products = [],
  onSubmit,
}) {
  const [locations, setLocations] = useState([]);
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [items, setItems] = useState([{ product_id: "", quantity: 1 }]);
  const [loading, setLoading] = useState(false);
  const [sourceInventory, setSourceInventory] = useState({});

  useEffect(() => {
    if (!open) return;

    async function init() {
      try {
        const data = await getLocations();
        setLocations(data || []);
      } catch (err) {
        console.error(err);
      }

      setItems([{ product_id: "", quantity: 1 }]);
      setFromLocation("");
      setToLocation("");
      setSourceInventory({});
    }

    init();
  }, [open]);

  useEffect(() => {
    if (!fromLocation) {
      setSourceInventory({});
      return;
    }

    async function fetchStockLimits() {
      try {
        const data = await getInventoryByLocation(fromLocation);
        const stockMap = {};

        data?.forEach((row) => {
          stockMap[String(row.product_id)] = Number(row.quantity);
        });

        setSourceInventory(stockMap);
      } catch (err) {
        console.error("Failed loading branch inventory balances", err);
      }
    }

    fetchStockLimits();
  }, [fromLocation]);

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
    if (!fromLocation || !toLocation) {
      return alert("Select both source and destination");
    }

    if (fromLocation === toLocation) {
      return alert("Source and destination cannot be the same");
    }

    if (items.some((i) => !i.product_id)) {
      return alert("Please select products");
    }

    // Front-end inventory threshold checks
    for (const item of items) {
      const availableStock = sourceInventory[String(item.product_id)] || 0;
      const targetProduct = products.find(
        (p) => String(p.id) === String(item.product_id),
      );
      const productName = targetProduct ? targetProduct.name : "Selected item";

      if (availableStock <= 0) {
        return alert(
          `"${productName}" is completely out of stock at this source location.`,
        );
      }

      if (item.quantity > availableStock) {
        return alert(
          `Cannot transfer ${item.quantity} units of "${productName}". Only ${availableStock} available.`,
        );
      }
    }

    setLoading(true);

    try {
      await onSubmit({
        from_location_id: fromLocation,
        to_location_id: toLocation,
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">From</label>
              <Select value={fromLocation} onValueChange={setFromLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Source" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc?.id} value={String(loc?.id)}>
                      {loc.name.toUpperCase()}
                      <span className="text-xs text-muted-foreground ml-2">
                        {loc.type.slice(0, 1).toUpperCase()}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">To</label>
              <Select value={toLocation} onValueChange={setToLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Dest" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem
                      key={loc?.id}
                      value={String(loc?.id)}
                      disabled={String(loc?.id) === fromLocation}
                    >
                      {loc.name.toUpperCase()}
                      <span className="text-xs text-muted-foreground ml-2">
                        {loc.type.slice(0, 1).toUpperCase()}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Panel */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Products</label>

            {items.map((item, i) => {
              const currentItemStock =
                sourceInventory[String(item.product_id)] || 0;
              const hasExceededStock =
                item.product_id && item.quantity > currentItemStock;

              return (
                <div
                  key={i}
                  className="flex flex-col gap-1 border-b pb-2 last:border-none"
                >
                  <div className="flex gap-2 items-center">
                    <Select
                      value={item.product_id}
                      onValueChange={(val) => updateItem(i, "product_id", val)}
                      disabled={!fromLocation}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue
                          placeholder={
                            fromLocation
                              ? "Select Product"
                              : "Choose 'From' branch first"
                          }
                        />
                      </SelectTrigger>

                      <SelectContent>
                        {products.map((p) => {
                          const isSelected =
                            selectedProductIds.includes(String(p.id)) &&
                            item.product_id !== String(p.id);

                          const stockCount = sourceInventory[String(p.id)] || 0;

                          return (
                            <SelectItem
                              key={p.id}
                              value={String(p.id)}
                              disabled={isSelected || stockCount <= 0}
                            >
                              <div className="flex items-center justify-between w-full gap-4">
                                <div className="flex items-center gap-2">
                                  <img
                                    src={p?.image_url}
                                    className="w-6 h-6 rounded-full border bg-white object-cover"
                                    alt=""
                                  />
                                  <span>{p.name.slice(0, 15)}...</span>
                                </div>
                                <span
                                  className={`text-xs font-semibold px-1.5 py-0.5 rounded ${stockCount > 0 ? "bg-secondary text-muted-foreground" : "bg-destructive/10 text-destructive"}`}
                                >
                                  Stock: {stockCount}
                                </span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>

                    <Input
                      type="number"
                      className={`w-20 ${hasExceededStock ? "border-destructive text-destructive focus-visible:ring-destructive" : ""}`}
                      value={item.quantity}
                      min={1}
                      disabled={!item.product_id}
                      onChange={(e) =>
                        updateItem(i, "quantity", e.target.value)
                      }
                    />

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(i)}
                      disabled={items.length === 1}
                    >
                      ✕
                    </Button>
                  </div>

                  {hasExceededStock && (
                    <span className="text-xs text-destructive font-medium pl-1">
                      Exceeds available stock ({currentItemStock} max)
                    </span>
                  )}
                </div>
              );
            })}

            <Button
              variant="outline"
              size="sm"
              onClick={addItem}
              disabled={!fromLocation}
            >
              + Add Product
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            onClick={submit}
            disabled={
              loading ||
              !fromLocation ||
              !toLocation ||
              items.some((i) => !i.product_id)
            }
          >
            {loading ? "Processing..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
