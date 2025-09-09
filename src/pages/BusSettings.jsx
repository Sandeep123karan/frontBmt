// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const BusSettings = () => {
//   const [settings, setSettings] = useState([]);
//   const [form, setForm] = useState({ key: "", value: "" });

//   useEffect(() => {
//     fetchSettings();
//   }, []);

//   const fetchSettings = async () => {
//     const res = await axios.get("/api/bus-settings");
//     setSettings(res.data);
//   };

//   const addSetting = async (e) => {
//     e.preventDefault();
//     await axios.post("/api/bus-settings", form);
//     setForm({ key: "", value: "" });
//     fetchSettings();
//   };

//   const deleteSetting = async (id) => {
//     await axios.delete(`/api/bus-settings/${id}`);
//     fetchSettings();
//   };

//   return (
//     <div>
//       <h2>Bus Settings</h2>
//       <form onSubmit={addSetting}>
//         <input placeholder="Key" value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} />
//         <input placeholder="Value" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
//         <button type="submit">Save</button>
//       </form>
//       <ul>
//         {settings.map((s) => (
//           <li key={s._id}>
//             {s.key} - {s.value} <button onClick={() => deleteSetting(s._id)}>Delete</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default BusSettings;
import React, { useEffect, useState } from "react";
import axios from "axios";

const BusSettings = () => {
  const [settings, setSettings] = useState([]);
  const [form, setForm] = useState({ key: "", value: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/bus-settings");
      setSettings(res.data);
    } catch (err) {
      setMessage("Error loading settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.key || !form.value) {
      setMessage("Please fill all fields");
      return;
    }
    try {
      if (editId) {
        await axios.put(`/api/bus-settings/${editId}`, form);
        setMessage("Setting updated successfully");
      } else {
        await axios.post("/api/bus-settings", form);
        setMessage("Setting added successfully");
      }
      setForm({ key: "", value: "" });
      setEditId(null);
      fetchSettings();
    } catch (err) {
      setMessage("Error saving setting");
    }
  };

  const handleEdit = (setting) => {
    setForm({ key: setting.key, value: setting.value });
    setEditId(setting._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    try {
      await axios.delete(`/api/bus-settings/${id}`);
      setMessage("Setting deleted successfully");
      fetchSettings();
    } catch (err) {
      setMessage("Error deleting setting");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Bus Settings</h2>

      {message && <div className="mb-3 text-blue-600">{message}</div>}

      <form onSubmit={handleSubmit} className="mb-6 bg-gray-100 p-4 rounded-lg">
        <div className="flex gap-4 mb-3">
          <input
            className="border p-2 flex-1 rounded"
            placeholder="Key"
            value={form.key}
            onChange={(e) => setForm({ ...form, key: e.target.value })}
          />
          <input
            className="border p-2 flex-1 rounded"
            placeholder="Value"
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editId ? "Update Setting" : "Add Setting"}
        </button>
      </form>

      {loading ? (
        <p>Loading settings...</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Key</th>
              <th className="border px-4 py-2">Value</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {settings.map((s) => (
              <tr key={s._id} className="text-center">
                <td className="border px-4 py-2">{s.key}</td>
                <td className="border px-4 py-2">{s.value}</td>
                <td className="border px-4 py-2 flex gap-2 justify-center">
                  <button
                    onClick={() => handleEdit(s)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {settings.length === 0 && (
              <tr>
                <td colSpan="3" className="p-4 text-gray-500">
                  No settings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BusSettings;
