import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProducts } from "@/feautures/products/productService";
import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSales, sumSales } from "@/feautures/sales/Sales";
import { getStaff } from "@/feautures/staff/staffService";
import { Box, Loader, ShoppingCart, Wallet } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import CartPanel from "@/feautures/sales/CartPanel";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Stats from "@/components/ui/Stats";

function ManagerProductsSale({ profile }) {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [staff, setStaff] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("all");
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(products.map((p) => p.categories?.name).filter(Boolean)),
    ];

    return ["all", ...uniqueCategories];
  }, [products]);
  const PRODUCTS_PER_PAGE = 24;

  const [page, setPage] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);

  const { addToCart, cart } = useCart();

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

  useEffect(() => {
    setPage(1);
  }, [query, category]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (category !== "all") {
      filtered = filtered.filter(
        (p) => p.categories?.name?.toLowerCase() === category,
      );
    }

    if (query) {
      const q = query.toLowerCase();

      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.categories?.name?.toLowerCase().includes(q),
      );
    }

    return filtered.sort((a, b) => {
      const qtyA = a?.inventory?.[0]?.quantity ?? 0;

      const qtyB = b?.inventory?.[0]?.quantity ?? 0;

      if (qtyA <= 0 && qtyB > 0) return 1;
      if (qtyA > 0 && qtyB <= 0) return -1;

      return a.name.localeCompare(b.name);
    });
  }, [products, query, category]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE,
  );

  if (loading) return <Loader className="animate-spin" />;

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Stats title="Total Products" value={totalProducts} icon={Box} />

        <Stats title="Low Stock" value={lowStock} />

        <Stats title="Out Of Stock" value={outOfStock} />

        <Stats
          title="Total Sales"
          value={`₦${sumSales(sales).toLocaleString()}`}
          icon={Wallet}
        />
      </div>

      <div className="flex flex-col gap-4">
        <Input
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />

        <Tabs value={category} onValueChange={setCategory}>
          <TabsList className="w-full flex flex-wrap h-auto px-3">
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat.toLowerCase()}>
                {cat === "all" ? "All" : cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {paginatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))}
        </div>
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>

          <Badge>
            {page} / {totalPages || 1}
          </Badge>

          <Button
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      <Button
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl z-50"
        onClick={() => setCartOpen(true)}
      >
        <ShoppingCart />

        {cart.length > 0 && (
          <Badge className="absolute -top-2 -right-2">{cart.length}</Badge>
        )}
      </Button>

      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent className="w-full sm:max-w-xl! md:max-w-xl! lg:max-w-2xl! h-full flex flex-col p-0 gap-0">
          <div className="">
            <SheetHeader>
              <SheetTitle>Checkout</SheetTitle>
            </SheetHeader>
          </div>

          <div className="flex-1 overflow-y-auto">
            <CartPanel profile={profile} staff={staff} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default ManagerProductsSale;

// function Stat({ title, value }) {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="text-sm">{title}</CardTitle>
//       </CardHeader>

//       <CardContent>
//         <div className="text-xl font-bold">{value}</div>
//       </CardContent>
//     </Card>
//   );
// }

function ProductCard({ product, addToCart }) {
  const qty = product?.inventory?.[0]?.quantity ?? 0;

  const isOut = qty <= 0;

  return (
    <Card
      className={`cursor-pointer transition hover:-translate-y-1 ${
        isOut ? "opacity-60" : ""
      }`}
      onClick={() => !isOut && addToCart(product)}
    >
      <CardContent className="p-2 flex flex-col gap-2">
        <div className="aspect-square rounded-md overflow-hidden bg-muted">
          <img
            src={product.image_url || "/placeholder.png"}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.png";
            }}
          />
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm truncate" title={product.name}>
            {product.name}
          </p>

          <Badge variant={isOut ? "destructive" : "secondary"}>{qty}</Badge>
        </div>

        <p className="font-semibold">
          ₦{Number(product.price || 0).toLocaleString()}
        </p>

        {isOut ? (
          <Badge variant="destructive">Out Of Stock</Badge>
        ) : (
          <Badge variant="secondary">In Stock</Badge>
        )}
      </CardContent>
    </Card>
  );
}
