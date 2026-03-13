import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function BranchSalesChart({ data }) {
  return (
    <div className="h-9/10 w-full">
      {" "}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date" // This matches 'b.branch_name' from your map
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#888", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#888", fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: "#f5f5f5" }}
            contentStyle={{ borderRadius: "8px", border: "none" }}
          />
          <Legend verticalAlign="top" align="right" iconType="circle" />

          <Bar
            dataKey="sales"
            name="Total Sales"
            fill="#3b82f6" // or use your CSS variable
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BranchSalesChart;
