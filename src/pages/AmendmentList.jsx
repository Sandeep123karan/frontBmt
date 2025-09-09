import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AmendmentList.css"
export default function AmendmentList() {
  const [amendments, setAmendments] = useState([]);

  useEffect(() => {
    axios.get("/api/flight-amendments/by-date?fromDate=2025-06-01&toDate=2025-06-30")
      .then(res => setAmendments(res.data))
      .catch(err => console.error("❌", err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Flight Amendments List</h2>
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Booking Ref</th>
            <th className="p-2 border">Source</th>
            <th className="p-2 border">Amendment ID</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Journey</th>
            <th className="p-2 border">Sector</th>
            <th className="p-2 border">Departure</th>
            <th className="p-2 border">Airline</th>
            <th className="p-2 border">PNR</th>
            <th className="p-2 border">Booking Status</th>
            <th className="p-2 border">Admin Remark</th>
            <th className="p-2 border">General Remark</th>
          </tr>
        </thead>
        <tbody>
          {amendments.map((a, i) => (
            <tr key={i}>
              <td className="p-2 border">{a.bookingRefNo}</td>
              <td className="p-2 border">{a.bookingSource}</td>
              <td className="p-2 border">{a.amendmentId}</td>
              <td className="p-2 border">{a.amendmentType}</td>
              <td className="p-2 border">{a.amendmentStatus}</td>
              <td className="p-2 border">{a.journeyType}</td>
              <td className="p-2 border">{a.sector}</td>
              <td className="p-2 border">{a.departureDate?.slice(0, 10)}</td>
              <td className="p-2 border">{a.airlineCode}</td>
              <td className="p-2 border">{a.pnr}</td>
              <td className="p-2 border">{a.bookingStatus}</td>
              <td className="p-2 border">{a.adminRemark}</td>
              <td className="p-2 border">{a.generalRemark}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
