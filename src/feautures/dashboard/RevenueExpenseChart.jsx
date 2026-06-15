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
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}-${d.getHours()}`;
  }

  if (view === "year") {
    return `${d.getFullYear()}-${d.getMonth() + 1}`;
  }

  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

/**
 * Safely parses database ISO timestamp strings into clean local dates without UTC shifts
 */
const parseToLocalDate = (rawString) => {
  if (!rawString) return new Date();

  // Handle backend "YYYY-MM-DD HH:mm:ss" formatting
  if (typeof rawString === "string" && rawString.includes(" ")) {
    const [datePart, timePart] = rawString.split(" ");
    const dateParts = datePart.split("-");
    const timeParts = timePart.split(":");

    if (dateParts.length === 3 && timeParts.length === 3) {
      return new Date(
        parseInt(dateParts[0], 10),
        parseInt(dateParts[1], 10) - 1,
        parseInt(dateParts[2], 10),
        parseInt(timeParts[0], 10),
        parseInt(timeParts[1], 10),
        parseInt(timeParts[2], 10),
      );
    }
  }

  if (typeof rawString === "string" && rawString.length <= 10) {
    const parts = rawString.split("-");
    if (parts.length === 3) {
      return new Date(
        parseInt(parts[0], 10),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[2], 10),
      );
    }
  }

  const normalizedString =
    typeof rawString === "string" && rawString.includes(" ")
      ? rawString.replace(" ", "T")
      : rawString;

  const parsed = parseISO(normalizedString);
  return isNaN(parsed.getTime()) ? new Date(rawString) : parsed;
};

const prepareChartData = (view, rawData) => {
  const now = new Date();
  let skeleton = [];

  // 1. Build out the required chart data template arrays dynamically based on data ranges
  switch (view) {
    case "today":
      skeleton = eachHourOfInterval({
        start: startOfToday(),
        end: endOfToday(),
      });
      break;
    case "week": {
      // Dynamic Calculation: Look back exactly 6 days from today to get a true 7-day rolling window
      const rollingStart = new Date(now.getTime());
      rollingStart.setDate(now.getDate() - 6);

      skeleton = eachDayOfInterval({
        start: rollingStart,
        end: now,
      });
      break;
    }
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
    default: {
      // For "total" views or custom ranges, extract bounds safely from the data array itself
      if (!rawData || rawData.length === 0) return [];

      const parsedDates = rawData
        .map((d) => parseToLocalDate(d.period || d.name))
        .filter((d) => !isNaN(d.getTime()))
        .sort((a, b) => a.getTime() - b.getTime());

      if (parsedDates.length === 0) return [];

      skeleton = eachDayOfInterval({
        start: parsedDates[0],
        end: parsedDates[parsedDates.length - 1],
      });
    }
  }

  // 2. Index your records AND sum them up to capture all transaction spikes
  const indexed = new Map();
  rawData.forEach((d) => {
    const rawKey = d.period || d.name;
    if (!rawKey) return;

    const parsedDate = parseToLocalDate(rawKey);
    if (isNaN(parsedDate.getTime())) return;

    const stringKey = getMapKey(view, parsedDate);

    const rev = Number(d.total_sales || d.revenue || 0);
    const exp = Number(d.total_expenses || d.expense || 0);

    if (indexed.has(stringKey)) {
      const existing = indexed.get(stringKey);
      indexed.set(stringKey, {
        revenue: existing.revenue + rev,
        expense: existing.expense + exp,
      });
    } else {
      indexed.set(stringKey, { revenue: rev, expense: exp });
    }
  });

  // 3. Match calendar entries with your data metrics
  return skeleton.map((tickDate) => {
    const stringKey = getMapKey(view, tickDate);
    const existingData = indexed.get(stringKey);

    return {
      name: tickDate.getTime(),
      revenue: existingData ? existingData.revenue : 0,
      expense: existingData ? existingData.expense : 0,
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
        return format(date, "EEE M/d"); // Updated to display "Day Month/Date" layout for better clarity
      case "month":
        return format(date, "MMM d");
      case "year":
        return format(date, "MMM");
      default:
        return format(date, "MMM d, yyyy");
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-popover text-popover-foreground p-2.5 rounded-md border border-border shadow-md text-[11px] min-w-[160px] backdrop-blur-sm bg-popover/95 transition-colors duration-200">
        <p className="font-semibold text-muted-foreground border-b border-border/60 pb-1 mb-1.5">
          {formatXAxis(label)}
        </p>

        <div className="space-y-1">
          {payload.map((entry, i) => (
            <div key={i} className="flex justify-between items-center gap-6">
              <span
                style={{ color: entry.color }}
                className="font-medium flex items-center gap-1.5"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full inline-block shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name}
              </span>
              <span className="font-bold text-foreground">
                {formatCompactNaira(entry.value)}
              </span>
            </div>
          ))}
        </div>
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
