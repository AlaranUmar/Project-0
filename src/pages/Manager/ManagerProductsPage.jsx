import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getProducts } from "@/feautures/products/productService";
import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DollarSign, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getSales, sumSales } from "@/feautures/sales/Sales";
import { Link } from "react-router-dom";
function ManagerProductsPage() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [query, setQuery] = useState("");
  const totalProducts = products.length;

  const lowStock = products.filter(
    (p) => p.stock_quantity <= p.reorder_level && p.stock_quantity > 0,
  ).length;

  const outOfStock = products.filter(
    (p) => p.stock_quantity === 0 || p.stock_quantity === null,
  ).length;
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
    async function fetchSales() {
      const data = await getSales();
      setSales(data);
    }
    fetchSales();
    loadProducts();
  }, []);
  return (
    <div className="p-3">
      <div className="flex flex-col gap-3">
        <div className="grid gap-3 md:gap-5 grid-cols-2 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Total Products</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="text-xl font-bold">{totalProducts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Low Stock</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="text-xl font-bold">{lowStock}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Out Of Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{outOfStock}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Sales</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="text-xl font-bold">
                ₦{sumSales(sales).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid">
          <Card>
            <CardHeader className={"flex flex-col"}>
              <CardTitle
                className={"flex justify-between items-center w-full py-1"}
              >
                <span>Products</span>
                <Link to={"/products-sale"}>
                  <Button className="gap-2">
                    <Plus className="h-5 w-5" /> Create Sale
                  </Button>
                </Link>
              </CardTitle>
              <div className="flex gap-2 bg-white w-full justify-end">
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
                    <TableHead>Status</TableHead>
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

export default ManagerProductsPage;

function Product({ product }) {
  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex justify-center items-center h-full">
          <Input type={"checkbox"} className={"size-3 text-white"} />
        </div>
      </TableCell>
      <TableCell className="font-medium">
        <p className="truncate w-30">{product.product_id}</p>
      </TableCell>
      <TableCell className={"truncate max-w-40"}>
        {product.product_name}
      </TableCell>
      <TableCell>₦{product.price}</TableCell>
      <TableCell className={"capitalize"}>{product.category_name}</TableCell>
      <TableCell className={"flex flex-wrap space-x-1"}>
        {product.tags && product.tags.length > 0
          ? product.tags.map((tag) => (
              <span key={tag} className={" text-gray-700"}>
                #{tag}
              </span>
            ))
          : "NULL"}
      </TableCell>
      <TableCell>{product?.stock_quantity || 0}</TableCell>
      <TableCell>
        {product?.stock_quantity > product.reorder_level ? (
          <Badge variant="success">Instock</Badge>
        ) : product?.stock_quantity > 0 ? (
          <Badge variant="warning">Low Stock</Badge>
        ) : (
          <Badge variant="destructive">Out of stock</Badge>
        )}
      </TableCell>
    </TableRow>
  );
}
