import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem, Product } from "../types/Product";
import { getBestUnitPrice } from "../utils/pricing";

type CartContextValue = {
  items: CartItem[];
  count: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "swag_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const count = useMemo(
    () => items.reduce((sum, it) => sum + it.quantity, 0),
    [items]
  );

  function addToCart(product: Product, quantity = 1) {
    setItems((prev) => {
      const existingIndex = prev.findIndex((it) => it.id === product.id);
      const unitPrice = getBestUnitPrice(product, quantity);
      if (existingIndex >= 0) {
        const copy = [...prev];
        const current = copy[existingIndex];
        const newQty = current.quantity + quantity;
        copy[existingIndex] = {
          ...current,
          quantity: newQty,
          unitPrice,
          totalPrice: unitPrice * newQty,
        };
        return copy;
      }
      const newItem: CartItem = {
        ...product,
        quantity,
        unitPrice,
        totalPrice: unitPrice * quantity,
      };
      return [...prev, newItem];
    });
  }

  function removeFromCart(productId: number) {
    setItems((prev) => prev.filter((it) => it.id !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  const value = useMemo(
    () => ({ items, count, addToCart, removeFromCart, clearCart }),
    [items, count]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
