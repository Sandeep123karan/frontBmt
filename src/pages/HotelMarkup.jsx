import React, { useEffect, useState } from "react";
import "./HotelMarkup.css";
import axios from "axios";

function HotelMarkup() {
  const [data, setData] = useState([]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("/api/hotel-markup", {
      ...form,
      agentClass: form.agentClass.split(","),
      regionType: form.regionType.split(","),
      starRating: form.starRating.split(",").map(Number),
    });
    setForm({ ...form, value: "", agentClass: "", regionType: "", starRating: "" });
    fetchData();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/hotel-markup/${id}`);
    fetchData();
  };

  return (
    <div className="hotel-markup-wrapper">
      <h2>Hotel Markup</h2>
      <form onSubmit={handleSubmit} className="hotel-form">
        <input type="text" placeholder="Agent Class (comma separated)" value={form.agentClass} onChange={(e) => setForm({ ...form, agentClass: e.target.value })} />
        <input type="number" placeholder="Value" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
        <input type="text" placeholder="Region Type" value={form.regionType} onChange={(e) => setForm({ ...form, regionType: e.target.value })} />
        <input type="text" placeholder="Star Rating (comma separated)" value={form.starRating} onChange={(e) => setForm({ ...form, starRating: e.target.value })} />
        <button type="submit">Add Hotel Markup</button>
      </form>

      <table className="markup-table">
        <thead>
          <tr>
            <th>Markup For</th>
            <th>Agent Class</th>
            <th>Value</th>
            <th>Region Type</th>
            <th>Markup Type</th>
            <th>Display</th>
            <th>Star</th>
            <th>Status</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((markup) => (
            <tr key={markup._id}>
              <td>{markup.markupFor}</td>
              <td>{markup.agentClass.join(", ")}</td>
              <td>{markup.value}</td>
              <td>{markup.regionType.join(", ")}</td>
              <td>{markup.hotelMarkupType}</td>
              <td>{markup.displayMarkup}</td>
              <td>{markup.starRating.join(", ")}</td>
              <td>{markup.status}</td>
              <td>{new Date(markup.createdAt).toLocaleString()}</td>
              <td>
                <button onClick={() => handleDelete(markup._id)}>❌</button>
                {/* Add edit functionality if needed */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HotelMarkup;
