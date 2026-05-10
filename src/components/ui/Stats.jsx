import { Card, CardContent, CardHeader, CardTitle } from "./card";

export default function Stats({ title, value, subtitle, color, icon: Icon }) {
  return (
    <Card className={`overflow-hidden`}>
      <CardHeader className="">
        <CardTitle
          className={`text-${color} font-bold uppercase flex items-center gap-1 text-[10px]`}
        >
          {Icon && <Icon className={`mr-2 h-5 w-5 inline-block`} />}
          <span className="text-[9px] sm:text-[12px] ">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-xl md:text-2xl font-bold text-${color}`}>
          {value}
        </div>
        {subtitle && (
          <p className="text-[10px] text-muted-foreground capitalize mt-1">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
