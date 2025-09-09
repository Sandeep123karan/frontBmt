import React, { useEffect, useState } from "react";
import axios from "axios";

export default function FlightDiscount() {
  const [discounts, setDiscounts] = useState([]);

  useEffect(() => {
    axios.get("/api/flight-discounts")
      .then(res => setDiscounts(res.data))
      .catch(err => console.error("Failed to fetch:", err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">FLIGHT DISCOUNT</h2>
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Discount For</th>
            <th className="p-2 border">Agent Class</th>
            <th className="p-2 border">Airline Code</th>
            <th className="p-2 border">Flight Type</th>
            <th className="p-2 border">Journey Type</th>
            <th className="p-2 border">Discount Type</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Cabin Class</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map((item, idx) => (
            <tr key={idx} className="border-t">
              <td className="p-2 border">{item.discountFor}</td>
              <td className="p-2 border">{item.agentClass?.join(", ")}</td>
              <td className="p-2 border">{item.airlineCode?.join(", ")}</td>
              <td className="p-2 border">{item.flightType?.join(", ")}</td>
              <td className="p-2 border">{item.journeyType?.join(", ")}</td>
              <td className="p-2 border">{item.discountType}</td>
              <td className="p-2 border">{item.amount}</td>
              <td className="p-2 border">{item.cabinClass?.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
