import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import ProductCard from "./ProductCard";

function CategoryCard() {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  // Search states
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState(
    categoryName ? [decodeURIComponent(categoryName)] : []
  );
  const [priceRange, setPriceRange] = useState(5000);
  const [sortOrder, setSortOrder] = useState("");

  // 🔹 Fetch all products once
  useEffect(() => {
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
  }, []);

  // 🔹 Handle category checkbox toggle
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category) // remove if exists
        : [...prev, category] // add if not exists
    );
  };

  // 🔹 Filter + Search + Sort
  let filteredProducts = isSearching
    ? searchResults.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [...products];

  // Apply category filter
  if (selectedCategories.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      selectedCategories.includes(product.category)
    );
  }

  // Apply price filter
  filteredProducts = filteredProducts.filter((p) => p.price <= priceRange);

  // Apply sort
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
              <div className="mb-3">
                {["Men", "Women", "Kids", "Accessories"].map((cat) => (
                  <div key={cat} className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={cat}
                      checked={selectedCategories.includes(cat)}
                      onChange={() => handleCategoryChange(cat)}
                    />
                    <label htmlFor={cat} className="form-check-label">
                      {cat}
                    </label>
                  </div>
                ))}
              </div>

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
                  setSelectedCategories([]);
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
                : selectedCategories.length > 0
                ? selectedCategories.join(", ")
                : "All Products"}
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
