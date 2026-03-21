import React, { useEffect, useState } from "react";
import axios from "axios";

const ForexBookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({
    customerName: "",
    currencyType: "",
    amount: "",
    bookingDate: "",
    status: "Pending",
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch all bookings
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:9000/api/forex-bookings");
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:9000/api/forex-bookings/${editingId}`, formData);
      } else {
        await axios.post("http://localhost:9000/api/forex-bookings", formData);
      }
      setFormData({
        customerName: "",
        currencyType: "",
        amount: "",
        bookingDate: "",
        status: "Pending",
      });
      setEditingId(null);
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (booking) => {
    setFormData(booking);
    setEditingId(booking._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:9000/api/forex-bookings/${id}`);
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Forex Booking List</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="customerName"
          placeholder="Customer Name"
          value={formData.customerName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="currencyType"
          placeholder="Currency Type"
          value={formData.currencyType}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="bookingDate"
          value={formData.bookingDate}
          onChange={handleChange}
          required
        />
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button type="submit">{editingId ? "Update" : "Add"}</button>
      </form>

      {/* Table */}
      <table border="1" cellPadding="10" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Currency</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b._id}>
              <td>{b.customerName}</td>
              <td>{b.currencyType}</td>
              <td>{b.amount}</td>
              <td>{new Date(b.bookingDate).toLocaleDateString()}</td>
              <td>{b.status}</td>
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
};

export default ForexBookingList;
