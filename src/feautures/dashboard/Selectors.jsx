import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DateRangeSelector({ onChange }) {
  const [range, setRange] = useState("today");

  function handleChange(value) {
    setRange(value);
    onChange(value);
  }

  return (
    <Select value={range} onValueChange={handleChange}>
      <SelectTrigger className="w-30 md:w-45">
        <SelectValue placeholder="Select range" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="today">Today</SelectItem>

        <SelectItem value="week">This Week</SelectItem>

        <SelectItem value="month">This Month</SelectItem>
        <SelectItem value="month">Total</SelectItem>
      </SelectContent>
    </Select>
  );
}
export function StaffSelector({ onChange }) {
  const [range, setRange] = useState("today");

  function handleChange(value) {
    setRange(value);
    onChange(value);
  }

  return (
    <Select value={range} onValueChange={handleChange}>
      <SelectTrigger className="w-30 md:w-45">
        <SelectValue placeholder="Select range" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="s">sssss</SelectItem>

        <SelectItem value="q">qqqqq</SelectItem>

        <SelectItem value="month">This Month</SelectItem>
        <SelectItem value="month">Total</SelectItem>
      </SelectContent>
    </Select>
  );
}

export function LocationSelector({ onChange }) {
  const [range, setRange] = useState("today");

  function handleChange(value) {
    setRange(value);
    onChange(value);
  }

  return (
    <Select value={range} onValueChange={handleChange}>
      <SelectTrigger className="w-30 md:w-45">
        <SelectValue placeholder="Select range" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="today">All Branches</SelectItem>

        <SelectItem value="week">Kuto</SelectItem>

        <SelectItem value="month">Okejigbo</SelectItem>
        <SelectItem value="okelewo">Okelewo</SelectItem>
      </SelectContent>
    </Select>
  );
}
