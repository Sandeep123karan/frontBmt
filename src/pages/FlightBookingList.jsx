import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FlightBookingList.css"
export default function FlightBookingList() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get("/api/bookings")
      .then(res => setBookings(res.data))
      .catch(err => console.error("❌ Error:", err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">FLIGHT BOOKING LIST</h2>
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-blue-100">
            <th className="p-2 border">Ref No</th>
            <th className="p-2 border">Booking Source</th>
            <th className="p-2 border">Airline</th>
            <th className="p-2 border">Journey Type</th>
            <th className="p-2 border">Sector</th>
            <th className="p-2 border">Lead Passenger</th>
            <th className="p-2 border">PNR</th>
            <th className="p-2 border">Supplier</th>
            <th className="p-2 border">Selling Fare</th>
            <th className="p-2 border">Purchase Fare</th>
            <th className="p-2 border">Pay Status</th>
            <th className="p-2 border">Book Status</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Currency</th>
            <th className="p-2 border">Created By</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, idx) => (
            <tr key={idx}>
              <td className="p-2 border">{b.refNo}</td>
              <td className="p-2 border">{b.bookingSource}</td>
              <td className="p-2 border">{b.airline}</td>
              <td className="p-2 border">{b.journeyType}</td>
              <td className="p-2 border">{b.sector}</td>
              <td className="p-2 border">{b.leadPassenger}</td>
              <td className="p-2 border">{b.pnr}</td>
              <td className="p-2 border">{b.supplier}</td>
              <td className="p-2 border">£ {b.sellingFare}</td>
              <td className="p-2 border">£ {b.purchaseFare}</td>
              <td className="p-2 border text-green-600">{b.payStatus}</td>
              <td className="p-2 border text-blue-600">{b.bookStatus}</td>
              <td className="p-2 border">{b.type}</td>
              <td className="p-2 border">{b.bookingCurrency}</td>
              <td className="p-2 border">{b.createdBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
