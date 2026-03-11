import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  function addToCart(product) {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product_id === product.product_id,
      );
      if (existing) {
        return prev.map((item) =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1, sn: cart.length }];
    });
  }
  function clearCart() {
    setCart([]);
  }
  function increase(id) {
    setCart((prev) =>
      prev.map((item) =>
        item.product_id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  }

  function decrease(id) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product_id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function remove(id) {
    setCart((prev) => prev.filter((item) => item.product_id !== id));
  }
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <CartContext.Provider
      value={{ cart, addToCart, increase, decrease, remove, total, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
export function useCart() {
  return useContext(CartContext);
}
