import React, { useEffect, useState } from "react";
import axios from "axios";

const BusCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({ code: "", value: "" });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    const res = await axios.get("/api/bus-coupons");
    setCoupons(res.data);
  };

  const addCoupon = async (e) => {
    e.preventDefault();
    await axios.post("/api/bus-coupons", form);
    setForm({ code: "", value: "" });
    fetchCoupons();
  };

  const deleteCoupon = async (id) => {
    await axios.delete(`/api/bus-coupons/${id}`);
    fetchCoupons();
  };

  return (
    <div>
      <h2>Bus Coupons</h2>
      <form onSubmit={addCoupon}>
        <input placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
        <input type="number" placeholder="Value" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
        <button type="submit">Add</button>
      </form>
      <ul>
        {coupons.map((c) => (
          <li key={c._id}>
            {c.code} - {c.value} <button onClick={() => deleteCoupon(c._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BusCoupons;
