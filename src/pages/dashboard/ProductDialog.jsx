import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createCategory,
  createProduct,
  createTag,
  getCategories,
  getLocations,
  getTags,
} from "@/feautures/products/productService";

/* ============================= */
/* Add Product Form Component    */
/* ============================= */
export default function AddProductForm({ onSuccess, onClose, currentUserId }) {
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);

  const initialForm = {
    name: "",
    price: "",
    cost_price: "",
    category_id: "",
    reorder_level: 12,
    location_id: "",
    initial_stock: "",
    image_url: "", // Added field
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    async function fetchData() {
      const [cats, locs, tgs] = await Promise.all([
        getCategories(),
        getLocations(),
        getTags(),
      ]);
      setCategories(cats || []);
      setLocations(locs || []);
      setTags(tgs || []);
    }
    fetchData();
  }, []);

  const handleChange = (field, value) => {
    // Numeric validation for specific fields
    if (
      ["price", "cost_price", "initial_stock", "reorder_level"].includes(field)
    ) {
      if (!/^\d*$/.test(value)) return;
    }
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleTag = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId],
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        cost_price: Number(form.cost_price),
        initial_stock: Number(form.initial_stock),
        reorder_level: Number(form.reorder_level),
        image_url: form.image_url, // Added to payload
        tags: selectedTags,
        stocks: [
          {
            location_id: form.location_id,
            quantity: Number(form.initial_stock),
          },
        ],
        createdBy: currentUserId,
      };

      const createdProduct = await createProduct(payload);

      // Construct object to match your table view requirements
      const fullProduct = {
        product_id: createdProduct.product_id,
        product_name: form.name,
        price: payload.price,
        image_url: form.image_url, // Added for UI sync
        category_name:
          categories.find((c) => c.id === form.category_id)?.name || "",
        location_name:
          locations.find((l) => l.id === form.location_id)?.name || "",
        stock_quantity: payload.initial_stock,
        reorder_level: payload.reorder_level,
        tags: tags
          .filter((t) => selectedTags.includes(t.id))
          .map((t) => t.name),
      };

      onSuccess?.(fullProduct);
      setForm(initialForm);
      setSelectedTags([]);
      onClose?.();
    } catch (err) {
      alert(err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto border-none shadow-none">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Product Name</Label>
            <Input
              placeholder="e.g. Peak Milk"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input
              placeholder="https://example.com"
              value={form.image_url}
              onChange={(e) => handleChange("image_url", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Selling Price (₦)</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Cost Price (₦)</Label>
              <Input
                type="number"
                value={form.cost_price}
                onChange={(e) => handleChange("cost_price", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <select
              className="w-full border rounded-md p-2 bg-background text-sm"
              value={form.category_id}
              onChange={(e) => handleChange("category_id", e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={
                    selectedTags.includes(tag.id) ? "default" : "outline"
                  }
                  onClick={() => toggleTag(tag.id)}
                  className="cursor-pointer"
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Initial Stock</Label>
              <Input
                type="number"
                value={form.initial_stock}
                onChange={(e) => handleChange("initial_stock", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Reorder Level</Label>
              <Input
                type="number"
                value={form.reorder_level}
                onChange={(e) => handleChange("reorder_level", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Warehouse Location</Label>
            <select
              className="w-full border rounded-md p-2 bg-background text-sm"
              value={form.location_id}
              onChange={(e) => handleChange("location_id", e.target.value)}
              required
            >
              <option value="">Select Warehouse</option>
              {locations
                .filter((l) => l.type === "warehouse")
                .map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
            </select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Product"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

/* ============================= */
/* Dialog Wrapper Components     */
/* ============================= */
export function AddProductDialog({ isOpen, onClose, onSuccess }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <AddProductForm onSuccess={onSuccess} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}

export function AddCategoryDialog({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const handleSubmit = async () => {
    if (!name) return;
    try {
      const newCategory = await createCategory(name);
      onSuccess?.(newCategory);
      setName("");
      onClose();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <DialogFooter>
          <Button onClick={handleSubmit}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AddTagDialog({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const handleSubmit = async () => {
    if (!name) return;
    try {
      const newTag = await createTag(name);
      onSuccess?.(newTag);
      setName("");
      onClose();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Tag</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Tag name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <DialogFooter>
          <Button onClick={handleSubmit}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
