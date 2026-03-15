import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, TrendingDown, Wallet } from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBranchDetails } from "@/feautures/branches/branchService";
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
export default function WarehouseDetailsPage() {
  const [branchData, setBranchData] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    async function loadBranchData() {
      const data = await getBranchDetails(id);
      setBranchData(data);
    }

    if (id) loadBranchData();
  }, [id]);

  if (!branchData)
    return (
      <div className="p-10 text-center text-muted-foreground">
        Loading Warehouse details...
      </div>
    );

  const {
    staff,
    transfers,
    products,
    branch_name,
    address,
    total_staff,
    total_products,
    expenses,
    netProfit,
    stockVal,
  } = branchData;

  return (
    <div className="space-y-8 p-2">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight capitalize">
          {branch_name}
        </h1>
        <p className="text-muted-foreground text-sm">{address}</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Expenses"
          value={expenses}
          icon={<TrendingDown size={18} />}
          color="text-red-600"
        />
        <StatCard
          title="Transfers"
          value={transfers.length}
          icon={<Package size={18} />}
          color="text-blue-600"
        />
        <StatCard
          title="Stock Valuation"
          value={stockVal}
          icon={<Package size={18} />}
          color="text-orange-600"
        />
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="staff" className="space-y-2">
        <TabsList className="inline-flex .scrollbar-hide w-full h-auto py-5 px-3 md:p-2 overflow-x-auto overflow-y-hidden justify-start bg-muted/50 scrollbar-hide">
          <TabsTrigger value="staff" className="px-4 py-3 whitespace-nowrap">
            Staff ({total_staff})
          </TabsTrigger>

          <TabsTrigger
            value="inventory"
            className="px-4 py-3 whitespace-nowrap"
          >
            Products ({total_products})
          </TabsTrigger>

          <TabsTrigger value="expenses" className="px-4 py-3 whitespace-nowrap">
            Expenses
          </TabsTrigger>
          <TabsTrigger
            value="transfers"
            className="px-4 py-3 whitespace-nowrap"
          >
            Transfers
          </TabsTrigger>
        </TabsList>

        {/* STAFF */}
        <TabsContent value="staff">
          <Card className={"gap-3"}>
            <CardHeader>
              <CardTitle>Staff Members</CardTitle>
            </CardHeader>

            <Separator />

            <CardContent className="pt-0">
              <ul className="divide-y">
                {staff?.map((staff) => (
                  <li
                    key={staff.profile_id}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{staff.name}</span>

                      <span className="text-xs text-muted-foreground">
                        Joined {new Date(staff.hired_at).toLocaleDateString()}
                      </span>
                    </div>

                    <Badge
                      variant={
                        staff.role === "manager" ? "default" : "secondary"
                      }
                    >
                      {staff.role}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* INVENTORY */}
        <TabsContent value="inventory">
          <Card className={"gap-3"}>
            <CardContent className="pt-0">
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
                  {products?.map((product) => (
                    <TableRow key={product.product_id}>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>

                      <TableCell>${product.price.toLocaleString()}</TableCell>

                      <TableCell>{product.quantity}</TableCell>

                      <TableCell>
                        {product.quantity < product.restock_level ? (
                          <Badge variant="warning">Low Stock</Badge>
                        ) : (
                          <Badge variant="success">In Stock</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfers">
          <Card className={"gap-3"}>
            <CardHeader>
              <CardTitle>Branch Transfers</CardTitle>
            </CardHeader>

            <Separator />
            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Direction</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {console.log(branchData)}
                  {transfers?.map((transfer) => (
                    <TableRow key={transfer.transfer_id}>
                      <TableCell>
                        {new Date(transfer.created_at).toLocaleDateString()}
                      </TableCell>
                      {/* <TableCell>
            {transfer.}
          </TableCell> */}

                      <TableCell>
                        {transfer.from_location === id ? (
                          <Badge variant="destructive">Outgoing</Badge>
                        ) : transfer.to_location === id ? (
                          <Badge variant="success">Incoming</Badge>
                        ) : (
                          <Badge variant="warning">Not for this branch</Badge>
                        )}
                      </TableCell>

                      <TableCell className="capitalize">
                        {transfer.status}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card className={"gap-3"}>
            <CardHeader>
              <CardTitle>Branch Expenses</CardTitle>
            </CardHeader>

            <Separator />

            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">
                Expense records go here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <Card className="">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>

        <div className={`${color}`}>{icon}</div>
      </CardHeader>

      <CardContent>
        <div className="text-2xl font-bold">
          ${Number(value ?? 0).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}
