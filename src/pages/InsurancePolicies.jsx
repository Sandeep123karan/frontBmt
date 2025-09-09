import React, { useState } from "react";

function InsurancePolicies() {
  const [policies, setPolicies] = useState([
    { id: 1, name: "Travel Insurance", provider: "PolicyBazaar", premium: "₹1500", status: "Active" },
    { id: 2, name: "Health Insurance", provider: "ICICI Lombard", premium: "₹3000", status: "Expired" },
  ]);

  const [newPolicy, setNewPolicy] = useState({
    name: "",
    provider: "",
    premium: "",
    status: "Active",
  });

  const handleChange = (e) => {
    setNewPolicy({ ...newPolicy, [e.target.name]: e.target.value });
  };

  const addPolicy = () => {
    if (!newPolicy.name || !newPolicy.provider || !newPolicy.premium) return;
    setPolicies([...policies, { id: policies.length + 1, ...newPolicy }]);
    setNewPolicy({ name: "", provider: "", premium: "", status: "Active" });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Insurance Policies</h2>

      {/* Add Policy Form */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-3">Add New Policy</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Policy Name"
            value={newPolicy.name}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="provider"
            placeholder="Provider"
            value={newPolicy.provider}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="premium"
            placeholder="Premium (₹)"
            value={newPolicy.premium}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <select
            name="status"
            value={newPolicy.status}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
        <button
          onClick={addPolicy}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Policy
        </button>
      </div>

      {/* Policies Table */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3">Policy List</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Policy Name</th>
              <th className="border p-2">Provider</th>
              <th className="border p-2">Premium</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((policy) => (
              <tr key={policy.id} className="text-center">
                <td className="border p-2">{policy.id}</td>
                <td className="border p-2">{policy.name}</td>
                <td className="border p-2">{policy.provider}</td>
                <td className="border p-2">{policy.premium}</td>
                <td className="border p-2">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      policy.status === "Active"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {policy.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InsurancePolicies;
