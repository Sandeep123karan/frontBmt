import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CarCoupon.css";

const API = "https://bmtadmin.onrender.com/api/car-coupons";

function CarCoupon() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    couponCode: "",
    travelDateFrom: "",
    travelDateTo: "",
    couponType: "flat",
    value: "",
    minOrderValue: "",
    maxOrderValue: "",
    minCars: "",
    maxCars: "",
    maxLimit: "",
    useLimit: "",
    expireValidity: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchCoupons = async () => {
    const res = await axios.get(API);
    setCoupons(res.data);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await axios.put(`${API}/${editId}`, form);
    } else {
      await axios.post(API, form);
    }
    fetchCoupons();
    resetForm();
  };

  const resetForm = () => {
    setForm({
      couponCode: "",
      travelDateFrom: "",
      travelDateTo: "",
      couponType: "flat",
      value: "",
      minOrderValue: "",
      maxOrderValue: "",
      minCars: "",
      maxCars: "",
      maxLimit: "",
      useLimit: "",
      expireValidity: "",
    });
    setIsEditing(false);
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (data) => {
    setForm({ ...data });
    setEditId(data._id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchCoupons();
  };

  const handleStatusToggle = async (id) => {
    await axios.patch(`${API}/toggle-status/${id}`);
    fetchCoupons();
  };

  return (
    <div className="car-coupon-container">
      <div className="top-bar">
        <input type="text" placeholder="Search..." className="search-input" />
        <button onClick={() => setShowForm(!showForm)} className="btn-add">
          {showForm ? "Close" : "➕ Add Car Coupon"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-box">
          {[
            "couponCode",
            "travelDateFrom",
            "travelDateTo",
            "value",
            "minOrderValue",
            "maxOrderValue",
            "minCars",
            "maxCars",
            "maxLimit",
            "useLimit",
            "expireValidity",
          ].map((field) => (
            <input
              key={field}
              type={field.includes("Date") ? "date" : "text"}
              placeholder={field}
              value={form[field]}
              required={["couponCode", "travelDateFrom", "travelDateTo", "value", "expireValidity"].includes(field)}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            />
          ))}

          <select
            value={form.couponType}
            onChange={(e) => setForm({ ...form, couponType: e.target.value })}
          >
            <option value="flat">Flat</option>
            <option value="percent">Percent</option>
          </select>

          <button type="submit" className="btn-save">
            {isEditing ? "Update" : "Save"}
          </button>
        </form>
      )}

      <table className="coupon-table">
        <thead>
          <tr>
            <th>Coupon Code</th>
            <th>Travel Date From</th>
            <th>Travel Date To</th>
            <th>Type</th>
            <th>Value</th>
            <th>Min Order</th>
            <th>Max Order</th>
            <th>Min Cars</th>
            <th>Max Cars</th>
            <th>Max Limit</th>
            <th>Use Limit</th>
            <th>Expire Validity</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((c) => (
            <tr key={c._id}>
              <td>{c.couponCode}</td>
              <td>{c.travelDateFrom?.slice(0, 10)}</td>
              <td>{c.travelDateTo?.slice(0, 10)}</td>
              <td>{c.couponType}</td>
              <td>{c.value}</td>
              <td>{c.minOrderValue}</td>
              <td>{c.maxOrderValue}</td>
              <td>{c.minCars}</td>
              <td>{c.maxCars}</td>
              <td>{c.maxLimit}</td>
              <td>{c.useLimit}</td>
              <td>{c.expireValidity?.slice(0, 10)}</td>
              <td>
                <button
                  onClick={() => handleStatusToggle(c._id)}
                  className={c.status ? "btn-active" : "btn-inactive"}
                >
                  {c.status ? "Active" : "Inactive"}
                </button>
              </td>
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

export default CarCoupon;
