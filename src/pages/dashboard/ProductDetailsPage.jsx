import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Boxes,
  Edit2,
  ImageIcon,
  Loader2,
  Package,
  RefreshCcw,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Warehouse,
  Store,
  MoreVertical,
  ChevronRight,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  getProductById,
  getProductSales,
  getProductMovements,
} from "@/feautures/products/productService";
import { formatCompactNaira } from "@/utils/formatting";
import Stats from "@/components/ui/Stats";

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      // Execute data queries in parallel to hydrate all layout tab states
      const [productData, salesData, movementsData] = await Promise.all([
        getProductById(productId),
        getProductSales(productId),
        getProductMovements(productId),
      ]);

      if (!productData) throw new Error("No data found");

      // Attach real-time sub-tables directly to the primary product object payload
      setProduct({
        ...productData,
        sale_items: salesData || [],
        stock_movements: movementsData || [],
      });
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const metrics = useMemo(() => {
    if (!product) return null;

    const totalStock =
      product.inventory?.reduce(
        (sum, item) => sum + Number(item.quantity),
        0,
      ) || 0;
    const totalRevenue =
      product.sale_items?.reduce(
        (sum, item) => sum + Number(item.subtotal),
        0,
      ) || 0;
    console.log(product);
    const totalSold =
      product.sale_items?.reduce(
        (sum, item) => sum + Number(item.quantity),
        0,
      ) || 0;

    const price = Number(product.price || 0);
    const costPrice = Number(product.cost_price || 0);

    const inventoryValue = totalStock * price;
    const profitPerUnit = price - costPrice;
    const profitMargin = price > 0 ? (profitPerUnit / price) * 100 : 0;

    const lowStock =
      totalStock > 0 && totalStock <= Number(product.reorder_level || 12);
    const outOfStock = totalStock <= 0;

    return {
      totalStock,
      totalRevenue,
      totalSold,
      inventoryValue,
      profitPerUnit,
      profitMargin,
      lowStock,
      outOfStock,
    };
  }, [product]);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">
          Retrieving product record registry...
        </p>
      </div>
    );
  }

  if (error || !product || !metrics) {
    return (
      <div className="p-6 max-w-3xl mx-auto mt-10">
        <Card className="border-dashed border-2">
          <CardContent className="py-12 text-center flex flex-col items-center justify-center max-w-md mx-auto space-y-4">
            <div className="p-3 bg-muted rounded-full">
              <AlertTriangle className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">
                Product record unavailable
              </h3>
              <p className="text-sm text-muted-foreground">
                The identifier may be corrupted, archived, or removed entirely
                from the distribution logs.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={() => navigate(-1)}>
                Go Back
              </Button>
              <Button size="sm" onClick={loadProduct}>
                Retry Sync
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const {
    totalStock,
    totalRevenue,
    totalSold,
    inventoryValue,
    profitPerUnit,
    profitMargin,
    lowStock,
    outOfStock,
  } = metrics;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8 animate-fade-in">
      {/* ================================================================= */}
      {/* ACTION HEADER & BREADCRUMB SYSTEMS */}
      {/* ================================================================= */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className="hover:text-foreground cursor-pointer transition-colors"
              onClick={() => navigate("/products")}
            >
              Products
            </span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground text-xs font-medium truncate max-w-[200px]">
              {product.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-sm font-bold tracking-tight text-foreground">
              {product.name}
            </p>
            {outOfStock ? (
              <Badge variant="destructive">Out Of Stock</Badge>
            ) : lowStock ? (
              <Badge variant="warning">Low Stock</Badge>
            ) : (
              <Badge variant="success">Active</Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <Button size="sm" className="shadow-sm">
            <Edit2 className="h-3.5 w-3.5 mr-2" /> Edit Product
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 shadow-sm"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem className="cursor-pointer">
                <RefreshCcw className="h-3.5 w-3.5 mr-2 text-muted-foreground" />{" "}
                Restock
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Package className="h-3.5 w-3.5 mr-2 text-muted-foreground" />{" "}
                Transfer
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <ImageIcon className="h-3.5 w-3.5 mr-2 text-muted-foreground" />{" "}
                Upload Image
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          {product.image_url ? (
            <div className="overflow-hidden rounded-xl border bg-zinc-50 shadow-sm group">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ) : (
            <div className="w-full aspect-square rounded-xl border border-dashed bg-muted/30 flex flex-col items-center justify-center gap-2 shadow-inner">
              <ImageIcon className="w-10 h-10 text-muted-foreground/40" />
              <span className="text-xs text-muted-foreground font-medium">
                No asset image attached
              </span>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 flex flex-col justify-between space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-muted/20 p-5 rounded-xl border border-border/60">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Price
              </span>
              <p className="text-3xl font-semibold tracking-tight text-foreground">
                ₦{Number(product.price).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground pt-0.5">
                Acquisition Basis:{" "}
                <span className="font-semibold text-foreground">
                  ₦{Number(product.cost_price || 0).toLocaleString()}
                </span>
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Yield Performance
              </span>
              <p className="text-3xl font-semibold tracking-tight text-emerald-600">
                ₦{profitPerUnit.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground pt-0.5">
                Margin Target Status:{" "}
                <span className="font-semibold text-foreground">
                  {profitMargin.toFixed(1)}%
                </span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Stats title="Total Stock" value={totalStock} icon={Boxes} />
            <Stats title="Units Sold" value={totalSold} icon={ShoppingCart} />
            <Stats
              title="Gross Revenue"
              value={formatCompactNaira(totalRevenue)}
              icon={TrendingUp}
            />
            <Stats
              title="Inventory Value"
              value={formatCompactNaira(inventoryValue)}
              icon={Package}
            />
            <Stats
              title="Allocated Units"
              value={`${product.inventory?.length || 0} Places`}
              icon={Warehouse}
            />
            <Stats
              title="Reorder Level"
              value={`${product.reorder_level || 12} Min`}
              icon={AlertTriangle}
            />
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* TABS CONTAINER CONTEXT LEDGER */}
      {/* ================================================================= */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="w-full justify-start h-10 bg-transparent p-0 border-b rounded-none space-x-6 overflow-x-auto no-scrollbar">
          {[
            "overview",
            "inventory",
            "sales",
            "movements",
            "analytics",
            "settings",
          ].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="h-10 rounded-none border-b-2 border-transparent bg-transparent px-1 py-2 text-sm font-medium text-muted-foreground shadow-none transition-all data-[state=active]:border-primary data-[state=active]:text-foreground capitalize"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* OVERVIEW DATA CONTENT TAB */}
        <TabsContent
          value="overview"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-0"
        >
          <Card className="md:col-span-2 shadow-sm border-border/80">
            <CardHeader>
              <CardTitle className="text-sm font-semibold tracking-tight uppercase">
                General Attributes
              </CardTitle>
              <CardDescription>
                System identifiers and physical deployment data categorization.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm divide-y px-6">
              <InfoRow
                label="Product Category"
                value={product.categories?.name || "Unassigned"}
              />
              <InfoRow
                label="Safety Buffer Threshold"
                value={`${product.reorder_level || 12} Units Minimum`}
              />
              <InfoRow
                label="Review Engine Rating"
                value={
                  product.rating
                    ? `★ ${product.rating} / 5.0`
                    : "Unrated Profile"
                }
              />
              <InfoRow
                label="System Creation Date"
                value={new Date(product.created_at).toLocaleDateString(
                  undefined,
                  { dateStyle: "long" },
                )}
              />
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/80">
            <CardHeader>
              <CardTitle className="text-sm font-semibold tracking-tight uppercase">
                Health Check Diagnostics
              </CardTitle>
              <CardDescription>
                Live automated analysis evaluation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm pt-2">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Stock Integrity</span>
                {outOfStock ? (
                  <Badge variant="destructive">Out Of Stock</Badge>
                ) : lowStock ? (
                  <Badge variant="warning">Low Stock</Badge>
                ) : (
                  <Badge variant="success">In Stock</Badge>
                )}
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">
                  Liquid Asset Valuation
                </span>
                <span className="font-semibold text-foreground">
                  {formatCompactNaira(inventoryValue)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  Product Performance
                </span>
                <Badge variant="secondary" className="font-mono">
                  {profitMargin.toFixed(1)}% Margins
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* INVENTORY DEPOT BREAKDOWN TAB */}
        <TabsContent value="inventory" className="mt-0">
          <Card className="shadow-sm border-border/80">
            <CardHeader>
              <CardTitle className="text-sm font-semibold tracking-tight uppercase">
                Stock Distribution Nodes
              </CardTitle>
              <CardDescription>
                Breakdown of physical assets stored in warehouses or retail
                branches.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 border-t">
              {product.inventory?.length > 0 ? (
                <div className="divide-y text-sm">
                  {product.inventory.map((item) => {
                    const quantity = Number(item.quantity);
                    const isLow =
                      quantity <= Number(product.reorder_level || 12);
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 px-6 hover:bg-muted/20 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {item.locations?.type === "warehouse" ? (
                              <Warehouse className="h-4 w-4" />
                            ) : (
                              <Store className="h-4 w-4" />
                            )}
                            <span className="font-medium text-foreground">
                              {item.locations?.name}
                            </span>
                            <Badge
                              variant="secondary"
                              className="text-[10px] uppercase font-semibold px-2 py-0 border tracking-wider"
                            >
                              {item.locations?.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {item.locations?.address ||
                              "No address log configured"}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`font-mono text-base font-bold ${quantity <= 0 ? "text-destructive" : isLow ? "text-amber-500" : "text-foreground"}`}
                          >
                            {quantity}
                          </span>
                          <p className="text-[9px] uppercase tracking-wider font-medium text-muted-foreground">
                            Units Available
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 text-sm text-muted-foreground flex flex-col items-center justify-center gap-2">
                  <Warehouse className="h-8 w-8 text-muted-foreground/30" />
                  <span>No location deployment configurations verified.</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TRANSACTION LEDGER TRACKS TAB */}
        <TabsContent value="sales" className="mt-0">
          <Card className="shadow-sm border-border/80">
            <CardHeader>
              <CardTitle className="text-sm font-semibold tracking-tight uppercase">
                Transaction Registers
              </CardTitle>
              <CardDescription>
                Recent customer dynamic invoices including this item.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 border-t">
              {product.sale_items?.length > 0 ? (
                <div className="divide-y text-sm">
                  {product.sale_items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-4 px-6 hover:bg-muted/20 transition-colors"
                    >
                      <div className="space-y-1">
                        <span className="font-mono font-semibold text-xs bg-muted/60 px-2 py-0.5 rounded border">
                          #{item.sale_id?.slice(0, 8).toUpperCase()}
                        </span>
                        <p className="text-xs text-muted-foreground pt-0.5">
                          Dispatched {item.quantity} items •{" "}
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="font-semibold text-foreground">
                        ₦{Number(item.subtotal).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-sm text-muted-foreground flex flex-col items-center justify-center gap-2">
                  <ShoppingCart className="h-8 w-8 text-muted-foreground/30" />
                  <span>No historic operational checkouts registered.</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* STOCK MOVEMENT AUDIT TRAIL TAB */}
        <TabsContent value="movements" className="mt-0">
          <Card className="shadow-sm border-border/80">
            <CardHeader>
              <CardTitle className="text-sm font-semibold tracking-tight uppercase">
                Audit Movement History
              </CardTitle>
              <CardDescription>
                Historical system updates, inventory shifts, and stock balancing
                controls.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 border-t">
              {product.stock_movements?.length > 0 ? (
                <div className="divide-y text-sm">
                  {product.stock_movements.map((movement) => (
                    <div
                      key={movement.id}
                      className="flex justify-between items-center p-4 px-6 hover:bg-muted/20 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-semibold text-foreground">
                            {movement.locations?.name || "Global Root"}
                          </span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground/90 italic">
                            {movement.notes || "System balance revision"}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          {new Date(movement.created_at).toLocaleString()}
                        </p>
                      </div>
                      <span
                        className={`font-mono font-bold text-sm px-2 py-0.5 rounded ${
                          Number(movement.quantity_change) > 0
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {Number(movement.quantity_change) > 0 ? "+" : ""}
                        {movement.quantity_change}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-sm text-muted-foreground flex flex-col items-center justify-center gap-2">
                  <RefreshCcw className="h-8 w-8 text-muted-foreground/30" />
                  <span>No internal modification audits logged.</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* COMPILED METRIC ANALYTICS CARDS TAB */}
        <TabsContent
          value="analytics"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-0"
        >
          <AnalyticsCard
            title="Gross Revenue Generated"
            value={formatCompactNaira(totalRevenue)}
            description="Accumulated lifetime gross balance register items."
          />
          <AnalyticsCard
            title="On-Hand Liquidity Value"
            value={formatCompactNaira(inventoryValue)}
            description="Value parameters based on active listed retail tier price."
          />
          <AnalyticsCard
            title="Strategic Unit Margin"
            value={`${profitMargin.toFixed(1)}%`}
            description="Net efficiency spread markup pricing parameters."
          />
          <AnalyticsCard
            title="Volume Velocity"
            value={`${totalSold} Units`}
            description="Gross volume processing units passed to client nodes."
          />
        </TabsContent>

        {/* CRITICAL SYSTEM OVERRIDES SETTINGS TAB */}
        <TabsContent value="settings" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold tracking-tight uppercase ">
                Critical Danger Security Protocols
              </CardTitle>
              <CardDescription>
                Destructive overrides immediately affecting central product
                matrices.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm divide-y divide-rose-100/60 px-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center pt-2">
                <div className="space-y-0.5">
                  <p className="font-semibold text-foreground">
                    Archive Registry Frame
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Suspends execution routing and drops active placement
                    visibility across point of sale workflows.
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Deactivate Profile
                </Button>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center pt-4">
                <div className="space-y-0.5">
                  <p className="font-semibold ">
                    Hard Purge Relational Records
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Irreversibly vaporizes item from database nodes. Action
                    loops are absolute.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="sm:w-auto w-full shadow-sm "
                >
                  Delete Database Unit
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-3.5 first:pt-2 last:pb-2">
      <span className="text-muted-foreground text-xs md:text-sm">{label}</span>
      <span className="font-semibold text-foreground text-xs md:text-sm">
        {value}
      </span>
    </div>
  );
}

function AnalyticsCard({ title, value, description }) {
  return (
    <Card className="shadow-sm border-border/80 flex flex-col justify-between">
      <CardHeader className="space-y-1.5 p-5">
        <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {title}
        </CardDescription>
        <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
          {value}
        </CardTitle>
      </CardHeader>
      {description && (
        <CardContent className="px-5 pb-5 pt-0">
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        </CardContent>
      )}
    </Card>
  );
}
