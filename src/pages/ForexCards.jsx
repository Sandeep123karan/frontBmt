// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const API = axios.create({ baseURL: "https://bmtadmin.onrender.com/api" });

// export default function ForexCardPage() {
//   const [cards, setCards] = useState([]);
//   const [form, setForm] = useState({ provider: "", cardName: "", supportedCurrencies: "", markupFee: "", annualFee: "", reloadFee: "", deliveryCharge: "", status: "active" });
//   const [editId, setEditId] = useState(null);

//   const fetchCards = async () => {
//     const res = await API.get("/forex-cards");
//     setCards(res.data.items || res.data || []);
//   };

//   useEffect(() => { fetchCards(); }, []);

//   const submit = async (e) => {
//     e.preventDefault();
//     const payload = { ...form, supportedCurrencies: typeof form.supportedCurrencies === "string" ? form.supportedCurrencies.split(",").map(s => s.trim()) : form.supportedCurrencies };
//     if (editId) await API.put(`/forex-cards/${editId}`, payload);
//     else await API.post("/forex-cards", payload);
//     setForm({ provider: "", cardName: "", supportedCurrencies: "", markupFee: "", annualFee: "", reloadFee: "", deliveryCharge: "", status: "active" });
//     setEditId(null);
//     fetchCards();
//   };

//   const edit = (c) => {
//     setEditId(c._id);
//     setForm({ ...c, supportedCurrencies: (c.supportedCurrencies || []).join(",") });
//   };

//   const remove = async (id) => { if (!confirm("Delete?")) return; await API.delete(`/forex-cards/${id}`); fetchCards(); };

//   return (
//     <div className="p-6">
//       <h2>Forex Cards</h2>
//       <form onSubmit={submit} style={{ margin: "12px 0" }}>
//         <input placeholder="Provider" value={form.provider} onChange={e => setForm({...form, provider: e.target.value})} required />
//         <input placeholder="Card Name" value={form.cardName} onChange={e => setForm({...form, cardName: e.target.value})} required />
//         <input placeholder="Currencies comma separated" value={form.supportedCurrencies} onChange={e => setForm({...form, supportedCurrencies: e.target.value})} />
//         <input placeholder="Markup %" value={form.markupFee} onChange={e => setForm({...form, markupFee: e.target.value})} />
//         <button type="submit">{editId ? "Update" : "Add"}</button>
//       </form>

//       <table border="1" cellPadding="8">
//         <thead><tr><th>Provider</th><th>Card</th><th>Currencies</th><th>Markup</th><th>Status</th><th>Actions</th></tr></thead>
//         <tbody>
//           {cards.map(c => (
//             <tr key={c._id}>
//               <td>{c.provider}</td>
//               <td>{c.cardName}</td>
//               <td>{(c.supportedCurrencies||[]).join(", ")}</td>
//               <td>{c.markupFee}</td>
//               <td>{c.status}</td>
//               <td>
//                 <button onClick={() => edit(c)}>Edit</button>
//                 <button onClick={() => remove(c._id)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import axios from "axios";

const API = axios.create({ baseURL: "https://bmtadmin.onrender.com/api" });

export default function ForexCardPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    provider: "",
    cardName: "",
    supportedCurrencies: "",
    markupFee: "",
    annualFee: "",
    reloadFee: "",
    deliveryCharge: "",
    status: "active",
  });

  // Fetch All Cards (GET)
  const fetchCards = async () => {
    try {
      setLoading(true);
      const res = await API.get("/forex-cards");
      setCards(res.data.items || res.data || []);
    } catch (err) {
      console.error("Error loading cards:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  // Add / Update (POST / PUT)
  const submit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      supportedCurrencies:
        typeof form.supportedCurrencies === "string"
          ? form.supportedCurrencies.split(",").map((s) => s.trim())
          : form.supportedCurrencies,
    };

    try {
      if (editId) {
        await API.put(`/forex-cards/${editId}`, payload);
      } else {
        await API.post("/forex-cards", payload);
      }

      resetForm();
      fetchCards();
    } catch (err) {
      console.error("Error saving card:", err);
    }
  };

  // Edit Button
  const edit = (item) => {
    setEditId(item._id);
    setForm({
      ...item,
      supportedCurrencies: (item.supportedCurrencies || []).join(", "),
    });
  };

  // Delete Button
  const remove = async (id) => {
    if (!window.confirm("Delete this card?")) return;

    try {
      await API.delete(`/forex-cards/${id}`);
      fetchCards();
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  // Reset form after save
  const resetForm = () => {
    setForm({
      provider: "",
      cardName: "",
      supportedCurrencies: "",
      markupFee: "",
      annualFee: "",
      reloadFee: "",
      deliveryCharge: "",
      status: "active",
    });
    setEditId(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Forex Cards</h2>

      {/* Add / Edit Form */}
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded shadow mb-6">

        <input
          placeholder="Provider Name"
          value={form.provider}
          onChange={(e) => setForm({ ...form, provider: e.target.value })}
          className="border p-2 rounded"
          required
        />

        <input
          placeholder="Card Name"
          value={form.cardName}
          onChange={(e) => setForm({ ...form, cardName: e.target.value })}
          className="border p-2 rounded"
          required
        />

        <input
          placeholder="Supported Currencies (e.g. USD, EUR)"
          value={form.supportedCurrencies}
          onChange={(e) =>
            setForm({ ...form, supportedCurrencies: e.target.value })
          }
          className="border p-2 rounded"
        />

        <input
          placeholder="Markup Fee (%)"
          value={form.markupFee}
          onChange={(e) => setForm({ ...form, markupFee: e.target.value })}
          className="border p-2 rounded"
        />

        <input
          placeholder="Annual Fee"
          value={form.annualFee}
          onChange={(e) => setForm({ ...form, annualFee: e.target.value })}
          className="border p-2 rounded"
        />

        <input
          placeholder="Reload Fee"
          value={form.reloadFee}
          onChange={(e) => setForm({ ...form, reloadFee: e.target.value })}
          className="border p-2 rounded"
        />

        <input
          placeholder="Delivery Charge"
          value={form.deliveryCharge}
          onChange={(e) =>
            setForm({ ...form, deliveryCharge: e.target.value })
          }
          className="border p-2 rounded"
        />

        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white rounded p-2 col-span-1 md:col-span-3"
        >
          {editId ? "Update Card" : "Add Card"}
        </button>
      </form>

      {/* Cards Table */}
      <div className="bg-white p-4 rounded shadow overflow-auto">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="min-w-full table-auto border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Provider</th>
                <th className="border p-2">Card Name</th>
                <th className="border p-2">Currencies</th>
                <th className="border p-2">Markup</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {cards.map((c) => (
                <tr key={c._id}>
                  <td className="border p-2">{c.provider}</td>
                  <td className="border p-2">{c.cardName}</td>
                  <td className="border p-2">
                    {(c.supportedCurrencies || []).join(", ")}
                  </td>
                  <td className="border p-2">{c.markupFee}%</td>
                  <td className="border p-2">{c.status}</td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => edit(c)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(c._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {cards.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-500">
                    No forex cards found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
