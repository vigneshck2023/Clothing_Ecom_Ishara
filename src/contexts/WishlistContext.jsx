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
      const uniqueId = item.id || item._id || crypto.randomUUID();

      // check for same product + size
      if (
        prev.find(
          (p) => p.id === uniqueId && p.selectedSize === item.selectedSize
        )
      )
        return prev;

      return [...prev, { ...item, id: uniqueId }];
    });
  };

  const removeFromWishlist = (id, selectedSize) => {
    setWishlistItems((prev) =>
      selectedSize
        ? prev.filter((i) => !(i.id === id && i.selectedSize === selectedSize))
        : prev.filter((i) => i.id !== id)
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
