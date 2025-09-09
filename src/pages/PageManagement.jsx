import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PageManagement.css";

const API = "https://bmt-backend-1-vq3f.onrender.com/api/admin";

function PageManagement() {
  const [pages, setPages] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ title: "", slug: "", status: "active" });
  const [editingId, setEditingId] = useState(null);

  const getPages = async () => {
    const res = await axios.get(`${API}/pages`);
    setPages(res.data);
  };

  useEffect(() => {
    getPages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`${API}/page/${editingId}`, form);
    } else {
      await axios.post(`${API}/page`, form);
    }
    setForm({ title: "", slug: "", status: "active" });
    setEditingId(null);
    getPages();
  };

  const handleEdit = (page) => {
    setForm({ title: page.title, slug: page.slug, status: page.status });
    setEditingId(page._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this page?")) {
      await axios.delete(`${API}/page/${id}`);
      getPages();
    }
  };

  const filtered = pages.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <input
          type="text"
          placeholder="Search Page..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <form className="page-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            required
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Slug"
            value={form.slug}
            required
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button type="submit">{editingId ? "Update" : "Add Page"}</button>
        </form>
      </div>

      <table className="page-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Slug</th>
            <th>Status</th>
            <th>Created</th>
            <th>Modified</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p._id}>
              <td>{p.title}</td>
              <td>{p.slug}</td>
              <td>{p.status}</td>
              <td>{new Date(p.createdAt).toLocaleString()}</td>
              <td>{new Date(p.updatedAt).toLocaleString()}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PageManagement;
