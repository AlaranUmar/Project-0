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
import { formatCompactNaira } from "@/utils/formatting";

function BranchSalesChart({ data = [] }) {
  // 1. Process and Sort data (Highest sales first looks better in Bar Charts)
  const formattedData = [...data]
    .map((item) => ({
      branch: item.name.toUpperCase(),
      sales: item.sales || 0,
    }))
    .sort((a, b) => b.sales - a.sales);

  // 2. Custom Tooltip to match your Revenue Chart style
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null;
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-100 text-xs">
        <p className="font-bold mb-1 text-slate-500">{label}</p>
        <div className="flex justify-between gap-4">
          <span className="text-blue-500 font-medium">Total Sales:</span>
          <span className="font-bold text-slate-900">
            {formatCompactNaira(payload[0].value)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formattedData}
          margin={{ top: 20, right: 10, left: -10, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f0f0f0"
          />

          <XAxis
            dataKey="branch"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            tickFormatter={(value) => formatCompactNaira(value)}
          />

          <Tooltip cursor={{ fill: "#f8fafc" }} content={<CustomTooltip />} />

          <Legend
            verticalAlign="top"
            align="right"
            iconType="rect"
            wrapperStyle={{ paddingBottom: "20px", fontSize: "12px" }}
          />

          <Bar
            dataKey="sales"
            name="Total Sales"
            fill="#3b82f6"
            radius={[6, 6, 0, 0]} // Smoother rounded corners
            barSize={32}
          >
            {/* Optional: Highlight the top performer with a different color shade */}
            {formattedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === 0 ? "#2563eb" : "#3b82f6"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BranchSalesChart;
