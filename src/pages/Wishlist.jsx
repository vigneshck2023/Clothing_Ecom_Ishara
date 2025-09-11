import React, { useContext, useState } from "react";
import Navbar from "../Components/Navbar";
import { WishlistContext } from "../contexts/WishlistContext";
import { CartContext } from "../contexts/CartContext";
import { toast } from "react-toastify";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");

  const moveToCart = (item) => {
    // If the item has a selectedSize, use it directly
    if (item.selectedSize && item.selectedSize !== "Free Size") {
      addToCart({ ...item, qty: 1 });
      removeFromWishlist(item.id, item.selectedSize);
      toast.success("Moved to Cart 🛒");
      return;
    }

    // If no size is selected but product has sizes → show modal
    if (item.sizes?.length && item.sizes[0] !== "Free Size" && !selectedSize) {
      setSelectedItem(item);
      return;
    }

    // For items without sizes or Free Size items
    const sizeToUse = item.selectedSize || selectedSize || (item.sizes?.[0] || "Free Size");
    addToCart({ ...item, selectedSize: sizeToUse, qty: 1 });
    removeFromWishlist(item.id, sizeToUse);
    toast.success("Moved to Cart 🛒");
  };

  const confirmSizeForCart = () => {
    if (!selectedSize) {
      alert("⚠️ Please select a size.");
      return;
    }
    
    addToCart({ ...selectedItem, selectedSize, qty: 1 });
    removeFromWishlist(selectedItem.id, selectedSize);

    setSelectedItem(null);
    setSelectedSize("");
    toast.success("Moved to Cart 🛒");
  };

  const removeFromWishlistHandler = (item) => {
    const sizeToUse = item.selectedSize || (item.sizes?.[0] || "Free Size");
    removeFromWishlist(item.id, sizeToUse);
  };

  return (
    <>
      <Navbar />
      <div className="container my-4">
        <h2 className="mb-4 fw-bold">Your Wishlist</h2>

        {wishlistItems.length > 0 ? (
          <div className="row g-3">
            {wishlistItems.map((item, index) => (
              <div key={index} className="col-12">
                <div className="card shadow-sm p-2">
                  <div className="d-flex align-items-center">
                    <div
                      className="me-3"
                      style={{ width: "120px", flexShrink: 0 }}
                    >
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
                      {item.selectedSize && item.selectedSize !== "Free Size" && (
                        <p className="text-muted small mb-1">
                          Size: {item.selectedSize}
                        </p>
                      )}
                      <p className="fw-bold mb-2">₹{item.price}</p>

                      <div className="mt-auto d-flex gap-2">
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeFromWishlistHandler(item)}
                        >
                          Remove
                        </button>

                        <button
                          className="btn btn-outline-primary btn-sm"
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

      {/* Size Selection Modal for items without size */}
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
                <button className="btn btn-secondary" onClick={() => {
                  setSelectedItem(null);
                  setSelectedSize("");
                }}>
                  Cancel
                </button>
                <button className="btn btn-success" onClick={confirmSizeForCart}>
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

export default Wishlist;