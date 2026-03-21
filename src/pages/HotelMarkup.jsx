import React, { useEffect, useState } from "react";
import axios from "axios";
import "./HotelMarkup.css";

function HotelMarkup() {
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    markupFor: "B2B",
    agentClass: "",
    value: "",
    regionType: "",
    hotelMarkupType: "Per Night",
    displayMarkup: "In Tax",
    starRating: "",
    status: "Active",
  });

  const fetchData = async () => {
    const res = await axios.get("/api/hotel-markup");
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add / Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      agentClass: form.agentClass.split(",").map((s) => s.trim()),
      regionType: form.regionType.split(",").map((s) => s.trim()),
      starRating: form.starRating.split(",").map(Number),
    };

    if (editId) {
      await axios.put(`/api/hotel-markup/${editId}`, payload);
    } else {
      await axios.post("/api/hotel-markup", payload);
    }

    setEditId(null);
    setForm({
      markupFor: "B2B",
      agentClass: "",
      value: "",
      regionType: "",
      hotelMarkupType: "Per Night",
      displayMarkup: "In Tax",
      starRating: "",
      status: "Active",
    });

    fetchData();
  };

  // Edit
  const handleEdit = (item) => {
    setEditId(item._id);

    setForm({
      ...item,
      agentClass: item.agentClass.join(", "),
      regionType: item.regionType.join(", "),
      starRating: item.starRating.join(", "),
    });
  };

  // Delete
  const handleDelete = async (id) => {
    await axios.delete(`/api/hotel-markup/${id}`);
    fetchData();
  };

  // Toggle Status
  const toggleStatus = async (id) => {
    await axios.put(`/api/hotel-markup/toggle-status/${id}`);
    fetchData();
  };

  return (
    <div className="hotel-markup-wrapper">
      <h2>🏨 Hotel Markup Management</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="hotel-form">
        <input type="text" placeholder="Agent Class" value={form.agentClass}
          onChange={(e) => setForm({ ...form, agentClass: e.target.value })} />

        <input type="number" placeholder="Value" value={form.value}
          onChange={(e) => setForm({ ...form, value: e.target.value })} required />

        <input type="text" placeholder="Region Type" value={form.regionType}
          onChange={(e) => setForm({ ...form, regionType: e.target.value })} />

        <input type="text" placeholder="Star Rating" value={form.starRating}
          onChange={(e) => setForm({ ...form, starRating: e.target.value })} />

        <button type="submit">{editId ? "Update" : "Add"} Markup</button>
      </form>

      {/* TABLE */}
      <table className="markup-table">
        <thead>
          <tr>
            <th>For</th>
            <th>Agent Class</th>
            <th>Value</th>
            <th>Region</th>
            <th>Type</th>
            <th>Display</th>
            <th>Stars</th>
            <th>Status</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row._id}>
              <td>{row.markupFor}</td>
              <td>{row.agentClass.join(", ")}</td>
              <td>{row.value}</td>
              <td>{row.regionType.join(", ")}</td>
              <td>{row.hotelMarkupType}</td>
              <td>{row.displayMarkup}</td>
              <td>{row.starRating.join(", ")}</td>

              <td>
                <button
                  className={row.status === "Active" ? "active" : "inactive"}
                  onClick={() => toggleStatus(row._id)}
                >
                  {row.status}
                </button>
              </td>

              <td>{new Date(row.createdAt).toLocaleString()}</td>

              <td>
                <button onClick={() => handleEdit(row)}>✏️</button>
                <button onClick={() => handleDelete(row._id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HotelMarkup;
