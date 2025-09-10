import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaSearch } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { CartContext } from "../contexts/CartContex";
import { WishlistContext } from "../contexts/WishlistContext";
import "../styles.css";

const Navbar = ({ setSearchResults, setIsSearching, setSearchQuery }) => {
  const [query, setQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);
  const cartCount = cartItems.reduce((total, item) => total + item.qty, 0);
  const wishlistCount = wishlistItems.length;

  // 🔎 Handle search input
  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (setSearchQuery) setSearchQuery(value);

    if (!value.trim()) {
      setSearchResults?.([]);
      setIsSearching?.(false);
      return;
    }

    try {
      const res = await fetch(
        `https://project-ishara.vercel.app/api/products?search=${value}`
      );
      const data = await res.json();
      setSearchResults?.(data.data.products || []);
      setIsSearching?.(true);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  // 👤 Handle login/logout
  const handleAuth = () => {
    if (isLoggedIn) {
      toast.success("👋 Logged out successfully!");
    } else {
      toast.success("🎉 Logged in successfully!");
    }
    setIsLoggedIn((prev) => !prev);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-3">
        <div className="container">
          {/* Logo and Toggle Button */}
          <div className="d-flex align-items-center">
            <button
              className="navbar-toggler me-2"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarContent"
              aria-controls="navbarContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <NavLink
              to="/"
              className="navbar-brand"
              style={{
                fontFamily: "'Montserrat', serif",
                fontWeight: "900",
                fontSize: "2.2rem",
                color: "#0d0c0c",
                letterSpacing: "1.5px",
                textDecoration: "none",
                textShadow: "2px 2px 6px rgba(0,0,0,0.25)",
                transition: "all 0.3s ease",
                cursor: "pointer",
                textTransform: "uppercase",
              }}
              onClick={() => {
                setQuery("");
                setSearchResults?.([]);
                setIsSearching?.(false);
                setSearchQuery?.("");
              }}
            >
              Ishara
            </NavLink>
          </div>

          {/* Search and Menu Items */}
          <div className="collapse navbar-collapse" id="navbarContent">
            {/* Search Bar */}
            <div className="mx-auto my-3 my-lg-0 w-100 d-flex justify-content-center">
              <div
                className="input-group"
                style={{ maxWidth: "500px", width: "100%" }}
              >
                <span className="input-group-text bg-white border-end-0">
                  <FaSearch className="text-muted" />
                </span>
                <input
                  className="form-control border-start-0"
                  type="search"
                  placeholder="Search products..."
                  value={query}
                  onChange={handleSearch}
                  aria-label="Search products"
                />
              </div>
            </div>

            {/* Wishlist, Cart & Auth */}
            <div className="d-flex align-items-center gap-3 ms-lg-auto">
              <NavLink to="/wishlist" className="position-relative">
                <FaHeart className="fs-5 text-secondary" />
                {wishlistCount > 0 && (
                  <span className="badge-count">{wishlistCount}</span>
                )}
              </NavLink>

              <NavLink to="/cart" className="position-relative">
                <FaShoppingCart className="fs-5 text-secondary" />
                {cartCount > 0 && (
                  <span className="badge-count">{cartCount}</span>
                )}
              </NavLink>

              <button
                onClick={handleAuth}
                className="btn btn-outline-dark btn-sm px-3"
              >
                {isLoggedIn ? "Logout" : "Login"}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Toast Notifications */}
      <ToastContainer position="bottom-right" autoClose={1500} />
    </>
  );
};

export default Navbar;
