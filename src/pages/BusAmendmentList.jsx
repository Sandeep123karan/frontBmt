import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:9000/api/bus-amendments";

function BusAmendmentList() {
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    bookingId: "",
    changesRequested: "",
    status: "pending",
  });

  // Fetch All Amendments
  const fetchData = async () => {
    try {
      const res = await axios.get(API_URL);
      setData(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, form);
        setEditingId(null);
      } else {
        await axios.post(API_URL, form);
      }

      setForm({
        bookingId: "",
        changesRequested: "",
        status: "pending",
      });

      fetchData();
    } catch (err) {
      console.error("Submit Error:", err);
    }
  };

  // Edit Handler
  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      bookingId: item.bookingId,
      changesRequested: item.changesRequested,
      status: item.status,
    });
  };

  // Delete Handler
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchData();
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Bus Amendments</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="bookingId"
          placeholder="Booking ID"
          value={form.bookingId}
          onChange={handleChange}
          required
        />
        &nbsp;
        <input
          type="text"
          name="changesRequested"
          placeholder="Changes Requested"
          value={form.changesRequested}
          onChange={handleChange}
          required
        />
        &nbsp;
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          required
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        &nbsp;
        <button type="submit">
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      {/* TABLE */}
      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Changes Requested</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.bookingId}</td>
              <td>{item.changesRequested}</td>
              <td>{item.status}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Edit</button>
                &nbsp;
                <button onClick={() => handleDelete(item._id)}>
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

export default BusAmendmentList;
