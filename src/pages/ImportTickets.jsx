import React, { useState } from 'react';
import axios from 'axios';
import './ImportTickets.css';

function ImportTickets() {
  const [formData, setFormData] = useState({
    companyName: '',
    apiSupplier: '',
    issueSupplier: '',
    pnr: '',
    lastName: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImport = async () => {
    try {
      const res = await axios.post('/api/tickets/import', formData);
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert("Import failed");
    }
  };

  return (
    <div className="ticket-import-container">
      <h2>FLIGHT TICKET IMPORT</h2>
      <div className="ticket-form">
        <input
          type="text"
          placeholder="Web Partner/Company Name"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
        />
        <select name="apiSupplier" value={formData.apiSupplier} onChange={handleChange}>
          <option value="">Select API Supplier</option>
          <option value="TBO">TBO</option>
          <option value="Riya">Riya</option>
        </select>
        <select name="issueSupplier" value={formData.issueSupplier} onChange={handleChange}>
          <option value="">Select Issue Supplier</option>
          <option value="TBO">TBO</option>
          <option value="Riya">Riya</option>
        </select>
        <input
          type="text"
          placeholder="PNR"
          name="pnr"
          value={formData.pnr}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
        <button onClick={handleImport}>IMPORT</button>
      </div>
    </div>
  );
}

export default ImportTickets;
