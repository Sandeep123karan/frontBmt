import React, { useState, useEffect } from "react";
import axios from "axios";

function ForexMarkup() {
  const [markups, setMarkups] = useState([]);
  const [editingMarkup, setEditingMarkup] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    markupValue: "",
    type: "Percentage",
    description: "",
  });

  // Fetch markups
  const fetchMarkups = async () => {
    try {
      const res = await axios.get("https://bmt-backend-1-vq3f.onrender.com/api/forex-markups");
      setMarkups(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMarkups();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Open edit form
  const handleEdit = (markup) => {
    setEditingMarkup(markup);
    setFormData({
      name: markup.name,
      markupValue: markup.markupValue,
      type: markup.type,
      description: markup.description,
    });
    setShowForm(true);
  };

  // Delete markup
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://bmt-backend-1-vq3f.onrender.com/api/forex-markups/${id}`);
      setMarkups(markups.filter((m) => m._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Add/Edit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMarkup) {
        await axios.put(
          `https://bmt-backend-1-vq3f.onrender.com/api/forex-markups/${editingMarkup._id}`,
          formData
        );
      } else {
        await axios.post("https://bmt-backend-1-vq3f.onrender.com/api/forex-markups", formData);
      }
      setShowForm(false);
      setEditingMarkup(null);
      setFormData({
        name: "",
        markupValue: "",
        type: "Percentage",
        description: "",
      });
      fetchMarkups();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Forex Markups</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowForm(true)}
        >
          Add Markup
        </button>
      </div>

      {/* Table */}
      <table className="w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Value</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {markups.map((m) => (
            <tr key={m._id} className="hover:bg-gray-50">
              <td className="p-2 border">{m.name}</td>
              <td className="p-2 border">{m.markupValue}</td>
              <td className="p-2 border">{m.type}</td>
              <td className="p-2 border">{m.description}</td>
              <td className="p-2 border space-x-2">
                <button
                  className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500"
                  onClick={() => handleEdit(m)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 px-2 py-1 rounded text-white hover:bg-red-600"
                  onClick={() => handleDelete(m._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow w-96 space-y-4"
          >
            <h2 className="text-xl font-bold">
              {editingMarkup ? "Edit" : "Add"} Forex Markup
            </h2>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="number"
              name="markupValue"
              placeholder="Markup Value"
              value={formData.markupValue}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="Percentage">Percentage</option>
              <option value="Flat">Flat</option>
            </select>
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ForexMarkup;
