import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CarDiscount.css";

const API = "http://localhost:9000/api/car-discounts";

function CarDiscount() {
  const [discounts, setDiscounts] = useState([]);
  const [form, setForm] = useState({
    discountFor: "",
    agentClass: "",
    value: "",
    maxLimit: "",
    discountType: "fixed",
    extraDiscount: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchDiscounts = async () => {
    const res = await axios.get(API);
    setDiscounts(res.data);
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await axios.put(`${API}/${editId}`, form);
    } else {
      await axios.post(API, form);
    }
    fetchDiscounts();
    setForm({
      discountFor: "",
      agentClass: "",
      value: "",
      maxLimit: "",
      discountType: "fixed",
      extraDiscount: "",
    });
    setIsEditing(false);
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (d) => {
    setForm(d);
    setIsEditing(true);
    setEditId(d._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchDiscounts();
  };

  const handleStatusToggle = async (id) => {
    await axios.patch(`${API}/toggle-status/${id}`);
    fetchDiscounts();
  };

  return (
    <div className="car-discount-container">
      <div className="top-bar">
        <h2>Car Discount</h2>
        <div className="top-actions">
          <button onClick={() => setShowForm(!showForm)} className="btn-add">
            {showForm ? "Close Form" : "➕ Add Car Discount"}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-box">
          <div>
            <label>Discount For</label>
            <select
              required
              value={form.discountFor}
              onChange={(e) => setForm({ ...form, discountFor: e.target.value })}
            >
              <option value="">Select</option>
              <option value="B2C">B2C</option>
              <option value="B2B">B2B</option>
            </select>
          </div>
          <div>
            <label>Agent Class</label>
            <input
              type="text"
              value={form.agentClass}
              onChange={(e) => setForm({ ...form, agentClass: e.target.value })}
            />
          </div>
          <div>
            <label>Value</label>
            <input
              type="number"
              value={form.value}
              required
              onChange={(e) => setForm({ ...form, value: e.target.value })}
            />
          </div>
          <div>
            <label>Max Limit</label>
            <input
              type="number"
              value={form.maxLimit}
              onChange={(e) => setForm({ ...form, maxLimit: e.target.value })}
            />
          </div>
          <div>
            <label>Discount Type</label>
            <select
              value={form.discountType}
              onChange={(e) => setForm({ ...form, discountType: e.target.value })}
            >
              <option value="fixed">Fixed</option>
              <option value="percent">Percent</option>
            </select>
          </div>
          <div>
            <label>Extra Discount</label>
            <input
              type="number"
              value={form.extraDiscount}
              onChange={(e) => setForm({ ...form, extraDiscount: e.target.value })}
            />
          </div>
          <button type="submit" className="btn-save">
            {isEditing ? "Update" : "Save"}
          </button>
        </form>
      )}

      <table className="discount-table">
        <thead>
          <tr>
            <th>Discount For</th>
            <th>Agent Class</th>
            <th>Value</th>
            <th>Max Limit</th>
            <th>Discount Type</th>
            <th>Extra Discount</th>
            <th>Status</th>
            <th>Created</th>
            <th>Modified</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map((d) => (
            <tr key={d._id}>
              <td>{d.discountFor}</td>
              <td>{d.agentClass || "-"}</td>
              <td>{d.value}</td>
              <td>{d.maxLimit}</td>
              <td>{d.discountType}</td>
              <td>{d.extraDiscount || 0}</td>
              <td>
                <button
                  onClick={() => handleStatusToggle(d._id)}
                  className={d.status ? "btn-active" : "btn-inactive"}
                >
                  {d.status ? "Active" : "Inactive"}
                </button>
              </td>
              <td>{new Date(d.createdAt).toLocaleString()}</td>
              <td>{d.updatedAt ? new Date(d.updatedAt).toLocaleString() : "-"}</td>
              <td>
                <button onClick={() => handleEdit(d)}>✏️</button>
                <button onClick={() => handleDelete(d._id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CarDiscount;
