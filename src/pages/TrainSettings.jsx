// src/pages/TrainSettings.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://bmtadmin.onrender.com/api/train-settings";

export default function TrainSettings() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    markup: 0,
    serviceCharge: 0,
    gst: 0,
    convenienceFee: 0,
    irctcCharge: 0,
    refundCharge: 0,
    supportEmail: "",
    supportPhone: "",
  });

  // Fetch settings
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API);
      setForm(res.data);
    } catch (err) {
      console.error("fetch error:", err.message);
      alert("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Save settings
  const saveSettings = async (e) => {
    e.preventDefault();
    try {
      await axios.put(API, form);
      alert("Settings Updated Successfully!");
    } catch (err) {
      console.error("save error:", err.message);
      alert("Failed to save settings");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Train Settings</h2>

      <div className="bg-white rounded shadow p-6 max-w-3xl">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <form onSubmit={saveSettings} className="grid grid-cols-2 gap-4">

            <div>
              <label className="block font-medium">Markup (%)</label>
              <input
                type="number"
                value={form.markup}
                onChange={(e) => setForm({ ...form, markup: e.target.value })}
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block font-medium">Service Charge (₹)</label>
              <input
                type="number"
                value={form.serviceCharge}
                onChange={(e) => setForm({ ...form, serviceCharge: e.target.value })}
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block font-medium">GST (%)</label>
              <input
                type="number"
                value={form.gst}
                onChange={(e) => setForm({ ...form, gst: e.target.value })}
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block font-medium">Convenience Fee (₹)</label>
              <input
                type="number"
                value={form.convenienceFee}
                onChange={(e) => setForm({ ...form, convenienceFee: e.target.value })}
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block font-medium">IRCTC Charge (₹)</label>
              <input
                type="number"
                value={form.irctcCharge}
                onChange={(e) => setForm({ ...form, irctcCharge: e.target.value })}
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block font-medium">Refund Charge (₹)</label>
              <input
                type="number"
                value={form.refundCharge}
                onChange={(e) => setForm({ ...form, refundCharge: e.target.value })}
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block font-medium">Support Email</label>
              <input
                type="email"
                value={form.supportEmail}
                onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block font-medium">Support Phone</label>
              <input
                type="text"
                value={form.supportPhone}
                onChange={(e) => setForm({ ...form, supportPhone: e.target.value })}
                className="border p-2 rounded w-full"
              />
            </div>

            <div className="col-span-2 flex justify-end mt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded"
              >
                Save Settings
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
