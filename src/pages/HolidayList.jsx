import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HolidayList.css';

function HolidayList() {
  const [holidays, setHolidays] = useState([]);
  const [form, setForm] = useState({ packageName: '', date: '', type: '', showOnHome: 'Yes', standardPrice: '', deluxePrice: '', luxuryPrice: '', status: 'Active' });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchData = async () => {
    const res = await axios.get("https://bmt-backend-1-vq3f.onrender.com/api/holidays");
    setHolidays(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`https://bmt-backend-1-vq3f.onrender.com/api/holidays/${editId}`, form);
    } else {
      await axios.post("https://bmt-backend-1-vq3f.onrender.com/api/holidays", form);
    }
    setForm({ packageName: '', date: '', type: '', showOnHome: 'Yes', standardPrice: '', deluxePrice: '', luxuryPrice: '', status: 'Active' });
    setEditId(null);
    setShowForm(false);
    fetchData();
  };

  const handleDelete = async (id) => {
    await axios.delete(`https://bmt-backend-1-vq3f.onrender.com/api/holidays/${id}`);
    fetchData();
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditId(item._id);
    setShowForm(true);
  };

  return (
    <div className="holiday-container">
      <div className="header">
        <h2>Holiday List</h2>
        <button className="btn add-btn" onClick={() => setShowForm(!showForm)}>+ Add Holiday</button>
      </div>

      {showForm && (
        <form className="holiday-form" onSubmit={handleSubmit}>
          <input value={form.packageName} onChange={(e) => setForm({ ...form, packageName: e.target.value })} placeholder="Package Name" required />
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          <input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="Type" required />
          <input value={form.standardPrice} onChange={(e) => setForm({ ...form, standardPrice: e.target.value })} placeholder="Standard Price" />
          <input value={form.deluxePrice} onChange={(e) => setForm({ ...form, deluxePrice: e.target.value })} placeholder="Deluxe Price" />
          <input value={form.luxuryPrice} onChange={(e) => setForm({ ...form, luxuryPrice: e.target.value })} placeholder="Luxury Price" />
          <select value={form.showOnHome} onChange={(e) => setForm({ ...form, showOnHome: e.target.value })}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button type="submit">{editId ? 'Update' : 'Add'} Holiday</button>
        </form>
      )}

      <table className="holiday-table">
        <thead>
          <tr>
            <th>Package</th><th>Date</th><th>Type</th><th>Status</th><th>Show</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {holidays.map((h) => (
            <tr key={h._id}>
              <td>{h.packageName}</td>
              <td>{h.date}</td>
              <td>{h.type}</td>
              <td>{h.status}</td>
              <td>{h.showOnHome}</td>
              <td>
                <button onClick={() => handleEdit(h)}>Edit</button>
                <button onClick={() => handleDelete(h._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HolidayList;