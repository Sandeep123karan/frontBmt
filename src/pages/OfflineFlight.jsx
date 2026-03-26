import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OfflineFlight.css";

function OfflineFlight() {
  const [form, setForm] = useState({
    supplier: "",
    holdDays: "",
    airline: "",
    fromAirportCode: "",
    toAirportCode: "",
    isHold: false,
    isOffline: true,
    status: "Active",
  });

  const [offlineFlights, setOfflineFlights] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const loadFlights = async () => {
    const res = await axios.get("https://bmtadmin.onrender.com/api/offline-flights");
    setOfflineFlights(res.data);
  };

  useEffect(() => {
    loadFlights();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`https://bmtadmin.onrender.com/api/offline-flights/${editingId}`, form);
    } else {
      await axios.post("https://bmtadmin.onrender.com/api/offline-flights", form);
    }
    setForm({
      supplier: "",
      holdDays: "",
      airline: "",
      fromAirportCode: "",
      toAirportCode: "",
      isHold: false,
      isOffline: true,
      status: "Active",
    });
    setEditingId(null);
    loadFlights();
  };

  const handleEdit = (flight) => {
    setForm(flight);
    setEditingId(flight._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`https://bmtadmin.onrender.com/api/offline-flights/${id}`);
    loadFlights();
  };

  const toggleStatus = async (flight) => {
    const updated = {
      ...flight,
      status: flight.status === "Active" ? "Inactive" : "Active",
    };
    await axios.put(`https://bmtadmin.onrender.com/api/offline-flights/${flight._id}`, updated);
    loadFlights();
  };

  return (
    <div className="offline-flight-container">
      <h2>Flight Offline</h2>

      <form onSubmit={handleSubmit} className="offline-form">
        <input name="supplier" value={form.supplier} onChange={handleChange} placeholder="Supplier" required />
        <input name="holdDays" type="number" value={form.holdDays} onChange={handleChange} placeholder="No. of Hold Days" />
        <input name="airline" value={form.airline} onChange={handleChange} placeholder="Airline" required />
        <input name="fromAirportCode" value={form.fromAirportCode} onChange={handleChange} placeholder="From Airport Code" required />
        <input name="toAirportCode" value={form.toAirportCode} onChange={handleChange} placeholder="To Airport Code" required />
        <label>
          <input type="checkbox" name="isHold" checked={form.isHold} onChange={handleChange} /> Is Hold
        </label>
        <label>
          <input type="checkbox" name="isOffline" checked={form.isOffline} onChange={handleChange} /> Is Offline
        </label>
        <select name="status" value={form.status} onChange={handleChange}>
          <option>Active</option>
          <option>Inactive</option>
        </select>
        <button type="submit">{editingId ? "Update" : "Add"} Flight</button>
      </form>

      <table className="offline-table">
        <thead>
          <tr>
            <th>Supplier</th>
            <th>Hold Days</th>
            <th>Airline</th>
            <th>From</th>
            <th>To</th>
            <th>Is Hold</th>
            <th>Is Offline</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {offlineFlights.map((flight) => (
            <tr key={flight._id}>
              <td>{flight.supplier}</td>
              <td>{flight.holdDays}</td>
              <td>{flight.airline}</td>
              <td>{flight.fromAirportCode}</td>
              <td>{flight.toAirportCode}</td>
              <td>{flight.isHold ? "Yes" : "No"}</td>
              <td>{flight.isOffline ? "Yes" : "No"}</td>
              <td>
                <button onClick={() => toggleStatus(flight)} className={flight.status === "Active" ? "active-btn" : "inactive-btn"}>
                  {flight.status}
                </button>
              </td>
              <td>
                <button onClick={() => handleEdit(flight)}>Edit</button> |{" "}
                <button onClick={() => handleDelete(flight._id)} className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
          {offlineFlights.length === 0 && (
            <tr>
              <td colSpan="9" className="text-center">No Flight Offline Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default OfflineFlight;
