import React, { useEffect, useState } from "react";
import axios from "axios";

const CurrencyList = () => {
  const [currencies, setCurrencies] = useState([]);
  const [form, setForm] = useState({ code: "", name: "", symbol: "" });
  const [editingId, setEditingId] = useState(null);

  
  const fetchCurrencies = async () => {
    const res = await axios.get("https://bmt-backend-1-vq3f.onrender.com/api/currencies");
    setCurrencies(res.data);
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`https://bmt-backend-1-vq3f.onrender.com/api/currencies/${editingId}`, form);
    } else {
      await axios.post("https://bmt-backend-1-vq3f.onrender.com/api/currencies", form);
    }
    setForm({ code: "", name: "", symbol: "" });
    setEditingId(null);
    fetchCurrencies();
  };

  const handleEdit = (currency) => {
    setForm(currency);
    setEditingId(currency._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`https://bmt-backend-1-vq3f.onrender.com/api/currencies/${id}`);
    fetchCurrencies();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Currency List</h1>
      
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Code (e.g. USD)"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Name (e.g. US Dollar)"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Symbol (e.g. $)"
          value={form.symbol}
          onChange={(e) => setForm({ ...form, symbol: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Code</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Symbol</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currencies.map((cur) => (
            <tr key={cur._id}>
              <td className="border px-4 py-2">{cur.code}</td>
              <td className="border px-4 py-2">{cur.name}</td>
              <td className="border px-4 py-2">{cur.symbol}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEdit(cur)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cur._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CurrencyList;
