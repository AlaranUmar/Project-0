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
import { Edit, ImageIcon } from "lucide-react";

import {
  getProducts,
  updateProducts,
} from "@/feautures/products/productService";

import {
  AddProductDialog,
  AddCategoryDialog,
  AddTagDialog,
} from "../dashboard/ProductDialog";

import RestockDialog from "../dashboard/RestockDialog";

/* ===========================
   MAIN PAGE
=========================== */

export default function OwnerProductsPage() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);

  const [restockingProduct, setRestockingProduct] = useState(null);
  const [isRestockDialogOpen, setIsRestockDialogOpen] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  /* ===========================
     LOAD PRODUCTS
  =========================== */

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getProducts();
      setProducts(data || []);
      setLoading(false);
    }
    load();
  }, []);

  /* ===========================
     FILTER PRODUCTS
  =========================== */

  const filteredProducts = useMemo(() => {
    if (!query) return products;

    const q = query.toLowerCase();

    return products.filter((p) => {
      const name = p.product_name?.toLowerCase() || "";
      const category = p.category_name?.toLowerCase() || "";
      const location = p.location_name?.toLowerCase() || "";
      const tags = Array.isArray(p.tags) ? p.tags.join(" ").toLowerCase() : "";

      return (
        name.includes(q) ||
        category.includes(q) ||
        location.includes(q) ||
        tags.includes(q)
      );
    });
  }, [query, products]);

  /* ===========================
     HANDLERS
  =========================== */

  const handleAddSuccess = (newProduct) => {
    setProducts((prev) => {
      const exists = prev.some(
        (p) =>
          p.product_id === newProduct.product_id &&
          p.location_id === newProduct.location_id,
      );
      return exists ? prev : [...prev, newProduct];
    });
  };

  const handleEditSuccess = (updated) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.product_id === updated.product_id &&
        p.location_id === updated.location_id
          ? updated
          : p,
      ),
    );
  };

  /* ===========================
     LOADING
  =========================== */

  if (loading) {
    return <div className="p-10 text-center">Loading products...</div>;
  }

  /* ===========================
     STATS
  =========================== */

  const totalProducts = new Set(products.map((p) => p.product_id)).size;

  const outOfStock = products.filter(
    (p) => !p.stock_quantity || p.stock_quantity <= 0,
  ).length;

  const lowStock = products.filter(
    (p) => p.stock_quantity > 0 && p.stock_quantity <= (p.reorder_level || 0),
  ).length;

  const inventoryValue = products
    .reduce((acc, p) => acc + (p.price || 0) * (p.stock_quantity || 0), 0)
    .toLocaleString();

  return (
    <div className="p-3 space-y-4">
      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat title="Total Products" value={totalProducts} />
        <Stat title="Out Of Stock" value={outOfStock} />
        <Stat title="Low Stock" value={lowStock} />
        <Stat title="Inventory Value" value={`₦${inventoryValue}`} />
      </div>

      {/* ================= TABLE ================= */}
      <Card>
        <CardHeader className="flex flex-col gap-3">
          <div className="flex justify-between">
            <CardTitle>Products</CardTitle>

            <div className="flex gap-2">
              <Button onClick={() => setIsDialogOpen(true)}>Add</Button>
              <Button onClick={() => setIsCategoryDialogOpen(true)}>
                Category
              </Button>
              <Button onClick={() => setIsTagDialogOpen(true)}>Tag</Button>
            </div>
          </div>

          <Input
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </CardHeader>

        <CardContent>
          <Table>
            <TableCaption>All Products</TableCaption>

            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Reorder</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredProducts.map((product) => (
                <ProductRow
                  key={`${product.product_id}-${product.location_id}`}
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ================= DIALOGS ================= */}

      <AddProductDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={handleAddSuccess}
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
        onClose={() => setIsEditDialogOpen(false)}
        onSuccess={handleEditSuccess}
      />

      <RestockDialog
        product={restockingProduct}
        isOpen={isRestockDialogOpen}
        onClose={() => setIsRestockDialogOpen(false)}
        onSuccess={(updated) =>
          setProducts((prev) =>
            prev.map((p) =>
              p.product_id === updated.product_id &&
              p.location_id === updated.location_id
                ? updated
                : p,
            ),
          )
        }
      />
    </div>
  );
}

/* ===========================
   STATS COMPONENT
=========================== */

function Stat({ title, value }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

/* ===========================
   PRODUCT ROW
=========================== */

function ProductRow({ product, onEdit, onRestock }) {
  const {
    product_name,
    price,
    category_name,
    tags,
    stock_quantity,
    location_name,
    reorder_level,
    image_url,
  } = product;

  const reorder = reorder_level || 0;

  let status =
    stock_quantity > reorder ? "In Stock" : stock_quantity > 0 ? "Low" : "Out";

  return (
    <TableRow>
      <TableCell>
        {image_url ? (
          <img src={image_url} className="w-10 h-10 object-cover rounded" />
        ) : (
          <div className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded">
            <ImageIcon className="w-4 h-4" />
          </div>
        )}
      </TableCell>

      <TableCell>{product_name}</TableCell>
      <TableCell>₦{price}</TableCell>
      <TableCell>{category_name}</TableCell>
      <TableCell>{Array.isArray(tags) ? tags.join(", ") : "—"}</TableCell>

      <TableCell>{stock_quantity || 0}</TableCell>
      <TableCell>{reorder}</TableCell>
      <TableCell>{location_name}</TableCell>

      <TableCell>
        <Badge>{status}</Badge>
      </TableCell>

      <TableCell className="flex gap-2">
        <Button size="sm" onClick={() => onRestock(product)}>
          Restock
        </Button>

        <Button size="sm" variant="outline" onClick={() => onEdit(product)}>
          <Edit className="w-4 h-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

/* ===========================
   EDIT PRODUCT DIALOG (FIXED)
=========================== */

function EditProductDialog({ product, isOpen, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [reorder, setReorder] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (product) {
      setName(product.product_name || "");
      setPrice(product.price || "");
      setReorder(product.reorder_level || "");
      setImage(product.image_url || "");
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const save = async () => {
    const updated = {
      ...product,
      product_name: name,
      price: Number(price),
      reorder_level: Number(reorder),
      image_url: image,
    };

    await updateProducts(updated);
    onSuccess(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <Card className="w-[400px] p-4 space-y-3">
        <Input value={name} onChange={(e) => setName(e.target.value)} />
        <Input value={price} onChange={(e) => setPrice(e.target.value)} />
        <Input value={reorder} onChange={(e) => setReorder(e.target.value)} />
        <Input value={image} onChange={(e) => setImage(e.target.value)} />

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save}>Save</Button>
        </div>
      </Card>
    </div>
  );
}
