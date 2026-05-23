import React, { useMemo } from "react";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
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
  parseISO,
} from "date-fns";
import { formatCompactNaira } from "@/utils/formatting";

/**
 * Creates consistent map keys that align frontend calculations with backend dates
 */
const getMapKey = (view, dateInstance) => {
  const d = new Date(dateInstance.getTime());

  if (view === "today") {
    // Format safely by Hour bucket: "2026-4-23-14"
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${d.getHours()}`;
  }

  if (view === "year") {
    // Format safely by Month bucket: "2026-4"
    return `${d.getFullYear()}-${d.getMonth()}`;
  }

  // Format securely by Day bucket for Week and Month views: "2026-4-23"
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

/**
 * Safely parses database ISO timestamp strings into clean local dates without UTC shifts
 */
const parseToLocalDate = (rawString) => {
  if (!rawString) return new Date();

  // Replace trailing spacing anomalies to create a standard ISO string layout
  const normalizedString = rawString.includes(" ")
    ? rawString.replace(" ", "T")
    : rawString;

  const parsed = parseISO(normalizedString);
  return isNaN(parsed.getTime()) ? new Date(rawString) : parsed;
};

const prepareChartData = (view, rawData) => {
  const now = new Date();
  let skeleton = [];

  // 1. Build out the required chart data template arrays
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
      skeleton = eachDayOfInterval({
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      });
      break;
    case "year":
      skeleton = eachMonthOfInterval({
        start: startOfYear(now),
        end: endOfYear(now),
      });
      break;
    case "total":
    default:
      return [...rawData].sort((a, b) => {
        const dateA = parseToLocalDate(a.period || a.name);
        const dateB = parseToLocalDate(b.period || b.name);
        return dateA.getTime() - dateB.getTime();
      });
  }

  // 2. Index your records using strict string representations
  const indexed = new Map();
  rawData.forEach((d) => {
    const rawKey = d.period || d.name;
    if (!rawKey) return;

    const parsedDate = parseToLocalDate(rawKey);
    if (isNaN(parsedDate.getTime())) return;

    const stringKey = getMapKey(view, parsedDate);
    indexed.set(stringKey, d);
  });

  // 3. Match calendar entries with your data metrics
  return skeleton.map((tickDate) => {
    const stringKey = getMapKey(view, tickDate);
    const existingData = indexed.get(stringKey);

    return {
      name: tickDate.getTime(),
      revenue: Number(existingData?.total_sales || existingData?.revenue || 0),
      expense: Number(
        existingData?.total_expenses || existingData?.expense || 0,
      ),
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
        return format(date, "MMM d");
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
        <p className="font-bold mb-2 text-slate-500 border-b pb-1">
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

        <Line
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="#16a34a"
          strokeWidth={2.5}
          dot={chartData.length < 35}
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
