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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { checkoutCart } from "./checkoutService";
import { useState, useMemo, useEffect } from "react";

function CartPanel({ profile, staff }) {
  const [loading, setLoading] = useState(false);

  const {
    cart,
    heldCarts,

    increase,
    decrease,
    setQuantity,
    remove,

    total,
    totalUnits,

    clearCart,
    holdCart,
    loadHeldCart,
    deleteHeldCart,
  } = useCart();

  const [payments, setPayments] = useState([
    {
      method: "cash",
      amount: 0,
    },
  ]);

  const [holdName, setHoldName] = useState("");

  const [cartSearch, setCartSearch] = useState("");

  const filteredCart = useMemo(() => {
    if (!cartSearch) return cart;

    return cart.filter((item) =>
      item.name?.toLowerCase().includes(cartSearch.toLowerCase()),
    );
  }, [cart, cartSearch]);

  const paidTotal = useMemo(() => {
    return payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  }, [payments]);

  useEffect(() => {
    if (payments.length === 1 && cart.length > 0) {
      setPayments([
        {
          ...payments[0],
          amount: total,
        },
      ]);
    }
  }, [total, cart.length, payments.length]);

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

  function quickPay(method) {
    setPayments([
      {
        method,
        amount: total,
      },
    ]);
  }

  function addPayment() {
    const remaining = total - paidTotal;

    // 1. List all your available payment options
    const allMethods = ["cash", "pos", "transfer"];

    // 2. Find which methods have already been added to the state
    const existingMethods = payments.map((p) => p.method);

    // 3. Find the first method that is NOT in the existing list
    const nextAvailableMethod = allMethods.find(
      (method) => !existingMethods.includes(method),
    );

    // 4. If all methods are already added, stop running the function
    if (!nextAvailableMethod) return;

    setPayments([
      ...payments,
      {
        method: nextAvailableMethod, // Adds the new unique method automatically
        amount: remaining > 0 ? remaining : 0,
      },
    ]);
  }

  function removePayment(index) {
    setPayments(payments.filter((_, i) => i !== index));
  }

  function removePayment(index) {
    setPayments(payments.filter((_, i) => i !== index));
  }
  async function handleCheckout() {
    if (!staff?.location_id) return alert("Staff location not found.");

    if (Math.abs(paidTotal - total) > 0.01) {
      alert(
        `Payment mismatch. Paid: ₦${paidTotal.toFixed(
          2,
        )} vs Total: ₦${total.toFixed(2)}`,
      );
      return;
    }

    setLoading(true);

    try {
      const finalPayments = payments.map((p) => ({
        ...p,
        amount: Number(p.amount) || 0,
      }));

      await checkoutCart(cart, finalPayments, profile, staff.location_id);

      clearCart();

      setPayments([
        {
          method: "cash",
          amount: 0,
        },
      ]);

      alert("Checkout successful!");
    } catch (err) {
      alert(err.message);
    }

    setLoading(false);
  }

  return (
    <Card className="ring-0 shadow-none">
      <CardContent className="space-y-4">
        <Input
          placeholder="Search cart..."
          value={cartSearch}
          onChange={(e) => setCartSearch(e.target.value)}
        />

        <div className="grid grid-cols-3 gap-2">
          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground">Products</p>

              <p className="font-bold">{cart.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground">Units</p>

              <p className="font-bold">{totalUnits}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground">Total</p>

              <p className="font-bold">₦{total.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        <div className="border rounded-lg p-3 space-y-2">
          <p className="font-semibold">Hold Cart</p>

          <Input
            placeholder="Customer Name"
            value={holdName}
            onChange={(e) => setHoldName(e.target.value)}
          />

          <Button
            variant="outline"
            className="w-full"
            disabled={cart.length === 0}
            onClick={() => {
              holdCart(holdName);
              setHoldName("");
            }}
          >
            Hold Current Cart
          </Button>
        </div>

        {heldCarts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Held Carts ({heldCarts.length})</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
              {heldCarts.map((c) => (
                <div
                  key={c.id}
                  className="flex justify-between items-center border rounded-lg p-2"
                >
                  <div>
                    <p className="font-medium">{c.name}</p>

                    <p className="text-xs text-muted-foreground">
                      {c.items.length} products
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => loadHeldCart(c.id)}>
                      Resume
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteHeldCart(c.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
        <ScrollArea className="h-72 border rounded-lg p-2">
          {filteredCart.length === 0 && (
            <p className="text-sm text-muted-foreground">No items added</p>
          )}

          {filteredCart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b py-2"
            >
              <div>
                <img
                  src={item?.image_url}
                  alt={item.name}
                  className="w-10 h-10 rounded-lg border object-cover"
                />
                <p
                  className="font-medium text-sm line-clamp-2 max-w-[150px] md:max-w-[250px]"
                  title={item.name}
                >
                  {item.name}
                </p>

                <p className="text-xs text-muted-foreground">
                  ₦{item.price.toLocaleString()} × {item.quantity}
                </p>

                <p className="font-semibold text-sm">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => decrease(item.id)}
                >
                  <Minus size={14} />
                </Button>

                <Input
                  type="number"
                  min={1}
                  value={item.quantity}
                  className="w-16 text-center"
                  onChange={(e) =>
                    setQuantity(item.id, Number(e.target.value) || 1)
                  }
                />

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

        <div className="grid grid-cols-3 gap-2">
          <Button variant="secondary" onClick={() => quickPay("cash")}>
            <Banknote className="mr-1 h-4 w-4" />
            Cash
          </Button>

          <Button variant="secondary" onClick={() => quickPay("pos")}>
            <CreditCard className="mr-1 h-4 w-4" />
            POS
          </Button>

          <Button variant="secondary" onClick={() => quickPay("transfer")}>
            <Send className="mr-1 h-4 w-4" />
            Transfer
          </Button>
        </div>

        <div className="space-y-3">
          {payments.map((payment, index) => (
            <div key={index} className="flex gap-2 items-center mb-2">
              <Select
                value={payment.method}
                onValueChange={(value) => updatePayment(index, "method", value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem
                    value="cash"
                    disabled={payments.some(
                      (p, i) => p.method === "cash" && i !== index,
                    )}
                  >
                    Cash
                  </SelectItem>
                  <SelectItem
                    value="pos"
                    disabled={payments.some(
                      (p, i) => p.method === "pos" && i !== index,
                    )}
                  >
                    POS
                  </SelectItem>
                  <SelectItem
                    value="transfer"
                    disabled={payments.some(
                      (p, i) => p.method === "transfer" && i !== index,
                    )}
                  >
                    Transfer
                  </SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="number"
                value={payment.amount}
                onChange={(e) => updatePayment(index, "amount", e.target.value)}
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive shrink-0"
                onClick={() => removePayment(index)}
              >
                ✕
              </Button>
            </div>
          ))}

          <Button variant="outline" onClick={addPayment}>
            + Split Payment
          </Button>

          <div className="flex justify-between text-sm font-medium">
            <span>Paid: ₦{paidTotal.toLocaleString()}</span>

            <span>Balance: ₦{(total - paidTotal).toLocaleString()}</span>
          </div>
        </div>

        <Button
          className="w-full h-12 text-lg"
          disabled={
            loading || cart.length === 0 || Math.abs(paidTotal - total) > 0.01
          }
          onClick={handleCheckout}
        >
          {loading ? <Loader className="animate-spin" /> : "Complete Sale"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default CartPanel;
