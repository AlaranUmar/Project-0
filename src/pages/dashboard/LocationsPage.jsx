import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BranchSalesChart from "@/feautures/dashboard/BranchSalesChart";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getLocationsDashboardSummary } from "@/feautures/locations/locationService";

import { toast } from "sonner";
import { formatCompactNaira } from "@/utils/formatting";

import Stats from "@/components/ui/Stats";

import { Box, Users, Building2, Warehouse } from "lucide-react";
import WarehouseAnalyticsChart from "@/feautures/dashboard/WarehouseAnalyticsChart";

function LocationsPage() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function fetchLocations() {
      try {
        const data = await getLocationsDashboardSummary();

        if (isMounted) {
          setLocations(data);
        }
      } catch (err) {
        toast.error(err.message || "Failed to fetch locations");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchLocations();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredLocations = useMemo(() => {
    return locations.filter((location) => {
      const matchesSearch =
        !query ||
        location.name?.toLowerCase()?.includes(query.toLowerCase()) ||
        location.address?.toLowerCase()?.includes(query.toLowerCase()) ||
        location.type?.toLowerCase()?.includes(query.toLowerCase());

      const matchesType = typeFilter === "all" || location.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [query, locations, typeFilter]);

  const totalLocations = locations.length;
  console.log(locations);
  const totalInventoryValue = useMemo(
    () =>
      locations.reduce((sum, loc) => sum + Number(loc.inventory_value || 0), 0),
    [locations],
  );

  const totalStaff = useMemo(
    () => locations.reduce((sum, loc) => sum + Number(loc.total_staff || 0), 0),
    [locations],
  );

  const locationsLowStock = useMemo(
    () => locations.filter((loc) => Number(loc.low_stock_count) > 0).length,
    [locations],
  );

  // Branch Revenue Chart
  const salesChartData = useMemo(
    () =>
      locations
        .filter((loc) => loc.type !== "warehouse")
        .map((loc) => ({
          name: loc.name,
          sales: Number(loc.total_revenue || 0),
        })),
    [locations],
  );

  const isChartEmpty = salesChartData.every((item) => item.sales === 0);

  // Warehouse Inventory Chart
  const warehouseChartData = useMemo(
    () =>
      locations
        .filter((loc) => loc.type === "warehouse")
        .map((loc) => ({
          name: loc.name,

          inventory: Number(loc.inventory_value || 0),

          products: Number(loc.total_products || 0),

          lowStock: Number(loc.low_stock_count || 0),

          transfers:
            Number(loc.pending_transfers || 0) +
            Number(loc.completed_transfers || 0),
        })),
    [locations],
  );

  const isWarehouseChartEmpty = warehouseChartData.every(
    (item) =>
      item.products === 0 && item.lowStock === 0 && item.transfers === 0,
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="md:p-3">
      <div className="flex flex-col gap-3">
        {/* Stats */}
        <div className="grid gap-2 md:gap-5 grid-cols-2 md:grid-cols-4">
          <Stats
            title="Total Locations"
            value={totalLocations}
            icon={Building2}
          />

          <Stats
            title="Low Stock Locations"
            value={locationsLowStock}
            icon={Box}
          />

          <Stats title="Total Staff" value={totalStaff} icon={Users} />

          <Stats
            title="Inventory Value"
            value={formatCompactNaira(totalInventoryValue)}
            icon={Box}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Branch Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle className={"flex gap-3 items-center"}>
                <Building2 size={18} className="inline mr-1" />
                Branch Revenue
              </CardTitle>
            </CardHeader>

            <CardContent className="px-0 pr-8">
              <div className="w-full h-64 flex items-center justify-center">
                {isChartEmpty ? (
                  <span className="text-sm text-muted-foreground pb-6 pl-8">
                    No revenue data recorded across branches
                  </span>
                ) : (
                  <BranchSalesChart data={salesChartData} />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Warehouse Inventory Chart */}
          <Card>
            <CardHeader>
              <CardTitle className={"flex gap-3 items-center"}>
                <Warehouse size={18} className="inline mr-1" />
                Warehouse Inventory
              </CardTitle>
            </CardHeader>

            <CardContent className="px-0 pr-8">
              <div className="w-full h-64 flex items-center justify-center">
                {isWarehouseChartEmpty ? (
                  <span className="text-sm text-muted-foreground pb-6 pl-8">
                    No inventory data recorded across warehouses
                  </span>
                ) : (
                  <WarehouseAnalyticsChart data={warehouseChartData} />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Locations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col md:flex-row justify-between md:items-center gap-3">
              <span className="text-lg">Locations</span>

              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <Input
                  placeholder="Search locations..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full sm:w-72"
                />

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-44">
                    <SelectValue placeholder="Filter type" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>

                    <SelectItem value="branch">Branches</SelectItem>

                    <SelectItem value="warehouse">Warehouses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent>
            {filteredLocations.length === 0 ? (
              <div className="text-sm text-muted-foreground py-4 text-center">
                No locations found
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-2">
                {filteredLocations.map((location) => (
                  <LocationCard key={location.id} location={location} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LocationCard({ location }) {
  const navigate = useNavigate();

  const isWarehouse = location.type === "warehouse";

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-start gap-2">
          <div className="flex flex-col truncate">
            <span className="capitalize truncate font-bold text-base">
              {location.name}
            </span>

            <span className="text-xs capitalize text-muted-foreground flex items-center gap-1 mt-1">
              {isWarehouse ? <Warehouse size={13} /> : <Building2 size={13} />}

              {location.type}
            </span>
          </div>

          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs shrink-0"
            onClick={() => navigate(`/locations/${location.id}`)}
          >
            View Details
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 pt-0 grid grid-cols-1 gap-1">
        <InfoRow label="Address" value={location.address} />

        <InfoRow label="Manager" value={location.manager_name || "N/A"} />

        <InfoRow label="Staff" value={location.total_staff} />

        <InfoRow
          label="Inventory"
          value={formatCompactNaira(Number(location.inventory_value || 0))}
        />
      </CardContent>
    </Card>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between gap-3 text-sm">
      <span className="text-muted-foreground shrink-0">{label}:</span>

      <span
        className="font-medium truncate max-w-[160px]"
        title={String(value)}
      >
        {value}
      </span>
    </div>
  );
}

export default LocationsPage;
