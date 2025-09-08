import React from "react";

function ProductCard({ product }) {
  return (
    <div className="card h-100 shadow-sm category-card">
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
          <button className="btn btn-primary w-100">View Details</button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
