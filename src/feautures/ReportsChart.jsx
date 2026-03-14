import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
  expense: {
    label: "Expenses",
    color: "var(--chart-2)",
  },
};

export function ReportsChart({ data }) {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Revenue vs Expenses</CardTitle>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="branch"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />

              <ChartTooltip content={<ChartTooltipContent />} />

              <ChartLegend content={<ChartLegendContent />} />

              <Bar
                dataKey="revenue"
                stackId="a"
                fill="var(--color-revenue)"
                radius={[0, 0, 4, 4]}
              />

              <Bar
                dataKey="expense"
                stackId="a"
                fill="var(--color-expense)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
