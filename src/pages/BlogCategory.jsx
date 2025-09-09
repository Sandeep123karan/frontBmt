// BlogCategory.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BlogCategory.css";

function BlogCategory() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: "", image: null });
  const [editId, setEditId] = useState(null);
  const [preview, setPreview] = useState(null);

  const fetchCategories = async () => {
    const res = await axios.get("/api/blog-categories");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    if (form.image) formData.append("image", form.image);

    if (editId) {
      await axios.put(`/api/blog-categories/${editId}`, formData);
      setEditId(null);
    } else {
      await axios.post("/api/blog-categories", formData);
    }
    setForm({ title: "", image: null });
    setPreview(null);
    fetchCategories();
  };

  const handleEdit = (cat) => {
    setForm({ title: cat.title, image: null });
    setEditId(cat._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/blog-categories/${id}`);
    fetchCategories();
  };

  const toggleStatus = async (id) => {
    await axios.patch(`/api/blog-categories/status/${id}`);
    fetchCategories();
  };

  return (
    <div className="blog-container">
      <div className="header">
        <h2>Blog Category List</h2>
        <button onClick={() => setEditId(null)}>+ Add Blog Category</button>
      </div>

      <form onSubmit={handleSubmit} className="blog-form">
        <input
          type="text"
          placeholder="Category Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input type="file" onChange={handleImageChange} accept="image/*" />
        {preview && <img src={preview} alt="preview" className="preview" />}
        <button type="submit">{editId ? "Update" : "Add"}</button>
      </form>

      <table className="blog-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Status</th>
            <th>Created</th>
            <th>Modified</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id}>
              <td>
                <img
                  src={`https://bmt-backend-1-vq3f.onrender.com/uploads/${cat.image}`}
                  alt="category"
                  height="40"
                />
              </td>
              <td>{cat.title}</td>
              <td>
                <span
                  className={
                    cat.status === "Active" ? "status active" : "status inactive"
                  }
                  onClick={() => toggleStatus(cat._id)}
                >
                  {cat.status}
                </span>
              </td>
              <td>{new Date(cat.createdAt).toLocaleString()}</td>
              <td>
                {cat.modifiedAt
                  ? new Date(cat.modifiedAt).toLocaleString()
                  : "-"}
              </td>
              <td>
                <button onClick={() => handleEdit(cat)}>✏️</button>
                <button onClick={() => handleDelete(cat._id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BlogCategory;