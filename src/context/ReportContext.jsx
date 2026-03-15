import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getProducts } from "@/feautures/products/productService";

export function useReports(
  startDate,
  endDate,
  type = "owner",
  selectedBranch = "all",
) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSales, setTotalSales] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalInventoryValue, setTotalInventoryValue] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [products, setProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branchSalesData, setBranchSalesData] = useState([]);
  const [revenueExpenseData, setRevenueExpenseData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!startDate || !endDate) return;

    const fetchReports = async () => {
      setLoading(true);
      setError(null);

      try {
        const productData = await getProducts();
        setProducts(productData);

        const rpcName =
          type === "owner" ? "get_owner_reports" : "get_daily_financials";

        const { data: reportData, error: dbError } = await supabase.rpc(
          rpcName,
          {
            start_date: startDate,
            end_date: endDate,
          },
        );

        if (dbError) throw dbError;
        setBranches(reportData);

        const filteredData =
          selectedBranch === "all"
            ? reportData
            : reportData.filter(
                (item) =>
                  item.branch_name?.toLowerCase() ===
                  selectedBranch.toLowerCase(),
              );

        const sales = filteredData.reduce(
          (acc, b) => acc + (b.total_sales || 0),
          0,
        );

        const expenses = filteredData.reduce(
          (acc, b) => acc + (b.total_expenses || 0),
          0,
        );

        const inventory = filteredData.reduce(
          (acc, b) => acc + (b.inventory_value || 0),
          0,
        );
        const branchSalesData = filteredData
          .filter((b) => b.branch_type !== "warehouse")
          .map((b) => ({
            branch: b.branch_name,
            sales: b.total_sales || 0,
          }));
        const revenueExpenseData = filteredData.map((b) => ({
          branch: b.branch_name,
          revenue: b.total_sales || 0,
          expense: b.total_expenses || 0,
        }));
        setBranchSalesData(branchSalesData);
        setRevenueExpenseData(revenueExpenseData);
        setData(filteredData);
        setTotalSales(sales);
        setTotalInventoryValue(inventory);
        setTotalProfit(sales - expenses);
        setTotalExpense(expenses);
      } catch (err) {
        console.error(err);
        setError(err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [startDate, endDate, type, selectedBranch]);

  return {
    data,
    loading,
    error,
    totalSales,
    totalInventoryValue,
    totalProfit,
    totalExpense,
    products,
    branches,
    branchSalesData,
    revenueExpenseData,
  };
}
