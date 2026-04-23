import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProducts } from "@/feautures/products/productService";
import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import CartPanel from "@/feautures/sales/CartPanel";
import { useCart } from "@/context/CartContext";
import { getSales, sumSales } from "@/feautures/sales/Sales";
import { getStaff } from "@/feautures/staff/staffService";

function CashierProductsPage({ profile }) {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [staff, setStaff] = useState(null);

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");

  const totalProducts = products.length;

  const lowStock = products.filter(
    (p) => p.stock_quantity <= p.reorder_level && p.stock_quantity > 0,
  ).length;

  const outOfStock = products.filter(
    (p) => !p.stock_quantity || p.stock_quantity === 0,
  ).length;

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const [productData, staffData, salesData] = await Promise.all([
          getProducts(),
          getStaff(profile.id),
          getSales(),
        ]);

        setProducts(productData || []);
        setStaff(staffData);
        setSales(salesData || []);
      } finally {
        setLoading(false);
      }
    }

    load();
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
          p.tags?.join(" ").toLowerCase().includes(q),
      );
    }

    return filtered;
  }, [products, query, category]);

  if (loading)
    return (
      <div className="flex justify-center p-10">
        <Loader className="animate-spin" />
      </div>
    );

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <StatCard title="Total Products" value={totalProducts} />
        <StatCard title="Low Stock" value={lowStock} />
        <StatCard title="Out Of Stock" value={outOfStock} />
        <StatCard
          title="Total Sales"
          value={`₦${sumSales(sales).toLocaleString()}`}
        />
      </div>

      {/* POS Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Products */}
        <div className="col-span-8 flex flex-col gap-4">
          <Input
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <Tabs value={category} onValueChange={setCategory}>
            <TabsList className="w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="school">School</TabsTrigger>
              <TabsTrigger value="kitchen and dining">Kitchen</TabsTrigger>
              <TabsTrigger value="electronics">Electronics</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {filteredProducts.map((product) => (
              <ProductCard product={product} key={product.product_id} />
            ))}
          </div>
        </div>

        {/* Cart */}
        <div className="col-span-8 md:col-span-4">
          <CartPanel profile={profile} staff={staff} />
        </div>
      </div>
    </div>
  );
}

export default CashierProductsPage;

const ProductCard = React.memo(function ProductCard({ product }) {
  const { addToCart } = useCart();

  function isOutOfStock(product) {
    return !product.stock_quantity || product.stock_quantity <= 0;
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

        <div className="flex justify-between items-center">
          <p className="text-sm font-medium truncate max-w-30">
            {product.product_name}
          </p>

          <Badge variant="secondary">{product.stock_quantity ?? 0}</Badge>
        </div>

        <p className="text-sm text-muted-foreground font-semibold">
          ₦{product.price?.toLocaleString()}
        </p>

        <Button
          disabled={isOutOfStock(product)}
          size="sm"
          className="w-full"
          onClick={() => addToCart(product)}
        >
          Add
        </Button>
      </CardContent>
    </Card>
  );
});

function StatCard({ title, value }) {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="text-xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
