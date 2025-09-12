import React, { useState, useContext, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaSearch, FaUser } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { CartContext } from "../contexts/CartContext";
import { WishlistContext } from "../contexts/WishlistContext";
import "../styles.css";

const Navbar = ({ setSearchResults, setIsSearching, setSearchQuery }) => {
  const [query, setQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);

  const cartCount = cartItems.reduce((total, item) => total + item.qty, 0);
  const wishlistCount = wishlistItems.length;

  const handleSearch = useCallback(
    async (searchValue) => {
      if (!searchValue.trim()) {
        setSearchResults?.([]);
        setIsSearching?.(false);
        return;
      }

      try {
        const res = await fetch(
          `https://project-ishara.vercel.app/api/products?search=${encodeURIComponent(
            searchValue
          )}`
        );
        const data = await res.json();
        setSearchResults?.(data.data?.products || []);
        setIsSearching?.(true);
      } catch (err) {
        console.error("Search error:", err);
        toast.error("Failed to search products");
      }
    },
    [setSearchResults, setIsSearching]
  );

  // Handle search input with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (setSearchQuery) setSearchQuery(value);

    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => handleSearch(value), 300);
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
  };

  // Handle login/logout toggle
  const handleAuth = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      toast.info("Logged out successfully!");
    } else {
      setIsLoggedIn(true);
      toast.success("Logged in successfully!");
    }
  };

  // Clear search and navigate home
  const handleLogoClick = () => {
    setQuery("");
    setSearchResults?.([]);
    setIsSearching?.(false);
    setSearchQuery?.("");
    navigate("/");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-3 fixed-top ">
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
            <div
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
              onClick={handleLogoClick}
            >
              Ishara
            </div>
          </div>

          {/* Search and Menu Items */}
          <div className="collapse navbar-collapse" id="navbarContent">
            {/* Search Bar */}
            <form
              className="mx-auto my-3 my-lg-0 w-100 d-flex justify-content-center"
              onSubmit={handleSearchSubmit}
            >
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
                  onChange={handleSearchChange}
                  aria-label="Search products"
                />
                <button
                  type="submit"
                  className="btn btn-outline-dark d-none d-md-block"
                  disabled={!query.trim()}
                >
                  Search
                </button>
              </div>
            </form>

            {/* Wishlist, Cart & Auth */}
            <div className="d-flex align-items-center gap-3 ms-lg-auto">
              <NavLink
                to="/wishlist"
                className="position-relative text-decoration-none"
                title="Wishlist"
              >
                <FaHeart className="fs-5 text-secondary" />
                {wishlistCount > 0 && (
                  <span className="badge-count">{wishlistCount}</span>
                )}
              </NavLink>

              <NavLink
                to="/cart"
                className="position-relative text-decoration-none"
                title="Cart"
              >
                <FaShoppingCart className="fs-5 text-secondary" />
                {cartCount > 0 && (
                  <span className="badge-count">{cartCount}</span>
                )}
              </NavLink>

              <button
                onClick={handleAuth}
                className="btn btn-outline-dark btn-sm px-3 d-flex align-items-center gap-2"
                title={isLoggedIn ? "Logout" : "Login"}
              >
                <FaUser className="fs-6" />
                <span className="d-none d-md-inline">
                  {isLoggedIn ? "Logout" : "Login"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Padding for fixed navbar */}
      <div style={{ paddingTop: "80px" }}></div>

      {/* Toast Notifications */}
      <ToastContainer
        position="bottom-right"
        autoClose={1500}
        pauseOnHover={false}
      />
    </>
  );
};

export default Navbar;
