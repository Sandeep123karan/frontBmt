import React, { useState } from "react";

function InsuranceProviders() {
  const [providers, setProviders] = useState([
    { id: 1, name: "LIC", contact: "support@lic.com", phone: "9876543210" },
    { id: 2, name: "HDFC Life", contact: "info@hdfclife.com", phone: "9876501234" },
  ]);

  const [newProvider, setNewProvider] = useState({
    name: "",
    contact: "",
    phone: "",
  });

  const handleChange = (e) => {
    setNewProvider({ ...newProvider, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (!newProvider.name || !newProvider.contact || !newProvider.phone) {
      alert("Please fill all fields!");
      return;
    }

    setProviders([
      ...providers,
      { id: providers.length + 1, ...newProvider },
    ]);
    setNewProvider({ name: "", contact: "", phone: "" });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Insurance Providers</h2>

      {/* Form */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          maxWidth: "400px",
        }}
      >
        <h3>Add Provider</h3>
        <input
          type="text"
          name="name"
          placeholder="Provider Name"
          value={newProvider.name}
          onChange={handleChange}
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        />
        <input
          type="email"
          name="contact"
          placeholder="Contact Email"
          value={newProvider.contact}
          onChange={handleChange}
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={newProvider.phone}
          onChange={handleChange}
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        />
        <button onClick={handleAdd} style={{ padding: "8px 16px" }}>
          Add Provider
        </button>
      </div>

      {/* Providers Table */}
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Provider Name</th>
            <th>Contact Email</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {providers.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.contact}</td>
              <td>{p.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InsuranceProviders;
