import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CruiseBooking.css";

function CruiseBooking() {
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({
    customerName: "",
    cruiseName: "",
    seats: "",
    status: "Pending",
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const API = "http://localhost:9000/api/cruise-bookings";

  // Fetch all bookings
  const fetchBookings = async () => {
    const res = await axios.get(API);
    setBookings(res.data);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await axios.put(`${API}/${editingId}`, form);
    } else {
      await axios.post(API, form);
    }

    setForm({
      customerName: "",
      cruiseName: "",
      seats: "",
      status: "Pending",
    });
    setEditingId(null);
    setShowForm(false);
    fetchBookings();
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      customerName: item.customerName,
      cruiseName: item.cruiseName,
      seats: item.seats,
      status: item.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this booking?")) {
      await axios.delete(`${API}/${id}`);
      fetchBookings();
    }
  };

  return (
    <div className="cb-container">
      <h2 className="cb-title"> Cruise Bookings </h2>

      <button className="cb-btn-add" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Close Form" : "Add Booking"}
      </button>

      {/* FORM */}
      {showForm && (
        <form className="cb-form" onSubmit={handleSubmit}>
          <input
            name="customerName"
            placeholder="Customer Name"
            value={form.customerName}
            onChange={handleChange}
            required
          />

          <input
            name="cruiseName"
            placeholder="Cruise Name"
            value={form.cruiseName}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="seats"
            placeholder="Number of Seats"
            value={form.seats}
            onChange={handleChange}
            required
          />

          <select name="status" value={form.status} onChange={handleChange}>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <button className="cb-btn-save" type="submit">
            {editingId ? "Update Booking" : "Save Booking"}
          </button>
        </form>
      )}

      {/* TABLE */}
      <table className="cb-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Cruise</th>
            <th>Seats</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {bookings.length > 0 ? (
            bookings.map((b) => (
              <tr key={b._id}>
                <td>{b.customerName}</td>
                <td>{b.cruiseName}</td>
                <td>{b.seats}</td>
                <td className={`cb-status-${b.status.toLowerCase()}`}>
                  {b.status}
                </td>
                <td>
                  <button className="cb-btn-edit" onClick={() => handleEdit(b)}>
                    Edit
                  </button>

                  <button
                    className="cb-btn-delete"
                    onClick={() => handleDelete(b._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="cb-empty">
                No bookings found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CruiseBooking;
