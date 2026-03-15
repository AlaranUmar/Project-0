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
import CategorySelection from "@/feautures/dashboard/CategorySelection";
import { Button } from "@/components/ui/button";
import { DollarSign, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getSales, sumSales } from "@/feautures/sales/Sales";
function ManagerProductsPage() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [query, setQuery] = useState("");
  const totalProducts = products.length;

  const lowStock = products.filter(
    (p) => p.stock_quantity <= p.reorder_level && p.stock_quantity > 0,
  ).length;

  const outOfStock = products.filter((p) => p.stock_quantity === 0).length;

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

              <DollarSign size={18} />
            </CardHeader>

            <CardContent>
              <div className="text-xl font-bold">{totalProducts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Low Stock</CardTitle>

              <DollarSign size={18} />
            </CardHeader>

            <CardContent>
              <div className="text-xl font-bold">{lowStock}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Out Of Stock</CardTitle>

              <DollarSign size={18} />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{outOfStock}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Sales</CardTitle>

              <DollarSign size={18} />
            </CardHeader>

            <CardContent>
              <div className="text-xl font-bold">
                ${sumSales(sales).toLocaleString()}
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
                <Button className="gap-2">
                  <Plus className="h-5 w-5" /> Create Sale
                </Button>
              </CardTitle>
              <div className="flex gap-2 bg-white w-full justify-end">
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
      <TableCell className="font-medium overflow-hidden text-right max-w-20">
        <p>{product.product_id}</p>
      </TableCell>
      <TableCell>{product.product_name}</TableCell>
      <TableCell>${product.price}</TableCell>
      <TableCell>{product.category_name.toUpperCase()}</TableCell>
      <TableCell className={"flex flex-wrap space-x-1"}>
        {product.tags && product.tags.length > 0
          ? product.tags.map((tag) => (
              <span key={tag} className={" text-gray-700"}>
                #{tag}
              </span>
            ))
          : "NULL"}
        {console.log(product)}
      </TableCell>
      <TableCell>{product?.stock_quantity || 0}</TableCell>
      <TableCell>{product?.location_name || "not available"}</TableCell>
      <TableCell>
        {product?.stock_quantity > product.reorder_level ? (
          <Badge variant="success">Instock</Badge>
        ) : // the variant "success" how to define
        // you can add it to your Badge component like this:
        // const badgeVariants = cva(
        //   "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
        //  {
        //     variants: {
        //       variant: {
        //         default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",

        product?.stock_quantity > 0 ? (
          <Badge variant="warning">Low Stock</Badge>
        ) : (
          <Badge variant="destructive">Out of stock</Badge>
        )}
      </TableCell>
    </TableRow>
  );
}
