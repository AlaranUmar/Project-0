import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getProducts } from "@/feautures/products/productService";
import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { DollarSign, Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocationSelector } from "@/feautures/dashboard/Selectors";
import CategorySelection from "@/feautures/dashboard/CategorySelection";
import { Badge } from "@/components/ui/badge";
function OwnerProductsPage() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    if (!query) return products;

    const q = query.toLowerCase();

    return products.filter(
      (p) =>
        p.product_name.toLowerCase().includes(q) ||
        p.category_name.toLowerCase().includes(q) ||
        p.location_name?.toLowerCase().includes(q) ||
        p.tags?.join(" ").toLowerCase().includes(q),
    );
  }, [query, products]);
  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts();
      setProducts(data);
    }
    loadProducts();
  }, []);
  return (
    <div className="p-3">
      <div className="flex flex-col gap-3">
        <div className="grid gap-3 md:gap-5 grid-cols-2 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Sales</CardTitle>

              <DollarSign size={18} />
            </CardHeader>

            <CardContent>
              <div className="text-xl font-bold">$4,200</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Sales</CardTitle>

              <DollarSign size={18} />
            </CardHeader>

            <CardContent>
              <div className="text-xl font-bold">$4,200</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Sales</CardTitle>

              <DollarSign size={18} />
            </CardHeader>

            <CardContent>
              <div className="text-xl font-bold">$4,200</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Sales</CardTitle>

              <DollarSign size={18} />
            </CardHeader>

            <CardContent>
              <div className="text-xl font-bold">$4,200</div>
            </CardContent>
          </Card>
        </div>
        <div className="grid">
          <Card>
            <CardHeader className={"flex flex-col gap-2"}>
              <CardTitle className={"flex justify-between items-center w-full"}>
                <span>Products</span>
                <Button>
                  <Plus /> Add Product
                </Button>
              </CardTitle>
              <div className="flex gap-2 bg-white w-full justify-end">
                <LocationSelector />
                <CategorySelection />
                <div className="mb-4 w-full max-w-sm">
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
                  <TableRow className={"bg-muted"}>
                    <TableHead className={"w-10"}>
                      <div className="flex justify-center items-center h-full">
                        <Input
                          type={"checkbox"}
                          className={"size-3.5 text-white"}
                        />
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
                    <Product
                      product={product}
                      key={`${product.product_id}-${product.location_id}`}
                    />
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default OwnerProductsPage;

function Product({ product }) {
  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex justify-center items-center h-full">
          <Input type={"checkbox"} className={"size-3 text-white"} />
        </div>
      </TableCell>
      <TableCell className="font-medium overflow-hidden text-right max-w-20">
        <p>{product.product_id}</p>
      </TableCell>
      <TableCell>{product.product_name}</TableCell>
      <TableCell>${product.price}</TableCell>
      <TableCell>{product.category_name.toUpperCase()}</TableCell>
      <TableCell>
        {product.tags && product.tags.length > 0
          ? product.tags.join(", ")
          : "NULL"}
      </TableCell>
      <TableCell>{product?.stock_quantity || 0}</TableCell>
      <TableCell>{product?.location_name || "not available"}</TableCell>
      <TableCell>
        {product?.stock_quantity > product.reorder_level ? (
          <Badge variant="success" className={"cursor-auto"}>
            Instock
          </Badge>
        ) : product?.stock_quantity > 0 ? (
          <Badge variant="warning" className={"cursor-auto"}>
            Low Stock
          </Badge>
        ) : (
          <Badge variant="destructive" className={"cursor-auto"}>
            Out of stock
          </Badge>
        )}
      </TableCell>
      <TableCell className={"w-full flex justify-center items-center"}>
        <div className="bg-gray-200 p-1 rounded-sm cursor-pointer hover:bg-gray-300">
          <Edit className="size-4 text-gray-600" />
        </div>
      </TableCell>
    </TableRow>
  );
}
