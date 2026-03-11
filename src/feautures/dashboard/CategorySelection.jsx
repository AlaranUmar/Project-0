import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function CategorySelection({ onChange }) {
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
        <SelectItem value="today">Gift</SelectItem>

        <SelectItem value="week">School</SelectItem>

        <SelectItem value="month">Kitchen</SelectItem>
        <SelectItem value="day">Total</SelectItem>
      </SelectContent>
    </Select>
  );
}

export default CategorySelection;
