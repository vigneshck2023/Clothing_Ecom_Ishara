import React, { useState } from "react";
import Navbar from "../Components/Navbar";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  return (
    <>
      <Navbar />
      <div className="container my-4">
        <h2 className="mb-4">Your Cart</h2>
        {cartItems.length > 0 ? (
          <div className="row">
            {cartItems.map((item, index) => (
              <div key={index} className="col-md-4 mb-3">
                <div className="card">
                  <img
                    src={item.image}
                    className="card-img-top"
                    alt={item.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text">Price: ${item.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted fs-5">
            No items present in your cart.
          </p>
        )}
      </div>
    </>
  );
};

export default Cart;
