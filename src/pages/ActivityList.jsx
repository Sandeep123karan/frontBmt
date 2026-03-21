// import React, { useState } from "react";
// import { Edit, Trash2, PlusCircle } from "lucide-react";

// function ActivityList() {
//   // Dummy data for now
//   const [activities, setActivities] = useState([
//     { id: 1, name: "Scuba Diving", location: "Goa, India", price: 2500, status: "Active" },
//     { id: 2, name: "Desert Safari", location: "Dubai, UAE", price: 4000, status: "Inactive" },
//     { id: 3, name: "Trekking", location: "Himalayas", price: 1500, status: "Active" },
//   ]);

//   const handleDelete = (id) => {
//     setActivities(activities.filter((activity) => activity.id !== id));
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold">Activities List</h2>
//         <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700">
//           <PlusCircle className="w-5 h-5 mr-2" />
//           Add New Activity
//         </button>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto bg-white shadow-md rounded-lg">
//         <table className="w-full text-sm text-left border-collapse">
//           <thead className="bg-gray-200 text-gray-700">
//             <tr>
//               <th className="px-4 py-3">#</th>
//               <th className="px-4 py-3">Activity Name</th>
//               <th className="px-4 py-3">Location</th>
//               <th className="px-4 py-3">Price (₹)</th>
//               <th className="px-4 py-3">Status</th>
//               <th className="px-4 py-3 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {activities.map((activity, index) => (
//               <tr key={activity.id} className="border-b hover:bg-gray-50">
//                 <td className="px-4 py-3">{index + 1}</td>
//                 <td className="px-4 py-3 font-medium">{activity.name}</td>
//                 <td className="px-4 py-3">{activity.location}</td>
//                 <td className="px-4 py-3">₹{activity.price}</td>
//                 <td className="px-4 py-3">
//                   <span
//                     className={`px-2 py-1 rounded-full text-xs ${
//                       activity.status === "Active"
//                         ? "bg-green-100 text-green-700"
//                         : "bg-red-100 text-red-700"
//                     }`}
//                   >
//                     {activity.status}
//                   </span>
//                 </td>
//                 <td className="px-4 py-3 flex justify-center space-x-3">
//                   <button className="text-blue-600 hover:text-blue-800">
//                     <Edit className="w-5 h-5" />
//                   </button>
//                   <button
//                     className="text-red-600 hover:text-red-800"
//                     onClick={() => handleDelete(activity.id)}
//                   >
//                     <Trash2 className="w-5 h-5" />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//             {activities.length === 0 && (
//               <tr>
//                 <td
//                   colSpan="6"
//                   className="px-4 py-6 text-center text-gray-500"
//                 >
//                   No activities found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default ActivityList;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit, Trash2, PlusCircle } from "lucide-react";

function ActivityList() {
  const [activities, setActivities] = useState([]);

  const API = "http://localhost:9000/api/activities";

  // Fetch Activities from backend
  const fetchActivities = async () => {
    try {
      const res = await axios.get(API);
      setActivities(res.data);
    } catch (err) {
      console.error("Error fetching activities:", err);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Delete activity
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this activity?")) return;

    try {
      await axios.delete(`${API}/${id}`);
      fetchActivities(); // refresh list
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Activities List</h2>

        {/* <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700">
          <PlusCircle className="w-5 h-5 mr-2" />
          Add New Activity
        </button> */}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-200 text-black">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Activity Name</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Price (₹)</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {activities.length > 0 ? (
              activities.map((act, index) => (
                <tr key={act._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">{act.name}</td>
                  <td className="px-4 py-3">{act.location}</td>
                  <td className="px-4 py-3">₹{act.price}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        act.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {act.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 flex justify-center space-x-3">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit className="w-5 h-5" />
                    </button>

                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(act._id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                  No activities found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default ActivityList;
