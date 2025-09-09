import React, { useState } from "react";

function InsuranceSettings() {
  const [currency, setCurrency] = useState("INR");
  const [email, setEmail] = useState("");
  const [reminderDays, setReminderDays] = useState(30);
  const [autoRenew, setAutoRenew] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    const settingsData = {
      currency,
      email,
      reminderDays,
      autoRenew,
    };
    console.log("Saved Insurance Settings:", settingsData);
    alert("Settings Saved Successfully ✅");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Insurance Settings ⚙️
      </h2>
      <form onSubmit={handleSave} className="space-y-5">
        {/* Default Currency */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Default Currency
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>

        {/* Support Email */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Support Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter support email"
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        {/* Policy Expiry Reminder Days */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Policy Expiry Reminder (Days before expiry)
          </label>
          <input
            type="number"
            value={reminderDays}
            onChange={(e) => setReminderDays(e.target.value)}
            className="w-full border rounded-lg p-2"
            min="1"
            required
          />
        </div>

        {/* Auto-Renewal Toggle */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={autoRenew}
            onChange={(e) => setAutoRenew(e.target.checked)}
            className="w-5 h-5"
          />
          <label className="font-semibold text-gray-700">
            Enable Auto-Renewal
          </label>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}

export default InsuranceSettings;
