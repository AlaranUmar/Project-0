import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "@/context/CartContext";
import { Loader, Minus, Plus, Trash } from "lucide-react";
import { checkoutCart } from "./checkoutService";
import { useState } from "react";

function CartPanel({ profile, staff }) {
  const [loading, setLoading] = useState(false);
  const { cart, increase, decrease, remove, total, clearCart } = useCart();

  async function handleCheckout() {
    setLoading(true);
    try {
      const sale = await checkoutCart(cart, profile, staff?.location_id);

      if (!staff?.location_id) {
        alert("Error: Staff location not found.");
        return;
      }

      clearCart();
      alert("Checkout successful! Sale ID: " + sale.id);
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  }
  return (
    <Card className="flex flex-col md:col-span-4">
      <CardHeader>
        <CardTitle>Cart</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-5 flex-1 ">
        <ScrollArea className="h-52 ">
          {cart.length === 0 && (
            <p className="text-sm text-muted-foreground">No items added</p>
          )}

          {cart.map((item) => (
            <div
              key={item.product_id}
              className="flex justify-between items-center border-b pb-2 py-2"
            >
              <div className="relative">
                <span className="text-xs text-gray-500 mr-1">
                  {item.sn + 1}
                </span>
                <p className="w-40 text-nowrap overflow-hidden text-ellipsis text-sm font-medium">
                  {item.product_name}
                </p>

                <p className="text-xs text-muted-foreground">₦{item.price}</p>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => decrease(item.product_id)}
                >
                  <Minus size={14} />
                </Button>

                <span>{item.quantity}</span>

                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => increase(item.product_id)}
                >
                  <Plus size={14} />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => remove(item.product_id)}
                >
                  <Trash size={14} />
                </Button>
              </div>
            </div>
          ))}
        </ScrollArea>

        <div className="mt-2 flex flex-col gap-3">
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>₦{total.toFixed(2)}</span>
          </div>

          <Button
            onClick={handleCheckout}
            className="w-full"
            disabled={loading}
          >
            Checkout
            {loading && <Loader className="animate-spin" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default CartPanel;
