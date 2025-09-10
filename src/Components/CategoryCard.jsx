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
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    if (!categoryName) return;

    const formattedCategory = decodeURIComponent(categoryName);

    fetch(
      `https://project-ishara.vercel.app/api/categories/${encodeURIComponent(
        formattedCategory
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
  }, [categoryName]);

  // Filtered Results
  let filteredProducts = isSearching
    ? searchResults.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [...products];

  // Apply Price Filter
  filteredProducts = filteredProducts.filter(
    (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
  );

  // Apply Category Filter
  if (selectedCategories.length > 0) {
    filteredProducts = filteredProducts.filter((p) =>
      selectedCategories.includes(p.category)
    );
  }

  // Apply Rating Filter
  if (selectedRating) {
    filteredProducts = filteredProducts.filter(
      (p) => p.rating >= selectedRating
    );
  }

  // Apply Sorting
  if (sortBy === "lowToHigh") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "highToLow") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <>
      {/* Navbar */}
      <Navbar
        setSearchResults={setSearchResults}
        setIsSearching={setIsSearching}
        setSearchQuery={setSearchQuery}
      />

      <div className="container mt-4">
        <div className="row">
          {/* Sidebar Filters */}
          <div className="col-md-3">
            <h5 className="fw-bold">Filters</h5>
            <button
              className="btn btn-sm btn-link text-danger mb-3"
              onClick={() => {
                setPriceRange([0, 5000]);
                setSelectedCategories([]);
                setSelectedRating(null);
                setSortBy("");
              }}
            >
              Clear
            </button>

            {/* Price Filter */}
            <div className="mb-4">
              <h6>Price</h6>
              <input
                type="range"
                className="form-range"
                min="0"
                max="5000"
                step="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              />
              <p>
                ₹{priceRange[0]} - ₹{priceRange[1]}
              </p>
            </div>

            {/* Sort By */}
            <div className="mb-4">
              <h6>Sort by</h6>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="sort"
                  checked={sortBy === "lowToHigh"}
                  onChange={() => setSortBy("lowToHigh")}
                />
                <label className="form-check-label">Price - Low to High</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="sort"
                  checked={sortBy === "highToLow"}
                  onChange={() => setSortBy("highToLow")}
                />
                <label className="form-check-label">Price - High to Low</label>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="col-md-9">
            <h2 className="mb-3">
              {isSearching
                ? "Search Results"
                : `${decodeURIComponent(categoryName)} Collection`}
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
