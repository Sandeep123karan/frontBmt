import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RuleListManage.css';
import * as XLSX from 'xlsx';

function RuleListManage() {
  const [rules, setRules] = useState([]);
  const [formData, setFormData] = useState({
    airline: '',
    bookingClass: '',
    status: 'Active'
  });
  const [airlines, setAirlines] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchRules();
    fetchAirlines();
  }, []);

  const fetchRules = async () => {
    const res = await axios.get('/api/manage-fare-rules');
    setRules(res.data);
  };

  const fetchAirlines = async () => {
    const res = await axios.get('/api/world-airlines');
    setAirlines(res.data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openModal = (rule = null) => {
    if (rule) {
      setEditingId(rule._id);
      setFormData({
        airline: rule.airline,
        bookingClass: rule.bookingClass,
        status: rule.status
      });
    } else {
      setEditingId(null);
      setFormData({ airline: '', bookingClass: '', status: 'Active' });
    }
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`/api/manage-fare-rules/${editingId}`, formData);
    } else {
      await axios.post('/api/manage-fare-rules', formData);
    }
    closeModal();
    fetchRules();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/manage-fare-rules/${id}`);
    fetchRules();
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rules);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'FareRules');
    XLSX.writeFile(workbook, 'FareRules.xlsx');
  };

  const filteredRules = rules
    .filter(rule => rule.airline.toLowerCase().includes(search.toLowerCase()))
    .filter(rule => statusFilter === 'All' || rule.status === statusFilter);

  const paginatedRules = filteredRules.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredRules.length / itemsPerPage);

  return (
    <div className="rule-list-manage">
      <h2>Manage Fare Rules</h2>

      <div className="top-bar">
        <input
          className="search-input"
          placeholder="Search Airline..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button onClick={() => openModal()}>➕ Add Rule</button>
        <button onClick={exportToExcel}>📥 Export</button>
      </div>

      <table className="rule-table">
        <thead>
          <tr>
            <th>Airline</th>
            <th>Class</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRules.map(rule => (
            <tr key={rule._id}>
              <td>{rule.airline}</td>
              <td>{rule.bookingClass}</td>
              <td>{rule.status}</td>
              <td>
                <button onClick={() => openModal(rule)}>✏️</button>
                <button onClick={() => handleDelete(rule._id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i + 1} onClick={() => setCurrentPage(i + 1)}>
            {i + 1}
          </button>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingId ? 'Edit Fare Rule' : 'Add Fare Rule'}</h3>
            <form onSubmit={handleSubmit} className="rule-form">
              <select name="airline" value={formData.airline} onChange={handleChange}>
                <option value="">Select Airline</option>
                {airlines.map(a => (
                  <option key={a.airlineCode} value={a.airlineCode}>{a.airlineName}</option>
                ))}
              </select>
              <input
                name="bookingClass"
                placeholder="Booking Class"
                value={formData.bookingClass}
                onChange={handleChange}
              />
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <button type="submit">Save</button>
              <button type="button" onClick={closeModal}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RuleListManage;
