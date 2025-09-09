import React, { useEffect, useState } from "react";
import axios from "axios";
import "./HotelSettings.css";

function HotelSettings() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ name: "", suppliers: "", status: "Active" });
  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    const res = await axios.get("/api/property-types");
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const suppliersArr = form.suppliers ? [form.suppliers] : [];
    if (editId) {
      await axios.put(`/api/property-types/${editId}`, { ...form, suppliers: suppliersArr });
    } else {
      await axios.post("/api/property-types", { ...form, suppliers: suppliersArr });
    }
    setForm({ name: "", suppliers: "", status: "Active" });
    setEditId(null);
    fetchData();
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      status: item.status,
      suppliers: item.suppliers[0] || "",
    });
    setEditId(item._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/property-types/${id}`);
    fetchData();
  };

  const handleStatusChange = async (id, status) => {
    const newStatus = status === "Active" ? "Inactive" : "Active";
    await axios.patch(`/api/property-types/status/${id}`, { status: newStatus });
    fetchData();
  };

  return (
    <div className="property-type-container">
      <div className="property-type-header">
        <h3>Property Type List</h3>
        <div>
          <button onClick={() => setForm({ name: "", suppliers: "", status: "Active" })}>+ Add Property Type</button>
        </div>
      </div>

      <form className="property-type-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Property Type"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Supplier Name"
          value={form.suppliers}
          onChange={(e) => setForm({ ...form, suppliers: e.target.value })}
        />
        <button type="submit">{editId ? "Update" : "Save"}</button>
      </form>

      <table className="property-type-table">
        <thead>
          <tr>
            <th>Property Type</th>
            <th>Status</th>
            <th>Suppliers</th>
            <th>Created Date</th>
            <th>Modified Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>
                <span
                  className={`status-badge ${item.status.toLowerCase()}`}
                  onClick={() => handleStatusChange(item._id, item.status)}
                >
                  {item.status}
                </span>
              </td>
              <td>{item.suppliers.join(", ")}</td>
              <td>{new Date(item.createdAt).toLocaleString()}</td>
              <td>{new Date(item.updatedAt).toLocaleString()}</td>
              <td>
                <button onClick={() => handleEdit(item)}>✏️</button>
                <button onClick={() => handleDelete(item._id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HotelSettings;