import React, { useEffect, useState } from "react";
import axios from "axios";

function ForexSetting() {
  const [settings, setSettings] = useState([]);
  const [form, setForm] = useState({ currency: "", buyRate: "", sellRate: "", status: "Active" });

  // Fetch all settings
  const fetchSettings = async () => {
    const res = await axios.get("https://bmt-backend-1-vq3f.onrender.com/api/forex-settings");
    setSettings(res.data);
  };

  useEffect(() => { fetchSettings(); }, []);

  // Handle form input
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Add setting
  const handleAdd = async () => {
    await axios.post("https://bmt-backend-1-vq3f.onrender.com/api/forex-settings", form);
    fetchSettings();
    setForm({ currency: "", buyRate: "", sellRate: "", status: "Active" });
  };

  // Delete setting
  const handleDelete = async (id) => {
    await axios.delete(`https://bmt-backend-1-vq3f.onrender.com/api/forex-settings/${id}`);
    fetchSettings();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Forex Settings</h2>

      <div className="mb-4 flex gap-2">
        <input name="currency" placeholder="Currency" value={form.currency} onChange={handleChange} className="border p-2" />
        <input name="buyRate" placeholder="Buy Rate" value={form.buyRate} onChange={handleChange} className="border p-2" />
        <input name="sellRate" placeholder="Sell Rate" value={form.sellRate} onChange={handleChange} className="border p-2" />
        <select name="status" value={form.status} onChange={handleChange} className="border p-2">
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-2">Add</button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="border">
            <th className="border px-2">Currency</th>
            <th className="border px-2">Buy Rate</th>
            <th className="border px-2">Sell Rate</th>
            <th className="border px-2">Status</th>
            <th className="border px-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {settings.map((s) => (
            <tr key={s._id}>
              <td className="border px-2">{s.currency}</td>
              <td className="border px-2">{s.buyRate}</td>
              <td className="border px-2">{s.sellRate}</td>
              <td className="border px-2">{s.status}</td>
              <td className="border px-2">
                <button onClick={() => handleDelete(s._id)} className="bg-red-500 text-white px-2 py-1">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ForexSetting;
