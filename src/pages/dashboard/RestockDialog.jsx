import { useState } from "react";
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

export default function RestockDialog({ product, isOpen, onClose, onSuccess }) {
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  if (!product) return null;

  const handleRestock = async () => {
    const qty = Number(quantity);
    if (!qty || qty <= 0) return;

    setLoading(true);
    try {
      await restockProduct(product.product_id, product.location_id, qty);

      const updated = {
        ...product,
        stock_quantity: (product.stock_quantity || 0) + qty,
      };

      onSuccess(updated);
      setQuantity("");
      onClose();
    } catch (err) {
      console.error("Restock failed:", err);
      alert("Failed to restock");
    } finally {
      setLoading(false);
    }
  };

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

// import { Button } from "@/components/ui/button";
// import { Edit } from "lucide-react";

function ProductRow({ product, onEdit, onRestock }) {
  return (
    <tr>
      <td>{product.product_name}</td>
      <td>{product.price}</td>
      <td>{product.stock_quantity || 0}</td>
      <td>{product.category_name || "N/A"}</td>
      <td>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onRestock(product)}
          >
            Restock
          </Button>

          <div
            onClick={() => onEdit(product)}
            className="bg-gray-200 p-1 rounded-sm cursor-pointer hover:bg-gray-300"
          >
            <Edit className="size-4 text-gray-600" />
          </div>
        </div>
      </td>
    </tr>
  );
}
