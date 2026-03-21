import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FlightUploadTicket.css";

export default function FlightUploadTicket() {
  const [tickets, setTickets] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    businessType: "B2B",
    agentName: "",
    issueSupplier: "",
    airlineName: "",
    airlineCode: "",
    sector: "",
    pnr: "",
    ticketNo: "",
    passengerName: "",
    journeyType: "",
    departureDate: "",
    returnDate: "",
    baggage: "",
    contactNumber: "",
    emailId: "",
    remark: ""
  });

  // Fetch All Tickets
  const fetchTickets = async () => {
    const res = await axios.get("/api/flight-upload-tickets");
    setTickets(res.data);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Handle Input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit (Add / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await axios.put(`/api/flight-upload-tickets/${editId}`, form);
    } else {
      await axios.post("/api/flight-upload-tickets", form);
    }

    resetForm();
    fetchTickets();
  };

  // Reset Form
  const resetForm = () => {
    setForm({
      businessType: "B2B",
      agentName: "",
      issueSupplier: "",
      airlineName: "",
      airlineCode: "",
      sector: "",
      pnr: "",
      ticketNo: "",
      passengerName: "",
      journeyType: "",
      departureDate: "",
      returnDate: "",
      baggage: "",
      contactNumber: "",
      emailId: "",
      remark: ""
    });
    setEditId(null);
  };

  // Edit
  const handleEdit = (item) => {
    setEditId(item._id);
    setForm(item);
  };

  // Delete
  const handleDelete = async (id) => {
    await axios.delete(`/api/flight-upload-tickets/${id}`);
    fetchTickets();
  };

  return (
    <div className="flight-upload-container">
      <h2>Flight Upload Ticket</h2>

      <form className="upload-form" onSubmit={handleSubmit}>
        {Object.keys(form).map((key) => (
          <input
            key={key}
            type={
              key.includes("Date") ? "date" : "text"
            }
            name={key}
            placeholder={key}
            value={form[key]}
            onChange={handleChange}
          />
        ))}

        <button type="submit">
          {editId ? "Update Ticket" : "Save Ticket"}
        </button>
      </form>

      <h3>Uploaded Tickets</h3>

      <table className="ticket-table">
        <thead>
          <tr>
            <th>Agent</th>
            <th>Airline</th>
            <th>Sector</th>
            <th>PNR</th>
            <th>Passenger</th>
            <th>Dep Date</th>
            <th>Ticket No</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {tickets.map((t) => (
            <tr key={t._id}>
              <td>{t.agentName}</td>
              <td>{t.airlineName} ({t.airlineCode})</td>
              <td>{t.sector}</td>
              <td>{t.pnr}</td>
              <td>{t.passengerName}</td>
              <td>{t.departureDate}</td>
              <td>{t.ticketNo}</td>
              <td>{t.emailId}</td>

              <td>
                <button onClick={() => handleEdit(t)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(t._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}
