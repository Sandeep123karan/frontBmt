import React, { useEffect, useState } from "react";
import axios from "axios";

const API = axios.create({ baseURL: "https://bmt-backend-1-vq3f.onrender.com/api" });

export default function ForexCardPage() {
  const [cards, setCards] = useState([]);
  const [form, setForm] = useState({ provider: "", cardName: "", supportedCurrencies: "", markupFee: "", annualFee: "", reloadFee: "", deliveryCharge: "", status: "active" });
  const [editId, setEditId] = useState(null);

  const fetchCards = async () => {
    const res = await API.get("/forex-cards");
    setCards(res.data.items || res.data || []);
  };

  useEffect(() => { fetchCards(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, supportedCurrencies: typeof form.supportedCurrencies === "string" ? form.supportedCurrencies.split(",").map(s => s.trim()) : form.supportedCurrencies };
    if (editId) await API.put(`/forex-cards/${editId}`, payload);
    else await API.post("/forex-cards", payload);
    setForm({ provider: "", cardName: "", supportedCurrencies: "", markupFee: "", annualFee: "", reloadFee: "", deliveryCharge: "", status: "active" });
    setEditId(null);
    fetchCards();
  };

  const edit = (c) => {
    setEditId(c._id);
    setForm({ ...c, supportedCurrencies: (c.supportedCurrencies || []).join(",") });
  };

  const remove = async (id) => { if (!confirm("Delete?")) return; await API.delete(`/forex-cards/${id}`); fetchCards(); };

  return (
    <div className="p-6">
      <h2>Forex Cards</h2>
      <form onSubmit={submit} style={{ margin: "12px 0" }}>
        <input placeholder="Provider" value={form.provider} onChange={e => setForm({...form, provider: e.target.value})} required />
        <input placeholder="Card Name" value={form.cardName} onChange={e => setForm({...form, cardName: e.target.value})} required />
        <input placeholder="Currencies comma separated" value={form.supportedCurrencies} onChange={e => setForm({...form, supportedCurrencies: e.target.value})} />
        <input placeholder="Markup %" value={form.markupFee} onChange={e => setForm({...form, markupFee: e.target.value})} />
        <button type="submit">{editId ? "Update" : "Add"}</button>
      </form>

      <table border="1" cellPadding="8">
        <thead><tr><th>Provider</th><th>Card</th><th>Currencies</th><th>Markup</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {cards.map(c => (
            <tr key={c._id}>
              <td>{c.provider}</td>
              <td>{c.cardName}</td>
              <td>{(c.supportedCurrencies||[]).join(", ")}</td>
              <td>{c.markupFee}</td>
              <td>{c.status}</td>
              <td>
                <button onClick={() => edit(c)}>Edit</button>
                <button onClick={() => remove(c._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
