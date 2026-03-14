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

// const data = [
//   { name: "Mon", expense: 100, revenue: 200 },
//   { name: "Tue", expense: 210, revenue: 120 },
//   { name: "Wed", expense: 150, revenue: 400 },
//   { name: "Thu", expense: 300, revenue: 450 }, // Matches your screenshot!
//   { name: "Fri", expense: 400, revenue: 600 },
// ];
// import React from "react";

function RevenueExpenseChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#eee" />
        <XAxis
          dataKey="branch"
          tick={{ fill: "#888", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#888", fontSize: 12 }}
        />
        <Legend verticalAlign="bottom" />
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#f97316"
          strokeWidth={2}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="expense"
          strokeWidth={2}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default RevenueExpenseChart;
