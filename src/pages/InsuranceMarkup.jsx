import React, { useState } from "react";

function InsuranceMarkup() {
  const [provider, setProvider] = useState("");
  const [markup, setMarkup] = useState("");
  const [markupList, setMarkupList] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!provider || !markup) return;

    const newEntry = { provider, markup: `${markup}%` };
    setMarkupList([...markupList, newEntry]);

    setProvider("");
    setMarkup("");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Insurance Markup</h2>

      {/* Markup Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow rounded-lg mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Provider Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Provider Name</label>
            <input
              type="text"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              placeholder="Enter provider name"
              className="w-full border p-2 rounded-md"
            />
          </div>

          {/* Markup Percentage */}
          <div>
            <label className="block text-sm font-medium mb-1">Markup %</label>
            <input
              type="number"
              value={markup}
              onChange={(e) => setMarkup(e.target.value)}
              placeholder="Enter markup %"
              className="w-full border p-2 rounded-md"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Save Markup
        </button>
      </form>

      {/* Markup Table */}
      <div className="bg-white p-6 shadow rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Markup List</h3>
        {markupList.length === 0 ? (
          <p className="text-gray-500">No markups added yet.</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Provider</th>
                <th className="border px-4 py-2 text-left">Markup</th>
              </tr>
            </thead>
            <tbody>
              {markupList.map((entry, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{entry.provider}</td>
                  <td className="border px-4 py-2">{entry.markup}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default InsuranceMarkup;
