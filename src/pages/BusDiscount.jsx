import React, { useEffect, useState } from "react";
import axios from "axios";

const BusDiscounts = () => {
  const [discounts, setDiscounts] = useState([]);
  const [form, setForm] = useState({ code: "", percentage: "" });

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    const res = await axios.get("/api/bus-discounts");
    setDiscounts(res.data);
  };

  const addDiscount = async (e) => {
    e.preventDefault();
    await axios.post("/api/bus-discounts", form);
    setForm({ code: "", percentage: "" });
    fetchDiscounts();
  };

  const deleteDiscount = async (id) => {
    await axios.delete(`/api/bus-discounts/${id}`);
    fetchDiscounts();
  };

  return (
    <div>
      <h2>Bus Discounts</h2>
      <form onSubmit={addDiscount}>
        <input placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
        <input type="number" placeholder="Percentage" value={form.percentage} onChange={(e) => setForm({ ...form, percentage: e.target.value })} />
        <button type="submit">Add</button>
      </form>
      <ul>
        {discounts.map((d) => (
          <li key={d._id}>
            {d.code} - {d.percentage}% <button onClick={() => deleteDiscount(d._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BusDiscounts;
