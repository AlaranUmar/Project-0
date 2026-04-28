import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatCompactNaira } from "@/utils/formatting";

/**
 * 📊 Revenue vs Expense Chart
 */
function RevenueExpenseChart({ data = [], view }) {
  // ✅ Handle empty or undefined data safely
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        No data available
      </div>
    );
  }

  /**
   * 🧠 Format X-axis labels based on selected view
   */
  const formatXAxis = (value) => {
    try {
      const date = new Date(value);

      switch (view) {
        case "today":
          return date.toLocaleTimeString([], { hour: "2-digit" });

        case "week":
          return date.toLocaleDateString([], { weekday: "short" });

        case "month":
          return date.toLocaleDateString([], { day: "numeric" });

        case "year":
          return date.toLocaleDateString([], { month: "short" });

        default:
          return date.toLocaleDateString();
      }
    } catch {
      return value;
    }
  };

  /**
   * 💬 Custom Tooltip (cleaner UI)
   */
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;

    return (
      <div className="bg-white p-3 rounded-lg shadow-md border text-xs">
        <p className="font-semibold mb-1">{formatXAxis(label)}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex justify-between gap-4">
            <span className="text-muted-foreground">{entry.name}</span>
            <span className="font-medium">
              {formatCompactNaira(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        {/* Grid */}
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />

        {/* X Axis */}
        <XAxis
          dataKey="name"
          tick={{ fill: "#888", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={formatXAxis}
        />

        {/* Y Axis */}
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#888", fontSize: 11 }}
          tickFormatter={(value) => formatCompactNaira(value)}
        />

        {/* Tooltip */}
        <Tooltip content={<CustomTooltip />} />

        {/* Legend */}
        <Legend
          verticalAlign="top"
          align="right"
          iconType="circle"
          wrapperStyle={{ fontSize: "12px" }}
        />

        {/* Revenue Line */}
        <Line
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="#16a34a" // green (better semantic)
          strokeWidth={3}
          dot={false}
          activeDot={{ r: 6 }}
        />

        {/* Expense Line */}
        <Line
          type="monotone"
          dataKey="expense"
          name="Expense"
          stroke="#dc2626" // red (better semantic)
          strokeWidth={3}
          dot={false}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default RevenueExpenseChart;
