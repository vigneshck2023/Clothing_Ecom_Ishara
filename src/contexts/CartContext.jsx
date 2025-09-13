import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // ---------------- Cart Items ----------------
  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem("cartItems")) || [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // ---------------- User Details ----------------
  const [userDetails, setUserDetails] = useState(() => {
    return JSON.parse(localStorage.getItem("userDetails")) || {
      name: "",
      email: "",
      phone: "",
    };
  });

  useEffect(() => {
    localStorage.setItem("userDetails", JSON.stringify(userDetails));
  }, [userDetails]);

  // ---------------- Addresses ----------------
  const [addresses, setAddresses] = useState(() => {
    return JSON.parse(localStorage.getItem("addresses")) || [];
  });

  const [selectedAddress, setSelectedAddress] = useState(() => {
    return JSON.parse(localStorage.getItem("selectedAddress")) ?? null;
  });

  useEffect(() => {
    localStorage.setItem("addresses", JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem("selectedAddress", JSON.stringify(selectedAddress));
  }, [selectedAddress]);

  // ---------------- Checkout Step ----------------
  const [currentStep, setCurrentStep] = useState(() => {
    return JSON.parse(localStorage.getItem("currentStep")) || 1;
  });

  useEffect(() => {
    localStorage.setItem("currentStep", JSON.stringify(currentStep));
  }, [currentStep]);

  // ---------------- Cart Actions ----------------
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const productId = product.id || product._id || product.name;

      const existingItem = prevItems.find(
        (item) =>
          (item.id || item._id || item.name) === productId &&
          item.selectedSize === product.selectedSize
      );

      if (existingItem) {
        return prevItems.map((item) =>
          (item.id || item._id || item.name) === productId &&
          item.selectedSize === product.selectedSize
            ? { ...item, qty: item.qty + product.qty }
            : item
        );
      } else {
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

  // ---------------- Reset User Session ----------------
  const resetUserSession = () => {
    setUserDetails({ name: "", email: "", phone: "" });
    setAddresses([]);
    setSelectedAddress(null);
    setCurrentStep(1);

    localStorage.removeItem("userDetails");
    localStorage.removeItem("addresses");
    localStorage.removeItem("selectedAddress");
    localStorage.removeItem("currentStep");
  };

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

        userDetails,
        setUserDetails,

        addresses,
        setAddresses,

        selectedAddress,
        setSelectedAddress,

        currentStep,
        setCurrentStep,

        resetUserSession,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
