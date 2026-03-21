import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MenuManagement.css";

const API = "http://localhost:9000/api/admin/menus";

function Menu() {
  const [form, setForm] = useState({ label: "", url: "", status: true });
  const [menus, setMenus] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const getData = async () => {
    try {
      const res = await axios.get(API);
      setMenus(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, form);
      } else {
        await axios.post(API, form);
      }
      setForm({ label: "", url: "", status: true });
      setEditingId(null);
      getData();
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleEdit = (menu) => {
    setForm({ label: menu.label, url: menu.url, status: menu.status });
    setEditingId(menu._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      getData();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="menu-container">
      <h2>Menu Management</h2>
      <form onSubmit={handleSubmit} className="menu-form">
        <input
          type="text"
          name="label"
          value={form.label}
          onChange={handleChange}
          placeholder="Menu Label"
          required
        />
        <input
          type="text"
          name="url"
          value={form.url}
          onChange={handleChange}
          placeholder="URL"
          required
        />
        <label className="switch">
          <input
            type="checkbox"
            name="status"
            checked={form.status}
            onChange={handleChange}
          />
          <span className="slider round"></span>
        </label>
        <button type="submit">{editingId ? "Update" : "Add"} Menu</button>
      </form>

      <table className="menu-table">
        <thead>
          <tr>
            <th>Label</th>
            <th>URL</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {menus.map((menu) => (
            <tr key={menu._id}>
              <td>{menu.label}</td>
              <td>{menu.url}</td>
              <td>{menu.status ? "Active" : "Inactive"}</td>
              <td>
                <button onClick={() => handleEdit(menu)}>Edit</button>
                <button onClick={() => handleDelete(menu._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Menu;
