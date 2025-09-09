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
        console.log("Products from API:", data.data?.category?.products);
        setProducts(data.data?.category?.products || []);
        setError("");
      })
      .catch((err) => {
        console.error("Error fetching category products:", err);
        setError("Failed to load products");
      });
  }, [categoryName]);

  // Filter search results
  const filteredResults = searchResults.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Navbar with search props */}
      <Navbar
        setSearchResults={setSearchResults}
        setIsSearching={setIsSearching}
        setSearchQuery={setSearchQuery}
      />

      {/* ✅ Align content with Navbar */}
      <div className="container-fluid px-4 mt-4">
        {isSearching ? (
          <>
            <h2 className="mb-3">Search Results</h2>
            <div className="row g-4">
              {filteredResults.length > 0 ? (
                filteredResults.map((product) => (
                  <div
                    key={product._id}
                    className="col-12 col-sm-6 col-md-4 col-lg-3"
                  >
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <p>No products found.</p>
              )}
            </div>
          </>
        ) : (
          <>
            <h2 className="mb-3">
              {decodeURIComponent(categoryName)} Collection
            </h2>
            {error && <p className="text-danger">{error}</p>}
            <div className="row g-4">
              {products.length > 0
                ? products.map((product) => (
                    <div
                      key={product._id}
                      className="col-12 col-sm-6 col-md-4 col-lg-3"
                    >
                      <ProductCard product={product} />
                    </div>
                  ))
                : !error && <p>No products found.</p>}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default CategoryCard;
