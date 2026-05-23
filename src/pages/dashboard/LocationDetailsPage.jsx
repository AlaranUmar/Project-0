import { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  ArrowBigLeft,
  ArrowBigRight,
  Package,
  TrendingDown,
  Wallet,
  Users,
  Boxes,
  Truck,
  AlertTriangle,
  Loader2,
  Store,
  Warehouse,
  RefreshCcw,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Separator } from "@/components/ui/separator";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import Stats from "@/components/ui/Stats";

import {
  getLocationOverview,
  getLocationSales,
  getLocationStaff,
  getLocationInventory,
  getLocationTransfers,
  getRestockRecommendations,
} from "@/feautures/locations/locationService";

import { formatCompactNaira } from "@/utils/formatting";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function LocationDetailsPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  /*
  ========================================
  STATE
  ========================================
  */

  const [overview, setOverview] = useState(null);

  const [sales, setSales] = useState([]);
  const [staff, setStaff] = useState([]);
  const [products, setProducts] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const [loadingOverview, setLoadingOverview] = useState(true);

  const [loadingTabs, setLoadingTabs] = useState({
    sales: false,
    staff: false,
    inventory: false,
    transfers: false,
    recommendations: false,
  });

  const [activeTab, setActiveTab] = useState("sales");

  /*
  ========================================
  OVERVIEW
  ========================================
  */

  const loadOverview = useCallback(async () => {
    try {
      setLoadingOverview(true);

      const data = await getLocationOverview(id);

      setOverview(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingOverview(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadOverview();
    }
  }, [id, loadOverview]);

  /*
  ========================================
  TAB LOADING
  ========================================
  */

  const setTabLoading = (tab, value) => {
    setLoadingTabs((prev) => ({
      ...prev,
      [tab]: value,
    }));
  };

  const loadTabData = useCallback(
    async (tab) => {
      try {
        setTabLoading(tab, true);

        /*
        SALES
        */
        if (tab === "sales" && sales.length === 0) {
          const data = await getLocationSales(id);

          setSales(data || []);
        }

        /*
        STAFF
        */
        if (tab === "staff" && staff.length === 0) {
          const data = await getLocationStaff(id);

          setStaff(data || []);
        }

        /*
        INVENTORY
        */
        if (tab === "inventory" && products.length === 0) {
          const data = await getLocationInventory(id);

          setProducts(data || []);
        }

        /*
        TRANSFERS
        */
        if (tab === "transfers" && transfers.length === 0) {
          const data = await getLocationTransfers(id);

          setTransfers(data || []);
        }

        /*
        RECOMMENDATIONS
        */
        if (tab === "recommendations" && recommendations.length === 0) {
          const data = await getRestockRecommendations(id);

          setRecommendations(data || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setTabLoading(tab, false);
      }
    },
    [
      id,
      sales.length,
      staff.length,
      products.length,
      transfers.length,
      recommendations.length,
    ],
  );

  useEffect(() => {
    if (id) {
      loadTabData("sales");
    }
  }, [id]);

  /*
  ========================================
  TAB CHANGE
  ========================================
  */

  const handleTabChange = async (tab) => {
    setActiveTab(tab);

    await loadTabData(tab);
  };

  /*
  ========================================
  LOADING
  ========================================
  */

  if (loadingOverview || !overview) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />

          <p className="text-sm text-muted-foreground">
            Loading location details...
          </p>
        </div>
      </div>
    );
  }

  /*
  ========================================
  OVERVIEW DATA
  ========================================
  */

  const {
    type,
    branch_name,
    warehouse_name,
    address,

    total_staff,
    total_products,

    revenue,
    expenses,
    netProfit,

    stockVal,
    total_stock_units,

    outgoing_transfers,
    incoming_transfers,
    pending_transfers,
    low_stock_items,
  } = overview;

  const locationName = branch_name || warehouse_name;

  /*
  ========================================
  HELPERS
  ========================================
  */

  const isWarehouse = type === "warehouse";

  const isBranch = type === "branch";

  const renderLoading = (text) => (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />

        <span className="text-sm">{text}</span>
      </div>
    </div>
  );

  /*
  ========================================
  UI
  ========================================
  */

  return (
    <div className="space-y-5 p-3 md:p-5">
      {/* HEADER */}
      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Button
                size="icon"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Go back</span>
              </Button>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight capitalize">
                    {locationName}
                  </h1>
                  <Badge
                    variant={isWarehouse ? "secondary" : "default"}
                    className="capitalize"
                  >
                    {isWarehouse ? (
                      <Warehouse className="mr-1 h-3 w-3" />
                    ) : (
                      <Store className="mr-1 h-3 w-3" />
                    )}
                    {type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{address}</p>
              </div>
            </div>

            <Button variant="outline" onClick={loadOverview}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* BRANCH STATS */}
      {isBranch && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stats
            title="Revenue"
            value={formatCompactNaira(revenue)}
            icon={TrendingDown}
            color="text-green-600"
          />

          <Stats
            title="Expenses"
            value={formatCompactNaira(expenses)}
            icon={TrendingDown}
            color="text-red-600"
          />

          <Stats
            title="Net Profit"
            value={formatCompactNaira(netProfit)}
            icon={Wallet}
            color="text-blue-600"
          />

          <Stats
            title="Stock Value"
            value={formatCompactNaira(stockVal)}
            icon={Package}
            color="text-orange-600"
          />
        </div>
      )}

      {/* WAREHOUSE STATS */}
      {isWarehouse && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stats
            title="Stock Units"
            value={total_stock_units}
            icon={Boxes}
            color="text-blue-600"
          />

          <Stats
            title="Stock Value"
            value={formatCompactNaira(stockVal)}
            icon={Wallet}
            color="text-green-600"
          />

          <Stats
            title="Outgoing Transfers"
            value={outgoing_transfers}
            icon={ArrowBigRight}
            color="text-red-600"
          />

          <Stats
            title="Pending Transfers"
            value={pending_transfers}
            icon={Truck}
            color="text-orange-600"
          />
        </div>
      )}

      {/* QUICK STATS */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="rounded-2xl">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Staff</p>

              <h2 className="text-2xl font-bold">{total_staff || 0}</h2>
            </div>

            <Users className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Products</p>

              <h2 className="text-2xl font-bold">{total_products || 0}</h2>
            </div>

            <Package className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Incoming Transfers
              </p>

              <h2 className="text-2xl font-bold">{incoming_transfers || 0}</h2>
            </div>

            <ArrowBigLeft className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Low Stock Items</p>

              <h2 className="text-2xl font-bold">{low_stock_items || 0}</h2>
            </div>

            <AlertTriangle className="h-8 w-8 text-orange-500" />
          </CardContent>
        </Card>
      </div>

      {/* TABS */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-4"
      >
        <ScrollArea className="w-full whitespace-nowrap rounded-2xl border bg-card shadow-sm">
          <TabsList className="h-auto w-max min-w-full justify-start rounded-none bg-transparent p-2">
            <TabsTrigger value="sales" className="rounded-xl px-5 py-3">
              Sales
            </TabsTrigger>

            <TabsTrigger value="staff" className="rounded-xl px-5 py-3">
              Staff ({total_staff || 0})
            </TabsTrigger>

            <TabsTrigger value="inventory" className="rounded-xl px-5 py-3">
              Inventory ({total_products || 0})
            </TabsTrigger>

            <TabsTrigger value="transfers" className="rounded-xl px-5 py-3">
              Transfers
            </TabsTrigger>

            <TabsTrigger
              value="recommendations"
              className="rounded-xl px-5 py-3"
            >
              Recommendations
            </TabsTrigger>
          </TabsList>

          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* SALES */}
        <TabsContent value="sales">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>

              <CardDescription>Latest sales from this location</CardDescription>
            </CardHeader>

            <Separator />

            <CardContent className="">
              {loadingTabs.sales ? (
                renderLoading("Loading sales...")
              ) : sales.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  No sales found
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>

                      <TableHead>Amount</TableHead>

                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {sales.map((sale) => (
                      <TableRow key={sale.sale_id}>
                        <TableCell>
                          {new Date(sale.created_at).toLocaleDateString()}
                        </TableCell>

                        <TableCell className="font-medium">
                          ₦{Number(sale.amount).toLocaleString()}
                        </TableCell>

                        <TableCell>
                          <Badge>{sale.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* STAFF */}
        <TabsContent value="staff">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Staff Members</CardTitle>

              <CardDescription>
                Employees working at this location
              </CardDescription>
            </CardHeader>

            <Separator />

            <CardContent className="pt-4">
              {loadingTabs.staff ? (
                renderLoading("Loading staff...")
              ) : staff.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  No staff found
                </div>
              ) : (
                <div className="divide-y">
                  {staff.map((member) => (
                    <div
                      key={member.profile_id}
                      className="flex items-center justify-between py-4"
                    >
                      <div className="space-y-1">
                        <h3 className="font-medium">{member.name}</h3>

                        <p className="text-xs text-muted-foreground">
                          Joined{" "}
                          {new Date(member.hired_at).toLocaleDateString()}
                        </p>
                      </div>

                      <Badge>{member.role}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* INVENTORY */}
        <TabsContent value="inventory">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Inventory</CardTitle>

              <CardDescription>
                Products available in this location
              </CardDescription>
            </CardHeader>

            <Separator />

            <CardContent className="">
              {loadingTabs.inventory ? (
                renderLoading("Loading inventory...")
              ) : products.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  No products found
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>

                      <TableHead>Price</TableHead>

                      <TableHead>Stock</TableHead>

                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {products.map((product) => {
                      const lowStock =
                        product.quantity <= product.restock_level;

                      return (
                        <TableRow
                          key={product.product_id}
                          className="cursor-pointer transition-colors hover:bg-muted/50"
                          onClick={() =>
                            navigate(`/products/${product.product_id}`)
                          }
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9 rounded-lg">
                                <AvatarImage
                                  src={product.image_url}
                                  alt={product.name}
                                  className="object-cover"
                                />
                                <AvatarFallback className="rounded-lg">
                                  {product.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="max-w-[180px] truncate font-medium">
                                {product.name}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            ₦{Number(product.price).toLocaleString()}
                          </TableCell>

                          <TableCell className="text-muted-foreground">
                            {product.quantity}
                          </TableCell>

                          <TableCell>
                            <Badge
                              variant={lowStock ? "destructive" : "outline"}
                            >
                              {lowStock ? "Low Stock" : "In Stock"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TRANSFERS */}
        <TabsContent value="transfers">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Transfers</CardTitle>

              <CardDescription>Incoming and outgoing transfers</CardDescription>
            </CardHeader>

            <Separator />

            <CardContent className="">
              {loadingTabs.transfers ? (
                renderLoading("Loading transfers...")
              ) : transfers.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  No transfers found
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>

                      <TableHead>Direction</TableHead>

                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {transfers.map((transfer) => {
                      const outward =
                        String(transfer.from_location) === String(id);

                      return (
                        <TableRow key={transfer.transfer_id}>
                          <TableCell>
                            {new Date(transfer.created_at).toLocaleDateString()}
                          </TableCell>

                          <TableCell>
                            {outward ? (
                              <Badge variant="destructive">Outward</Badge>
                            ) : (
                              <Badge variant="success">Inward</Badge>
                            )}
                          </TableCell>

                          <TableCell>
                            <Badge>{transfer.status}</Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* RECOMMENDATIONS */}
        <TabsContent value="recommendations">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Restock Recommendations</CardTitle>

              <CardDescription>Suggested products to restock</CardDescription>
            </CardHeader>

            <Separator />

            <CardContent className="">
              {loadingTabs.recommendations ? (
                renderLoading("Loading recommendations...")
              ) : recommendations.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  No recommendations found
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3">
                  {recommendations.map((item) => (
                    <Card
                      key={item.product_id}
                      className="rounded-2xl border-orange-200"
                    >
                      <CardContent className="space-y-4 p-5">
                        {/* TOP */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <Avatar className="h-10 w-10 rounded-xl">
                              <AvatarImage
                                src={item.image_url}
                                alt={item.product_name}
                                className="object-cover"
                              />

                              <AvatarFallback className="rounded-xl">
                                {item.product_name
                                  ?.substring(0, 2)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>

                            <div className="min-w-0">
                              <h3 className="truncate font-semibold">
                                {item.product_name}
                              </h3>

                              <p className="text-xs text-muted-foreground">
                                Product Recommendation
                              </p>
                            </div>
                          </div>

                          <AlertTriangle className="h-5 w-5 shrink-0 text-orange-500" />
                        </div>

                        {/* STOCK INFO */}
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Current Stock
                            </span>

                            <span className="font-medium">
                              {item.current_stock}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Reorder Level
                            </span>

                            <span className="font-medium">
                              {item.reorder_level}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Recommended
                            </span>

                            <span className="font-semibold text-orange-600">
                              {item.recommended_quantity}
                            </span>
                          </div>
                        </div>

                        {/* STATUS */}
                        <Badge
                          variant={
                            item.stock_status === "out_of_stock"
                              ? "destructive"
                              : "outline"
                          }
                          className="capitalize"
                        >
                          {item.stock_status.replaceAll("_", " ")}
                        </Badge>

                        {/* ACTION */}
                        <Button
                          className="w-full rounded-xl"
                          variant="outline"
                          asChild
                        >
                          <Link to={`/products/${item.product_id}`}>
                            View Product
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
