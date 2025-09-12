import { useEffect, useState } from "react";
import Navbar from "./Components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles.css";
import Carousel from "./Components/Carousel";
import kids from "./assets/kids.jpg";
import emailjs from "emailjs-com";
import { Link } from "react-router-dom";
import ProductCard from "./Components/ProductCard";

export default function App() {
  const [products, setProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  // Filters
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState("");

  // Fetch products for homepage
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

  // Toggle category filter
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category) // remove
        : [...prev, category] // add
    );
  };

  // Apply filters on search results
  const filteredResults = searchResults
    .filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((product) => {
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(product.category)
      ) {
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

      {/* Conditional Rendering */}
      {!isSearching ? (
        <>
          {/* Homepage */}
          <div className="mb-5">
            <Carousel />
          </div>

          {/* Shop by Category */}
          <section className="container my-5">
            <h2 className="text-center mb-4 fw-bold display-5">
              Shop by Category
            </h2>
            <div className="row g-4">
              {/* Men */}
              <div className="col-md-3">
                <div className="card category-card border-0 shadow-sm h-100 text-center overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=500&q=80"
                    className="card-img-top category-img img-fluid"
                    alt="Men"
                  />
                  <div className="card-body">
                    <h5 className="card-title fw-bold">Men</h5>
                    <Link to="/category/Men" className="btn btn-dark btn-sm px-4">
                      Explore
                    </Link>
                  </div>
                </div>
              </div>
              {/* Women */}
              <div className="col-md-3">
                <div className="card category-card border-0 shadow-sm h-100 text-center overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1617922001439-4a2e6562f328?auto=format&fit=crop&w=600&q=60"
                    className="card-img-top category-img img-fluid"
                    alt="Women"
                  />
                  <div className="card-body">
                    <h5 className="card-title fw-bold">Women</h5>
                    <Link to="/category/Women" className="btn btn-dark btn-sm px-4">
                      Explore
                    </Link>
                  </div>
                </div>
              </div>
              {/* Kids */}
              <div className="col-md-3">
                <div className="card category-card border-0 shadow-sm h-100 text-center overflow-hidden">
                  <img
                    src={kids}
                    className="card-img-top category-img img-fluid"
                    alt="Kids"
                  />
                  <div className="card-body">
                    <h5 className="card-title fw-bold">Kids</h5>
                    <Link to="/category/Kids" className="btn btn-dark btn-sm px-4">
                      Explore
                    </Link>
                  </div>
                </div>
              </div>
              {/* Accessories */}
              <div className="col-md-3">
                <div className="card category-card border-0 shadow-sm h-100 text-center overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=500&q=80"
                    className="card-img-top category-img img-fluid"
                    alt="Accessories"
                  />
                  <div className="card-body">
                    <h5 className="card-title fw-bold">Accessories</h5>
                    <Link
                      to="/category/Accessories"
                      className="btn btn-dark btn-sm px-4"
                    >
                      Explore
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Must-Have Collections */}
            <div className="row g-4 mt-5">
              <h2 className="text-center mb-4 fw-bold display-5">
                Must-Have Collections
              </h2>

              <div className="col-md-6 category-card">
                <div className="card border-0 shadow-sm h-100 d-flex flex-row align-items-center p-3">
                  <div className="flex-shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1625589562833-ab351a69f5a5?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0"
                      alt="Casual Essentials"
                      style={{
                        width: "120px",
                        height: "150px",
                        objectFit: "cover",
                      }}
                      className="rounded"
                    />
                  </div>
                  <div className="ms-3">
                    <p className="text-uppercase small mb-1 text-muted">
                      Trending Now
                    </p>
                    <h5 className="fw-bold">Casual Essentials</h5>
                    <p className="text-muted mb-2">
                      Discover everyday essentials designed for comfort and style.
                    </p>
                    <Link
                      to="/category/Casual Essentials"
                      className="btn btn-dark btn-sm px-4"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-md-6 category-card">
                <div className="card border-0 shadow-sm h-100 d-flex flex-row align-items-center p-3">
                  <div className="flex-shrink-0">
                    <img
                      src="https://plus.unsplash.com/premium_photo-1720798654137-f6482c3ee1a2?q=80&w=1149&auto=format&fit=crop&ixlib=rb-4.1.0"
                      alt="Festive Collection"
                      style={{
                        width: "120px",
                        height: "150px",
                        objectFit: "cover",
                      }}
                      className="rounded"
                    />
                  </div>
                  <div className="ms-3">
                    <p className="text-uppercase small mb-1 text-muted">
                      Exclusive
                    </p>
                    <h5 className="fw-bold">Festive Collection</h5>
                    <p className="text-muted mb-2">
                      Dress to impress with our latest party wear outfits.
                    </p>
                    <Link
                      to="/category/Festive Collection"
                      className="btn btn-dark btn-sm px-4"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Newsletter */}
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

                {/* Category checkboxes */}
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
                    setSelectedCategories([]);
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
