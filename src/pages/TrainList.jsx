import React, { useState } from "react";
import axios from "axios";

const TrainList = () => {
  const [from, setFrom] = useState("stop_area:OCE:SA:87751004"); // Paris
  const [to, setTo] = useState("stop_area:OCE:SA:87751002");     // Versailles
  const [datetime, setDatetime] = useState("20220101T080000");   // default valid sandbox date
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTrains = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://bmt-backend-1-vq3f.onrender.com/api/trains", {
        params: {
          from,
          to,
          datetime,
        },
      });
      setTrains(res.data);
    } catch (error) {
      alert("🚫 Error fetching trains:\n" + (error?.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>🚆 Train Search (Navitia Sandbox)</h2>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="From (e.g. stop_area:OCE:SA:87751004)"
          style={{ marginRight: "10px", padding: "5px", width: "300px" }}
        />

        <input
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="To (e.g. stop_area:OCE:SA:87751002)"
          style={{ marginRight: "10px", padding: "5px", width: "300px" }}
        />

        <input
          type="datetime-local"
          onChange={(e) => {
            const val = e.target.value;
            const formatted = val.replace(/[-:]/g, "").replace("T", "T"); // convert to Navitia format
            setDatetime(formatted);
          }}
          style={{ padding: "5px" }}
        />

        <button
          onClick={fetchTrains}
          style={{
            padding: "7px 15px",
            marginLeft: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          🔍 Search
        </button>
      </div>

      {loading && <p>Loading trains...</p>}

      {trains.length > 0 && (
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            border: "1px solid #ddd",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              <th>Origin</th>
              <th>Destination</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Duration (sec)</th>
              <th>Fare</th>
            </tr>
          </thead>
          <tbody>
            {trains.map((train, i) => (
              <tr key={i}>
                <td>{train.origin}</td>
                <td>{train.destination}</td>
                <td>{train.departure_time}</td>
                <td>{train.arrival_time}</td>
                <td>{train.duration}</td>
                <td>₹{train.total_fare}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TrainList;
