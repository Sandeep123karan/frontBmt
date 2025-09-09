import React, { useEffect, useState } from "react";
import axios from "axios";
import "./HolidayCouponList.css";

function HolidayCouponList() {
  const [coupons, setCoupons] = useState([]);
  const [formData, setFormData] = useState({
    couponCode: "",
    travelDateFrom: "",
    travelDateTo: "",
    couponType: "Fixed",
    value: "",
    maxLimit: "",
    themeName: "ANY",
    destinationName: "ANY"
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchCoupons = async () => {
    const res = await axios.get("/api/holiday-coupons");
    setCoupons(res.data);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.couponCode) {
      formData.couponCode = "CODE" + Math.random().toString(16).substring(2, 8);
    }

    if (editingId) {
      await axios.put(`/api/holiday-coupons/${editingId}`, formData);
    } else {
      await axios.post("/api/holiday-coupons", formData);
    }

    setFormData({
      couponCode: "",
      travelDateFrom: "",
      travelDateTo: "",
      couponType: "Fixed",
      value: "",
      maxLimit: "",
      themeName: "ANY",
      destinationName: "ANY"
    });
    setEditingId(null);
    setShowForm(false);
    fetchCoupons();
  };

  const handleEdit = (data) => {
    setFormData(data);
    setEditingId(data._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this coupon?")) {
      await axios.delete(`/api/holiday-coupons/${id}`);
      fetchCoupons();
    }
  };

  const toggleStatus = async (id) => {
    await axios.put(`/api/holiday-coupons/toggle-status/${id}`);
    fetchCoupons();
  };

  return (
    <div className="coupon-container">
      <div className="top-bar">
        <button onClick={() => setShowForm(!showForm)}>+ Add Holiday Coupon</button>
      </div>

      {showForm && (
        <form className="coupon-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Coupon Code" value={formData.couponCode} onChange={(e) => setFormData({ ...formData, couponCode: e.target.value })} />
          <input type="date" value={formData.travelDateFrom} onChange={(e) => setFormData({ ...formData, travelDateFrom: e.target.value })} />
          <input type="date" value={formData.travelDateTo} onChange={(e) => setFormData({ ...formData, travelDateTo: e.target.value })} />
          <select value={formData.couponType} onChange={(e) => setFormData({ ...formData, couponType: e.target.value })}>
            <option value="Fixed">Fixed</option>
            <option value="Percentage">Percentage</option>
          </select>
          <input type="number" placeholder="Value" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} required />
          <input type="number" placeholder="Max Limit" value={formData.maxLimit} onChange={(e) => setFormData({ ...formData, maxLimit: e.target.value })} required />
          <button type="submit">{editingId ? "Update" : "Save"}</button>
        </form>
      )}

      <table className="coupon-table">
        <thead>
          <tr>
            <th>Coupon Code</th>
            <th>Travel From</th>
            <th>Travel To</th>
            <th>Type</th>
            <th>Value</th>
            <th>Max Limit</th>
            <th>Theme</th>
            <th>Destination</th>
            <th>Status</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((c) => (
            <tr key={c._id}>
              <td>{c.couponCode}</td>
              <td>{new Date(c.travelDateFrom).toLocaleDateString()}</td>
              <td>{new Date(c.travelDateTo).toLocaleDateString()}</td>
              <td>{c.couponType}</td>
              <td>{c.value}</td>
              <td>{c.maxLimit}</td>
              <td>{c.themeName}</td>
              <td>{c.destinationName}</td>
              <td>
                <button onClick={() => toggleStatus(c._id)} className={c.status === "Active" ? "active" : "inactive"}>
                  {c.status}
                </button>
              </td>
              <td>{new Date(c.createdAt).toLocaleString()}</td>
              <td>
                <button onClick={() => handleEdit(c)}>✏️</button>
                <button onClick={() => handleDelete(c._id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HolidayCouponList;
