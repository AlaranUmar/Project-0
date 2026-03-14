import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// A reusable base component to keep your code DRY
const CustomSelect = ({
  value,
  onChange,
  placeholder,
  options,
  className = "w-30 md:w-45",
}) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className={className}>
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent>
      {options.map((opt) => (
        <SelectItem key={opt.value} value={opt.value}>
          {opt.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

export function DateRangeSelector({ value, onChange }) {
  const options = [
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "total", label: "Total" },
  ];

  return <CustomSelect value={value} onChange={onChange} options={options} />;
}

export function LocationSelector({ value, onChange, branches = [] }) {
  const options = [
    { value: "all", label: "All Branches" },
    ...branches.map((b) => ({
      value: b.branch_id,
      label: b.branch_name,
    })),
  ];

  return (
    <CustomSelect
      value={value}
      onChange={onChange}
      placeholder="Select Branch"
      options={options}
    />
  );
}

export function PaymentMethodSelector({ onChange }) {
  const [method, setMethod] = useState("cash");
  const options = [
    { value: "cash", label: "Cash" },
    { value: "pos", label: "POS" },
    { value: "transfer", label: "Transfer" },
  ];
  return (
    <CustomSelect
      value={method}
      onChange={(v) => {
        setMethod(v);
        onChange(v);
      }}
      options={options}
    />
  );
}
