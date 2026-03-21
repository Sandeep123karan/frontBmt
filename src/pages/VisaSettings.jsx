// import React from "react";

// function VisaSettings() {
//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <div className="bg-white shadow-md rounded-lg p-6">
//         <h2 className="text-2xl font-semibold text-gray-700 mb-4">
//           Visa Settings
//         </h2>

//         {/* API Settings */}
//         <div className="mb-6">
//           <h3 className="text-lg font-medium text-gray-600 mb-2">API Settings</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <input
//               type="text"
//               placeholder="API Key"
//               className="border p-2 rounded w-full"
//             />
//             <input
//               type="text"
//               placeholder="API Secret"
//               className="border p-2 rounded w-full"
//             />
//           </div>
//         </div>

//         {/* Commission Settings */}
//         <div className="mb-6">
//           <h3 className="text-lg font-medium text-gray-600 mb-2">
//             Commission Settings
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <input
//               type="number"
//               placeholder="Default Commission (%)"
//               className="border p-2 rounded w-full"
//             />
//             <input
//               type="number"
//               placeholder="Service Fee (%)"
//               className="border p-2 rounded w-full"
//             />
//           </div>
//         </div>

//         {/* Notification Settings */}
//         <div className="mb-6">
//           <h3 className="text-lg font-medium text-gray-600 mb-2">
//             Notification Settings
//           </h3>
//           <div className="flex items-center gap-3">
//             <input type="checkbox" id="email" className="w-4 h-4" />
//             <label htmlFor="email" className="text-gray-700">
//               Enable Email Notifications
//             </label>
//           </div>
//           <div className="flex items-center gap-3 mt-2">
//             <input type="checkbox" id="sms" className="w-4 h-4" />
//             <label htmlFor="sms" className="text-gray-700">
//               Enable SMS Notifications
//             </label>
//           </div>
//         </div>

//         {/* Save Button */}
//         <div className="text-right">
//           <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
//             Save Settings
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default VisaSettings;
import React, { useEffect, useState } from "react";

function VisaSettings() {
  const [settings, setSettings] = useState({
    apiKey: "",
    apiSecret: "",
    commission: "",
    serviceFee: "",
    emailNotification: false,
    smsNotification: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch settings from backend
  const loadSettings = async () => {
    try {
      const res = await fetch("http://localhost:9000/api/visa-settings");
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error("Error loading settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Save updated settings (PUT)
  const saveSettings = async () => {
    setSaving(true);
    try {
      await fetch("http://localhost:9000/api/visa-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      alert("Settings updated successfully!");
    } catch (err) {
      console.error("Error saving settings:", err);
      alert("Failed to save settings!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Visa Settings
        </h2>

        {/* API Settings */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-600 mb-2">API Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="apiKey"
              value={settings.apiKey}
              onChange={handleChange}
              placeholder="API Key"
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              name="apiSecret"
              value={settings.apiSecret}
              onChange={handleChange}
              placeholder="API Secret"
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        {/* Commission Settings */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            Commission Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              name="commission"
              value={settings.commission}
              onChange={handleChange}
              placeholder="Default Commission (%)"
              className="border p-2 rounded w-full"
            />
            <input
              type="number"
              name="serviceFee"
              value={settings.serviceFee}
              onChange={handleChange}
              placeholder="Service Fee (%)"
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        {/* Notification Settings */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            Notification Settings
          </h3>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="email"
              name="emailNotification"
              checked={settings.emailNotification}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label htmlFor="email" className="text-gray-700">
              Enable Email Notifications
            </label>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <input
              type="checkbox"
              id="sms"
              name="smsNotification"
              checked={settings.smsNotification}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label htmlFor="sms" className="text-gray-700">
              Enable SMS Notifications
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="text-right">
          <button
            onClick={saveSettings}
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VisaSettings;
