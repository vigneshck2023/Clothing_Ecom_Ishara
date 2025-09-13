// Step3Review.js
import React, { useEffect, useState } from "react";

const reviewItems = ({ onBack }) => {
  const [user, setUser] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("userDetails")) || {});
    setAddresses(JSON.parse(localStorage.getItem("userAddresses")) || []);
    setCart(JSON.parse(localStorage.getItem("cartItems")) || []);
  }, []);

  return (
    <div>
      <h2>Step 3: Review & Confirm</h2>
      <h3>User Details</h3>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>

      <h3>Addresses</h3>
      <ul>
        {addresses.map((addr, index) => (
          <li key={index}>{addr}</li>
        ))}
      </ul>

      <h3>Products</h3>
      <ul>
        {cart.map((item, index) => (
          <li key={index}>
            {item.name} - {item.quantity}
          </li>
        ))}
      </ul>

      <button onClick={onBack}>Back</button>
      <button>Place Order</button>
    </div>
  );
};

export default reviewItems;
