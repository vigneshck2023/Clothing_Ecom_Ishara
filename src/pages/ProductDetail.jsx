import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { CartContext } from "../contexts/CartContext";
import { WishlistContext } from "../contexts/WishlistContext";
import { toast } from "react-toastify";

function ProductDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { addToCart, removeFromCart } = useContext(CartContext);
  const { addToWishlist, wishlistItems, removeFromWishlist } =
    useContext(WishlistContext);

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");

  const cartItem = location.state?.cartItem;

  useEffect(() => {
    fetch("https://project-ishara.vercel.app/api/products")
      .then((res) => res.json())
      .then((data) => {
        const products = data?.data?.products || [];
        let found = products.find(
          (p) => p.id === id || p._id === id || p.name === id
        );
        if (cartItem) found = cartItem;
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

    const productToAdd = { ...product, qty: quantity, selectedSize };
    addToCart(productToAdd);

    const productId = product.id || product._id || product.name;
    const wishItem = wishlistItems.find(
      (i) => i.id === productId && i.selectedSize === selectedSize
    );
    if (wishItem) removeFromWishlist(productId, selectedSize);

    toast.success(cartItem ? "Cart updated!" : "Added to cart!");
  };

  const handleMoveToWishlist = () => {
    if (product.sizes?.length && !selectedSize) {
      toast.error("Please select a size!");
      return;
    }

    const productId = product.id || product._id || product.name;
    const wishItem = wishlistItems.find(
      (i) => i.id === productId && i.selectedSize === selectedSize
    );
    if (!wishItem) {
      addToWishlist({ ...product, selectedSize, qty: undefined });
    }

    if (cartItem) removeFromCart(cartItem.id, cartItem.selectedSize);

    toast.success("Moved to Wishlist!");
    navigate("/cart");
  };

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <div className="row flex-column flex-md-row">
{/* Left side: images */}
<div className="col-12 col-md-6 d-flex flex-column flex-md-row">
  {/* Thumbnails - no scroll */}
  <div
    className="d-flex flex-row flex-md-column mb-3 mb-md-0"
    style={{ gap: "10px" }}
  >
    {product.images?.map((img, i) => (
      <img
        key={i}
        src={img}
        alt={`thumb-${i}`}
        onClick={() => setMainImage(img)}
        className={`border ${
          mainImage === img ? "border-dark" : "border-secondary"
        }`}
        style={{
          width: "65px",
          height: "65px",
          cursor: "pointer",
          borderRadius: "6px",
          objectFit: "cover",
        }}
      />
    ))}
  </div>

  {/* Main image */}
  <div className="flex-grow-1 d-flex justify-content-center align-items-center">
    <img
  src={mainImage}
  alt="main"
  className="img-fluid"
  style={{
    maxHeight: "500px",
    width: "60%",
    objectFit: "cover",
    borderRadius: "0px",
    border: "none",
  }}
/>
  </div>
</div>



          {/* Right side: product details */}
          <div className="col-12 col-md-6 mt-4 mt-md-0">
            <h3>{product.name}</h3>
            <h4 className="text-danger">₹{product.price}</h4>

            <h5 className="mt-4">Description:</h5>
            <ul style={{ textAlign: "justify" }}>
              {Array.isArray(product.description)
                ? product.description.map((line, i) => <li key={i}>{line}</li>)
                : typeof product.description === "string"
                ? product.description
                    .split("\n")
                    .map((line, i) => <li key={i}>{line}</li>)
                : <li>No description available.</li>}
            </ul>

            <div className="d-flex flex-wrap my-3" style={{ gap: "20px" }}>
              <div>🚚 Free Delivery</div>
              <div>💳 Secure Payment</div>
              <div>↩️ 10 Days Returnable</div>
            </div>

            {/* Quantity */}
            <div className="my-3 d-flex align-items-center">
              <label className="me-2 mb-0">Quantity:</label>
              <input
                type="number"
                value={quantity}
                min={1}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="form-control d-inline-block"
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
                    className={`btn btn-sm me-2 mb-2 ${
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
            <div className="my-4 d-flex flex-wrap" style={{ gap: "10px" }}>
              <button
                className="btn btn-primary"
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
