import React, { useContext } from "react";
import Navbar from "../Components/Navbar";
import { CartContext } from "../contexts/CartContex";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { WishlistContext } from "../contexts/WishlistContext";

const Cart = () => {
  const { cartItems, removeFromCart, increaseQty, decreaseQty, clearCart } =
    useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();
  const moveToWishlist = (item) => {
    addToWishlist(item);
    removeFromCart(item.id);
  };
  const totalMRP = cartItems.reduce(
    (total, item) => total + item.originalPrice * item.qty,
    0
  );
  const totalDiscount = cartItems.reduce(
    (total, item) => total + (item.originalPrice - item.price) * item.qty,
    0
  );
  const finalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  const handlePlaceOrder = () => {
    toast.success("🎉 Order placed successfully!");
    clearCart();
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <>
      <Navbar />
      <div className="container my-4">
        <h2 className="mb-4">Your Cart</h2>

        {cartItems.length > 0 ? (
          <div className="row g-3">
            {/* 🛒 Cart Items */}
            <div className="col-lg-8">
              {cartItems.map((item, index) => (
                <div key={index} className="col-12 mb-3">
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
                        <p className="text-muted small mb-1">{item.category}</p>
                        <p className="fw-bold mb-2">₹{item.price * item.qty}</p>

                        {/* Qty Controls */}
                        <div className="d-flex align-items-center mb-2">
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => decreaseQty(item.id)}
                          >
                            -
                          </button>
                          <span className="mx-2 fw-bold">{item.qty}</span>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => increaseQty(item.id)}
                          >
                            +
                          </button>
                        </div>

                        {/* Remove Button */}
                        <div className="mt-auto d-flex gap-2">
                          <button
                            className="btn btn-outline-danger btn-sm"
                            style={{
                              borderRadius: "25px",
                              fontWeight: "500",
                              fontSize: "14px",
                              padding: "6px 12px",
                            }}
                            onClick={() => removeFromCart(item.id)}
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
                            onClick={() => moveToWishlist(item)}
                          >
                            Move to Wishlist
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 💳 Price Details */}
            <div className="col-lg-4">
              <div className="card shadow-sm p-3">
                <h5 className="mb-3">Price Details</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span>Total MRP</span>
                  <span>₹{totalMRP}</span>
                </div>
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>Discount</span>
                  <span>-₹{totalDiscount}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold mb-3">
                  <span>Total Amount</span>
                  <span>₹{finalPrice}</span>
                </div>
                <button
                  className="btn btn-primary w-100"
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-muted fs-5">
            No items present in your cart.
          </p>
        )}
      </div>

      {/* Toast Notifications */}
      <ToastContainer position="bottom-right" autoClose={2000} />
    </>
  );
};

export default Cart;
