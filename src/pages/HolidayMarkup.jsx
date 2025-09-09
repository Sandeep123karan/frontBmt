import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HolidayMarkup.css';

function HolidayMarkup() {
  const [markups, setMarkups] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    markupFor: 'B2C',
    agentClass: '',
    value: '',
    maxLimit: '',
    themeName: 'ANY',
    destinationName: 'ANY',
    markupType: 'Fixed',
  });
  const [editingId, setEditingId] = useState(null);

  const fetchMarkups = async () => {
    const res = await axios.get('/api/holiday-markups');
    setMarkups(res.data);
  };

  useEffect(() => {
    fetchMarkups();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`/api/holiday-markups/${editingId}`, formData);
    } else {
      await axios.post('/api/holiday-markups', formData);
    }
    setFormData({ markupFor: 'B2C', agentClass: '', value: '', maxLimit: '', themeName: 'ANY', destinationName: 'ANY', markupType: 'Fixed' });
    setShowForm(false);
    setEditingId(null);
    fetchMarkups();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this entry?')) {
      await axios.delete(`/api/holiday-markups/${id}`);
      fetchMarkups();
    }
  };

  const toggleStatus = async (id) => {
    await axios.put(`/api/holiday-markups/toggle-status/${id}`);
    fetchMarkups();
  };

  const handleEdit = (markup) => {
    setFormData(markup);
    setEditingId(markup._id);
    setShowForm(true);
  };

  return (
    <div className="markup-container">
      <div className="top-bar">
        <button onClick={() => setShowForm(!showForm)}>+ Add Holiday Markup</button>
      </div>

      {showForm && (
        <form className="markup-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Agent Class" value={formData.agentClass} onChange={(e) => setFormData({ ...formData, agentClass: e.target.value })} required />
          <input type="number" placeholder="Value" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} required />
          <input type="number" placeholder="Max Limit" value={formData.maxLimit} onChange={(e) => setFormData({ ...formData, maxLimit: e.target.value })} required />
          <select value={formData.markupType} onChange={(e) => setFormData({ ...formData, markupType: e.target.value })}>
            <option value="Fixed">Fixed</option>
            <option value="Percentage">Percentage</option>
          </select>
          <button type="submit">{editingId ? 'Update' : 'Save'}</button>
        </form>
      )}

      <table className="markup-table">
        <thead>
          <tr>
            <th>Markup For</th>
            <th>Agent Class</th>
            <th>Value</th>
            <th>Max Limit</th>
            <th>Theme</th>
            <th>Destination</th>
            <th>Type</th>
            <th>Status</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {markups.map((markup) => (
            <tr key={markup._id}>
              <td>{markup.markupFor}</td>
              <td>{markup.agentClass}</td>
              <td>{markup.value}</td>
              <td>{markup.maxLimit}</td>
              <td>{markup.themeName}</td>
              <td>{markup.destinationName}</td>
              <td>{markup.markupType}</td>
              <td>
                <button className={markup.status === 'Active' ? 'status-active' : 'status-inactive'} onClick={() => toggleStatus(markup._id)}>
                  {markup.status}
                </button>
              </td>
              <td>{new Date(markup.createdAt).toLocaleString()}</td>
              <td>
                <button onClick={() => handleEdit(markup)}>✏️</button>
                <button onClick={() => handleDelete(markup._id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HolidayMarkup;
