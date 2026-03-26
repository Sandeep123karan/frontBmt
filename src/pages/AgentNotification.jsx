import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AgentNotification.css';

const AgentNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [form, setForm] = useState({ title: '', type: 'Info' });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const fetchNotifications = async () => {
    try {
      const params = {};
      if (fromDate && toDate) {
        params.fromDate = fromDate;
        params.toDate = toDate;
      }
      if (filterStatus) {
        params.status = filterStatus;
      }
      const res = await axios.get('https://bmtadmin.onrender.com/api/notifications', { params });
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async () => {
    if (!form.title) return;
    try {
      if (editId) {
        await axios.put(`https://bmtadmin.onrender.com/api/notifications/${editId}`, form);
        setEditId(null);
      } else {
        await axios.post('https://bmtadmin.onrender.com/api/notifications', form);
      }
      setForm({ title: '', type: 'Info' });
      setShowForm(false);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://bmtadmin.onrender.com/api/notifications/${id}`);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (n) => {
    setForm({ title: n.title, type: n.type });
    setEditId(n._id);
    setShowForm(true);
  };

  const handleStatusChange = async (status) => {
    try {
      const ids = notifications.map(n => n._id);
      await axios.put('https://bmtadmin.onrender.com/api/notifications/status', { ids, status });
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="notify-container">
      <div className="notify-topbar">
        <h2>Notification List</h2>
        <button onClick={() => {
          setShowForm(!showForm);
          setForm({ title: '', type: 'Info' });
          setEditId(null);
        }}>
          {showForm ? "Close" : "+ Add Notification"}
        </button>
      </div>

      {showForm && (
        <div className="notify-form">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option value="Info">Info</option>
            <option value="Alert">Alert</option>
            <option value="Promo">Promo</option>
          </select>
          <button onClick={handleAdd}>
            {editId ? "Update" : "Save"}
          </button>
        </div>
      )}

      <div className="notify-filters">
        <select onChange={e => setFilterStatus(e.target.value)} defaultValue="">
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
        <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
        <button onClick={fetchNotifications}>Search</button>
        <button onClick={() => handleStatusChange("Inactive")}>Change Status</button>
      </div>

      <table className="notify-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Type</th>
            <th>Created Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {notifications.length === 0 ? (
            <tr><td colSpan="5">No Data Found</td></tr>
          ) : notifications.map((n, i) => (
            <tr key={i}>
              <td>{n.title}</td>
              <td>{n.status}</td>
              <td>{n.type}</td>
              <td>{new Date(n.createdAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleEdit(n)}>Edit</button>
                <button onClick={() => handleDelete(n._id)} style={{ marginLeft: "5px", color: "red" }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AgentNotification;
