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
  ];

  return <CustomSelect value={value} onChange={onChange} options={options} />;
}
