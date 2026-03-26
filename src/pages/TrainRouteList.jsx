import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "https://bmtadmin.onrender.com/api/train-routes";

export default function TrainRouteList() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [total, setTotal] = useState(0);
  const [viewing, setViewing] = useState(null);

  // Fetching function (NO eslint dependency issue)
  const fetchList = async (search = q, currentPage = page) => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${BASE_URL}?page=${currentPage}&limit=${pageSize}&q=${encodeURIComponent(search)}`
      );

      if (response.data.items) {
        setRoutes(response.data.items);
        setTotal(response.data.total);
      } else {
        setRoutes(response.data);
        setTotal(response.data.length);
      }
    } catch (err) {
      console.error("Error loading:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchList();
  }, []); // no eslint-hook dependency needed

  // Search trigger
  const handleSearch = () => {
    setPage(1);
    fetchList(q, 1);
  };

  // Pagination
  const goPage = (newPage) => {
    setPage(newPage);
    fetchList(q, newPage);
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this route?")) return;

    await axios.delete(`${BASE_URL}/${id}`);

    const newTotal = total - 1;
    const lastPage = Math.max(1, Math.ceil(newTotal / pageSize));

    if (page > lastPage) {
      setPage(lastPage);
      fetchList(q, lastPage);
    } else {
      fetchList(q, page);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Saved Train Routes</h2>

        <div className="flex gap-2">
          <input
            className="border px-3 py-2 rounded"
            placeholder="Search train no, name..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button
            onClick={handleSearch}
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
            {/* Loader */}
            {loading && (
              <tr>
                <td colSpan="6" className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {/* COMING SOON */}
            {!loading && routes.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="p-6 text-center text-gray-600 text-2xl font-semibold"
                >
                  🚆 Coming Soon…  
                  <br />
                  Train route data will appear here!
                </td>
              </tr>
            )}

            {/* Data list */}
            {!loading &&
              routes.map((r) => (
                <tr key={r._id} className="border-t">
                  <td className="px-4 py-2">{r.trainNo}</td>
                  <td className="px-4 py-2">{r.trainName}</td>
                  <td className="px-4 py-2">
                    {r.source?.name} ({r.source?.code}) →{" "}
                    {r.destination?.name} ({r.destination?.code})
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
              onClick={() => goPage(page - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <button
              disabled={page >= Math.ceil(total / pageSize)}
              onClick={() => goPage(page + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
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
                  {viewing.route.map((st, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-3 py-2">{i + 1}</td>
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
