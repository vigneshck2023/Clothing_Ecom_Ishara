import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import CategoryCard from "./Components/CategoryCard";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import { CartProvider } from "./contexts/CartContex";
import { WishlistProvider } from "./contexts/WishlistContext";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <CartProvider>
    <WishlistProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/category/:categoryName" element={<CategoryCard />} />
        </Routes>
      </BrowserRouter>
    </WishlistProvider>
  </CartProvider>
);
