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
// import LocationSelector from "@/feautures/dashboard/Selectors/LocationSelector";
import CategorySelection from "@/feautures/dashboard/CategorySelection";
import {
  AddCategoryDialog,
  AddProductDialog,
  AddTagDialog,
} from "../dashboard/ProductDialog";
export default function OwnerProductsPage() {
  const [products, setProducts] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);

  const handleCategoryAdd = (newCategory) => {
    // maybe refresh CategorySelection
    console.log("New category:", newCategory);
  };

  const handleTagAdd = (newTag) => {
    // maybe refresh your tag selection
    console.log("New tag:", newTag);
  };
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

  // Handle adding new product
  const handleAddSuccess = (newProduct) => {
    setProducts((prev) => [...prev, newProduct]);
  };

  return (
    <div className="p-1 md:p-4 space-y-4">
      <div className="grid gap-3 md:gap-5 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Total Products</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Out Of Stock</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-xl font-bold">
              {products.filter((p) => p.stock_quantity === 0).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
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
          <CardHeader className="flex flex-row items-center justify-between">
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

      <Card>
        <CardHeader className="flex flex-col gap-2">
          <div className="flex justify-between items-center w-full">
            <CardTitle className={"hidden sm:block"}>Products</CardTitle>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <Button onClick={() => setIsDialogOpen(true)}>Add Product</Button>
              <AddProductDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSuccess={handleAddSuccess}
              />
              <Button onClick={() => setIsCategoryDialogOpen(true)}>
                Add Category
              </Button>
              <AddCategoryDialog
                isOpen={isCategoryDialogOpen}
                onClose={() => setIsCategoryDialogOpen(false)}
                onSuccess={handleCategoryAdd}
              />
              <Button onClick={() => setIsTagDialogOpen(true)}>Add Tag</Button>
              <AddTagDialog
                isOpen={isTagDialogOpen}
                onClose={() => setIsTagDialogOpen(false)}
                onSuccess={handleTagAdd}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 bg-white w-full justify-end flex-wrap">
            {/* <LocationSelector /> */}
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
                <TableHead className="w-10">
                  <div className="flex justify-center items-center h-full">
                    <Input type="checkbox" className="size-3.5 text-white" />
                  </div>
                </TableHead>
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
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// Product Row Component
function ProductRow({ product }) {
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
    stockBadge = (
      <Badge variant="success" className="cursor-auto">
        In Stock
      </Badge>
    );
  } else if (stock_quantity > 0) {
    stockBadge = (
      <Badge variant="warning" className="cursor-auto">
        Low Stock
      </Badge>
    );
  } else {
    stockBadge = (
      <Badge variant="destructive" className="cursor-auto">
        Out of Stock
      </Badge>
    );
  }

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex justify-center items-center h-full">
          <Input type="checkbox" className="size-3 text-white" />
        </div>
      </TableCell>
      <TableCell>{product_id?.slice(0, 8)}</TableCell>
      <TableCell className={" max-w-28 truncate"}>{product_name}</TableCell>
      <TableCell>${price}</TableCell>
      <TableCell>{category_name?.toUpperCase()}</TableCell>
      <TableCell>{tags?.length ? tags.join(", ") : "NULL"}</TableCell>
      <TableCell>{stock_quantity || 0}</TableCell>
      <TableCell>{location_name || "N/A"}</TableCell>
      <TableCell>{stockBadge}</TableCell>
      <TableCell className="flex justify-center items-center">
        <div className="bg-gray-200 p-1 rounded-sm cursor-pointer hover:bg-gray-300">
          <Edit className="size-4 text-gray-600" />
        </div>
      </TableCell>
    </TableRow>
  );
}
