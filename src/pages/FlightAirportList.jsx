// // 52 line 

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './FlightAirportList.css';

// const FlightAirportList = () => {
//   const [airports, setAirports] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');

//   const fetchAirports = () => {
//     axios.get('http://localhost:9000/api/airports')

//       .then(res => setAirports(res.data))
//       .catch(err => console.error("Error fetching airports:", err));
//   };

//   useEffect(() => {
//     fetchAirports();
//   }, []);

//   const filteredAirports = airports.filter((a) => {
//     const matchesCountry = selectedCountry ? a.countryName === selectedCountry : true;
//     const matchesSearch = searchTerm
//       ? a.airportName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         a.airportCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         a.cityCode.toLowerCase().includes(searchTerm.toLowerCase())
//       : true;
//     return matchesCountry && matchesSearch;
//   });

//   const uniqueCountries = [...new Set(airports.map(a => a.countryName))];

//   return (
//     <div className="airport-container">
//       <h2 className="title">✈️ World Airports Directory</h2>

//       <div className="header-bar">
//         <div className="filters">
//           <select onChange={(e) => setSelectedCountry(e.target.value)} value={selectedCountry}>
//             <option value="">🌍 All Countries</option>
//             {uniqueCountries.map((c, i) => (
//               <option key={i} value={c}>{c}</option>
//             ))}
//           </select>
//           <input
//             type="text"
//             placeholder="🔎 Search by name, code or city"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <button className="search-btn" onClick={() => {}}>🔍 SEARCH</button>
//         </div>
//         {/* <div className="actions">
//           <button className="btn purple" disabled>+ Add Airport</button>
//         </div> */}
//       </div>

//       <div className="airport-table">
//         <table>
//           <thead>
//             <tr>
//               <th>Sr. No.</th>
//               <th>Airport Code</th>
//               <th>Airport Name</th>
//               <th>City Code</th>
//               <th>Country Name</th>
//               <th>Country Code</th>
//               <th>Latitude</th>
//               <th>Longitude</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredAirports.map((airport, i) => (
//               <tr key={i}>
//                 <td>{i + 1}</td>
//                 <td>{airport.airportCode}</td>
//                 <td>{airport.airportName}</td>
//                 <td>{airport.cityCode}</td>
//                 <td>{airport.countryName}</td>
//                 <td>{airport.countryCode}</td>
//                 <td>{airport.lat}</td>
//                 <td>{airport.lon}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <div className="pagination">📦 Total {filteredAirports.length} records found</div>
//       </div>
//     </div>
//   );
// };

// export default FlightAirportList;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FlightAirportList.css';

const FlightAirportList = () => {
  const [airports, setAirports] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAirports = async () => {
    try {
      const res = await axios.get('http://localhost:9000/api/airports');
      setAirports(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching airports:", err);
      setError("Failed to load airports.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirports();
  }, []);

  const filteredAirports = airports.filter((a) => {
    const matchesCountry = selectedCountry ? a.countryName === selectedCountry : true;
    const matchesSearch = searchTerm
      ? (a.airportName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.airportCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.cityCode?.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;
    return matchesCountry && matchesSearch;
  });

  const uniqueCountries = [...new Set(airports.map(a => a.countryName).filter(Boolean))].sort();

  return (
    <div className="airport-container">
      <h2 className="title">✈️ World Airports Directory</h2>

      <div className="header-bar">
        <div className="filters">
          <select onChange={(e) => setSelectedCountry(e.target.value)} value={selectedCountry}>
            <option value="">🌍 All Countries</option>
            {uniqueCountries.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="🔎 Search by name, code or city"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-btn" onClick={() => {}}>🔍 SEARCH</button>
        </div>
      </div>

      <div className="airport-table">
        {loading ? (
          <div className="loading">⏳ Loading airports...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Airport Code</th>
                  <th>Airport Name</th>
                  <th>City Code</th>
                  <th>Country Name</th>
                  <th>Country Code</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                </tr>
              </thead>
              <tbody>
                {filteredAirports.map((airport, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{airport.airportCode || '-'}</td>
                    <td>{airport.airportName || '-'}</td>
                    <td>{airport.cityCode || '-'}</td>
                    <td>{airport.countryName || '-'}</td>
                    <td>{airport.countryCode || '-'}</td>
                    <td>{airport.lat || '-'}</td>
                    <td>{airport.lon || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              📦 Total {filteredAirports.length} record{filteredAirports.length !== 1 ? 's' : ''} found
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FlightAirportList;
