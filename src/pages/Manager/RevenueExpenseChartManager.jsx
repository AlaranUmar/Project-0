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

function RevenueExpenseChartManager() {
  const data = [
    { name: "week 1", revenue: 2400, expense: 2240 },
    { name: "week 2", revenue: 1398, expense: 2000 },
    { name: "week 3", revenue: 8000, expense: 6500 },
    { name: "week 4", revenue: 3908, expense: 5000 }
  ];
  return (
    <div className="h-9/10 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
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
            cursor={{ fill: "transparent" }} // Removes the grey box on hover
            contentStyle={{ borderRadius: "8px", border: "none" }}
          />
          <Legend verticalAlign="top" align="right" iconType="circle" />

          {/* First Branch Bar */}
          <Bar
            dataKey="revenue"
            name="revenue"
            fill="#f97316"
            radius={[4, 4, 0, 0]} // Rounds only the top corners
          />
          <Bar
            dataKey="expense"
            name="expense"
            fill="#22C55E"
            radius={[4, 4, 0, 0]} // Rounds only the top corners
          />

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RevenueExpenseChartManager;
