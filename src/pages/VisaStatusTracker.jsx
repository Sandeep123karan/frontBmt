// import React, { useState } from "react";

// function VisaStatusTracker() {
//   const [search, setSearch] = useState("");

//   // Dummy visa status data (you can later connect this with backend API)
//   const [visaStatus, setVisaStatus] = useState([
//     { id: 1, applicant: "Rahul Sharma", passport: "N1234567", appliedOn: "2025-08-01", status: "Approved" },
//     { id: 2, applicant: "Anjali Verma", passport: "M8765432", appliedOn: "2025-07-28", status: "Pending" },
//     { id: 3, applicant: "Amit Patel", passport: "L3344556", appliedOn: "2025-07-20", status: "Rejected" },
//     { id: 4, applicant: "Sneha Gupta", passport: "K9988776", appliedOn: "2025-07-15", status: "Approved" },
//   ]);

//   const filteredData = visaStatus.filter(
//     (item) =>
//       item.applicant.toLowerCase().includes(search.toLowerCase()) ||
//       item.passport.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Visa Status Tracker</h2>

//       {/* Search */}
//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Search by applicant or passport no..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="border px-3 py-2 rounded w-80"
//         />
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="table-auto w-full border">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-4 py-2 border">ID</th>
//               <th className="px-4 py-2 border">Applicant Name</th>
//               <th className="px-4 py-2 border">Passport No.</th>
//               <th className="px-4 py-2 border">Applied On</th>
//               <th className="px-4 py-2 border">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.length > 0 ? (
//               filteredData.map((item) => (
//                 <tr key={item.id} className="text-center">
//                   <td className="border px-4 py-2">{item.id}</td>
//                   <td className="border px-4 py-2">{item.applicant}</td>
//                   <td className="border px-4 py-2">{item.passport}</td>
//                   <td className="border px-4 py-2">{item.appliedOn}</td>
//                   <td className="border px-4 py-2">
//                     <span
//                       className={`px-2 py-1 rounded text-white ${
//                         item.status === "Approved"
//                           ? "bg-green-500"
//                           : item.status === "Pending"
//                           ? "bg-yellow-500"
//                           : "bg-red-500"
//                       }`}
//                     >
//                       {item.status}
//                     </span>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td className="border px-4 py-2 text-center" colSpan={5}>
//                   No records found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination buttons (dummy for now) */}
//       <div className="flex justify-end mt-4 space-x-2">
//         <button className="px-4 py-2 border rounded">Prev</button>
//         <button className="px-4 py-2 border rounded">Next</button>
//       </div>
//     </div>
//   );
// }

// export default VisaStatusTracker;

import React, { useState, useEffect } from "react";

function VisaStatusTracker() {
  const [search, setSearch] = useState("");
  const [visaStatus, setVisaStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from backend
  const fetchStatus = async () => {
    try {
      const res = await fetch("http://localhost:9000/api/visaApplications");
      const data = await res.json();
      setVisaStatus(data);
    } catch (error) {
      console.error("Error loading visa status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const filteredData = visaStatus.filter(
    (item) =>
      item.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      item.passportNumber?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Visa Status Tracker</h2>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by applicant or passport no..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-80"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Applicant Name</th>
              <th className="px-4 py-2 border">Passport No.</th>
              <th className="px-4 py-2 border">Applied On</th>
              <th className="px-4 py-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={item._id} className="text-center">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{item.fullName}</td>
                  <td className="border px-4 py-2">{item.passportNumber}</td>
                  <td className="border px-4 py-2">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        item.status === "Approved"
                          ? "bg-green-500"
                          : item.status === "Pending"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border px-4 py-2 text-center" colSpan={5}>
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination buttons (still optional) */}
      <div className="flex justify-end mt-4 space-x-2">
        <button className="px-4 py-2 border rounded">Prev</button>
        <button className="px-4 py-2 border rounded">Next</button>
      </div>
    </div>
  );
}

export default VisaStatusTracker;
