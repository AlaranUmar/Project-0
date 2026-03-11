import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area"; // Use the shadcn wrapper

const products = [
  { id: 1, name: "Espresso", price: "$3.50", popular: true, stock: 15 },
  { id: 2, name: "Oat Milk Latte", price: "$5.50", popular: true, stock: 0 },
  { id: 3, name: "Avocado Toast", price: "$12.00", popular: true, stock: 8 },
  { id: 4, name: "Croissant", price: "$4.00", popular: true, stock: 0 },
];

function PopularProducts() {
  const popularItems = products.filter((p) => p.popular);

  return (
    <Card className="w-full">
      <CardHeader className={"h-3"}>
        <CardTitle>Popular Products</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-52">
          <div className="flex flex-col gap-2 p-1">
            {popularItems.map((product) => (
              <Card
                key={product.id}
                className={`transition-all hover:border-primary cursor-pointer ${
                  product.stock === 0
                    ? "opacity-60 grayscale bg-slate-50"
                    : "hover:bg-slate-50/50"
                }`}
              >
                <CardContent className="flex p-2 py-1 items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">{product.name}</span>
                    <span className="text-primary font-semibold text-xs">
                      {product.price}
                    </span>
                  </div>

                  <div>
                    {product.stock === 0 ? (
                      <Badge
                        variant="destructive"
                        className="uppercase text-[10px]"
                      >
                        Sold Out
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]"
                      >
                        {product.stock} in stock
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default PopularProducts;
