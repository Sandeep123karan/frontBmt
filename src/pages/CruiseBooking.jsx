import React, { useState } from "react";

function CruiseBooking() {
  const [bookings] = useState([
    { id: 1, customer: "Amit Kumar", cruise: "Luxury Sea", seats: 2, status: "Confirmed" },
    { id: 2, customer: "Priya Sharma", cruise: "Ocean Queen", seats: 4, status: "Pending" },
  ]);

  return (
    <div className="p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Cruise Bookings</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Customer</th>
            <th className="p-2 border">Cruise</th>
            <th className="p-2 border">Seats</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="text-center">
              <td className="p-2 border">{b.customer}</td>
              <td className="p-2 border">{b.cruise}</td>
              <td className="p-2 border">{b.seats}</td>
              <td className="p-2 border">{b.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CruiseBooking;
