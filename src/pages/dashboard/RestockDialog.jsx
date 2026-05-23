import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { restockProduct } from "@/feautures/products/productService";
import { getLocationsByType } from "@/feautures/locations/locationService";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function RestockDialog({ product, isOpen, onClose, onSuccess }) {
  const [quantity, setQuantity] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadWarehouses() {
      try {
        const data = await getLocationsByType("warehouse");
        setWarehouses(data || []);
      } catch (err) {
        console.error("Failed to load warehouses", err);
      }
    }

    if (isOpen) loadWarehouses();
  }, [isOpen]);

  if (!product) return null;

  async function handleRestock() {
    const qty = Number(quantity);

    if (!qty || qty <= 0) {
      toast.warning("Enter valid quantity");
      return;
    }

    if (!warehouse) {
      toast.warning("Select a warehouse");
      return;
    }

    setLoading(true);
    console.log(product);
    try {
      await restockProduct(product.id, warehouse, qty);

      const updated = {
        ...product,
        stock_quantity: (product.inventory[0]?.quantity || 0) + qty,
      };
      toast.success("Product restocked successfully");
      onSuccess(updated);
      setQuantity("");
      setWarehouse("");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Restock failed");
    }

    setLoading(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Restock Product</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Product</Label>
            <Input value={product.name} disabled />
          </div>

          <div>
            <Label>Current Stock</Label>
            <Input value={product.inventory[0]?.quantity || 0} disabled />
          </div>

          {/* Warehouse Selection */}
          <div>
            <Label>Warehouse</Label>

            <Select
              value={warehouse}
              onValueChange={(value) => setWarehouse(value)}
            >
              <SelectTrigger className="w-full border rounded-md p-2">
                <SelectValue placeholder="Select warehouse" />
              </SelectTrigger>
              <SelectContent>
                {warehouses.map((w) => (
                  <SelectItem key={w.id} value={w.id}>
                    {w.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Quantity to Add</Label>
            <Input
              type="number"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={handleRestock} disabled={loading}>
            {loading ? "Restocking..." : "Restock"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
