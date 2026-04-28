import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import {
  Loader,
  Minus,
  Plus,
  Trash,
  Banknote,
  CreditCard,
  Send,
} from "lucide-react";
import { checkoutCart } from "./checkoutService";
import { useState, useMemo, useEffect } from "react";

function CartPanel({ profile, staff }) {
  const [loading, setLoading] = useState(false);
  const { cart, increase, decrease, remove, total, clearCart } = useCart();
  const [payments, setPayments] = useState([{ method: "cash", amount: 0 }]);

  // Performance: Only re-calculate when payments array changes
  const paidTotal = useMemo(() => {
    return payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  }, [payments]);

  // SPEED IMPROVEMENT: Auto-update the amount if there is only one payment method
  useEffect(() => {
    if (payments.length === 1 && cart.length > 0) {
      setPayments([{ ...payments[0], amount: total }]);
    }
  }, [total, cart.length, payments.length]);

  // SPEED IMPROVEMENT: Handle "Enter" key for fast checkout
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === "Enter" &&
        !loading &&
        cart.length > 0 &&
        Math.abs(paidTotal - total) < 0.01
      ) {
        handleCheckout();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [paidTotal, total, loading, cart]);

  function updatePayment(index, field, value) {
    const copy = [...payments];
    if (field === "amount") {
      copy[index][field] = value === "" ? "" : Number(value);
    } else {
      copy[index][field] = value;
    }
    setPayments(copy);
  }

  // SPEED IMPROVEMENT: One-click "Quick Pay" for full amounts
  function quickPay(method) {
    setPayments([{ method, amount: total }]);
  }

  function addPayment() {
    const remaining = total - paidTotal;
    setPayments([
      ...payments,
      { method: "transfer", amount: remaining > 0 ? remaining : 0 },
    ]);
  }

  function removePayment(index) {
    setPayments(payments.filter((_, i) => i !== index));
  }

  async function handleCheckout() {
    if (!staff?.location_id) return alert("Staff location not found.");
    if (Math.abs(paidTotal - total) > 0.01) {
      alert(
        `Payment mismatch. Paid: ₦${paidTotal.toFixed(2)} vs Total: ₦${total.toFixed(2)}`,
      );
      return;
    }

    setLoading(true);
    try {
      const finalPayments = payments.map((p) => ({
        ...p,
        amount: Number(p.amount) || 0,
      }));
      const sale = await checkoutCart(
        cart,
        finalPayments,
        profile,
        staff.location_id,
      );
      clearCart();
      setPayments([{ method: "cash", amount: 0 }]);
      alert("Checkout successful!");
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
              key={item.id}
              className="flex justify-between items-center border-b pb-2 py-2"
            >
              <div>
                <p className="w-40 text-nowrap overflow-hidden text-ellipsis text-sm font-medium">
                  {item.name}
                </p>
                <p className="text-xs text-muted-foreground">₦{item.price}</p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => decrease(item.id)}
                >
                  <Minus size={14} />
                </Button>
                <span className="w-6 text-center">{item.quantity}</span>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => increase(item.id)}
                >
                  <Plus size={14} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => remove(item.id)}
                >
                  <Trash size={14} />
                </Button>
              </div>
            </div>
          ))}
        </ScrollArea>

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₦{total.toFixed(2)}</span>
        </div>

        {/* SPEED IMPROVEMENT: QUICK PAY BUTTONS */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => quickPay("cash")}
            disabled={cart.length === 0}
          >
            <Banknote className="mr-1 h-4 w-4" /> Cash
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => quickPay("pos")}
            disabled={cart.length === 0}
          >
            <CreditCard className="mr-1 h-4 w-4" /> POS
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => quickPay("transfer")}
            disabled={cart.length === 0}
          >
            <Send className="mr-1 h-4 w-4" /> Trans
          </Button>
        </div>

        {/* PAYMENTS */}
        <div className="flex flex-col gap-3 border-t pt-3">
          {payments.map((payment, index) => (
            <div key={index} className="flex gap-2">
              <select
                value={payment.method}
                onChange={(e) => updatePayment(index, "method", e.target.value)}
                className="border rounded p-2 text-sm"
              >
                <option value="cash">Cash</option>
                <option value="pos">POS</option>
                <option value="transfer">Transfer</option>
              </select>
              <Input
                type="number"
                placeholder="Amount"
                value={payment.amount}
                onFocus={(e) => e.target.select()} // Auto-select text on click for faster editing
                onChange={(e) => updatePayment(index, "amount", e.target.value)}
              />
              {payments.length > 1 && (
                <Button variant="ghost" onClick={() => removePayment(index)}>
                  ✕
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={addPayment}
            disabled={cart.length === 0}
          >
            + Split Payment
          </Button>
          <div className="flex justify-between text-xs text-muted-foreground uppercase font-bold">
            <span>Paid: ₦{paidTotal.toFixed(2)}</span>
            <span
              className={
                Math.abs(paidTotal - total) < 0.01
                  ? "text-green-600"
                  : "text-red-500"
              }
            >
              {Math.abs(paidTotal - total) < 0.01
                ? "Ready"
                : `Diff: ₦${(total - paidTotal).toFixed(2)}`}
            </span>
          </div>
        </div>

        <Button
          onClick={handleCheckout}
          className="w-full h-12 text-lg font-bold"
          disabled={
            loading || cart.length === 0 || Math.abs(paidTotal - total) > 0.01
          }
        >
          {loading ? (
            <Loader className="animate-spin" />
          ) : (
            "Complete Sale (Enter)"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export default CartPanel;
