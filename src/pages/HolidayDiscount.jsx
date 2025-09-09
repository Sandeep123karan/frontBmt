import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HolidayDiscount.css';

function HolidayDiscount() {
  const [discounts, setDiscounts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    discountFor: 'B2C',
    agentClass: '',
    value: '',
    maxLimit: '',
    themeName: 'ANY',
    destinationName: 'ANY',
    extraDiscount: 0,
    discountType: 'Fixed'
  });
  const [editingId, setEditingId] = useState(null);

  const fetchDiscounts = async () => {
    const res = await axios.get('/api/holiday-discounts');
    setDiscounts(res.data);
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`/api/holiday-discounts/${editingId}`, formData);
    } else {
      await axios.post('/api/holiday-discounts', formData);
    }
    setFormData({
      discountFor: 'B2C',
      agentClass: '',
      value: '',
      maxLimit: '',
      themeName: 'ANY',
      destinationName: 'ANY',
      extraDiscount: 0,
      discountType: 'Fixed'
    });
    setShowForm(false);
    setEditingId(null);
    fetchDiscounts();
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this entry?")) {
      await axios.delete(`/api/holiday-discounts/${id}`);
      fetchDiscounts();
    }
  };

  const toggleStatus = async (id) => {
    await axios.put(`/api/holiday-discounts/toggle-status/${id}`);
    fetchDiscounts();
  };

  return (
    <div className="discount-container">
      <div className="top-bar">
        <button onClick={() => setShowForm(!showForm)}>+ Add Holiday Discount</button>
      </div>

      {showForm && (
        <form className="discount-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Agent Class" value={formData.agentClass} onChange={(e) => setFormData({ ...formData, agentClass: e.target.value })} required />
          <input type="number" placeholder="Value" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} required />
          <input type="number" placeholder="Max Limit" value={formData.maxLimit} onChange={(e) => setFormData({ ...formData, maxLimit: e.target.value })} required />
          <input type="number" placeholder="Extra Discount" value={formData.extraDiscount} onChange={(e) => setFormData({ ...formData, extraDiscount: e.target.value })} />
          <select value={formData.discountType} onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}>
            <option value="Fixed">Fixed</option>
            <option value="Percentage">Percentage</option>
          </select>
          <button type="submit">{editingId ? "Update" : "Save"}</button>
        </form>
      )}

      <table className="discount-table">
        <thead>
          <tr>
            <th>Discount For</th>
            <th>Agent Class</th>
            <th>Value</th>
            <th>Max Limit</th>
            <th>Theme</th>
            <th>Destination</th>
            <th>Extra Discount</th>
            <th>Discount Type</th>
            <th>Status</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {discounts.length === 0 ? (
            <tr>
              <td colSpan="11">No Discount Found</td>
            </tr>
          ) : (
            discounts.map((d) => (
              <tr key={d._id}>
                <td>{d.discountFor}</td>
                <td>{d.agentClass}</td>
                <td>{d.value}</td>
                <td>{d.maxLimit}</td>
                <td>{d.themeName}</td>
                <td>{d.destinationName}</td>
                <td>{d.extraDiscount}</td>
                <td>{d.discountType}</td>
                <td>
                  <button onClick={() => toggleStatus(d._id)} className={d.status === "Active" ? "active" : "inactive"}>
                    {d.status}
                  </button>
                </td>
                <td>{new Date(d.createdAt).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleEdit(d)}>✏️</button>
                  <button onClick={() => handleDelete(d._id)}>🗑️</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default HolidayDiscount;
