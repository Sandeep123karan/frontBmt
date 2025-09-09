import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HolidayThemeList.css';

function HolidayThemeList() {
  const [themes, setThemes] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    themeName: "",
    supplier: "",
    themeSlug: "",
    showOnHome: false,
    startingPrice: "",
    themeImage: null
  });

  const fetchThemes = async () => {
    const res = await axios.get(`/api/holiday-themes${search ? '?search=' + search : ''}`);
    setThemes(res.data);
  };

  useEffect(() => {
    fetchThemes();
  }, [search]);

  const toggleStatus = async (id) => {
    await axios.put(`/api/holiday-themes/toggle-status/${id}`);
    fetchThemes();
  };

  const deleteTheme = async (id) => {
    if (window.confirm("Delete this theme?")) {
      await axios.delete(`/api/holiday-themes/${id}`);
      fetchThemes();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }
    await axios.post("/api/holiday-themes", formData);
    setShowForm(false);
    fetchThemes();
  };

  return (
    <div className="theme-container">
      <div className="top-controls">
        <input
          type="text"
          placeholder="Search by theme name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => setShowForm(true)}>+ Add Theme</button>
      </div>

      {showForm && (
        <form className="theme-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Theme Name" onChange={(e) => setForm({ ...form, themeName: e.target.value })} required />
          <input type="text" placeholder="Supplier" onChange={(e) => setForm({ ...form, supplier: e.target.value })} />
          <input type="text" placeholder="Theme Slug" onChange={(e) => setForm({ ...form, themeSlug: e.target.value })} />
          <input type="number" placeholder="Starting Price" onChange={(e) => setForm({ ...form, startingPrice: e.target.value })} />
          <select onChange={(e) => setForm({ ...form, showOnHome: e.target.value === 'yes' })}>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          <input type="file" onChange={(e) => setForm({ ...form, themeImage: e.target.files[0] })} />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
        </form>
      )}

      <table className="theme-table">
        <thead>
          <tr>
            <th>Theme Image</th>
            <th>Theme Name</th>
            <th>Suppliers</th>
            <th>Theme Slug</th>
            <th>Show On Home</th>
            <th>Starting Price</th>
            <th>Status</th>
            <th>Created Date</th>
            <th>Modified Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {themes.map((item) => (
            <tr key={item._id}>
              <td><img src={item.themeImage} alt="theme" width="60" /></td>
              <td>{item.themeName}</td>
              <td>{item.supplier}</td>
              <td>{item.themeSlug}</td>
              <td>{item.showOnHome ? 'Yes' : 'No'}</td>
              <td>{item.startingPrice}</td>
              <td>
                <button onClick={() => toggleStatus(item._id)} className={item.status === 'Active' ? 'active' : 'inactive'}>
                  {item.status}
                </button>
              </td>
              <td>{new Date(item.createdAt).toLocaleString()}</td>
              <td>{new Date(item.updatedAt).toLocaleString()}</td>
              <td>
                <button onClick={() => alert("Edit form coming soon!")}>✏️</button>
                <button onClick={() => deleteTheme(item._id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HolidayThemeList;