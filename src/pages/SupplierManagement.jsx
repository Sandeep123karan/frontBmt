import React, { useEffect, useState } from "react";
import "./SupplierManagement.css";

function SupplierManagement() {
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({
    apiSupplier: "",
    airType: "",
    searchType: "",
    allowedAirlines: "",
    excludedAirlines: "",
  });

  // Fetch all suppliers
  const fetchSuppliers = async () => {
    try {
      const res = await fetch("/api/flight-api-suppliers");
      const data = await res.json();
      setSuppliers(data);
    } catch (err) {
      console.error("Error fetching:", err);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Add new supplier
  const handleAddSupplier = async (e) => {
    e.preventDefault();
    try {
      await fetch("/api/flight-api-suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          allowedAirlines: formData.allowedAirlines.split(","),
          excludedAirlines: formData.excludedAirlines.split(","),
        }),
      });
      setFormData({
        apiSupplier: "",
        airType: "",
        searchType: "",
        allowedAirlines: "",
        excludedAirlines: "",
      });
      fetchSuppliers();
    } catch (err) {
      console.error("Add failed:", err);
    }
  };

  return (
    <div className="supplier-wrapper">
      <div className="supplier-header">
        <h2>SUPPLIER MANAGEMENT LIST</h2>
        <button className="add-btn" onClick={handleAddSupplier}>+ Add Flight API Management</button>
      </div>

      <div className="search-bar">
        <select>
          <option>Select key to search by</option>
        </select>
        <input placeholder="Value" />
        <input type="date" />
        <input type="date" />
        <button className="search-btn">Search 🔍</button>
      </div>

      <form onSubmit={handleAddSupplier} className="form-grid">
        <input
          type="text"
          placeholder="API Supplier"
          value={formData.apiSupplier}
          onChange={(e) => setFormData({ ...formData, apiSupplier: e.target.value })}
        />
        <input
          type="text"
          placeholder="Air Type"
          value={formData.airType}
          onChange={(e) => setFormData({ ...formData, airType: e.target.value })}
        />
        <input
          type="text"
          placeholder="Search Type"
          value={formData.searchType}
          onChange={(e) => setFormData({ ...formData, searchType: e.target.value })}
        />
        <input
          type="text"
          placeholder="Allowed Airlines (comma separated)"
          value={formData.allowedAirlines}
          onChange={(e) => setFormData({ ...formData, allowedAirlines: e.target.value })}
        />
        <input
          type="text"
          placeholder="Excluded Airlines (comma separated)"
          value={formData.excludedAirlines}
          onChange={(e) => setFormData({ ...formData, excludedAirlines: e.target.value })}
        />
        <button type="submit" className="save-btn">Save</button>
      </form>

      <table className="supplier-table">
        <thead>
          <tr>
            <th>API Supplier</th>
            <th>Air Type</th>
            <th>Search Type</th>
            <th>Allowed Airlines</th>
            <th>Excluded Airlines</th>
            <th>Status</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.length === 0 ? (
            <tr><td colSpan="8">No Data Found</td></tr>
          ) : (
            suppliers.map((s) => (
              <tr key={s._id}>
                <td>{s.apiSupplier}</td>
                <td>{s.airType}</td>
                <td>{s.searchType}</td>
                <td>{s.allowedAirlines.join(", ")}</td>
                <td>{s.excludedAirlines.join(", ")}</td>
                <td>{s.status}</td>
                <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                <td>✏️ ❌</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SupplierManagement;
