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
import { DollarSign, Edit } from "lucide-react";

import { getProducts } from "@/feautures/products/productService";
import { Badge } from "@/components/ui/badge";
import CategorySelection from "@/feautures/dashboard/CategorySelection";
import {
  AddCategoryDialog,
  AddProductDialog,
  AddTagDialog,
} from "../dashboard/ProductDialog";

export default function OwnerProductsPage() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Load products
  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts();
      setProducts(data);
    }
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!query) return products;

    const q = query.toLowerCase();

    return products.filter((p) => {
      const name = p.product_name?.toLowerCase() || "";
      const category = p.category_name?.toLowerCase() || "";
      const location = p.location_name?.toLowerCase() || "";
      const tags = (p.tags || []).join(" ").toLowerCase();

      return (
        name.includes(q) ||
        category.includes(q) ||
        location.includes(q) ||
        tags.includes(q)
      );
    });
  }, [query, products]);

  const handleAddSuccess = (newProduct) => {
    setProducts((prev) => {
      const exists = prev.some(
        (p) =>
          p.product_id === newProduct.product_id &&
          p.location_id === newProduct.location_id,
      );

      if (exists) return prev;

      return [...prev, newProduct];
    });
  };

  const handleEditSuccess = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.product_id === updatedProduct.product_id &&
        p.location_id === updatedProduct.location_id
          ? updatedProduct
          : p,
      ),
    );
  };

  return (
    <div className="p-1 md:p-4 space-y-4">
      {/* Stats */}
      <div className="grid gap-3 md:gap-5 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Products</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-xl font-bold">
              {
                products
                  .map((p) => p.product_id)
                  .filter((v, i, a) => a.indexOf(v) === i).length
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Out Of Stock</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-xl font-bold">
              {products.filter((p) => p.stock_quantity === 0).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Low Stock</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-xl font-bold">
              {
                products.filter((p) => p.stock_quantity <= p.reorder_level)
                  .length
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Inventory Value</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-xl font-bold">
              {products
                .reduce((acc, p) => acc + p.price * p.stock_quantity, 0)
                .toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader className="flex flex-col gap-2">
          <div className="flex justify-between items-center w-full">
            <CardTitle className="hidden sm:block">Products</CardTitle>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <Button onClick={() => setIsDialogOpen(true)}>Add Product</Button>

              <Button onClick={() => setIsCategoryDialogOpen(true)}>
                Add Category
              </Button>

              <Button onClick={() => setIsTagDialogOpen(true)}>Add Tag</Button>
            </div>
          </div>

          <div className="flex gap-2 bg-white w-full justify-end flex-wrap">
            <CategorySelection />

            <div className="mb-2 w-full max-w-sm">
              <Input
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableCaption>Product Details</TableCaption>

            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Quantity</TableHead>
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
                  onEdit={(product) => {
                    setEditingProduct(product);
                    setIsEditDialogOpen(true);
                  }}
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialogs */}
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
    </div>
  );
}

/* ============================= */
/* Product Row */
/* ============================= */

function ProductRow({ product, onEdit }) {
  const {
    product_id,
    product_name,
    price,
    category_name,
    tags,
    stock_quantity,
    location_name,
    reorder_level,
  } = product;

  let stockBadge;

  if (stock_quantity > reorder_level) {
    stockBadge = <Badge variant="success">In Stock</Badge>;
  } else if (stock_quantity > 0) {
    stockBadge = <Badge variant="warning">Low Stock</Badge>;
  } else {
    stockBadge = <Badge variant="destructive">Out of Stock</Badge>;
  }

  return (
    <TableRow>
      <TableCell>{product_id?.slice(0, 8)}</TableCell>

      <TableCell className="max-w-28 truncate">{product_name}</TableCell>

      <TableCell>${price}</TableCell>

      <TableCell className={"capitalize"}>{category_name}</TableCell>

      <TableCell>{tags?.length ? tags.join(", ") : "NULL"}</TableCell>

      <TableCell>{stock_quantity || 0}</TableCell>

      <TableCell>{location_name || "N/A"}</TableCell>

      <TableCell>{stockBadge}</TableCell>

      <TableCell>
        <div
          onClick={() => onEdit(product)}
          className="bg-gray-200 p-1 rounded-sm cursor-pointer hover:bg-gray-300 w-fit"
        >
          <Edit className="size-4 text-gray-600" />
        </div>
      </TableCell>
    </TableRow>
  );
}

/* ============================= */
/* Edit Product Dialog */
/* ============================= */

function EditProductDialog({ product, isOpen, onClose, onSuccess }) {
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    if (product) {
      setPrice(product.price);
      setStock(product.stock_quantity);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleSave = async () => {
    const updated = {
      ...product,
      price: Number(price),
      stock_quantity: Number(stock),
    };

    // TODO: call updateProduct service here

    onSuccess(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <Input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
          />

          <Input
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="Stock Quantity"
          />

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>

            <Button onClick={handleSave}>Save</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
