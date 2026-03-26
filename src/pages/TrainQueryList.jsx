import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "https://bmtadmin.onrender.com/api/train-routes"; 

export default function TrainRouteList() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [total, setTotal] = useState(0);
  const [viewing, setViewing] = useState(null); 

  // Fetch routes
  const fetchList = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${BASE_URL}?page=${page}&limit=${pageSize}&q=${encodeURIComponent(q)}`
      );

      if (response.data.items) {
        setRoutes(response.data.items);
        setTotal(response.data.total);
      } else {
        setRoutes(response.data);
        setTotal(response.data.length);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load routes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [page, q]); 

  // Delete route
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this route?")) return;

    try {
      await axios.delete(`${BASE_URL}/${id}`);

      const newTotal = total - 1;
      const lastPage = Math.max(1, Math.ceil(newTotal / pageSize));

      if (page > lastPage) setPage(lastPage);
      else fetchList();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Saved Train Routes</h2>

        <div className="flex gap-2">
          <input
            className="border px-3 py-2 rounded"
            placeholder="Search train no, name..."
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
          />
          <button
            onClick={fetchList}
            className="px-4 py-2 bg-gray-100 rounded"
          >
            Search
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow overflow-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Train No</th>
              <th className="px-4 py-2 text-left">Train Name</th>
              <th className="px-4 py-2 text-left">Source → Destination</th>
              <th className="px-4 py-2 text-left">Duration</th>
              <th className="px-4 py-2 text-left">Saved</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && routes.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                   🚆 Coming Soon…
                </td>
              </tr>
            )}

            {!loading &&
              routes.map((r) => (
                <tr key={r._id} className="border-t">
                  <td className="px-4 py-2">{r.trainNo}</td>
                  <td className="px-4 py-2">{r.trainName}</td>
                  <td className="px-4 py-2">
                    {r?.source?.name} ({r?.source?.code}) →{" "}
                    {r?.destination?.name} ({r?.destination?.code})
                  </td>
                  <td className="px-4 py-2">{r.duration}</td>
                  <td className="px-4 py-2">
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => setViewing(r)}
                      className="px-3 py-1 border rounded mr-2"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="px-3 py-1 border rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-3 border-t flex items-center justify-between">
          <span>
            Page {page} of {Math.max(1, Math.ceil(total / pageSize))}
          </span>

          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <button
              disabled={page >= Math.ceil(total / pageSize)}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {viewing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-6">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl overflow-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-bold">
                {viewing.trainName} ({viewing.trainNo})
              </h3>
              <button
                onClick={() => setViewing(null)}
                className="px-3 py-1 border rounded"
              >
                Close
              </button>
            </div>

            {/* Full Route Table */}
            <div className="p-4">
              <table className="w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2">#</th>
                    <th className="px-3 py-2">Station</th>
                    <th className="px-3 py-2">Code</th>
                    <th className="px-3 py-2">Arrival</th>
                    <th className="px-3 py-2">Departure</th>
                    <th className="px-3 py-2">Day</th>
                    <th className="px-3 py-2">Distance</th>
                  </tr>
                </thead>
                <tbody>
                  {viewing.route.map((st, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-3 py-2">{idx + 1}</td>
                      <td className="px-3 py-2">{st.stationName}</td>
                      <td className="px-3 py-2">{st.stationCode}</td>
                      <td className="px-3 py-2">{st.arrival}</td>
                      <td className="px-3 py-2">{st.departure}</td>
                      <td className="px-3 py-2">{st.day}</td>
                      <td className="px-3 py-2">{st.distance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 text-right border-t">
              <button
                onClick={() => setViewing(null)}
                className="px-4 py-2 bg-gray-100 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
