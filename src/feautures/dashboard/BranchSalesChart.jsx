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
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="branch"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#888", fontSize: 12 }}
            className="capitalize" // Capitalize branch names
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#888", fontSize: 12 }}
            tickFormatter={(value) => `₦${value.toLocaleString()}`} // Formats for currency
          />
          <Tooltip
            cursor={{ fill: "#f5f5f5" }}
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            formatter={(value) => [`₦${value.toLocaleString()}`, "Sales"]}
          />
          <Legend verticalAlign="top" align="right" iconType="circle" />
          <Bar
            dataKey="sales" // MUST MATCH THE KEY IN YOUR DATA
            name="Total Sales"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BranchSalesChart;
