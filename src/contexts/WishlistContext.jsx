import React, { createContext, useState, useEffect } from "react";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem("wishlistItems");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (item) => {
    setWishlistItems((prev) => {
      // Use stable ID: prefer item.id, fallback item._id, else generate UUID
      const idToUse = item.id || item._id || crypto.randomUUID();

      // Prevent duplicate of same product + size
      const exists = prev.find(
        (p) => p.id === idToUse && p.selectedSize === item.selectedSize
      );
      if (exists) return prev;

      return [...prev, { ...item, id: idToUse }];
    });
  };

  const removeFromWishlist = (id, selectedSize) => {
    setWishlistItems((prev) =>
      prev.filter((item) =>
        selectedSize ? !(item.id === id && item.selectedSize === selectedSize) : item.id !== id
      )
    );
  };

  return (
    <WishlistContext.Provider
      value={{ wishlistItems, addToWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
