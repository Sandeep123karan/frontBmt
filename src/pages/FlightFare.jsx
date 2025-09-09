// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './FlightFare.css';

// function FlightFare() {
//   const [fares, setFares] = useState([]);
//   const [search, setSearch] = useState('');
//   const [filter, setFilter] = useState('');
//   const [formVisible, setFormVisible] = useState(false);
//   const [formData, setFormData] = useState({
//     supplierFareType: '',
//     apiFareType: '',
//     apiSupplier: 'TBO',
//   });
//   const [editId, setEditId] = useState(null);

//   useEffect(() => {
//     fetchFares();
//   }, []);

//   const fetchFares = async () => {
//     try {
//       const response = await axios.get('https://bmt-backend-1-vq3f.onrender.com/api/fares');
//       setFares(response.data);
//     } catch (error) {
//       console.error('Error fetching fares:', error.message);
//     }
//   };

//   const handleSave = async () => {
//     try {
//       if (editId) {
//         await axios.put(`https://bmt-backend-1-vq3f.onrender.com/api/fares/${editId}`, formData);
//       } else {
//         await axios.post('https://bmt-backend-1-vq3f.onrender.com/api/fares', formData);
//       }
//       setFormData({ supplierFareType: '', apiFareType: '', apiSupplier: 'TBO' });
//       setFormVisible(false);
//       setEditId(null);
//       fetchFares();
//     } catch (err) {
//       console.error('Error saving fare:', err.message);
//     }
//   };

//   const handleEdit = (fare) => {
//     setFormData(fare);
//     setEditId(fare._id);
//     setFormVisible(true);
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`https://bmt-backend-1-vq3f.onrender.com/api/fares/${id}`);
//       fetchFares();
//     } catch (err) {
//       console.error('Error deleting fare:', err.message);
//     }
//   };

//   const filteredFares = fares.filter(f =>
//     f.supplierFareType.toLowerCase().includes(search.toLowerCase()) &&
//     (filter === '' || f.apiSupplier === filter)
//   );

//   return (
//     <div className="fare-container">
//       <div className="fare-header">
//         <h2>Flight Fare Master</h2>
//         <button onClick={() => {
//           setFormVisible(!formVisible);
//           setFormData({ supplierFareType: '', apiFareType: '', apiSupplier: 'TBO' });
//           setEditId(null);
//         }}>
//           {formVisible ? 'Close' : '+ Add Fare Type'}
//         </button>
//       </div>

//       {formVisible && (
//         <div className="fare-form">
//           <input
//             type="text"
//             placeholder="Supplier Fare Type"
//             value={formData.supplierFareType}
//             onChange={(e) => setFormData({ ...formData, supplierFareType: e.target.value })}
//           />
//           <input
//             type="text"
//             placeholder="API Fare Type"
//             value={formData.apiFareType}
//             onChange={(e) => setFormData({ ...formData, apiFareType: e.target.value })}
//           />
//           <select
//             value={formData.apiSupplier}
//             onChange={(e) => setFormData({ ...formData, apiSupplier: e.target.value })}
//           >
//             <option value="TBO">TBO</option>
//             <option value="AMEX">AMEX</option>
//             <option value="SABRE">SABRE</option>
//           </select>
//           <button onClick={handleSave}>{editId ? 'Update' : 'Save'}</button>
//         </div>
//       )}

//       <div className="fare-filters">
//         <input
//           type="text"
//           placeholder="Search Supplier Fare Type"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//         <select value={filter} onChange={(e) => setFilter(e.target.value)}>
//           <option value="">All Suppliers</option>
//           <option value="TBO">TBO</option>
//           <option value="AMEX">AMEX</option>
//           <option value="SABRE">SABRE</option>
//         </select>
//       </div>

//       <table>
//         <thead>
//           <tr>
//             <th>Supplier Fare Type</th>
//             <th>API Fare Type</th>
//             <th>API Supplier</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredFares.length === 0 ? (
//             <tr><td colSpan="4">No Data Found</td></tr>
//           ) : (
//             filteredFares.map((fare) => (
//               <tr key={fare._id}>
//                 <td>{fare.supplierFareType}</td>
//                 <td>{fare.apiFareType}</td>
//                 <td>{fare.apiSupplier}</td>
//                 <td>
//                   <button onClick={() => handleEdit(fare)}>✏️</button>
//                   <button onClick={() => handleDelete(fare._id)} style={{ color: 'red' }}>🗑️</button>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default FlightFare;
import React, { useEffect, useState } from "react";
import axios from "axios";

function FlightList() {
  const [flights, setFlights] = useState([]);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  const fetchFlights = async () => {
    try {
      const url = origin && destination
        ? `/api/live-flights/fetch?origin=${origin}&destination=${destination}`
        : "/api/live-flights/all";
      const res = await axios.get(url);
      setFlights(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">✈️ Live Flight Data</h2>

      <div className="mb-4 space-x-2">
        <input
          type="text"
          placeholder="Origin (e.g. DEL)"
          className="border px-2 py-1"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
        />
        <input
          type="text"
          placeholder="Destination (e.g. BOM)"
          className="border px-2 py-1"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <button
          onClick={fetchFlights}
          className="bg-blue-600 text-white px-4 py-1 rounded"
        >
          Search
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>Airline</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Base Fare</th>
            <th>Tax</th>
            <th>Conv. Fee</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((f, i) => (
            <tr key={i} className="text-center border-t">
              <td>{f.airline}</td>
              <td>{f.origin}</td>
              <td>{f.destination}</td>
              <td>{new Date(f.departure_time).toLocaleString()}</td>
              <td>{new Date(f.arrival_time).toLocaleString()}</td>
              <td>₹{f.baseFare}</td>
              <td>₹{f.tax}</td>
              <td>{f.convenienceFeeType === "Fixed" ? `₹${f.convenienceFee}` : `${f.convenienceFee}%`}</td>
              <td>₹{f.totalFare.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FlightList;
