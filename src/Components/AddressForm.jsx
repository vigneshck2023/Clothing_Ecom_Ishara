import React from "react";

const AddressForm = ({ newAddress, setNewAddress, addAddress }) => {
  return (
    <div>
      <h6 className="mb-3">Add / Edit Address</h6>
      <input
        type="text"
        placeholder="Full Name"
        className="form-control mb-2"
        value={newAddress.name}
        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Phone"
        className="form-control mb-2"
        value={newAddress.phone}
        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
      />
      <textarea
        placeholder="Address"
        className="form-control mb-2"
        value={newAddress.address}
        onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
      />
      <input
        type="text"
        placeholder="City"
        className="form-control mb-2"
        value={newAddress.city}
        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
      />
      <input
        type="text"
        placeholder="State"
        className="form-control mb-2"
        value={newAddress.state}
        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
      />
      <input
        type="text"
        placeholder="Pincode"
        className="form-control mb-3"
        value={newAddress.pincode}
        onChange={(e) =>
          setNewAddress({ ...newAddress, pincode: e.target.value })
        }
      />

      {/* Added mt-3 for spacing */}
      <button className="btn btn-success w-100 mt-3" onClick={addAddress}>
        Save Address
      </button>
    </div>
  );
};

export default AddressForm;
