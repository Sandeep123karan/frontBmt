import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PrivateFareList.css';

function PrivateFareList() {
  const [fares, setFares] = useState([]);
  const [formData, setFormData] = useState({
    key: '',
    value: '',
    fromDate: '',
    toDate: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [editingFare, setEditingFare] = useState(null);
  const [newFare, setNewFare] = useState({
    inventoryName: '', supplier: '', source: '', sourceTerminal: '',
    tripType: '', journeyType: '', destination: '', destinationTerminal: '',
    flightNumber: '', airline: '', seat: '', fromDate: '', toDate: ''
  });

  const fetchFares = async () => {
    try {
      const params = new URLSearchParams();
      if (formData.key && formData.value) params.append('key', formData.key), params.append('value', formData.value);
      if (formData.fromDate && formData.toDate) {
        params.append('fromDate', formData.fromDate);
        params.append('toDate', formData.toDate);
      }
      const res = await axios.get(`/api/private-fare?${params.toString()}`);
      setFares(res.data);
    } catch (err) {
      console.error("Failed to fetch fares", err);
    }
  };

  useEffect(() => {
    fetchFares();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNewFareChange = (e) => {
    setNewFare({ ...newFare, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    fetchFares();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this fare?")) {
      await axios.delete(`/api/private-fare/${id}`);
      fetchFares();
    }
  };

  const openForm = (fare = null) => {
    setEditingFare(fare);
    setNewFare(
      fare || {
        inventoryName: '', supplier: '', source: '', sourceTerminal: '',
        tripType: '', journeyType: '', destination: '', destinationTerminal: '',
        flightNumber: '', airline: '', seat: '', fromDate: '', toDate: ''
      }
    );
    setShowForm(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingFare) {
        await axios.put(`/api/private-fare/${editingFare._id}`, newFare);
      } else {
        await axios.post('/api/private-fare', newFare);
      }
      setShowForm(false);
      fetchFares();
    } catch (err) {
      alert('Save failed');
    }
  };

  const exportCSV = () => {
    const headers = Object.keys(fares[0] || {}).filter(key => key !== '_id');
    const rows = fares.map(fare => headers.map(h => fare[h]));
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'private_fares.csv';
    link.click();
  };

  return (
    <div className="private-fare-container">
      <h2>Manage Private Fare</h2>

      <div className="search-bar">
        <select name="key" value={formData.key} onChange={handleChange}>
          <option value="">Select key</option>
          <option value="inventoryName">Inventory Name</option>
          <option value="airline">Airline</option>
          <option value="flightNumber">Flight Number</option>
        </select>
        <input name="value" placeholder="Value" value={formData.value} onChange={handleChange} />
        <input type="date" name="fromDate" value={formData.fromDate} onChange={handleChange} />
        <input type="date" name="toDate" value={formData.toDate} onChange={handleChange} />
        <button onClick={handleSearch}>Search</button>
        <button onClick={exportCSV}>Export CSV</button>
        <button onClick={() => openForm()}>+ Add Fare</button>
      </div>

      <table className="fare-table">
        <thead>
          <tr>
            <th>Inventory Name</th>
            <th>Supplier</th>
            <th>Source</th>
            <th>Source Terminal</th>
            <th>Trip Type</th>
            <th>Journey Type</th>
            <th>Destination</th>
            <th>Destination Terminal</th>
            <th>Flight No</th>
            <th>Airline</th>
            <th>Seat</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {fares.map(fare => (
            <tr key={fare._id}>
              <td>{fare.inventoryName}</td>
              <td>{fare.supplier}</td>
              <td>{fare.source}</td>
              <td>{fare.sourceTerminal}</td>
              <td>{fare.tripType}</td>
              <td>{fare.journeyType}</td>
              <td>{fare.destination}</td>
              <td>{fare.destinationTerminal}</td>
              <td>{fare.flightNumber}</td>
              <td>{fare.airline}</td>
              <td>{fare.seat}</td>
              <td>
                <button onClick={() => openForm(fare)}>Edit</button>
                <button onClick={() => handleDelete(fare._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div className="modal-form">
          <h3>{editingFare ? "Edit Fare" : "Add Fare"}</h3>
          <div className="form-grid">
            {Object.keys(newFare).map((key) => (
              <input
                key={key}
                name={key}
                placeholder={key}
                value={newFare[key]}
                onChange={handleNewFareChange}
                type={key.toLowerCase().includes("date") ? "date" : "text"}
              />
            ))}
          </div>
          <button onClick={handleSubmit}>Save</button>
          <button onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default PrivateFareList;