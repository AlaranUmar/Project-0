import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", sales: 200 },
  { name: "Tue", sales: 120 },
  { name: "Wed", sales: 400 },
  { name: "Thu", sales: 450 },
  { name: "Fri", sales: 600 },
  { name: "Sat", sales: 400 }
];
import React from "react";

function SalesChartCashier({data}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#eee" />
        <XAxis
          dataKey="name"
          tick={{ fill: "#888", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#888", fontSize: 12 }}
        />
        {/* <Legend verticalAlign="bottom" /> */}
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        />
        <Line
          type="monotone"
          dataKey="sales"
          strokeWidth={4}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default SalesChartCashier;
