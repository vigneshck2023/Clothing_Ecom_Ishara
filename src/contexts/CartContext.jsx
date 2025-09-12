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
  setCartItems((prevItems) => {
    const productId = product.id || product._id || product.name;

    // check if same product with same size exists
    const existingItem = prevItems.find(
      (item) =>
        (item.id || item._id || item.name) === productId &&
        item.selectedSize === product.selectedSize
    );

    if (existingItem) {
      // update qty if exists
      return prevItems.map((item) =>
        (item.id || item._id || item.name) === productId &&
        item.selectedSize === product.selectedSize
          ? { ...item, qty: item.qty + product.qty }
          : item
      );
    } else {
      // else add new product
      return [...prevItems, product];
    }
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
