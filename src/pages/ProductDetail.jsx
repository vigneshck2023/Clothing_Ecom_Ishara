import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import Navbar from "../Components/Navbar";
import { CartContext } from "../contexts/CartContex";
import { WishlistContext } from "../contexts/WishlistContext";
import { toast } from "react-toastify";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [similarProducts, setSimilarProducts] = useState([]);

  const { addToCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://project-ishara.vercel.app/api/products")
      .then((res) => res.json())
      .then((data) => {
        const products = data?.data?.products || [];
        const found = products.find(
          (p) => p.id === id || p._id === id || p.name === id
        );
        if (found) {
          setProduct(found);
          setMainImage(found.images?.[0] || "");
          // Get similar products (same category, exclude current)
          const similar = products.filter(
            (p) => p.category === found.category && p.id !== found.id
          );
          setSimilarProducts(similar);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center text-muted fw-semibold my-5 fs-5">
  Loading...
</p>
  if (!product) return <p>Product not found</p>;

  const handleAddToCart = () => {
    if (product.sizes && !selectedSize) {
      toast.error("Please select a size!");
      return;
    }
    addToCart({ ...product, qty: quantity, selectedSize });
    toast.success(`${product.name} added to cart!`);
  };

  const handleAddToWishlist = () => {
    addToWishlist(product);
    toast.success(`${product.name} added to wishlist!`);
  };

  const handleBuyNow = () => {
    if (product.sizes && !selectedSize) {
      toast.error("Please select a size!");
      return;
    }
    addToCart({ ...product, qty: quantity, selectedSize });
    navigate("/cart");
  };

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <div className="row">
          {/* Left: Image Gallery */}
          <div className="col-md-6 d-flex">
            {/* Thumbnails */}
            <div className="d-flex flex-column me-3" style={{ gap: "10px" }}>
              {product.images?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`thumb-${i}`}
                  onClick={() => setMainImage(img)}
                  style={{
                    width: "60px",
                    height: "55px",
                    objectFit: "cover",
                    border:
                      mainImage === img ? "2px solid #000" : "1px solid #ccc",
                    borderRadius: "6px",
                    cursor: "pointer",
                    padding: "2px",
                  }}
                />
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-grow-1 d-flex justify-content-center align-items-center">
              <img
                src={mainImage}
                alt="main"
                style={{
                  width: "100%",
                  maxWidth: "375px",
                  height: "500px",
                  objectFit: "contain",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="col-md-6">
            <h3>{product.name}</h3>

            {/* Ratings */}
            <div className="d-flex align-items-center mb-2">
              {[...Array(5)].map((_, i) =>
                i < Math.floor(product.rating || 0) ? (
                  <FaStar key={i} color="gold" />
                ) : (
                  <FaRegStar key={i} color="gold" />
                )
              )}
              <span className="ms-2">{product.rating || "No rating"}</span>
            </div>

            {/* Price */}
            <h4 className="text-danger">
              ₹{product.price}{" "}
              <small className="text-muted text-decoration-line-through">
                ₹{product.originalPrice || product.price * 2}
              </small>{" "}
              <span className="text-success">
                {product.discount || "50%"} off
              </span>
            </h4>

            {/* Quantity */}
            <div className="my-3">
              <label className="me-2">Quantity:</label>
              <input
                type="number"
                value={quantity}
                min={1}
                onChange={(e) => setQuantity(Number(e.target.value))}
                style={{ width: "70px" }}
              />
            </div>

            {/* Sizes */}
            {product.sizes && (
              <div className="my-3">
                <label className="me-2">Size:</label>
                {product.sizes.map((size, i) => (
                  <button
                    key={i}
                    className={`btn btn-sm me-2 ${
                      selectedSize === size ? "btn-dark" : "btn-outline-dark"
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}

            {/* Buttons */}
            <div className="my-4">
              <button
                className="btn btn-primary me-3 px-4"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
              <button
                className="btn btn-outline-dark px-4"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
              <button
                className="btn btn-outline-danger px-4 ms-2"
                onClick={handleAddToWishlist}
              >
                ❤️ Wishlist
              </button>
            </div>

            {/* Delivery Info */}
            <div className="d-flex flex-wrap my-3" style={{ gap: "20px" }}>
              <div>🚚 Free Delivery</div>
              <div>💳 Secure Payment</div>
              <div>↩️ 10 Days Returnable</div>
            </div>

            {/* Description */}
            <h5 className="mt-4">Description:</h5>
            <ul>
              {Array.isArray(product.description) ? (
                product.description.map((line, i) => <li key={i}>{line}</li>)
              ) : typeof product.description === "string" ? (
                product.description
                  .split("\n")
                  .map((line, i) => <li key={i}>{line}</li>)
              ) : (
                <li>No description available.</li>
              )}
            </ul>
          </div>
        </div>

        {similarProducts.length > 0 && (
          <div className="my-5">
            <h4>Similar Products</h4>
            <div className="row">
              {similarProducts.map((item) => (
                <div key={item.id} className="col-md-3 mb-3">
                  <div className="card">
                    <img
                      src={item.images?.[0] || "/placeholder.png"}
                      alt={item.name}
                      className="card-img-top"
                      style={{ objectFit: "contain", height: "200px" }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{item.name}</h5>
                      <p className="card-text">₹{item.price}</p>
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => navigate(`/product/${item.id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ProductDetail;
