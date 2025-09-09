import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddFareRule.css';

function AddFareRule() {
  const [formData, setFormData] = useState({
    airType: '',
    refundableType: '',
    airline: '',
    bookingClass: '',
    status: 'Active',
    fareRuleDescription: '',
    handBaggage: { adult: '', child: '', infant: '' },
    checkInBaggage: { adult: '', child: '', infant: '' },
  });

  const [airlines, setAirlines] = useState([]);
  const [fareRules, setFareRules] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    axios.get('/api/world-airlines')
      .then(res => setAirlines(res.data))
      .catch(() => setAirlines([]));
    fetchFareRules();
  }, []);

  const fetchFareRules = async () => {
    try {
      const res = await axios.get('/api/fare-rules');
      setFareRules(res.data);
    } catch (err) {
      console.error("Error fetching fare rules");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBaggageChange = (type, key, value) => {
    setFormData({ ...formData, [type]: { ...formData[type], [key]: value } });
  };

  const handleEdit = (rule) => {
    setFormData(rule);
    setIsEditing(true);
    setEditingId(rule._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this fare rule?")) {
      try {
        await axios.delete(`/api/fare-rules/${id}`);
        setFareRules(fareRules.filter(r => r._id !== id));
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const res = await axios.put(`/api/fare-rules/${editingId}`, formData);
        setFareRules(fareRules.map(r => (r._id === editingId ? res.data : r)));
        setIsEditing(false);
        setEditingId(null);
      } else {
        const res = await axios.post('/api/fare-rules', formData);
        setFareRules([res.data, ...fareRules]);
      }

      setFormData({
        airType: '',
        refundableType: '',
        airline: '',
        bookingClass: '',
        status: 'Active',
        fareRuleDescription: '',
        handBaggage: { adult: '', child: '', infant: '' },
        checkInBaggage: { adult: '', child: '', infant: '' },
      });
    } catch (error) {
      alert('Failed to save');
    }
  };

  return (
    <div className="fare-rule-container">
      <h2>{isEditing ? "Edit Fare Rule" : "Add Fare Rule"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <input name="airType" placeholder="Air Type" value={formData.airType} onChange={handleChange} />
          <select name="refundableType" value={formData.refundableType} onChange={handleChange}>
            <option value="">Refundable Type</option>
            <option value="Refundable">Refundable</option>
            <option value="Non-Refundable">Non-Refundable</option>
          </select>
          <select name="airline" value={formData.airline} onChange={handleChange}>
            <option value="">Select Airline</option>
            {airlines.map(a => (
              <option key={a.airlineCode} value={a.airlineCode}>{a.airlineName}</option>
            ))}
          </select>
          <input name="bookingClass" placeholder="Booking Class" value={formData.bookingClass} onChange={handleChange} />
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <textarea
          name="fareRuleDescription"
          placeholder="Fare Rule Description (HTML supported)"
          rows={5}
          value={formData.fareRuleDescription}
          onChange={handleChange}
        />

        <div className="baggage">
          <h4>Hand Baggage</h4>
          <input placeholder="Adult" value={formData.handBaggage.adult} onChange={(e) => handleBaggageChange('handBaggage', 'adult', e.target.value)} />
          <input placeholder="Child" value={formData.handBaggage.child} onChange={(e) => handleBaggageChange('handBaggage', 'child', e.target.value)} />
          <input placeholder="Infant" value={formData.handBaggage.infant} onChange={(e) => handleBaggageChange('handBaggage', 'infant', e.target.value)} />

          <h4>Check-In Baggage</h4>
          <input placeholder="Adult" value={formData.checkInBaggage.adult} onChange={(e) => handleBaggageChange('checkInBaggage', 'adult', e.target.value)} />
          <input placeholder="Child" value={formData.checkInBaggage.child} onChange={(e) => handleBaggageChange('checkInBaggage', 'child', e.target.value)} />
          <input placeholder="Infant" value={formData.checkInBaggage.infant} onChange={(e) => handleBaggageChange('checkInBaggage', 'infant', e.target.value)} />
        </div>

        <button type="submit">{isEditing ? "UPDATE" : "SUBMIT"}</button>
      </form>

      <hr />
      <h3>Fare Rules List</h3>
      <table className="fare-rule-table">
        <thead>
          <tr>
            <th>Airline</th>
            <th>Class</th>
            <th>Refund Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fareRules.map((rule, index) => (
            <tr key={index}>
              <td>{rule.airline}</td>
              <td>{rule.bookingClass}</td>
              <td>{rule.refundableType}</td>
              <td>{rule.status}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(rule)}>✏️</button>
                <button className="delete-btn" onClick={() => handleDelete(rule._id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AddFareRule;
