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

function BranchSalesChart() {
  const data = [
    { name: "Mon", kuto: 4000, okejigbo: 2400, okelewo: 2240 },
    { name: "Tue", kuto: 3000, okejigbo: 1398, okelewo: 2000 },
    { name: "Wed", kuto: 2000, okejigbo: 8000, okelewo: 6500 },
    { name: "Thu", kuto: 2780, okejigbo: 3908, okelewo: 5000 },
    { name: "Fri", kuto: 1890, okejigbo: 4800, okelewo: 2400 },
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
            dataKey="kuto"
            name="kuto"
            fill="#f97316"
            radius={[4, 4, 0, 0]} // Rounds only the top corners
          />
          <Bar
            dataKey="okelewo"
            name="okelewo"
            fill="#22C55E"
            radius={[4, 4, 0, 0]} // Rounds only the top corners
          />

          {/* Second Branch Bar */}
          <Bar
            dataKey="okejigbo"
            name="okejigbo"
            fill="oklch(0.488 0.243 264.376)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BranchSalesChart;
