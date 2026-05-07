import { formatCompactNaira } from "@/utils/formatting";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

export default function Stats({
  title,
  value,
  subtitle,
  color = "text-foreground",
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-xl md:text-2xl font-bold ${color}`}>
          {formatCompactNaira(value ?? 0)}
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
