import React, { useContext } from "react";
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

  // Ensure product has a consistent id to compare
  const productId = product.id || product._id || product.name;

  const isInWishlist = wishlistItems.some((item) => item.id === productId);

  const toggleWishlist = (e) => {
    e.stopPropagation(); // prevent triggering parent clicks
    if (isInWishlist) {
      removeFromWishlist(productId);
      toast.info("Removed from Wishlist ❤️", { autoClose: 1500 });
    } else {
      addToWishlist({ ...product, id: productId });
      toast.success("Added to Wishlist ❤️", { autoClose: 1500 });
    }
  };

  return (
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
            onClick={() => {
              addToCart(product);
              toast.success("Added to Cart 🛒", { autoClose: 1500 });
            }}
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
  );
}

export default ProductCard;
