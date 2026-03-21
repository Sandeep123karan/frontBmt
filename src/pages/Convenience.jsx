// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './Convenience.css';

// const Convenience = () => {
//   const [fees, setFees] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({
//     feeFor: "",
//     paymentGateway: "",
//     services: [],
//     amountMin: "",
//     amountMax: "",
//     agentClasses: [],
//     creditCardType: ""
//   });

//   useEffect(() => {
//     fetchFees();
//   }, []);

//   const fetchFees = async () => {
//     try {
//       const res = await axios.get("http://localhost:9000/api/convenience-fees");
//       setFees(res.data);
//     } catch (err) {
//       console.error("Error:", err);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "services" || name === "agentClasses") {
//       setFormData({ ...formData, [name]: value.split(',') });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       await axios.post("http://localhost:9000/api/convenience-fees", formData);
//       fetchFees();
//       setShowForm(false);
//       setFormData({
//         feeFor: "", paymentGateway: "", services: [],
//         amountMin: "", amountMax: "", agentClasses: [], creditCardType: ""
//       });
//     } catch (err) {
//       console.error("Submit error", err);
//     }
//   };

//   return (
//     <div className="container">
//       <div className="header">
//         <h2>CONVENIENCE FEE LIST</h2>
//         <button onClick={() => setShowForm(true)}>+ Add Convenience Fee</button>
//       </div>

//       <table>
//         <thead>
//           <tr>
//             <th>Convenience Fee For</th>
//             <th>Payment Gateway</th>
//             <th>Service</th>
//             <th>Amount Range</th>
//             <th>Agent Class</th>
//             <th>Credit Card Type</th>
//           </tr>
//         </thead>
//         <tbody>
//           {fees.map((fee, index) => (
//             <tr key={index}>
//               <td>{fee.feeFor}</td>
//               <td>{fee.paymentGateway}</td>
//               <td>{fee.services.join(', ')}</td>
//               <td>{fee.amountMin} - {fee.amountMax}</td>
//               <td>{fee.agentClasses.join(', ')}</td>
//               <td>{fee.creditCardType}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {showForm && (
//         <div className="form">
//           <h3>ADD CONVENIENCE FEE</h3>
//           <select name="feeFor" value={formData.feeFor} onChange={handleChange}>
//             <option value="">Select Fee For</option>
//             <option value="B2B">B2B</option>
//             <option value="B2C">B2C</option>
//           </select>

//           <select name="paymentGateway" value={formData.paymentGateway} onChange={handleChange}>
//             <option value="">Select Payment Gateway</option>
//             <option value="PHONEPE">PHONEPE</option>
//             <option value="RAZORPAY">RAZORPAY</option>
//           </select>

//           <input type="text" name="services" value={formData.services.join(',')} placeholder="Services (comma-separated)" onChange={handleChange} />
//           <input type="number" name="amountMin" placeholder="Min Value" value={formData.amountMin} onChange={handleChange} />
//           <input type="number" name="amountMax" placeholder="Max Value" value={formData.amountMax} onChange={handleChange} />
//           <input type="text" name="agentClasses" value={formData.agentClasses.join(',')} placeholder="Agent Classes (comma-separated)" onChange={handleChange} />
//           <input type="text" name="creditCardType" placeholder="Credit Card Type" value={formData.creditCardType} onChange={handleChange} />

//           <button onClick={handleSubmit}>SAVE</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Convenience;import React, { useEffect, useState } from 'react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Convenience.css';

function ConvenienceFee() {
  const [fees, setFees] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    airline: '',
    fareType: '',
    feeType: 'Fixed',
    value: ''
  });

  useEffect(() => {
    fetchFees();
    fetchAirlines();
  }, []);

  const fetchFees = async () => {
    try {
      const res = await axios.get("http://localhost:9000/api/convenience-fees");
      setFees(res.data);
    } catch (err) {
      console.error("Error fetching fees:", err);
    }
  };

  const fetchAirlines = async () => {
    try {
      const res = await axios.get("http://localhost:9000/api/world-airlines");
      setAirlines(res.data);
    } catch (err) {
      console.error("Error fetching airlines:", err);
    }
  };

  const handleSave = async () => {
    if (!formData.airline || !formData.fareType || !formData.feeType || formData.value === '') {
      alert("❗ Please fill all fields.");
      return;
    }

    const payload = {
      ...formData,
      value: Number(formData.value)
    };

    try {
      if (editId) {
        await axios.put(`http://localhost:9000/api/convenience-fees/${editId}`, payload);
      } else {
        await axios.post("http://localhost:9000/api/convenience-fees", payload);
      }
      resetForm();
      fetchFees();
    } catch (err) {
      console.error("❌ Error saving fee:", err);
      alert("Error: " + (err.response?.data?.message || "Something went wrong"));
    }
  };

  const resetForm = () => {
    setFormData({ airline: '', fareType: '', feeType: 'Fixed', value: '' });
    setEditId(null);
  };

  const handleEdit = (f) => {
    setFormData({
      airline: f.airline,
      fareType: f.fareType,
      feeType: f.feeType,
      value: f.value
    });
    setEditId(f._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this fee?")) {
      await axios.delete(`http://localhost:9000/api/convenience-fees/${id}`);
      fetchFees();
    }
  };

  return (
    <div className="fee-container">
      <h2>⚙️ Convenience Fee Master</h2>

      <div className="fee-form">
        <select value={formData.airline} onChange={e => setFormData({ ...formData, airline: e.target.value })}>
          <option value="">✈️ Select Airline</option>
          {airlines.map((a, i) => (
            <option key={i} value={a.airlineName}>{a.airlineName}</option>
          ))}
        </select>

        {/* Static Fare Types */}
        <select value={formData.fareType} onChange={e => setFormData({ ...formData, fareType: e.target.value })}>
          <option value="">🎫 Select Fare Type</option>
          <option value="Refundable">Refundable</option>
          <option value="Non-Refundable">Non-Refundable</option>
        </select>

        <select value={formData.feeType} onChange={e => setFormData({ ...formData, feeType: e.target.value })}>
          <option value="Fixed">💰 Fixed</option>
          <option value="Percentage">📊 Percentage</option>
        </select>

        <input
          type="number"
          placeholder="💸 Fee Value"
          value={formData.value}
          onChange={e => setFormData({ ...formData, value: e.target.value })}
        />

        <button onClick={handleSave}>{editId ? 'Update' : 'Save'}</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Airline</th>
            <th>Fare Type</th>
            <th>Fee Type</th>
            <th>Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fees.length === 0 ? (
            <tr><td colSpan="5">No Fees Found</td></tr>
          ) : (
            fees.map((f, i) => (
              <tr key={i}>
                <td>{f.airline}</td>
                <td>{f.fareType}</td>
                <td>{f.feeType}</td>
                <td>{f.value}</td>
                <td>
                  <button onClick={() => handleEdit(f)}>✏️</button>
                  <button onClick={() => handleDelete(f._id)} style={{ color: "red" }}>🗑️</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ConvenienceFee;
