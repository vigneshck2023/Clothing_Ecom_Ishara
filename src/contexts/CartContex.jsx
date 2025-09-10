import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cartItems");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add to cart
  const addToCart = (product) => {
    setCartItems((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.id === product.id && item.selectedSize === product.selectedSize
      );

      if (existingIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingIndex].qty += product.qty || 1;
        return updatedCart;
      } else {
        return [...prevCart, { ...product, qty: product.qty || 1 }];
      }
    });
  };

  // Remove from cart
  const removeFromCart = (id, selectedSize) => {
    setCartItems((prev) =>
      prev.filter((i) => !(i.id === id && i.selectedSize === selectedSize))
    );
  };

  // Increase quantity
  const increaseQty = (id, selectedSize) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id && i.selectedSize === selectedSize
          ? { ...i, qty: i.qty + 1 }
          : i
      )
    );
  };

  // Decrease quantity
  const decreaseQty = (id, selectedSize) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id && i.selectedSize === selectedSize
          ? { ...i, qty: Math.max(i.qty - 1, 1) }
          : i
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
        increaseQty,
        decreaseQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
