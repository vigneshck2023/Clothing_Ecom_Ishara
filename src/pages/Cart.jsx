import React, { useContext, useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import { CartContext } from "../contexts/CartContext";
import { WishlistContext } from "../contexts/WishlistContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import AddressForm from "../Components/AddressForm";

const Cart = () => {
  const { cartItems, removeFromCart, increaseQty, decreaseQty, clearCart } =
    useContext(CartContext);
  const { addToWishlist, wishlistItems, removeFromWishlist } =
    useContext(WishlistContext);
  const navigate = useNavigate();

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");

  // ---------------- Address Management ----------------
  const [addresses, setAddresses] = useState(() => {
    return JSON.parse(localStorage.getItem("addresses")) || [];
  });
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem("addresses", JSON.stringify(addresses));
  }, [addresses]);

  const addOrUpdateAddress = () => {
    if (
      !newAddress.name ||
      !newAddress.phone ||
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
      toast.success("Address updated!", {autoClose: 2000});
    } else {
      updated = [...addresses, newAddress];
      toast.success("Address added!", {autoClose: 2000});
    }

    setAddresses(updated);
    setNewAddress({
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });
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

  // ---------------- Cart Logic ----------------
  const moveToWishlist = (item) => {
    const sizeToUse = item.selectedSize || selectedSize;
    if (!sizeToUse && item.sizes?.length) {
      setSelectedItem(item);
      return;
    }
    const productId = item.id || item._id || item.name;
    const existing = wishlistItems.find(
      (i) => i.id === productId && i.selectedSize === sizeToUse
    );
    if (!existing) {
      addToWishlist({ ...item, selectedSize: sizeToUse, qty: undefined });
      toast.success("Moved to Wishlist ❤️");
    }
    removeFromCart(item.id, item.selectedSize || sizeToUse);
  };

  const confirmSizeForWishlist = () => {
    if (!selectedSize) {
      alert("⚠️ Please select a size.");
      return;
    }
    const productId = selectedItem.id || selectedItem._id || selectedItem.name;
    const existing = wishlistItems.find(
      (i) => i.id === productId && i.selectedSize === selectedSize
    );
    if (!existing) {
      addToWishlist({ ...selectedItem, selectedSize, qty: undefined });
      toast.success("Moved to Wishlist ❤️");
    }
    removeFromCart(selectedItem.id, selectedItem.selectedSize || selectedSize);
    setSelectedItem(null);
    setSelectedSize("");
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
    if (cartItems.length === 0) {
      toast.error("⚠️ Your cart is empty");
      return;
    }
    if (selectedAddress === null) {
      toast.error("⚠️ Please select a delivery address");
      return;
    }
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
              {/* ---------------- Cart Items ---------------- */}
              {cartItems.map((item, index) => (
                <div key={index} className="col-12 mb-4">
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
                            onClick={() => decreaseQty(item.id, item.selectedSize)}
                          >
                            -
                          </button>
                          <span className="mx-2 fw-bold">{item.qty}</span>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => increaseQty(item.id, item.selectedSize)}
                          >
                            +
                          </button>
                        </div>
                        <div className="mt-auto d-flex gap-2">
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => removeFromCart(item.id, item.selectedSize)}
                          >
                            Remove
                          </button>
                          <button
                            className="btn btn-outline-primary btn-sm"
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

              {/* ---------------- Address Section ---------------- */}
              <div className="card shadow-sm p-3 mt-4">
  <h5 className="mb-3">Delivery Addresses</h5>

  {addresses.length > 0 ? (
    <div className="mb-3">
      {addresses.map((addr, index) => (
        <div
          key={index}
          className={`p-2 border rounded mb-2 ${
            selectedAddress === index ? "border-primary" : ""
          }`}
        >
          <div>
            <strong>{addr.name}</strong> ({addr.phone})
            <p className="mb-1 small">
              {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
            </p>
          </div>

          {/* Responsive buttons */}
          <div className="d-flex flex-wrap gap-2 mt-2">
            <button
              className="btn btn-sm btn-outline-primary w-100 w-md-auto"
              onClick={() => setSelectedAddress(index)}
            >
              {selectedAddress === index ? "Selected" : "Select"}
            </button>
            <button
              className="btn btn-sm btn-outline-warning w-100 w-md-auto"
              onClick={() => editAddress(index)}
            >
              Edit
            </button>
            <button
              className="btn btn-sm btn-outline-danger w-100 w-md-auto"
              onClick={() => removeAddress(index)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-muted">No saved addresses. Add one below.</p>
  )}

  {/* Reusable AddressForm */}
  <AddressForm
    newAddress={newAddress}
    setNewAddress={setNewAddress}
    addAddress={addOrUpdateAddress}
    editMode={editIndex !== null}
  />
</div>

            </div>

            {/* ---------------- Price Details ---------------- */}
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
                <button className="btn btn-primary w-100" onClick={handlePlaceOrder}>
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
                <button className="btn btn-secondary" onClick={() => setSelectedItem(null)}>
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
    </>
  );
};

export default Cart;
