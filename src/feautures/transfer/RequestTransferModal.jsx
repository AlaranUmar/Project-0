import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";

export default function RequestTransferModal({
  open,
  onClose,
  products,
  branchId,
}) {
  const [items, setItems] = useState([]);

  const addItem = () => {
    setItems([...items, { product_id: "", quantity: 1 }]);
  };

  const updateItem = (index, field, value) => {
    const copy = [...items];
    copy[index][field] = value;
    setItems(copy);
  };

  const submit = async () => {
    await supabase.rpc("request_transfer", {
      p_to_location_id: branchId,
      p_items: items,
    });

    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded w-96 space-y-3">
        <h2 className="font-semibold">Request Transfer</h2>

        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <Input
              placeholder="Product ID"
              value={item.product_id}
              onChange={(e) => updateItem(i, "product_id", e.target.value)}
            />

            <Input
              type="number"
              value={item.quantity}
              onChange={(e) => updateItem(i, "quantity", e.target.value)}
            />
          </div>
        ))}

        <Button onClick={addItem}>Add Item</Button>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={submit}>Submit</Button>
        </div>
      </div>
    </div>
  );
}
