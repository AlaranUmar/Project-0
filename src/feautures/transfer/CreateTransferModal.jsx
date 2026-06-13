import { useState, useEffect } from "react";
import { toast } from "sonner";

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
  const createEmptyItem = () => ({
    id: crypto.randomUUID(),
    product_id: "",
    quantity: 1,
  });

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sourceInventory, setSourceInventory] = useState({});

  const [formData, setFormData] = useState({
    from_location_id: "",
    to_location_id: "",
    items: [createEmptyItem()],
  });

  useEffect(() => {
    if (!open) return;

    async function initialize() {
      try {
        const data = await getLocations();

        setLocations(data || []);

        setFormData({
          from_location_id: "",
          to_location_id: "",
          items: [createEmptyItem()],
        });

        setSourceInventory({});
      } catch (err) {
        console.error(err);
        toast.error("Failed to load locations");
      }
    }

    initialize();
  }, [open]);

  useEffect(() => {
    let active = true;

    if (!formData.from_location_id) {
      setSourceInventory({});
      return;
    }

    async function fetchInventory() {
      try {
        const data = await getInventoryByLocation(formData.from_location_id);

        if (!active) return;

        const stockMap = {};

        data?.forEach((row) => {
          stockMap[String(row.product_id)] = Number(row.quantity);
        });

        setSourceInventory(stockMap);
      } catch (err) {
        console.error(err);
        toast.error("Failed loading inventory");
      }
    }

    fetchInventory();

    return () => {
      active = false;
    };
  }, [formData.from_location_id]);

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateItem = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id !== id) return item;

        if (field === "quantity") {
          const maxStock = sourceInventory[String(item.product_id)] || 1;

          return {
            ...item,
            quantity: Math.min(maxStock, Math.max(1, Number(value) || 1)),
          };
        }

        return {
          ...item,
          [field]: value,
        };
      }),
    }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, createEmptyItem()],
    }));
  };

  const removeItem = (id) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const selectedProductIds = formData.items
    .filter((item) => item.product_id)
    .map((item) => String(item.product_id));

  const validateForm = () => {
    if (!formData.from_location_id) {
      toast.error("Select source location");
      return false;
    }

    if (!formData.to_location_id) {
      toast.error("Select destination location");
      return false;
    }

    if (formData.from_location_id === formData.to_location_id) {
      toast.error("Source and destination cannot be the same");
      return false;
    }

    if (formData.items.some((item) => !item.product_id)) {
      toast.error("Please select products");
      return false;
    }

    return true;
  };

  async function submit(e) {
    e.preventDefault();

    if (loading) return;

    if (!validateForm()) return;

    for (const item of formData.items) {
      const availableStock = sourceInventory[String(item.product_id)] || 0;

      const product = products.find(
        (p) => String(p.id) === String(item.product_id),
      );

      const productName = product?.name || "Selected Product";

      if (availableStock <= 0) {
        toast.error(`${productName} is out of stock`);
        return;
      }

      if (item.quantity > availableStock) {
        toast.error(`${productName}: only ${availableStock} available`);
        return;
      }
    }

    setLoading(true);

    try {
      await onSubmit({
        from_location_id: formData.from_location_id,
        to_location_id: formData.to_location_id,
        items: formData.items.map(({ product_id, quantity }) => ({
          product_id,
          quantity,
        })),
      });

      toast.success("Transfer created successfully");

      onClose();
    } catch (err) {
      toast.error(err?.message || "Transfer failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden">
        <form onSubmit={submit} className="w-full ">
          <DialogHeader>
            <DialogTitle>Create Stock Transfer</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 max-h-[70vh] overflow-y-auto py-4 pr-2">
            {/* LOCATION SECTION */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Source Location
                </label>

                <Select
                  value={formData.from_location_id}
                  onValueChange={(value) =>
                    updateField("from_location_id", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Source" />
                  </SelectTrigger>

                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc.id} value={String(loc.id)}>
                        {loc.name.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Destination Location
                </label>

                <Select
                  value={formData.to_location_id}
                  onValueChange={(value) =>
                    updateField("to_location_id", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Destination" />
                  </SelectTrigger>

                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem
                        key={loc.id}
                        value={String(loc.id)}
                        disabled={String(loc.id) === formData.from_location_id}
                      >
                        {loc.name.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* PRODUCTS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Products</label>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                  disabled={!formData.from_location_id}
                >
                  + Add Product
                </Button>
              </div>

              {formData.items.map((item) => {
                const currentStock =
                  sourceInventory[String(item.product_id)] || 0;

                const exceededStock =
                  item.product_id && item.quantity > currentStock;

                return (
                  <div
                    key={item.id}
                    className="border rounded-lg p-3 space-y-2"
                  >
                    <div className="flex gap-2 items-start">
                      {/* PRODUCT */}
                      <div className="flex-1">
                        <Select
                          value={item.product_id}
                          disabled={!formData.from_location_id}
                          onValueChange={(value) =>
                            updateItem(item.id, "product_id", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                formData.from_location_id
                                  ? "Select Product"
                                  : "Choose source location first"
                              }
                            />
                          </SelectTrigger>

                          <SelectContent>
                            {products.map((product) => {
                              const stock =
                                sourceInventory[String(product.id)] || 0;

                              const alreadySelected =
                                selectedProductIds.includes(
                                  String(product.id),
                                ) && item.product_id !== String(product.id);

                              return (
                                <SelectItem
                                  key={product.id}
                                  value={String(product.id)}
                                  disabled={alreadySelected || stock <= 0}
                                >
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={product.image_url}
                                      alt={product.name}
                                      className="w-6 h-6 rounded-full object-cover border"
                                    />

                                    <span>
                                      {product.name.slice(0, 20)}
                                      {product.name.length > 20 ? "..." : ""}
                                    </span>

                                    <span className="text-xs text-muted-foreground">
                                      ({stock})
                                    </span>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* QUANTITY */}
                      <Input
                        type="number"
                        // min={1}
                        max={currentStock}
                        className={`w-24 ${
                          exceededStock ? "border-destructive" : ""
                        }`}
                        value={item.quantity}
                        disabled={!item.product_id}
                        onChange={(e) =>
                          updateItem(item.id, "quantity", e.target.value)
                        }
                      />

                      {/* REMOVE */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={formData.items.length === 1}
                        onClick={() => removeItem(item.id)}
                      >
                        ✕
                      </Button>
                    </div>

                    {item.product_id && (
                      <div className="text-xs text-muted-foreground">
                        Available Stock:{" "}
                        <span className="font-semibold">{currentStock}</span>
                      </div>
                    )}

                    {exceededStock && (
                      <div className="text-xs text-destructive font-medium">
                        Quantity exceeds available stock.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                loading ||
                !formData.from_location_id ||
                !formData.to_location_id
              }
            >
              {loading ? "Processing..." : "Create Transfer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
