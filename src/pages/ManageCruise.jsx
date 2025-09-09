import React, { useState } from "react";

function ManageCruise() {
  const [cruises, setCruises] = useState([
    { id: 1, cruiseName: "Luxury Sea", destination: "Dubai", price: "50000" },
    { id: 2, cruiseName: "Ocean Queen", destination: "Maldives", price: "70000" },
  ]);

  const handleDelete = (id) => {
    setCruises(cruises.filter((c) => c.id !== id));
  };

  return (
    <div className="p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Manage Cruises</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Cruise Name</th>
            <th className="p-2 border">Destination</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cruises.map((cruise) => (
            <tr key={cruise.id} className="text-center">
              <td className="p-2 border">{cruise.cruiseName}</td>
              <td className="p-2 border">{cruise.destination}</td>
              <td className="p-2 border">₹{cruise.price}</td>
              <td className="p-2 border">
                <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cruise.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageCruise;
