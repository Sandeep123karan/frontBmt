import React, { useState } from "react";
import axios from "axios";
import "./FlightBookingCalender.css";

function FlightBookingCalender() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!fromDate || !toDate) return alert("Select both dates");

    try {
      const res = await axios.get(`/api/bookings/by-date`, {
        params: { fromDate, toDate },
      });
      setResults(res.data);
    } catch (err) {
      console.error("❌ Error fetching bookings:", err);
    }
  };

  return (
    <div className="calendar-container">
      <h2>FLIGHT BOOKING CALENDER</h2>

      <div className="input-row">
        <div>
          <label>From Date</label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </div>
        <div>
          <label>To Date</label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>
        <button onClick={handleSearch}>🔍 SEARCH</button>
      </div>

      {results.length > 0 && (
        <div className="results-box">
          <p>Total {results.length} bookings found</p>
          <ul>
            {results.map((b, i) => (
              <li key={i}>{b.refNo} - {b.leadPassenger} - {b.bookingDate?.slice(0, 10)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FlightBookingCalender;
