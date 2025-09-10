import React, { useContext, useState } from "react";
import Navbar from "../Components/Navbar";
import { CartContext } from "../contexts/CartContex";
import { WishlistContext } from "../contexts/WishlistContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, removeFromCart, increaseQty, decreaseQty, clearCart } =
    useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");

  const moveToWishlist = (item) => {
    if (!item.selectedSize && item.sizes?.length) {
      setSelectedItem(item); // prompt size selection if missing
      return;
    }
    addToWishlist({ ...item, qty: undefined });
    removeFromCart(item.id, item.selectedSize);
  };

  const confirmSizeForWishlist = () => {
    if (!selectedSize) {
      alert("⚠️ Please select a size.");
      return;
    }
    addToWishlist({ ...selectedItem, selectedSize, qty: undefined });
    removeFromCart(selectedItem.id, selectedItem.selectedSize);
    setSelectedItem(null);
    setSelectedSize("");
  };

  const goToProductDetail = (item) => {
    navigate(`/product/${item.id}`, { state: { cartItem: item } });
  };

  const totalMRP = cartItems.reduce(
    (total, item) => total + (item.originalPrice || item.price) * item.qty,
    0
  );
  const totalDiscount = cartItems.reduce(
    (total, item) =>
      total + ((item.originalPrice || item.price) - item.price) * item.qty,
    0
  );
  const finalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  const handlePlaceOrder = () => {
    toast.success("🎉 Order placed successfully!");
    clearCart();
    setTimeout(() => navigate("/"), 2000);
  };

  return (
    <>
      <Navbar />
      <div className="container my-4">
        <h2 className="mb-4 fw-bold">Your Cart</h2>

        {cartItems.length > 0 ? (
          <div className="row g-3 gx-4">
            <div className="col-lg-8">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="col-12 mb-4"
                  onClick={() => goToProductDetail(item)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card shadow-sm p-2">
                    <div className="d-flex align-items-center">
                      <div className="me-3" style={{ width: "120px", flexShrink: 0 }}>
                        <img
                          src={item.image || item.images?.[0] || "/placeholder.png"}
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

                      <div className="flex-grow-1 d-flex flex-column">
                        <h6 className="mb-1">{item.name}</h6>
                        {item.selectedSize && (
                          <p className="text-muted small mb-1">
                            Size: {item.selectedSize}
                          </p>
                        )}
                        <p className="fw-bold mb-2">₹{item.price * item.qty}</p>

                        <div className="d-flex align-items-center mb-2">
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              decreaseQty(item.id, item.selectedSize);
                            }}
                          >
                            -
                          </button>
                          <span className="mx-2 fw-bold">{item.qty}</span>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              increaseQty(item.id, item.selectedSize);
                            }}
                          >
                            +
                          </button>
                        </div>

                        <div className="mt-auto d-flex gap-2">
                          <button
                            className="btn btn-outline-danger btn-sm"
                            style={{
                              borderRadius: "25px",
                              fontWeight: "500",
                              fontSize: "14px",
                              padding: "6px 12px",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromCart(item.id, item.selectedSize);
                            }}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              moveToWishlist(item);
                            }}
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

      {/* Size selection modal */}
      {selectedItem && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-3">
              <h5>Select Size for {selectedItem.name}</h5>
              <div className="d-flex flex-wrap gap-2 my-3">
                {(selectedItem.sizes?.length ? selectedItem.sizes : ["Free Size"]).map(
                  (size) => (
                    <button
                      key={size}
                      className={`btn ${
                        selectedSize === size ? "btn-primary" : "btn-outline-primary"
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  )
                )}
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedItem(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-success" onClick={confirmSizeForWishlist}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" autoClose={2000} />
    </>
  );
};

export default Cart;
