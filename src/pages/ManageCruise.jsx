// // import React, { useState } from "react";

// // function ManageCruise() {
// //   const [cruises, setCruises] = useState([
// //     { id: 1, cruiseName: "Luxury Sea", destination: "Dubai", price: "50000" },
// //     { id: 2, cruiseName: "Ocean Queen", destination: "Maldives", price: "90000" },
// //   ]);

// //   const handleDelete = (id) => {
// //     setCruises(cruises.filter((c) => c.id !== id));
// //   };

// //   return (
// //     <div className="p-6 bg-white shadow rounded">
// //       <h2 className="text-xl font-bold mb-4">Manage Cruises</h2>
// //       <table className="w-full border">
// //         <thead>
// //           <tr className="bg-gray-200">
// //             <th className="p-2 border">Cruise Name</th>
// //             <th className="p-2 border">Destination</th>
// //             <th className="p-2 border">Price</th>
// //             <th className="p-2 border">Actions</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {cruises.map((cruise) => (
// //             <tr key={cruise.id} className="text-center">
// //               <td className="p-2 border">{cruise.cruiseName}</td>
// //               <td className="p-2 border">{cruise.destination}</td>
// //               <td className="p-2 border">₹{cruise.price}</td>
// //               <td className="p-2 border">
// //                 <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">
// //                   Edit
// //                 </button>
// //                 <button
// //                   onClick={() => handleDelete(cruise.id)}
// //                   className="bg-red-600 text-white px-2 py-1 rounded"
// //                 >
// //                   Delete
// //                 </button>
// //               </td>
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // }

// // export default ManageCruise;

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// function ManageCruise() {
//   const [cruises, setCruises] = useState([]);

//   const API = "https://bmtadmin.onrender.com/api/cruises";

//   // Fetch all cruises
//   const fetchCruises = async () => {
//     try {
//       const res = await axios.get(API);
//       console.log("Fetched Cruises:", res.data);
//       setCruises(res.data);
//     } catch (err) {
//       console.error("Fetch Error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchCruises();
//   }, []);

//   // Delete cruise
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure to delete?")) return;
//     await axios.delete(`${API}/${id}`);
//     fetchCruises();
//   };

//   return (
//     <div className="p-6 bg-white shadow rounded">
//       <h2 className="text-xl font-bold mb-4">Manage Cruises</h2>

//       <table className="w-full border">
//         <thead>
//           <tr className="bg-gray-200 text-center">
//             <th className="p-2 border">Image</th>
//             <th className="p-2 border">Cruise Name</th>
//             <th className="p-2 border">Destination</th>
//             <th className="p-2 border">Price</th>
//             <th className="p-2 border">Departure</th>
//             <th className="p-2 border">Return</th>
//             <th className="p-2 border">Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {cruises.map((cruise) => (
//             <tr key={cruise._id} className="text-center">
              
//               <td className="p-2 border">
//                 <img
//                   src={cruise.image}
//                   alt="Cruise"
//                   className="w-5 h-5 object-cover rounded"
//                 />
//               </td>

//               <td className="p-2 border">{cruise.cruiseName}</td>
//               <td className="p-2 border">{cruise.destination}</td>
//               <td className="p-2 border">₹{cruise.price}</td>
//               <td className="p-2 border">
//                 {cruise.departureDate?.split("T")[0]}
//               </td>
//               <td className="p-2 border">
//                 {cruise.returnDate?.split("T")[0]}
//               </td>

//               <td className="p-2 border">
//                 <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">
//                   Edit
//                 </button>

//                 <button
//                   onClick={() => handleDelete(cruise._id)}
//                   className="bg-red-600 text-white px-2 py-1 rounded"
//                 >
//                   Delete
//                 </button>
//               </td>

//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default ManageCruise;
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ManageCruise.css"; // ← SCOPED CSS

function ManageCruise() {
  const [cruises, setCruises] = useState([]);

  const API = "https://bmtadmin.onrender.com/api/cruises";

  const fetchCruises = async () => {
    try {
      const res = await axios.get(API);
      setCruises(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchCruises();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete?")) return;
    await axios.delete(`${API}/${id}`);
    fetchCruises();
  };

  return (
    <div className="cruise-container">
      <h2 className="cruise-title">Manage Cruises</h2>

      <table className="cruise-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Cruise Name</th>
            <th>Destination</th>
            <th>Price</th>
            <th>Departure</th>
            <th>Return</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {cruises.map((cruise) => (
            <tr key={cruise._id}>
              <td>
                <img src={cruise.image} alt="Cruise" className="cruise-img" />
              </td>
              <td>{cruise.cruiseName}</td>
              <td>{cruise.destination}</td>
              <td>₹{cruise.price}</td>
              <td>{cruise.departureDate?.split("T")[0]}</td>
              <td>{cruise.returnDate?.split("T")[0]}</td>

              <td>
                <button className="cruise-btn-edit">Edit</button>
                <button
                  onClick={() => handleDelete(cruise._id)}
                  className="cruise-btn-delete"
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
