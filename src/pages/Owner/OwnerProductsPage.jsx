import { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Box, Edit, ImageIcon, Loader2 } from "lucide-react";

// Services & Utils
import {
  getProducts,
  updateProducts,
} from "@/feautures/products/productService";
import { formatCompactNaira } from "@/utils/formatting";

// Dialogs
import {
  AddProductDialog,
  AddCategoryDialog,
  AddTagDialog,
} from "../dashboard/ProductDialog";
import RestockDialog from "../dashboard/RestockDialog";
import { toast } from "sonner";
import Stats from "@/components/ui/stats";

/* =========================== MAIN PAGE =========================== */
export default function OwnerProductsPage() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Dialog States
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [isRestockDialogOpen, setIsRestockDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Selected Data States
  const [restockingProduct, setRestockingProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  /* =========================== LOAD DATA =========================== */
  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data || []);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  /* =========================== FILTERING (Single Product Logic) =========================== */
  const filteredProducts = useMemo(() => {
    if (!query) return products;
    const q = query.toLowerCase();
    return products.filter((p) => {
      const name = p.name?.toLowerCase() || "";
      const category = p.categories?.name?.toLowerCase() || "";
      const tags =
        p.products_tags
          ?.map((pt) => pt.tags.name)
          .join(" ")
          .toLowerCase() || "";
      return name.includes(q) || category.includes(q) || tags.includes(q);
    });
  }, [query, products]);

  /* =========================== STATS CALCULATIONS =========================== */
  const stats = useMemo(() => {
    const totalCount = products.length;
    let inventoryValue = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    products.forEach((p) => {
      const totalStock =
        p.inventory?.reduce((sum, inv) => sum + Number(inv.quantity), 0) || 0;
      inventoryValue += Number(p.price) * totalStock;

      if (totalStock <= 0) outOfStockCount++;
      else if (totalStock <= (p.reorder_level || 12)) lowStockCount++;
    });

    return { totalCount, inventoryValue, lowStockCount, outOfStockCount };
  }, [products]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span>Loading Inventory...</span>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* ================= STATS SECTION ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stats title="Total Unique Products" value={stats.totalCount} />
        <Stats
          title="Out Of Stock"
          value={stats.outOfStockCount}
          color="text-destructive"
        />
        <Stats
          title="Low Stock"
          value={stats.lowStockCount}
          color="text-orange-500"
        />
        <Stats
          title="Inventory Value"
          value={formatCompactNaira(stats.inventoryValue)}
          icon={Box}
        />
      </div>

      {/* ================= MAIN INVENTORY TABLE ================= */}
      <Card className="shadow-sm">
        <CardHeader className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl">Inventory</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage products and stock levels across all branches.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setIsProductDialogOpen(true)}>
                Add Product
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsCategoryDialogOpen(true)}
              >
                + Category
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsTagDialogOpen(true)}
              >
                + Tag
              </Button>
            </div>
          </div>
          <Input
            placeholder="Search by name, category, or tag..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-md"
          />
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Category</TableHead>
                  {/* <TableHead>Tags</TableHead> */}
                  <TableHead className="text-center">Total Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      onEdit={(p) => {
                        setEditingProduct(p);
                        setIsEditDialogOpen(true);
                      }}
                      onRestock={(p) => {
                        setRestockingProduct(p);
                        setIsRestockDialogOpen(true);
                      }}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No products found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ================= DIALOGS ================= */}
      <AddProductDialog
        isOpen={isProductDialogOpen}
        onClose={() => setIsProductDialogOpen(false)}
        onSuccess={loadProducts}
      />
      <AddCategoryDialog
        isOpen={isCategoryDialogOpen}
        onClose={() => setIsCategoryDialogOpen(false)}
      />
      <AddTagDialog
        isOpen={isTagDialogOpen}
        onClose={() => setIsTagDialogOpen(false)}
      />
      <EditProductDialog
        product={editingProduct}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditingProduct(null);
        }}
        onSuccess={loadProducts}
      />
      <RestockDialog
        product={restockingProduct}
        isOpen={isRestockDialogOpen}
        onClose={() => {
          setIsRestockDialogOpen(false);
          setRestockingProduct(null);
        }}
        onSuccess={loadProducts}
      />
    </div>
  );
}

/* =========================== SUB-COMPONENTS =========================== */

function ProductRow({ product, onEdit, onRestock }) {
  const totalStock =
    product.inventory?.reduce((sum, inv) => sum + Number(inv.quantity), 0) || 0;
  const isLowStock =
    totalStock > 0 && totalStock <= (product.reorder_level || 12);
  const isOutOfStock = totalStock <= 0;

  return (
    <TableRow>
      <TableCell>
        {product.image_url ? (
          <img
            src={product.image_url}
            className="w-10 h-10 object-cover rounded-md border"
            alt={product.name}
          />
        ) : (
          <div className="w-10 h-10 bg-muted flex items-center justify-center rounded-md border">
            <ImageIcon className="w-4 h-4 text-muted-foreground" />
          </div>
        )}
      </TableCell>
      <TableCell className="font-medium truncate max-w-12.5">
        {product.name}
      </TableCell>
      <TableCell>₦{Number(product.price).toLocaleString()}</TableCell>
      <TableCell>
        <Badge variant="outline" className="font-normal">
          {product.categories?.name || "Uncategorized"}
        </Badge>
      </TableCell>
      {/* <TableCell>
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {product.products_tags?.map((pt) => (
            <span
              key={pt.tags.id}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
            >
              {pt.tags.name}
            </span>
          ))}
        </div>
      </TableCell> */}
      <TableCell className="text-center">
        <div className="flex flex-col items-center">
          <span
            className={`font-bold ${isOutOfStock ? "text-destructive" : isLowStock ? "text-orange-500" : "text-green-600"}`}
          >
            {totalStock}
          </span>
          {isLowStock && (
            <span className="text-[10px] uppercase font-bold text-orange-500">
              Low Stock
            </span>
          )}
          {isOutOfStock && (
            <span className="text-[10px] uppercase font-bold text-destructive">
              Out of Stock
            </span>
          )}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onRestock(product)}
          >
            Restock
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onEdit(product)}>
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

function EditProductDialog({ product, isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    reorder: "",
    image: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price || "",
        reorder: product.reorder_level || "",
        image: product.image_url || "",
      });
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProducts({
        product_id: product.id,
        product_name: formData.name,
        price: Number(formData.price),
        reorder_level: Number(formData.reorder),
        image_url: formData.image,
      });
      onSuccess();
      onClose();
      toast.success("Product updated successfully");
    } catch (err) {
      toast.error(err.message || "Failed to update product");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Product Name</label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Price (₦)</label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Reorder Level</label>
              <Input
                type="number"
                value={formData.reorder}
                onChange={(e) =>
                  setFormData({ ...formData, reorder: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Image URL</label>
            <Input
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
