import React, { useMemo } from "react";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceArea,
  ComposedChart,
} from "recharts";
import {
  format,
  startOfToday,
  endOfToday,
  eachHourOfInterval,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
  eachWeekOfInterval,
} from "date-fns";
import { formatCompactNaira } from "@/utils/formatting";

const BUSINESS_START = 4;
const BUSINESS_END = 21;

/**
 * Prepare chart data with continuous timeline + O(n) lookup
 */
const prepareChartData = (view, rawData) => {
  const now = new Date();
  let skeleton = [];

  // 🔹 1. Create timeline skeleton based on view
  switch (view) {
    case "today":
      skeleton = eachHourOfInterval({
        start: startOfToday(),
        end: endOfToday(),
      });
      break;
    case "week":
      skeleton = eachDayOfInterval({
        start: startOfWeek(now, { weekStartsOn: 1 }),
        end: endOfWeek(now, { weekStartsOn: 1 }),
      });
      break;
    case "month":
      skeleton = eachWeekOfInterval({
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0),
        weekStartsOn: 1,
      });
      break;
    case "year":
      skeleton = eachMonthOfInterval({
        start: startOfYear(now),
        end: endOfYear(now),
      });
      break;
    case "total": // Aligned with OwnerDashboard
    default:
      return [...rawData].sort((a, b) => new Date(a.name) - new Date(b.name));
  }

  // 🔹 2. Index raw data (O(n)) for quick lookup
  const indexed = new Map();
  rawData.forEach((d) => {
    const date = new Date(d.name);
    let key;
    if (view === "today") key = new Date(date).setMinutes(0, 0, 0);
    else if (view === "week") key = new Date(date).setHours(0, 0, 0, 0);
    else if (view === "month")
      key = startOfWeek(date, { weekStartsOn: 1 }).getTime();
    else if (view === "year")
      key = new Date(date.getFullYear(), date.getMonth(), 1).getTime();

    indexed.set(key, d);
  });

  // 🔹 3. Merge skeleton + data
  return skeleton.map((tickDate) => {
    let key;
    if (view === "today") key = tickDate.setMinutes(0, 0, 0);
    else if (view === "week") key = tickDate.setHours(0, 0, 0, 0);
    else if (view === "month")
      key = startOfWeek(tickDate, { weekStartsOn: 1 }).getTime();
    else if (view === "year")
      key = new Date(tickDate.getFullYear(), tickDate.getMonth(), 1).getTime();

    const existingData = indexed.get(key);
    return {
      name: key,
      revenue: Number(existingData?.revenue || 0),
      expense: Number(existingData?.expense || 0),
    };
  });
};

function RevenueExpenseChart({ data = [], view }) {
  const chartData = useMemo(() => prepareChartData(view, data), [data, view]);

  const formatXAxis = (value) => {
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;

    switch (view) {
      case "today":
        return format(date, "ha");
      case "week":
        return format(date, "EEE");
      case "month":
        return `Week ${Math.ceil(date.getDate() / 7)}`;
      case "year":
        return format(date, "MMM");
      default:
        return format(date, "MMM d");
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white p-3 rounded-lg shadow-xl border border-slate-100 text-[11px]">
        <p className="font-bold mb-2 text-slate-500 border-bottom pb-1">
          {formatXAxis(label)}
        </p>
        {payload.map((entry, i) => (
          <div key={i} className="flex justify-between gap-8 mb-1">
            <span style={{ color: entry.color }} className="font-medium">
              {entry.name}:
            </span>
            <span className="font-bold">{formatCompactNaira(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  };

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400 text-sm italic">
        No records found for this timeline
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={chartData}
        margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#f1f5f9"
        />
        <XAxis
          dataKey="name"
          tickFormatter={formatXAxis}
          tick={{ fill: "#64748b", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          minTickGap={15}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#64748b", fontSize: 10 }}
          tickFormatter={(val) => formatCompactNaira(val)}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: "#cbd5e1", strokeWidth: 1 }}
        />
        <Legend
          verticalAlign="top"
          align="right"
          iconType="circle"
          wrapperStyle={{
            paddingBottom: "15px",
            fontSize: "11px",
            fontWeight: 500,
          }}
        />

        {view === "today" && (
          <ReferenceArea
            x1={new Date().setHours(BUSINESS_START, 0, 0, 0)}
            x2={new Date().setHours(BUSINESS_END, 0, 0, 0)}
            fill="#f8fafc"
            fillOpacity={0.5}
          />
        )}

        <Line
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="#16a34a"
          strokeWidth={2.5}
          dot={chartData.length < 15}
          activeDot={{ r: 5, strokeWidth: 0 }}
        />
        <Line
          type="monotone"
          dataKey="expense"
          name="Expense"
          stroke="#dc2626"
          strokeWidth={2}
          strokeDasharray="4 4"
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export default RevenueExpenseChart;
