import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { Loader, Minus, Plus, Trash } from "lucide-react";
import { checkoutCart } from "./checkoutService";
import { useState } from "react";

function CartPanel({ profile, staff }) {
  const [loading, setLoading] = useState(false);

  const { cart, increase, decrease, remove, total, clearCart } = useCart();

  const [payments, setPayments] = useState([{ method: "cash", amount: 0 }]);

  function updatePayment(index, field, value) {
    const copy = [...payments];
    copy[index][field] = field === "amount" ? Number(value) : value;
    setPayments(copy);
  }

  function addPayment() {
    setPayments([...payments, { method: "transfer", amount: 0 }]);
  }

  function removePayment(index) {
    const copy = payments.filter((_, i) => i !== index);
    setPayments(copy);
  }

  function paymentTotal() {
    return payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  }

  async function handleCheckout() {
    if (!staff?.location_id) {
      alert("Staff location not found.");
      return;
    }

    if (paymentTotal() !== total) {
      alert("Payment total must equal cart total.");
      return;
    }

    setLoading(true);

    try {
      const sale = await checkoutCart(
        cart,
        payments,
        profile,
        staff.location_id,
      );

      clearCart();

      setPayments([{ method: "cash", amount: 0 }]);

      alert("Checkout successful! Sale ID: " + sale);
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

      <CardContent className="flex flex-col gap-5 flex-1">
        {/* CART ITEMS */}

        <ScrollArea className="h-52">
          {cart.length === 0 && (
            <p className="text-sm text-muted-foreground">No items added</p>
          )}

          {cart.map((item) => (
            <div
              key={item.product_id}
              className="flex justify-between items-center border-b pb-2 py-2"
            >
              <div>
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

        {/* TOTAL */}

        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>₦{total.toFixed(2)}</span>
        </div>

        {/* PAYMENTS */}

        <div className="flex flex-col gap-3">
          {payments.map((payment, index) => (
            <div key={index} className="flex gap-2">
              <select
                value={payment.method}
                onChange={(e) => updatePayment(index, "method", e.target.value)}
                className="border rounded p-2"
              >
                <option value="cash">Cash</option>
                <option value="pos">POS</option>
                <option value="transfer">Transfer</option>
              </select>

              <Input
                type="number"
                placeholder="Amount"
                value={payment.amount}
                onChange={(e) => updatePayment(index, "amount", e.target.value)}
              />

              {payments.length > 1 && (
                <Button variant="ghost" onClick={() => removePayment(index)}>
                  ✕
                </Button>
              )}
            </div>
          ))}

          <Button variant="outline" onClick={addPayment}>
            Add Payment
          </Button>

          <div className="text-sm text-muted-foreground">
            Paid: ₦{paymentTotal().toFixed(2)}
          </div>
        </div>

        {/* CHECKOUT */}

        <Button
          onClick={handleCheckout}
          className="w-full"
          disabled={loading || cart.length === 0}
        >
          {loading ? <Loader className="animate-spin" /> : "Checkout"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default CartPanel;
