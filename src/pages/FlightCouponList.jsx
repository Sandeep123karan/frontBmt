// FlightCouponList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FlightCouponList.css";

export default function FlightCouponList() {
  const [coupons, setCoupons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    airlineCode: "",
    flightType: "",
    journeyType: "",
    couponCode: "",
    couponType: "",
    cabinClass: "",
    value: "",
    maxLimit: "",
    useLimit: "",
    expireValidity: ""
  });
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchCoupons = async () => {
    try {
      const res = await axios.get("/api/flight-coupons");
      setCoupons(res.data);
    } catch (err) {
      console.error("❌", err);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleAdd = async () => {
    try {
      await axios.post("/api/flight-coupons/add", formData);
      fetchCoupons();
      setShowForm(false);
      setFormData({
        airlineCode: "",
        flightType: "",
        journeyType: "",
        couponCode: "",
        couponType: "",
        cabinClass: "",
        value: "",
        maxLimit: "",
        useLimit: "",
        expireValidity: ""
      });
    } catch (err) {
      console.error("❌", err);
    }
  };

  const handleDelete = async () => {
    try {
      await Promise.all(selectedIds.map(id => axios.delete(`/api/flight-coupons/${id}`)));
      fetchCoupons();
      setSelectedIds([]);
    } catch (err) {
      console.error("❌", err);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="coupon-container">
      <div className="header">
        <h2>FLIGHT COUPON</h2>
        <div className="actions">
          <button className="btn" onClick={() => setShowForm(!showForm)}>+ Add Flight Coupon</button>
          <button className="btn">Change Status</button>
          <button className="btn danger" onClick={handleDelete}>Delete</button>
        </div>
      </div>

      {showForm && (
        <div className="form-box">
          {Object.entries(formData).map(([key, val]) => (
            <input
              key={key}
              type={key === "expireValidity" ? "date" : "text"}
              placeholder={key}
              value={val}
              onChange={e => setFormData({ ...formData, [key]: e.target.value })}
            />
          ))}
          <button className="btn" onClick={handleAdd}>Submit</button>
        </div>
      )}

      <table className="coupon-table">
        <thead>
          <tr>
            <th></th>
            <th>Airline Code</th>
            <th>Flight Type</th>
            <th>Journey Type</th>
            <th>Coupon Code</th>
            <th>Coupon Type</th>
            <th>Cabin Class</th>
            <th>Value</th>
            <th>Max Limit</th>
            <th>Use Limit</th>
            <th>Expire Validity</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((c) => (
            <tr key={c._id}>
              <td>
                <input type="checkbox" onChange={() => toggleSelect(c._id)} checked={selectedIds.includes(c._id)} />
              </td>
              <td>{c.airlineCode}</td>
              <td>{c.flightType}</td>
              <td>{c.journeyType}</td>
              <td>{c.couponCode}</td>
              <td>{c.couponType}</td>
              <td>{c.cabinClass}</td>
              <td>{c.value}</td>
              <td>{c.maxLimit}</td>
              <td>{c.useLimit}</td>
              <td>{new Date(c.expireValidity).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
