import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

function WarehouseAnalyticsChart({ data = [] }) {
  // Format & sort data
  const formattedData = [...data]
    .map((item) => ({
      warehouse: item.name.toUpperCase(),

      products: item.products || 0,

      lowStock: item.lowStock || 0,

      transfers: item.transfers || 0,
    }))
    .sort((a, b) => b.products - a.products);

  // Empty check
  const isEmpty = formattedData.every(
    (item) =>
      item.products === 0 && item.lowStock === 0 && item.transfers === 0,
  );

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    const data = payload[0]?.payload;

    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-100 text-xs min-w-[180px]">
        <p className="font-bold mb-2 text-slate-500">{label}</p>

        <div className="space-y-1">
          <div className="flex justify-between gap-4">
            <span className="text-blue-500 font-medium">Products:</span>

            <span className="font-bold text-slate-900">{data.products}</span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-orange-500 font-medium">Low Stock:</span>

            <span className="font-bold text-slate-900">{data.lowStock}</span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-green-500 font-medium">Transfers:</span>

            <span className="font-bold text-slate-900">{data.transfers}</span>
          </div>
        </div>
      </div>
    );
  };

  if (isEmpty) {
    return (
      <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
        No warehouse analytics available
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formattedData}
          margin={{
            top: 20,
            right: 10,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f0f0f0"
          />

          <XAxis
            dataKey="warehouse"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#94a3b8",
              fontSize: 11,
            }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#94a3b8",
              fontSize: 11,
            }}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            verticalAlign="top"
            align="right"
            iconType="rect"
            wrapperStyle={{
              paddingBottom: "20px",
              fontSize: "12px",
            }}
          />

          {/* Products */}
          <Bar
            dataKey="products"
            name="Products"
            fill="#3b82f6"
            radius={[6, 6, 0, 0]}
            barSize={24}
          >
            {formattedData.map((entry, index) => (
              <Cell
                key={`products-${index}`}
                fill={index === 0 ? "#2563eb" : "#3b82f6"}
              />
            ))}
          </Bar>

          {/* Low Stock */}
          <Bar
            dataKey="lowStock"
            name="Low Stock"
            fill="#f59e0b"
            radius={[6, 6, 0, 0]}
            barSize={24}
          />

          {/* Transfers */}
          <Bar
            dataKey="transfers"
            name="Transfers"
            fill="#10b981"
            radius={[6, 6, 0, 0]}
            barSize={24}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WarehouseAnalyticsChart;
