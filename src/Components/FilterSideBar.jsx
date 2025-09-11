// src/Components/FiltersSidebar.js
import React from "react";

export default function FiltersSidebar({
  selectedCategory,
  setSelectedCategory,
  maxPrice,
  setMaxPrice,
  sortOrder,
  setSortOrder,
  setMinPrice,
  setSortOrderReset
}) {
  return (
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
        value={maxPrice || 5000}
        onChange={(e) => setMaxPrice(e.target.value)}
      />
      <div className="d-flex justify-content-between small mb-3">
        <span>₹0</span>
        <span>₹{maxPrice || 5000}</span>
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
          setMinPrice("");
          setMaxPrice("");
          setSelectedCategory("");
          setSortOrderReset();
        }}
      >
        Reset Filters
      </button>
    </div>
  );
}
