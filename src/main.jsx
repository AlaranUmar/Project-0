import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import Router from "./app/Router";
import { CartProvider } from "./context/CartContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <Router />
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
);
