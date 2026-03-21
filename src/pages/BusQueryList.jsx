
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const BusQueries = () => {
//   const [queries, setQueries] = useState([]);
//   const [routes, setRoutes] = useState([]); 
//   const [form, setForm] = useState({ userQuery: "", route: "", response: "" });
//   const [editId, setEditId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     fetchQueries();
//     fetchRoutes();
//   }, []);

//   const fetchQueries = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get("/api/bus-queries");
//       setQueries(res.data);
//     } catch (err) {
//       setMessage("Error loading queries");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchRoutes = async () => {
//     try {
//       const res = await axios.get("/api/bus-routes");
//       setRoutes(res.data);
//     } catch (err) {
//       console.error("Error loading routes", err);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.userQuery) {
//       setMessage("Query is required");
//       return;
//     }

//     try {
//       if (editId) {
//         await axios.put(`/api/bus-queries/${editId}`, form);
//         setMessage("Query updated successfully");
//       } else {
//         await axios.post("/api/bus-queries", form);
//         setMessage("Query added successfully");
//       }
//       setForm({ userQuery: "", route: "", response: "" });
//       setEditId(null);
//       fetchQueries();
//     } catch (err) {
//       console.error(err.response?.data || err.message);
//       setMessage("Error saving query");
//     }
//   };

//   const handleEdit = (query) => {
//     setForm({
//       userQuery: query.userQuery,
//       route: query.route?._id || "",
//       response: query.response || ""
//     });
//     setEditId(query._id);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this query?")) return;
//     try {
//       await axios.delete(`/api/bus-queries/${id}`);
//       setMessage("Query deleted successfully");
//       fetchQueries();
//     } catch (err) {
//       setMessage("Error deleting query");
//     }
//   };

//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Bus Queries</h2>

//       {message && <div className="mb-3 text-blue-600">{message}</div>}

//       {/* Form */}
//       <form onSubmit={handleSubmit} className="mb-6 bg-gray-100 p-4 rounded-lg">
//         <textarea
//           className="border p-2 rounded w-full mb-3"
//           placeholder="User Query"
//           rows={2}
//           value={form.userQuery}
//           onChange={(e) => setForm({ ...form, userQuery: e.target.value })}
//         />

//         <select
//           className="border p-2 rounded w-full mb-3"
//           value={form.route}
//           onChange={(e) => setForm({ ...form, route: e.target.value })}
//         >
//           <option value="">Select Route (optional)</option>
//           {routes.map((r) => (
//             <option key={r._id} value={r._id}>
//               {r.name || r.routeName}
//             </option>
//           ))}
//         </select>

//         <textarea
//           className="border p-2 rounded w-full mb-3"
//           placeholder="Response (optional)"
//           rows={2}
//           value={form.response}
//           onChange={(e) => setForm({ ...form, response: e.target.value })}
//         />

//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           {editId ? "Update Query" : "Add Query"}
//         </button>
//       </form>

//       {/* Table */}
//       {loading ? (
//         <p>Loading queries...</p>
//       ) : (
//         <table className="w-full border-collapse border">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="border px-4 py-2">User Query</th>
//               <th className="border px-4 py-2">Route</th>
//               <th className="border px-4 py-2">Response</th>
//               <th className="border px-4 py-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {queries.map((q) => (
//               <tr key={q._id} className="text-center">
//                 <td className="border px-4 py-2">{q.userQuery}</td>
//                 <td className="border px-4 py-2">
//                   {q.route?.name || q.route?.routeName || "N/A"}
//                 </td>
//                 <td className="border px-4 py-2">{q.response || "—"}</td>
//                 <td className="border px-4 py-2 flex gap-2 justify-center">
//                   <button
//                     onClick={() => handleEdit(q)}
//                     className="bg-yellow-500 text-white px-3 py-1 rounded"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(q._id)}
//                     className="bg-red-600 text-white px-3 py-1 rounded"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//             {queries.length === 0 && (
//               <tr>
//                 <td colSpan="4" className="p-4 text-gray-500">
//                   No queries found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default BusQueries;
import React, { useEffect, useState } from "react";
import axios from "axios";

const BusQueries = () => {
  const [queries, setQueries] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState({ userQuery: "", route: "", response: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchQueries();
    fetchRoutes();
  }, []);

  // Fetch Bus Queries
  const fetchQueries = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:9000/api/bus-queries");
      setQueries(res.data);
    } catch (err) {
      setMessage("Error loading queries");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Bus Routes (Safe Array Handling)
  const fetchRoutes = async () => {
    try {
      const res = await axios.get("http://localhost:9000/api/bus-routes");

      console.log("ROUTE API RESPONSE:", res.data);

      const routeArray = Array.isArray(res.data)
        ? res.data
        : res.data.routes
        ? res.data.routes
        : res.data.data
        ? res.data.data
        : [];

      setRoutes(routeArray);
    } catch (err) {
      console.error("Error loading routes", err);
    }
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.userQuery) {
      setMessage("Query is required");
      return;
    }

    try {
      if (editId) {
        await axios.put(
          `http://localhost:9000/api/bus-queries/${editId}`,
          form
        );
        setMessage("Query updated successfully");
      } else {
        await axios.post("http://localhost:9000/api/bus-queries", form);
        setMessage("Query added successfully");
      }

      setForm({ userQuery: "", route: "", response: "" });
      setEditId(null);
      fetchQueries();
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage("Error saving query");
    }
  };

  // Edit
  const handleEdit = (query) => {
    setForm({
      userQuery: query.userQuery,
      route: query.route?._id || "",
      response: query.response || "",
    });
    setEditId(query._id);
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this query?")) return;

    try {
      await axios.delete(`http://localhost:9000/api/bus-queries/${id}`);
      setMessage("Query deleted successfully");
      fetchQueries();
    } catch (err) {
      setMessage("Error deleting query");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Bus Queries</h2>

      {message && <div className="mb-3 text-blue-600">{message}</div>}

      {/* Form */}
      <form className="mb-6 bg-gray-100 p-4 rounded-lg" onSubmit={handleSubmit}>
        {/* User Query */}
        <textarea
          className="border p-2 rounded w-full mb-3"
          placeholder="User Query"
          rows={2}
          value={form.userQuery}
          onChange={(e) => setForm({ ...form, userQuery: e.target.value })}
        />

        {/* Route Dropdown */}
        <select
          className="border p-2 rounded w-full mb-3"
          value={form.route}
          onChange={(e) => setForm({ ...form, route: e.target.value })}
        >
          <option value="">Select Route (optional)</option>

          {routes.map((r) => (
            <option key={r._id} value={r._id}>
              {r.name || r.routeName}
            </option>
          ))}
        </select>

        {/* Response */}
        <textarea
          className="border p-2 rounded w-full mb-3"
          placeholder="Response (optional)"
          rows={2}
          value={form.response}
          onChange={(e) => setForm({ ...form, response: e.target.value })}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editId ? "Update Query" : "Add Query"}
        </button>
      </form>

      {/* Table */}
      {loading ? (
        <p>Loading queries...</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">User Query</th>
              <th className="border px-4 py-2">Route</th>
              <th className="border px-4 py-2">Response</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {queries.map((q) => (
              <tr key={q._id} className="text-center">
                <td className="border px-4 py-2">{q.userQuery}</td>
                <td className="border px-4 py-2">
                  {q.route?.name || q.route?.routeName || "N/A"}
                </td>
                <td className="border px-4 py-2">{q.response || "—"}</td>

                <td className="border px-4 py-2 flex gap-2 justify-center">
                  <button
                    onClick={() => handleEdit(q)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(q._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {queries.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-gray-500">
                  No queries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BusQueries;
