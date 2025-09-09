import React, { useState } from "react";

function VisaMarkup() {
  const [markupType, setMarkupType] = useState("percentage");
  const [markupValue, setMarkupValue] = useState("");
  const [markupList, setMarkupList] = useState([]);

  const handleAddMarkup = () => {
    if (!markupValue) return;
    const newMarkup = {
      id: Date.now(),
      type: markupType,
      value: markupValue,
    };
    setMarkupList([...markupList, newMarkup]);
    setMarkupValue("");
  };

  const handleDelete = (id) => {
    setMarkupList(markupList.filter((item) => item.id !== id));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-6">Visa Markup Settings</h2>

      {/* Add Markup Form */}
      <div className="bg-white p-5 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Add New Markup</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Markup Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Markup Type</label>
            <select
              value={markupType}
              onChange={(e) => setMarkupType(e.target.value)}
              className="w-full border px-3 py-2 rounded-md focus:outline-none"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
            </select>
          </div>

          {/* Markup Value */}
          <div>
            <label className="block text-sm font-medium mb-2">Value</label>
            <input
              type="number"
              placeholder="Enter value"
              value={markupValue}
              onChange={(e) => setMarkupValue(e.target.value)}
              className="w-full border px-3 py-2 rounded-md focus:outline-none"
            />
          </div>

          {/* Add Button */}
          <div className="flex items-end">
            <button
              onClick={handleAddMarkup}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Add Markup
            </button>
          </div>
        </div>
      </div>

      {/* Markup List Table */}
      <div className="bg-white p-5 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Markup List</h3>
        {markupList.length === 0 ? (
          <p className="text-gray-500">No markups added yet.</p>
        ) : (
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">#</th>
                <th className="border px-4 py-2 text-left">Type</th>
                <th className="border px-4 py-2 text-left">Value</th>
                <th className="border px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {markupList.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2 capitalize">{item.type}</td>
                  <td className="border px-4 py-2">
                    {item.type === "percentage"
                      ? `${item.value}%`
                      : `₹${item.value}`}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default VisaMarkup;
