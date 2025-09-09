import React, { useContext } from "react";
import { CartContext } from "../contexts/CartContex";
function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  return (
    <div className="card h-100 shadow-sm category-card px-4">
      {/* Image section */}
      <img
        src={product.image || product.images?.[0] || "/placeholder.png"}
        alt={product.name}
        className="card-img-top product-img"
        style={{ objectFit: "cover", height: "400px" }}
      />

      {/* Card body */}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text text-muted mb-2">{product.category}</p>
        <p className="card-text fw-bold">₹{product.price}</p>

        {/* Push button to bottom */}
        <div className="mt-auto">
          <button
            className="btn btn-outline-primary w-100"
            onClick={() => addToCart(product)}
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
