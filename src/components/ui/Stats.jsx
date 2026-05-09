import { formatCompactNaira } from "@/utils/formatting";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

export default function Stats({
  title,
  value,
  subtitle,
  color = "text-foreground",
  icon: Icon,
  naira = true,
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className={`text-xl md:text-2xl font-bold ${color}`}>
          {/* what if we dont need the naira formatting? */}
          {naira ? (value ?? formatCompactNaira(value ?? 0)) : (value ?? 0)}
        </div>
        {subtitle && (
          <p className="text-[10px] text-muted-foreground capitalize mt-1">
            Period: {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
