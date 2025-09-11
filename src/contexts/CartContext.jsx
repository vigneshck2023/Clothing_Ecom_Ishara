import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem("cartItems")) || [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.id === product.id && item.selectedSize === product.selectedSize
      );

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex].qty += product.qty || 1;
        return updated;
      }

      return [...prev, { ...product, qty: product.qty || 1 }];
    });
  };

  const removeFromCart = (id, selectedSize) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.id === id && item.selectedSize === selectedSize)
      )
    );
  };

  const updateCartItem = (oldItem, newItem) => {
    setCartItems((prev) => {
      const filtered = prev.filter(
        (item) =>
          !(item.id === oldItem.id && item.selectedSize === oldItem.selectedSize)
      );
      return [...filtered, newItem];
    });
  };

  const increaseQty = (id, selectedSize) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.selectedSize === selectedSize
          ? { ...item, qty: item.qty + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id, selectedSize) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.selectedSize === selectedSize
          ? { ...item, qty: Math.max(1, item.qty - 1) } // Prevent qty < 1
          : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItem,
        increaseQty,
        decreaseQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
