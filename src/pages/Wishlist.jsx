import React, { useContext, useState } from "react";
import Navbar from "../Components/Navbar";
import { WishlistContext } from "../contexts/WishlistContext";
import { CartContext } from "../contexts/CartContex";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");

  const moveToCart = () => {
    if (!selectedSize) {
      alert("⚠️ Please select a size before adding to cart.");
      return;
    }
    addToCart({ ...selectedItem, selectedSize });
    removeFromWishlist(selectedItem.id);
    setSelectedItem(null); // close modal
    setSelectedSize("");
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
                      <p className="fw-bold mb-2">₹{item.price}</p>

                      <div className="mt-auto d-flex gap-2">
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeFromWishlist(item.id)}
                        >
                          Remove
                        </button>

                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => setSelectedItem(item)}
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

  {/* Size Selection Modal */}
{selectedItem && (
  <div
    className="modal fade show"
    style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content p-3">
        <h5>Select Size for {selectedItem.name}</h5>

        <div className="d-flex flex-wrap gap-2 my-3">
          {(selectedItem.sizes && selectedItem.sizes.length > 0
            ? selectedItem.sizes
            : ["Free Size"] // fallback
          ).map((size) => (
            <button
              key={size}
              className={`btn ${
                selectedSize === size ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button
            className="btn btn-secondary"
            onClick={() => setSelectedItem(null)}
          >
            Cancel
          </button>
          <button className="btn btn-success" onClick={moveToCart}>
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
