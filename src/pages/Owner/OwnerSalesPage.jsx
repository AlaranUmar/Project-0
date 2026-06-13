import React, { useEffect, useMemo, useState } from "react";

import { getSales } from "@/feautures/sales/Sales";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import Stats from "@/components/ui/Stats";

import { Button } from "@/components/ui/button";
import {
  Banknote,
  CreditCard,
  Send,
  Wallet,
  TrendingUp,
  Store,
  ShoppingCart,
  Download,
} from "lucide-react";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import * as XLSX from "xlsx";
import Initials from "@/components/Initials";
import SaleDetailsDrawer from "./SaleDetailsDrawer";

export default function OwnerSalesPage() {
  const [sales, setSales] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [paymentFilter, setPaymentFilter] = useState("all");

  const [branchFilter, setBranchFilter] = useState("all");

  const [statusFilter, setStatusFilter] = useState("all");

  const [transactionFilter, setTransactionFilter] = useState("all");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const [sortBy, setSortBy] = useState("created_at");

  const [sortOrder, setSortOrder] = useState("desc");

  const [currentPage, setCurrentPage] = useState(1);

  const [selectedSale, setSelectedSale] = useState(null);

  const ITEMS_PER_PAGE = 15;

  useEffect(() => {
    fetchSales();
  }, []);

  async function fetchSales() {
    try {
      setLoading(true);

      const data = await getSales();

      setSales(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);

      setSales([]);
    } finally {
      setLoading(false);
    }
  }

  /*
   -------------------------------------
   UNIQUE FILTER VALUES
   -------------------------------------
  */

  const branches = useMemo(() => {
    return [
      ...new Set(
        sales
          .map((sale) => sale.location_name || sale.branch_name)
          .filter(Boolean),
      ),
    ];
  }, [sales]);

  const paymentMethods = useMemo(() => {
    return [
      ...new Set(sales.map((sale) => sale.payment_methods).filter(Boolean)),
    ];
  }, [sales]);

  /*
   -------------------------------------
   FILTERED SALES
   -------------------------------------
  */

  const filteredSales = useMemo(() => {
    const term = search.trim().toLowerCase();

    return sales.filter((sale) => {
      const saleId = sale.sale_id?.toLowerCase() || "";

      const cashier = sale.cashier_name?.toLowerCase() || "";

      const branch =
        (sale.location_name || sale.branch_name)?.toLowerCase() || "";

      const searchMatch =
        !term ||
        saleId.includes(term) ||
        cashier.includes(term) ||
        branch.includes(term);

      const paymentMatch =
        paymentFilter === "all" || sale.payment_methods === paymentFilter;

      const branchMatch =
        branchFilter === "all" ||
        (sale.location_name || sale.branch_name) === branchFilter;

      const statusMatch =
        statusFilter === "all" || sale.status === statusFilter;

      const transactionMatch =
        transactionFilter === "all" ||
        sale.transaction_type === transactionFilter;

      const saleDate = new Date(sale.created_at);

      const startMatch = !startDate || saleDate >= new Date(startDate);

      const endMatch = !endDate || saleDate <= new Date(endDate);

      return (
        searchMatch &&
        paymentMatch &&
        branchMatch &&
        statusMatch &&
        transactionMatch &&
        startMatch &&
        endMatch
      );
    });
  }, [
    sales,
    search,
    paymentFilter,
    branchFilter,
    statusFilter,
    transactionFilter,
    startDate,
    endDate,
  ]);

  /*
   -------------------------------------
   SORTING
   -------------------------------------
  */

  const sortedSales = useMemo(() => {
    const sorted = [...filteredSales];

    sorted.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === "amount") {
        aVal = Number(aVal);
        bVal = Number(bVal);
      }

      if (sortBy === "created_at") {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      }

      return aVal < bVal ? 1 : -1;
    });

    return sorted;
  }, [filteredSales, sortBy, sortOrder]);

  /*
   -------------------------------------
   PAGINATION
   -------------------------------------
  */

  const totalPages = Math.max(
    1,
    Math.ceil(sortedSales.length / ITEMS_PER_PAGE),
  );

  const paginatedSales = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;

    return sortedSales.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedSales, currentPage]);

  /*
   -------------------------------------
   KPI STATS
   -------------------------------------
  */

  const totalRevenue = useMemo(
    () => sales.reduce((sum, sale) => sum + Number(sale.amount || 0), 0),
    [sales],
  );

  const totalSales = sales.length;

  const averageSale = totalSales > 0 ? totalRevenue / totalSales : 0;

  const totalCashRevenue = useMemo(
    () =>
      sales.reduce(
        (sum, sale) =>
          sum +
          (sale.payment_methods.includes("cash") ? Number(sale.amount) : 0),
        0,
      ),
    [sales],
  );

  const totalTransferRevenue = useMemo(
    () =>
      sales.reduce(
        (sum, sale) =>
          sum +
          (sale.payment_methods.includes("transfer") ||
          sale.payment_methods === "transfer"
            ? Number(sale.amount)
            : 0),
        0,
      ),
    [sales],
  );

  const totalPOSRevenue = useMemo(
    () =>
      sales.reduce(
        (sum, sale) =>
          sum +
          (sale.payment_methods.includes("pos") ||
          sale.payment_methods === "pos"
            ? Number(sale.amount)
            : 0),
        0,
      ),
    [sales],
  );

  const highestSale = useMemo(() => {
    if (!sales.length) return 0;

    return Math.max(...sales.map((sale) => Number(sale.amount || 0)));
  }, [sales]);

  const topCashier = useMemo(() => {
    const totals = {};

    sales.forEach((sale) => {
      const cashier = sale.cashier_name || "Unknown";

      totals[cashier] = (totals[cashier] || 0) + Number(sale.amount || 0);
    });

    return Object.entries(totals).sort((a, b) => b[1] - a[1])[0];
  }, [sales]);

  const topBranch = useMemo(() => {
    const totals = {};

    sales.forEach((sale) => {
      const branch = sale.location_name || sale.branch_name || "Unknown";

      totals[branch] = (totals[branch] || 0) + Number(sale.amount || 0);
    });

    return Object.entries(totals).sort((a, b) => b[1] - a[1])[0];
  }, [sales]);
  /*
   -------------------------------------
   EXPORT EXCEL
   -------------------------------------
  */

  function exportSales() {
    const exportData = sortedSales.map((sale) => ({
      Sale_ID: sale.sale_id,
      Date: sale.created_at,
      Branch: sale.location_name || sale.branch_name,
      Cashier: sale.cashier_name,
      Amount: sale.amount,
      Payment_Method: sale.payment_methods,
      Status: sale.status,
      Transaction_Type: sale.transaction_type,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales");

    XLSX.writeFile(workbook, `sales-report-${Date.now()}.xlsx`);
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse text-sm text-muted-foreground">
          Loading sales...
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-4 space-y-4">
      {/* KPI CARDS */}

      <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
        <Stats
          title="Total Revenue"
          value={`₦${totalRevenue.toLocaleString()}`}
          icon={TrendingUp}
        />

        <Stats title="Total Sales" value={totalSales} icon={ShoppingCart} />

        <Stats
          title="Average Sale"
          value={`₦${averageSale.toLocaleString()}`}
          icon={Wallet}
        />

        <Stats
          title="Highest Sale"
          value={`₦${highestSale.toLocaleString()}`}
          icon={TrendingUp}
        />

        <Stats
          title="Cash Revenue"
          value={`₦${totalCashRevenue.toLocaleString()}`}
          icon={Banknote}
        />

        <Stats
          title="Transfer Revenue"
          value={`₦${totalTransferRevenue.toLocaleString()}`}
          icon={Send}
        />

        <Stats
          title="POS Revenue"
          value={`₦${totalPOSRevenue.toLocaleString()}`}
          icon={CreditCard}
        />

        <Stats
          title="Top Branch"
          value={topBranch?.[0] || "N/A"}
          icon={Store}
        />
      </div>

      {/* TOP CASHIER */}

      <Card className="md:w-md">
        <CardContent>
          <div className="flex items-center gap-3">
            <Initials name={topCashier?.[0]} />

            <div>
              <p className="text-sm text-muted-foreground">Top Cashier</p>

              <p className="font-semibold">{topCashier?.[0] || "N/A"}</p>

              <p className="text-xs text-muted-foreground">
                ₦{Number(topCashier?.[1] || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SALES TABLE */}

      <Card>
        <CardHeader className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <CardTitle>Sales Management</CardTitle>

            <Button onClick={exportSales} className="gap-2">
              <Download className="h-4 w-4" />
              Export Excel
            </Button>
          </div>

          {/* SEARCH */}

          <Input
            placeholder="Search by ID, cashier or branch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* FILTERS */}

          <div className="flex gap-3 flex-wrap">
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Payment" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>

                {paymentMethods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Branch" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>

                {branches.map((branch) => (
                  <SelectItem key={branch} value={branch}>
                    {branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>

                <SelectItem value="completed">Completed</SelectItem>

                <SelectItem value="pending">Pending</SelectItem>

                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={transactionFilter}
              onValueChange={setTransactionFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Transaction" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>

                <SelectItem value="walk_in">Walk In</SelectItem>

                <SelectItem value="online">Online</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                Sort By:
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="created_at">Date</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
                <SelectItem value="cashier_name">Cashier</SelectItem>
                <SelectItem value="location_name">Branch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* DATE FILTERS */}

          <div className="flex gap-3 ">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-accent">
                <TableHead>Sale ID</TableHead>

                <TableHead>Date</TableHead>

                <TableHead>Branch</TableHead>

                <TableHead>Cashier</TableHead>

                <TableHead>Payment</TableHead>

                <TableHead>Amount</TableHead>

                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedSales.map((sale) => (
                <SalesRow
                  key={sale.sale_id}
                  sale={sale}
                  onClick={() => setSelectedSale(sale)}
                />
              ))}
            </TableBody>
          </Table>
          {/* EMPTY STATE */}

          {paginatedSales.length === 0 && (
            <div className="py-10 text-center text-muted-foreground">
              No sales found.
            </div>
          )}

          {/* PAGINATION */}

          <div className="flex flex-col md:flex-row justify-between items-center gap-3 mt-6">
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              {Math.min(
                (currentPage - 1) * ITEMS_PER_PAGE + 1,
                sortedSales.length,
              )}{" "}
              - {Math.min(currentPage * ITEMS_PER_PAGE, sortedSales.length)} of{" "}
              {sortedSales.length}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </Button>

              <Button variant="outline" disabled>
                {currentPage} / {totalPages}
              </Button>

              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SALE DETAILS MODAL */}

      {selectedSale && (
        <SaleDetailsDrawer
          saleId={selectedSale.sale_id}
          onClose={() => setSelectedSale(null)}
        />
      )}
    </div>
  );
}

/* ==========================================
   SALES ROW
========================================== */

function SalesRow({ sale, onClick }) {
  return (
    <TableRow onClick={onClick} className="cursor-pointer hover:bg-muted/50">
      <TableCell className="font-mono">{sale.sale_id?.slice(0, 8)}</TableCell>

      <TableCell>{new Date(sale.created_at).toLocaleString()}</TableCell>

      <TableCell>{sale.location_name || sale.branch_name}</TableCell>

      <TableCell>{sale.cashier_name}</TableCell>

      <TableCell className="capitalize">{sale.payment_methods}</TableCell>

      <TableCell className="font-semibold">
        ₦{Number(sale.amount || 0).toLocaleString()}
      </TableCell>

      <TableCell>
        <span
          className={`px-2 py-1 rounded text-xs capitalize
          ${sale.status === "completed" ? "bg-green-100 text-green-700" : ""}
          ${sale.status === "pending" ? "bg-yellow-100 text-yellow-700" : ""}
          ${sale.status === "cancelled" ? "bg-red-100 text-red-700" : ""}`}
        >
          {sale.status}
        </span>
      </TableCell>
    </TableRow>
  );
}

/* ==========================================
   DETAIL ROW
========================================== */

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between items-center border-b pb-2">
      <span className="text-muted-foreground text-sm">{label}</span>

      <span className="font-medium text-sm">{value}</span>
    </div>
  );
}
