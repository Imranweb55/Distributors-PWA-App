// FILE: src/context/CartContext.jsx
// NEW FILE — Feature: e-commerce-style Request Batter flow.
// PURPOSE: A shared, in-memory cart (cleared on refresh/logout, same as
// any shopping cart) keyed by customer, so a distributor can browse to
// customer A, add Idly/Dosa batter to their cart, then go to customer B
// and add more, then finally open the Cart/Checkout screen to see
// everything grouped by shop before placing the request. This is
// UI-only state — nothing is sent to the backend until Checkout's
// "Place Order" is pressed (which still uses the existing, unchanged
// submitBatterRequest API).
import { createContext, useContext, useState, useMemo } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  // Shape: { [customerId]: { shopName, items: { idly: kg, dosa: kg } } }
  const [cart, setCart] = useState({});

  const addItem = (customerId, shopName, productKey, qty) => {
    if (!qty || qty <= 0) return;
    setCart((c) => {
      const existing = c[customerId] || { shopName, items: {} };
      return {
        ...c,
        [customerId]: {
          shopName,
          items: { ...existing.items, [productKey]: qty },
        },
      };
    });
  };

  const removeItem = (customerId, productKey) => {
    setCart((c) => {
      const existing = c[customerId];
      if (!existing) return c;
      const items = { ...existing.items };
      delete items[productKey];
      const next = { ...c };
      if (Object.keys(items).length === 0) delete next[customerId];
      else next[customerId] = { ...existing, items };
      return next;
    });
  };

  const removeCustomer = (customerId) => {
    setCart((c) => {
      const next = { ...c };
      delete next[customerId];
      return next;
    });
  };

  const clearCart = () => setCart({});

  const qtyFor = (customerId, productKey) => cart[customerId]?.items?.[productKey] || 0;

  const totalItems = useMemo(
    () => Object.values(cart).reduce((sum, c) => sum + Object.keys(c.items).length, 0),
    [cart]
  );

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, removeCustomer, clearCart, qtyFor, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}