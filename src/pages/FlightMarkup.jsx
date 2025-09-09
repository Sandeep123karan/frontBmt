import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FlightMarkup.css';

function FlightMarkup() {
  const [formData, setFormData] = useState({
    markupFor: '',
    agentClass: '',
    airlineCode: '',
    flightType: '',
    journeyType: '',
    markupType: '',
    amount: '',
    cabinClass: '',
  });

  const [markupList, setMarkupList] = useState([]);

  useEffect(() => {
    fetchMarkupData();
  }, []);

  const fetchMarkupData = async () => {
    try {
      const res = await axios.get('/api/flight-markup');
      setMarkupList(res.data);
    } catch (err) {
      console.error('Error fetching markup data', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/flight-markup', formData);
      fetchMarkupData();
      setFormData({
        markupFor: '', agentClass: '', airlineCode: '',
        flightType: '', journeyType: '', markupType: '',
        amount: '', cabinClass: ''
      });
    } catch (err) {
      console.error('Error saving markup', err);
    }
  };

  return (
    <div className="markup-container">
      <div className="markup-header">
        <h2>Flight Markup</h2>
        <div className="markup-actions">
          <button onClick={handleSubmit}>+ Add Flight Markup</button>
        </div>
      </div>

      <form className="markup-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Markup For</label>
          <select name="markupFor" value={formData.markupFor} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="B2C">B2C</option>
            <option value="B2B">B2B</option>
          </select>
        </div>

        <div className="form-row">
          <label>Agent Class</label>
          <input name="agentClass" value={formData.agentClass} onChange={handleChange} />
        </div>

        <div className="form-row">
          <label>Airline Code</label>
          <input name="airlineCode" value={formData.airlineCode} onChange={handleChange} />
        </div>

        <div className="form-row">
          <label>Flight Type</label>
          <input name="flightType" value={formData.flightType} onChange={handleChange} />
        </div>

        <div className="form-row">
          <label>Journey Type</label>
          <input name="journeyType" value={formData.journeyType} onChange={handleChange} />
        </div>

        <div className="form-row">
          <label>Markup Type</label>
          <select name="markupType" value={formData.markupType} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Fixed">Fixed</option>
            <option value="Percentage">Percentage</option>
          </select>
        </div>

        <div className="form-row">
          <label>Amount</label>
          <input type="number" name="amount" value={formData.amount} onChange={handleChange} />
        </div>

        <div className="form-row">
          <label>Cabin Class</label>
          <input name="cabinClass" value={formData.cabinClass} onChange={handleChange} />
        </div>

        <button type="submit">Save Markup</button>
      </form>

      <div className="markup-table">
        <table>
          <thead>
            <tr>
              <th>Markup For</th>
              <th>Agent Class</th>
              <th>Airline Code</th>
              <th>Flight Type</th>
              <th>Journey Type</th>
              <th>Markup Type</th>
              <th>Amount</th>
              <th>Cabin Class</th>
            </tr>
          </thead>
          <tbody>
            {markupList.map((item, index) => (
              <tr key={index}>
                <td>{item.markupFor}</td>
                <td>{item.agentClass}</td>
                <td>{item.airlineCode}</td>
                <td>{item.flightType}</td>
                <td>{item.journeyType}</td>
                <td>{item.markupType}</td>
                <td>{item.amount}</td>
                <td>{item.cabinClass}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

 
export default FlightMarkup;
