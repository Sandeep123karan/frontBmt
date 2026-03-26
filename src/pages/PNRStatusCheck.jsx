import React, { useState } from "react";
import axios from "axios";

const API = "https://bmtadmin.onrender.com/api/pnr-status";

export default function PNRStatusCheck() {
  const [pnr, setPnr] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const checkPNR = async () => {
    if (!pnr || pnr.length !== 10) {
      setError("Enter valid 10-digit PNR");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${API}/${pnr}`);
      setResult(res.data);
    } catch (err) {
      setError("PNR not found");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">PNR Status Check</h2>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 rounded w-full"
          placeholder="Enter PNR (10 digits)"
          value={pnr}
          onChange={(e) => setPnr(e.target.value)}
        />
        <button
          onClick={checkPNR}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Check
        </button>
      </div>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      {loading && <p className="text-gray-500">Checking...</p>}

      {result && (
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-xl font-bold mb-2">
            {result.trainName} ({result.trainNo})
          </h3>

          <p><strong>Journey Date:</strong> {result.journeyDate}</p>
          <p><strong>Chart Status:</strong> {result.chartStatus}</p>

          <h4 className="mt-4 font-semibold text-lg">Passengers</h4>

          <table className="w-full border mt-2">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Age</th>
                <th className="p-2 border">Gender</th>
                <th className="p-2 border">Booking Status</th>
                <th className="p-2 border">Current Status</th>
              </tr>
            </thead>
            <tbody>
              {result.passengers.map((p, i) => (
                <tr key={i} className="border">
                  <td className="p-2 border">{p.name}</td>
                  <td className="p-2 border">{p.age}</td>
                  <td className="p-2 border">{p.gender}</td>
                  <td className="p-2 border">{p.bookingStatus}</td>
                  <td className="p-2 border">{p.currentStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
