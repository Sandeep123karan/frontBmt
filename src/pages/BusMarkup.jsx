import React, { useEffect, useState } from "react";
import axios from "axios";

const BusMarkup = () => {
  const [markups, setMarkups] = useState([]);
  const [form, setForm] = useState({ percentage: "" });

  useEffect(() => {
    fetchMarkups();
  }, []);

  const fetchMarkups = async () => {
    const res = await axios.get("/api/bus-markups");
    setMarkups(res.data);
  };

  const addMarkup = async (e) => {
    e.preventDefault();
    await axios.post("/api/bus-markups", form);
    setForm({ percentage: "" });
    fetchMarkups();
  };

  const deleteMarkup = async (id) => {
    await axios.delete(`/api/bus-markups/${id}`);
    fetchMarkups();
  };

  return (
    <div>
      <h2>Bus Markups</h2>
      <form onSubmit={addMarkup}>
        <input type="number" placeholder="Percentage" value={form.percentage} onChange={(e) => setForm({ percentage: e.target.value })} />
        <button type="submit">Add</button>
      </form>
      <ul>
        {markups.map((m) => (
          <li key={m._id}>
            {m.percentage}% <button onClick={() => deleteMarkup(m._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BusMarkup;
