import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:9000/api"; 

export default function MoneyTransfer() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    transactionId: "",
    senderName: "",
    senderCountry: "",
    receiverName: "",
    receiverCountry: "",
    fromCurrency: "USD",
    toCurrency: "INR",
    amount: "",
    convertedAmount: "",
    exchangeRate: "",
    fees: 0,
    status: "pending",
    notes: ""
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchList();
  }, [page, q]);

  async function fetchList() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/money-transfers?page=${page}&limit=${limit}&q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
      alert("Unable to load transfers: " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function openAdd() {
    setEditingId(null);
    setForm({
      transactionId: "",
      senderName: "",
      senderCountry: "",
      receiverName: "",
      receiverCountry: "",
      fromCurrency: "USD",
      toCurrency: "INR",
      amount: "",
      convertedAmount: "",
      exchangeRate: "",
      fees: 0,
      status: "pending",
      notes: ""
    });
  }

  function openEdit(item) {
    setEditingId(item._id);
    setForm({
      transactionId: item.transactionId,
      senderName: item.senderName,
      senderCountry: item.senderCountry,
      receiverName: item.receiverName,
      receiverCountry: item.receiverCountry,
      fromCurrency: item.fromCurrency,
      toCurrency: item.toCurrency,
      amount: item.amount || "",
      convertedAmount: item.convertedAmount || "",
      exchangeRate: item.exchangeRate || "",
      fees: item.fees || 0,
      status: item.status || "pending",
      notes: item.notes || ""
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const payload = { ...form };
      const url = editingId ? `${API_BASE}/money-transfers/${editingId}` : `${API_BASE}/money-transfers`;
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Save failed");
      }
      await fetchList();
      alert(editingId ? "Updated" : "Created");
      openAdd();
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert("Error: " + (err.message || ""));
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this transfer?")) return;
    try {
      const res = await fetch(`${API_BASE}/money-transfers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      await fetchList();
    } catch (err) {
      console.error(err);
      alert("Delete error");
    }
  }

  async function markComplete(id) {
    try {
      const res = await fetch(`${API_BASE}/money-transfers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
      if (!res.ok) throw new Error("Status update failed");
      await fetchList();
    } catch (err) {
      console.error(err);
      alert("Unable to update status");
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Money Transfers</h2>
        <div className="flex items-center gap-2">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search tx / sender / receiver" className="border px-2 py-1 rounded" />
          <button onClick={()=>{setPage(1); fetchList();}} className="px-3 py-1 border rounded">Search</button>
          <button onClick={openAdd} className="px-3 py-1 bg-indigo-600 text-white rounded">New Transfer</button>
        </div>
      </div>

      <div className="bg-white shadow rounded p-4 mb-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
          <input name="transactionId" value={form.transactionId} onChange={handleChange} placeholder="Transaction ID (optional)" className="border p-2" />
          <input name="senderName" value={form.senderName} onChange={handleChange} placeholder="Sender Name" required className="border p-2" />
          <input name="senderCountry" value={form.senderCountry} onChange={handleChange} placeholder="Sender Country" className="border p-2" />
          <input name="receiverName" value={form.receiverName} onChange={handleChange} placeholder="Receiver Name" required className="border p-2" />
          <input name="receiverCountry" value={form.receiverCountry} onChange={handleChange} placeholder="Receiver Country" className="border p-2" />
          <div>
            <label className="block text-sm">From Currency</label>
            <input name="fromCurrency" value={form.fromCurrency} onChange={handleChange} className="border p-2 w-full" required />
          </div>
          <div>
            <label className="block text-sm">To Currency</label>
            <input name="toCurrency" value={form.toCurrency} onChange={handleChange} className="border p-2 w-full" required />
          </div>
          <input name="amount" type="number" value={form.amount} onChange={handleChange} placeholder="Amount" required className="border p-2" />
          <input name="exchangeRate" type="number" value={form.exchangeRate} onChange={handleChange} placeholder="Exchange Rate" className="border p-2" />
          <input name="convertedAmount" type="number" value={form.convertedAmount} onChange={handleChange} placeholder="Converted Amount" className="border p-2" />
          <input name="fees" type="number" value={form.fees} onChange={handleChange} placeholder="Fees" className="border p-2" />
          <select name="status" value={form.status} onChange={handleChange} className="border p-2">
            <option value="pending">pending</option>
            <option value="completed">completed</option>
            <option value="failed">failed</option>
            <option value="cancelled">cancelled</option>
          </select>
          <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" className="border p-2 col-span-2" />
          <div className="col-span-2 flex justify-end gap-2">
            <button type="button" onClick={()=>{openAdd(); setEditingId(null);}} className="px-3 py-1 border rounded">Reset</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">{editingId ? "Update" : "Create"}</button>
          </div>
        </form>
      </div>

      <div className="bg-white shadow rounded">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">Tx ID</th>
              <th className="px-3 py-2 text-left">Sender → Receiver</th>
              <th className="px-3 py-2 text-left">Amount</th>
              <th className="px-3 py-2 text-left">Rate</th>
              <th className="px-3 py-2 text-left">Fees</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Created</th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={8} className="p-4 text-center">Loading...</td></tr>}
            {!loading && items.length === 0 && <tr><td colSpan={8} className="p-4 text-center">No transfers</td></tr>}
            {!loading && items.map(it => (
              <tr key={it._id} className="border-t">
                <td className="px-3 py-2">{it.transactionId}</td>
                <td className="px-3 py-2">{it.senderName} → {it.receiverName}</td>
                <td className="px-3 py-2">{it.amount} {it.fromCurrency} → {it.convertedAmount || "-"} {it.toCurrency}</td>
                <td className="px-3 py-2">{it.exchangeRate || "-"}</td>
                <td className="px-3 py-2">{it.fees}</td>
                <td className="px-3 py-2">{it.status}</td>
                <td className="px-3 py-2">{new Date(it.createdAt).toLocaleString()}</td>
                <td className="px-3 py-2 space-x-2">
                  <button onClick={() => openEdit(it)} className="px-2 py-1 border rounded">Edit</button>
                  <button onClick={() => handleDelete(it._id)} className="px-2 py-1 border rounded">Delete</button>
                  {it.status !== "completed" && <button onClick={() => markComplete(it._id)} className="px-2 py-1 bg-blue-600 text-white rounded">Mark Complete</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between p-4 border-t">
          <div>Page {page} of {totalPages}</div>
          <div className="flex gap-2">
            <button disabled={page<=1} onClick={()=>setPage(p=>p-1)} className="px-3 py-1 border rounded">Prev</button>
            <button disabled={page>=totalPages} onClick={()=>setPage(p=>p+1)} className="px-3 py-1 border rounded">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
