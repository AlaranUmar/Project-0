import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [heldCarts, setHeldCarts] = useState([]);

  function addToCart(product) {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  item.quantity < (product.inventory?.[0]?.quantity ?? 0)
                    ? item.quantity + 1
                    : item.quantity,
              }
            : item,
        );
      }

      return [
        ...prev,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  }

  function increase(id) {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity < (item.inventory?.[0]?.quantity ?? 0)
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      ),
    );
  }

  function decrease(id) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function setQuantity(id, quantity) {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.min(
                Math.max(quantity, 1),
                item.inventory?.[0]?.quantity ?? quantity,
              ),
            }
          : item,
      ),
    );
  }

  function remove(id) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  function holdCart(name) {
    if (cart.length === 0) return;

    setHeldCarts((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: name || `Customer ${prev.length + 1}`,
        items: cart,
        created_at: new Date().toISOString(),
      },
    ]);

    clearCart();
  }

  function loadHeldCart(id) {
    const selected = heldCarts.find((c) => c.id === id);

    if (!selected) return;

    setCart(selected.items);

    setHeldCarts((prev) => prev.filter((c) => c.id !== id));
  }

  function deleteHeldCart(id) {
    setHeldCarts((prev) => prev.filter((c) => c.id !== id));
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const totalUnits = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        heldCarts,

        addToCart,
        increase,
        decrease,
        setQuantity,
        remove,

        clearCart,
        holdCart,
        loadHeldCart,
        deleteHeldCart,

        total,
        totalUnits,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
