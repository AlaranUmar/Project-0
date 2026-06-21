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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Plus,
  Package,
  AlertTriangle,
  XCircle,
  Boxes,
  Wallet,
} from "lucide-react";
import { getSales } from "@/feautures/sales/Sales";
import { Link } from "react-router-dom";
import Stats from "@/components/ui/Stats";
import { formatCompactNaira } from "@/utils/formatting";

const ITEMS_PER_PAGE = 10;

function ManagerProductsPage() {
  const [products, setProducts] = useState([]);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function loadProducts() {
      const rawData = await getProducts();

      const flattenedData = (rawData || []).flatMap((prod) => {
        const tagsArray =
          prod.products_tags?.map((t) => t.tags?.name).filter(Boolean) || [];

        const categoryName = prod.categories?.name || "Uncategorized";

        if (!prod.inventory || prod.inventory.length === 0) {
          return [
            {
              product_id: prod.id,
              product_name: prod.name,
              image_url: prod.image_url,
              price: prod.price || 0,
              reorder_level: prod.reorder_level || 0,
              category_name: categoryName,
              tags: tagsArray,
              stock_quantity: 0,
            },
          ];
        }
        return prod.inventory.map((inv) => ({
          product_id: prod.id,
          product_name: prod.name,
          image_url: prod.image_url, // add this
          price: prod.price || 0,
          reorder_level: prod.reorder_level || 0,
          category_name: categoryName,
          tags: tagsArray,
          stock_quantity: inv.quantity || 0,
        }));
      });

      setProducts(flattenedData);
    }

    async function loadSales() {
      const data = await getSales();
      setSales(data || []);
    }

    loadProducts();
    loadSales();
  }, []);

  const totalProducts = useMemo(
    () => new Set(products.map((p) => p.product_id)).size,
    [products],
  );

  const lowStock = useMemo(
    () =>
      products.filter(
        (p) => p.stock_quantity <= p.reorder_level && p.stock_quantity > 0,
      ).length,
    [products],
  );

  const outOfStock = useMemo(
    () =>
      products.filter(
        (p) => p.stock_quantity === 0 || p.stock_quantity === null,
      ).length,
    [products],
  );

  const totalUnits = useMemo(
    () => products.reduce((sum, p) => sum + (p.stock_quantity || 0), 0),
    [products],
  );

  const inventoryValue = useMemo(
    () =>
      products.reduce(
        (sum, p) => sum + (p.price || 0) * (p.stock_quantity || 0),
        0,
      ),
    [products],
  );

  const categories = [
    ...new Set(products.map((p) => p.category_name).filter(Boolean)),
  ];

  const filteredProducts = useMemo(() => {
    let data = [...products];

    if (query) {
      const q = query.toLowerCase();

      data = data.filter(
        (p) =>
          p.product_name?.toLowerCase().includes(q) ||
          p.category_name?.toLowerCase().includes(q) ||
          p.tags?.join(" ")?.toLowerCase().includes(q),
      );
    }

    if (categoryFilter !== "all") {
      data = data.filter((p) => p.category_name === categoryFilter);
    }

    if (statusFilter !== "all") {
      data = data.filter((p) => {
        if (statusFilter === "instock")
          return p.stock_quantity > p.reorder_level;

        if (statusFilter === "low")
          return p.stock_quantity > 0 && p.stock_quantity <= p.reorder_level;

        if (statusFilter === "out") return p.stock_quantity <= 0;

        return true;
      });
    }

    return data.sort((a, b) => {
      const getPriority = (product) => {
        if (product.stock_quantity <= 0) return 0;

        if (product.stock_quantity <= product.reorder_level) return 1;

        return 2;
      };

      return getPriority(a) - getPriority(b);
    });
  }, [products, query, statusFilter, categoryFilter]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const toggleProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    const pageIds = paginatedProducts.map((p) => `${p.product_id}`);

    const allSelected = pageIds.every((id) => selectedProducts.includes(id));

    if (allSelected) {
      setSelectedProducts((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedProducts((prev) => [...new Set([...prev, ...pageIds])]);
    }
  };

  return (
    <div className="p-3 space-y-3">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <Stats title="Products" value={totalProducts} icon={Package} />

        <Stats title="Units" value={totalUnits} icon={Boxes} />

        <Stats title="Low Stock" value={lowStock} icon={AlertTriangle} />

        <Stats title="Out Of Stock" value={outOfStock} icon={XCircle} />

        <Stats
          title="Inventory Value"
          value={formatCompactNaira(inventoryValue)}
          icon={Wallet}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-3">
            <CardTitle>Products</CardTitle>

            <Link to="/products-sale">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Sale
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-4 gap-2 mt-3">
            <Input
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>

                <SelectItem value="instock">In Stock</SelectItem>

                <SelectItem value="low">Low Stock</SelectItem>

                <SelectItem value="out">Out Of Stock</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>

                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProducts.length > 0 && (
            <div className="flex gap-2 mt-3">
              <Badge>{selectedProducts.length} selected</Badge>

              <Button variant="outline" size="sm">
                Transfer
              </Button>

              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
          )}
        </CardHeader>

        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead className="w-10">
                    <Input
                      type="checkbox"
                      className="size-4"
                      onChange={toggleAll}
                    />
                  </TableHead>

                  <TableHead>Product</TableHead>

                  <TableHead>Category</TableHead>

                  <TableHead className="text-right">Price</TableHead>

                  <TableHead className="text-center">Stock</TableHead>

                  <TableHead>Status</TableHead>

                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedProducts.map((product) => {
                  const rowId = `${product.product_id}`;

                  return (
                    <TableRow key={rowId}>
                      <TableCell>
                        <Input
                          type="checkbox"
                          checked={selectedProducts.includes(rowId)}
                          onChange={() => toggleProduct(rowId)}
                          className="size-4"
                        />
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image_url}
                            alt={product.product_name}
                            className="w-12 h-12 rounded-lg border object-cover"
                          />

                          <div>
                            <p
                              className="font-medium truncate max-w-xs"
                              title={product.product_name}
                            >
                              {product.product_name}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              {product.tags?.slice(0, 2).join(", ") ||
                                "No Tags"}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>{product.category_name}</TableCell>

                      <TableCell className="text-right font-medium">
                        ₦{product.price?.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        {product.stock_quantity}
                      </TableCell>

                      <TableCell>
                        {product.stock_quantity > product.reorder_level ? (
                          <Badge className="bg-green-600 text-white">
                            In Stock
                          </Badge>
                        ) : product.stock_quantity > 0 ? (
                          <Badge className="bg-yellow-500 text-white">
                            Low Stock
                          </Badge>
                        ) : (
                          <Badge variant="destructive">Out Of Stock</Badge>
                        )}
                      </TableCell>

                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            View
                          </Button>

                          <Button size="sm">Sell</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {paginatedProducts.length} of {filteredProducts.length}{" "}
              products
            </p>

            <div className="flex gap-2">
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
        </CardContent>
      </Card>
    </div>
  );
}

export default ManagerProductsPage;
