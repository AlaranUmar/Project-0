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
import React from "react";

// Define a palette of distinct colors
const COLORS = [
  "#2563eb", // Blue
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#06b6d4", // Cyan
];

function SalesChartManager({ data = [] }) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        No sales data
      </div>
    );
  }

  const cashiers = Object.keys(data[0]).filter((k) => k !== "date");

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
        <XAxis
          dataKey="date"
          tick={{ fill: "#888", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, "auto"]} // This forces the chart to start at zero
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#888", fontSize: 12 }}
          tickFormatter={(value) => `₦${value.toLocaleString()}`}
        />

        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            border: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        />
        <Legend verticalAlign="top" align="right" iconType="circle" />

        {cashiers.map((cashier, index) => (
          <Line
            key={cashier}
            dataKey={cashier}
            // Use modulo (%) to loop through colors if there are more cashiers than colors
            stroke={COLORS[index % COLORS.length]}
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            type="monotone"
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export default SalesChartManager;
