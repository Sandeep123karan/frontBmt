

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FlightAirline.css';

const FlightAirline = () => {
  const [airlines, setAirlines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAirlines = async () => {
      try {
        const res = await axios.get('http://localhost:9000/api/world-airlines');
        setAirlines(res.data);
        setLoading(false);
      } catch (err) {
        console.error("❌ Fetch error:", err.message);
        setError('Unable to fetch airlines. Check backend or internet.');
        setLoading(false);
      }
    };

    fetchAirlines();
  }, []);

  const filteredAirlines = airlines.filter((a) =>
    a.airlineName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.airlineCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="airline-container">
      <div className="header-bar">
        <div className="filters">
          <input
            type="text"
            placeholder="Search by name, code, or country"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* <div className="actions">
          <button className="btn purple" disabled>+ Add Airline</button>
        </div> */}
      </div>

      <div className="airline-table">
        {loading ? (
          <div className="loading">⏳ Loading airlines...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Airline Logo</th>
                <th>Airline Code</th>
                <th>Airline Name</th>
                <th>Callsign</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
              {filteredAirlines.length > 0 ? (
                filteredAirlines.map((a, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>
                      <img
                        src={a.airlineImage}
                        alt="logo"
                        height="24"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                        }}
                      />
                    </td>
                    <td>{a.airlineCode || 'N/A'}</td>
                    <td>{a.airlineName || 'N/A'}</td>
                    <td>{a.callsign || '—'}</td>
                    <td>{a.country || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-results">No airlines found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        {!loading && !error && (
          <div className="pagination">
            Total {filteredAirlines.length} airline{filteredAirlines.length !== 1 && 's'} found
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightAirline;
