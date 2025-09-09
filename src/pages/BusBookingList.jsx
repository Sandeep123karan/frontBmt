import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://bmt-backend-1-vq3f.onrender.com/api/bus-bookings"; // apna backend url dalna

function BusBooking() {
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({
    passengerName: "",
    seatNumber: "",
    route: "",
    date: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch all bookings
  const fetchBookings = async () => {
    try {
      const res = await axios.get(API_URL);
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post(API_URL, formData);
      }
      setFormData({ passengerName: "", seatNumber: "", route: "", date: "" });
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit Booking
  const handleEdit = (booking) => {
    setEditingId(booking._id);
    setFormData({
      passengerName: booking.passengerName,
      seatNumber: booking.seatNumber,
      route: booking.route?._id || "",
      date: booking.date?.slice(0, 10) || "",
    });
  };

  // Delete Booking
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🚌 Bus Bookings</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="passengerName"
          placeholder="Passenger Name"
          value={formData.passengerName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="seatNumber"
          placeholder="Seat Number"
          value={formData.seatNumber}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="route"
          placeholder="Route ID"
          value={formData.route}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <button type="submit">{editingId ? "Update" : "Add"} Booking</button>
      </form>

      {/* Table */}
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Passenger Name</th>
            <th>Seat</th>
            <th>Route</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b._id}>
              <td>{b.passengerName}</td>
              <td>{b.seatNumber}</td>
              <td>{b.route?.name || b.route}</td>
              <td>{new Date(b.date).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleEdit(b)}>Edit</button>
                <button onClick={() => handleDelete(b._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BusBooking;
