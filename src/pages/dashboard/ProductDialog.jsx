import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import {
  createCategory,
  createProduct,
  createTag,
  getCategories,
  getLocations,
  getTags, // <-- import tags
} from "@/feautures/products/productService";

import { Badge } from "@/components/ui/badge";

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
  };
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    async function fetchData() {
      const cats = await getCategories();
      const locs = await getLocations();
      const tgs = await getTags();

      setCategories(cats || []);
      setLocations(locs || []);
      setTags(tgs || []);
    }
    fetchData();
  }, []);

  const handleChange = (field, value) => {
    if (
      ["price", "cost_price", "initial_stock", "reorder_level"].includes(field)
    ) {
      if (!/^\d*$/.test(value)) return; // allow only numbers
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
        tags: selectedTags, // <-- send tags array to backend
        stocks: [
          {
            location_id: form.location_id,
            quantity: Number(form.initial_stock),
          },
        ],
        createdBy: currentUserId, // optional, for stock movement
      };

      const newProduct = await createProduct(payload);

      onSuccess?.(newProduct); // Notify parent to update table
      setForm(initialForm);
      setSelectedTags([]);
      onClose?.(); // Close dialog
    } catch (err) {
      alert(err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Product Name */}
          <div className="space-y-2">
            <Label>Product Name</Label>
            <Input
              placeholder="e.g. Peak Milk"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          {/* Price & Cost */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Selling Price</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Cost Price</Label>
              <Input
                type="number"
                value={form.cost_price}
                onChange={(e) => handleChange("cost_price", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <select
              className="w-full border rounded-md p-2 bg-background"
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

          {/* Tags */}
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

          {/* Initial Stock & Reorder Level */}
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

          {/* Warehouse */}
          <div className="space-y-2">
            <Label>Warehouse</Label>
            <select
              className="w-full border rounded-md p-2 bg-background"
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

        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Product"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export function AddCategoryDialog({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState("");

  const handleSubmit = async () => {
    if (!name) return;
    try {
      const newCategory = await createCategory(name);
      onSuccess(newCategory);
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
      onSuccess(newTag);
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

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function AddProductDialog({ isOpen, onClose, onSuccess }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <AddProductForm onSuccess={onSuccess} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
