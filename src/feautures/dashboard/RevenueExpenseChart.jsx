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
  Area,
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
  isSameDay,
  isSameHour,
  isSameMonth,
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

  // 🔹 Create timeline skeleton
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

    case "all":
    default:
      return [...rawData].sort((a, b) => new Date(a.name) - new Date(b.name));
  }

  // 🔹 Index raw data (O(n))
  const indexed = new Map();

  rawData.forEach((d) => {
    const date = new Date(d.name);
    let key;

    if (view === "today") key = date.setMinutes(0, 0, 0);
    else if (view === "week") key = date.setHours(0, 0, 0, 0);
    else if (view === "month") {
      key = startOfWeek(date, { weekStartsOn: 1 }).getTime();
    } else if (view === "year") {
      key = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
    }

    indexed.set(key, d);
  });

  // 🔹 Merge skeleton + data
  return skeleton.map((tickDate) => {
    let key;

    if (view === "today") key = tickDate.setMinutes(0, 0, 0);
    else if (view === "week") key = tickDate.setHours(0, 0, 0, 0);
    else if (view === "month") {
      key = startOfWeek(tickDate, { weekStartsOn: 1 }).getTime();
    } else if (view === "year") {
      key = new Date(tickDate.getFullYear(), tickDate.getMonth(), 1).getTime();
    }

    return (
      indexed.get(key) || {
        name: key, // timestamp (NO timezone bugs)
        revenue: 0,
        expense: 0,
      }
    );
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
        return `W${Math.ceil(date.getDate() / 7)}`;
      case "year":
        return format(date, "MMM");
      default:
        return format(date, "MMM d");
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-slate-100 text-xs">
        <p className="font-bold mb-2 text-slate-500">{formatXAxis(label)}</p>

        {payload.map((entry, i) => (
          <div key={i} className="flex justify-between gap-6 mb-1">
            <span style={{ color: entry.color }} className="font-medium">
              {entry.name}:
            </span>
            <span className="font-bold">{formatCompactNaira(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  };

  // 🔹 Empty state
  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400 text-sm">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={chartData}
        margin={{ top: 10, right: 10, left: 5, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#16a34a" stopOpacity={0.1} />
            <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#f0f0f0"
        />

        <XAxis
          dataKey="name"
          tickFormatter={formatXAxis}
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          minTickGap={10}
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          tickFormatter={(value) => formatCompactNaira(value)}
        />

        <Tooltip content={<CustomTooltip />} />

        <Legend
          verticalAlign="top"
          align="right"
          iconType="circle"
          wrapperStyle={{ paddingBottom: "20px", fontSize: "12px" }}
        />

        {/* 🔹 Business Hours Highlight */}
        {view === "today" && (
          <ReferenceArea
            x1={new Date().setHours(BUSINESS_START, 0, 0, 0)}
            x2={new Date().setHours(BUSINESS_END, 0, 0, 0)}
            fill="#f8fafc"
            strokeOpacity={0.3}
          />
        )}

        <Line
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="#16a34a"
          strokeWidth={3}
          dot={chartData.length < 32}
          activeDot={{ r: 6, strokeWidth: 0 }}
        />

        <Line
          type="monotone"
          dataKey="expense"
          name="Expense"
          stroke="#dc2626"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export default RevenueExpenseChart;
