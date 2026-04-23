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
import { getWarehouseLocations } from "@/feautures/branches/branchService";
export default function RestockDialog({ product, isOpen, onClose, onSuccess }) {
  const [quantity, setQuantity] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadWarehouses() {
      try {
        const data = await getWarehouseLocations();
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
      alert("Enter valid quantity");
      return;
    }

    if (!warehouse) {
      alert("Select a warehouse");
      return;
    }

    setLoading(true);

    try {
      await restockProduct(product.product_id, warehouse, qty);

      const updated = {
        ...product,
        stock_quantity: (product.stock_quantity || 0) + qty,
      };

      onSuccess(updated);
      setQuantity("");
      setWarehouse("");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Restock failed");
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
            <Input value={product.product_name} disabled />
          </div>

          <div>
            <Label>Current Stock</Label>
            <Input value={product.stock_quantity || 0} disabled />
          </div>

          {/* Warehouse Selection */}
          <div>
            <Label>Warehouse</Label>
            <select
              className="w-full border rounded-md p-2"
              value={warehouse}
              onChange={(e) => setWarehouse(e.target.value)}
            >
              <option value="">Select warehouse</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
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
