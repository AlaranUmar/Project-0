import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProducts } from "@/feautures/products/productService";
import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CartPanel from "@/feautures/sales/CartPanel";
import { useCart } from "@/context/CartContext";
import { getStaff } from "@/feautures/users/profileService";
import { getSales, sumSales } from "@/feautures/sales/Sales";

function CashierProductsPage({ profile }) {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [staff, setStaff] = useState(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const totalProducts = products.length;

  const lowStock = products.filter(
    (p) => p.stock_quantity <= p.reorder_level && p.stock_quantity > 0,
  ).length;

  const outOfStock = products.filter(
    (p) => p.stock_quantity === null || p.stock_quantity === 0,
  ).length;

  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts();
      setProducts(data || []);
    }
    async function fetchStaff() {
      const data = await getStaff(profile.id);
      setStaff(data);
    }
    async function fetchSales() {
      const data = await getSales();
      setSales(data);
    }

    fetchStaff();
    loadProducts();
    fetchSales();
  }, [profile.id]);
  
  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (category !== "all") {
      filtered = filtered.filter(
        (p) => p.category_name?.toLowerCase() === category,
      );
    }

    if (query) {
      const q = query.toLowerCase();

      filtered = filtered.filter(
        (p) =>
          p.product_name?.toLowerCase().includes(q) ||
          p.category_name?.toLowerCase().includes(q) ||
          p.location_name?.toLowerCase().includes(q) ||
          p.tags?.join(" ").toLowerCase().includes(q),
      );
    }

    return filtered;
  }, [products, query, category]);

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-sm">Total Products</CardTitle>
            <DollarSign size={18} />
          </CardHeader>

          <CardContent>
            <div className="text-xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-sm">Low Stock</CardTitle>
            <DollarSign size={18} />
          </CardHeader>

          <CardContent>
            <div className="text-xl font-bold">{lowStock}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-sm">Out Of Stock</CardTitle>
            <DollarSign size={18} />
          </CardHeader>

          <CardContent>
            <div className="text-xl font-bold">{outOfStock}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-sm">Total Sales</CardTitle>
            <DollarSign size={18} />
          </CardHeader>

          <CardContent>
            <div className="text-xl font-bold">${sumSales(sales).toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-12 gap-4">
        <div className="col-span-8 flex flex-col gap-4">
          <Input
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <Tabs value={category} onValueChange={setCategory}>
            <TabsList className="w-full">
              {/* {} */}
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="gift">Gift items</TabsTrigger>
              <TabsTrigger value="kitchen">Kitchen</TabsTrigger>
              <TabsTrigger value="electronics">Electronics</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {filteredProducts.map((product) => (
              <ProductCard product={product} key={product.product_id} />
            ))}
          </div>
        </div>

        <div className="md:col-span-4">
          <CartPanel profile={profile} staff={staff} />
        </div>
      </div>
    </div>
  );
}

export default CashierProductsPage;

function ProductCard({ product }) {
  const { addToCart } = useCart();
  function inStock(product) {
    if (product.stock_quantity <= 0 || product.stock_quantity === null) {
      return true;
    } else {
      return false;
    }
  }
  return (
    <Card className="cursor-pointer transition hover:-translate-y-1">
      <CardContent className="p-2 flex flex-col gap-2">
        <div className="aspect-square w-full overflow-hidden rounded-md bg-muted">
          <img
            src={product.image_url || "/placeholder.png"}
            alt={product.product_name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium line-clamp-1">
            {product.product_name}
          </p>

          <Badge variant="secondary">{product.stock_quantity ?? 0}</Badge>
        </div>

        <p className="text-sm text-muted-foreground font-semibold">
          ${product.price}
        </p>
        <Button
          disabled={inStock(product)}
          size="sm"
          className="w-full"
          onClick={() => addToCart(product)}
        >
          Add
        </Button>
      </CardContent>
    </Card>
  );
}
