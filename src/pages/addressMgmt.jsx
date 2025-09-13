// Step2Address.js
import React, { useState, useEffect } from "react";

const addressMgmt = ({ onNext, onBack }) => {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState("");

  useEffect(() => {
    const savedAddresses = JSON.parse(localStorage.getItem("userAddresses"));
    if (savedAddresses) setAddresses(savedAddresses);
  }, []);

  const addAddress = () => {
    if (newAddress.trim() !== "") {
      const updated = [...addresses, newAddress];
      setAddresses(updated);
      localStorage.setItem("userAddresses", JSON.stringify(updated));
      setNewAddress("");
    }
  };

  const removeAddress = (index) => {
    const updated = addresses.filter((_, i) => i !== index);
    setAddresses(updated);
    localStorage.setItem("userAddresses", JSON.stringify(updated));
  };

  const editAddress = (index, updatedText) => {
    const updated = addresses.map((addr, i) =>
      i === index ? updatedText : addr
    );
    setAddresses(updated);
    localStorage.setItem("userAddresses", JSON.stringify(updated));
  };

  return (
    <div>
      <h2>Step 2: Address</h2>
      <input
        type="text"
        placeholder="Enter address"
        value={newAddress}
        onChange={(e) => setNewAddress(e.target.value)}
      />
      <button onClick={addAddress}>Add</button>

      <ul>
        {addresses.map((addr, index) => (
          <li key={index}>
            <input
              type="text"
              value={addr}
              onChange={(e) => editAddress(index, e.target.value)}
            />
            <button onClick={() => removeAddress(index)}>Remove</button>
          </li>
        ))}
      </ul>

      <button onClick={onBack}>Back</button>
      <button onClick={onNext}>Next</button>
    </div>
  );
};

export default addressMgmt;
