import { useEffect, useState } from "react";
import Navbar from "./Components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles.css";
import Carousel from "./Components/Carousel";
import emailjs from "emailjs-com";
import ProductCard from "./Components/ProductCard";

export default function App() {
  const [products, setProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  // 🔹 Filters
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState(""); // ✅ Added missing state

  // Fetch all products for homepage
  useEffect(() => {
    fetch("https://project-ishara.vercel.app/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data?.products || []);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Handle newsletter subscription
  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email) {
      setStatusMessage("Please enter a valid email.");
      return;
    }

    emailjs
      .send(
        "service_tsymm5s",
        "template_p0iebc6",
        { user_email: email },
        "NMNVxqXCskYhwPfIN"
      )
      .then(
        () => {
          setStatusMessage("🎉 Subscription successful!");
          setEmail("");
        },
        (err) => {
          console.error("EmailJS error:", err);
          setStatusMessage("❌ Failed to subscribe. Try again later.");
        }
      );
  };

  // 🔹 Apply filters on search results
  const filteredResults = searchResults
    .filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((product) => {
      if (selectedCategory && product.category !== selectedCategory) {
        return false;
      }
      return true;
    })
    .filter((product) => {
      if (minPrice && product.price < parseFloat(minPrice)) return false;
      if (maxPrice && product.price > parseFloat(maxPrice)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "lowToHigh") return a.price - b.price;
      if (sortOrder === "highToLow") return b.price - a.price;
      return 0;
    });

  return (
    <>
      {/* Navbar passes back search results */}
      <Navbar
        setSearchResults={setSearchResults}
        setIsSearching={setIsSearching}
        setSearchQuery={setSearchQuery}
      />

      {!isSearching ? (
        <>
          {/* Homepage */}
          <div className="mb-5">
            <Carousel />
          </div>

          {/* Newsletter Section */}
          <section className="bg-light py-5 mt-5">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-md-6 text-center">
                  <h3 className="fw-bold mb-3">Subscribe to Our Newsletter</h3>
                  <p className="text-muted mb-4">
                    Get updates on new arrivals, special offers and more
                  </p>
                  <form onSubmit={handleSubscribe}>
                    <div className="input-group mb-3">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control rounded-start"
                        placeholder="Your email address"
                      />
                      <button
                        className="btn btn-dark rounded-end"
                        type="submit"
                      >
                        Subscribe
                      </button>
                    </div>
                  </form>
                  {statusMessage && (
                    <p className="mt-2 text-muted">{statusMessage}</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        // 🔹 Search Results Page with Filters
        <section className="container my-5">
          <h2 className="fw-bold mb-4">Search Results</h2>

          <div className="row">
            {/* Sidebar Filters */}
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
                    setSortOrder("");
                  }}
                >
                  Reset Filters
                </button>
              </div>
            </div>

            {/* Product Results */}
            <div className="col-md-9">
              <div className="row g-4">
                {filteredResults.length > 0 ? (
                  filteredResults.map((product) => (
                    <div key={product._id} className="col-md-4">
                      <ProductCard product={product} />
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No products found.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
