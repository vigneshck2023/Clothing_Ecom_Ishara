import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import ProductCard from "./ProductCard";

function CategoryCard() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  // Search states
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(
    decodeURIComponent(categoryName) || ""
  );
  const [priceRange, setPriceRange] = useState(5000);
  const [sortOrder, setSortOrder] = useState("");

  // 🔹 Fetch products dynamically when category changes
  useEffect(() => {
    if (!selectedCategory) {
      // Fetch all products if no category selected
      fetch("https://project-ishara.vercel.app/api/products")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch");
          return res.json();
        })
        .then((data) => {
          setProducts(data.data?.products || []);
          setError("");
        })
        .catch((err) => {
          console.error("Error fetching products:", err);
          setError("Failed to load products");
        });
    } else {
      // Fetch products of selected category
      fetch(
        `https://project-ishara.vercel.app/api/categories/${encodeURIComponent(
          selectedCategory
        )}`
      )
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch");
          return res.json();
        })
        .then((data) => {
          setProducts(data.data?.category?.products || []);
          setError("");
        })
        .catch((err) => {
          console.error("Error fetching category products:", err);
          setError("Failed to load products");
        });
    }
  }, [selectedCategory]);

  // 🔹 Update URL when filter category changes
  useEffect(() => {
    if (selectedCategory) {
      navigate(`/category/${encodeURIComponent(selectedCategory)}`);
    }
  }, [selectedCategory, navigate]);

  // 🔹 Filter + Search (apply category filter even while searching)
  let filteredProducts = isSearching
    ? searchResults
        .filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter(
          (product) =>
            !selectedCategory ||
            product.category?.toLowerCase() === selectedCategory.toLowerCase()
        )
    : [...products];

  // Price filter
  filteredProducts = filteredProducts.filter((p) => p.price <= priceRange);

  // Sort
  if (sortOrder === "lowToHigh") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "highToLow") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <>
      <Navbar
        setSearchResults={setSearchResults}
        setIsSearching={setIsSearching}
        setSearchQuery={setSearchQuery}
      />

      <div className="container mt-4">
        <div className="row">
          {/* Filters */}
          <div className="col-md-3 mb-4">
            <div className="card shadow-sm p-3">
              <h5 className="fw-bold mb-3">Filters</h5>

              {/* Category */}
              <label className="form-label fw-semibold">Category</label>
              <select
                className="form-select mb-3"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
                <option value="Accessories">Accessories</option>
              </select>

              {/* Price Range */}
              <label className="form-label fw-semibold">Price Range</label>
              <input
                type="range"
                className="form-range"
                min="0"
                max="5000"
                step="100"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
              />
              <div className="d-flex justify-content-between mb-3">
                <span>₹0</span>
                <span>₹{priceRange}</span>
              </div>

              {/* Sort */}
              <label className="form-label fw-semibold">Sort By</label>
              <select
                className="form-select mb-3"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="">Default</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
              </select>

              <button
                className="btn btn-secondary w-100"
                onClick={() => {
                  setSelectedCategory("");
                  setPriceRange(5000);
                  setSortOrder("");
                }}
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Products */}
          <div className="col-md-9">
            <h2 className="mb-3">
              {isSearching
                ? "Search Results"
                : selectedCategory || "All Products"}
            </h2>
            {error && <p className="text-danger">{error}</p>}
            <div className="row">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
                  >
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <p>No products found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CategoryCard;
