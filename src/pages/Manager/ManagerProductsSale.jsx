import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProducts } from "@/feautures/products/productService";
import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CartPanel from "@/feautures/sales/CartPanel";
import { getSales, sumSales } from "@/feautures/sales/Sales";
import { getStaff } from "@/feautures/staff/staffService";
import { Loader } from "lucide-react";
import { useCart } from "@/context/CartContext";

function ManagerProductsSale({ profile }) {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [staff, setStaff] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("all");

  const { addToCart } = useCart();

  const getQty = (p) => p?.inventory?.[0]?.quantity ?? 0;

  const totalProducts = products.length;
  const lowStock = products.filter(
    (p) => getQty(p) <= p.reorder_level && getQty(p) > 0,
  ).length;

  const outOfStock = products.filter((p) => getQty(p) === 0).length;

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      try {
        const [productsData, staffData, salesData] = await Promise.all([
          getProducts(),
          getStaff(profile?.id),
          getSales(),
        ]);

        setProducts(productsData || []);
        setStaff(staffData);
        setSales(salesData || []);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }

    loadAll();
  }, [profile?.id]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (category !== "all") {
      filtered = filtered.filter(
        (p) => p.categories.name?.toLowerCase() === category,
      );
    }

    if (query) {
      const q = query.toLowerCase();

      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.categories.name?.toLowerCase().includes(q) ||
          p.tags?.join(" ").toLowerCase().includes(q),
      );
    }

    return filtered;
  }, [products, query, category]);

  if (loading) return <Loader className="animate-spin" />;

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* STATS */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Stat title="Total Products" value={totalProducts} />
        <Stat title="Low Stock" value={lowStock} />
        <Stat title="Out Of Stock" value={outOfStock} />
        <Stat
          title="Total Sales"
          value={`₦${sumSales(sales).toLocaleString()}`}
        />
      </div>

      {/* MAIN */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="col-span-8 flex flex-col gap-4">
          <Input
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
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
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
              />
            ))}
          </div>
        </div>

        <div className="col-span-8 md:col-span-4">
          <CartPanel profile={profile} staff={staff} />
        </div>
      </div>
    </div>
  );
}

export default ManagerProductsSale;

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

function ProductCard({ product, addToCart }) {
  const qty = product?.inventory?.[0]?.quantity ?? 0;
  const isOut = qty <= 0;

  return (
    <Card
      className="cursor-pointer hover:-translate-y-1 transition"
      onClick={() => !isOut && addToCart(product)}
    >
      <CardContent className="p-2 flex flex-col gap-2">
        <div className="aspect-square rounded-md overflow-hidden bg-muted">
          <img
            src={product.image_url || "/placeholder.png"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex justify-between">
          <p className="text-sm truncate">{product.name}</p>
          <Badge>{qty}</Badge>
        </div>

        <p className="font-semibold">₦{product.price}</p>
      </CardContent>
    </Card>
  );
}
