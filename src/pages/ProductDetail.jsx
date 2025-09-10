import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { CartContext } from "../contexts/CartContex";
import { WishlistContext } from "../contexts/WishlistContext";
import { toast } from "react-toastify";

function ProductDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { addToCart, removeFromCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");

  const cartItem = location.state?.cartItem; // prefill if navigating from cart

  useEffect(() => {
    fetch("https://project-ishara.vercel.app/api/products")
      .then((res) => res.json())
      .then((data) => {
        const products = data?.data?.products || [];
        let found = products.find(
          (p) => p.id === id || p._id === id || p.name === id
        );
        if (cartItem) found = cartItem; // override if editing cart item
        if (found) {
          setProduct(found);
          setMainImage(found.images?.[0] || "");
          setSelectedSize(cartItem?.selectedSize || found.selectedSize || "");
          setQuantity(cartItem?.qty || 1);
        }
      })
      .catch(console.error);
  }, [id, cartItem]);

  if (!product)
    return (
      <p className="text-center text-muted fw-semibold my-5 fs-5">Loading...</p>
    );

  const handleAddOrUpdateCart = () => {
    if (product.sizes?.length && !selectedSize) {
      toast.error("Please select a size!");
      return;
    }

    // Remove old cart entry if editing
    if (cartItem) removeFromCart(cartItem.id, cartItem.selectedSize);

    addToCart({ ...product, qty: quantity, selectedSize });
    toast.success(cartItem ? "Cart updated!" : "Added to cart!");
  };

  const handleMoveToWishlist = () => {
    if (product.sizes?.length && !selectedSize) {
      toast.error("Please select a size!");
      return;
    }

    if (cartItem) removeFromCart(cartItem.id, cartItem.selectedSize);
    addToWishlist({ ...product, selectedSize, qty: undefined });
    toast.success("Moved to Wishlist!");
    navigate("/cart");
  };

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <div className="row">
          {/* Left side: images */}
          <div className="col-md-6 d-flex">
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

          {/* Right side: product details */}
          <div className="col-md-6">
            <h3>{product.name}</h3>
            <h4 className="text-danger">₹{product.price}</h4>

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
                className="btn btn-primary me-3"
                onClick={handleAddOrUpdateCart}
              >
                {cartItem ? "Update Cart" : "Add to Cart"}
              </button>
              <button
                className="btn btn-outline-danger"
                onClick={handleMoveToWishlist}
              >
                Move to Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetail;
