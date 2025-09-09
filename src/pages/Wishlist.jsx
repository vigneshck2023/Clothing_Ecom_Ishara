import React, { useContext } from "react";
import Navbar from "../Components/Navbar";
import { WishlistContext } from "../contexts/WishlistContext";
import { CartContext } from "../contexts/CartContex";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const moveToCart = (item) => {
    addToCart(item); // Add item to cart
    removeFromWishlist(item.id); // Remove from wishlist
  };

  return (
    <>
      <Navbar />
      <div className="container my-4">
        <h2 className="mb-4">Your Wishlist</h2>
        {wishlistItems.length > 0 ? (
          <div className="row g-3">
            {wishlistItems.map((item, index) => (
              <div key={index} className="col-12">
                <div className="card shadow-sm p-2">
                  <div className="d-flex align-items-center">
                    {/* Image Left */}
                    <div
                      className="me-3"
                      style={{ width: "120px", flexShrink: 0 }}
                    >
                      <img
                        src={
                          item.image || item.images?.[0] || "/placeholder.png"
                        }
                        alt={item.name}
                        className="img-fluid rounded"
                        style={{
                          objectFit: "contain",
                          height: "100px",
                          width: "100%",
                          backgroundColor: "#f8f9fa",
                          padding: "6px",
                        }}
                      />
                    </div>

                    {/* Details Right */}
                    <div className="flex-grow-1 d-flex flex-column">
                      <h6 className="mb-1">{item.name}</h6>
                      <p className="fw-bold mb-2">₹{item.price}</p>

                      {/* Buttons */}
                      <div className="mt-auto d-flex gap-2">
                        <button
                          className="btn btn-outline-danger btn-sm"
                          style={{
                            borderRadius: "25px",
                            fontWeight: "500",
                            fontSize: "14px",
                            padding: "6px 12px",
                          }}
                          onClick={() => removeFromWishlist(item.id)}
                        >
                          Remove
                        </button>

                        <button
                          className="btn btn-outline-primary btn-sm"
                          style={{
                            borderRadius: "25px",
                            fontWeight: "500",
                            fontSize: "14px",
                            padding: "6px 12px",
                          }}
                          onClick={() => moveToCart(item)}
                        >
                          Move to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted fs-5">
            No items present in your wishlist.
          </p>
        )}
      </div>
    </>
  );
};

export default Wishlist;
