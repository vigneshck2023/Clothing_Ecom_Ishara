import React, { useContext, useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import { CartContext } from "../contexts/CartContext";
import { WishlistContext } from "../contexts/WishlistContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, clearCart, removeFromCart } = useContext(CartContext);
  const { addToWishlist, wishlistItems } = useContext(WishlistContext);
  const navigate = useNavigate();

  // ---------------- Step Management ----------------
  const [currentStep, setCurrentStep] = useState(1);

  // ---------------- User Details ----------------
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Don't auto-persist user details → only when user enters new details
  useEffect(() => {
    setUserDetails({ name: "", email: "", phone: "" });
  }, []);

  // ---------------- Address Management ----------------
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const savedAddresses = localStorage.getItem("addresses");
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("addresses", JSON.stringify(addresses));
  }, [addresses]);

  const addOrUpdateAddress = () => {
    if (
      !newAddress.address ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.pincode
    ) {
      toast.error("Please fill all fields");
      return;
    }
    let updated;
    if (editIndex !== null) {
      updated = [...addresses];
      updated[editIndex] = newAddress;
      toast.success("Address updated!", { autoClose: 1500 });
    } else {
      updated = [...addresses, newAddress];
      toast.success("Address added!", { autoClose: 1500 });
    }
    setAddresses(updated);
    setNewAddress({ address: "", city: "", state: "", pincode: "" });
    setEditIndex(null);
  };

  const editAddress = (index) => {
    setNewAddress(addresses[index]);
    setEditIndex(index);
  };

  const removeAddress = (index) => {
    const updated = addresses.filter((_, i) => i !== index);
    setAddresses(updated);
    if (selectedAddress === index) setSelectedAddress(null);
    toast.info("Address removed");
  };

  // ---------------- Cart Totals ----------------
  const totalMRP = cartItems.reduce(
    (total, item) => total + (item.originalPrice || item.price) * item.qty,
    0,
  );
  const totalDiscount = cartItems.reduce(
    (total, item) =>
      total + ((item.originalPrice || item.price) - item.price) * item.qty,
    0,
  );
  const finalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.qty,
    0,
  );

  // ---------------- Wishlist & Remove ----------------
  const handleMoveToWishlist = (item) => {
    const exists = wishlistItems.some(
      (wish) =>
        (wish.id || wish._id || wish.name) ===
          (item.id || item._id || item.name) &&
        wish.selectedSize === item.selectedSize,
    );
    if (!exists) {
      addToWishlist(item);
      toast.success("Moved to Wishlist", { autoClose: 1500 });
    } else {
      toast.info("Already in Wishlist", { autoClose: 1500 });
    }
    removeFromCart(item.id || item._id || item.name, item.selectedSize);
  };

  const handleRemoveFromCart = (item) => {
    removeFromCart(item.id || item._id || item.name, item.selectedSize);
    toast.info("Removed from Cart");
  };

  // ---------------- Place Order ----------------
  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      toast.error("⚠️ Your cart is empty");
      return;
    }
    if (!userDetails.name || !userDetails.email || !userDetails.phone) {
      toast.error("⚠️ Please enter user details");
      return;
    }
    if (selectedAddress === null) {
      toast.error("⚠️ Please select a delivery address");
      return;
    }
    toast.success("🎉 Order placed successfully!", { autoClose: 2000 });
    clearCart();
    setTimeout(() => navigate("/"), 2000);
  };

  // ---------------- Screens ----------------
  return (
    <>
      <Navbar />
      <div className="container my-4">
        <h2 className="mb-4 fw-bold">Your Cart</h2>

        {/* Step 1 - Cart Items */}
        {currentStep === 1 && (
          <>
            {cartItems.length > 0 ? (
              <div className="row g-3 gx-4">
                <div className="col-lg-8">
                  {cartItems.map((item, index) => (
                    <div key={index} className="col-12 mb-4">
                      <div className="card shadow-sm p-2">
                        <div className="d-flex align-items-center">
                          <div
                            className="me-3"
                            style={{ width: "120px", flexShrink: 0 }}
                          >
                            <img
                              src={
                                item.image ||
                                item.images?.[0] ||
                                "/placeholder.png"
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
                          <div className="flex-grow-1 d-flex flex-column">
                            <h6 className="mb-1">{item.name}</h6>
                            {item.selectedSize && (
                              <p className="text-muted small mb-1">
                                Size: {item.selectedSize}
                              </p>
                            )}
                            <p className="fw-bold mb-2">
                              ₹{item.price * item.qty}
                            </p>

                            {/* Actions */}
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleRemoveFromCart(item)}
                              >
                                Remove
                              </button>
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleMoveToWishlist(item)}
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
                    <div className="d-flex justify-content-end">
                      <button
                        className="btn btn-primary"
                        onClick={() => setCurrentStep(2)}
                      >
                        Proceed
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-muted fs-5">
                No items present in your cart.
              </p>
            )}
          </>
        )}

        {/* Step 2 - User Details */}
        {currentStep === 2 && (
          <div className="card shadow-sm p-4">
            <h5 className="mb-3">User Details</h5>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Full Name"
              value={userDetails.name}
              onChange={(e) =>
                setUserDetails({ ...userDetails, name: e.target.value })
              }
            />
            <input
              type="email"
              className="form-control mb-2"
              placeholder="Email"
              value={userDetails.email}
              onChange={(e) =>
                setUserDetails({ ...userDetails, email: e.target.value })
              }
            />
            <input
              type="tel"
              className="form-control mb-3"
              placeholder="Phone Number"
              value={userDetails.phone}
              onChange={(e) =>
                setUserDetails({ ...userDetails, phone: e.target.value })
              }
            />
            <div className="d-flex justify-content-between">
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentStep(1)}
              >
                Back
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setCurrentStep(3)}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3 - Address */}
        {currentStep === 3 && (
          <div className="card shadow-sm p-4">
            <h5 className="mb-3">Manage Address</h5>

            {addresses.map((addr, index) => (
              <div
                key={index}
                className={`border rounded p-2 mb-2 ${
                  selectedAddress === index ? "border-primary" : ""
                }`}
              >
                <p className="mb-1">
                  {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                </p>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => setSelectedAddress(index)}
                  >
                    Deliver Here
                  </button>
                  <button
                    className="btn btn-sm btn-outline-warning"
                    onClick={() => editAddress(index)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeAddress(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Add/Edit Address */}
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Address"
              value={newAddress.address}
              onChange={(e) =>
                setNewAddress({ ...newAddress, address: e.target.value })
              }
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="City"
              value={newAddress.city}
              onChange={(e) =>
                setNewAddress({ ...newAddress, city: e.target.value })
              }
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="State"
              value={newAddress.state}
              onChange={(e) =>
                setNewAddress({ ...newAddress, state: e.target.value })
              }
            />
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Pincode"
              value={newAddress.pincode}
              onChange={(e) =>
                setNewAddress({ ...newAddress, pincode: e.target.value })
              }
            />
            <button
              className="btn btn-primary mb-3"
              onClick={addOrUpdateAddress}
            >
              {editIndex !== null ? "Update Address" : "Add Address"}
            </button>

            <div className="d-flex justify-content-between">
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentStep(2)}
              >
                Back
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setCurrentStep(4)}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 4 - Review */}
        {currentStep === 4 && (
          <div className="card shadow-sm p-4">
            <h5 className="mb-3">Review Order</h5>
            <p>
              <strong>Name:</strong> {userDetails.name}
            </p>
            <p>
              <strong>Email:</strong> {userDetails.email}
            </p>
            <p>
              <strong>Phone:</strong> {userDetails.phone}
            </p>
            <p>
              <strong>Address:</strong>{" "}
              {addresses[selectedAddress]
                ? `${addresses[selectedAddress].address}, ${addresses[selectedAddress].city}, ${addresses[selectedAddress].state} - ${addresses[selectedAddress].pincode}`
                : "Not Selected"}
            </p>
            <h6 className="mt-3">Items:</h6>
            {cartItems.map((item, index) => (
              <p key={index}>
                {item.name} (Quantity: {item.qty},
                {item.selectedSize ? ` Size: ${item.selectedSize}` : ""}) - ₹
                {item.price * item.qty}
              </p>
            ))}
            <hr />
            <p className="fw-bold">Total: ₹{finalPrice}</p>
            <div className="d-flex justify-content-between">
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentStep(3)}
              >
                Back
              </button>
              <button className="btn btn-success" onClick={handlePlaceOrder}>
                Place Order
              </button>
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="bottom-right" autoClose={1500} />
    </>
  );
};

export default Cart;