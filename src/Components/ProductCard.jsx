import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../contexts/CartContex";
import { WishlistContext } from "../contexts/WishlistContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const { wishlistItems, addToWishlist, removeFromWishlist } =
    useContext(WishlistContext);

  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");

  const productId = product.id || product._id || product.name;
  const isInWishlist = wishlistItems.some((item) => item.id === productId);

  const toggleWishlist = (e) => {
    e.stopPropagation();
    if (isInWishlist) {
      removeFromWishlist(productId);
      toast.info("Removed from Wishlist ❤️", { autoClose: 1500 });
    } else {
      addToWishlist({ ...product, id: productId });
      toast.success("Added to Wishlist ❤️", { autoClose: 1500 });
    }
  };

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setShowSizeModal(true);
      return;
    }

    const sizeToUse =
      selectedSize || (product.sizes?.[0] ? product.sizes[0] : "Free Size");

    addToCart({ ...product, selectedSize: sizeToUse });
    toast.success("Added to Cart 🛒", { autoClose: 1500 });
    setSelectedSize("");
  };

  const confirmSizeSelection = () => {
    if (!selectedSize) {
      alert("⚠️ Please select a size.");
      return;
    }
    addToCart({ ...product, selectedSize });
    toast.success("Added to Cart 🛒", { autoClose: 1500 });
    setSelectedSize("");
    setShowSizeModal(false);
  };

  return (
    <>
      <div
        className="card h-100 shadow-sm category-card position-relative"
        style={{
          width: "100%",
          maxWidth: "310px",
          margin: "auto",
        }}
      >
        {/* Wishlist Heart Icon */}
        <div
          onClick={toggleWishlist}
          className="position-absolute top-0 end-0 m-2 p-2 rounded-circle"
          style={{
            backgroundColor: "white",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            zIndex: 2,
          }}
        >
          {isInWishlist ? (
            <FaHeart color="red" size={20} />
          ) : (
            <FaRegHeart color="gray" size={20} />
          )}
        </div>

        {/* Image section → opens Product Detail */}
        <Link to={`/product/${productId}`}>
          <img
            src={product.image || product.images?.[0] || "/placeholder.png"}
            alt={product.name}
            className="card-img-top"
            style={{
              objectFit: "cover",
              height: "400px",
            }}
          />
        </Link>

        {/* Card body */}
        <div className="card-body d-flex flex-column">
          <Link
            to={`/product/${productId}`}
            className="text-decoration-none text-dark"
          >
            <h5 className="card-title">{product.name}</h5>
          </Link>
          <p className="card-text text-muted mb-2">{product.category}</p>
          <p className="card-text fw-bold">₹{product.price}</p>

          <div className="mt-auto">
            <button
              className="btn btn-outline-primary w-100"
              onClick={handleAddToCart}
              style={{
                borderRadius: "35px",
                fontWeight: "550",
                fontSize: "17px",
                padding: "8px",
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Size Selection Modal */}
      {showSizeModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-3">
              <h5>Select Size for {product.name}</h5>

              <div className="d-flex flex-wrap gap-2 my-3">
                {product.sizes && product.sizes.length > 0
                  ? product.sizes.map((size) => (
                      <button
                        key={size}
                        className={`btn ${
                          selectedSize === size
                            ? "btn-primary"
                            : "btn-outline-primary"
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))
                  : ["Free Size"].map((size) => (
                      <button
                        key={size}
                        className="btn btn-primary"
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowSizeModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  onClick={confirmSizeSelection}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductCard;
