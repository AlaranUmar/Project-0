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

function CashierSalesChart({ data = [] }) {
  const formattedData = [...data]
    .map((item) => ({
      cashier: item.name,
      sales: Number(item.sales || 0),
      transactions: Number(item.transactions || 0),
      items: Number(item.items || 0),
      averageSale: Number(item.averageSale || 0),
    }))
    .sort((a, b) => b.sales - a.sales);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    const cashier = payload[0].payload;

    return (
      // Uses Shadcn semantic dark mode classes (bg-popover, border-border, text-popover-foreground)
      <div className="bg-popover text-popover-foreground p-3 rounded-xl shadow-xl border border-border text-xs min-w-[220px] backdrop-blur-sm">
        <p className="font-bold mb-2 text-success text-center">{label}</p>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center gap-4">
            <span className="text-emerald-500 dark:text-emerald-400 font-medium">
              Total Sales
            </span>
            <span className="font-bold text-foreground">
              {formatCompactNaira(cashier.sales)}
            </span>
          </div>

          <div className="flex justify-between items-center gap-4">
            <span className="text-muted-foreground">Transactions</span>
            <span className="font-semibold text-foreground">
              {cashier.transactions}
            </span>
          </div>

          <div className="flex justify-between items-center gap-4">
            <span className="text-muted-foreground">Items Sold</span>
            <span className="font-semibold text-foreground">
              {cashier.items}
            </span>
          </div>

          <div className="flex justify-between items-center gap-4 border-t border-border pt-1.5 mt-1">
            <span className="text-muted-foreground">Avg Sale</span>
            <span className="font-semibold text-foreground">
              {formatCompactNaira(cashier.averageSale)}
            </span>
          </div>
        </div>
      </div>
    );
  };
  if (!formattedData.length) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
        No cashier sales data available
      </div>
    );
  }

  return (
    <div className="h-full w-full min-h-[260px] ml-3 mr-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formattedData}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient id="topCashierGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#059669" stopOpacity={1} />
              <stop offset="100%" stopColor="#047857" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="regularCashierGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#059669" stopOpacity={0.6} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f0f0f0"
          />

          <XAxis
            dataKey="cashier"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "var(--muted-foreground)",
              fontSize: 11,
              opacity: 0.8,
            }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "var(--muted-foreground)",
              fontSize: 11,
              opacity: 0.8,
            }}
            tickFormatter={(value) => formatCompactNaira(value)}
          />

          {/* Subtle cursor background styling on hover */}
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "var(--muted)", opacity: 0.15 }}
          />

          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle" // Circular indicator looks cleaner than bulky rectangles
            iconSize={8}
            wrapperStyle={{
              paddingBottom: "16px",
              fontSize: "12px",
              color: "var(--muted-foreground)",
            }}
          />

          <Bar
            dataKey="sales"
            name="Total Sales"
            radius={[4, 4, 0, 0]}
            barSize={28}
          >
            {formattedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  index === 0
                    ? "url(#topCashierGrad)"
                    : "url(#regularCashierGrad)"
                }
                className="transition-all duration-200 hover:opacity-95"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CashierSalesChart;
