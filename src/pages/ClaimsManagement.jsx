import React from "react";

function ClaimsManagement() {
  const claims = [
    { id: 1, policyHolder: "Amit Sharma", claimType: "Health", amount: "₹50,000", status: "Pending" },
    { id: 2, policyHolder: "Priya Verma", claimType: "Vehicle", amount: "₹1,20,000", status: "Approved" },
    { id: 3, policyHolder: "Rohit Singh", claimType: "Travel", amount: "₹30,000", status: "Rejected" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Claims Management</h2>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">#</th>
              <th className="p-3">Policy Holder</th>
              <th className="p-3">Claim Type</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim) => (
              <tr key={claim.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{claim.id}</td>
                <td className="p-3">{claim.policyHolder}</td>
                <td className="p-3">{claim.claimType}</td>
                <td className="p-3 font-medium">{claim.amount}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      claim.status
                    )}`}
                  >
                    {claim.status}
                  </span>
                </td>
                <td className="p-3 flex gap-2">
                  <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                    View
                  </button>
                  <button className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600">
                    Approve
                  </button>
                  <button className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClaimsManagement;
