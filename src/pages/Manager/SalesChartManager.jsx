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

// the data should progress upward and it should be 3 cashier
const data = [
    { name: "Mon", tope: 34, moyo: 15, luthor: 20 },
    { name: "Tue", tope: 13, moyo: 42, luthor: 35 },
    { name: "Wed", tope: 45, moyo: 24, luthor: 30 },
    { name: "Thu", tope: 35, moyo: 23, luthor: 25 },
    { name: "Fri", tope: 39, moyo: 56, luthor: 40 },
    { name: "Sat", tope: 45, moyo: 42, luthor: 50 },
    { name: "Sun", tope: 50, moyo: 42, luthor: 54 },
] 
// const data = [
//   { name: "Mon", tope: 34, moyo:  15 , luthor},
//   { name: "Tue", tope: 13 , moyo:  42 },
//   { name: "Wed", tope: 45 , moyo:  24 },
//   { name: "Thu", tope: 35 , moyo:  23 },
//   { name: "Fri", tope: 39 , moyo:  56 },
//   { name: "Sat", tope: 45 , moyo:  42 },
// ];
import React from "react";

function SalesChartManager() {
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
        {/* add colors to each primary success and destructive*/}

        <Line
          type="monotone"
          dataKey="tope"
          stroke="oklch(0.488 0.243 264.376)"
          strokeWidth={3}
          activeDot={{ r: 6 }}
              />
              <Legend verticalAlign="top" align="right" iconType="circle" />
        <Line
          type="monotone"
          stroke="#22C55E"
          dataKey="moyo"
          strokeWidth={3}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          stroke="#FFBF00"
          dataKey="luthor"
          strokeWidth={3}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default SalesChartManager;
