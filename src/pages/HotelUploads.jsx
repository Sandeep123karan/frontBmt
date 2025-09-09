import React, { useState, useEffect } from "react";
import axios from "axios";
import "./HotelUploads.css";

const API_BASE = "https://bmt-backend-1-vq3f.onrender.com/api/hotel-tickets";

function HotelUploads() {
  const [formData, setFormData] = useState({
    businessType: "B2B",
    agentName: "",
    issueSupplier: "",
    hotelCity: "",
    hotelName: "",
    address: "",
    starRating: "",
    checkIn: "",
    checkOut: "",
    passportRequired: false,
    hotelPolicy: "",
    dialCode: "India (+91)",
    contactNumber: "",
    emailId: ""
  });

  const [tickets, setTickets] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    const res = await axios.get(API_BASE);
    setTickets(res.data);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`${API_BASE}/${editId}`, formData);
    } else {
      await axios.post(API_BASE, formData);
    }
    setFormData({
      businessType: "B2B",
      agentName: "",
      issueSupplier: "",
      hotelCity: "",
      hotelName: "",
      address: "",
      starRating: "",
      checkIn: "",
      checkOut: "",
      passportRequired: false,
      hotelPolicy: "",
      dialCode: "India (+91)",
      contactNumber: "",
      emailId: ""
    });
    setEditId(null);
    fetchTickets();
  };

  const handleEdit = (ticket) => {
    setFormData(ticket);
    setEditId(ticket._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_BASE}/${id}`);
    fetchTickets();
  };

  return (
    <div className="hotel-upload-container">
      <h2>Hotel Ticket Upload</h2>
      <form className="hotel-form" onSubmit={handleSubmit}>
        <div className="section">
          <label>Business Type *</label>
          <input name="businessType" value={formData.businessType} disabled />
          <label>Agent Name *</label>
          <input name="agentName" value={formData.agentName} onChange={handleChange} required />
          <label>Issue Supplier *</label>
          <input name="issueSupplier" value={formData.issueSupplier} onChange={handleChange} required />
        </div>

        <div className="section">
          <label>Hotel City *</label>
          <input name="hotelCity" value={formData.hotelCity} onChange={handleChange} required />
          <label>Hotel Name *</label>
          <input name="hotelName" value={formData.hotelName} onChange={handleChange} required />
          <label>Address *</label>
          <input name="address" value={formData.address} onChange={handleChange} required />
        </div>

        <div className="section">
          <label>Star Rating *</label>
          <select name="starRating" value={formData.starRating} onChange={handleChange} required>
            <option value="">Select Star Rating</option>
            <option value="1">1 Star</option>
            <option value="2">2 Star</option>
            <option value="3">3 Star</option>
            <option value="4">4 Star</option>
            <option value="5">5 Star</option>
          </select>

          <label>Check-in *</label>
          <input type="date" name="checkIn" value={formData.checkIn} onChange={handleChange} required />
          <label>Check-out *</label>
          <input type="date" name="checkOut" value={formData.checkOut} onChange={handleChange} required />
        </div>

        <div className="section checkbox-group">
          <label>
            <input type="checkbox" name="passportRequired" checked={formData.passportRequired} onChange={handleChange} />
            Passport Required
          </label>
        </div>

        <div className="section">
          <label>Hotel Policy *</label>
          <textarea name="hotelPolicy" rows={3} value={formData.hotelPolicy} onChange={handleChange} required />
        </div>

        <div className="section">
          <label>Dial Code</label>
          <input name="dialCode" value={formData.dialCode} onChange={handleChange} />
          <label>Contact Number</label>
          <input name="contactNumber" value={formData.contactNumber} onChange={handleChange} required />
          <label>Email ID *</label>
          <input name="emailId" value={formData.emailId} onChange={handleChange} required />
        </div>

        <button className="save-btn" type="submit">{editId ? "Update" : "Save & Continue"}</button>
      </form>

      <h3>Uploaded Hotel Tickets</h3>
      <table className="hotel-table">
        <thead>
          <tr>
            <th>Hotel Name</th>
            <th>City</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket._id}>
              <td>{ticket.hotelName}</td>
              <td>{ticket.hotelCity}</td>
              <td>{ticket.checkIn?.slice(0, 10)}</td>
              <td>{ticket.checkOut?.slice(0, 10)}</td>
              <td>{ticket.emailId}</td>
              <td>
                <button onClick={() => handleEdit(ticket)}>Edit</button>
                <button onClick={() => handleDelete(ticket._id)} className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HotelUploads;
