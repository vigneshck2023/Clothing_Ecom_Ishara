// Step1UserDetails.js
import React, { useState, useEffect } from "react";

const userDetails = ({ onNext }) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Load existing details if available
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("userDetails"));
    if (savedUser) setUser(savedUser);
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    localStorage.setItem("userDetails", JSON.stringify(user));
    onNext();
  };

  return (
    <div>
      <h2>Step 1: User Details</h2>
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={user.name}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={user.email}
        onChange={handleChange}
      />
      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={user.phone}
        onChange={handleChange}
      />
      <button onClick={handleNext}>Next</button>
    </div>
  );
};

export default userDetails;
